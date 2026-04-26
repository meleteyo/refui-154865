// Templates screen — list + live editor with PDF preview
const { useState: useState_t } = React;

function Templates({ tweaks, onNavigate }) {
  const [selectedId, setSelectedId] = useState_t("TMPL-03");
  const [editing, setEditing] = useState_t({
    name: "납부확인서 표준형",
    headline: "납부 확인서",
    primaryColor: tweaks.brandColor || "#7c3aed",
    company: tweaks.brandName || "대진관리㈜",
    footer: "본 문서는 자동 생성되었습니다. 문의 062-XXX-XXXX",
    fontSize: 11
  });
  const [showNewModal, setShowNewModal] = useState_t(false);
  const [showTestModal, setShowTestModal] = useState_t(false);

  const tmpl = window.TEMPLATES.find((t) => t.id === selectedId);

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <window.SectionLabel color="pink">TEMPLATES · 템플릿 관리</window.SectionLabel>
          <h1 className="screen-main-title text-[32px] font-black leading-tight mt-1.5" style={{ color: '#000000' }}>PDF 템플릿</h1>
          <p className="text-[15px] font-semibold mt-1.5" style={{ color: 'var(--text-muted)' }}>로고·브랜드색·문구를 변경 → 라이브 미리보기 → 버전 저장</p>
        </div>
        <button onClick={() => setShowNewModal(true)} className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-sm font-semibold flex items-center gap-2 shadow-lg shadow-purple-500/30 hover:from-purple-600 hover:to-pink-600 transition">
          <window.Icon name="plus" className="w-3.5 h-3.5" />새 템플릿
        </button>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* List */}
        <window.Card className="col-span-12 lg:col-span-3 p-3">
          <div className="space-y-1">
            {window.TEMPLATES.map((t) =>
            <button key={t.id} onClick={() => setSelectedId(t.id)} className={`w-full text-left p-3 rounded-md transition ${selectedId === t.id ? 'bg-purple-500/15 border border-purple-500/30' : 'hover:bg-white/5 border border-transparent'}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="text-sm font-medium leading-tight">{t.name}</div>
                  {!t.active && <span className="text-[9px] px-1 py-0.5 rounded bg-slate-500/20 text-slate-400">비활성</span>}
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] ${t.type === 'BILL' ? 'bg-amber-500/10 text-amber-300' : 'bg-emerald-500/10 text-emerald-300'}`}>{t.type === 'BILL' ? '고지서' : '납부확인서'}</span>
                  <span className="text-[10px] font-mono text-slate-500">{t.version}</span>
                </div>
              </button>
            )}
          </div>
        </window.Card>

        {/* Editor */}
        <window.Card className="col-span-12 lg:col-span-5 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">편집</h3>
            <span className="text-[10px] font-mono text-slate-500">{tmpl?.id} · {tmpl?.version}</span>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-[11px] uppercase tracking-wider text-slate-500">템플릿명</label>
              <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-md bg-slate-950/60 border border-white/10 text-sm focus:border-purple-500 outline-none" />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-wider text-slate-500">제목 (Headline)</label>
              <input value={editing.headline} onChange={(e) => setEditing({ ...editing, headline: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-md bg-slate-950/60 border border-white/10 text-sm focus:border-purple-500 outline-none" />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-wider text-slate-500">발행자명</label>
              <input value={editing.company} onChange={(e) => setEditing({ ...editing, company: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-md bg-slate-950/60 border border-white/10 text-sm focus:border-purple-500 outline-none" />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-wider text-slate-500">브랜드 색상</label>
              <div className="flex items-center gap-2 mt-1">
                <input type="color" value={editing.primaryColor} onChange={(e) => setEditing({ ...editing, primaryColor: e.target.value })} className="w-12 h-9 rounded-md bg-transparent border border-white/10 cursor-pointer" />
                <input value={editing.primaryColor} onChange={(e) => setEditing({ ...editing, primaryColor: e.target.value })} className="flex-1 px-3 py-2 rounded-md bg-slate-950/60 border border-white/10 text-sm font-mono focus:border-purple-500 outline-none" />
                <div className="flex gap-1">
                  {["#7c3aed", "#0891b2", "#059669", "#dc2626", "#ea580c", "#475569"].map((c) =>
                  <button key={c} onClick={() => setEditing({ ...editing, primaryColor: c })} className="w-7 h-7 rounded-md border border-white/20 hover:scale-110 transition" style={{ background: c }} aria-label={c}></button>
                  )}
                </div>
              </div>
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-wider text-slate-500">하단 안내문</label>
              <textarea value={editing.footer} onChange={(e) => setEditing({ ...editing, footer: e.target.value })} rows={2} className="w-full mt-1 px-3 py-2 rounded-md bg-slate-950/60 border border-white/10 text-sm focus:border-purple-500 outline-none resize-none" />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-wider text-slate-500">본문 폰트 크기 ({editing.fontSize}pt)</label>
              <input type="range" min={9} max={14} value={editing.fontSize} onChange={(e) => setEditing({ ...editing, fontSize: parseInt(e.target.value) })} className="w-full mt-2" />
            </div>
          </div>
          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <div className="text-[10px] text-slate-500">변경 사항은 다음 발송부터 적용됩니다 · v2.2 신규 버전 생성</div>
            <button className="px-4 py-2 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 text-sm font-semibold shadow-lg shadow-purple-500/30">저장</button>
          </div>
        </window.Card>

        {/* Preview */}
        <window.Card className="col-span-12 lg:col-span-4 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <window.Icon name="eye" className="w-4 h-4 text-slate-400" />
              <h3 className="font-semibold text-sm">실시간 미리보기</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-500">A4</span>
          </div>
          <div className="rounded-lg bg-slate-100 p-7 aspect-[210/297] shadow-2xl">
            <div className="h-full flex flex-col text-slate-900" style={{ fontSize: `${editing.fontSize}px`, lineHeight: 1.5 }}>
              <div className="flex items-start justify-between pb-3 border-b-2 mb-4" style={{ borderColor: editing.primaryColor }}>
                <div>
                  <div className="text-[9px] uppercase tracking-widest text-slate-500">{editing.company}</div>
                  <div className="font-bold mt-0.5" style={{ color: editing.primaryColor, fontSize: `${editing.fontSize + 7}px` }}>{editing.headline}</div>
                </div>
                <div className="w-10 h-10 rounded-md flex items-center justify-center text-white font-bold" style={{ background: editing.primaryColor, fontSize: `${editing.fontSize + 4}px` }}>
                  {editing.company[0]}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-slate-500">발행일</span><span>2026-04-25</span></div>
                <div className="flex justify-between"><span className="text-slate-500">고객명</span><span className="font-semibold">홍길동</span></div>
                <div className="flex justify-between"><span className="text-slate-500">고객번호</span><span className="font-mono">C-00123</span></div>
              </div>
              <div className="mt-4 p-3 rounded-md" style={{ background: `${editing.primaryColor}10`, border: `1px solid ${editing.primaryColor}30` }}>
                <div className="text-[9px] uppercase tracking-wider text-slate-500">납부 금액</div>
                <div className="font-bold mt-0.5" style={{ color: editing.primaryColor, fontSize: `${editing.fontSize + 14}px` }}>₩125,000</div>
                <div className="text-[9px] text-slate-500 mt-0.5">납부기한 · 2026-04-30</div>
              </div>
              <div className="mt-auto pt-3 border-t border-slate-200 text-[8px] text-slate-400 leading-relaxed">{editing.footer}</div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button className="py-2 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 text-xs flex items-center justify-center gap-1.5"><window.Icon name="download" className="w-3 h-3" />PDF 받기</button>
            <button onClick={() => setShowTestModal(true)} className="py-2 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 text-xs flex items-center justify-center gap-1.5"><window.Icon name="send" className="w-3 h-3" />테스트 발송</button>
          </div>
        </window.Card>
      </div>

      {showNewModal && <NewTemplateModal onClose={() => setShowNewModal(false)} editing={editing} tweaks={tweaks} />}
      {showTestModal && <TestSendModal onClose={() => setShowTestModal(false)} editing={editing} tmpl={tmpl} tweaks={tweaks} />}
    </div>);

}

// ─── 새 템플릿 마법사 (4단계) ─────────────────────────────────────────
function NewTemplateModal({ onClose, editing, tweaks }) {
  const [step, setStep] = useState_t(1);
  const [form, setForm] = useState_t({
    type: 'BILL',
    base: 'BLANK',
    name: '',
    headline: '',
    primaryColor: tweaks.brandColor || '#7c3aed',
    fields: ['customer_name', 'customer_no', 'amount', 'due_date'],
    layout: 'STANDARD'
  });

  const steps = [
  { n: 1, label: '문서 유형', icon: 'file' },
  { n: 2, label: '베이스 선택', icon: 'template' },
  { n: 3, label: '메타 + 디자인', icon: 'sparkles' },
  { n: 4, label: '필드 매핑', icon: 'db' }];


  const baseOptions = [
  { id: 'BLANK', name: '빈 템플릿', desc: '처음부터 디자인', accent: 'slate' },
  { id: 'TMPL-01', name: '고지서 A형 복제', desc: '기존 v2.1을 복사해 시작', accent: 'amber' },
  { id: 'TMPL-03', name: '납부확인서 표준형 복제', desc: '기존 v2.1을 복사해 시작', accent: 'emerald' },
  { id: 'IMPORT', name: '기존 PDF 가져오기', desc: 'PDF 업로드 → 영역 자동 매핑', accent: 'cyan' }];


  const allFields = [
  { key: 'customer_name', label: '고객명', required: true },
  { key: 'customer_no', label: '고객번호', required: true },
  { key: 'amount', label: '납부금액', required: false },
  { key: 'due_date', label: '납기일', required: false },
  { key: 'invoice_no', label: '청구번호', required: false },
  { key: 'paid_date', label: '납부일', required: false },
  { key: 'period', label: '청구기간', required: false },
  { key: 'address', label: '주소', required: false },
  { key: 'phone', label: '연락처', required: false },
  { key: 'unpaid_count', label: '미납횟수', required: false },
  { key: 'late_fee', label: '연체료', required: false },
  { key: 'qr_link', label: '결제 QR', required: false }];


  const toggleField = (k) => {
    if (allFields.find((f) => f.key === k)?.required) return;
    setForm((s) => ({ ...s, fields: s.fields.includes(k) ? s.fields.filter((x) => x !== k) : [...s.fields, k] }));
  };

  const canNext =
  step === 1 && !!form.type ||
  step === 2 && !!form.base ||
  step === 3 && form.name.trim().length > 0 && form.headline.trim().length > 0 ||
  step === 4;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-slate-900 border border-white/10 shadow-2xl shadow-purple-500/10" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-7 py-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <window.SectionLabel color="pink">NEW TEMPLATE</window.SectionLabel>
            <h2 className="text-xl font-bold mt-0.5 text-slate-50">새 템플릿 만들기</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-white/5">
            <window.Icon name="x" className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Stepper */}
        <div className="px-7 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-1">
            {steps.map((s, i) => {
              const active = step === s.n;
              const done = step > s.n;
              return (
                <React.Fragment key={s.n}>
                  <button
                    onClick={() => done && setStep(s.n)}
                    disabled={!done && !active}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition ${active ? 'bg-purple-500/20 text-purple-200' : done ? 'text-emerald-300 hover:bg-white/5 cursor-pointer' : 'text-slate-500'}`}>
                    
                    <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${active ? 'bg-purple-500 text-white' : done ? 'bg-emerald-500/30 text-emerald-200' : 'bg-white/5 text-slate-500'}`}>
                      {done ? '✓' : s.n}
                    </span>
                    <span className="text-xs font-medium">{s.label}</span>
                  </button>
                  {i < steps.length - 1 && <div className={`flex-1 h-px ${done ? 'bg-emerald-500/30' : 'bg-white/5'}`}></div>}
                </React.Fragment>);

            })}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-7 py-6">
          {step === 1 &&
          <div className="space-y-5">
              <div>
                <h3 className="font-semibold text-slate-100 mb-1">어떤 문서를 만드시나요?</h3>
                <p className="text-sm text-slate-400">선택한 유형에 따라 기본 필드와 검증 규칙이 달라집니다.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
              { id: 'BILL', label: '고지서', desc: '미납·청구 안내. 금액·납기·연체료 포함', icon: 'file', accent: 'amber' },
              { id: 'RECEIPT', label: '납부확인서', desc: '납부 완료 영수증. 영수일자·확인번호', icon: 'shieldCheck', accent: 'emerald' },
              { id: 'NOTICE', label: '공지문', desc: '약관·점검 안내 등 일반 통지문', icon: 'bell', accent: 'cyan' },
              { id: 'CUSTOM', label: '사용자 정의', desc: '필드를 자유롭게 구성', icon: 'sparkles', accent: 'pink' }].
              map((o) => {
                const selected = form.type === o.id;
                const accentMap = {
                  amber: { bg: 'bg-amber-500/15', border: 'border-amber-500/40', text: 'text-amber-300' },
                  emerald: { bg: 'bg-emerald-500/15', border: 'border-emerald-500/40', text: 'text-emerald-300' },
                  cyan: { bg: 'bg-cyan-500/15', border: 'border-cyan-500/40', text: 'text-cyan-300' },
                  pink: { bg: 'bg-pink-500/15', border: 'border-pink-500/40', text: 'text-pink-300' }
                };
                const a = accentMap[o.accent];
                return (
                  <button
                    key={o.id}
                    onClick={() => setForm((s) => ({ ...s, type: o.id }))}
                    className={`text-left p-4 rounded-xl border-2 transition ${selected ? `${a.border} ${a.bg}` : 'border-white/10 hover:border-white/20 bg-white/[0.02]'}`}>
                    
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${selected ? a.bg : 'bg-white/5'}`}>
                        <window.Icon name={o.icon} className={`w-5 h-5 ${selected ? a.text : 'text-slate-400'}`} />
                      </div>
                      <div className={`font-semibold ${selected ? 'text-slate-50' : 'text-slate-200'}`}>{o.label}</div>
                      <div className="text-xs text-slate-400 mt-1 leading-relaxed">{o.desc}</div>
                    </button>);

              })}
              </div>
            </div>
          }

          {step === 2 &&
          <div className="space-y-5">
              <div>
                <h3 className="font-semibold text-slate-100 mb-1">시작 베이스를 선택하세요</h3>
                <p className="text-sm text-slate-400">기존 템플릿을 복제해서 시작하면 시간을 절약할 수 있습니다.</p>
              </div>
              <div className="space-y-2">
                {baseOptions.map((o) => {
                const selected = form.base === o.id;
                return (
                  <button
                    key={o.id}
                    onClick={() => setForm((s) => ({ ...s, base: o.id }))}
                    className={`w-full text-left flex items-center gap-4 p-4 rounded-xl border transition ${selected ? 'border-purple-500/40 bg-purple-500/10' : 'border-white/10 hover:border-white/20 bg-white/[0.02]'}`}>
                    
                      <div className={`w-12 h-16 rounded flex-shrink-0 flex items-center justify-center text-xs font-mono ${selected ? 'bg-purple-500/20 text-purple-200' : 'bg-white/5 text-slate-500'}`}>
                        {o.id === 'BLANK' ? '빈' : o.id === 'IMPORT' ? '↑' : 'A4'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium ${selected ? 'text-slate-50' : 'text-slate-200'}`}>{o.name}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{o.desc}</div>
                      </div>
                      {selected && <window.Icon name="check" className="w-5 h-5 text-purple-400" />}
                    </button>);

              })}
              </div>
              {form.base === 'IMPORT' &&
            <div className="p-4 rounded-lg border-2 border-dashed border-cyan-500/30 bg-cyan-500/5 text-center">
                  <window.Icon name="download" className="w-8 h-8 text-cyan-400 mx-auto mb-2 rotate-180" />
                  <div className="text-sm text-cyan-200 font-medium">PDF 파일을 끌어다 놓거나 클릭해 업로드</div>
                  <div className="text-xs text-slate-400 mt-1">최대 10MB · 텍스트 영역 자동 탐지</div>
                </div>
            }
            </div>
          }

          {step === 3 &&
          <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-slate-100 mb-1">메타 정보 + 디자인</h3>
                  <p className="text-sm text-slate-400">이름과 핵심 디자인 요소를 설정합니다.</p>
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-slate-500">템플릿명 <span className="text-rose-400">*</span></label>
                  <input value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} placeholder="예: 고지서 C형 (전기료 인상 안내)" className="w-full mt-1 px-3 py-2 rounded-md bg-slate-950/60 border border-white/10 text-sm focus:border-purple-500 outline-none" />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-slate-500">제목 (Headline) <span className="text-rose-400">*</span></label>
                  <input value={form.headline} onChange={(e) => setForm((s) => ({ ...s, headline: e.target.value }))} placeholder="예: 2026년 4월 관리비 청구서" className="w-full mt-1 px-3 py-2 rounded-md bg-slate-950/60 border border-white/10 text-sm focus:border-purple-500 outline-none" />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-slate-500">브랜드 색상</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input type="color" value={form.primaryColor} onChange={(e) => setForm((s) => ({ ...s, primaryColor: e.target.value }))} className="w-12 h-9 rounded-md bg-transparent border border-white/10 cursor-pointer" />
                    <input value={form.primaryColor} onChange={(e) => setForm((s) => ({ ...s, primaryColor: e.target.value }))} className="flex-1 px-3 py-2 rounded-md bg-slate-950/60 border border-white/10 text-sm font-mono focus:border-purple-500 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-slate-500">레이아웃</label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {[
                  { id: 'STANDARD', label: '표준', desc: '여백 넓게' },
                  { id: 'COMPACT', label: '컴팩트', desc: '한 페이지' },
                  { id: 'MULTI', label: '다중', desc: '2단 분할' }].
                  map((l) => {
                    const sel = form.layout === l.id;
                    return (
                      <button key={l.id} onClick={() => setForm((s) => ({ ...s, layout: l.id }))} className={`p-2.5 rounded-md border text-xs transition ${sel ? 'border-purple-500/40 bg-purple-500/10 text-purple-200' : 'border-white/10 hover:border-white/20 text-slate-300'}`}>
                          <div className="font-semibold">{l.label}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">{l.desc}</div>
                        </button>);

                  })}
                  </div>
                </div>
              </div>
              {/* Live preview */}
              <div>
                <div className="text-[11px] uppercase tracking-wider text-slate-500 mb-2">실시간 미리보기</div>
                <div className="rounded-lg bg-slate-100 p-6 aspect-[210/297] shadow-2xl text-slate-900" style={{ fontSize: '11px' }}>
                  <div className="flex items-start justify-between pb-3 border-b-2 mb-4" style={{ borderColor: form.primaryColor }}>
                    <div>
                      <div className="text-[9px] uppercase tracking-widest text-slate-500">{tweaks.brandName || '대진관리㈜'}</div>
                      <div className="font-bold mt-0.5 text-lg" style={{ color: form.primaryColor }}>{form.headline || '제목을 입력하세요'}</div>
                    </div>
                    <div className="w-9 h-9 rounded-md flex items-center justify-center text-white font-bold text-sm" style={{ background: form.primaryColor }}>
                      {(tweaks.brandName || 'D')[0]}
                    </div>
                  </div>
                  <div className="space-y-1.5 text-[10px]">
                    <div className="flex justify-between"><span className="text-slate-500">고객명</span><span className="font-semibold">홍길동</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">고객번호</span><span className="font-mono">C-00123</span></div>
                  </div>
                </div>
              </div>
            </div>
          }

          {step === 4 &&
          <div className="space-y-5">
              <div>
                <h3 className="font-semibold text-slate-100 mb-1">필드 매핑</h3>
                <p className="text-sm text-slate-400">PDF에 포함할 데이터 필드를 선택하세요. <span className="text-rose-300">필수</span> 필드는 해제할 수 없습니다.</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {allFields.map((f) => {
                const sel = form.fields.includes(f.key);
                return (
                  <button
                    key={f.key}
                    onClick={() => toggleField(f.key)}
                    disabled={f.required}
                    className={`p-3 rounded-lg border text-left transition ${sel ? 'border-purple-500/40 bg-purple-500/10' : 'border-white/10 bg-white/[0.02] hover:border-white/20'} ${f.required ? 'opacity-90 cursor-default' : 'cursor-pointer'}`}>
                    
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-sm font-medium text-slate-100">{f.label}</div>
                        {f.required && <span className="text-[9px] px-1 py-0.5 rounded bg-rose-500/20 text-rose-300 font-medium">필수</span>}
                        {sel && !f.required && <window.Icon name="check" className="w-3.5 h-3.5 text-purple-400" />}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 mt-1">{f.key}</div>
                    </button>);

              })}
              </div>
              <div className="p-4 rounded-lg bg-cyan-500/5 border border-cyan-500/20 flex items-start gap-3">
                <window.Icon name="db" className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="text-cyan-200 font-medium">Oracle 매핑 자동 적용</div>
                  <div className="text-slate-400 mt-1">선택한 {form.fields.length}개 필드는 BL_NOTICE / CUSTOMER_MASTER 테이블에서 자동으로 조회됩니다.</div>
                </div>
              </div>
            </div>
          }
        </div>

        {/* Footer */}
        <div className="px-7 py-4 border-t border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="text-xs text-slate-500">
            {step}/{steps.length} 단계 · 모든 입력은 자동 저장됨
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-3 py-2 text-sm text-slate-400 hover:text-slate-200">취소</button>
            {step > 1 &&
            <button onClick={() => setStep(step - 1)} className="px-3 py-2 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 text-sm">이전</button>
            }
            {step < 4 ?
            <button onClick={() => canNext && setStep(step + 1)} disabled={!canNext} className={`px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-2 transition ${canNext ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30 hover:from-purple-600 hover:to-pink-600' : 'bg-white/5 text-slate-600 cursor-not-allowed'}`}>
                다음 <window.Icon name="arrowRight" className="w-3.5 h-3.5" />
              </button> :

            <button onClick={onClose} className="px-4 py-2 rounded-md bg-gradient-to-r from-emerald-500 to-cyan-500 text-sm font-semibold flex items-center gap-2 shadow-lg shadow-emerald-500/30">
                <window.Icon name="check" className="w-3.5 h-3.5" />템플릿 생성
              </button>
            }
          </div>
        </div>
      </div>
    </div>);

}

