import React, { Component } from 'react';
import gql from 'graphql-tag';
import ApolloClient from 'apollo-client';
import {HttpLink} from 'apollo-link-http';
import {setContext} from 'apollo-link-context';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {ApolloProvider, Query} from 'react-apollo';
import { Row, Col, Card, Button, CardTitle, CardText } from 'reactstrap';

const link = new HttpLink({
	uri: 'https://enviroommate.org/app-dev/api/feed'
})

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

const client = new ApolloClient({
	cache: cache,
	link: authLink.concat(link),
})

const FEED = gql`
	query {
		posts {
		    id
		    title
		    body
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
			<ApolloProvider client={client}>
				<Query query={FEED}>
					{({loading, error, data, refetch}) => {
						if (loading) return <div>its loading</div>;
						if (error) return <div>${error.message}</div>;
						console.log(data.posts)
						return (
							
	            <div>

		            {data.posts.map(post => (		
						      <Row>
							      <Card body className="text-left pb-1 mx-2 my-1">
								        <CardTitle>
								        	<option key={post.id} value={post.title}>
								        		<span className="">Title: {post.title}</span>
								        	</option>
								        </CardTitle>
								        <CardText>
								        	<option key={post.id} value={post.title}>
								        		Text: {post.body}
								        	</option>
								        </CardText>
								        	<option className="text-center font-italic" key={post.id} value={post.title}>
								        		<span>Post-ID: {post.id}, Author: {post.author.userName}, User-ID: {post.author.id}</span>
								        	</option>
							      </Card>
									</Row>
			          ))}						        
		            
	            </div>
					)


					}
				}
				</Query>
			</ApolloProvider>
		)
	}

}
