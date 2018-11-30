import React from 'react';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';
import { Row, Card, Button, CardTitle, CardText } from 'reactstrap';

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

const DELETE_POST = gql`
	mutation deletePost($id: Int!) {
		removePost(postId: $id) {
			title
	}
  }  
`

export class Feed extends React.Component {

	render() {
		return (
			<Query query={FEED}>
				{({ loading, error, data, refetch }) => {
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
											<Mutation mutation={DELETE_POST}>
												{(deletePost, { data, _ }) => (
													<Button className="btn btn-block btn-danger" onClick={async e => {
														if (window.confirm('Delete the item?')) {
															await deletePost({ variables: { id: post.id } });
															// wait for the delete mutation to return, otherwise the deleted post will still be in the db when refetch() runs 
															refetch(); // refetch belongs to the surrounding FEED query
														}
													}}>
														Delete
													</Button>
												)}
											</Mutation>
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
