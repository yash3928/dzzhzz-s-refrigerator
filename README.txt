우리집 냉장고 v0.6.3 · 레시피 캡처 AI 2단계

포함 파일
- index.html: GitHub Pages에 덮어쓰기
- firestore.rules: 기존 공동동기화 규칙
- firebase.json / .firebaserc: Functions 배포 설정
- functions/: 비공개 서버 코드
- AI_STAGE2_SETUP.md: PC에서 배포하는 순서

2단계 기능
- Firebase Callable Functions 연결 준비
- 로그인 사용자만 서버 상태 확인
- 서버 연결 테스트 UI
- 이미지 데이터 형식 및 크기 검증 준비
- AI 키를 Cloud Secret Manager에 보관하는 구조

실제 AI 레시피 추출은 3단계에서 활성화합니다.
