import React from 'react';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';
import { Row, Col, Card, CardTitle, CardText } from 'reactstrap';
import { AddPost } from './_addpost';
import Time from 'react-time-format';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Alert from 'react-s-alert';
import confirm from 'reactstrap-confirm';
import {
	CSSTransition,
	TransitionGroup,
} from 'react-transition-group';



const FEED = gql`
    query {
			posts {
				id
				title
				body
				isPinned
				dateCreated
				author {
					id
					userName
					screenName
					role
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

							<TransitionGroup className="todo-list">
								{data.posts
									.slice(0)
									.sort((a, b) => {
										return (new Date(b.dateCreated).getTime()) - (new Date(a.dateCreated).getTime());
									})
									.sort((a, b) => {
										return (b.isPinned) - (a.isPinned);
									})
									.map(post => (

										<CSSTransition
											key={post.id}
											timeout={500}
											classNames="move"
										>
											<Row className="align-items-end my-1" key={post.id}>

												<Col xs="12" lg="12">
													<Card
														body
														className={`text-left pb-1 my-1 post ${post.isPinned ? "border border-primary" : null}`}
													>

														<Mutation mutation={DELETE_POST}>
															{(deletePost, { data, _ }) => (
																<div className="position-absolute" style={{ right: '5px', top: '5px' }}>
																	<FontAwesomeIcon
																		className="text-primary"
																		style={{ fontSize: '16px', cursor: "pointer" }}
																		icon={faTimes}
																		onClick={async e => {
																			if (await confirm()) {
																				await deletePost({ variables: { id: post.id } }).catch(error => Alert.error(`${error}`, {
																					position: 'top', effect: 'slide', timeout: 3000
																				}))
																				// wait for the delete mutation to return, otherwise the deleted post will still be in the db when refetch() runs 
																				refetch(); // refetch belongs to the surrounding FEED query
																			}
																		}}>
																	</FontAwesomeIcon>
																</div>
															)}
														</Mutation>

														{post.isPinned ? <span className="text-center text-primary font-italic font-weight-bold">Pinned Content</span> : null}

														<CardTitle>
															Title: {post.title}
														</CardTitle>
														<CardText>
															Text: {post.body}
														</CardText>
														<span className="annotation font-italic">
															Author: {post.author.screenName},
													User-ID: {post.author.id},
													Post-ID: {post.id},
													IsPinned?: {String(post.isPinned)},
													<Time value={post.dateCreated} format="DD.MM.YYYY hh:mm:ss"></Time>
														</span>
													</Card>
												</Col>
												{post.comments ? post.comments.map(comment => (

													<Col className="text-left" xs="12" key={comment.id}>
														<Row className="px-3">
															<Col xs="2">

															</Col>
															<Col xs="10" className="mr-0">
																<Mutation mutation={DELETE_COMMENT}>
																	{(deleteComment, { data, _ }) => (
																		<div className="position-absolute" style={{ right: '5px', top: '5px' }}>
																			<FontAwesomeIcon
																				className="text-primary"
																				style={{ fontSize: '14px', cursor: "pointer" }}
																				icon={faTimes}
																				onClick={async e => {
																					if (await confirm()) {
																						await deleteComment({ variables: { id: comment.id } });
																						// wait for the delete mutation to return, otherwise the deleted comment will still be in the db when refetch() runs 
																						refetch(); // refetch belongs to the surrounding FEED query
																					}
																				}}>
																			</FontAwesomeIcon>
																		</div>
																	)}
																</Mutation>
																<CardText className="mb-0 mt-2">
																	{comment.body}
																</CardText>
																<span className="mt-0 annotation font-italic">
																	Author: {comment.author.screenName}, User-ID: {comment.author.id}, <Time value={comment.dateCreated} format="DD.MM.YYYY, hh:mm:ss"></Time>, Comment-ID: {comment.id}
																</span>

															</ Col>
														</Row>
													</Col>
												))
													: null}
											</Row>
										</CSSTransition>
									))
								}
							</TransitionGroup>


						</div>
					)
				}
				}
			</Query>
		)
	}

}
