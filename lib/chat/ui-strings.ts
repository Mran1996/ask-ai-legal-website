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
  tabQuote: string
  welcome: string
  welcomeHint: string
  placeholder: string
  send: string
  thinking: string
  notLegalAdvice: string
  emailSupport: string
  emailSupportHint: string
  requestQuote: string
  quoteTitle: string
  quoteHint: string
  firstName: string
  lastName: string
  email: string
  phone: string
  state: string
  stateHint: string
  caseType: string
  issue: string
  deadline: string
  opposingParty: string
  hasDocuments: string
  hasDocumentsYes: string
  hasDocumentsNo: string
  preferredContact: string
  contactEmail: string
  contactPhone: string
  contactEither: string
  sendRequest: string
  submittingRequest: string
  intakeSuccessTitle: string
  intakeSuccessBody: string
  intakeSubmitError: string
  submitAnother: string
  estimateComparison: string
  estimateCustomQuote: string
  estimateServiceLine: string
  fillRequired: string
  uploadNote: string
  uploadFiles: string
  uploadFilesHint: string
  uploadFilesSelected: string
  uploadFilesTooMany: string
  uploadFilesTooLarge: string
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
  tabQuote: "Request quote",
  welcome:
    "Hello! I'm the Ask AI Legal assistant. I can explain our services, how pricing works, and what to expect — in your language.",
  welcomeHint:
    "For a custom quote, use the Request quote tab or email support@askailegal.com with your documents attached.",
  placeholder: "Ask about our services…",
  send: "Send",
  thinking: "Thinking…",
  notLegalAdvice: "Not legal advice · Document generation only · Not a law firm",
  emailSupport: "Email support@askailegal.com",
  emailSupportHint: "Attach documents so we can review your situation and send a custom quote.",
  requestQuote: "Request a free case review",
  quoteTitle: "Tell us about your case",
  quoteHint:
    "This helps our team respond by email with scope, timeline, and investment. Consultations are free.",
  firstName: "First name",
  lastName: "Last name",
  email: "Email",
  phone: "Phone",
  state: "State / jurisdiction",
  stateHint: "Select your state. Instant estimates available for many California matter types.",
  caseType: "Case type",
  issue: "Describe your issue",
  deadline: "Deadline or urgency (optional)",
  opposingParty: "Opposing party (optional)",
  hasDocuments: "Do you have documents to share?",
  hasDocumentsYes: "Yes — I'll upload files below",
  hasDocumentsNo: "Not yet",
  preferredContact: "Preferred contact",
  contactEmail: "Email",
  contactPhone: "Phone",
  contactEither: "Either",
  sendRequest: "Submit intake",
  submittingRequest: "Submitting…",
  intakeSuccessTitle: "Intake received",
  intakeSuccessBody:
    "Save the reference above. Our team will follow up by email with next steps. Nothing has been delivered yet; a licensed attorney will review before any documents are sent.",
  intakeSubmitError:
    "We couldn't save your intake. Please try again or email support@askailegal.com with your details.",
  submitAnother: "Submit another request",
  estimateComparison:
    "Attorneys typically {attorneyLow}–{attorneyHigh} · Ask AI Legal {ourPrice}",
  estimateCustomQuote:
    "Attorneys in this area often charge {attorneyLow}–{attorneyHigh}. Our team will email you a custom quote after reviewing your intake.",
  estimateServiceLine: "Service",
  fillRequired: "Please fill in name, email, and a brief issue description.",
  uploadNote:
    "Optional: attach court papers, notices, or leases (PDF, JPG, PNG — up to 10 MB each).",
  uploadFiles: "Attach documents",
  uploadFilesHint: "PDF, JPG, or PNG · max 5 files · 10 MB each",
  uploadFilesSelected: "{count} file(s) selected",
  uploadFilesTooMany: "Maximum 5 files per intake.",
  uploadFilesTooLarge: "Each file must be 10 MB or smaller.",
  chatError:
    "We couldn't get a reply right now. Please try again or email support@askailegal.com — attach any documents so we can help.",
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
  tabQuote: "कोट का अनुरोध",
  welcome:
    "नमस्ते! मैं Ask AI Legal सहायक हूँ। मैं हमारी सेवाएँ, कीमत कैसे काम करती है, और क्या उम्मीद करें — आपकी भाषा में समझा सकता/सकती हूँ।",
  welcomeHint:
    "कस्टम कोट के लिए 'कोट का अनुरोध' टैब का उपयोग करें या support@askailegal.com पर दस्तावेज़ संलग्न करके ईमेल करें।",
  placeholder: "हमारी सेवाओं के बारे में पूछें…",
  send: "भेजें",
  thinking: "सोच रहा/रही हूँ…",
  notLegalAdvice: "कानूनी सलाह नहीं · केवल दस्तावेज़ · कानूनी फर्म नहीं",
  emailSupport: "support@askailegal.com पर ईमेल करें",
  emailSupportHint: "दस्तावेज़ संलग्न करें ताकि हम आपकी स्थिति समझकर सटीक कोट दे सकें।",
  requestQuote: "मुफ़्त केस समीक्षा का अनुरोध",
  quoteTitle: "अपने मामले के बारे में बताएँ",
  quoteHint:
    "इससे हमारी टीम ईमेल से दायरा, समय और लागत के साथ जवाब दे सकती है। परामर्श मुफ़्त है।",
  firstName: "पहला नाम",
  lastName: "अंतिम नाम",
  email: "ईमेल",
  phone: "फ़ोन",
  state: "राज्य / अधिकार क्षेत्र",
  stateHint: "अपना राज्य चुनें। कई कैलिफ़ोर्निया मामलों के लिए तुरंत अनुमान उपलब्ध।",
  caseType: "मामले का प्रकार",
  issue: "अपना मुद्दा बताएँ",
  deadline: "अंतिम तिथि या तात्कालिकता (वैकल्पिक)",
  opposingParty: "विरोधी पक्ष (वैकल्पिक)",
  hasDocuments: "क्या साझा करने के लिए दस्तावेज़ हैं?",
  hasDocumentsYes: "हाँ — नीचे फ़ाइलें अपलोड करूँगा/करूँगी",
  hasDocumentsNo: "अभी नहीं",
  preferredContact: "पसंदीदा संपर्क",
  contactEmail: "ईमेल",
  contactPhone: "फ़ोन",
  contactEither: "कोई भी",
  sendRequest: "इंटेक भेजें",
  submittingRequest: "भेजा जा रहा है…",
  intakeSuccessTitle: "इंटेक प्राप्त",
  intakeSuccessBody:
    "ऊपर दिया संदर्भ सहेजें। हमारी टीम अगले कदमों के लिए ईमेल से संपर्क करेगी। अभी कुछ भी वितरित नहीं किया गया है।",
  intakeSubmitError:
    "इंटेक सहेज नहीं सका। कृपया फिर कोशिश करें या support@askailegal.com पर ईमेल करें।",
  submitAnother: "दूसरा अनुरोध भेजें",
  estimateComparison:
    "वकील आमतौर पर {attorneyLow}–{attorneyHigh} · Ask AI Legal {ourPrice}",
  estimateCustomQuote:
    "इस क्षेत्र में वकील अक्सर {attorneyLow}–{attorneyHigh} लेते हैं। हमारी टीम आपके इंटेक की समीक्षा के बाद कस्टम कोट ईमेल करेगी।",
  estimateServiceLine: "सेवा",
  fillRequired: "कृपया नाम, ईमेल और संक्षिप्त विवरण भरें।",
  uploadNote:
    "वैकल्पिक: अदालती कागज़ात, नोटिस या लीज़ संलग्न करें (PDF, JPG, PNG — प्रति 10 MB)।",
  uploadFiles: "दस्तावेज़ संलग्न करें",
  uploadFilesHint: "PDF, JPG, PNG · अधिकतम 5 · प्रति 10 MB",
  uploadFilesSelected: "{count} फ़ाइल चुनी गई",
  uploadFilesTooMany: "प्रति इंटेक अधिकतम 5 फ़ाइलें।",
  uploadFilesTooLarge: "प्रत्येक फ़ाइल 10 MB या उससे छोटी होनी चाहिए।",
  chatError:
    "अभी जवाब नहीं मिला। कृपया फिर कोशिश करें या support@askailegal.com पर ईमेल करें — दस्तावेज़ संलग्न करें।",
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
