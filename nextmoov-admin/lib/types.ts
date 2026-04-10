export type Athlete = {
  id: string
  created_at: string
  name: string
  sport: string
  position: string | null
  school_origin: string | null
  university_us: string | null
  state_us: string | null
  season: string | null
  bio: string | null
  photo_url: string | null
  is_featured: boolean
  instagram_url: string | null
}

export type Testimonial = {
  id: string
  created_at: string
  athlete_name: string
  sport: string
  quote: string
  rating: number
  photo_url: string | null
  university_us: string | null
  season: string | null
  is_featured: boolean
}

export type ShowcaseEvent = {
  id: string
  created_at: string
  title: string
  location: string
  event_date: string
  description: string | null
  sports: string[]
  capacity: number | null
  registration_url: string | null
  photo_url: string | null
  is_published: boolean
}

export type SocialPost = {
  id: string
  created_at: string
  platform: 'instagram' | 'tiktok' | 'youtube' | 'twitter'
  post_url: string
  caption: string | null
  thumbnail_url: string | null
  is_featured: boolean
  published_at: string | null
}
