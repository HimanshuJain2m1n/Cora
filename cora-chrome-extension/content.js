console.log("Content script loaded!");

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "fill_demo_input") {
    // Target the <body> tag with the specified classes
    // console.log("Filling notes input with:", request.value);
    // console.log("Current document body:", document.body.innerHTML);
    const textarea = document.querySelector('textarea#vitalsNotes');
    if (textarea) {
      textarea.value = request.value;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      textarea.dispatchEvent(new Event('change', { bubbles: true }));
    } else {
      console.warn("Textarea with id 'vitalsNotes' not found.");
      sendResponse({ status: "error", message: "Input not found in content page" });
    }
    return true;
  }
});