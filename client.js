// =========================================================
// wishket-refui · Client JavaScript (프로젝트: 154865 PDF 발송)
// =========================================================

// 프로젝트별 데이터 오버라이드 (client.js 본체는 REFUI_DATA를 우선 사용)
window.REFUI_DATA = {
  // 7일 발송 추이
  trend: {
    labels: ['4-19', '4-20', '4-21', '4-22', '4-23', '4-24', '4-25'],
    values: [124, 118, 156, 142, 189, 203, 247],
  },
  // 채널별 비중 (오늘)
  allocation: {
    labels: ['알림톡', '이메일', '웹팩스', '자동대체'],
    values: [142, 78, 19, 8],
  },
  // 엔진 서브 스코어 (채널별 성과)
  subScores: [98, 96, 91, 72, 88],
  // 리스크 매트릭스
  risks: [
    { id: 'R1',  name: 'Oracle DB 접근 방식 미확정',            impact: 3, prob: 3, score: 9, strategy: 'Q1 최우선 확정. IT 부서 동석 요청. VPN/파일 전달 중간 옵션 제안.' },
    { id: 'R2',  name: '알림톡 심사 지연/탈락',                  impact: 3, prob: 3, score: 9, strategy: 'W01 Day1 신청. 알리고+솔라피 이중 계약. 보수적 템플릿 작성.' },
    { id: 'R5',  name: '1,500만원 예산 범위 확장 누적',          impact: 3, prob: 3, score: 9, strategy: 'Core/Optional/Out of Scope 3단 합의. 변경 영향도 시트 서면 승인.' },
    { id: 'R6',  name: '첫 프로젝트 클라이언트 의사결정 지연',   impact: 2, prob: 3, score: 6, strategy: '48시간 결정 SLA. 주간 시연 강제. 진행 방식 교육 슬라이드.' },
    { id: 'R9',  name: 'Oracle 스키마 공유 지연',                impact: 3, prob: 2, score: 6, strategy: '샘플 데이터(CSV)로 선행 작업. 실 스키마 수령 후 매핑 조정.' },
    { id: 'R11', name: '외부 API 비용을 개발비에 포함 가정',      impact: 3, prob: 2, score: 6, strategy: 'Q9 계약 주체 분리. 월 비용 시뮬레이션 제공.' },
    { id: 'R12', name: '1인 풀수행 한계 (기획+디자인+개발+인프라)', impact: 3, prob: 2, score: 6, strategy: 'Ant Design Pro 활용. 디자인 시안 외주 대비. AI 도구로 속도 3배.' },
    { id: 'R14', name: '운영 환경(온프레미스 vs 클라우드) 미결정', impact: 3, prob: 2, score: 6, strategy: 'Q11 조기 결정. 클라우드 권장 (비용/일정 예측).' },
    { id: 'R16', name: '개인정보 준수 수준 모호',                impact: 3, prob: 2, score: 6, strategy: 'Q23 답변. 기본선 TLS+BCrypt+감사. 강화 시 별도 견적.' },
    { id: 'R3',  name: '"수동 선택·즉시 발송" 해석 차이',         impact: 2, prob: 3, score: 6, strategy: 'Q2/Q4 사전 합의. "다중 선택 N건 이하" 계약서 명시.' },
    { id: 'R4',  name: '발송 규모 미파악 → 인프라 비용 폭증',    impact: 3, prob: 2, score: 6, strategy: 'Q3 범위 확정. 구간별 견적 제공 (수백/수천/수만).' },
    { id: 'R7',  name: '웹팩스 KISA 등록 지연',                  impact: 2, prob: 2, score: 4, strategy: '조기 접수. Mock Adapter로 UI·이력 선행 개발.' },
    { id: 'R8',  name: 'PDF 한글 렌더링 이슈',                   impact: 2, prob: 2, score: 4, strategy: 'Noto Sans KR 임베딩 사전 검증. Puppeteer fallback 준비.' },
    { id: 'R18', name: '외부 API Rate Limit',                   impact: 2, prob: 2, score: 4, strategy: 'Token Bucket. SES sandbox 해제. 대행사 TPS 확인.' },
    { id: 'R20', name: '하자보수 중 유지보수 추가 요구',          impact: 2, prob: 2, score: 4, strategy: '계약서 하자보수 범위 명시. 추가 요청은 별도 견적.' },
  ],
};

