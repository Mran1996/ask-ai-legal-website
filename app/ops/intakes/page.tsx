import { redirect } from "next/navigation"

/** The intakes list became the Matters panel on the ops dashboard. */
export default function OpsIntakesPage() {
  redirect("/ops")
}
