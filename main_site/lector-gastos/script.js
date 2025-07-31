document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los elementos del DOM
    const fileInput = document.getElementById('file-input');
    const resultsSection = document.getElementById('results-section');
    const summaryElement = document.getElementById('summary');
    const topExpensesCanvas = document.getElementById('topExpensesChart');
    const monthlyCanvas = document.getElementById('monthlyChart');
    let topExpensesChart = null;
    let monthlyChart = null;

    // Listener para cuando el usuario selecciona un archivo
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;

        Papa.parse(file, {
            delimiter: ";",
            skipEmptyLines: true,
            complete: handleData,
            error: handleError
        });
    });

    function handleData(results) {
        const allRows = results.data;
        const headerRowIndex = allRows.findIndex(row => row.includes("Fecha") && row.includes("Débito"));

        if (headerRowIndex === -1) {
            alert("El archivo no parece tener un formato válido. No se pudo encontrar la fila de encabezado con 'Fecha' y 'Débito'.");
            return;
        }

        const headers = allRows[headerRowIndex];
        const dataRows = allRows.slice(headerRowIndex + 1);

        const validData = dataRows.map(row => {
            const obj = {};
            headers.forEach((header, index) => { obj[header] = row[index]; });
            return obj;
        }).filter(row => row.Fecha && row.Fecha.includes('/'));

        if (validData.length === 0) {
            alert("No se encontraron filas de datos válidas para procesar.");
            return;
        }

        const totals = processData(validData);
        const topExpenseCategories = getTopExpenseCategories(validData);
        const monthlyData = processMonthlyData(validData, topExpenseCategories);

        displayResults(totals);
        createTopExpensesChart(validData, topExpenseCategories);
        createMonthlyChart(monthlyData, topExpenseCategories);
        resultsSection.classList.remove('hidden');
    }

    function handleError(error) {
        console.error("Error al parsear el archivo:", error);
        alert("Hubo un error al leer el archivo. Por favor, asegúrate que sea un CSV válido.");
    }

    function cleanAndParseNumber(amountString) {
        if (typeof amountString !== 'string' || !amountString) return 0;
        const cleanedString = amountString.replace(/\./g, '').replace(',', '.');
        return parseFloat(cleanedString) || 0;
    }

    function processData(data) {
        return data.reduce((acc, row) => {
            acc.totalIncome += cleanAndParseNumber(row.Crédito);
            acc.totalExpenses += Math.abs(cleanAndParseNumber(row.Débito));
            return acc;
        }, { totalIncome: 0, totalExpenses: 0 });
    }

    function getTopExpenseCategories(data) {
        const expenseTotals = {};
        data.forEach(row => {
            const expense = Math.abs(cleanAndParseNumber(row.Débito));
            if (expense > 0) {
                const description = (row.Movimiento || 'Gasto').split('\n')[0].trim();
                expenseTotals[description] = (expenseTotals[description] || 0) + expense;
            }
        });
        return Object.entries(expenseTotals)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 7)
            .map(entry => entry[0]);
    }

    function processMonthlyData(data, topCategories) {
        const monthlyData = {};
        const topCategoriesSet = new Set(topCategories);

        data.forEach(row => {
            const parts = row.Fecha.split('/');
            if (parts.length !== 3) return;
            const monthKey = `${parts[2]}-${parts[1].padStart(2, '0')}`; // Formato YYYY-MM

            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = { income: 0, expensesByCategory: {} };
                topCategories.forEach(cat => monthlyData[monthKey].expensesByCategory[cat] = 0);
                monthlyData[monthKey].expensesByCategory['Otros Gastos'] = 0;
            }

            const income = cleanAndParseNumber(row.Crédito);
            if (income > 0) {
                monthlyData[monthKey].income += income;
            }

            const expense = Math.abs(cleanAndParseNumber(row.Débito));
            if (expense > 0) {
                const description = (row.Movimiento || 'Gasto').split('\n')[0].trim();
                if (topCategoriesSet.has(description)) {
                    monthlyData[monthKey].expensesByCategory[description] += expense;
                } else {
                    monthlyData[monthKey].expensesByCategory['Otros Gastos'] += expense;
                }
            }
        });
        return monthlyData;
    }

    function displayResults(totals) {
        const balance = totals.totalIncome - totals.totalExpenses;
        const formatCurrency = (amount) => amount.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });

        summaryElement.innerHTML = `
            <article><h4>Ingresos Totales</h4><p>${formatCurrency(totals.totalIncome)}</p></article>
            <article><h4>Gastos Totales</h4><p>${formatCurrency(totals.totalExpenses)}</p></article>
            <article><h4>Balance</h4><p><strong>${formatCurrency(balance)}</strong></p></article>
        `;
    }

    function createTopExpensesChart(data, topCategories) {
        if (topExpensesChart) {
            topExpensesChart.destroy();
        }

        const expenseData = topCategories.map(category => {
            return data.reduce((total, row) => {
                const description = (row.Movimiento || 'Gasto').split('\n')[0].trim();
                if (description === category) {
                    return total + Math.abs(cleanAndParseNumber(row.Débito));
                }
                return total;
            }, 0);
        });

        const ctx = topExpensesCanvas.getContext('2d');
        topExpensesChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: topCategories,
                datasets: [{
                    data: expenseData,
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF'],
                    borderColor: '#fff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom' },
                    title: { display: true, text: 'Top 7 Gastos', font: { size: 16 } }
                }
            }
        });
    }

    function createMonthlyChart(monthlyData, topCategories) {
        if (monthlyChart) {
            monthlyChart.destroy();
        }

        const sortedMonths = Object.keys(monthlyData).sort();
        const labels = sortedMonths.map(month => {
            const [year, m] = month.split('-');
            return new Date(year, m - 1).toLocaleString('es-AR', { month: 'short', year: 'numeric' });
        });
        
        const expenseColors = ['#FF6384', '#FF9F40', '#FFCE56', '#9966FF', '#C9CBCF', '#E7E9ED', '#7C83FD', '#A18276'];
        const allExpenseCategories = [...topCategories, 'Otros Gastos'];

        const datasets = [
            {
                label: 'Ingresos',
                data: sortedMonths.map(month => monthlyData[month].income),
                backgroundColor: '#4BC0C0',
                stack: 'income' // Grupo de apilado para ingresos
            },
            ...allExpenseCategories.map((category, index) => ({
                label: category,
                // IMPORTANTE: Mapeamos los gastos como valores negativos
                data: sortedMonths.map(month => -monthlyData[month].expensesByCategory[category]),
                backgroundColor: expenseColors[index % expenseColors.length],
                stack: 'expenses' // Grupo de apilado para gastos
            }))
        ];

        const ctx = monthlyCanvas.getContext('2d');
        monthlyChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                plugins: {
                    title: { display: true, text: 'Flujo Mensual por Categoría', font: { size: 16 } },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    // Mostramos el valor absoluto en el tooltip para fácil lectura
                                    label += Math.abs(context.parsed.y).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
                                }
                                return label;
                            }
                        }
                    }
                },
                responsive: true,
                scales: {
                    x: { stacked: true },
                    y: { stacked: true }
                }
            }
        });
    }
});