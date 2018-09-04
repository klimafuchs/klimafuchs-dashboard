<h1>test</h1>

Admin-Login
  admin@enviroommate.org
  cohGh0in

Queries
  query {
    posts {
      title,
      body,
      author {
        id,
        screenName
      },
      comments {
        id,
        body,      
      }
      
    }
  }

  query {
    users {
      screenName
    }
  }

