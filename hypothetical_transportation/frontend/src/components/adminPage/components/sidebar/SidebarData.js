import React from 'react';
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as GiIcons from "react-icons/gi";

export const SidebarData = [
    {
        title: 'Home',
        path: '/admin',
        icon: <AiIcons.AiFillHome />,
        cName: 'nav-text'
    },

    {
        title: 'Users',
        path: '/admin/users',
        icon: <IoIcons.IoIosWoman />,
        cName: 'nav-text'
    },

    {
        title: 'Students',
        path: '/admin/students',
        icon: <IoIcons.IoIosBody />,
        cName: 'nav-text'
    },

    {
        title: 'Schools',
        path: '/admin/schools',
        icon: <FaIcons.FaSchool />,
        cName: 'nav-text'
    },

    {
        title: 'Routes',
        path: '/admin/routes',
        icon: <GiIcons.GiPathDistance />,
        cName: 'nav-text'
    },
    {
        title: 'Your Parent Portal',
        path: '/parent',
        icon: <AiIcons.AiFillHome />,
        cName: 'nav-text'
    },
]
