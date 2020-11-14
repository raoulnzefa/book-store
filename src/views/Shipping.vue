<template>
    <div>
        <v-subheader>Shipping Address</v-subheader>
        <div>
            <v-card flat="">
                <v-container>
                    <v-form ref="form" lazy-validation>
                        <v-text-field label="Name" v-model="name" required append-icon="mdi-account" readonly></v-text-field>

                        <v-textarea label="Address" v-model="address" required auto-grow="" rows="1"></v-textarea>

                        <v-text-field label="Phone" v-model="phone" required append-icon="mdi-phone-alert"></v-text-field>

                        <v-select v-model="province_id" :items="provinces" item-text="province" 
                        item-value="id" label="Province" persistent-hint single-line />

                        <v-select v-if="province_id>0" v-model="city_id" :items="citiesByProvince" 
                        item-text="city" item-value="id" label="City" persistent-hint single-line />
                    </v-form>
                    <v-card-actions>
                        <v-btn color="success" dark @click="saveShipping" block>
                            <v-icon>mdi-content-save</v-icon> &nbsp;Save
                        </v-btn>
                    </v-card-actions>
                </v-container>
            </v-card>
        </div>
        <v-subheader>Your shopping cart</v-subheader>
        <div v-if="cartCount>0">
            <v-card flat="">
                <v-list three-line="" v-if="cartCount>0">
                    <template v-for="(item,index) in carts">
                        <v-list-item :key="'cart'+index">
                            <v-list-item-avatar>
                                <v-img :src="getImage('/books/',item.cover)"></v-img>
                            </v-list-item-avatar>

                            <v-list-item-content>
                                <v-list-item-title v-text="item.title"></v-list-item-title>
                                <v-list-item-subtitle>
                                    Rp {{parseInt(item.price).toLocaleString('id-ID')}} ({{item.weight}} kg)
                                    <span style="float:right">{{item.quantity}}</span>
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </template>
                </v-list>
                <v-container>
                    <v-card-actions>
                        SubTotal
                        <v-spacer />
                        Rp {{parseInt(totalPrice).toLocaleString('id-ID')}}
                    </v-card-actions>
                </v-container>
            </v-card>
        </div>
        <v-subheader>Courier</v-subheader>
        <div>
            <v-card flat>
                <v-container>
                    <v-select v-model="courier" :items="couriers" item-text="name" item-value="id" 
                    @change="getServices" label="Courier" persistent-hint="" single-line />
                    
                    <v-select v-model="service" v-if="courier" :items="services" item-text="resume" item-value="service"
                    label="Courier Service" persistent-hint single-line @change="calculateBill" />

                    <v-card-actions>
                        Sub Total<v-spacer />
                        Rp. {{shippingCost.toLocaleString('id-ID')}}
                    </v-card-actions>
                </v-container>
            </v-card>
        </div>

        <v-subheader>Total</v-subheader>
        <v-card>
            <v-card-text>
            <!-- <v-container> -->
                <!-- <v-layout row="" wrap=""> -->
                <v-layout wrap>
                    <!-- <v-flex xs6 text-center> -->
                    <v-flex xs-6 pa-1>
                        Total Bill ({{totalQuantity}} (items))
                        <div class="title">{{totalBill.toLocaleString('id-ID')}}</div>
                    </v-flex>
                    <!-- <v-flex xs-6 text-center> -->
                    <v-flex xs-6 text-right pa-1>
                        <v-btn color="orange" block @click="dialogConfirm=true" :disabled="totalBill==0">
                            <v-icon light>mdi-cash</v-icon>&nbsp;Pay
                        </v-btn>
                    </v-flex>
                </v-layout>
            <!-- </v-container> -->
            </v-card-text>
        </v-card>

        <template>
            <v-layout row justify-center>
                <v-dialog v-model="dialogConfirm" persistent max-width="290">
                    <v-card>
                        <v-card-title class="headline">Confirmation</v-card-title>
                        <v-card-text>If you continue, transaction will be proccessed</v-card-text>
                        <v-card-actions>
                            <v-btn color="warning" @click="cancel">Cancel</v-btn>
                            <v-spacer />
                            <v-btn color="success" @click="pay">Continue</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-layout>
        </template>
    </div>
</template>

