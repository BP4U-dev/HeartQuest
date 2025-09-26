(function(){
    if (!window.FIREBASE_CONFIG) {
        console.warn('[Firebase] FIREBASE_CONFIG missing. Define window.FIREBASE_CONFIG before init.');
        return;
    }
    if (typeof firebase === 'undefined' || !firebase.initializeApp) {
        console.warn('[Firebase] SDK not loaded. Include firebase-app.js before init.');
        return;
    }
    try {
        if (!firebase.apps || !firebase.apps.length) {
            firebase.initializeApp(window.FIREBASE_CONFIG);
            console.log('[Firebase] Initialized');
        }
        window.FB = {
            app: firebase.app(),
            auth: (firebase.auth ? firebase.auth() : null),
            db: (firebase.firestore ? firebase.firestore() : null),
            storage: (firebase.storage ? firebase.storage() : null)
        };
    } catch (e) {
        console.error('[Firebase] Init error:', e);
    }
})();


