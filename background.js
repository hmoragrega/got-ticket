
var config = {
    baseUrl: 'https://teamcmp.atlassian.net/browse/',
    defaultProject: 'WQR'
};

// Get config
chrome.storage.sync.get(config, function(items) {
    config.baseUrl = items.baseUrl;
    config.defaultProject = items.defaultProject;
});

// Update config if user makes changes 
chrome.storage.onChanged.addListener(function(changes) {
    for (key in changes) {
        var storageChange = changes[key];
        config[key] = storageChange.newValue;
    }
});

// Try to build a valid ticket url parsing user search
var getTicketUrlFromSearch = function(text) {
    var matches = text.match(/^(([a-zA-Z]+)[-|\s]?)?(\d+)/);
    if (!matches) {
        return null;
    }

    var project = matches[2] ? matches[2].toUpperCase() : config.defaultProject;

    return config.baseUrl + project + '-' + matches[3];
};

// Validate a ticket url based on the base url
var isValidTicketUrl = function(url) {
    return url.indexOf(config.baseUrl) === 0
};

// Listen to user input
chrome.omnibox.onInputChanged.addListener(
    function(text, suggest) {
        var url = getTicketUrlFromSearch(text);
        if (url) {
            suggest([
                {content: url, description: url}
            ]);
        }
    });

// Process user input
chrome.omnibox.onInputEntered.addListener(
    function(url) {

        if (!isValidTicketUrl(url)) {
            url = getTicketUrlFromSearch(url);
            if (!isValidTicketUrl(url)) {
                return;
            }
        }

        chrome.tabs.update({"url": url});
    });

// Set default suggestion
chrome.omnibox.setDefaultSuggestion({"description": "Go to ticket %s in JIRA"});