import { createHttpLink } from '@apollo/client'
import { format } from 'util'

const uri = format(
  '%s://%s:%s/graphql',
  process.env.REACT_APP_API_SCHEME,
  process.env.REACT_APP_API_HOST,
  process.env.REACT_APP_API_PORT,
)

export const http = createHttpLink({ uri })
