import React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { Row, Col, CardText } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import confirm from 'reactstrap-confirm';
import Time from 'react-time-format';

const DELETE_COMMENT = gql`
	mutation DeleteComment($id: Int!) {
		removeComment(CommentId: $id) {
				dateCreated
		}
	} 
`

export class Comments extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    return (
      <div>
        

        {this.props.comments ? this.props.comments.map(comment => (

          <Col className="text-left" xs="12" key={comment.id}>
            <Row className="px-3">
              <Col xs="2">

              </Col>
              <Col xs="10" className="mr-0">
                <Mutation
                  mutation={DELETE_COMMENT}s
                >
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
                            this.props.passed_refetch(); // passed_refetch was passed from parent
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
          : null
        }
      </div>
    )
  }

}