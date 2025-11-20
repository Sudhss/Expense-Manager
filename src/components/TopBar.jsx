import { useState } from 'react'
import { Download, Upload, CheckCircle, AlertCircle, X } from 'lucide-react'
import { useExpense } from '../context/ExpenseContext'
import Papa from 'papaparse'

const TopBar = () => {
  const { expenses, importExpenses } = useExpense()
  const [notification, setNotification] = useState(null)

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
  }

  const closeNotification = () => setNotification(null)

  const handleExport = () => {
    if (!expenses.length) {
      showNotification('No expenses to export', 'error')
      return
    }

    const csvData = expenses.map(x => ({
      Date: x.date,
      Category: x.category,
      Amount: x.amount,
      Note: x.note || ''
    }))

    const csv = Papa.unparse(csvData)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.href = url
    link.download = `expenses_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    showNotification(`Exported ${expenses.length} expenses`)
  }

  const handleImport = e => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      showNotification('File too large', 'error')
      e.target.value = ''
      return
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: r => {
        try {
          const imported = r.data.map(x => {
            const amt = parseFloat(String(x.Amount).replace(/[^0-9.-]/g, ''))
            if (!x.Date || !x.Category || isNaN(amt) || amt <= 0) return null
            if (isNaN(new Date(x.Date).getTime())) return null
            return { date: x.Date, category: x.Category, amount: amt, note: x.Note || '' }
          }).filter(Boolean)

          if (!imported.length) throw new Error('Invalid CSV')

          const unique = new Map()
          imported.forEach(x => {
            const k = `${x.date}_${x.amount}_${x.category}_${x.note}`
            unique.set(k, x)
          })

          importExpenses([...unique.values()])
          showNotification(`Imported ${unique.size} items`)
        } catch (er) {
          showNotification(er.message, 'error')
        }
      },
      error: err => showNotification(err.message, 'error')
    })

    e.target.value = ''
  }

  return (
    <div className="flex items-center gap-3">
      <label className="relative cursor-pointer">
        <input type="file" accept=".csv" onChange={handleImport} className="hidden" />
        <div className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-xl hover:bg-primary-100 transition-all duration-200 font-medium border border-primary-200">
          <Upload className="w-4 h-4" />
          <span className="hidden sm:inline">Import CSV</span>
        </div>
      </label>

      <button
        onClick={handleExport}
        className="flex items-center gap-2 px-4 py-2 bg-accent-50 text-accent-600 rounded-xl hover:bg-accent-100 transition-all duration-200 font-medium border border-accent-200"
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">Export CSV</span>
      </button>

      {notification && (
        <div className={`fixed top-20 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg animate-slide-up 
          ${notification.type === 'success' ? 'bg-accent-50 text-accent-700 border border-accent-200' 
          : 'bg-red-50 text-red-700 border border-red-200'}`}>
          
          {notification.type === 'success' ? 
            <CheckCircle className="w-5 h-5" /> : 
            <AlertCircle className="w-5 h-5" />
          }

          <span className="font-medium">{notification.message}</span>

          <button onClick={closeNotification} className="ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}

export default TopBar