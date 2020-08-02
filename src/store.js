import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		isClientLoggedIn: false,
		isAdminLoggedIn: false,
		decodedClientToken: '',
		decodedAdminToken: '',
		isLoading: false,
		onAdminPanel: false
	},
	mutations: {
		login(state, payload) {
			state.decodedClientToken = payload.decoded
			state.corpAccounts = payload.accounts
			state.isLoggedIn = true
		},
	},
	actions: {
		
	},
	getters: {
		
	}
})