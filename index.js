const express = require("express");
const { handleGenerateRequest,handleGenerateRequestLine } = require("./generateContent");
const bodyParser = require('body-parser')
const request = require('request')
require("dotenv").config();
const {checkUser,pushTransection,get,test}=require("./database");
const app = express();
// 
app.use(express.static('public'));
app.use('/pdfs', express.static('pdfs'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const port = process.env.PORT || 3000;
var d=1
setInterval(function() {console.log("hi", new Date());}, 100000);
// const { GoogleGenerativeAI } = require("@google/generative-ai");

// const config = new GoogleGenerativeAI(
//   "AIzaSyBSWTbbbhq9H5vczatrT1CMgGFo8hVTCyE"
// );
// const modelId = "gemini-pro";
// const model = config.getGenerativeModel({ model: modelId });
app.get("/", async(req, res) => { 
  //runSample(null,"ดูบัญชีรายรับ-รายจ่าย รายสัปดาห์","U72c9419216d5cde330627bf8558ff82f");
//   const result = await model.generateContent("ดอกเบี้ยคืออะไร");
// console.log(result);

  res.send("Node.js and Google Gem ini integration example");
  // pushTransection(d++,"add",50);
  // get(1);
  // test()

});
app.post("/generate", handleGenerateRequest);
app.post('/webhook', handleGenerateRequestLine);
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
