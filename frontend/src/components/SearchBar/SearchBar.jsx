import React, { useState } from 'react';
import AllCategory from '../AllCategory/AllCategory';
import { addSearchIndexDB } from '../../service/indexDB';
import styles from './SearchBar.module.scss';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [user,setUser] = useState([]);

  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(query);
    handleAddSearch(query);
  };

  const handleAddSearch = (search) => {
    setUser(JSON.parse(sessionStorage.getItem("user")));
    if(user){
      addSearchIndexDB(search,user.id);
    };
  };

  return (
    <form className={styles['search-offer']} onSubmit={handleSubmit}>
      <input
        className={styles['search-offer__input']}
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Rechercher..."
        aria-label="Search"
      />
      <button type="submit">Rechercher</button>
    </form>
  );
};

export default SearchBar;