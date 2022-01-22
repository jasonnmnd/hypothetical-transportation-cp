import React from 'react';
import SidebarSliding from '../components/sidebar/SidebarSliding';
import Header from '../../header/Header';
import AdminTable from '../components/table/AdminTable';

function AdminSchoolsPage() {

  //Mock Users Data (API Call later for real data)
  const title = "Schools"
  const header = ["school"]
  const data = [
    {
      id: 123,
      name: "Random Elementary School"
    },

    {
      id: 124,
      name: "Random Middle School",
    },

    {
      id:555,
      name: "Random High School",
    },

    {
      id:577,
      name: "Random University",
    },

    {
      id:899,
      name: "Another Random High School",
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
export default AdminSchoolsPage;
