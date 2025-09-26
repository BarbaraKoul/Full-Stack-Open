import { configureStore } from '@reduxjs/toolkit'
import anecdotesReducer from './anecdotesSlice'
import notificationReducer from './notificationSlice'

const store = configureStore({
  reducer: {
    anecdotes: anecdotesReducer,
    notification: notificationReducer,
  },
})

export default store
