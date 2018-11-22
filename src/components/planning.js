import React from 'react';
import gql from 'graphql-tag'
import { Query } from 'react-apollo';
import { Row, Card, CardTitle, CardText, CardColumns, Container, Col } from 'reactstrap';

const THEMENWOCHES_LIST = gql`
	query {
        themenwoches {            
            title
            content
            createdAt
            updatedAt
            oberthema {
            name
            }
        }
    }`

const SEASONS_LIST = gql`
	query {
        seasons {
            id
            title
            startDate
            startOffsetDate
            endDate    
        }
    }`

export class Planning extends React.Component {

	render() {

		return(
			<Query query={THEMENWOCHES_LIST}>
				{({ loading, error, data, refetch }) => {
					if (loading) return <div>its loading</div>;
					if (error) return <div>${error.message}</div>;
					return (
                        <Container>
                            <Row>
                                <Col xs="8">
{/* put in separate component TODO  {data.seasons.map(season => (
                                        <Card className="my-1" key={season.title} body inverse style={{ backgroundColor: '#333', borderColor: '#333' }}>
                                            <CardTitle>{season.title}</CardTitle>
                                            <CardText className="small">{season.startDate}</CardText>
                                        </Card>
                                    ))}                                 */}
                                </Col>
                                <Col xs="4">
                                <h2>Themenwochen</h2>
                                    {data.themenwoches.map(themenwoche => (
                                        <Card className="my-1" key={themenwoche.title} body inverse style={{ backgroundColor: '#333', borderColor: '#333' }}>
                                            <CardTitle>{themenwoche.title}</CardTitle>
                                            <CardText className="small">{themenwoche.content}</CardText>
                                        </Card>
                                    ))}
                                </Col>
                            </Row>
                        </Container>

                    )}}

			</Query>
		)
	}
}