<script>
import {mapGetters,mapActions} from 'vuex'
export default {
    data(){
        return {
            name: '',
            address:'',
            phone:'',
            province_id:0,
            city_id:0,
            courier:'',
            couriers:[],
            service:'',
            services:[],
            shippingCost:0,
            totalBill:0,
            dialogConfirm:false,
        }
    },
    computed:{
        ...mapGetters({
            user:'auth/user',
            provinces:'region/provinces',
            cities:'region/cities',
            carts:'cart/carts',
            cartCount:'cart/count',
            totalPrice:'cart/totalPrice',
            totalQuantity:'cart/totalQuantity',
            totalWeight:'cart/totalWeight',
            payment:'payment/payment',
        }),
        citiesByProvince(){
            let idprovinsi = this.province_id
            return this.cities.filter((city)=>{
                if(city.province_id==idprovinsi){
                    return city
                }
            })
        },
    },
    methods:{
        ...mapActions({
            setAlert:'alert/set',
            setAuth:'auth/set',
            setProvinces:'region/setProvinces',
            setCities:'region/setCities',
            setCart:'cart/set',
            setPayment:'payment/setPayment',
        }),
       saveShipping(){
            let fr = new FormData()
            fr.set('name',this.name)
            fr.set('address',this.address)
            fr.set('phone',this.phone)
            fr.set('province_id',this.province_id)
            fr.set('city',this.city_id)
            
            let config = {
                headers:{
                    'Authorization':'Bearer '+this.user.api_token
                },
            }
            // console.log(...fr)
            // console.log(config)

            // process.kill(process.pid)
            this.axios.post('/shipping',fr,config)
            .then((response)=>{
                let {data} = response
                this.setAuth(data.data)
                this.resetService()
                this.courier=''
                this.setAlert({
                    status:true,
                    text:data.message,
                    color:'success',
                })
            })
            .catch((error)=>{
                let {data} = error.response
                // console.log(data.message)
                this.setAlert({
                    status:true,
                    text:data.message,
                    color:'error',
                })
            })
        },
        getServices(){
            let courier = this.courier
            let encodeCart = JSON.stringify( this.carts)
            let formData = new FormData()
            formData.set('courier',courier)
            formData.set('carts',encodeCart)
            
            let config = {
                headers:{
                    'Authorization':'Bearer ' + this.user.api_token
                }
            }
            this.resetService()
            this.axios.post('/service',formData,config)
            .then((response)=>{
                let response_data = response.data
                if(response_data.status!='error'){
                    this.services = response_data.data.service
                    this.setCart(response_data.data.safe_carts)
                }
                this.setAlert({
                    status:true,
                    text:response_data.message,
                    color:response_data.status,
                })
            })
            .catch((error)=>{
                let response = error.response
                this.setAlert({
                    status:true,
                    text:response.data.message,
                    color:'error',
                })
            })
        },
        calculateBill(){
            let pilihService = this.services.find((service)=>{
                return (service.service==this.service)
            })
            this.shippingCost = pilihService.cost
            this.totalBill = parseInt(this.shippingCost) + parseInt(this.totalPrice)
        },
        resetService(){
            this.service = ''
            this.services = []
            this.shippingCost = 0
            this.totalBill = 0
        },
        pay(){
            this.dialogConfirm = false
            let safeCart = JSON.stringify(this.carts)
            let fr = new FormData()
            fr.set('courier',this.courier)
            fr.set('service',this.service)
            fr.set('carts',safeCart)

            let config = {
                headers:{
                    'Authorization':'Bearer '+this.user.api_token
                }
            }

            console.log(...fr)
            console.log(config)
            
            this.axios.post('/payment',fr,config)
            .then((response)=>{
                let {data} = response
                if(data.status=="success"){
                    this.setPayment(data.data.payment_link)
                    this.setCart([])
                    let payment_link = data.data.payment_link
                    window.open(payment_link)
                    this.$router.push({path:"/orders"})
                }
                this.setAlert({
                    status:true,
                    text:data.message,
                    color:data.status
                })
            })
            .catch((error)=>{
                let {data} = error.response
                this.setAlert({
                    status:true,
                    text:data.message,
                    color:data.status,
                })
            })
        },
        cancel(){
            this.dialogConfirm=false
        }
    },
    created(){
        this.name = this.user.name
        this.address = this.user.address
        this.phone = this.user.phone
        this.city_id = parseInt(this.user.city)
        this.province_id = parseInt(this.user.province_id)

        if(this.provinces && this.provinces.length==0){
            this.axios.get('/provinces')
            .then((response)=>{
                let {data} = response.data
                this.setProvinces(data)
            })
            .catch((error)=>{
                let {data} = error.response
                console.log(data.message)
            })

            this.axios.get('/cities')
            .then((response)=>{
                let {data} = response.data
                this.setCities(data)
            })
            .catch((error)=>{
                let {data} = error.response
                console.log(data.message)
            })
        }
        if(this.couriers.length==0){
            this.axios.get('/couriers')
            .then((response)=>{
                this.couriers = response.data.data
            })
        }
    }
}
</script>