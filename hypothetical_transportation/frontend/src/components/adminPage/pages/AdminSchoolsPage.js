import React, {useEffect, useState} from 'react';
import SidebarSliding from '../components/sidebar/SidebarSliding';
import Header from '../../header/Header';
import AdminTable from '../components/table/AdminTable';
import axios from 'axios';
// import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
// import { getSchools } from '../../../actions/schools';

function AdminSchoolsPage() {

  //Mock Users Data (API Call later for real data)
  const title = "Schools"
  const header = ["id", "name", "address"]
  const data = [
    {
      id: 123,
      name: "Random Elementary School",
      address: "123 West Street"
    },

    {
      id: 124,
      name: "Random Middle School",
      address: "345 Main Street"
    },

    {
      id:555,
      name: "Random High School",
      address: "123 Test Rd."
    },

    {
      id:577,
      name: "Random University",
      address: "456 Test Circle"
    },

    {
      id:899,
      name: "Another Random High School",
      address: "987 Test Way"
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

  // const propTypes = {
  //   schools: PropTypes.array.isRequired
  // }

  // useEffect(() => {
  //   //this.props.getSchools();
  //   getSchools();
  // }, []);

  const emptySchools = [{
    id: 0,
    name: "",
    address: "",
  }]

  const [schools, setSchools] = useState(emptySchools);

  const getSchools = () => {
    axios.get('/api/school/')
        .then(res => {
            console.log(res.data);
            setSchools(res.data);
        }).catch(err => console.log(err));
    }

  useEffect(() => {
    getSchools();
    console.log(schools);
  }, []);


  return (
    <div className='admin-page'>
        <SidebarSliding/>
        <Header textToDisplay={"Admin Portal"}></Header>
        <div className='table-and-buttons'>
          {/* <AdminTable title={title} header={header} data={data} search={search}/> */}
          <AdminTable title={title} header={header} data={schools} search={search}/>
            <div className="prev-next-buttons">
              <button onClick={handlePrevClick}>Prev</button>
              <button onClick={handleNextClick}>Next</button> 
            </div>
        </div>
    </div>
  )
}

// const mapStateToProps = state => ({
//   schools: state.schools.schools
// })

// export default connect(mapStateToProps, { getSchools })(AdminSchoolsPage);

export default AdminSchoolsPage;