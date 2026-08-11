import { asset } from './site'

export interface GalleryImage {
  src: string
  alt: string
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
    blurb: 'Weatherboards, trim, and full house colour — finished work around Golden Bay.',
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
    ],
  },
  {
    id: 'interiors',
    title: 'Interiors',
    blurb: 'Walls, ceilings, and clean indoor finishes. More job photos coming.',
    folder: 'images/gallery/interiors/',
    images: [
      {
        src: asset('images/gallery/interiors/interior-roller.jpg'),
        alt: 'Interior wall being painted with a roller',
      },
    ],
  },
  {
    id: 'on-the-job',
    title: 'On the job',
    blurb: 'Mid-job weatherboards and site work. Add Facebook series here next.',
    folder: 'images/gallery/on-the-job/',
    images: [
      {
        src: asset('images/gallery/on-the-job/weatherboards.jpg'),
        alt: 'Exterior weatherboards mid-paint',
      },
    ],
  },
]
