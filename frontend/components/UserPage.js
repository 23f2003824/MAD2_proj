// import Services from '../components/ServiceCard.js'

export default {
    template: `
<div>
    <div v-if="$store.state.role === 'service_professional'" class="p-4">
        <h3 class="text-primary mb-3">Your Details</h3>
        <div v-if="myProfile" class="card shadow-sm border-0 p-4" style="border-radius: 10px; background: #f8f9fa;">
            <div class="card-body">
                <h4 class="text-dark">{{ myProfile.name }}</h4>
                <p class="text-muted mb-2"><strong>Email:</strong> {{ myProfile.email }}</p>
                <hr>
                <p><strong>Service Offered:</strong> <span class="badge badge-pill badge-success">{{ myProfile.service_type }}</span></p>
                <p><strong>Experience:</strong> <span class="text-info">{{ myProfile.experience }} Years</span></p>
                <p><strong>Current Rating:</strong> <span class="text-warning">⭐ {{ myProfile.rating }}</span></p>
            </div>
        </div>
    <p v-else class="text-center text-muted">Loading your profile...</p>
    </div>
    <div class="p-4" v-if="$store.state.role === 'admin'">        
        <h3>Service Professional Requests:</h3>
        <div v-if="pendingProf.length > 0" class="accordion" id="accordionExample">
            <div v-for="professional in pendingProf" :key="professional.id" class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" 
                        :data-bs-target="'#collapse00' + professional.id" 
                        aria-expanded="true" 
                        :aria-controls="'collapse00' + professional.id">
                        Professional {{ professional.name }}
                    </button>
                </h2>
                <div :id="'collapse00' + professional.id" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                    <div class="accordion-body">
                        <h2 class="display-6">Name: {{ professional.username }}</h2>
                        <p>Email: {{ professional.email }}</p>
                        <hr>
                        <p>Description: {{ professional.description}}</p>
                        <p>Experience: {{ professional.experience}} Years</p>
                        <p>Service offered: {{ professional.service_type}}</p>
                        <div class="d-flex gap-2 mt-3">
                            <!-- Accept Button -->
                            <button v-if="!professional.rejected"
                                class="btn btn-outline-success"
                                @click="acceptProf(professional)">
                                Accept ✔
                            </button>

                            <!-- Reject Button -->
                            <button 
                                class="btn"
                                :class="professional.rejected ? 'btn-danger' : 'btn-outline-danger'"
                                :disabled="professional.rejected"
                                @click="rejectProf(professional)">
                                {{ professional.rejected ? "Rejected" : "Reject X" }}
                            </button> 
                        </div>
                    </div>
                </div>
            </div>
        </div>
            <p v-else class="text-center text-muted">No Service Professional Requests</p>
    </div>
    <div class="p-4" v-if="$store.state.role === 'admin'">
        
        <h3>Service Professional:</h3>
        <div v-if="professionals.length > 0" class="accordion" id="accordionExample">
            <div v-for="professional in professionals" :key="professional.id" class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" 
                        :data-bs-target="'#collapse0' + professional.id" 
                        aria-expanded="true" 
                        :aria-controls="'collapse0' + professional.id"
                        :style="{
                            backgroundColor: professional.active ? '' : '#f8d7da',
                            color: professional.active ? '' : '#721c24',
                            border: professional.active ? '' : '1px solid #f5c6cb'
                        }">
                        Professional: {{ professional.username }} <span v-if="!professional.active">(Blocked)</span>
                    </button>
                </h2>
                <div :id="'collapse0' + professional.id" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                    <div class="accordion-body">
                        <h2 class="display-6">Name: {{ professional.name }}</h2>
                        <p>Email: {{ professional.email }}</p>
                        <hr>

                        <p>Description: {{ professional.description}}</p>
                        <p>Experience: {{ professional.experience}} Years</p>
                        <p>Service offered: {{ professional.service_type}}</p>
                        <p>Professional rating: {{ professional.rating}}</p>
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
        <p v-else class="text-center text-muted">No Service Professional available</p>

        
    </div>
    <di<div class="p-4" v-if="$store.state.role === 'admin'">
        <h3 class="mb-3">Users</h3>
        <div v-if="users.length > 0" class="d-flex flex-column gap-3">
            <div v-for="user in users" :key="user.id" class="card shadow-sm border-0 p-3 bg-light">
                <div class="card-body d-flex align-items-center justify-content-between">
                    <div>
                        <h5 class="text-dark mb-1">{{ user.username }}</h5>
                        <p class="text-muted m-0"><strong>Email:</strong> {{ user.email }}</p>
                    </div>
                    <button class="btn"
                        :class="user.active ? 'btn-outline-danger' : 'btn-outline-success'"
                        @click="toggleStatus(user)">
                        {{ user.active ? "Block" : "Unblock" }}
                    </button>
                </div>
            </div>
        </div>
        <p v-else class="text-center text-muted">No Users available</p>
    </div>

</div>
`,


    data(){
        return{
            users:[],
            professionals:[],
            pendingProf:[],
            rejectProfArr:[],
            myProfile: null
    
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
        const usersData = await resUsers.json();
        const professionalsData = await resProfessionals.json();

        this.users = usersData;
        this.pendingProf = professionalsData.filter(professional => !professional.accepted || professional.rejected);
        this.professionals = professionalsData.filter(professional => professional.accepted);
        if (this.$store.state.role === 'service_professional') {
            const myProfileData = this.professionals.find(pro => pro.id === this.$store.state.user_id);
            this.myProfile = myProfileData;
        }
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
        },
        async acceptProf(user) {
            try {
                const response = await fetch(`${location.origin}/api/acceptProf/${user.id}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authentication-Token": this.$store.state.auth_token
                    },
                    body: JSON.stringify({ accepted: true }) // Toggle status
                });
    
                const data = await response.json();
                if (response.ok) {
                    user.accepted = data.accepted; // Update frontend state dynamically
                    this.pendingProf = this.pendingProf.filter(p => p.id !== user.id);

                    // Add to professionals list
                    this.professionals.push(user);
                } else {
                    console.error("Error:", data.message);
                }
            } catch (error) {
                console.error("Request failed:", error);
            }
        },
        async rejectProf(user) {
            try {
                const response = await fetch(`${location.origin}/api/rejectProf/${user.id}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authentication-Token": this.$store.state.auth_token
                    },
                    body: JSON.stringify({ rejected: true }) // Toggle status
                });
    
                const data = await response.json();
                if (response.ok) {
                    user.rejected = data.rejected; // Update frontend state dynamically
                    // this.pendingProf = this.pendingProf.map(p => 
                    //     p.id === user.id ? { ...p, rejected: true } : p
                    // );
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