import React from 'react';

export default function AllCategory({ categories, onChange }) {
    return (
        <div className="category-select">
            <select onChange={onChange} className="category-select__dropdown">
                <option value="">Toutes les catégories</option>
                <option value="">Toutes les catégories</option>
                <option value="">Toutes les catégories</option>
                {/* {categories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                ))} */}
            </select>
        </div>
    );
}