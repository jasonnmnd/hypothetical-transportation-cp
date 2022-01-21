import React from 'react';
import SidebarSliding from '../components/sidebar/SidebarSliding';
import Header from '../../header/Header';
import AdminTable from '../components/table/AdminTable';
import "../adminPage.css";

function AdminUsersPage() {

  //Mock Users Data (API Call later for real data)
  const title = "Parent Users"
  const header = ["name", "email"]
  const data = [
    {
      name: "TEST",
      email: "mom1@gmail.com"
    },

    {
      name: "mom2",
      email: "mom2@gmail.com"
    },

    {
      name: "mom3",
      email: "mom3@gmail.com"
    },

    {
      name: "mom4",
      email: "mom4@gmail.com"
    },

    {
      name: "mom5",
      email: "mom5@gmail.com"
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

  return (
    <div className='admin-page'>
        <SidebarSliding/>
        <Header textToDisplay={"Admin Portal"}></Header>
        <div className='table-and-buttons'>
            <AdminTable title={title} header={header} data={data} />
            <div className="prev-next-buttons">
                <button onClick={handlePrevClick}>Prev</button>
                <button onClick={handleNextClick}>Next</button> 
            </div>
          </div>
    </div>
  )
}
export default AdminUsersPage;
