const axios = require('axios'); 
const qs = require('qs');

const apiUrl = 'https://api.coindesk.com/v1';

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    // get request information
    context.log("Headers: ");
    context.log(req.headers);
    context.log("Method : " + req.method);
    context.log("URL    : " + req.originalUrl);
    context.log("Params : ");
    context.log(req.params);
    context.log("Query  : ");
    context.log(req.query);

    // get environment variable
    context.log("EnvVals: ");
    context.log(process.env);

    // call an outer webapi:
    //   CoinDesk API: https://www.coindesk.com/api
    const result = await axios.get(`${apiUrl}/bpi/currentprice.json`);
    context.log("BPI real-time data: ")
    context.log(result.data);

    // parse query data
    // var parseStr = qs.parse(result);
    // context.log(parseStr);

    // the following lines are original
    if (req.query.name || (req.body && req.body.name)) {
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: "Hello " + (req.query.name || req.body.name)
        };
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a name on the query string or in the request body"
        };
    }
};