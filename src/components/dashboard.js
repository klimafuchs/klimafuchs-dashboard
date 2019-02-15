import React, { Component } from 'react'
import { Stats } from './stats/stats'
import { Nutzer } from './users/nutzer'
import { Feed } from './feed/feed'
/* import { Notification } from './notification/notification' */
import { Planning } from './season_management/planning'
import { TabContent, TabPane, Nav, NavItem, Button } from 'reactstrap';
import ApolloClient from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
import Alert from 'react-s-alert';
import { BrowserRouter as Router, Route, NavLink, Redirect } from "react-router-dom";

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
  window.location.assign("/dashboard");
}

class Dashboard extends Component {

  constructor(props) {
    super(props)
    this.state = {
      activeTab: "1"
    }
  }

  render() {
    return (
      <Router>
        <ApolloProvider client={client}>
        <Redirect to="dashboard/home" />
          <div className="mt-5">
            <img className="col-2" src="./logo.png" alt="Klimafuchs-Logo" />
            <h1 className="pb-5 font-weight-bold">Admin-Dashboard</h1>
            <Nav tabs>

              <NavItem className="border-0" style={{ cursor: "pointer" }}>
                <NavLink to="dashboard/home" className={`nav-link`} onClick={() => { Alert.closeAll() }}>
                  Dashboard
                </NavLink>
              </NavItem>
              <NavItem style={{ cursor: "pointer" }}>
                <NavLink to="dashboard/users" className={`nav-link`} onClick={() => { Alert.closeAll() }}>
                  Nutzerverwaltung
                </NavLink>
              </NavItem>
              <NavItem style={{ cursor: "pointer" }}>
                <NavLink to="dashboard/feed" className={`nav-link`} onClick={() => { Alert.closeAll() }}>
                  Feed
                </NavLink>
              </NavItem>
              {/*             <NavItem style={{ cursor: "pointer" }}>
                <NavLink className={classnames({ active: this.state.activeTab === '4', inactive: this.state.activeTab !== '4' }, "nav-link")} onClick={() => { Alert.closeAll() }}>
                Notification
                </NavLink>
                </NavItem> */}
              <NavItem style={{ cursor: "pointer" }}>
                <NavLink to="dashboard/seasons" className={`nav-link`} onClick={() => { Alert.closeAll() }}>
                  Manage Seasons
                </NavLink>
              </NavItem>
              <Button className="ml-auto mb-1" color="primary" onClick={() => { localStorage.clear(); refreshPage() }} >Logout</Button>
            </Nav>
            <TabContent className={`tab-content-bg p-3 mb-5`} activeTab={this.state.activeTab}>
              <TabPane tabId="1">
                <Route path="dashboard/home" component={Stats} />
                <Route path="dashboard/users" component={Nutzer} />
                <Route path="dashboard/feed" component={Feed} />
                <Route path="dashboard/seasons" component={Planning} />
              </TabPane>
            </TabContent>
          </div>
        </ApolloProvider>
      </Router>
    )
  }
}

export default Dashboard
