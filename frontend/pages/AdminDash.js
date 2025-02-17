import Navbar from "../components/Navbar.js";
import ServicePage from "../pages/ServicePage.js";
import UserPage from "../pages/UserPage.js";


export default{
    template:`
        <div>
            <Navbar />
            <h1> this is admin dash </h1>
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