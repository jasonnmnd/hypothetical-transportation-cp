import React from 'react';
import SidebarSliding from '../components/sidebar/SidebarSliding';
import Header from '../../header/Header';
import AdminTable from '../components/table/AdTable';
import "../adminPage.css";

function AdminUsersPage() {

  //Mock Users Data (API Call later for real data)
  const title = "Parent Users"
  const header = ["name", "email", "id"]
  const data = [
    {
      name: "TEST",
      email: "mom1@gmail.com",
      id: 132
    },

    {
      name: "mom2",
      email: "mom2@gmail.com",
      id: 1
    },

    {
      name: "mom3",
      email: "mom3@gmail.com",
      id: 2
    },

    {
      name: "mom4",
      email: "mom4@gmail.com",
      id: 3
    },

    {
      name: "mom5",
      email: "mom5@gmail.com",
      id: 23
    }
  ]

  const handlePrevClick = () => {
    //API Call here to get new data to display for next page
    console.log("Prev Clicked");
  }

  const handleNextClick = () => {
    //API Call here to get new data to display for next page
    console.log("Next Clicked");
  }

  const search = (value)=>{
    //somehow get backend to update data (with usestate?)
  }

  return (
    <div className='admin-page'>
        <SidebarSliding/>
        <Header textToDisplay={"Admin Portal"}></Header>
        <div className='table-and-buttons'>
            <AdminTable title={title} header={header} data={data} search={search}/>
            <div className="prev-next-buttons">
                <button onClick={handlePrevClick}>Prev</button>
                <button onClick={handleNextClick}>Next</button> 
            </div>
          </div>
    </div>
  )
}
export default AdminUsersPage;
