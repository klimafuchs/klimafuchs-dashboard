import React from 'react';
import gql from 'graphql-tag'
import { Row, Col } from 'reactstrap'
import { Query, Mutation } from 'react-apollo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import confirm from 'reactstrap-confirm'

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

const REMOVE_SEASON_PLAN = gql`
	mutation rSP($spId:Int!){
		removeSeasonPlan(seasonPlanId:$spId){
			duration
		}
	}
`

export class SeasonPlans extends React.Component {

	secondsInDays = (seconds) => {
		let result = Math.round(seconds / 86400)
		return ((result === 1) ? result + " day" : result + " days")
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
									data.seasonPlans
										.slice(0)
										.sort((a, b) => {
											return (a.position) - (b.position);
										})
										.map(seasonPlan => (
											<div key={seasonPlan.id}>
												{this.props.season.id === seasonPlan.season.id ?
													<Row className="bg-light p-1 shadow-sm my-1 mx-1">
														<Col className="d-flex align-items-center">
															<span style={{ zIndex: '1' }}>
																{seasonPlan.themenwoche.title}
															</span>
														</Col>
														<Col className="d-flex align-items-center justify-content-center">
															{this.secondsInDays(seasonPlan.duration)}
														</Col>
														<Col className="d-flex align-items-center justify-content-center ">
															{seasonPlan.position}
														</Col>
														<Mutation mutation={REMOVE_SEASON_PLAN}>
															{(deleteSeasonPlan, { data, _ }) => (
																<button
																	type="submit"
																	className="btn btn-link text-primary"
																	onClick={async e => {
																		if (await confirm()) {
																			await deleteSeasonPlan({ variables: { spId: seasonPlan.id } });
																			// wait for the delete mutation to return, otherwise the deleted post will still be in the db when refetch() runs 
																			refetch(); // refetch belongs to the surrounding FEED query
																		}
																	}}>
																	<FontAwesomeIcon
																		style={{ fontSize: '16px', cursor: "pointer" }}
																		icon={faTrash}
																	>
																	</FontAwesomeIcon>
																</button>
															)}
														</Mutation>
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