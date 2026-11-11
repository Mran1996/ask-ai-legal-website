/**
 * Comment keywords for Instagram auto-DMs.
 * When someone comments one of these words on an @askailegal post, they get one private DM with the message below.
 * Instagram allows one private reply per comment, within 7 days of the comment.
 */
export type CommentKeyword = {
  /** The word people comment (matched as a whole word, any capitalization). */
  word: string
  /** The private DM they receive. */
  dm: string
  /** A short public reply under their comment, so others see it works. Leave empty for none. */
  publicReply: string
}

const SITE = "https://askailegal.com"

export const COMMENT_KEYWORDS: CommentKeyword[] = [
  {
    word: "SERVED",
    dm:
      "Here's your free checklist: First 48 Hours After You're Served 📄\n" +
      `${SITE}/checklists/first-48-hours-after-youre-served.pdf\n\n` +
      `Want help keeping your court papers and deadlines organized? Take a look at ${SITE}`,
    publicReply: "Sent! Check your DMs 📩",
  },
]

/** The keyword a comment asks for, if any. "served!", "Served please", and "SERVED" all match SERVED. */
export function matchKeyword(text: string | undefined): CommentKeyword | null {
  if (!text) return null
  const words: string[] = text.toUpperCase().match(/[A-Z]+/g) ?? []
  return COMMENT_KEYWORDS.find((k) => words.includes(k.word.toUpperCase())) ?? null
}
