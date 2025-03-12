export default {
  props: ['name', 'price', 'description', 'id', 'duration'],
  template: `
  <div class="container d-flex justify-content-center align-items-center min-vh-100">
    <div class="card p-4 shadow-lg w-100" style="max-width: 500px;">
      <h2 class="text-center mb-4 text-success fw-bold">Update Service</h2>

      <div class="mb-3">
        <input type="text" class="form-control" placeholder="Service Name" v-model="service_name" />
      </div>
      <div class="mb-3">
        <input type="number" class="form-control" placeholder="Price" v-model="service_price" />
      </div>
      <div class="mb-3">
        <input type="number" class="form-control" placeholder="Duration (in mins)" v-model="service_duration" />
      </div>
      <div class="mb-4">
        <textarea class="form-control" placeholder="Description of the service" rows="3" v-model="service_description"></textarea>
      </div>

      <button class="btn btn-success w-100 shadow-sm" @click="updateService">Update Service</button>
    </div>
  </div>
`,
  data() {
      return {
        service_name: '',
        service_price: 0,
        service_duration: 0,
        service_description: '',
      };
    },
    async mounted() {
      const serviceId = this.$route.params.id; // Get ID from the URL
      if (serviceId) {
          const res = await fetch(`${location.origin}/api/services/${serviceId}`, {
              headers: { 'Authentication-Token': this.$store.state.auth_token }
          });
          if (res.ok) {
              const service = await res.json();
              this.service_name = service.name;
              this.service_price = service.price;
              this.service_duration = service.duration;
              this.service_description = service.description;
          } else {
              console.error("Failed to fetch service details.");
          }
      }
  },
    methods: {
      async updateService() {
        const res= await fetch (`${location.origin}/api/services/${this.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json",
              "Authentication-Token": this.$store.state.auth_token
           },
          body: JSON.stringify({ name: this.service_name, price: this.service_price, duration: this.service_duration, description: this.service_description}),
        });
        if (res.ok) {
          console.log("Update success");
          const data = await res.json();
          console.log(data);
          this.$router.push('/admin');  // Redirect after successful creation
      } else {
          console.error("Update failed");
      }
      },
  },

}