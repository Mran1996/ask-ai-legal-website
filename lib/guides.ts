/**
 * Search guides: plain-English pages built around what people actually search for.
 * General information for people handling their own case. Rules and deadlines vary by state and court,
 * so every guide points readers to their court's official rules instead of stating a number of days.
 */
export type GuideLink = { label: string; href: string }
export type GuideSection = {
  heading: string
  paragraphs?: string[]
  bullets?: string[]
  /** Numbered list (1, 2, 3) for steps done in order. */
  steps?: string[]
  /** Text shown in a box with a Copy button (for prompts). */
  copy?: string
  /** Paragraphs shown after the copy box. */
  after?: string[]
  links?: GuideLink[]
}
export type Guide = {
  slug: string
  title: string
  /** Shown in Google results (keep under ~60 characters). */
  seoTitle: string
  /** Shown under the title in Google results (keep under ~155 characters). */
  description: string
  intro: string
  sections: GuideSection[]
  /** Box with one button, shown right under the intro. */
  cta?: { title: string; text: string; label: string; href: string }
  faq: { q: string; a: string }[]
  updated: string
}

export const STARTER_PROMPT = `I am representing myself in a court case. Help me step by step.
1. First, ask me questions one at a time until you understand my case: the court, the state, the papers I have, and what I need to do next.
2. Then write the exact prompt I should give you for that task, and tell me which of my papers to upload.
3. When you answer, show the page and line from my papers that you relied on. For any law or case, give the full citation and a link to the official source.
4. If you are not sure, say so. Never make up a case, a quote or a deadline.`

