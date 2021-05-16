import { ApolloProvider } from '@apollo/client'
import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'

import { getClient } from './apollo'
import { Body } from './Body'
import { ErrorProvider } from './components/ErrorProvider'

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
