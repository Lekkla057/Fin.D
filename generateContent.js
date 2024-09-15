const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.API_KEY;
const config = new GoogleGenerativeAI(
  "AIzaSyBs2HhR49MDULjy1_LScxv11IBAYkocDsk"
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
var fs = require('fs');

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
function replypdf(reply_token, msg) {
  let headers = {
    "Content-Type": "application/json",
    Authorization:
      "Bearer BrNPhLaaBLY8PfG8xGXQx5xMqHORaVg3ZmBDywQlCofl/FsnRD4L4u4GoxJ55oS7AievR0UahaEY2l5C9BGBeG9ZpeAOYuW+XR3eDQm/0QYYEyU85amf9m5pLNrgEFJL7wASC+mnghEQpXdlRYTNjgdB04t89/1O/w1cDnyilFU=",
  };
  let options = { format: "A4", path: `pdfs/${reply_token}.pdf` };
  // Example of options with args //
  // let options = { format: 'A4', args: ['--no-sandbox', '--disable-setuid-sandbox'] };
  let content = `
 <!doctype html>
<html lang="th">
<meta charset="utf-8">
<meta http-equiv="Content-Language" content="th" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="Content-Type" content="text/html; charset=windows-874">
<link rel="stylesheet" href="style.css" />
</head>

<body>
  <h1>Income and Expense Account</h1>
  <hr></hr>
  <table>
    <thead>

  <tr>
    <th>Date</th>
    <th>Transaction</th>
    <th>Amont</th>
    <th>Balanceต๋อง</th>
  </tr>  </thead>
  <tbody class="sarabun-thin">
`;
  var summoney = 0;
  msg.forEach((obj) => {
    summoney += obj.amont;
    content += `  <tr>
    <td>${obj.date}</td>
    <td>${obj.transaction}</td>
    <td>${obj.amont}</td>
    <td>${summoney}</td>
  </tr>
  `;
  });
  content += `</tbody>
<style>
  tbody { display: flex; flex-direction: column-reverse; }

table {
  border-collapse: collapse;
  width: 100%;
}

td, th {
  width :25%;
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}
tr {   width :100%;
display: flex;
}
tr:nth-child(even) {
  background-color: #dddddd;
}
  h1{
  text-align:center;
  }
</style></table></body> </html>`;
  console.log(content);
  let file = { content: content };
  // or //
  pdf.create(content, { format: 'A4' }).toFile(`pdfs/${reply_token}.pdf`, (err, res) => {
    if (err) return console.log(err);
    console.log(res);
  
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
                  `data:image/png;base64,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`,
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
  });
}
async function runSample(reply_token, text, userid) {
  if (text == "ดูบัญชีรายรับ-รายจ่าย") {
    var data = await get(userid);
    console.log(data);
    var textmassage = "";
    var amonttotal = 0;
    data.forEach((element) => {
      amonttotal += element.amont;
      textmassage +=
        element.transaction +
        " วันที่" +
        element.date +
        " จำนวน" +
        element.amont +
        " คงเหลือ" +
        amonttotal +
        "\n";
    });
    replypdf(userid, data);
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
    } else if (result.intent.displayName == "income-outcome - custom - yes") {
      var transec = result.outputContexts[0].parameters.fields.any.stringValue;
      var amont = result.outputContexts[0].parameters.fields.number.numberValue;
      var typetransaction = await checkTTypeTransaction(transec);
      if (typetransaction == "ฝากเงิน") {
        pushTransection(userid, transec, amont);
      } else if (typetransaction == "ถอนเงิน") {
        pushTransection(userid, transec, -amont);
      }
      var data = await get(userid);
      console.log(data);
      var amontTotal = 0;
      data.forEach((element) => {
        amontTotal += element.amont;
      });
      var text = `ยืนยันการฝากเงิน\nคุณมียอดเงินทั้งหมด ${amontTotal} บาท\nขอบคุณที่ใช้บริการ`;
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
