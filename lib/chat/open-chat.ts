export const OPEN_CHAT_EVENT = "ask-ai-legal:open-chat"

export type OpenChatTab = "chat" | "quote"

export type OpenChatEventDetail = { tab: OpenChatTab }

/** Opens the floating ChatWidget from anywhere on the site — used by CTAs instead of mailto links. */
export function openChatWidget(tab: OpenChatTab = "quote") {
  if (typeof window === "undefined") return
  window.dispatchEvent(new CustomEvent<OpenChatEventDetail>(OPEN_CHAT_EVENT, { detail: { tab } }))
}
