import React from 'react';
import SidebarSliding from '../components/sidebar/SidebarSliding';
import Header from '../../header/Header';
import AdminTable from "../components/table/AdminTable";

function AdminStudentsPage() {

  const title = "students"
  const header=["name","studentid","school","route"]
  const data = [
    {
      name: "Anna",
      studentid: 12,
      school: "School",
      route:1,
      id:1,
    },

    {
      name: "Emma",
      studentid: 1223,
      school: "sss",
      route:4,
      id:4,
    }
  ]
  return (
    <div className='admin-page'>
        <SidebarSliding/>
        <Header textToDisplay={"Admin Portal"}></Header>
        <AdminTable title={title} header={header} data={data}/>
    </div>
  )
}
export default AdminStudentsPage;
