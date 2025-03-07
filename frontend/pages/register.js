export default {
    template: `
    
    <div class="container d-flex justify-content-center align-items-center vh-100">
      <div class="card p-4 shadow-lg w-100" style="max-width: 400px;">
        <router-link to="/" class="text-primary text-decoration-none mb-3 d-block">Home</router-link>
        <h2 class="text-center mb-4">Register</h2>

        <div class="mb-3">
          <input class="form-control" placeholder="Username" v-model="username" required />
        </div>
        <div class="mb-3">
          <input class="form-control" placeholder="Email" v-model="email" required />
        </div>
        <div class="mb-3">
          <input type="password" class="form-control" placeholder="Password" v-model="password" required />
        </div>
        <div class="mb-3">
          <input class="form-control" placeholder="Name" v-model="name" required />
        </div>
        <div class="mb-3">
          <select class="form-select" v-model="role" required>
            <option disabled value="">Select role</option>
            <option value="user">Customer</option>
            <option value="service_professional">Service Professional</option>
          </select>
        </div>
      
        <div class="mb-3">
          <textarea class="form-control" placeholder="Description" v-model="description" :disabled="role !== 'service_professional'"></textarea>
        </div>
        <div class="mb-3">
          <select class="form-select" v-model="service_type" :disabled="role !== 'service_professional'">
            <option disabled value="">Select Service Type</option>
            <option v-for="service in services" :key="service.id" :value="service.name">
              {{ service.name }}
            </option>
          </select>
        </div>
        <div class="mb-3">
          <input type="number" class="form-control" placeholder="Experience (in years)" v-model="experience" :disabled="role !== 'service_professional'" />
        </div>

        <button class="btn btn-primary w-100" @click="submitLogin">Register</button>
      </div>
    </div>
          `,
    data() {
      return {
        username: null,
        email: null,
        password: null,
        role: "",
        name: null,
        description: null,
        service_type: "",
        experience: null,
        services: [],
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
      async submitLogin() {
        if (!this.username || !this.email || !this.password || !this.role) {
          alert("Username, Email, Password and Role must be provided");
          return;
        }
        const res = await fetch((location.origin+"/register"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username:this.username,email: this.email, password: this.password, role: this.role, name: this.name, description: this.description, service_type: this.service_type, experience: this.experience }),
        });
        if (res.ok) {
          console.log("registration success");
          const data = await res.json();
          console.log(data);
        }
      },
    },
  };
  