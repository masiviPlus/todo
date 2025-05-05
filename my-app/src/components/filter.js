import React, { useState, useEffect, useRef } from "react";
import { ReactComponent as MyIcon } from '../assets/E257.svg';

export function Filter({className}) {
    const [isOpen, setIsOpen] = useState(false);
    const filterRef = useRef(null);
    const toggleOpen = () => {
      setIsOpen(prev => !prev);
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
    
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div id={isOpen ? 'filter' : 'hidden'} ref={filterRef}>
            {isOpen && (
                <div id="filter-options" className="">
                    <h2>Statuses:</h2>
                    <div id="filter-checks">
                        <label className="status-check">
                            <input type="checkbox" class="filter-checkbox" value="high-priority" />
                                TODO
                        </label>
                        <label className="status-check">
                            <input type="checkbox" class="filter-checkbox" value="low-priority" />
                                In Progress
                        </label>
                        <label className="status-check">
                            <input type="checkbox" class="filter-checkbox" value="bug" />
                                Ready For QA
                        </label>
                        <label className="status-check">
                            <input type="checkbox" class="filter-checkbox" value="feature" />
                                In Testing
                        </label>
                        <label className="status-check">
                            <input type="checkbox" class="filter-checkbox" value="feature" />
                                Reviewed
                        </label>
                        <label className="status-check">
                            <input type="checkbox" class="filter-checkbox" value="feature" />
                                Done
                        </label>
                        <label className="status-check">
                            <input type="checkbox" class="filter-checkbox" value="feature" />
                                Archived
                        </label>
                    </div>
                    <h2>Priorities:</h2>
                    <div id="priority-checks">
                        <label className="priority-check">
                            <input type="checkbox" class="filter-checkbox" value="feature" />
                            😎
                        </label>
                        <label className="priority-check">
                            <input type="checkbox" class="filter-checkbox" value="feature" />
                            🟠
                        </label>
                        <label className="priority-check">
                            <input type="checkbox" class="filter-checkbox" value="feature" />
                            🚨
                        </label>
                    </div>
                    <div >
                        <h2>Title:</h2>
                            <input id="title-input" placeholder="Title..." ></input>
                        
                        
                    </div>
            
                </div>
             )}
            

            <div id="filter-btn" onClick={toggleOpen} className={className}>
                <span><MyIcon width={32} height={50}></MyIcon></span>
            </div>
        </div>
        
    )

}
export default Filter;
