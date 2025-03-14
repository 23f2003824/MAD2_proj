
export default {
  template: `
    <div class="p-4">
      <div v-if="$store.state.role === 'admin' || $store.state.role === 'user'">
        <h3>Services:</h3>
        <div v-if="services.length > 0 " class="accordion" id="accordionExample">
            <div v-for="service in services" :key="service.id" class="accordion-item">
                <h2 class="accordion-header">
                    
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" 
                        :data-bs-target="'#collapse' + service.id" 
                        aria-expanded="true" 
                        :aria-controls="'collapse' + service.id">
                        {{ service.name }}
                    </button>
                    
                </h2>
                <div :id="'collapse' + service.id" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                    <div class="accordion-body">
                      <p>Duration: {{ service.duration }}mins.</p>
                      <p>Price: {{ service.price }}</p>
                          <hr>
                          <p>Description: {{ service.description }}</p>
                          <hr>
                          <!-- If user is logged in and role is 'user', show professionals for this service -->
                          <div v-if="$store.state.role === 'user'">
                            <h5>Available Professionals:</h5>
                            <div v-if="filteredProfessionals(service.name).length > 0">
                                <ul class="list-unstyled">
                                  <li v-for="professional in filteredProfessionals(service.name)" :key="professional.id"
                                  class="d-flex align-items-center gap-3 border-bottom py-2">
                                    
                                    <!-- Name & Experience -->
                                    <div class="flex-grow-1">
                                        <strong>{{ professional.name }}</strong> - {{ professional.experience }} years experience
                                        <strong>Rating</strong> - {{ professional.rating }} 
                                    </div>
                            
                                    <!-- Book Button -->
                                    <button class="btn btn-sm btn-success" @click="openBookingModal(professional.id, service.id)">
                                    Book Service
                                    </button>
                                  </li>
                                </ul>
                            </div>
                            <p v-else class="text-muted">No professionals available for this service.</p>
                          </div>
                          <div class="d-flex gap-2 mt-3">
                              <button class="btn btn-outline-primary" v-if="$store.state.role=='admin'"  @click="$router.push('/services/' + service.id)">Edit
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" style="margin-right: 8px; margin-bottom: 3px"><title>Edit Service</title>
                                  <path d="M7,14.94L13.06,8.88L15.12,10.94L9.06,17H7V14.94M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M16.7,9.35L15.7,10.35L13.65,8.3L14.65,7.3C14.86,7.08 15.21,7.08 15.42,7.3L16.7,8.58C16.92,8.79 16.92,9.14 16.7,9.35M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2" />
                              </svg>
                              </button>
                              <button class="btn btn-outline-danger" v-if="$store.state.role=='admin'" @click="deleteService(service.id)">Delete
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" style="margin-right: 8px; margin-bottom: 3px"><title>Delete Service</title>
                                  <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M16,10V17A1,1 0 0,1 15,18H9A1,1 0 0,1 8,17V10H16M13.5,6L14.5,7H17V9H7V7H9.5L10.5,6H13.5Z" />
                              </svg>
                              </button>
                          </div>
                    </div>
                </div>
            </div>
        </div>
        <p v-else class="text-center text-muted">No services available at the moment.</p>
      </div>
      <button v-if="$store.state.role=='admin'" @click="$router.push('/services')" style="margin-top: 20px;" class="btn btn-outline-success">New service +</button>
      <button v-if="$store.state.role=='admin'" @click="getCsv" style="margin-top: 20px;" class="btn btn-outline-info">Get Service Requests Data
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" style="margin-right: 8px;">
              <title>Download</title>
              <path d="M8 17V15H16V17H8M16 10L12 14L8 10H10.5V7H13.5V10H16M5 3H19C20.11 3 21 3.9 21 5V19C21 20.11 20.11 21 19 21H5C3.9 21 3 20.11 3 19V5C3 3.9 3.9 3 5 3M5 5V19H19V5H5Z" />
          </svg>
      </button>
        <!--Today's service for professional-->
      <div v-if="$store.state.role === 'service_professional'">
        <h3 class="mt-4">Today's Service:</h3>
        <div v-if="todaysAcceptedRequests.length > 0">
          <table class="table table-striped table-bordered">
            <thead>
              <tr>
                <th>User name</th>
                <th>User Address</th>
                <th>Date of Request</th>
                <th>Status</th>
                <th>Action</th>

              </tr>
            </thead>
            <tbody>
              <tr v-for="request in todaysAcceptedRequests" :key="request.id" :style="{
                backgroundColor: request.user_active ? '' :' #f8d7da',
                color: request.user_active ? '' : '#721c24',
                cursor: request.user_active ? 'pointer' : 'not-allowed',
                }">
              <td :style="{
                backgroundColor: request.user_active ? '' :' #f8d7da',
                color: request.user_active ? '' : '#721c24',
                cursor: request.user_active ? 'pointer' : 'not-allowed',
                }">{{ request.user_name }}</td>
                <td>{{ request.address }}</td>
                <td>{{ request.date_of_request }}</td>
                <td class="text-success">{{ request.service_status }}</td>
                <td>
                  <button v-if="!request.user_active" class="btn btn-danger btn-sm" :disabled="!request.user_active">User is Blocked</button>
                  <button v-else class="btn btn-success btn-sm" @click="updateStatus(request, 'completed')">Mark Completed</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else class="text-muted text-center">No accepted services for today.</p>
      </div>
      <div v-if="$store.state.role === 'user' || $store.state.role === 'service_professional'">
        <h3 class="mt-3">
          {{ $store.state.role === 'service_professional' ? 'Closed Services' : 'Service History:' }}
        </h3>

        <!-- For regular users -->
        <div v-if="$store.state.role === 'user' && serviceRequests.length > 0">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>Service</th>
                <th>Professional</th>
                <th>Date of Request</th>
                <th>Status</th>
                <th>Date of Completion</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="request in serviceRequests" :key="request.id" :style="{
                backgroundColor: request.professional_active ? '' :' #f8d7da',
                color: request.professional_active ? '' : '#721c24',
                cursor: request.professional_active ? 'pointer' : 'not-allowed',
                border: request.professional_active ? '' : '1px solid #f5c6cb'
                }">
                <td>{{ request.service_name }}</td>
                <td :style="{
                  backgroundColor: request.professional_active ? '' :' #f8d7da',
                  color: request.professional_active ? '' : '#721c24',
                  cursor: request.professional_active ? 'pointer' : 'not-allowed',
                  border: request.professional_active ? '' : '1px solid #f5c6cb'
                  }">{{ request.professional_name }}</td>
                <td>{{ request.date_of_request }}</td>
                <td>
                  <span :class="{
                    'text-warning': request.service_status === 'pending',
                    'text-success': request.service_status === 'completed',
                    'text-info': request.service_status === 'accepted',
                    'text-danger': request.service_status === 'closed' || request.service_status === 'rejected'
                  }">
                    {{ request.service_status }}
                  </span>
                </td>
                <td>{{ request.date_of_completion || 'N/A' }}</td>
                <td>
                  <button v-if="!request.professional_active" class="btn btn-danger btn-sm" disabled
                  :style="{cursor:request.professional_active?'':'not-allowed'}">Professional is Blocked</button>
                  <button v-else
                  class="btn btn-danger btn-sm"
                  @click="handleRequest(request)"
                  :disabled="request.service_status === 'closed' || request.service_status === 'rejected' || request.service_status === 'accepted'">
                  {{
                    request.service_status === 'closed'
                      ? 'Service Request Closed'
                      : request.service_status === 'rejected'
                        ? 'Rejected'
                        : request.service_status === 'pending'
                          ? 'Delete Request'
                          : 'Close the Service Request'
                  }}
                  </button>
              
                </td>
              </tr>
            </tbody>
          </table>
        </div>

          <!-- For service professionals (Closed services only) -->
        <div v-else-if="$store.state.role === 'service_professional' && closedServices.length > 0">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Address</th>
                <th>Date of Completion</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="request in closedServices" :key="request.id">
                <td>{{ request.user_name }}</td>
                <td>{{ request.address }}</td>
                <td>{{ request.date_of_completion || 'N/A' }}</td>
                <td>{{ request.rating || 'Not rated' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p v-else class="text-muted text-center">No service history available.</p>
      </div>
      <div v-if="$store.state.role === 'service_professional'">
        <h3 class="mt-4">Service Requests:</h3>
        <div v-if="pendingServices.length > 0">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Address</th>
                <th>Date of Request</th>
                <th>Remarks</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="request in pendingServices" :key="request.id"
              :style="{
                backgroundColor: request.user_active ? '' :' #f8d7da',
                color: request.user_active ? '' : '#721c24',
                cursor: request.user_active ? 'pointer' : 'not-allowed',
                }">
                <td :style="{
                  backgroundColor: request.user_active ? '' :' #f8d7da',
                  color: request.user_active ? '' : '#721c24',
                  cursor: request.user_active ? 'pointer' : 'not-allowed',
                  }">{{ request.user_name }}</td>
                <td>{{ request.address }}</td>
                <td>{{ request.date_of_request }}</td>
                <td>{{ request.remarks }}</td>
                <td>
                  <span :class="{
                    'text-warning': request.service_status === 'pending',
                    'text-info': request.service_status === 'accepted',
                    'text-success': request.service_status === 'completed',
                    'text-danger': request.service_status === 'rejected',
                    }">
                    {{ request.service_status }}
                  </span>
                </td>                
                <td>
                <button v-if="!request.user_active" class="btn btn-danger btn-sm" :disabled="!request.user_active"
                :style="{cursor:request.user_active?'':'not-allowed'}">User is Blocked</button>
                <div v-else>
                  <button
                      class="btn btn-success btn-sm me-2"
                      @click="updateStatus(request, 'accepted')"
                      :disabled="request.service_status !== 'pending'|| request.service_status === 'rejected'">
                      {{
                        request.service_status === 'completed' 
                          ? 'Completed' 
                          : request.service_status === 'accepted' 
                            ? 'Accepted' 
                            : 'Accept'
                      }}
                    </button>

                    <button
                    class="btn btn-danger btn-sm"
                    @click="updateStatus(request, 'rejected')"
                    :disabled="request.service_status !== 'pending'">
                    {{
                      request.service_status === 'completed' 
                        ? 'Completed' 
                        : request.service_status === 'rejected' 
                          ? 'Rejected' 
                          : 'Reject'
                    }}
                    </button>
                  </div>

                </td>

              </tr>
            </tbody>
          </table>
        </div>
        <p v-else class="text-muted text-center">No service requests</p>
      </div>

    
        <!-- Booking Modal -->
        <div class="modal fade" id="bookingModal" tabindex="-1" aria-labelledby="bookingModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="bookingModalLabel">Book Service</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <form @submit.prevent="submitBooking">
                    <div class="mb-3">
                      <label class="form-label">Address</label>
                      <input type="text" class="form-control" v-model="bookingForm.address" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Date of Request</label>
                        <input type="date" class="form-control" v-model="bookingForm.date_of_request" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Remarks</label>
                        <textarea class="form-control" v-model="bookingForm.remarks"></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Confirm Booking</button>
                  </form>
                </div>
            </div>
          </div>
        </div>
        <!--Rating Modal-->
        <div class="modal fade" id="ratingModal" tabindex="-1" aria-labelledby="ratingModalLabel" aria-hidden="true">
          <div class="modal-dialog">
              <div class="modal-content">
                  <div class="modal-header">
                      <h5 class="modal-title" id="ratingModalLabel">Rate Professional</h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                      <label for="rating">Select Rating:</label>
                      <select v-model="selectedRating" class="form-control">
                          <option v-for="n in 5" :key="n" :value="n">{{ n }} Star</option>
                      </select>
                  </div>
                  <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                      <button type="button" class="btn btn-primary" @click="submitRating('closed')">Submit Rating</button>
                  </div>
              </div>
          </div>
        </div>
    
    </div>
    `,

  data() {
    return {
      services: [],
      professionals:[],
      bookingForm: {
        professional_id: null,
        service_id: null,
        address: "",
        date_of_request: "",
        remarks: ""
      },
      serviceRequests: [], 
      selectedRating: 5,
      selectedRequest:null
    };
  },
  async mounted() {
    try {
      const [resServices, resProfessionals, resRequests] = await Promise.all([
        fetch(location.origin + "/api/services", {
          headers: { "Authentication-Token": this.$store.state.auth_token },
        }),
        fetch(location.origin + "/api/professionals", {
          headers: { "Authentication-Token": this.$store.state.auth_token },
        }),
        fetch(location.origin + "/api/service_requests", {
          headers: { "Authentication-Token": this.$store.state.auth_token },
        }),
      ]);
      
      this.services = await resServices.json();
      this.professionals = (await resProfessionals.json()).filter((p) => p.accepted);
      const requestData = await resRequests.json();

      if (resRequests.ok) {
        this.serviceRequests = requestData.service_requests; 
      } else {
        console.error("Failed to fetch service history:", requestData.message);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
    this.$nextTick(() => {
      console.log("Computed Today’s Accepted Requests:", this.todaysAcceptedRequests);
    });
  
  },
  computed: {
    todaysAcceptedRequests() {
      // Get professional's ID from store
      const currentProId = this.$store.state.user_id; // Make sure this exists in store
      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
      if (!this.serviceRequests || !this.serviceRequests.length) return [];
      console.log(this.serviceRequests)
      return this.serviceRequests.filter((req) => {
        return (
          req.professional_id === currentProId &&
          req.service_status === "accepted" &&
          req.date_of_request === today
        );
      });
    },
    closedServices() {
      if (this.$store.state.role !== 'service_professional') return [];
      const proId = this.$store.state.user_id;
      return this.serviceRequests.filter(req => 
        req.professional_id === proId && req.service_status === 'closed'
      );
    },
    pendingServices(){
      if(this.$store.state.role!=='service_professional') return [];
      const proId = this.$store.state.user_id;
      return this.serviceRequests.filter(req => 
        req.professional_id === proId &&
        (req.service_status === 'pending' || req.service_status === 'accepted' || req.service_status === 'completed' || req.service_status === 'rejected'));
    }
  },
  
  methods: {
    filteredProfessionals(serviceName) {
      return this.professionals.filter(professional => professional.service_type === serviceName && professional.active);
    },
    async deleteService(serviceId) {
      if (!confirm("Are you sure you want to delete this service?")) return;

      try {
        const res = await fetch(
          `${location.origin}/api/services/${serviceId}`,
          {
            method: "DELETE",
            headers: { "Authentication-Token": this.$store.state.auth_token },
          }
        );

        if (res.ok) {
          this.services = this.services.filter(
            (service) => service.id !== serviceId
          );
          console.log("Service deleted successfully.");
        } else {
          console.error("Failed to delete service.");
        }
      } catch (error) {
        console.error("Error deleting service:", error);
      }
    },
    async updateStatus(request,newStatus) {
      try {
        const response = await fetch("/api/update_request_status", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": this.$store.state.auth_token,
          },
          body: JSON.stringify({
            request_id: request.id,
            new_status: newStatus,
          }),
        });
  
        const result = await response.json();
  
        if (response.ok) {
          // this.fetchServiceRequests();
          request.service_status = result.service_status;
          request.date_of_completion=result.date_of_completion; 
          
          
        } else {
          alert(result.message || "Failed to update status.");
        }
      } catch (error) {
        console.error("Error updating status:", error);
      }
    },
    async getCsv() {
      const res = await fetch(location.origin + "/serviceCsv", {
        headers: {
          "Authentication-Token": this.$store.state.auth_token,
        },
      });
      const task_id = (await res.json()).task_id;
      console.log(task_id);
      const interval = setInterval(async () => {
        const csv = await fetch(`${location.origin}/getCsv/${task_id}`, {
          headers: {
            "Authentication-Token": this.$store.state.auth_token,
          },
        });
        if (csv.ok) {
          console.log("CSV downloaded successfully.");
          // window.open(`${location.origin}/getCsv/${task_id}`);
          const blob = await csv.blob(); // Create a blob URL for the downloaded file
          const url = URL.createObjectURL(blob); // create a temporary link URL

          const a = document.createElement("a"); // Create a link element to trigger the download
          a.href = url; // Set the link URL to the blob URL
          a.download = `services_data_${task_id}.csv`; // Set the file name
          document.body.appendChild(a); 
          a.click(); // Trigger download
          document.body.removeChild(a);
          clearInterval(interval);
        }
      }, 10000);
    },
    openBookingModal(professionalId, serviceId) {
      this.bookingForm.professional_id = professionalId;
      this.bookingForm.service_id = serviceId;
      this.bookingForm.address = "";
      this.bookingForm.date_of_request = "";
      this.bookingForm.remarks = "";
      const modal = new bootstrap.Modal(document.getElementById('bookingModal'));
      modal.show();

    },
    async submitBooking() {
      try {
        const res = await fetch(location.origin + "/api/book_service", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": this.$store.state.auth_token
          },
          body: JSON.stringify(this.bookingForm)
        });

        const data = await res.json();
        if (res.ok) {
          alert("Service booked successfully!");
          this.serviceRequests.push({
            id: data.booking_id,
            service_name: this.services.find(s => s.id === this.bookingForm.service_id)?.name || "Unknown Service",
            professional_name: this.professionals.find(p => p.id === this.bookingForm.professional_id)?.name || "Unknown Professional",
            date_of_request: this.bookingForm.date_of_request,
            service_status: "pending", // Default status
            date_of_completion: null,
            professional_active: this.professionals.find(p => p.id === this.bookingForm.professional_id)?.active || false
          });
          const resProfessionals = await fetch(location.origin + "/api/professionals", {
            headers: { "Authentication-Token": this.$store.state.auth_token }
          });
          this.professionals = (await resProfessionals.json()).filter((p) => p.accepted);
          // await this.refreshServiceHistory();
          console.log("Updated serviceRequests:", this.serviceRequests);
          const modalEl = document.getElementById('bookingModal');
          const modal = bootstrap.Modal.getInstance(modalEl);
          if (modal) {
              modal.hide();
          }
          modalEl.setAttribute('aria-hidden', 'true');
          modalEl.style.display = 'none';
          
        } else {
          alert("Error: " + data.message);
        }
      } catch (error) {
        console.error("Error booking service:", error);
      }
    },
    async refreshServiceHistory() {
      try {
        const response = await fetch('/api/service_history', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authentication-Token': this.$store.state.token
          }
        });
        if (response.ok) {
          const data = await response.json();
          this.serviceRequests = data.service_requests;
        } else {
          console.error('Failed to fetch service history');
        }
      } catch (error) {
        console.error('Error fetching service history:', error);
      }
    },
    openRatingModal(request) {
      if (request.service_status === 'completed') {
          this.selectedRequest = request;
          this.selectedProfessionalId = request.professional_id;
          this.selectedRequestId = request.id;
          this.selectedRating = 5; // Default rating
          new bootstrap.Modal(document.getElementById('ratingModal')).show();
      } else {
          alert("You can only close completed services.");
      }
    },
    async submitRating(newStatus) {
      if (!this.selectedProfessionalId || !this.selectedRequestId) return;
  
      try {
          const response = await fetch(`/api/rate_professional/${this.selectedProfessionalId}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json',
                'Authentication-Token': this.$store.state.auth_token, 
               },
              body: JSON.stringify({ rating: this.selectedRating,
                  request_id: this.selectedRequestId
               })
          });
  
          const data = await response.json();
          if (response.ok) {
              alert("Rating submitted successfully!");
  
              // Update service status to 'closed'
              await this.updateStatus(this.selectedRequest, newStatus);  
              bootstrap.Modal.getInstance(document.getElementById('ratingModal')).hide();
          } else {
              alert(data.message);
          }
      } catch (error) {
          console.error("Error submitting rating:", error);
      }
    },
    handleRequest(request) {
      if (request.service_status === "pending") {
        this.deleteRequest(request.id);
      } else {
        this.openRatingModal(request);
      }
    },
  
    async deleteRequest(requestId) {
      if (!confirm("Are you sure you want to delete this request?")) return;
  
      try {

        const response = await fetch(`/api/service_requests/${requestId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": this.$store.state.auth_token,
          },
        });
  
        const data = await response.json();
        if (response.ok) {
          alert("Request deleted successfully!");
          this.serviceRequests = this.serviceRequests.filter((r) => r.id !== requestId);
      
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Error deleting request:", error);
      }
    }
  },
  // components:{
  //     Services
  // }
};
