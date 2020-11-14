<template>
    <v-card>
        <v-toolbar dark="" color="primary">
            <v-btn icon="" dark="" @click.native="close">
                <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Login</v-toolbar-title>
        </v-toolbar>

        <v-divider></v-divider>

        <v-container fluid="">
            <v-form ref="form" v-model="valid" lazy-validation="">
                <v-text-field v-model="email" :rules="emailRules" label="E-mail" required append-icon="mdi-email"></v-text-field>
                <v-text-field v-model="password" :rules="passwordRules" label="Password" required 
                :append-icon="showPassword?'mdi-eye':'mdi-eye-off'" :type="showPassword?'text':'password'" 
                hint="At least 6 characters" counter="" @click:append="showPassword=!showPassword"></v-text-field>

                <div class="text-xs-center">
                    <v-btn color="accent lighten-1" :disabled="!valid" @click="submit">Login <v-icon right="" dark="">mdi-lock-open</v-icon>
                    </v-btn>
                </div>
            </v-form>
        </v-container>
    </v-card>    
</template>

<script>
import {mapGetters,mapActions} from "vuex"
export default {
    name:'login',
    data(){
        return {
            valid:true,
            email:'',
            emailRules:[
                v=>!!v||'Email is required',
                v=>/([a-zA-Z0-9_]{1,})(@)([a-zA-Z0-9_]{2,}).([a-zA-Z0-9_]{2,})+/.test(v)||'Email must be valid',
            ],
            showPassword:false,
            password:'',
            passwordRules:[
                v=>!!v||'Password required',
                v=>(v && v.length>=6)||'Minimal 6 characters',
            ],
        }
    },
    computed:{
        ...mapGetters({
            user:'auth/user',
            user_profile:'auth/user_profile',
            prevUrl:'prevUrl',  
        })
    },
    methods:{
        ...mapActions({
            setAlert:'alert/set',
            setAuth:'auth/set',
            setProfile:'auth/setProfile',
        }),
        submit(){
            if(this.$refs.form.validate()){
                let formData = {
                    'email':this.email,
                    'password':this.password,
                }
                this.axios.post('/login',formData)
                .then((response)=>{
                    let {data} = response.data
                    this.setAuth(data)

                    //Set Profile
                    
                    let config={
                        headers:{
                            'Authorization' : 'Bearer ' + this.user.api_token,
                        }
                    }
                    this.axios.post('/info/user',formData,config)
                    .then((data)=>{
                        let respon = data.data.data[0]
                        // console.log(respon)
                        this.setProfile(respon)
                    })
                    //End set profile

                    if(this.user.id>0){
                        this.setAlert({
                            status:true,
                            color:'success',
                            text:'Login success',
                        })
                        if(this.prevUrl.length>0){
                            this.$router.push(this.prevUrl)
                        }
                        this.close()
                    }else{
                        this.setAlert({
                            status:false,
                            color:'error',
                            text:'Login failed',
                        })
                    }
                })
                .catch((error)=>{
                    let data = error.response
                    this.setAlert({
                        status:true,
                        color:'error',
                        text:data.data.message,
                    })
                })
            }
        },
        close(){
            this.$emit('closed',false)
        }
    },
}
</script>