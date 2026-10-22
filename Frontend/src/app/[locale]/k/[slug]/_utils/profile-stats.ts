import type { CommunityProfile, SpreadDimension, SpreadDimensionKey } from '@/services/communities'

/** A count shown as "N" or "N+" when some members fall into the unlisted "Lainnya" bucket. */
export interface StatCount {
  count: number
  isAtLeast: boolean
}

export interface ProfileStats {
  members: number
  cities: StatCount | null
  occupations: StatCount | null
  /** "2009–2016", or the single year when every member shares it. */
  cohort: string | null
}

export interface SpreadRow {
  label: string
  count: number
  /** Bar width, 0–100, relative to the community's member count. */
  percent: number
  isOther: boolean
}

/** Rows above this fold behind "Tampilkan N lainnya" (prototype BARIS_AGG). */
export const VISIBLE_SPREAD_ROWS = 5

const findDimension = (spread: SpreadDimension[], key: SpreadDimensionKey) =>
  spread.find(dimension => dimension.dimension === key)

function countOf(dimension: SpreadDimension | undefined): StatCount | null {
  if (!dimension || dimension.buckets.length === 0) return null
  return { count: dimension.buckets.length, isAtLeast: dimension.otherCount > 0 }
}

/** The four numbers under the header (prototype `#komStat`). */
export function profileStats(
  profile: Pick<CommunityProfile, 'memberCount' | 'spread' | 'cohortRange'>
): ProfileStats {
  const { cohortRange } = profile
  return {
    members: profile.memberCount,
    cities: countOf(findDimension(profile.spread, 'domicile')),
    occupations: countOf(findDimension(profile.spread, 'occupation')),
    cohort: !cohortRange
      ? null
      : cohortRange.from === cohortRange.to
        ? String(cohortRange.from)
        : `${cohortRange.from}–${cohortRange.to}`
  }
}

/** Bars for one dimension: listed buckets first, then "Lainnya" when it has members. */
export function spreadRows(dimension: SpreadDimension, memberCount: number, otherLabel: string): SpreadRow[] {
  const percent = (count: number) =>
    memberCount > 0 ? Math.min(100, Math.round((count / memberCount) * 100)) : 0
  const rows = dimension.buckets.map(bucket => ({
    label: bucket.label,
    count: bucket.count,
    percent: percent(bucket.count),
    isOther: false
  }))
  if (dimension.otherCount > 0) {
    rows.push({
      label: otherLabel,
      count: dimension.otherCount,
      percent: percent(dimension.otherCount),
      isOther: true
    })
  }
  return rows
}

/** Splits rows into the always-visible part and the folded rest; never folds a single row. */
export function foldRows<T>(rows: T[], visible = VISIBLE_SPREAD_ROWS): { shown: T[]; folded: T[] } {
  if (rows.length <= visible + 1) return { shown: rows, folded: [] }
  return { shown: rows.slice(0, visible), folded: rows.slice(visible) }
}

/** "Dedi Kurniawan" → "DK" for members without a photo. */
export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0])
    .join('')
    .toUpperCase()
}
