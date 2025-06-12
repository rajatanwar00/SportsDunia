import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  rates: {
    news: 100, // ₹100 per news article
    blog: 200, // ₹200 per blog article
  },
  payouts: [],
  loading: false,
  error: null,
}

const payoutSlice = createSlice({
  name: 'payout',
  initialState,
  reducers: {
    setRates: (state, action) => {
      state.rates = action.payload
    },
    calculatePayouts: (state, action) => {
      const articles = action.payload
      state.payouts = articles.map(article => ({
        id: article.id,
        title: article.title,
        type: article.type,
        date: article.publishedAt,
        amount: state.rates[article.type] || 0,
      }))
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
  },
})

export const { setRates, calculatePayouts, setLoading, setError } = payoutSlice.actions
export default payoutSlice.reducer 