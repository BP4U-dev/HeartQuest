// Storage helpers (compat)
(function(){
    function ensure() {
        if (!window.FB || !window.FB.storage) {
            console.warn('[Firebase] Storage not available');
            return null;
        }
        return window.FB.storage;
    }

    window.FirebaseStorage = {
        uploadUserAvatar: async function(uid, file) {
            const storage = ensure(); if (!storage) return null;
            const ref = storage().ref().child(`avatars/${uid}/${file.name}`);
            const snap = await ref.put(file);
            return snap.ref.getDownloadURL();
        }
    };
})();


