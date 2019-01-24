import React from 'react';
import { Card, Button, FormGroup, Label, Input, Form } from 'reactstrap';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const CUSTOM_POST = gql`
  mutation CustomPost($title:String!, $body:String!, $isPinned:Boolean!) {
    addPost (post:{title:$title, body:$body, isPinned:$isPinned}) {
      title
      body
      id
      isPinned
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
      isPinned: false
    }
  }

  handleCheckBoxChange = (e) => {
    this.setState({isPinned: e.target.checked})
  }

  render() {

    return (
      <Mutation mutation={CUSTOM_POST}>
        {(customPost, { data, _ }) => (

          <Card body className="bg-light border-0 shadow-sm text-left py-3 mb-3">
            <h2 className="text-center">Add Custom Post</h2>
            <Form onSubmit={e => {
              e.preventDefault();
              customPost({
                variables: { title: this.state.title, body: this.state.body, isPinned: this.state.isPinned },
                refetchQueries: [{ query: FEED }],
              })
            }}>

              <FormGroup>
                <Label for="exampleText">Titel</Label>
                <Input  className="rounded" type="text" placeholder="Titel des Posts" onChange={(e) => this.setState({ title: e.target.value })} />
              </FormGroup>
              <FormGroup>
                <Label for="exampleText">Text</Label>
                <Input type="textarea" placeholder="Text für den Post" onChange={(e) => this.setState({ body: e.target.value })} />
              </FormGroup>
              <FormGroup check className="mb-3">
                <Label check>
                  <Input
                  type="checkbox"
                  value={this.state.isPinned}
                  onChange={this.handleCheckBoxChange}/>
                  {' '} Pin Post
                </Label>
              </FormGroup>
              <Button color="primary" type="submit">Absenden</Button>

            </Form>
          </Card>
        )}
      </Mutation>

    )
  }
}