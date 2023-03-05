import type { Translation } from '../i18n-types.js'

const en = {
  rating: {
    1: "you can do better",
    2: "not bad",
    3: "okay",
    4: "good",
    5: "perfect!",
  },
  steps: "steps",
  try_again: "try again",
  next_level: "next level",
  time: {
    days: "{days} {{day|days}}",
    hours: "{hours} {{hour|hours}}",
    minutes: "{minutes} {{minute|minutes}}",
    seconds: "{seconds} {{second|seconds}}",
  }
} satisfies Translation

export default en
