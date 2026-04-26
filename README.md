# 레퍼런스 UI · 위시켓 #154865

고지서 및 납부확인서 PDF 생성·다채널 발송 관리 시스템 지원용 레퍼런스 UI.

## 구성

| 파일 | 역할 |
|---|---|
| `index.html` | 단일 페이지 스크롤 사이트 (11섹션, 1,476줄) |
| `styles.css` | 커스텀 CSS (Tailwind CDN 보완) |
| `client.js` | 인터랙션 (Chart.js, ⌘K, ROI, 챗봇) |
| `data.json` | 추출·구조화된 프로젝트 데이터 (재생성·검증용) |

## 11개 섹션

1. **Header + Hero** — 프로젝트 메타 + 핵심 메시지
2. **Hero Insights** — Top 3 확인사항 (Oracle 접근, 규모·즉시, 알림톡)
3. **CORE** — 원클릭 발송 플로우 (조회 → PDF → 3채널 → 이력)
4. **DASHBOARD** — 발송 현황 KPI + 7일 추이 + 채널 비중 + 최근 이력
5. **ENGINE** — 발송 정책 엔진 (레이더 차트 + 정책 해설)
6. **OPERATOR** — 관리자 패널 + 월 비용 시뮬레이터
7. **INSIGHTS** ★ — 모호 Top 3 + 누락 12건 (경쟁자 없는 섹션)
8. **QUESTIONS** ★ — 10개 🔴 필수 질의 아코디언
9. **RISKS** ★ — 15개 리스크 매트릭스 + Top 5
10. **ARCHITECTURE** ★ — 다이어그램 + Stack + ADR 3건 + Java 코드 스니펫
11. **TIMELINE** ★ — 14주 Gantt + 5개 마일스톤
12. **WHY-US** — 7개 차별화 포인트 비교표
13. **CTA** — ROI 계산기 + Cal.com / Loom / 챗봇

★ = 경쟁 지원자 16명에게 없는 차별화 섹션.

## 로컬 확인

```bash
cd /Users/luna/projects/wishket/pdf-154865/my/output/project-analysis/154865-고지서PDF발송시스템/refui
python3 -m http.server 8080
# http://localhost:8080
```

또는 `open index.html`로 브라우저에서 직접 열기 (Chart.js CDN 로드를 위해 인터넷 필요).

## 인터랙션

| 기능 | 조작 |
|---|---|
| 섹션 검색 | `⌘K` (macOS) 또는 `Ctrl+K` |
| 리스크 상세 | 매트릭스 점 클릭 → 오른쪽 Side Panel |
| 비용 시뮬 | OPERATOR 섹션 슬라이더 (알림톡/팩스 건수) |
| ROI 계산 | CTA 섹션 슬라이더 (월 발송 건수) |
| 챗봇 | 우하단 보라색 버튼 (오라클/알림톡/예산 등 키워드) |

## 재생성

`1_요구사항검토서.md` 등 원본 MD 수정 후 스킬 재실행:
```bash
/wishket-refui 154865-고지서PDF발송시스템
```

## 배포

### GitHub Pages
```bash
gh repo create refui-154865 --public --source=. --remote=origin --push
gh api -X POST /repos/{owner}/refui-154865/pages -f source[branch]=main -f source[path]=/
# URL: https://{owner}.github.io/refui-154865/
```

### Vercel
```bash
pnpm i -g vercel
vercel --prod
```

## 라이선스 / 의존성 CDN

- Tailwind CSS (CDN JIT) — MIT
- Chart.js 4.4 — MIT
- Lucide Icons — ISC
- Prism.js — MIT
- Inter · JetBrains Mono (Google Fonts) — OFL

---

생성: 2026-04-25 · skill: wishket-refui v1 · source: project-analysis/154865-고지서PDF발송시스템
