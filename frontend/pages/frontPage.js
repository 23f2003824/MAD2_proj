// import '../../frontend/css/frontPage.css';

export default {
    template: `
        <div>
            <div class="main">
                <h1>Welcome!</h1>
                    <h2>Login here</h2>
                    <div class="form-row">

                        <router-link v-if="!$store.state.loggedIn" to="/login">Login</router-link>
                    
                    </div>
                    <div class="new_user">
                        <h2 class="statement">New User? Register here</h2>
                            <router-link v-if="!$store.state.loggedIn" to="/register">Register</router-link>
                    </div>
            </div>
        <router-link to="/">Home</router-link>
        <router-link v-if="!$store.state.loggedIn" to="/register">Register</router-link>
        <button @click="$store.commit('logout')" v-if="$store.state.loggedIn" >Logout</button>
        
        
        <router-link v-if="$store.state.loggedIn && $store.state.role=='admin'" to="/admin">Admin Dashboard</router-link>
        </div>
        `
}