// Dispatch detail timeline — 발송 1건의 전체 라이프사이클
function DispatchDetail({ tweaks, onNavigate, dispatchId = "DR-3984" }) {
  // Mock detail data for DR-3984
  const detail = {
    id: 'DR-3984',
    customer: { no: 'C-00144', name: '이영희', email: 'lyh@nuri.io', mobile: '010-3318-7724', fax: null },
    invoice: 'INV-20260401-144',
    document: { type: '납부확인서', template: 'TMPL-03 · 납부확인서 표준형 v2.1', amount: 245000, dueDate: '2026-04-20' },
    finalChannel: 'KAKAO',
    finalStatus: 'SUCCESS',
    initiator: { user: '김지선', role: 'OPERATOR' },
    totalDuration: 1.2, // seconds
  };

  // Lifecycle events — 8 phase pipeline
  const events = [
    { ts: '14:23:14.038', phase: 'REQUEST',   actor: '김지선',  status: 'ok',      title: '발송 요청 접수',                   detail: '발송 콘솔에서 1건 단건 발송 클릭 · 사용자 IP 10.42.1.118',         duration: 8 },
    { ts: '14:23:14.046', phase: 'AUTH',      actor: 'system', status: 'ok',      title: '권한 검증',                         detail: 'OPERATOR 역할 · DISPATCH_SEND 권한 OK · 일일 한도 5000건 중 472건', duration: 12 },
    { ts: '14:23:14.058', phase: 'QUERY',     actor: 'oracle', status: 'ok',      title: 'Oracle 데이터 조회',                detail: 'BL_NOTICE 테이블 + 고객 마스터 조인 · 245ms · 0 rows updated',     duration: 245 },
    { ts: '14:23:14.303', phase: 'RENDER',    actor: 'system', status: 'ok',      title: 'PDF 렌더링',                        detail: 'Apache FOP 2.9 · 템플릿 TMPL-03 v2.1 · 1페이지 · 142KB · 387ms',   duration: 387 },
    { ts: '14:23:14.690', phase: 'SIGN',      actor: 'system', status: 'ok',      title: '전자서명 + S3 업로드',              detail: 'KMS 서명 (RSA-4096) · S3 PUT pdf-archive/2026/04/DR-3984.pdf',    duration: 156 },
    { ts: '14:23:14.846', phase: 'POLICY',    actor: 'engine', status: 'ok',      title: '채널 정책 평가',                    detail: 'PRIORITY 모드 · 고객 가용 채널: KAKAO, EMAIL · 1순위 KAKAO 선택', duration: 23 },
    { ts: '14:23:14.869', phase: 'DISPATCH',  actor: 'kakao',  status: 'ok',      title: '알림톡 발송',                       detail: '카카오비즈 API · 메시지 ID kkt_84afb29e · 8원 차감',              duration: 312 },
    { ts: '14:23:15.181', phase: 'CALLBACK',  actor: 'kakao',  status: 'ok',      title: '수신 확인 콜백',                    detail: 'webhook /api/kakao/callback · status=DELIVERED · 단말 도달',      duration: 0,   final: true },
  ];

  const phaseColor = {
    REQUEST:  { bg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-500/40' },
    AUTH:     { bg: 'bg-pink-500/20',   text: 'text-pink-300',   border: 'border-pink-500/40' },
    QUERY:    { bg: 'bg-cyan-500/20',   text: 'text-cyan-300',   border: 'border-cyan-500/40' },
    RENDER:   { bg: 'bg-amber-500/20',  text: 'text-amber-300',  border: 'border-amber-500/40' },
    SIGN:     { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/40' },
    POLICY:   { bg: 'bg-pink-500/20',   text: 'text-pink-300',   border: 'border-pink-500/40' },
    DISPATCH: { bg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-500/40' },
    CALLBACK: { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/40' },
  };

  const totalMs = events.reduce((s, e) => s + e.duration, 0);

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <button onClick={() => onNavigate('history')} className="text-xs text-slate-400 hover:text-purple-300 flex items-center gap-1 mb-2">
            <window.Icon name="chevronLeft" className="w-3 h-3" />이력으로
          </button>
          <window.SectionLabel color="purple">DISPATCH DETAIL</window.SectionLabel>
          <div className="flex items-baseline gap-3 mt-1.5">
            <h1 className="screen-main-title text-[32px] font-black leading-tight font-mono" style={{ color: '#000000' }}>{detail.id}</h1>
            <window.StatusPill status={detail.finalStatus} />
          </div>
          <p className="text-[15px] font-semibold mt-1.5" style={{ color: 'var(--text-muted)' }}>
            {detail.customer.name} ({detail.customer.no}) · {detail.document.type} · 최종 채널{' '}
            <window.ChannelBadge channel={detail.finalChannel} />
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-sm flex items-center gap-2">
            <window.Icon name="download" className="w-3.5 h-3.5" />PDF 다운로드
          </button>
          <button className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-sm flex items-center gap-2">
            <window.Icon name="refresh" className="w-3.5 h-3.5" />재발송
          </button>
        </div>
      </div>

      {/* Top summary */}
      <div className="grid grid-cols-12 gap-4">
        <window.Card className="col-span-12 md:col-span-3 p-5">
          <div className="text-xs text-slate-400 mb-1">총 처리시간</div>
          <div className="text-3xl font-bold tabular-nums text-emerald-300">{detail.totalDuration}<span className="text-base ml-0.5 text-slate-500">초</span></div>
          <div className="mt-2 text-xs text-emerald-400/70">SLA 5초 이내 · OK</div>
        </window.Card>
        <window.Card className="col-span-12 md:col-span-3 p-5">
          <div className="text-xs text-slate-400 mb-1">파이프라인 단계</div>
          <div className="text-3xl font-bold tabular-nums">{events.length}<span className="text-base ml-0.5 text-slate-500">단계</span></div>
          <div className="mt-2 text-xs text-emerald-400/70">전 단계 정상</div>
        </window.Card>
        <window.Card className="col-span-12 md:col-span-3 p-5">
          <div className="text-xs text-slate-400 mb-1">발송 비용</div>
          <div className="text-3xl font-bold tabular-nums">₩8</div>
          <div className="mt-2 text-xs text-purple-300">알림톡 (팩스 대비 −90%)</div>
        </window.Card>
        <window.Card className="col-span-12 md:col-span-3 p-5">
          <div className="text-xs text-slate-400 mb-1">재시도</div>
          <div className="text-3xl font-bold tabular-nums">0<span className="text-base ml-0.5 text-slate-500">회</span></div>
          <div className="mt-2 text-xs text-emerald-400/70">단번 성공</div>
        </window.Card>
      </div>

      {/* Customer + Document panels */}
      <div className="grid grid-cols-12 gap-4">
        <window.Card className="col-span-12 lg:col-span-6 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-base">고객 정보</h3>
            <span className="text-[10px] font-mono text-slate-500">FROM ORACLE</span>
          </div>
          <div className="space-y-2.5 text-sm">
            <div className="grid grid-cols-3 gap-3 py-1.5 border-b border-white/5">
              <span className="text-slate-500 text-xs">고객 번호</span>
              <span className="col-span-2 font-mono text-slate-200">{detail.customer.no}</span>
            </div>
            <div className="grid grid-cols-3 gap-3 py-1.5 border-b border-white/5">
              <span className="text-slate-500 text-xs">고객명</span>
              <span className="col-span-2 text-slate-200">{detail.customer.name}</span>
            </div>
            <div className="grid grid-cols-3 gap-3 py-1.5 border-b border-white/5">
              <span className="text-slate-500 text-xs">이메일</span>
              <span className="col-span-2 font-mono text-emerald-300">{detail.customer.email || <span className="text-slate-600">없음</span>}</span>
            </div>
            <div className="grid grid-cols-3 gap-3 py-1.5 border-b border-white/5">
              <span className="text-slate-500 text-xs">휴대폰</span>
              <span className="col-span-2 font-mono text-purple-300">{detail.customer.mobile || <span className="text-slate-600">없음</span>}</span>
            </div>
            <div className="grid grid-cols-3 gap-3 py-1.5">
              <span className="text-slate-500 text-xs">팩스</span>
              <span className="col-span-2 font-mono text-cyan-300">{detail.customer.fax || <span className="text-slate-600">없음</span>}</span>
            </div>
          </div>
        </window.Card>

        <window.Card className="col-span-12 lg:col-span-6 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-base">문서 정보</h3>
            <span className="text-[10px] font-mono text-slate-500">TMPL-03 · 142KB</span>
          </div>
          <div className="space-y-2.5 text-sm">
            <div className="grid grid-cols-3 gap-3 py-1.5 border-b border-white/5">
              <span className="text-slate-500 text-xs">청구 번호</span>
              <span className="col-span-2 font-mono text-slate-200">{detail.invoice}</span>
            </div>
            <div className="grid grid-cols-3 gap-3 py-1.5 border-b border-white/5">
              <span className="text-slate-500 text-xs">유형</span>
              <span className="col-span-2 text-slate-200">{detail.document.type}</span>
            </div>
            <div className="grid grid-cols-3 gap-3 py-1.5 border-b border-white/5">
              <span className="text-slate-500 text-xs">템플릿</span>
              <span className="col-span-2 text-slate-200 text-xs">{detail.document.template}</span>
            </div>
            <div className="grid grid-cols-3 gap-3 py-1.5 border-b border-white/5">
              <span className="text-slate-500 text-xs">납부 금액</span>
              <span className="col-span-2 font-mono text-amber-300 tabular-nums">₩{window.fmt(detail.document.amount)}</span>
            </div>
            <div className="grid grid-cols-3 gap-3 py-1.5">
              <span className="text-slate-500 text-xs">납기일</span>
              <span className="col-span-2 font-mono text-slate-200">{detail.document.dueDate}</span>
            </div>
          </div>
        </window.Card>
      </div>

      {/* Lifecycle timeline — main */}
      <window.Card className="p-6">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-base">생애주기 타임라인</h3>
          <span className="text-xs text-slate-500 font-mono">총 {totalMs}ms · {events.length}단계</span>
        </div>
        <div className="text-xs text-slate-500 mb-6">발송 요청부터 단말 도달까지 — 완전한 추적 가능성</div>

        {/* Horizontal pipeline mini-diagram */}
        <div className="mb-8 p-4 rounded-lg bg-white/[0.02] border border-white/5">
          <div className="flex items-center gap-1 overflow-x-auto pb-2">
            {events.map((e, i) => {
              const c = phaseColor[e.phase];
              const widthPct = (e.duration / totalMs) * 100;
              return (
                <React.Fragment key={i}>
                  <div className="flex-shrink-0 flex flex-col items-center gap-1.5">
                    <div className={`w-9 h-9 rounded-full ${c.bg} ${c.border} border-2 flex items-center justify-center font-mono text-[10px] ${c.text} font-bold`}>
                      {i + 1}
                    </div>
                    <div className={`text-[10px] font-mono ${c.text} whitespace-nowrap`}>{e.phase}</div>
                    <div className="text-[10px] text-slate-500 tabular-nums">{e.duration}ms</div>
                  </div>
                  {i < events.length - 1 && (
                    <div className="flex-1 min-w-[24px] h-0.5 bg-gradient-to-r from-white/10 to-white/20 self-center mt-[-12px]"></div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Detail event list */}
        <div className="relative">
          {/* Vertical guide line */}
          <div className="absolute left-[14px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-purple-500/30 via-pink-500/20 to-emerald-500/30"></div>
          <div className="space-y-3">
            {events.map((e, i) => {
              const c = phaseColor[e.phase];
              return (
                <div key={i} className="flex gap-4 items-start">
                  <div className={`relative z-10 w-7 h-7 rounded-full ${c.bg} ${c.border} border-2 flex items-center justify-center flex-shrink-0 mt-1`}>
                    {e.final ? <window.Icon name="check" className={`w-3.5 h-3.5 ${c.text}`} /> : <span className={`text-[10px] font-mono font-bold ${c.text}`}>{i + 1}</span>}
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${c.bg} ${c.text} border ${c.border}`}>{e.phase}</span>
                      <span className="text-sm font-medium text-slate-100">{e.title}</span>
                      <span className="text-[10px] text-slate-500 font-mono ml-auto">{e.ts}</span>
                      <span className="text-[10px] text-slate-500 font-mono tabular-nums">+{e.duration}ms</span>
                    </div>
                    <div className="mt-1 text-xs text-slate-400">{e.detail}</div>
                    <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-600">
                      <span className="font-mono">actor:</span>
                      <span className="font-mono text-slate-500">{e.actor}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </window.Card>

      {/* Audit + Compliance */}
      <div className="grid grid-cols-12 gap-4">
        <window.Card className="col-span-12 lg:col-span-7 p-6">
          <h3 className="font-semibold text-base mb-1">감사 추적</h3>
          <div className="text-xs text-slate-500 mb-4">이뮤터블 로그 · S3 Object Lock 90일</div>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-start gap-3 p-2 rounded bg-white/[0.02]">
              <span className="text-slate-500 w-32 flex-shrink-0">REQUEST_ID</span>
              <span className="text-slate-200 break-all">req_2026042514_dr3984_a8f72e09bc</span>
            </div>
            <div className="flex items-start gap-3 p-2 rounded bg-white/[0.02]">
              <span className="text-slate-500 w-32 flex-shrink-0">PDF_HASH (SHA-256)</span>
              <span className="text-slate-200 break-all text-[10px]">7a4f9b2c3d1e8f0a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8</span>
            </div>
            <div className="flex items-start gap-3 p-2 rounded bg-white/[0.02]">
              <span className="text-slate-500 w-32 flex-shrink-0">S3_OBJECT</span>
              <span className="text-slate-200 break-all text-[10px]">s3://pdf-archive/2026/04/DR-3984.pdf</span>
            </div>
            <div className="flex items-start gap-3 p-2 rounded bg-white/[0.02]">
              <span className="text-slate-500 w-32 flex-shrink-0">KMS_KEY</span>
              <span className="text-slate-200 break-all text-[10px]">arn:aws:kms:ap-northeast-2:...:key/pdf-sign</span>
            </div>
            <div className="flex items-start gap-3 p-2 rounded bg-white/[0.02]">
              <span className="text-slate-500 w-32 flex-shrink-0">KAKAO_MSG_ID</span>
              <span className="text-purple-300 break-all">kkt_84afb29e</span>
            </div>
            <div className="flex items-start gap-3 p-2 rounded bg-white/[0.02]">
              <span className="text-slate-500 w-32 flex-shrink-0">CALLBACK_AT</span>
              <span className="text-emerald-300 break-all">2026-04-25T14:23:15.181+09:00</span>
            </div>
          </div>
        </window.Card>

        <window.Card className="col-span-12 lg:col-span-5 p-6">
          <h3 className="font-semibold text-base mb-1">컴플라이언스</h3>
          <div className="text-xs text-slate-500 mb-4">개인정보보호법 · 전자문서법 준수</div>
          <div className="space-y-2.5">
            {[
              { label: '발송 동의 확인', detail: '2025-11-12 수신자 동의 (kakao_consent_v3)', ok: true },
              { label: '개인정보 마스킹', detail: '운영자 화면: 010-3318-**** 표시', ok: true },
              { label: '전자서명 검증', detail: 'RSA-4096 · 검증키 만료 2027-08-14', ok: true },
              { label: 'PDF 보존 완료', detail: 'S3 Object Lock · 90일 (~ 2026-07-25)', ok: true },
              { label: '감사 로그 생성', detail: '6개 이벤트 · 무결성 해시 OK', ok: true },
            ].map((c, i) => (
              <div key={i} className="flex items-start gap-3 p-2 rounded bg-emerald-500/[0.04] border border-emerald-500/20">
                <window.Icon name="check" className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-slate-200">{c.label}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{c.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </window.Card>
      </div>
    </div>
  );
}

window.DispatchDetail = DispatchDetail;
