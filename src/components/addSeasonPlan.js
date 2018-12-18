import React from 'react';
import Downshift from 'downshift'
import gql from 'graphql-tag'
import { Query, Mutation } from 'react-apollo';
import { Col, Row, Input, Button, Form } from 'reactstrap'

const ADD_SEASONPLAN = gql`
	mutation addSeasonPlan($sID:Int!, $tID:String!, $pos:Int!) {
		updateSeasonPlan(seasonPlan:{
			seasonId: $sID,
			themenwocheId: $tID,
			position: $pos
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

	render() {
		return (

			<Mutation mutation={ADD_SEASONPLAN}>
				{(updateSeasonPlan, { data }) => (
					<Form onSubmit={e => {
						e.preventDefault();
						updateSeasonPlan({
							variables: { tID: this.state.title, sID: this.props.season.id, duration: this.state.duration, pos: this.state.position },
							refetchQueries: [{ query: SEASON_PLANS }]
						})

					}}>

						<Row className="bg-light p-1 shadow-sm">

							<Col>
								<Downshift
									/* line below can probably be deleted */
									onChange={selection => this.setState({ title: selection.title})}
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
											<label {...getLabelProps()}></label>
											<input {...getInputProps()} />

											<ul {...getMenuProps()} className="mb-0">
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
																			.filter(item => !inputValue || item.title.includes(inputValue))
																			.map((item, index) => (

																				<li className="list-unstyled bg-light"
																					{...getItemProps({
																						key: item.title,
																						index,
																						item,
																						style: {
																							backgroundColor:
																								highlightedIndex === index ? 'lightgray' : 'white',
																							fontWeight: selectedItem === item ? 'bold' : 'normal',
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
							<Input
								name="duration"
								value={this.state.duration}
								onChange={(e) => this.setState({ duration: e.target.value })}>
							</Input>
						</Col>

						<Col>
							<Input
								name="position"
								value={this.state.position}
								onChange={(e) => this.setState({ position: e.target.value })}>
							</Input>
							<Button type="submit">Click me</Button>
						</Col>
						</Row>
					</Form>
			)
			}
			</Mutation>




		)
	}
}