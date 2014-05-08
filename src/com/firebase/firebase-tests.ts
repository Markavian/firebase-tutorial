/// <reference path="firebase.d.ts" />
	
class FirebaseTests {
	dataRef: Firebase;
	authToken: string;
	
	constructor(baseURL, authToken) {
		this.dataRef = new Firebase(baseURL);
		this.authToken = authToken;
	}
	
	doAuth(done) {
		var result:any = {};
		
		// kind of pointless, no easy way to auth without secret token
		this.dataRef.auth(this.authToken, function(error, payload) {
			if(error) {
				result.message = "Login Failed!";
				result.error = error;
			} else {
				result.message = "Authenticated successfully";
				result.payload = payload.auth;
				result.expires = new Date(payload.expires * 1000);
			}
			done();
		});
		
		return result;
	}
	
	doUnauth(done) {
		// kind of pointless, no callback available
		var self = this;
		setTimeout(function() {
			self.dataRef.unauth();
			done();
		}, 1);
		return true;
	}
	
	doPathCheck():string {
		var usersRef:Firebase = this.dataRef.child('users');
		var fredRef:Firebase = usersRef.child('fred');
		var firstNameRef:Firebase = fredRef.child('name/first');
		
		return firstNameRef.toString(); // should return this.baseUrl + '/usrs/fred/name/first';
	}
	
	doTransactionTest(done) {
		var result:any = {};
		
		var fredRankRef:Firebase = this.dataRef.child('users/fred/rank');
		fredRankRef.set(11);
		
		fredRankRef.transaction(
			function(currentRank:number) {
				// the useful work
				return currentRank + 1;
			},
			function(error: any, committed: boolean, snapshot: IFirebaseDataSnapshot) {
				// the result of the transaction
				result.error = error;
				result.committed = committed;
				result.payload = snapshot.val();
				done();
			}
		);
		
		return result;
	}
	
	doRemoveUser(name, done) {
		var result:any = {};
		
		var userRef:Firebase = this.dataRef.child('users/' + name);
		userRef.remove(function(error: any) {
			if(error) {
				console.log(error);
				result.error = error;
			}
			
			if(done) {
				done();
			}
			
			result.success = true;
		});
		
		return result;
	}
	
	doAddUser(name, done) {
		var result:any = {};
		
		var userRef:Firebase = this.dataRef.child('users/' + name);
		
		userRef.transaction(
			function(currentData) {
				// attempt to create the user, based on existing information
				if (currentData === null) {
					result.message = "Creating entry for user " + name;
					return { name: {first: 'Test ' + name, last: 'Flintstone'} };
				} else {
					result.message = "User " + name + " already exists";
					return; // Abort the transaction.
				}
			},
			function(error: any, committed: boolean, snapshot: IFirebaseDataSnapshot) {
				// the result of the transaction
				result.error = error;
				result.committed = committed;
				result.payload = snapshot.val();
				done();
			}
		);
		
		return result;
	}
}

function firebase_tests() {

	var FIREBASE_BASE_URL = "";
	
	var usersRef:Firebase = new Firebase(FIREBASE_BASE_URL + '/users/');
	var fredRef:Firebase = usersRef.child('fred');
	var fredFirstNameRef:Firebase = fredRef.child('name/first');
	var x:string = fredFirstNameRef.toString();
	// x is now 'https://SampleChat.firebaseIO-demo.com/users/fred/name/first'.

	var usersRef2:Firebase = new Firebase(FIREBASE_BASE_URL + '/users/');
	var sampleChatRef:Firebase = usersRef2.parent();
	var x2:string = sampleChatRef.toString();
	// x is now 'https://SampleChat.firebaseIO-demo.com'.
	var y:Firebase = sampleChatRef.parent();
	// y is now null, since sampleChatRef refers to the root of the Firebase.

	var fredRef2:Firebase = new Firebase(FIREBASE_BASE_URL + '/users/fred');
	var sampleChatRef2 :Firebase = fredRef2.root();
	var x3:string = sampleChatRef2.toString();
	// x is now 'https://SampleChat.firebaseIO-demo.com'.

	var fredRef3:Firebase = new Firebase(FIREBASE_BASE_URL + '/users/fred');
	var x4:string = fredRef3.name();
	// x is now 'fred'.

	// Increment Fred's rank by 1.
	var fredRankRef:Firebase = new Firebase(FIREBASE_BASE_URL + '/users/fred/rank');
	fredRankRef.transaction(function(currentRank: number) {
	  return currentRank+1;
	});

	// Try to create a user for wilma, but only if the user id 'wilma' isn't already taken.
	var wilmaRef: Firebase = new Firebase(FIREBASE_BASE_URL + '/users/wilma');
	wilmaRef.transaction(function(currentData) {
        if (currentData === null) {
          return {name: {first: 'Wilma', last: 'Flintstone'} };
        } else {
          console.log('User wilma already exists.');
          return; // Abort the transaction.
        }
      }, 
      
      function(error: any, committed: boolean, snapshot: IFirebaseDataSnapshot) {
        if (error)
          console.log('Transaction failed abnormally!', error);
        else if (!committed)
          console.log('We aborted the transaction (because wilma already exists).');
        else
          console.log('User wilma added!');
        console.log('Wilma\'s data: ', snapshot.val());
      }
    );

    // handle child add ?
	var messageListRef: Firebase = new Firebase(FIREBASE_BASE_URL + '/message_list');
	var lastMessagesQuery:IFirebaseQuery = messageListRef.endAt().limit(500);
	lastMessagesQuery.on('child_added', function(childSnapshot: IFirebaseDataSnapshot) { /* handle child add */ });

    // handle child add ?
	var messageListRef2:Firebase = new Firebase(FIREBASE_BASE_URL + '/message_list');
	var firstMessagesQuery:IFirebaseQuery = messageListRef2.startAt().limit(500);
	firstMessagesQuery.on('child_added', function(childSnapshot: IFirebaseDataSnapshot) { /* handle child add */ });

    // handle user ?
	var usersRef3: Firebase = new Firebase(FIREBASE_BASE_URL + '/users');
	var usersQuery: IFirebaseQuery = usersRef3.startAt(1000).limit(50);
	usersQuery.on('child_added', function(userSnapshot: IFirebaseDataSnapshot) { /* handle user */ });

}
