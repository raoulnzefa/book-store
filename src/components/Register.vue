<template>
    <v-card>
        <v-toolbar dark="" color="primary">
            <v-btn icon="" dark="" @click.native="close">
                <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Register</v-toolbar-title>
        </v-toolbar>
        
        <v-spacer></v-spacer>
        
        <v-container fluid="">
            <v-form v-model="valid" ref="form" lazy-validation="">
                <v-text-field v-model="name" :rules="nameRules" :counter="255" 
                label="Name" required append-icon="mdi-user"></v-text-field>
                
                <v-text-field v-model="email" :rules="emailRules" label="E-mail" 
                required append-icon="mdi-email"></v-text-field>
                
                <v-text-field v-model="password" :rules="passwordRules" 
                :append-icon="showPassword?'mdi-eye':'mdi-eye-off'" 
                :type="showPassword?'text':'password'" label="Password" hint="At least 6 characters" counter="" 
                @click:append="showPassword=!showPassword"></v-text-field>

                <v-checkbox v-model="checkbox" :rules="[v=>!!v|| 'You must agree to continue !']" 
                label="Do you agree with our privacy policy ?" required>
                </v-checkbox>

                <div class="text-xs-center">
                    <v-btn class="mr-4" color="accent lighten-1" :disabled="!valid" @click="submit">Register <v-icon right dark>mdi-account-plus</v-icon>
                    </v-btn>
                    
                    <v-btn @click="clear">
                        Reset <v-icon right dark>mdi-lock-reset</v-icon>
                    </v-btn>
                </div>
            </v-form>
        </v-container>
    </v-card>
</template>

<script>
import {mapActions,mapGetters} from 'vuex'
export default {
    name:'register',
    data(){
        return {
            valid:true,
            name:'',
            email:'',
            password:'',
            nameRules:[
                v=>!!v||'Name is required',
                v=>(v && v.length<=255)||'Name must be less then 25 characters',
            ],
            emailRules:[
                v=>!!v||'E-mail is required',
                v=>/([a-zA-Z0-9_]{1,})(@)([a-zA-Z0-9_]{2,}).([a-zA-Z0-9_]{2,})+/.test(v)||'E-mail must be valid',
            ],
            passwordRules:[
                v=>!!v||'Password required',
                v=>(v && v.length>=6)||'Min 6 characters',
            ],
            showPassword:false,
            checkbox:false,
        }
    },
    computed:{
        ...mapGetters({
            user:'auth/user',
        }),
    },
    methods:{
        ...mapActions({
            setAlert:'alert/set',
            setAuth:'auth/set',
        }),
        submit(){
            if(this.$refs.form.validate()){
                let fr = new FormData()
                fr.set('name',this.name)
                fr.set('password',this.password)
                fr.set('email',this.email)
                
                this.axios.post('/register',fr)
                .then((response)=>{
                    let {data}=response.data
                    this.setAuth(data)
                    this.setAlert({
                        status:true,
                        color:'success',
                        text:'Register success',
                    })
                    this.close()
                })
                .catch((error)=>{
                    let{data}=error.data
                    this.setAlert({
                        status:true,
                        color:'error',
                        text:data.message,
                    })
                })
            }
        },
        close(){
            this.$emit('closed',false)
        },
        clear(){
            this.$refs.form.reset()
        }
    }
}
</script>