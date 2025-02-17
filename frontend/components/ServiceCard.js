export default {
    props: ['name', 'price', 'description', 'id'],
    template:`
 
        <div class="accordion" id="accordionExample">
            <div class="accordion-item">
                <h2 class="accordion-header">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapse' + id" aria-expanded="true" :aria-controls="'collapse' + id">
                    Service {{id}}
                </button>
                </h2>
                <div :id="'collapse' + id" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                <div class="accordion-body">
                    <h2 @click="$router.push('/services/'+id)" class="display-4">{{name}}</h2>
                    <p>{{price}}<p>
                    <hr>
                    <p>{{description}}</p>
                </div>
                </div>
            </div>
        </div>
        
    `

}
// <div class="jumbotron">
// <h2 @click="$router.push('/services/'+id)" class="display-4">{{name}}</h2>
// <p>{{price}}<p>
// <hr>
// <p>{{description}}</p>
// </div>