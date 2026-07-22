우리집 냉장고 v0.5.1 로그인 수정

수정 사항
- Firebase 로그인 성공과 Firestore 공동가구 확인 과정을 분리
- Firestore 규칙 오류가 있어도 로그인 화면이 계속 남아 있던 문제 수정
- 로그인/회원가입 진행 상태 및 오류 메시지 표시 강화
- 기존 식재료/레시피 저장 키와 공동 동기화 구조 유지

필수 설정
1. Firebase Authentication 이메일/비밀번호 사용 설정
2. Firestore Database 규칙에 동봉된 firestore.rules 전체 붙여넣기 후 게시
3. GitHub Pages에 index.html 덮어쓰기
4. Safari에서 새로고침 후 로그인
