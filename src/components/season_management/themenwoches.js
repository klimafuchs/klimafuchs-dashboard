import React from 'react';
import gql from 'graphql-tag'
import { Query } from 'react-apollo';
import { Card, CardTitle, CardText, Form, FormGroup, Input, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import Alert from 'react-s-alert'

const THEMENWOCHES_LIST = gql`
	query {
    themenwoches {            
      title
      text
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
    let url = process.env.REACT_APP_WIKI_URL + "/index.php?title=" + name + "&action=edit&redlink=1"
    return (url)
  }

  render() {
    return (

      <div>

        <h2>Themenwochen</h2>

        <Query query={THEMENWOCHES_LIST}>

          {({ loading, error, data, refetch }) => {
            if (loading) return <div><img className="col-1 pt-5 mt-5" src="./load-spinner.gif" alt="Klimafuchs-Logo" /></div>;
            if (error) return <div>${error.message}</div>;
            return (
              <div>
                {
                  data.themenwoches.map(themenwoche => (

                    <Card
                      className="my-2 p-3 border-secondary"
                      key={themenwoche.title}
                    >
                      <CardTitle className="mb-0">{themenwoche.title}</CardTitle>
                      <CardText className="">{themenwoche.content}</CardText>
                    </Card>
                  ))
                }
                <Card body className="border-0">
                  <CardTitle>Themenwoche im Wiki erstellen</CardTitle>
                  <Form
                    onSubmit={e => {
                      e.preventDefault()
                      this.state.themenwoche ? window.open(this.wikiUrl(this.state.themenwoche), '_blank') : Alert.info("Bitte geben Sie einen Namen für die Themenwoche ein!", {
                        position: 'top', effect: 'slide', timeout: 3000
                    })
                    }}>
                    <FormGroup>
                      <Input className="text-center rounded-0" placeholder="Name der Themenwoche" onChange={(e) => this.setState({ themenwoche: e.target.value })}></Input>
                    </FormGroup>
                    <Button className="bg-light border-0" type="submit">
                      <FontAwesomeIcon className="text-primary" style={{ fontSize: '30px' }} icon={faPlus} />
                    </Button>
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