let currentUrl = '';
let history = [];
let historyIndex = -1;
let popupWindow = null;

// Initialize on page load
window.onload = function() {
    document.getElementById('address-bar').value = '';
    showWelcomeMessage();
};

// Show welcome message in iframe
function showWelcomeMessage() {
    const iframe = document.getElementById('main-frame');
    const welcomeHTML = `
        <html>
        <head>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    text-align: center;
                    padding: 50px;
                    margin: 0;
                }
                h1 { font-size: 2.5em; margin-bottom: 20px; }
                p { font-size: 1.2em; opacity: 0.9; }
                .logo { font-size: 4em; margin-bottom: 20px; }
            </style>
        </head>
        <body>
            <div class="logo">🌐</div>
            <h1>Welcome to Enhanced Browser</h1>
            <p>Enter a URL in the address bar above to start browsing!</p>
            <p>For sites that block embedding, we'll open them in a popup window.</p>
        </body>
        </html>
    `;
    iframe.srcdoc = welcomeHTML;
}

// Handle address bar key press
function handleAddressBarKeyPress(event) {
    if (event.key === 'Enter') {
        navigateFromAddressBar();
    }
}

// Navigate from address bar
function navigateFromAddressBar() {
    let url = document.getElementById('address-bar').value.trim();
    if (url) {
        navigateToUrl(url);
    }
}

// Function to navigate to a URL
function navigateToUrl(url) {
    // Add protocol if missing
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }
    
    // Update history
    if (url !== currentUrl) {
        if (historyIndex < history.length - 1) {
            history = history.slice(0, historyIndex + 1);
        }
        history.push(currentUrl);
        historyIndex++;
        currentUrl = url;
        document.getElementById('address-bar').value = url;
    }
    
    // Try to load in iframe first
    loadInIframe(url);
}

// Try to load URL in iframe
function loadInIframe(url) {
    const iframe = document.getElementById('main-frame');
    
    // Set loading state
    iframe.classList.add('loading');
    
    // Create a test iframe to check if URL can be loaded
    const testFrame = document.createElement('iframe');
    testFrame.style.display = 'none';
    testFrame.src = url;
    
    let loaded = false;
    
    // Set timeout to detect if iframe fails to load
    setTimeout(() => {
        if (!loaded) {
            openInPopup(url);
            iframe.classList.remove('loading');
            showBlockedMessage(url);
        }
    }, 3000);
    
    // Try to detect if iframe loaded successfully
    testFrame.onload = function() {
        try {
            // If we can access the content, it loaded successfully
            const doc = testFrame.contentDocument || testFrame.contentWindow.document;
            if (doc) {
                loaded = true;
                iframe.src = url;
                iframe.classList.remove('loading');
            }
        } catch (e) {
            // Cross-origin error means the site blocks iframe embedding
            openInPopup(url);
            iframe.classList.remove('loading');
            showBlockedMessage(url);
        }
        document.body.removeChild(testFrame);
    };
    
    testFrame.onerror = function() {
        openInPopup(url);
        iframe.classList.remove('loading');
        showBlockedMessage(url);
        document.body.removeChild(testFrame);
    };
    
    document.body.appendChild(testFrame);
    
    // Also try direct load
    iframe.src = url;
    
    // Check after load attempt
    iframe.onload = function() {
        loaded = true;
        iframe.classList.remove('loading');
    };
    
    iframe.onerror = function() {
        openInPopup(url);
        showBlockedMessage(url);
        iframe.classList.remove('loading');
    };
}

// Open URL in popup window
function openInPopup(url) {
    // Close existing popup if any
    if (popupWindow && !popupWindow.closed) {
        popupWindow.close();
    }
    
    // Open new popup
    popupWindow = window.open(
        url,
        'BrowserPopup',
        'width=1200,height=800,scrollbars=yes,resizable=yes,status=yes,toolbar=yes,menubar=yes,location=yes'
    );
    
    if (popupWindow) {
        popupWindow.focus();
    } else {
        alert('Popup blocked! Please allow popups for this site.');
    }
}

// Show blocked message in iframe
function showBlockedMessage(url) {
    const iframe = document.getElementById('main-frame');
    const blockedHTML = `
        <html>
        <head>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    background: #f44336;
                    color: white;
                    text-align: center;
                    padding: 50px;
                    margin: 0;
                }
                h1 { font-size: 2em; margin-bottom: 20px; }
                p { font-size: 1.1em; margin-bottom: 15px; }
                .url { background: rgba(0,0,0,0.3); padding: 10px; border-radius: 5px; }
                .icon { font-size: 3em; margin-bottom: 20px; }
            </style>
        </head>
        <body>
            <div class="icon">🚫</div>
            <h1>Site Blocked Iframe Embedding</h1>
            <p>The website has opened in a popup window instead.</p>
            <div class="url">${url}</div>
            <p>This is normal behavior for security reasons.</p>
        </body>
        </html>
    `;
    iframe.srcdoc = blockedHTML;
}

// Function to go back in history
function goBack() {
    if (historyIndex > 0) {
        historyIndex--;
        currentUrl = history[historyIndex];
        document.getElementById('address-bar').value = currentUrl;
        loadInIframe(currentUrl);
    }
}

// Function to go forward in history
function goForward() {
    if (historyIndex < history.length - 1) {
        historyIndex++;
        currentUrl = history[historyIndex];
        document.getElementById('address-bar').value = currentUrl;
        loadInIframe(currentUrl);
    }
}

// Function to refresh the page
function refreshPage() {
    if (currentUrl) {
        loadInIframe(currentUrl);
    }
}

// Function to go home
function goHome() {
    currentUrl = '';
    document.getElementById('address-bar').value = '';
    showWelcomeMessage();
    if (popupWindow && !popupWindow.closed) {
        popupWindow.close();
    }
}

// Handle popup window closing
window.addEventListener('beforeunload', function() {
    if (popupWindow && !popupWindow.closed) {
        popupWindow.close();
    }
});