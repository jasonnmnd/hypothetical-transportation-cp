import React, { Fragment } from 'react';
import { Container, Card } from 'react-bootstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

function GeneralLegend(props) {
    
  return (
    <>
        <Container>
            <Card>
                <Card.Header as="h5">Legend</Card.Header>
                <Card.Body>
                    <Card.Text>
                    {
                        props.legend.map((result, index) => {
                        return (
                            <Fragment key={index}>
                                {result.key}
                                {result.color}
                            </Fragment>
                        )})
                    }
                    </Card.Text>
                </Card.Body>
            </Card>
        </Container>
    </>

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