import test from "node:test";
import assert from "node:assert/strict";
import { parseBankCsv, parseKoreanAmount, reconcileTransactions, summarize } from "./money.js";

test("한국어 금액을 숫자로 바꾼다", () => {
  assert.equal(parseKoreanAmount("점심 9천 원"), 9000);
  assert.equal(parseKoreanAmount("장보기 2.5만 원"), 25000);
  assert.equal(parseKoreanAmount("택시 12,300원"), 12300);
});

test("CSV를 읽고 24시간 내 같은 금액을 병합한다", () => {
  const incoming = parseBankCsv("날짜,내용,금액\n2026-09-19T12:18:00+09:00,행복식당,9000\n2026-09-19T15:00:00+09:00,김민수 이체,30000");
  const chat = [{ id: "chat-1", source: "chat", amount: 9000, occurredAt: "2026-09-19T12:05:00+09:00", status: "recorded", category: "식비" }];
  const result = reconcileTransactions(chat, incoming);
  assert.equal(result.results.merged.length, 1);
  assert.equal(result.results.needsReview.length, 1);
});

test("예산 합계를 실제 거래로 계산한다", () => {
  const result = summarize([{ amount: 9000, category: "식비", occurredAt: "2026-09-19T12:00:00+09:00", status: "recorded" }], 300000, "month", new Date("2026-09-20T00:00:00+09:00"));
  assert.equal(result.remaining, 291000);
  assert.equal(result.used, 3);
});
