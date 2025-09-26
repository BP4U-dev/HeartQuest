HeartQuest In‑App Purchases (IAP)

This module provides a simple, pluggable IAP layer for the web app and can be adapted for mobile wrappers (Android/iOS) and Unity.

Web (demo) flow
- Uses a local product catalog and localStorage to simulate purchase/restore.
- Exposes hooks to integrate real providers (e.g., Stripe Checkout/Payments, Firebase Extensions, or your own backend).

Mobile wrappers
- Android: Use Google Play Billing in the native layer; bridge to `IAP.purchase()` via WebView/JavascriptInterface.
- iOS: Use StoreKit in the native layer; bridge to `IAP.purchase()` via WKScriptMessageHandler.

Unity
- Use Unity IAP (Codeless or scripted) and share entitlements via your backend or Deep Link back to the web profile.

Usage (Web)
1) Include the script on pages that sell items:

   <script src="analytics/iap/iap.js"></script>

2) Initialize with your catalog (or use the default demo):

   IAP.init({
     products: [
       { id: 'coins_1000', title: '1,000 Coins', price: 4.99, currency: 'USD', type: 'consumable' },
       { id: 'vip_month', title: 'VIP Monthly', price: 9.99, currency: 'USD', type: 'subscription' }
     ]
   });

3) Purchase and restore in your UI:

   await IAP.purchase('coins_1000');
   const hasVip = IAP.hasEntitlement('vip_month');
   await IAP.restore();

Security note
- For production, process purchases server‑side (validate receipts with Play/App Store; create Stripe Payments server‑side) and mint entitlements from your backend (e.g., in Firestore or a database). The included demo is client‑side only.

