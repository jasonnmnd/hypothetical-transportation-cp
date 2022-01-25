import React, {useEffect, useState} from 'react';
import SidebarSliding from '../components/sidebar/SidebarSliding';
import Header from '../../header/Header';
import AdminTable from '../components/table/AdminTable';
import axios from 'axios';
import { Link } from 'react-router-dom';
// import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
// import { getSchools } from '../../../actions/schools';

function AdminSchoolsPage() {

  //Mock Users Data (API Call later for real data)
  const title = "Schools"

  const handlePrevClick = () => {
    //API Call here to get new data to display for next page
    console.log("Prev Clicked");
  }

  const handleNextClick = () => {
    //API Call here to get new data to display for next page
    console.log("Next Clicked");
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
            setSchools(res.data);
        }).catch(err => console.log(err));
    }

  useEffect(() => {
    getSchools();
  }, []);


  const searchSchool = (i1,i2) => {
    axios.get(`/api/school?${i1}Includes='${i2}'`)
        .then(res => {
          console.log(`/api/school?${i1}Includes='${i2}'`)
          setSchools(res.data);
        }).catch(err => console.log(err));
  }
  

  const search = (value)=>{
    //somehow get backend to update data (with usestate?)
    searchSchool(value.by, value.value)
  }

  return (
    <div className='admin-page'>
        <SidebarSliding/>
        <Header textToDisplay={"Admin Portal"}></Header>
        <div className='table-and-buttons'>
          {/* <AdminTable title={title} header={header} data={data} search={search}/> */}
          <AdminTable title={title} header={Object.keys(emptySchools[0])} data={schools} search={search}/>
            <div className="prev-next-buttons">
              <button onClick={handlePrevClick}>Prev</button>
              <button onClick={handleNextClick}>Next</button> 
              <Link to="/admin/new/school">
                <button className='button'> New</button>
              </Link>
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