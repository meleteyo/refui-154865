// Statistics screen — 월별 발송량/성공률/채널별 분석
function Stats({ tweaks, onNavigate }) {
  // 12개월 발송량 (mock)
  const months = ["5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월", "1월", "2월", "3월", "4월"];
  const monthlyVolume = [2840, 3120, 3450, 3280, 3680, 4120, 4580, 5120, 4830, 5240, 5680, 5947];
  const monthlySuccess = [97.2, 97.8, 98.0, 97.5, 98.1, 98.3, 98.5, 98.2, 98.4, 98.6, 98.8, 98.2];

  // 채널별 월간
  const channelMonth = [
  { ch: "KAKAO", volume: 3420, success: 99.1, cost: 27360, color: "#a855f7" },
  { ch: "EMAIL", volume: 1840, success: 97.8, cost: 0, color: "#10b981" },
  { ch: "FAX", volume: 687, success: 95.3, cost: 54960, color: "#06b6d4" }];


  // 시간대별 발송 패턴
  const hourly = [12, 8, 5, 3, 2, 4, 18, 47, 89, 124, 142, 168, 134, 112, 95, 78, 61, 42, 28, 19, 14, 11, 9, 14];
  const hourlyMax = Math.max(...hourly);

  // 문서 타입별
  const docTypes = [
  { type: "고지서", count: 4128, pct: 69.4, color: "#a855f7" },
  { type: "납부확인서", count: 1819, pct: 30.6, color: "#ec4899" }];


  // 성공률 게이지
  const overallSuccess = 98.2;

  // SVG line chart helpers
  const chartW = 100,chartH = 100;
  const lineMax = Math.max(...monthlyVolume) * 1.1;
  const linePoints = monthlyVolume.map((v, i) => {
    const x = i / (monthlyVolume.length - 1) * chartW;
    const y = chartH - v / lineMax * chartH;
    return [x, y];
  });
  const linePath = linePoints.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ');
  const fillPath = `${linePath} L ${chartW} ${chartH} L 0 ${chartH} Z`;

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <window.SectionLabel color="cyan">STATISTICS · 2026-04</window.SectionLabel>
          <h1 className="screen-main-title text-[32px] font-black leading-tight mt-1.5" style={{ color: '#000000' }}>통계 분석</h1>
          <p className="text-[15px] font-semibold mt-1.5" style={{ color: 'var(--text-muted)' }}>최근 12개월 발송 데이터 · Oracle DW 연동</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs p-0.5 rounded-md bg-white/5 border border-white/10">
            {["월간", "분기", "연간"].map((t, i) =>
            <button
              key={t}
              className={`px-2.5 py-1.5 rounded font-semibold ${i === 0 ? 'bg-cyan-500/30' : 'hover:bg-white/10'}`}
              style={{ color: '#000000' }}
            >
              {t}
            </button>
            )}
          </div>
          <button className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-sm flex items-center gap-2">
            <window.Icon name="download" className="w-3.5 h-3.5" />CSV
          </button>
        </div>
      </div>

      {/* ─── 핵심 발견 (Insights) — 분석 화면 정체성 ─── */}
      <window.Card className="p-6 bg-gradient-to-br from-cyan-500/[0.08] via-slate-900 to-pink-500/[0.04] border-cyan-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-60 h-60 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"></div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <window.Icon name="sparkles" className="w-4 h-4 text-cyan-400" />
            <window.SectionLabel color="cyan">이번 달 핵심 발견</window.SectionLabel>
          </div>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-4">
              <div className="text-[11px] uppercase tracking-wider text-emerald-400/80 mb-1">비용 절감</div>
              <div className="text-3xl font-bold tabular-nums text-emerald-300">₩52,640</div>
              <div className="text-xs text-slate-300 mt-1.5 leading-relaxed">팩스 → 알림톡 전환으로 <span className="text-emerald-300 font-semibold">월 38% 절감</span>. 연간 환산 ₩631,680.</div>
            </div>
            <div className="col-span-12 md:col-span-4 md:border-l md:border-white/10 md:pl-4">
              <div className="text-[11px] uppercase tracking-wider text-purple-400/80 mb-1">도달률 개선</div>
              <div className="text-3xl font-bold tabular-nums text-purple-300">+1.0<span className="text-base text-slate-500">%p</span></div>
              <div className="text-xs text-slate-300 mt-1.5 leading-relaxed">자동 채널 대체 도입 후 <span className="text-purple-300 font-semibold">12개월 연속 상승</span>. 97.2% → 98.2%.</div>
            </div>
            <div className="col-span-12 md:col-span-4 md:border-l md:border-white/10 md:pl-4">
              <div className="text-[11px] uppercase tracking-wider text-amber-400/80 mb-1">주의 신호</div>
              <div className="text-3xl font-bold tabular-nums text-amber-300">22.4<span className="text-base text-slate-500">%</span></div>
              <div className="text-xs text-slate-300 mt-1.5 leading-relaxed">실패 사유 중 <span className="text-amber-300 font-semibold">이메일 바운스 비중</span> 증가. 주소 정제 필요.</div>
            </div>
          </div>
        </div>
      </window.Card>

      {/* Top KPIs — 비교 강조 */}
      <div className="grid grid-cols-12 gap-4">
        <window.Card className="col-span-12 md:col-span-3 p-5">
          <div className="text-xs text-slate-400 mb-1">이번 달 발송</div>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-bold tabular-nums">{window.fmt(5947)}</div>
            <div className="text-xs text-slate-500">건</div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] pt-3 border-t border-white/5">
            <div>
              <div className="text-slate-500 uppercase tracking-wider">전월</div>
              <div className="text-emerald-300 font-mono mt-0.5">▲ 4.7%</div>
              <div className="text-slate-600 font-mono">5,680</div>
            </div>
            <div className="border-l border-white/5 pl-2">
              <div className="text-slate-500 uppercase tracking-wider">전년 동기</div>
              <div className="text-emerald-300 font-mono mt-0.5">▲ 109.4%</div>
              <div className="text-slate-600 font-mono">2,840</div>
            </div>
          </div>
        </window.Card>

        <window.Card className="col-span-12 md:col-span-3 p-5">
          <div className="text-xs text-slate-400 mb-1">월간 도달률</div>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-bold tabular-nums text-emerald-300">{overallSuccess}</div>
            <div className="text-xs text-slate-500">%</div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] pt-3 border-t border-white/5">
            <div>
              <div className="text-slate-500 uppercase tracking-wider">전월</div>
              <div className="text-rose-300 font-mono mt-0.5">▼ 0.6%p</div>
              <div className="text-slate-600 font-mono">98.8%</div>
            </div>
            <div className="border-l border-white/5 pl-2">
              <div className="text-slate-500 uppercase tracking-wider">SLA 목표</div>
              <div className="text-emerald-300 font-mono mt-0.5">▲ 1.2%p</div>
              <div className="text-slate-600 font-mono">≥ 97.0%</div>
            </div>
          </div>
        </window.Card>

        <window.Card className="col-span-12 md:col-span-3 p-5">
          <div className="text-xs text-slate-400 mb-1">월 비용 (KRW)</div>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-bold tabular-nums">₩{window.fmt(82320)}</div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] pt-3 border-t border-white/5">
            <div>
              <div className="text-slate-500 uppercase tracking-wider">전월</div>
              <div className="text-emerald-300 font-mono mt-0.5">▼ 38.4%</div>
              <div className="text-slate-600 font-mono">₩134,960</div>
            </div>
            <div className="border-l border-white/5 pl-2">
              <div className="text-slate-500 uppercase tracking-wider">건당 평균</div>
              <div className="text-slate-300 font-mono mt-0.5">₩13.8</div>
              <div className="text-slate-600 font-mono">우편 ₩430 대비</div>
            </div>
          </div>
        </window.Card>

        <window.Card className="col-span-12 md:col-span-3 p-5">
          <div className="text-xs text-slate-400 mb-1">평균 처리시간</div>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-bold tabular-nums">28.4</div>
            <div className="text-xs text-slate-500">초</div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] pt-3 border-t border-white/5">
            <div>
              <div className="text-slate-500 uppercase tracking-wider">전월</div>
              <div className="text-emerald-300 font-mono mt-0.5">▼ 3.7%</div>
              <div className="text-slate-600 font-mono">29.5초</div>
            </div>
            <div className="border-l border-white/5 pl-2">
              <div className="text-slate-500 uppercase tracking-wider">수작업 대비</div>
              <div className="text-purple-300 font-mono mt-0.5">−93%</div>
              <div className="text-slate-600 font-mono">7분 → 28초</div>
            </div>
          </div>
        </window.Card>
      </div>

      {/* Monthly trend line chart */}
      <window.Card className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-semibold text-base">월별 발송량 추이 (최근 12개월)</h3>
            <div className="text-xs text-slate-500 mt-0.5">발송 건수 · 막대 + 도달률 · 라인</div>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-purple-500/60"></span><span className="text-slate-300">발송량</span></span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 bg-emerald-400"></span><span className="text-slate-300">도달률</span></span>
          </div>
        </div>
        <div className="relative h-64 flex items-end gap-2">
          {/* y-axis grid */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {[0, 1, 2, 3].map((i) =>
            <div key={i} className="border-t border-white/5 text-[10px] text-slate-600 -translate-y-1/2">
                <span className="bg-slate-900 pr-2 -ml-2">{window.fmt(Math.round(lineMax - lineMax / 3 * i))}</span>
              </div>
            )}
          </div>
          {monthlyVolume.map((v, i) => {
            const h = v / lineMax * 100;
            const sr = monthlySuccess[i];
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative z-10">
                <div className="text-[10px] text-slate-500 group-hover:text-cyan-300 tabular-nums">{window.fmt(v)}</div>
                <div className="w-full relative" style={{ height: '200px' }}>
                  <div className="absolute bottom-0 inset-x-0 rounded-t-md bg-gradient-to-t from-purple-500/60 via-purple-400/40 to-cyan-400/30 group-hover:from-purple-500/80 transition-all" style={{ height: `${h}%` }}></div>
                  {/* success rate dot */}
                  <div className="absolute inset-x-0 flex justify-center" style={{ bottom: `${(sr - 95) / 5 * 100}%` }}>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 ring-2 ring-emerald-400/30"></div>
                  </div>
                </div>
                <div className="text-[11px] text-slate-400">{months[i]}</div>
              </div>);

          })}
        </div>
      </window.Card>

      {/* Channel breakdown + Hourly pattern */}
      <div className="grid grid-cols-12 gap-4">
        <window.Card className="col-span-12 lg:col-span-6 p-6">
          <h3 className="font-semibold text-base mb-1">채널별 분석 (이번 달)</h3>
          <div className="text-xs text-slate-500 mb-5">발송량 · 성공률 · 비용 비교</div>
          <div className="space-y-4">
            {channelMonth.map((c, i) => {
              const maxVol = Math.max(...channelMonth.map((x) => x.volume));
              const w = c.volume / maxVol * 100;
              return (
                <div key={c.ch}>
                  <div className="flex items-center justify-between mb-1.5">
                    <window.ChannelBadge channel={c.ch} />
                    <div className="flex items-center gap-4 text-xs tabular-nums">
                      <span className="text-slate-400">{window.fmt(c.volume)}건</span>
                      <span className="text-emerald-300 w-12 text-right">{c.success}%</span>
                      <span className="text-slate-300 w-20 text-right">₩{window.fmt(c.cost)}</span>
                    </div>
                  </div>
                  <div className="h-2.5 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${w}%`, background: c.color, opacity: 0.85 }}></div>
                  </div>
                </div>);

            })}
          </div>
          <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-3 gap-3 text-xs">
            <div>
              <div className="text-slate-500">총 발송</div>
              <div className="text-lg font-semibold tabular-nums mt-0.5">{window.fmt(5947)}</div>
            </div>
            <div className="border-l border-white/10 pl-3">
              <div className="text-slate-500">평균 성공률</div>
              <div className="text-lg font-semibold tabular-nums text-emerald-300 mt-0.5">98.2%</div>
            </div>
            <div className="border-l border-white/10 pl-3">
              <div className="text-slate-500">총 비용</div>
              <div className="text-lg font-semibold tabular-nums mt-0.5">₩82,320</div>
            </div>
          </div>
        </window.Card>

        <window.Card className="col-span-12 lg:col-span-6 p-6">
          <h3 className="font-semibold text-base mb-1">시간대별 발송 패턴</h3>
          <div className="text-xs text-slate-500 mb-5">최근 30일 평균 · 09–11시 피크</div>
          <div className="h-44 flex items-end gap-0.5">
            {hourly.map((v, i) => {
              const h = v / hourlyMax * 100;
              const isPeak = v === hourlyMax;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                  <div className={`w-full rounded-t-sm transition-all ${isPeak ? 'bg-gradient-to-t from-pink-500 to-purple-400' : 'bg-gradient-to-t from-cyan-500/50 to-cyan-400/20 group-hover:from-cyan-500/70'}`} style={{ height: `${h}%`, minHeight: '2px' }}></div>
                </div>);

            })}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-slate-500 font-mono">
            <span>00</span><span>06</span><span>12</span><span>18</span><span>23</span>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">피크 시간</span>
              <span className="font-mono text-pink-300">11:00 (168건/일)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">최저 시간</span>
              <span className="font-mono text-slate-300">04:00 (2건/일)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">업무시간 점유율</span>
              <span className="font-mono text-emerald-300">87.3% (09–18시)</span>
            </div>
          </div>
        </window.Card>
      </div>

      {/* Document type + Top customers */}
      <div className="grid grid-cols-12 gap-4">
        <window.Card className="col-span-12 lg:col-span-4 p-6">
          <h3 className="font-semibold text-base mb-1">문서 유형별</h3>
          <div className="text-xs text-slate-500 mb-5">총 5,947건</div>
          <div className="space-y-3">
            {docTypes.map((d) =>
            <div key={d.type}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-200 font-medium">{d.type}</span>
                  <span className="text-slate-400 tabular-nums">{window.fmt(d.count)} · {d.pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${d.pct}%`, background: d.color }}></div>
                </div>
              </div>
            )}
          </div>
        </window.Card>

        <window.Card className="col-span-12 lg:col-span-8 p-6">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-base">실패 사유 Top 5</h3>
            <span className="text-xs text-slate-500">최근 30일</span>
          </div>
          <div className="text-xs text-slate-500 mb-5">전체 실패 107건 · 1.8%</div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-slate-500 border-b border-white/5">
                <th className="py-2 font-medium">#</th>
                <th className="py-2 font-medium">사유</th>
                <th className="py-2 font-medium">채널</th>
                <th className="py-2 font-medium text-right">발생</th>
                <th className="py-2 font-medium text-right">비중</th>
              </tr>
            </thead>
            <tbody>
              {[
              { reason: "팩스번호 없음 → EMAIL 자동대체 성공", ch: "FAX", count: 38, pct: 35.5, ok: true },
              { reason: "이메일 바운스 (mailbox full)", ch: "EMAIL", count: 24, pct: 22.4, ok: false },
              { reason: "알림톡 미수신 → 카톡 미가입 추정", ch: "KAKAO", count: 19, pct: 17.8, ok: false },
              { reason: "이메일 주소 형식 오류", ch: "EMAIL", count: 15, pct: 14.0, ok: false },
              { reason: "팩스 회선 통화중 (재시도 한계)", ch: "FAX", count: 11, pct: 10.3, ok: false }].
              map((r, i) =>
              <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="py-2.5 text-slate-500 font-mono">{i + 1}</td>
                  <td className="py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-200">{r.reason}</span>
                      {r.ok && <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">자동복구</span>}
                    </div>
                  </td>
                  <td className="py-2.5"><window.ChannelBadge channel={r.ch} /></td>
                  <td className="py-2.5 text-right tabular-nums">{r.count}</td>
                  <td className="py-2.5 text-right tabular-nums text-slate-400">{r.pct}%</td>
                </tr>
              )}
            </tbody>
          </table>
        </window.Card>
      </div>
    </div>);

}

window.Stats = Stats;
