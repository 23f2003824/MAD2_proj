export default {
  template: `
  
  <div class="container d-flex justify-content-center align-items-center vh-100">
    <div class="card p-4 shadow-lg w-100" style="max-width: 400px;">
      <router-link to="/" class="text-primary text-decoration-none mb-3 d-block">Home</router-link>
      <h2 class="text-center mb-4">Login</h2>

      <div class="mb-3">
        <input type="email" class="form-control" placeholder="Email" v-model="email" required />
      </div>
      <div class="mb-3">
        <input type="password" class="form-control" placeholder="Password" v-model="password" required />
      </div>

      <button class="btn btn-primary w-100" @click="submitLogin">Login</button>
    </div>
  </div>
        `,
  data() {
    return {
      email: null,
      password: null,
    };
  },
  methods: {
    async submitLogin() {
      const res = await fetch((location.origin+"/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: this.email, password: this.password }),
      });
      if (res.ok) {
        console.log("login success");
        const data = await res.json();
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
        // this.$router.push('/services');
      
      }
    },
  },
};
