<template>
	<div class="complaints-component">
		<table id="complaints-table">
			<thead>
				<tr>
					<th>Status</th>
					<th>Show on Public?</th>
					<th class="sortable" @click="sort(1)">Submitted By <i class="fa fa-sort" aria-hidden="true"></i></th>
					<th class="sortable" @click="sort(2)">Alias <i class="fa fa-sort" aria-hidden="true"></i></th>
					<th class="sortable" @click="sort(3)">What <i class="fa fa-sort" aria-hidden="true"></i></th>
					<th class="sortable" @click="sort(4)">About <i class="fa fa-sort" aria-hidden="true"></i></th>
					<th class="sortable" @click="sort(5)">Target <i class="fa fa-sort" aria-hidden="true"></i></th>
					<th class="sortable" @click="sort(6)">Date Submitted <i class="fa fa-sort" aria-hidden="true"></i></th>
					<th class="sortable" @click="sort(7)">Date Last Updated <i class="fa fa-sort" aria-hidden="true"></i></th>
					<th class="sortable" @click="sort(8)">Message <i class="fa fa-sort" aria-hidden="true"></i></th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				<tr class="complaints-item" v-for="c in complaints" v-if="c.target == $store.state.decodedAdminToken.adminFor || $store.state.decodedAdminToken.adminFor == 'All' || c.department == $store.state.decodedAdminToken.dept || c.position == $store.state.decodedAdminToken.dept">
					<td>
						<div class="form-group status">
							<select :value="c.status" @change="updateStatus($event, c['.key'])">
								<option>Pending</option>
								<option>Solved</option>
							</select>
						</div>
					</td>
					<td>
						<label class="switch">
							<input type="checkbox" :checked="c.showToPublic" @change.prevent="toggleShowToPublic($event,c['.key'], c.showToPublic)">
							<span class="slider round"></span>
						</label>
					</td>
					<td>{{ c.real_name }}</td>
					<td>{{ c.alias }}</td>
					<td>{{ c.way }}</td>
					<td>{{ c.about }}</td>
					<td>{{ c.target }}
						<span v-if="c.target == 'Instructor' && c.department && c.department != 'none'">({{ c.department }})</span>
						<span v-if="c.target == 'Staff' && c.position && c.position != 'none'">({{ c.position }})</span>
					</td>
					<td>{{ c.created_at }}</td>
					<td>{{ c.updated_at }}</td>
					<td>{{ c.message | str_limit }} <button class="view-message" @click="viewMessage(c.message)"><i class="fa fa-eye" aria-hidden="true"></i> View</button></td>
					<td>
						<button @click="confirmDelete(c['.key'])"><i class="fa fa-trash" aria-hidden="true"></i> Delete</button>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
	import db from '../../services/firebase'
	import $ from 'jquery'
	export default{
		data() {
			return{
				complaints: []
			}
		},
		filters: {
			str_limit(str) {
				if(str.length >= 10) {
					let x = str.substr(0, 10) + ' ...'
					return x
				} else {
					return str
				}
			},
		},
		methods: {
			updateStatus (e, id) {
				let me = this
				let el = e.target

				let status = $(el).val()

				me.$store.state.isLoading = true
				db.collection('complaints').doc(id).update({
					status: status
				}).then(res => {
					console.log(res)
				}).catch(err => {
					console.log('Error: '+err)
				}).then(() => {
					me.$store.state.isLoading = false
				})
			},
			toggleShowToPublic(e, id, show) {
				let me = this
				let el = e.target

				me.$store.state.isLoading = true
				// check if I am currently shown to public
				db.collection('complaints').doc(id).update({
					showToPublic: !show
				}).then(res => {
					console.log(res)
				}).catch(err => {
					console.log('Error: '+err)
				}).then(() => {
					me.$store.state.isLoading = false
				})
			},
			viewMessage(message) {
				let me = this
				me.$parent.message = message
				me.$parent.showMessageModal = true
			},
			sort(target) {
				sortHTML('#complaints-table','.complaints-item', 'td:nth-child('+target+')')
			},
			confirmDelete(id) {
				let me = this
				let deleteme = confirm('Are you sure you want to delete this post?')
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
		},
		mounted() {
			let me = this
			me.$store.state.isLoading = true
			me.$binding('complaints', db.collection('complaints').orderBy('created_at', 'desc'))
			.then(() => {
				me.$store.state.isLoading = false
			})
		}
	}

	function sortHTML(id, sel, sortvalue) {
	  var a, b, i, ii, y, bytt, v1, v2, cc, j;
	  // var a = getElements(id);
	  if (typeof id == "object") {
	    a = [id];
	  } else {
	    a = document.querySelectorAll(id);
	  }

	  for (i = 0; i < a.length; i++) {
		for (j = 0; j < 2; j++) {
		  cc = 0;
		  y = 1;
		  while (y == 1) {
			y = 0;
			b = a[i].querySelectorAll(sel);
			for (ii = 0; ii < (b.length - 1); ii++) {
			  bytt = 0;
			  if (sortvalue) {
				v1 = b[ii].querySelector(sortvalue).innerHTML.toLowerCase();
				v2 = b[ii + 1].querySelector(sortvalue).innerHTML.toLowerCase();
			  } else {
				v1 = b[ii].innerHTML.toLowerCase();
				v2 = b[ii + 1].innerHTML.toLowerCase();
			  }
			  if ((j == 0 && (v1 > v2)) || (j == 1 && (v1 < v2))) {
				bytt = 1;
				break;
			  }
			}
			if (bytt == 1) {
			  b[ii].parentNode.insertBefore(b[ii + 1], b[ii]);
			  y = 1;
			  cc++;
			}
		  }
		  if (cc > 0) {break;}
		}
	  }
	}
</script>
