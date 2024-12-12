export async function fetcher(...args) {
    const response = await fetch(...args);
    return response.json();
}