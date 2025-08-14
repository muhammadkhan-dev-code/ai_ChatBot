let prompt = document.querySelector("#prompt");

let chatContainer = document.querySelector(".chat-container");
let imagebtn=  document.querySelector("#image-btn");

let imageSvg=document.querySelector("#image-btn #imageSvg");

let imageInput= document.querySelector("#image-btn input");

let createChatBox = (html, classes) => {
  let div = document.createElement("div");
  div.innerHTML = html;
  div.classList.add(classes);
  return div;
};



let user = {
  message: null,
  file:{
    mime_type:null,
    data:null

  }
};

const API_KEY = "apikey";
const API_URL = `apiurl`

let generateResponse = async (aiChatBox) => {
  let Ans_text = aiChatBox.querySelector(".ai-chat-area");

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: user.message,
          },
          (user.file.data?[{"inline_data":user.file}]:[])
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
    })

    imageSvg.src = `image.svg`;
    imageSvg.classList.remove("chooseClass");

    user.file={}
  }
};

let handleChatResponse = (message) => {
  user.message = message;

  let html = `
  <div class="userImage">
    <img src="user-icon.svg" alt="" id="user-image" />
  </div>
  <div class="user-chat-box">
    <div class="user-chat-area">
      ${user.message || ""}
      ${
        user.file && user.file.data
          ? `<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseImg" />`
          : ""
      }
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


imageInput.addEventListener("change",()=>{
  const file= imageInput.files[0];
  if(!file) return;

  let reader= new FileReader()
  reader.onload=(e)=>{
    
    let base64Str=e.target.result.split(",")[1] ;
    // console.log(base64Str);
    user.file={
      mime_type:file.type,
      data:base64Str


    }
     imageSvg.src = `data:${user.file.mime_type};base64,${user.file.data}`;
    imageSvg.classList.add("chooseClass");
    
  }
 

  reader.readAsDataURL(file);

})

imagebtn.addEventListener("click",()=>{
  imagebtn.querySelector("input").click();
})
