import React, {Fragment} from 'react';

export const STUDENT_CHECK_MARKER = {
    //url: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg),
    stroke: '#000000',
    fillOpacity: 1,
    anchor: [11.5, 25],
}

export const STUDENT_X_MARKER = {
    //url: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg),
    stroke: '#000000',
    fillOpacity: 1,
    anchor: [12, 23.5],
}

export const STUDENT_MULTIPLE_MARKER = {
    //url: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg),
    stroke: '#000000',
    fillOpacity: 1,
    anchor: [15, 30],
}

export const STUDENT_MARKER = {
    //url: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg),
    stroke: '#000000',
    fillOpacity: 1,
    anchor: [16, 25],
}


export const SCHOOL_MARKER = {
    //path: "M0 32h16v-32h-16v32zM10 4h4v4h-4v-4zM10 12h4v4h-4v-4zM10 20h4v4h-4v-4zM2 4h4v4h-4v-4zM2 12h4v4h-4v-4zM2 20h4v4h-4v-4zM18 10h14v2h-14zM18 32h4v-8h6v8h4v-18h-14z",
    stroke: '#000000',
    fillOpacity: 1,
    anchor: [15, 30],
}

export const STOP_MARKER = {
    //path: "M32 18l-4-8h-6v-4c0-1.1-0.9-2-2-2h-18c-1.1 0-2 0.9-2 2v16l2 2h2.536c-0.341 0.588-0.536 1.271-0.536 2 0 2.209 1.791 4 4 4s4-1.791 4-4c0-0.729-0.196-1.412-0.536-2h11.073c-0.341 0.588-0.537 1.271-0.537 2 0 2.209 1.791 4 4 4s4-1.791 4-4c0-0.729-0.196-1.412-0.537-2h2.537v-6zM22 18v-6h4.146l3 6h-7.146z",
    stroke: '#000000',
    fillOpacity: 1,
    anchor: [20, 30],
}



const getStudentCheckSVG = (color) => {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 15 15" fill="${color}">` +
    '<path d="M15.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L12.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>' +
    '<path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>'+
    '</svg>'
}

const getStudentXSVG = (color) => {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 16 16" fill="${color}" >`+
    '<path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm6.146-2.854a.5.5 0 0 1 .708 0L14 6.293l1.146-1.147a.5.5 0 0 1 .708.708L14.707 7l1.147 1.146a.5.5 0 0 1-.708.708L14 7.707l-1.146 1.147a.5.5 0 0 1-.708-.708L13.293 7l-1.147-1.146a.5.5 0 0 1 0-.708z"/></svg>'
}

const getStudentMultipleSVG = (color) => {
    return `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30px" height="30px" viewBox="0 0 52 52" xml:space="preserve" fill="${color}" >` +
    '<g><path d="M42,22.3c-2.8-1.1-3.2-2.2-3.2-3.3s0.8-2.2,1.8-3c1.7-1.4,2.6-3.5,2.6-5.8c0-4.4-2.9-8.2-8-8.2   c-4.7,0-7.5,3.2-7.9,7.1c0,0.4,0.2,0.7,0.5,0.9c3.8,2.4,6.1,6.6,6.1,11.7c0,3.8-1.5,7.2-4.2,9.6c-0.2,0.2-0.2,0.6,0,0.8   c0.7,0.5,2.3,1.2,3.3,1.7c0.3,0.1,0.5,0.2,0.8,0.2h12.1c2.3,0,4.1-1.9,4.1-4v-0.6C50,25.9,46.2,24,42,22.3z"/>' +
    '<path d="M28.6,36.2c-3.4-1.4-3.9-2.6-3.9-3.9c0-1.3,1-2.6,2.1-3.6c2-1.7,3.1-4.1,3.1-6.9c0-5.2-3.4-9.7-9.6-9.7   c-6.1,0-9.6,4.5-9.6,9.7c0,2.8,1.1,5.2,3.1,6.9c1.1,1,2.1,2.3,2.1,3.6c0,1.3-0.5,2.6-4,3.9c-5,2-9.9,4.3-9.9,8.5V45v1   c0,2.2,1.8,4,4.1,4h27.7c2.3,0,4.2-1.8,4.2-4v-1v-0.4C38,40.5,33.6,38.2,28.6,36.2z"/></g></svg>'
}

