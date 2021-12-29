/*
 *Primary file for the API
 *
 *
 */

// Dependencies
const http = require("http");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const config = require("./config");

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

  // get the payload if any
  const decoder = new StringDecoder("utf-8");
  let buffer = "";

  // get the payload, if any
  req.on("data", function (data) {
    buffer += decoder.write(data);
  });
  req.on("end", function () {
    buffer += decoder.end();

    // choose the handler this request should go to
    // if none found use not found handler

    const chosenHandler =
      typeof router[trimmedPath] !== "undefined"
        ? router[trimmedPath]
        : handlers.notFound;

    // construct the data object to send to the handler
    const data = {
      trimmedPath: trimmedPath,
      queryStringObject: queryStringObject,
      method: method,
      headers: headers,
      payload: buffer,
    };

    chosenHandler(data, function (statusCode, payload) {
      // use the status code called back by the handler or default to 200
      statusCode = typeof statusCode == "number" ? statusCode : 200;

      // use the payload called back by the handler or default to the empty object
      payload = typeof payload == "object" ? payload : {};

      // convert the payload to a string

      const payloadString = JSON.stringify(payload);

      // return the response
      res.setHeader("Content-Type", "application/JSON");
      res.writeHead(statusCode);
      res.end(payloadString);

      // Log the request path
      console.log("Returning this response: ", statusCode, payloadString);
    });
  });
});

// Start the server, dynamically set port by cofig file
server.listen(config.payloadString, function () {
  console.log(
    `This server is listening on port ${config.port} in ${config.envName} mode`
  );
});

// define the handlers
let handlers = {};

// sample handler
handlers.sample = function (data, callback) {
  // callback a http status code and a payload object
  callback(406, { name: "sample handler" });
};

handlers.path = function (data, callback) {
  callback(202, { name: "path-handler" });
};

// not found handler
handlers.notFound = function (data, callback) {
  callback(404);
};

// define a request router
const router = {
  sample: handlers.sample,
  path: handlers.path,
};
