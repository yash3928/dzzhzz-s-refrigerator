우리집 냉장고 v0.6 레시피·주간식단 공동동기화

기준
- v0.5.1 로그인 수정본 기반
- 기존 식재료 키 유지: fridge-manager-items-v2
- 기존 레시피 키 유지: fridge-manager-recipes-v1
- 식단표 키 추가: fridge-manager-mealplans-v1

추가 기능
1. 레시피를 재료 / 소스·양념 / 만드는 법으로 분리
2. 레시피 대표 사진 유지
3. 즐겨찾기 및 최근 만든 날짜
4. 월~일, 아침·점심·저녁 일주일 플래너
5. 식단표 Firestore 공동동기화
6. JSON 백업에 식단표 포함
7. AI 레시피 캡처 입력은 안전한 서버 연결 전 준비 안내

중요 적용
- index.html을 기존 GitHub Pages 파일에 덮어쓰기
- firestore.rules를 Firebase Firestore > 규칙에 전체 붙여넣고 게시
- mealPlans 규칙을 게시하지 않으면 식단표 공동동기화가 실패합니다.

사진 안내
- 현재 사진은 압축 Base64로 레시피 문서에 포함됩니다.
- 사진이 많거나 큰 경우 Firestore 문서 용량 제한에 걸릴 수 있습니다.
- 다음 사진 동기화 단계에서는 Firebase Storage 연결을 권장합니다.
