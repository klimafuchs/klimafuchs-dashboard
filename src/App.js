import React, { Component } from 'react'
import { Container } from 'reactstrap'
import { Login } from './components/login'
import './App.css';
import Dashboard from './components/dashboard';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';

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
        <Alert stack={{ limit: 3 }} />
      </Container>
    )
  }
}

export default App;
