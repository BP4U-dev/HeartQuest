// Firestore helpers (compat)
(function(){
    function ensure() {
        if (!window.FB || !window.FB.db) {
            console.warn('[Firebase] Firestore not available');
            return null;
        }
        return window.FB.db;
    }

    window.FirebaseDB = {
        saveUserProfile: async function(uid, data) {
            const db = ensure(); if (!db) return null;
            return db().collection('users').doc(uid).set(data, { merge: true });
        },
        getUserProfile: async function(uid) {
            const db = ensure(); if (!db) return null;
            const doc = await db().collection('users').doc(uid).get();
            return doc.exists ? doc.data() : null;
        },
        addChatMessage: async function(roomId, message) {
            const db = ensure(); if (!db) return null;
            return db().collection('rooms').doc(roomId).collection('messages').add({
                ...message,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
    };
})();


