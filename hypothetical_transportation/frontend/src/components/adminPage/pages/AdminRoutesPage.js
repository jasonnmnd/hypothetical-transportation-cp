import React from 'react';
import SidebarSliding from '../components/sidebar/SidebarSliding';
import Header from '../../header/Header';
import AdminTable from '../components/table/AdminTable';

function AdminRoutesPage() {

  const title = "Routes"
  const header = ["name", "school", "num_students", "description"]
  const data = [
    {
      id: 122,
      name: 1,
      school: "Random Elementary School",
      num_students: 20,
      description: "xxx",
    },

    {
      id:888,
      name: 2,
      school: "Random Middle School",
      num_students: 2,
      description: "xxx",
    },

    {
      id:999,
      name: 3,
      school: "Random High School",
      num_students: 4,
      description: "xxx",
    },

    {
      id:900,
      name: 4,
      school: "Random University",
      num_students: 30,
      description: "xxx",
    },

    {
      id:999,
      name: 5,
      school: "Another Random High School",
      num_students: 300,
      description: "xxx",
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
