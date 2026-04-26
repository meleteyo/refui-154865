// History screen with detail side-panel + resend
const { useState: useState_h } = React;

function History({ tweaks, onNavigate, initialDetail }) {
  const [detail, setDetail] = useState_h(initialDetail || null);
  const [filterStatus, setFilterStatus] = useState_h("ALL");
  const [filterChannel, setFilterChannel] = useState_h("ALL");
  const [q, setQ] = useState_h("");

  const filtered = window.MOCK_HISTORY.filter((r) => {
    if (filterStatus !== "ALL" && r.status !== filterStatus) return false;
    if (filterChannel !== "ALL" && r.channel !== filterChannel) return false;
    if (q && !r.customer.includes(q) && !r.customerNo.includes(q) && !r.id.includes(q)) return false;
    return true;
  });

  const stats = {
    total: window.MOCK_HISTORY.length,
    success: window.MOCK_HISTORY.filter((r) => r.status === "SUCCESS").length,
    failed: window.MOCK_HISTORY.filter((r) => r.status === "FAILED").length
  };

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <window.SectionLabel color="emerald">HISTORY · 발송 이력</window.SectionLabel>
          <h1 className="screen-main-title text-[32px] font-black leading-tight mt-1.5" style={{ color: '#000000' }}>발송 이력 · 재발송</h1>
          <p className="text-[15px] font-semibold mt-1.5" style={{ color: 'var(--text-muted)' }}>건별 발송 결과 추적 · 실패 건 채널 변경 재발송 · CSV 내보내기</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-sm flex items-center gap-2">
            <window.Icon name="download" className="w-3.5 h-3.5" />엑셀 내보내기
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <window.Card className="col-span-12 md:col-span-4 p-5">
          <div className="text-xs text-slate-400">총 발송</div>
          <div className="text-3xl font-bold tabular-nums mt-1">{stats.total}</div>
          <div className="text-[11px] text-slate-500 mt-2">최근 24시간</div>
        </window.Card>
        <window.Card className="col-span-6 md:col-span-4 p-5 !bg-emerald-950 !border-emerald-700">
          <div className="text-xs font-medium text-emerald-200">성공</div>
          <div className="text-3xl font-bold tabular-nums mt-1 text-emerald-50">{stats.success}</div>
          <div className="text-[11px] text-emerald-200/80 mt-2">{Math.round(stats.success / stats.total * 100)}%</div>
        </window.Card>
        <window.Card className="col-span-6 md:col-span-4 p-5 !bg-rose-950 !border-rose-700">
          <div className="text-xs font-medium text-rose-200">실패 · 재발송 필요</div>
          <div className="text-3xl font-bold tabular-nums mt-1 text-rose-50">{stats.failed}</div>
          <div className="text-[11px] text-rose-200/80 mt-2">채널 변경 후 재시도 권장</div>
        </window.Card>
      </div>

      <window.Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <window.Icon name="search" className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="고객명·번호·발송ID 검색" className="w-full pl-9 pr-3 py-1.5 rounded-md bg-slate-950/60 border border-white/10 text-sm focus:border-purple-500 outline-none" />
          </div>
          <div className="flex items-center gap-1 text-xs p-0.5 rounded-md bg-white/5 border border-white/10">
            {[["ALL", "전체"], ["SUCCESS", "성공"], ["FAILED", "실패"]].map(([k, l]) =>
            <button key={k} onClick={() => setFilterStatus(k)} className={`px-2.5 py-1 rounded ${filterStatus === k ? 'bg-purple-500/30 text-purple-200' : 'text-slate-400 hover:text-slate-200'}`}>{l}</button>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs p-0.5 rounded-md bg-white/5 border border-white/10">
            {[["ALL", "전체"], ["KAKAO", "알림톡"], ["EMAIL", "이메일"], ["FAX", "웹팩스"]].map(([k, l]) =>
            <button key={k} onClick={() => setFilterChannel(k)} className={`px-2.5 py-1 rounded ${filterChannel === k ? 'bg-purple-500/30 text-purple-200' : 'text-slate-400 hover:text-slate-200'}`}>{l}</button>
            )}
          </div>
          <div className="text-xs text-slate-500 ml-auto">{filtered.length}건 표시</div>
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
              {filtered.map((row) =>
              <tr key={row.id} onClick={() => setDetail(row)} className={`border-b border-white/5 hover:bg-white/[0.03] cursor-pointer transition ${detail?.id === row.id ? 'bg-purple-500/10' : ''}`}>
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
                    {row.status === "FAILED" ?
                  <button onClick={(e) => {e.stopPropagation();setDetail(row);}} className="text-xs text-rose-300 hover:text-rose-200 font-medium">채널변경 →</button> :

                  <button onClick={(e) => {e.stopPropagation();setDetail(row);}} className="text-xs text-slate-400 hover:text-purple-300">상세 →</button>
                  }
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </window.Card>

      {/* Detail side panel */}
      {detail &&
      <div className="fixed inset-0 z-30 flex">
          <div onClick={() => setDetail(null)} className="flex-1 bg-slate-950/60 backdrop-blur-sm"></div>
          <div className="w-full max-w-md bg-slate-950/95 border-l border-white/10 shadow-2xl shadow-purple-500/10 overflow-y-auto">
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-mono text-slate-500">{detail.id}</div>
                <h3 className="font-bold text-lg mt-0.5">발송 상세</h3>
              </div>
              <button onClick={() => setDetail(null)} className="p-1.5 rounded-md hover:bg-white/10"><window.Icon name="x" className="w-4 h-4" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className={`p-3 rounded-lg ${detail.status === 'SUCCESS' ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-rose-500/10 border border-rose-500/20'}`}>
                <div className="flex items-center gap-2">
                  <window.StatusPill status={detail.status} />
                  <span className="text-xs text-slate-400">{detail.time}</span>
                </div>
                {detail.status === 'FAILED' &&
              <div className="mt-2 text-sm text-rose-300">{detail.reason}</div>
              }
                {detail.status === 'SUCCESS' &&
              <div className="mt-2 text-sm text-emerald-300">수신 확인 · {detail.delivered}</div>
              }
              </div>

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between py-1.5 border-b border-white/5"><span className="text-slate-500">고객</span><span>{detail.customer} <span className="text-slate-500 font-mono text-xs">{detail.customerNo}</span></span></div>
                <div className="flex justify-between py-1.5 border-b border-white/5"><span className="text-slate-500">문서</span><span>{detail.doc}</span></div>
                <div className="flex justify-between py-1.5 border-b border-white/5"><span className="text-slate-500">채널</span><window.ChannelBadge channel={detail.channel} /></div>
                {detail.msgId && <div className="flex justify-between py-1.5 border-b border-white/5"><span className="text-slate-500">메시지 ID</span><span className="font-mono text-xs">{detail.msgId}</span></div>}
                {detail.fallback && <div className="py-1.5 border-b border-white/5 text-xs text-amber-400 flex items-center gap-1"><window.Icon name="alert" className="w-3 h-3" />이전 채널(웹팩스) 실패 후 자동 대체 발송</div>}
              </div>

              <div className="pt-2">
                <h4 className="text-xs uppercase tracking-wider text-slate-400 mb-2">PDF 파일</h4>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center gap-3">
                  <div className="w-9 h-11 rounded bg-gradient-to-br from-rose-500/30 to-rose-500/10 border border-rose-500/30 flex items-center justify-center text-[10px] font-bold text-rose-300">PDF</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-mono truncate">{detail.id}_{detail.customerNo}.pdf</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">62.4 KB · S3 immutable</div>
                  </div>
                  <button className="p-1.5 rounded-md hover:bg-white/10"><window.Icon name="download" className="w-4 h-4 text-slate-400" /></button>
                </div>
              </div>

              {detail.status === 'FAILED' &&
            <div className="pt-2">
                  <h4 className="text-xs uppercase tracking-wider text-slate-400 mb-2">재발송 — 채널 변경</h4>
                  <div className="space-y-2">
                    {["EMAIL", "KAKAO", "FAX"].filter((c) => c !== detail.channel).map((c) =>
                <button key={c} className="w-full p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-purple-500/10 hover:border-purple-500/30 text-left flex items-center gap-3 transition">
                        <window.ChannelBadge channel={c} />
                        <span className="text-xs text-slate-400 flex-1">로 재발송</span>
                        <window.Icon name="arrowRight" className="w-3.5 h-3.5 text-slate-500" />
                      </button>
                )}
                  </div>
                </div>
            }

              <div className="pt-3">
                <h4 className="text-xs uppercase tracking-wider text-slate-400 mb-2">감사 로그</h4>
                <div className="space-y-1.5 text-[11px] font-mono text-slate-500">
                  <div>{detail.time} · DISPATCH · admin@daejin</div>
                  {detail.status === 'SUCCESS' && <div>{detail.delivered} · DELIVERED · webhook</div>}
                  {detail.status === 'FAILED' && <div>{detail.time} · FAILED · {detail.reason}</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>);

}

window.History = History;
