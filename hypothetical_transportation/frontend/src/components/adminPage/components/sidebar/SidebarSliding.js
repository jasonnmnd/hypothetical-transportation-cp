import React, { useState } from 'react';
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { Link } from 'react-router-dom';
import { SidebarData } from './SidebarData';
import "./sidebarsliding.css";
import { IconContext } from 'react-icons';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

/*
Majority of the functionality of sliding navbar taken from this tutorial:
https://www.youtube.com/watch?v=CXa0f4-dWi4

With edits to navbar items, styling, and some toggling options and routing specific for the project
*/
function SidebarSliding() {
    // const [sidebarShowing, setSidebarShowing] = useState(false);

    // const showSidebar = () => {
    //     setSidebarShowing(!sidebarShowing);
    // }
  return (
    <>
        {/* <div className='sidebarsliding'>
            <Link to="#" className='menu-bars'>
                <FaIcons.FaBars onClick={showSidebar}/>
            </Link>
        </div> */}
        {/* <nav className={sidebarShowing ? 'nav-menu active' : 'nav-menu'}> */}
        <nav className={'nav-menu active'}>
            {/* <ul className='nav-menu-items' onClick={showSidebar}> */}
            <ul className='nav-menu-items'>
                {/* <li className='navbar-toggle'>
                    <Link to='#' className='menu-bars'>
                        <AiIcons.AiOutlineClose />
                    </Link>
                </li> */}
                {SidebarData.map((item, index) => {
                    return (
                        <li key={index} className={item.cName}>
                            <Link to={item.path}>
                                {item.icon}
                                <span>{item.title}</span>
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </nav>
    </>
  );
}



SidebarSliding.propTypes = {
    
  }
  
const mapStateToProps = (state) => ({
  
});
  
export default connect(mapStateToProps)(SidebarSliding)
