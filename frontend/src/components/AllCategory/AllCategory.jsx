import React, { use } from 'react';
import { getCategory } from '../../service/requestApi';
import { useState, useEffect } from 'react';
import styles from './AllCategory.module.css';

export default function AllCategory({ selectedCategories, onCategoryChange }) {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategory();
                if (data && data.data) {
                    setCategories(data.data);
                } else {
                    console.error("Erreur lors de la récupération des catégories");
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des catégories", error);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map(option => parseInt(option.value));
        onCategoryChange(selectedOptions);
    };

    return (
        <div className={styles["category-select"]}>
            <select
            multiple 
            className={styles["category-select__dropdown"]}
            onChange={handleChange}
            value={selectedCategories}>
            
                {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                ))}
            </select>
        </div>
    );
}