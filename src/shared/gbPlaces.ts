export interface GbPlace {
  id: string
  name: string
}

export const GB_PLACES: GbPlace[] = [
  { id: 'takaka', name: 'Tākaka town' },
  { id: 'pohara', name: 'Pōhara Beach' },
  { id: 'collingwood', name: 'Collingwood' },
  { id: 'waitapu', name: 'Waitapu Bridge' },
  { id: 'tata', name: 'Tata Beach' },
  { id: 'airport', name: 'Tākaka Aerodrome' },
  { id: 'patons', name: "Patons Rock" },
]

export function placeById(id: string): GbPlace | undefined {
  return GB_PLACES.find((p) => p.id === id)
}
