export default{
    namespaced:true,

    state:{
        payment:[],
    },
    mutations:{
        set:(state,payload)=>{
            state.payment=payload
        }
    },
    actions:{
        setPayment:({commit},payload)=>{
            commit('set',payload)
        },
    },
    getters:{
        payment:state=>state.payment,
    }
}