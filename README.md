# Wish Bear 🧸

로그인 없이, 링크만으로 만드는 선물 레지스트리 앱. Next.js(App Router) + Supabase(Postgres) + Prisma로 구현되어 있습니다.

## 기술 스택
- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4
- **Backend**: Next.js API Routes (`src/app/api/**`)
- **DB**: PostgreSQL (Supabase), Prisma ORM
- **인증**: 로그인 없음. 방을 만들 때 발급되는 `ownerToken`을 브라우저 `localStorage`에 저장해 "방 주인 여부"를 판별합니다.

---

## 1. Supabase 프로젝트 준비

1. [supabase.com](https://supabase.com) 에서 새 프로젝트 생성
2. **Project Settings → Database → Connection string** 에서 두 개의 접속 문자열을 복사
   - **Transaction pooler** (포트 `6543`, `?pgbouncer=true` 포함) → `DATABASE_URL`
   - **Direct connection** (포트 `5432`) → `DIRECT_URL`
3. 프로젝트 루트에 `.env` 파일을 만들고 `.env.example`을 참고해 값을 채워주세요.

```bash
cp .env.example .env
# .env 파일 열어서 실제 Supabase 접속 정보로 교체
```

## 2. 로컬 실행

```bash
npm install          # 설치 시 자동으로 `prisma generate` 실행됨 (postinstall)
npx prisma migrate dev --name init   # 테이블 생성 (Room, Item, Ban, Reservation)
npm run dev
```

브라우저에서 `http://localhost:3000` 접속.

> ⚠️ Prisma 버전 안내: 이 프로젝트는 `prisma`/`@prisma/client`를 **6.x**로 고정했습니다. 최근 나온 Prisma 7은 스키마의 `url`/`directUrl`을 없애고 `prisma.config.ts` + 드라이버 어댑터(`@prisma/adapter-pg`) 방식으로 크게 바뀌어서, 아직 Supabase 등 생태계 가이드가 다 따라오지 못한 상태입니다. 지금 구조(스키마에 `url = env("DATABASE_URL")`)는 6.x 기준이니 `npm install` 시 6.x가 설치되는지 확인해주세요.
>
> 또한 이 코드는 샌드박스 환경에서 작성되었고, 그 환경은 Prisma 엔진 바이너리 다운로드 도메인(`binaries.prisma.sh`)에 대한 네트워크 접근이 막혀 있어 `prisma generate` / `next build` 실행 검증을 완료하지 못했습니다. `npm run lint`는 통과했지만, 실제 환경에서 빌드 확인을 한 번 부탁드려요.

## 3. Vercel 배포

1. GitHub 레포로 push 후 Vercel에서 Import
2. Environment Variables에 `DATABASE_URL`, `DIRECT_URL` 등록 (Production/Preview 둘 다)
3. Build Command는 기본값(`next build`) 그대로 두면 됩니다. `postinstall`에서 `prisma generate`가 자동 실행됩니다.
4. 최초 배포 전, 로컬에서 `npx prisma migrate deploy` 로 Supabase에 테이블을 미리 만들어두거나, Supabase SQL Editor에서 `prisma migrate dev`가 생성한 SQL을 실행해주세요.

---

## 폴더 구조

```
src/
  app/
    page.tsx                # 온보딩 (닉네임 → 생일 → 방 생성)
    board/[id]/page.tsx      # 오너/친구 뷰 (localStorage 기반 분기)
    api/
      rooms/route.ts                              # POST  방 생성
      rooms/[id]/route.ts                          # GET   방 조회
      rooms/[id]/items/route.ts                    # POST  위시리스트 추가(스크래핑)
      rooms/[id]/items/[itemId]/route.ts            # DELETE 위시리스트 삭제
      rooms/[id]/items/[itemId]/reserve/route.ts    # POST  찜하기(혼자/같이)
      rooms/[id]/bans/route.ts                      # POST  밴 목록 추가
      rooms/[id]/bans/[banId]/route.ts               # DELETE 밴 목록 삭제
  components/                # 화면/모달 단위 컴포넌트
  lib/
    prisma.ts       # PrismaClient 싱글턴
    scrape.ts       # 상품 링크 og:title/og:image 파싱 (+ 실패시 목업 대체)
    serialize.ts    # Prisma 모델 → API 응답 형태 변환
    storage.ts      # localStorage 헬퍼 (ownerToken, guestName)
    api-client.ts   # 프론트에서 쓰는 fetch 래퍼
    theme.ts         # 색상 토큰 + 이미지 링크
prisma/
  schema.prisma     # Room / Item / Ban / Reservation 모델
```

## 주요 동작 방식

### 오너 판별
- 방 생성 시 서버가 `ownerToken`을 발급 → 프론트가 `localStorage["wishbear:ownerToken:{roomId}"]`에 저장
- `/board/[id]` 진입 시 이 토큰이 있으면 오너 화면, 없으면 이름 입력 후 친구 화면
- 위시리스트/밴 목록을 수정하는 API는 요청 헤더 `x-owner-token` 값을 방의 실제 토큰과 비교해서 검증합니다.
- ⚠️ 브라우저를 바꾸거나 `localStorage`를 지우면 오너 권한을 잃습니다(로그인이 없으므로 복구 수단 없음). 실서비스로 발전시키려면 이메일/매직링크 같은 최소한의 계정 시스템을 얹는 걸 추천해요.

### 상품 링크 "스크래핑"
- `src/lib/scrape.ts`가 입력된 링크에 접속해 `og:title` / `og:image` 메타태그를 읽어옵니다.
- 가격은 사이트 구조가 제각각이라 정확히 뽑기 어려워서, 페이지 내 `₩12,400` / `12,400원` 같은 패턴을 느슨하게 찾는 수준입니다. 정확도가 중요하면 사이트별 파서나 유료 스크래핑 API로 교체하세요.
- 접속 실패/차단된 사이트는 데모용 목업 값(허니베어 인형)으로 대체됩니다.

### 같이 찜하기(공동구매) 소셜프루프
- 실제 결제/정산 로직은 없습니다. 순수하게 "몇 명이 찜했는지" 보여주는 사회적 신호 용도입니다.
- 어떤 상품에 처음으로 "다른 사람과 같이 구매"를 선택하면, 와이어프레임 문구("곰돌이님 외 3명이 찜했어요!")를 그대로 재현하기 위해 데모용 이름 2명이 함께 시드로 등록됩니다. (`src/app/api/.../reserve/route.ts`의 `SOCIAL_PROOF_SEED_NAMES`) 실서비스에서는 이 시드 로직을 지우고 실제 인원만 카운트하면 됩니다.

## 이미지
- `src/lib/theme.ts`의 `IMAGES.bear` 값과, 상품 카드 이미지(스크래핑 결과 `og:image`, 실패 시 `src/lib/scrape.ts`의 `FALLBACK_IMAGE`)만 교체하면 전체 화면에 반영됩니다.

## 다음에 하면 좋은 것들
- 찜 취소 기능 (`DELETE /reserve`)
- 오너용 실시간 갱신(Supabase Realtime 구독)
- 링크 미리보기 실패율을 낮추기 위한 전용 스크래핑 API 연동
- 최소 계정 시스템 (이메일/매직링크)으로 오너 권한 기기 종속성 해소
