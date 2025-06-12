import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchArticles } from '../store/slices/newsSlice'
import { calculatePayouts } from '../store/slices/payoutSlice'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function Dashboard() {
  const dispatch = useDispatch()
  const { articles, loading } = useSelector((state) => state.news)
  const { payouts } = useSelector((state) => state.payout)

  useEffect(() => {
    dispatch(fetchArticles())
  }, [dispatch])

  useEffect(() => {
    if (articles.length > 0) {
      dispatch(calculatePayouts(articles))
    }
  }, [articles, dispatch])

  //console.log(articles);
  const totalArticles = articles.length
  const totalPayout = payouts.reduce((sum, payout) => sum + payout.amount, 0)
  const newsCount = articles.filter((article) => article.type === 'news').length
  const blogCount = articles.filter((article) => article.type === 'blog').length

  const chartData = {
    labels: ['News Articles', 'Blog Posts'],
    datasets: [
      {
        data: [newsCount, blogCount],
        backgroundColor: ['#4F46E5', '#10B981'],
        borderColor: ['#4338CA', '#059669'],
        borderWidth: 1,
      },
    ],
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">
            Total Articles
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {totalArticles}
          </dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">
            Total Payout
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            ₹{totalPayout}
          </dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">
            News Articles
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {newsCount}
          </dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">
            Blog Posts
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {blogCount}
          </dd>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Content Distribution
          </h3>
          <div className="mt-4 h-64">
            <Pie data={chartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Recent Articles
          </h3>
          <div className="mt-4 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                      >
                        Title
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Type
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {articles.slice(0, 5).map((article) => (
                      <tr key={article.url}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                          {article.title}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {article.type}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {new Date(article.publishedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 