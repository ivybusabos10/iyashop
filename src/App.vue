<template>
    <div>
        <nav>
            <div class="container">
                <router-link to="/" class="logo">
                    <img src="/logo.png">
                    <h1>PSU</h1>
                </router-link>
                <div class="right-nav">
                    <router-link to="/" class="normal home-link" v-if="$store.state.onAdminPanel == false">Home </router-link>
                    <router-link to="/admin-panel" class="normal home-link" v-if="$store.state.onAdminPanel">Home </router-link>
                    <router-link to="/complaints" class="normal" v-if="$store.state.isClientLoggedIn || $store.state.isAdminLoggedIn">View Complaints</router-link>
                    <button class="logout" @click="logout()" v-if="$store.state.isAdminLoggedIn"><i class="fa fa-sign-out" aria-hidden="true"></i> Logout</button>
                    <button class="logout" @click="clientLogout()" v-if="$store.state.isClientLoggedIn"><i class="fa fa-sign-out" aria-hidden="true"></i> Logout</button>
                </div>
                <div class="mobile-right-nav">
                    <a href="javascript:void(0)" @click="toggleMobNav()"><i :class="(showMobNav) ? 'fa fa-times' : 'fa fa-bars'" aria-hidden="true"></i></a>
                </div>
    		</div>
    	</nav>
    	<router-view style="margin-top: 70px"/>
        <transition name="fade">
            <div class="loading-container" v-if="$store.state.isLoading"></div>
        </transition>
        <div :class="(showMobNav) ? 'mobile-overlay-nav active' : 'mobile-overlay-nav'">
            <a @click="showMobNav = false" href="/" class="normal home-link" v-if="$store.state.onAdminPanel == false">Home </a>
            <a @click="showMobNav = false" href="/admin-panel" class="normal home-link" v-if="$store.state.onAdminPanel">Home </a>
            <a @click="showMobNav = false" href="/complaints" class="normal" v-if="$store.state.isClientLoggedIn || $store.state.isAdminLoggedIn">View Complaints</a>
            <div class="logout-container" v-if="$store.state.isAdminLoggedIn">
                <a href="javascript:void(0)" @click="logout()"><i class="fa fa-sign-out" aria-hidden="true"></i> Logout</a>
            </div>
            <div class="logout-container" v-if="$store.state.isClientLoggedIn">
                <a href="javascript:void(0)" @click="clientLogout()"><i class="fa fa-sign-out" aria-hidden="true"></i> Logout</a>
            </div>
        </div>
    </div>
</template>

<script>
    import Cookie from 'js-cookie'
    import jwt from 'jsonwebtoken'
    export default{
        data() {
            return{
                showMobNav: false
            }
        },
        methods: {
            toggleMobNav() {
                let me = this
                me.showMobNav = !me.showMobNav
            },
            logout() {
                let me = this
                me.$store.state.isLoading = true
                Cookie.remove('admin-token')
                setTimeout(function() {
                    me.$store.state.isLoading = false
                    me.$store.state.isAdminLoggedIn = false
                    me.$router.push('/admin-panel')
                    me.showMobNav = false
                }, 1000)
            },
            clientLogout() {
                let me = this
                me.$store.state.isLoading = true
                Cookie.remove('client-token')
                setTimeout(function() {
                    me.$store.state.isLoading = false
                    me.$store.state.isClientLoggedIn = false
                    me.$router.push('/')
                    me.showMobNav = false
                }, 1000)
            }
        },
        mounted() {
            let me = this

            // for checking of admin auth state
            var c = Cookie.get('admin-token')
            if(c == undefined) {
                me.$store.state.isAdminLoggedIn = false
            }else{
                jwt.verify(Cookie.get('admin-token'), process.env.VUE_APP_JWT_SECRET, (err, decoded) => {
                    if(!err) {
                        me.$store.state.isAdminLoggedIn = true
                        me.$store.state.decodedAdminToken = decoded
                    }else{
                        me.$store.state.isAdminLoggedIn = false
                    }
                })
            }

            // for checking of client auth state
            var x = Cookie.get('client-token')
            if(x == undefined) {
                me.$store.state.isClientLoggedIn = false
            }else{
                jwt.verify(Cookie.get('client-token'), process.env.VUE_APP_JWT_SECRET, (err, decoded) => {
                    if(!err) {
                        me.$store.state.isClientLoggedIn = true
                        me.$store.state.decodedClientToken = decoded
                    }else{
                        me.$store.state.isClientLoggedIn = false
                    }
                })
            }
        }
    }
</script>