const getStudentSVG = (color) => {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" viewBox="0 0 16 16" fill="${color}" >` +
    '<path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>' +
    '</svg>'
}

const getSchoolSVG = (color) => {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 15 15" fill="${color}">`+
    '<path d="M7.5 4.5L11.5 6.5V14.5H3.5V6.5L7.5 4.5ZM7.5 4.5V0M0 14.5H15M1.5 14.5V8.5H3.5M13.5 14.5V8.5H11.5M6.5 14.5V11.5H8.5V14.5M7.5 0.5H10.5V2.5H7.5M7.5 9.5C6.94772 9.5 6.5 9.05228 6.5 8.5C6.5 7.94772 6.94772 7.5 7.5 7.5C8.05228 7.5 8.5 7.94772 8.5 8.5C8.5 9.05228 8.05228 9.5 7.5 9.5Z" stroke="black"/></svg>'
}

const getStopSVG = (color) => {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" viewBox="0 0 512 512" fill="${color}"><g id="School_bus"><path d="M321.4221,361.1694c1.7774,57.816,85.7163,57.83,87.5.0011C407.1469,303.3556,323.208,303.3406,321.4221,361.1694Z"/><path d="M85.1743,361.1694c1.7773,57.816,85.7162,57.83,87.5.0011C170.8991,303.3545,86.96,303.3406,85.1743,361.1694Z"/><path d="M465.8356,159.8756c3.042-27.3491-15.2954-52.3632-43.75-52.4124h-271.25a43.6541,43.6541,0,0,0-43.75,43.75v105h-.0876L61.7612,275.55a26.2963,26.2963,0,0,0-15.9256,24.2377v48.3a13.0922,13.0922,0,0,0,13.125,13.125c3.3838-92.8641,136.5842-92.8213,140,0h96.25c3.3838-92.8641,136.5842-92.8213,140,0h17.5a13.1065,13.1065,0,0,0,13.125-13.125C465.8441,348.0925,465.8292,159.89,465.8356,159.8756Zm-275.625,96.3376h-56.875v-96.25h56.875Zm83.125,0h-56.875v-96.25h56.875Zm83.125,0h-56.875v-96.25h56.875Zm83.125,0h-56.875v-96.25h56.875Z"/></g></svg>`
}



const ICONS = {
    school: {
        marker: SCHOOL_MARKER,
        fileFunc: getSchoolSVG
    },
    student: {
        marker: STUDENT_MARKER,
        fileFunc: getStudentSVG
    },
    studentCheck: {
        marker: STUDENT_CHECK_MARKER,
        fileFunc: getStudentCheckSVG
    },
    studentX: {
        marker: STUDENT_X_MARKER,
        fileFunc: getStudentXSVG
    },
    studentMultiple: {
        marker: STUDENT_MULTIPLE_MARKER,
        fileFunc: getStudentMultipleSVG
    },
    stop: {
        marker: STOP_MARKER,
        fileFunc: getStopSVG
    },
}

export const STUDENT_CHECK_LEGEND = (color) => <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 15 15" fill={color}>
<path d="M15.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L12.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
<path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
</svg>

export const STUDENT_X_LEGEND = (color) => <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 16 16" fill={color} >
<path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm6.146-2.854a.5.5 0 0 1 .708 0L14 6.293l1.146-1.147a.5.5 0 0 1 .708.708L14.707 7l1.147 1.146a.5.5 0 0 1-.708.708L14 7.707l-1.146 1.147a.5.5 0 0 1-.708-.708L13.293 7l-1.147-1.146a.5.5 0 0 1 0-.708z"/></svg>

