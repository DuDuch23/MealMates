import React, { useEffect, useState } from 'react';
import { addSearchIndexDB, getAllSearch } from '../../service/indexDB';
import styles from './SearchBar.module.scss';

const SearchBar = () => {
  const [searchInput, setSearchInput] = useState('');
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]);
  const [latestUserSearch, setLatestUserSearch] = useState('');

  const handleInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (!searchInput.trim()) return;

    saveSearchToIndexDB(searchInput);
  };

  const saveSearchToIndexDB = async (searchValue) => {
    const currentUser = JSON.parse(sessionStorage.getItem("user"));
    console.log(searchValue);
    if (currentUser) {
      // Préparer un objet complet pour le stockage
      const searchRecord = {
        search: searchValue,
        userId: currentUser.id,
        timestamp: Date.now(),
      };
      try {
        await addSearchIndexDB(searchRecord, currentUser);
      } catch (error) {
        console.error("Erreur sauvegarde recherche :", error);
      }
    }
  };

  useEffect(() => {
    async function updateSuggestionsAndPlaceholder() {
      const allSearchRecords = await getAllSearch();
      const currentUser = JSON.parse(sessionStorage.getItem("user"));
      if (!currentUser) return;

      // Filtrer par userId (assumer que getAllSearch renvoie un tableau d’objets avec userId et search)
      const userSearches = allSearchRecords
        .filter((record) => record.userId === currentUser.id)
        .map((record) => record.search);

      if (userSearches.length > 0) {
        setLatestUserSearch(userSearches[userSearches.length - 1]);
      }

      const filteredSuggestions = searchInput
        ? userSearches.filter((item) =>
            item.toLowerCase().includes(searchInput.toLowerCase())
          )
        : [];

      setAutocompleteSuggestions(filteredSuggestions);
    }

    updateSuggestionsAndPlaceholder();
  }, [searchInput]);

  return (
    <form className={styles['search-offer']} onSubmit={handleSearchSubmit}>
      <input
        type="text"
        className={styles['search-input']}
        value={searchInput}
        onChange={handleInputChange}
        placeholder={
          latestUserSearch ? `Ex : ${latestUserSearch}` : 'Rechercher...'
        }
        aria-label="Search"
        autoComplete="off"
      />
      <button type="submit">Rechercher</button>

      {searchInput && autocompleteSuggestions.length > 0 && (
        <ul className={styles['search-suggestions']}>
          {autocompleteSuggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => setSearchInput(suggestion)}
              className={styles['suggestion-item']}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
};

export default SearchBar;
