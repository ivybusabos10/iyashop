<template>
	<div class="home admin-panel">
		<div class="container" v-if="$store.state.isClientLoggedIn || $store.state.isAdminLoggedIn">
			<form @submit.prevent="submitComplaint()">
				<div class="form-group">
					<label>Your Alias (to be shown on "<router-link to="/complaints">View Complaints</router-link>" section)</label>
					<input type="text" v-model="alias" name="alias" placeholder="anon623" v-validate="'required'">
				</div>
				<div class="form-group">
					<label>What is this all about? *</label>
					<select v-model="about" v-validate="'excluded:none'">
						<option value="none" style="display: none">Please select</option>
						<option>Complaint</option>
						<option>Compliment</option>
						<option>Suggestion</option>
					</select>
				</div>
				<div class="form-group">
					<label>What/Who is the subject of your concern? *</label>
					<select name="target" v-model="target" v-validate="'excluded:none'">
						<option value="none" style="display: none">Please select</option>
						<option>Facilities</option>
						<option>Instructor</option>
						<option>System</option>
						<option>Portal</option>
						<option>Staff</option>
						<option>Event</option>
					</select>
				</div>
				<div class="form-group" v-if="target == 'Instructor'">
					<label>Department *</label>
					<select name="target" v-model="department" v-validate="'excluded:none'">
						<option value="none" style="display: none">Please select</option>
						<option>College of Computing Sciences (CCS)</option>
						<option>College of Technology (CT)</option>
						<option>College of Education (CE)</option>
						<option>College of Hospitality Management (CHM)</option>
						<option>College of Business and Public Administration (CBPA)</option>
						<option>College of Art Sciences and Letters (CASL)</option>
					</select>
				</div>
				<div class="form-group" v-if="target == 'Staff'">
					<label>Position *</label>
					<select name="target" v-model="position" v-validate="'excluded:none'">
						<option value="none" style="display: none">Please select</option>
						<option>Cashier</option>
						<option>Administrator</option>
					</select>
				</div>
				<div class="form-group">
					<label>Your Complaint *</label>
					<textarea rows="6" placeholder="Type your concern" v-model="message" name="message" v-validate="'required'"></textarea>
				</div>
				<div class="captcha-container">
                    <vue-recaptcha class="g-recaptcha" sitekey="6Lc2nnYUAAAAAHlEIu1w9cM0iNPbwv2cj0dQS8rm"></vue-recaptcha>
                </div>
				<div class="buttons-container">
					<button type="submit">Submit</button>
					<button class="reset" type="button" @click="reset()">Reset Form</button>
				</div>
			</form>
		</div>
		<div v-if="$store.state.isAdminLoggedIn == false">
			<div class="container login-container" v-if="$store.state.isClientLoggedIn == false && authState == 1">
				<img src="/logo.png" class="logo">
				<p class="h3">User Login</p>
				<form @submit.prevent="clientLogin()">
					<div class="form-group">
						<input type="text" placeholder="Username (ID Number)" v-model="login.username" autofocus>
					</div>
					<div class="form-group">
						<input type="password" placeholder="Password" v-model="login.password">
					</div>
					<div class="form-group">
						<button type="submit">Login</button>
						<div class="not">
							Don't have an account? <a href="javascript:void()" @click="authState = 2">Click here to register</a>
						</div>
					</div>
				</form>
			</div>
			<div class="container login-container" v-if="$store.state.isClientLoggedIn == false && authState == 2">
				<img src="/logo.png" class="logo">
				<p class="h3">Register</p>
				<form @submit.prevent="clientRegister()">
					<div class="form-group">
						<input type="text" placeholder="Your ID Number (to be verified by admin)" v-model="reg.idnumber" name="reg_idnumber" autofocus v-validate="'required'">
						<span class="validation-errors">{{ errors.first('reg_idnumber') }}</span>
					</div>
					<div class="form-group">
						<input type="text" placeholder="Fullname" v-model="reg.fullname" name="reg_fullname" v-validate="'required|alpha_spaces'">
						<span class="validation-errors">{{ errors.first('reg_fullname') }}</span>
					</div>
					<div class="form-group">
						<input type="text" placeholder="Email" v-model="reg.email" name="reg_email" v-validate="'required|email'">
						<span class="validation-errors">{{ errors.first('reg_email') }}</span>
					</div>
					<div class="form-group">
						<select name="way" v-validate="'excluded:0'" v-model="reg.way">
							<option value="0" disabled>What are you?</option>
							<option>Student</option>
							<option>Staff</option>
							<option>Faculty</option>
							<option>Graduate</option>
						</select>
						<span class="validation-errors">{{ (errors.first('way')) ? 'This field is required' : '' }}</span>
					</div>
					<div class="form-group">
						<input type="password" placeholder="Password" v-model="reg.password" name="reg_password" v-validate="'required|min:8'" ref="reg_password">
						<span class="validation-errors">{{ errors.first('reg_password') }}</span>
					</div>
					<div class="form-group">
						<input type="password" placeholder="Confirm Password" v-model="reg.password2" name="reg_password2" v-validate="'required||confirmed:reg_password'">
						<span class="validation-errors">{{ errors.first('reg_password2') }}</span>
					</div>
					<div class="form-group">
						<button type="submit">Submit</button>
						<div class="not">
							Already have an account? <a href="javascript:void()" @click="authState = 1">Click here to login</a>
						</div>
					</div>
				</form>
			</div>
		</div>
		</div>
	</div>
