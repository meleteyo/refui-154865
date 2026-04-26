// 알림 팝오버 + 커맨드 검색 모달
const { useState: useState_p, useEffect: useEffect_p, useRef: useRef_p, useMemo: useMemo_p } = React;

// ─────────────────────────────────────────────────────────────────
// 알림 팝오버 — 헤더 벨 클릭
// ─────────────────────────────────────────────────────────────────
function NotificationsPopover({ onClose, onNavigate }) {
  const ref = useRef_p(null);
  const [filter, setFilter] = useState_p('ALL'); // ALL | UNREAD | ALERTS

  useEffect_p(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    setTimeout(() => document.addEventListener('mousedown', onClick), 0);
    return () => document.removeEventListener('mousedown', onClick);
  }, [onClose]);

  const items = [
    { id: 1, sev: 'error',   icon: 'alert',       title: '실패 발송 2건',                 body: 'C-00146 외 1건 · 팩스 회선 통화중',         time: '3분 전',  unread: true,  to: 'history' },
    { id: 2, sev: 'warn',    icon: 'alert',       title: '팩스 채널 큐 적체',              body: '대기열 12건 · 평소 3건',                   time: '12분 전', unread: true,  to: 'history' },
    { id: 3, sev: 'info',    icon: 'sparkles',    title: '알림톡 잔액 임계',              body: '₩28,400 (3,550건분) · 충전 권장',          time: '1시간 전', unread: true,  to: null },
    { id: 4, sev: 'success', icon: 'shieldCheck', title: '오전 배치 완료',                body: '1,247건 · 100% 도달',                       time: '2시간 전', unread: false, to: 'audit' },
    { id: 5, sev: 'info',    icon: 'template',    title: '템플릿 v2.1 → v2.2 신규',      body: '납부확인서 표준형 · 김지선 운영자',          time: '어제',    unread: false, to: 'templates' },
    { id: 6, sev: 'success', icon: 'shieldCheck', title: '서비스 헬스체크 정상',          body: 'Oracle DB · KAKAO API · SMTP 모두 OK',     time: '어제',    unread: false, to: null },
  ];

  const filtered = items.filter(it => {
    if (filter === 'UNREAD') return it.unread;
    if (filter === 'ALERTS') return it.sev === 'error' || it.sev === 'warn';
    return true;
  });

  const unreadCount = items.filter(i => i.unread).length;

  return (
    <div ref={ref} className="absolute top-full right-0 mt-2 w-[380px] z-50 rounded-xl bg-slate-900 border border-white/10 shadow-2xl shadow-purple-500/10 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm text-slate-100">알림</h3>
          {unreadCount > 0 && <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-medium">{unreadCount}</span>}
        </div>
        <button className="text-[11px] text-slate-400 hover:text-purple-300">모두 읽음</button>
      </div>

      {/* Filter tabs */}
      <div className="px-2 py-2 border-b border-white/5 flex items-center gap-1">
        {[
          { id: 'ALL',    label: '전체' },
          { id: 'UNREAD', label: '안읽음' },
          { id: 'ALERTS', label: '경고' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id)}
            className={`flex-1 px-2 py-1.5 rounded text-xs transition ${filter === t.id ? 'bg-purple-500/15 text-purple-200' : 'text-slate-400 hover:bg-white/5'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="max-h-[420px] overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">
            <window.Icon name="check" className="w-8 h-8 mx-auto mb-2 text-emerald-500/50" />
            새로운 알림이 없습니다
          </div>
        ) : (
          filtered.map(it => {
            const sevMap = {
              error:   { icon: 'text-rose-400',    dot: 'bg-rose-400' },
              warn:    { icon: 'text-amber-400',   dot: 'bg-amber-400' },
              info:    { icon: 'text-cyan-400',    dot: 'bg-cyan-400' },
              success: { icon: 'text-emerald-400', dot: 'bg-emerald-400' },
            };
            const s = sevMap[it.sev];
            return (
              <button
                key={it.id}
                onClick={() => { it.to && onNavigate(it.to); onClose(); }}
                className={`w-full text-left px-4 py-3 flex items-start gap-3 border-b border-white/5 last:border-0 transition ${it.unread ? 'bg-white/[0.02]' : ''} hover:bg-white/[0.04]`}
              >
                <div className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 bg-white/5`}>
                  <window.Icon name={it.icon} className={`w-3.5 h-3.5 ${s.icon}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2">
                    <div className={`text-sm font-medium leading-tight ${it.unread ? 'text-slate-100' : 'text-slate-300'}`}>{it.title}</div>
                    {it.unread && <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${s.dot}`}></span>}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5 leading-relaxed">{it.body}</div>
                  <div className="text-[10px] text-slate-600 mt-1">{it.time}</div>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-white/10 bg-white/[0.02]">
        <button className="w-full text-xs text-purple-400 hover:text-purple-300 flex items-center justify-center gap-1 py-1">
          모든 알림 보기 <window.Icon name="arrowRight" className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// 커맨드 검색 모달 — ⌘K
// ─────────────────────────────────────────────────────────────────
function CommandSearchModal({ query, setQuery, onClose, onNavigate }) {
  const inputRef = useRef_p(null);
  const [activeIdx, setActiveIdx] = useState_p(0);

  useEffect_p(() => { setTimeout(() => inputRef.current?.focus(), 50); }, []);

  // Static catalog
  const screens = [
    { type: 'screen', id: 'dashboard', label: '대시보드',     hint: '오늘 운영 현황',       icon: 'home' },
    { type: 'screen', id: 'console',   label: '발송 콘솔',     hint: '새 발송 시작',         icon: 'send' },
    { type: 'screen', id: 'history',   label: '이력 · 재발송', hint: '최근 발송 검색',       icon: 'history' },
    { type: 'screen', id: 'templates', label: '템플릿',        hint: 'PDF 템플릿 편집',     icon: 'template' },
    { type: 'screen', id: 'stats',     label: '통계 분석',     hint: '월별 발송·도달률',     icon: 'chart' },
    { type: 'screen', id: 'audit',     label: '감사 로그',     hint: '시스템 이벤트',         icon: 'shield' },
  ];
  const actions = [
    { type: 'action', id: 'console',   label: '새 발송 시작',           hint: '발송 콘솔 진입',     icon: 'send',     kbd: 'N' },
    { type: 'action', id: 'templates', label: '새 템플릿 만들기',       hint: '템플릿 마법사',      icon: 'plus',     kbd: 'T' },
    { type: 'action', id: 'history',   label: '실패 발송만 보기',       hint: '재시도 큐 확인',     icon: 'alert',    kbd: 'F' },
    { type: 'action', id: 'audit',     label: '오늘 감사 로그',          hint: '오늘 시스템 이벤트', icon: 'shield',   kbd: 'L' },
  ];
  const dispatches = (window.MOCK_HISTORY || []).slice(0, 8).map(d => ({
    type: 'dispatch', id: d.id, label: `${d.customer} · ${d.doc}`, hint: `${d.id} · ${d.channel} · ${d.status}`, icon: 'file', payload: d,
  }));
  const customers = [
    { type: 'customer', id: 'C-00142', label: '박민수',   hint: 'C-00142 · 미납 1건',  icon: 'user' },
    { type: 'customer', id: 'C-00144', label: '이영희',   hint: 'C-00144 · 미납 0건',  icon: 'user' },
    { type: 'customer', id: 'C-00146', label: '최지호',   hint: 'C-00146 · 미납 3건',  icon: 'user' },
  ];

  const all = [...actions, ...screens, ...dispatches, ...customers];

  const filtered = useMemo_p(() => {
    if (!query.trim()) return all;
    const q = query.toLowerCase();
    return all.filter(x =>
      x.label.toLowerCase().includes(q) ||
      (x.hint || '').toLowerCase().includes(q) ||
      (x.id || '').toLowerCase().includes(q)
    );
  }, [query]);

  // Group
  const groups = [
    { key: 'action',    title: '액션' },
    { key: 'screen',    title: '화면' },
    { key: 'dispatch',  title: '최근 발송' },
    { key: 'customer',  title: '고객' },
  ];

  // Keyboard nav
  useEffect_p(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, filtered.length - 1)); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); }
      else if (e.key === 'Enter') {
        e.preventDefault();
        const it = filtered[activeIdx];
        if (it) {
          if (it.type === 'dispatch') onNavigate('historyDetail', it.payload);
          else if (it.type === 'customer') onNavigate('history');
          else onNavigate(it.id);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [filtered, activeIdx, onNavigate]);

  useEffect_p(() => { setActiveIdx(0); }, [query]);

  let runningIdx = -1;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[12vh] px-4 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-2xl rounded-xl bg-slate-900 border border-white/10 shadow-2xl shadow-purple-500/10 overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10">
          <window.Icon name="search" className="w-4 h-4 text-slate-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="화면, 액션, 발송 ID, 고객명 검색…"
            className="flex-1 bg-transparent outline-none text-sm text-slate-100 placeholder-slate-500"
          />
          <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-500 font-mono">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-[480px] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-sm text-slate-500">
              <div className="text-2xl mb-2">🔍</div>
              "{query}"에 대한 결과 없음
            </div>
          ) : (
            groups.map(g => {
              const groupItems = filtered.filter(x => x.type === g.key);
              if (groupItems.length === 0) return null;
              return (
                <div key={g.key} className="py-2">
                  <div className="px-4 py-1 text-[10px] uppercase tracking-wider text-slate-500 font-medium">{g.title}</div>
                  {groupItems.map(it => {
                    runningIdx += 1;
                    const idx = runningIdx;
                    const active = idx === activeIdx;
                    return (
                      <button
                        key={`${it.type}-${it.id}-${it.label}`}
                        onMouseEnter={() => setActiveIdx(idx)}
                        onClick={() => {
                          if (it.type === 'dispatch') onNavigate('historyDetail', it.payload);
                          else if (it.type === 'customer') onNavigate('history');
                          else onNavigate(it.id);
                        }}
                        className={`w-full text-left flex items-center gap-3 px-4 py-2.5 transition ${active ? 'bg-purple-500/15' : 'hover:bg-white/[0.03]'}`}
                      >
                        <div className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 ${active ? 'bg-purple-500/30' : 'bg-white/5'}`}>
                          <window.Icon name={it.icon} className={`w-3.5 h-3.5 ${active ? 'text-purple-200' : 'text-slate-400'}`} />
                        </div>
                        <div className="flex-1 min-w-0 flex items-baseline gap-2">
                          <div className={`text-sm ${active ? 'text-slate-50' : 'text-slate-200'} truncate`}>{it.label}</div>
                          <div className="text-xs text-slate-500 truncate">{it.hint}</div>
                        </div>
                        {it.kbd && <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-500 font-mono">⌘{it.kbd}</kbd>}
                        {active && <window.Icon name="arrowRight" className="w-3.5 h-3.5 text-purple-400" />}
                      </button>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-white/10 bg-white/[0.02] flex items-center justify-between text-[10px] text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono">↑↓</kbd> 이동</span>
            <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono">↵</kbd> 선택</span>
            <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono">esc</kbd> 닫기</span>
          </div>
          <div className="font-mono">{filtered.length}개 결과</div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// 사용자 메뉴 팝오버 — 사이드바 하단 설정 아이콘
// ─────────────────────────────────────────────────────────────────
function UserMenuPopover({ onClose, onOpenSettings, onOpenProfile, onOpenTheme, onOpenHelp }) {
  const ref = useRef_p(null);
  useEffect_p(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    setTimeout(() => document.addEventListener('mousedown', onClick), 0);
    return () => document.removeEventListener('mousedown', onClick);
  }, [onClose]);

  const items = [
    { id: 'profile',  icon: 'user',     label: '프로필 보기',     hint: '김지선 · OPERATOR' },
    { id: 'settings', icon: 'settings', label: '설정',             hint: '알림 · 채널 · 보안' },
    { id: 'theme',    icon: 'sparkles', label: '테마',             hint: '다크 (현재)' },
    { id: 'help',     icon: 'shield',   label: '도움말 · 단축키',   hint: '⌘? 로 빠르게' },
  ];

  return (
    <div ref={ref} className="absolute bottom-full left-2 right-2 mb-2 z-50 rounded-xl bg-slate-900 border border-white/10 shadow-2xl shadow-purple-500/10 overflow-hidden">
      {/* Profile header */}
      <div className="px-4 py-3.5 border-b border-white/10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-sm font-bold text-slate-900">김</div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-slate-50 truncate">김지선 운영자</div>
          <div className="text-[11px] text-slate-400 truncate">jisun.kim@daejin.co.kr</div>
        </div>
      </div>

      {/* Menu */}
      <div className="py-1">
        {items.map(it => (
          <button
            key={it.id}
            onClick={() => { if (it.id === 'settings') onOpenSettings(); else if (it.id === 'profile') onOpenProfile(); else if (it.id === 'theme') onOpenTheme(); else if (it.id === 'help') onOpenHelp(); onClose(); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.04] transition text-left"
          >
            <window.Icon name={it.icon} className="w-3.5 h-3.5 text-slate-400" />
            <div className="flex-1 min-w-0">
              <div className="text-sm text-slate-200">{it.label}</div>
              <div className="text-[11px] text-slate-500 truncate">{it.hint}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 py-1">
        <button className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-rose-500/10 transition text-left text-rose-300">
          <window.Icon name="alert" className="w-3.5 h-3.5" />
          <span className="text-sm">로그아웃</span>
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// 설정 모달 — 사용자 메뉴 → 설정 클릭
// ─────────────────────────────────────────────────────────────────
function SettingsModal({ onClose }) {
  const [tab, setTab] = useState_p('profile');
  const [notifChannels, setNotifChannels] = useState_p({ email: true, slack: true, browser: false });
  const [twoFA, setTwoFA] = useState_p(true);
  const [defaultPolicy, setDefaultPolicy] = useState_p('PRIORITY');

  const tabs = [
    { id: 'profile',   label: '프로필',     icon: 'user' },
    { id: 'notif',     label: '알림',       icon: 'bell' },
    { id: 'channels',  label: '채널 정책',   icon: 'send' },
    { id: 'security',  label: '보안',       icon: 'shield' },
    { id: 'shortcuts', label: '단축키',     icon: 'sparkles' },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-3xl h-[600px] rounded-xl bg-slate-900 border border-white/10 shadow-2xl shadow-purple-500/10 overflow-hidden flex" onClick={e => e.stopPropagation()}>
        {/* Sidebar */}
        <aside className="w-52 border-r border-white/10 bg-slate-950 flex flex-col">
          <div className="px-4 py-4 border-b border-white/10">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">SETTINGS</div>
            <div className="text-sm font-semibold text-slate-100">계정 및 시스템</div>
          </div>
          <nav className="p-2 flex-1 space-y-0.5">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition ${tab === t.id ? 'bg-purple-500/15 text-purple-100 border border-purple-500/25' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'}`}
              >
                <window.Icon name={t.icon} className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            ))}
          </nav>
          <div className="p-3 border-t border-white/10 text-[10px] text-slate-500">
            v2.1.4 · staging
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <window.Icon name={tabs.find(x => x.id === tab)?.icon} className="w-4 h-4 text-purple-400" />
              <h2 className="text-base font-semibold text-slate-100">{tabs.find(x => x.id === tab)?.label}</h2>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-white/5">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </header>

          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {tab === 'profile' && (
              <>
                <SettingRow label="이름" hint="고지서 발송 시 발신자 표기에 사용됩니다.">
                  <input className="w-64 px-3 py-2 rounded-md bg-slate-800 border border-white/10 text-sm text-slate-100 focus:outline-none focus:border-purple-500/50" defaultValue="김지선" />
                </SettingRow>
                <SettingRow label="이메일" hint="시스템 알림이 이 주소로 발송됩니다.">
                  <input className="w-64 px-3 py-2 rounded-md bg-slate-800 border border-white/10 text-sm text-slate-100 focus:outline-none focus:border-purple-500/50" defaultValue="jisun.kim@daejin.co.kr" />
                </SettingRow>
                <SettingRow label="역할" hint="권한은 관리자만 변경할 수 있습니다.">
                  <div className="px-3 py-2 rounded-md bg-slate-800/50 border border-white/5 text-sm text-slate-400 w-64">OPERATOR</div>
                </SettingRow>
                <SettingRow label="언어 / 타임존" hint="">
                  <div className="flex gap-2">
                    <select className="px-3 py-2 rounded-md bg-slate-800 border border-white/10 text-sm text-slate-100"><option>한국어</option><option>English</option></select>
                    <select className="px-3 py-2 rounded-md bg-slate-800 border border-white/10 text-sm text-slate-100"><option>Asia/Seoul (KST)</option></select>
                  </div>
                </SettingRow>
              </>
            )}

            {tab === 'notif' && (
              <>
                <div className="text-xs text-slate-400 mb-2">시스템 알림을 어떤 채널로 받을지 선택하세요.</div>
                {[
                  { key: 'email',   label: '이메일',         hint: 'jisun.kim@daejin.co.kr' },
                  { key: 'slack',   label: 'Slack',          hint: '#dispatch-ops 채널' },
                  { key: 'browser', label: '브라우저 푸시',   hint: '실시간 데스크탑 알림' },
                ].map(c => (
                  <SettingRow key={c.key} label={c.label} hint={c.hint}>
                    <Toggle on={notifChannels[c.key]} onChange={v => setNotifChannels(s => ({...s, [c.key]: v}))} />
                  </SettingRow>
                ))}
                <div className="mt-6 pt-5 border-t border-white/10">
                  <div className="text-sm font-medium text-slate-100 mb-3">알림 종류</div>
                  {[
                    { label: '발송 실패',         on: true,  always: true },
                    { label: '큐 적체 (10건+)',  on: true,  always: false },
                    { label: '잔액 임계 도달',    on: true,  always: false },
                    { label: '배치 완료',         on: false, always: false },
                  ].map((n, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <div className="text-sm text-slate-200 flex items-center gap-2">
                        {n.label}
                        {n.always && <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30">필수</span>}
                      </div>
                      <Toggle on={n.on} onChange={() => {}} disabled={n.always} />
                    </div>
                  ))}
                </div>
              </>
            )}

            {tab === 'channels' && (
              <>
                <SettingRow label="기본 발송 정책" hint="채널 우선순위 자동 결정 또는 수동 선택">
                  <div className="flex gap-2">
                    {[
                      { id: 'PRIORITY', label: '자동 (우선순위)' },
                      { id: 'MANUAL',   label: '수동 선택' },
                    ].map(p => (
                      <button key={p.id} onClick={() => setDefaultPolicy(p.id)} className={`px-3 py-2 rounded-md text-xs border ${defaultPolicy === p.id ? 'bg-purple-500/15 border-purple-500/30 text-purple-200' : 'bg-slate-800 border-white/10 text-slate-300'}`}>{p.label}</button>
                    ))}
                  </div>
                </SettingRow>
                <SettingRow label="채널 우선순위" hint="실패 시 다음 채널로 자동 대체">
                  <div className="flex flex-col gap-2">
                    {['알림톡 (KAKAO)', '이메일 (EMAIL)', '웹팩스 (FAX)'].map((c, i) => (
                      <div key={c} className="flex items-center gap-2 px-3 py-2 rounded-md bg-slate-800 border border-white/10 text-sm w-72">
                        <span className="text-[10px] font-mono text-slate-500 w-4">{i+1}</span>
                        <span className="text-slate-200 flex-1">{c}</span>
                        <window.Icon name="chevronRight" className="w-3 h-3 text-slate-600 rotate-90" />
                      </div>
                    ))}
                  </div>
                </SettingRow>
                <SettingRow label="재시도 횟수" hint="채널 실패 시 같은 채널 재시도 한도">
                  <input type="number" min="0" max="5" defaultValue="2" className="w-20 px-3 py-2 rounded-md bg-slate-800 border border-white/10 text-sm text-slate-100" />
                </SettingRow>
              </>
            )}

            {tab === 'security' && (
              <>
                <SettingRow label="2단계 인증" hint="OTP 앱으로 추가 인증을 요구합니다.">
                  <Toggle on={twoFA} onChange={setTwoFA} />
                </SettingRow>
                <SettingRow label="세션 타임아웃" hint="">
                  <select className="px-3 py-2 rounded-md bg-slate-800 border border-white/10 text-sm text-slate-100">
                    <option>30분 (권장)</option>
                    <option>1시간</option>
                    <option>4시간</option>
                  </select>
                </SettingRow>
                <SettingRow label="감사 로그 보존" hint="시스템 정책 (변경 불가)">
                  <div className="px-3 py-2 rounded-md bg-slate-800/50 border border-white/5 text-sm text-slate-400 w-64">90일 (S3 Object Lock)</div>
                </SettingRow>
                <div className="mt-6 pt-5 border-t border-white/10">
                  <div className="text-sm font-medium text-slate-100 mb-3">최근 로그인</div>
                  <div className="space-y-1.5">
                    {[
                      { t: '2026-04-25 09:14', ip: '10.20.30.41 (사무실)', cur: true },
                      { t: '2026-04-24 18:02', ip: '10.20.30.41 (사무실)', cur: false },
                      { t: '2026-04-24 09:08', ip: '10.20.30.41 (사무실)', cur: false },
                    ].map((l, i) => (
                      <div key={i} className="flex items-center justify-between text-xs px-3 py-2 rounded-md bg-slate-800/50 border border-white/5">
                        <span className="text-slate-300 font-mono tabular-nums">{l.t}</span>
                        <span className="text-slate-400 flex items-center gap-2">{l.ip} {l.cur && <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">현재</span>}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {tab === 'shortcuts' && (
              <>
                <div className="text-xs text-slate-400 mb-3">자주 사용하는 단축키</div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { k: '⌘ K',        d: '커맨드 검색' },
                    { k: 'Esc',        d: '모달 닫기' },
                    { k: 'G → D',      d: '대시보드 이동' },
                    { k: 'G → S',      d: '발송 콘솔' },
                    { k: 'G → H',      d: '이력' },
                    { k: 'G → T',      d: '템플릿' },
                    { k: '⌘ ↩',        d: '발송 확정' },
                    { k: '⌘ ?',        d: '도움말' },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-md bg-slate-800/40 border border-white/5">
                      <kbd className="font-mono text-[11px] px-2 py-1 rounded bg-slate-950 border border-white/10 text-purple-200 min-w-[60px] text-center">{s.k}</kbd>
                      <span className="text-sm text-slate-300">{s.d}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-white/10 bg-slate-950/50 flex items-center justify-end gap-2">
            <button onClick={onClose} className="px-3.5 py-1.5 rounded-md text-sm text-slate-300 hover:bg-white/5 border border-white/10">취소</button>
            <button onClick={onClose} className="px-3.5 py-1.5 rounded-md text-sm font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30">저장</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 설정 화면 공용 row
function SettingRow({ label, hint, children }) {
  return (
    <div className="flex items-start justify-between gap-6 py-1">
      <div className="flex-1 min-w-0">
        <div className="text-sm text-slate-200">{label}</div>
        {hint && <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{hint}</div>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

// 토글 스위치
function Toggle({ on, onChange, disabled }) {
  return (
    <button
      onClick={() => !disabled && onChange(!on)}
      disabled={disabled}
      className={`relative w-10 h-5 rounded-full transition flex-shrink-0 ${on ? 'bg-purple-500' : 'bg-slate-700'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow-md ${on ? 'left-[22px]' : 'left-0.5'}`}></span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────
// 충전 모달 — 알림톡 잔액 충전
// ─────────────────────────────────────────────────────────────────
function ChargeModal({ onClose }) {
  const [step, setStep] = useState_p(1); // 1: 금액 선택, 2: 결제 수단, 3: 완료
  const [amount, setAmount] = useState_p(100000);
  const [method, setMethod] = useState_p('card');
  const [autoCharge, setAutoCharge] = useState_p(false);

  const presets = [
    { v: 50000,  msgs: '약 1,500건',  label: '소량' },
    { v: 100000, msgs: '약 3,000건',  label: '권장', recommended: true },
    { v: 300000, msgs: '약 9,000건',  label: '대량' },
    { v: 500000, msgs: '약 15,000건', label: '월간' },
  ];
  const methods = [
    { id: 'card',     icon: 'send',   label: '신용카드', hint: '비자/마스터/국내카드 · 즉시 충전' },
    { id: 'transfer', icon: 'shield', label: '계좌이체', hint: '국민은행 123-45-678901 · 1영업일 내' },
    { id: 'invoice',  icon: 'history',label: '세금계산서 후불', hint: '월말 정산 · 사전 신청 필요' },
  ];
  const fee = method === 'card' ? Math.round(amount * 0.025) : 0;
  const total = amount + fee;
  const newBalance = 12500 + amount;
  const expectedMsgs = Math.floor(amount / 33);

  const fmt = (n) => '₩' + new Intl.NumberFormat('ko').format(n);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-2xl rounded-xl bg-slate-900 border border-white/10 shadow-2xl shadow-amber-500/10 overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <header className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-amber-500/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
              <window.Icon name="alert" className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-50">알림톡 잔액 충전</h2>
              <div className="text-[11px] text-slate-400 mt-0.5">현재 잔여: <span className="text-amber-300 font-mono">₩12,500</span> · 약 380건</div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-white/5">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </header>

        {/* Stepper */}
        <div className="px-6 py-3 border-b border-white/10 flex items-center gap-3 text-xs">
          {[
            { n: 1, label: '금액' },
            { n: 2, label: '결제 수단' },
            { n: 3, label: '완료' },
          ].map((s, i) => (
            <React.Fragment key={s.n}>
              <div className={`flex items-center gap-2 ${step >= s.n ? 'text-amber-200' : 'text-slate-500'}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step > s.n ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : step === s.n ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30' : 'bg-slate-800 text-slate-500 border border-white/5'}`}>
                  {step > s.n ? '✓' : s.n}
                </div>
                <span>{s.label}</span>
              </div>
              {i < 2 && <div className={`flex-1 h-px ${step > s.n ? 'bg-emerald-500/30' : 'bg-white/10'}`}></div>}
            </React.Fragment>
          ))}
        </div>

        {/* Body */}
        <div className="p-6 min-h-[340px]">
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <div className="text-xs text-slate-400 mb-2.5">충전 금액 선택</div>
                <div className="grid grid-cols-2 gap-2">
                  {presets.map(p => (
                    <button
                      key={p.v}
                      onClick={() => setAmount(p.v)}
                      className={`relative p-4 rounded-lg border text-left transition ${amount === p.v ? 'bg-amber-500/15 border-amber-500/40' : 'bg-slate-800/50 border-white/10 hover:border-white/20'}`}
                    >
                      {p.recommended && <span className="absolute top-2 right-2 text-[9px] px-1.5 py-0.5 rounded bg-amber-500/30 text-amber-100 border border-amber-500/40">추천</span>}
                      <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">{p.label}</div>
                      <div className="text-lg font-bold tabular-nums text-slate-50">{fmt(p.v)}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{p.msgs}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-2">또는 직접 입력</div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-sm">₩</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(Number(e.target.value) || 0)}
                    step="10000"
                    min="10000"
                    className="flex-1 px-3 py-2 rounded-md bg-slate-800 border border-white/10 text-sm text-slate-100 tabular-nums focus:outline-none focus:border-amber-500/50"
                  />
                  <span className="text-xs text-slate-500">최소 ₩10,000</span>
                </div>
                <div className="mt-2 text-[11px] text-slate-500">예상 발송 가능: <span className="text-amber-200 font-mono">약 {expectedMsgs.toLocaleString()}건</span> (건당 평균 ₩33)</div>
              </div>
              <label className="flex items-center gap-2 px-3 py-2.5 rounded-md bg-slate-800/50 border border-white/5 cursor-pointer hover:bg-slate-800/80">
                <input type="checkbox" checked={autoCharge} onChange={e => setAutoCharge(e.target.checked)} className="accent-amber-500" />
                <div className="flex-1">
                  <div className="text-sm text-slate-200">자동 충전 활성화</div>
                  <div className="text-[11px] text-slate-500">잔액이 ₩10,000 이하가 되면 자동으로 같은 금액을 충전합니다.</div>
                </div>
              </label>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="text-xs text-slate-400 mb-1">결제 수단 선택</div>
              {methods.map(m => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-lg border text-left transition ${method === m.id ? 'bg-amber-500/10 border-amber-500/40' : 'bg-slate-800/50 border-white/10 hover:border-white/20'}`}
                >
                  <div className={`w-9 h-9 rounded-md flex items-center justify-center ${method === m.id ? 'bg-amber-500/20' : 'bg-slate-700/50'}`}>
                    <window.Icon name={m.icon} className={`w-4 h-4 ${method === m.id ? 'text-amber-200' : 'text-slate-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-100">{m.label}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{m.hint}</div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 ${method === m.id ? 'border-amber-400 bg-amber-400' : 'border-slate-600'}`}>
                    {method === m.id && <span className="block w-1.5 h-1.5 m-0.5 rounded-full bg-slate-900"></span>}
                  </div>
                </button>
              ))}
              {/* Summary */}
              <div className="mt-5 p-4 rounded-lg bg-slate-950 border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">충전 금액</span>
                  <span className="text-slate-200 font-mono tabular-nums">{fmt(amount)}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">결제 수수료 {method === 'card' && '(2.5%)'}</span>
                  <span className="text-slate-300 font-mono tabular-nums">{fee > 0 ? '+ ' + fmt(fee) : '면제'}</span>
                </div>
                <div className="pt-2 mt-2 border-t border-white/10 flex items-center justify-between">
                  <span className="text-sm text-slate-100">합계</span>
                  <span className="text-base font-bold text-amber-200 font-mono tabular-nums">{fmt(total)}</span>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-6">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-emerald-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 13l4 4L19 7"/></svg>
              </div>
              <h3 className="text-lg font-bold text-slate-50">충전이 완료되었습니다</h3>
              <div className="text-sm text-slate-400 mt-1">알림톡 발송에 즉시 사용할 수 있습니다.</div>
              <div className="mt-6 p-4 rounded-lg bg-slate-950 border border-white/10 max-w-sm mx-auto space-y-2 text-left">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">충전 전 잔액</span>
                  <span className="text-slate-300 font-mono">₩12,500</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">충전 금액</span>
                  <span className="text-emerald-300 font-mono">+ {fmt(amount)}</span>
                </div>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <span className="text-sm text-slate-100">현재 잔액</span>
                  <span className="text-base font-bold text-emerald-200 font-mono">{fmt(newBalance)}</span>
                </div>
                <div className="text-[10px] text-slate-500 text-center pt-1">결제번호 · CHG-2026-{Math.floor(Math.random()*9000+1000)}</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-slate-950/50 flex items-center justify-between gap-2">
          <div className="text-[11px] text-slate-500">
            {step === 1 && '결제 정보는 다음 단계에서 입력합니다'}
            {step === 2 && '결제 수단은 안전하게 암호화되어 보관됩니다'}
            {step === 3 && '영수증이 등록 이메일로 발송됩니다'}
          </div>
          <div className="flex items-center gap-2">
            {step > 1 && step < 3 && (
              <button onClick={() => setStep(step - 1)} className="px-3.5 py-1.5 rounded-md text-sm text-slate-300 hover:bg-white/5 border border-white/10">이전</button>
            )}
            {step === 1 && (
              <button onClick={() => setStep(2)} disabled={amount < 10000} className="px-4 py-1.5 rounded-md text-sm font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 shadow-lg shadow-amber-500/30 disabled:opacity-40 disabled:cursor-not-allowed">다음</button>
            )}
            {step === 2 && (
              <button onClick={() => setStep(3)} className="px-4 py-1.5 rounded-md text-sm font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 shadow-lg shadow-amber-500/30">{fmt(total)} 결제하기</button>
            )}
            {step === 3 && (
              <button onClick={onClose} className="px-4 py-1.5 rounded-md text-sm font-semibold bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-900 shadow-lg shadow-emerald-500/30">확인</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// 프로필 모달 — 사용자 메뉴 → 프로필 보기
// ─────────────────────────────────────────────────────────────────
function ProfileModal({ onClose, onOpenSettings }) {
  // 활동 통계 (mock)
  const stats = [
    { label: '이번 달 발송', value: '8,492', unit: '건', tone: 'purple' },
    { label: '성공률',       value: '98.7',  unit: '%',  tone: 'emerald' },
    { label: '재발송 처리',   value: '47',    unit: '건', tone: 'amber'   },
    { label: '템플릿 작성',   value: '12',    unit: '개', tone: 'cyan'    },
  ];
  const toneClass = { purple: 'text-purple-300', emerald: 'text-emerald-300', amber: 'text-amber-300', cyan: 'text-cyan-300' };

  // 최근 활동 (mock)
  const activities = [
    { t: '10분 전',  label: '고지서 일괄발송', detail: '142건 · 알림톡',           icon: 'send',     color: 'purple'  },
    { t: '1시간 전', label: '템플릿 수정',     detail: 'TPL-002 헤드라인 변경',     icon: 'template', color: 'cyan'    },
    { t: '2시간 전', label: '재발송 처리',     detail: '실패 8건 → 이메일',         icon: 'history',  color: 'amber'   },
    { t: '오늘 09:14', label: '로그인',         detail: '10.20.30.41 (사무실)',     icon: 'shield',   color: 'emerald' },
    { t: '어제',     label: '템플릿 등록',     detail: 'TPL-014 납부확인서 v2',    icon: 'template', color: 'cyan'    },
  ];
  const colorBg = { purple: 'bg-purple-500/15 text-purple-300', cyan: 'bg-cyan-500/15 text-cyan-300', amber: 'bg-amber-500/15 text-amber-300', emerald: 'bg-emerald-500/15 text-emerald-300' };

  // 권한 (mock)
  const permissions = [
    { label: '발송 실행',         on: true  },
    { label: '템플릿 편집',       on: true  },
    { label: '재발송 처리',       on: true  },
    { label: '감사 로그 열람',    on: true  },
    { label: '계정 관리',         on: false },
    { label: '시스템 설정 변경',  on: false },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-2xl rounded-xl bg-slate-900 border border-white/10 shadow-2xl shadow-emerald-500/10 overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header — gradient banner */}
        <div className="relative h-24 bg-gradient-to-br from-emerald-500/30 via-cyan-500/20 to-purple-500/20 border-b border-white/10">
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(16,185,129,0.4), transparent 50%), radial-gradient(circle at 70% 50%, rgba(168,85,247,0.4), transparent 50%)' }}></div>
          <button onClick={onClose} className="absolute top-3 right-3 text-slate-200/80 hover:text-white p-1 rounded hover:bg-white/10">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Avatar + name (overlapping banner) */}
        <div className="px-6 -mt-10 relative">
          <div className="flex items-end gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-2xl font-bold text-slate-900 ring-4 ring-slate-900 shadow-lg">김</div>
            <div className="pb-2 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-50">김지선</h2>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-200 border border-emerald-500/40 font-mono">ACTIVE</span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5">jisun.kim@daejin.co.kr · 운영팀</div>
            </div>
            <div className="pb-2 flex gap-2">
              <button onClick={() => { onClose(); onOpenSettings(); }} className="px-3 py-1.5 rounded-md text-xs text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 transition flex items-center gap-1.5">
                <window.Icon name="settings" className="w-3 h-3" />설정
              </button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 pt-5 pb-6 space-y-5 max-h-[440px] overflow-y-auto">
          {/* 활동 통계 */}
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">이번 달 활동</div>
            <div className="grid grid-cols-4 gap-2">
              {stats.map((s, i) => (
                <div key={i} className="p-3 rounded-lg bg-slate-800/50 border border-white/5">
                  <div className="text-[10px] text-slate-500">{s.label}</div>
                  <div className={`mt-1 text-lg font-bold tabular-nums ${toneClass[s.tone]}`}>
                    {s.value}<span className="text-[11px] ml-0.5 text-slate-500">{s.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 기본 정보 + 권한 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-slate-800/40 border border-white/5">
              <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2.5">기본 정보</div>
              <dl className="space-y-2 text-xs">
                <div className="flex justify-between"><dt className="text-slate-400">사번</dt><dd className="text-slate-200 font-mono">EMP-2284</dd></div>
                <div className="flex justify-between"><dt className="text-slate-400">역할</dt><dd className="text-slate-200">OPERATOR</dd></div>
                <div className="flex justify-between"><dt className="text-slate-400">소속</dt><dd className="text-slate-200">운영팀</dd></div>
                <div className="flex justify-between"><dt className="text-slate-400">입사일</dt><dd className="text-slate-200">2024-03-11</dd></div>
                <div className="flex justify-between"><dt className="text-slate-400">최종 로그인</dt><dd className="text-slate-200">오늘 09:14</dd></div>
              </dl>
            </div>
            <div className="p-4 rounded-lg bg-slate-800/40 border border-white/5">
              <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2.5 flex items-center justify-between">
                <span>권한</span>
                <span className="text-[9px] normal-case tracking-normal text-slate-500">관리자가 부여</span>
              </div>
              <div className="space-y-1.5">
                {permissions.map((p, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">{p.label}</span>
                    {p.on ? (
                      <span className="text-emerald-300 flex items-center gap-1">
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>
                      </span>
                    ) : (
                      <span className="text-slate-600 text-[10px]">—</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 최근 활동 */}
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2 flex items-center justify-between">
              <span>최근 활동</span>
              <button className="text-[10px] normal-case tracking-normal text-purple-300 hover:text-purple-200">전체 보기 →</button>
            </div>
            <div className="space-y-1">
              {activities.map((a, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/[0.03] transition">
                  <div className={`w-7 h-7 rounded-md flex items-center justify-center ${colorBg[a.color]}`}>
                    <window.Icon name={a.icon} className="w-3 h-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-slate-100 truncate">{a.label}</div>
                    <div className="text-[11px] text-slate-500 truncate">{a.detail}</div>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono whitespace-nowrap">{a.t}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-slate-950/50 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            계정 변경이 필요하면 시스템 관리자에게 문의하세요
          </div>
          <button onClick={onClose} className="px-3.5 py-1.5 rounded-md text-sm text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10">닫기</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// 테마 모달 — 사용자 메뉴 → 테마
// ─────────────────────────────────────────────────────────────────
function ThemeModal({ onClose }) {
  const saved = (typeof window !== 'undefined' && window.getTheme) ? window.getTheme() : {};
  const [theme, setTheme] = useState_p(saved.theme || 'aurora-dark');
  const [accent, setAccent] = useState_p(saved.accent || 'purple');
  const [density, setDensity] = useState_p(saved.density || 'comfortable');
  const [reduceMotion, setReduceMotion] = useState_p(!!saved.reduceMotion);
  const [highContrast, setHighContrast] = useState_p(!!saved.highContrast);

  // 선택 즉시 실제 화면에 반영 (라이브 프리뷰)
  useEffect_p(() => {
    if (window.applyTheme) window.applyTheme({ theme, accent, density, reduceMotion, highContrast });
  }, [theme, accent, density, reduceMotion, highContrast]);

  // 취소 시 원래 값으로 되돌리기 위한 초기값 보관
  const initial = useRef_p({
    theme: saved.theme || 'aurora-dark',
    accent: saved.accent || 'purple',
    density: saved.density || 'comfortable',
    reduceMotion: !!saved.reduceMotion,
    highContrast: !!saved.highContrast,
  });

  const handleCancel = () => {
    if (window.applyTheme) window.applyTheme(initial.current);
    onClose();
  };
  const handleApply = () => {
    onClose();
  };
  const handleReset = () => {
    setTheme('aurora-dark'); setAccent('purple'); setDensity('comfortable');
    setReduceMotion(false); setHighContrast(false);
  };

  const themes = [
    {
      id: 'aurora-dark', name: '오로라 다크', tag: '현재', recommended: true,
      desc: '보라·시안 그라데이션 · 운영팀 권장',
      preview: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 30%, #581c87 60%, #0f172a 100%)',
      sidebar: 'bg-slate-950', card: 'bg-slate-900', text: 'text-slate-100', accent: 'text-purple-300',
    },
    {
      id: 'midnight', name: '미드나잇', tag: null, recommended: false,
      desc: '순수 다크 · 그라데이션 없음',
      preview: 'linear-gradient(135deg, #020617 0%, #0f172a 100%)',
      sidebar: 'bg-black', card: 'bg-slate-900', text: 'text-slate-100', accent: 'text-cyan-300',
    },
    {
      id: 'graphite', name: '그라파이트', tag: null, recommended: false,
      desc: '뉴트럴 회색 · 차트 가독성↑',
      preview: 'linear-gradient(135deg, #18181b 0%, #27272a 100%)',
      sidebar: 'bg-zinc-950', card: 'bg-zinc-900', text: 'text-zinc-100', accent: 'text-amber-300',
    },
    {
      id: 'paper', name: '페이퍼 라이트', tag: 'BETA', recommended: false,
      desc: '인쇄 미리보기에 적합',
      preview: 'linear-gradient(135deg, #fafafa 0%, #e7e5e4 100%)',
      sidebar: 'bg-stone-100', card: 'bg-white', text: 'text-stone-900', accent: 'text-indigo-600',
    },
    {
      id: 'auto', name: '시스템 자동', tag: null, recommended: false,
      desc: 'OS 다크/라이트 설정 따름',
      preview: 'linear-gradient(135deg, #0f172a 0%, #0f172a 50%, #fafafa 50%, #fafafa 100%)',
      sidebar: 'bg-slate-950', card: 'bg-slate-900', text: 'text-slate-100', accent: 'text-purple-300',
    },
  ];

  const accents = [
    { id: 'purple',  hex: '#a855f7', name: '퍼플' },
    { id: 'cyan',    hex: '#06b6d4', name: '시안' },
    { id: 'emerald', hex: '#10b981', name: '에메랄드' },
    { id: 'amber',   hex: '#f59e0b', name: '앰버' },
    { id: 'rose',    hex: '#f43f5e', name: '로즈' },
    { id: 'indigo',  hex: '#6366f1', name: '인디고' },
  ];

  const current = themes.find(t => t.id === theme) || themes[0];
  const currentAccent = accents.find(a => a.id === accent) || accents[0];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" onClick={handleCancel}>
      <div className="w-full max-w-3xl rounded-xl bg-slate-900 border border-white/10 shadow-2xl shadow-purple-500/10 overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <header className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-purple-500/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center">
              <window.Icon name="sparkles" className="w-4 h-4 text-purple-300" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-50">테마 설정</h2>
              <div className="text-[11px] text-slate-400 mt-0.5">화면 색상과 밀도를 조정합니다</div>
            </div>
          </div>
          <button onClick={handleCancel} className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-white/5">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </header>

        <div className="grid grid-cols-12 max-h-[480px]">
          {/* Theme list */}
          <div className="col-span-7 p-5 border-r border-white/10 overflow-y-auto">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-3">테마 선택</div>
            <div className="grid grid-cols-2 gap-3">
              {themes.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`relative rounded-lg overflow-hidden border-2 transition text-left ${theme === t.id ? 'border-purple-400 shadow-lg shadow-purple-500/20' : 'border-white/10 hover:border-white/20'}`}
                >
                  <div className="h-20 relative" style={{ background: t.preview }}>
                    {/* Mini chrome preview */}
                    <div className="absolute inset-2 flex gap-1">
                      <div className="w-6 rounded-sm bg-black/30"></div>
                      <div className="flex-1 rounded-sm bg-white/10 flex items-center px-1.5">
                        <div className="h-1.5 w-8 rounded-full bg-white/30"></div>
                      </div>
                    </div>
                    {t.tag && (
                      <span className={`absolute top-1.5 right-1.5 text-[9px] px-1.5 py-0.5 rounded ${t.tag === '현재' ? 'bg-emerald-500/40 text-emerald-50 border border-emerald-400/50' : 'bg-purple-500/40 text-purple-50 border border-purple-400/50'} font-mono`}>{t.tag}</span>
                    )}
                  </div>
                  <div className="p-2.5 bg-slate-950">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-3 h-3 rounded-full border-2 flex-shrink-0 ${theme === t.id ? 'border-purple-400 bg-purple-400' : 'border-slate-600'}`}>
                        {theme === t.id && <span className="block w-1 h-1 m-0.5 rounded-full bg-slate-900"></span>}
                      </div>
                      <div className="text-sm font-medium text-slate-100">{t.name}</div>
                      {t.recommended && <span className="text-[9px] text-amber-300">★</span>}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5 truncate">{t.desc}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Accent color */}
            <div className="mt-5">
              <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2.5">강조 색상</div>
              <div className="flex items-center gap-2">
                {accents.map(a => (
                  <button
                    key={a.id}
                    onClick={() => setAccent(a.id)}
                    title={a.name}
                    className={`w-9 h-9 rounded-full border-2 transition ${accent === a.id ? 'border-white scale-110 shadow-lg' : 'border-white/20 hover:border-white/40'}`}
                    style={{ backgroundColor: a.hex }}
                  >
                    {accent === a.id && <svg className="w-4 h-4 mx-auto text-white drop-shadow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>}
                  </button>
                ))}
              </div>
              <div className="text-[10px] text-slate-500 mt-1.5">선택: <span className="text-slate-300">{currentAccent.name}</span> · 버튼·링크·차트 강조선</div>
            </div>

            {/* Density */}
            <div className="mt-5">
              <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2.5">UI 밀도</div>
              <div className="flex gap-2">
                {[
                  { id: 'compact',     label: '컴팩트',  hint: '한 화면 더 많은 정보' },
                  { id: 'comfortable', label: '편안',    hint: '권장' },
                  { id: 'spacious',    label: '여유',    hint: '터치 친화' },
                ].map(d => (
                  <button
                    key={d.id}
                    onClick={() => setDensity(d.id)}
                    className={`flex-1 px-3 py-2 rounded-md text-xs border transition ${density === d.id ? 'bg-purple-500/15 border-purple-500/40 text-purple-100' : 'bg-slate-800 border-white/10 text-slate-300 hover:border-white/20'}`}
                  >
                    <div className="font-medium">{d.label}</div>
                    <div className="text-[10px] opacity-70 mt-0.5">{d.hint}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* A11y options */}
            <div className="mt-5 space-y-2">
              <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">접근성</div>
              <label className="flex items-center justify-between gap-3 px-3 py-2 rounded-md bg-slate-800/50 border border-white/5 cursor-pointer hover:bg-slate-800/80">
                <div>
                  <div className="text-sm text-slate-200">애니메이션 줄이기</div>
                  <div className="text-[11px] text-slate-500">전환·페이드 효과 최소화</div>
                </div>
                <input type="checkbox" checked={reduceMotion} onChange={e => setReduceMotion(e.target.checked)} className="accent-purple-500" />
              </label>
              <label className="flex items-center justify-between gap-3 px-3 py-2 rounded-md bg-slate-800/50 border border-white/5 cursor-pointer hover:bg-slate-800/80">
                <div>
                  <div className="text-sm text-slate-200">고대비 모드</div>
                  <div className="text-[11px] text-slate-500">텍스트·테두리 콘트라스트 강화</div>
                </div>
                <input type="checkbox" checked={highContrast} onChange={e => setHighContrast(e.target.checked)} className="accent-purple-500" />
              </label>
            </div>
          </div>

          {/* Live preview */}
          <div className="col-span-5 p-5 bg-slate-950/50 overflow-y-auto">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
              <span>미리보기</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px]">LIVE</span>
            </div>

            <div className="rounded-lg overflow-hidden border border-white/10 shadow-xl" style={{ background: current.preview }}>
              {/* Mock app frame */}
              <div className="flex h-72">
                <div className={`w-16 ${current.sidebar} border-r border-white/5 p-2 space-y-1.5`}>
                  <div className="w-7 h-7 rounded-md mx-auto" style={{ backgroundColor: currentAccent.hex, opacity: 0.3 }}></div>
                  {[0,1,2,3].map(i => (
                    <div key={i} className={`w-full h-1.5 rounded-full ${i === 0 ? '' : 'opacity-30'}`} style={i === 0 ? { backgroundColor: currentAccent.hex } : { backgroundColor: 'rgba(255,255,255,0.2)' }}></div>
                  ))}
                </div>
                <div className="flex-1 p-3 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-16 rounded-full ${current.text === 'text-stone-900' ? 'bg-stone-900' : 'bg-slate-100'} opacity-90`}></div>
                    <div className="ml-auto h-2 w-10 rounded-full" style={{ backgroundColor: currentAccent.hex }}></div>
                  </div>
                  <div className={`p-2.5 rounded-md ${current.card} border ${current.text === 'text-stone-900' ? 'border-stone-200' : 'border-white/10'} space-y-1.5`}>
                    <div className={`h-1.5 w-12 rounded-full ${current.text === 'text-stone-900' ? 'bg-stone-400' : 'bg-slate-500'}`}></div>
                    <div className="flex items-baseline gap-1">
                      <div className={`h-3 w-10 rounded-full ${current.text === 'text-stone-900' ? 'bg-stone-900' : 'bg-slate-100'}`}></div>
                      <div className="h-1.5 w-3 rounded-full" style={{ backgroundColor: currentAccent.hex, opacity: 0.7 }}></div>
                    </div>
                    {/* Mini chart */}
                    <div className="flex items-end gap-0.5 h-8 mt-1">
                      {[0.4, 0.6, 0.5, 0.7, 0.45, 0.8, 0.6].map((v, i) => (
                        <div key={i} className="flex-1 rounded-sm" style={{ height: `${v*100}%`, backgroundColor: currentAccent.hex, opacity: 0.7 }}></div>
                      ))}
                    </div>
                  </div>
                  <div className={`p-2 rounded-md ${current.card} border ${current.text === 'text-stone-900' ? 'border-stone-200' : 'border-white/10'} flex items-center gap-2`}>
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: currentAccent.hex }}></div>
                    <div className={`h-1.5 flex-1 rounded-full ${current.text === 'text-stone-900' ? 'bg-stone-300' : 'bg-slate-500'}`}></div>
                  </div>
                  <div className="px-2 py-1 rounded text-[10px] font-medium inline-block" style={{ backgroundColor: currentAccent.hex, color: current.text === 'text-stone-900' ? '#fff' : '#0f172a' }}>
                    버튼 샘플
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-md bg-slate-800/50 border border-white/5 text-[11px] text-slate-400 leading-relaxed">
              <span className="text-slate-300 font-medium">{current.name}</span> · 강조 <span style={{ color: currentAccent.hex }}>●</span> {currentAccent.name} · 밀도 {density === 'compact' ? '컴팩트' : density === 'comfortable' ? '편안' : '여유'}
              {(reduceMotion || highContrast) && (
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {reduceMotion && <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">⊘ 모션</span>}
                  {highContrast && <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">⊚ 고대비</span>}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-slate-950/50 flex items-center justify-between gap-2">
          <button onClick={handleReset} className="text-[11px] text-slate-400 hover:text-slate-200 transition">기본값으로 초기화</button>
          <div className="flex items-center gap-2">
            <button onClick={handleCancel} className="px-3.5 py-1.5 rounded-md text-sm text-slate-300 hover:bg-white/5 border border-white/10">취소</button>
            <button onClick={handleApply} className="px-4 py-1.5 rounded-md text-sm font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30">적용</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// 도움말 · 단축키 모달 — 사용자 메뉴 → 도움말
// ─────────────────────────────────────────────────────────────────
function HelpModal({ onClose }) {
  const [tab, setTab] = useState_p('shortcuts');
  const [search, setSearch] = useState_p('');

  // 단축키 카테고리
  const shortcutGroups = [
    {
      title: '전역', icon: 'sparkles', color: 'purple',
      items: [
        { k: ['⌘', 'K'],  d: '커맨드 검색 열기' },
        { k: ['⌘', '?'],  d: '도움말 (이 창)' },
        { k: ['Esc'],     d: '모달·팝오버 닫기' },
        { k: ['/'],       d: '페이지 검색창 포커스' },
      ],
    },
    {
      title: '페이지 이동', icon: 'home', color: 'cyan',
      items: [
        { k: ['G', 'D'],  d: '대시보드' },
        { k: ['G', 'C'],  d: '발송 콘솔' },
        { k: ['G', 'H'],  d: '발송 이력' },
        { k: ['G', 'T'],  d: '템플릿 관리' },
        { k: ['G', 'S'],  d: '통계 분석' },
        { k: ['G', 'A'],  d: '감사 로그' },
      ],
    },
    {
      title: '발송 콘솔', icon: 'send', color: 'emerald',
      items: [
        { k: ['⌘', '↩'],   d: '현재 단계 확정·다음으로' },
        { k: ['Space'],    d: '체크박스 토글 (선택 행)' },
        { k: ['A'],        d: '전체 선택' },
        { k: ['Shift', '↑/↓'], d: '범위 선택' },
        { k: ['⌘', 'Z'],   d: '직전 발송 취소 (5분 내)' },
      ],
    },
    {
      title: '템플릿 편집', icon: 'template', color: 'amber',
      items: [
        { k: ['⌘', 'S'],   d: '저장' },
        { k: ['⌘', 'P'],   d: 'PDF 미리보기' },
        { k: ['⌘', 'D'],   d: '복제' },
        { k: ['⌘', '/'],   d: '필드 자동완성' },
      ],
    },
    {
      title: '리스트·테이블', icon: 'history', color: 'rose',
      items: [
        { k: ['↑', '↓'],   d: '행 이동' },
        { k: ['Enter'],    d: '상세 열기' },
        { k: ['F'],        d: '필터 패널 열기' },
        { k: ['R'],        d: '재발송' },
        { k: ['E'],        d: 'CSV 내보내기' },
      ],
    },
  ];

  const colorRing = {
    purple:  'bg-purple-500/15 text-purple-300 border-purple-500/30',
    cyan:    'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    emerald: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    amber:   'bg-amber-500/15 text-amber-300 border-amber-500/30',
    rose:    'bg-rose-500/15 text-rose-300 border-rose-500/30',
  };

  const filtered = shortcutGroups
    .map(g => ({ ...g, items: g.items.filter(i => !search || i.d.toLowerCase().includes(search.toLowerCase()) || i.k.join(' ').toLowerCase().includes(search.toLowerCase())) }))
    .filter(g => g.items.length > 0);

  // 자주 묻는 질문
  const faqs = [
    { q: '발송 실패 시 어떻게 처리되나요?', a: '실패 메시지는 자동으로 큐에 적재되며, 채널 정책에 따라 SMS/이메일로 폴백됩니다. 5분 내 자동 재시도 3회 후에도 실패하면 운영자에게 알림이 갑니다.' },
    { q: '대량 발송의 권장 배치 크기는?', a: '한 번에 1,000건까지 권장합니다. 초과 시 자동으로 500건씩 분할되어 순차 처리됩니다.' },
    { q: '잔액이 부족하면 어떻게 되나요?', a: '발송이 즉시 중단되며 운영자에게 알림이 발송됩니다. 자동 충전이 활성화되어 있다면 등록된 결제 수단으로 자동 충전됩니다.' },
    { q: '템플릿 변경 후 기존 이력에 영향은?', a: '없습니다. 발송 시점의 템플릿 스냅샷이 보관되어 이력 상세에서 그대로 확인 가능합니다.' },
    { q: 'PDF 보관 기간은?', a: '기본 5년이며, 시스템 설정 → 컴플라이언스 탭에서 변경할 수 있습니다.' },
  ];

  const filteredFaqs = faqs.filter(f => !search || f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()));

  // 리소스 링크
  const resources = [
    { label: '운영자 가이드 (PDF)',     hint: '23 페이지 · 2026-04-01 갱신', icon: 'template' },
    { label: 'API 레퍼런스',            hint: 'REST · 콜백 webhook · OAuth',  icon: 'shield'   },
    { label: '릴리즈 노트',             hint: 'v2.4.1 — 7일 전',              icon: 'sparkles' },
    { label: '문의 · 티켓 만들기',      hint: '평균 응답 4시간 (영업일)',     icon: 'send'     },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-3xl rounded-xl bg-slate-900 border border-white/10 shadow-2xl shadow-cyan-500/10 overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <header className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-cyan-500/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center">
              <window.Icon name="shield" className="w-4 h-4 text-cyan-300" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-50">도움말 · 단축키</h2>
              <div className="text-[11px] text-slate-400 mt-0.5">⌘? 으로 언제든 다시 열 수 있어요</div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-white/5">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </header>

        {/* Tab + Search */}
        <div className="px-6 pt-4 pb-3 border-b border-white/5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-1 p-0.5 rounded-md bg-slate-800/60 border border-white/5">
            {[
              { id: 'shortcuts', label: '단축키', icon: 'sparkles' },
              { id: 'faq',       label: 'FAQ',    icon: 'shield'   },
              { id: 'resources', label: '리소스',  icon: 'template' },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition flex items-center gap-1.5 ${tab === t.id ? 'bg-slate-900 text-slate-100 shadow' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <window.Icon name={t.icon} className="w-3 h-3" />{t.label}
              </button>
            ))}
          </div>
          <div className="relative flex-1 max-w-xs">
            <svg className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="검색..."
              className="w-full pl-8 pr-3 py-1.5 rounded-md bg-slate-800/60 border border-white/10 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
            />
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 max-h-[440px] overflow-y-auto">
          {tab === 'shortcuts' && (
            <div className="space-y-5">
              {filtered.length === 0 && (
                <div className="text-center py-10 text-sm text-slate-500">"{search}"에 해당하는 단축키가 없어요.</div>
              )}
              {filtered.map((g, gi) => (
                <div key={gi}>
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center border ${colorRing[g.color]}`}>
                      <window.Icon name={g.icon} className="w-3 h-3" />
                    </div>
                    <div className="text-[11px] uppercase tracking-wider text-slate-300 font-medium">{g.title}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {g.items.map((it, ii) => (
                      <div key={ii} className="flex items-center justify-between gap-3 px-3 py-2 rounded-md bg-slate-800/40 border border-white/5 hover:border-white/10 transition">
                        <span className="text-xs text-slate-300 truncate">{it.d}</span>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {it.k.map((key, ki) => (
                            <React.Fragment key={ki}>
                              {ki > 0 && <span className="text-[10px] text-slate-600">+</span>}
                              <kbd className="min-w-[22px] h-5 px-1.5 rounded bg-slate-950 border border-white/15 text-[10px] font-mono text-slate-200 shadow-sm flex items-center justify-center">{key}</kbd>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'faq' && (
            <div className="space-y-2">
              {filteredFaqs.length === 0 && (
                <div className="text-center py-10 text-sm text-slate-500">"{search}"에 해당하는 FAQ가 없어요.</div>
              )}
              {filteredFaqs.map((f, i) => (
                <details key={i} className="group rounded-md bg-slate-800/40 border border-white/5 hover:border-white/10 transition open:border-cyan-500/30 open:bg-slate-800/60">
                  <summary className="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer list-none">
                    <span className="text-sm text-slate-200 font-medium">{f.q}</span>
                    <svg className="w-3.5 h-3.5 text-slate-500 transition group-open:rotate-180 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                  </summary>
                  <div className="px-4 pb-3 pt-1 text-xs text-slate-400 leading-relaxed border-t border-white/5">{f.a}</div>
                </details>
              ))}
            </div>
          )}

          {tab === 'resources' && (
            <div className="space-y-2">
              {resources.map((r, i) => (
                <button key={i} className="w-full flex items-center gap-3 px-4 py-3 rounded-md bg-slate-800/40 border border-white/5 hover:border-cyan-500/30 hover:bg-slate-800/70 transition text-left">
                  <div className="w-8 h-8 rounded-md bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 flex items-center justify-center">
                    <window.Icon name={r.icon} className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-slate-100">{r.label}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{r.hint}</div>
                  </div>
                  <svg className="w-3.5 h-3.5 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                </button>
              ))}
              <div className="mt-4 p-3.5 rounded-md bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/20">
                <div className="text-[11px] uppercase tracking-wider text-cyan-300 mb-1">버전 정보</div>
                <div className="text-xs text-slate-300">v2.4.1 <span className="text-slate-500">·</span> 빌드 26-04-26 <span className="text-slate-500">·</span> 운영 환경</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-slate-950/50 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            문제가 해결되지 않나요? <button className="text-cyan-300 hover:text-cyan-200 underline-offset-2 hover:underline">티켓 보내기 →</button>
          </div>
          <button onClick={onClose} className="px-3.5 py-1.5 rounded-md text-sm text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10">닫기</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { NotificationsPopover, CommandSearchModal, UserMenuPopover, SettingsModal, ChargeModal, ProfileModal, ThemeModal, HelpModal });
