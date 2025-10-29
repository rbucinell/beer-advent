import Beer, { IBeer } from "@/app/models/beer";
import jaroWinkler from 'jaro-winkler';
import { BeerSimilarityValidation } from "../api/beer/check/BeerSimilarityValidation";
import { askAI } from "@/lib/gemini";


export async function beerTooSimilar( beerName: string, brewerName: string, options: { beerThreshold?: number, brewerThreshold?: number} = {} ): Promise<BeerSimilarityValidation> {
    console.log( 'Checking',beerName,'by',brewerName );

    if( !options.beerThreshold ) options.beerThreshold = .85;
    if( !options.brewerThreshold ) options.brewerThreshold = .65;

    const existingBeers:IBeer[] = await Beer.find();
    const comparisons = existingBeers.map( (existingBeer:IBeer) => {
        return { 
            beerSimilarity:jaroWinkler(existingBeer.beer || '', beerName || ''),
            brewerSimiliatriy: jaroWinkler(existingBeer.brewer || '', brewerName || ''),
            // beerAdvocateSimiliatriy: jaroWinkler(existingBeer.beeradvocate || '', beer.beeradvocate || ''),
            beer:existingBeer
        }
    });
    comparisons.sort( (a,b) => b.beerSimilarity - a.beerSimilarity );   
    const closestComparison = comparisons[0];
    const closestBeer:IBeer = closestComparison.beer;
    console.log( closestBeer );


    const summary = existingBeers.map( (b:IBeer) => `${b.beer} by ${b.brewer}`).join(',');
    const prompt = `Give the following comma seperated list of beers and the brewer: ${summary} . What is the likely hood that ${beerName} by ${brewerName} is in that list. Your only anser should only be: percentage,beer,brewer. Where  percentage of likelyhood that the beer is in the list as a digit: e.g. 20% => 0.2, beer and brewer are the most likely candidate that alread exists in the list, null for each if percentage is 0.0`;
    const answer = await askAI( prompt );
    const [ aiPercentage, aiBeer, aiBrewer ]= answer?.split(',') ?? [0.0,null,null];

    const results = {
        jaroWinkler: {
            percentage: {
                beer: closestComparison.beerSimilarity,
                brewer: closestComparison.brewerSimiliatriy
            }
        },
        gemini:{
            percentage: parseFloat(`${aiPercentage ?? "0.0"}`),
            beer: aiBeer === "null" ? null: `${aiBeer}`,
            brewer: aiBrewer === "null" ? null: `${aiBrewer}`
        },
        beer: closestBeer,
        isTooSimilar: false
    };
    //results.isTooSimilar = 
    if( Math.max(...comparisons.map( b => b.beerSimilarity)) >= options.beerThreshold)
    {
        if( brewerName ){
            if( Math.max(...comparisons.map( b => b.brewerSimiliatriy)) < options.brewerThreshold ) {
                results.isTooSimilar = true;
            }
        }
    }
    if( results.gemini.percentage >= options.beerThreshold ){
        results.isTooSimilar = true;
    }
    return results;
}