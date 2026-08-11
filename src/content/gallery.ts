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

export interface BeforeAfterPair {
  title: string
  before: GalleryImage
  after: GalleryImage
}

export const WINDOW_PAIRS: BeforeAfterPair[] = [
  {
    title: 'Leadlight sash',
    before: {
      src: asset('images/gallery/exteriors/window-before.jpg'),
      alt: 'Weathered wooden leadlight window with peeling paint and failed putty',
      caption: 'Before',
    },
    after: {
      src: asset('images/gallery/exteriors/window-after.jpg'),
      alt: 'Restored leadlight sash in fresh white, still opening cleanly',
      caption: 'After',
    },
  },
  {
    title: 'Awning pair',
    before: {
      src: asset('images/gallery/exteriors/stuccowindow-before.jpg'),
      alt: 'Two-pane wooden awning window with flaking blue and clay paint',
      caption: 'Before',
    },
    after: {
      src: asset('images/gallery/exteriors/stuccowindow-after.jpg'),
      alt: 'Same awning window cut in clean white against fresh stucco',
      caption: 'After',
    },
  },
  {
    title: 'Elevation',
    before: {
      src: asset('images/gallery/exteriors/stuccowall-before.jpg'),
      alt: 'Yellow stucco wall with three weathered wooden windows before repair',
      caption: 'Before',
    },
    after: {
      src: asset('images/gallery/exteriors/stuccowall-after.jpg'),
      alt: 'Same elevation in light grey stucco with three restored white windows',
      caption: 'After',
    },
  },
]

export const WINDOW_STEPS = [
  {
    title: 'Scrape and sand',
    text: 'Failed coats come off the sash, sill, and frame so the next layers have something sound to hold.',
  },
  {
    title: 'Timber, putty, hardware',
    text: 'Soft wood, cracked putty, and tired stays get repaired so the window still opens and weathers.',
  },
  {
    title: 'Prime and build',
    text: 'A proper primer, then the finish coats — not a slap of enamel over loose paint.',
  },
  {
    title: 'Cut in the sash',
    text: 'Sharp lines on the stucco, clean arrises on the timber, and a sash that is not painted shut.',
  },
]