</template>

<script>
	import db from '../services/firebase'
	import $ from 'jquery'
	import jwt from 'jsonwebtoken'
	import Cookie from 'js-cookie'
	import moment from 'moment'
	import { Base64 } from 'js-base64'
	import VueRecaptcha from 'vue-recaptcha'

	export default{
		components: {
			VueRecaptcha
		},
		data () {
			return{
				// data to submit
				about: 'none',
				target: 'none',
				message: '',
				ip: '',
				name: '',
				alias: '',

				department: 'none',
				position: 'none',

				// others
				authState: 1,

				// for login
				login: {
					username: '',
					password: ''
				},

				// for registration
				reg: {
					idnumber: '',
					username: '',
					fullname: '',
					email: '',
					password: '',
					password2: '',
					way: 0
				}
			}
		},
		methods: {
			clientLogin() {
				let me = this
				me.$store.state.isLoading = true
				db.collection('users')
				.where('idnumber', '==', me.login.username)
				.where('password', '==', me.login.password)
				.where('role', '==', 0)
				.where('approved', '==', true)
				.get().then(res => {
					if(!res.empty) { // if matched

						me.$store.state.isAdminLoggedIn = false
						Cookie.remove('admin-token')

						let encoded = jwt.sign({
							user_id: (me.$store.state.isAdminLoggedIn) ? 'superadmin' : res.docs[0].id,
							idnumber: (me.$store.state.isAdminLoggedIn) ? 'superadmin' : res.docs[0].data().idnumber,
							real_name: (me.$store.state.isAdminLoggedIn) ? 'superadmin' : res.docs[0].data().fullname,
							way: (me.$store.state.isAdminLoggedIn) ? 'superadmin' : res.docs[0].data().way,
						}, process.env.VUE_APP_JWT_SECRET, { expiresIn: '24h' })
						Cookie.set('client-token', encoded)
						me.$store.state.isClientLoggedIn = true

						jwt.verify(Cookie.get('client-token'), process.env.VUE_APP_JWT_SECRET, (err, decoded) => {
		                    me.$store.state.decodedClientToken = decoded
			            })
					}else{
						alert('Invalid credentials or your account has not been approved by the administrator. Please try again.')
						Cookie.remove('client-token')
						me.$store.state.isClientLoggedIn = false
					}
				}).catch(err => {
					console.log('Error: '+err)
				}).then(() => {
					me.$store.state.isLoading = false
				})
			},
			clientRegister() {
				let me = this
				// validation here
				me.$validator.validate().then(res => {
					if(!res) { // do not proceed
						die()
					}else{
						// check if data exists
						me.$store.state.isLoading = true
						db.collection('users')
						.where('idnumber', '==', me.reg.idnumber)
						.get().then(res => {
							if(!res.empty) { // if exists
								alert('Sorry. It seems like the ID Number you provided is already registered')
							}else{ // if doesnt exits
								db.collection('users').doc().set({
									idnumber: me.reg.idnumber,
									fullname: me.reg.fullname,
									email: me.reg.email,
									password: me.reg.password,
									role: 0,
									approved: true,
									created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
									updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
									way: me.reg.way
								}).then(() => {
									alert('Thank you for registering. The admin will approve your account within 24 hours.')
									me.reg.idnumber = ''
									me.reg.fullname = ''
									me.reg.email = ''
									me.reg.password = ''
									me.reg.password2 = ''
								}).catch(err => {
									console.log('Error: '+err)
								})
							}
						}).catch(err => { console.log('Error: '+error) })
						.then(() => {
							me.$store.state.isLoading = false
						})

					}
				})
				// end
			},
			submitComplaint() {
				let me = this

				// check if alias contains the admin word
				let aliasSTR = me.alias
				aliasSTR = aliasSTR.toLowerCase()
				let aliasCheck = aliasSTR.search('admin')
				if(me.alias != '') {
					if(aliasCheck >= 0) {
						alert('Invalid Alias')
						die()
					}
				}

                if(grecaptcha.getResponse().length < 1){
                    alert('Please verify that you are a human.')
                    die()
                }

				// validate
				me.$validator.validate().then(res => {
					if (res == false) { // if error
						alert('Please fill up all required fields correctly')
					} else {
						me.setLoading(true)

						// saving here
						let userID = me.$store.state.decodedClientToken.user_id
						let way = me.$store.state.decodedClientToken.way
						let realName = me.$store.state.decodedClientToken.real_name
						let idnumber = me.$store.state.decodedClientToken.idnumber
						db.collection('complaints').doc().set({
							alias: (me.alias == '') ? 'Anonymous' : me.alias,
							way: way,
							about: me.about,
							target: me.target,
							message: me.message,
							user_id: userID,
							showToPublic: true,
							real_name: realName,
							department: me.department,
							position: me.position,
							created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
							updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
							status: 'Pending',
							idnumber: idnumber
						}).then(() => {
							console.log('Success')
							alert('Thank you for submitting your concern.')
						}).catch(err => {
							console.log('Error: '+err)
						}).then(() => {
							me.setLoading(false)
							me.reset()
							me.$validator.reset()
							me.errors.clear()
						})
					}
				}).catch(err => console.log(err))
			},
			reset() {
				let me = this
				$('body select').removeClass('has-errors')
				$('body textarea').removeClass('has-errors')
				me.way = 'none'
				me.about = 'none'
				me.target = 'none'
				me.message = ''
				me.name = ''
				me.alias = ''
			},
			setLoading(val) {
				this.$store.state.isLoading = val
			},
			adminLogout() {
                let me = this
                me.$store.state.isLoading = true
                Cookie.remove('admin-token')
                me.$store.state.isLoading = false
                me.$store.state.isAdminLoggedIn = false
            }
		},
		mounted() {
			let me = this
			me.$parent.onAdminPanel = false
		}
	}

	$('body').on('change', 'select', function() {
		$(this).removeClass('has-errors')
	})
	$('body').on('change', 'input', function() {
		$(this).removeClass('has-errors')
	})
	$('body').on('change', 'textarea', function() {
		$(this).removeClass('has-errors')
	})
</script>
