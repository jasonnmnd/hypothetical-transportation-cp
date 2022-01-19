import React from "react";

//route is one backend function that takes in a string?
const route_to = (string)=>{
    
}

//buttons are a list of data in the form of sidebardata
function Sidebar({buttons}){
    
    return(
        <div className="sidebar">
            <ul>
                {
                    
                    buttons.map((button,i)=>{
                        return (<div key={i}>
                            <li><button className={button.current==="true"? "currentPage" : ""} onClick={route_to(button.title)}>{button.title}</button></li>
                            <br></br>
                        </div>);
                    })
                }
            </ul>
        </div>
    )
}
export default Sidebar;