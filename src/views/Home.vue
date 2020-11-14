<template>
  <div>
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <!-- category -->
    <v-container class="ma-0 pa-0" grid-list-sm>
      <div class="text-right">
        <v-btn small text to="/categories" class="blue--text">
        All Categories <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </div>
      <v-layout wrap>
        <v-flex v-for="(category,index) in categories" :key="`category-`+category.id" xs6>
          <v-card :to="'/category/'+category.slug" :index="index">
            <v-img :src="getImage('/category/',category.image)" class="white--text" @error="imageUrlAlt">
              <v-card-title class="fill-height align-end" v-text="category.name">
              </v-card-title>
            </v-img>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <!-- Books -->
    <v-container class="pa-0 ma-0" grid-list-sm>
      <div class="text-right">
        <v-btn small-text to="/books" class="blue--text">
        All Books<v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </div>
      <v-layout wrap>
        <v-flex v-for="(book) in books" :key="`book-`+book.id" xs6>
          <book-item :book="book" />
          <!-- <v-card :to="'/books/'+book.slug" :index="index">
            <v-img :src="getImage('/books/',book.image)" class="white--text" @error="imageUrlAlt">
              <v-card-title class="fill-height align-end" v-text="book.title"></v-card-title>
            </v-img>
          </v-card> -->
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    BookItem:()=>import('@/components/BookItem.vue')
    // HelloWorld
  },
  data:() => ({
    categories:[],
    books:[],
  }),
  methods:{
    imageUrlAlt(event) {
      // console.log(process.env.VUE_APP_API_URL + '/images/unavailable.png');
      event.target.src = process.env.VUE_APP_API_URL + '/images/unavailable.jpg';
    },
  },
  created(){
    console.log('get data categories')
    this.axios.get('/categories/random')
      .then((resp) => {
        let{data} = resp.data
        this.categories = data
      })
      .catch((error) => {
        let{resp} = error
        console.log(resp)
      })
    
    console.log('get data books')
    this.axios.get('/books/top')
    .then((response) => {
      let{data} = response.data
      this.books = data
    })
    .catch((error) => {
      let{data} = error
      console.log(data)
    })
  }
}
</script>