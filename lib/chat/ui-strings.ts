import type { Locale } from "@/lib/i18n/languages"

export type ChatUiStrings = {
  openChat: string
  closeChat: string
  title: string
  subtitle: string
  pickLanguage: string
  pickLanguageHint: string
  continueBtn: string
  changeLanguage: string
  tabChat: string
  tabBook: string
  welcome: string
  welcomeHint: string
  placeholder: string
  send: string
  thinking: string
  notLegalAdvice: string
  emailSupportHint: string
  bookTitle: string
  bookHint: string
  pricingLine: string
  firstName: string
  lastName: string
  email: string
  phone: string
  computer: string
  computerWindows: string
  computerMac: string
  computerUnsure: string
  bestTimes: string
  bestTimesHint: string
  question: string
  questionHint: string
  privacyNote: string
  sendRequest: string
  submittingRequest: string
  successTitle: string
  successBody: string
  submitAnother: string
  fillRequired: string
  submitError: string
  chatError: string
  tryAgain: string
}

const en: ChatUiStrings = {
  openChat: "Chat with us",
  closeChat: "Close chat",
  title: "Ask AI Legal",
  subtitle: "Website assistant",
  pickLanguage: "Choose your language",
  pickLanguageHint: "We'll reply in the language you select.",
  continueBtn: "Continue",
  changeLanguage: "Language",
  tabChat: "Chat",
  tabBook: "Request consultation",
  welcome:
    "Hello! I'm the Ask AI Legal assistant. I can explain what the software does, what each plan includes, and how optional maintenance works, in your language.",
  welcomeHint:
    "Ready to talk it through? Use the Request consultation tab. Please don't send confidential case documents through chat.",
  placeholder: "Ask about Ask AI Legal…",
  send: "Send",
  thinking: "Thinking…",
  notLegalAdvice: "Not legal advice · Software, installation, and support",
  emailSupportHint: "Installation, maintenance, support, or billing questions.",
  bookTitle: "Request an installation consultation",
  bookHint:
    "We confirm your computer requirements, review the included features, and discuss installation. We'll reply by email to set a time.",
  pricingLine:
    "Plans from $1,997, one-time purchase · Optional maintenance $125/month · Third-party usage and paid services are billed separately.",
  firstName: "First name",
  lastName: "Last name",
  email: "Email",
  phone: "Phone (optional)",
  computer: "Your computer",
  computerWindows: "Windows",
  computerMac: "Mac",
  computerUnsure: "Not sure",
  bestTimes: "Best times to reach you",
  bestTimesHint: "Example: weekdays after 5 pm Pacific",
  question: "Anything you'd like us to know? (optional)",
  questionHint: "Questions about features, installation, or pricing.",
  privacyNote: "Please don't include confidential case details. This request is not legal advice.",
  sendRequest: "Request consultation",
  submittingRequest: "Sending…",
  successTitle: "Request received",
  successBody: "Thanks — we'll reply by email to arrange your installation consultation.",
  submitAnother: "Send another request",
  fillRequired: "Please fill in your first name, last name, email, and the best times to reach you.",
  submitError: "We couldn't send your request. Please try again or email support@askailegal.com.",
  chatError: "We couldn't get a reply right now. Please try again or email support@askailegal.com.",
  tryAgain: "Try again",
}

const hi: ChatUiStrings = {
  openChat: "हमसे चैट करें",
  closeChat: "चैट बंद करें",
  title: "Ask AI Legal",
  subtitle: "वेबसाइट सहायक",
  pickLanguage: "अपनी भाषा चुनें",
  pickLanguageHint: "हम आपकी चुनी भाषा में जवाब देंगे।",
  continueBtn: "जारी रखें",
  changeLanguage: "भाषा",
  tabChat: "चैट",
  tabBook: "परामर्श बुक करें",
  welcome:
    "नमस्ते! मैं Ask AI Legal सहायक हूँ। मैं बता सकता/सकती हूँ कि सॉफ़्टवेयर क्या करता है, हर प्लान में क्या शामिल है, और वैकल्पिक रखरखाव कैसे काम करता है।",
  welcomeHint:
    "बात करने के लिए 'परामर्श बुक करें' टैब का उपयोग करें। कृपया चैट में गोपनीय केस दस्तावेज़ न भेजें।",
  placeholder: "Ask AI Legal के बारे में पूछें…",
  send: "भेजें",
  thinking: "सोच रहा/रही हूँ…",
  notLegalAdvice: "कानूनी सलाह नहीं · सॉफ़्टवेयर, इंस्टॉलेशन और सहायता",
  emailSupportHint: "इंस्टॉलेशन, रखरखाव, सहायता या बिलिंग के प्रश्न।",
  bookTitle: "इंस्टॉलेशन परामर्श बुक करें",
  bookHint:
    "हम आपके कंप्यूटर की ज़रूरतें जाँचते हैं, शामिल सुविधाएँ समझाते हैं और इंस्टॉलेशन पर चर्चा करते हैं। समय तय करने के लिए हम ईमेल से जवाब देंगे।",
  pricingLine:
    "प्लान $1,997 से शुरू, एक बार की खरीद · वैकल्पिक रखरखाव $125/माह · तृतीय-पक्ष AI, रिसर्च सदस्यता और क्लाउड सेवाओं का खर्च अलग हो सकता है।",
  firstName: "पहला नाम",
  lastName: "अंतिम नाम",
  email: "ईमेल",
  phone: "फ़ोन (वैकल्पिक)",
  computer: "आपका कंप्यूटर",
  computerWindows: "Windows",
  computerMac: "Mac",
  computerUnsure: "पता नहीं",
  bestTimes: "आपसे संपर्क का सबसे अच्छा समय",
  bestTimesHint: "उदाहरण: सप्ताह के दिनों में शाम 5 बजे के बाद",
  question: "कुछ और बताना चाहें? (वैकल्पिक)",
  questionHint: "सुविधाओं, इंस्टॉलेशन या कीमत के बारे में प्रश्न।",
  privacyNote: "कृपया गोपनीय केस विवरण शामिल न करें। यह कानूनी सलाह नहीं है।",
  sendRequest: "परामर्श का अनुरोध करें",
  submittingRequest: "भेजा जा रहा है…",
  successTitle: "अनुरोध प्राप्त हुआ",
  successBody: "धन्यवाद — इंस्टॉलेशन परामर्श तय करने के लिए हम ईमेल से जवाब देंगे।",
  submitAnother: "दूसरा अनुरोध भेजें",
  fillRequired: "कृपया पहला नाम, अंतिम नाम, ईमेल और संपर्क का समय भरें।",
  submitError: "अनुरोध नहीं भेजा जा सका। कृपया फिर कोशिश करें या support@askailegal.com पर ईमेल करें।",
  chatError: "अभी जवाब नहीं मिला। कृपया फिर कोशिश करें या support@askailegal.com पर ईमेल करें।",
  tryAgain: "फिर कोशिश करें",
}

const catalog: Partial<Record<Locale, ChatUiStrings>> = { en, hi }

export function getChatUiStrings(locale: Locale): ChatUiStrings {
  return catalog[locale] ?? en
}

export function getWelcomeMessage(locale: Locale): string {
  const s = getChatUiStrings(locale)
  return `${s.welcome}\n\n${s.welcomeHint}`
}
