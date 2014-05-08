describe("Firebase ", function() {

	var AUTH_TOKEN = "12345";
	var FIREBASE_BASE_URL = "https://burning-fire-3352.firebaseio.com";
	
	var firebaseTests;
	
	beforeEach(function() {
		firebaseTests = new FirebaseTests(FIREBASE_BASE_URL, AUTH_TOKEN);
	});

	describe("auth()", function() {
		var result;
		
		beforeEach(function(done) {
			result = firebaseTests.doAuth(done);
		});
		
		it("should not be able to auth the current user", function(done) {
			expect(result.message).toBe('Login Failed!');
			done();
		});
	});

	describe("unauth()", function() {
		var result;
		
		beforeEach(function(done) {
			result = firebaseTests.doUnauth(done);
		});
		
		it("should be able to unauth the current user", function(done) {
			expect(result).toBe(true);
			done();
		});
	});
	
	describe("child() paths", function() {
		var result;
		
		beforeEach(function() {
			result = firebaseTests.doPathCheck();
		});
		
		it("should create correct subpaths for values", function() {
			expect(result).toBe(FIREBASE_BASE_URL + "/users/fred/name/first");
		});
	});

	describe("transaction()", function() {
		var result;
		
		describe("incrementing counters", function() {
			beforeEach(function(done) {
				result = firebaseTests.doTransactionTest(done);
			});
			
			it("should be able to increment the rank of Fred by 1", function(done) {
				expect(result.committed).toBe(true);
				expect(result.payload).toBe(12);
				done();
			});
		});
		
		describe("adding wilma", function() {
			beforeEach(function(done) {
				firebaseTests.doRemoveUser("wilma");
				result = firebaseTests.doAddUser("wilma", done);
			});
			
			it("should be able to create a new user named wilma", function(done) {
				expect(result.message).toBe("Creating entry for user wilma");
				expect(result.committed).toBe(true);
				expect(result.payload.name.first).toBe("Test wilma");
				done();
			});
		});
		
	});

	describe("add_child()", function() {
		it("handle adding a child to the message list.", function() {
			pending();
		});

		it("handle adding a child to a message list using a separate reference", function() {
			pending();
		});

		it("handle adding a child to the user node", function() {
			pending();
		});

	});
  
});
