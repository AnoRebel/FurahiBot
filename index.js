const express = require("express");
const path = require("path");

require('dotenv-safe').config();
const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;
const ENDPOINT = process.env.ENDPOINT;
const ASSISTANT_ID = process.env.ASSISTANT_ID;
let SESSION_ID;

const AssistantV2 = require("ibm-watson/assistant/v2");
const { IamAuthenticator } = require("ibm-watson/auth");

const assistant = new AssistantV2({
  version: "2020-04-01",
  authenticator: new IamAuthenticator({
    apikey: API_KEY,
  }),
  serviceUrl: ENDPOINT,
});

const sendAndRespond = async (text, session_id) => {
  try {
    let sending = await assistant.message({
      assistantId: ASSISTANT_ID,
      sessionId: `${session_id}`,
      input: {
        message_type: "text",
        text: text,
      },
    });

    return sending.result.output;
  } catch (err) {
    console.log(err);
  }
};

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  if (SESSION_ID) {
    // console.log(SESSION_ID);
    console.log("We rolling");
  } else {
    assistant
      .createSession({
        assistantId: ASSISTANT_ID,
      })
      .then((res) => {
        SESSION_ID = res.result.session_id;
        console.log(SESSION_ID);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  res.render("index", { SESSION_ID });
});

app.post("/", async (req, res) => {
  let data = req.body;
  let output = await sendAndRespond(data.text, SESSION_ID);
  console.log(output.generic[0].text);
  res.status(200).json({ text: output.generic[0].text });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
