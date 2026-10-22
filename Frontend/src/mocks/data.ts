import type { CurrentUser, Role } from '@/services/auth'
import type { BoardMember, FeaturedCommunity, SpreadDimension } from '@/services/communities'
import type { Member } from '@/services/members'

/** In-memory data for the mock backend. Reset between tests with `resetMockData()`. */
const seed: Member[] = Array.from({ length: 23 }, (_, index) => ({
  id: `mem_${index + 1}`,
  name: `Anggota ${index + 1}`,
  email: `anggota${index + 1}@contoh.id`,
  status: index % 4 === 0 ? 'pending' : 'active',
  joinedAt: new Date(Date.UTC(2026, 0, index + 1)).toISOString()
}))

export const mockUsers: Record<Role, CurrentUser> = {
  admin: {
    id: 'usr_admin',
    name: 'Rina Pengurus',
    email: 'rina@contoh.id',
    role: 'admin',
    permissions: ['members.read', 'members.create', 'members.delete']
  },
  member: {
    id: 'usr_member',
    name: 'Budi Anggota',
    email: 'budi@contoh.id',
    role: 'member',
    permissions: ['members.read']
  }
}

export const mockDb = { members: structuredClone(seed) }

export function resetMockData() {
  mockDb.members = structuredClone(seed)
}

/** The curated communities shown on the landing page (from the V4 prototype directory). */
export const featuredCommunities: FeaturedCommunity[] = [
  {
    slug: 'forpastara',
    name: 'Forum Paskibra Tarumajaya',
    alias: 'Forpastara',
    type: 'Himpunan',
    location: 'Kabupaten Bekasi, Jawa Barat',
    description: 'Yukk Kakak, Akang, Teteh semua, kita gabung di Komunitas Forpastara',
    memberCount: 22,
    verified: true,
    logoUrl: '/images/communities/forpastara.jpg',
    memberInitials: ['RS', 'BP', 'AL']
  },
  {
    slug: 'ika-tik-pnj',
    name: 'Ikatan Alumni PNJ (UI) Teknik Informatika dan Komputer',
    alias: 'IKA TIK PNJ',
    type: 'Ikatan Alumni',
    location: 'Indonesia',
    description: 'Alumni PNJ(UI) TIK, silakan gabung 👩🏻‍💻🧑🏻‍💻',
    memberCount: 9,
    verified: false,
    logoUrl: '/images/communities/iapnj.jpg',
    memberInitials: ['DW', 'HP', 'SN']
  },
  {
    slug: 'sman52',
    name: 'Ikatan Alumni SMAN 52',
    alias: null,
    type: 'Ikatan Alumni',
    location: 'Jakarta Utara, DKI Jakarta',
    description: 'Alumni SMAN 52 Jakarta, yuk gabung. 🏫',
    memberCount: 86,
    verified: true,
    logoUrl: '/images/communities/iasman52.jpg',
    memberInitials: ['FN', 'TA', 'RM']
  },
  {
    slug: 'ppiju',
    name: 'Purna Paskibraka Indonesia Jakarta Utara',
    alias: 'PPI Jakut',
    type: 'Organisasi',
    location: 'Jakarta Utara, DKI Jakarta',
    description: 'Ayo gabung ke PPIJU, Kakak-Kakak.. 🫡',
    memberCount: 20,
    verified: false,
    logoUrl: '/images/communities/ppiju.jpg',
    memberInitials: ['YA', 'NK', 'BS']
  }
]

interface CommunityDetails {
  /** The full board as the community entered it; the handler applies the Esensial rule. */
  board: BoardMember[]
  cohortRange: { from: number; to: number } | null
  spread: SpreadDimension[]
}

const photo = (name: string) => `/images/people/${name}.jpg`

/**
 * Profile details per slug (prototype DATA in 50-js-layar-komunitas), scaled so every
 * dimension sums to the card's member count. Photos are the AI personas only.
 */
