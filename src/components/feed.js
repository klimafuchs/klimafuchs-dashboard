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
					screenName
	    }
	    comments {
	      id
	      body
				dateCreated
	      author {
	        id
	        userName
					screenName
	      }
	    }
		}
	}
`

const DELETE_POST = gql`
	mutation deletePost($id: Int!) {
		removePost(postId: $id) {
			title
		}
  }  
`

const DELETE_COMMENT = gql`
	mutation DeleteComment($id: Int!) {
		removeComment(CommentId: $id) {
			dateCreated
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

							{data.posts
								.slice(0)
								.sort((a, b) => {
									return (new Date(b.dateCreated).getTime()) - (new Date(a.dateCreated).getTime());
								})
								.map(post => (
									<Row className="align-items-end my-1" key={post.id}>

										<Col className="pr-0" xs="12" md="10">
											<Card body className="text-left pb-1">
												<CardTitle>
													Title: {post.title}
												</CardTitle>
												<CardText>
													Text: {post.body}
												</CardText>
												<CardText className="small font-italic">
													Author: {post.author.screenName}, User-ID: {post.author.id}
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
														Delete Post
													</Button>
												)}
											</Mutation>
										</Col>
										<Col>
											{post.comments ? post.comments.map(comment => (
												<div key={comment.id}>

													<Row className="text-left" key={comment.id}>

														<Col xs="2">
														</Col>

														<Col className="p-1 border border-secondary border-top-0" xs="8">
															<Col className="pr-0 mr-2">
																<span key={comment.id}>
																	{comment.body}
																</span>
															</Col>
															<Col className="pr-0">
																<span className="small font-italic" key={comment.id}>
																	Author: {comment.author.screenName}, User-ID: {comment.author.id}, <Time value={comment.dateCreated} format="DD.MM.YYYY, hh:mm:ss"></Time>, Comment-ID: {comment.id}
																</span>
															</Col>
														</Col>

														<Col className="p-0 p-md-3" xs={{size: 8, offset: 2}} md={{size: 2, offset: 0}}>

															<Mutation mutation={DELETE_COMMENT}>
																{(deleteComment, { data, _ }) => (
																	<Button className="btn btn-block btn-primary mb-1" onClick={async e => {
																		if (window.confirm('Delete the item?')) {
																			await deleteComment({ variables: { id: comment.id } });
																			// wait for the delete mutation to return, otherwise the deleted post will still be in the db when refetch() runs 
																			refetch(); // refetch belongs to the surrounding FEED query
																		}
																	}}>
																		Delete Comment
																</Button>
																)}
															</Mutation>
														</Col>
													</Row>
												</div>
											))
												: null}
										</Col>
									</Row>
								))
							}

						</div>
					)
				}
				}
			</Query>
		)
	}

}
