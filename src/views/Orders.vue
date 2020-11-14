<template>
    <div>
        <v-subheader>History Belanja</v-subheader>
        <v-card flat>
            <v-container>
                <v-simple-table dense>
                    <tbody>
                        <tr v-for="item in items" :key="item.id">
                            <td>
                                Invoice : {{item.invoice_number}}
                                <div class="primary--text title">Rp {{parseInt(item.total_bill).toLocaleString('id-ID')}}</div>
                                <small>date : {{formatDateTime(item.updated_at,2)}}. courier : {{item.courier_service}}</small>
                            </td>
                            <td>
                                {{item.status}}
                            </td>
                        </tr>
                    </tbody>
                </v-simple-table>
            </v-container>
        </v-card>
    </div>
</template>

<script>
import {mapGetters,mapActions} from 'vuex'
// import {DateTime} from 'luxon'
export default {
    data(){
        return {
            items:[],
        }
    },
    computed:{
        ...mapGetters({
            user:'auth/user',
        })
    },
    methods:{
        ...mapActions({
            setAlert:'alert/set',
        }),
        stringToDate(_date,_format,_delimiter){
            let formatLowerCase = _format.toLowerCase()
            let formatItems=formatLowerCase.split(_delimiter)
            let dateItems = _date.split(_delimiter)
            let monthIndex = formatItems.indexOf("mm")
            let dayIndex = formatItems.indexOf("dd")
            let yearIndex = formatItems.indexOf("yyyy")
            let month = parseInt(dateItems[monthIndex])
            month -= 1
            let formatedDate = new Date(dateItems[yearIndex],month,dateItems[dayIndex])
            console.log(formatLowerCase)
            console.log(dateItems)
            return formatedDate
        },
    },
    mounted(){
        let config = {
            headers:{
                'Authorization' : 'Bearer ' + this.user.api_token
            }
        }
        // console.log(config)
        this.axios.post('/myorder',{},config)
        .then((response)=>{
            let{data}=response.data
            this.items=data
            console.log(this.items)
        })
        .catch((error)=>{
            let{data}=error.response
            this.setAlert({
                status:true,
                text:data.message,
                color:'error',
            })
        })
    }
}
</script>