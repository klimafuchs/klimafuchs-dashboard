import React from 'react';
import { Row, Col } from 'reactstrap';
import { Themenwoches } from './themenwoches'
import { Seasons } from './seasons'

export class Planning extends React.Component {

    render() {

        return (
                <Row>
                    <Col xs="12" lg="8">
                        <Seasons />
                    </Col>
                    <Col xs="12" lg="4">
                        <Themenwoches />
                    </Col>
                </Row>
        )
    }
}
