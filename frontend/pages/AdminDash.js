import Navbar from "../components/Navbar.js";
import ServicePage from "../components/ServicePage.js";
import UserPage from "../components/UserPage.js";


export default{
    template:`
        <div>
            <Navbar />
            <div v-if="$route.path === '/admin'">
                <ServicePage />
                <UserPage />
            </div>
            <router-view></router-view>
        </div>
    `,
    components: {
        Navbar,
        ServicePage,
        UserPage,
    },
}