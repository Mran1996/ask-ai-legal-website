import { redirect } from "next/navigation"

/** No "page not found" screen: any unknown or old link goes straight to the home page. */
export default function NotFound() {
  redirect("/")
}
