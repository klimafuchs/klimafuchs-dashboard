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

  buildCommentForest = (allComments) => {
    let mainBranchArray = allComments.filter((c) => !c.parent)
    mainBranchArray.forEach(branchElement => {
      this.buildEachCommentTree(branchElement, allComments)
    })
    return mainBranchArray
  }


  buildEachCommentTree = (branchElement, allComments) => {
    if (!branchElement.children) return;
    let branchElementChildComments = branchElement.children.map(id => allComments.find(comment => comment.id == id.id))
    branchElement["childComments"] = branchElementChildComments
    branchElement.childComments.forEach(childComment => {
      this.buildEachCommentTree(childComment, allComments)
    })
  }

  renderCommentForest = (commentForest) => {
    return commentForest.map(tree => this.renderEachCommentTree(tree))
  }

  renderEachCommentTree = (tree, treeLevel = 0) => {

    let eachChildTree = tree.childComments ?
      <div>
        {tree.childComments.map(comment => this.renderEachCommentTree(comment, treeLevel + 1))}
      </div>
      :
      <div />

    return (
      <div key={tree.id}>
        {this.renderOneComment(tree, treeLevel)}
        {eachChildTree}
      </div>

    )
  }

  renderOneComment = (comment, treeLevel) => {
    return (

      <Col className="text-left" xs="12" key={comment.id}>
        <Row className="px-3">

          <Col xs={`${treeLevel}`}></Col>
          <Col className="mr-0">
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
                        this.props.passed_refetch(); // passed_refetch was passed from parent
                      }
                    }}>
                  </FontAwesomeIcon>
                </div>
              )}
            </Mutation>
            <CardText className="mb-0 mt-2">
              {comment.body}, {treeLevel}
            </CardText>

            <span className="mt-0 annotation font-italic">
              Author: {comment.author.screenName}, User-ID: {comment.author.id}, <Time value={comment.dateCreated} format="DD.MM.YYYY, hh:mm:ss"></Time>, Comment-ID: {comment.id}
            </span>

          </ Col>

        </Row>
      </Col>
    )
  }


  render() {

    const allComments = this.props.comments
    return (
      <div>
        {this.renderCommentForest(this.buildCommentForest(allComments))}

      </div>
    )
  }

}