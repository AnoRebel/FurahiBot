// Utils
const get = (selector, root = document) => {
  return root.querySelector(selector);
};

const storage = sessionStorage;
const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");
const msgerBtn = get(".msger-send-btn");
const usernameForm = get(".username-inputarea");
const usernameInput = get(".username-input");
const usernameBtn = get(".username-register-btn");
// Icons made by Freepik from www.flaticon.com
const BOT_IMG = "https://image.flaticon.com/icons/svg/327/327779.svg";
const PERSON_IMG = "https://image.flaticon.com/icons/svg/145/145867.svg";
const BOT_NAME = "Friday";
const ENDPOINT = "http://localhost:3000";

const formatDate = (date) => {
  const h = "0" + date.getHours();
  const m = "0" + date.getMinutes();

  return `${h.slice(-2)}:${m.slice(-2)}`;
};

const setUsername = (username) => {
  storage.setItem("username", username);
  usernameInput.value = username;
};

const getUsername = () => {
  return storage.getItem('username');
}

// check for username
let PERSON_NAME = getUsername();
if (PERSON_NAME) {
  usernameBtn.disabled = true;
  usernameBtn.style.cursor = "not-allowed";
  usernameBtn.style.background = "gray";
  msgerBtn.disabled = false;
  msgerBtn.style.cursor = "pointer";
  msgerBtn.style.background = "rgb(0, 196, 65)";
  usernameInput.value = PERSON_NAME;
} else {
  usernameBtn.disabled = false;
  usernameBtn.style.cursor = "pointer";
  usernameBtn.style.background = "rgb(186, 196, 0)";
  msgerBtn.disabled = true;
  msgerBtn.style.cursor = "not-allowed";
  msgerBtn.style.background = "gray";
}

usernameForm.addEventListener("submit", (event) => {
  event.preventDefault();

  setUsername(usernameInput.value);
  usernameBtn.disabled = true;
  usernameBtn.style.cursor = "not-allowed";
  usernameBtn.style.background = "gray";
  msgerBtn.disabled = false;
  msgerBtn.style.cursor = "pointer";
  msgerBtn.style.background = "rgb(0, 196, 65)";
});

usernameInput.addEventListener("change", (event) => {
  setUsername(usernameInput.value);
});

usernameInput.addEventListener("focus", (event) => {
  usernameBtn.disabled = false;
  usernameBtn.style.cursor = "pointer";
  usernameBtn.style.background = "rgb(186, 196, 0)";
  msgerBtn.disabled = true;
  msgerBtn.style.cursor = "not-allowed";
  msgerBtn.style.background = "gray";
});

usernameInput.addEventListener("blur", (event) => {
  if (usernameInput.value) {
    setUsername(usernameInput.value);
    usernameBtn.disabled = true;
    usernameBtn.style.cursor = "not-allowed";
    usernameBtn.style.background = "gray";
    msgerBtn.disabled = false;
    msgerBtn.style.cursor = "pointer";
    msgerBtn.style.background = "rgb(0, 196, 65)";
  } else {
    usernameBtn.disabled = false;
    usernameBtn.style.cursor = "pointer";
    usernameBtn.style.background = "rgb(186, 196, 0)";
    msgerBtn.disabled = true;
    msgerBtn.style.cursor = "not-allowed";
    msgerBtn.style.background = "gray";
  }
});

msgerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const msgText = msgerInput.value;
  if (!msgText) return;

  PERSON_NAME = getUsername();
  appendMessage(PERSON_NAME, PERSON_IMG, "right", msgText);
  msgerInput.value = "";

  sendAndRespond(msgText);
});

const appendMessage = (name, img, side, text) => {
  //   Simple solution for small apps
  //   Though, the texts needs some cleaning since
  //   this version currently allows CrossSite Scripting
  const msgHTML = `
      <div class="msg ${side}-msg">
        <div class="msg-img" style="background-image: url(${img})"></div>
  
        <div class="msg-bubble">
          <div class="msg-info">
            <div class="msg-info-name">${name}</div>
            <div class="msg-info-time">${formatDate(new Date())}</div>
          </div>
  
          <div class="msg-text">${text}</div>
        </div>
      </div>
    `;

  msgerChat.insertAdjacentHTML("beforeend", msgHTML);
  msgerChat.scrollTop += 500;
};

const sendAndRespond = (text) => {
  fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  })
    .then((response) => response.json())
    .then((data) => {
      let reply = data.text;
      // console.log(reply);
      if (reply) {
        appendMessage(BOT_NAME, BOT_IMG, "left", reply);
      } else {
        appendMessage(BOT_NAME, BOT_IMG, "left", "Sorry, I didn't get that, could you try again?")
      }
    });
};
