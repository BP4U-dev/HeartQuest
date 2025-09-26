// Auth helpers (compat)
(function(){
    function ensure() {
        if (!window.FB || !window.FB.auth) {
            console.warn('[Firebase] Auth not available');
            return null;
        }
        return window.FB.auth;
    }

    window.FirebaseAuth = {
        signUpEmail: async function(email, password) {
            const auth = ensure(); if (!auth) return null;
            return auth().createUserWithEmailAndPassword(email, password);
        },
        signInEmail: async function(email, password) {
            const auth = ensure(); if (!auth) return null;
            return auth().signInWithEmailAndPassword(email, password);
        },
        signOut: async function() {
            const auth = ensure(); if (!auth) return null;
            return auth().signOut();
        },
        onAuthStateChanged: function(cb) {
            const auth = ensure(); if (!auth) return function(){};
            return auth().onAuthStateChanged(cb);
        },
        googlePopup: async function() {
            if (!firebase.auth) return null;
            const provider = new firebase.auth.GoogleAuthProvider();
            return ensure()().signInWithPopup(provider);
        }
    };
})();


