import React, {useState, useEffect} from 'react';
import SidebarSliding from '../components/sidebar/SidebarSliding';
import Header from '../../header/Header';
import AdminTable from '../components/table/AdminTable';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import config from '../../../utils/config';

function AdminRoutesPage(props) {

  const title = "Routes"

  const emptyRoute = [{
    name: "",
    description: "",
  }]

  const emptyTable = [{
    id:"",
    name: "",
    school: "",
    num_student:"",
  }]

  const [routes, setRoutes] = useState(emptyRoute);
  let list = []
  const [table, setTable]=useState([]);
  const getRoutes = () => {
    axios.get(`/api/route/`, config(props.token))
        .then(res => {
          setRoutes(res.data.results);
        }).catch(err => /*console.log(err)*/{});
  }

  const searchRoute = (i1,i2,i3) => {
    let url=`/api/route/`
    if(i1==="" || i2==="" || i1===undefined || i2===undefined){
      if(i3!==""&& i3!==undefined){
        url=`/api/route/?ordering=${i3}`
      }
    }
    else{
      if(i3!=="" && i3!==undefined){
        url=`/api/route/?search=${i2}&search_fields=${i1}&ordering=${i3}`
      }
      else{
        url=`/api/route/?search=${i2}&search_fields=${i1}`
      }
    }
    axios.get(url, config(props.token))
        .then(res => {
          setRoutes(res.data.results);
        }).catch(err => /*console.log(err)*/{});
  }
  
  useEffect(() => {
    getRoutes();
  }, []);

  useEffect(()=>{
    list=[]
    routes.map((route)=>{
      axios.get(`/api/school/${route.school}/`, config(props.token))
        .then(school => {
          axios.get(`/api/student/?routes=${route.id}`, config(props.token))
            .then(res => {
              list = list.concat({id: route.id,name:route.name, school:school.data.name, num_student:res.data.results.length})
              list.sort((a, b) => routes.findIndex((r) => r.id === a.id) - routes.findIndex((r) => r.id === b.id));
              setTable(list)
            }).catch(err => /*console.log(err)*/{});
      }).catch(err => /*console.log(err)*/{});
    })

  },[routes]);


  const handlePrevClick = () => {
    //API Call here to get new data to display for next page

  }

  const handleNextClick = () => {

  }

  const search = (value)=>{
    //somehow get backend to update data (with usestate?)
    searchRoute(value.filter_by, value.value, value.sort_by);
  }

  return (
    <div className='admin-page'>
        <SidebarSliding/>
        <Header textToDisplay={"Admin Portal"} shouldShowOptions={true}></Header>
        <div className='middle-content'>
          {/* <div className='center-buttons'>
            <Link to={`/admin/new/route`}>
                <button className='button'>Add New Route</button>
              </Link>
          </div> */}
          <div className='table-and-buttons'>
            <AdminTable title={title} header={Object.keys(emptyTable[0]).filter(h=>h!=="id")} data={table} search={search} sortBy={["name","school__name","students","-name","-school__name","-students"]}></AdminTable>
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
  user: state.auth.user,
  token: state.auth.token
});

export default connect(mapStateToProps)(AdminRoutesPage)
