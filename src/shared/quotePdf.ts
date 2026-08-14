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
  return value
    .trim()
    .replace(/[^\w\s-]+/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 40) || 'Client'
}

export async function exportQuotePdf(draft: QuoteDraft, settings: QuoteSettings): Promise<void> {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' }) as DocWithAutoTable
  const pageW = doc.internal.pageSize.getWidth()
  const margin = 16
  let y = 14

  const logo = await loadLogoDataUrl()
  if (logo) {
    try {
      doc.addImage(logo, 'PNG', margin, y, 42, 17)
    } catch {
      // fall through to text letterhead
    }
  }

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.setTextColor(44, 123, 184)
  doc.text(SITE_NAME, pageW - margin, y + 6, { align: 'right' })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(58, 58, 58)
  const rightMeta = [
    FOUNDER,
    PHONE_DISPLAY,
    AREA,
    SITE_URL.replace(/^https?:\/\//, ''),
  ]
  if (settings.businessEmail.trim()) rightMeta.push(settings.businessEmail.trim())
  if (settings.gstNumber.trim()) rightMeta.push(`GST ${settings.gstNumber.trim()}`)
  doc.text(rightMeta, pageW - margin, y + 12, { align: 'right' })

  y = 38
  doc.setDrawColor(184, 217, 74)
  doc.setLineWidth(0.8)
  doc.line(margin, y, pageW - margin, y)
  doc.setDrawColor(62, 200, 200)
  doc.line(margin, y + 1.2, pageW - margin, y + 1.2)
  doc.setDrawColor(44, 123, 184)
  doc.line(margin, y + 2.4, pageW - margin, y + 2.4)

  y = 48
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.setTextColor(47, 47, 47)
  doc.text('Quote', margin, y)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(58, 58, 58)
  doc.text(`Quote no. ${draft.quoteNumber}`, pageW - margin, y, { align: 'right' })
  doc.text(`Date ${draft.quoteDate}`, pageW - margin, y + 6, { align: 'right' })
  if (settings.validityDays > 0) {
    doc.text(`Valid ${settings.validityDays} days`, pageW - margin, y + 12, { align: 'right' })
  }

  y += 10
  if (draft.title.trim()) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text(draft.title.trim(), margin, y)
    y += 8
  }

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.text('Prepared for', margin, y)
  y += 5
  doc.setFont('helvetica', 'normal')
  const clientLines = [
    draft.client.name.trim() || '—',
    draft.client.phone.trim(),
    draft.client.email.trim(),
    draft.client.address.trim(),
  ].filter(Boolean)
  for (const line of clientLines) {
    doc.text(line, margin, y)
    y += 5
  }

  y += 4
  const body = draft.lines.map((line) => [
    line.description,
    unitLabel(line.unit),
    String(line.qty),
    formatMoney(line.unitPrice),
    formatMoney(lineTotal(line)),
  ])

  autoTable(doc, {
    startY: y,
    head: [['Description', 'Unit', 'Qty', 'Rate', 'Amount']],
    body: body.length
      ? body
      : [['No line items', '—', '—', '—', formatMoney(0)]],
    margin: { left: margin, right: margin },
    styles: {
      font: 'helvetica',
      fontSize: 9,
      textColor: [58, 58, 58],
      cellPadding: 2.2,
    },
    headStyles: {
      fillColor: [44, 123, 184],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    columnStyles: {
      1: { halign: 'center', cellWidth: 18 },
      2: { halign: 'right', cellWidth: 16 },
      3: { halign: 'right', cellWidth: 28 },
      4: { halign: 'right', cellWidth: 30 },
    },
  })

  y = (doc.lastAutoTable?.finalY ?? y) + 8
  const subtotal = quoteSubtotal(draft.lines)
  const gst = quoteGst(subtotal, draft.includeGst)
  const total = quoteGrandTotal(draft.lines, draft.includeGst)

  const totalsX = pageW - margin
  const labelX = totalsX - 55
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Subtotal', labelX, y)
  doc.text(formatMoney(subtotal), totalsX, y, { align: 'right' })
  y += 6
  if (draft.includeGst) {
    doc.text('GST (15%)', labelX, y)
    doc.text(formatMoney(gst), totalsX, y, { align: 'right' })
    y += 6
  }
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text(draft.includeGst ? 'Total (incl. GST)' : 'Total', labelX, y)
  doc.text(formatMoney(total), totalsX, y, { align: 'right' })

  y += 12
  if (draft.notes.trim()) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.text('Notes', margin, y)
    y += 5
    doc.setFont('helvetica', 'normal')
    const notes = doc.splitTextToSize(draft.notes.trim(), pageW - margin * 2)
    doc.text(notes, margin, y)
    y += notes.length * 5 + 4
  }

  const footerBits: string[] = []
  if (settings.bankDetails.trim()) footerBits.push(`Payment: ${settings.bankDetails.trim()}`)
  if (settings.paymentNotes.trim()) footerBits.push(settings.paymentNotes.trim())
  if (footerBits.length) {
    if (y > 260) {
      doc.addPage()
      y = 20
    }
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(107, 107, 107)
    for (const bit of footerBits) {
      const lines = doc.splitTextToSize(bit, pageW - margin * 2)
      doc.text(lines, margin, y)
      y += lines.length * 4 + 2
    }
  }

  const name = safeFilenamePart(draft.client.name || draft.title || 'Client')
  doc.save(`Borrelli-Quote-${name}-${draft.quoteDate}.pdf`)
}
