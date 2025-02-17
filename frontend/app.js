// import Navbar from "./components/Navbar.js"
import router from "./utils/router.js"
import store from "./utils/store.js"
import frontPage from "./pages/frontPage.js"


const app= new Vue({
    el: '#app',
    
    template:`
        <div> 
            <router-view> </router-view>
        </div>`,

    components: {
        frontPage,
    },
    router,
    store,
})