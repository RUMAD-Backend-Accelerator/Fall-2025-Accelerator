// npm i axios
import axios from "axios";

export async function getCountryByNameAxios(name, { fullText = true } = {}) {
  const request = {
    method: "GET",
    url: `https://restcountries.com/v3.1/name/${encodeURIComponent(name)}`,
    // Let axios build the query string for us
    params: fullText ? { fullText: "true" } : {},
    headers: { Accept: "application/json" },
  };

  // WAITS for the Promise to resolve (success/failure)
  // in this case, the Promise is returned by axios.request()
  const response = await axios.request(request); 
  const data = response.data;

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("No country found.");
  }
  return data[0];
}

(async () => {
  console.clear();
  try {
    const country = await getCountryByNameAxios("South Africa");
    console.log({
      name: country.name.common,
      capital: country.capital?.[0],
      population: country.population,
      currencyCodes: Object.keys(country.currencies || {}),
    });
  } catch (e) {
    console.error(e.response?.data || e.message);
  }
})();

function foo() {
  
  return 0;
}

// synchronous function (default kind of function)
foo() // will run, and when it's running, execution won't move onto the next block

// await is used before async functions, or execution will move onto the next
// line of code without waiting for the Promise to resolve.