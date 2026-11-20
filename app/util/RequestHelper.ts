/**
 * Helper function for GET Request
 *
 * @param {string} url the URL to fecth
 * @returns {Promise<T>} A Promise of type T
 */

export async function Get<T>(url: string): Promise<T> {
  const response = await fetch(url, { method: "GET" });
  if (!response.ok) {
    throw new Error(`[${response.status}] Failed to fetch data from ${url}`);
  }
  return (await response.json()) as T;
}
async function request<T>(url: string, method: string, data?: unknown): Promise<T> {
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: data === undefined ? undefined : JSON.stringify(data),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw body ?? new Error(`[${response.status}] ${method} ${url} failed`);
  }
  return (await response.json()) as T;
}

export const Post = <T, D>(url: string, data: D) => request<T>(url, "POST", data);
export const Put = <T, D>(url: string, data?: D) => request<T>(url, "PUT", data);

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


