import React, { Component } from 'react';
import { Jumbotron, Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import Alert from 'react-s-alert';

export class Login extends Component {
	constructor() {
		super()
		this.state = {
			name: "",
			password: "",
		}
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(e) {
		e.preventDefault();
		fetch(process.env.REACT_APP_LOGIN_URL, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(
				{
					username: this.state.name,
					password: this.state.password,
				}
			)
		}).then((response) => {
			if (response.status !== 200)
				throw new Error("Login failed")
			else
				return response.json()
		}).then((json) => {
			localStorage.setItem('token', json.token);
			this.props.callBackRender(json.token)
		}).catch(error => Alert.error(`${error}`, {
			position: 'top', effect: 'slide', timeout: 3000
		}))
		.then(Alert.closeAll())
		
	}

	render() {
		return (
			<div>

				<Jumbotron className="bg-light">
					<img className="col-2 mt-5" src="../logo.png" alt="Klimafuchs-Logo" />
					<h1 className="pb-4 font-weight-bold">Admin-Dashboard</h1>
					<h2 className="pb-2 font-weight-bold text-white">Login</h2>
					<Form onSubmit={this.handleSubmit}>

						<FormGroup row>
							<Col xs={{ size: 10, offset: 1 }} md={{ size: 4, offset: 4 }}>
								<Label className="text-white">Email</Label>
								<Input className="rounded" type="e-mail" name="e-mail" value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })} placeholder="E-Mail-Adresse" />
							</Col>
						</FormGroup>

						<FormGroup row>
							<Col xs={{ size: 10, offset: 1 }} md={{ size: 4, offset: 4 }}>
								<Label className="text-white">Password</Label>
								<Input className="rounded" type="password" name="password" value={this.state.password} onChange={(e) => this.setState({ password: e.target.value })} placeholder="Passwort" />
							</Col>
						</FormGroup>

						<FormGroup>
							<Button type="submit" color="primary">Submit</Button>
						</FormGroup>

					</Form>
				</Jumbotron>
			</div>
		)
	}

}