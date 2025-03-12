
// <div class="jumbotron">
// <h2 @click="$router.push('/services/'+id)" class="display-4">{{name}}</h2>
// <p>{{price}}<p>
// <hr>
// <p>{{description}}</p>
// </div>


export default {
  template: `
  <div class="container d-flex justify-content-center align-items-center min-vh-100">
    <div class="card p-4 shadow-lg w-100" style="max-width: 500px;">
      <h2 class="text-center mb-4 text-primary fw-bold">Create a New Service</h2>
      
      <div class="mb-3">
        <input type="text" class="form-control" placeholder="Service Name" v-model="service_name" />
      </div>
      <div class="mb-3">
        <input type="number" class="form-control" placeholder="Price" v-model="price" />
      </div>
      <div class="mb-3">
        <input type="number" class="form-control" placeholder="Duration (in mins)" v-model="duration" />
      </div>
      <div class="mb-4">
        <textarea class="form-control" placeholder="Description of the service" rows="3" v-model="description"></textarea>
      </div>
      
      <button class="btn btn-primary w-100 shadow-sm" @click="createService">Create Service</button>
    </div>
  </div>
`,
  data() {
      return {
        service_name: null,
        price: null,
        duration: null,
        description: null,
      };
    },
    methods: {
      async createService() {
        const res = await fetch((location.origin+"/api/services"), {
          method: "POST",
          headers: { "Content-Type": "application/json",
              "Authentication-Token": this.$store.state.auth_token
           },
          body: JSON.stringify({ name: this.service_name, price: this.price, duration: this.duration, description: this.description}),
        });
        if (res.ok) {
          console.log("Creation success");
          const data = await res.json();
          console.log(data);
          this.$router.push('/admin');  // Redirect after successful creation
      } else {
          console.error("Creation failed");
      }
      },
  },

}