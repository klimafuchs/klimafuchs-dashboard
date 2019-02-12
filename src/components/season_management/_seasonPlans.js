import React from 'react';
import gql from 'graphql-tag'
import { Row, Col } from 'reactstrap'
import { Query, Mutation } from 'react-apollo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import confirm from 'reactstrap-confirm';

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

const UPDATE_SEASONPLAN = gql`
mutation udpateSeasonPlan($Id:Int!, $pos:Int, $duration:Int) {
	updateSeasonPlan(seasonPlan:{
		id: $Id,
		position: $pos,
		duration: $duration
	}) {
		position,
		duration
	}
} 
`

const REMOVE_SEASON_PLAN = gql`
	mutation removeSeasonPlan($spId:Int!){
		removeSeasonPlan(seasonPlanId:$spId){
			duration
		}
	}
`

export class SeasonPlans extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			seasonId: "",
			themenwocheId: "",
			position: "",
			duration: ""
		};
	}

	secondsInDays = (seconds) => {
		let result = Math.round(seconds / 86400)
		return ((result === 1) ? result + " day" : result + " days")
	}

	daysInSeconds = (days) => {
		let result = Math.round(days * 86400)
		return (result)
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


															<Mutation mutation={UPDATE_SEASONPLAN}>
																{(udpateSeasonPlan, { data }) => (
																	<button
																		className="btn btn-link text-primary"
																		onClick={() =>
																			udpateSeasonPlan({
																				variables: {
																					Id: seasonPlan.id,
																					duration: seasonPlan.duration - this.daysInSeconds(1),
																				},
																				refetchQueries: [{ query: SEASON_PLANS }],
																			})
																		}>
																		<FontAwesomeIcon
																			style={{ fontSize: '16px', cursor: "pointer" }}
																			icon={faMinus}
																		>
																		</FontAwesomeIcon>
																	</button>
																)}
															</Mutation>

															<span>
																{this.secondsInDays(seasonPlan.duration)}
															</span>

															<Mutation mutation={UPDATE_SEASONPLAN}>
																{(udpateSeasonPlan, { data }) => (
																	<button
																		className="btn btn-link text-primary"
																		onClick={() =>
																			udpateSeasonPlan({
																				variables: {
																					Id: seasonPlan.id,
																					duration: seasonPlan.duration + this.daysInSeconds(1),
																				},
																				refetchQueries: [{ query: SEASON_PLANS }],
																			})
																		}>
																		<FontAwesomeIcon
																			style={{ fontSize: '16px', cursor: "pointer" }}
																			icon={faPlus}
																		>
																		</FontAwesomeIcon>
																	</button>
																)}
															</Mutation>

														</Col>

														<Col className="d-flex align-items-center justify-content-center ">
															<Mutation mutation={UPDATE_SEASONPLAN}>
																{(udpateSeasonPlan, { data }) => (
																	<button
																		className="btn btn-link text-primary"
																		onClick={() =>
																			udpateSeasonPlan({
																				variables: {
																					Id: seasonPlan.id,
																					pos: seasonPlan.position - 1,
																				},
																				refetchQueries: [{ query: SEASON_PLANS }],
																			})
																		}>
																		<FontAwesomeIcon
																			style={{ fontSize: '16px', cursor: "pointer" }}
																			icon={faMinus}
																		>
																		</FontAwesomeIcon>
																	</button>
																)}
															</Mutation>

															<span>
																{seasonPlan.position}
															</span>

															<Mutation mutation={UPDATE_SEASONPLAN}>
																{(udpateSeasonPlan, { data }) => (
																	<button
																		className="btn btn-link text-primary"
																		onClick={() =>
																			udpateSeasonPlan({
																				variables: {
																					Id: seasonPlan.id,
																					pos: seasonPlan.position + 1,
																				},
																				refetchQueries: [{ query: SEASON_PLANS }],
																			})
																		}>
																		<FontAwesomeIcon
																			style={{ fontSize: '16px', cursor: "pointer" }}
																			icon={faPlus}
																		>
																		</FontAwesomeIcon>
																	</button>)}
															</Mutation>
														</Col>

														<Mutation mutation={REMOVE_SEASON_PLAN}>
															{(deleteSeasonPlan, { data, _ }) => (
																<button
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