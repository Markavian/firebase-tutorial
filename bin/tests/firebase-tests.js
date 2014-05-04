/// <reference path="firebase.d.ts" />
var FirebaseTests = (function () {
    function FirebaseTests(baseURL, authToken) {
        this.dataRef = new Firebase(baseURL);
        this.authToken = authToken;
    }
    FirebaseTests.prototype.doAuth = function (done) {
        var result = {};

        // kind of pointless, no easy way to auth without secret token
        this.dataRef.auth(this.authToken, function (error, payload) {
            if (error) {
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
    };

    FirebaseTests.prototype.doUnauth = function (done) {
        // kind of pointless, no callback available
        var self = this;
        setTimeout(function () {
            self.dataRef.unauth();
            done();
        }, 1);
        return true;
    };

    FirebaseTests.prototype.doPathCheck = function () {
        var usersRef = this.dataRef.child('users');
        var fredRef = usersRef.child('fred');
        var firstNameRef = fredRef.child('name/first');

        return firstNameRef.toString();
    };
    return FirebaseTests;
})();

function firebase_tests() {
    var FIREBASE_BASE_URL = "";

    var usersRef = new Firebase(FIREBASE_BASE_URL + '/users/');
    var fredRef = usersRef.child('fred');
    var fredFirstNameRef = fredRef.child('name/first');
    var x = fredFirstNameRef.toString();

    // x is now 'https://SampleChat.firebaseIO-demo.com/users/fred/name/first'.
    var usersRef2 = new Firebase(FIREBASE_BASE_URL + '/users/');
    var sampleChatRef = usersRef2.parent();
    var x2 = sampleChatRef.toString();

    // x is now 'https://SampleChat.firebaseIO-demo.com'.
    var y = sampleChatRef.parent();

    // y is now null, since sampleChatRef refers to the root of the Firebase.
    var fredRef2 = new Firebase(FIREBASE_BASE_URL + '/users/fred');
    var sampleChatRef2 = fredRef2.root();
    var x3 = sampleChatRef2.toString();

    // x is now 'https://SampleChat.firebaseIO-demo.com'.
    var fredRef3 = new Firebase(FIREBASE_BASE_URL + '/users/fred');
    var x4 = fredRef3.name();

    // x is now 'fred'.
    // Increment Fred's rank by 1.
    var fredRankRef = new Firebase(FIREBASE_BASE_URL + '/users/fred/rank');
    fredRankRef.transaction(function (currentRank) {
        return currentRank + 1;
    });

    // Try to create a user for wilma, but only if the user id 'wilma' isn't already taken.
    var wilmaRef = new Firebase(FIREBASE_BASE_URL + '/users/wilma');
    wilmaRef.transaction(function (currentData) {
        if (currentData === null) {
            return { name: { first: 'Wilma', last: 'Flintstone' } };
        } else {
            console.log('User wilma already exists.');
            return;
        }
    }, function (error, committed, snapshot) {
        if (error)
            console.log('Transaction failed abnormally!', error);
        else if (!committed)
            console.log('We aborted the transaction (because wilma already exists).');
        else
            console.log('User wilma added!');
        console.log('Wilma\'s data: ', snapshot.val());
    });

    // handle child add ?
    var messageListRef = new Firebase(FIREBASE_BASE_URL + '/message_list');
    var lastMessagesQuery = messageListRef.endAt().limit(500);
    lastMessagesQuery.on('child_added', function (childSnapshot) {
    });

    // handle child add ?
    var messageListRef2 = new Firebase(FIREBASE_BASE_URL + '/message_list');
    var firstMessagesQuery = messageListRef2.startAt().limit(500);
    firstMessagesQuery.on('child_added', function (childSnapshot) {
    });

    // handle user ?
    var usersRef3 = new Firebase(FIREBASE_BASE_URL + '/users');
    var usersQuery = usersRef3.startAt(1000).limit(50);
    usersQuery.on('child_added', function (userSnapshot) {
    });
}
/// <reference path="firebase-simplelogin.d.ts" />
var TestableLink = (function () {
    function TestableLink(href, text, className, clicked) {
        if (typeof href === "undefined") { href = undefined; }
        if (typeof text === "undefined") { text = "link text"; }
        if (typeof className === "undefined") { className = undefined; }
        if (typeof clicked === "undefined") { clicked = undefined; }
        this.element = document.createElement("a");

        if (href)
            this.element.setAttribute('href', href);

        if (text)
            this.element.innerHTML = text;

        if (className)
            this.element.setAttribute('class', className);

        if (clicked)
            this.element.addEventListener('click', clicked, false);

        document.body.appendChild(this.element);
    }
    return TestableLink;
})();

function firebase_simplelogin_tests() {
    var chatRef = new Firebase('https://burning-fire-3352.firebaseio.com/');
    var auth = new FirebaseSimpleLogin(chatRef, function (error, user) {
        if (error) {
            switch (error.code) {
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

    new TestableLink('#', 'Login by preset email and password', 'password', function () {
        auth.login('password', {
            email: '<email@domain.com>',
            password: '<password>',
            rememberMe: true
        });
    });

    new TestableLink('#', 'Login by facebook', 'facebook', function () {
        auth.login('facebook', {
            rememberMe: true,
            scope: 'email,user_likes'
        });
    });

    new TestableLink('#', 'Login by github', 'github', function () {
        auth.login('github', {
            rememberMe: true,
            scope: 'user,gist'
        });
    });

    new TestableLink('#', 'Login by google', 'google', function () {
        auth.login('google', {
            rememberMe: true,
            scope: 'https://www.googleapis.com/auth/plus.login'
        });
    });

    new TestableLink('#', 'Login by twitter', 'twitter', function () {
        auth.login('twitter', {
            rememberMe: true
        });
    });

    new TestableLink('#', 'Login by being anonymous', 'anonymous', function () {
        auth.login('anonymous');
    });

    /* Persona authentication in Firebase Simple Login has been deprecated. Persona will be removed as an authentication provider at the end of May, 2014 with version 2.0.0.
    
    new TestableLink('#', 'Login by persona', 'persona', function() {
    auth.login('persona', {
    rememberMe: true
    });
    });
    */
    auth.createUser(email, password, function (error, user) {
        if (!error) {
            console.log('User Id: ' + user.id + ', Email: ' + user.email);
        }
    });

    auth.changePassword(email, oldPassword, newPassword, function (error, success) {
        if (!error) {
            console.log('Password changed successfully');
        }
    });

    auth.sendPasswordResetEmail(email, function (error, success) {
        if (!error) {
            console.log('Password reset email sent successfully');
        }
    });

    auth.removeUser(email, password, function (error, success) {
        if (!error) {
            console.log('User deleted successfully');
        }
    });
}
