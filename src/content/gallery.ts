import { asset } from './site'

export interface GalleryImage {
  src: string
  alt: string
  caption?: string
}

export interface GalleryTheme {
  id: string
  title: string
  blurb: string
  /** Drop more files into public/images/gallery/<id>/ then add them here. */
  folder: string
  images: GalleryImage[]
}

export const GALLERY_THEMES: GalleryTheme[] = [
  {
    id: 'exteriors',
    title: 'Exteriors',
    blurb: 'Weatherboards, trim, stucco, and full house colour around Golden Bay.',
    folder: 'images/gallery/exteriors/',
    images: [
      {
        src: asset('images/gallery/exteriors/painted-house.jpg'),
        alt: 'Blue weatherboard house with white trim and an orange door, Golden Bay',
      },
      {
        src: asset('images/gallery/exteriors/painted-steeple-house.jpg'),
        alt: 'Cream character home with turret and terracotta roofs after exterior painting',
      },
      {
        src: asset('images/gallery/exteriors/house-before.jpg'),
        alt: 'Two-storey weatherboard house mid-job, painter on a ladder',
        caption: 'Before',
      },
      {
        src: asset('images/gallery/exteriors/house-after.jpg'),
        alt: 'Same house finished in bright white with charcoal trim',
        caption: 'After',
      },
      {
        src: asset('images/gallery/exteriors/stucco-before.jpg'),
        alt: 'Stucco wall before painting',
        caption: 'Before',
      },
      {
        src: asset('images/gallery/exteriors/stucco-after.jpg'),
        alt: 'Stucco wall after painting',
        caption: 'After',
      },
      {
        src: asset('images/gallery/exteriors/stuccowindow-before.jpg'),
        alt: 'Stucco and window before painting',
        caption: 'Before',
      },
      {
        src: asset('images/gallery/exteriors/stuccowindow-after.jpg'),
        alt: 'Stucco and window after painting',
        caption: 'After',
      },
      {
        src: asset('images/gallery/exteriors/window-before.jpg'),
        alt: 'Window and trim before painting',
        caption: 'Before',
      },
      {
        src: asset('images/gallery/exteriors/window-after.jpg'),
        alt: 'Window and trim after painting',
        caption: 'After',
      },
    ],
  },
  {
    id: 'interiors',
    title: 'Interiors',
    blurb: 'Walls, ceilings, and clean indoor finishes.',
    folder: 'images/gallery/interiors/',
    images: [
      {
        src: asset('images/gallery/interiors/interior-roller.jpg'),
        alt: 'Interior wall being painted with a roller',
      },
      {
        src: asset('images/gallery/interiors/room-before.jpg'),
        alt: 'Vaulted room with purple walls being painted, scaffold and extension pole',
        caption: 'Before',
      },
      {
        src: asset('images/gallery/interiors/room-after.jpg'),
        alt: 'Same room finished in white with dark timber ceiling beams',
        caption: 'After',
      },
      {
        src: asset('images/gallery/interiors/wall-before.jpg'),
        alt: 'Interior wall before painting',
        caption: 'Before',
      },
      {
        src: asset('images/gallery/interiors/wall-after.jpg'),
        alt: 'Interior wall after painting',
        caption: 'After',
      },
    ],
  },
  {
    id: 'on-the-job',
    title: 'On the job',
    blurb: 'Mid-job weatherboards and site work. More Facebook series can land here.',
    folder: 'images/gallery/on-the-job/',
    images: [
      {
        src: asset('images/gallery/on-the-job/weatherboards.jpg'),
        alt: 'Exterior weatherboards mid-paint',
      },
    ],
  },
]
