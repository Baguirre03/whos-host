type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

const API_CONFIG = {
  PROD: "PROD URL",
  LOCAL: "http://localhost:3001",
};

async function fetchApi<T>(
  PROD: boolean,
  method: HttpMethod,
  route: string,
  data?: object
): Promise<T> {
  const baseUrl = PROD ? API_CONFIG.PROD : API_CONFIG.LOCAL;
  const URL = `${baseUrl}/${route}`;

  try {
    const response = await fetch(URL, {
      mode: "cors",
      method: method,
      ...(data && {
        body: JSON.stringify(data),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      }),
    });
    if (!response.ok) {
      throw new Error(`Error code: ${response.status}`);
    }
    return await response.json();
  } catch (err: unknown) {
    throw err;
  }
}

async function getter<T>(PROD: boolean, route: string): Promise<T> {
  return fetchApi(PROD, "GET", route);
}

async function post<T>(PROD: boolean, route: string, data: object): Promise<T> {
  return fetchApi(PROD, "POST", route, data);
}

async function edit<T>(PROD: boolean, route: string, data: object): Promise<T> {
  return fetchApi(PROD, "PUT", route, data);
}

async function remove<T>(PROD: boolean, route: string): Promise<T> {
  return fetchApi(PROD, "DELETE", route);
}

/**
 * Example of usage:
 * interface UserData {
 *  name: string;
 *  age: number;
 * }
 *
 * const userData = await getter<UserData>(true, "users");
 *
 *
 *
 *
 */

export { getter, post, edit, remove };
