# 🌊 파도타기 Todo 앱

파도 위에서 역동적으로 할 일을 관리하는 듯한 사용자 경험을 제공하는 모던 Todo 애플리케이션입니다.

이 프로젝트는 React와 NestJS를 기반으로 한 모노레포 구조의 웹 애플리케이션으로, 프론트엔드와 백엔드가 분리되어 있습니다. 사용자는 인터랙티브한 UI를 통해 할 일을 효과적으로 추가, 수정, 삭제하고 관리할 수 있습니다.

![Todo App Screenshot](frontend/public/water-drops.jpg)
*(위 이미지는 앱의 배경화면으로 사용되는 이미지입니다.)*

---

## ✨ 주요 기능

### 프론트엔드
- **인터랙티브 UI**: `react-water-wave` 라이브러리를 활용하여 마우스 움직임에 반응하는 역동적인 물결 효과 배경을 구현했습니다.
- **다크 모드**: 사용자의 시력 보호와 취향을 고려한 다크 모드 테마를 지원합니다.
- **다국어 지원**: 한국어와 영어를 동적으로 전환할 수 있습니다.
- **포괄적인 할 일 관리**:
    - 할 일 추가, 수정, 삭제, 완료 처리
    - 우선순위(별점) 설정
    - 마감일 및 상세 설명 추가
- **강력한 필터링 및 정렬**:
    - 상태별(전체, 진행중, 완료), 중요도별 필터링
    - 텍스트 및 설명 기반 검색
    - 생성일, 우선순위, 마감일 기준 정렬

### 백엔드
- **안정적인 API 서버**: NestJS 프레임워크를 기반으로 구축되어 확장성과 유지보수성이 뛰어납니다.
- **유효성 검사**: `class-validator`를 통해 API 요청에 대한 강력한 유효성 검사를 수행하여 데이터 무결성을 보장합니다.
- **견고한 테스트 스위트**:
    - **유닛 테스트**: `TodosService`의 비즈니스 로직을 검증합니다.
    - **E2E 테스트**: 실제 API 엔드포인트의 요청부터 응답까지 전체 흐름을 테스트합니다.
- **안전한 실행 환경**: 서버 시작 전, 모든 테스트 코드를 자동으로 실행하여 안정성이 확보된 상태에서만 서버가 구동됩니다.

---

## 🛠️ 기술 스택

- **프론트엔드**: React, TypeScript, Tailwind CSS, Axios, react-water-wave
- **백엔드**: NestJS, TypeScript, class-validator
- **테스트**: Jest, Supertest
- **프로젝트 관리**: npm, concurrently

---

## 📂 프로젝트 구조

```
/
├── backend/      # NestJS 백엔드 프로젝트
│   ├── src/
│   └── test/
├── frontend/     # React 프론트엔드 프로젝트
│   └── src/
├── node_modules/
├── package.json  # 루트 프로젝트 관리 파일
└── README.md
```

---

## 🚀 시작하기

### 사전 준비
- [Node.js](https://nodejs.org/) (v18 이상 권장)
- [npm](https://www.npmjs.com/) (Node.js 설치 시 자동 설치)

### 1. 프로젝트 클론 및 의존성 설치
이 프로젝트는 루트 디렉토리에서 모든 명령어를 실행하여 프론트엔드와 백엔드를 한번에 제어합니다.

```bash
# 프로젝트를 원하는 위치에 클론합니다 (이미 받으셨다면 이 단계는 생략).
# git clone https://github.com/your-username/your-repo.git

# 프로젝트 루트 디렉토리로 이동합니다.
# cd your-repo
```

### 2. 애플리케이션 실행

아래의 단일 명령어를 실행하면, 필요한 모든 과정이 자동으로 수행됩니다.

```bash
npm start
```

위 명령어를 실행하면 다음과 같은 작업들이 순차적으로 진행됩니다.
1.  **백엔드 의존성 설치**: `backend` 폴더에 필요한 모든 패키지를 설치합니다.
2.  **프론트엔드 의존성 설치**: `frontend` 폴더에 필요한 모든 패키지를 설치합니다.
3.  **백엔드 테스트 실행**: 백엔드의 모든 유닛 테스트와 E2E 테스트를 실행합니다. **테스트를 모두 통과해야만 다음 단계로 진행됩니다.**
4.  **서버 동시 실행**: `concurrently`를 통해 백엔드 서버(포트 3001)와 프론트엔드 개발 서버(포트 3000)를 동시에 시작합니다.

서버가 성공적으로 시작되면, 웹 브라우저에서 `http://localhost:3000` 주소로 접속하여 애플리케이션을 확인할 수 있습니다.

---

## 🧪 테스트

백엔드 테스트만 별도로 실행하고 싶을 경우, 아래 명령어를 사용하세요.

- **모든 테스트 실행 (Unit + E2E)**
  ```bash
  npm run test --prefix backend
  ```

- **유닛 테스트만 실행**
  ```bash
  # backend/package.json의 test 스크립트는 jest를 직접 실행합니다.
  # (jest 기본 설정은 *.spec.ts 파일을 대상으로 함)
  npm run test --prefix backend -- src/todos/todos.service.spec.ts
  ```

- **E2E 테스트만 실행**
  ```bash
  npm run test:e2e --prefix backend
  ```

## API Endpoints

- `GET /api/todos` - Retrieve all todos
- `POST /api/todos` - Add a new todo
- `PUT /api/todos/:id` - Update an existing todo
- `DELETE /api/todos/:id` - Delete a todo
- `DELETE /api/todos/completed` - Delete all completed todos
- `DELETE /api/todos` - Delete all todos
- `GET /api/stats` - Retrieve statistics information

## Technology Stack

### Frontend
- React 18
- Axios (HTTP client)
- CSS3

### Backend
- Node.js
- Express.js
- CORS
- Body-parser

## Data Storage

Currently, an In-memory storage is used, which means data will be reset when the server restarts. For a real production environment, a database connection is required. 