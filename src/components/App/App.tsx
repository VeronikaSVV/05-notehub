import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import NoteList from "../NoteList/NoteList";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import Pagination from "../Pagination/Pagination";
import { createNote, fetchNotes, deleteNote } from "../../services/noteService";
import css from "./App.module.css";
import type { NewNoteData } from "../../types/note";
import SearchBox from "../SearchBox/SearchBox";
import { useDebouncedCallback } from "use-debounce";

function App() {
  const queryClient = useQueryClient();

  const [inputValue, setInputValue] = useState("");

  const [page, setPage] = useState(1);
  const perPage = 12;

  const handleSearch = useDebouncedCallback((text: string) => {
    setPage(1);
    setInputValue(text);
  }, 1000);

  const { data, isLoading } = useQuery({
    queryKey: ["notes", page, inputValue],
    queryFn: () => fetchNotes({ page, perPage, searchText: inputValue }),
  });

  const handlePageChange = (selectedPage: number) => {
    setPage(selectedPage + 1);
  };

  const mutation = useMutation({
    mutationFn: (newNoteData: NewNoteData) => createNote(newNoteData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes"],
      });
      closeModal();
    },
  });

  const handleCreateMutation = (note: NewNoteData) => {
    mutation.mutate(note);
  };

  const deleteNoteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes"],
      });
      // toast.success('Deleted...')
    },
    onError: () => {
      // toast.error()
    },
  });

  const handleDeleteMutation = (id: string) => {
    deleteNoteMutation.mutate(id);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => setIsModalOpen(false);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={inputValue} onSearch={handleSearch} />
        {data && data.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            currentPage={page}
            onPageChange={handlePageChange}
          />
        )}
        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>
      {data && !isLoading && data.notes.length > 0 && (
        <NoteList notes={data.notes} handleDelete={handleDeleteMutation} />
      )}
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm
            handleCreate={handleCreateMutation}
            isLoading={mutation.isPending}
            onCancel={closeModal}
          />
        </Modal>
      )}
    </div>
  );
}

export default App;
