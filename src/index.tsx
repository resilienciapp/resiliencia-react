import React, { StrictMode } from 'react'
import { ApolloProvider } from '@apollo/client'
import { Body } from './Body'
import { ErrorProvider } from './components/ErrorProvider'
import ReactDOM from 'react-dom'
import { getClient } from './apollo'

ReactDOM.render(
  <StrictMode>
    <ApolloProvider client={getClient()}>
      <ErrorProvider>
        <Body />
      </ErrorProvider>
    </ApolloProvider>
  </StrictMode>,
  document.getElementById('root'),
)
