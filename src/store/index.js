import Vue from 'vue'
import Vuex from 'vuex'
import cart from '@/store/cart'
import alert from '@/store/alert'
import auth from '@/store/auth'
import dialog from '@/store/dialog'
import region from '@/store/region'
import payment from '@/store/payment'
import vuexPersist from 'vuex-persist'

const vp = new vuexPersist({
  key: 'book-store',
  storage: localStorage,
})

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [vp.plugin],
  state: {
    preUrl:'',
  },
  mutations: {
    setPrevUrl:(state,value)=>{
      state.preUrl=value
    }
  },
  actions: {
    setPrevUrl:({commit},value)=>{
      commit('setPrevUrl',value)
    }
  },
  getters:{
    prevUrl:state=>state.preUrl
  },
  modules: {
    cart,
    alert,
    auth,
    dialog,
    region,
    payment,
  }
})