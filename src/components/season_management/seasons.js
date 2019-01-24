import React from 'react';
import gql from 'graphql-tag'
import { Query, Mutation } from 'react-apollo';
import { CardTitle, CardText, Jumbotron } from 'reactstrap';
import Time from 'react-time-format';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { ModalEditSeason } from './modalEditSeason';
import { AddSeasonPlan } from './addSeasonPlan';
import { SeasonPlans } from './seasonPlans';

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

const DELETE_SEASON = gql`
  mutation removeSeason($sId:Int!){
    removeSeason(seasonId:$sId){
      title
    }
  }`

export class Seasons extends React.Component {

  render() {
    return (
      <div>

        <h3>Seasons</h3>

        <Query query={SEASONS_LIST}>

          {({ loading, error, data, refetch }) => {
            if (loading) return <div>its loading</div>;
            if (error) return <div>${error.message}</div>;
            return (
              <div>
                {
                  data.seasons
                    .slice(0)
                    .sort((a, b) => {
                      return (new Date(a.startDate).getTime()) - (new Date(b.startDate).getTime());
                    })
                    .map(season => (
                      <Jumbotron className={`shadow my-3 py-4 px-4 ${(( new Date(season.startDate).getTime() < Date.now() && new Date(season.endDate).getTime() > Date.now()) ? null : "bg-light")}`}  key={season.id}>
                      
                        <CardTitle>
                          {season.title}
                          <sup><ModalEditSeason season={season} /></sup>
                          <Mutation mutation={DELETE_SEASON}>
                            {(deleteSeason, { data, _ }) => (
                              <sup>
                                <FontAwesomeIcon
                                className="text-primary"
                                  style={{ fontSize: '16px', cursor: "pointer" }}
                                  icon={faTimes}
                                  onClick={async e => {

                                    if (window.confirm('Delete the item?')) {
                                      await deleteSeason({ variables: { sId: season.id } }).catch(error => alert(error));
                                      // wait for the delete mutation to return, otherwise the deleted post will still be in the db when refetch() runs 
                                      refetch(); // refetch belongs to the surrounding FEED query
                                    }
                                  }}>
                                </FontAwesomeIcon>
                              </sup>
                            )}
                          </Mutation>

                        </CardTitle>
                        <CardText className="small">
                          Season starts at: <Time value={season.startDate} format="DD.MM.YYYY"></Time> |
                          First Topicweek starts at: <Time value={season.startOffsetDate} format="DD.MM.YYYY"></Time> |
                          Season ends at: <Time value={season.endDate} format="DD.MM.YYYY"></Time> |
                          ID: {season.id}
                        </CardText>
                        <AddSeasonPlan season={season} />
                        <SeasonPlans season={season} />
                      </Jumbotron>
                    ))
                }
                <ModalEditSeason refetch={refetch} />
              </div>
            )
          }}
        </Query>


      </div>
    )
  }
}