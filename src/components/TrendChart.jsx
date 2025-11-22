import { useRef, useMemo } from 'react'
import { useExpense } from '../context/ExpenseContext'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
)

const TrendChart = () => {
    const { expenses } = useExpense()
    const chartRef = useRef(null)

    const { months, totals } = useMemo(() => {
        const monthLabels = []
        const monthlyTotals = []
        const currentDate = new Date()

        for (let i = 11; i >= 0; i--) {
            const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
            const label = monthDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
            monthLabels.push(label)

            const monthlySum = expenses
                .filter(exp => {
                    const expDate = new Date(exp.date)
                    return (
                        expDate.getMonth() === monthDate.getMonth() &&
                        expDate.getFullYear() === monthDate.getFullYear()
                    )
                })
                .reduce((acc, exp) => acc + exp.amount, 0)

            monthlyTotals.push(monthlySum)
        }

        return { months: monthLabels, totals: monthlyTotals }
    }, [expenses])

    if (totals.every(value => value === 0)) {
        return (
            <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                <p className="text-sm font-medium">Not enough data</p>
            </div>
        )
    }

    const data = useMemo(
        () => ({
            labels: months,
            datasets: [
                {
                    label: 'Monthly Expenses',
                    data: totals,
                    borderColor: '#3B82F6',
                    backgroundColor: 'rgba(59,130,246,0.1)',
                    borderWidth: 3,
                    pointBackgroundColor: '#3B82F6',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 3,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    fill: true,
                    tension: 0.4
                }
            ]
        }),
        [months, totals]
    )

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { intersect: false, mode: 'index' },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(255,255,255,0.95)',
                titleColor: '#374151',
                bodyColor: '#374151',
                borderColor: '#E5E7EB',
                borderWidth: 1,
                cornerRadius: 12,
                padding: 12,
                callbacks: {
                    label: context => `Expenses: ₹${context.parsed.y.toLocaleString('en-IN')}`
                }
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#6B7280', font: { size: 12, weight: '500' } }
            },
            y: {
                beginAtZero: true,
                grid: { color: '#F3F4F6' },
                ticks: {
                    color: '#6B7280',
                    font: { size: 12, weight: '500' },
                    callback: value => '₹' + value.toLocaleString('en-IN')
                }
            }
        },
        animation: { duration: 1500, easing: 'easeOutCubic' }
    }

    return (
        <div className="h-80">
            <Line ref={chartRef} data={data} options={options} />
        </div>
    )
}

export default TrendChart