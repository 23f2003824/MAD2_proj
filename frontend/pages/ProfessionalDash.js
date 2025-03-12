import Navbar from "../components/Navbar.js"
import ServicePage from "../components/ServicePage.js"
export default{
    template:`
        <div>
            <Navbar />
            <div v-if="$route.path === '/professional'">
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