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
      school: "Random Elementary School"
    },

    {
      school: "Random Middle School",
    },

    {
      school: "Random High School",
    },

    {
      school: "Random University",
    },

    {
      school: "Another Random High School",
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
export default AdminSchoolsPage;
