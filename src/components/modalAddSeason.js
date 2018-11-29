import React from 'react';
import { Button, Form, Modal, ModalHeader, ModalBody, ModalFooter, Col, FormGroup, Label, Input, Jumbotron } from 'reactstrap';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ADD_SEASON = gql`
    mutation updateSeason($title:String!, $startDate:DateTime!, $startOffsetDate:DateTime!, $endDate:DateTime!) {
      updateSeason(season:{title:$title, startDate:$startDate, startOffsetDate:$startOffsetDate, endDate:$endDate}) {
        id
        title
        startDate
        startOffsetDate
        endDate  	
      }
    }`

export class ModalAddSeason extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            modalAdd: false,
            title: "Provide a Season Title",
            startDate: "Provide a Start Date",
            startOffsetDate: "Provide a StartOffsetDate",
            endDate: "Provide an endDate"
        };
        this.toggleAdd = this.toggleAdd.bind(this);
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

    toggleAdd() {
        this.setState({
            modalAdd: !this.state.modalAdd
        });
    }

    render() {
        return (
            <span>
                <Jumbotron>
                    <FontAwesomeIcon className="mx-1" style={{ fontSize: '30px' }} icon={faPlus} style={{ cursor: 'pointer' }} onClick={this.toggleAdd} />
                </Jumbotron>

                <Mutation mutation={ADD_SEASON}>
                    {(changeSeason, { data }) => (

                        <Modal isOpen={this.state.modalAdd} className={this.props.className}>
                            <Form onSubmit={e => {
                                e.preventDefault();
                                changeSeason({
                                    variables: {
                                        title: this.state.title,
                                        startDate: this.state.startDate,
                                        startOffsetDate: this.state.startOffsetDate,
                                        endDate: this.state.endDate
                                    }
                                });
                                this.toggleAdd();
                            }}>
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
                                    <Button type="submit" color="primary">Create Season</Button>
                                    <Button color="secondary" onClick={this.toggleAdd}>Cancel</Button>
                                </ModalFooter>
                            </Form>
                        </Modal>
                    )}
                </Mutation>
            </span>
        );
    }
}