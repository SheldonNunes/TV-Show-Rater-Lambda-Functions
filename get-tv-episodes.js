const https = require("https");

exports.handler = async (event, context) => {
  const { id, number_of_seasons } = event.queryStringParameters;

  return new Promise((resolve, reject) => {
    let requests = [];
    for (let i = 1; i <= number_of_seasons; i++) {
      let request = new Promise((resolve, reject) => {
        const options = {
          hostname: "api.themoviedb.org",
          method: "GET",
          headers: { "Content-Type": "application/json" },
          path: "/?i=" + id + "&apikey=process.env.API_KEY" + "&Season=" + i 
        };
        const req = https.request(options, res => {
          let body = "";
          res.on("data", d => {
            body += d;
          });

          res.on("end", () => {
            resolve(body);
          });
        });
        req.on("error", e => {
          reject(e.message);
        });

        // send the request
        req.write("");
        req.end();
      });
      requests.push(request);
    }
    Promise.all(requests).then(values => {
      console.log(values);
      let response = {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify(values)
      };
      resolve(response);
    });
  });
};
