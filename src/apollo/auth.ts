import { ContextSetter, setContext } from '@apollo/client/link/context'

const contextSetter: ContextSetter = (_, context) => ({
  ...context,
  headers: {
    ...context.headers,
  },
})

export const auth = setContext(contextSetter)
