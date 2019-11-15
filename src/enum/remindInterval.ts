export enum RemindInterval {
  WEEKLY = 7,
  BIWEEKLY = 14,
  MONTHLY = 28,
  ONE_HALF_MONTHLY = 42,
  BIMONTHLY = 56,
  QUARTERLY = 91,
  HALF_YEARLY = 182,
  YEARLY = 364,
  NONE = 0,
}

export const values: RemindInterval[] = [
  RemindInterval.WEEKLY,
  RemindInterval.BIWEEKLY,
  RemindInterval.MONTHLY,
  RemindInterval.ONE_HALF_MONTHLY,
  RemindInterval.BIMONTHLY,
  RemindInterval.QUARTERLY,
  RemindInterval.HALF_YEARLY,
  RemindInterval.YEARLY,
  RemindInterval.NONE,
]

export function label(value: RemindInterval): string {
  switch (value) {
    case RemindInterval.WEEKLY: return `1週間ごと`
    case RemindInterval.BIWEEKLY: return `2週間ごと`
    case RemindInterval.MONTHLY: return `1ヶ月ごと`
    case RemindInterval.ONE_HALF_MONTHLY: return `1.5ヶ月ごと`
    case RemindInterval.BIMONTHLY: return `2ヶ月ごと`
    case RemindInterval.QUARTERLY: return `3ヶ月ごと`
    case RemindInterval.HALF_YEARLY: return `半年ごと`
    case RemindInterval.YEARLY: return `1年ごと`
    case RemindInterval.NONE: return `リマインドしない`
  }
}
