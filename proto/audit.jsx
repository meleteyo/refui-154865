// Audit log screen — 모든 액션 시간순 + 필터/검색
function Audit({ tweaks, onNavigate }) {
  const [filterType, setFilterType] = React.useState('ALL');
  const [filterUser, setFilterUser] = React.useState('ALL');
  const [search, setSearch] = React.useState('');

  // Mock audit log entries
  const ALL_LOGS = [
  { time: '2026-04-25 14:23:15', user: '김지선', role: 'OPERATOR', action: 'DISPATCH_SEND', target: 'DR-3984', detail: '납부확인서 1건 발송 완료 (KAKAO)', ip: '10.42.1.118', severity: 'info' },
  { time: '2026-04-25 14:22:58', user: '김지선', role: 'OPERATOR', action: 'DISPATCH_SEND', target: 'DR-3983', detail: '고지서 1건 발송 완료 (EMAIL)', ip: '10.42.1.118', severity: 'info' },
  { time: '2026-04-25 14:20:42', user: 'system', role: 'SYSTEM', action: 'CHANNEL_FALLBACK', target: 'DR-3982', detail: '팩스번호 없음 → EMAIL 자동대체', ip: '127.0.0.1', severity: 'warn' },
  { time: '2026-04-25 14:15:31', user: '김지선', role: 'OPERATOR', action: 'DISPATCH_BULK', target: 'BATCH-892', detail: '대량 발송 47건 시작 (혼합 채널)', ip: '10.42.1.118', severity: 'info' },
  { time: '2026-04-25 13:58:12', user: '박운영', role: 'ADMIN', action: 'TEMPLATE_UPDATE', target: 'TMPL-01', detail: '고지서 A형 v2.0 → v2.1 (브랜드색 변경)', ip: '10.42.1.42', severity: 'info' },
  { time: '2026-04-25 13:42:08', user: 'system', role: 'SYSTEM', action: 'ORACLE_QUERY', target: 'BL_NOTICE', detail: '미납자 조회 — 142건 반환', ip: '127.0.0.1', severity: 'info' },
  { time: '2026-04-25 11:24:55', user: '박운영', role: 'ADMIN', action: 'USER_LOGIN', target: '-', detail: '관리자 로그인 (2FA)', ip: '10.42.1.42', severity: 'info' },
  { time: '2026-04-25 09:15:33', user: '김지선', role: 'OPERATOR', action: 'USER_LOGIN', target: '-', detail: '운영자 로그인', ip: '10.42.1.118', severity: 'info' },
  { time: '2026-04-25 08:00:00', user: 'system', role: 'SYSTEM', action: 'BATCH_SCHEDULE', target: 'CRON-DAILY', detail: '일일 정기 발송 큐 등록 (08:00)', ip: '127.0.0.1', severity: 'info' },
  { time: '2026-04-24 18:42:11', user: '박운영', role: 'ADMIN', action: 'POLICY_UPDATE', target: 'ENGINE-01', detail: '채널 정책 BROADCAST → PRIORITY', ip: '10.42.1.42', severity: 'warn' },
  { time: '2026-04-24 17:33:08', user: '김지선', role: 'OPERATOR', action: 'DISPATCH_RESEND', target: 'DR-3942', detail: '실패건 재발송 (EMAIL → KAKAO)', ip: '10.42.1.118', severity: 'info' },
  { time: '2026-04-24 16:15:42', user: 'system', role: 'SYSTEM', action: 'KAKAO_BALANCE_LOW', target: 'BIZ-MAIN', detail: '알림톡 잔액 부족 경고 (₩12,500)', ip: '127.0.0.1', severity: 'warn' },
  { time: '2026-04-24 14:08:23', user: 'system', role: 'SYSTEM', action: 'KAKAO_FAIL', target: 'DR-3891', detail: '알림톡 발송 실패 — 미수신 (24h)', ip: '127.0.0.1', severity: 'error' },
  { time: '2026-04-24 11:42:16', user: '박운영', role: 'ADMIN', action: 'USER_CREATE', target: 'U-014', detail: '신규 OPERATOR 계정 생성 (이수민)', ip: '10.42.1.42', severity: 'info' },
  { time: '2026-04-24 09:28:51', user: '김지선', role: 'OPERATOR', action: 'TEMPLATE_PREVIEW', target: 'TMPL-03', detail: '납부확인서 표준형 미리보기', ip: '10.42.1.118', severity: 'info' },
  { time: '2026-04-23 22:14:08', user: 'system', role: 'SYSTEM', action: 'AUTH_FAIL', target: '-', detail: '잘못된 비밀번호 (3회 시도)', ip: '203.42.18.91', severity: 'error' }];


  const actionTypes = ['ALL', 'DISPATCH_SEND', 'DISPATCH_BULK', 'DISPATCH_RESEND', 'TEMPLATE_UPDATE', 'POLICY_UPDATE', 'USER_LOGIN', 'AUTH_FAIL', 'CHANNEL_FALLBACK'];
  const users = ['ALL', '김지선', '박운영', 'system'];

  const filtered = ALL_LOGS.filter((l) => {
    if (filterType !== 'ALL' && l.action !== filterType) return false;
    if (filterUser !== 'ALL' && l.user !== filterUser) return false;
    if (search && !`${l.detail} ${l.target} ${l.user}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const sevColor = {
    info: { bg: 'bg-slate-500/15', text: 'text-slate-300', dot: 'bg-slate-400' },
    warn: { bg: 'bg-amber-500/15', text: 'text-amber-300', dot: 'bg-amber-400' },
    error: { bg: 'bg-rose-500/15', text: 'text-rose-300', dot: 'bg-rose-400' }
  };

  const actionColor = {
    DISPATCH_SEND: 'text-purple-300',
    DISPATCH_BULK: 'text-purple-300',
    DISPATCH_RESEND: 'text-amber-300',
    TEMPLATE_UPDATE: 'text-cyan-300',
    POLICY_UPDATE: 'text-pink-300',
    USER_LOGIN: 'text-emerald-300',
    USER_CREATE: 'text-emerald-300',
    AUTH_FAIL: 'text-rose-300',
    CHANNEL_FALLBACK: 'text-amber-300',
    ORACLE_QUERY: 'text-cyan-300',
    KAKAO_FAIL: 'text-rose-300',
    KAKAO_BALANCE_LOW: 'text-amber-300',
    BATCH_SCHEDULE: 'text-slate-300',
    TEMPLATE_PREVIEW: 'text-cyan-300'
  };

  const sevCounts = ALL_LOGS.reduce((acc, l) => {acc[l.severity] = (acc[l.severity] || 0) + 1;return acc;}, {});

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <window.SectionLabel color="amber">AUDIT LOG</window.SectionLabel>
          <h1 className="screen-main-title text-[32px] font-black leading-tight mt-1.5" style={{ color: '#000000' }}>감사 로그</h1>
          <p className="text-[15px] font-semibold mt-1.5" style={{ color: 'var(--text-muted)' }}>모든 액션 영구 보관 · 90일 보존 정책 · 이뮤터블 (S3 Lock)</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-sm flex items-center gap-2">
            <window.Icon name="download" className="w-3.5 h-3.5" />CSV 내보내기
          </button>
        </div>
      </div>

      {/* Severity summary */}
      <div className="grid grid-cols-12 gap-4">
        <window.Card className="col-span-12 md:col-span-3 p-5">
          <div className="text-xs text-slate-400 mb-1">전체 이벤트 (24h)</div>
          <div className="text-3xl font-bold tabular-nums">{ALL_LOGS.length}</div>
          <div className="mt-2 text-xs text-slate-500">실시간 동기화</div>
        </window.Card>
        <window.Card className="col-span-12 md:col-span-3 p-5">
          <div className="text-xs text-slate-400 mb-1 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>INFO
          </div>
          <div className="text-3xl font-bold tabular-nums text-slate-200">{sevCounts.info || 0}</div>
        </window.Card>
        <window.Card className="col-span-12 md:col-span-3 p-5">
          <div className="text-xs text-slate-400 mb-1 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>WARN
          </div>
          <div className="text-3xl font-bold tabular-nums text-amber-300">{sevCounts.warn || 0}</div>
          <div className="mt-2 text-xs text-amber-400/70">정책 변경 · 자동대체</div>
        </window.Card>
        <window.Card className="col-span-12 md:col-span-3 p-5">
          <div className="text-xs text-slate-400 mb-1 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>ERROR
          </div>
          <div className="text-3xl font-bold tabular-nums text-rose-300">{sevCounts.error || 0}</div>
          <div className="mt-2 text-xs text-rose-400/70">즉시 검토 필요</div>
        </window.Card>
      </div>

      {/* Filters */}
      <window.Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[280px] relative">
            <window.Icon name="search" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="고객, 발송 ID, 상세 내용 검색…"
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-amber-500/50 focus:bg-white/[0.07] outline-none text-sm transition" />
            
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-mono">ACTION</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm outline-none cursor-pointer hover:bg-white/10 focus:border-amber-500/50 transition">
              
              {actionTypes.map((t) => <option key={t} value={t} className="bg-slate-900">{t}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-mono">USER</span>
            <select
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
              className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm outline-none cursor-pointer hover:bg-white/10 focus:border-amber-500/50 transition">
              
              {users.map((u) => <option key={u} value={u} className="bg-slate-900">{u}</option>)}
            </select>
          </div>
          <button className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-sm flex items-center gap-2">
            <window.Icon name="filter" className="w-3.5 h-3.5" />고급 필터
          </button>
        </div>
        <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
          <span className="text-slate-500"><span className="text-slate-300 font-medium">{filtered.length}</span>건 표시 · 전체 {ALL_LOGS.length}건</span>
          <span className="text-slate-500 font-mono">2026-04-23 22:14 → 2026-04-25 14:23</span>
        </div>
      </window.Card>

      {/* Log timeline */}
      <window.Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-slate-500 border-b border-white/5 bg-white/[0.02]">
                <th className="px-6 py-2.5 font-medium">시각</th>
                <th className="px-3 py-2.5 font-medium">레벨</th>
                <th className="px-3 py-2.5 font-medium">사용자</th>
                <th className="px-3 py-2.5 font-medium">액션</th>
                <th className="px-3 py-2.5 font-medium">대상</th>
                <th className="px-3 py-2.5 font-medium">상세</th>
                <th className="px-6 py-2.5 font-medium">IP</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l, i) => {
                const sc = sevColor[l.severity];
                return (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition">
                    <td className="px-6 py-3 text-slate-400 tabular-nums text-xs font-mono whitespace-nowrap">{l.time}</td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-md ${sc.bg} ${sc.text} px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}></span>
                        {l.severity}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-1.5 py-0.5 rounded font-mono ${l.role === 'ADMIN' ? 'bg-pink-500/15 text-pink-300' : l.role === 'OPERATOR' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-slate-500/15 text-slate-400'}`}>{l.role}</span>
                        <span className="text-slate-200">{l.user}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`font-mono text-xs ${actionColor[l.action] || 'text-slate-300'}`}>{l.action}</span>
                    </td>
                    <td className="px-3 py-3 font-mono text-xs text-slate-400">{l.target}</td>
                    <td className="px-3 py-3 text-slate-300 max-w-md">{l.detail}</td>
                    <td className="px-6 py-3 text-slate-500 font-mono text-xs">{l.ip}</td>
                  </tr>);

              })}
            </tbody>
          </table>
          {filtered.length === 0 &&
          <div className="py-12 text-center text-sm text-slate-500">
              조건에 맞는 로그가 없습니다.
            </div>
          }
        </div>
        <div className="flex items-center justify-between px-6 py-3 border-t border-white/5 text-xs text-slate-500 bg-white/[0.02]">
          <span>이전</span>
          <span className="font-mono">1 / 1</span>
          <span>다음</span>
        </div>
      </window.Card>
    </div>);

}

window.Audit = Audit;
