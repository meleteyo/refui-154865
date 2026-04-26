// Dispatch console — multi-step wizard
const { useState: useState_c, useMemo: useMemo_c, useEffect: useEffect_c } = React;

function DispatchConsole({ tweaks, onNavigate }) {
  const [step, setStep] = useState_c(1); // 1: 조회 / 2: 템플릿·미리보기 / 3: 발송 / 4: 진행률
  const [filters, setFilters] = useState_c({ from: "2026-04-01", to: "2026-04-30", status: ["미납"], q: "" });
  const [selected, setSelected] = useState_c(new Set());
  const [template, setTemplate] = useState_c("TMPL-03");
  const [channels, setChannels] = useState_c({ KAKAO: true, EMAIL: true, FAX: false });
  const [progress, setProgress] = useState_c({ done: 0, success: 0, failed: 0 });

  const targets = window.MOCK_TARGETS.filter((t) => filters.status.includes(t.status) && (
  !filters.q || t.name.includes(filters.q) || t.customerNo.includes(filters.q)));

  const selectedItems = window.MOCK_TARGETS.filter((t) => selected.has(t.customerNo));

  // Reach-by-channel calc
  const reach = {
    EMAIL: selectedItems.filter((t) => t.email).length,
    KAKAO: selectedItems.filter((t) => t.mobile).length,
    FAX: selectedItems.filter((t) => t.fax).length
  };

  // Demo automation hooks — let the parent demo iframe drive the wizard
  useEffect_c(() => {
    window.__setConsoleStep = (n) => setStep(Math.max(1, Math.min(4, n | 0)));
    window.__consoleSelectAll = () => {
      const all = new Set(targets.slice(0, 5).map((t) => t.customerNo));
      setSelected(all);
    };
    window.__consoleClearSelection = () => setSelected(new Set());
    window.__consoleSetTemplate = (id) => id && setTemplate(id);
    window.__consoleSetChannels = (next) => next && setChannels((prev) => ({ ...prev, ...next }));
    return () => {
      delete window.__setConsoleStep;
      delete window.__consoleSelectAll;
      delete window.__consoleClearSelection;
      delete window.__consoleSetTemplate;
      delete window.__consoleSetChannels;
    };
  }, [targets.length]);

  // Step 4 — animate progress
  useEffect_c(() => {
    if (step !== 4) return;
    setProgress({ done: 0, success: 0, failed: 0 });
    const total = selectedItems.length;
    let done = 0,success = 0,failed = 0;
    const tick = () => {
      if (done >= total) return;
      done += 1;
      const fail = Math.random() < 0.07;
      if (fail) failed += 1;else success += 1;
      setProgress({ done, success, failed });
      if (done < total) setTimeout(tick, 180 + Math.random() * 220);
    };
    const t = setTimeout(tick, 500);
    return () => clearTimeout(t);
  }, [step]);

  const toggle = (cno) => {
    const s = new Set(selected);
    if (s.has(cno)) s.delete(cno);else s.add(cno);
    setSelected(s);
  };

  const toggleAll = () => {
    if (selected.size === targets.length) setSelected(new Set());else
    setSelected(new Set(targets.map((t) => t.customerNo)));
  };

  const policyMode = tweaks.policyMode || "PRIORITY";
  const channelOrder = ["KAKAO", "EMAIL", "FAX"];

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <window.SectionLabel color="purple">DISPATCH CONSOLE</window.SectionLabel>
          <h1 className="screen-main-title text-[32px] font-black leading-tight mt-1.5" style={{ color: '#000000' }}>발송 콘솔</h1>
          <p className="text-[15px] font-semibold mt-1.5" style={{ color: 'var(--text-muted)' }}>Oracle 조회 → PDF 생성 → 채널 선택 → 발송까지 한 화면에서</p>
        </div>
        <button
          onClick={() => onNavigate('dashboard')}
          className="px-3.5 py-2 rounded-lg border text-sm font-bold flex items-center justify-center gap-2 transition shadow-sm"
          style={{ color: '#000000', backgroundColor: 'rgba(255,255,255,0.18)', borderColor: 'rgba(0,0,0,0.35)' }}
        >
          취소
        </button>
      </div>

      {/* Stepper */}
      <window.Card className="p-5">
        <div className="flex items-center justify-between gap-2">
          {[
          { n: 1, label: "대상 조회", icon: "db" },
          { n: 2, label: "템플릿·미리보기", icon: "file" },
          { n: 3, label: "채널·정책", icon: "send" },
          { n: 4, label: "발송 진행", icon: "play" }].
          map((s, i, arr) => {
            const active = step === s.n;
            const done = step > s.n;
            return (
              <React.Fragment key={s.n}>
                <button
                  disabled={s.n > step + (selected.size > 0 ? 1 : 0)}
                  onClick={() => setStep(s.n)}
                  className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition ${active ? 'bg-purple-500/20 text-purple-100' : done ? 'text-emerald-400 hover:bg-white/5' : 'text-slate-500'}`}>
                  
                  <div className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold ${active ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white' : done ? 'bg-emerald-500/30 text-emerald-200' : 'bg-white/5 text-slate-500'}`}>
                    {done ? <window.Icon name="check" className="w-3.5 h-3.5" /> : s.n}
                  </div>
                  <span className="text-sm font-medium">{s.label}</span>
                </button>
                {i < arr.length - 1 &&
                <div className={`flex-1 h-px ${step > s.n ? 'bg-emerald-500/40' : 'bg-white/10'}`}></div>
                }
              </React.Fragment>);

          })}
        </div>
      </window.Card>

      {/* Step 1 — Query */}
      {step === 1 &&
      <div className="space-y-4">
          <window.Card className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <window.Icon name="filter" className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">필터</span>
              <span className="text-[11px] font-mono text-slate-500 ml-2">→ Oracle: BILLING_DB.V_INVOICE_TARGET</span>
            </div>
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-12 md:col-span-4">
                <label className="text-[11px] text-slate-500 uppercase">발행 기간</label>
                <div className="flex items-center gap-2 mt-1">
                  <input type="date" value={filters.from} onChange={(e) => setFilters({ ...filters, from: e.target.value })} className="flex-1 px-3 py-2 rounded-md bg-slate-950/60 border border-white/10 text-sm focus:border-purple-500 outline-none" />
                  <span className="text-slate-500">~</span>
                  <input type="date" value={filters.to} onChange={(e) => setFilters({ ...filters, to: e.target.value })} className="flex-1 px-3 py-2 rounded-md bg-slate-950/60 border border-white/10 text-sm focus:border-purple-500 outline-none" />
                </div>
              </div>
              <div className="col-span-12 md:col-span-4">
                <label className="text-[11px] text-slate-500 uppercase">납부 상태</label>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {["미납", "납부완료", "연체"].map((s) => {
                  const on = filters.status.includes(s);
                  return (
                    <button
                      key={s}
                      onClick={() => setFilters({ ...filters, status: on ? filters.status.filter((x) => x !== s) : [...filters.status, s] })}
                      className={`px-3 py-1.5 rounded-md text-sm border transition ${on ? 'bg-purple-500/20 border-purple-500/40 text-purple-100' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}>
                      {s}</button>);

                })}
                </div>
              </div>
              <div className="col-span-12 md:col-span-4">
                <label className="text-[11px] text-slate-500 uppercase">고객명·번호</label>
                <div className="relative mt-1">
                  <window.Icon name="search" className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })} placeholder="홍길동 또는 C-00142" className="w-full pl-9 pr-3 py-2 rounded-md bg-slate-950/60 border border-white/10 text-sm focus:border-purple-500 outline-none" />
                </div>
              </div>
            </div>
          </window.Card>

          <window.Card className="overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div>
                <h3 className="font-semibold">조회 결과 <span className="text-slate-500 font-normal">{targets.length}건</span></h3>
                <div className="text-xs text-slate-500 mt-0.5">
                  선택 <span className="text-purple-300 font-semibold">{selected.size}</span>건 · 발송 가능 채널 매칭은 다음 단계에서 확인
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={toggleAll} className="text-xs px-3 py-1.5 rounded-md bg-white/5 border border-white/10 hover:bg-white/10">
                  {selected.size === targets.length ? "전체 해제" : "전체 선택"}
                </button>
                <button
                disabled={selected.size === 0}
                onClick={() => setStep(2)}
                className="text-sm px-4 py-1.5 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 font-semibold disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-lg shadow-purple-500/20">
                다음 <window.Icon name="arrowRight" className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wider text-slate-500 border-b border-white/5">
                    <th className="px-6 py-2.5 w-10"></th>
                    <th className="px-3 py-2.5 font-medium">고객번호</th>
                    <th className="px-3 py-2.5 font-medium">고객명</th>
                    <th className="px-3 py-2.5 font-medium text-right">납부금액</th>
                    <th className="px-3 py-2.5 font-medium">납부기한</th>
                    <th className="px-3 py-2.5 font-medium">상태</th>
                    <th className="px-3 py-2.5 font-medium">연락 가능 채널</th>
                  </tr>
                </thead>
                <tbody>
                  {targets.map((t) => {
                  const sel = selected.has(t.customerNo);
                  return (
                    <tr key={t.customerNo} onClick={() => toggle(t.customerNo)} className={`border-b border-white/5 hover:bg-white/[0.03] cursor-pointer transition ${sel ? 'bg-purple-500/5' : ''}`}>
                        <td className="px-6 py-3">
                          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition ${sel ? 'bg-purple-500 border-purple-500' : 'border-white/20'}`}>
                            {sel && <window.Icon name="check" className="w-3 h-3 text-white" />}
                          </div>
                        </td>
                        <td className="px-3 py-3 font-mono text-xs text-slate-400">{t.customerNo}</td>
                        <td className="px-3 py-3 font-medium">{t.name}</td>
                        <td className="px-3 py-3 text-right tabular-nums">₩{window.fmt(t.amount)}</td>
                        <td className="px-3 py-3 text-slate-300">{t.dueDate}</td>
                        <td className="px-3 py-3">
                          <span className={`px-2 py-0.5 rounded text-xs ${t.status === '미납' ? 'bg-rose-500/15 text-rose-300' : 'bg-emerald-500/15 text-emerald-300'}`}>{t.status}</span>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-1">
                            {t.email && <span className="text-[10px] text-emerald-400/70" title={t.email}>이메일</span>}
                            {t.email && t.mobile && <span className="text-slate-700">·</span>}
                            {t.mobile && <span className="text-[10px] text-purple-400/70" title={t.mobile}>알림톡</span>}
                            {(t.email || t.mobile) && t.fax && <span className="text-slate-700">·</span>}
                            {t.fax && <span className="text-[10px] text-cyan-400/70" title={t.fax}>팩스</span>}
                          </div>
                        </td>
                      </tr>);

                })}
                </tbody>
              </table>
            </div>
          </window.Card>
        </div>
      }

      {/* Step 2 — Template & preview */}
      {step === 2 &&
      <div className="grid grid-cols-12 gap-4">
          <window.Card className="col-span-12 lg:col-span-4 p-5 space-y-3">
            <div>
              <h3 className="font-semibold mb-1">템플릿 선택</h3>
              <p className="text-xs text-slate-500">선택 {selected.size}건에 동일 적용</p>
            </div>
            <div className="space-y-2">
              {window.TEMPLATES.filter((t) => t.active).map((t) => {
              const on = template === t.id;
              return (
                <button key={t.id} onClick={() => setTemplate(t.id)} className={`w-full text-left p-3 rounded-lg border transition ${on ? 'bg-purple-500/15 border-purple-500/40' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-medium">{t.name}</div>
                      {on && <window.Icon name="check" className="w-4 h-4 text-purple-300" />}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${t.type === 'BILL' ? 'bg-amber-500/10 text-amber-300' : 'bg-emerald-500/10 text-emerald-300'}`}>{t.type === 'BILL' ? '고지서' : '납부확인서'}</span>
                      <span>{t.version}</span>
                    </div>
                  </button>);

            })}
            </div>
            <div className="pt-3 border-t border-white/10 space-y-2">
              <label className="text-[11px] text-slate-500 uppercase">발행일</label>
              <input type="date" defaultValue="2026-04-25" className="w-full px-3 py-2 rounded-md bg-slate-950/60 border border-white/10 text-sm" />
              <label className="text-[11px] text-slate-500 uppercase mt-2 block">인쇄 품질</label>
              <div className="flex gap-1.5">
                {["표준", "고품질"].map((q, i) =>
              <button key={q} className={`flex-1 px-3 py-1.5 rounded-md text-xs border ${i === 1 ? 'bg-purple-500/20 border-purple-500/40 text-purple-100' : 'bg-white/5 border-white/10 text-slate-400'}`}>{q}</button>
              )}
              </div>
            </div>
          </window.Card>

          <window.Card className="col-span-12 lg:col-span-8 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <window.Icon name="eye" className="w-4 h-4 text-slate-400" />
                <h3 className="font-semibold">미리보기</h3>
                <span className="text-xs text-slate-500">대표 1건: {selectedItems[0]?.name || '—'}</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">A4 · 210×297mm</span>
            </div>
            <div className="rounded-lg bg-slate-100 p-8 aspect-[210/297] max-w-md mx-auto shadow-2xl">
              <div className="h-full flex flex-col text-slate-900">
                <div className="flex items-start justify-between pb-4 border-b-2 mb-5" style={{ borderColor: tweaks.brandColor || '#7c3aed' }}>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-slate-500">{tweaks.brandName || '대진관리㈜'}</div>
                    <div className="text-xl font-bold mt-0.5" style={{ color: tweaks.brandColor || '#7c3aed' }}>
                      {window.TEMPLATES.find((t) => t.id === template)?.type === 'BILL' ? '납부 고지서' : '납부 확인서'}
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-md flex items-center justify-center text-white font-bold text-lg" style={{ background: tweaks.brandColor || '#7c3aed' }}>
                    {(tweaks.brandName || '대')[0]}
                  </div>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between"><span className="text-slate-500">발행일</span><span>2026-04-25</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">고객명</span><span className="font-semibold">{selectedItems[0]?.name || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">고객번호</span><span className="font-mono">{selectedItems[0]?.customerNo || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">고지번호</span><span className="font-mono">{selectedItems[0]?.invoiceNo || '—'}</span></div>
                </div>
                <div className="mt-5 p-4 rounded-md" style={{ background: `${tweaks.brandColor || '#7c3aed'}10`, border: `1px solid ${tweaks.brandColor || '#7c3aed'}30` }}>
                  <div className="text-[10px] uppercase tracking-wider text-slate-500">납부 금액</div>
                  <div className="text-3xl font-bold mt-1" style={{ color: tweaks.brandColor || '#7c3aed' }}>
                    ₩{window.fmt(selectedItems[0]?.amount || 0)}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">납부기한 · {selectedItems[0]?.dueDate || '—'}</div>
                </div>
                <div className="mt-auto pt-4 border-t border-slate-200 text-[9px] text-slate-400 leading-relaxed">
                  본 문서는 {tweaks.brandName || '대진관리㈜'} 시스템에서 자동 생성되었습니다. 문의 062-XXX-XXXX
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <button onClick={() => setStep(1)} className="text-sm px-4 py-2 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 flex items-center gap-1.5">
                <window.Icon name="chevronLeft" className="w-3.5 h-3.5" />이전
              </button>
              <div className="text-xs text-slate-500">{selected.size}건의 PDF가 생성됩니다 · OpenHTMLtoPDF · Noto Sans KR</div>
              <button onClick={() => setStep(3)} className="text-sm px-4 py-2 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 font-semibold flex items-center gap-1.5 shadow-lg shadow-purple-500/20">
                PDF 생성 후 발송 <window.Icon name="arrowRight" className="w-3.5 h-3.5" />
              </button>
            </div>
          </window.Card>
        </div>
      }

      {/* Step 3 — Channel & policy */}
      {step === 3 &&
      <div className="grid grid-cols-12 gap-4">
          <window.Card className="col-span-12 lg:col-span-7 p-5 space-y-5">
            <div>
              <h3 className="font-semibold mb-1">발송 채널</h3>
              <p className="text-xs text-slate-500">정책 모드: <span className="text-purple-300 font-medium">{policyMode === 'PRIORITY' ? '우선순위 (실패 시 자동 대체)' : '동시 발송 (수신 중복)'}</span></p>
            </div>
            <div className="space-y-2.5">
              {[
            { key: "KAKAO", name: "카카오 알림톡", api: "알리고 + 솔라피", cost: "건당 ₩8", color: "purple" },
            { key: "EMAIL", name: "이메일", api: "AWS SES", cost: "10K건/월 무료", color: "emerald" },
            { key: "FAX", name: "웹팩스", api: "비즈팩스", cost: "건당 ₩80", color: "cyan" }].
            map((c, i) => {
              const on = channels[c.key];
              const r = reach[c.key];
              const total = selected.size;
              return (
                <div key={c.key} className={`p-4 rounded-lg border transition ${on ? `bg-${c.color}-500/10 border-${c.color}-500/30` : 'bg-white/5 border-white/10'}`}>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <button onClick={() => setChannels({ ...channels, [c.key]: !on })} className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition ${on ? `bg-${c.color}-500 border-${c.color}-500` : 'border-white/20'}`}>
                        {on && <window.Icon name="check" className="w-3.5 h-3.5 text-white" />}
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold flex items-center gap-2">
                              <window.ChannelBadge channel={c.key} />
                              <span>{c.name}</span>
                              {policyMode === 'PRIORITY' && on &&
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-400">우선순위 {channelOrder.filter((k) => channels[k]).indexOf(c.key) + 1}</span>
                            }
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">{c.api} · {c.cost}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold tabular-nums">{r}<span className="text-slate-500">/{total}</span></div>
                            <div className="text-[10px] text-slate-500">수신 가능</div>
                          </div>
                        </div>
                        {on && r < total &&
                      <div className="mt-2 text-[11px] text-amber-400/80 flex items-center gap-1">
                            <window.Icon name="alert" className="w-3 h-3" />수신 정보 누락 {total - r}건 — {policyMode === 'PRIORITY' ? '다음 채널로 자동 대체됩니다' : '해당 건은 발송 제외'}
                          </div>
                      }
                      </div>
                    </label>
                  </div>);

            })}
            </div>
          </window.Card>

          <window.Card className="col-span-12 lg:col-span-5 p-5 space-y-4">
            <div>
              <h3 className="font-semibold mb-1">발송 요약</h3>
              <p className="text-xs text-slate-500">최종 확인 후 발송 실행</p>
            </div>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-400">선택 건수</span>
                <span className="font-semibold tabular-nums">{selected.size}건</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-400">템플릿</span>
                <span className="font-medium text-xs">{window.TEMPLATES.find((t) => t.id === template)?.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-400">활성 채널</span>
                <div className="flex gap-1">
                  {Object.entries(channels).filter(([k, v]) => v).map(([k]) => <window.ChannelBadge key={k} channel={k} />)}
                </div>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-400">정책</span>
                <span className="font-medium text-xs">{policyMode === 'PRIORITY' ? '우선순위 + 자동 대체' : 'BROADCAST'}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400">예상 비용</span>
                <span className="font-bold text-lg tabular-nums">₩{window.fmt(selected.size * (channels.KAKAO ? 8 : 0) + (channels.FAX ? Math.min(reach.FAX, selected.size) * 80 : 0))}</span>
              </div>
            </div>
            <div className="pt-3 space-y-2">
              <button onClick={() => setStep(4)} disabled={!Object.values(channels).some((v) => v)} className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30 disabled:opacity-30">
                <window.Icon name="send" className="w-4 h-4" />발송 실행
              </button>
              <button onClick={() => setStep(2)} className="w-full py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-sm">이전 단계</button>
            </div>
            <div className="text-[10px] text-slate-500 leading-relaxed pt-2 border-t border-white/5">
              <window.Icon name="shieldCheck" className="w-3 h-3 inline mr-1 text-emerald-400" />발송 즉시 AuditLog 기록 · PDF immutable · 5년+ 보관
            </div>
          </window.Card>
        </div>
      }

      {/* Step 4 — Progress */}
      {step === 4 &&
      <window.Card className="p-7">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <window.Icon name="send" className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">발송 진행 중</h3>
              <div className="text-xs text-slate-500 font-mono">Job ID · J-20260425-{String(Math.floor(Math.random() * 900) + 100)}</div>
            </div>
            <div className="ml-auto text-xs text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              실시간
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-300">전체 진행률</span>
              <span className="font-bold tabular-nums">{progress.done} / {selectedItems.length} <span className="text-slate-500 text-xs ml-1">({Math.round(progress.done / selectedItems.length * 100) || 0}%)</span></span>
            </div>
            <div className="h-3 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-emerald-500 transition-all duration-300" style={{ width: `${progress.done / selectedItems.length * 100 || 0}%` }}></div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 mb-6">
            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="text-[10px] uppercase tracking-wider text-emerald-400">성공</div>
              <div className="text-2xl font-bold tabular-nums text-emerald-300 mt-1">{progress.success}</div>
            </div>
            <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/20">
              <div className="text-[10px] uppercase tracking-wider text-rose-400">실패</div>
              <div className="text-2xl font-bold tabular-nums text-rose-300 mt-1">{progress.failed}</div>
            </div>
            <div className="p-4 rounded-lg bg-slate-500/10 border border-slate-500/20">
              <div className="text-[10px] uppercase tracking-wider text-slate-400">대기</div>
              <div className="text-2xl font-bold tabular-nums text-slate-300 mt-1">{Math.max(0, selectedItems.length - progress.done)}</div>
            </div>
            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <div className="text-[10px] uppercase tracking-wider text-amber-400">예상 잔여</div>
              <div className="text-2xl font-bold tabular-nums text-amber-300 mt-1">{Math.max(0, Math.ceil((selectedItems.length - progress.done) * 0.25))}<span className="text-sm">초</span></div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-slate-400 mb-2">채널별 현황</div>
            {Object.entries(channels).filter(([k, v]) => v).map(([k]) => {
            const r = reach[k];
            const channelDone = Math.min(r, Math.floor(progress.done * (r / selectedItems.length)));
            return (
              <div key={k} className="flex items-center gap-3">
                  <div className="w-20"><window.ChannelBadge channel={k} /></div>
                  <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                    <div className={`h-full transition-all duration-300 ${k === 'KAKAO' ? 'bg-purple-400' : k === 'EMAIL' ? 'bg-emerald-400' : 'bg-cyan-400'}`} style={{ width: `${channelDone / r * 100 || 0}%` }}></div>
                  </div>
                  <div className="text-xs tabular-nums text-slate-400 w-16 text-right">{channelDone}/{r}</div>
                </div>);

          })}
          </div>

          <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between">
            {progress.done < selectedItems.length ?
          <>
                <button className="px-4 py-2 rounded-md bg-white/5 border border-white/10 text-sm hover:bg-white/10">백그라운드 실행</button>
                <button className="px-4 py-2 rounded-md bg-rose-500/10 border border-rose-500/30 text-sm text-rose-300 hover:bg-rose-500/20 flex items-center gap-1.5">
                  <window.Icon name="pause" className="w-3.5 h-3.5" />중단
                </button>
              </> :

          <>
                <div className="text-sm text-emerald-300 flex items-center gap-2">
                  <window.Icon name="check" className="w-4 h-4" />
                  발송 완료 · {progress.success}건 성공 / {progress.failed}건 실패
                </div>
                <div className="flex gap-2">
                  <button onClick={() => onNavigate('history')} className="px-4 py-2 rounded-md bg-white/5 border border-white/10 text-sm hover:bg-white/10">이력 보기</button>
                  <button onClick={() => {setStep(1);setSelected(new Set());}} className="px-4 py-2 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 text-sm font-semibold">새 발송</button>
                </div>
              </>
          }
          </div>
        </window.Card>
      }
    </div>);

}

window.DispatchConsole = DispatchConsole;
