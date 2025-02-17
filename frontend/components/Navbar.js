export default {
    template: `
        <div>
            <router-link v-if="$store.state.loggedIn && $store.state.role=='admin'" to="/admin">Admin Dashboard</router-link>
            <button @click="logout" v-if="$store.state.loggedIn">Logout</button>   
            <button>Search</button>     
            <button>Summary</button>   
            
        
        </div>
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