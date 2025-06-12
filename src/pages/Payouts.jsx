import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchArticles } from '../store/slices/newsSlice'
import { calculatePayouts, setRates } from '../store/slices/payoutSlice'
import { CSVLink } from 'react-csv'
import { PDFDownloadLink } from '@react-pdf/renderer'
import PayoutPDF from '../components/PayoutPDF'

export default function Payouts() {
  const dispatch = useDispatch()
  const { articles, loading } = useSelector((state) => state.news)
  const { payouts, rates } = useSelector((state) => state.payout)

  const [newsRate, setNewsRate] = useState(rates.news)
  const [blogRate, setBlogRate] = useState(rates.blog)

  useEffect(() => {
    dispatch(fetchArticles())
  }, [dispatch])

  useEffect(() => {
    if (articles.length > 0) {
      dispatch(calculatePayouts(articles))
    }
  }, [articles, dispatch])

  const handleRateUpdate = () => {
    dispatch(
      setRates({
        news: Number(newsRate),
        blog: Number(blogRate),
      })
    )
  }

  const totalPayout = payouts.reduce((sum, payout) => sum + payout.amount, 0)
  const newsCount = payouts.filter((payout) => payout.type === 'news').length
  const blogCount = payouts.filter((payout) => payout.type === 'blog').length

  const csvData = payouts.map((payout) => ({
    Title: payout.title,
    Type: payout.type,
    Date: new Date(payout.date).toLocaleDateString(),
    Amount: `₹${payout.amount}`,
  }))

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Payout Rates
          </h3>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="news-rate"
                className="block text-sm font-medium text-gray-700"
              >
                News Article Rate (₹)
              </label>
              <input
                type="number"
                name="news-rate"
                id="news-rate"
                value={newsRate}
                onChange={(e) => setNewsRate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="blog-rate"
                className="block text-sm font-medium text-gray-700"
              >
                Blog Post Rate (₹)
              </label>
              <input
                type="number"
                name="blog-rate"
                id="blog-rate"
                value={blogRate}
                onChange={(e) => setBlogRate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="mt-5">
            <button
              type="button"
              onClick={handleRateUpdate}
              className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Update Rates
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">
            Average Payout
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            ₹{payouts.length ? Math.round(totalPayout / payouts.length) : 0}
          </dd>
        </div>
      </div>

      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Payout Details
              </h3>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <div className="flex space-x-3">
                <CSVLink
                  data={csvData}
                  filename="payouts.csv"
                  className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Export CSV
                </CSVLink>
                <PDFDownloadLink
                  document={<PayoutPDF payouts={payouts} totalPayout={totalPayout} />}
                  fileName="payouts.pdf"
                  className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  {({ blob, url, loading, error }) =>
                    loading ? 'Generating PDF...' : 'Export PDF'
                  }
                </PDFDownloadLink>
              </div>
            </div>
          </div>
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
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {payouts.map((payout) => (
                      <tr key={payout.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                          {payout.title}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {payout.type}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {new Date(payout.date).toLocaleDateString()}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          ₹{payout.amount}
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