(() => {
  // =========================================================
  // 1. CountUp
  // =========================================================
  function countUp(el, target, duration = 1500, decimal = false) {
    const start = 0;
    const startTime = performance.now();
    function tick(now) {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = start + (target - start) * eased;
      el.textContent = decimal
        ? value.toFixed(1)
        : Math.round(value).toLocaleString('ko-KR');
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function observeCountUps() {
    const els = document.querySelectorAll('[data-countup], [data-countup-decimal]');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting || e.target.dataset.countupDone) return;
        e.target.dataset.countupDone = '1';
        const isDecimal = e.target.hasAttribute('data-countup-decimal');
        const target = parseFloat(e.target.getAttribute(isDecimal ? 'data-countup-decimal' : 'data-countup'));
        countUp(e.target, target, 1500, isDecimal);
      });
    }, { threshold: 0.4 });
    els.forEach((el) => io.observe(el));
  }

  // =========================================================
  // 2. Chart.js defaults
  // =========================================================
  function initChartDefaults() {
    if (typeof Chart === 'undefined') return;
    Chart.defaults.color = 'rgba(241,245,249,0.7)';
    Chart.defaults.borderColor = 'rgba(255,255,255,0.08)';
    Chart.defaults.font.family = 'Inter, system-ui, sans-serif';
  }

  // =========================================================
  // 3. Charts — 발송 추이/채널 비중/스파크/레이더/리스크
  // =========================================================
  function initCharts() {
    if (typeof Chart === 'undefined') return;

    const trendData = window.REFUI_DATA.trend;
    const allocationData = window.REFUI_DATA.allocation;
    const subScores = window.REFUI_DATA.subScores;
    const risks = window.REFUI_DATA.risks;

    const trendEl = document.getElementById('chart-trend');
    if (trendEl) {
      new Chart(trendEl, {
        type: 'line',
        data: {
          labels: trendData.labels,
          datasets: [{
            label: '발송 건수',
            data: trendData.values,
            borderColor: '#a855f7',
            backgroundColor: (ctx) => {
              const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 260);
              g.addColorStop(0, 'rgba(168,85,247,0.3)');
              g.addColorStop(1, 'rgba(168,85,247,0)');
              return g;
            },
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 5,
          }],
        },
        options: commonChartOpts({
          scales: {
            x: { grid: { display: false } },
            y: {
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: { callback: (v) => v + '건' },
            },
          },
        }),
      });
    }

    const allocEl = document.getElementById('chart-allocation');
    if (allocEl) {
      new Chart(allocEl, {
        type: 'doughnut',
        data: {
          labels: allocationData.labels,
          datasets: [{
            data: allocationData.values,
            backgroundColor: ['#a855f7', '#10b981', '#22d3ee', '#f59e0b'],
            borderWidth: 0,
            hoverOffset: 8,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '65%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: { padding: 16, usePointStyle: true, pointStyle: 'circle' },
            },
          },
        },
      });
    }

    const sparkEl = document.getElementById('sparkline-today');
    if (sparkEl) {
      const arr = [];
      let v = 10;
      for (let i = 0; i < 24; i++) { v += (Math.random() - 0.3) * 6; arr.push(Math.max(0, v)); }
      new Chart(sparkEl, {
        type: 'line',
        data: {
          labels: Array.from({length: 24}, (_, i) => i),
          datasets: [{
            data: arr,
            borderColor: '#10b981',
            borderWidth: 1.5,
            fill: false,
            tension: 0.4,
            pointRadius: 0,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { enabled: false } },
          scales: { x: { display: false }, y: { display: false } },
        },
      });
    }

    const radarEl = document.getElementById('chart-radar');
    if (radarEl) {
      new Chart(radarEl, {
        type: 'radar',
        data: {
          labels: ['도달률', '응답속도', '비용효율', '수신인 매칭', '재발송 성공'],
          datasets: [{
            label: '채널 종합 성과',
            data: subScores,
            backgroundColor: 'rgba(168,85,247,0.2)',
            borderColor: '#a855f7',
            borderWidth: 2,
            pointBackgroundColor: '#a855f7',
            pointBorderColor: '#fff',
            pointRadius: 5,
            pointHoverRadius: 7,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            r: {
              angleLines: { color: 'rgba(255,255,255,0.1)' },
              grid: { color: 'rgba(255,255,255,0.08)' },
              pointLabels: { font: { size: 12 }, color: '#cbd5e1' },
              ticks: { backdropColor: 'transparent', color: '#64748b', stepSize: 20 },
              suggestedMin: 0, suggestedMax: 100,
            },
          },
        },
      });
    }

    const riskEl = document.getElementById('chart-risks');
    if (riskEl) {
      const datasetsByColor = {
        danger: { label: '치명', data: [], backgroundColor: 'rgba(239,68,68,0.8)', borderColor: '#ef4444' },
        warn:   { label: '중',  data: [], backgroundColor: 'rgba(245,158,11,0.8)', borderColor: '#f59e0b' },
        info:   { label: '낮음', data: [], backgroundColor: 'rgba(100,116,139,0.8)', borderColor: '#64748b' },
      };
      risks.forEach((r) => {
        const color = r.score >= 7 ? 'danger' : (r.score >= 4 ? 'warn' : 'info');
        datasetsByColor[color].data.push({ x: r.impact, y: r.prob, id: r.id, name: r.name, strategy: r.strategy, score: r.score });
      });
      new Chart(riskEl, {
        type: 'scatter',
        data: { datasets: Object.values(datasetsByColor).map((ds) => ({ ...ds, pointRadius: 10, pointHoverRadius: 14, borderWidth: 2 })) },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          onClick: (e, elements) => {
            if (!elements.length) return;
            const el = elements[0];
            const dataset = e.chart.data.datasets[el.datasetIndex];
            const pt = dataset.data[el.index];
            openSidePanel(`리스크 ${pt.id}: ${pt.name}`, `
              <div class="space-y-3">
                <div class="rounded-lg p-3 bg-white/5 border border-white/10">
                  <div class="text-xs text-slate-400">점수</div>
                  <div class="text-2xl font-bold">${pt.score} / 9</div>
                </div>
                <div>
                  <div class="text-xs text-slate-400 mb-1">대응 전략</div>
                  <p class="text-sm text-slate-200">${pt.strategy}</p>
                </div>
              </div>
            `);
          },
          plugins: {
            legend: { position: 'top' },
            tooltip: {
              callbacks: {
                label: (ctx) => `${ctx.raw.id}: ${ctx.raw.name} (${ctx.raw.score})`,
              },
            },
          },
          scales: {
            x: {
              title: { display: true, text: '영향 →' },
              min: 0.5, max: 3.5,
              ticks: { stepSize: 1, callback: (v) => ['', '하', '중', '상'][v] || '' },
              grid: { color: 'rgba(255,255,255,0.04)' },
            },
            y: {
              title: { display: true, text: '확률 →' },
              min: 0.5, max: 3.5,
              ticks: { stepSize: 1, callback: (v) => ['', '하', '중', '상'][v] || '' },
              grid: { color: 'rgba(255,255,255,0.04)' },
            },
          },
        },
      });
    }
  }

  function commonChartOpts(extra = {}) {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(2,6,23,0.95)',
          borderColor: 'rgba(168,85,247,0.3)',
          borderWidth: 1,
          padding: 12,
          titleFont: { size: 12 },
          bodyFont: { size: 11 },
        },
      },
      ...extra,
    };
  }

  // =========================================================
  // 4. ⌘K
  // =========================================================
  function initCmdK() {
    const modal = document.getElementById('cmdk-modal');
    const backdrop = document.getElementById('cmdk-backdrop');
    const trigger = document.getElementById('cmdk-trigger');
    const input = document.getElementById('cmdk-input');
    const items = document.querySelectorAll('.cmdk-item');
    if (!modal || !backdrop) return;

    let selectedIdx = 0;
    function open() { modal.classList.remove('hidden'); modal.classList.add('flex'); backdrop.classList.remove('hidden'); input?.focus(); }
    function close() { modal.classList.add('hidden'); modal.classList.remove('flex'); backdrop.classList.add('hidden'); if (input) input.value = ''; filterItems(''); }
    function filterItems(q) {
      const query = q.toLowerCase();
      items.forEach((item) => {
        const text = item.textContent.toLowerCase();
        item.style.display = query && !text.includes(query) ? 'none' : '';
      });
      const visible = Array.from(items).filter(it => it.style.display !== 'none');
      items.forEach((it) => it.classList.remove('bg-white/5'));
      if (visible[0]) { visible[0].classList.add('bg-white/5'); selectedIdx = 0; }
    }
    function goto(item) { const target = item.getAttribute('data-target'); close(); if (target) document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' }); }

    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); modal.classList.contains('hidden') ? open() : close(); }
      if (e.key === 'Escape') close();
      if (!modal.classList.contains('hidden')) {
        const visible = Array.from(items).filter(it => it.style.display !== 'none');
        if (e.key === 'ArrowDown') { e.preventDefault(); selectedIdx = Math.min(selectedIdx + 1, visible.length - 1); visible.forEach((it, i) => it.classList.toggle('bg-white/5', i === selectedIdx)); visible[selectedIdx]?.scrollIntoView({ block: 'nearest' }); }
        if (e.key === 'ArrowUp') { e.preventDefault(); selectedIdx = Math.max(selectedIdx - 1, 0); visible.forEach((it, i) => it.classList.toggle('bg-white/5', i === selectedIdx)); visible[selectedIdx]?.scrollIntoView({ block: 'nearest' }); }
        if (e.key === 'Enter') { e.preventDefault(); if (visible[selectedIdx]) goto(visible[selectedIdx]); }
      }
    });
    trigger?.addEventListener('click', open);
    backdrop?.addEventListener('click', close);
    input?.addEventListener('input', (e) => filterItems(e.target.value));
    items.forEach((item) => item.addEventListener('click', () => goto(item)));
  }

  // =========================================================
  // 5. Volume Simulator (= MRR slot 재활용)
  // =========================================================
  function initVolumeSim() {
    const pro = document.getElementById('mrr-pro');
    const free = document.getElementById('mrr-free');
    const proDisp = document.getElementById('mrr-pro-display');
    const freeDisp = document.getElementById('mrr-free-display');
    const result = document.getElementById('mrr-result');
    const yearly = document.getElementById('mrr-yearly');
    if (!pro || !free || !result) return;

    // 알림톡 단가 8원, 팩스 80원 기준
    function update() {
      const kakao = +pro.value;    // 알림톡 건수
      const fax = +free.value;     // 팩스 건수
      const cost = kakao * 8 + fax * 80;
      if (proDisp) proDisp.textContent = kakao.toLocaleString();
      if (freeDisp) freeDisp.textContent = fax.toLocaleString();
      result.textContent = cost.toLocaleString();
      if (yearly) yearly.textContent = (cost * 12).toLocaleString();
    }
    pro.addEventListener('input', update);
    free.addEventListener('input', update);
    update();
  }

  // =========================================================
  // 6. ROI Calculator — 발송 업무 자동화 효과
  // =========================================================
  function initRoi() {
    const trades = document.getElementById('roi-trades');
    const tradesDisp = document.getElementById('roi-trades-display');
    const hours = document.getElementById('roi-hours');
    const cost = document.getElementById('roi-cost');
    if (!trades || !hours) return;

    // 수작업 대비 발송 1건당 7.5분 절감 · 시간당 인건비 50,000원
    const MINUTES_PER_ITEM = 7.5;
    const HOURLY = 50000;
    function update() {
      const monthly = +trades.value;  // 월 발송 건수
      const yearlyMinutes = monthly * 12 * MINUTES_PER_ITEM;
      const yearlyHours = Math.round(yearlyMinutes / 60);
      if (tradesDisp) tradesDisp.textContent = `${monthly.toLocaleString()}건`;
      hours.textContent = yearlyHours.toLocaleString();
      if (cost) cost.textContent = (yearlyHours * HOURLY).toLocaleString();
    }
    trades.addEventListener('input', update);
    update();
  }

  // =========================================================
  // 7. Architecture tabs
  // =========================================================
  function initArchTabs() {
    const tabs = document.querySelectorAll('.arch-tab-trigger');
    const panels = document.querySelectorAll('.arch-tab-panel');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-tab');
        tabs.forEach((t) => {
          t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
          t.classList.toggle('text-slate-400', t !== tab);
          t.classList.toggle('text-cyan-400', t === tab);
        });
        panels.forEach((p) => p.classList.toggle('hidden', p.getAttribute('data-panel') !== target));
      });
    });
  }

  // =========================================================
  // 8. Chatbot (helper widget)
  // =========================================================
  function initChatbot() {
    const toggle = document.getElementById('chatbot-toggle');
    const panel = document.getElementById('chatbot-panel');
    const close = document.getElementById('chatbot-close');
    const form = document.getElementById('chatbot-form');
    const input = document.getElementById('chatbot-input');
    const msgs = document.getElementById('chatbot-messages');
    if (!toggle || !panel) return;
    toggle.addEventListener('click', () => panel.classList.toggle('hidden'));
    close?.addEventListener('click', () => panel.classList.add('hidden'));

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      addMsg('user', text);
      input.value = '';
      setTimeout(() => addMsg('ai', simulateResponse(text)), 600);
    });

    function addMsg(role, text) {
      const div = document.createElement('div');
      div.className = `rounded-xl px-3 py-2 text-sm ${role === 'user' ? 'chat-msg-user' : 'chat-msg-ai'}`;
      div.textContent = text;
      msgs.appendChild(div);
      msgs.scrollTop = msgs.scrollHeight;
    }

    function simulateResponse(t) {
      const s = t.toLowerCase();
      if (/오라클|oracle|db/.test(s)) return 'Oracle은 readonly 전용으로 HikariCP+ojdbc11 풀링으로 안전하게 조회만 수행합니다. 쓰기 쿼리는 JDBC 레벨에서 차단.';
      if (/알림톡|카카오|kakao/.test(s)) return '알림톡은 알리고·솔라피 이중 계약으로 심사 리스크를 분산합니다. 프로젝트 첫날(W01 Day1)에 템플릿 심사 신청 병행.';
      if (/팩스|fax/.test(s)) return '웹팩스는 Channel Port 추상화로 엔팩스·비즈팩스·인터팩스 중 자유롭게 선택/교체 가능합니다. 발신번호 KISA 등록은 조기 접수 권장.';
      if (/예산|비용|얼마|가격/.test(s)) return '1,500만원·180일 Core 범위 기준입니다. 기능 축소 Lite(800~900만원) / 기능 확장 Enterprise(2,200~2,500만원) 옵션도 가능.';
      if (/pdf|렌더|폰트/.test(s)) return 'OpenHTMLtoPDF + Noto Sans KR 임베딩으로 한글 완벽 렌더. 복잡 서식 요구 시 Puppeteer Node sidecar로 자동 전환.';
      if (/일정|기간|몇주/.test(s)) return '180일(26주). Phase 1~4로 나눠 W14에 운영 배포, W26까지 무상 하자보수. 매 2주마다 스테이징 시연.';
      if (/보안|인증|권한/.test(s)) return 'Spring Security + Session(Redis) + CSRF + AuditLog(append-only). 2FA·RBAC 3단계·컬럼 암호화는 옵션.';
      return '궁금하신 부분을 좀 더 구체적으로 질문해주세요. 예: "오라클 연결은?", "알림톡 심사 얼마 걸리나?", "예산 줄일 수 있나?"';
    }
  }

  // =========================================================
  // 9. Side panel
  // =========================================================
  function openSidePanel(title, html) {
    const panel = document.getElementById('side-panel');
    const titleEl = document.getElementById('side-panel-title');
    const body = document.getElementById('side-panel-body');
    if (!panel) return;
    if (titleEl) titleEl.textContent = title;
    if (body) body.innerHTML = html;
    panel.classList.remove('translate-x-full');
  }
  function closeSidePanel() { document.getElementById('side-panel')?.classList.add('translate-x-full'); }
  window.openSidePanel = openSidePanel;
  document.getElementById('side-panel-close')?.addEventListener('click', closeSidePanel);

  // =========================================================
  // 10. Init
  // =========================================================
  function init() {
    observeCountUps();
    initChartDefaults();
    if (typeof Chart !== 'undefined') initCharts();
    else window.addEventListener('load', initCharts);
    initCmdK();
    initVolumeSim();
    initRoi();
    initArchTabs();
    initChatbot();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
