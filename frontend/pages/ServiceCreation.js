export default {
    props: ['name', 'price', 'description', 'id', 'duration'],
    template: `
    <div>
        <router-link to="/admin">Admin Dashboard</router-link>
        <br>
        <input placeholder="Service Name" v-model="service_name" />
        <input type="number" placeholder="Price" v-model="service_price" />
        <input type="number" placeholder="Duration(in mins)" v-model="service_duration" />
        <input type="textarea" placeholder="Description of the service" v-model="service_description" />
        <button @click="updateService">Update</button>
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
// <div class="jumbotron">
// <h2 @click="$router.push('/services/'+id)" class="display-4">{{name}}</h2>
// <p>{{price}}<p>
// <hr>
// <p>{{description}}</p>
// </div>