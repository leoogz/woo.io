// 메인 스크립트: 기존 index.html 의 <script> 내용이 여기로 이동됩니다.

// 메인 메시지, 인트로, 버튼 애니메이션
const lines = document.querySelectorAll('.message-line');
const introText = document.getElementById('introText');
const tag = document.getElementById('tag');
const date = document.getElementById('date');
const footer = document.getElementById('footer');
const memoryButton = document.getElementById('memoryButton');
let index = 0;

function showNextLine() {
  if (index < lines.length) {
    lines[index].classList.add('visible');
    index++;
    setTimeout(showNextLine, 900); // 다음 줄 간격
  } else {
    // 문장이 다 나오면 footer와 버튼도 나타나게
    if (footer) footer.classList.add('visible');
    setTimeout(() => {
      if (memoryButton) memoryButton.classList.add('visible');
    }, 300);
  }
}

window.addEventListener('load', () => {
  // 1단계: intro 텍스트 페이드 인
  if (introText) {
    setTimeout(() => {
      introText.classList.add('show');
    }, 300);

    // 2단계: 잠깐 보여준 뒤, 위로 작아지면서 이동하는 느낌
    setTimeout(() => {
      introText.classList.add('shrink');
    }, 1800);
  }

  // 3단계: intro 사라지고, 실제 태그/날짜/문장 시작
  setTimeout(() => {
    const overlay = document.querySelector('.intro-overlay');
    if (overlay) overlay.style.display = 'none';
    if (tag) tag.classList.add('visible');
    if (date) date.classList.add('visible');
    setTimeout(showNextLine, 400);
  }, 2500);
});

// "우리 추억 보러 갈래?" 버튼 클릭 시, 타임라인 섹션으로 부드럽게 스크롤
if (memoryButton) {
  memoryButton.addEventListener('click', () => {
    const target = document.getElementById('memories');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

// 스크롤 시 현재 보이는 타임라인 아이템 하이라이트 (IntersectionObserver)
const timelineItems = document.querySelectorAll('.timeline-item');

if ('IntersectionObserver' in window && timelineItems.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        } else {
          entry.target.classList.remove('active');
        }
      });
    },
    {
      threshold: 0.4, // 아이템의 40% 정도가 보일 때 active 처리
    }
  );

  timelineItems.forEach((item) => observer.observe(item));
}

// BGM 관련 코드는 나중에 audio 파일 준비되면 추가 예정입니다.
