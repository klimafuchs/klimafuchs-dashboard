import React from 'react';
import gql from 'graphql-tag'
import { Query } from 'react-apollo';
import { CardTitle, CardText, Jumbotron } from 'reactstrap';
import Time from 'react-time-format';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { ModalEditSeason } from './modalEditSeason';
import { ModalAddSeason } from './modalAddSeason';

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
                    <Jumbotron className="my-1" key={season.id}>
                      <CardTitle>
                        {season.title}
                        <sup><ModalEditSeason season={season} /></sup>
                        <sup><FontAwesomeIcon style={{ fontSize: '12px' }} icon={faTimes} /></sup>
                      </CardTitle>
                      <CardText className="small">
                        Season starts at: <Time value={season.startDate} format="DD.MM.YYYY"></Time> |
                        First Topicweek starts at: <Time value={season.startOffsetDate} format="DD.MM.YYYY"></Time> |
                        Season ends at: <Time value={season.endDate} format="DD.MM.YYYY"></Time> |
                        ID: {season.id}
                      </CardText>
                    </Jumbotron>
                  ))
                }
                <ModalEditSeason refetch={refetch}/>
              </div>
            )
          }}
        </Query>


      </div>
    )
  }
}