import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const html = readFileSync("out/index.html", "utf8");
const renderedIds = [...html.matchAll(/data-google-review-id="([^"]+)"/g)].map((match) => match[1]);
assert.equal(renderedIds.length, 8, "All eight Google reviews must be rendered, not only the API selection of five.");

const snapshot = JSON.parse(readFileSync("content/googleReviews.json", "utf8"));
assert.equal(snapshot.total, 8);
assert.equal(snapshot.reviews.length, snapshot.total);
assert.equal(new Set(snapshot.reviews.map((review) => review.id)).size, snapshot.total);
assert.deepEqual(renderedIds, snapshot.reviews.map((review) => review.id));
assert.deepEqual(snapshot.reviews.slice(0, 3).map((review) => review.author), ["Matan Shlomi", "שלו אלימלך", "בנימין אביטל"]);
for (let index = 0; index < snapshot.reviews.length; index += 1) {
  const review = snapshot.reviews[index];
  assert.equal(review.rating, 5);
  assert.ok(review.text.trim().length > 0);
  assert.ok(review.text.trim().split(/\s+/).length <= 22, "Use a short faithful excerpt and link to the full Google original.");
  assert.match(review.authorUri, /^https:\/\/www\.google\.com\/maps\/contrib\//);
  if (index > 0) assert.ok(snapshot.reviews[index - 1].sourceLength >= review.sourceLength);
}
assert.equal(snapshot.rating, snapshot.reviews.reduce((sum, review) => sum + review.rating, 0) / snapshot.total);

function checkClientBundles(directory) {
  for (const entry of readdirSync(directory, {withFileTypes:true})) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) checkClientBundles(path);
    else if (entry.name.endsWith(".js")) {
      assert.ok(!readFileSync(path, "utf8").includes("/api/reviews"), "The live API must not replace the complete manual review snapshot.");
    }
  }
}
checkClientBundles("out/_next/static");
console.log("Google reviews check passed: all eight reviews, detailed reviews first, manual source preserved.");
