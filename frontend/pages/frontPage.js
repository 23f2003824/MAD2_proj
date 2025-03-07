export default {
    template: `
      <div class="container d-flex flex-column align-items-center justify-content-center vh-100 text-center">
        <div class="card p-4 shadow-lg w-100" style="max-width: 500px;">
          <h1 class="mb-3 ">Welcome!</h1>
  
          <h2 class="mb-3">Login here</h2>
          <div class="mb-3">
            <router-link v-if="!$store.state.loggedIn" to="/login" class="btn btn-primary w-100">Login</router-link>
          </div>
  
          <div class="border-top pt-3">
            <h2 class="statement mb-3">New User? Register here</h2>
            <router-link v-if="!$store.state.loggedIn" to="/register" class="btn btn-success w-100">Register</router-link>
          </div>
  
          <button 
            @click="$store.commit('logout')" 
            v-if="$store.state.loggedIn" 
            class="btn btn-danger mt-3 w-100">
            Logout
          </button>
  
          <router-link 
            v-if="$store.state.loggedIn && $store.state.role === 'admin'" 
            to="/admin" 
            class="btn btn-warning mt-3 w-100">
            Admin Dashboard
          </router-link>
        </div>
      </div>
    `
  };
  