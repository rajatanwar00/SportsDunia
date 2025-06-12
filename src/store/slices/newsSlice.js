import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const apiKey = import.meta.env.VITE_NEWS_API_KEY;

const initialState = {
  articles: [],
  filteredArticles: [],
  loading: false,
  error: null,
  filters: {
    searchQuery: '',
    dateRange: {},
    type: null,
  },
}

export const fetchArticles = createAsyncThunk(
  'news/fetchArticles',
  async () => {
    // Replace with your News API key
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?category=sports&apiKey=${apiKey}`
    )
    const data = await response.json()
    //console.log("data",data)

    if (data.status === 'ok') {
      return data.articles.map(article => ({
        ...article,
        type: Math.random() > 0.5 ? 'news' : 'blog', // Randomly assign type for demo
      }))
    } else {
      throw new Error(data.message || 'Failed to fetch news')
    }
  }
)

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload
      state.filteredArticles = state.articles.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(state.filters.searchQuery.toLowerCase())
        const matchesType = !state.filters.type || article.type === state.filters.type
        const matchesDate = !state.filters.dateRange.start || !state.filters.dateRange.end || 
          (new Date(article.publishedAt) >= new Date(state.filters.dateRange.start) &&
           new Date(article.publishedAt) <= new Date(state.filters.dateRange.end))
        return matchesSearch && matchesType && matchesDate
      })
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.loading = false
        state.articles = action.payload
        state.filteredArticles = action.payload
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export const { setFilters } = newsSlice.actions
export default newsSlice.reducer 