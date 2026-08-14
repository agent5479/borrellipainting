import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import {
  AREA,
  FOUNDER,
  PHONE_DISPLAY,
  SITE_NAME,
  SITE_URL,
  asset,
} from '../content/site'
import {
  formatMoney,
  lineTotal,
  quoteGrandTotal,
  quoteGst,
  quoteSubtotal,
  unitLabel,
  type QuoteDraft,
  type QuoteSettings,
} from './quoteDraft'

type DocWithAutoTable = jsPDF & {
  lastAutoTable?: { finalY: number }
}

async function loadLogoDataUrl(): Promise<string | null> {
  try {
    const res = await fetch(asset('images/brand-logo.png'))
    if (!res.ok) return null
    const blob = await res.blob()
    return await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : null)
      reader.onerror = () => reject(reader.error)
      reader.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}

function safeFilenamePart(value: string): string {
  return (
    value
      .trim()
      .replace(/[^\w\s-]+/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 40) || 'Client'
  )
}

function formatNzDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00`)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-NZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/** Traditional quote / tax-invoice style PDF for staff use. */
export async function exportQuotePdf(draft: QuoteDraft, settings: QuoteSettings): Promise<void> {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' }) as DocWithAutoTable
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const margin = 15
  const contentW = pageW - margin * 2
  let y = 12

  const ink: [number, number, number] = [40, 40, 40]
  const soft: [number, number, number] = [100, 100, 100]
  const rule: [number, number, number] = [180, 180, 180]
  const brand: [number, number, number] = [44, 123, 184]

  const logo = await loadLogoDataUrl()
  if (logo) {
    try {
      doc.addImage(logo, 'PNG', margin, y, 40, 16)
    } catch {
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(14)
      doc.setTextColor(...brand)
      doc.text(SITE_NAME, margin, y + 8)
    }
  } else {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.setTextColor(...brand)
    doc.text(SITE_NAME, margin, y + 8)
  }

  const isInvoice = draft.docKind === 'invoice'
  const docTitle = isInvoice ? 'TAX INVOICE' : 'QUOTE'
  const docLabel = isInvoice ? 'Invoice' : 'Quote'
  const boxW = 58
  const boxX = pageW - margin - boxW
  doc.setDrawColor(...rule)
  doc.setLineWidth(0.35)
  doc.setFillColor(250, 250, 248)
  doc.rect(boxX, y, boxW, 28, 'FD')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(isInvoice ? 13 : 16)
  doc.setTextColor(...ink)
  doc.text(docTitle, boxX + boxW / 2, y + 10, { align: 'center' })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(...soft)
  doc.text(`No. ${draft.quoteNumber}`, boxX + boxW / 2, y + 17, { align: 'center' })
  doc.text(formatNzDate(draft.quoteDate), boxX + boxW / 2, y + 23, { align: 'center' })

  // From block under logo
  y = 32
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(...ink)
  doc.text(SITE_NAME, margin, y)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(...soft)
  const fromLines = [FOUNDER, PHONE_DISPLAY, AREA, SITE_URL.replace(/^https?:\/\//, '')]
  if (settings.businessEmail.trim()) fromLines.push(settings.businessEmail.trim())
  if (settings.gstNumber.trim()) fromLines.push(`GST ${settings.gstNumber.trim()}`)
  let fromY = y + 4.5
  for (const line of fromLines) {
    doc.text(line, margin, fromY)
    fromY += 3.8
  }

  y = Math.max(fromY, y + 28) + 4
  doc.setDrawColor(...ink)
  doc.setLineWidth(0.5)
  doc.line(margin, y, pageW - margin, y)
  y += 8

  // Bill to / job meta
  const colMid = margin + contentW / 2 + 4
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(...soft)
  doc.text('BILL TO', margin, y)
  doc.text('JOB', colMid, y)
  y += 5
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(...ink)

  const billLines = [
    draft.client.name.trim() || '—',
    draft.client.address.trim(),
    draft.client.phone.trim(),
    draft.client.email.trim(),
  ].filter(Boolean)

  let leftY = y
  doc.setFont('helvetica', 'bold')
  doc.text(billLines[0] ?? '—', margin, leftY)
  leftY += 5
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  for (const line of billLines.slice(1)) {
    doc.text(line, margin, leftY)
    leftY += 4.5
  }

  let rightY = y
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.text(draft.title.trim() || 'Painting works', colMid, rightY)
  rightY += 5
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  if (!isInvoice && settings.validityDays > 0) {
    doc.text(`Valid for ${settings.validityDays} days`, colMid, rightY)
    rightY += 4.5
  }
  if (!isInvoice) {
    doc.text('Estimate — may vary by up to 20%', colMid, rightY)
    rightY += 4.5
  }
  doc.text(draft.includeGst ? 'Amounts excl. GST unless noted' : 'GST not included', colMid, rightY)
  rightY += 4.5

  y = Math.max(leftY, rightY) + 6

  // Line items table — classic invoice grid
  const body = draft.lines.map((line, index) => [
    String(index + 1),
    line.description,
    unitLabel(line.unit),
    String(line.qty),
    formatMoney(line.unitPrice),
    formatMoney(lineTotal(line)),
  ])

  autoTable(doc, {
    startY: y,
    head: [['#', 'Description', 'Unit', 'Qty', 'Rate', 'Amount']],
    body: body.length
      ? body
      : [['—', 'No line items', '—', '—', '—', formatMoney(0)]],
    margin: { left: margin, right: margin },
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 9,
      textColor: ink,
      lineColor: rule,
      lineWidth: 0.2,
      cellPadding: 2.4,
      valign: 'middle',
    },
    headStyles: {
      fillColor: [245, 245, 243],
      textColor: ink,
      fontStyle: 'bold',
      lineColor: rule,
      lineWidth: 0.25,
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      2: { cellWidth: 16, halign: 'center' },
      3: { cellWidth: 16, halign: 'right' },
      4: { cellWidth: 28, halign: 'right' },
      5: { cellWidth: 30, halign: 'right' },
    },
  })

  y = (doc.lastAutoTable?.finalY ?? y) + 6

  const subtotal = quoteSubtotal(draft.lines)
  const gst = quoteGst(subtotal, draft.includeGst)
  const total = quoteGrandTotal(draft.lines, draft.includeGst)

  // Totals box — classic invoice right column
  const totalsW = 72
  const totalsX = pageW - margin - totalsW
  const rowH = 7
  const rows: { label: string; value: string; bold?: boolean; fill?: boolean }[] = [
    { label: 'Subtotal', value: formatMoney(subtotal) },
  ]
  if (draft.includeGst) {
    rows.push({ label: 'GST (15%)', value: formatMoney(gst) })
  }
  rows.push({
    label: draft.includeGst ? 'Total (incl. GST)' : 'Total',
    value: formatMoney(total),
    bold: true,
    fill: true,
  })

  const boxH = rows.length * rowH + 2
  doc.setDrawColor(...rule)
  doc.setLineWidth(0.3)
  doc.rect(totalsX, y, totalsW, boxH)

  let ty = y + 5
  for (const row of rows) {
    if (row.fill) {
      doc.setFillColor(245, 245, 243)
      doc.rect(totalsX, ty - 4.5, totalsW, rowH, 'F')
      doc.setDrawColor(...rule)
      doc.rect(totalsX, y, totalsW, boxH)
    }
    doc.setFont('helvetica', row.bold ? 'bold' : 'normal')
    doc.setFontSize(row.bold ? 10 : 9)
    doc.setTextColor(...ink)
    doc.text(row.label, totalsX + 3, ty)
    doc.text(row.value, totalsX + totalsW - 3, ty, { align: 'right' })
    ty += rowH
  }

  y = Math.max(y + boxH + 10, y + 10)

  if (draft.notes.trim()) {
    if (y > pageH - 50) {
      doc.addPage()
      y = margin
    }
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(...soft)
    doc.text('NOTES / SCOPE', margin, y)
    y += 5
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(...ink)
    const notes = doc.splitTextToSize(draft.notes.trim(), contentW)
    doc.text(notes, margin, y)
    y += notes.length * 4.2 + 6
  }

  const terms: string[] = []
  if (isInvoice) {
    terms.push('This is a tax invoice for the amount due.')
  } else {
    terms.push(
      'This is a quote, not a final invoice. Figures are estimates and may vary by up to 20% once the job is confirmed on site.',
    )
    if (settings.validityDays > 0) {
      terms.push(`This quote is valid for ${settings.validityDays} days from the date above.`)
    }
  }
  if (settings.bankDetails.trim()) {
    terms.push(`Payment details: ${settings.bankDetails.trim()}`)
  }
  if (settings.paymentNotes.trim()) {
    terms.push(settings.paymentNotes.trim())
  }
  if (!terms.length) {
    terms.push('Thank you for considering Borrelli Painting.')
  }

  if (y > pageH - 40) {
    doc.addPage()
    y = margin
  }

  doc.setDrawColor(...rule)
  doc.setLineWidth(0.25)
  doc.line(margin, y, pageW - margin, y)
  y += 6
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(...soft)
  doc.text('TERMS', margin, y)
  y += 4.5
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  for (const term of terms) {
    const wrapped = doc.splitTextToSize(term, contentW)
    doc.text(wrapped, margin, y)
    y += wrapped.length * 3.6 + 1.5
  }

  // Footer page numbers
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(...soft)
    doc.text(
      `${SITE_NAME} · ${docLabel} ${draft.quoteNumber} · Page ${i} of ${pageCount}`,
      pageW / 2,
      pageH - 8,
      { align: 'center' },
    )
  }

  const name = safeFilenamePart(draft.client.name || draft.title || 'Client')
  const kindFile = isInvoice ? 'Invoice' : 'Quote'
  doc.save(`Borrelli-${kindFile}-${name}-${draft.quoteDate}.pdf`)
}
