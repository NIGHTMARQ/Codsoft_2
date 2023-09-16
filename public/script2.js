// script.js
alert("Page is still under construction");
window.location.href = '/';
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    tabContents.forEach(content => {
      content.style.display = 'none';
    });
    
    const contentId = tab.getAttribute('id').replace('-tab', '-content');
    const activeContent = document.getElementById(contentId);
    activeContent.style.display = 'block';
  });
});

////////////////////////////////////////

document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.getElementById("search-form");
  //const searchResultsTable = document.getElementById("search-result-table");

    searchForm.addEventListener("submit", async (event) => {
      event.preventDefault(); // Prevent default form submission

      const city = document.getElementById("city").value;
      const country = document.getElementById("country").value;

      const options = {
        method: 'GET',
        url: 'https://tripadvisor16.p.rapidapi.com/api/v1/hotels/searchLocation',
        params: {
          query: city
        },
        headers: {
          'X-RapidAPI-Key': '71378783d8mshd5bf2101e711210p1a868cjsn6efd38cd0d27',
          'X-RapidAPI-Host': 'tripadvisor16.p.rapidapi.com'
        }
      };
      
      try {
        const response = await axios.request(options);
        console.log(response.data);

        const geoId = response.data.geoId;
        console.log(geoId);
        if (geoId) {
          const numericValue = parseInt(geoId.match(/\d+/)[0]); // Extract numeric value using regular expression
  
          console.log(numericValue); // Convert to integer

          const optio = {
            method: 'GET',
            url: 'https://tripadvisor16.p.rapidapi.com/api/v1/hotels/searchHotels',
            params: {
              geoId: numericValue,
              checkIn: '2023-09-01',
              checkOut: '2023-09-05',
              pageNumber: '1',
              currencyCode: 'USD'
            },
            headers: {
              'X-RapidAPI-Key': '71378783d8mshd5bf2101e711210p1a868cjsn6efd38cd0d27',
              'X-RapidAPI-Host': 'tripadvisor16.p.rapidapi.com'
            }
          };

          const hotel = await axios.request(optio);
          console.log(hotel.data);
        } else {
          console.log("GeoId not found in the response.");
        }  
         // Extract the "results" array
      } catch (error) {
        console.error(error);
      }
    });
  }
);