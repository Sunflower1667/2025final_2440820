const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const chatbox = document.getElementById('chatbox');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

// ✅ 대화 기록 배열 생성
let messages = [];

async function fetchGPTResponse(prompt) {
  // 사용자 메시지 추가
  messages.push({ role: "user", content: prompt });

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4-turbo",
      messages: messages, // ✅ 이전 대화 포함
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  const reply = data.choices[0].message.content;

  // GPT 응답도 대화 기록에 추가
  messages.push({ role: "assistant", content: reply });
  return reply;
}

async function sendMessage() {
  const prompt = userInput.value.trim();
  if (!prompt) return;

  chatbox.innerHTML += `<div class="text-right mb-2 text-blue-600">나: ${prompt}</div>`;
  userInput.value = '';
  resizeTextarea();
  chatbox.scrollTop = chatbox.scrollHeight;

  const reply = await fetchGPTResponse(prompt);
  chatbox.innerHTML += `<div class="text-left mb-2 text-gray-800">GPT: ${reply}</div>`;
  chatbox.scrollTop = chatbox.scrollHeight;
}

sendBtn.addEventListener('click', sendMessage);

userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

userInput.addEventListener('input', resizeTextarea);

function resizeTextarea() {
  userInput.style.height = 'auto';
  userInput.style.height = userInput.scrollHeight + 'px';
}
