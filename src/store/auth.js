export default{
    namespaced:true,
    state:{
        user:{},
        user_profile:{},
    },
    mutations:{
        set:(state,payload)=>{
            state.user = payload
        },
        setProfile:(state,payload)=>{
            state.user_profile = payload
        },
    },
    actions:{
        set:({commit},payload)=>{
            commit('set',payload)
        },
        setProfile:({commit},payload)=>{
            commit('setProfile',payload)
        }
    },
    getters:{
        user:state=>state.user,
        user_profile:state=>state.user_profile,
        guest:state=>Object.keys(state.user).length==0,
    },
}