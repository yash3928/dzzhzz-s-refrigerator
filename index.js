"use strict";

const {onCall, HttpsError} = require("firebase-functions/v2/https");
const {defineSecret} = require("firebase-functions/params");
const {initializeApp} = require("firebase-admin/app");

initializeApp();

// 3단계에서 실제 이미지 분석에 사용합니다.
// 값은 index.html이 아니라 Cloud Secret Manager에 저장됩니다.
const OPENAI_API_KEY = defineSecret("OPENAI_API_KEY");

exports.recipeAiHealth = onCall(
  {
    region: "asia-northeast3",
    enforceAppCheck: false,
    secrets: [OPENAI_API_KEY],
    timeoutSeconds: 30,
    memory: "256MiB",
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "로그인이 필요합니다.");
    }

    const householdId = String(request.data?.householdId || "").slice(0, 128);
    return {
      ok: true,
      stage: 2,
      region: "asia-northeast3",
      authenticated: true,
      householdReceived: Boolean(householdId),
      aiSecretConfigured: Boolean(OPENAI_API_KEY.value()),
      message: "Firebase Functions 연결이 정상입니다.",
    };
  },
);

// 3단계용 자리입니다. 아직 외부 AI 호출은 하지 않습니다.
exports.analyzeRecipeCapture = onCall(
  {
    region: "asia-northeast3",
    enforceAppCheck: false,
    secrets: [OPENAI_API_KEY],
    timeoutSeconds: 60,
    memory: "512MiB",
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "로그인이 필요합니다.");
    }
    const imageData = String(request.data?.imageData || "");
    if (!imageData.startsWith("data:image/")) {
      throw new HttpsError("invalid-argument", "이미지 데이터가 필요합니다.");
    }
    if (imageData.length > 11_500_000) {
      throw new HttpsError("invalid-argument", "이미지가 너무 큽니다.");
    }
    throw new HttpsError(
      "failed-precondition",
      "2단계 연결은 완료되었으며 실제 AI 분석은 3단계에서 활성화합니다.",
    );
  },
);
