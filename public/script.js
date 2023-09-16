document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("search-form");
  const searchResultsTable = document.getElementById("search-results-table");
  
    searchForm.addEventListener("submit", async (event) => {
      event.preventDefault(); // Prevent default form submission
  
      const origin = document.getElementById("origin").value;
      const destination = document.getElementById("destination").value;
      const date = document.getElementById("date").value;
      const adult = document.getElementById("adult").value;
  
      const options = {
        method: "GET",
        url: 'https://flight-fare-search.p.rapidapi.com/v2/flights/',
        params: {
          from: origin,
          to: destination,
          date: date,
          adult: adult,
          type: 'economy',
          currency: "INR"
          
        },
        headers: {
          'X-RapidAPI-Key': '71378783d8mshd5bf2101e711210p1a868cjsn6efd38cd0d27',
          'X-RapidAPI-Host': 'flight-fare-search.p.rapidapi.com'
        },
      };
  
      try {
        const response = await axios.request(options);
        console.log(response.data);
        //console.log(user.username);

        const results = response.data.results; // Extract the "results" array

         // Clear existing table body
        searchResultsTable.innerHTML = "";

        // Populate the table with specific result information
        results.forEach((result) => {
          const newRow = searchResultsTable.insertRow();
          const flightCodeCell = newRow.insertCell();
          flightCodeCell.textContent = result.flight_code;

          const flightNameCell = newRow.insertCell();
          flightNameCell.textContent = result.flight_name;

          const departureCell = newRow.insertCell();
          departureCell.textContent = result.departureAirport.label;

          const departureTimeCell = newRow.insertCell();
          departureTimeCell.textContent = result.departureAirport.time;

          const arrivalCell = newRow.insertCell();
          arrivalCell.textContent = result.arrivalAirport.label;

          const arrivalTimeCell = newRow.insertCell();
          arrivalTimeCell.textContent = result.arrivalAirport.time;

          const durationCell = newRow.insertCell();
          durationCell.textContent = result.duration.text;

          const stopCell = newRow.insertCell();
          stopCell.textContent = result.stops;

          const totalCell = newRow.insertCell();
          const flightPrice = result.totals.total;
          totalCell.textContent = flightPrice.toFixed(2);

          const bookButtonCell = newRow.insertCell();
          const bookButton = document.createElement('button');
          bookButton.textContent = "Book";
          bookButton.className = "book-button";
          //bookButton.disabled = !isAuthenticated;
          bookButtonCell.appendChild(bookButton);

          bookButton.addEventListener("click", async () => {
            // Redirect to the flight detail page with flight details as parameters
            console.log(result);
            try {
              const response = await fetch('/pass' , {
                method: 'POST',
                headers: { 'Content-Type': 'application/json',},
                body: JSON.stringify(result)
              })
              if (response.ok) {
                //console.log('ho gaya')
                // Redirect to the 'flightdetail' page on success
                window.location.href = '/Fl-De';
              }
              else {
                console.log('Failed to')
              }
            }
            catch (error) {
              console.error('Error:', error);
            }
          });

        });
     

        //const searchResultsDiv = document.getElementById("search-results");
        //searchResultsDiv.innerHTML = JSON.stringify(response.data, null, 2);
      } catch (error) {
        console.error(error);
      }
    });
});
