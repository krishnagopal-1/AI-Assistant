//Add your API KEY first...

const API_KEY = "YOUR_GEMINI_API_KEY_HERE";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + API_KEY;

const headingContainer = document.querySelector(".container");
const chatBoxContainer = document.querySelector(".chatbox-container");
const promt = document.querySelector("#promt");
const btn = document.querySelector("#btn");

let userMessage = null;

const createChatBox = (chatBoxHtml, chatBoxClassName) => {
    let div = document.createElement("div");
    div.classList.add(chatBoxClassName);
    div.innerHTML = chatBoxHtml;
    return div;
};

const apiResponse = async (userMessage) => {
    let html = `<div class="img-container">
                    <img src="Resourses/ai.png" alt="ai.img" width="40">
                </div>
                <p class="chatbox-text">Thinking...</p>
                <img class="loading" src="Resourses/loading.gif" alt="loading" width="40">`;

    const aiChatBox = createChatBox(html, "ai-chatbox");
    chatBoxContainer.appendChild(aiChatBox);
    const textElement = aiChatBox.querySelector(".chatbox-text");
    try {
        const response = await fetch(API_URL,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                { text: userMessage }
                            ]
                        }
                    ]
                }),
            }
        );

        const data = await response.json();
        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, no response!";
        textElement.innerText = aiText;
    } catch (error) {
        aiChatBox.querySelector(".chatbox-text").innerText = "Error: " + error.message;
    } finally {
        const loading = aiChatBox.querySelector(".loading");
        if (loading) loading.remove();
    }
};

const sendMessage = () => {
    userMessage = promt.value;

    if (userMessage === "") {
        headingContainer.style.display = "flex";
        return;
    } {
        headingContainer.style.display = "none";
    }

    let html = `<div class="img-container">
                    <img src="Resourses/user.png" alt="user.img" width="40">
                </div>
                <p class="chatbox-text"></p>`;

    const userChatBox = createChatBox(html, "user-chatbox");
    userChatBox.querySelector(".chatbox-text").innerText = userMessage;
    chatBoxContainer.appendChild(userChatBox);

    promt.value = "";
    promt.focus();

    apiResponse(userMessage);
};

btn.addEventListener("click", sendMessage);

promt.addEventListener("keydown", (evnt) => {
    if (evnt.key == "Enter") {
        evnt.preventDefault();
        sendMessage();
    }
});

window.addEventListener("load", () => {
    promt.focus();
});
