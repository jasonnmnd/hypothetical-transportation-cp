import React, {useEffect, useState} from 'react';
import SidebarSliding from '../components/sidebar/SidebarSliding';
import Header from '../../header/Header';
import AdminTable from '../components/table/AdminTable';
import "../adminPage.css";
import axios from 'axios';

function AdminUsersPage() {

  //Mock Users Data (API Call later for real data)
  const title = "Parent Users"

  const handlePrevClick = () => {
    //API Call here to get new data to display for next page
    console.log("Prev Clicked");
  }

  const handleNextClick = () => {
    //API Call here to get new data to display for next page
    console.log("Next Clicked");
  }

  const emptyUser = [{
    id: 0,
    first_name: "",
    last_name: "",
    email: "",
    address: "",
  }]

  const [users, setUsers] = useState(emptyUser);

  const getUsers = () => {
    axios.get('/api/user/')
        .then(res => {
            setUsers(res.data);
        }).catch(err => console.log(err));
    }

  useEffect(() => {
    getUsers();
  }, []);


  const searchUser = (i1,i2) => {
    axios.get(`/api/user?${i1}Includes='${i2}'`)
        .then(res => {
          console.log(`/api/user?${i1}Includes='${i2}'`)
          setUsers(res.data);
        }).catch(err => console.log(err));
  }
  

  const search = (value)=>{
    //somehow get backend to update data (with usestate?)
    searchUser(value.by, value.value)
  }

  return (
    <div className='admin-page'>
        <SidebarSliding/>
        <Header textToDisplay={"Admin Portal"}></Header>
        <div className='table-and-buttons'>
            <AdminTable title={title} header={Object.keys(emptyUser[0])} data={users} search={search}/>
            <div className="prev-next-buttons">
                <button onClick={handlePrevClick}>Prev</button>
                <button onClick={handleNextClick}>Next</button> 
            </div>
          </div>
    </div>
  )
}
export default AdminUsersPage;
