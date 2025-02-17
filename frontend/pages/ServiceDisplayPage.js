export default{
    props:['id'],
    template:`
        <div>
            <h2>{{service.title}}</h2>
            <div>Duration: {{service.duration}}</div>
            <div>Description: {{service.description}}</div>
            <div>Price: {{service.price}}</div>
        </div>
    `,
    data(){
        return{
            service:{}
        }
    },
    async mounted(){
            const res= await fetch (`${location.origin}/api/services/${this.id}`, {
                headers:{'Authentication-Token' : this.$store.state.auth_token}
            }) 
            if (res.ok){
                this.service= await res.json()
                // console.log(this.service)

            }
    }
}