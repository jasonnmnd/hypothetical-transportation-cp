import React, {useEffect, useState} from 'react';
import SidebarSliding from '../components/sidebar/SidebarSliding';
import Header from '../../header/Header';
import AdminTable from '../components/table/AdminTable';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AdminSchoolDetails from './AdminSchoolDetails';
import config from '../../../utils/config';

function AdminSchoolsPage(props) {

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
    axios.get('/api/school/', config(props.token))
        .then(res => {
            setSchools(res.data.results);
        }).catch(err => console.log(err));
    }

  useEffect(() => {
    getSchools();
  }, []);


  const searchSchool = (i1,i2,i3) => {
    let url=`/api/school/`
    if(i1==="" || i2==="" || i1===undefined || i2===undefined){
      if(i3!==""&& i3!==undefined){
        url=`/api/school/?ordering=${i3}`
      }
    }
    else{
      if(i3!=="" && i3!==undefined){
        url=`/api/school/?search=${i2}&search_fields=${i1}&ordering=${i3}`
      }
      else{
        url=`/api/school/?search=${i2}&search_fields=${i1}`
      }
    }
    axios.get(url, config)
        .then(res => {
          setSchools(res.data.results);
        }).catch(err => console.log(err));
  }
  

  const search = (value)=>{
    //somehow get backend to update data (with usestate?)
    searchSchool(value.filter_by, value.value, value.sort_by)
  }

  return (
    <div className='admin-page'>
        <SidebarSliding/>
        <Header textToDisplay={"Admin Portal"} shouldShowOptions={true}></Header>
        <div className='middle-content'>
          <div className='center-buttons'>
            <Link to="/admin/new/school">
                  <button className='button'>Add New School</button>
            </Link>
          </div>
          <div className='table-and-buttons'>
            {/* <AdminTable title={title} header={header} data={data} search={search}/> */}
            <AdminTable title={title} header={Object.keys(emptySchools[0])} data={schools} search={search} sortBy={["name"]}/>
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
  user: state.auth.user,
  token: state.auth.token
});

export default connect(mapStateToProps)(AdminSchoolsPage)
