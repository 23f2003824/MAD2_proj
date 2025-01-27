export default {
    props: ['name', 'price', 'description', 'id'],
    template:`
        <div class="jumbotron">
            <h2 @click="$router.push('/services/'+id)" class="display-4">{{name}}</h2>
            <p>{{price}}<p>
            <hr>
            <p>{{description}}</p>
        </div>
    `

}