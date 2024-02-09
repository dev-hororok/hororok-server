## Task

### Hororok Server

- 업로드 API 작업 (+CDN)
- OAuth 적용(구글, 카카오, 네이버)
- Feed CRUD (Troubleshooting)

### TimerApp Server

- Statistic 모듈 작업

  - 일일 통계 (ex. /members/{member_id}/statistics?date=2024-02-08)
  - 월별 통계 (ex. /members/{member_id}/statistics/monthly?month=4)
  - 배치작업
    - 새벽에 전날에 생성된 StudyRecords 집계하여 저장해두기(Daily)
    - 월초에 전달 DailyStudyRecords 집계하여 저장해두기
    - 처리량, 걸린시간, 실패율 로깅 및 알림
    - 자동 재시도(DB문제, 네트워크 문제) & 영구적 오류 처리(버그)

- 캐싱처리

  - Nest에서 조회 작업을 많이 하기 때문에 적절한 캐싱필요
  - AWS ElastiCache(Redis) 사용
    - 현재 프리티어 EC2에 4개의 도커이미지(hororok, timer, nginx, certbot)가 올라가기 때문에 redis까지 올리면 메모리 부담됨
    - 스프링(상점 구매/판매, 아이템 사용, 캐릭터/아이템 관리) 서버와 db를 공유하기 때문에 중복되는 캐시데이터가 많음
    - 타이머 종료 후 itemInventory(food)의 변동사항(progress)을 spring에서도 인지해야함
    - Nest/Spring 간 적절한 key네이밍 전략 필요
    - redis도 데이터 일관성 및 원자성 보장 필요 (트랜잭션 / Optimistic Locking)

- 로깅처리

  - 인증 관련 이벤트
  - 에러 발생
  - 비즈니스 로직 (타이머 시작/종료/시간 -> 패턴분석 및 개선에 필요)
  - 배치작업 (통계 집계, 데이터 정리 (성공 여부, 실행 시간, 처리량, 에러원인))

- 테스트 코드

  - 비즈니스 로직 유닛테스트
  - api e2e 테스트

- Prod 환경 분리

  - DB분리 - Typeorm의 synchronize -> DB 마이그레이션 방식 전환
  - 캐시서버 분리

- 프로토타입 이후 버전관리
  - Nest와 Spring 별도로 수행
  - DB 스키마 변경 상황 생각해야함 (메이저 버전)
  - 배포 브랜치 안전하게 관리 (Github Flow 잘 준수)
  - 배포가 수시로 일어나기 때문에 Blue/Green 배포 고려
  - API 버전관리를 통해 이전 버전의 API를 계속 사용할 수 있도록 해야함(프론트엔드에서 즉시 업데이트 하지 않아도 되도록)

### 1.0.0 Todos

프로젝트 첫 메이저 릴리스를 위한 Todo리스트

#### 미진행

- [ ] 업로드 API (hororok)

- [ ] 통계
  - [x] 일일 통계 (ex. /members/{member_id}/statistics?date=2024-02-08)
  - [x] 월별 통계 (ex. /members/{member_id}/statistics/monthly?year=2024&month=2)
  - [ ] 히트맵 데이터 조회(ex. /members/{member_id}/statistic/heat-map?start=2023-02-08&end=2024-02-08)
  - [ ] 통계 테이블로 최적화
- [ ] 캐싱처리
  - [ ] 캐싱이 필요한 Services 메서드를 따로 생성 (서비스 객체의 CRUD가 범용성을 위해 options객체를 받도록 되어있어 캐싱처리 하기 힘듬)
- [ ] 테스트 코드
  - [ ] 비즈니스 로직 유닛테스트
  - [ ] api e2e 테스트
- [ ] 로깅 처리
  - [ ] 에러 발생
  - [ ] 비즈니스 로직 (타이머 시작/종료/시간 -> 패턴분석 및 개선에 필요)
- [x] 개발용 DB분리

#### 완료

작성중..
