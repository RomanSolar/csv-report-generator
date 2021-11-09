const express = require('express');

const app = express();
app.use(express.json());
app.use(express.static(__dirname + '/client/'));

let mostRecentCsv;

const toCsv = (json) => {
  const childProps = (json.children || []).map(toCsv).join('');
  delete json.children;
  const myProps = Object.values(json);
  return `\n${myProps}${childProps}`;
};

app.post('/', (req, res) => {
  const csv = Object.keys(req.body).join(',') + toCsv(req.body);
  mostRecentCsv = csv;
  res.send(csv);
});

app.get('/latest', (req, res) => {
  res.attachment('report.csv');
  res.send(mostRecentCsv);
});


app.listen(8080, function() {
  console.log('\x1B[0mlistening on port 8080');
});
