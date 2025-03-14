export default {
  template: `
  
  <div class="container d-flex justify-content-center align-items-center vh-100"
    style="
    background-image: url('/static/static/images/logo.png');
    background-size: cover;
    background-position: center;">
    <div 
      class="p-4 shadow-lg w-100 rounded-4 text-dark " 
      style="
      max-width: 400px;
      background: linear-gradient(to bottom right, #e3f2fd,rgba(187, 222, 251, 0.6));">
      <router-link to="/" class="text-primary text-decoration-none fw-bold d-inline-block mb-3">Home</router-link>
      <h2 class="text-center mb-4">Login</h2>

      <div class="mb-3">
        <input type="email" class="form-control" placeholder="Email" v-model="email" required />
      </div>
      <div class="mb-3">
        <input type="password" class="form-control" placeholder="Password" v-model="password" required />
      </div>

      <button class="btn btn-primary w-100" @click="submitLogin">Login</button>
      <div v-if="errorMessage" class="alert alert-danger text-center mt-4">{{ errorMessage }}</div>

      <p class="text-center mt-3">
        New user? 
        <router-link 
          v-if="!$store.state.loggedIn" 
          to="/register" 
          class="text-success text-decoration-none fw-bold ms-1">
          Register here
        </router-link>
      </p>
    </div>
  </div>
        `,
  data() {
    return {
      email: null,
      password: null,
      errorMessage: null,
    };
  },
  methods: {
    async submitLogin() {
      const res = await fetch((location.origin+"/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: this.email, password: this.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        this.errorMessage = data.message; 
        return;
      }
      if (res.ok) {
        console.log("login success");
        console.log(data);
        localStorage.setItem('user', JSON.stringify(data));
        console.log(data.role);
        
        if (data.role =='admin') {
          this.$store.commit('setUser');
          this.$router.push('/admin');
        }
        else if (data.role =='user') {
          this.$store.commit('setUser');
          this.$router.push('/user');
        }
        else if (data.role =='service_professional') {
          this.$store.commit('setUser');
          this.$router.push('/professional');
        }
        // this.$router.push('/services');
      
      }
    },
  },
};
