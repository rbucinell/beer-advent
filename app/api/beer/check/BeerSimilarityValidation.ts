import { IBeer } from "@/app/models/beer";

export type BeerSimilarityValidation = {
    jaroWinkler: JaroWinklerResults;
    gemini: GeminiSimilaryResults;
    isTooSimilar: boolean;
    beer?:IBeer;
}

export type JaroWinklerResults = {
    percentage: JaroWinklerResultsSimilarty;
}

export type JaroWinklerResultsSimilarty = {
    beer: number,
    brewer: number
}

export type GeminiSimilaryResults = {
    percentage: number,
    beer: string|null,
    brewer: string|null
}