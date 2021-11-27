/*
 *Primary file for the API
 *
 *
 */

// Dependencies
const http = require("http");
const url = require("url");

// The server should respond to all requests with a string
const server = http.createServer(function (req, res) {
  // Get the URL and parse it
  const parsedUrl = url.parse(req.url, true);

  // Get the path
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");

  //   Get the query string as an object
  const queryStringObject = parsedUrl.query;
  //   const parsedQueryStringObject = JSON.parse(JSON.stringify(queryStringObject));

  //   Get the HTTP method
  const method = req.method.toLowerCase();

  // get the headers as an object
  const headers = req.headers;

  // Send the response
  res.end("Hello World\n");

  // Log the request path
  console.log("Request received with these headers", headers);
});

// Start the server, and have it listen on port 3000
server.listen(3000, function () {
  console.log("This server is listening on port 3000 now");
});
