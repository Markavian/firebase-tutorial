/// <reference path="net/mkv25/Core.ts" />
/// <reference path='com/firebase/Firebase.d.ts'/>

class FirebaseModel extends Core.Model
{
	static BASE_URL = "https://aqwtblod5tn.firebaseio-demo.com/";
	
	key: string;
	firebaseRef: Firebase;
	
	childAdded: Core.Signal;
	writeError: Core.Signal;
		
	constructor(key)
	{
		super();
		
		this.key = key;
		this.firebaseRef = new Firebase(FirebaseModel.BASE_URL + key);
		
		this.childAdded = new Core.Signal();
		this.writeError = new Core.Signal();
		
		this.registerEvents();
	}
	
	registerEvents()
	{
		var self = this;
		this.firebaseRef.on('value', function(snapshot) {
			self.value = snapshot.val();
			self.changed.dispatch(self.value);
		});
		
		this.firebaseRef.on('child_added', function(snapshot) {
			self.value = snapshot.val();
			self.childAdded.dispatch(self.value);
		});
	}
	
	write(value:any)
	{
		this.value = value;
		
		var self = this;
		this.firebaseRef.set(value, function(error) {
			self.writeError.dispatch(error);
		});
		this.changed.dispatch(this.value);
	}
}