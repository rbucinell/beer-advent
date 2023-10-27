/**
 * Helper function for GET Request 
 * 
 * @param {string} url the URL to fecth
 * @returns {Promise<T>} A Promise of type T
 */
export async function Get<T>( url:string ): Promise<T> {
    console.debug(`GET: ${url}`)
    return new Promise<T>( async (resolve, reject) => {
        try {
            const response = await fetch( url, { method: 'GET' });
            if( response.ok ) {
                const result = await <T>response.json();
                console.debug(result);
                resolve(result);
            }
            else{
                console.error(`[${response.status}] Failed to fetch data from ${url}`);
            }
        }
        catch( error ){
            console.error( 'An error occurred:', error );            
        }
        reject(null);
    });
}

/**
 * 
 * @param url the URL to post a request to
 * @returns 
 */
export async function Post<T,V>( url:string, data: V): Promise<T> {
    console.debug(`POST ${url}`);
    return new Promise<T>( async(resolve, reject) => {
        try {
            resolve('Function not implemented yet' as T);
        }
        catch( error ) {
            console.error('An error occured:',error );
        }
        reject(null);
    });
}
