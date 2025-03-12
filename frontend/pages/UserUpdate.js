export default {
    props: ['name', 'username', 'email', 'id'],
    template: `
    <div class="container d-flex justify-content-center align-items-center min-vh-100">
      <div class="card p-4 shadow-lg w-100" style="max-width: 500px;">
        <h2 class="text-center mb-4 text-primary fw-bold">Update User</h2>
  
        <div class="mb-3">
          <input type="text" class="form-control" placeholder="Name" v-model="localName" />
        </div>
        <div class="mb-3">
          <input type="text" class="form-control" placeholder="Username" v-model="localUsername" />
        </div>
        <div class="mb-4">
          <input type="email" class="form-control" placeholder="Email" v-model="localEmail" />
        </div>
  
        <button class="btn btn-primary w-100 shadow-sm" @click="updateUser">Update</button>
      </div>
    </div>
  `
  ,
    data() {
        return {
          localName: '',
          localEmail: '',
          localUsername: '',
        };
      },
      async mounted() {
        const user_id = this.$route.params.id; // Get ID from the URL
        if (user_id) {
            const res = await fetch(`${location.origin}/api/individualUser/${user_id}`, {
                headers: { 'Authentication-Token': this.$store.state.auth_token }
            });
            if (res.ok) {
                const user = await res.json();
                this.localName = user.name;
                this.localEmail = user.email;
                this.localUsername = user.username;
            } else {
                console.error("Failed to fetch service details.");
            }
        }
    },
      methods: {
        async updateUser() {
          const res= await fetch (`${location.origin}/api/user/${this.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json",
                "Authentication-Token": this.$store.state.auth_token
             },
            body: JSON.stringify({ name: this.localName, email: this.localEmail, username: this.localUsername}),
          });
          if (res.ok) {
            console.log("Update success");
            const data = await res.json();
            console.log(data);
            this.$router.push('/user');  // Redirect after successful creation
        } else {
            console.error("Update failed");
        }
        },
    },
  
  }