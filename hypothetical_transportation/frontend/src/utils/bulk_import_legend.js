import React, { Fragment } from 'react';
import { Container, Card } from 'react-bootstrap';

const legendElements = [
    {
        color: "🟦  ",
        key: "Modified "
    },
    {
        color: "🟨  ",
        key: "Warning "
    },
    {
        color: "🟥  ",
        key: "Error "
    }
]

function bulk_import_legend() {
  return (
    <Container>
        <Card>
            <Card.Header as="h5">Legend</Card.Header>
            <Card.Body>
                <Card.Text>
                {
                    legendElements.map((result, index) => {
                    return (
                        <Fragment key={index}>
                            {result.color}
                            {result.key}
                            <br></br>
                        </Fragment>
                    )})
                }
                </Card.Text>
            </Card.Body>
        </Card>
    </Container>
  )
}

export default bulk_import_legend