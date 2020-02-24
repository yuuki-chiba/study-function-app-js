const axios = require('axios'); 
const qs = require('qs');

const apiUrl = 'https://api.coindesk.com/v1';

// Recommended pattern
const fs = require('fs');
const util = require('util');
const readFileAsync = util.promisify(fs.readFile);

const envHash = {
    OS: process.env.OS
};

const sample = require('./sample');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    // get route parameters
    var category = context.bindingData.category;
    var id = context.bindingData.id;
    context.log(`Category: ${category}, ID: ${id}`);

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
    context.log("OS     : ");
    context.log(envHash.OS);

    // call an outer webapi:
    //   CoinDesk API: https://www.coindesk.com/api
    const result = await axios.get(`${apiUrl}/bpi/currentprice.json`);
    context.log("BPI real-time data: ")
    context.log(result.data);

    // parse query data
    // var parseStr = qs.parse(result);
    // context.log(parseStr);

    // read outer data
    context.log("a: ");
    context.log(sample.a);

    // current directory
    const currentDir = context.executionContext.functionDirectory;
    context.log(`Current Dir: ${currentDir}`);

    data = "";
    try {
        data = await readFileAsync(`${currentDir}/hello.txt`);
    } catch (err) {
        context.log.error('ERROR', err);
        // This rethrown exception will be handled by the Functions Runtime and will only fail the individual invocation
        throw err;
    }
    // Template strings - https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/template_strings
    context.log(`Data from file: ${data}`);

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