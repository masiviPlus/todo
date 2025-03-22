import React, { useState, useEffect, useRef } from "react";
import { ReactComponent as MyIcon } from '../assets/E257.svg';

export function Filter({className}) {

    return (
        <div id="filter-btn" className={className}>
            
            <MyIcon width={32} height={50}></MyIcon>
        </div>
    )

}
export default Filter;
