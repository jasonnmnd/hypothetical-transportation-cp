import React,{useState} from 'react';
import SidebarSliding from '../components/sidebar/SidebarSliding';
import Header from '../../header/Header';
import AdminTable from "../components/table/AdminTable";

function AdminStudentsPage() {

  //Mock Student Data (API Call Later for Real Data)
  const title = "Students"
  const header=["name","studentid","school","route"]
  const data = [
    {
      name: "Anna",
      studentid: 12,
      school: "School 1",
      route:1,
      id:1,
    },

    {
      name: "Emma",
      studentid: 1223,
      school: "School 2",
      route:4,
      id:4,
    },

    {
      name: "Mark",
      studentid: 1213214,
      school: "School 3",
      route:3,
      id:6,
    },

    {
      name: "Sam",
      studentid: 23423,
      school: "School 4",
      route:4,
      id:5,
    }

  ]

  const [dispdata, setData]=useState(data)

  const search = (value)=>{
    //somehow get backend to update data (with usestate?)
    value.by===""? setData(data): setData(data.filter(data=>data[value.by].toLowerCase().includes(value.value.toLowerCase())))
  }

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
          <AdminTable title={title} header={header} data={dispdata} search={search}/>
          <div className="prev-next-buttons">
              <button onClick={handlePrevClick}>Prev</button>
              <button onClick={handleNextClick}>Next</button> 
          </div>
        </div>
    </div>
    
  )
}
export default AdminStudentsPage;
