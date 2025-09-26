HeartQuest Firebase Integration

This folder contains helper scripts to integrate Firebase Auth, Firestore, and Storage in the web app.

Quick start (Web, using Firebase 8.x compat CDN):

1) Add these tags in your HTML <head> or before your app scripts:

   <!-- Firebase compat SDKs -->
   <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js"></script>
   <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-auth.js"></script>
   <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js"></script>
   <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-storage.js"></script>

2) Provide your config (replace placeholders) before init:

   <script>
     window.FIREBASE_CONFIG = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_PROJECT.firebaseapp.com",
       projectId: "YOUR_PROJECT",
       storageBucket: "YOUR_PROJECT.appspot.com",
       messagingSenderId: "...",
       appId: "..."
     };
   </script>

3) Load initialization and helpers (order matters):

   <script src="analytics/firebase/init.js"></script>
   <script src="analytics/firebase/auth.js"></script>
   <script src="analytics/firebase/firestore.js"></script>
   <script src="analytics/firebase/storage.js"></script>

Notes
- These scripts gracefully no-op if the Firebase SDK isn't present yet.
- For Firebase v9 modular (ESM), you'd import from the SDK instead of using globals; adapt as needed.

