const fs = require("fs");

async function run() {
  const res = await fetch("https://www.nfl.com/standings/", {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });
  const html = await res.text();
  fs.writeFileSync("scripts/nfl-standings.html", html);
  console.log("Saved nfl-standings.html, length:", html.length);

  const nextMatch = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
  if (nextMatch) {
    fs.writeFileSync("scripts/next-data.json", nextMatch[1]);
    console.log("Saved next-data.json");
  } else {
    console.log("No NEXT_DATA found.");
  }
}

run().catch(console.error);
