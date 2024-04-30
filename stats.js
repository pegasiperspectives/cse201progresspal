function updateStats() {
    chrome.storage.local.get(['daysUsed'], function (result) {
       
        const daysUsed = new Set(result.daysUsed || []).size;

       
        document.getElementById('days-used').textContent = daysUsed;
    });
}

window.onload = function () {
    updateStats();
}