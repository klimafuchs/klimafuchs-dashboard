import React from 'react';
import gql from 'graphql-tag'
import { Query } from 'react-apollo';
import { CardTitle, CardText, Jumbotron } from 'reactstrap';
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

export class Stats extends React.Component {
	render() {
		return (
			<div>
				<h3>Current Season</h3>
				<Query query={CURRENT_SEASON}>
					{({ loading, error, data, refetch }) => {
						if (loading) return <div>its loading</div>;
						if (error) return <div>${error.message}</div>;
						return (
							<div>
								{data.currentSeason.map(currentSeason => (
									<div>
										<Jumbotron className="shadow-sm my-1" key={currentSeason.id}>
											<CardTitle>
												{currentSeason.title}
											</CardTitle>
											<CardText className="small">
												Season starts at: <Time value={currentSeason.startDate} format="DD.MM.YYYY"></Time> |
                        First Topicweek starts at: <Time value={currentSeason.startOffsetDate} format="DD.MM.YYYY"></Time> |
                        Season ends at: <Time value={currentSeason.endDate} format="DD.MM.YYYY"></Time> |
                        ID: {currentSeason.id}
											</CardText>
										</Jumbotron>
									</div>
								))}
							</div>
						)
					}}
				</Query>
			</div>
		)
	}
}
