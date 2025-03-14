export default {
    template: `
        <nav class="navbar navbar-expand-lg bg-body-tertiary" style="min-height: 80px; padding: 10px 20px;">
            <div class="container-fluid">
                <div 
                class="navbar-brand" 
                style="
                width: 70px; 
                height: 70px; 
                background-image: url('/static/static/images/Untitled design.png'); 
                background-size: cover; 
                background-position: center; 
                border-radius: 50%; 
                border: 2px solid #ffffff; 
                margin-right: 15px; 
                transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;"
            onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0px 4px 10px rgba(0, 0, 0, 0.2)';"
            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
                </div>
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
                            <router-link class="nav-link" v-if="$store.state.loggedIn && $store.state.role=='service_professional'" to="/professional/summary">Summary</router-link>
                            <router-link class="nav-link" v-if="$store.state.loggedIn && $store.state.role=='user'" to="/user/summary">Summary</router-link>
                            <router-link class="nav-link" v-if="$store.state.loggedIn && $store.state.role=='admin'" to="/admin/summary">Summary</router-link>
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
        data(){
            return {
                professionals: [],
            }
        },
        async mounted(){
                try {
                    const response = await fetch(`${location.origin}/api/professionals`);
                    if (response.ok) {
                        this.professionals = await response.json();
                    } else {
                        console.error("Failed to fetch professionals.");
                    }
                } catch (error) {
                    console.error("Error fetching professionals:", error);
                }
        },
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