export const GUIDES: Guide[] = [
  {
    slug: "use-chatgpt-claude-for-your-case",
    title: "How to Use ChatGPT or Claude for Your Court Case",
    seoTitle: "How to Use ChatGPT or Claude for Your Court Case",
    description:
      "Four free steps to use ChatGPT or Claude on your own court case: upload your papers, paste one starter prompt, and check every answer.",
    intro:
      "Most people type a question and hope. The answers get better when the chatbot can read your papers and asks you the right questions first. Here is how to set that up in about ten minutes, for free.",
    sections: [
      {
        heading: "Step 1. Open Claude or ChatGPT",
        paragraphs: ["Both have a free plan. Pick one."],
        links: [
          { label: "Open Claude", href: "https://claude.ai" },
          { label: "Open ChatGPT", href: "https://chatgpt.com" },
        ],
      },
      {
        heading: "Step 2. Upload your court papers",
        paragraphs: [
          "Click the paperclip or the + button and add your PDFs: the complaint, any orders, notices and letters. Want it to remember your papers in every chat? Put them in a Project.",
        ],
        links: [
          {
            label: "Claude: what files you can upload",
            href: "https://support.claude.com/en/articles/8241126-what-kinds-of-documents-can-i-upload-to-claude-ai",
          },
          { label: "Claude: how Projects work", href: "https://support.claude.com/en/articles/9517075-what-are-projects" },
          { label: "ChatGPT: uploading files", href: "https://help.openai.com/en/articles/8555545-uploading-files-and-audio-to-chatgpt" },
          { label: "After you upload: prompts that get better answers", href: "/guides/ask-chatgpt-claude-better" },
        ],
      },
      {
        heading: "Step 3. Paste this starter prompt",
        paragraphs: [
          "You don't need to know the right words. This prompt asks you about your case, then writes the right prompt for you.",
        ],
        copy: STARTER_PROMPT,
        after: [
          "Tip: paste rules 3 and 4 into your Project instructions (Claude) or Custom Instructions (ChatGPT). Then every chat follows them.",
        ],
        links: [
          {
            label: "ChatGPT: Custom Instructions",
            href: "https://help.openai.com/en/articles/8096356-chatgpt-custom-instructions",
          },
        ],
      },
      {
        heading: "Step 4. Check its work",
        paragraphs: ["Chatbots can sound sure and still be wrong. Before you file anything:"],
        bullets: [
          "Look up every case and law it cites. If you can't find it, don't use it.",
          "Match each quote word for word against your papers.",
          "Check every deadline against your court's rules and the dates on your papers.",
          "Ask it: \"What could be wrong with this answer?\"",
          "Check your court's self-help page for the right format and forms.",
        ],
      },
      {
        heading: "Free help near you",
        paragraphs: [
          "Most state courts have a free self-help center with forms and filing steps. Search \"[your state] courts self help\".",
          "Free legal aid, if you qualify:",
        ],
        links: [{ label: "Find legal aid", href: "https://www.lsc.gov/about-lsc/what-legal-aid/get-legal-help" }],
      },
      {
        heading: "Want this on your own computer?",
        paragraphs: [
          "Ask AI Legal does these steps for you, with your files kept on your computer. It reads your papers, tracks deadlines and checks its sources before it drafts.",
        ],
        links: [{ label: "See how Ask AI Legal works", href: "/services" }],
      },
    ],
    faq: [
      {
        q: "Is ChatGPT or Claude free for this?",
        a: "Both have free plans. Free plans limit how much you can upload and ask each day.",
      },
      {
        q: "Is it safe to upload my court papers?",
        a: "Your files go to the company that runs the chatbot. Read their privacy settings first. Ask AI Legal keeps your files on your own computer.",
      },
      {
        q: "Can I file what it writes?",
        a: "Only after you check it with the list in Step 4 and match your court's format.",
      },
    ],
    updated: "2026-11-13",
  },
  {
    slug: "ask-chatgpt-claude-better",
    title: "Ask ChatGPT or Claude Better About Your Court Case",
    seoTitle: "Ask ChatGPT or Claude Better: Legal Prompts",
    description:
      "Copy-ready rules and prompts for ChatGPT or Claude: read your court papers, test a draft four ways, get real case links, and add legal research plugins.",
    intro:
      "Uploading your papers is the first step. The back and forth is the work. Every rule and prompt below works in ChatGPT or Claude. Copy them as they are.",
    cta: {
      title: "Want the best out of ChatGPT or Claude?",
      text: "Fill out the form with your name, phone number and what you need. We get back to you.",
      label: "Fill out the form",
      href: "/contact",
    },
    sections: [
      {
        heading: "1. Copy the starter rules",
        paragraphs: ["Paste this as your first message. It works in an ordinary chat."],
        copy: `Follow these rules in every answer.
1. Ask me questions before you draft. Do not guess facts.
2. Number every point so I can answer by number.
3. Never invent a fact, case, rule, date or quote. If you are unsure, say "not verified".
4. Give a link for every rule and case, and quote the exact sentence you rely on.
5. Tell me what the other side will attack.
6. Tell me what you did not read and could not check.
7. Use plain English. Short sentences.
8. When I challenge you, check again. Do not agree with me to please me.`,
      },
      {
        heading: "2. Have it save everything once",
        paragraphs: [
          "You should not have to paste these prompts every time. Send this once and ChatGPT or Claude turns this whole guide into saved rules and a skill. If it cannot open the link, paste the prompts from this page into the chat and send the same request.",
        ],
        copy: `Read this page: https://askailegal.com/guides/ask-chatgpt-claude-better
Turn every rule and prompt on it into something you keep using, so I never have to paste them again.
1. Write one set of standing rules from the page. Number them. Keep every rule and do not add new ones.
2. Turn the prompts (read everything first, four chairs, get links, check against the source, cut the machine writing, before you file) into one skill I can call by name.
3. If you can save rules or create a skill yourself, do it now and tell me what you saved.
4. If you cannot, give me the finished text in a box I can copy, and tell me exactly where to paste it: ChatGPT Custom Instructions or a Project's instructions, or Claude Project instructions or a skill.
5. Then tell me how to start a new chat that uses them.`,
        after: ["Check what it saved. Read the rules once and fix anything it changed."],
      },
      {
        heading: "3. Give it your papers",
        paragraphs: [
          "Use copies of your papers and keep the originals somewhere else. Leave out ID numbers, bank numbers and other people's health records. If a court order or sealed file is involved, check what you may share first.",
        ],
        steps: [
          "ChatGPT or Claude: make a Project for the matter and add your files. The papers stay with every chat in that Project.",
          "Claude desktop app: Claude Cowork can read one folder on your computer. Anthropic lists it for paid plans. Pick only the folder for this matter.",
          "Cowork can change files in the folder you pick, not only read them. Work on copies.",
        ],
        links: [
          { label: "ChatGPT: uploading files", href: "https://help.openai.com/en/articles/8555545-uploading-files-and-audio-to-chatgpt" },
          { label: "Claude: how Projects work", href: "https://support.claude.com/en/articles/9517075-what-are-projects" },
          { label: "Claude Cowork: getting started", href: "https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork" },
          { label: "Using Cowork safely", href: "https://support.claude.com/en/articles/13364135-use-claude-cowork-safely" },
        ],
      },
      {
        heading: "4. Ask it to read everything first",
        paragraphs: ["Send this before you ask for any draft."],
        copy: `Read every file I gave you. Do not change or delete anything.
1. List each document with its date, who wrote it, and whether it shows a court filing stamp.
2. Tell me which files you could not read.
3. Make a timeline with the file name beside each date.
4. List every deadline you find and where you found it.
5. List the issues you see. Mark each one "in the document" or "your inference".
Then ask me your questions. Do not draft yet.`,
      },
      {
        heading: "5. Describe your situation",
        paragraphs: ["A good request gives a goal, the facts and the limits. Fill this in."],
        copy: `Court and county:
Who I am in it (for example, the person who filed):
What already happened, with dates:
What the other side filed:
Next date I know about:
What I want the judge to do:
What I am worried about:
What I do not want mentioned, and why:
Before you answer, ask me what is missing.`,
      },
      {
        heading: "Questions that sharpen the answer",
        steps: [
          "How does this sentence help me?",
          "Who benefits if I add this person or this claim?",
          "What do I have to prove, one item at a time?",
          "If the other side says this, where is their proof?",
          "Could this open a door I plan to ask the judge to close?",
          "How did they answer this kind of question before?",
          "Could this look bad or get me in trouble?",
        ],
      },
      {
        heading: "6. Test it from four chairs",
        copy: `Review this draft four times and keep the reviews separate.
1. As the judge: what can be ordered today, under which rule, on which evidence? What is missing?
2. As an appeals court: if the judge says no, is every argument and exhibit in the record?
3. As a juror: what happened, was it on purpose, is there a pattern, and what would I need to see?
4. As the other side's lawyer: attack the weakest three points.
Then list the changes you recommend and why.`,
      },
      {
        heading: "7. Get links and verify them",
        paragraphs: ["ChatGPT and Claude can both produce a case that looks real and is not. Treat every citation as unproven until you open it."],
        copy: `For each case or rule, give me: the full name and citation, a link to the full text at the court or legislature site when possible, the exact sentence you rely on, the page, and what the case was about. If you cannot open the source, write "NOT VERIFIED" and do not put it in my draft.`,
        after: ["Then check each one yourself."],
      },
      {
        heading: "Check the draft against the source",
        steps: [
          "Open the link yourself. Search the page for the quoted sentence.",
          "Save the full opinion or rule as a file.",
          "Start a new chat, so the chatbot is not defending its own work. Upload the file and your draft.",
          "Paste the request below.",
          "Check whether the case was later reversed or limited. A law library can help with this.",
        ],
        copy: `I uploaded the source and my draft. Use only the uploaded source.
1. Is each quote word for word? Show any difference.
2. Is the page number right?
3. Does the source decide what my sentence says it decides? Answer yes, partly or no, and explain.
4. Is anything in the source bad for me?
Do not fill gaps from memory.`,
        after: ["Free places to look:"],
        links: [
          { label: "Washington court opinions", href: "https://www.courts.wa.gov/opinions/" },
          { label: "Washington court rules", href: "https://www.courts.wa.gov/court_rules/" },
          { label: "Washington statutes", href: "https://app.leg.wa.gov/rcw/" },
          { label: "CourtListener", href: "https://www.courtlistener.com/" },
        ],
      },
      {
        heading: "8. Add legal research plugins",
        paragraphs: [
          "A plugin lets ChatGPT or Claude search a real legal database instead of its memory. Claude calls them connectors. ChatGPT calls them apps or plugins. The answers come back with links you can open.",
          "Claude needs a paid plan to add connectors. In ChatGPT it depends on your plan. Anything sent through a plugin goes to that company's servers.",
        ],
        steps: [
          "CourtListener, from the nonprofit Free Law Project. The plugin is free. It searches millions of court opinions, federal PACER dockets and judge data, and checks citations. Works in Claude and ChatGPT. Start here.",
          "Midpage. Case law with a link to every source and a citator that shows if a case is still good law. Works in Claude and ChatGPT. Needs a Midpage subscription, $100 a month ($10 for students).",
          "Descrybe. U.S. cases, statutes and regulations, with quote checks and treatment. Works in Claude and ChatGPT. $25 a month.",
          "Trellis. State trial court dockets, rulings and court rules. Works in Claude. $50 a month.",
          "Courtroom5. Built for people without a lawyer. Counts deadlines and suggests next steps in all 50 states. Works in Claude. Starts at $1 for 100 credits.",
        ],
        after: [
          "To add one in Claude, open Settings, then Connectors, then Browse. In ChatGPT, open the apps directory and search the name. Prices are from each company and the USC law library list and can change.",
          "A plugin finds real cases. You still open each one before you rely on it.",
        ],
        links: [
          { label: "CourtListener", href: "https://www.courtlistener.com/" },
          { label: "Midpage", href: "https://www.midpage.ai/" },
          { label: "Descrybe", href: "https://descrybe.com/" },
          { label: "USC law library list", href: "https://lawlibguides.usc.edu/c.php?g=1447399&p=11552754" },
        ],
      },
      {
        heading: "9. Cut the machine writing",
        copy: `Write like a careful person, not like a press release.
1. Short sentences with a named actor and a plain verb.
2. No long dashes and no semicolons.
3. No "not only X but also Y" and no "it is not X, it is Y".
4. No rhetorical questions, no pep talk, no summary that repeats what you said.
5. Do not use: delve, navigate, landscape, tapestry, harness, unlock, pivotal, testament, moreover, furthermore, utilize, game-changer.
6. Every claim needs a document, a date or a number behind it.
7. Cut words like very, really, clearly and obviously.
After drafting, list each sentence that breaks a rule and fix it.`,
        after: ["Then read it out loud. If you would never say a sentence to a clerk, change it."],
      },
      {
        heading: "10. What ChatGPT and Claude do well",
        bullets: [
          "Reading long papers and building a timeline.",
          "Arguing the other side when you ask.",
          "Drafting from facts you give it and checking a draft against a file.",
        ],
      },
      {
        heading: "What to watch for",
        steps: [
          "It can state wrong things with confidence, including cases and dates.",
          "It can miss a file or read a scanned page badly. Ask what it did not read.",
          "A new chat may not remember the last one. Keep your own notes.",
          "It cannot see the court's docket unless you give it the information or a plugin that can.",
          "It is not your lawyer.",
        ],
        after: ["Better answers come from a clear goal, real documents and your corrections. Say why something is wrong. The reason changes the next draft."],
      },
      {
        heading: "11. Save the rules and skill yourself",
        paragraphs: [
          "Use this if step 2 did not work.",
          "ChatGPT: paste the text below into Custom Instructions or a Project's instructions.",
          "Claude: save it as a skill. Anthropic says custom skills need code execution turned on.",
        ],
        steps: [
          "Copy the text below into a file named SKILL.md.",
          "Put that file in a folder named four-chairs.",
          "Compress the folder to a ZIP file.",
          "In Claude, open Customize, then Skills, then upload the ZIP.",
        ],
        copy: `---
name: four-chairs
description: Use for any court paper, discovery questions or legal plan. Asks questions first, tests the work as judge, appeals court, juror and opposing lawyer, and verifies sources.
---
1. Ask what the goal is, what happened and what is missing before drafting.
2. List what must be proved.
3. Cut anything that does not help.
4. Review as judge, appeals court, juror and the other side.
5. Never invent facts or citations. Give links and exact quotes, or write NOT VERIFIED.
6. Check court rules for format, deadline and required forms.
7. Say which papers get filed, which get only served, and which go only to the judge, and verify that under the rules.
8. Use plain English and number every point.
9. End with what you did not check.`,
        links: [
          { label: "ChatGPT: Custom Instructions", href: "https://help.openai.com/en/articles/8096356-chatgpt-custom-instructions" },
          { label: "Claude: use skills", href: "https://support.claude.com/en/articles/12512180-use-skills-in-claude" },
        ],
      },
      {
        heading: "12. Before you file",
        steps: [
          "Read every line. You are the one signing it.",
          "Confirm each fact is true from what you know or from a document.",
          "Open each rule and case.",
          "Check your court's local rules, forms, page limits and deadlines.",
          "Know the difference between filing with the court, serving the other side, and sending a proposed order to the judge.",
          "Look at every page before it goes out.",
          "If much is at stake, ask a lawyer or a legal aid office to review it.",
        ],
        links: [{ label: "Find legal aid", href: "https://www.lsc.gov/about-lsc/what-legal-aid/get-legal-help" }],
      },
      {
        heading: "Want the best out of ChatGPT or Claude?",
        paragraphs: [
          "Fill out the form with your name, your phone number and what you need. We get back to you.",
          "Ask AI Legal can also do these steps for you on your own computer. It reads your papers, tracks deadlines and checks its sources before it drafts.",
        ],
        links: [
          { label: "Fill out the form", href: "/contact" },
          { label: "See how Ask AI Legal works", href: "/services" },
        ],
      },
    ],
    faq: [
      {
        q: "Do these prompts work in both ChatGPT and Claude?",
        a: "Yes. Copy and paste them into either one. Only the Cowork folder and the skill upload are Claude features.",
      },
      {
        q: "Do I have to paste the prompts every time?",
        a: "No. Send the step 2 prompt once. It turns the guide into saved rules and a skill that new chats can use.",
      },
      {
        q: "Which legal research plugin is free?",
        a: "The CourtListener plugin from Free Law Project costs nothing. Claude still needs a paid plan to add connectors.",
      },
      {
        q: "If I use a plugin, can I skip checking the cases?",
        a: "No. A plugin pulls real cases, but you still open each one and match every quote before you file.",
      },
    ],
    updated: "2026-11-26",
  },
  {
    slug: "represent-yourself-in-court",
    title: "How to Represent Yourself in Court",
    seoTitle: "How to Represent Yourself in Court (Step by Step)",
    description:
      "A plain-English guide to representing yourself in court: reading your papers, tracking deadlines, organizing evidence, and preparing for your hearing.",
    intro:
      "Millions of people handle their own court cases every year, in divorce, custody, housing, debt, and small claims. Representing yourself is called appearing \"pro se\" or being a self-represented litigant. It is a lot of work, but it is manageable when you stay organized and take it one step at a time.",
    sections: [
      {
        heading: "1. Read every page you were given",
        paragraphs: [
          "Start with the papers that began the case: a summons, complaint, petition, or notice. Note who filed it, what they are asking the court to do, the case number, the court's name, and any date printed on the papers.",
        ],
      },
      {
        heading: "2. Find your deadlines first",
        paragraphs: [
          "Courts run on deadlines. Your papers usually say how long you have to respond, or when your first hearing is. The exact number of days depends on your state, your court, and how you were served, so check your court's rules or self-help center and put every date on a calendar the same day.",
        ],
      },
      {
        heading: "3. Learn which court rules apply",
        bullets: [
          "Your state's court rules (for example, civil procedure rules)",
          "Local rules for your county or court",
          "Any standing orders from your judge",
          "Official court forms, which some courts require instead of papers you write yourself",
        ],
      },
      {
        heading: "4. Organize your evidence",
        paragraphs: [
          "Keep one folder for everything: papers you received, papers you filed, letters, emails, texts, photos, receipts, and notes of what happened and when. Write a simple timeline. Judges look for facts backed by documents, not opinions.",
        ],
      },
      {
        heading: "5. Prepare your documents carefully",
        paragraphs: [
          "Court papers need the right caption, format, and contents. Use your court's forms when they exist. Keep sentences short and stick to facts you can prove. Always keep a copy of what you file and proof that you served it on the other side.",
        ],
      },
      {
        heading: "6. Prepare for the hearing",
        bullets: [
          "Know what you are asking the judge to do, in one or two sentences",
          "Bring copies of your key documents for the judge and the other side",
          "Practice explaining your timeline calmly and briefly",
          "Arrive early and follow the court's rules for in-person or video hearings",
        ],
      },
      {
        heading: "Where Ask AI Legal fits",
        paragraphs: [
          "Ask AI Legal is a private AI legal assistant installed on your own computer. It reads your court papers, puts dates on a calendar, keeps your case organized, researches the law with source links, and helps you prepare documents for your review. It is software, not a law firm, and it does not replace advice from a licensed attorney.",
        ],
      },
    ],
    faq: [
      {
        q: "Is it legal to represent yourself in court?",
        a: "Yes. In the United States, people have the right to represent themselves in most civil cases. A business usually must be represented by a lawyer, and rules differ for some types of cases, so check your court's rules.",
      },
      {
        q: "Where can I find my court's rules and forms?",
        a: "Most state courts have an official website with rules, forms, and a self-help center. Many courthouses also have a self-help or facilitator office and a law library.",
      },
      {
        q: "Can an AI tool represent me in court?",
        a: "No. AI software can help you understand and organize your case, but you are the one who files papers and speaks in court. For legal advice about your situation, talk to a licensed attorney.",
      },
    ],
    updated: "2026-10-19",
  },
  {
    slug: "court-deadline-tracker",
    title: "Court Deadline Tracker: Never Miss a Court Date",
    seoTitle: "Court Deadline Tracker for Self-Represented People",
    description:
      "How to track court deadlines and hearing dates when you handle your own case, and how a private court deadline tracker keeps every date in one place.",
    intro:
      "Missing a court deadline can mean losing a case without ever being heard. If you handle your own case, keeping track of every date is one of the most important jobs you have.",
    sections: [
      {
        heading: "Common court dates to track",
        bullets: [
          "The deadline to respond to a complaint, petition, or motion",
          "Hearing and trial dates",
          "Deadlines to file and serve documents before a hearing",
          "Deadlines to ask the court to reconsider, or to appeal a decision",
          "Dates set in court orders, such as when to exchange documents",
        ],
      },
      {
        heading: "How deadlines are counted",
        paragraphs: [
          "Courts count days in specific ways: some deadlines use calendar days, others use court days that skip weekends and court holidays, and some add extra days depending on how papers were served. The rules differ by state and court, so always check the rule that applies and write down where the deadline came from.",
        ],
      },
      {
        heading: "A simple system that works",
        bullets: [
          "Put every date on one calendar the day you learn about it",
          "Set reminders a week, three days, and one day before",
          "Note the rule or order that created each deadline",
          "Mark each task done only after you file and serve the paper",
        ],
      },
      {
        heading: "How Ask AI Legal tracks deadlines",
        paragraphs: [
          "When you upload your court papers, Ask AI Legal reads them and adds the dates it finds to your calendar, marked \"not checked yet\" until you confirm them. It shows reminders before each date, can add dates to your phone calendar, and helps count court days. Everything stays on your own computer.",
        ],
      },
    ],
    faq: [
      {
        q: "What happens if I miss a court deadline?",
        a: "It depends on the deadline and the court. Missing a response deadline can lead to a default judgment against you. If you missed one, check your court's rules right away and consider talking to a licensed attorney.",
      },
      {
        q: "Are court days and calendar days the same?",
        a: "No. Court days usually skip weekends and court holidays; calendar days count every day. Your court's rules say which applies to each deadline.",
      },
    ],
    updated: "2026-10-19",
  },
  {
    slug: "private-ai-legal-assistant",
    title: "Private AI Legal Assistant vs. Online Chatbots",
    seoTitle: "Private AI Legal Assistant vs. ChatGPT: What's Different",
    description:
      "What makes a private AI legal assistant different from pasting court papers into an online chatbot: where your documents are stored, privacy, and organization.",
    intro:
      "Many people paste their court papers into an online chatbot to understand them. That can help, but it raises real questions about where your private information goes and how your case stays organized over time.",
    sections: [
      {
        heading: "Where your documents live",
        paragraphs: [
          "With a typical online chatbot, your documents and conversation are stored on the company's servers. A private, installed legal assistant keeps your files, notes, and case history on your own computer.",
        ],
      },
      {
        heading: "Privacy before anything is sent",
        paragraphs: [
          "Ask AI Legal has a privacy mode that hides names and other personal details on your computer before a request goes to a connected AI service, then puts them back when the answer returns.",
        ],
      },
      {
        heading: "Built around your case, not one chat",
        bullets: [
          "Your case details, parties, and dates are saved and reused",
          "Uploaded papers are filed into a case folder",
          "Deadlines go on a calendar with reminders",
          "Research comes back with source links you can check",
          "Drafts are checked for citations and quotes before you see them",
        ],
      },
      {
        heading: "What it is not",
        paragraphs: [
          "A private AI legal assistant is software. It is not a law firm and does not give legal advice. You review everything it prepares and decide what to file.",
        ],
      },
    ],
    faq: [
      {
        q: "Is it safe to put court documents into ChatGPT?",
        a: "Online chatbots store what you share on their servers, under their own privacy policies. Review those policies, and avoid sharing private details you are not comfortable storing online.",
      },
      {
        q: "Does Ask AI Legal use ChatGPT or other AI models?",
        a: "Ask AI Legal connects to AI services you choose, such as OpenAI, Anthropic, or Google models, and can also use a model running on your own computer. Your files stay on your computer.",
      },
    ],
    updated: "2026-10-19",
  },
  {
    slug: "served-with-court-papers",
    title: "What to Do When You're Served With Court Papers",
    seoTitle: "Served With Court Papers? What to Do in the First 48 Hours",
    description:
      "Got served with a summons, complaint, or petition? A calm, step-by-step checklist for the first 48 hours: deadlines, reading your papers, and getting organized.",
    intro:
      "Being served with court papers is stressful, but ignoring them is the worst thing you can do. Here is a calm checklist for the first 48 hours.",
    sections: [
      {
        heading: "1. Don't ignore it",
        paragraphs: [
          "Court papers come with deadlines. If you do not respond in time, the other side may be able to win without you, through what is called a default.",
        ],
      },
      {
        heading: "2. Find the deadline",
        paragraphs: [
          "Look for a hearing date, or words like \"you must respond within\" a number of days. The time to respond depends on your state and how you were served. Write the date down today, somewhere you will see it.",
        ],
      },
      {
        heading: "3. Read every page",
        paragraphs: [
          "Note who filed the case, what they are asking the court to do, the case number, and the court. Papers often include several documents, such as a summons plus a complaint or petition.",
        ],
      },
      {
        heading: "4. Keep everything",
        paragraphs: [
          "Save the papers, the envelope, and a note of when and how you received them. Those details can matter later.",
        ],
      },
      {
        heading: "5. Check for official forms",
        paragraphs: [
          "Some courts require their own forms for a response. Check your court's website or self-help center before you write anything.",
        ],
      },
      {
        heading: "6. Get organized and ask for help early",
        paragraphs: [
          "Put your papers, dates, notes, and evidence in one place. Court self-help centers, law libraries, and legal aid programs can point you in the right direction, and a licensed attorney can advise you on your situation.",
        ],
      },
    ],
    faq: [
      {
        q: "How long do I have to respond after being served?",
        a: "It depends on your state, the type of case, and how you were served. Your papers usually state the deadline; your court's rules control. Check right away.",
      },
      {
        q: "Can I refuse to accept court papers?",
        a: "Refusing the papers usually does not stop the case. Courts have several ways to complete service, so it is better to read the papers and respond on time.",
      },
    ],
    updated: "2026-10-19",
  },
  {
    slug: "how-to-answer-a-summons",
    title: "How to Answer a Summons Without a Lawyer",
    seoTitle: "How to Answer a Summons Without a Lawyer",
    description:
      "Got a summons and complaint? How to write and file an answer on your own: responding to each paragraph, defenses, filing, and serving the other side.",
    intro:
      "A summons tells you a case has been filed against you. The complaint that comes with it says what the other side wants. Your answer is the paper that tells the court your side. Filing it on time keeps you in the case.",
    sections: [
      {
        heading: "1. Find your deadline to answer",
        paragraphs: [
          "The summons usually says how long you have to respond. The exact time depends on your state, your court, and how you were served. Put the date on your calendar today and work backward from it.",
        ],
      },
      {
        heading: "2. Check whether your court has an answer form",
        paragraphs: [
          "Many courts have a fill-in form for answers, especially for debt, eviction, and small claims cases. Some courts require their form. Check the court's website or self-help center before you write your own.",
        ],
      },
      {
        heading: "3. Respond to every numbered paragraph",
        paragraphs: [
          "Complaints are written in numbered paragraphs. Your answer goes through them in order. For each one, you usually say one of three things.",
        ],
        bullets: [
          "Admit: the statement is true",
          "Deny: the statement is false",
          "Without enough information to admit or deny, which courts usually treat as a denial",
        ],
      },
      {
        heading: "4. List your defenses",
        paragraphs: [
          "Defenses are reasons the other side should lose even if some facts are true. Examples are that the deadline to sue has passed, or that the debt was already paid. Some defenses are lost if you leave them out of your answer, so read your court's rules on what to include.",
        ],
      },
      {
        heading: "5. File it and serve a copy",
        bullets: [
          "Sign the answer and make copies",
          "File the original with the court clerk and pay the filing fee, or ask for a fee waiver if you qualify",
          "Send a copy to the other side or their lawyer, the way your court's rules allow",
          "File proof that you served it",
        ],
      },
      {
        heading: "Where Ask AI Legal fits",
        paragraphs: [
          "Ask AI Legal reads the complaint, lists every numbered paragraph, and puts your deadline on a calendar. It drafts an answer for you to review and checks each citation against its source. You decide what to admit, what to deny, and what to file.",
        ],
      },
    ],
    faq: [
      {
        q: "What happens if I don't answer a summons?",
        a: "The other side can usually ask the court for a default judgment, which means they may win without you being heard. If your deadline has passed, check your court's rules right away and consider talking to a licensed attorney.",
      },
      {
        q: "Is an answer the same as a motion to dismiss?",
        a: "No. An answer responds to the facts in the complaint. A motion to dismiss asks the court to end the case for a legal reason. Some people file a motion first, and court rules control the timing.",
      },
    ],
    updated: "2026-10-22",
  },
  {
    slug: "file-a-motion-without-a-lawyer",
    title: "How to File a Motion Without a Lawyer",
    seoTitle: "How to File a Motion Without a Lawyer (Pro Se Guide)",
    description:
      "A plain-English guide to filing a motion on your own: what a motion is, the parts it needs, setting a hearing, filing, and serving the other side.",
    intro:
      "A motion is a written request asking the judge to do something. It might ask for more time, ask the judge to order the other side to hand over documents, or ask the court to change an order. Courts expect motions to follow a set format.",
    sections: [
      {
        heading: "The parts of a motion",
        bullets: [
          "The caption: court name, case name, case number, and document title",
          "What you are asking for, stated in one or two sentences",
          "The facts, told in order and backed by documents",
          "The rule or law that allows the court to grant it",
          "A sworn statement, called a declaration or affidavit, if the court needs facts proved",
          "A proposed order the judge can sign, if your court requires one",
        ],
      },
      {
        heading: "Check your court's rules first",
        paragraphs: [
          "Courts set page limits, font size, margins, and how far ahead you must file before a hearing. Many local rules also say how to schedule the hearing. Some courts have official motion forms for common requests. Read these rules before you start writing.",
        ],
      },
      {
        heading: "Set the hearing",
        paragraphs: [
          "Most motions are decided at a hearing, or on the papers by a set date. Your court's rules or the clerk's office explain how to get a date. Write the date and the filing deadline that comes with it on your calendar.",
        ],
      },
      {
        heading: "File and serve",
        bullets: [
          "File the motion and supporting papers with the clerk",
          "Serve copies on every other party, the way your court's rules allow",
          "File proof of service",
          "Watch for the other side's response, and check whether you may file a reply",
        ],
      },
      {
        heading: "Where Ask AI Legal fits",
        paragraphs: [
          "Ask AI Legal drafts the motion, the declaration, and the proposed order from your case files. It formats the caption, marks any citation it cannot verify, and puts the hearing and filing dates on your calendar. You review every page before anything is filed.",
        ],
      },
    ],
    faq: [
      {
        q: "Do I have to go to a hearing for my motion?",
        a: "It depends on the court and the type of motion. Some are decided at a hearing and some on the papers alone. Your court's rules or the clerk can tell you which applies.",
      },
      {
        q: "Can I file a motion if I am representing myself?",
        a: "Yes. People who represent themselves can file motions. Courts generally expect them to follow the same rules lawyers follow.",
      },
    ],
    updated: "2026-10-22",
  },
  {
    slug: "respond-to-an-eviction-notice",
    title: "How to Respond to an Eviction Notice",
    seoTitle: "How to Respond to an Eviction Notice (Tenant Guide)",
    description:
      "Got an eviction notice or eviction papers? What the notice means, how it differs from a court case, deadlines, and how to file a response on time.",
    intro:
      "An eviction notice and an eviction lawsuit are two different things. A notice is a letter from the landlord. A lawsuit is a case filed in court. Knowing which one you have tells you what to do next.",
    sections: [
      {
        heading: "1. Figure out which paper you have",
        bullets: [
          "A notice to pay rent, fix a problem, or move out, sent by the landlord",
          "A summons and complaint, which means a court case has been filed",
          "A court order or writ, which means the court has already ruled",
        ],
      },
      {
        heading: "2. Know who can make you leave",
        paragraphs: [
          "In most states, a landlord has to go through the court to evict a tenant. Changing the locks, removing your belongings, or shutting off utilities without a court order is generally not allowed. Your state's landlord-tenant law controls.",
        ],
      },
      {
        heading: "3. Find your deadline",
        paragraphs: [
          "Eviction cases move fast. The time to respond is often much shorter than in other cases. Read the papers for a hearing date or response deadline and put it on your calendar today.",
        ],
      },
      {
        heading: "4. File your response",
        paragraphs: [
          "Many courts have an official eviction answer form. Use it if your court has one. List your reasons, such as rent that was paid, repairs the landlord did not make, or a notice that was not given correctly. File it with the clerk and serve the landlord.",
        ],
      },
      {
        heading: "5. Bring proof to the hearing",
        bullets: [
          "Your lease",
          "Rent receipts, bank records, or money order stubs",
          "Photos of the unit and any repair problems",
          "Texts, emails, and letters with the landlord",
        ],
      },
      {
        heading: "Where Ask AI Legal fits",
        paragraphs: [
          "Ask AI Legal reads the notice or complaint, finds the dates, and builds a timeline from your lease, receipts, and messages. It drafts your response for you to review and lists the documents to bring to court. Many areas also have free tenant legal aid, and it is worth calling them early.",
        ],
      },
    ],
    faq: [
      {
        q: "Does an eviction notice mean I have to move out right away?",
        a: "Usually not. A notice is the landlord's first step. In most states only a court can order you to leave, after a case is filed and decided. Read your notice carefully and check your state's rules.",
      },
      {
        q: "What if I miss my eviction hearing?",
        a: "The court may rule for the landlord without hearing from you. If you missed it, contact the court clerk right away and ask what options your court allows.",
      },
    ],
    updated: "2026-10-22",
  },
  {
    slug: "proof-of-service",
    title: "What Is Proof of Service and How Do You File It?",
    seoTitle: "Proof of Service: What It Is and How to File It",
    description:
      "Proof of service shows the court the other side got your papers. Who can serve, the common ways to serve, and how to fill out and file a proof of service.",
    intro:
      "Every paper you file usually has to be delivered to the other side too. Proof of service is the form that tells the court you did it, when, and how. Without it, a judge may not act on your papers.",
    sections: [
      {
        heading: "Who can serve papers",
        paragraphs: [
          "Rules differ by state and by type of paper. For the papers that start a case, many courts require service by an adult who is not a party, a sheriff, or a process server. For later papers, many courts allow service by mail or electronically. Check your court's rules.",
        ],
      },
      {
        heading: "Common ways to serve",
        bullets: [
          "Handing the papers to the person",
          "Mailing them to the person's address or their lawyer's address",
          "Sending them by email or through the court's e-filing system, where the rules allow it",
        ],
      },
      {
        heading: "What the proof of service says",
        bullets: [
          "The name of each document served",
          "Who received it, and at what address or email",
          "The date and method of service",
          "The name and signature of the person who served it, often under penalty of perjury",
        ],
      },
      {
        heading: "File it with the court",
        paragraphs: [
          "File the proof of service with the clerk, usually soon after service. Many courts have an official form for it. Keep a copy with your case papers.",
        ],
      },
      {
        heading: "Where Ask AI Legal fits",
        paragraphs: [
          "Ask AI Legal fills in the proof of service from your case details, lists every document you served, and keeps a record of who got what and when. You check it, sign it, and file it.",
        ],
      },
    ],
    faq: [
      {
        q: "Can I serve the papers myself?",
        a: "For papers that start a case, many courts do not allow a party to serve them. For later papers, such as motions, parties often can serve by mail or email. Your court's rules decide.",
      },
      {
        q: "What if the other side has a lawyer?",
        a: "Once the other side has a lawyer in the case, papers usually go to the lawyer instead of the person. Check the lawyer's address on their filings.",
      },
    ],
    updated: "2026-10-22",
  },
]

export function getGuide(slug: string): Guide | null {
  return GUIDES.find((g) => g.slug === slug) ?? null
}
