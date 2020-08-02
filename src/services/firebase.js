import Firebase from 'firebase'
import 'firebase/firestore'

let config = {
	apiKey: "AIzaSyC3aDiO3xZfo7ValFzLtbgmdvFIf4_oSgw",
    authDomain: "iyashop.firebaseapp.com",
    databaseURL: "https://iyashop.firebaseio.com",
    projectId: "iyashop",
    storageBucket: "iyashop.appspot.com",
    messagingSenderId: "587188050699",
}

let firebaseApp = Firebase.initializeApp(config)
const firestore = firebaseApp.firestore()

firestore.settings({
	timestampsInSnapshots: true
})

export default firestore