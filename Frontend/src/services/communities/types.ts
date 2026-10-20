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
