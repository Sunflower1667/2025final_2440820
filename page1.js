const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

const chatbox = document.getElementById('chatbox');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const studentName = document.getElementById('studentName');
const studentId = document.getElementById('studentId');
const endBtn = document.getElementById('endBtn');


// GPT 역할 지정
let messages = [
  {
    role: "system",
    content: "당신은 진로 진학 상담 교사입니다. 학생의 고민을 진심으로 경청하고, 친절하고 구체적인 조언을 제공하세요. 학생의 고민을 차분히 해결해 주는 진로상담 전문가처럼 대화하세요."
  }
];
// GPT 응답 요청
async function fetchGPTResponse(prompt) {
  messages.push({ role: "user", content: prompt });

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4-turbo",
      messages: messages,
      temperature: 0.7,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("OpenAI API 오류:", data);
    return "죄송합니다. AI 응답을 가져오는 데 문제가 발생했습니다.";
  }

  const reply = data.choices[0].message.content;
  messages.push({ role: "assistant", content: reply });

  return reply;
}

// 상담 내역 저장 (질문 + 답변 포함)
function saveCounselingLog(name, id, question, answer) {
  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const time = now.toTimeString().slice(0, 8); // HH:MM:SS

  const content = `질문: ${question}\n답변: ${answer}`;
  const log = { name, id, content, date, time };

  const existingLogs = JSON.parse(localStorage.getItem("counselingLogs") || "[]");
  existingLogs.push(log);
  localStorage.setItem("counselingLogs", JSON.stringify(existingLogs));
}

// 메시지 전송 처리
async function sendMessage() {
  const name = studentName.value.trim();
  const id = studentId.value.trim();
  const prompt = userInput.value.trim();

  if (!name || !id) {
    alert("이름과 학번을 먼저 입력해 주세요.");
    return;
  }

  if (!prompt) return;

  // 사용자 메시지 출력
  chatbox.innerHTML += `<div class="chat-message user">나 (${name}): ${prompt}</div>`;
  userInput.value = '';
  resizeTextarea();
  chatbox.scrollTop = chatbox.scrollHeight;

  const loadingId = "loading-message";
  chatbox.innerHTML += `<div class="chat-message bot" id="${loadingId}">진로챗봇 작성 중...</div>`;
  chatbox.scrollTop = chatbox.scrollHeight;

  const reply = await fetchGPTResponse(prompt);

  // 로딩 메시지 제거
  const loadingMsg = document.getElementById(loadingId);
  if (loadingMsg) loadingMsg.remove();

  // 챗봇 응답 메시지 출력
  chatbox.innerHTML += `<div class="chat-message bot">진로챗봇: ${reply}</div>`;
  chatbox.scrollTop = chatbox.scrollHeight;

  // ✅ 질문과 답변을 함께 저장
  saveCounselingLog(name, id, prompt, reply);

  userInput.focus();
}

// 이벤트 바인딩
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});
userInput.addEventListener('input', resizeTextarea);

// 입력창 자동 높이 조절
function resizeTextarea() {
  userInput.style.height = 'auto';
  userInput.style.height = userInput.scrollHeight + 'px';
}

// 상담 종료
endBtn.addEventListener('click', () => {
  window.location.href = 'index.html';
});
