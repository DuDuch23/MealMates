import React, { use } from 'react';
import { getCategory } from '../../service/requestApi';
import { useState, useEffect } from 'react';
import styles from './AllCategory.module.css';


export default function AllCategory() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategory();
                if (data && data.data) {
                    setCategories(data.data);
                    console.log("categories", data.data);
                } else {
                    console.error("Erreur lors de la récupération des catégories");
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des catégories", error);
            }
        };
        fetchCategories();
    }, []);

    const onChange = (e) => {
        const selectedCategory = e.target.value;
        console.log("Selected category:", selectedCategory);
    };




    return (
        <div className={styles["category-select"]}>
            <select onChange={onChange} className={styles["category-select__dropdown"]}>
                {categories.map((category, index) => (
                    <option key={index} value={category.name}>{category.name}</option>
                ))}
            </select>
        </div>
    );
}