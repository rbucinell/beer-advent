import Beer, { IBeer } from "@/app/models/beer";
import jaroWinkler from 'jaro-winkler';
import { BeerSimilarityValidation } from "../api/beer/check/BeerSimilarityValidation";


export async function beerTooSimilar( beerName: string, brewerName: string, options: { beerThreshold?: number, brewerThreshold?: number} = {} ): Promise<BeerSimilarityValidation> {
    console.log( beerName, brewerName )
    if( !options.beerThreshold ) options.beerThreshold = .85;
    if( !options.brewerThreshold ) options.brewerThreshold = .65;

    const existingBeers:IBeer[] = await Beer.find();
        const comparisons = existingBeers.map( (existingBeer:IBeer) => {
            return { 
                beerSimilarity:jaroWinkler(existingBeer.beer || '', beerName || ''),
                brewerSimiliatriy: jaroWinkler(existingBeer.brewer || '', brewerName || ''),
                // beerAdvocateSimiliatriy: jaroWinkler(existingBeer.beeradvocate || '', beer.beeradvocate || ''),
                beer:existingBeer,
            }
        });
        comparisons.sort( (a,b) => b.beerSimilarity - a.beerSimilarity );        
        const closestComp:IBeer = comparisons[0].beer;
        console.log( closestComp );
        if( Math.max(...comparisons.map( b => b.beerSimilarity)) >= options.beerThreshold)
        {
            if( brewerName ){
                if( Math.max(...comparisons.map( b => b.brewerSimiliatriy)) < options.brewerThreshold ) {
                    return { isTooSimilar: false };
                }
            }
            return { isTooSimilar: true, beer: closestComp };
        }
    return { isTooSimilar: false };
}