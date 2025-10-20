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
    const japan = await getCountryByNameAxios("Sudan");
    console.log({
      name: japan.name.common,
      capital: japan.capital?.[0],
      population: japan.population,
      currencyCodes: Object.keys(japan.currencies || {}),
    });
  } catch (e) {
    console.error(e.response?.data || e.message);
  }
})();
