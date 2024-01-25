const express = require('express');
const app = express();
const port = 2000;
const db = require('./db'); // Import the database module
const axios = require('axios'); // Import the Axios library
////////
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');
const routes = require('./routes/index'); // Import your user routes
const { url } = require('inspector');
const { error } = require('console');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 360000000, 
  },
}));


app.use(express.static('public'));
//For other folder
//app.use('/routes', express.static(__dirname + 'Public/css'))

app.use('/users', routes);

// Set View's
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

//Navigation 
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
})

app.get('/test', (req, res) => {
  if (req.session.user) {
    //res.sendFile(__dirname + '/public/book.html');
    res.render('test' , { user: req.session.user });
    console.log(req.session.user)
  } else 
    { res.redirect('/users/login')}
})

app.get('/self', (req, res) => {
  if (req.session.user) {
    //res.sendFile(__dirname + '/public/book.html');
    res.render('book' , { user: req.session.user });
    console.log(req.session.user)
  } else 
    { res.redirect('/users/login')}
})

app.get('/dashboard', (req, res) => {
  if (req.session.user) {
    res.render('dashboard', { user: req.session.user });
    console.log(req.session.user)
} else {
    res.redirect('/users/login'); // Redirect to login page if user is not logged in
}
})

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
      if (err) {
          console.error('Error destroying session:', err);
      }
      res.redirect('/users/login'); // Redirect to the login page
  });
});

// Define a route to handle flight search and return API data
//app.get('/search-flights', async (req, res) => {
//  try {
//    const options = {
//      method: 'GET',
//      url: 'https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchFlights',
//      params: {
//        originSkyId: 'LOND',
//        destinationSkyId: 'NYCA',
//        originEntityId: '27544008',
//        destinationEntityId: '27537542',
//        date: '2024-02-20',
//        adults: '1',
//        currency: 'USD',
//        market: 'en-US',
//        countryCode: 'US'
//      },
//      headers: {
//        'X-RapidAPI-Key': '71378783d8mshd5bf2101e711210p1a868cjsn6efd38cd0d27',
//        'X-RapidAPI-Host': 'sky-scrapper.p.rapidapi.com'
//      }
//    };
//
//    const response = await axios.request(options);
//    res.json(response.data); // Send the API response to the frontend
//  } catch (error) {
//    console.error('Error fetching flight data:', error);
//    res.status(500).json({ error: 'Unable to fetch flight data' });
//  }
//});

app.post('/confirm-booking' , (req, res) => {
  if (1) { //yeh 1 hatana hai
    const BookDetails = req.body;
    const username = req.body.username;
    console.log(BookDetails);
    console.log(username);

    const checkFlightQuery = 'INSERT INTO flight (flight_id, Departure, Arrival, Departure_time, Arrival_time, Duration, price) VALUES (?, ?, ?, ?, ?, ?, ?); ';
    const FlightValue = [BookDetails.flight, BookDetails.depart.city, BookDetails.arrive.city, BookDetails.depart.time, BookDetails.arrive.time, BookDetails.duration, BookDetails.price];

    db.query(checkFlightQuery, FlightValue, (err, result) => {
      if (err) {
        console.error('flight error', err);
      }
      else{
        console.log('detail entered');
      }
    })

    const findUserQuery = 'SELECT user_id FROM Users WHERE username = ?';
    const findUserValues = [username];

    db.query(findUserQuery, findUserValues, (err, userResult) => {
      if (err) {
        console.error('Error fetching user_id:', err);
        res.status(500).send('Error confirming booking');
        return;
      }

      if (userResult.length === 0) {
      console.error('User not found for username:', username);
      res.status(404).send('User not found');
      return;
      }
    
    const userId = userResult[0].user_id;
    const bookingDate = new Date();


    const sql = 'INSERT INTO book (flight_id , user_id, booking_date) VALUES (?, ?, ?) ;';
    const values = [BookDetails.flight, userId, bookingDate];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error confirming booking:', err);
        res.status(500).send('Error confirming booking');
      } else {
        console.log('Booking confirmed successfully');
        res.status(200).send('/tic');
        //res.redirect('/tic');
      }
    });
   })
  }
  else { console.log('Error log booking:')}
});


app.post('/pass', (req, res) => {
  const detail = req.body; // The 'result' object is sent as the request body
  // Store the 'detail' object in the session
  req.session.detail = detail;
  console.log('Received POST request at /pass with data:', detail);
 // Respond with a success message
 res.status(200).send('Data received successfully');
});

app.get('/Fl-De' , (req, res) => {
  const result = req.session.detail;
  //console.log('Received GET request at /Fl-De with data:', result);

  // Render the flightdetail.ejs template with the 'detail' data
  res.render('flightdetail', { detail: result, username: req.session.user});
  //res.render('flightdetail' , {detail});
})

app.get('/tic', (req, res) => {
  // Retrieve query parameters for flight and user
  const flight = JSON.parse(req.query.bookingDetails);
  const user = req.query.user;
  console.log(flight);
  // Render the page and pass the flight and user information to the view
  res.render('ticket', { flight, user });
});


app.use((err, req, res, next) => {
  console.log('500 Error Middleware Executed');
  console.error(err.stack);
  res.status(500).render('500');
})

app.use((req, res, next) => {
  console.log('404 Error Middleware Executed');
  res.status(404).render('404');
})
//Listen on port 3000
app.listen(port, () => console.info("app listening to port ${port}" ));