"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import {
  analyticsAllowed,
  readStoredConsent,
  storeConsent,
  type CookieConsentChoice,
} from "@/lib/privacy-consent"

type ConsentContextValue = {
  /** null = user has not chosen yet (show banner). */
  choice: CookieConsentChoice | null
  hasChosen: boolean
  analyticsAllowed: boolean
  accept: () => void
  deny: () => void
}

const ConsentContext = createContext<ConsentContextValue | undefined>(undefined)

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [choice, setChoice] = useState<CookieConsentChoice | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setChoice(readStoredConsent())
    setReady(true)
  }, [])

  const accept = useCallback(() => {
    storeConsent("accepted")
    setChoice("accepted")
  }, [])

  const deny = useCallback(() => {
    storeConsent("denied")
    setChoice("denied")
  }, [])

  const value = useMemo(
    () => ({
      choice: ready ? choice : null,
      hasChosen: ready && choice !== null,
      analyticsAllowed: analyticsAllowed(choice),
      accept,
      deny,
    }),
    [choice, ready, accept, deny]
  )

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
}

export function useConsent() {
  const context = useContext(ConsentContext)
  if (!context) {
    throw new Error("useConsent must be used within ConsentProvider")
  }
  return context
}
