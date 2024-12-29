async function getter(PROD: boolean, route: string) {
  const URL: string = !PROD ? `http://localhost:3001/${route}` : "NULL";
  try {
    const response = await fetch(URL, {
      mode: "cors",
      method: "GET",
    });
    const data = await response.json();
    return data;
  } catch (err: unknown) {
    console.log(err);
  }
}

async function post(PROD: boolean, route: string, data: object) {
  const URL = PROD ? `http://localhost:3001/${route}` : "NULL";
  console.log(URL);
  try {
    const response = await fetch(URL, {
      mode: "cors",
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    const res = await response.json();
    return res;
  } catch (err: unknown) {
    console.log(err);
  }
}

export { getter, post };
