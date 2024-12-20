const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.API_KEY;
const config = new GoogleGenerativeAI(
  "AIzaSyBSWTbbbhq9H5vczatrT1CMgGFo8hVTCyE"//"AIzaSyBs2HhR49MDULjy1_LScxv11IBAYkocDsk"
);
const modelId = "gemini-pro";
const model = config.getGenerativeModel({ model: modelId });
const request = require("request");
const dialogflow = require("@google-cloud/dialogflow");
const uuid = require("uuid");
const { checkUser, pushTransection, get } = require("./database");
var html_to_pdf = require("html-pdf-node");
const puppeteer = require("puppeteer");
const pdf = require('html-pdf');
const fs = require('fs');
var pd = require('pretty-data').pd;

/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} projectId The project to be used
 */
const projectId = "my-project-1552734877290";
// A unique identifier for the given session
console.log(projectId);
const sessionId = uuid.v4();
const credentials = {
  client_email: "findlpt@my-project-1552734877290.iam.gserviceaccount.com",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCExj+jzD4hxwYJ\n9gjqu6R6eeKp/fEnn8kQtLbJymhpIYt15PKCipim38zC/LA2xoUz279I3ps5AeeH\nMQedeDOnKymE5HnAF0MY2MP2wGwsbVvFXZYQ+mTW6RRBSWlCNSWNECQMCizpRL/S\nCcfVxN7j6lmQdwyxCCXnRW7Rg40u5nQfoU7ODhiOdkcUFBVE+aaVyUs+cdtWj9mz\nsd/nfk7lnKbiEX3YkAtFCi9aylh6VN95/9FW/W41uJ3P6cMAW46Rl8D6W7c3LRuQ\nvOK92fja5d8uER+OhXq4h3Nt5B5vkd/EooFv4mIthXCCmrcTpJN3SRhgGL6ej9TY\nDjgUJGDtAgMBAAECggEAHeQs7SEc5slR8nmlscTbR2h7z0X4nfFS2JQ6p4zOO0be\nSQUpVJrDuaPeSxKM0FQapl1lP9A/1VJ4r56p5nlqdYrZzs2KHGUQSb55Raq1372i\nALmsQHfCroBsOzN+AzYIVWzqFJzQ1hZQcgaaKuXmwRxgHA41OQDK2blvtLLfXMyZ\nmeHzs6h2ajBmssxXe5IPERqrO7/BxFfFtDdfVZZXkpkZLYhTLXwzYCMyC5L52TX7\nQbnwrSu4U2ARVG+F0a9Gy5taj4FSgpitYw4E2tP3vf7rnKvSz29Ql1Ynh+SU1OQi\nkWG6FMmGCAK1FvQ8VnT3YPv4/b11CSfPrg0pqpXekQKBgQC5hRpX1P9uHMHyFiCX\n44XnmRjfBhOoxFqAXtmBAXj4CCtfvKCHlN1rQQjO033RcTMY4EJhWA7ZQFR0JQ8V\ngP/mU5bAqtkCFzmDhy5eZRR3tAyslAYynhfCtHQqbzURPecVkMZVqK4Ho9iWkNru\n22w3Lyxsb8wE0pQPLYqTF5+VvQKBgQC3N1XY3N4rLl1DO/Q46TxICgyzwDaByzOB\nLZQmeVcZNaJii6JFCWEI4zKnpk8cGlwqpHWei+SKQpMLtx194yQ/UZy6LjmPX/te\nDh8jeY4JZFQhqUp6XdHYpEfprle6pKFzkJLwDTjtxL8kTsDQUtBZTFXPBd0M5at7\nycZQ5Sey8QKBgEZOyEYDJe6QHXxmoGGPy56S6dcT0X2DNJ0z1RBMA5FUX0PAE8Ju\nS1+rXPAtPKCUWv4Rd3a2zaHN/HOr28SVh+W9RgOse+OL87MCFzOU8SXQaYE59ANY\n4L5cby3pyV3IbPxCSrgJ3jJtCNc+/InLRH7BdP9/ev1U5OG/q6XFLSitAoGAcH7Z\nhz6Wa40cVpwJaKhNCy6gff4Xebp69WY3ASigAiqcekWibSFFI1/dSnMjP+4viT9R\nuPfMa9hU0Wyt/w3ow7gos2iOjyov/aBOHkoUnE+uGL0JrfjNUGgOf708wK01NPAg\nSKTVv6h+dJymZ0NyCmKEjYjcIX8ju+44hpMtvQECgYAR+XshE1Yd3fP8pwGWsCv0\nrZUjVR9T40c6cPbkDwoIZdKJM6CPTA0Gnhi4z6uXB7Qwmw/9lEDyITfaoomHhssY\nRpeGVa4Blrfq5zwLGBy9ppu2N02GmuXa/mOtsCNZtrcB/HNBdTh0DGxRcK3pqfUR\n4SffDwqlojFzR/ge5zpsvQ==\n-----END PRIVATE KEY-----\n",
};
// Create a new session

