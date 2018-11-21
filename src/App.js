import React, { Component } from 'react'
import { Container } from 'reactstrap'
import { Login } from './components/login'
import './App.css';
import Dashboard from './components/dashboard';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {token: ""}
  }

  loginTokenChanged = (token) => {this.setState({token: token})}

  render() {

    const isLoggedIn = localStorage.getItem('token')

    return(
      <div className="App">        
        <Container>
          { isLoggedIn? (<Dashboard />) : (<Login callBackRender={this.loginTokenChanged} />)}
        </Container> 
      </div>
    )
  }
}

export default App;
