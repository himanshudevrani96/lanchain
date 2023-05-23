const express = require('express');
const axios = require('axios');
const cors = require('cors');

// Enable CORS for all routes
const app = express();
const port = 3001;

const SERPAPI_API_KEY = 'e6f290bb118f51394ec4f222992b8c15c79f3626991e85473a5df018a3f20c8a';

app.use(cors());
app.use(express.json());

// Define a route to proxy requests to SerpApi
app.all('/serpapi/*', async (req, res) => {
  const { method, originalUrl, body } = req;
  const { query } = req;
  const serpApiUrl = `https://api.serpapi.com/search?${new URLSearchParams(query)}`;
  try {
    console.log(serpApiUrl,method);
    const response = await axios({
      url: `${serpApiUrl}`,
      method,
      headers: {
        'Authorization': `Bearer ${SERPAPI_API_KEY}`,
      },
      data: body,
    });
    // const response = await axios.get(serpApiUrl);

    // Forward the response from SerpApi
    res.send(response.data, serpApiUrl,method);
  } catch (error) {
    // Handle any errors
    res.status(500).json({ error: 'Proxy request failed', serpApiUrl,method } );
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Proxy server is running on port ${port}`);
});
