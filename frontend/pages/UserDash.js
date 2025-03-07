import Navbar from "../components/Navbar.js"
import ServicePage from "./ServicePage.js"
export default{
    template:`
        <div>
            <Navbar />
            <div v-if="$route.path === '/user'">
                <ServicePage />
            </div> 
            <router-view></router-view>
        </div>
    `,
    components: {
        Navbar,
        ServicePage
    },
}