import Navbar from "../components/Navbar.js";
import ServicePage from "../pages/ServicePage.js";
import UserPage from "../pages/UserPage.js";


export default{
    template:`
        <div>
            <Navbar />
            <ServicePage />
            <UserPage />
        </div>
    `,
    components: {
        Navbar,
        ServicePage,
        UserPage,
    },
}