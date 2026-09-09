export default defineContentScript({
  matches: ["<all_urls>"],
  main() {
    // Not needed for the context-menu flow — the browser gives us
    // the selected text directly. We'll use this file for the
    // floating "Save" button next.
  },
});
