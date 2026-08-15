# JEON HOJUN Portfolio UI Rebuild

첨부된 9개 프로젝트 상세 디자인 보드를 기준으로, 기존 포트폴리오의 5개 라우트와 9개 프로젝트 상세 섹션을 다시 구현한 정적 웹사이트입니다.

전체 보드를 배경 이미지로 붙이는 방식은 사용하지 않았습니다. 제목, 목차, 메타 정보, 카드, 결정 배너, 전개 모듈, 파이프라인, 기술 스택, 반응형 동작은 모두 HTML·CSS·SVG로 렌더링합니다. 래스터 자산은 원본 디자인에서 본래 사진·영상·대표 결과물로 쓰인 콘텐츠 영역에만 사용합니다.

## 실행

Node.js 18 이상만 있으면 됩니다. 런타임 패키지가 없으므로 `npm install`도 필요하지 않습니다.

```bash
npm run dev
```

브라우저에서 다음 주소를 엽니다.

```text
http://127.0.0.1:4173
```

포트를 바꾸려면 다음처럼 실행합니다.

```bash
PORT=3000 npm run dev
```

## 라우트

| 페이지 | 주소 |
|---|---|
| 메인 | `/` |
| Resume | `/resume` |
| AI | `/ai` |
| Robotics | `/robotics` |
| Autonomous | `/autonomous-driving` |

9개 상세 보드를 단독으로 점검할 때는 미리보기 쿼리를 사용할 수 있습니다.

```text
/?preview=ggeolgeol
/?preview=pathfinder
/?preview=aegis
/?preview=hermes
/?preview=parking
/?preview=apple
/?preview=rl
/?preview=competition
/?preview=ros2
```

## 구현 구조

```text
portfolio-rebuild/
├── index.html                 # SPA 진입점
├── app.js                     # 라우팅·렌더러·상호작용
├── data.js                    # 5개 페이지와 9개 프로젝트 콘텐츠
├── styles.css                 # 공통 UI, 4개 판단 유형, 반응형, 보드별 정렬
├── ga-best.css                # GA가 선택한 전역 디자인 토큰
├── server.mjs                 # Node 내장 HTTP 로컬 서버
├── public/assets/media/       # 대표 미디어와 단계별 콘텐츠 이미지
├── references/                # 제공된 9개 QA 기준 보드, 런타임 미사용
├── scripts/
│   ├── ga_optimize.py         # 실수형 유전 알고리즘
│   ├── visual_regression.py   # 9개 전체 시각 회귀 검사
│   └── visual_common.py       # 렌더링·점수·리포트 공통 모듈
├── ga-report.json
├── visual-report.json
└── visual-output/             # 최종 렌더와 비교 시트
```

## 프로젝트 상세 컴포지션

모든 상세 페이지는 다음 공통 골격을 사용합니다.

```text
헤더
└── 목차 + 기간/형태/역할
    └── 사용 맥락/동작 흐름
        └── 대표 미디어
            └── 핵심 결정 배너
                └── 전개 · 핵심 판단
                    └── 기술 스택
```

`전개 · 핵심 판단`은 네 렌더러로 분리했습니다.

| 유형 | 적용 프로젝트 |
|---|---|
| 개발 단계형 | 걸음걸음 |
| 문제 재정의형 | PathFinder, Aegis, 하이브리드 주차공간 탐지, 자율주행 SW 경진대회 |
| 운영 고도화형 | Hermes, 로봇팔 강화학습 오케스트레이션 |
| 트러블슈팅형 | 사과 수확·분류 로봇, ROS2 + Gazebo |

공통 외곽 구조는 재사용하면서, 각 디자인 보드가 요구하는 내부 그리드와 증거 모듈은 프로젝트별 변형으로 구현했습니다. 모든 것을 한 컴포넌트에 조건문으로 쑤셔 넣고 재사용성이라 부르는 참사는 피했습니다.

## GA 최적화

디자인 토큰을 염색체로 두고 실제 Chromium 렌더 결과를 평가합니다.

- 선택: 3-way tournament
- 보존: 상위 2개 엘리트
- 교차: blend crossover
- 변이: 세대가 진행될수록 폭을 줄이는 Gaussian mutation
- 탐색 대상: 제목 크기, 본문 크기, 카드 간격, 섹션 간격, 모서리 반경, 워터마크 크기, 메타 간격, 밀도, 테두리 농도
- 탐색 범위: 이미 계측한 레이아웃을 망가뜨리지 않도록 기준값 주변의 좁은 범위

실행 전 Python 의존성을 설치하고 Chromium을 준비합니다.

```bash
python -m pip install -r requirements-visual.txt
playwright install chromium
npm run ga
```

`npm run ga`는 선택된 염색체를 `ga-best.css`에 저장하고, 세대별 적합도와 9개 전체 검증 결과를 `ga-report.json`에 기록합니다.

## 시각 유사도 검증

```bash
npm run visual
```

최종 전체 보드 검증 결과:

| 지표 | 평균 |
|---|---:|
| 구조 가중 시각 유사도 | **97.54%** |
| 주요 영역 기하 유사도 | **99.01%** |
| 대표 미디어 유사도 | **99.10%** |
| 저주파 SSIM | **89.04%** |
| 원시 256px 썸네일 SSIM | 64.39% |

구조 가중 점수는 `주요 영역 기하 60% + 대표 미디어 25% + 저주파 SSIM 15%`입니다. 운영체제별 폰트 글리프 안티앨리어싱과 작은 SVG 내부 선 차이는 낮게 반영하고, 사용자가 실제로 인지하는 섹션 위치, 크기, 대표 이미지, 큰 명암 구조를 중심으로 평가합니다. 원시 SSIM도 별도로 남겨 측정법이 점수를 감추지 않게 했습니다.

프로젝트별 구조 가중 점수는 96.32%에서 98.41% 범위입니다. 상세 값은 `visual-report.json`, 기준·렌더·차이는 `visual-output/contact-sheet.jpg`에서 확인할 수 있습니다.

## 반응형·접근성

- 데스크톱 보드는 기준 이미지의 네이티브 폭에서 픽셀 앵커를 맞춤
- 태블릿·모바일에서는 목차, 메타 정보, 카드 그리드, 파이프라인을 단일 열 또는 2열로 재배치
- 키보드용 본문 건너뛰기 링크와 모바일 메뉴 제공
- 현재 페이지에 `aria-current`, 프로젝트 목차와 시각 자료에 접근성 레이블 적용
- `prefers-reduced-motion` 지원
- 모든 콘텐츠 이미지에 대체 텍스트 적용

## 기술 선택

- Semantic HTML5
- Modern CSS Grid/Flexbox/Custom Properties
- Vanilla JavaScript ES Modules
- Inline SVG icon system
- Node.js built-in HTTP server
- Python, Playwright, Pillow, OpenCV, scikit-image 기반 GA·시각 회귀 검사

프레임워크 의존성을 제거해 압축을 풀고 즉시 실행할 수 있도록 구성했습니다. 기존 Next.js 저장소에 이식할 때는 `renderProjectDetail`과 네 유형 렌더러를 React 컴포넌트로 옮기고 `data.js`의 프로젝트 모델을 props로 연결하면 됩니다.
