import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Col, Form, FormGroup, Label, Input } from 'reactstrap';

export class Editmodal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
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
        <Button className="btn-block" color="danger" onClick={this.toggle}>Edit</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Edit User (NO DATA LOGIC YET!!!!111!!)</ModalHeader>
          <ModalBody>
            <FormGroup row>
	        	<Col xs={{ size: 10, offset: 1 }}>
		          <Label for="exampleEmail">Screenname</Label>
		          <Input type="text" name="e-mail" value={this.state.name} onChange={(e) => this.setState({name: e.target.value})}/>
	        	</Col>
	        </FormGroup>
	        <FormGroup row>
	        	<Col xs={{ size: 10, offset: 1 }}>
		          <Label for="exampleSelect">Is Banned?</Label>
		          <Input type="select" name="select" id="exampleSelect">
		            <option>true</option>
		            <option>false</option>
		          </Input>
          	    </Col>
	        </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.toggle}>Confirm</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}