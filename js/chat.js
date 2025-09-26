// HeartQuest - Real-time Chat System
class ChatManager {
    constructor() {
        this.activeChats = new Map();
        this.messageHistory = new Map();
        this.currentChatId = null;
        this.isConnected = false;
        this.chatSocket = null;
        this.typingTimeout = null;
        this.unreadMessages = 0;
        this.blockedUsers = new Set();
        this.init();
    }

    init() {
        this.setupWebSocket();
        this.bindEvents();
        this.loadChatHistory();
        this.createChatInterface();
    }

    // Setup WebSocket connection for real-time chat
    setupWebSocket() {
        // Simulate WebSocket connection (replace with actual WebSocket server)
        console.log('Setting up chat connection...');
        setTimeout(() => {
            this.isConnected = true;
            this.onConnectionEstablished();
        }, 1000);
    }

    onConnectionEstablished() {
        console.log('Chat connection established');
        this.loadActiveChats();
        this.setupHeartbeat();
    }

    // Bind event listeners
    bindEvents() {
        // Chat input handling
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.classList.contains('chat-input')) {
                if (e.shiftKey) {
                    // Allow new line with Shift+Enter
                    return;
                } else {
                    e.preventDefault();
                    this.sendMessage(e.target.value.trim(), this.currentChatId);
                    e.target.value = '';
                }
            }
        });

        // Typing indicator
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('chat-input')) {
                this.handleTyping();
            }
        });

        // Chat window focus/blur
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.markMessagesAsRead(this.currentChatId);
            }
        });
    }

    // Create chat interface elements
    createChatInterface() {
        const chatStyles = `
            <style>
                .chat-panel {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    width: 350px;
                    height: 500px;
                    background: rgba(43, 43, 43, 0.95);
                    border: 2px solid rgba(139, 69, 19, 0.4);
                    border-radius: 15px;
                    backdrop-filter: blur(20px);
                    display: none;
                    flex-direction: column;
                    z-index: 1000;
                }

                .chat-header {
                    padding: 15px 20px;
                    border-bottom: 1px solid rgba(139, 69, 19, 0.3);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .chat-title {
                    font-weight: bold;
                    background: linear-gradient(45deg, #8B4513, #CD853F);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .chat-status {
                    font-size: 0.8rem;
                    color: #4CAF50;
                }

                .chat-status.offline {
                    color: #888;
                }

                .chat-messages {
                    flex: 1;
                    overflow-y: auto;
                    padding: 10px;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .message-bubble {
                    max-width: 80%;
                    padding: 10px 15px;
                    border-radius: 18px;
                    position: relative;
                    animation: messageSlide 0.3s ease-out;
                }

                .message-bubble.sent {
                    background: linear-gradient(135deg, #8B4513, #CD853F);
                    color: white;
                    align-self: flex-end;
                    border-bottom-right-radius: 5px;
                }

                .message-bubble.received {
                    background: rgba(139, 69, 19, 0.2);
                    color: white;
                    align-self: flex-start;
                    border-bottom-left-radius: 5px;
                    border: 1px solid rgba(139, 69, 19, 0.3);
                }

                .message-time {
                    font-size: 0.7rem;
                    opacity: 0.7;
                    margin-top: 5px;
                }

                .message-status {
                    font-size: 0.7rem;
                    margin-top: 5px;
                    text-align: right;
                }

                .message-status.delivered::after {
                    content: '✓';
                    color: #888;
                }

                .message-status.read::after {
                    content: '✓✓';
                    color: #4CAF50;
                }

                .typing-indicator {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    padding: 10px 15px;
                    color: #CD853F;
                    font-style: italic;
                    font-size: 0.9rem;
                }

                .typing-dots {
                    display: inline-flex;
                    gap: 2px;
                }

                .typing-dot {
                    width: 4px;
                    height: 4px;
                    border-radius: 50%;
                    background: #CD853F;
                    animation: typingDot 1.4s infinite ease-in-out;
                }

                .typing-dot:nth-child(1) { animation-delay: -0.32s; }
                .typing-dot:nth-child(2) { animation-delay: -0.16s; }

                @keyframes typingDot {
                    0%, 80%, 100% {
                        transform: scale(0);
                        opacity: 0.5;
                    }
                    40% {
                        transform: scale(1);
                        opacity: 1;
                    }
                }

                .chat-input-area {
                    padding: 15px;
                    border-top: 1px solid rgba(139, 69, 19, 0.3);
                    display: flex;
                    gap: 10px;
                    align-items: flex-end;
                }

                .chat-input-wrapper {
                    flex: 1;
                    position: relative;
                }

                .chat-input {
                    width: 100%;
                    padding: 10px 40px 10px 15px;
                    background: rgba(139, 69, 19, 0.1);
                    border: 2px solid rgba(139, 69, 19, 0.3);
                    border-radius: 20px;
                    color: white;
                    resize: none;
                    min-height: 40px;
                    max-height: 100px;
                    font-family: inherit;
                }

                .chat-input:focus {
                    outline: none;
                    border-color: #8B4513;
                }

                .chat-input::placeholder {
                    color: rgba(255, 255, 255, 0.6);
                }

                .emoji-button {
                    position: absolute;
                    right: 10px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    font-size: 1.2rem;
                    cursor: pointer;
                }

                .send-button {
                    background: linear-gradient(135deg, #8B4513, #CD853F);
                    border: none;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: transform 0.2s ease;
                }

                .send-button:hover {
                    transform: scale(1.1);
                }

                .send-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .chat-list {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    width: 300px;
                    max-height: 400px;
                    background: rgba(43, 43, 43, 0.95);
                    border: 2px solid rgba(139, 69, 19, 0.4);
                    border-radius: 15px;
                    backdrop-filter: blur(20px);
                    overflow-y: auto;
                    display: none;
                }

                .chat-list-item {
                    padding: 15px;
                    border-bottom: 1px solid rgba(139, 69, 19, 0.2);
                    cursor: pointer;
                    transition: background 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .chat-list-item:hover {
                    background: rgba(139, 69, 19, 0.1);
                }

                .chat-list-item.active {
                    background: rgba(139, 69, 19, 0.2);
                }

                .chat-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: linear-gradient(45deg, #8B4513, #CD853F);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                    position: relative;
                }

                .online-indicator {
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    width: 12px;
                    height: 12px;
                    background: #4CAF50;
                    border: 2px solid #2b2b2b;
                    border-radius: 50%;
                }

                .chat-preview {
                    flex: 1;
                }

                .chat-name {
                    font-weight: bold;
                    margin-bottom: 3px;
                }

                .chat-last-message {
                    font-size: 0.8rem;
                    color: #b0b0b0;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .chat-meta {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    gap: 5px;
                }

                .chat-time {
                    font-size: 0.7rem;
                    color: #888;
                }

                .unread-badge {
                    background: #CD853F;
                    color: white;
                    border-radius: 10px;
                    padding: 2px 6px;
                    font-size: 0.7rem;
                    min-width: 18px;
                    text-align: center;
                }

                .chat-actions {
                    display: flex;
                    gap: 5px;
                    padding: 10px 15px;
                    border-bottom: 1px solid rgba(139, 69, 19, 0.3);
                }

                .chat-action-btn {
                    background: rgba(139, 69, 19, 0.2);
                    border: 1px solid rgba(139, 69, 19, 0.4);
                    color: white;
                    padding: 5px 10px;
                    border-radius: 15px;
                    font-size: 0.8rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .chat-action-btn:hover {
                    background: rgba(139, 69, 19, 0.3);
                }

                .chat-toggle {
                    position: fixed;
                    bottom: 80px;
                    right: 30px;
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(135deg, #8B4513, #CD853F);
                    border: none;
                    border-radius: 50%;
                    color: white;
                    font-size: 1.5rem;
                    cursor: pointer;
                    box-shadow: 0 4px 20px rgba(139, 69, 19, 0.4);
                    z-index: 999;
                    transition: transform 0.3s ease;
                }

                .chat-toggle:hover {
                    transform: scale(1.1);
                }

                .chat-toggle.has-unread {
                    animation: pulse 2s infinite;
                }

                .chat-toggle.has-unread::after {
                    content: attr(data-unread);
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background: #DC143C;
                    color: white;
                    border-radius: 10px;
                    padding: 2px 6px;
                    font-size: 0.7rem;
                    min-width: 18px;
                    text-align: center;
                }

                @keyframes messageSlide {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes pulse {
                    0% { box-shadow: 0 4px 20px rgba(139, 69, 19, 0.4); }
                    50% { box-shadow: 0 4px 30px rgba(220, 20, 60, 0.6); }
                    100% { box-shadow: 0 4px 20px rgba(139, 69, 19, 0.4); }
                }

                @media (max-width: 768px) {
                    .chat-panel, .chat-list {
                        bottom: 0;
                        right: 0;
                        width: 100%;
                        height: 100%;
                        border-radius: 0;
                    }

                    .chat-toggle {
                        bottom: 20px;
                        right: 20px;
                    }
                }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', chatStyles);

        // Create chat toggle button
        const chatToggle = document.createElement('button');
        chatToggle.className = 'chat-toggle';
        chatToggle.innerHTML = '💬';
        chatToggle.onclick = () => this.toggleChatPanel();
        document.body.appendChild(chatToggle);

        // Create chat panel
        this.createChatPanel();
        this.createChatList();
    }

    // Create main chat panel
    createChatPanel() {
        const chatPanel = document.createElement('div');
        chatPanel.className = 'chat-panel';
        chatPanel.id = 'chatPanel';
        chatPanel.innerHTML = `
            <div class="chat-header">
                <div>
                    <div class="chat-title">Select a Chat</div>
                    <div class="chat-status" id="chatStatus">Offline</div>
                </div>
                <button onclick="chatManager.closeChatPanel()" style="background: none; border: none; color: #8B4513; font-size: 1.5rem; cursor: pointer;">&times;</button>
            </div>
            <div class="chat-actions" id="chatActions" style="display: none;">
                <button class="chat-action-btn" onclick="chatManager.startVideoCall()">📹 Video</button>
                <button class="chat-action-btn" onclick="chatManager.startVoiceCall()">📞 Call</button>
                <button class="chat-action-btn" onclick="chatManager.shareLocation()">📍 Location</button>
                <button class="chat-action-btn" onclick="chatManager.blockUser()">🚫 Block</button>
            </div>
            <div class="chat-messages" id="chatMessages">
                <div style="text-align: center; color: #888; padding: 20px;">
                    Select a chat to start messaging
                </div>
            </div>
            <div class="typing-indicator" id="typingIndicator" style="display: none;">
                <span>Someone is typing</span>
                <div class="typing-dots">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
            <div class="chat-input-area" id="chatInputArea" style="display: none;">
                <div class="chat-input-wrapper">
                    <textarea class="chat-input" id="chatInput" placeholder="Type a message..." rows="1"></textarea>
                    <button class="emoji-button" onclick="chatManager.toggleEmojiPicker()">😊</button>
                </div>
                <button class="send-button" id="sendButton" onclick="chatManager.sendCurrentMessage()">
                    ➤
                </button>
            </div>
        `;
        document.body.appendChild(chatPanel);
    }

    // Create chat list panel
    createChatList() {
        const chatList = document.createElement('div');
        chatList.className = 'chat-list';
        chatList.id = 'chatList';
        document.body.appendChild(chatList);

        this.populateChatList();
    }

    // Load and display chat list
    populateChatList() {
        const chatList = document.getElementById('chatList');
        if (!chatList) return;

        // Sample chat data (replace with actual data from API)
        const chats = [
            {
                id: 'sarah_2024',
                name: 'Sarah',
                avatar: 'S',
                lastMessage: 'Want to explore the Fantasy Kingdom together? 🏰',
                time: '2 min ago',
                unread: 2,
                online: true
            },
            {
                id: 'alex_2024',
                name: 'Alex',
                avatar: 'A',
                lastMessage: 'The sunset on Paradise Island is amazing! 🌅',
                time: '5 min ago',
                unread: 0,
                online: true
            },
            {
                id: 'jordan_2024',
                name: 'Jordan',
                avatar: 'J',
                lastMessage: 'Anyone up for a dragon ride? 🐉',
                time: '1 hour ago',
                unread: 1,
                online: false
            },
            {
                id: 'riley_2024',
                name: 'Riley',
                avatar: 'R',
                lastMessage: 'Thanks for the fun date! ❤️',
                time: 'Yesterday',
                unread: 0,
                online: false
            }
        ];

        chatList.innerHTML = chats.map(chat => `
            <div class="chat-list-item ${chat.id === this.currentChatId ? 'active' : ''}" 
                 onclick="chatManager.openChat('${chat.id}', '${chat.name}')">
                <div class="chat-avatar">
                    ${chat.avatar}
                    ${chat.online ? '<div class="online-indicator"></div>' : ''}
                </div>
                <div class="chat-preview">
                    <div class="chat-name">${chat.name}</div>
                    <div class="chat-last-message">${chat.lastMessage}</div>
                </div>
                <div class="chat-meta">
                    <div class="chat-time">${chat.time}</div>
                    ${chat.unread > 0 ? `<div class="unread-badge">${chat.unread}</div>` : ''}
                </div>
            </div>
        `).join('');

        // Update unread count
        this.updateUnreadCount();
    }

    // Toggle chat panel visibility
    toggleChatPanel() {
        const chatPanel = document.getElementById('chatPanel');
        const chatList = document.getElementById('chatList');
        
        if (chatPanel.style.display === 'flex') {
            this.closeChatPanel();
        } else {
            if (this.currentChatId) {
                chatPanel.style.display = 'flex';
                chatList.style.display = 'none';
            } else {
                chatPanel.style.display = 'none';
                chatList.style.display = 'block';
            }
        }
    }

    // Close chat panel
    closeChatPanel() {
        const chatPanel = document.getElementById('chatPanel');
        const chatList = document.getElementById('chatList');
        
        chatPanel.style.display = 'none';
        chatList.style.display = 'none';
    }

    // Open specific chat
    openChat(chatId, chatName) {
        this.currentChatId = chatId;
        
        const chatPanel = document.getElementById('chatPanel');
        const chatList = document.getElementById('chatList');
        const chatTitle = chatPanel.querySelector('.chat-title');
        const chatStatus = document.getElementById('chatStatus');
        const chatActions = document.getElementById('chatActions');
        const chatInputArea = document.getElementById('chatInputArea');
        
        // Update UI
        chatTitle.textContent = chatName;
        chatStatus.textContent = 'Online';
        chatStatus.className = 'chat-status';
        
        // Show chat elements
        chatPanel.style.display = 'flex';
        chatList.style.display = 'none';
        chatActions.style.display = 'flex';
        chatInputArea.style.display = 'flex';
        
        // Load chat messages
        this.loadChatMessages(chatId);
        
        // Mark messages as read
        this.markMessagesAsRead(chatId);
        
        // Update active chat in list
        this.populateChatList();
    }

    // Load chat messages
    loadChatMessages(chatId) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        // Sample messages (replace with actual data from API)
        const messages = this.messageHistory.get(chatId) || [
            {
                id: 1,
                text: 'Hey! How are you enjoying HeartQuest so far?',
                sender: 'other',
                timestamp: new Date(Date.now() - 300000),
                status: 'read'
            },
            {
                id: 2,
                text: 'It\'s amazing! I love my avatar and the worlds are incredible',
                sender: 'self',
                timestamp: new Date(Date.now() - 240000),
                status: 'read'
            },
            {
                id: 3,
                text: 'Want to meet up in the Fantasy Kingdom? I heard there\'s a quest we can do together!',
                sender: 'other',
                timestamp: new Date(Date.now() - 180000),
                status: 'read'
            },
            {
                id: 4,
                text: 'Absolutely! Let\'s go on an adventure together ⚔️',
                sender: 'self',
                timestamp: new Date(Date.now() - 120000),
                status: 'delivered'
            }
        ];

        this.messageHistory.set(chatId, messages);
        this.renderMessages(messages);
        this.scrollToBottom();
    }

    // Render messages in chat
    renderMessages(messages) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        chatMessages.innerHTML = messages.map(message => {
            const messageClass = message.sender === 'self' ? 'sent' : 'received';
            const time = message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            
            return `
                <div class="message-bubble ${messageClass}">
                    <div class="message-text">${this.formatMessageText(message.text)}</div>
                    <div class="message-time">${time}</div>
                    ${message.sender === 'self' ? `<div class="message-status ${message.status}"></div>` : ''}
                </div>
            `;
        }).join('');
    }

    // Format message text (handle emojis, links, etc.)
    formatMessageText(text) {
        // Basic emoji and link formatting
        return text
            .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>')
            .replace(/\n/g, '<br>');
    }

    // Send message
    sendMessage(text, chatId) {
        if (!text.trim() || !chatId) return;

        const message = {
            id: Date.now(),
            text: text,
            sender: 'self',
            timestamp: new Date(),
            status: 'sending'
        };

        // Add to message history
        const messages = this.messageHistory.get(chatId) || [];
        messages.push(message);
        this.messageHistory.set(chatId, messages);

        // Re-render messages
        this.renderMessages(messages);
        this.scrollToBottom();

        // Simulate sending (replace with actual WebSocket/API call)
        setTimeout(() => {
            message.status = 'delivered';
            this.renderMessages(messages);
            
            // Simulate response
            setTimeout(() => {
                this.simulateIncomingMessage(chatId);
            }, 1000 + Math.random() * 2000);
        }, 500);

        // Update chat list
        this.updateChatPreview(chatId, text);
    }

    // Send current message from input
    sendCurrentMessage() {
        const chatInput = document.getElementById('chatInput');
        if (!chatInput) return;

        const text = chatInput.value.trim();
        if (text) {
            this.sendMessage(text, this.currentChatId);
            chatInput.value = '';
            this.autoResizeTextarea(chatInput);
        }
    }

    // Auto-resize textarea
    autoResizeTextarea(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 100) + 'px';
    }

    // Handle typing indicator
    handleTyping() {
        if (!this.currentChatId) return;

        // Clear existing timeout
        if (this.typingTimeout) {
            clearTimeout(this.typingTimeout);
        }

        // Send typing indicator (simulate)
        console.log('User is typing...');

        // Set timeout to stop typing indicator
        this.typingTimeout = setTimeout(() => {
            console.log('User stopped typing');
        }, 2000);
    }

    // Show typing indicator from other user
    showTypingIndicator(chatId, userName) {
        if (chatId !== this.currentChatId) return;

        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.querySelector('span').textContent = `${userName} is typing`;
            typingIndicator.style.display = 'flex';
            this.scrollToBottom();
        }
    }

    // Hide typing indicator
    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.style.display = 'none';
        }
    }

    // Simulate incoming message
    simulateIncomingMessage(chatId) {
        const responses = [
            'That sounds great!',
            'I can\'t wait to explore together!',
            'This world is so beautiful!',
            'Want to check out the castle next?',
            'Your avatar looks amazing!',
            'Let\'s meet at the town square',
            'I found a hidden treasure!',
            'This quest is so much fun!'
        ];

        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const message = {
            id: Date.now(),
            text: randomResponse,
            sender: 'other',
            timestamp: new Date(),
            status: 'read'
        };

        // Add to message history
        const messages = this.messageHistory.get(chatId) || [];
        messages.push(message);
        this.messageHistory.set(chatId, messages);

        // Update UI if chat is active
        if (chatId === this.currentChatId) {
            this.renderMessages(messages);
            this.scrollToBottom();
        } else {
            // Increment unread count
            this.unreadMessages++;
            this.updateUnreadCount();
        }

        // Update chat preview
        this.updateChatPreview(chatId, randomResponse);
    }

    // Update chat preview in list
    updateChatPreview(chatId, lastMessage) {
        const chatList = document.getElementById('chatList');
        if (!chatList) return;

        const chatItems = chatList.querySelectorAll('.chat-list-item');
        chatItems.forEach(item => {
            const onclick = item.getAttribute('onclick');
            if (onclick && onclick.includes(chatId)) {
                const lastMessageEl = item.querySelector('.chat-last-message');
                const timeEl = item.querySelector('.chat-time');
                
                if (lastMessageEl) {
                    lastMessageEl.textContent = lastMessage;
                }
                if (timeEl) {
                    timeEl.textContent = 'now';
                }
            }
        });
    }

    // Mark messages as read
    markMessagesAsRead(chatId) {
        if (!chatId) return;

        const messages = this.messageHistory.get(chatId);
        if (messages) {
            messages.forEach(message => {
                if (message.sender === 'other' && message.status !== 'read') {
                    message.status = 'read';
                    this.unreadMessages = Math.max(0, this.unreadMessages - 1);
                }
            });
            this.updateUnreadCount();
        }
    }

    // Update unread message count
    updateUnreadCount() {
        const chatToggle = document.querySelector('.chat-toggle');
        if (chatToggle) {
            if (this.unreadMessages > 0) {
                chatToggle.classList.add('has-unread');
                chatToggle.setAttribute('data-unread', this.unreadMessages);
            } else {
                chatToggle.classList.remove('has-unread');
                chatToggle.removeAttribute('data-unread');
            }
        }
    }

    // Scroll to bottom of chat
    scrollToBottom() {
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            setTimeout(() => {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 100);
        }
    }