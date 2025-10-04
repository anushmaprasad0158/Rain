document.getElementById('getForecast').addEventListener('click', async () => {
  const lat = parseFloat(document.getElementById('lat').value);
  const lon = parseFloat(document.getElementById('lon').value);
  const date = document.getElementById('date').value;

  if (!lat || !lon || !date) {
    alert('Please fill all fields.');
    return;
  }

  const url = `http://127.0.0.1:8000/forecast?lat=${lat}&lon=${lon}&date=${date}`;
  let data;

  try {
    const res = await fetch(url);
    data = await res.json();
  } catch {
    // fallback demo data
    data = {
      rain_probability: 68,
      temperature: 29,
      wind_speed: 10,
      air_quality: "Moderate"
    };
  }

  document.getElementById('forecastSection').classList.remove('hidden');
  document.getElementById('rainProb').textContent = `${data.rain_probability}%`;
  document.getElementById('temp').textContent = `${data.temperature} °C`;
  document.getElementById('wind').textContent = `${data.wind_speed} km/h`;
  document.getElementById('aqi').textContent = data.air_quality;

  const adviceBox = document.getElementById('advice');
  if (data.rain_probability > 70) {
    adviceBox.textContent = "🌧️ High chance of rain. Carry an umbrella!";
    adviceBox.style.background = "#ffcccc";
  } else if (data.rain_probability > 40) {
    adviceBox.textContent = "☁️ Possible showers. Stay prepared.";
    adviceBox.style.background = "#fff3cd";
  } else {
    adviceBox.textContent = "☀️ Low chance of rain. Enjoy your day!";
    adviceBox.style.background = "#d4edda";
  }
});

/* NASA & Weather News Fetch */
async function loadNews() {
  const container = document.getElementById('newsContainer');
  container.innerHTML = "<p>Fetching latest updates...</p>";

  try {
    // NASA public news feed (no API key needed)
    const nasaRes = await fetch("https://www.nasa.gov/api/2/news/landing/?order=desc&per_page=4");
    const nasaData = await nasaRes.json();

    // Combine a few example headlines
    const articles = nasaData?.items?.slice(0, 4).map(item => ({
      title: item.title,
      link: item.url
    })) || [];

    if (articles.length === 0) throw new Error();

    container.innerHTML = "";
    articles.forEach(news => {
      const div = document.createElement("div");
      div.className = "news-item";
      div.innerHTML = `<a href="${news.link}" target="_blank">${news.title}</a>`;
      container.appendChild(div);
    });

  } catch {
    container.innerHTML = `
      <div class="news-item"><a href="#">Weather alert: Heavy rain in South India next week</a></div>
      <div class="news-item"><a href="#">NASA observes rare monsoon cloud pattern over Kerala</a></div>
      <div class="news-item"><a href="#">Heatwave trends declining in coastal areas</a></div>
    `;
  }
}

loadNews();
