import { IBeer } from "@/app/models/beer";

export type BeerSimilarityValidation = {
    isTooSimilar: boolean;
    beer?:IBeer;
}