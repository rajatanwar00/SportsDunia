import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    marginTop: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#bfbfbf',
    borderBottomStyle: 'solid',
    minHeight: 30,
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
  },
  tableCell: {
    padding: 5,
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#bfbfbf',
    borderRightStyle: 'solid',
  },
  tableCellHeader: {
    fontWeight: 'bold',
  },
  summary: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f8f9fa',
  },
  summaryText: {
    fontSize: 14,
    marginBottom: 5,
  },
})

export default function PayoutPDF({ payouts, totalPayout }) {
  const newsCount = payouts.filter((payout) => payout.type === 'news').length
  const blogCount = payouts.filter((payout) => payout.type === 'blog').length
  const averagePayout = payouts.length
    ? Math.round(totalPayout / payouts.length)
    : 0

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Payout Report</Text>
          <Text style={styles.subtitle}>
            Generated on {new Date().toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            Total Payout: ₹{totalPayout}
          </Text>
          <Text style={styles.summaryText}>
            News Articles: {newsCount}
          </Text>
          <Text style={styles.summaryText}>
            Blog Posts: {blogCount}
          </Text>
          <Text style={styles.summaryText}>
            Average Payout: ₹{averagePayout}
          </Text>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>
              Title
            </Text>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>
              Type
            </Text>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>
              Date
            </Text>
            <Text style={[styles.tableCell, styles.tableCellHeader]}>
              Amount
            </Text>
          </View>

          {payouts.map((payout) => (
            <View key={payout.id} style={styles.tableRow}>
              <Text style={styles.tableCell}>{payout.title}</Text>
              <Text style={styles.tableCell}>{payout.type}</Text>
              <Text style={styles.tableCell}>
                {new Date(payout.date).toLocaleDateString()}
              </Text>
              <Text style={styles.tableCell}>₹{payout.amount}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  )
} 