<template>
    <div class="container">
        <alert v-for="alert in alerts" :alert="alert" :timeout="7000" v-on:close="removeAlert">
            {{alert.text}}
        </alert>
    </div>

    <router-view></router-view>
</template>

<script type="text/ecmascript-6">
    import {store} from '../store'
    import Alert from './Alert.vue'

    export default {
        components: {
            Alert
        },

        computed: {
            alerts() {
                return store.state.alerts
            }
        },

        methods: {
            removeAlert: store.actions.removeAlert
        }
    }
</script>