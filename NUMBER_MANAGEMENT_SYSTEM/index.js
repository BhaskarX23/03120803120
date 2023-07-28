const http = require('http');
const url = require('url');
const axios = require('axios');

const port = 8008; // Change the port as needed

const server = http.createServer(async (req, res) => {
  const queryData = url.parse(req.url, true).query;
  const requestedUrls = Array.isArray(queryData.url) ? queryData.url : [queryData.url];

  if (requestedUrls.length === 0) {
    res.statusCode = 400;
    res.end('Please provide at least one valid "url" query parameter.');
    return;
  }

  const responseData = {};
  let data = []

  try {
    for (const requestedUrl of requestedUrls) {
      const response = await axios.get(requestedUrl);
      responseData[requestedUrl] = response.data;
      data = data + response.data.numbers;
    }
    let array = data.split(',').map(Number);
    array.sort((a, b) => a - b);
    const uniqueArray = array.filter((value, index, self) => self.indexOf(value) === index);
    const response = {
        "numbers": uniqueArray
    }
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response));
  } catch (error) {
    res.statusCode = error.response ? error.response.status : 500;
    res.end('Error fetching data from the specified URL(s).');
  }
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