export const STOP_LEGEND = (color) =><svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" viewBox="0 0 512 512" fill={color}><g id="School_bus"><path d="M321.4221,361.1694c1.7774,57.816,85.7163,57.83,87.5.0011C407.1469,303.3556,323.208,303.3406,321.4221,361.1694Z"/><path d="M85.1743,361.1694c1.7773,57.816,85.7162,57.83,87.5.0011C170.8991,303.3545,86.96,303.3406,85.1743,361.1694Z"/><path d="M465.8356,159.8756c3.042-27.3491-15.2954-52.3632-43.75-52.4124h-271.25a43.6541,43.6541,0,0,0-43.75,43.75v105h-.0876L61.7612,275.55a26.2963,26.2963,0,0,0-15.9256,24.2377v48.3a13.0922,13.0922,0,0,0,13.125,13.125c3.3838-92.8641,136.5842-92.8213,140,0h96.25c3.3838-92.8641,136.5842-92.8213,140,0h17.5a13.1065,13.1065,0,0,0,13.125-13.125C465.8441,348.0925,465.8292,159.89,465.8356,159.8756Zm-275.625,96.3376h-56.875v-96.25h56.875Zm83.125,0h-56.875v-96.25h56.875Zm83.125,0h-56.875v-96.25h56.875Zm83.125,0h-56.875v-96.25h56.875Z"/></g></svg>

export const SCHOOL_LEGEND = (color) =><svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 15 15" fill={color}>
<path d="M7.5 4.5L11.5 6.5V14.5H3.5V6.5L7.5 4.5ZM7.5 4.5V0M0 14.5H15M1.5 14.5V8.5H3.5M13.5 14.5V8.5H11.5M6.5 14.5V11.5H8.5V14.5M7.5 0.5H10.5V2.5H7.5M7.5 9.5C6.94772 9.5 6.5 9.05228 6.5 8.5C6.5 7.94772 6.94772 7.5 7.5 7.5C8.05228 7.5 8.5 7.94772 8.5 8.5C8.5 9.05228 8.05228 9.5 7.5 9.5Z" stroke="black"/></svg>


export const STUDENT_MULTIPLE_LEGEND = (color) => <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30px" height="30px" viewBox="0 0 52 52" fill={color} >
<g><path d="M42,22.3c-2.8-1.1-3.2-2.2-3.2-3.3s0.8-2.2,1.8-3c1.7-1.4,2.6-3.5,2.6-5.8c0-4.4-2.9-8.2-8-8.2   c-4.7,0-7.5,3.2-7.9,7.1c0,0.4,0.2,0.7,0.5,0.9c3.8,2.4,6.1,6.6,6.1,11.7c0,3.8-1.5,7.2-4.2,9.6c-0.2,0.2-0.2,0.6,0,0.8   c0.7,0.5,2.3,1.2,3.3,1.7c0.3,0.1,0.5,0.2,0.8,0.2h12.1c2.3,0,4.1-1.9,4.1-4v-0.6C50,25.9,46.2,24,42,22.3z"/>
<path d="M28.6,36.2c-3.4-1.4-3.9-2.6-3.9-3.9c0-1.3,1-2.6,2.1-3.6c2-1.7,3.1-4.1,3.1-6.9c0-5.2-3.4-9.7-9.6-9.7   c-6.1,0-9.6,4.5-9.6,9.7c0,2.8,1.1,5.2,3.1,6.9c1.1,1,2.1,2.3,2.1,3.6c0,1.3-0.5,2.6-4,3.9c-5,2-9.9,4.3-9.9,8.5V45v1   c0,2.2,1.8,4,4.1,4h27.7c2.3,0,4.2-1.8,4.2-4v-1v-0.4C38,40.5,33.6,38.2,28.6,36.2z"/></g></svg>

export const STUDENT_OTHER_ROUTE_LEGEND = (color) => <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 16 16" fill={color} >
<path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
</svg>


export const getIcon = (icon, color) => {
    return {
        ...ICONS[icon].marker,
        url: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(ICONS[icon].fileFunc(color)),
    }
}