// ─── 테스트 발송 모달 (단계 진행 + 결과) ─────────────────────────────────
function TestSendModal({ onClose, editing, tmpl, tweaks }) {
  const [phase, setPhase] = useState_t('form'); // form | sending | done
  const [recipient, setRecipient] = useState_t({
    channel: 'EMAIL',
    email: 'test-mailbox@daejin.co.kr',
    mobile: '010-0000-0000',
    fax: '062-000-0000',
    sample: 'C-00144'
  });
  const [progress, setProgress] = useState_t(0);
  const [eventIdx, setEventIdx] = useState_t(0);

  const sendingEvents = [
  { label: '권한 검증', ms: 80 },
  { label: 'Oracle 조회 (샘플)', ms: 280 },
  { label: 'PDF 렌더링', ms: 420 },
  { label: '전자서명 + 업로드', ms: 180 },
  { label: '채널 전송', ms: 260 },
  { label: '수신 확인 콜백', ms: 80 }];


  React.useEffect(() => {
    if (phase !== 'sending') return;
    let i = 0;
    let p = 0;
    const tick = () => {
      if (i >= sendingEvents.length) {
        setProgress(100);
        setTimeout(() => setPhase('done'), 250);
        return;
      }
      setEventIdx(i);
      p += 100 / sendingEvents.length;
      setProgress(Math.round(p));
      i += 1;
      setTimeout(tick, 320);
    };
    tick();
  }, [phase]);

  const startSend = () => {
    setProgress(0);
    setEventIdx(0);
    setPhase('sending');
  };

  const channelInfo = {
    EMAIL: { label: '이메일', hint: '본문 + PDF 첨부', color: 'emerald', addr: recipient.email, iconName: 'mail' },
    KAKAO: { label: '알림톡', hint: '카카오 비즈메시지 + PDF 다운로드 링크', color: 'purple', addr: recipient.mobile, iconName: 'chat' },
    FAX: { label: '웹팩스', hint: 'PDF 변환 후 팩스 전송', color: 'cyan', addr: recipient.fax, iconName: 'fax' }
  };
  const ci = channelInfo[recipient.channel];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm" onClick={phase === 'sending' ? null : onClose}>
      <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-white/10 shadow-2xl shadow-purple-500/10" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <window.SectionLabel color="purple">TEST DISPATCH</window.SectionLabel>
            <h2 className="text-xl font-bold mt-0.5 text-slate-50">테스트 발송</h2>
            <div className="text-xs text-slate-400 mt-1">템플릿 <span className="font-mono text-slate-300">{tmpl?.id} · {editing.name}</span> · 실제 운영 데이터에 영향 없음</div>
          </div>
          <button onClick={onClose} disabled={phase === 'sending'} className="p-2 rounded-md hover:bg-white/5 disabled:opacity-30">
            <window.Icon name="x" className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Form phase */}
        {phase === 'form' &&
        <div className="px-6 py-5 space-y-5">
            <div>
              <label className="text-[11px] uppercase tracking-wider text-slate-500">샘플 데이터</label>
              <select value={recipient.sample} onChange={(e) => setRecipient((s) => ({ ...s, sample: e.target.value }))} className="w-full mt-1 px-3 py-2 rounded-md bg-slate-950/60 border border-white/10 text-sm outline-none cursor-pointer hover:bg-slate-950/80 focus:border-purple-500 transition">
                <option value="C-00144" className="bg-slate-900">C-00144 · 이영희 · ₩245,000</option>
                <option value="C-00142" className="bg-slate-900">C-00142 · 박민수 · ₩125,000</option>
                <option value="C-00146" className="bg-slate-900">C-00146 · 최지호 · ₩312,500</option>
                <option value="DUMMY" className="bg-slate-900">더미 데이터 (개인정보 마스킹)</option>
              </select>
              <div className="text-[10px] text-slate-500 mt-1">선택한 고객의 실제 데이터로 PDF가 생성되며, 운영 통계엔 반영되지 않습니다.</div>
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider text-slate-500">발송 채널</label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                {[
              { id: 'EMAIL', label: '이메일', icon: 'mail', color: 'emerald' },
              { id: 'KAKAO', label: '알림톡', icon: 'chat', color: 'purple' },
              { id: 'FAX', label: '웹팩스', icon: 'fax', color: 'cyan' }].
              map((c) => {
                const sel = recipient.channel === c.id;
                const colorMap = {
                  emerald: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200',
                  purple: 'border-purple-500/40 bg-purple-500/10 text-purple-200',
                  cyan: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-200'
                };
                return (
                  <button key={c.id} onClick={() => setRecipient((s) => ({ ...s, channel: c.id }))} className={`p-3 rounded-md border text-left transition ${sel ? colorMap[c.color] : 'border-white/10 bg-white/[0.02] hover:border-white/20'}`}>
                      <window.Icon name={c.icon} className={`w-4 h-4 mb-1.5 ${sel ? '' : 'text-slate-400'}`} />
                      <div className={`text-sm font-semibold ${sel ? '' : 'text-slate-200'}`}>{c.label}</div>
                    </button>);

              })}
              </div>
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider text-slate-500">{ci.label} 수신처</label>
              {recipient.channel === 'EMAIL' &&
            <input value={recipient.email} onChange={(e) => setRecipient((s) => ({ ...s, email: e.target.value }))} placeholder="test@example.com" className="w-full mt-1 px-3 py-2 rounded-md bg-slate-950/60 border border-white/10 text-sm font-mono focus:border-purple-500 outline-none" />
            }
              {recipient.channel === 'KAKAO' &&
            <input value={recipient.mobile} onChange={(e) => setRecipient((s) => ({ ...s, mobile: e.target.value }))} placeholder="010-0000-0000" className="w-full mt-1 px-3 py-2 rounded-md bg-slate-950/60 border border-white/10 text-sm font-mono focus:border-purple-500 outline-none" />
            }
              {recipient.channel === 'FAX' &&
            <input value={recipient.fax} onChange={(e) => setRecipient((s) => ({ ...s, fax: e.target.value }))} placeholder="062-000-0000" className="w-full mt-1 px-3 py-2 rounded-md bg-slate-950/60 border border-white/10 text-sm font-mono focus:border-purple-500 outline-none" />
            }
              <div className="text-[10px] text-slate-500 mt-1">{ci.hint}</div>
            </div>

            <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 flex items-start gap-3">
              <window.Icon name="alert" className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300">
                <strong className="text-amber-200">테스트 발송도 비용이 발생합니다.</strong> 알림톡 8원, 팩스 80원이 차감됩니다 (이메일 무료).
              </div>
            </div>
          </div>
        }

        {/* Sending phase */}
        {phase === 'sending' &&
        <div className="px-6 py-8">
            <div className="text-center mb-6">
              <div className="inline-flex w-14 h-14 rounded-full bg-purple-500/20 items-center justify-center mb-3 animate-pulse">
                <window.Icon name={ci.iconName} className="w-7 h-7 text-purple-300" />
              </div>
              <div className="text-lg font-semibold text-slate-100">{ci.label}로 발송 중…</div>
              <div className="text-xs text-slate-400 mt-1 font-mono">{ci.addr}</div>
            </div>
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden mb-4">
              <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="space-y-1.5">
              {sendingEvents.map((e, i) => {
              const done = i < eventIdx;
              const active = i === eventIdx;
              return (
                <div key={i} className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition ${active ? 'bg-purple-500/10 text-purple-100' : done ? 'text-emerald-300' : 'text-slate-500'}`}>
                    <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center flex-shrink-0 ${active ? 'bg-purple-500 text-white animate-pulse' : done ? 'bg-emerald-500/30 text-emerald-200' : 'bg-white/5'}`}>
                      {done ? '✓' : i + 1}
                    </span>
                    <span className="flex-1">{e.label}</span>
                    {done && <span className="text-[10px] font-mono text-slate-500 tabular-nums">{e.ms}ms</span>}
                    {active && <span className="text-[10px] font-mono text-purple-300">처리중…</span>}
                  </div>);

            })}
            </div>
          </div>
        }

        {/* Done phase */}
        {phase === 'done' &&
        <div className="px-6 py-8">
            <div className="text-center mb-6">
              <div className="inline-flex w-14 h-14 rounded-full bg-emerald-500/20 items-center justify-center mb-3">
                <window.Icon name="check" className="w-7 h-7 text-emerald-300" />
              </div>
              <div className="text-lg font-semibold text-emerald-200">테스트 발송 성공</div>
              <div className="text-xs text-slate-400 mt-1">총 처리시간 <span className="text-slate-200 font-mono">1.3초</span> · 단번 도달</div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="p-3 rounded-md bg-white/[0.03] border border-white/10">
                <div className="text-[10px] uppercase tracking-wider text-slate-500">발송 ID</div>
                <div className="font-mono text-sm text-slate-200 mt-1">DR-TEST-9982</div>
              </div>
              <div className="p-3 rounded-md bg-white/[0.03] border border-white/10">
                <div className="text-[10px] uppercase tracking-wider text-slate-500">수신처</div>
                <div className="font-mono text-sm text-slate-200 mt-1 truncate">{ci.addr}</div>
              </div>
              <div className="p-3 rounded-md bg-white/[0.03] border border-white/10">
                <div className="text-[10px] uppercase tracking-wider text-slate-500">채널</div>
                <div className="mt-1"><window.ChannelBadge channel={recipient.channel} /></div>
              </div>
              <div className="p-3 rounded-md bg-white/[0.03] border border-white/10">
                <div className="text-[10px] uppercase tracking-wider text-slate-500">PDF 크기</div>
                <div className="font-mono text-sm text-slate-200 mt-1">142 KB · 1p</div>
              </div>
            </div>

            <div className="p-3 rounded-md bg-emerald-500/5 border border-emerald-500/20 flex items-start gap-3 mb-5">
              <window.Icon name="shieldCheck" className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300">
                감사 로그에 <span className="font-mono text-emerald-200">TEST_DISPATCH</span> 이벤트가 기록되었으며, 이 발송은 <span className="text-emerald-200">운영 통계에서 자동 제외</span>됩니다.
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setPhase('form')} className="py-2.5 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 text-sm flex items-center justify-center gap-2">
                <window.Icon name="refresh" className="w-3.5 h-3.5" />다시 발송
              </button>
              <button className="py-2.5 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 text-sm flex items-center justify-center gap-2">
                <window.Icon name="download" className="w-3.5 h-3.5" />생성된 PDF
              </button>
            </div>
          </div>
        }

        {/* Footer (form only) */}
        {phase === 'form' &&
        <div className="px-6 py-4 border-t border-white/10 flex items-center justify-end gap-2 bg-white/[0.02]">
            <button onClick={onClose} className="px-3 py-2 text-sm text-slate-400 hover:text-slate-200">취소</button>
            <button onClick={startSend} className="px-4 py-2 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 text-sm font-semibold flex items-center gap-2 shadow-lg shadow-purple-500/30 hover:from-purple-600 hover:to-pink-600 transition">
              <window.Icon name="send" className="w-3.5 h-3.5" />테스트 발송
            </button>
          </div>
        }
        {phase === 'done' &&
        <div className="px-6 py-4 border-t border-white/10 flex items-center justify-end bg-white/[0.02]">
            <button onClick={onClose} className="px-4 py-2 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 text-sm">닫기</button>
          </div>
        }
      </div>
    </div>);

}

window.Templates = Templates;
