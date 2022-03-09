const express = require('express');
const fs = require('file-system');
const cors = require('cors');

const countries = [
  'australien',
  'china',
  'deutschland',
  'griechenland',
  'hawaii',
  'island',
  'italien',
  'kanada',
  'usa',
];

function extractPoints(country) {
  const data = fs.readFileSync(`./img/${country}.svg`, {
    encoding: 'utf8',
    flag: 'r',
  });
  return data.match(/\d{1,2}[\.|\d|\s|,]{30,}\d/g);
}

const combs = [];

countries.forEach((country) => {
  combs.push({
    country: country,
    points: extractPoints(country),
  });
});

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(
  express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 })
);

app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);

app.get('/api', (req, res) => {
  res.json({ message: combs });
});

app.post('/data', (req, res) => {
  res.send(req.body);
  fs.appendFile(
    './img/result.svg',
    req.body.element.split(`"preserve">`)[1],
    function (err) {
      if (err) throw err;
      console.log('Saved!');
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
  ('');
});
