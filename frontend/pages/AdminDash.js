import Navbar from "../components/Navbar.js";
import ServicePage from "../pages/ServicePage.js";
import UserPage from "../pages/UserPage.js";


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