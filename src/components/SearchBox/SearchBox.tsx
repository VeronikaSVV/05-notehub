import type { DebouncedState } from "use-debounce";
import css from "./SearchBox.module.css";

interface SearchBoxProps {
  value: string;
  onSearch: DebouncedState<(text: string) => void>;
}

export default function SearchBox({ value, onSearch }: SearchBoxProps) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    onSearch(e.currentTarget.value);
  };

  return (
    <input
      className={css.input}
      type="text"
      defaultValue={value}
      onChange={handleChange}
      placeholder="Search notes"
    />
  );
}
