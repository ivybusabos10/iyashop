<template>
	<div class="complaints-component">
		<div class="form-group search-user">
			<input type="text" name="search" id="search-query" placeholder="Search" @keyup="filter()">
		</div>
		<table id="complaints-table">
			<thead>
				<tr>
					<th>Database ID</th>
					<th>Enabled</th>
					<th class="sortable" @click="sort(1)">ID Number / Username <i class="fa fa-sort" aria-hidden="true"></i></th>
					<th class="sortable" @click="sort(2)">Fullname <i class="fa fa-sort" aria-hidden="true"></i></th>
					<th class="sortable" @click="sort(3)">Email <i class="fa fa-sort" aria-hidden="true"></i></th>
					<th class="sortable" @click="sort(4)">Date Registered <i class="fa fa-sort" aria-hidden="true"></i></th>
					<th class="sortable" @click="sort(5)">Last Updated <i class="fa fa-sort" aria-hidden="true"></i></th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				<tr class="complaints-item" v-for="user in users" v-if="user.idnumber != 'superadmin'">
					<td><a :href="'https://console.firebase.google.com/project/psuc-2d75e/database/firestore/data~2Fusers~2F' + user['.key']" target="_blank">{{ user['.key'] }}</a></td>
					<td>
						<label class="switch">
							<input type="checkbox" :checked="user.approved" @change.prevent="toggleApproved($event, user['.key'], user.approved)">
							<span class="slider round"></span>
						</label>
					</td>
					<td>{{ user.idnumber }}</td>
					<td>{{ user.fullname }}</td>
					<td>{{ user.email }}</td>
					<td>{{ user.created_at }}</td>
					<td>{{ user.updated_at }}</td>
					<td>
						<button @click="confirmDelete(user['.key'])"><i class="fa fa-trash" aria-hidden="true"></i> Delete</button>
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
				users: [],
				search_query: ''
			}
		},
		watch: {
			search_query: function(newsearch_query, oldsearch_query) {
				let me = this
				var input, filter, table, tr, td, i, txtValue
				input = newsearch_query
				filter = input.toUpperCase()
				table = document.getElementById("complaints-table")
				tr = table.getElementsByTagName("tr")
				for (i = 0; i < tr.length; i++) {
				    td = tr[i].getElementsByTagName("td")[0]
				    if (td) {
						txtValue = td.textContent || td.innerText
						if (txtValue.toUpperCase().indexOf(filter) > -1) {
				        	tr[i].style.display = ""
				      	} else {
				        	tr[i].style.display = "none"
				    	}
				    }       
				}
			}
		},
		methods: {
			filter () {
				filter()
			},
			toggleApproved(e, id, approved) {
				let me = this
				let el = e.target

				me.$store.state.isLoading = true
				// check if I am currently shown to public
				db.collection('users').doc(id).update({
					approved: !approved
				}).then(res => {
					console.log(res)
				}).catch(err => {
					console.log('Error: '+err)
				}).then(() => {
					me.$store.state.isLoading = false
				})
			},
			sort(target) {
				sortHTML('#complaints-table','.complaints-item', 'td:nth-child('+target+')')
			},
			confirmDelete(id) {
				let me = this
				let deleteme = confirm('Are you sure you want to delete this post?')
				if(deleteme) {
					me.$store.state.isLoading = true
					db.collection('users').doc(id).delete().then(() => {
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
			me.$binding('users', db.collection('users').orderBy('created_at', 'desc'))
			.then(() => {
				me.$store.state.isLoading = false
			})
		}
	}

	function filter () {
	    var value = $('#search-query').val().toLowerCase();
	    $("#complaints-table tr").filter(function() {
	      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
	    });
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