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

  return (
    <div className='admin-page'>
        <SidebarSliding/>
        <Header textToDisplay={"Admin Portal"}></Header>
        <AdminTable title={title} header={header} data={data} />
    </div>
  )
}
export default AdminSchoolsPage;
