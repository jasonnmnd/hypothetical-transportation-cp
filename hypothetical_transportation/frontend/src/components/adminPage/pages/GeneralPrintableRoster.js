import React from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import PlainHeader from '../../header/PlainHeader';
import { Container } from 'react-bootstrap';

function GeneralPrintableRoster(props) {
  return (           
    <>
        <PlainHeader></PlainHeader>

        <Container>
        </Container>
    </>
  )
}

GeneralPrintableRoster.propTypes = {

}

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps)(GeneralPrintableRoster)