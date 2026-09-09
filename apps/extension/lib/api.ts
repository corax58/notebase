import type { CreateNote, Note } from "@/types";

const extractErrorMessage = (error: unknown) => {
  if (typeof error === "string") {
    return error;
  } else if (error instanceof Error) {
    return error.message;
  } else {
    return "Something went wrong";
  }
};

const apiUrl = import.meta.env.WXT_API_URL;

export const createNote = async (
  note: CreateNote,
): Promise<{ success: boolean; message: string }> => {
  const body = JSON.stringify(note);
  try {
    const res = await fetch(`${apiUrl}/api/notes`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body,
    });
    if (!res.ok) {
      const errorResponse = await res.json();
      throw Error(errorResponse.message ?? "Something went wrong");
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
    const res = await fetch(`${apiUrl}/api/notes?limit=5`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      const errorResponse = await res.json();
      throw Error(errorResponse.message ?? "Something went wrong");
    }
    const data: { notes: Note[] } = await res.json();
    return { success: true, data: data.notes };
  } catch (e) {
    return { success: false, message: extractErrorMessage(e) };
  }
};

export const deleteNote = async (id: string): Promise<ApiResult<null>> => {
  try {
    const res = await fetch(`${apiUrl}/api/notes/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) {
      const errorResponse = await res.json();
      throw Error(errorResponse.message ?? "Something went wrong");
    }
    return { success: true, data: null };
  } catch (e) {
    return { success: false, message: extractErrorMessage(e) };
  }
};
