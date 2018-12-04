import React from 'react';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';
import { Row, Col, Card, Button, CardTitle, CardText } from 'reactstrap';
import { AddPost } from './addpost';
import Time from 'react-time-format';

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
							<Row>
								<Col xs="12">
									<AddPost />
								</Col>
							</Row>

							{data.posts.map(post => (
								<Row className="align-items-end my-1" key={post.id}>

									<Col xs="12" md="10">
										<Card body className="text-left pb-1">
											<CardTitle>
												Title: {post.title}
											</CardTitle>
											<CardText>
												Text: {post.body}
											</CardText>
											<CardText className="small font-italic">
												Author: {post.author.userName}, User-ID: {post.author.id}
											</CardText>
										</Card>
									</Col>

									<Col xs="12" md="2">
										<span className="small font-italic">
											Post-ID: {post.id}, <Time value={post.dateCreated} format="DD.MM.YYYY hh:mm:ss"></Time>
										</span>
										<Mutation mutation={DELETE_POST}>
											{(deletePost, { data, _ }) => (
												<Button className="btn btn-block btn-danger mb-1" onClick={async e => {
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
									</Col>
									<Col>
										{post.comments ? post.comments.map(comment => (
											<div>
												<Col xs="2">
													<span>test</span>
												</Col>
												<Col xs="10">
													<span key={comment.id}>
														{comment.body}, {comment.author.id}
													</span>
												</Col>
											</div>
										))
											: null}
									</Col>
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
