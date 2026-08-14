import { AREA, FOUNDER, PHONE_DISPLAY, SITE_NAME, SITE_URL } from '../content/site'
import {
  formatPaintBracket,
  paintTypeById,
  undercoatById,
  type PaintEstimate,
  type PaintSetting,
} from './paintingQuote'

export function ballparkTitle(setting: PaintSetting): string {
  return setting === 'indoor' ? 'Indoor walls & ceilings' : 'Exterior surfaces & roof'
}

export function formatBallparkText(estimate: PaintEstimate): string {
  const paint = paintTypeById(estimate.paintTypeId)?.name ?? estimate.paintTypeId
  const undercoat =
    estimate.undercoatId === 'none'
      ? 'No undercoat'
      : (undercoatById(estimate.undercoatId)?.name ?? estimate.undercoatId)

  const lines = [
    `${SITE_NAME} — Ballpark estimate`,
    '(Impression only — not a confirmed quote or booking.)',
    '',
    ballparkTitle(estimate.setting),
    `Date: ${new Date().toLocaleDateString('en-NZ')}`,
    '',
    'Surfaces',
    ...estimate.lines.map(
      (line) =>
        `• ${line.label}: ${line.paintableM2} m²` +
        (line.measuredM2 !== line.paintableM2 ? ` (${line.measuredM2} m² measured)` : ''),
    ),
    '',
    `Paint system: ${paint}`,
    `Undercoat: ${undercoat}`,
    `Measured area: ${estimate.measuredM2} m²`,
    `Paintable area: ${estimate.paintableM2} m²`,
    '',
    `Labour: $${estimate.labour.toFixed(2)}`,
    `Materials: $${estimate.materials.toFixed(2)}`,
    `Setup: $${estimate.setupFee.toFixed(2)}`,
    `Travel (Golden Bay): $${estimate.travelFee.toFixed(2)}`,
  ]

  if (estimate.outdoorSurcharge > 0) {
    lines.push(`Exterior surcharge: $${estimate.outdoorSurcharge.toFixed(2)}`)
  }
  if (estimate.roofAccessFee > 0) {
    lines.push(`Roof access: $${estimate.roofAccessFee.toFixed(2)}`)
  }

  lines.push(
    '',
    `Estimated cost: ${formatPaintBracket(estimate)}`,
    '',
    'Luca confirms the real number on site.',
    `${FOUNDER} · ${PHONE_DISPLAY}`,
    `${AREA}`,
    SITE_URL,
  )

  return lines.join('\n')
}

export async function copyBallparkText(estimate: PaintEstimate): Promise<boolean> {
  const text = formatBallparkText(estimate)
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.setAttribute('readonly', '')
      ta.style.position = 'fixed'
      ta.style.left = '-9999px'
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(ta)
      return ok
    } catch {
      return false
    }
  }
}
