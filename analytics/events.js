(function(){
    const STORAGE_KEY = 'hq_analytics_consent_v1';

    function getConsent() {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch(e){ return {}; }
    }

    function hasConsent(category) {
        const c = getConsent();
        if (category in c) return !!c[category];
        // default to true for essential, false for marketing
        return category === 'essential';
    }

    function safe(fn) {
        try { fn && fn(); } catch(e) { /* swallow */ }
    }

    const Events = {
        // providers toggles
        providers: {
            console: true,
            gtag: true,
            firestore: false
        },

        enableFirestoreProvider() {
            this.providers.firestore = true;
        },

        setConsent(consent) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(consent || {}));
        },

        getConsent,

        log(name, params = {}, options = {}) {
            const category = options.category || 'usage';
            if (!hasConsent(category) && category !== 'essential') return;

            // Console
            if (this.providers.console) {
                safe(() => console.log('[analytics]', name, params));
            }

            // Google Analytics (gtag)
            if (this.providers.gtag && typeof window !== 'undefined' && typeof window.gtag === 'function') {
                safe(() => window.gtag('event', name, params));
            }

            // Firestore (if enabled and available)
            if (this.providers.firestore && window.FirebaseDB && window.firebase && firebase.firestore) {
                safe(async () => {
                    const uid = (window.FB && window.FB.auth && window.FB.auth().currentUser) ? window.FB.auth().currentUser.uid : 'anon';
                    await firebase.firestore().collection('analytics_events').add({
                        name,
                        params,
                        category,
                        uid,
                        ts: firebase.firestore.FieldValue.serverTimestamp(),
                        ua: navigator.userAgent
                    });
                });
            }
        }
    };

    window.Analytics = Events;
})();


