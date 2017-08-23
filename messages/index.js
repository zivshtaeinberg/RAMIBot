/*-----------------------------------------------------------------------------
This template demonstrates how to use Waterfalls to collect input from a user using a sequence of steps.
For a complete walkthrough of creating this type of bot see the article at
https://docs.botframework.com/en-us/node/builder/chat/dialogs/#waterfall
-----------------------------------------------------------------------------*/
"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
var https = require('https');
var path = require('path');
var arrResult;

var useEmulator = (process.env.NODE_ENV == 'development');

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});

var mtysvShemYishuv;
var mtysvSemelYishuv;
var mtysvMerchavMetapel;

var YeudMichrazDesc;
var YeudMichrazId;

var bot = new builder.UniversalBot(connector);

bot.dialog('/', [
    function (session)
    {
        //builder.Prompts.text(session, "ברוך הבא לראשות מקרקעי ישראל.איך אפשר לעזור?");
        //builder.Prompts.text(session, "ברוך הבא לראשות מקרקעי ישראל");
        //builder.Prompts.text(session, "איך אפשר לעזור?");

        var options = [];
        options[0] = "מכרזי מקרקעין";
        options[1] = "פניות הציבור";
        options[2] = "לאן לפנות";
        builder.Prompts.choice(session, ":בחר בבקשה מהאופציות הבאות", options);
        
    },
    function (session, results) 
    {
        session.userData.name = results.response;

        switch(results.response.index)
        {
            case 0:
            {
                builder.Prompts.text(session, "הקלד בבקשה עיר/ישוב");//results.response.entity);                 
            }
            break;

            case 1:
            {
                builder.Prompts.text(session, results.response.entity); //builder.Prompts.number(session, "Hi " + results.response + ", How many years have you been coding?"); 
            }
            break;

            case 2:
            {
                builder.Prompts.text(session, results.response.entity); //builder.Prompts.number(session, "Hi " + results.response + ", How many years have you been coding?"); 
            }
            break;

        }
    },
    function (session, results) 
    {
        session.userData.coding = results.response;

        mtysvShemYishuv = results.response;


        var sentence = session.message.text;        
        var texturl = "/GetCityName/" + encodeURIComponent(sentence);
        
        var intendUrl = texturl;
        var options = 
        {
            host: 'apimrami.azure-api.net', //'apimgovil.azure-api.net',
            path: intendUrl,
            port: 443,
            method: 'GET',
            headers: 
            {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': '46a059c37d2f41d483a42099f8853a8c'
            }
        }

        var body = '';
        
        var req = https.request(options, function (res) 
        {
            session.send('STATUS: ' + res.statusCode);
            session.send('HEADERS: ' + JSON.stringify(res.headers));

            // Buffer the body entirely for processing as a whole.
            var bodyChunks = [];
            res.on('data', function (chunk) 
            {
                bodyChunks.push(chunk);
            }).on('end', function () 
            {
                body = Buffer.concat(bodyChunks);
                session.send('body: ' + body.toString());
                var scenario = JSON.parse(body);
                var size = JSON.parse(body).Total;
                
                arrResult = JSON.parse(body);
                var options = [];
               
                mtysvSemelYishuv = arrResult['mtysvSemelYishuv'];
                mtysvMerchavMetapel = arrResult['mtysvMerchavMetapel'];
               
                session.send('mtysvSemelYishuv: ' + mtysvSemelYishuv);

                //session.beginDialog("YeudMichrazDialog",{mtysvSemelYishuv: mtysvSemelYishuv});

                var options = [];
                options[0] = "הכל";
                options[1] = "אחר";
                options[2] = "בניה נמוכה/צמודת קרקע/בנה ביתך";
                options[3] = "בניה רוויה";
                options[4] = "דיור להשכרה";
                options[5] = "דיור מוגן (בית אבות)";
                options[6] = "הטמנת פסולת יבשה";
                options[7] = "חניונים";
                options[8] = "חקלאות";
                options[9] = "יעוד אחר";
                options[10] = "מגורים ו/או מסחר ו/או מלונאות ו/או נופש";
                options[11] = "מוסדות ו/או בנינים ציבוריים";
                builder.Prompts.choice(session, ":בחר בבקשה יעוד", options);
        
                
            })
        });

        req.write("{ \"text\":" + sentence + "}");
        req.end();

        req.on('error', function (e) 
        {
            builder.Prompts.text(session, 'ERROR: ' + e.message);
        });

        
    },
    function (session, results) 
    {
        //session.userData.coding = results.response;

        YeudMichrazDesc = results.response.entity;

        session.beginDialog("YeudMichrazDialog",{YeudMichrazDesc: YeudMichrazDesc});        
        
    },
    function (session, results) 
    {
        //session.userData.coding = results.response;

        mtysvShemYishuv = results.response.entity;

        builder.Prompts.text(session, "הקלד בבקשה יעוד");
        //builder.Prompts.choice(session, "What language do you code Node using?", ["JavaScript", "CoffeeScript", "TypeScript"]);
        
    },
    function (session, results) 
    {
        session.userData.language = results.response.entity;
        session.send("Got it... " + session.userData.name + 
                    " you've been programming for " + session.userData.coding + 
                    " years and use " + session.userData.language + ".");
    }
]);

