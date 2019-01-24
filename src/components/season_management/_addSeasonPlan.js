import React from 'react';
import Downshift from 'downshift'
import gql from 'graphql-tag'
import { Query, Mutation } from 'react-apollo';
import { Col, Row, Input, Form } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const ADD_SEASONPLAN = gql`
	mutation addSeasonPlan($sID:Int!, $tID:String!, $pos:Int!, $duration:Int!) {
		updateSeasonPlan(seasonPlan:{
			seasonId: $sID,
			themenwocheId: $tID,
			position: $pos,
			duration: $duration
		}) {
			id,
			season {id, title},
			position,
			themenwoche {title, content}
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

const THEMENWOCHES_LIST = gql`
	query {
    themenwoches {            
      title
    }
  }`

export class AddSeasonPlan extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
		};
	}

	DaysInSeconds = (days) => {
		let result = Math.round(days * 86400)
		return result
	}

	ValidatePositionOfNewSeasonPlan = (position) => {
		let seasonPlansForThisSeason = this.state.seasonPlans.filter(seasonPlan => seasonPlan.season.id === this.props.season.id)
		let positionArray = seasonPlansForThisSeason.map(seasonPlan => seasonPlan.position)
		let parsedPosition = parseInt(position, 10)
		return positionArray.includes(parsedPosition)
	}

	render() {
		return (

			<Mutation mutation={ADD_SEASONPLAN}>
				{(updateSeasonPlan, { data }) => (

					<Form onSubmit={e => {
						e.preventDefault();
						this.ValidatePositionOfNewSeasonPlan(this.state.position) ? alert("position is already used")
							:
							updateSeasonPlan({
								variables: {
									tID: this.state.title,
									sID: this.props.season.id,
									duration: this.DaysInSeconds(this.state.duration),
									pos: this.state.position
								},
								refetchQueries: [{ query: SEASON_PLANS }]
							}).catch(error => alert(error))
					}}>
						<div className="font-italic text-left ml-2" >
							<span>Add a Themenwoche</span>
						</div>

						<Row className="bg-light p-1 shadow-sm mx-1">

							<Col>
								<Downshift
									onChange={selection => this.setState({ title: selection.title })}
									itemToString={item => (item ? item.title : '')}
								>
									{({
										getInputProps,
										getItemProps,
										getLabelProps,
										getMenuProps,
										isOpen,
										inputValue,
										highlightedIndex,
										selectedItem,
									}) => (
											<div>
												{/* <label {...getLabelProps()}>Themenwoche</label> */}
												<Input className="px-2 my-2 border-0" placeholder="start typing..." {...getInputProps()} />

												<ul {...getMenuProps()}
													className="p-0 pr-4 w-100 bg-light shadow-sm position-absolute"
													style={{ zIndex: '2' }}>
													{isOpen

														?

														<Query query={THEMENWOCHES_LIST}>

															{({ loading, error, data, refetch }) => {
																if (loading) return <div>its loading</div>;
																if (error) return <div>${error.message}</div>;
																return (
																	<div>
																		{
																			data.themenwoches
																				.filter(item => !inputValue || item.title.toLowerCase().includes(inputValue.toLowerCase()))
																				.map((item, index) => (

																					<li className="p-1 text-left"
																						{...getItemProps({
																							key: item.title,
																							index,
																							item,
																							style: {
																								color:
																									highlightedIndex === index ? '#007BFF' : 'black',
																								cursor: 'pointer',
																								listStyleType: 'none'
																							},
																						})}
																					>
																						{item.title}
																					</li>
																				))}
																	</div>
																)
															}}
														</Query>
														: null}
												</ul>

											</div>
										)}
								</Downshift>
							</Col>

							<Col>
								<Input className="px-2 my-2 border-0"
									placeholder="duration in days"
									type="number" min="1"
									style={{ textAlign: 'center' }}
									onChange={(e) => this.setState({ duration: e.target.value })}>
								</Input>
							</Col>

							<Col>
								<Query query={SEASON_PLANS}>
									{({ loading, error, data, refetch }) => {
										this.state.seasonPlans = data.seasonPlans
										return (
											null
										)
									}
									}
								</Query>
								<Input className="px-2 my-2 border-0"
									placeholder="position in season"
									type="number" min="1"
									style={{ textAlign: 'center' }}
									onChange={(e) => this.setState({ position: e.target.value })}>
								</Input>

							</Col>

							<button type="submit" className="btn btn-link text-primary">
								<FontAwesomeIcon
									style={{ fontSize: '16px', cursor: "pointer" }}
									icon={faPlus}
								>
								</FontAwesomeIcon>
							</button>

						</Row>

					</Form>
				)
				}
			</Mutation>




		)
	}
}