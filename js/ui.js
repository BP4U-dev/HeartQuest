// HeartQuest UI Helpers

(function() {
    class UIManager {
        constructor() {}

        showNotification(message) {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: rgba(0,0,0,0.9);
                color: white;
                padding: 20px;
                border-radius: 15px;
                border: 2px solid #4ecdc4;
                max-width: 300px;
                z-index: 1000;
                backdrop-filter: blur(15px);
                box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                transition: opacity 0.3s ease, transform 0.3s ease;
            `;
            notification.textContent = message;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            }, 4000);
        }

        showFloatingUI(title, content) {
            const existingUI = document.querySelector('.floating-ui');
            if (existingUI) existingUI.remove();

            const floatingUI = document.createElement('div');
            floatingUI.className = 'floating-ui';
            floatingUI.innerHTML = `
                <h2 style="margin-bottom: 15px; color: #4ecdc4;">${title}</h2>
                <p style="margin-bottom: 20px; line-height: 1.6;">${content}</p>
                <button class="btn btn-primary" onclick="this.parentElement.remove()">Got it!</button>
            `;
            document.body.appendChild(floatingUI);
        }

        hideInfoPanel() {
            const panel = document.getElementById('infoPanel');
            if (!panel) return;
            panel.style.opacity = '0';
            setTimeout(() => {
                panel.style.display = 'none';
            }, 500);
        }

        setActiveNav(evt) {
            document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
            if (evt && evt.target) {
                evt.target.classList.add('active');
            }
        }

        togglePanel(panelIdToShow) {
            const ids = ['avatarPanel', 'worldPanel', 'socialPanel', 'questPanel'];
            ids.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.style.display = (id === panelIdToShow) ? 'block' : 'none';
            });
        }

        updateStat(statId, delta) {
            const el = document.getElementById(statId);
            if (!el) return;
            const n = parseInt((el.textContent || '0').replace(/,/g, ''), 10) || 0;
            el.textContent = (n + delta).toLocaleString();
        }
    }

    // Expose singleton
    window.UI = new UIManager();

    // Non-conflicting global fallbacks (only define if absent)
    if (typeof window.showNotification !== 'function') {
        window.showNotification = (msg) => window.UI.showNotification(msg);
    }
    if (typeof window.showFloatingUI !== 'function') {
        window.showFloatingUI = (title, content) => window.UI.showFloatingUI(title, content);
    }
    if (typeof window.hideInfoPanel !== 'function') {
        window.hideInfoPanel = () => window.UI.hideInfoPanel();
    }
})();


