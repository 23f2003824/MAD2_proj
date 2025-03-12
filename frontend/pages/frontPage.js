export default {
  template: `
    <div class="container-fluid vh-100 d-flex align-items-center justify-content-center p-0 m-0 ">
      <div class="row w-100 vh-100 m-0 p-0">

        <div class="col-md-6 d-flex align-items-center justify-content-center bg-light p-0">
          <img src="/static/static/images/logo.png" alt="HomeEase Service" class="img-fluid w-100 h-100 object-fit-cover">
        </div>

        <div class="col-md-6 d-flex flex-column justify-content-center align-items-center text-center p-5 rounded-3 m-0"
             style="background: linear-gradient(135deg,rgb(212, 194, 118),rgb(100, 203, 170));
             box-shadow: -8px 0px 20px rgba(0, 0, 0, 0.2);">
          <h1 class="mb-3 fw-bold text-dark">Welcome to <span class="text-primary">HomeEase</span>!</h1>
          <p class="text-muted">Your trusted partner for home services – Cleaning, Cooking, Repairs & More!</p>

          <h2 class="mb-3 text-dark">Login</h2>
          <router-link v-if="!$store.state.loggedIn" to="/login" class="btn btn-dark w-50 py-2 shadow-sm">Login</router-link>

          <div class="border-top pt-4 mt-3 w-100">
            <h2 class="mb-3 text-dark">New User? Register Here</h2>
            <router-link v-if="!$store.state.loggedIn" to="/register" class="btn btn-primary w-50 py-2 shadow-sm">Register</router-link>
          </div>

          <!-- Dashboard Links for Logged-in Users -->
          <router-link 
            v-if="$store.state.loggedIn && $store.state.role === 'admin'" 
            to="/admin" 
            class="btn btn-info mt-4 w-50 py-2 shadow-sm">
            Admin Dashboard
          </router-link>

          <router-link 
            v-if="$store.state.loggedIn && $store.state.role === 'user'" 
            to="/user" 
            class="btn btn-info mt-4 w-50 py-2 shadow-sm">
            User Dashboard
          </router-link>
          <router-link 
            v-if="$store.state.loggedIn && $store.state.role === 'service_professional'" 
            to="/professional" 
            class="btn btn-info mt-4 w-50 py-2 shadow-sm">
            Professional Dashboard
          </router-link>
        </div>

      </div>
    </div>
  `
};
