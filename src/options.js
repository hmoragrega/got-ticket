
function saveOptions() {
    var baseUrl = document.getElementById('baseUrl').value;
    var defaultProject = document.getElementById('defaultProject').value;
    
    chrome.storage.sync.set({
        baseUrl: baseUrl,
        defaultProject: defaultProject.toUpperCase()
    }, function() {
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
            status.textContent = '';
        }, 1000);
    });
}

// This method restores the default options
function restoreOptions() {
    chrome.storage.sync.get({
        baseUrl: 'https://teamcmp.atlassian.net/browse/',
        defaultProject: 'WQR'
    }, function(items) {
        document.getElementById('baseUrl').value = items.baseUrl;
        document.getElementById('defaultProject').value = items.defaultProject;
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
