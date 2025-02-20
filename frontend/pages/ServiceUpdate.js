export default {
    // props: ['name', 'price', 'description', 'id'],
    template: `
    <div>
        <router-link to="/admin">Admin Dashboard</router-link>
        <br>
        <input placeholder="Service Name" v-model="service_name" />
        <input type="number" placeholder="Price" v-model="price" />
        <input type="number" placeholder="Duration(in mins)" v-model="duration" />
        <input type="textarea" placeholder="Description of the service" v-model="description" />
        <button @click="createService">Create</button>
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