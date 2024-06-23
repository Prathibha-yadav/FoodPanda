const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");

require("dotenv").config();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

async function askGemini(ingredients) {
    try {
      const prompt = `Generate a recipe using ingredients: ${ingredients} the output you provide should be upto 10 line which should include the steps of preparation`;
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();
      console.log("Input by user:", ingredients);
      console.log("Output by AI:", text);
      return text;
    } catch (error) {
      console.error("Error making a query to Gemini API:", error);
      return null;
    }
  }
  

app.get('/', (req, res) => {
  res.render('index', { response: null });
});

app.post('/GeminiResponse', async (req, res) => {
    const userInput = req.body.text;
    const response = await askGemini(userInput);
  
    if (response) {
      res.render('index', { response });
    } else {
      res.render('index', { response: 'Error making a query to Gemini API' });
    }
  });
  

module.exports = app;
