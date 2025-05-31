const correctPassword = "teacher123";

const passwordInput = document.getElementById("password");
const checkBtn = document.getElementById("checkBtn");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const downloadBtn = document.getElementById("downloadBtn");
const resetBtn = document.getElementById("resetBtn");
const goHomeBtn = document.getElementById("goHomeBtn");
const tbody = document.getElementById("logTableBody");

let logs = [];           // 전체 상담 기록
let filteredLogs = [];   // 필터링 결과

// 🔐 비밀번호 확인
checkBtn.addEventListener("click", checkPassword);
passwordInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    checkPassword();
  }
});

function checkPassword() {
  const input = passwordInput.value.trim();
  if (input === correctPassword) {
    document.getElementById("log-section").style.display = "block";

    // ✅ 입력창 및 버튼 숨김 처리
    passwordInput.style.display = "none";
    checkBtn.style.display = "none";

    loadCounselingLogs();
  } else {
    alert("암호가 올바르지 않습니다.");
  }
}

// 🔄 상담 내역 불러오기
function loadCounselingLogs() {
  logs = JSON.parse(localStorage.getItem("counselingLogs") || "[]");
  filteredLogs = [...logs];
  renderTable(filteredLogs);
}

// 📋 테이블 렌더링
function renderTable(data) {
  tbody.innerHTML = "";

  if (data.length === 0) {
    tbody.innerHTML = "<tr><td colspan='5'>상담 내역이 없습니다.</td></tr>";
    return;
  }

 data.forEach((log, index) => {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${log.date}</td>
    <td>${log.time || "-"}</td>
    <td>${log.name}</td>
    <td>${log.id}</td>
    <td>${log.content}</td>
    <td>
      <textarea
        data-index="${index}"
        class="memo-field"
        placeholder="메모 입력"
        rows="2"
        style="width: 100%; margin-bottom: 5px;">${log.memo || ''}</textarea>
      <button class="save-memo-btn" data-index="${index}">저장</button>
    </td>
  `;
  tbody.appendChild(row);
});

  // ✅ 저장 버튼 이벤트 연결
  const saveButtons = document.querySelectorAll(".save-memo-btn");
  saveButtons.forEach(button => {
    button.addEventListener("click", (e) => {
      const i = parseInt(e.target.dataset.index);
      const textarea = document.querySelector(`textarea[data-index="${i}"]`);
      logs[i].memo = textarea.value;
      localStorage.setItem("counselingLogs", JSON.stringify(logs));
      alert("메모가 저장되었습니다.");
    });
  });
}
    

// 🔍 검색 버튼 클릭 시 정확 일치 필터
searchBtn?.addEventListener("click", () => {
  const keyword = searchInput.value.trim();
  if (!keyword) {
    filteredLogs = [...logs];
  } else {
    filteredLogs = logs.filter(log =>
      log.name === keyword || log.id === keyword
    );
  }
  renderTable(filteredLogs);
});

// 📥 CSV 다운로드
downloadBtn?.addEventListener("click", () => {
  if (filteredLogs.length === 0) {
    alert("다운로드할 데이터가 없습니다.");
    return;
  }

  const header = ["날짜", "시간", "이름", "학번", "상담 내용", "교사 메모"];
  const rows = filteredLogs.map(log => [
    `"${log.date}"`,
    `"${log.time || "-"}"`,
    `"${log.name}"`,
    `"${log.id}"`,
    `"${log.content?.replace(/\n/g, ' ')}"`,
    `"${log.memo?.replace(/\n/g, ' ') || ''}"`
  ]);

  const csvContent = [header, ...rows].map(e => e.join(",")).join("\n");

  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "상담기록.csv";
  link.click();
  URL.revokeObjectURL(url);
});

// 🗑 초기화 버튼
resetBtn?.addEventListener("click", () => {
  const confirmDelete = confirm("정말 모든 상담 내역을 초기화하시겠습니까?");
  if (confirmDelete) {
    localStorage.removeItem("counselingLogs");
    logs = [];
    filteredLogs = [];
    renderTable([]);
  }
});

// 🏠 첫 페이지로
goHomeBtn?.addEventListener("click", () => {
  window.location.href = "index.html";
});
