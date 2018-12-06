import React from 'react';
import { Button, Form, Modal, ModalHeader, ModalBody, ModalFooter, Col, FormGroup, Label, Input, Jumbotron } from 'reactstrap';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus } from '@fortawesome/free-solid-svg-icons'

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const UPDATE_SEASON = gql`
    mutation updateSeason($id:Int, $title:String!, $startDate:DateTime!, $startOffsetDate:DateTime!, $endDate:DateTime!) {
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
    if (this.props.season) {
      this.state = {
        modal: false,
        title: this.props.season.title,
        startDate: this.props.season.startDate,
        startOffsetDate: this.props.season.startOffsetDate,
        endDate: this.props.season.endDate

      };
    } else {
      this.state = {
        modal: false,
        startDate: Date.now(),
        startOffsetDate: Date.now(),
        endDate: Date.now()
      };
    }

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
    const isEdit = !!this.props.season;
    let button, header;

    if (isEdit) {
      button = <FontAwesomeIcon className="ml-2 mr-1" style={{ fontSize: '12px', cursor: 'pointer' }} icon={faEdit} onClick={this.toggle} />
      header = "Edit Season"
    } else {
      button =
        <Jumbotron style={{ cursor: 'pointer' }} onClick={this.toggle} >
          <FontAwesomeIcon className="mx-1 w-100" style={{ fontSize: "30px" }} icon={faPlus} />
        </Jumbotron>
      header = "Add Season"
    }

    return (
      <span>

        {button}

        <Mutation mutation={UPDATE_SEASON}>
          {(changeSeason, { data }) => (

            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
              <Form onSubmit={e => {
                e.preventDefault();
                let variables = {
                  title: this.state.title,
                  startDate: this.state.startDate,
                  startOffsetDate: this.state.startOffsetDate,
                  endDate: this.state.endDate
                }
                if (this.props.season) {
                  variables = { id: this.props.season.id, ...variables }
                }
                changeSeason({
                  variables
                }).then(() => {
                  if (this.props.refetch) this.props.refetch();
                  this.toggle();
                });

              }}>

                <ModalHeader toggle={this.toggle}>
                  {header}
                </ModalHeader>
                <ModalBody>

                  <FormGroup row>
                    <Col xs={{ size: 10, offset: 1 }}>
                      <Label>Title</Label>
                      <Input
                        type="text"
                        placeholder={"Add Season" || ""}
                        value={this.state.title}
                        onChange={(e) => this.setState({ title: e.target.value })}
                      />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col xs={{ size: 4, offset: 1 }}>
                      <Label>StartDate</Label>
                    </Col>
                    <Col xs={{ size: 6, offset: 0 }}>
                      <DatePicker
                        className="form-control"
                        selected={new Date(this.state.startDate)}
                        onChange={this.handleChangeStartDate}
                        dateFormat="dd.MM.yyyy"
                        placeholderText="Select Beginning of Season"
                      />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col xs={{ size: 4, offset: 1 }}>
                      <Label>StartOffsetDate</Label>
                    </Col>
                    <Col xs={{ size: 6, offset: 0 }}>
                      <DatePicker
                        className="form-control"
                        selected={new Date(this.state.startOffsetDate)}
                        onChange={this.handleChangeStartOffsetDate}
                        dateFormat="dd.MM.yyyy"
                        placeholderText="Select Beginning of first TopicWeek"
                      />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col xs={{ size: 4, offset: 1 }}>
                      <Label>EndDate</Label>
                    </Col>
                    <Col xs={{ size: 6, offset: 0 }}>
                      <DatePicker
                        className="form-control"
                        selected={new Date(this.state.endDate)}
                        onChange={this.handleChangeEndDate}
                        dateFormat="dd.MM.yyyy"
                        placeholderText="Select End of Season"
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