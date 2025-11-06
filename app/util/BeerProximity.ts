import Beer, { IBeer } from "@/app/models/beer";
import jaroWinkler from 'jaro-winkler';
import { BeerSimilarityValidation, GeminiSimilaryResults } from "../api/beer/check/BeerSimilarityValidation";
import { askAI } from "@/lib/gemini";
import appConfig from "../app.config";

type Thresholds = {
    beer:number,
    brewer:number
}

export async function beerTooSimilar( beerName: string, brewerName: string ): Promise<BeerSimilarityValidation> {

    const thresholds:Thresholds = appConfig.similarityThresholds;

    const existingBeers:IBeer[] = await Beer.find();
    const comparisons = existingBeers.map( (existingBeer:IBeer) => {
        return { 
            beerSimilarity:jaroWinkler(existingBeer.beer || '', beerName || ''),
            brewerSimiliatriy: jaroWinkler(existingBeer.brewer || '', brewerName || ''),
            beer:existingBeer
        }
    });
    comparisons.sort( (a,b) => b.beerSimilarity - a.beerSimilarity );   
    const closestComparison = comparisons[0];
    const closestBeer:IBeer = closestComparison.beer;

    const results = {
        jaroWinkler: {
            percentage: {
                beer: closestComparison.beerSimilarity,
                brewer: closestComparison.brewerSimiliatriy
            }
        },
        gemini: await beerTooSimilarAiCheck( existingBeers, beerName, brewerName ),
        beer: closestBeer,
        isTooSimilar: false
    };
    
    if( Math.max(...comparisons.map( b => b.beerSimilarity)) >= thresholds.beer )
    {
        if( brewerName ){
            if( Math.max(...comparisons.map( b => b.brewerSimiliatriy)) < thresholds.brewer ) {
                results.isTooSimilar = true;
            }
        }
    }
    if( results.gemini.percentage >= thresholds.beer ){
        results.isTooSimilar = true;
    }
    return results;
}




async function beerTooSimilarAiCheck ( 
    existingBeers:IBeer[], beerName: string, brewerName: string ): Promise<GeminiSimilaryResults> {
    
        let percentage = 0.0;
    let beer = null;
    let brewer = null;
    
    try{
        const summary = existingBeers.map( (b:IBeer) => `${b.beer} by ${b.brewer}`).join(',');
        const prompt = `Give the following comma seperated list of beers and the brewer: ${summary} . What is the likely hood that ${beerName} by ${brewerName} is in that list. Your only anser should only be: percentage,beer,brewer. Where  percentage of likelyhood that the beer is in the list as a digit: e.g. 20% => 0.2, beer and brewer are the most likely candidate that alread exists in the list, null for each if percentage is 0.0`;
        const answer = await askAI( prompt );
        if( answer ){
            const split = answer.split(',');
            percentage = parseFloat(split[0]);
            beer = split[1];
            brewer = split[2];
        }
    }
    catch( err ) {}

    return { percentage, beer, brewer };
}