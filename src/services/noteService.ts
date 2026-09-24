import axios from "axios";
import type { NewNoteData, Note, FetchNotesResponse } from "../types/note";

const token = import.meta.env.VITE_NOTEHUB_TOKEN;

const noteApi = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

interface FetchNotesParams {
  page: number;
  perPage: number;
  searchText?: string;
}

export const fetchNotes = async ({
  page,
  perPage,
  searchText,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const res = await noteApi.get<FetchNotesResponse>("/notes", {
    params: {
      page,
      perPage,
      search: searchText,
    },
  });

  return res.data;
};

export const createNote = async (newNoteData: NewNoteData) => {
  const res = await noteApi.post<Note>("/notes", newNoteData);
  return res.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const res = await noteApi.delete<Note>(`/notes/${id}`);
  return res.data;
};
