import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import NoteList from "../NoteList/NoteList";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import Pagination from "../Pagination/Pagination";
import { fetchNotes } from "../../services/noteService";
import css from "./App.module.css";
import SearchBox from "../SearchBox/SearchBox";
import { useDebouncedCallback } from "use-debounce";

function App() {
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
    placeholderData: keepPreviousData,
  });

  const handlePageChange = (selectedPage: number) => {
    setPage(selectedPage);
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
        <NoteList notes={data.notes} />
      )}
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm
            onCancel={closeModal}
          />
        </Modal>
      )}
    </div>
  );
}

export default App;
