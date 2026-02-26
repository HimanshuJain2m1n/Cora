chrome.action.onClicked.addListener((tab) => {
    // Open the side panel for the current tab
    if (chrome.sidePanel) {
      chrome.sidePanel.open({ tabId: tab.id });
    } else {
      console.warn('Side panel API not available in this version of Chrome.');
    }
  });