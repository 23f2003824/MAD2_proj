export default {
    template: `
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <div class="container-fluid">
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                    <li class="nav-item">
                        <router-link class="nav-link active" aria-current="page" v-if="$store.state.loggedIn && $store.state.role=='admin'" to="/admin">Admin Dashboard</router-link>
                        <router-link class="nav-link active" aria-current="page" v-if="$store.state.loggedIn && $store.state.role=='user'" to="/user">User Dashboard</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" v-if="$store.state.loggedIn && $store.state.role=='admin'" to="/admin/search">Search</router-link>
                        <router-link class="nav-link" v-if="$store.state.loggedIn && $store.state.role=='user'" to="/user/search">Search</router-link>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Summary</a>
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
            }
        }
    }
    // <router-link v-if="!$store.state.loggedIn" to="/login">Login</router-link>
    // <router-link v-if="!$store.state.loggedIn" to="/register">Register</router-link>