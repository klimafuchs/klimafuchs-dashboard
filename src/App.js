import React, { Component } from 'react'
import { Container } from 'reactstrap'
import { DragDropContext } from 'react-beautiful-dnd'
import { Login } from './components/login'
import './App.css';
import Dashboard from './components/dashboard';

export class App extends Component {

  constructor(props) {
    super(props)
    this.state = { token: "" }
  }

  loginTokenChanged = (token) => { this.setState({ token: token }) }

  onDragEnd = result => {
    
  }

  render() {

    const isLoggedIn = localStorage.getItem('token')

    return (
      <div className="App">
        <DragDropContext
          onDragStart
          onDragupdate
          onDragEnd={this.onDragEnd}
        >

          <Container>
            {isLoggedIn ? (<Dashboard />) : (<Login callBackRender={this.loginTokenChanged} />)}
          </Container>
        </DragDropContext>
      </div>
    )
  }
}

export default App;
