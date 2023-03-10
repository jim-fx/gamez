import type { BaseTranslation } from '../i18n-types.js'

const de = {
  rating: {
    1: "geht besser",
    2: "nicht schlecht",
    3: "okay",
    4: "gut",
    5: "perfekt!",
  },
  steps: "Schritte",
  try_again: "Nochmal versuchen",
  next_level: "Nächstes Level",
  time: {
    days: "{days} {{Tag|Tage}}",
    hours: "{hours} {{Stunde|Stunden}}",
    minutes: "{minutes} {{Minute|Minuten}}",
    seconds: "{seconds} {{Sekunde|Sekunden}}",
  }
} satisfies BaseTranslation

export default de