const sessionClient = new dialogflow.SessionsClient({
  credentials: credentials,
});
const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

exports.handleGenerateRequest = async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log(prompt);
    const result = await model.generateContent(req.body.text);
    res.json({ response: result });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while generating content.");
  }
};
exports.handleGenerateRequestLine = async (req, res) => {
  try {
    let reply_token = req.body.events[0].replyToken;
    let msg = req.body.events[0].message.text;
    var userid = req.body.events[0].source.userId;
    console.log(req.body.events[0].source.userId);
    //   const { prompt } = req.body;
    //   console.log(prompt);
    //const result = await model.generateContent(msg);
    //console.log(result.response.candidates[0].content.parts[0].text);
    //console.log(result.response.candidates[0].content.parts[0].text);
    runSample(reply_token, msg, userid);
    //reply(reply_token, result.response.candidates[0].content.parts[0].text)

    // return result;
    res.status(200);
  } catch (error) {
    console.error(error);
    //  return result;
    res.status(500).send("An error occurred while generating content.");
  }
};
function reply(reply_token, msg) {
  let headers = {
    "Content-Type": "application/json",
    Authorization:
      "Bearer BrNPhLaaBLY8PfG8xGXQx5xMqHORaVg3ZmBDywQlCofl/FsnRD4L4u4GoxJ55oS7AievR0UahaEY2l5C9BGBeG9ZpeAOYuW+XR3eDQm/0QYYEyU85amf9m5pLNrgEFJL7wASC+mnghEQpXdlRYTNjgdB04t89/1O/w1cDnyilFU=",
  };
  let body = JSON.stringify({
    replyToken: reply_token,
    messages: [
      {
        type: "text",
        text: msg,
      },
    ],
  });
  request.post(
    {
      url: "https://api.line.me/v2/bot/message/reply",
      headers: headers,
      body: body,
    },
    (err, res, body) => {
      console.log("status = " + res.statusCode);
    }
  );
}
function replypdf(reply_token, msg,text) {
  let headers = {
    "Content-Type": "application/json",
    Authorization:
      "Bearer BrNPhLaaBLY8PfG8xGXQx5xMqHORaVg3ZmBDywQlCofl/FsnRD4L4u4GoxJ55oS7AievR0UahaEY2l5C9BGBeG9ZpeAOYuW+XR3eDQm/0QYYEyU85amf9m5pLNrgEFJL7wASC+mnghEQpXdlRYTNjgdB04t89/1O/w1cDnyilFU=",
  };
  let options = { format: "A4", path: `pdfs/${reply_token}.pdf` };
  // Example of options with args //
  // let options = { format: 'A4', args: ['--no-sandbox', '--disable-setuid-sandbox'] };
  var months_th = [ "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม", ];

  let monthName=months_th[msg.month-1];
  console.log(monthName);
  
  let content = `
 <!doctype html>
<html lang="th">
<meta charset="utf-8">
<meta http-equiv="Content-Language" content="th" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="Content-Type" content="text/html; charset=windows-874">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Sarabun:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap" rel="stylesheet">
</head>

<body>
  <h1>Income and Expense Account</h1>
  <h3>${text=='ดูบัญชีรายรับ-รายจ่าย รายเดือน'?monthName:msg.firstday+" - "+msg.lastday}</h3>
  <hr></hr>
  <table>
    <thead>

  <tr>
    <th>วันที่</th>
    <th>รายการ</th>
    <th>รายรับ</th>
    <th>รายจ่าย</th>
    <th>คงเหลือ</th>
  </tr>  </thead>
  <tbody >
`;
  var summoney = msg.sumAmount;
  var income=0
  var outcome=0
  msg.data.forEach((obj) => {
    summoney += obj.amont;
    if(obj.amont>0){
      income+=obj.amont;
    }else{
      outcome+=obj.amont;
    }
    content += `  <tr>
    <td>${obj.date}</td>
    <td>${obj.transaction}</td>
    <td>${obj.amont>0?obj.amont:""}</td>
    <td>${obj.amont<0?obj.amont:""}</td>
    <td>${summoney}</td>
  </tr>
  `;
  });
  content += `
  </tbody>
  <tbody>
  <tr>
    <td colspan="2" >สรุป</td>
    <td>${income}</td>
    <td>${outcome}</td>
    <td>${summoney}</td>
  </tr>
  </tbody>
<style>
  tbody { }

table {
  font-family: "Sarabun", sans-serif;
  border-collapse: collapse;
  text-align-last: center;
  width: 100%;
}

td, th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}
tr {   
}
tr:nth-child(even) {
  background-color: #dddddd;
}
  h1,h3{
  text-align:center;
  font-family: "Sarabun", sans-serif;
  }
</style></table></body> </html>`;
  console.log(content);
  // let file = { content: content };
  // or //
  var pdHtml= pd.xml(content);

fs.writeFile("pdfs/test.html",pdHtml, function (err){

    const url ="https://findlpt.onrender.com/pdfs/test.html"
    let file = { url: url };

  html_to_pdf.generatePdf(file, options).then(pdfBuffer => {
   // console.log(pdfBuffer);
  
    // console.log("PDF Buffer:-", pdfBuffer);

    request.post(
      {
        url: "https://api.line.me/v2/bot/message/push",
        headers: headers,
        body: JSON.stringify({
          to: reply_token,
          messages: [
            {
              type: "template",
              altText: "This is a buttons template",
              template: {
                type: "buttons",
                thumbnailImageUrl:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROGx1uKXsBH1_Kx4IhOoxSUqS1wBLyyeM9yQ&s",
                imageAspectRatio: "rectangle",
                imageSize: "cover",
                imageBackgroundColor: "#FFFFFF",
                title: "Fin.D",
                text: "รายการรายรับ รายจ่าย",
                defaultAction: {
                  type: "uri",
                  label: "ดูรายการ",
                  uri: `https://findlpt.onrender.com/pdfs/${reply_token}.pdf`,
                },
                actions: [
                  // {
                  //   type: "postback",
                  //   label: "Buy",
                  //   data: "action=buy&itemid=123"
                  // },
                  {
                    type: "uri",
                    label: "ดูรายการ",
                    uri: `https://findlpt.onrender.com/pdfs/${reply_token}.pdf`,
                  },
                ],
              },
            },
          ],
        }),
      },
      (err, res, body) => {
        console.log("status = " + JSON.stringify(res));
      }
    );
  });})
}
runSample=async(reply_token, text, userid)=> {
  if (text == "ดูบัญชีรายรับ-รายจ่าย รายเดือน"||text == "ดูบัญชีรายรับ-รายจ่าย รายสัปดาห์") {
    var data = await get(userid,text);
    console.log(data);
    // var textmassage = "";
    // var amonttotal = 0;
    // data.forEach((element) => {
    //   amonttotal += element.amont;
    //   textmassage +=
    //     element.transaction +
    //     " วันที่" +
    //     element.date +
    //     " จำนวน" +
    //     element.amont +
    //     " คงเหลือ" +
    //     amonttotal +
    //     "\n";
    // });
    replypdf(userid, data,text);
    // reply(reply_token, textmassage);
  } else {
    // The text query request.
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          // The query to send to the dialogflow agent
          text: text,
          // The language used by the client (en-US)
          languageCode: "th-TH",
        },
      },
    };

    // Send request and log result
    const responses = await sessionClient.detectIntent(request);

    console.log("Detected intent");
    const result = responses[0].queryResult;
    //console.log(result);
    // console.log(result.parameters.fields.Amont.listValue.values[0].structValue.fields.amount.numberValue);
    // console.log(result.parameters.fields.Transaction.listValue.values[0].stringValue);

    console.log(`  Query: ${result.queryText}`);
    console.log(`  Response: ${result.fulfillmentText}`);
    if (result.intent.displayName == "Question - custom") {
      const result = await model.generateContent(text);
      var textGEMINI = result.response.candidates[0].content.parts[0].text;
      reply(reply_token, textGEMINI);
    } else if (result.intent.displayName == "income-outcome - custom2 - yes") {
      var transec = result.outputContexts[0].parameters.fields.any.stringValue;
      var amont = result.outputContexts[0].parameters.fields.number.numberValue;
      var typetransaction = await checkTTypeTransaction(transec);
      if (typetransaction == "ฝากเงิน") {
        pushTransection(userid, transec, amont);
      } else if (typetransaction == "ถอนเงิน") {
        pushTransection(userid, transec, -amont);
      }
      var data = await get(userid);
      console.log(data.data);
      var amontTotal = 0;
      data.data.forEach((element) => {
        amontTotal += element.amont;
      });
      var text = `ยืนยันการ${transec}\nคุณมียอดเงินทั้งหมด ${amontTotal} บาท\nขอบคุณที่ใช้บริการ`;
      reply(reply_token, text);
    }
    // else if (result.intent.displayName=="income-outcome - custom-2 - yes") {
    //   var transec=result.outputContexts[0].parameters.fields.any.stringValue;
    //   var amont=result.outputContexts[0].parameters.fields.number.numberValue;
    //   pushTransection(userid,transec,-amont);
    //   var data=await get(userid);
    //   console.log(data);
    //   var amontTotal=0;
    //   data.forEach(element => {
    //     amontTotal +=element.amont
    //   });
    //   var text =`ยืนยันการถอนเงิน\nคุณมียอดเงินทั้งหมด ${amontTotal} บาท\nขอบคุณที่ใช้บริการ`
    //   reply(reply_token,text)

    // }
    else if (result.intent) {
      console.log(`  Intent: ${result.intent.displayName}`);
      reply(reply_token, result.fulfillmentText);
    } else {
      console.log("  No intent matched.");
      reply(reply_token, textGEMINI);
    }
  }
}
async function checkTTypeTransaction(text) {
  const sessionClient2 = new dialogflow.SessionsClient({
    credentials: credentials,
  });
  const sessionPath2 = sessionClient2.projectAgentSessionPath(
    projectId,
    sessionId
  );
  var request = {
    session: sessionPath2,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: "ตรวจสอบธุรกรรม",
        // The language used by the client (en-US)
        languageCode: "th-TH",
      },
    },
  };

  // Send request and log result
  var responses = await sessionClient2.detectIntent(request);

  console.log("Detected intent");
  var request = {
    session: sessionPath2,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: text,
        // The language used by the client (en-US)
        languageCode: "th-TH",
      },
    },
  };
  responses = await sessionClient2.detectIntent(request);
  const result = responses[0].queryResult;
  console.log(result.fulfillmentText);
  return result.fulfillmentText;
}
function formatMonth(mm){
  console.log(mm);
  
  var months_th = [ "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม", ];
  console.log(months_th[mm-1]);
  
  return months_th[mm-1];
}
