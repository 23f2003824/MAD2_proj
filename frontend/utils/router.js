const Home= {template: '<div>Home</div>'}
import login from '../pages/login.js';
import register from '../pages/register.js';
import ServicePage from '../pages/ServicePage.js';
const routes= [
    {path: '/', component: Home},
    {path: '/login', component: login},
    {path: '/register', component: register},
    {path: '/services', component: ServicePage},
    {path: '/services/:id', component: ServiceDisplayPage, prop:true},

]

const router= new VueRouter({
    routes
})

export default router