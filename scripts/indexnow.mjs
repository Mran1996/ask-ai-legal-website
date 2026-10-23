// Tells Bing and other IndexNow search engines that askailegal.com changed.
// Run after a deploy is live:  node scripts/indexnow.mjs
const HOST = "askailegal.com"
const KEY = "51832b05c79962413204ea3fd25023c9"

const sitemap = await (await fetch(`https://${HOST}/sitemap.xml`)).text()
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
})
console.log(`IndexNow: ${res.status} ${res.statusText} (${urlList.length} URLs)`)
