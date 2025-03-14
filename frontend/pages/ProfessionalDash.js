import Navbar from "../components/Navbar.js"
import ServicePage from "../components/ServicePage.js"
import UserPage from "../components/UserPage.js"
export default{
    template:`
        <div>
            <Navbar />
            <div v-if="$route.path === '/professional'">
                <UserPage />
                <ServicePage />
            </div> 
            <router-view></router-view>
        </div>
    `,
    components: {
        Navbar,
        ServicePage,
        UserPage
    },
}