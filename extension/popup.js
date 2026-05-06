document.getElementById('open-dashboard').addEventListener('click', () => {
  // In a real extension, this would open 'https://yourdomain.com/crm'
  // For the dev environment, we just log it or alert if allowed
  window.open('https://localhost:3000', '_blank');
});

document.getElementById('sync-now').addEventListener('click', () => {
  const btn = document.getElementById('sync-now');
  btn.innerText = 'Syncing...';
  btn.disabled = true;

  chrome.runtime.sendMessage({ type: 'FORCE_SYNC' }, (response) => {
    setTimeout(() => {
      btn.innerText = 'Sync Complete';
      setTimeout(() => {
        btn.innerText = 'Force Sync Now';
        btn.disabled = false;
      }, 2000);
    }, 1500);
  });
});
