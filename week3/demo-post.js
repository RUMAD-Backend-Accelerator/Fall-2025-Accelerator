const BASE = "https://restcountries.com/v3.1";

// Return the first matching country object for a given name
export async function getCountryByName(name, { fullText = true } = {}) {
  const url = `${BASE}/name/${encodeURIComponent(name)}${fullText ? "?fullText=true" : ""}`;
  const res = await fetch(url);

  if (!res.ok) {
    // 404 if not found, etc.
    const text = await res.text();
    throw new Error(`Request failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("No country found.");
  }
  return data[0]; // first match
}

// Pick some fields to demo
export function summarizeCountry(c) {
  return {
    name_common: c?.name?.common,
    name_official: c?.name?.official,
    capital: c?.capital?.[0] ?? null,
    region: c?.region,
    subregion: c?.subregion,
    population: c?.population,
    currencies: c?.currencies ? Object.values(c.currencies).map(x => x.name).join(", ") : null,
    languages: c?.languages ? Object.values(c.languages).join(", ") : null,
    cca2: c?.cca2,
    cca3: c?.cca3,
    flag_png: c?.flags?.png,
  };
}

// Driver function for demo purposes
(async () => {
  try {
    console.clear();
    
    const japan = await getCountryByName("Japan"); // GET https://restcountries.com/v3.1/name/Japan?fullText=true
    console.log("Raw object:", japan);             // full payload
    console.log("Summary:", summarizeCountry(japan));

    // Another example (partial match allowed if fullText=false):
    const congo = await getCountryByName("Congo", { fullText: false });
    console.log("Congo (first match) summary:", summarizeCountry(congo));
  } catch (err) {
    console.error("Error:", err.message);
  }
})();
