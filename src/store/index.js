import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import newsReducer from './slices/newsSlice'
import payoutReducer from './slices/payoutSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    news: newsReducer,
    payout: payoutReducer,
  },
})

export default store 