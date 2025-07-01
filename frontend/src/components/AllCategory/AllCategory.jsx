import { useEffect, useState } from "react";
import { getCategory } from "../../service/requestApi";
import styles from "./AllCategory.module.scss";

export default function AllCategory({ value = [], onChange = () => {}, setCategories = () => {} }) {
  const [categories, setLocalCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await getCategory();
        setLocalCategories(res?.data || []);
        setCategories(res?.data || []);
      } catch (e) {
        console.error("Catégories introuvables", e);
      }
    })();
  }, []);

  const toggleCat = (id) => {
    const next = value.includes(id)
      ? value.filter((v) => v !== id)
      : [...value, id];
    onChange(next);
  };

  return (
    <div className={`${styles.wrapper} ${isOpen ? styles.open : ""}`}>
      <button
        type="button"
        className={styles.button}
        onClick={() => setIsOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {value.length
          ? `${value.length} catégorie${value.length > 1 ? "s" : ""} sélectionnée${value.length > 1 ? "s" : ""}`
          : "Choisir des catégories"}
        <span className={styles.caret} aria-hidden="true">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <ul className={styles.dropdown} role="listbox" tabIndex={-1}>
          {categories.map((cat) => (
            <li key={cat.id}>
              <label className={styles["custom-checkbox"]}>
                <input
                  type="checkbox"
                  checked={value.includes(cat.id)}
                  onChange={() => toggleCat(cat.id)}
                />
                <span className={styles.checkmark}></span>
                {cat.name}
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
