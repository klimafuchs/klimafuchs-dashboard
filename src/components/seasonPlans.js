import React from 'react';
import gql from 'graphql-tag'
import { Row, Col } from 'reactstrap'
import { Query } from 'react-apollo';

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

export class SeasonPlans extends React.Component {

  secondsInDays = (seconds) => {
		let result = Math.round(seconds / 86400)
		return ((result === 1)? result + " day" : result + " days")
	}
	
	render() {
		return (
			<div>
				<Query query={SEASON_PLANS}>
					{({ loading, error, data, refetch }) => {
						if (loading) return <div>its loading</div>;
						if (error) return <div>${error.message}</div>;
						return (
							<div>
								{
									data.seasonPlans.map(seasonPlan => (
										<div key={seasonPlan.id}>
											{this.props.season.id === seasonPlan.season.id ?
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
			</div>
		)
	}
}