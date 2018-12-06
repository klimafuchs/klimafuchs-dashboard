import React from 'react';
import gql from 'graphql-tag'
import { Query } from 'react-apollo';
import { Card, CardTitle, CardText, Form, FormGroup, Input, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { Droppable } from 'react-beautiful-dnd'

const THEMENWOCHES_LIST = gql`
	query {
    themenwoches {            
      title
      content
      createdAt
      updatedAt
    }
  }`

export class Themenwoches extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  /* will break in production when URL changes. TODO */
  wikiUrl = (name) => {
    let url = "https://enviroommate.org/wiki/index.php?title=" + name + "&action=edit&redlink=1"
    return (url)
  }

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
                    <Droppable droppableId={themenwoche.id}>
                      {(...provided) => {

                        <Card
                          className="my-1"
                          key={themenwoche.title}
                          body
                          inverse style={{ backgroundColor: '#333', borderColor: '#333' }}
                          innerRef={provided.innerRef}
                          {...provided.droppableProps}
                          {...provided.placeholder}
                        >
                          <CardTitle>{themenwoche.title}</CardTitle>
                          <CardText className="small">{themenwoche.content}</CardText>
                        </Card>

                      }}
                    </Droppable>
                  ))
                }
                <Card body inverse style={{ backgroundColor: '#333', borderColor: '#333' }}>
                  <CardTitle>Themenwoche im Wiki erstellen</CardTitle>
                  <Form
                    onSubmit={e => {
                      e.preventDefault()
                      { (this.state.themenwoche) ? window.open(this.wikiUrl(this.state.themenwoche), '_blank') : alert("Bitte einen Namen eingeben") }
                    }}>
                    <FormGroup>
                      <Input placeholder="Name der Themenwoche" onChange={(e) => this.setState({ themenwoche: e.target.value })}></Input>
                    </FormGroup>
                    <CardText>
                      <Button type="submit">
                        <FontAwesomeIcon style={{ fontSize: '30px' }} icon={faPlus} />
                      </Button>
                    </CardText>
                  </Form>
                </Card>
              </div>
            )
          }}
        </Query >
      </div>
    )
  }
}