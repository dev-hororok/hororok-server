### 완료된 기능

- 인증

  - 로그인 `POST /auth/email/login`
  - 회원가입 `POST /auth/email/register`
  - 구글 OAuth 로그인 `POST /auth/google/login`
  - 토큰 리프레시 `POST /auth/refresh`
  - 회원 탈퇴 `DELETE /auth/me`

- 스터디 타이머

  - 타이머 시작 `POST /study-timer/start`
  - 타이머 종료 `POST /study-timer/end`

- `WebSocket` (스터디 그룹)

  - subscribe
    - joinGroup - 8명 이하인 스터디 그룹 입장
    - removeAllData(admin) - 스터디 그룹 관련 redis 데이터 삭제
  - broadcast
    - newMember - 현재 그룹에 참여한 멤버의 정보 전송
    - groupInfo - 현재 그룹에 참여중인 모든 멤버의 정보 전송
    - memberLeft - 그룹에서 떠난 멤버의 id 전송

- 멤버

  - 현재 로그인한 멤버 조회 `GET /members/me`
  - 멤버 정보 수정 `PATCH /members/{member_id}`
  - 멤버 스트릭 조회 `GET /members/{member_id}/study-streak`
  - 멤버 아이템 인벤토리 조회 `GET /members/{member_id}/item-inventory`
  - 멤버 캐릭터 인벤토리 조회 `GET /members/{member_id}/character-inventory`

  - 통계

    - 일일 통계 `GET /members/{member_id}/statistics?date=2024-02-08`
    - 월별 통계 `GET /members/{member_id}/statistics/monthly?year=2024&month=2`
    - 히트맵 데이터 조회 `GET /members/{member_id}/statistic/heat-map?start=2023-02-08&end=2024-02-08`

  - 스터디 카테고리

    - 조회 `GET members/:member_id/study-categories`
    - 생성 `POST members/:member_id/study-categories`
    - 수정 `PATCH members/:member_id/study-categories/{study_category_id}`
    - 삭제 `DELETE members/:member_id/study-categories/{study_category_id}`

### ⚙️ 배포 환경

- 공유

  - 운영 DB - `AWS RDS(이창우)`
  - 개발 및 테스트 DB - `AWS RDS(이지선)`

- Nest 서버 - `AWS EC2(이창우)`

  - WebSocket 어댑터 및 DB - `AWS Elasticache Redis(이창우)`
  - `git-actions`
    - e2e-test
    - build
    - deploy `(self-hosted-runner)`
  - `docker-compose`
    - app
    - `nginx`
    - `certbot`

- Spring 서버 - `AWS EC2(이지선)`

  - `git-actions`
    - build
    - deploy `(appleboy/ssh-action)`
  - `docker-compose`
    - app
    - `nginx`
    - `certbot`

- Frontend
  - React - `Vercel (이창우)`

### 테스트 코드

- [x] api e2e 테스트 (`auth`, `member`, `study-timer`)

### DB Migration

주의할점 - 테스트 DB와 운영 DB의 migration 테이블 기록을 반드시 동기화 시켜야함

- `migration:generate` - DB 테이블 수정사항 생길 시 마이그레이션 파일 생성

- `migration:run` - 테스트 DB에 먼저 적용

- `migration:revert` - 문제 발생 시 되돌리기

- `migration:run` - 문제 없을 시 운영 DB에 적용

### DB Seeds

- `seed:run` - 시드파일 추가 (`Role`, 테스트에서 사용할 `Account / Member`)

### 캐시 관련 문제

- `Nest` 서버에서 캐시처리를 할 경우 : `Spring`의 `상점 구매/판매, 아이템 사용 API`사용 시 `Nest`쪽에서 변동을 확인하여 캐시를 무효화 할 수 없음
  - ex. 새 캐릭터 획득, 인벤토리 감소, 스트릭 변경 등
- `Spring` 서버에서 캐시처리를 할 경우: `item-inventory` 이외에는 `Nest`에서 발생시키는 변동사항에 영향을 받지 않음
  - ex. `Nest`의 `공부 시작/종료 API` 사용 시 `item-inventory`의 `progress`를 수정함 (남은 `progress`가 존재하면 사용 불가)
- 해결안
  - [x] `Nest`에서 조회(멤버, 인벤토리, 상점) 발생 시 항상 최신 데이터를 조회하도록 하기
  - [x] 클라이언트에서 `react-query`로 캐시처리 하기(`Nest`, `Spring` 통합)
  - [ ] 최신 데이터가 필요없는 `member`나 `account`조회는 (`Transaction` 혹은 `Guard` 등에서 존재 유무만 체크할 경우) 캐싱

## Task

### 1.0.0 Todos

프로젝트 첫 메이저 릴리스를 위한 Todo리스트

- [ ] 통계 테이블로 계산량 최적화

  - 배치작업
    - 새벽에 전날에 생성된 StudyRecords 집계하여 저장해두기(Daily)
    - 월초에 전달 DailyStudyRecords 집계하여 저장해두기
    - 처리량, 걸린시간, 실패율 로깅 및 알림
    - 자동 재시도(DB문제, 네트워크 문제) & 영구적 오류 처리(버그)

- [ ] 비즈니스 로직 유닛테스트 (auth, study-timer, statistic, category)
- [ ] web socket 부하테스트 스크립트 작성 (Artillery)

  - admin 토큰 하나로 인증하고 member_id를 1씩 증가시켜 넘기는 우회용 게이트웨이 필요할듯(jwtToken으로 유저 판별하여 연결하기 때문)

- [ ] 운영에 필요한 로깅 처리

### 이후 버전관리

- Nest와 Spring 별도로 수행
- DB 스키마 변경 상황 생각해야함 (메이저 버전)
- 배포 브랜치 안전하게 관리 (Github Flow 잘 준수)
- 배포가 수시로 일어나기 때문에 Blue/Green 배포 고려
- API 버전관리를 통해 이전 버전의 API를 계속 사용할 수 있도록 해야함(프론트엔드에서 즉시 업데이트 하지 않아도 되도록)
