// Dashboard screen
const { useState: useState_d, useMemo: useMemo_d } = React;

function Dashboard({ tweaks, onNavigate }) {
  const [chargeOpen, setChargeOpen] = React.useState(false);
  const totalToday = window.CHANNEL_TODAY.KAKAO + window.CHANNEL_TODAY.EMAIL + window.CHANNEL_TODAY.FAX;
  const success = totalToday - 3;
  const successRate = (success / totalToday * 100).toFixed(1);

  // Channel donut
  const donutData = [
  { label: "알림톡", value: window.CHANNEL_TODAY.KAKAO, color: "#a855f7" },
  { label: "이메일", value: window.CHANNEL_TODAY.EMAIL, color: "#10b981" },
  { label: "웹팩스", value: window.CHANNEL_TODAY.FAX, color: "#06b6d4" }];

  const donutTotal = donutData.reduce((s, d) => s + d.value, 0);
  let acc = 0;
  const arcs = donutData.map((d) => {
    const start = acc / donutTotal;
    acc += d.value;
    const end = acc / donutTotal;
    return { ...d, start, end, pct: (d.value / donutTotal * 100).toFixed(0) };
  });

  const polar = (cx, cy, r, a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  const arcPath = (cx, cy, rOuter, rInner, startFrac, endFrac) => {
    const a0 = startFrac * Math.PI * 2 - Math.PI / 2;
    const a1 = endFrac * Math.PI * 2 - Math.PI / 2;
    const large = endFrac - startFrac > 0.5 ? 1 : 0;
    const [x0, y0] = polar(cx, cy, rOuter, a0);
    const [x1, y1] = polar(cx, cy, rOuter, a1);
    const [x2, y2] = polar(cx, cy, rInner, a1);
    const [x3, y3] = polar(cx, cy, rInner, a0);
    return `M ${x0} ${y0} A ${rOuter} ${rOuter} 0 ${large} 1 ${x1} ${y1} L ${x2} ${y2} A ${rInner} ${rInner} 0 ${large} 0 ${x3} ${y3} Z`;
  };

  const days = ["월", "화", "수", "목", "금", "토", "일"];
  const trendMax = Math.max(...window.TREND_7D);

  // 운영 알림 (라이브)
  const liveAlerts = [
  { sev: 'warn', icon: 'alert', text: '팩스 채널 대기열 12건 · 평소 3건', cta: '큐 확인', to: 'history' },
  { sev: 'info', icon: 'sparkles', text: '알림톡 잔액 ₩28,400 (3,550건)', cta: '충전', to: null },
  { sev: 'success', icon: 'shieldCheck', text: '오전 배치 성공 · 1,247/1,247', cta: '상세', to: 'audit' }];


  // 라이브 피드 (최근 30초)
  const liveFeed = [
  { t: '방금', ch: 'KAKAO', name: '박민수', note: '발송' },
  { t: '8초', ch: 'EMAIL', name: '김지수', note: '발송' },
  { t: '12초', ch: 'KAKAO', name: '이영희', note: '발송' },
  { t: '21초', ch: 'FAX', name: '최지호', note: '재시도' },
  { t: '34초', ch: 'EMAIL', name: '정현우', note: '발송' }];


  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <window.SectionLabel color="purple">DASHBOARD · 2026-04-25 (금) · LIVE</window.SectionLabel>
          <h1 className="screen-main-title text-[32px] font-black leading-tight mt-1.5" style={{ color: '#000000' }}>오늘 운영 현황</h1>
          <p className="text-[15px] font-semibold mt-1.5 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
            <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span></span>
            Oracle DB 정상 · 큐 대기 12건 · 마지막 갱신 방금 전
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-sm flex items-center gap-2">
            <window.Icon name="refresh" className="w-3.5 h-3.5" />새로고침
          </button>
          <button onClick={() => onNavigate('console')} className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-sm font-semibold flex items-center gap-2 shadow-lg shadow-purple-500/30">
            <window.Icon name="send" className="w-3.5 h-3.5" />새 발송 시작
          </button>
        </div>
      </div>

      {/* ─── 운영 알림 배너 (지금 주의해야 할 것) ─── */}
      <div className="grid grid-cols-12 gap-3">
        {liveAlerts.map((a, i) => {
          const sevMap = {
            warn: { bg: 'bg-slate-900', border: 'border-amber-500', text: 'text-white', icon: 'text-amber-300', accent: 'bg-amber-500', chip: 'bg-amber-500/20 text-amber-100 border-amber-500/40' },
            info: { bg: 'bg-slate-900', border: 'border-cyan-500', text: 'text-white', icon: 'text-cyan-300', accent: 'bg-cyan-500', chip: 'bg-cyan-500/20 text-cyan-100 border-cyan-500/40' },
            success: { bg: 'bg-slate-900', border: 'border-emerald-500', text: 'text-white', icon: 'text-emerald-300', accent: 'bg-emerald-500', chip: 'bg-emerald-500/20 text-emerald-100 border-emerald-500/40' }
          };
          const s = sevMap[a.sev];
          return (
            <div key={i} className={`col-span-12 md:col-span-4 p-3.5 rounded-lg border-l-4 border ${s.bg} ${s.border} flex items-center gap-3 relative overflow-hidden`}>
              <div className={`w-8 h-8 rounded-md ${s.chip} border flex items-center justify-center flex-shrink-0`}>
                <window.Icon name={a.icon} className={`w-4 h-4 ${s.icon}`} />
              </div>
              <div className="flex-1 text-[15px] font-semibold text-white">{a.text}</div>
              <button onClick={() => a.to && onNavigate(a.to)} className={`text-xs px-2.5 py-1.5 rounded font-medium ${s.chip} border whitespace-nowrap hover:brightness-125 transition`}>{a.cta} →</button>
            </div>);

        })}
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-12 gap-4">
        <window.Card className="col-span-12 md:col-span-6 p-6 bg-gradient-to-br from-purple-500/15 via-purple-500/5 to-transparent border-purple-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-44 h-44 rounded-full bg-purple-500/10 blur-3xl"></div>
          <div className="relative">
            <div className="text-xs text-slate-400 mb-1">금일 발송 완료</div>
            <div className="flex items-baseline gap-2">
              <div className="text-5xl font-bold tracking-tight tabular-nums">{window.fmt(totalToday)}</div>
              <div className="text-base text-slate-500">건</div>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 text-emerald-400">▲ 21.7%</span>
              <span className="text-slate-500">어제 대비</span>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500">성공</div>
                <div className="text-lg font-semibold text-emerald-300 tabular-nums">{success}</div>
              </div>
              <div className="border-l border-white/10 pl-3">
                <div className="text-[10px] uppercase tracking-wider text-slate-500">실패</div>
                <div className="text-lg font-semibold text-rose-300 tabular-nums">3</div>
              </div>
              <div className="border-l border-white/10 pl-3">
                <div className="text-[10px] uppercase tracking-wider text-slate-500">성공률</div>
                <div className="text-lg font-semibold tabular-nums">{successRate}%</div>
              </div>
            </div>
          </div>
        </window.Card>

        <window.Card className="col-span-6 md:col-span-2 p-5">
          <div className="text-xs text-slate-400 mb-1">주간 발송</div>
          <div className="text-2xl font-bold tabular-nums">{window.fmt(window.TREND_7D.reduce((a, b) => a + b, 0))}</div>
          <div className="mt-3"><window.Sparkline data={window.TREND_7D} color="#a855f7" height={28} /></div>
        </window.Card>

        <window.Card className="col-span-6 md:col-span-2 p-5">
          <div className="text-xs text-slate-400 mb-1">평균 처리</div>
          <div className="text-2xl font-bold tabular-nums">28.4<span className="text-base ml-0.5 text-slate-500">초</span></div>
          <div className="mt-1 text-[11px] text-purple-300">수작업 대비 −92%</div>
          <div className="mt-3 h-7 flex items-end gap-1">
            {[0.6, 0.5, 0.7, 0.55, 0.4, 0.45, 0.35].map((v, i) =>
            <div key={i} className="flex-1 rounded-sm bg-purple-400/40" style={{ height: `${v * 100}%` }}></div>
            )}
          </div>
        </window.Card>

        <window.Card className="col-span-6 md:col-span-2 p-5">
          <div className="text-xs text-slate-400 mb-1">월 도달률</div>
          <div className="text-2xl font-bold tabular-nums text-emerald-300">98.2<span className="text-base ml-0.5 text-slate-500">%</span></div>
          <div className="mt-3 h-1.5 rounded-full bg-white/5 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300" style={{ width: '98.2%' }}></div>
          </div>
          <div className="mt-1.5 text-[11px] text-emerald-400/80">자동대체 +2.1%</div>
        </window.Card>

        <window.Card className="col-span-6 md:col-span-2 p-5">
          <div className="text-xs text-slate-400 mb-1">알림톡 잔여</div>
          <div className="text-2xl font-bold tabular-nums">₩12,500</div>
          <div className="mt-1 text-[11px] text-amber-400 flex items-center gap-1">
            <window.Icon name="alert" className="w-3 h-3" />충전 권장
          </div>
          <button onClick={() => setChargeOpen(true)} className="mt-3 w-full py-1.5 rounded-md bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs text-amber-200 transition">충전하기</button>
        </window.Card>
      </div>

      {/* Trend + Donut */}
      <div className="grid grid-cols-12 gap-4">
        <window.Card className="col-span-12 lg:col-span-8 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-base">7일 발송 추이</h3>
              <div className="text-xs text-slate-500 mt-0.5">04-19 → 04-25 · 채널 합계</div>
            </div>
            <div className="flex items-center gap-1 text-xs p-0.5 rounded-md bg-white/5 border border-white/10">
              {["7D", "30D", "90D"].map((t, i) =>
              <button key={t} className={`px-2.5 py-1 rounded ${i === 0 ? 'bg-purple-500/30 text-purple-200' : 'text-slate-400 hover:text-slate-200'}`}>{t}</button>
              )}
            </div>
          </div>
          <div className="h-52 flex items-end gap-3">
            {window.TREND_7D.map((v, i) => {
              const h = v / trendMax * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="text-[10px] text-slate-500 group-hover:text-purple-300 tabular-nums">{window.fmt(v)}</div>
                  <div className="w-full relative" style={{ height: '160px' }}>
                    <div className="absolute bottom-0 inset-x-0 rounded-t-md bg-gradient-to-t from-purple-500/60 via-purple-400/40 to-pink-400/30 group-hover:from-purple-500/80 group-hover:via-purple-400/60 transition-all" style={{ height: `${h}%` }}></div>
                  </div>
                  <div className="text-[11px] text-slate-400">{days[i]}</div>
                </div>);

            })}
          </div>
        </window.Card>

        <window.Card className="col-span-12 lg:col-span-4 p-6">
          <h3 className="font-semibold text-base mb-1">채널 비중 (오늘)</h3>
          <div className="text-xs text-slate-500 mb-3">총 {window.fmt(donutTotal)}건</div>
          <div className="flex items-center gap-5">
            <svg viewBox="0 0 100 100" className="w-32 h-32 flex-shrink-0">
              {arcs.map((a, i) =>
              <path key={i} d={arcPath(50, 50, 45, 30, a.start, a.end)} fill={a.color} opacity="0.85" />
              )}
              <text x="50" y="48" textAnchor="middle" className="fill-slate-200 text-[10px] font-semibold">{donutTotal}</text>
              <text x="50" y="58" textAnchor="middle" className="fill-slate-500 text-[6px]">발송</text>
            </svg>
            <div className="flex-1 space-y-2.5">
              {arcs.map((a, i) =>
              <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ background: a.color }}></span>
                  <span className="text-slate-300 flex-1">{a.label}</span>
                  <span className="text-slate-500 tabular-nums">{a.value}</span>
                  <span className="text-slate-500 tabular-nums w-8 text-right">{a.pct}%</span>
                </div>
              )}
            </div>
          </div>
        </window.Card>
      </div>

      {/* Recent history */}
      <window.Card className="overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">실시간 발송 피드</h3>
            <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-purple-400"></span></span>
            <span className="text-[10px] text-purple-300 font-mono uppercase tracking-wider">LIVE</span>
          </div>
          <button onClick={() => onNavigate('history')} className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">
            전체 이력 <window.Icon name="arrowRight" className="w-3 h-3" />
          </button>
        </div>
        {/* Live ticker — 최근 30초 */}
        <div className="px-6 py-2.5 border-b border-white/5 bg-white/[0.015] flex items-center gap-3 overflow-x-auto">
          <span className="text-[10px] uppercase tracking-wider text-slate-500 flex-shrink-0">방금:</span>
          {liveFeed.map((f, i) =>
          <div key={i} className="flex items-center gap-1.5 flex-shrink-0 text-xs">
              <span className="text-slate-500 font-mono tabular-nums w-7">{f.t}</span>
              <window.ChannelBadge channel={f.ch} />
              <span className="text-slate-300">{f.name}</span>
              <span className="text-slate-500">{f.note}</span>
              {i < liveFeed.length - 1 && <span className="text-slate-700 ml-1">·</span>}
            </div>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-slate-500 border-b border-white/5">
                <th className="px-6 py-2.5 font-medium">시각</th>
                <th className="px-3 py-2.5 font-medium">발송 ID</th>
                <th className="px-3 py-2.5 font-medium">고객</th>
                <th className="px-3 py-2.5 font-medium">문서</th>
                <th className="px-3 py-2.5 font-medium">채널</th>
                <th className="px-3 py-2.5 font-medium">상태</th>
                <th className="px-3 py-2.5 font-medium">결과</th>
                <th className="px-6 py-2.5 font-medium text-right">액션</th>
              </tr>
            </thead>
            <tbody>
              {window.MOCK_HISTORY.slice(0, 10).map((row, i) =>
              <tr key={row.id} className="border-b border-white/5 hover:bg-white/[0.02] transition group">
                  <td className="px-6 py-3 text-slate-400 tabular-nums text-xs">{row.time}</td>
                  <td className="px-3 py-3 font-mono text-xs text-slate-400">{row.id}</td>
                  <td className="px-3 py-3">
                    <div className="font-medium">{row.customer}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{row.customerNo}</div>
                  </td>
                  <td className="px-3 py-3 text-slate-300">{row.doc}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1">
                      {row.fallback && <span className="text-[10px] text-amber-400 mr-0.5">대체→</span>}
                      <window.ChannelBadge channel={row.channel} />
                    </div>
                  </td>
                  <td className="px-3 py-3"><window.StatusPill status={row.status} /></td>
                  <td className="px-3 py-3 text-xs">
                    {row.status === "SUCCESS" && <span className="text-emerald-400/80 tabular-nums">{row.delivered}</span>}
                    {row.status === "FAILED" && <span className="text-rose-400/80">{row.reason}</span>}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button onClick={() => onNavigate('historyDetail', row)} className="text-xs text-slate-400 hover:text-purple-300 opacity-0 group-hover:opacity-100 transition">상세 →</button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </window.Card>

      {chargeOpen && <window.ChargeModal onClose={() => setChargeOpen(false)} />}
    </div>);

}

window.Dashboard = Dashboard;
