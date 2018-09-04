import React, { Component } from 'react';
import { Button } from 'reactstrap';

export class Login extends Component {
	constructor() {
		super()
		this.state = {
			name: "",
			password: "",
		}
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(event) {
		event.preventDefault();
		fetch('https://enviroommate.org/app-dev/api/login', {
			method: 'POST',
			headers: {
			    'Accept': 'application/json',
			    'Content-Type': 'application/json'
			},
			body: JSON.stringify(
			{
				username: this.state.name,
				password: this.state.password,

			})
		}).then((response) => { 
		    return response.json()
		}).then((json) => {
			localStorage.setItem('token',json.token);
			this.props.callBackRender(json.token)
		}

		);
	}

	render() {
		return(
			<form onSubmit={this.handleSubmit}>
			  <span>E-Mail:</span>
			  <input type="text" name="e-mail" value={this.state.name} onChange={(e) => this.setState({name: e.target.value})}/>
			  <span>Password:</span>
			  <input type="text" name="password" value={this.state.password} onChange={(e) => this.setState({password: e.target.value})}/>
			  <Button type="submit" color="primary">Submit</Button>
			</form>
		)
	}

}