type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

const API_CONFIG = {
  PROD: "PROD URL",
  LOCAL: "http://localhost:3001",
};

async function fetchApi<T>(
  method: HttpMethod,
  route: string,
  data?: object
): Promise<T> {
  const baseUrl =
    process.env.PROD == "true" ? API_CONFIG.PROD : API_CONFIG.LOCAL;
  const URL = `${baseUrl}/${route}`;
  try {
    const response = await fetch(URL, {
      mode: "cors",
      method: method,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
        "Content-type": "application/json; charset=UTF-8",
      },
      // if data is provided, add it to the request
      ...(data && {
        body: JSON.stringify(data),
      }),
    });

    return await response.json();
  } catch (err: unknown) {
    throw err;
  }
}

async function getter<T>(route: string): Promise<T> {
  return fetchApi("GET", route);
}

async function post<T>(route: string, data: object): Promise<T> {
  return fetchApi("POST", route, data);
}

async function edit<T>(route: string, data: object): Promise<T> {
  return fetchApi("PUT", route, data);
}

async function remove<T>(route: string): Promise<T> {
  return fetchApi("DELETE", route);
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
