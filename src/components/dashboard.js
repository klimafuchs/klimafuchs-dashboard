import React, { Component } from 'react'
import { Stats } from './stats'
import { Nutzer } from './nutzer'
import { Feed } from './feed'
import { Notification } from './notification'
import { TabContent, TabPane, Nav, NavItem, NavLink, Button } from 'reactstrap';
import classnames from 'classnames';
import ApolloClient from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';

const link = new HttpLink({
  uri: 'https://enviroommate.org/app-dev/api/feed'
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
          <h1 className="pb-5">Admin-Dashboard</h1>
          <Nav tabs>
            <NavItem>
              <NavLink className={classnames({ active: this.state.activeTab === '1' })} onClick={() => { this.toggle('1'); }}>
                Dashboard
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className={classnames({ active: this.state.activeTab === '2' })} onClick={() => { this.toggle('2'); }}>
                Nutzerverwaltung
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className={classnames({ active: this.state.activeTab === '3' })} onClick={() => { this.toggle('3'); }}>
                Feed
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className={classnames({ active: this.state.activeTab === '4' })} onClick={() => { this.toggle('4'); }}>
                Notification
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className={classnames({ active: this.state.activeTab === '5' })} onClick={() => { this.toggle('5'); }}>
                Challenges
              </NavLink>
            </NavItem>
            <Button className="ml-auto" outline color="primary" onClick={() => { localStorage.clear(); refreshPage() }} >Logout</Button>
          </Nav>
          <TabContent className="p-3 border border-top-0" activeTab={this.state.activeTab}>
            <TabPane tabId="1">
              <Stats />
            </TabPane>
            <TabPane tabId="2">
              <Nutzer />
            </TabPane>
            <TabPane tabId="3">
              <Feed />
            </TabPane>
            <TabPane tabId="4">
              <Notification />
            </TabPane>
            <TabPane tabId="5">
            </TabPane>
          </TabContent>
        </div>
      </ApolloProvider>
    )
  }
}

export default Dashboard
