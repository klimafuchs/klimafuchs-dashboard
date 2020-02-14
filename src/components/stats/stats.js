import React from 'react';
import gql from 'graphql-tag'
import { Query } from 'react-apollo';
import { CardTitle, CardText, Jumbotron, Row, Col } from 'reactstrap';
import Time from 'react-time-format';
import { SeasonPlans } from '../season_management/_seasonPlans';

const CURRENT_SEASON = gql`
	query currentSeason {
		currentSeason {
			id
		startDate
		startOffsetDate
		endDate
		title
			seasonPlan {
				id
			}		
		}
	}
 `

export class Stats extends React.Component {

	secondsInDays = (seconds) => {
		let result = Math.round(seconds / 86400)
		return ((result === 1) ? result + " day" : result + " days")
	}

	render() {
		return (
			<div>
				<h2>Current Season</h2>
				<Query query={CURRENT_SEASON}>
					{({ loading, error, data, refetch }) => {
						if (loading) return <div><img className="col-1 pt-5 mt-5" src="./load-spinner.gif" alt="Klimafuchs-Logo" /></div>;
						if(!data || !data.currentSeason) return <div>no current season existing</div>
						if (error) return <div>${error.message}</div>;
						return (
							<div>
								

								<Jumbotron className={`bg-light shadow-sm my-3 py-4 px-4 `} key={data.currentSeason.id}>

									<CardTitle>
										{data.currentSeason.title}
										
									</CardTitle>
									<CardText className="">
										Season starts at: <Time value={data.currentSeason.startDate} format="DD.MM.YYYY"></Time> |
                          First Topicweek starts at: <Time value={data.currentSeason.startOffsetDate} format="DD.MM.YYYY"></Time> |
                          Season ends at: <Time value={data.currentSeason.endDate} format="DD.MM.YYYY"></Time> |
                          ID: {data.currentSeason.id}
									</CardText>
									<Row>
										<Col>Topicweek</Col>
										<Col>Duration</Col>
										<Col>Position</Col>
									</Row>
									<SeasonPlans season={data.currentSeason} />
								</Jumbotron>

							</div>
						)
					}}
				</Query>
			</div>
		)
	}
}
