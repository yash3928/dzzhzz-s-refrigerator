# 레시피 캡처 AI 2단계 설정

이번 단계는 공개 GitHub Pages와 비공개 Firebase Functions 서버를 연결합니다.
실제 레시피 추출은 아직 실행하지 않으며, 서버 연결·로그인 확인·이미지 크기 검증까지만 준비합니다.

## 준비 사항

- Firebase CLI를 실행할 PC
- Node.js 20 이상
- Firebase 프로젝트 `dzzhzz-fridge-93389`
- Cloud Functions 사용을 위한 Blaze 종량제 연결

## 1. Firebase CLI 설치와 로그인

```bash
npm install -g firebase-tools
firebase login
```

## 2. 압축을 푼 폴더로 이동

`firebase.json`, `.firebaserc`, `functions` 폴더가 보이는 위치에서 실행합니다.

```bash
cd 압축을_푼_폴더
npm --prefix functions install
```

## 3. AI 비밀키 등록

실제 AI 분석은 3단계에서 사용하지만, 2단계 연결 테스트를 위해 비밀키 슬롯을 먼저 만듭니다.

```bash
firebase functions:secrets:set OPENAI_API_KEY
```

명령 후 API 키를 붙여넣습니다. 이 값은 GitHub나 `index.html`에 저장되지 않습니다.

## 4. Functions 배포

```bash
firebase deploy --only functions
```

배포 대상:

- `recipeAiHealth`: 서버 연결 확인
- `analyzeRecipeCapture`: 3단계 분석용 자리 및 입력 검증

## 5. 웹 프로그램 배포

`index.html`을 기존 GitHub Pages의 파일에 덮어쓰고 배포 완료 후 새로고침합니다.

레시피 → 레시피 캡처 AI 작성 → **서버 연결 테스트**를 누릅니다.

정상 결과:

- 초록 점
- `서버 연결 성공 · asia-northeast3`

## 비용 주의

Cloud Functions 배포에는 Firebase Blaze 요금제 연결이 필요할 수 있습니다. Blaze는 종량제이므로 Google Cloud 예산 알림과 결제 알림을 설정하는 것이 좋습니다.

## 보안 원칙

- AI 비밀키를 `index.html`, GitHub 저장소, Firestore 문서에 넣지 않습니다.
- Callable Function은 Firebase 로그인 사용자의 인증 정보를 자동으로 전달받습니다.
- 3단계에서 App Check와 가구 구성원 검증을 추가할 예정입니다.
