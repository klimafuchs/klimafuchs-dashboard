import React from 'react';
import gql from 'graphql-tag'
import { Query } from 'react-apollo';
import { Card, CardTitle, CardText } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons'

const THEMENWOCHES_LIST = gql`
	query {
    themenwoches {            
      title
      content
      createdAt
      updatedAt
      oberthema {
      name
      }
    }
  }`

export class Themenwoches extends React.Component {

  render() {
    return (

      <div>

        <h2>Themenwochen</h2>

        <Query query={THEMENWOCHES_LIST}>

          {({ loading, error, data, refetch }) => {
            if (loading) return <div>its loading</div>;
            if (error) return <div>${error.message}</div>;
            return (
              <div>
                {
                  data.themenwoches.map(themenwoche => (
                    <Card className="my-1" key={themenwoche.title} body inverse style={{ backgroundColor: '#333', borderColor: '#333' }}>
                      <CardTitle>{themenwoche.title}</CardTitle>
                      <CardText className="small">{themenwoche.content}</CardText>
                    </Card>
                  ))
                }
                <a target="_blank" rel="noopener noreferrer" href="https://enviroommate.org/wiki/index.php/Hauptseite">
                  <Card body inverse style={{ backgroundColor: '#333', borderColor: '#333' }}>
                    <CardText><FontAwesomeIcon style={{ fontSize: '30px' }} icon={faPlus} /></CardText>
                    <CardText className="small">Weiter zum Wiki</CardText>
                  </Card>
                </a>
              </div>
            )
          }}
        </Query >
      </div>
    )
  }
}