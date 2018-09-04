<h1>Testaccount</h1>
<p>admin@enviroommate.org</p>
<p>cohGh0in</p>

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

