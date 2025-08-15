import { createContext, useContext, useReducer } from 'react'

const NotificationContext = createContext()

export const useNotification = () => useContext(NotificationContext)

export const NotificationProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(notificationReducer, null)
  return (
    <NotificationContext.Provider value={[notification, dispatch]}>
      {children}
    </NotificationContext.Provider>
  )
}

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET': return action.payload
    case 'CLEAR': return null
    default: return state
  }
}