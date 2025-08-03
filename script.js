let prompt = document.querySelector("#prompt");

let chatContainer = document.querySelector(".chat-container");

let createChatBox = (html, classes) => {
  let div = document.createElement("div");
  div.innerHTML = html;
  div.classList.add(classes);
  return div;
};

let user = {
  data: null,
};

const API_KEY = "AIzaSyCGQmT1Qi97evT8Yo743tvHLV01DQNKXts";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

let generateResponse = async (aiChatBox) => {
  let Ans_text = aiChatBox.querySelector(".ai-chat-area");

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: user.data,
          },
        ],
      },
    ],
  };

  let requestOption = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  };

  try {
    let respone = await fetch(API_URL, requestOption).then((response) =>
      response.json()
    );
    let apiResponse = respone.candidates[0].content.parts[0].text
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .trim();
    Ans_text.innerHTML = apiResponse;
  } catch (error) {
    console.error("Error:", error);
  } finally {
    chatContainer.scrollTo({
      top: chatContainer.scrollHeight,
      behavior: "smooth",
    });
  }
};

let handleChatResponse = (message) => {
  user.data = message;

  let html = ` <div class="userImage">
           <img src="user-icon.svg" alt="" id="user-image" />
        </div>
        <div class="user-chat-box">
          <div class="user-chat-area">
           ${user.data}
          </div>
        </div>`;
  prompt.value = "";
  chatContainer.scrollTo({
    top: chatContainer.scrollHeight,
    behavior: "smooth",
  });
  let userChatBox = createChatBox(html, "user-chat");
  chatContainer.appendChild(userChatBox);

  setTimeout(() => {
    let html = `<img src="ai-icon.svg" alt="" id="ai-image" />
        <div class="ai-chat-box">
          <div class="ai-chat-area">
        <img src="loading.svg" alt="loading" width="30" class="loading">
          </div>
        </div>`;
    let aiChatBox = createChatBox(html, "ai-chat");
    chatContainer.appendChild(aiChatBox);
    generateResponse(aiChatBox);
  }, 600);
};
prompt.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleChatResponse(prompt.value);
  }
});
