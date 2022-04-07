import React, { Fragment } from 'react';
import { Container, Card } from 'react-bootstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import '../adminPage/NEWadminPage.css'
import LegendRed from '../assets/legendRed.png';
import LegendBlue from '../assets/legendBlue.png';

function GeneralLegend(props) {
    
  return (
        <Container style={{padding: "0px"}}>
            <Card>
                {/*<Card.Header as="h5">Legend</Card.Header>*/}
                <Card.Body>
                    <div>
                    {
                        props.legend.map((result, index) => {
                        return (
                            // <div key={index} >
                            //         <div className={result.color == "red" ? 'legendDivRed' : 'legendDivBlue'}>{" "}</div> {result.key}
                            // </div>
                            <div key={index}>
                                <img src={result.color == "red" ? LegendRed : LegendBlue} style={{height:"18px", width:"18px"}}></img>
                                {result.key}
                            </div>
                        )})
                    }
                    </div>
                </Card.Body>
            </Card>
        </Container>

  );
}

GeneralLegend.propTypes = {
    legend: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string,
        text: PropTypes.string
    }))
}


const mapStateToProps = (state) => ({
    
});

export default connect(mapStateToProps)(GeneralLegend)