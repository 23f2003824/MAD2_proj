// import Services from '../components/ServiceCard.js'

export default {
    template: `
<div>
    <div class="p-4">
        <h3>Service Professionals:</h3>
        <div v-if="professionals.length > 0" class="accordion" id="accordionExample">
            <div v-for="professional in professionals" :key="professional.id" class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" 
                        :data-bs-target="'#collapse0' + professional.id" 
                        aria-expanded="true" 
                        :aria-controls="'collapse0' + professional.id">
                        Professional {{ professional.id }}
                    </button>
                </h2>
                <div :id="'collapse0' + professional.id" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                    <div class="accordion-body">
                        <h2 class="display-6">Name: {{ professional.username }}</h2>
                        <p>Email: {{ professional.email }}</p>
                        <hr>
                        <p>Description:</p>
                        <div class="d-flex gap-2 mt-3">
                            <button 
                            class="btn" 
                            :class="professional.active ? 'btn-outline-danger' : 'btn-outline-success'"
                            @click="toggleStatus(professional)">
                            {{ professional.active ? "Block" : "Unblock" }}
                            </button> 
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
        <div class="p-4">
            <h3>Users:</h3>
                <div v-if>
                <div v-for="user in users" :key="user.id">
                    <div :class='"user"+user.id'   :style="{
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'flex-start', 
                        padding: '10px 20px', 
                        margin: '1px', 
                        backgroundColor: 'rgb(246, 229, 208)', 
                        borderRadius: '5px',
                    }">
                        <div class="btn" style="flex-grow: 1; text-align: left;">
                            <div class="d-flex gap-2">
                                <div style="flex-grow: 1; text-align: left;">
                                    <p style="margin: 0">User: {{ user.username }}</p>
                                    <p style="margin: 0">Email: {{ user.email }}</p>
                                </div>
                                    <button 
                                    class="btn" 
                                    :class="user.active ? 'btn-outline-danger' : 'btn-outline-success'"
                                    @click="toggleStatus(user)">
                                    {{ user.active ? "Block" : "Unblock" }}
                                    </button>                             
                                </div>
                        </div>
                    </div>
                </div>
        </div>
    </div>
</div>
`,


    data(){
        return{
            users:[],
            professionals:[]
    
        }
    },
    async mounted() {
        // Run both fetch calls concurrently
        const [resUsers, resProfessionals] = await Promise.all([
            fetch(location.origin + "/api/users", {
                headers: {
                    'Authentication-Token': this.$store.state.auth_token
                }
            }),
            fetch(location.origin + "/api/professionals", {
                headers: {
                    'Authentication-Token': this.$store.state.auth_token
                }
            })
        ]);

        this.users = await resUsers.json();
        this.professionals = await resProfessionals.json();
    },
    methods: {
        async toggleStatus(user) {
            try {
                const response = await fetch(`${location.origin}/api/toggle-status/${user.id}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authentication-Token": this.$store.state.auth_token
                    },
                    body: JSON.stringify({ active: !user.active }) // Toggle status
                });
    
                const data = await response.json();
                if (response.ok) {
                    user.active = data.active; // Update frontend state dynamically
                } else {
                    console.error("Error:", data.message);
                }
            } catch (error) {
                console.error("Request failed:", error);
            }
        }
    }
    
    // components:{
    //     Services
    // }
}