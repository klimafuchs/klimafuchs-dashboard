import React, { Component } from 'react';
import gql from 'graphql-tag';
import ApolloClient from 'apollo-client';
import {HttpLink} from 'apollo-link-http';
import {setContext} from 'apollo-link-context';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {ApolloProvider, Query} from 'react-apollo';
import { Button, Table } from 'reactstrap';
import { Editmodal } from './editmodal'

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

const USER_LIST = gql`
	query {
	  users {
	    id
	    userName
	    screenName
	    emailConfirmed
	    isBanned
	    avatar {
	      id
	    }
	    role
	  }
	}`

export class Nutzer extends Component {

	render() {
		return(
			<ApolloProvider client={client}>
				<Query query={USER_LIST}>
					{({loading, error, data, refetch}) => {
						if (loading) return <div>its loading</div>;
						if (error) return <div>${error.message}</div>;
						return (
							<Table className="border-top-0">
								<thead>
									<tr>
										<th>ID</th>
										<th>Username</th>
										<th>Screenname</th>
										<th>E-Mail confirmed</th>
										<th>is Banned?</th>
										<th>Avatar</th>
										<th>Role</th>
									</tr>
								</thead>
								<tbody className="small">							            
									{data.users.map(user => (
										<tr>
											<th className="align-middle" scope="row">
													<option key={user.id}>
														{user.id}
													</option>
												</th>					 	
												<th className="align-middle">
													<option key={user.id}>
														{user.userName}
													</option>
												</th>			 	
												<th className="align-middle">
													<option key={user.id}>
														{user.screenName}
													</option>
												</th>
												<th className="align-middle">
													<option key={user.id}>
														{ String(user.emailConfirmed) }
													</option>
												</th>
												<th className="align-middle">
													<option key={user.id}>
														{ String(user.isBanned) }
													</option>
												</th>
												<th className="align-middle">
													<option key={user.id}>
														{user.avatar}
													</option>
												</th>
												<th className="align-middle">
													<option key={user.id}>
														{user.role}
													</option>
												</th>
												<th className="align-middle">
													<Editmodal/>
												</th>
												<th className="align-middle">
													<Button className="btn-block" color="danger" >Delete</Button>
												</th>
										</tr>
									))}
								</tbody>
							</Table>
						)
					}}
				</Query>
			</ApolloProvider>
		)
	}
}
