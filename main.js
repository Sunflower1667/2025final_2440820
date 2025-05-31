document.addEventListener("DOMContentLoaded", () => {
  const toCounselingBtn = document.getElementById("toCounseling");
  const toTeacherBtn = document.getElementById("toTeacher");

  toCounselingBtn.addEventListener("click", () => {
    window.location.href = "/page1.html";
  });

  toTeacherBtn.addEventListener("click", () => {
    window.location.href = "/page2.html";
  });
});
