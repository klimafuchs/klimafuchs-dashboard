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
								{
										this.props.currentSeason.title
								}
							</div>
						)
					}}
				</Query>
			</div>
		)
	}
}
