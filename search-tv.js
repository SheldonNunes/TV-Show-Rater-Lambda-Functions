const https = require('https');

exports.handler = async (event, context) => {
  const { query } = event.queryStringParameters;
  return new Promise((resolve, reject) => {
        const options = {
          hostname: 'omdbapi.com',
          method: 'GET',
          path: '/?s=' + encodeURI(query) + '&apikey=' + process.env.API_KEY + '&type=series' ,
        };

        const req = https.request(options, (res) => {
          let body = '';
          res.on('data', (d) => {
            body += d;
          });
          
          res.on('end', () => {
              let response = {
                  statusCode: 200,
                  headers : { "Access-Control-Allow-Origin" : "*" },
                  body: body
              };
            resolve(response);
          });
        });

        req.on('error', (e) => {
          reject(e.message);
        });

        // send the request
        req.write('');
        req.end();
    });
};