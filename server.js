const express = require('express');
const bodyParser = require('body-parser');

// create express app
const app = express();

// Setup server port
const port = process.env.PORT || 3000;

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

// define a root route
app.get('/', (req, res) => {
  res.send("Hello World");
});

// Require employee routes
const employeeRoutes = require('./src/routes/annonce.routes')
const commentaireRoutes = require('./src/routes/commentaire.routes')
const ratingRoutes = require('./src/routes/rating.routes')
const clientRoutes = require('./src/routes/client.routes')
const proRoutes = require('./src/routes/ProGestion')
const payRoutes = require ('./src/routes/Payement.routes')
const smsRoutes = require ('./src/routes/sms.routes')

// using as middleware
app.use('/api/v1/annonce', employeeRoutes)
app.use('/commentaire', commentaireRoutes)
app.use('/rating', ratingRoutes)
app.use('/cl', clientRoutes)
app.use('/pro',proRoutes)
app.use('/pay', payRoutes)
app.use('/sms', smsRoutes)

    // listen for requests
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
