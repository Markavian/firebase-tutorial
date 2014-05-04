/// <reference path="firebase-simplelogin.d.ts" />

class TestableLink {
    element: HTMLElement;
    constructor(href: string = undefined, text: string = "link text", className: string = undefined, clicked: any = undefined) {
        this.element = document.createElement("a");
        
        if(href)
            this.element.setAttribute('href', href);
            
        if(text)
            this.element.innerHTML = text;
            
        if(className)
            this.element.setAttribute('class', className);
            
        if(clicked) 
            this.element.addEventListener('click', clicked, false);
        
        document.body.appendChild(this.element);
    }
}

function firebase_simplelogin_tests() {
    
	var chatRef: Firebase = new Firebase('https://burning-fire-3352.firebaseio.com/');
	var auth: FirebaseSimpleLogin = new FirebaseSimpleLogin(chatRef, function(error, user) {
		if (error) {
			// an error occurred while attempting login
			switch(error.code) {
				case 'INVALID_EMAIL':
				case 'INVALID_PASSWORD':
				default:
			}
		} else if (user) {
			// user authenticated with Firebase
			console.log('User ID: ' + user.id + ', Provider: ' + user.provider);
		} else {
			// user is logged out
		}
	});

	var email = 'my@email.com';
	var password = 'secret';
	var oldPassword = 'secret';
	var newPassword = 'secret';

	new TestableLink('#', 'Login by preset email and password', 'password', function() {
		auth.login('password', {
			email: '<email@domain.com>',
			password: '<password>',
			rememberMe: true
		});
	});

	new TestableLink('#', 'Login by facebook', 'facebook', function() {
		auth.login('facebook', {
			rememberMe: true,
			scope: 'email,user_likes'
		});
	});

	new TestableLink('#', 'Login by github', 'github', function() {
		auth.login('github', {
			rememberMe: true,
			scope: 'user,gist'
		});
	});

	new TestableLink('#', 'Login by google', 'google', function() {
		auth.login('google', {
			rememberMe: true,
			scope: 'https://www.googleapis.com/auth/plus.login'
		});
	});

	new TestableLink('#', 'Login by twitter', 'twitter', function() {
		auth.login('twitter', {
			rememberMe: true
		});
	});


	new TestableLink('#', 'Login by being anonymous', 'anonymous', function() {
		auth.login('anonymous');
	});

	/* Persona authentication in Firebase Simple Login has been deprecated. Persona will be removed as an authentication provider at the end of May, 2014 with version 2.0.0.

	new TestableLink('#', 'Login by persona', 'persona', function() {
		auth.login('persona', {
			rememberMe: true
		});
	});
	*/

	auth.createUser(email, password, function(error, user) {
		if (!error) {
			console.log('User Id: ' + user.id + ', Email: ' + user.email);
		}
	});

	auth.changePassword(email, oldPassword, newPassword, function(error, success) {
		if (!error) {
			console.log('Password changed successfully');
		}
	});

	auth.sendPasswordResetEmail(email, function(error, success) {
		if (!error) {
			console.log('Password reset email sent successfully');
		}
	});

	auth.removeUser(email, password, function(error, success) {
		if (!error) {
			console.log('User deleted successfully');
		}
	});
}
