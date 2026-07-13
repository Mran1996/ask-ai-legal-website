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
  bookIntakeCall: string
  bookIntakeCallHint: string
  caseNumberLabel: string
  caseNumberHint: string
  retrievalCheckbox: string
  retrievalFeeNote: string
  quoteSummaryTitle: string
  quotePrepLine: string
  quoteRetrievalLine: string
  quoteTotalLine: string
  payToStart: string
  paying: string
  payError: string
  uploadMoreDocs: string
  quoteNextSteps: string
  intakeSubmitError: string
  submitAnother: string
  conversationTitle: string
  submittedInfoTitle: string
  pricingTitle: string
  attorneyTypicalLabel: string
  ourEstimatedLabel: string
  ourCustomQuoteLabel: string
  ourFractionNote: string
  estimateComparison: string
  estimateCustomQuote: string
  estimateServiceLine: string
  estimateDisclaimer: string
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
    "Submit intake to get a start price. Pay before we retrieve or generate documents. Document preparation only — not a law firm.",
  firstName: "First name",
  lastName: "Last name",
  email: "Email",
  phone: "Phone",
  state: "State / jurisdiction",
  stateHint: "Select your state — we'll show a local average for your case type.",
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
    "Next: confirm case number if you have one, upload documents or request paid retrieval, then pay to start. Document preparation only — not legal advice.",
  bookIntakeCall: "Book your intake call",
  bookIntakeCallHint: "15–20 min · document preparation and pricing only",
  caseNumberLabel: "Case / docket number (if you have it)",
  caseNumberHint: "Optional but helps us work faster. Leave blank if you don't have one yet.",
  retrievalCheckbox: "I need Ask AI Legal to retrieve documents (additional fee).",
  retrievalFeeNote: "Retrieval is billed as an add-on and must be paid before we pull records.",
  quoteSummaryTitle: "Amount due before we start",
  quotePrepLine: "Document preparation",
  quoteRetrievalLine: "Document retrieval",
  quoteTotalLine: "Total due now",
  payToStart: "Pay to start",
  paying: "Opening secure checkout…",
  payError: "We couldn't start checkout. Try again or email support@askailegal.com.",
  uploadMoreDocs: "Upload documents now",
  quoteNextSteps: "Order: intake → quote → pay → we work → deliver.",
  intakeSubmitError:
    "We couldn't save your intake. Please try again or email support@askailegal.com with your details.",
  submitAnother: "Submit another request",
  conversationTitle: "Your conversation",
  submittedInfoTitle: "What you submitted",
  pricingTitle: "Estimated investment",
  attorneyTypicalLabel: "Typical attorney cost",
  ourEstimatedLabel: "Ask AI Legal estimated average",
  ourCustomQuoteLabel: "Case file review to start",
  ourFractionNote:
    "Priced at the midpoint of the typical attorney range above — flat fee, no hourly billing",
  estimateComparison:
    "{attorneyTypicalLabel}: {attorneyLow}–{attorneyHigh} · {ourEstimatedLabel}: {ourPrice}",
  estimateCustomQuote:
    "{attorneyTypicalLabel}: {attorneyLow}–{attorneyHigh}. Start with a case file review; we'll confirm the full package after we read your file.",
  estimateServiceLine: "Service",
  estimateDisclaimer:
    "Estimate for planning. You pay the total below before we retrieve records or prepare documents. Not legal advice.",
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
    "इंटेक भेजें, स्टार्ट कीमत देखें, फिर भुगतान करें। भुगतान के बाद ही हम दस्तावेज़ तैयार या प्राप्त करते हैं। केवल दस्तावेज़ तैयारी — कानूनी फर्म नहीं।",
  firstName: "पहला नाम",
  lastName: "अंतिम नाम",
  email: "ईमेल",
  phone: "फ़ोन",
  state: "राज्य / अधिकार क्षेत्र",
  stateHint: "अपना राज्य चुनें — हम आपके मामले के प्रकार के लिए स्थानीय औसत दिखाएंगे।",
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
    "अगला: केस नंबर (यदि हो), दस्तावेज़ अपलोड या सशुल्क रिट्रीवल, फिर काम शुरू करने के लिए भुगतान। केवल दस्तावेज़ तैयारी — कानूनी सलाह नहीं।",
  bookIntakeCall: "अपना इंटेक कॉल बुक करें",
  bookIntakeCallHint: "15–20 मिनट · केवल दस्तावेज़ तैयारी और मूल्य",
  caseNumberLabel: "केस / डॉकेट नंबर (यदि हो)",
  caseNumberHint: "वैकल्पिक, लेकिन काम तेज़ करता है। न हो तो खाली छोड़ दें।",
  retrievalCheckbox: "मुझे Ask AI Legal से दस्तावेज़ रिट्रीव करवाने हैं (अतिरिक्त शुल्क)।",
  retrievalFeeNote: "रिट्रीवल ऐड-ऑन है और भुगतान के बाद ही रिकॉर्ड खींचे जाएंगे।",
  quoteSummaryTitle: "काम शुरू होने से पहले देय राशि",
  quotePrepLine: "दस्तावेज़ तैयारी",
  quoteRetrievalLine: "दस्तावेज़ रिट्रीवल",
  quoteTotalLine: "अभी कुल देय",
  payToStart: "शुरू करने के लिए भुगतान करें",
  paying: "सुरक्षित चेकआउट खुल रहा है…",
  payError: "चेकआउट शुरू नहीं हो सका। फिर कोशिश करें या support@askailegal.com पर ईमेल करें।",
  uploadMoreDocs: "अभी दस्तावेज़ अपलोड करें",
  quoteNextSteps: "क्रम: इंटेक → कोट → भुगतान → हम काम करते हैं → डिलीवरी।",
  intakeSubmitError:
    "इंटेक सहेज नहीं सका। कृपया फिर कोशिश करें या support@askailegal.com पर ईमेल करें।",
  submitAnother: "दूसरा अनुरोध भेजें",
  conversationTitle: "आपकी बातचीत",
  submittedInfoTitle: "आपने जो भेजा",
  pricingTitle: "अनुमानित लागत",
  attorneyTypicalLabel: "वकील की सामान्य लागत",
  ourEstimatedLabel: "Ask AI Legal अनुमानित औसत",
  ourCustomQuoteLabel: "शुरू करने के लिए केस फ़ाइल समीक्षा",
  ourFractionNote:
    "ऊपर दिखाई गई वकील रेंज का मध्य बिंदु — फ्लैट फी, प्रति घंटा नहीं",
  estimateComparison:
    "{attorneyTypicalLabel}: {attorneyLow}–{attorneyHigh} · {ourEstimatedLabel}: {ourPrice}",
  estimateCustomQuote:
    "{attorneyTypicalLabel}: {attorneyLow}–{attorneyHigh}. केस फ़ाइल समीक्षा से शुरू करें; फ़ाइल पढ़ने के बाद पूरा पैकेज तय होगा।",
  estimateServiceLine: "सेवा",
  estimateDisclaimer:
    "योजना के लिए अनुमान। दस्तावेज़ तैयार/रिट्रीव करने से पहले नीचे दी गई राशि का भुगतान करें। कानूनी सलाह नहीं।",
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
