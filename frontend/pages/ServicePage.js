import Services from "./ServiceCreation.js";

export default {
  template: `
        <div class="p-4">
            <h3>Services:</h3>
            <div v-if="services.length > 0" class="accordion" id="accordionExample">
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
                                <div class="d-flex gap-2 mt-3">
                                    <button class="btn btn-outline-primary"  @click="$router.push('/services/' + service.id)">Edit
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" style="margin-right: 8px; margin-bottom: 3px"><title>Edit Service</title>
                                        <path d="M7,14.94L13.06,8.88L15.12,10.94L9.06,17H7V14.94M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M16.7,9.35L15.7,10.35L13.65,8.3L14.65,7.3C14.86,7.08 15.21,7.08 15.42,7.3L16.7,8.58C16.92,8.79 16.92,9.14 16.7,9.35M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2" />
                                    </svg>
                                    </button>
                                    <button class="btn btn-outline-danger" @click="deleteService(service.id)">Delete
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
            <button @click="$router.push('/services')" style="margin-top: 20px;" class="btn btn-outline-success">New service +</button>
            <button @click="getCsv" style="margin-top: 20px;" class="btn btn-outline-info">Get Services Data
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" style="margin-right: 8px;">
                    <title>Download</title>
                    <path d="M8 17V15H16V17H8M16 10L12 14L8 10H10.5V7H13.5V10H16M5 3H19C20.11 3 21 3.9 21 5V19C21 20.11 20.11 21 19 21H5C3.9 21 3 20.11 3 19V5C3 3.9 3.9 3 5 3M5 5V19H19V5H5Z" />
                </svg>
            </button>
        </div>
    `,

  data() {
    return {
      services: [],
      // downloadIcon: require('@/css/images/download-box-outline.svg')
    };
  },
  async mounted() {
    const res = await fetch(location.origin + "/api/services", {
      headers: {
        "Authentication-Token": this.$store.state.auth_token,
      },
    });
    this.services = await res.json();
    console.log(this.services);
  },
  methods: {
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
    async getCsv() {
      const res = await fetch(location.origin + "/serviceCsv", {
        headers: {
          "Authentication-Token": this.$store.state.auth_token,
        },
      });
      const task_id = (await res.json()).task_id;
      const interval = setInterval(async () => {
        const csv = await fetch(`${location.origin}/getCsv/${task_id}`, {
          headers: {
            "Authentication-Token": this.$store.state.auth_token,
          },
        });
        if (csv.ok) {
          console.log("CSV downloaded successfully.");
          window.open(`${location.origin}/getCsv/${task_id}`);
          clearInterval(interval);
        }
      }, 100);
    },
  },
  // components:{
  //     Services
  // }
};
