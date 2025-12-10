async function searchPapers() {
  const query = document.getElementById("query").value.trim();
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "<p>Loading...</p>";

  if (!query) {
    resultsDiv.innerHTML = "<p>Please enter a keyword.</p>";
    return;
  }

  try {
    const res = await fetch(
      `https://api.openalex.org/works?filter=title.search:${encodeURIComponent(query)}&per-page=5`
    );
    const data = await res.json();

    resultsDiv.innerHTML = "";

    if (!data.results || data.results.length === 0) {
      resultsDiv.innerHTML = "<p>No results found.</p>";
      return;
    }

    data.results.forEach(paper => {
      const authors = paper.authorships
        ?.map(a => a.author.display_name)
        .join(", ");

      const card = `
        <div class="paper-card">
          <h3>${paper.display_name}</h3>
          <p><strong>Authors:</strong> ${authors}</p>
          <p><strong>Year:</strong> ${paper.publication_year || "N/A"}</p>
          <a href="${paper.id}" target="_blank">View Paper</a>
        </div>
      `;
      resultsDiv.innerHTML += card;
    });
  } catch (err) {
    console.error(err);
    resultsDiv.innerHTML = "<p>Error fetching papers.</p>";
  }
}
