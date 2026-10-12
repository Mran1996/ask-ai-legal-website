/** Balanced Ask AI Legal vs. attorney comparison — /pricing shows all rows, the homepage a short version. */
export const COMPARISON = {
  title: "Compare the cost and the responsibilities.",
  intro:
    "Ask AI Legal and hiring an attorney provide different services. Compare what you pay, what is included, and who is responsible for the work.",
  columns: ["Ask AI Legal", "Hiring an attorney"] as const,
  rows: [
    {
      label: "Upfront cost",
      ours: "$3,997 for software, installation, and onboarding",
      attorney: "Fees depend on the attorney, matter, and engagement",
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
