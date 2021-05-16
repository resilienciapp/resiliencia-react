import { noop } from 'lodash'
import React, {
  createContext,
  FunctionComponent,
  useCallback,
  useContext,
  useState,
} from 'react'

import errorIcon from '../assets/error.svg'
import informationIcon from '../assets/information.svg'
import successIcon from '../assets/success.svg'
import warningIcon from '../assets/warning.svg'
import { Color } from '../style'

type CallableFunction = (messages: Message[]) => void

interface DisplayableMessage {
  backgroundColor: string
  description: string
  icon: string
  id: number
  title: string
}

interface Message {
  description?: string
  title?: string
}

interface Context {
  displayError: CallableFunction
  displayInformation: CallableFunction
  displaySuccess: CallableFunction
  displayWarning: CallableFunction
  errors: DisplayableMessage[]
}

const ErrorContext = createContext<Context>({
  displayError: noop,
  displayInformation: noop,
  displaySuccess: noop,
  displayWarning: noop,
  errors: [],
})

export const ErrorProvider: FunctionComponent = ({ children }) => {
  const [errors, setError] = useState<DisplayableMessage[]>([])

  const displayError = useCallback((messages: Message[]) => {
    const errors: DisplayableMessage[] = messages.map(
      (message, index) =>
        ({
          ...message,
          backgroundColor: Color.Error,
          icon: errorIcon,
          id: index,
        } as DisplayableMessage),
    )
    setError(errors)
  }, [])

  const displayInformation = useCallback((messages: Message[]) => {
    const information: DisplayableMessage[] = messages.map(
      (message, index) =>
        ({
          ...message,
          backgroundColor: Color.Information,
          icon: informationIcon,
          id: index,
        } as DisplayableMessage),
    )
    setError(information)
  }, [])

  const displaySuccess = useCallback((messages: Message[]) => {
    const successes: DisplayableMessage[] = messages.map(
      (message, index) =>
        ({
          ...message,
          backgroundColor: Color.Success,
          icon: successIcon,
          id: index,
        } as DisplayableMessage),
    )
    setError(successes)
  }, [])

  const displayWarning = useCallback((messages: Message[]) => {
    const warnings: DisplayableMessage[] = messages.map(
      (message, index) =>
        ({
          ...message,
          backgroundColor: Color.Warning,
          icon: warningIcon,
          id: index,
        } as DisplayableMessage),
    )
    setError(warnings)
  }, [])

  return (
    <ErrorContext.Provider
      value={{
        displayError,
        displayInformation,
        displaySuccess,
        displayWarning,
        errors,
      }}>
      {children}
    </ErrorContext.Provider>
  )
}

export const useError = () => useContext(ErrorContext)
