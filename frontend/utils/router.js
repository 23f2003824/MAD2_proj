const Home= {template: '<div>Home</div>'}
import login from '../pages/login.js';
import register from '../pages/register.js';
// import ServicePage from '../pages/ServicePage.js';
// import ServiceDisplayPage from '../pages/ServiceDisplayPage.js';
import AdminDash from '../pages/AdminDash.js';
import frontPage from '../pages/frontPage.js';
import store from './store.js';
import ServiceCreation from '../pages/ServiceCreation.js';
import ServiceUpdate from '../pages/ServiceUpdate.js';
import Search from '../components/SearchPage.js';
import UserDash from '../pages/UserDash.js';
import UserUpdate from '../pages/UserUpdate.js';
import ProfessionalDash from '../pages/ProfessionalDash.js';
import Summary from '../components/Summary.js';
const routes= [
    {path: '/', component: frontPage},
    {path: '/login', component: login},
    {path: '/register', component: register},
    {
        path: '/admin',
        component: AdminDash,
        meta: { requiresLogin: true, role: "admin" },
        children: [
            { path: 'search', component: Search },
            {path: 'summary', component:Summary, props:true},
            {path: '/services', component: ServiceCreation},
            {path: '/services/:id', component: ServiceUpdate, props:true},


        ]
    },
    {
        path: '/user',
        component: UserDash,
        meta: { requiresLogin: true, role: "user" },
        children: [
            { path: 'search', component: Search },
            {path: 'summary', component:Summary, props:true},
            {path: ':id', component:UserUpdate, props:true},

        ]
    },
    {
        path: '/professional',
        component: ProfessionalDash,
        meta: { requiresLogin: true, role: "service_professional" },
        children: [
            { path: 'search', component: Search },
            {path: 'summary', component:Summary, props:true},
            {path: ':id', component:UserUpdate, props:true},

        ]
    },

]

const router= new VueRouter({
    routes
})

//navigation guards
router.beforeEach((to,from,next)=>{
    if(to.matched.some((record)=> record.meta.requiresLogin)){
        if(!store.state.loggedIn){
            next({path: '/'})
        }
        else if (to.meta.role && to.meta.role != store.state.role){
            alert('role not authorised')
            next({path:'/'})
        }
        else{
            next()
        }
    }
    else{
        next()
    }
})

export default router