export const communityDetails: Record<string, CommunityDetails> = {
  forpastara: {
    board: [
      { name: 'Ayu Lestari', role: 'Ketua', photoUrl: photo('ayu') },
      { name: 'Rizal Hakim', role: 'Sekretaris', photoUrl: null }
    ],
    cohortRange: { from: 2009, to: 2023 },
    spread: [
      {
        dimension: 'occupation',
        buckets: [
          { label: 'Pelajar & mahasiswa', count: 6 },
          { label: 'Karyawan swasta', count: 5 },
          { label: 'Wiraswasta', count: 4 },
          { label: 'PNS', count: 3 },
          { label: 'Apoteker', count: 2 }
        ],
        otherCount: 2
      },
      {
        dimension: 'education',
        buckets: [
          { label: 'Sarjana (S1)', count: 11 },
          { label: 'SMA / SMK sederajat', count: 6 },
          { label: 'Diploma (D1–D4)', count: 3 },
          { label: 'Magister (S2)', count: 2 }
        ],
        otherCount: 0
      },
      {
        dimension: 'domicile',
        buckets: [
          { label: 'Kab. Bekasi', count: 9 },
          { label: 'Kota Bekasi', count: 6 },
          { label: 'Jakarta Timur', count: 3 },
          { label: 'Depok', count: 2 }
        ],
        otherCount: 2
      }
    ]
  },
  'ika-tik-pnj': {
    board: [{ name: 'Rani Setiawati', role: 'Ketua', photoUrl: photo('rani') }],
    cohortRange: { from: 2011, to: 2021 },
    spread: [
      {
        dimension: 'occupation',
        buckets: [
          { label: 'Software engineer', count: 4 },
          { label: 'Data analyst', count: 2 },
          { label: 'Desainer produk', count: 1 },
          { label: 'Dosen', count: 1 },
          { label: 'Wiraswasta', count: 1 }
        ],
        otherCount: 0
      },
      {
        dimension: 'education',
        buckets: [
          { label: 'Sarjana (S1)', count: 5 },
          { label: 'Diploma (D1–D4)', count: 2 },
          { label: 'Magister (S2)', count: 2 }
        ],
        otherCount: 0
      },
      {
        dimension: 'domicile',
        buckets: [
          { label: 'Depok', count: 4 },
          { label: 'Jakarta Selatan', count: 3 },
          { label: 'Bandung', count: 1 }
        ],
        otherCount: 1
      }
    ]
  },
  sman52: {
    board: [
      { name: 'Fajar Nugroho', role: 'Ketua', photoUrl: photo('fajar') },
      { name: 'Rani Setiawati', role: 'Bendahara', photoUrl: photo('rani') }
    ],
    cohortRange: { from: 1999, to: 2016 },
    spread: [
      {
        dimension: 'occupation',
        buckets: [
          { label: 'Karyawan swasta', count: 28 },
          { label: 'Wiraswasta', count: 14 },
          { label: 'Guru', count: 10 },
          { label: 'PNS', count: 8 },
          { label: 'Kontraktor', count: 6 },
          { label: 'Desainer produk', count: 5 },
          { label: 'Apoteker', count: 4 }
        ],
        otherCount: 11
      },
      {
        dimension: 'education',
        buckets: [
          { label: 'Sarjana (S1)', count: 43 },
          { label: 'Magister (S2)', count: 15 },
          { label: 'SMA / SMK sederajat', count: 15 },
          { label: 'Diploma (D1–D4)', count: 13 }
        ],
        otherCount: 0
      },
      {
        dimension: 'domicile',
        buckets: [
          { label: 'Jakarta Utara', count: 41 },
          { label: 'Jakarta Selatan', count: 12 },
          { label: 'Bekasi', count: 11 },
          { label: 'Depok', count: 8 },
          { label: 'Jakarta Timur', count: 6 }
        ],
        otherCount: 8
      }
    ]
  },
  ppiju: {
    board: [
      { name: 'Dedi Kurniawan', role: 'Ketua', photoUrl: null },
      { name: 'Ayu Lestari', role: 'Humas', photoUrl: photo('ayu') }
    ],
    cohortRange: { from: 2015, to: 2022 },
    spread: [
      {
        dimension: 'occupation',
        buckets: [
          { label: 'Karyawan swasta', count: 7 },
          { label: 'Pelajar & mahasiswa', count: 4 },
          { label: 'PNS', count: 3 },
          { label: 'TNI/Polri', count: 3 },
          { label: 'Wiraswasta', count: 2 }
        ],
        otherCount: 1
      },
      {
        dimension: 'education',
        buckets: [
          { label: 'Sarjana (S1)', count: 8 },
          { label: 'SMA / SMK sederajat', count: 8 },
          { label: 'Diploma (D1–D4)', count: 3 },
          { label: 'Magister (S2)', count: 1 }
        ],
        otherCount: 0
      },
      {
        dimension: 'domicile',
        buckets: [
          { label: 'Jakarta Utara', count: 14 },
          { label: 'Jakarta Pusat', count: 3 },
          { label: 'Bekasi', count: 2 }
        ],
        otherCount: 1
      }
    ]
  }
}
