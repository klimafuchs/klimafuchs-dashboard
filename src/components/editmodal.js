import React from 'react';
import { Button, Form, Modal, ModalHeader, ModalBody, ModalFooter, Col, FormGroup, Label, Input } from 'reactstrap';

export class Editmodal extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			modal: false,
			screenName: "",
			isBanned: "",
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.toggle = this.toggle.bind(this);
	}
	handleSubmit(event) {
		event.preventDefault();
		fetch('https://enviroommate.org/app-dev/api/users', {
			method: 'POST',
			headers: {
			    'Accept': 'application/json',
			    'Content-Type': 'application/json'
			},
			body: JSON.stringify(
				{
					screenName: this.state.screenName,
					isBanned: this.state.isBanned,
				}
			)
		}).then(
			this.setState({
				modal: !this.state.modal
			}),
	)}

	toggle() {
		this.setState({
			modal: !this.state.modal
		});
	}

	render() {
		return (
			<div>
				<Button className="btn-block" color="warning" onClick={this.toggle}>Edit</Button>
				<Form onSubmit={this.handleSubmit}>
					<Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
						<ModalHeader toggle={this.toggle}>Edit User (NO DATA LOGIC YET!!!!111!!)</ModalHeader>
						<ModalBody>
							<FormGroup row>
								<Col xs={{ size: 10, offset: 1 }}>
									<Label>screenName</Label>
									<Input type="text" name="screenName" value={this.state.screenName} onChange={(e) => this.setState({screenName: e.target.value})}/>
								</Col>
							</FormGroup>
							<FormGroup row>
								<Col xs={{ size: 10, offset: 1 }}>
									<Label>Is Banned?</Label>
									<Input type="select" name="isBanned" value={this.state.isBanned} onChange={(e) => this.setState({isBanned: e.target.value})}>
										<option>true</option>
										<option>false</option>
									</Input>
								</Col>
							</FormGroup>
						</ModalBody>
						<ModalFooter>
							<Button type="submit" color="primary" onClick={this.handleSubmit}>Confirm</Button>{' '}
							<Button color="secondary" onClick={this.toggle}>Cancel</Button>
						</ModalFooter>
					</Modal>
				</Form>
			</div>
		);
	}
}