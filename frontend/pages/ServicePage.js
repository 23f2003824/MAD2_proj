import Services from '../components/ServiceCard.js'

export default {
    template:`
    <div class="p-4">
        <h3>Services</h3>
        <Services v-for="service in services" :name="service.name" :price="service.price" :description="service.description" />
    </div>
    `,

    data(){
        return{
            services:[]
    
        }
    },
    async mounted(){
        const res= await fetch(location.origin+"/api/services",{
            headers:{
                'Authentication-Token' : this.$store.state.auth_token
            }
        })
        this.services= await res.json()
    },
    components:{
        Services
    }
}