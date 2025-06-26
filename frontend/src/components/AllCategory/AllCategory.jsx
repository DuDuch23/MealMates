import { useEffect, useState } from "react";
import { getCategory } from "../../service/requestApi";
import styles from "./AllCategory.module.scss";

export default function AllCategory({
  value = [],
  onChange = () => {},
}) {
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await getCategory();
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
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.button}
        onClick={() => setIsOpen((o) => !o)}
      >
        {value.length
          ? `${value.length} catégorie${value.length > 1 ? "s" : ""} sélectionnée${value.length > 1 ? "s" : ""}`
          : "Choisir des catégories"}
        <span className={styles.caret}>{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <ul className={styles.dropdown}>
          {categories.map((cat) => (
            <li key={cat.id}>
                <input
                    type="checkbox"
                    checked={value.includes(cat.id)}
                    onChange={() => toggleCat(cat.id)}
                />
                {cat.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
