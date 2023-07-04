export type FoodDealsApiResult<T> = {
    result: T;
    statusCode: number;
}

export const callInternalApi = async <T>(url: string, method = "GET", body?: any): Promise<FoodDealsApiResult<T>> => {
    const response = await fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    const data = await response.json();
    return data;
}