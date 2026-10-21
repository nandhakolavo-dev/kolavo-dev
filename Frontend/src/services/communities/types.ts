export type CommunityType = 'Organisasi' | 'Asosiasi' | 'Ikatan Alumni' | 'Himpunan'

/** `GET /communities/featured`: public card data, never member names or contacts. */
export interface FeaturedCommunity {
  slug: string
  name: string
  /** Short name the community goes by, e.g. "Forpastara". */
  alias: string | null
  type: CommunityType
  /** Human-readable, e.g. "Kabupaten Bekasi, Jawa Barat". */
  location: string
  description: string
  memberCount: number
  /** Paid (Advance) communities show the verified badge. */
  verified: boolean
  logoUrl: string
  /** Up to three members' initials for the avatar stack. */
  memberInitials: string[]
}

export interface BoardMember {
  name: string
  /** "Ketua", "Sekretaris"… Esensial communities show only their creator as "Community Creator". */
  role: string
  photoUrl: string | null
}

export type SpreadDimensionKey = 'occupation' | 'education' | 'domicile'

/** Member counts per value of one profile field. Never names. */
export interface SpreadDimension {
  dimension: SpreadDimensionKey
  /** Sorted by count, descending. */
  buckets: { label: string; count: number }[]
  /** Members in values too small to list ("Lainnya"). */
  otherCount: number
}

/** `GET /communities/{slug}` (DRAFT): the public profile at `/k/<slug>`. Never member names or contacts. */
export interface CommunityProfile extends Omit<FeaturedCommunity, 'memberInitials'> {
  board: BoardMember[]
  cohortRange: { from: number; to: number } | null
  spread: SpreadDimension[]
}
