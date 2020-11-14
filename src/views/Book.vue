<template>
    <div>
        <v-card if="book.slug">
            <v-img :src="getImage('/books/',book.cover)" class="white--text" height="200px">
                <v-card-title class="fill-height align-end" v-text="book.title"></v-card-title>
            </v-img>
            <v-card-text>
                <v-simple-table dense>
                    <tbody>
                        <tr>
                            <td><v-icon>mdi-account-tie</v-icon> Author</td>
                            <td>{{book.author}}</td>
                        </tr>
                        <tr>
                            <td><v-icon>mdi-bullhorn</v-icon> Publisher</td>
                            <td>{{book.publisher}}</td>
                        </tr>
                        <tr>
                            <td><v-icon>mdi-weight</v-icon> Weight</td>
                            <td>{{book.weight}} Kg</td>
                        </tr>
                        <tr>
                            <td><v-icon>mdi-format-list-bulleted</v-icon> Stock</td>
                            <td>{{book.stock}} Item</td>
                        </tr>
                        <tr>
                            <td><v-icon>mdi-eye</v-icon> Views</td>
                            <td>{{book.views}}</td>
                        </tr>
                        <tr>
                            <td><v-icon>mdi-cash</v-icon> Price</td>
                            <td class="orange--text">Rp {{parseInt(book.price).toLocaleString('id-ID')}}</td>
                        </tr>
                    </tbody>
                </v-simple-table>
                Description :<br>
                {{book.description}}
                <br>
                Categories:
                <v-chip v-for="category in book.category" :key="category.id" :to="'/category/'+category.slug" small>
                {{category.name}}
                </v-chip>
            </v-card-text>
            <v-card-actions>
                <v-btn block="" color="success" @click="buy" :disabled="book.stock==0">
                    <v-icon>mdi-cart-plus</v-icon> &nbsp;BUY
                </v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script>
import {mapActions} from 'vuex'
export default {
    data:()=>({
        book:{},
        page:0,
        // nilai:9000
    }),

    created(){
        this.go()
    },

    methods:{
        go(){
            let {slug} = this.$route.params
            let url = encodeURI('/book/slug/' + slug + '?page=' + this.page)
            this.axios.get(url)
            .then((response)=>{
                let {data} = response.data
                this.book = data
                // console.log(this.nilai.toLocateString('id-ID'))
            })
            .catch((response)=>{
                let {error} = response
                console.log(error)
            })
        },
        ...mapActions({
            addCart:'cart/add',
            setAlert:'alert/set',
        }),
        buy(){
            this.addCart(this.book)
            this.setAlert({
                status:true,
                color:'success',
                text:'Added to cart',
            })
            // alert('buy')
        },
    },
}
</script>