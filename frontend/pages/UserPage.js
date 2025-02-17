// import Services from '../components/ServiceCard.js'

export default {
    template: `
    <div class="p-4">
        <h3>Users:</h3>
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
                        <p style="margin: 0">User: {{ user.username }}</p>
                        <p style="margin: 0">Email: {{ user.email }}</p>
                    </div>
                </div>
            </div>
    </div>
`,


    data(){
        return{
            users:[]
    
        }
    },
    async mounted(){
        const res= await fetch(location.origin+"/api/user",{
            headers:{
                'Authentication-Token' : this.$store.state.auth_token
            }
        })
        this.users= await res.json()
    },
    // components:{
    //     Services
    // }
}