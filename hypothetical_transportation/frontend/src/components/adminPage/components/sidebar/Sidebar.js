import React from "react";
import { renderMatches } from "react-router-dom";

//route is one backend function that takes in a string?


//buttons are a list of data in the form of sidebardata
function Sidebar({buttons}){

    const route_to = (button) => {
        console.log(button.title);
    }

    const handleButtonClick = (button) => {
        route_to(button);
    }
    
    return(
        <div className="sidebar">
            <ul>
                {  
                    buttons.map((button,i)=>{
                        return (<div key={i}>
                            <li><button className={button.current==="true"? "currentPage" : ""} onClick={() => handleButtonClick(button)}>{button.title}</button></li>
                            <br></br>
                        </div>);
                    })
                }
            </ul>
        </div>
    )
}
export default Sidebar;