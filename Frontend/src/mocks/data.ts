import type { CurrentUser, Role } from '@/services/auth'
import type { FeaturedCommunity } from '@/services/communities'
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
