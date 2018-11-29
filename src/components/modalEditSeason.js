import React from 'react';
import { Button, Form, Modal, ModalHeader, ModalBody, ModalFooter, Col, FormGroup, Label, Input } from 'reactstrap';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const UPDATE_SEASON = gql`
    mutation updateSeason($id:Int!, $title:String!, $startDate:DateTime!, $startOffsetDate:DateTime!, $endDate:DateTime!) {
      updateSeason(season:{id:$id, title:$title, startDate:$startDate, startOffsetDate:$startOffsetDate, endDate:$endDate}) {
        id
        title
        startDate
        startOffsetDate
        endDate  	
      }
    }`

export class ModalEditSeason extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      title: this.props.season.title,
      startDate: this.props.season.startDate,
      startOffsetDate: this.props.season.startOffsetDate,
      endDate: this.props.season.endDate

    };
    this.toggle = this.toggle.bind(this);
    this.handleChangeStartDate = this.handleChangeStartDate.bind(this);
    this.handleChangeStartOffsetDate = this.handleChangeStartOffsetDate.bind(this);
    this.handleChangeEndDate = this.handleChangeEndDate.bind(this);
  }

  handleChangeStartDate(date) {
    this.setState({
      startDate: date
    })
  }


  handleChangeStartOffsetDate(date) {
    this.setState({
      startOffsetDate: date
    })
  }


  handleChangeEndDate(date) {
    this.setState({
      endDate: date
    })
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  render() {
    return (
      <span>

        <FontAwesomeIcon className="mx-1" style={{ fontSize: '12px' }} icon={faEdit} style={{ cursor: 'pointer' }} onClick={this.toggle} />

        <Mutation mutation={UPDATE_SEASON}>
          {(changeSeason, { data }) => (

            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
              <Form onSubmit={e => {
                e.preventDefault();
                changeSeason({
                  variables: {
                    id: this.props.season.id,
                    title: this.state.title,
                    startDate: this.state.startDate,
                    startOffsetDate: this.state.startOffsetDate,
                    endDate: this.state.endDate
                  }
                });
                this.toggle();
              }}>
                <ModalHeader toggle={this.toggle}>Edit Season</ModalHeader>
                <ModalBody>

                  <FormGroup row>
                    <Col xs={{ size: 10, offset: 1 }}>
                      <Label>Title</Label>
                      <Input type="text"
                        value={this.state.title}
                        onChange={(e) => this.setState({ title: e.target.value })} />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col xs={{ size: 10, offset: 1 }}>
                      <Label>StartDate</Label>
                      <DatePicker
                        selected={this.state.startDate}
                        onChange={this.handleChangeStartDate}
                        dateFormat="dd.MM.yyyy"
                      />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col xs={{ size: 10, offset: 1 }}>
                      <Label>StartOffsetDate</Label>
                      <DatePicker
                        selected={this.state.startOffsetDate}
                        onChange={this.handleChangeStartOffsetDate}
                        dateFormat="dd.MM.yyyy"
                      />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col xs={{ size: 10, offset: 1 }}>
                      <Label>EndDate</Label>
                      <DatePicker
                        selected={this.state.endDate}
                        onChange={this.handleChangeEndDate}
                        dateFormat="dd.MM.yyyy"
                      />
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
      </span>
    );
  }
}