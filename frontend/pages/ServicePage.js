import Services from '../components/ServiceCard.js'

export default {
        template: `
        <div class="p-4">
            <h3>Services:</h3>
            <div v-if="services.length > 0" class="accordion" id="accordionExample">
                <div v-for="service in services" :key="service.id" class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button" type="button" data-bs-toggle="collapse" 
                            :data-bs-target="'#collapse' + service.id" 
                            aria-expanded="true" 
                            :aria-controls="'collapse' + service.id">
                            Service {{ service.id }}
                        </button>
                    </h2>
                    <div :id="'collapse' + service.id" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                        <div class="accordion-body">
                            <h2 @click="$router.push('/services/' + service.id)" class="display-4">{{ service.name }}</h2>
                            <p>{{ service.price }}</p>
                            <hr>
                            <p>{{ service.description }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <p v-else class="text-center text-muted">No services available at the moment.</p>
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
        console.log(this.services)
    },
    // components:{
    //     Services
    // }
}