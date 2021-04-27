import { ApolloProvider } from '@apollo/client'
import { Body } from './Body'
import React from 'react'
import ReactDOM from 'react-dom'
import { getClient } from './apollo'

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={getClient()}>
      <Body />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)
