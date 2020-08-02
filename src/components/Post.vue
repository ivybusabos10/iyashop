<template>
	<div class="post-template-wrapper">
		<div class="post-template">
			<div class="col left">
				<div class="info-group">
					<p class="label">Posted by:</p>
					<p class="value">{{ data.alias }}</p>
				</div>
				<div class="info-group">
					<p class="label">Occupation:</p>
					<p class="value">{{ data.way }}</p>
				</div>
				<div class="info-group">
					<p class="label">Subject:</p>
					<p class="value">{{ data.about }}</p>
				</div>
				<div class="info-group">
					<p class="label">About:</p>
					<p class="value">{{ data.target }}</p>
				</div>
				<div class="info-group" v-if="data.department.length > 0 && data.department != 'none'">
					<p class="label">Department:</p>
					<p class="value">{{ data.department }}</p>
				</div>
				<div class="info-group" v-if="data.position.length > 0 && data.position != 'none'">
					<p class="label">Position:</p>
					<p class="value">{{ data.position }}</p>
				</div>
				<div class="info-group">
					<p class="label">Date Submitted:</p>
					<p class="value">{{ data.created_at | moment("MMM DD, YYYY | hh:mm a") }}</p>
				</div>
				<div class="info-group">
					<p class="label">Status:</p>
					<p :class="(data.status == 'Pending') ? 'value pending' : 'value solved' ">{{ data.status }}</p>
				</div>
			</div>
			<div class="col right">
				<div class="info-group">
					<p class="value">{{ data.message }}</p>
				</div>
			</div>
			<button class="delete" @click="confirmDelete(data['.key'])" v-if="data.user_id == $store.state.decodedClientToken.user_id || $parent.$parent.isAdminLoggedIn"><i class="fa fa-trash-o" aria-hidden="true"></i></button>
		</div>
		<div class="post-comments">
			<button class="view" @click="showComments()"><b>Comments</b>
				&nbsp;
				<i class="fa fa-chevron-right" aria-hidden="true" v-if="hideComments"></i>
				<i class="fa fa-chevron-down" aria-hidden="true" v-if="hideComments == false"></i>
			</button>
			<div :class="(hideComments) ? 'comments-wrapper closed' : 'comments-wrapper'">
				<div class="comments-container">
					<div class="add-comment-container">
						<form @submit.prevent="addComment()">
							<!-- inline form with Alias and Body -->
							<h4>Add Comment</h4>
							<div class="form-group">
								<input type="text" name="alias" placeholder="Your Alias" v-model="alias">
							</div>
							<div class="form-group">
								<textarea rows="4" placeholder="Your Comment" v-model="comment"></textarea>
							</div>
							<div class="form-group">
								<button>Submit</button>
							</div>
						</form>
					</div>
					<div class="actual-comments-container">
						<comment v-for="comment in comments" :key="comment['.key']" :data="comment" :postid="data['.key']"></comment>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import db from '../services/firebase'
	import Comment from './Comment'
	import moment from 'moment'
	export default {
		props: ['data'],
		components: {
			Comment
		},
		data() {
			return {
				hideComments: true,
				alias: '',
				comment: '',
				comments: [],
				hasShown: false,
			}
		},
		methods: {
			showComments() {
				let me = this

				// fetch comments for this post
				if(!me.hasShown) {
					me.$parent.isLoading = true
					me.$binding('comments', db.collection('complaints').doc(me.data['.key']).collection('comments').orderBy('created_at', 'desc'))
					.then(() => {
						me.$store.state.isLoading = false
					})
					me.hasShown = true
				}

				me.hideComments = !me.hideComments
			},
			addComment() {
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

				// validate fields
				if(me.comment == '') {
					alert('Please type a Comment')
					return false
				}

				me.$store.state.isLoading = true
				db.collection('complaints').doc(me.data['.key']).collection('comments').doc().set({
					alias: (me.$store.state.isAdminLoggedIn) ? me.$store.state.decodedAdminToken.real_name : (me.alias == '') ? 'Anonymous' : me.alias,
					comment: me.comment,
					user_id: (me.$store.state.isAdminLoggedIn) ? me.$store.state.decodedAdminToken.user_id : me.$store.state.decodedClientToken.user_id,
					created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
					updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),

					// clear fields
				}).then(res => {
					me.alias = ''
					me.comment = ''
				}).catch(err => {
					alert('Sorry. Something went wrong')
					console.log(err)
				}).then(() => me.$store.state.isLoading = false)
			},
			confirmDelete(id) {
				let me = this
				var deleteme = confirm('Are you sure you want to delete this post?')
				if(deleteme) {
					me.$store.state.isLoading = true
					db.collection('complaints').doc(id).delete().then(() => {
						console.log('Deleted successfully')
					}).catch(err => {
						console.log(err)
					}).then(() => {
						me.$store.state.isLoading = false
					})
				}
			}
		}
	}
</script>
