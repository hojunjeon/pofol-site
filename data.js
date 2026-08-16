export const routes = [
  { href: "/", label: "Hub", key: "home" },
  { href: "/resume", label: "Resume", key: "resume" },
  { href: "/ai", label: "AI", key: "ai" },
  { href: "/robotics", label: "Robotics", key: "robotics" },
  { href: "/autonomous-driving", label: "Autonomous", key: "autonomous" },
];

const referenceMedia = (path) => `./public/${path}`;
const strategyMedia = (name) => `./public/assets/generated/strategy/${name}.png`;

export const projects = {
  ggeolgeol: {
    slug: "ggeolgeol",
    domain: "autonomous",
    index: "01",
    eyebrow: "01 / 걸음걸음 · 개발 단계형",
    title: "걸음걸음 — 점자블록 주행 로봇",
    summary: "점자 블록 손상으로 인해 생기는 어려움을 해결하는 자율주행 점자블록 손상 탐지 E2E 서비스",
    facts: [
      { icon: "calendar", label: "기간", value: "2026.07–08" },
      { icon: "team", label: "형태", value: "SSAFY 공통 프로젝트(팀)" },
      { icon: "person", label: "역할", value: "팀장 · HW/제어·ROS2 통합" },
    ],
    primer: {
      context: "점자 블록 손상으로 인해 문제를 겪는 시각 장애인과 지자체 유지보수 관리자를 돕기 위한 자율주행 로봇",
      flow: "정해진 순찰 루트 자율주행 → 점자블록 이미지 촬영 → 서버 VLM 손상 판독 → 관리자용 대시보드 데이터",
      flowTone: "orange",
    },
    primary: {
      src: referenceMedia("evidence/autonomous/ggeolgeol/ggeolgeol-driving-8x.gif"),
      alt: "걸음걸음 로봇이 점자블록 옆을 주행하는 실제 주행 장면",
    },
    decision: [
      { text: "일반 보도블록 구간도 달려야 해서" },
      { text: "일반 보도블록 주행 모드", accent: true },
      { text: "를 추가하고 점자블록 주행 모드와" },
      { text: "라우팅", accent: true },
      { text: "했습니다." },
    ],
    type: "development",
    strategy: {
      lead: {
        label: "개발 전개",
        title: "점자블록 구간만 따라가면 전체 순찰 루트를 달릴 수 없었습니다.",
        text: "일반 보도블록 구간도 달려야 해서 일반 보도블록 주행 모드를 추가하고 점자블록 주행 모드와 라우팅했습니다.",
      },
      contract: {
        label: "공통 주행 계약",
        text: "모드가 달라도 카메라 입력·경로 계산·안전 출력을 같은 흐름으로 이어, 구간에 따라 주행 조건만 바꾸도록 정리했습니다.",
        steps: [
          ["입력", "camera geometry", "camera"],
          ["판단", "offset path", "route"],
          ["출력", "safety target", "shield"],
        ],
      },
      artifact: {
        label: "signature artifact · mode routing",
        text: "점자블록·일반 보도·장애물 모드가 각자의 판단을 거쳐 하나의 주행 계약으로 합류합니다.",
        src: strategyMedia("ggeolgeol-mode-routing-v2"),
        alt: "세 가지 주행 모드의 경로가 하나의 안전한 주행 계약으로 합류하는 개념 이미지",
      },
      modes: [
        { index: "01", title: "점자블록 주행", text: "점자블록을 따라 옆으로 offset 경로를 유지하며 순찰합니다.", src: strategyMedia("ggeolgeol-mode-tactile") },
        { index: "02", title: "일반 보도블록 주행", text: "점자블록이 없는 일반 보도블록 구간에서는 일반 경로로 순찰합니다.", src: strategyMedia("ggeolgeol-mode-general") },
        { index: "03", title: "장애물 회피", text: "주행 경로 앞 장애물을 만나면 안전하게 멈추거나 우회할 수 있도록 별도 모드로 검토합니다.", src: strategyMedia("ggeolgeol-mode-obstacle"), tone: "orange" },
      ],
    },
    tech: ["ROS 2", "Python", "OpenCV", "Camera geometry", "Offset path", "Safety target", "Static contract"],
  },

  pathfinder: {
    slug: "pathfinder",
    domain: "ai",
    index: "01",
    eyebrow: "01 / PathFinder · 관계 연결 전환",
    title: "PathFinder",
    summary: "서류 합격 뒤 이력과 회사 요구를 연결해 면접 준비 순서를 제안하는 팀 웹 서비스",
    facts: [
      { icon: "calendar", label: "기간", value: "2026.05" },
      { icon: "team", label: "형태", value: "SSAFY 관통 프로젝트(팀)" },
      { icon: "person", label: "역할", value: "백엔드·AI 서버(LLM·GraphRAG)" },
    ],
    primer: {
      context: "채용 공고와 내 이력을 바탕으로 취업 준비 순서를 정할 때 사용합니다.",
      flow: "공고 · 프로필 · 자소서를 넣으면 관련 정보를 묶고, 역량 차이 · 예상 질문 · 준비 순서를 보여줍니다.",
      flowTone: "orange",
    },
    primary: {
      src: referenceMedia("generated/pathfinder-explain.png"),
      alt: "채용 공고, 이력, 관계 그래프와 면접 준비 로드맵을 연결한 PathFinder 대표 화면",
    },
    decision: [
      { text: "입력을 더 넣는 대신," },
      { text: "관계를 연결", accent: true },
      { text: "했습니다." },
      { text: "그래서 근거 있는 인사이트와 다음 행동이 더 선명해졌습니다.", sub: true },
    ],
    type: "reframe",
    layout: "pathfinder",
    strategy: {
      before: {
        index: "01",
        label: "막힌 지점",
        title: "입력을 따로 넘기면, 일반적인 조언이 반복됐습니다.",
        text: "공고 · 이력 · 자소서가 서로 연결되지 않아 근거와 다음 행동이 흐려졌습니다.",
      },
      after: {
        index: "02",
        label: "바꾼 판단",
        title: "기업·사업·제품·운영·직무·역량을 관계로 묶었습니다.",
        text: "관계 중심으로 연결하니 맥락이 살아나고, 준비 순서가 명확해졌습니다.",
      },
      artifact: {
        index: "03",
        label: "시그니처 아티팩트",
        title: "관계 기반 준비 로드맵 생성 흐름",
        flow: [
          ["입력 데이터", "공고·이력·자소서", "document"],
          ["관계 연결", "GraphRAG", "graph"],
          ["LLM 생성", "인사이트·질문", "spark"],
          ["필드 검증", "사실성·완결성", "verify"],
          ["면접 준비 로드맵", "다음 행동", "file"],
        ],
        outcomes: [
          ["관계 기반 검색", "연결 정도 기반 탐색으로 핵심 맥락만 빠르게 찾습니다.", "search"],
          ["필드 검증", "사실성·완결성 검증으로 신뢰도 높은 결과를 보장합니다.", "shield"],
          ["다음 행동 제안", "역량 격차와 중요도에 따라 준비 순서를 제안합니다.", "target"],
        ],
      },
    },
    tech: ["FastAPI", "GraphRAG", "LLM pipeline", "Django REST Framework", "Vue.js", "SQL", "Playwright"],
  },

  aegis: {
    slug: "aegis",
    domain: "ai",
    index: "02",
    eyebrow: "02 / Aegis · 문제 재정의",
    title: "Aegis (Sentinel-30)",
    summary: "보이스피싱 통화 단서를 검토 가능한 JSON 위험정보 이벤트로 만드는 로컬 전용 PoC",
    facts: [
      { icon: "calendar", label: "기간", value: "2026.05" },
      { icon: "team", label: "형태", value: "SSAFY×Kakao AI 해커톤(팀)" },
      { icon: "person", label: "역할", value: "정보 추출 엔진 설계 및 테스트" },
    ],
    primer: {
      context: "보이스피싱 신호를 포착해 수사 및 서비스 개선을 위한 데이터로 정리하는 흐름을 가정합니다.",
      flow: "사기범 대화를 STT로 전사하고 미끼봇 오케스트레이션으로 위험정보를 추출하면서 다음 대화 텍스트를 생성합니다.",
      flowTone: "orange",
    },
    primary: {
      src: referenceMedia("generated/aegis-stt-event-profile.png"),
      alt: "통화 STT, 추출된 JSON 위험정보 이벤트, 검토 대시보드로 이어지는 Aegis 대표 화면",
    },
    decision: [
      { text: "차단 대신, 수사 검토를 위한" },
      { text: "데이터", accent: true },
      { text: "를 남기기로 했습니다." },
    ],
    type: "reframe",
    layout: "aegis",
    strategy: {
      before: { label: "기존 보이스피싱 대응 서비스", title: "번호 차단", text: "통화는 끝나지만 위험 신호와 맥락도 함께 사라집니다." },
      after: { label: "문제 재정의", title: "통화 유지 · 위험정보 추출", text: "대화 단서를 구조화 이벤트로 남기고 사람이 검토할 수 있게 했습니다." },
      roles: [
        { label: "Orchestrator", title: "대화 흐름 조정", text: "미끼봇 전략에 따라 대화 흐름을 설계하고 다음 발화를 생성해 통화를 유지합니다.", icon: "orchestrator" },
        { label: "Extractor", title: "위험 단서 구조화", text: "대화에서 위험 신호를 탐지하고 JSON 이벤트로 구조화합니다.", icon: "extract" },
        { label: "Verifier", title: "근거와 마스킹 재검토", text: "추출 결과의 근거 구간을 확인하고 개인정보 마스킹을 검증합니다.", icon: "shield" },
      ],
      flow: [
        ["통화 · 미끼봇 대화", "실시간 음성/텍스트", "phone"],
        ["Orchestrator", "대화 흐름 조정", "orchestrator"],
        ["Extractor", "위험 단서 구조화", "document"],
        ["Verifier", "근거 확인·마스킹", "shield"],
        ["JSON 위험정보 이벤트 + 검토 화면", "검토 가능한 데이터", "dashboard"],
      ],
    },
    tech: ["LLM", "STT", "JSON Schema", "Orchestrator", "Extractor", "Verifier", "Dashboard"],
  },

  hermes: {
    slug: "hermes",
    domain: "ai",
    index: "03",
    eyebrow: "03 / Hermes · 운영 고도화",
    title: "상시 운영형 Hermes 에이전트",
    summary: "Telegram에서 받은 개인 업무를 실행하고 결과를 기록하는 개인용 AI 비서 시스템",
    facts: [
      { icon: "calendar", label: "기간", value: "2026" },
      { icon: "team", label: "형태", value: "개인 프로젝트" },
      { icon: "person", label: "역할", value: "시스템 설계·운영" },
    ],
    primer: {
      context: "메신저로 개인 할 일을 보내거나 정해진 시간에 작업을 시작하는 개인용 비서 흐름입니다.",
      flow: "작업을 받으면 역할과 상태를 나눠 실행하고, 결과물을 확인한 뒤 Telegram과 Notion에 기록합니다.",
      flowTone: "ink",
    },
    primary: {
      src: referenceMedia("generated/hermes-role-map.png"),
      alt: "Human, Telegram, Hermes, EPE, Diki, Apostles와 Notion을 연결한 시스템 구성도",
    },
    decision: [
      { text: "운영에서 생긴 순서 충돌을" },
      { text: "상태·기억·기록", accent: true },
      { text: "의 세 경계로 풀었습니다." },
    ],
    decisionDark: true,
    type: "operations",
    layout: "hermes",
    strategy: {
      stages: [
        { index: "01", label: "문제 포착", title: "planner · executor 순서 충돌", text: "작업 시작과 실행이 뒤섞이며 중복·누락 발생" },
        { index: "02", label: "상태 통제", title: "Kanban으로 완료 조건 고정", text: "진행·차단·완료 상태로 순서와 책임을 명확화" },
        { index: "03", label: "기억 분리", title: "Honcho로 역할별 문맥 분리", text: "역할별 기억을 분리해 혼선과 간섭을 최소화" },
        { index: "04", label: "기록 자동화", title: "Recording Harness → Notion", text: "승인된 결과물을 구조화해 Notion에 자동 기록" },
      ],
      flow: [
        ["Telegram 작업 입력", "자연어·파일·링크", "telegram"],
        ["Kanban 상태", "진행·차단·완료", "kanban"],
        ["Honcho 역할별 기억", "EPE·Diki·Apostles", "brain"],
        ["승인 산출물", "검증·승인", "verify"],
        ["Notion 기록", "페이지·데이터베이스", "notion"],
      ],
    },
    tech: ["Hermes Agent", "Telegram Bot", "Oracle Cloud", "Kanban", "Honcho", "cron", "n8n", "Notion"],
  },

  parking: {
    slug: "parking",
    domain: "ai",
    index: "04",
    eyebrow: "04 / Hybrid parking AI · 판단 단위 분리",
    title: "하이브리드 주차공간 탐지",
    summary: "주행 가능 영역·주차면·장애물을 한 장면에서 구분하는 하이브리드 컴퓨터비전 프로젝트",
    facts: [
      { icon: "calendar", label: "기간", value: "2025.05" },
      { icon: "team", label: "형태", value: "팀 프로젝트" },
      { icon: "person", label: "역할", value: "모델 아키텍처 설계·데이터 전처리 파이프라인" },
    ],
    primer: {
      context: "도로 영상에서 주행 가능 영역과 주차면, 장애물을 나눠 보는 장면에 사용합니다.",
      flow: "영상과 라벨을 정리한 뒤 영역 분할과 객체 탐지를 따로 실행하고, 두 결과를 한 화면에 합칩니다.",
      flowTone: "teal",
    },
    primary: {
      src: referenceMedia("evidence/ai/parking-segmentation.png"),
      alt: "도로 영상에 주행 가능 영역, 주차면, 장애물 결과가 표시된 하이브리드 주차공간 탐지 결과",
    },
    decision: [
      { text: "하나의 모델 대신," },
      { text: "판단 단위", accent: true },
      { text: "로 나눴습니다." },
    ],
    type: "reframe",
    layout: "parking",
    strategy: {
      symptom: { label: "관찰한 증상", title: "YOLOv8-seg 단일 모델은 야간·역광에서 흔들렸습니다.", text: "픽셀 경계(영역)와 주차면·장애물 객체 위치를 한 모델의 판단으로 묶은 것이 문제였습니다." },
      change: { label: "바꾼 구조", title: "영역 분할과 객체 탐지를 병렬로 처리했습니다.", branches: [
        ["영역 판단", "SegFormer", "픽셀 단위로 주행 가능 영역과 주차면을 정확히 분할", "grid"],
        ["객체 판단", "YOLOv11", "객체의 위치·크기·클래스를 안정적으로 탐지", "cube"],
      ] },
      effects: ["야간·역광 환경에서 안정성 향상", "주차면 경계의 연속성 개선", "객체 위치 정밀도 향상", "유지보수와 모델 교체 용이"],
      pipeline: [
        ["입력 · EDA", "영상 수집·정제·라벨", "camera"],
        ["SegFormer 영역 분할", "병렬 처리", "grid", strategyMedia("parking-segformer")],
        ["YOLOv11 객체 탐지", "병렬 처리", "cube", strategyMedia("parking-yolov11")],
        ["argmax 결합", "우선순위 규칙으로 합성", "layers"],
        ["최종 화면", "영역·주차면·장애물", "image", strategyMedia("parking-fusion")],
      ],
    },
    tech: ["SegFormer", "YOLOv11", "YOLOv8-seg", "OpenCV", "Python", "AIHub dataset"],
  },

  apple: {
    slug: "apple",
    domain: "robotics",
    index: "01",
    eyebrow: "01 / Troubleshooting · Edge pipeline",
    title: "사과 수확·분류 Edge AI 로봇",
    summary: "카메라로 사과 위치를 찾고 로봇팔 수확과 Load Cell 분류로 잇는 임베디드 Edge AI 시스템",
    facts: [
      { icon: "calendar", label: "기간", value: "2023.07–2024.07" },
      { icon: "team", label: "형태", value: "학부 졸업작품(팀)" },
      { icon: "person", label: "역할", value: "제어 알고리즘·SW/HW 통합" },
    ],
    primer: {
      context: "농촌의 고령화와 인력난에 대응하려고 과수원에서 사과를 인식하고 수확부터 분류까지 자동화하는 Edge AI 로봇을 만들었습니다.",
      flow: "카메라가 사과 위치를 찾으면 로봇팔이 움직이고, 마지막에 무게를 재어 분류 결과를 냅니다.",
      flowTone: "blue",
      contextTone: "green",
    },
    primary: {
      src: referenceMedia("evidence/robotics/apple-robot-platform.png"),
      alt: "과수원에서 사과를 수확하고 Load Cell로 분류하는 이동형 Edge AI 로봇",
    },
    decision: [
      { text: "목표점에서 멈추지 못했습니다." },
      { text: "HW·SW를 따로 손봐도" },
      { text: "진동과 오버슈트", accent: true, accentTone: "green" },
      { text: "가 남았습니다." },
    ],
    type: "troubleshooting",
    layout: "apple",
    strategy: {
      issue: { label: "문제가 보인 곳", title: "목표점 직전의 오버슈트와 진동", text: "수확 위치 접근 시 잔진동으로 과다 보정이 반복되어 목표점을 정확히 멈추지 못했습니다.", rows: [
        ["증상", "목표점 직전 오버슈트 0.5~1.2 cm", "target"],
        ["확인", "진동 스펙트럼 3~8 Hz 피크 확인", "bell"],
        ["판단", "접근 속도·제어 주기·경계 조건의 복합 원인", "split"],
      ] },
      changes: [
        { index: "01", label: "접근 속도", text: "거리 기반 가변 속도 프로파일로 감속 전환점을 앞당겨 관성 오버슈트를 줄였습니다.", visual: "curve" },
        { index: "02", label: "신호 주기", text: "카메라 위치→추론→제어 주기를 동기화하고 지연 보정으로 루프 위상을 안정화했습니다.", visual: "loop" },
        { index: "03", label: "모듈 경계", text: "감지·제어·모터 드라이버 경계를 명확히 하고 명령 제한으로 진동 전이를 차단했습니다.", visual: "modules" },
      ],
      scenarios: [
        ["01", "과수원 인식", strategyMedia("apple-step-1")],
        ["02", "사과 검출", strategyMedia("apple-step-2")],
        ["03", "목표점 접근", strategyMedia("apple-step-3")],
        ["04", "제어 루프", strategyMedia("apple-step-4")],
        ["05", "로봇팔 수확", strategyMedia("apple-step-5")],
        ["06", "Load Cell 분류", strategyMedia("apple-step-6")],
      ],
    },
    tech: ["YOLOv5", "RealSense D415", "Raspberry Pi", "Arduino", "Dynamixel", "Load Cell", "UART"],
  },

  rl: {
    slug: "rl",
    domain: "robotics",
    index: "02",
    eyebrow: "02 / Operations design · RL orchestration",
    title: "로봇팔 강화학습 오케스트레이션",
    summary: "MuJoCo FetchSideBinPlace-v0 로봇팔 학습을 짧은 실행·checkpoint·검토 단위로 관리하는 실험 하네스",
    facts: [
      { icon: "calendar", label: "기간", value: "2025.06–08" },
      { icon: "team", label: "형태", value: "개인 프로젝트" },
      { icon: "person", label: "역할", value: "동작·실패 조건·오케스트레이션 설계" },
      { icon: "flask", label: "실험 방식", value: "chunk · checkpoint" },
    ],
    primer: {
      context: "로봇팔 제어, 강화학습, AI 활용을 하네스와 반복 루프로 연결해 관심 있던 세 분야를 확장해 본 개인 프로젝트입니다.",
      flow: "하나의 긴 학습을 돌리는 대신, 조건을 고정한 짧은 실행·checkpoint·검토 단위로 다음 실험을 결정합니다.",
      flowTone: "orange",
    },
    primary: {
      src: referenceMedia("evidence/robotics/training-stage-final.gif"),
      alt: "MuJoCo FetchSideBinPlace 환경에서 로봇팔이 물체를 bin으로 옮기는 학습 장면",
    },
    decision: [
      { text: "보상 설계와 epoch별 감시를 반복하는 대신," },
      { text: "역할을 분리", accent: true },
      { text: "하고 checkpoint에서 다음 실험을 고르는" },
      { text: "자동화 루프", accent: true },
      { text: "를 설계했습니다." },
    ],
    type: "operations",
    layout: "rl",
    strategy: {
      issue: { label: "운영에서 막힌 지점", title: "반복 감시와 자기평가를 구조에서 분리했습니다.", rows: [
        ["반복", "긴 학습을 실행하며 모니터링과 튜닝 반복", "repeat"],
        ["위험", "과적합·과도한 튜닝·감시 피로 누적", "warning"],
        ["전환", "짧은 실행 단위로 분리, 역할별 확인과 산출 고정", "switch"],
      ] },
      roles: { label: "역할과 판단을 나눈 구조", title: "Main Orchestrator가 세 역할의 결과를 모았습니다.", items: [
        ["계획·구현", "plan·implement", "repeat", "green"],
        ["독립 테스트", "test", "flask", "purple"],
        ["학습·평가", "train·evaluate", "chart", "orange"],
      ] },
      gates: [
        ["계속", "성과 개선이 확인되어 다음 chunk로 진행", "play", "green"],
        ["수정", "가설·보상·조건을 수정해 다음 실험 설계", "pencil", "orange"],
        ["중단", "개선 없음 또는 실패 지속 시 실험을 종료하고 기록", "stop", "red"],
      ],
      flow: [
        ["목표 정의", "task & metric", "target"],
        ["가설 및 계획", "plan·implement", "list"],
        ["짧은 실행", "train·evaluate", "chart"],
        ["독립 테스트", "test", "flask"],
        ["checkpoint 수집 & 기록", "evidence", "database"],
        ["상태 게이트", "계속·수정·중단", "diamond"],
      ],
    },
    tech: ["MuJoCo", "RL", "Orchestrator", "checkpoint", "plan·implement", "test", "train·evaluate"],
  },

  competition: {
    slug: "competition",
    domain: "autonomous",
    index: "02",
    eyebrow: "02 / 자율주행 SW 경진대회 · 역할 경계형",
    title: "제3회 미래형자동차 자율주행 SW 경진대회",
    summary: "어린이용 전동차를 개조한 Camera/LiDAR 차량이 실내 모사 트랙에서 주행·미션을 수행하는 경진대회",
    facts: [
      { icon: "calendar", label: "기간", value: "2024.05–08" },
      { icon: "team", label: "형태", value: "제3회 미래형자동차 자율주행 SW 경진대회 · Team Tino(한국공학대)" },
      { icon: "person", label: "역할", value: "속도·조향 제어" },
    ],
    primer: {
      context: "어린이용 전동차를 개조한 카메라·LiDAR 차량으로 실내 모사 트랙의 주행·미션을 수행하는 대회입니다.",
      flow: "카메라와 LiDAR 정보를 받아 속도와 조향 값을 정하고, 차량 명령으로 넘기는 역할입니다.",
      flowTone: "orange",
    },
    primary: {
      src: referenceMedia("evidence/autonomous/competition/futurecar-2024-official.png"),
      alt: "제3회 미래형자동차 자율주행 SW 경진대회 공식 포스터",
    },
    decision: [
      { text: "인식 결과가 속도·조향 명령으로 넘어가는" },
      { text: "제어 경계", accent: true },
      { text: "를 맡았습니다." },
    ],
    type: "reframe",
    layout: "competition",
    strategy: {
      lead: { label: "역할 경계", title: "센서 인식을 차량 제어 명령으로 번역하는 구간을 맡았습니다.", text: "인식 모듈과 차량 구동 모듈의 경계에서 안전하고 부드러운 속도·조향 제어를 책임집니다." },
      boundary: [
        ["입력 / Camera · LiDAR", ["전면 카메라 영상", "LiDAR 포인트 클라우드"], "sensors"],
        ["판단 / 속도 · 조향 제어", ["경로 추종 및 곡선 제어", "속도 프로파일 생성"], "steering"],
        ["출력 / 차량 명령", ["조향 명령 (steering)", "속도 명령 (velocity)"], "car"],
      ],
      missions: [
        ["주행", "라인 추종, 곡선 주행, 정지선 등 기본 주행 과제를 수행", "road"],
        ["미션", "신호등 인식, 장애물 회피, 주차 등 미션 과제 수행", "flag"],
        ["안전", "비상 정지, 속도 제한, 장애물 보호 구역으로 안전 확보", "shield"],
      ],
      pipeline: [
        ["센서", "Camera · LiDAR", "sensors"],
        ["인식 모듈", "객체 검출 · 포인트 클라우드", "vision"],
        ["제어 경계 (내 역할)", "경로 추종 · 속도 계획", "steering"],
        ["차량 명령 변환", "steering · velocity", "convert"],
        ["차량 구동", "steering cmd · velocity cmd", "car"],
      ],
    },
    tech: ["ROS", "OpenCV", "LiDAR", "초음파 센서", "Camera"],
  },

  ros2: {
    slug: "ros2",
    domain: "autonomous",
    index: "03",
    eyebrow: "03 / ROS2 + Gazebo · 트러블슈팅형",
    title: "ROS2 + Gazebo 자율주행 시뮬레이션",
    summary: "ROS2 Foxy·Gazebo Classic에서 차선·신호·표지판·보행자 시나리오를 통합하고 차간거리 분기를 조정 중인 자율주행 시뮬레이션",
    facts: [
      { icon: "calendar", label: "기간", value: "2025.07–08" },
      { icon: "team", label: "형태", value: "팀 프로젝트(앨리스 자율주행 트랙)" },
      { icon: "person", label: "역할", value: "통합 제어 알고리즘·ROS2 노드 아키텍처" },
    ],
    primer: {
      context: "Ubuntu 20.04 Docker에서 Gazebo 시나리오를 돌리며 원인을 나누는 작업입니다.",
      flow: "카메라·LiDAR와 주변 상황을 기능별 노드로 나누고, Drive_Bot이 Ackermann 명령으로 움직이도록 연결합니다.",
      flowTone: "orange",
    },
    primary: {
      src: referenceMedia("evidence/autonomous/ros2/ros2-gazebo.png"),
      alt: "ROS2와 Gazebo에서 차선·신호·보행자·LiDAR가 표시된 자율주행 시뮬레이션",
    },
    decision: [
      { text: "증상과 원인을 분리한 뒤" },
      { text: "환경 고정 · node/namespace 분리 · 시나리오 단위 검증", accent: true },
      { text: "의 순서로 원인을 좁혔습니다." },
    ],
    type: "troubleshooting",
    layout: "ros2",
    strategy: {
      lead: { label: "트러블슈팅 접근", title: "증상과 원인을 섞지 않고, 검증 단위를 고정했습니다.", text: "환경을 고정하고 기능별로 node를 분리한 뒤 시나리오 단위로 반복 검증하며 원인을 좁혀 나갔습니다." },
      steps: [
        ["01", "환경 고정", "Docker 이미지·ROS2 버전·파라미터·시드 고정으로 재현 가능한 실행 환경을 구성합니다.", "cube"],
        ["02", "node / namespace 분리", "기능별로 노드를 분리하고 namespace로 격리해 의존성을 최소화합니다.", "graph"],
        ["03", "시나리오 단위 검증", "기능을 시나리오 단위로 검증해 원인을 좁히고 회귀를 방지합니다.", "clipboard"],
      ],
      architecture: {
        sensors: ["Camera", "LiDAR", "IMU", "GPS"],
        nodes: ["perception (Vision / LiDAR)", "localization (AMCL / EKF)", "prediction (Object / Tracking)", "behavior (FSM / Planner)"],
        output: ["Drive_Bot (Controller)", "Ackermann 명령 출력"],
        scenarios: ["신호등", "좌회전", "속도제한"],
      },
    },
    tech: ["ROS2 Foxy", "Gazebo Classic", "Ubuntu 20.04", "Docker", "Python", "C++", "LiDAR", "PID", "Ackermann"],
  },
};

