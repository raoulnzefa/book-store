<template>
    <div>
        <v-container class="pa-0 ma-0" grid-list-sm>
            <v-subheader>All Books</v-subheader>
            <v-layout wrap="">
                <v-flex v-for="(book) in books" :key="'book-'+book.id" xs6>
                    <book-item :book="book" />
                    <!-- <v-card :to="'/book/'+book.slug">
                        <v-img :src="getImage('/books/',book.image)" class="white--text">
                            <v-card-title class="fill-height align-end" v-text="book.title"></v-card-title>
                        </v-img>
                    </v-card> -->
                </v-flex>
            </v-layout>
        </v-container>
        <v-pagination v-model="page" :length="pagelength" @input="go" :total-visible="5"></v-pagination>
    </div>
</template>
<script>
export default {
    components:{
        BookItem:()=>import('@/components/BookItem.vue')
    },
    data:()=>({
        books:[],
        page:0,
        pagelength:0
    }),
    created(){
        this.go()
    },
    methods:{
        go(){
            let url = '/books?page='+this.page
            this.axios.get(url)
            .then((response)=>{
                let{data}=response.data
                let{meta}=response.data
                this.books=data
                this.page=meta.current_page
                this.pagelength=meta.last_page
            })
            .catch((error) => {
                console.log(error)
            })
        }
    },
}
</script>