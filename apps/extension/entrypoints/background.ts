import { createNote } from "@/lib/api";
import type { CreateNote } from "@/types";

export default defineBackground(() => {
  // Create the menu item once, when the extension installs/updates
  browser.runtime.onInstalled.addListener(() => {
    browser.contextMenus.create({
      id: "save-to-notebase",
      title: "Save to Notebase",
      contexts: ["selection"], // only shows when text is selected
    });
  });

  // Handle the click
  browser.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId !== "save-to-notebase" || !info.selectionText) return;

    const note: CreateNote = {
      content: info.selectionText,
      sourceUrl: tab?.url ?? "",
      sourceTitle: tab?.title ?? "",
      faviconUrl: tab?.favIconUrl ?? "",
    };

    await browser.storage.local.set({
      draftNote: note,
    });

    await browser.action.openPopup();
  });

  browser.runtime.onMessage.addListener((msg) => {
    if (msg.type === "SAVE_NOTE_REMOTE") {
      const note: CreateNote = msg.note;
      return createNote(note);
    }
  });
});
