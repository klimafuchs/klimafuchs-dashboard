import React, { Component } from 'react'
import { Container } from 'reactstrap'
import { Login } from './components/login'
import './App.css';
import Dashboard from './components/dashboard';

export class App extends Component {

  constructor(props) {
    super(props)
    this.state = { token: "" }
  }

  loginTokenChanged = (token) => { this.setState({ token: token }) }

  render() {

    const isLoggedIn = localStorage.getItem('token')

    return (
      <Container className="App">
        {isLoggedIn ? (<Dashboard />) : (<Login callBackRender={this.loginTokenChanged} />)}
      </Container>
    )
  }
}

export default App;
