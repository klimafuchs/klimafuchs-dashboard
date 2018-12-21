import React from 'react';
import gql from 'graphql-tag'
import { Query } from 'react-apollo';
import { CardTitle, CardText, Jumbotron, Row, Col } from 'reactstrap';
import Time from 'react-time-format';

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

const SEASON_PLANS = gql`
	query seasonPlans { 
		seasonPlans {
			id
				themenwoche {
					title
				}
			duration
			position
			season {
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
				<h3>Current Season</h3>
				<Query query={CURRENT_SEASON}>
					{({ loading, error, data, refetch }) => {
						if (loading) return <div>its loading</div>;
						if (error) return <div>${error.message}</div>;
						let CurrentSeasonID = data.currentSeason.id
						return (
							<div>

								<Jumbotron className="shadow-sm my-1">
									<CardTitle>
										{data.currentSeason.title}
									</CardTitle>
									<CardText className="small">
										Season starts at: <Time value={data.currentSeason.startDate} format="DD.MM.YYYY"></Time> |
                        First Topicweek starts at: <Time value={data.currentSeason.startOffsetDate} format="DD.MM.YYYY"></Time> |
                        Season ends at: <Time value={data.currentSeason.endDate} format="DD.MM.YYYY"></Time> |
                        ID: {data.currentSeason.id}
									</CardText>
									<Query query={SEASON_PLANS}>
										{({ loading, error, data, refetch }) => {
											if (loading) return <div>its loading</div>;
											if (error) return <div>${error.message}</div>;
											return (
												<div>
													{
														data.seasonPlans.map(seasonPlan => (
															<div key={seasonPlan.id}>
																{CurrentSeasonID === seasonPlan.season.id ?
																	<Row className="bg-light p-1 shadow-sm my-1">
																		<Col>
																			{seasonPlan.themenwoche.title}
																		</Col>
																		<Col>
																			{this.secondsInDays(seasonPlan.duration)}
																		</Col>
																		<Col>
																			Position: {seasonPlan.position}
																		</Col>
																	</Row>
																	: null
																}
															</div>
														))
													}
												</div>
											)
										}}
									</Query>
								</Jumbotron>

							</div>
						)
					}}
				</Query>
			</div>
		)
	}
}
