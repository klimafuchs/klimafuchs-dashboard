import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Table } from 'reactstrap';
import { ModalEditNutzer } from './_modalEditNutzer'

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

	refetch_parent = () => { }

	render() {
		return (
			<Query query={USER_LIST}>
				{({ loading, error, data, refetch }) => {
					if (loading) return <div><img className="col-1 pt-5 mt-5" src="./load-spinner.gif" alt="Klimafuchs-Logo" /></div>;
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
									{/* <th>Avatar</th> */}
									<th>Role</th>
								</tr>
							</thead>
							<tbody className="">
								{data.users.map(user => (
									<tr className = {`${(user.role === 1)? "bg-light" : null}`} key={user.id}>
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
												{String(user.emailConfirmed)}
											</option>
										</th>
										<th className="align-middle">
											<option key={user.id}>
												{String(user.isBanned)}
											</option>
										</th>
{/* 										<th className="align-middle">
											<option key={user.id}>
												{user.avatar}
											</option>
										</th> */}
										<th className="align-middle">
											<option key={user.id}>
												{(user.role === 0)? "user" : "admin"}
											</option>
										</th>
										<th className="align-middle">
											<ModalEditNutzer user={user} />
										</th>
										<th className="align-middle">
										</th>
									</tr>
								))}
							</tbody>
						</Table>
					)
				}}
			</Query>
		)
	}
}
