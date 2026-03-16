# K-Pop 스타 코디 쇼핑몰 (kpop-style-shop)

## 프로젝트 개요
K-Pop 아이돌과 K-드라마 배우가 착용한 의류를 소싱하여 외국 팬들에게 판매하는 전문 쇼핑몰.
스타 이름으로 상품을 검색하고, 실제 착용 사진/영상 레퍼런스와 함께 상품을 탐색할 수 있다.
레퍼런스 사이트: https://krazzy.us/

## 대상 사용자
K-Pop / K-드라마를 좋아하는 외국인 팬. 좋아하는 스타와 같은 옷을 입고 싶어서 방문한다.
주요 UI 언어: 영어

## 핵심 기능
1. **상품 목록** (`/products`): 카드 그리드, 그룹/성별/가격/신규순 필터·정렬
2. **상품 상세** (`/products/[id]`): 착용 사진(업로드) + 상품 사진 + 상품 정보
3. **Stars 탐색** (`/stars`): 그룹 카드 목록 → 클릭 시 해당 그룹 상품 목록
4. **성별 카테고리**: Boy Group / Girl Group (상품 목록 필터로 통합)
5. **관리자 페이지** (`/admin`): 상품·그룹 CRUD, 고정 ID/PW 인증

### K-Pop 그룹 (상위 10개)
- **Boy**: BTS, EXO, SEVENTEEN, MONSTA X, GOT7
- **Girl**: BLACKPINK, TWICE, NewJeans, aespa, IVE

## 데이터 모델

| 모델 | 주요 필드 | 관계 |
|------|----------|------|
| `Star` | `id`, `name`, `gender`(BOY/GIRL), `imageUrl` | has many Products |
| `Product` | `id`, `name`, `price`, `description`, `starId` | belongs to Star, has many ProductImages |
| `ProductImage` | `id`, `productId`, `url`, `type`(STAR_WEARING/PRODUCT), `order` | belongs to Product |

## 화면 목록

| 화면 | 경로 |
|------|------|
| 홈 | `/` |
| 상품 목록 | `/products` |
| 상품 상세 | `/products/[id]` |
| Stars 탐색 | `/stars` |
| 관리자 로그인 | `/admin/login` |
| 관리자 대시보드 | `/admin` |
| 관리자 상품 CRUD | `/admin/products`, `/admin/products/new`, `/admin/products/[id]/edit` |
| 관리자 그룹 CRUD | `/admin/stars`, `/admin/stars/new`, `/admin/stars/[id]/edit` |

> 상세 PRD: `docs/PRD.md` 참고

## 기술 스택
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: PostgreSQL + Prisma
- **Auth**: NextAuth.js (관리자 전용)
- **Deployment**: Vercel
- **Package Manager**: bun

## 프로젝트 구조
```
kpop-style-shop/
├── src/
│   ├── app/
│   │   ├── (shop)/           # 쇼핑몰 페이지 (URL: /)
│   │   │   ├── products/     # 상품 목록/상세
│   │   │   └── stars/        # 스타별 상품 보기
│   │   ├── admin/            # 관리자 페이지 (URL: /admin)
│   │   │   ├── products/     # 상품 CRUD
│   │   │   └── stars/        # 스타 정보 CRUD
│   │   ├── api/              # API Routes
│   │   │   ├── products/
│   │   │   └── stars/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/               # shadcn/ui 기본 컴포넌트
│   │   ├── layout/           # Header, Footer 등
│   │   ├── product/          # 상품 관련 컴포넌트
│   │   ├── star/             # 스타 관련 컴포넌트
│   │   └── common/           # 공통 컴포넌트
│   ├── lib/
│   │   ├── db.ts             # Prisma 클라이언트
│   │   └── utils.ts          # cn() 등 유틸리티
│   ├── hooks/                # 커스텀 훅
│   ├── types/                # TypeScript 타입 정의
│   └── styles/               # 추가 스타일
├── prisma/
│   └── schema.prisma         # Star, Product 모델
├── public/                   # 정적 파일
├── .env.example              # 환경변수 예시
└── components.json           # shadcn/ui 설정
```

## 코딩 컨벤션

- **ESLint**: `eslint.config.mjs` — Next.js 기본 규칙 + Prettier 충돌 방지
- **Prettier**: `.prettierrc` — 들여쓰기 2칸, 작은따옴표, 세미콜론 사용, 한 줄 최대 100자
- 규칙 변경 시: `eslint.config.mjs` (코드 규칙) / `.prettierrc` (코드 모양) 수정

## Claude 협업 규칙

### 응답 언어
- 모든 응답, 코드 주석, 커밋 메시지, 설명을 한국어로 작성

### 코드 스타일
- 상황에 맞게 Claude가 판단하여 최적의 스타일로 작성

### 작업 방식
- 기능 하나씩 만들고 확인하면서 진행 (작은 단위)
- 작업 전 계획을 먼저 공유하고 확인 후 진행
- 파일 수정 전 반드시 해당 파일을 먼저 읽을 것
- 한 번에 너무 많은 파일을 수정하지 말 것

## 작업 원칙 (필수)

### 재사용성 최우선
- 문서/코드 모두 재사용성을 최우선으로 한다
- 상위 문서에 정의된 내용을 하위 문서에서 반복하지 않고 레퍼런스만 건다
- 문서/코드를 늘리고 확장하는 것에 극히 보수적으로 접근한다

### 임시 스크립트 관리
- 작업 수행 중 필요한 스크립트는 `.claude/temp/scripts/`에 생성한다
- 재사용성이 없는 1회성 스크립트는 작업 완료 후 반드시 삭제한다

### 디버깅 원칙
- 오류 수정 시 반드시 가설을 하나 세우고, print/console.log로 해당 가설만 검증한다
- 가설이 맞으면 수정, 틀리면 다음 가설로 넘어간다
- 한 번에 여러 가설을 동시에 테스트하지 않는다 (1가설 1검증)

## 제외 범위 (이번에는 안 만듦)
- 결제 / 장바구니 (Stripe 등 결제 연동)
- 마켓플레이스 (여러 판매자 입점)
- 리뷰 / 평점 시스템
- 회원가입 / 고객 마이페이지

## 프로젝트 운영 규칙

### Git 브랜치 전략
- `main`: 배포되는 브랜치 (직접 푸시 금지)
- `develop`: 개발 브랜치
- `feature/{기능명}`: 기능 개발 브랜치
- `fix/{버그명}`: 버그 수정 브랜치

### 커밋 메시지 규칙
- feat: 새 기능
- fix: 버그 수정
- docs: 문서 수정
- style: 코드 스타일 변경
- refactor: 리팩토링

### 배포 정책
- develop → main PR 후 Vercel 자동 배포

## 다음 단계
- `/6-prototype` 으로 Pencil 프로토타이핑을 진행하세요
