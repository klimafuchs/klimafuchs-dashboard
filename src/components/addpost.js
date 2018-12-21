import React from 'react';
import { Card, Button, FormGroup, Label, Input, Form } from 'reactstrap';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const CUSTOM_POST = gql`
  mutation CustomPost($title:String!, $body:String!) {
    addPost (post:{title:$title, body:$body}) {
      title
      body
      id
    }
  }`


const FEED = gql`
query {
  posts {
      id
      title
      body
      dateCreated
      author {
        id
        userName
    }
    comments {
      id
      body
      author {
        id
        userName
      }
    }
  }
}`

export class AddPost extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {

    return (
      <Mutation mutation={CUSTOM_POST}>
        {(customPost, { data, _ }) => (

          <Card body className="bg-light border-light shadow text-left py-3">
            <h4 className="text-center">Add Custom Post</h4>
            <Form onSubmit={e => {
              e.preventDefault();
              customPost({
                variables: { title: this.state.title, body: this.state.body },
                refetchQueries: [{ query: FEED }],
              })
            }}>

              <FormGroup>
                <Label for="exampleText">Titel</Label>
                <Input type="text" placeholder="Titel des Posts" onChange={(e) => this.setState({ title: e.target.value })} />
              </FormGroup>
              <FormGroup>
                <Label for="exampleText">Text</Label>
                <Input type="textarea" placeholder="Text für den Post" onChange={(e) => this.setState({ body: e.target.value })} />
              </FormGroup>
              <Button color="primary" type="submit">Absenden</Button>

            </Form>
          </Card>
        )}
      </Mutation>

    )
  }
}