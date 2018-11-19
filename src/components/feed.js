import React, { Component } from 'react';
import gql from 'graphql-tag';
import ApolloClient from 'apollo-client';
import {HttpLink} from 'apollo-link-http';
import {setContext} from 'apollo-link-context';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {ApolloProvider, Query} from 'react-apollo';
import { Row, Card, Button, CardTitle, CardText } from 'reactstrap';

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const cache = new InMemoryCache()

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

export class Feed extends Component {

	render() {
		return(
				<Query query={FEED}>
					{({loading, error, data, refetch}) => {
						if (loading) return <div>its loading</div>;
						if (error) return <div>${error.message}</div>;
						return (
							
	            <div>

		            {data.posts.map(post => (		
						      <Row key={post.id}>
							      <Card body className="text-left pb-1 mx-2 my-1">
								        <CardTitle>
								        	Title: {post.title}
								        </CardTitle>
								        <CardText>
								        	Text: {post.body}
								        </CardText>
								        <CardText>
								        	<option className="text-center font-italic" key={post.id} value={post.title}>
								        		Post-ID: {post.id}, Author: {post.author.userName}, User-ID: {post.author.id}
								        	</option>
								        </CardText>
								        <CardText className="text-center font-italic">
								        	Timestamp: {post.dateCreated}
								        </CardText>
								        <CardText>
													<Button className="btn-block" color="danger" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) this.onCancel(post) }}>Delete</Button>
								        </CardText>
								        <CardText>
													<option key={post.id}>
														{post.comment ? 
														<p>
															{post.comment.body}, {post.comment.id}, {post.comment.author}, {post.comment.author.id}															
														</p>
														: null}
													</option>
												</CardText>
							      </Card>
									</Row>
			          ))}						        
		            
	            </div>
						)
					}
				}
				</Query>
		)
	}

}
