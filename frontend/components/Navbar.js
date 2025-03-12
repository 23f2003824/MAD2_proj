export default {
    template: `
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <div class="container-fluid">
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav me-auto">
                        <li class="nav-item">
                            <router-link class="nav-link active" aria-current="page" v-if="$store.state.loggedIn && $store.state.role=='admin'" to="/admin">Admin Dashboard</router-link>
                            <router-link class="nav-link active" aria-current="page" v-if="$store.state.loggedIn && $store.state.role=='user'" to="/user">User Dashboard</router-link>
                            <router-link class="nav-link active" aria-current="page" v-if="$store.state.loggedIn && $store.state.role=='service_professional'" to="/professional">Service Professional Dashboard</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" v-if="$store.state.loggedIn && $store.state.role=='admin'" to="/admin/search">Search</router-link>
                            <router-link class="nav-link" v-if="$store.state.loggedIn && $store.state.role=='user'" to="/user/search">Search</router-link>
                            <router-link class="nav-link" v-if="$store.state.loggedIn && $store.state.role=='service_professional'" to="/professional/search">Search</router-link>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Summary</a>
                        </li>
                    </ul>
                    <ul class="navbar-nav ms-auto">
                        <!--buttons for user--->
                        <li class="nav-item">
                            <button class="nav-link btn btn-link"  @click="$router.push('/user/' + $store.state.user_id)" v-if="$store.state.loggedIn && $store.state.role=='user'">Edit Profile</button>
                        </li>
                        <li class="nav-item">
                            <button class="nav-link text-danger btn btn-link" @click="deleteUser($store.state.user_id)" v-if="$store.state.loggedIn && $store.state.role=='user'">Delete Profile</button>
                        </li>
                        <!--buttons for professional-->
                        <li class="nav-item">
                            <button class="nav-link btn btn-link"  @click="$router.push('/professional/' + $store.state.user_id)" v-if="$store.state.loggedIn && $store.state.role=='service_professional'">Edit Profile</button>
                        </li>
                        <li class="nav-item">
                            <button class="nav-link text-danger btn btn-link" @click="deleteUser($store.state.user_id)" v-if="$store.state.loggedIn && $store.state.role=='service_professional'">Delete Profile</button>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="#" @click.native="logout" v-if="$store.state.loggedIn">Logout</router-link>
                        </li>
                    </ul>
                </div>
            </div>
      </nav>   
            
        
        `,
        methods: {
            logout() {
                this.$store.commit('logout');  // Perform logout
                this.$router.push('/');  // Redirect to home
            },
            async deleteUser(user_id) {
                console.log("Attempting to delete user ID:", user_id)
                if (!confirm("Are you sure you want to delete your Id?")) return;
          
                try {
                  const res = await fetch(
                    `${location.origin}/api/user/${user_id}`,
                    {
                      method: "DELETE",
                      headers: { "Authentication-Token": this.$store.state.auth_token },
                    }
                  );
          
                  if (res.ok) {
                    this.$store.commit('logout');
                    this.$router.push('/');
                  } else {
                    const data = await res.json();
                    alert(data.message);
                  }
                } catch (error) {
                  console.error("Error deleting user:", error);
                }
              },

        },

    }
    // <router-link v-if="!$store.state.loggedIn" to="/login">Login</router-link>
    // <router-link v-if="!$store.state.loggedIn" to="/register">Register</router-link>