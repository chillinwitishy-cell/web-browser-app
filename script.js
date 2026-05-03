let currentUrl = 'https://example.com';
let history = [];
let historyIndex = -1;

// Initialize on page load
window.onload = function() {
    document.getElementById('address-bar').value = currentUrl;
};

// Function to handle address bar key press
function handleAddressBarKeyPress(event) {
    if (event.key === 'Enter') {
        let url = document.getElementById('address-bar').value;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        navigateToUrl(url);
    }
}

// Function to navigate to a URL
function navigateToUrl(url) {
    if (url !== currentUrl) {
        if (historyIndex < history.length - 1) {
            history = history.slice(0, historyIndex + 1);
        }
        history.push(currentUrl);
        historyIndex++;
        currentUrl = url;
        document.getElementById('main-frame').src = url;
        document.getElementById('address-bar').value = url;
    }
}

// Function to go back in history
function goBack() {
    if (historyIndex > 0) {
        historyIndex--;
        currentUrl = history[historyIndex];
        document.getElementById('main-frame').src = currentUrl;
        document.getElementById('address-bar').value = currentUrl;
    }
}

// Function to go forward in history
function goForward() {
    if (historyIndex < history.length - 1) {
        historyIndex++;
        currentUrl = history[historyIndex];
        document.getElementById('main-frame').src = currentUrl;
        document.getElementById('address-bar').value = currentUrl;
    }
}

// Function to refresh the page
function refreshPage() {
    document.getElementById('main-frame').src = currentUrl;
}

// Function to go home
function goHome() {
    navigateToUrl('https://example.com');
}

// Error handling for iframe loading
document.getElementById('main-frame').onerror = function() {
    console.log('Failed to load:', currentUrl);
};

document.getElementById('main-frame').onload = function() {
    console.log('Successfully loaded:', currentUrl);
};