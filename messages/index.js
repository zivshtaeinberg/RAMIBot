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

var arrTenderResult;

var useEmulator = (process.env.NODE_ENV == 'development');

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});

var MichrazMekrkein = 0;//"מכרזי מקרקעין";
var PniyotHatzibur = 1;//"פניות הציבור";
var ServiceMovie = 2;//"לאן לפנות";


var mtysvShemYishuv;
var mtysvSemelYishuv;
var mtysvMerchavMetapel;

var YeudMichrazDesc;
var YeudMichrazId;

var bot = new builder.UniversalBot(connector);

bot.dialog('/', [
    function (session)
    {
        //builder.Prompts.text(session, "ברוך הבא לראשות מקרקעי ישראל");
        session.send("ברוך הבא לראשות מקרקעי ישראל");               
        session.send("...אנא המתן לנציג");               
        
        //builder.Prompts.text(session, "ברוך הבא לראשות מקרקעי ישראל");
        //builder.Prompts.text(session, "איך אפשר לעזור?");
        //session.beginDialog("Welcome", { beginsession: true });
       // var msg = session.message;
        //var attachment = msg.attachments[0];
        session.send({
            text: "You sent:",
            attachments: [
                {
                    contentType: "image/jpeg",
                    contentUrl:  "https://cdn-images-1.medium.com/max/1600/1*TztpJzCXGEw7N1rEgE8KJQ.png",
                    name: "kuku"
                }
            ]
        });

        session.send("?שלום, שמי רמיבוט, איך אוכל לעזור לך");
/*
        var msg = new builder.Message(session)
        .attachments([{
            contentType: "image/jpeg",
            contentUrl: "https://cdn-images-1.medium.com/max/1600/1*TztpJzCXGEw7N1rEgE8KJQ.png"//http://www.theoldrobots.com/images62/Bender-18.JPG"
        }]);*/

        var options = [];
        options[0] = "מכרזי מקרקעין";
        options[1] = "פניות הציבור";
        options[2] = "סרט שרות";
        builder.Prompts.choice(session, ":בחר בבקשה מהאופציות הבאות", options);
        
    },
    function (session, results) 
    {
        session.userData.name = results.response;

        switch(results.response.index)
        {
            case MichrazMekrkein:
            {
                builder.Prompts.text(session, "הקלד בבקשה עיר/ישוב");//results.response.entity);                 
            }
            break;

            case PniyotHatzibur:
            {
                builder.Prompts.text(session, results.response.entity); //builder.Prompts.number(session, "Hi " + results.response + ", How many years have you been coding?"); 
            }
            break;

            case ServiceMovie:
            {
                session.beginDialog("RamiMovie",{YeudMichrazId: YeudMichrazId});//builder.Prompts.text(session, results.response.entity); //builder.Prompts.number(session, "Hi " + results.response + ", How many years have you been coding?"); 
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
            
            //session.send('HEADERS: ' + JSON.stringify(res.headers));

            // Buffer the body entirely for processing as a whole.
            var bodyChunks = [];
            res.on('data', function (chunk) 
            {
                bodyChunks.push(chunk);
            }).on('end', function () 
            {
                body = Buffer.concat(bodyChunks);

                if(res.statusCode != 200)
                {
                    session.send("לא מכיר עיר כזו");
                    session.endDialog();
                }

                //session.send('body: ' + body.toString());
                var scenario = JSON.parse(body);
                var size = JSON.parse(body).Total;
                
                arrResult = JSON.parse(body);
                var options = [];
               
                mtysvSemelYishuv = arrResult['mtysvSemelYishuv'];
                mtysvMerchavMetapel = arrResult['mtysvMerchavMetapel'];
               
                //session.send('mtysvSemelYishuv: ' + mtysvSemelYishuv);

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
        
    }
    /*function (session, results) 
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
    }*/
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
            //session.send('HEADERS: ' + JSON.stringify(res.headers));

            // Buffer the body entirely for processing as a whole.
            var bodyChunks = [];
            res.on('data', function (chunk) 
            {
                bodyChunks.push(chunk);
            }).on('end', function () 
            {
                body = Buffer.concat(bodyChunks);
                //session.send('body: ' + body.toString());
                var scenario = JSON.parse(body);
                var size = JSON.parse(body).Total;
                
                arrResult = JSON.parse(body);
                var options = [];
               
                YeudMichrazId = arrResult['YeudMichrazId'];
               
               // session.send('YeudMichrazId: ' + YeudMichrazId);

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
        "&iMerchav=-1" + //encodeURIComponent(mtysvMerchavMetapel) + //-1" +
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
            //session.send('HEADERS: ' + JSON.stringify(res.headers));

            // Buffer the body entirely for processing as a whole.
            var bodyChunks = [];
            res.on('data', function (chunk) 
            {
                bodyChunks.push(chunk);
            }).on('end', function () 
            {
                body = Buffer.concat(bodyChunks);
                //session.send(body.toString());
                var scenario = JSON.parse(body);
                var size = JSON.parse(body).Total;
                
                arrTenderResult = JSON.parse(body);

                //session.send(arrTenderResult.toString());
                              
                //session.send('YeudMichrazId: ' + YeudMichrazId);

                session.beginDialog("showSlides",{YeudMichrazId: YeudMichrazId});
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

bot.dialog('showSlides', function (session) 
{
    var attachments = [];
    var CityCode = "";
    var CityDesc = "";
    var CountMigrashim = "";
    var Link2Mapi = "";
    var Link2Tashlum = "";
    var Michraz = "";
    var MichrazNum = "";
    var MichrazYear = "";
    var Michrazid = "";
    var PirsumDate = "";
    var PtichaDate = "";
    var SgiraDate = "";
    var Shcuna = "";
    var Statusdesc = "";


    for(var ResIndex = 0;ResIndex < arrTenderResult.ResaultList.length;ResIndex++)
    {
        CityCode = arrTenderResult.ResaultList[ResIndex].CityCode;
        if(CityCode == null)
            CityCode = "";

        CityDesc = arrTenderResult.ResaultList[ResIndex].CityDesc;
        if(CityDesc == null)
            CityDesc = "";

        CountMigrashim = arrTenderResult.ResaultList[ResIndex].CountMigrashim;
        if(CountMigrashim == null)
            CountMigrashim = "";

        Link2Mapi = arrTenderResult.ResaultList[ResIndex].Link2Mapi;
        if(Link2Mapi == null)
            Link2Mapi = "";

        Link2Tashlum = arrTenderResult.ResaultList[ResIndex].Link2Tashlum;
        if(Link2Tashlum == null)
            Link2Tashlum = "";

        Michraz = arrTenderResult.ResaultList[ResIndex].Michraz;
        if(Michraz == null)
            Michraz = "";

        MichrazNum = arrTenderResult.ResaultList[ResIndex].MichrazNum;
        if(MichrazNum == null)
            MichrazNum = "";

        MichrazYear = arrTenderResult.ResaultList[ResIndex].MichrazYear;
        if(MichrazYear == null)
            MichrazYear = "";

        Michrazid = arrTenderResult.ResaultList[ResIndex].Michrazid;
        if(Michrazid == null)
            Michrazid = "";

        PirsumDate = arrTenderResult.ResaultList[ResIndex].PirsumDate;
        if(PirsumDate == null)
            PirsumDate = "";

        PtichaDate = arrTenderResult.ResaultList[ResIndex].PtichaDate;
        if(PtichaDate == null)
            PtichaDate = "";

        SgiraDate = arrTenderResult.ResaultList[ResIndex].SgiraDate;
        if(SgiraDate == null)
            SgiraDate = "";

        Shcuna = arrTenderResult.ResaultList[ResIndex].Shcuna;
        if(Shcuna == null)
            Shcuna = "";

        Statusdesc = arrTenderResult.ResaultList[ResIndex].Statusdesc;
        if(Statusdesc == null)
            Statusdesc = "";
        /*
        session.send("CityCode: " + CityCode);
        session.send("CityDesc: " + CityDesc);
        session.send("CountMigrashim: " + CountMigrashim);
        session.send("Link2Mapi: " + Link2Mapi);
        session.send("Link2Tashlum: " + Link2Tashlum);
        session.send("Michraz: " + Michraz);
        session.send("MichrazNum: " + MichrazNum);
        session.send("MichrazYear: " + MichrazYear);
        session.send("Michrazid: " + Michrazid);
        session.send("PirsumDate: " + PirsumDate);
        session.send("PtichaDate: " + PtichaDate);
        session.send("SgiraDate: " + SgiraDate);
        session.send("Shcuna: " + Shcuna);
        session.send("Statusdesc: " + Statusdesc);*/

        var UiDetailsValuePirsum = "No Link";
        var UiDetailsValueHavharot = "No Link";
        var UiDetailsValueMichrazBook = "No Link";
        var UiDetailsValueResults = "No Link";
        var UiDetailsValueMapot = "No Link";        
        
        var ValArray = arrTenderResult.ResaultList[ResIndex].UiDetails;
        for(var iIndex = 0;iIndex< ValArray.length;iIndex++)
        {
            var title = arrTenderResult.ResaultList[ResIndex].UiDetails[iIndex].title;
            var UiDetailsValue = arrTenderResult.ResaultList[ResIndex].UiDetails[iIndex].Value;
            
            if(UiDetailsValue != "")
            {
                var httplocation = UiDetailsValue.indexOf("http");
                var closelocation = UiDetailsValue.lastIndexOf("'");
                if(httplocation > 0)
                {
                    var lengthtocut = closelocation - httplocation;
                    var linkpath = UiDetailsValue.substr(httplocation,lengthtocut);
                    if(title == "מודעות פרסום")
                    {
                        UiDetailsValuePirsum = linkpath;//UiDetailsValue.substr(httplocation);
                    }                   
                    else if(title == "הבהרות")
                    {
                        UiDetailsValueHavharot = linkpath;
                    }
                    else if(title == "נספחים")
                    {
                        var contains = UiDetailsValue.indexOf("חוברת המכרז");
                        if (contains > -1) 
                        {                        
                            UiDetailsValueMichrazBook = linkpath;
                        }
    
                        var contains = UiDetailsValue.indexOf("מפות");
                        if (contains > -1) 
                        {                        
                            UiDetailsValueMapot = linkpath;
                        }
                        
                    }   
                }                
            }          
            

            //session.send("UiDetailsValue: " + UiDetailsValue);
            //session.send("title: " + title);
        }

        var attach =  new builder.HeroCard(session)
        .title("עיר: " + CityDesc.toString() + " שכונה: " + Shcuna.toString())//"Classic White T-Shirt")
        .subtitle("מספר מגרשים: " + CountMigrashim.toString() + 
                  " תאריך פרסום: " + PirsumDate.toString() + 
                  " תאריך פתיחה: " + PtichaDate.toString() + 
                  " תאריך סגירה: " + SgiraDate.toString())//"100% Soft and Luxurious Cotton")
        .text("מספר מכרז: " + MichrazNum.toString())//"Price is $25 and carried in sizes (S, M, L, and XL)")
        .images([builder.CardImage.create(session, "http://land.gov.il/Style%20Library/Rami/he-IL/images/logoL.png")])//'http://petersapparel.parseapp.com/img/whiteshirt.png')])                
        .buttons([
            builder.CardAction.openUrl(session, Link2Mapi.toString(), "לינק למכרז"),
            builder.CardAction.openUrl(session, UiDetailsValuePirsum.toString(), "מודעות פרסום"),
            builder.CardAction.openUrl(session, UiDetailsValueHavharot.toString(), "הבהרות"),
            builder.CardAction.openUrl(session, UiDetailsValueMichrazBook.toString(), "חוברת המכרז"),
            builder.CardAction.openUrl(session, UiDetailsValueMapot.toString(), "נספחים")
        ]);

       
        attachments.push(attach);
    } 

    var msg = new builder.Message(session);
    msg.attachmentLayout(builder.AttachmentLayout.carousel);
    msg.attachments(attachments);

    

    /*var msg = new builder.Message(session);
    msg.attachmentLayout(builder.AttachmentLayout.carousel)
    msg.attachments([
        new builder.HeroCard(session)
            .title(CityDesc.toString())//"Classic White T-Shirt")
            .subtitle(CountMigrashim.toString())//"100% Soft and Luxurious Cotton")
            .text(MichrazNum.toString())//"Price is $25 and carried in sizes (S, M, L, and XL)")
            .images([builder.CardImage.create(session, Link2Mapi.toString())])//'http://petersapparel.parseapp.com/img/whiteshirt.png')])
            .buttons([
                builder.CardAction.imBack(session, "buy classic white t-shirt", "Buy")
            ]),
        new builder.HeroCard(session)
            .title("Classic Gray T-Shirt")
            .subtitle("100% Soft and Luxurious Cotton")
            .text("Price is $25 and carried in sizes (S, M, L, and XL)")
            .images([builder.CardImage.create(session, 'http://petersapparel.parseapp.com/img/grayshirt.png')])
            .buttons([
                builder.CardAction.imBack(session, "buy classic gray t-shirt", "Buy")
            ])
    ]);*/
    session.send(msg).endDialog();
}).triggerAction({ matches: /^(show|list)/i });

bot.dialog('Welcome', [
    function (session, args, results) 
    {
        session.conversationData.stepNumber = 0;
        session.send("...אנא המתן לנציג");

        session.beginDialog("RamiBot",{YeudMichrazId: YeudMichrazId});
        
        session.send("?שלום, שמי רמיבוט, איך אוכל לעזור לך");

        //session.beginDialog("RamiMovie",{YeudMichrazId: YeudMichrazId});        
    }

]);

bot.dialog('RamiBot', [
    function (session, args, results) 
    {
        session.conversationData.stepNumber = 0;
        
        var msg = new builder.Message(session)
        .attachments([{
            contentType: "image/jpeg",
            contentUrl: "https://cdn-images-1.medium.com/max/1600/1*TztpJzCXGEw7N1rEgE8KJQ.png"//http://www.theoldrobots.com/images62/Bender-18.JPG"
        }]);
        session.endDialog(msg);        
    }

]);

bot.dialog('RamiMovie', [
    function (session, args, results) 
    {
        session.conversationData.stepNumber = 0;
        //session.send("...אנא המתן לנציג");
       
        //session.send("?שלום, שמי רמי, איך אוכל לעזור לך");

        var msg = new builder.Message(session)
        .attachments([{
            contentType: "video/mp4",
            contentUrl: "https://www.youtube.com/watch?v=FsvYZUSgzok"
        }]);
        session.endDialog(msg);
        
    }

]);

bot.on('conversationUpdate', function (message)
 {
    console.log("Enter conversationUpdate()");
    if (message.membersAdded) 
    {
        message.membersAdded.forEach(function (identity) 
        {
            if (identity.id === message.address.bot.id) 
            {
                bot.beginDialog(message.address, '/');
            }
        });
    }
});

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
