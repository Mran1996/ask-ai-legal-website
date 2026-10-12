/** Balanced Ask AI Legal vs. attorney comparison — /pricing shows all rows, the homepage a short version. */
export const COMPARISON = {
  title: "Compare the cost and the responsibilities.",
  intro:
    "Ask AI Legal and hiring an attorney provide different services. Compare what you pay, what is included, and who is responsible for the work.",
  columns: ["Ask AI Legal", "Hiring an attorney"] as const,
  /** Owner-supplied typical retainer range (Oct 2026). Keep the "varies" wording with it. */
  visual: {
    attorney: {
      label: "Hiring an attorney",
      price: "$5,000–$10,000+",
      unit: "Typical upfront retainer",
      detail:
        "Often billed hourly against the retainer, and more may be requested as the case goes on. Actual fees vary by attorney, location, and matter.",
    },
    ours: {
      label: "Ask AI Legal",
      price: "$3,997",
      unit: "One-time purchase",
      detail: "Software, installation, and onboarding. Optional maintenance is $125/month — no hourly billing.",
    },
  },
  rows: [
    {
      label: "Upfront cost",
      ours: "$3,997 for software, installation, and onboarding",
      attorney: "Retainers often start around $5,000–$10,000 or more, depending on the attorney and matter",
      short: true,
    },
    {
      label: "Ongoing costs",
      ours: "Optional $125/month maintenance, plus any separate third-party charges",
      attorney: "May involve hourly billing, a flat fee, or another agreed arrangement",
      short: false,
    },
    {
      label: "Who does the work",
      ours: "You operate the workspace, review drafts, and direct your work",
      attorney: "The attorney provides the advice and representation covered by the engagement",
      short: true,
    },
    {
      label: "Documents and visibility",
      ours: "Access your documents and drafts in your installed workspace",
      attorney: "Document access and communication arrangements vary by firm",
      short: false,
    },
    {
      label: "Responsibility",
      ours: "You remain responsible for checking sources, deadlines, and filings",
      attorney: "Responsibilities are defined by the attorney-client engagement",
      short: true,
    },
  ],
  note: "Software is not legal representation. These options are not interchangeable, and you may choose to use Ask AI Legal alongside an attorney.",
  tagline: "Know what you’re paying. See your work. Stay involved in your case.",
} as const
