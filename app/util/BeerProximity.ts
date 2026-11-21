import Beer, { IBeer } from "@/app/models/beer";
import jaroWinkler from "jaro-winkler";
import { BeerSimilarityValidation, GeminiSimilaryResults } from "../api/beer/check/BeerSimilarityValidation";
import { askAI } from "@/lib/gemini";
import appConfig from "../app.config";

const SHORTLIST_SIZE = 10;

export async function beerTooSimilar(beerName: string, brewerName: string): Promise<BeerSimilarityValidation> {
  const thresholds = appConfig.similarityThresholds;

  // only fetch the fields you need, as plain objects
  const existingBeers = await Beer.find({}, { beer: 1, brewer: 1 }).lean<IBeer[]>();

const normalize = (s?: string) =>
  (s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .replace(/[^a-z0-9 ]/g, " ")     // punctuation -> space
    .replace(/\s+/g, " ")
    .trim();

const nBeer = normalize(beerName);
const nBrewer = normalize(brewerName);

const comparisons = existingBeers
  .map((existing) => ({
    beerSimilarity: jaroWinkler(normalize(existing.beer), nBeer),
    brewerSimilarity: jaroWinkler(normalize(existing.brewer), nBrewer),
    beer: existing,
  }))
  .sort((a, b) => b.beerSimilarity - a.beerSimilarity);

  const closest = comparisons[0];
  if (!closest) {
    // empty table: nothing to compare against (adjust the type to allow beer?: IBeer)
    return {
      jaroWinkler: { percentage: { beer: 0, brewer: 0 } },
      gemini: { percentage: 0, beer: null, brewer: null },
      beer: undefined,
      isTooSimilar: false,
    } as unknown as BeerSimilarityValidation;
  }

  // per-row check, so beer and brewer scores come from the same existing beer
  const fuzzyHit = comparisons.some(
    (c) => c.beerSimilarity >= thresholds.beer && !!brewerName && c.brewerSimilarity < thresholds.brewer
  );

  // skip the AI call entirely if the cheap check already decided
  const gemini: GeminiSimilaryResults = fuzzyHit
    ? { percentage: 0, beer: null, brewer: null }
    : await beerTooSimilarAiCheck(comparisons.slice(0, SHORTLIST_SIZE).map((c) => c.beer), beerName, brewerName);

  return {
    jaroWinkler: { percentage: { beer: closest.beerSimilarity, brewer: closest.brewerSimilarity } },
    gemini,
    beer: closest.beer,
    isTooSimilar: fuzzyHit || gemini.percentage >= thresholds.beer,
  };
}

async function beerTooSimilarAiCheck( candidates: IBeer[], beerName: string, brewerName: string ): Promise<GeminiSimilaryResults> {
  const empty = { percentage: 0, beer: null, brewer: null };
  if (!candidates.length) return empty;

  const list = candidates.map((b) => `- ${b.beer} by ${b.brewer}`).join("\n");
  console.log( list );
  const prompt = `Existing beers:
    ${list}

    Is "${beerName}" by "${brewerName}" the same beer as any of these (allowing for typos, abbreviations, or renamed brewers)?
    Reply with JSON only: {"percentage": number between 0 and 1, "beer": string|null, "brewer": string|null}
    Use the closest existing entry for beer/brewer, or null for both if percentage is 0.`;

  try {
    const answer = await askAI(prompt, {
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 0, includeThoughts: false}, // Gemini 3 models: { thinkingLevel: "low" } instead
    });
    const parsed = JSON.parse(answer ?? "{}");
    const percentage = Number(parsed.percentage);
    return {
      percentage: Number.isFinite(percentage) ? Math.min(Math.max(percentage, 0), 1) : 0,
      beer: parsed.beer ?? null,
      brewer: parsed.brewer ?? null,
    };
  } catch (err) {
    console.error("Gemini similarity check failed:", err); // don't swallow silently
    return empty; // fail open: fuzzy check still applies
  }
}