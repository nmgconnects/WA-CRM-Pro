document.getElementById('open-dashboard').addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://web.whatsapp.com' });
});