bot.dialog("YeudMichrazDialog", [
    function (session, args, results) 
    {
        //var sentence = session.message.text;        
        var texturl = "/RAMIGetYeudMichraz/" + encodeURIComponent(YeudMichrazDesc);
        
        var intendUrl = texturl;
        var options = 
        {
            host: 'apimrami.azure-api.net', //'apimgovil.azure-api.net',
            path: intendUrl,
            port: 443,
            method: 'GET',
            headers: 
            {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': '46a059c37d2f41d483a42099f8853a8c'
            }
        }

        var body = '';
        
        var req = https.request(options, function (res) 
        {
            session.send('STATUS: ' + res.statusCode);
            session.send('HEADERS: ' + JSON.stringify(res.headers));

            // Buffer the body entirely for processing as a whole.
            var bodyChunks = [];
            res.on('data', function (chunk) 
            {
                bodyChunks.push(chunk);
            }).on('end', function () 
            {
                body = Buffer.concat(bodyChunks);
                session.send('body: ' + body.toString());
                var scenario = JSON.parse(body);
                var size = JSON.parse(body).Total;
                
                arrResult = JSON.parse(body);
                var options = [];
               
                YeudMichrazId = arrResult['YeudMichrazId'];
               
                session.send('YeudMichrazId: ' + YeudMichrazId);

                session.beginDialog("GetTenderDialog",{YeudMichrazId: YeudMichrazId});
                //session.beginDialog("YeudDialog",{mtysvSemelYishuv: mtysvSemelYishuv});

                //action = "runsteps";
                //session.endDialog({runsteps : true});
            })
        });

        req.write("{ \"text\":" + YeudMichrazDesc + "}");
        req.end();

        req.on('error', function (e) 
        {
            builder.Prompts.text(session, 'ERROR: ' + e.message);
        });
    }
]);

bot.dialog("GetTenderDialog", [
    function (session, args, results) 
    {
        //var sentence = session.message.text;        
        var texturl = "/RamiGetTenderList/?"+
        "iTop=50" + 
        "&bAddDetails=true" +
        "&iStatus=0" +
        "&ListYeshuv=" + encodeURIComponent(mtysvSemelYishuv) + // -1" +
        "&iMerchav=" + encodeURIComponent(mtysvMerchavMetapel) + //-1" +
        "&ListYeudMichraz=" + encodeURIComponent(YeudMichrazId) + //-1" +
        "&lMichraz=-1" +
        "&dFromDatePirsum=Sun,%2031%20Dec%201499%2022:00:00%20GMT" +
        "&dToDatePirsum=Sun,%2031%20Dec%201499%2022:00:00%20GMT" +
        "&dDivurDate=Sun,%2031%20Dec%201499%2022:00:00%20GMT";// + encodeURIComponent(YeudMichrazDesc);
        
        var intendUrl = texturl;
        var options = 
        {
            host: 'apimrami.azure-api.net', //'apimgovil.azure-api.net',
            path: intendUrl,
            port: 443,
            method: 'GET',
            headers: 
            {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': '46a059c37d2f41d483a42099f8853a8c'
            }
        }

        var body = '';
        
        var req = https.request(options, function (res) 
        {
            session.send('STATUS: ' + res.statusCode);
            session.send('HEADERS: ' + JSON.stringify(res.headers));

            // Buffer the body entirely for processing as a whole.
            var bodyChunks = [];
            res.on('data', function (chunk) 
            {
                bodyChunks.push(chunk);
            }).on('end', function () 
            {
                body = Buffer.concat(bodyChunks);
                session.send('body: ' + body.toString());
                var scenario = JSON.parse(body);
                var size = JSON.parse(body).Total;
                
                arrResult = JSON.parse(body);
                var options = [];
               
               // YeudMichrazId = arrResult['YeudMichrazId'];
               
                //session.send('YeudMichrazId: ' + YeudMichrazId);

                //session.beginDialog("GetTenderDialog",{YeudMichrazId: YeudMichrazId});
                //session.beginDialog("YeudDialog",{mtysvSemelYishuv: mtysvSemelYishuv});

                //action = "runsteps";
                //session.endDialog({runsteps : true});
            })
        });

        req.write("{ \"text\":" + YeudMichrazDesc + "}");
        req.end();

        req.on('error', function (e) 
        {
            builder.Prompts.text(session, 'ERROR: ' + e.message);
        });
    }
]);

if (useEmulator) {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(3978, function() {
        console.log('test bot endpont at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());    
} else {
    module.exports = { default: connector.listen() }
}
