import { ApolloClient, from, InMemoryCache } from '@apollo/client'

import { auth } from './auth'
import { http } from './http'

const link = from([auth, http])

export const getClient = () =>
  new ApolloClient({
    cache: new InMemoryCache(),
    link,
  })
