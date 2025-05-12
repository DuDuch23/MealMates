import React, { useEffect, useState } from 'react';
import "./avis.css";

function Avis({id}){

    return(
        <>
        <h2>Avis</h2>
        <div className='slider'>
            <div className='slider-btn'></div>
            <div className="slider-view">
               {/* <div className="slider-item"></div> */}
            </div>
        </div>
        </>
    );
}

export default Avis;