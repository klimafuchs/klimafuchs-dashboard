import React from 'react';
import gql from 'graphql-tag'
import { Query } from 'react-apollo';
import { Card, CardTitle, CardText } from 'reactstrap';

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

export class Seasons extends React.Component {

  render() {
    return (
      <div>

        <h2>Seasons</h2>

        <Query query={SEASONS_LIST}>

          {({ loading, error, data, refetch }) => {
            if (loading) return <div>its loading</div>;
            if (error) return <div>${error.message}</div>;
            return (
              <div>
                {
                  data.seasons.sort().map(season => (
                    <Card className="my-1" key={season.title} body inverse style={{ backgroundColor: '#333', borderColor: '#333' }}>
                      <CardTitle>{season.title}</CardTitle>
                      <CardText className="small">Season starts at: {season.startDate}</CardText>
                      <CardText className="small">First Week starts at: {season.startOffsetDate}</CardText>
                      <CardText className="small">Season ends at: {season.endDate}</CardText>
                      <CardText className="small">ID: {season.id}</CardText>
                    </Card>
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