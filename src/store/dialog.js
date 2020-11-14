export default{
    namespaced:true,

    state:{
        status:false,
        component:'search' //bisa digunakan untuk komponen lain,seperti login, search,dll
    },
    mutations:{
        setStatus:(state,status)=>{
            state.status=status
        },
        setComponent:(state,component)=>{
            state.component=component
        },
    },
    actions:{
        setStatus:({commit},status)=>{
            commit('setStatus',status)
        },
        setComponent:({commit},component)=>{
            commit('setStatus',true)
            commit('setComponent',component)
        }
    },
    getters:{
        status:state=>state.status,
        component:state=>state.component,
    }
}