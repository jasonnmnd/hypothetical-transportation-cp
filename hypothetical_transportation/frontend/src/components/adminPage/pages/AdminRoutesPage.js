import React from 'react';
import SidebarSliding from '../components/sidebar/SidebarSliding';
import Header from '../../header/Header';
import AdminTable from '../components/table/AdminTable';

function AdminRoutesPage() {

  const title = "Routes"
  const header = ["route", "school", "num_students"]
  const data = [
    {
      id: 122,
      route: 1,
      school: "Random Elementary School",
      num_students: 20
    },

    {
      id:888,
      route: 2,
      school: "Random Middle School",
      num_students: 2
    },

    {
      id:999,
      route: 3,
      school: "Random High School",
      num_students: 4
    },

    {
      id:900,
      route: 4,
      school: "Random University",
      num_students: 30
    },

    {
      id:999,
      route: 5,
      school: "Another Random High School",
      num_students: 300
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
          <AdminTable title={title} header={header} data={data} search={search}></AdminTable>
          <div className="prev-next-buttons">
              <button onClick={handlePrevClick}>Prev</button>
              <button onClick={handleNextClick}>Next</button> 
          </div>
        </div>
    </div>
  )
}
export default AdminRoutesPage;
