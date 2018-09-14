import React, { Component } from 'react';
import { Col, Button, FormGroup, Label, Input } from 'reactstrap';

export class Notification extends Component {
	render() {
		return(
			<div>
					<FormGroup row>
	        	<Col xs={{ size: 12 }} md={{ size: 12 }}>
		          <Label className="mt-4">Titel</Label>
		          <Input type="text" placeholder="Titel der Notification" />
	        	</Col>

	        	<Col xs={{ size: 12 }} md={{ size: 12 }}>
		          <Label className="mt-4" for="exampleText">Text Area</Label>
		          <Input type="textarea" name="text" id="exampleText" placeholder="Text der Notification" />
	        	</Col>

	        	<Col xs={{ size: 12 }} md={{ size: 6 }}>
		          <Label className="mt-4">Datum</Label>
		          <Input type="date" name="date" id="exampleDate"/>
	        	</Col>

		        <Col xs={{ size: 12 }} md={{ size: 6 }}>
		          <Label className="mt-4">Zeit</Label>
	  	        <Input type="time" name="time" id="exampleDatetime"/>
	    			</Col>
	        </FormGroup>

	        <FormGroup>
		        <Button type="submit" color="primary">Absenden</Button>
					</FormGroup>
			</div>
		)
	}
}
