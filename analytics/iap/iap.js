(function(){
    const STORAGE_KEY = 'hq_iap_entitlements_v1';

    const defaultCatalog = [
        { id: 'coins_1000', title: '1,000 Coins', price: 4.99, currency: 'USD', type: 'consumable' },
        { id: 'vip_month', title: 'VIP Monthly', price: 9.99, currency: 'USD', type: 'subscription' },
        { id: 'dragon_mount', title: 'Dragon Mount', price: 14.99, currency: 'USD', type: 'non_consumable' }
    ];

    function loadEntitlements() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        } catch(e) {
            return {};
        }
    }

    function saveEntitlements(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    const IAP = {
        _catalog: defaultCatalog,
        _onPurchase: null,
        _onError: null,

        init(opts = {}) {
            if (Array.isArray(opts.products)) this._catalog = opts.products;
            if (typeof opts.onPurchase === 'function') this._onPurchase = opts.onPurchase;
            if (typeof opts.onError === 'function') this._onError = opts.onError;
        },

        getCatalog() {
            return this._catalog.slice();
        },

        hasEntitlement(productId) {
            const ent = loadEntitlements();
            return !!ent[productId];
        },

        async purchase(productId) {
            const product = this._catalog.find(p => p.id === productId);
            if (!product) {
                const err = new Error('Product not found: ' + productId);
                if (this._onError) this._onError(err);
                throw err;
            }

            // DEMO: simulate payment UI
            try {
                await new Promise(res => setTimeout(res, 600));
                const ent = loadEntitlements();
                ent[productId] = {
                    productId,
                    purchasedAt: Date.now(),
                    type: product.type
                };
                saveEntitlements(ent);
                if (this._onPurchase) this._onPurchase(productId, ent[productId]);
                return ent[productId];
            } catch(e) {
                if (this._onError) this._onError(e);
                throw e;
            }
        },

        async restore() {
            // DEMO: simply reload saved entitlements
            await new Promise(res => setTimeout(res, 300));
            return loadEntitlements();
        },

        clearDemoEntitlements() {
            saveEntitlements({});
        }
    };

    window.IAP = IAP;
})();


