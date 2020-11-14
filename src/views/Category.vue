<template>
    <div>
        <v-card :to="'/category/'+category.slug" v-if="category.slug">
            <v-img :src="getImage('/category/',category.image)" class="white--text">
                <v-card-title class="fill-height align-end" v-text="category.name"></v-card-title>
            </v-img>
        </v-card>
        <v-container class="ma-o pa-0" grid-list-sm v-if="books">
            <v-subheader>All Books</v-subheader>
            <v-layout wrap="">
                <v-flex v-for="(book) in books" :key="'book-'+book.id" xs6>
                    <book-item :book="book" />
                    <!-- <v-card :to="'/book/'+book.slug">
                        <v-img :src="getImage('/books/',book.cover)" class="white--text">
                            <v-card-title  v-text="book.title" class="fill-height align-end"></v-card-title>
                        </v-img>
                    </v-card> -->
                </v-flex>
            </v-layout>
        </v-container>
        <!-- <template>
            <div class="text-center"> -->
                <v-pagination v-model="page" @input="go" :length="lengthPage" :total-visible="5"></v-pagination>
            <!-- </div>
        </template> -->
    </div>    
</template>

<script>
export default {
    components:{
        BookItem:()=>import('@/components/BookItem.vue')
    },
    data:() => ({
        category:{},
        books:[],
        page:0,
        lengthPage:0,
    }),

    created(){
        this.go()
    },

    methods:{
        go(){
            let {slug} = this.$route.params
            let url = encodeURI('/category/slug/'+slug + '?page=' + this.page)
            // url = url + '?page=' + this.page
            // url = encodeURI(url)
            this.axios.get(url)
            .then((response) => {
                let {data} = response.data
                // let category = data
                this.category = data
                this.books = data.books.data
                this.page = data.books.current_page
                this.lengthPage = data.books.last_page
            })
            .catch((response) => {
                let{error} = response
                console.log(error)
            })
        }
    }
}
</script>