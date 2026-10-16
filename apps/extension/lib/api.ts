import type { ValidatedNote } from "@/lib/validation";
import type { Folder, Note, Tag, UpdateNote } from "@/types";

const extractErrorMessage = (error: unknown) => {
  if (typeof error === "string") {
    return error;
  } else if (error instanceof Error) {
    return error.message;
  } else {
    return "Something went wrong";
  }
};

// The API answers failures with { error } and, for invalid input, { issues }
// keyed by field; the first issue is the most specific message
const readErrorMessage = async (res: Response) => {
  const body = await res.json().catch(() => null);
  const firstIssue = Object.values(body?.issues ?? {})[0] as
    | string[]
    | undefined;
  return firstIssue?.[0] ?? body?.error ?? "Something went wrong";
};

const apiUrl = import.meta.env.WXT_API_URL;

// Authenticates with the bearer token the auth client stores on sign-in
const request = async (path: string, init: RequestInit = {}) => {
  const token = await storage.getItem<string>("local:token");
  const res = await fetch(`${apiUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });
  if (res.status === 401) await storage.removeItem("local:token");
  return res;
};

export const createNote = async (
  note: ValidatedNote,
): Promise<{ success: boolean; message: string }> => {
  const body = JSON.stringify(note);
  try {
    const res = await request("/api/notes", {
      method: "POST",
      body,
    });
    if (!res.ok) {
      throw Error(await readErrorMessage(res));
    }
    return { success: true, message: "Note created" };
  } catch (e) {
    return { success: false, message: extractErrorMessage(e) };
  }
};

type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; message: string };

export const getRecentNotes = async (): Promise<ApiResult<Note[]>> => {
  try {
    const res = await request("/api/notes?limit=5");
    if (!res.ok) {
      throw Error(await readErrorMessage(res));
    }
    const data: { notes: Note[] } = await res.json();
    return { success: true, data: data.notes };
  } catch (e) {
    return { success: false, message: extractErrorMessage(e) };
  }
};

export const getFolders = async (): Promise<ApiResult<Folder[]>> => {
  try {
    const res = await request("/api/folders");
    if (!res.ok) {
      throw Error(await readErrorMessage(res));
    }
    const data: { folders: Folder[] } = await res.json();
    return { success: true, data: data.folders };
  } catch (e) {
    return { success: false, message: extractErrorMessage(e) };
  }
};

export const getTags = async (): Promise<ApiResult<Tag[]>> => {
  try {
    const res = await request("/api/tags");
    if (!res.ok) {
      throw Error(await readErrorMessage(res));
    }
    const data: { tags: Tag[] } = await res.json();
    return { success: true, data: data.tags };
  } catch (e) {
    return { success: false, message: extractErrorMessage(e) };
  }
};

// The API returns the updated row without its folder relation
export const updateNote = async (
  id: string,
  note: UpdateNote,
): Promise<ApiResult<Omit<Note, "folder">>> => {
  try {
    const res = await request(`/api/notes/${id}`, {
      method: "PATCH",
      body: JSON.stringify(note),
    });
    if (!res.ok) {
      throw Error(await readErrorMessage(res));
    }
    const data: { note: Omit<Note, "folder"> } = await res.json();
    return { success: true, data: data.note };
  } catch (e) {
    return { success: false, message: extractErrorMessage(e) };
  }
};

export const deleteNote = async (id: string): Promise<ApiResult<null>> => {
  try {
    const res = await request(`/api/notes/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw Error(await readErrorMessage(res));
    }
    return { success: true, data: null };
  } catch (e) {
    return { success: false, message: extractErrorMessage(e) };
  }
};
