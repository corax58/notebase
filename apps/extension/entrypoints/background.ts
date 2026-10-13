import * as api from "@/lib/api";
import { API_REQUEST, type ApiRequest } from "@/lib/api-client";
import { sourceFromTab } from "@/lib/source";
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
      ...sourceFromTab(tab),
    };

    await browser.storage.local.set({
      draftNote: note,
    });

    await browser.action.openPopup();
  });

  browser.runtime.onMessage.addListener(
    (msg: ApiRequest, _sender, sendResponse) => {
      if (msg?.type !== API_REQUEST) return;

      const handler = api[msg.method] as
        | ((...args: unknown[]) => Promise<unknown>)
        | undefined;
      if (!handler) return;

      handler(...msg.args).then(sendResponse);
      // Keep the channel open until the request settles
      return true;
    },
  );
});
