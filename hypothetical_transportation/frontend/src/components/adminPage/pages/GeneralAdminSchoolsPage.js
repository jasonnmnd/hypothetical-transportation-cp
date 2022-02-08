import React, {useEffect} from 'react';
import Header from '../../header/Header';
import { useSearchParams } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getSchools } from '../../../actions/schools';
import GeneralAdminTableView from '../components/views/GeneralAdminTableView';
import "../NEWadminPage.css";
import { Container } from 'react-bootstrap'


function NEWGeneralAdminSchoolsPage(props) {

  //Mock Users Data (API Call later for real data)
  const title = "Schools"
  const tableType = "school"


  let [searchParams, setSearchParams] = useSearchParams();
  

  useEffect(() => {
    if(searchParams.get(`pageNum`) != null){
      let paramsToSend = Object.fromEntries([...searchParams]);
      props.getSchools(paramsToSend);
    }
    else{
      setSearchParams({
        [`pageNum`]: 1,
      })
    }
  }, [searchParams]);



  return (
    <div>
        <Header></Header>
        <Container className="container-main">
          <div className="shadow-lg p-3 mb-5 bg-white rounded">
            <GeneralAdminTableView values={props.schools} tableType={tableType} search="" title={title} />
          </div>
        </Container>
    </div>
  )
}

NEWGeneralAdminSchoolsPage.propTypes = {
    getSchools: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
  schools: state.schools.schools.results
});

export default connect(mapStateToProps, {getSchools})(NEWGeneralAdminSchoolsPage)
