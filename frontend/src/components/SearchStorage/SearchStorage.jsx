import { useState, useEffect } from "react";
import { getAllSearch } from "../../service/requestApi";


export default function SearchStorage(){
    const [searchs,addSearch] = useState([]);

    useEffect(
        () => {
            async function fetchData(){
                const data = await getAllSearch();
                addSearch(data);
            };

            fetchData();
        },[]
    );

    const handleSearch = () => {
        searchs.forEach(element => {
            console.log(element);
        });
    };

    handleSearch();
}