export const pages = {
  ai: {
    key: "ai",
    eyebrow: "AI Projects · Decisions over demos",
    title: "모델을 늘리기보다, 판단의 경계를 다시 그렸습니다.",
    lede: "PathFinder, Aegis, Hermes, 주차공간 탐지. 무엇이 막혔고 어떤 구조로 바꿨는지 전환점과 시각 증거를 함께 보여줍니다.",
    projects: ["pathfinder", "aegis", "hermes", "parking"],
  },
  robotics: {
    key: "robotics",
    eyebrow: "Robotics · Perception to Control",
    title: "감지한 장면을, 로봇의 다음 동작으로 연결합니다.",
    lede: "사과 수확·분류 Edge AI 로봇과 강화학습 오케스트레이션에서 인식·제어·실험의 경계를 다르게 설계했습니다.",
    projects: ["apple", "rl"],
  },
  autonomous: {
    key: "autonomous",
    eyebrow: "Autonomous Driving · Robot · Vehicle · Simulation",
    title: "주행을 나누고 실행 조건을 고정했습니다.",
    lede: "모드 라우팅, 차량 제어 역할, 실행 환경 고정이라는 서로 다른 판단을 프로젝트별 흐름으로 보여줍니다.",
    projects: ["ggeolgeol", "competition", "ros2"],
  },
};

export const resumeProjects = ["pathfinder", "aegis", "apple", "rl", "ggeolgeol"];

export const skillGroups = [
  { title: "Agent Workflow Design", scope: "AI systems · orchestration", core: ["오케스트레이션", "Prompt design", "Context engineering", "Harness"], support: ["Evaluation loop", "Graph engineering", "Human-in-the-loop", "MCP"] },
  { title: "AI Systems & Backend", scope: "LLM · backend contracts", core: ["Python", "LLM", "RAG", "GraphRAG"], support: ["FastAPI", "Django REST Framework", "SQL", "Playwright", "Vue.js", "Docker"] },
  { title: "Robotics & Control", scope: "sensing · control · ROS", core: ["ROS 2", "MuJoCo", "PID control", "IK / Jacobian"], support: ["Gazebo Classic", "SAC", "HER", "Stable-Baselines3", "PCA9685"] },
  { title: "Perception & Edge", scope: "vision · embedded devices", core: ["OpenCV", "YOLOv5", "YOLOv11", "SegFormer"], support: ["RealSense D415", "LiDAR", "Raspberry Pi", "Arduino", "Dynamixel"] },
];
