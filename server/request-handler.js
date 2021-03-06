/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var results = [];

var headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'application/json'
};

var responseHandler = function(response, data, statusCode) {
  statusCode = statusCode || 200;
  response.writeHead(statusCode, headers);
  response.end(JSON.stringify(data));
}

var mongoObjectId = function () {
  var timestamp = (new Date().getTime() / 1000 | 0).toString(16);
  return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function() {
      return (Math.random() * 16 | 0).toString(16);
  }).toLowerCase();
};

var actions = {
  'GET': function(request, response) {
    responseHandler(response, { results });
  },

  'POST': function(request, response) {
    request.on('data', (chunk) => {
      results.push(JSON.parse(chunk.toString()));
      results[results.length - 1].objectId = mongoObjectId();

    }).on('end', () => {
      results.concat(results);
      console.log(results);
      responseHandler(response, null, 201);
    });
  },

  'OPTIONS': function(request, response) {
    responseHandler(response, null, 201);
  }
}

var requestHandler = function(request, response) {
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  if (request.url === '/classes/messages') {
    actions[request.method](request, response);
  } else {
    responseHandler(response, '404: Not Found', 404);
  }
};

module.exports.requestHandler = requestHandler;
// module.exports.results = results;