import React, {useEffect, useState} from 'react';
import SidebarSliding from '../components/sidebar/SidebarSliding';
import Header from '../../header/Header';
import AdminTable from '../components/table/AdminTable';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AdminSchoolDetails from './AdminSchoolDetails';
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
    name: "",
    address: "",
  }]

  const [schools, setSchools] = useState(emptySchools);

  const getSchools = () => {
    axios.get('/api/school/')
        .then(res => {
            setSchools(res.data.results);
        }).catch(err => console.log(err));
    }

  useEffect(() => {
    getSchools();
  }, []);


  const searchSchool = (i1,i2) => {
    axios.get(`/api/school/?search=${i2}&search_fields=${i1}`)
        .then(res => {
          console.log(`/api/school/?search=${i2}&search_fields=${i1}`)
          setSchools(res.data.results);
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
        <div className='middle-content'>
          <div className='center-buttons'>
            <Link to="/admin/new/school">
                  <button className='button'>Add New School</button>
            </Link>
          </div>
          <div className='table-and-buttons'>
            {/* <AdminTable title={title} header={header} data={data} search={search}/> */}
            <AdminTable title={title} header={Object.keys(emptySchools[0])} data={schools} search={search}/>
              <div className="prev-next-buttons">
                <button onClick={handlePrevClick}>Prev</button>
                <button onClick={handleNextClick}>Next</button> 
              </div>
            </div>
        </div>
    </div>
  )
}

// const mapStateToProps = state => ({
//   schools: state.schools.schools
// })

// export default connect(mapStateToProps, { getSchools })(AdminSchoolsPage);

AdminSchoolsPage.propTypes = {
    
}

const mapStateToProps = (state) => ({

});

export default connect(mapStateToProps)(AdminSchoolsPage)
