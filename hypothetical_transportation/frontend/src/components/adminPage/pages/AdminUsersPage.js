import React from 'react';
import SidebarSliding from '../components/sidebar/SidebarSliding';
import Header from '../../header/Header';
import AdminTable from '../components/table/AdminTable';



function AdminUsersPage() {

  //Mock Users Data (API Call later for real data)
  const title = "Parents"
  const header = ["name", "email"]
  const data = [
    {
      name: "mom1",
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
export default AdminUsersPage;
