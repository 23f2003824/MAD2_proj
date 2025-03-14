
export default {
    template: `
<div>
    <div class="p-3">
        <input type="text" class="form-control" v-model="searchQuery" 
            :placeholder="$store.state.role === 'admin' 
                ? 'Search Users & Professionals...' 
                : ($store.state.role === 'user' 
                    ? 'Search Service Professionals...' 
                    : 'Search Service Requests')">
    </div>

    <div class="p-4" v-if="$store.state.loggedIn && $store.state.role === 'admin'">
        <h3 class="text-primary mb-3">Users</h3>
        <div v-if="filteredUsers.length > 0" class="d-flex flex-column gap-3">
            <div v-for="user in filteredUsers" :key="user.id" class="card shadow-sm border-0 p-3"
            :style="{
                backgroundColor: user.active ? '' : '#f8d7da',
                color: user.active ? '' : '#721c24',
                cursor: user.active ? 'pointer' : 'not-allowed',
                border: user.active ? '' : '1px solid #f5c6cb'
            }">
                <div class="card-body d-flex align-items-center justify-content-between" >
                    <div>
                        <h5 class="text-dark mb-1">{{ user.username }}</h5>
                        <p class="text-muted m-0"><strong>Email:</strong> {{ user.email }}</p>
                    </div>
                </div>
            </div>
        </div>
        <p v-else class="text-center text-muted">No Users</p>
    </div>


    <div class="p-4" v-if="$store.state.loggedIn && ($store.state.role === 'admin' || $store.state.role === 'user')">
        <h3>Service Professionals:</h3>
        <div v-if="filteredProfessionals.length > 0" class="accordion" id="accordionExample">
            <div v-for="professional in filteredProfessionals" :key="professional.id" class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        :data-bs-target="'#collapse' + professional.id"
                        :aria-controls="'collapse' + professional.id"
                        :disabled="!professional.active"
                        :style="{
                            backgroundColor: professional.active ? '' : '#f8d7da',
                            color: professional.active ? '' : '#721c24',
                            cursor: professional.active ? 'pointer' : 'not-allowed',
                            border: professional.active ? '' : '1px solid #f5c6cb'
                        }">
                        Professional: {{ professional.username }} 
                        <span v-if="!professional.active">(Blocked)</span> 
                    </button>
                </h2>
                <div :id="'collapse' + professional.id" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                    <div class="accordion-body">
                        <h2 class="display-6">Name: {{ professional.name }}</h2>
                        <p>Email: {{ professional.email }}</p>
                        <hr>
                        <p>Description: {{ professional.description }}</p>
                        <p>Experience: {{ professional.experience }} Years</p>
                        <p>Service Offered: {{ professional.service_type }}</p>
                    </div>
                </div>
            </div>
        </div>
        <p v-else class="text-center text-muted">No Service Professionals available</p>
    </div>

    <div v-if="$store.state.role === 'service_professional'">
        <h3 class="mt-4">Service Requests:</h3>
        <div v-if="filteredServiceReq.length > 0">
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>Customer</th>
                        <th>Address</th>
                        <th>Date of Request</th>
                        <th>Remarks</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="request in filteredServiceReq" :key="request.id">
                        <td>{{ request.user_name }}</td>
                        <td>{{ request.address }}</td>
                        <td>{{ request.date_of_request }}</td>
                        <td>{{ request.remarks }}</td>
                        <td>
                            <span :class="{
                                'text-warning': request.service_status === 'pending',
                                'text-info': request.service_status === 'accepted',
                                'text-success': request.service_status === 'completed',
                                'text-danger': request.service_status === 'rejected' || request.service_status === 'closed'
                            }">
                                {{ request.service_status }}
                            </span>
                        </td>               
                    </tr>
                </tbody>
            </table>
        </div>
        <p v-else class="text-muted text-center">No service requests</p>
    </div>
</div>

`,


    data(){
        return{
            users:[],
            professionals:[],
            serviceRequests:[],
            searchQuery:""    
        }
    },
    async mounted() {
        try {
          const [resServices,resUsers, resProfessionals, resRequests] = await Promise.all([
            fetch(location.origin + "/api/services", {
              headers: { "Authentication-Token": this.$store.state.auth_token },
            }),
            fetch(location.origin + "/api/users", {
                headers: { "Authentication-Token": this.$store.state.auth_token },
            }),
            fetch(location.origin + "/api/professionals", {
              headers: { "Authentication-Token": this.$store.state.auth_token },
            }),
            fetch(location.origin + "/api/service_requests", {
              headers: { "Authentication-Token": this.$store.state.auth_token },
            }),
          ]);
          this.users= await resUsers.json()
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
      
      },
        computed: {
            filteredUsers() {
                const query = this.searchQuery.trim().toLowerCase(); // Trim search query
                return this.users.filter(user =>
                    (
                        user.username.trim().toLowerCase().includes(query) ||
                        user.email.trim().toLowerCase().includes(query)
                    )
                );
            },
            filteredProfessionals() {
                const query = this.searchQuery.trim().toLowerCase();

                return this.professionals.filter(professional =>
                    professional.accepted &&
                    (professional.username?.trim().toLowerCase().includes(query) || "") ||
                    (professional.email?.trim().toLowerCase().includes(query) || "") ||
                    (professional.name?.trim().toLowerCase().includes(query) || "") ||
                    (professional.service_type?.trim().toLowerCase().includes(query) || "")
                );
            },
            filteredServiceReq() {
                const query = this.searchQuery.trim().toLowerCase();

                return this.serviceRequests.filter(req =>
                    (req.user_name?.trim().toLowerCase().includes(query) || "") ||
                    (req.service_status?.trim().toLowerCase().includes(query) || "") ||
                    (req.address?.trim().toLowerCase().includes(query) || "")
                    // (req.rating?.trim().toLowerCase().includes(query) || "")
                );
            }
        },
        methods: {
            async toggleStatus(user) {
                try {
                    const response = await fetch(`${location.origin}/api/toggle-status/${user.id}`, {
                        method: "POST",
                        headers: {
                        "Content-Type": "application/json",
                        "Authentication-Token": this.$store.state.auth_token
                    },
                    body: JSON.stringify({ active: !user.active }) // Toggle status
                });
    
                const data = await response.json();
                if (response.ok) {
                    user.active = data.active; // Update frontend state dynamically
                } else {
                    console.error("Error:", data.message);
                }
            } catch (error) {
                console.error("Request failed:", error);
            }
        },
    }
    
    // components:{
    //     Services
    // }
}