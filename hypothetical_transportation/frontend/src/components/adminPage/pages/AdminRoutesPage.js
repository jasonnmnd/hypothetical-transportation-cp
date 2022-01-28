import React, {useState, useEffect} from 'react';
import SidebarSliding from '../components/sidebar/SidebarSliding';
import Header from '../../header/Header';
import AdminTable from '../components/table/AdminTable';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

function AdminRoutesPage(props) {

  const title = "Routes"

  const emptyRoute = [{
    name: "",
    description: "",
  }]

  const [routes, setRoutes] = useState(emptyRoute);
  
  const getRoutes = () => {
    axios.get(`/api/route/`)
        .then(res => {
          setRoutes(res.data.results);
        }).catch(err => console.log(err));
  }

  const searchRoute = (i1,i2) => {
    axios.get(`/api/route/?search=${i2}&search_fields=${i1}`)
        .then(res => {
          console.log(`/api/route/?search=${i2}&search_fields=${i1}`)
          setRoutes(res.data.results);
        }).catch(err => console.log(err));
  }
  
  useEffect(() => {
    getRoutes();
  }, []);




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
    searchRoute(value.by, value.value);
  }

  return (
    <div className='admin-page'>
        <SidebarSliding/>
        <Header textToDisplay={"Admin Portal"}></Header>
        <div className='middle-content'>
          {/* <div className='center-buttons'>
            <Link to={`/admin/new/route`}>
                <button className='button'>Add New Route</button>
              </Link>
          </div> */}
          <div className='table-and-buttons'>
            <AdminTable title={title} header={Object.keys(emptyRoute[0])} data={routes} search={search}></AdminTable>
            <div className="prev-next-buttons">
                <button onClick={handlePrevClick}>Prev</button>
                <button onClick={handleNextClick}>Next</button> 
            </div>
          </div>
        </div>
    </div>
  )
}
AdminRoutesPage.propTypes = {
    
}

const mapStateToProps = (state) => ({
  user: state.auth.user
});

export default connect(mapStateToProps)(AdminRoutesPage)
