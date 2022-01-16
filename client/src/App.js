import { Route, Link } from 'react-router-dom';
import React from 'react';
import { useState } from 'react';
import LoginForm from './components/LoginForm';

function App() {

  //Login details, move to database for security
  const adminUser = {
    email: "admin@admin.com",
    password: "admin123"
  }

  const parentUser = {
    email: "parent@parent.com",
    password: "parent123"
  }

  //const [user, setUser] = useState({name: "", email: ""});
  const [user, setUser] = useState({email: ""});
  const [error, setError] = useState("");

  const parentLogin = details => {
    //console.log(details);

    //TODO: Change to implement backend with database
    if (details.email == parentUser.email && details.password == parentUser.password) {
      console.log("Logged in");
      setUser({
        //name: details.name,
        email: details.email
      });
    } else {
      //console.log("Details do not match");
      setError("Details do not match!");
    }
  }

  const adminLogin = details => {
    //console.log(details);

    //TODO: Change to implement backend with database
    if (details.email == adminUser.email && details.password == adminUser.password) {
      console.log("Logged in");
      setUser({
        //name: details.name,
        email: details.email
      });
    } else {
      //console.log("Details do not match");
      setError("Details do not match!");
    }
  }

  //TODO: Currently just uses a ternary to determine which page to display, consider changing
  const Logout = () => {
    console.log("Logout");
    setUser({email: ""});
  }

  return (
    <div className="App">
      {(user.email != "") ? (
        <div className='welcome'>
          <h2>Welcome, <span>{"NAME HERE"}</span></h2>
          <button onClick={Logout}>Logout</button>
        </div>  
      ) : (
      <LoginForm parentLogin={parentLogin} adminLogin={adminLogin} error={error}></LoginForm>
      )}
    </div>
  );
}

export default App;
