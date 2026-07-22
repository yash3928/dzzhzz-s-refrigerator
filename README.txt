우리집 냉장고 v0.5 Firebase 공동동기화

기준본: v0.4.1
기존 LocalStorage 키 유지
- fridge-manager-items-v2
- fridge-manager-recipes-v1

포함 기능
- 이메일 회원가입 / 로그인 / 자동 로그인 / 로그아웃
- 공동가구 생성 및 6자리 초대코드 참여
- 식재료 및 레시피 Firestore 실시간 동기화
- 기존 LocalStorage 데이터 최초 1회 이전
- JSON 백업 및 복원 유지

필수 설정
1. Firebase Authentication에서 이메일/비밀번호 활성화
2. Firestore 규칙 탭에 firestore.rules 내용을 붙여넣고 게시
3. index.html은 file:// 직접 실행보다 Firebase Hosting 또는 웹 호스팅에서 사용

주의
- 현재 사진은 기존처럼 레시피 문서 안에 Base64로 들어갑니다. 큰 사진 또는 사진이 많으면 Firestore 문서 제한에 걸릴 수 있으므로 사진 공동동기화는 다음 Storage 단계에서 분리 예정입니다.
