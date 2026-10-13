import type * as api from "@/lib/api";

type Api = typeof api;

export const API_REQUEST = "API_REQUEST";

export type ApiRequest = {
  [K in keyof Api]: {
    type: typeof API_REQUEST;
    method: K;
    args: Parameters<Api[K]>;
  };
}[keyof Api];

// The background script owns every request to the API, so the popup and
// content scripts call it through here instead of fetching themselves
const call = <K extends keyof Api>(method: K) => {
  const send = async (...args: unknown[]) => {
    try {
      const response = await browser.runtime.sendMessage({
        type: API_REQUEST,
        method,
        args,
      });
      if (response) return response;
    } catch {
      // Fall through to the generic failure below
    }
    return { success: false, message: "Something went wrong" };
  };
  return send as Api[K];
};

export const createNote = call("createNote");
export const getRecentNotes = call("getRecentNotes");
export const getFolders = call("getFolders");
export const getTags = call("getTags");
export const updateNote = call("updateNote");
export const deleteNote = call("deleteNote");
