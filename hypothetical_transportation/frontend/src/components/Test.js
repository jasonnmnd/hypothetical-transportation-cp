import React from 'react';
import { Routes, Route } from 'react-router-dom';


function Test() {
  return (
    <div>
      <Routes>
          <Route exact path=":users" element={<h3>Users</h3>}></Route>
          <Route exact path=":students" element={<h3>Students</h3>}></Route>
          <Route exact path=":schools" element={<h3>Schools</h3>}></Route>
          <Route exact path=":routes" element={<h3>Routes</h3>}></Route>
      </Routes>
    </div>
  )
}

export default Test;
