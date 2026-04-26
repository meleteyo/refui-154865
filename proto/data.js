// Mock data — Oracle 조회 결과를 모방
const MOCK_TARGETS = [
  { customerNo: "C-00142", name: "박민수", amount: 125000, dueDate: "2026-04-20", status: "미납", email: null, mobile: "010-2841-9931", fax: null, invoiceNo: "INV-20260401-142" },
  { customerNo: "C-00143", name: "김철수", amount: 88500, dueDate: "2026-04-20", status: "미납", email: "kim.cs@daejin.co.kr", mobile: "010-9924-1187", fax: "062-571-0034", invoiceNo: "INV-20260401-143" },
  { customerNo: "C-00144", name: "이영희", amount: 245000, dueDate: "2026-04-20", status: "납부완료", email: "lyh@nuri.io", mobile: "010-3318-7724", fax: null, invoiceNo: "INV-20260401-144" },
  { customerNo: "C-00145", name: "정수민", amount: 67200, dueDate: "2026-04-20", status: "미납", email: "soomin@hk.ac.kr", mobile: "010-4471-2293", fax: null, invoiceNo: "INV-20260401-145" },
  { customerNo: "C-00146", name: "최지호", amount: 312500, dueDate: "2026-04-20", status: "미납", email: "jiho.choi@bk-eng.co.kr", mobile: null, fax: "062-411-0028", invoiceNo: "INV-20260401-146" },
  { customerNo: "C-00147", name: "강민서", amount: 98000, dueDate: "2026-04-20", status: "납부완료", email: "minseo.k@gmail.com", mobile: "010-6628-5547", fax: null, invoiceNo: "INV-20260401-147" },
  { customerNo: "C-00148", name: "윤재현", amount: 156800, dueDate: "2026-04-20", status: "미납", email: "jhyoon@dawon.kr", mobile: "010-2174-9802", fax: null, invoiceNo: "INV-20260401-148" },
  { customerNo: "C-00149", name: "한도윤", amount: 220000, dueDate: "2026-04-20", status: "미납", email: "han.dy@hns.co.kr", mobile: "010-7723-1290", fax: "062-201-9981", invoiceNo: "INV-20260401-149" },
  { customerNo: "C-00150", name: "오세린", amount: 73400, dueDate: "2026-04-20", status: "납부완료", email: "serin.oh@apex.kr", mobile: "010-1148-2237", fax: null, invoiceNo: "INV-20260401-150" },
  { customerNo: "C-00151", name: "서지안", amount: 184500, dueDate: "2026-04-20", status: "미납", email: null, mobile: "010-9913-8741", fax: null, invoiceNo: "INV-20260401-151" },
  { customerNo: "C-00152", name: "임태호", amount: 45000, dueDate: "2026-04-20", status: "미납", email: "th.lim@nb.co.kr", mobile: "010-5547-1129", fax: null, invoiceNo: "INV-20260401-152" },
  { customerNo: "C-00153", name: "조하늘", amount: 137200, dueDate: "2026-04-20", status: "납부완료", email: "haneul@artz.io", mobile: "010-2284-7716", fax: null, invoiceNo: "INV-20260401-153" },
];

const MOCK_HISTORY = [
  { id: "DR-3984", time: "14:23:15", customer: "이영희", customerNo: "C-00144", doc: "납부확인서", channel: "KAKAO", status: "SUCCESS", delivered: "14:23:16", reason: null, msgId: "kkt_84afb29e" },
  { id: "DR-3983", time: "14:22:58", customer: "김철수", customerNo: "C-00143", doc: "고지서", channel: "EMAIL", status: "SUCCESS", delivered: "14:23:01", reason: null, msgId: "ses_71290cba" },
  { id: "DR-3982", time: "14:20:42", customer: "박민수", customerNo: "C-00142", doc: "고지서", channel: "FAX", status: "FAILED", delivered: null, reason: "팩스번호 없음", msgId: null },
  { id: "DR-3981", time: "14:20:45", customer: "박민수", customerNo: "C-00142", doc: "고지서", channel: "EMAIL", status: "SUCCESS", delivered: "14:20:48", reason: null, msgId: "ses_71290cb9", fallback: true },
  { id: "DR-3980", time: "14:18:03", customer: "정수민", customerNo: "C-00145", doc: "납부확인서", channel: "KAKAO", status: "SUCCESS", delivered: "14:18:04", reason: null, msgId: "kkt_84afb29d" },
  { id: "DR-3979", time: "14:15:21", customer: "최지호", customerNo: "C-00146", doc: "고지서", channel: "FAX", status: "SUCCESS", delivered: "14:15:43", reason: null, msgId: "fax_92301a" },
  { id: "DR-3978", time: "14:11:09", customer: "강민서", customerNo: "C-00147", doc: "납부확인서", channel: "KAKAO", status: "SUCCESS", delivered: "14:11:10", reason: null, msgId: "kkt_84afb29c" },
  { id: "DR-3977", time: "14:08:54", customer: "윤재현", customerNo: "C-00148", doc: "고지서", channel: "EMAIL", status: "FAILED", delivered: null, reason: "메일박스 가득참 (bounce)", msgId: "ses_bounced01" },
  { id: "DR-3976", time: "14:05:12", customer: "한도윤", customerNo: "C-00149", doc: "고지서", channel: "KAKAO", status: "SUCCESS", delivered: "14:05:13", reason: null, msgId: "kkt_84afb29b" },
  { id: "DR-3975", time: "14:01:38", customer: "오세린", customerNo: "C-00150", doc: "납부확인서", channel: "EMAIL", status: "SUCCESS", delivered: "14:01:41", reason: null, msgId: "ses_71290cb7" },
];

const TEMPLATES = [
  { id: "TMPL-01", type: "BILL", name: "고지서 A형 (2026 신규)", version: "v2.1", active: true },
  { id: "TMPL-02", type: "BILL", name: "고지서 B형 (연체 독촉)", version: "v1.4", active: true },
  { id: "TMPL-03", type: "RECEIPT", name: "납부확인서 표준형", version: "v2.1", active: true },
  { id: "TMPL-04", type: "RECEIPT", name: "납부확인서 간소형", version: "v1.0", active: false },
];

const TREND_7D = [847, 1024, 1289, 967, 1102, 1413, 1179];
const CHANNEL_TODAY = { KAKAO: 142, EMAIL: 78, FAX: 27 };

window.MOCK_TARGETS = MOCK_TARGETS;
window.MOCK_HISTORY = MOCK_HISTORY;
window.TEMPLATES = TEMPLATES;
window.TREND_7D = TREND_7D;
window.CHANNEL_TODAY = CHANNEL_TODAY;
