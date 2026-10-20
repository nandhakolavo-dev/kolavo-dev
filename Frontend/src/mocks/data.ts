import type { CurrentUser, Role } from '@/services/auth'
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
