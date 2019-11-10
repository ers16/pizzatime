const http = require('http');
const express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/sms', (req, res) => {
    const twiml = new MessagingResponse();
    var msgBody = String(req.body.Body);

    twiml.message("get pizza");

    var options = {
        method: 'GET',
        url: 'https://api.yelp.com/v3/businesses/search',
        qs: { categories: 'pizza', location: msgBody },
        headers:
        {
            'cache-control': 'no-cache',
            Connection: 'keep-alive',
            //'Accept-Encoding': 'gzip, deflate',
            Host: 'api.yelp.com',
            'Postman-Token': '6ae91524-0de3-4863-b264-52cbeff23cc6,d5329ffc-19d9-4a28-82fb-725fa0a50722',
            'Cache-Control': 'no-cache',
            Accept: '*/*',
            'User-Agent': 'PostmanRuntime/7.19.0',
            Authorization: 'Bearer 0lfsdfKo4kxCzEeruIoQ64wCisgjT9Eml29Rwo7qZtruvqd9_nB19cdNGyURLr_62PAoHqwXfSEeB3KHGefmZXF_lqT5GpGFS6qH1ZxPDXRVY7NjWDQPwLTnpwbHXXYx'
        }
    };

    var json; var names = new Array(5); var distances = new Array(5); var addresses = new Array(5); var phonenos = new Array(5);
    request(options, function (error, response, body) {
        if (error) throw new Error(error); 
        json = JSON.parse(body);
        //go through first 5 names, distances, addresses and phone numbers & create arrays
        for (var i = 0; i < 5; i++) {
            console.log('------------------');
            names[i] = json.businesses[i].name;
            console.log(names[i].toString());
            distances[i] = json.businesses[i].distance * 0.000621371;
            console.log(distances[i], ' miles');
            addresses[i] = json.businesses[i].location.display_address;
            console.log(json.businesses[i].location.display_address);
            phonenos[i] = json.businesses[i].phone;
            console.log(json.businesses[i].phone);
        }
    });

    //twiml.message('str');
    
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
});

http.createServer(app).listen(1337, () => {
    console.log('Express server listening on port 1337');
});