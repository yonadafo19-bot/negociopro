import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx'

export const exportToPDF = (data, options = {}) => {
  const { title = 'Reporte', fileName = 'reporte', columns = [] } = options

  const doc = new jsPDF()

  // Title
  doc.setFontSize(18)
  doc.text(title, 14, 20)

  // Date
  doc.setFontSize(10)
  doc.text('Generado: ' + new Date().toLocaleDateString('es-CL'), 14, 28)

  // Table
  if (data.length > 0 && columns.length > 0) {
    doc.autoTable({
      startY: 35,
      head: [columns.map(col => col.header)],
      body: data.map(row => columns.map(col => row[col.field])),
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [99, 102, 241],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    })
  }

  // Save
  const finalFileName = fileName + '_' + Date.now() + '.pdf'
  doc.save(finalFileName)
}

export const exportToExcel = (data, options = {}) => {
  const { sheetName = 'Datos', fileName = 'datos', columns = [] } = options

  // Create worksheet
  const wsData = []

  // Headers
  if (columns.length > 0) {
    wsData.push(columns.map(col => col.header))
  }

  // Data
  data.forEach(row => {
    if (columns.length > 0) {
      wsData.push(columns.map(col => row[col.field]))
    } else {
      wsData.push(Object.values(row))
    }
  })

  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.aoa_to_sheet(wsData)
  XLSX.utils.book_append_sheet(wb, ws, sheetName)

  // Save
  const finalFileName = fileName + '_' + Date.now() + '.xlsx'
  XLSX.writeFile(wb, finalFileName)
}

export default { exportToPDF, exportToExcel }
