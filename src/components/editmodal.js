import React from 'react';
import { Button, Form, Modal, ModalHeader, ModalBody, ModalFooter, Col, FormGroup, Label, Input } from 'reactstrap';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const UPDATE_USER_DANGER = gql`
	mutation TestMutation($id:Int!, $name:String!, $isBanned:Boolean!) {
		changeUser(user:{id:$id, screenName:$name, isBanned:$isBanned}) {
		id
		screenName
		isBanned
		}
 	}`

export class Editmodal extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			modal: false,
			screenName: this.props.user.screenName,
			isBanned: this.props.user.isBanned
		};
		this.toggle = this.toggle.bind(this);
	}

	toggle() {
		this.setState({
			modal: !this.state.modal
		});
	}

	render() {
		return (
			<div>
				<Button className="btn-block" color="warning" onClick={this.toggle}>Edit</Button>
				<Mutation mutation={UPDATE_USER_DANGER}>
					{(changeUser, { data }) => (

						<Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
							<Form onSubmit={e => {
								e.preventDefault();
								 changeUser({ variables: { name: this.state.screenName, id: this.props.user.id, isBanned: this.state.isBanned } });
								 this.toggle();
							}}>
								<ModalHeader toggle={this.toggle}>Edit User</ModalHeader>
								<ModalBody>
									<FormGroup row>
										<Col xs={{ size: 10, offset: 1 }}>
											<Label>Screenname</Label>
											<Input type="text" name="screenName" value={this.state.screenName} onChange={(e) => this.setState({ screenName: e.target.value })} />
										</Col>
									</FormGroup>
									<FormGroup row>
										<Col xs={{ size: 10, offset: 1 }}>
											<Label>Is Banned?</Label>
											<Input type="select" name="isBanned" value={this.state.isBanned} onChange={(e) => this.setState({ isBanned: e.target.value })}>
												<option value={ !!true }>true</option>
												<option value={ !true }>false</option>
											</Input>
										</Col>
									</FormGroup>
								</ModalBody>
								<ModalFooter>
									<Button type="submit" color="primary">Confirm</Button>
									<Button color="secondary" onClick={this.toggle}>Cancel</Button>
								</ModalFooter>
							</Form>
						</Modal>
					)}
				</Mutation>
			</div>
		);
	}
}