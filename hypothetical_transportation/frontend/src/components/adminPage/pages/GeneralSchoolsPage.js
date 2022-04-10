import React, {useEffect} from 'react';
import Header from '../../header/AdminHeader';
import { useSearchParams } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getSchools } from '../../../actions/schools';
import GeneralAdminTableView from '../components/views/GeneralAdminTableView';
import "../NEWadminPage.css";
import { Container } from 'react-bootstrap'


function GeneralAdminSchoolsPage(props) {

  //Mock Users Data (API Call later for real data)
  const title = "Schools"
  const tableType = "school"


  let [searchParams, setSearchParams] = useSearchParams();
  

  useEffect(() => {
    if(searchParams.get(`pageNum`) != null  && !(searchParams.get(`ordering`) ==null || searchParams.get(`ordering`) =="")){
      let paramsToSend = Object.fromEntries([...searchParams]);
      props.getSchools(paramsToSend);
    }
    else{
      setSearchParams({
        [`pageNum`]: 1,
        [`ordering`]:"name",
      })
    }
  }, [searchParams]);



  return (
    <div>
        <Header></Header>
        <Container className="container-main">
          <div className="shadow-sm p-3 mb-5 bg-white rounded d-flex flex-row justify-content-center">
            <h1>All Schools</h1>
          </div>
          <div className="shadow-lg p-3 mb-5 bg-white rounded">
            <GeneralAdminTableView values={props.schools} tableType={tableType} search="" title={title} totalCount={props.schoolCount} />
          </div>
        </Container>
    </div>
  )
}

GeneralAdminSchoolsPage.propTypes = {
    getSchools: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
  schools: state.schools.schools.results,
  schoolCount: state.schools.schools.count
});

export default connect(mapStateToProps, {getSchools})(GeneralAdminSchoolsPage)
