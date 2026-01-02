// 메인 스크립트: 기존 index.html 의 <script> 내용이 여기로 이동된 상태

// 메인 메시지, 인트로, 버튼 애니메이션
const lines = document.querySelectorAll('.message-line');
const introText = document.getElementById('introText');
const tag = document.getElementById('tag');
const date = document.getElementById('date');
const footer = document.getElementById('footer');
const memoryButton = document.getElementById('memoryButton');
const bgmButton = document.getElementById('bgmButton');
const bgmAudio = document.getElementById('bgm'); // 친구 방식: HTML audio 태그
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

// BGM 상태는 audio 엘리먼트로 직접 관리
let bgmIsPlaying = false;

window.addEventListener('load', () => {
  // 항상 맨 위에서 시작
  window.scrollTo(0, 0);

  // 1단계: intro 텍스트 페이드 인
  if (introText) {
    setTimeout(() => {
      introText.classList.add('show');
    }, 300);

    // 2단계: 위로 올라가면서 작아지는 효과
    setTimeout(() => {
      introText.classList.add('shrink');
    }, 1800);
  }

  // 3단계: intro 사라지고 태그/날짜/메시지 시작
  setTimeout(() => {
    const overlay = document.querySelector('.intro-overlay');
    if (overlay) overlay.style.display = 'none';
    if (tag) tag.classList.add('visible');
    if (date) date.classList.add('visible');
    setTimeout(showNextLine, 400);
  }, 2500);

  // 친구 방식: HTML audio 태그에 autoplay가 걸려 있으므로, 여기서는 상태만 동기화 시도
  if (bgmAudio) {
    // 브라우저가 autoplay를 허용했다면 이미 재생 중일 수 있음
    if (!bgmAudio.paused) {
      bgmIsPlaying = true;
      if (bgmButton) {
        const bgmIcon = bgmButton.querySelector('.bgm-icon');
        if (bgmIcon) bgmIcon.textContent = '❚❚';
      }
    } else {
      // 혹시 멈춰 있으면 play()를 한 번 시도해보고, 막히면 버튼으로만 제어
      bgmAudio
        .play()
        .then(() => {
          bgmIsPlaying = true;
          if (bgmButton) {
            const bgmIcon = bgmButton.querySelector('.bgm-icon');
            if (bgmIcon) bgmIcon.textContent = '❚❚';
          }
        })
        .catch(() => {
          // 자동 재생이 막힌 경우: 조용히 두고, 버튼을 누르면 그때부터 재생
          bgmIsPlaying = false;
          if (bgmButton) {
            const bgmIcon = bgmButton.querySelector('.bgm-icon');
            if (bgmIcon) bgmIcon.textContent = '▶';
          }
        });
    }
  }
});

// "우리 추억 보러 갈래?" 버튼 클릭 시 타임라인으로 스크롤 + 첫 상호작용에서 BGM 시작 시도
if (memoryButton) {
  memoryButton.addEventListener('click', () => {
    if (bgmAudio && !bgmIsPlaying) {
      bgmAudio
        .play()
        .then(() => {
          bgmIsPlaying = true;
          if (bgmButton) {
            const bgmIcon = bgmButton.querySelector('.bgm-icon');
            if (bgmIcon) bgmIcon.textContent = '❚❚';
          }
        })
        .catch(() => {
          // 여기도 막히면 어쩔 수 없음. 사용자가 위쪽 BGM 버튼으로 재생.
        });
    }

    const target = document.getElementById('memories');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

// 스크롤 시 타임라인 아이템 하이라이트 (IntersectionObserver)
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

// BGM 토글 버튼: HTML audio 엘리먼트 재생/일시정지 제어
if (bgmButton && bgmAudio) {
  const bgmIcon = bgmButton.querySelector('.bgm-icon');

  bgmButton.addEventListener('click', () => {
    if (!bgmIsPlaying) {
      bgmAudio
        .play()
        .then(() => {
          bgmIsPlaying = true;
          if (bgmIcon) bgmIcon.textContent = '❚❚';
        })
        .catch(() => {
          // 버튼 클릭인데도 막힌다면 브라우저 정책이 매우 엄격한 경우
        });
    } else {
      bgmAudio.pause();
      bgmIsPlaying = false;
      if (bgmIcon) bgmIcon.textContent = '▶';
    }
  });
}

// 카운트다운 타이머 설정 (테스트용: 2026-01-02 23:48)
document.addEventListener("DOMContentLoaded", () => {
  const timerOverlay = document.getElementById("timerOverlay");
  const target = new Date("2026-01-02T23:48:00+09:00");

  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  let timerInterval;

  function updateCountdown() {
    const now = new Date();
    const diff = target.getTime() - now.getTime();

    if (diff <= 0) {
      if (timerOverlay) {
        timerOverlay.classList.add("hidden");
      }
      if (timerInterval) {
        clearInterval(timerInterval);
      }
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / (60 * 60 * 24));
    const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = totalSeconds % 60;

    if (daysEl) daysEl.textContent = String(days).padStart(2, "0");
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, "0");
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, "0");
  }

  if (timerOverlay && daysEl && hoursEl && minutesEl && secondsEl) {
    updateCountdown();
    timerInterval = setInterval(updateCountdown, 1000);

    // 이미 목표 시간이 지난 상태로 열었을 때 바로 숨기기
    if (new Date().getTime() >= target.getTime()) {
      timerOverlay.classList.add("hidden");
      clearInterval(timerInterval);
    }
  }
});
