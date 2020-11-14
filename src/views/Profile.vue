<template>
    <div>
        <v-subheader>Your Profile</v-subheader>
            <v-card flat>
                <v-container>
                    <v-simple-table>
                        <tbody>
                            <tr v-for="(value,key) in user_profile" :key="key">
                                <td>{{key}}</td>
                                <td v-if="key=='Avatar'">
                                    <v-img :src="getImage('/users/',user.avatar)" max-width="100" max-height="200"></v-img>
                                </td>
                                <td v-else>{{value}}</td>
                            </tr>
                        </tbody>
                    </v-simple-table>
                </v-container>
            </v-card>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
    computed:{
        ...mapGetters({
            user_profile:'auth/user_profile',
            user:'auth/user'
        }),
    },
}
</script>