/**
 * Helper function for GET Request
 *
 * @param {string} url the URL to fecth
 * @returns {Promise<T>} A Promise of type T
 */
export async function Get<T>(url: string): Promise<T> {
  return new Promise<T>(async (resolve, reject) => {
    try {
      const response = await fetch(url, { method: 'GET' });
      if (response.ok) {
        const result = await <T>response.json();
        resolve(result);
      }
      else {
        console.error(`[${response.status}] Failed to fetch data from ${url}`);
      }
    }
    catch (error) {
      console.error('An error occurred:', error);
    }
    reject(null);
  });
}

/**
 *
 * @param url the URL to post a request to
 * @returns
 */
export async function Post<T, JSON>(url: string, data: JSON): Promise<T> {
  console.debug(`[POST] ${url}`, data);
  return new Promise<T>(async (resolve, reject) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        const result = await response.json();
        resolve(result);
      }
      else {
        console.error(`[${response.status}] Failed to fetch data from ${url}`);
        reject(await response.json());
      }
    }
    catch (error) {
      console.error('An error occured:', error);
      reject(error);
    }
  });
}

export async function Put<T, JSON>(url: string, data: JSON|undefined = undefined): Promise<T> {
  console.debug(`[PUT] ${url}`, data);
  return new Promise<T>(async (resolve, reject) => {
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        const result = await response.json();
        resolve(result);
      }
      else {
        console.error(`[${response.status}] Failed to fetch data from ${url}`);
        reject(await response.json());
      }
    }
    catch (error) {
      console.error('An error occured:', error);
      reject(error);
    }
  });
}

/**
 *
 * @param url the URL to post a request to
 * @returns
 */
export async function Delete<T, JSON>(url: string, data: JSON|undefined = undefined): Promise<Blob> {
  console.debug(`[DELETE] ${url}`, data);
  return new Promise<Blob>(async (resolve, reject) => {
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        console.log( "DELETE RESPONSE", response)
        const result = await response.blob();
        resolve(result);
      }
      else {
        console.error(`[${response.status}] Failed to fetch data from ${url}`);
        reject(await response.json());
      }
    }
    catch (error) {
      console.error('An error occured:', error);
      reject(error);
    }
  });
}


