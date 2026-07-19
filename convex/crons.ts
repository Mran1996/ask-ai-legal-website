import { cronJobs } from "convex/server"
import { internal } from "./_generated/api"

const crons = cronJobs()

// Operator deadline reminders: 7 / 3 / 1 days out + overdue, once per window.
crons.daily(
  "deadline reminders",
  { hourUTC: 14, minuteUTC: 0 }, // ~6-7am Pacific
  internal.deadlines.sendDueReminders,
  {}
)

export default crons
