import React, { useState } from 'react';
import AllCategory from '../AllCategory/AllCategory';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(query);
  };

  return (
    <form className='search-offer' onSubmit={handleSubmit}>
      <AllCategory
        categories={["Entrée", "Plat principal", "Dessert"]}
        onChange={(event) => console.log(event.target.value)}
      />
      <input
        className='search-offer__input'
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