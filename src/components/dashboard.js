import React, { Component } from 'react'
import { Stats } from './stats/stats'
import { Nutzer } from './users/nutzer'
import { Feed } from './feed/feed'
/* import { Notification } from './notification/notification' */
import { Planning } from './season_management/planning'
import { TabContent, TabPane, Nav, NavItem, NavLink, Button } from 'reactstrap';
import classnames from 'classnames';
import ApolloClient from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
import Alert from 'react-s-alert'

const link = new HttpLink({
  uri: process.env.REACT_APP_GRAPHQL_URL
})

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const cache = new InMemoryCache()

const client = new ApolloClient({
  cache: cache,
  link: authLink.concat(link),
})

function refreshPage() {
  window.location.reload();
}

class Dashboard extends Component {

  constructor(props) {
    super(props)
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
  render() {
    return (
      <ApolloProvider client={client}>
        <div className="mt-5">
          <img className = "col-2" src="./logo.png" alt="logo.png missing or misplaced" />
          <h1 className="pb-5 font-weight-bold">Admin-Dashboard</h1>
          <Nav tabs>
            <NavItem className="border-0" style={{ cursor: "pointer" }}>
              <NavLink className={classnames({active: this.state.activeTab === '1', inactive: this.state.activeTab !== '1'})} onClick={() => { this.toggle('1'); Alert.closeAll() }}>
                Dashboard
              </NavLink>
            </NavItem>
            <NavItem style={{ cursor: "pointer" }}>
              <NavLink className={classnames({ active: this.state.activeTab === '2', inactive: this.state.activeTab !== '2' })} onClick={() => { this.toggle('2'); Alert.closeAll() }}>
                Nutzerverwaltung
              </NavLink>
            </NavItem>
            <NavItem style={{ cursor: "pointer" }}>
              <NavLink className={classnames({ active: this.state.activeTab === '3', inactive: this.state.activeTab !== '3' })} onClick={() => { this.toggle('3'); Alert.closeAll() }}>
                Feed
              </NavLink>
            </NavItem>
{/*             <NavItem style={{ cursor: "pointer" }}>
              <NavLink className={classnames({ active: this.state.activeTab === '4', inactive: this.state.activeTab !== '4' })} onClick={() => { this.toggle('4'); Alert.closeAll() }}>
                Notification
              </NavLink>
            </NavItem> */}
            <NavItem style={{ cursor: "pointer" }}>
              <NavLink className={classnames({ active: this.state.activeTab === '5', inactive: this.state.activeTab !== '5' })} onClick={() => { this.toggle('5'); Alert.closeAll() }}>
                Manage Seasons
              </NavLink>
            </NavItem>
            <Button className="ml-auto mb-1" color="primary" onClick={() => { localStorage.clear(); refreshPage() }} >Logout</Button>
          </Nav>
          <TabContent className={`tab-content-bg p-3 mb-5`} activeTab={this.state.activeTab}>
            <TabPane tabId="1">
              <Stats />
            </TabPane>
            <TabPane tabId="2">
              <Nutzer />
            </TabPane>
            <TabPane tabId="3">
              <Feed />
            </TabPane>
{/*             <TabPane tabId="4">
              <Notification />
            </TabPane> */}
            <TabPane tabId="5">
              <Planning />
            </TabPane>
          </TabContent>
        </div>
      </ApolloProvider>
    )
  }
}

export default Dashboard
