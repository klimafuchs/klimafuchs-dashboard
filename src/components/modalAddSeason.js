import React from 'react';
import { Button, Form, Modal, ModalHeader, ModalBody, ModalFooter, Col, FormGroup, Label, Input, Jumbotron } from 'reactstrap';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

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
            title: undefined,
            startDate: undefined,
            startOffsetDate: undefined,
            endDate: undefined,
            selectedDay: null
        };
        this.toggleAdd = this.toggleAdd.bind(this);
        this.handleDayClick1 = this.handleDayClick1.bind(this);
        this.handleDayClick2 = this.handleDayClick2.bind(this);
        this.handleDayClick3 = this.handleDayClick3.bind(this);
    }

    handleDayClick1(day) {
        this.setState({
            startDate: day
        });
    }
    handleDayClick2(day) {
        this.setState({
            startOffsetDate: day
        });
    }
    handleDayClick3(day) {
        this.setState({
            endDate: day
        });
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
                                console.log(this.state.startDate)
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
                                            <DayPickerInput
                                                onDayClick={this.handleDayClick1}
                                                selectedDays={this.state.selectedDay}
                                            />

                                        </Col>
                                    </FormGroup>

                                    <FormGroup row>
                                        <Col xs={{ size: 10, offset: 1 }}>
                                            <Label>StartOffsetDate</Label>
                                            <DayPickerInput
                                                onDayClick={this.handleDayClick2}
                                                selectedDays={this.state.selectedDay}
                                            />
                                        </Col>
                                    </FormGroup>

                                    <FormGroup row>
                                        <Col xs={{ size: 10, offset: 1 }}>
                                            <Label>EndDate</Label>
                                            <DayPickerInput
                                                onDayClick={this.handleDayClick3}
                                                selectedDays={this.state.selectedDay}
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