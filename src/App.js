import React, { Component } from 'react';
import { Login } from './components/login'
import { Nutzer } from './components/nutzer'
import { Feed } from './components/feed'
import { Notification } from './components/notification'
import './App.css';
import { Container, TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import classnames from 'classnames';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {token: ""}
    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: '1'
    };
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  loginTokenChanged = (token) => {this.setState({token: token})}

  render() {

    const isLoggedIn = localStorage.getItem('token')

    return(
      <div className="App">
        
        <Container>
          { isLoggedIn? (

            <div className="mt-5">
              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '1' })}
                    onClick={() => { this.toggle('1'); }}
                  >
                    Nutzerverwaltung
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '2' })}
                    onClick={() => { this.toggle('2'); }}
                  >
                    Feed
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '3' })}
                    onClick={() => { this.toggle('3'); }}
                  >
                    Notification
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '4' })}
                    onClick={() => { this.toggle('4'); }}
                  >
                    Challenges
                  </NavLink>
                </NavItem>
                <Button className="ml-auto" outline color="primary" onClick={() => localStorage.clear()} >Logout</Button>
              </Nav>
              <TabContent className="p-3 border border-top-0" activeTab={this.state.activeTab}>
                <TabPane tabId="1">
                  <Nutzer />
                </TabPane>
                <TabPane tabId="2">
                  <Feed />
                </TabPane>
                <TabPane tabId="3">
                  <Notification />
                </TabPane>
                <TabPane tabId="4">
                </TabPane>
              </TabContent>
            </div>

            ) : (<Login callBackRender={this.loginTokenChanged} />)
          }

        </Container>
      </div>
    )

  }
}

export default App;
