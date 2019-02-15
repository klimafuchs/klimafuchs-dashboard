import React from 'react';
import gql from 'graphql-tag';
import { Mutation, Query } from 'react-apollo';
import { Card, CardImg, CardText, CardTitle, Col, Pagination, PaginationItem, PaginationLink, Row } from 'reactstrap';
import { AddPost } from './_addpost';
import { Comments } from './_comments'
import Time from 'react-time-format';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Alert from 'react-s-alert';
import confirm from 'reactstrap-confirm';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const FEED = gql`
    query FeedPage($page: ConnectionArgs!) {
        paginatedPosts(connectionArgs: $page) {
            page {
                edges {
                    node {
                        id
                        title
                        image {
                            filename
                        }
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
                    cursor
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
const img_url = process.env.REACT_APP_IMG_URL

export class Feed extends React.Component {

  constructor(props) {
    super(props)
    this.pageSize = 2
  }


  render() {
    return (
      <Query
        query={FEED}
        variables={{ page: { first: this.pageSize } }}
        fetchPolicy="cache-and-network"
      >
        {({ loading, error, data, refetch, fetchMore }) => {
          if (loading) return <div><img className="col-1 pt-5 mt-5" src="./load-spinner.gif" alt="Klimafuchs-Logo" /></div>;
          if (error) return <div>${error.message}</div>;
          return (

            <div>
              <Row>
                <Col xs="12">
                  <AddPost />
                </Col>
              </Row>

              <TransitionGroup className="todo-list">

                {data.paginatedPosts.page.edges
                  .slice(0)
                  .sort((a, b) => {
                    return (new Date(b.dateCreated).getTime()) - (new Date(a.dateCreated).getTime());
                  })
                  .sort((a, b) => {
                    return (b.node.isPinned) - (a.node.isPinned);
                  })
                  .map(post => (

                    <CSSTransition
                      key={post.node.id}
                      timeout={500}
                      classNames="move"
                    >
                      <Row className="align-items-end my-1" key={post.node.id}>

                        <Col xs="12" lg="12">
                          <Card
                            body
                            className={`text-left pb-1 my-1 post ${post.node.isPinned ? "border border-primary" : null}`}
                          >

                            <Mutation mutation={DELETE_POST}>
                              {(deletePost, { data, _ }) => (
                                <div className="position-absolute"
                                  style={{ right: '5px', top: '5px' }}>
                                  <FontAwesomeIcon
                                    className="text-primary"
                                    style={{ fontSize: '16px', cursor: "pointer" }}
                                    icon={faTimes}
                                    onClick={async e => {
                                      if (await confirm()) {
                                        await deletePost({ variables: { id: post.node.id } }).catch(error => Alert.error(`${error}`, {
                                          position: 'top',
                                          effect: 'slide',
                                          timeout: 3000
                                        }))
                                        // wait for the delete mutation to return, otherwise the deleted post will still be in the db when refetch() runs
                                        refetch(); // refetch belongs to the surrounding FEED query
                                      }
                                    }}>
                                  </FontAwesomeIcon>
                                </div>
                              )}
                            </Mutation>

                            {post.node.isPinned ? <span
                              className="text-center text-primary font-italic font-weight-bold">Pinned Content</span> : null}

                            {post.node.image == null ? null : <CardImg top width="100%"
                              src={`${img_url}/${post.node.image.filename}`}
                              alt="Card image cap" />}

                            <CardTitle className="mt-3">
                              Title: {post.node.title}
                            </CardTitle>
                            <CardText>
                              Text: {post.node.body}
                            </CardText>
                            <span className="annotation font-italic">
                              Author: {post.node.author.screenName},
															User-ID: {post.node.author.id},
															Post-ID: {post.node.id},
															IsPinned?: {String(post.node.isPinned)},
															<Time value={post.node.dateCreated}
                                format="DD.MM.YYYY hh:mm:ss"></Time>
                            </span>
                          </Card>
                        </Col>

                        <Comments passed_refetch={() => refetch(FEED)}
                          comments={post.node.comments} />


                      </Row>
                    </CSSTransition>
                  ))
                }
              </TransitionGroup>

              <Pagination className="mt-5" aria-label="Page navigation example">

                <PaginationItem>
                  <PaginationLink
                    onClick={() => {
                      const lastCursor = data.paginatedPosts.page.edges[data.paginatedPosts.page.edges.length - 1].cursor;
                      fetchMore({
                        variables: {
                          page: {
                            first: this.pageSize,
                            after: lastCursor
                          }
                        },
                        updateQuery: (prev, { fetchMoreResult }) => {
                          if (!fetchMoreResult) return prev;
                          if (fetchMoreResult.paginatedPosts.page.edges.length === 0) {
                            Alert.warning("No more posts", {
                              position: 'top', timeout: 3000, effect: 'slide'
                            });
                            this.setState({ endReached: true })
                          }
                          return Object.assign(data.paginatedPosts.page, prev, {
                            edges: [...prev.paginatedPosts.page.edges, ...fetchMoreResult.paginatedPosts.page.edges]
                          })
                        }
                      })
                    }}> show 10 more posts
                  </PaginationLink>
                </PaginationItem>
              </Pagination>

            </div>
          )
        }
        }
      </Query>
    )
  }

}
