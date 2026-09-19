export const CATEGORIES = ["식비", "교통", "생활", "여가", "의료", "교육", "기타"];

const categoryRules = [
  ["식비", /점심|저녁|아침|밥|식사|커피|카페|김치|치킨|배달|회식|마트|편의점/],
  ["교통", /버스|지하철|택시|교통|주유|기차|철도/],
  ["생활", /월세|관리비|통신|전기|수도|가스|생활용품/],
  ["여가", /영화|게임|공연|여행|술|노래방|취미/],
  ["의료", /병원|약국|약|진료/],
  ["교육", /책|도서|강의|학원|교육/],
];

export function parseKoreanAmount(text) {
  const normalized = text.replace(/,/g, "").replace(/\s+/g, "");
  const unitMatch = normalized.match(/(\d+(?:\.\d+)?)\s*(만|천)\s*원?/);
  if (unitMatch) return Math.round(Number(unitMatch[1]) * (unitMatch[2] === "만" ? 10000 : 1000));
  const wonMatch = normalized.match(/(\d{3,})원?/);
  return wonMatch ? Number(wonMatch[1]) : null;
}

export function categorize(text) {
  return categoryRules.find(([, rule]) => rule.test(text))?.[0] ?? "기타";
}

export function parseNaturalExpense(text, now = new Date()) {
  const amount = parseKoreanAmount(text);
  if (!amount) throw new Error("금액을 찾지 못했어요. ‘점심 9천 원’처럼 적어주세요.");
  const date = new Date(now);
  if (/어제/.test(text)) date.setDate(date.getDate() - 1);
  const time = text.match(/(\d{1,2})시(?:\s*(\d{1,2})분)?/);
  if (time) date.setHours(Number(time[1]), Number(time[2] || 0), 0, 0);
  return {
    id: crypto.randomUUID(),
    source: "chat",
    description: text.trim(),
    merchant: text.trim().slice(0, 30),
    amount,
    category: categorize(text),
    occurredAt: date.toISOString(),
    status: "recorded",
    createdAt: new Date().toISOString(),
  };
}

function splitCsvLine(line) {
  const cells = [];
  let current = "";
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"' && line[i + 1] === '"') { current += '"'; i += 1; }
    else if (char === '"') quoted = !quoted;
    else if (char === "," && !quoted) { cells.push(current.trim()); current = ""; }
    else current += char;
  }
  cells.push(current.trim());
  return cells;
}

export function parseBankCsv(csv) {
  const lines = csv.replace(/^\uFEFF/, "").split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) throw new Error("헤더와 거래 한 건 이상이 있는 CSV가 필요해요.");
  const headers = splitCsvLine(lines[0]).map((item) => item.toLowerCase());
  const indexOf = (...names) => headers.findIndex((header) => names.some((name) => header.includes(name)));
  const dateIndex = indexOf("date", "일시", "날짜", "거래일");
  const descIndex = indexOf("description", "merchant", "적요", "내용", "가맹점");
  const amountIndex = indexOf("amount", "출금", "금액");
  if ([dateIndex, descIndex, amountIndex].some((index) => index < 0)) {
    throw new Error("날짜·내용·금액 열을 찾지 못했어요. 제공된 양식을 확인해 주세요.");
  }
  return lines.slice(1).map((line, row) => {
    const cells = splitCsvLine(line);
    const amount = Math.abs(Number(String(cells[amountIndex]).replace(/[^\d.-]/g, "")));
    const occurredAt = new Date(cells[dateIndex]);
    if (!amount || Number.isNaN(occurredAt.getTime())) throw new Error(`${row + 2}번째 줄의 날짜 또는 금액을 확인해 주세요.`);
    const merchant = cells[descIndex] || "사용처 미상";
    const unclear = /이체|송금|transfer/i.test(merchant);
    return {
      id: crypto.randomUUID(), source: "bank", description: merchant, merchant, amount,
      category: unclear ? "기타" : categorize(merchant), occurredAt: occurredAt.toISOString(),
      status: unclear ? "needs_review" : "recorded", createdAt: new Date().toISOString(),
    };
  });
}

export function reconcileTransactions(existing, incoming, hours = 24) {
  const limit = hours * 60 * 60 * 1000;
  const next = [...existing];
  const results = { merged: [], added: [], needsReview: [] };
  for (const bank of incoming) {
    const match = existing.find((item) => item.source === "chat" && item.amount === bank.amount && Math.abs(new Date(item.occurredAt) - new Date(bank.occurredAt)) <= limit && item.status !== "merged");
    if (match) {
      const index = next.findIndex((item) => item.id === match.id);
      next[index] = { ...match, merchant: bank.merchant, status: "merged", bankTransactionId: bank.id };
      results.merged.push(next[index]);
    } else {
      next.push(bank);
      (bank.status === "needs_review" ? results.needsReview : results.added).push(bank);
    }
  }
  return { transactions: next, results };
}

export function summarize(transactions, budget, period = "month", now = new Date()) {
  const start = new Date(now);
  if (period === "week") {
    const day = (start.getDay() + 6) % 7;
    start.setDate(start.getDate() - day);
  } else start.setDate(1);
  start.setHours(0, 0, 0, 0);
  const items = transactions.filter((item) => item.status !== "duplicate" && new Date(item.occurredAt) >= start && new Date(item.occurredAt) <= now);
  const spent = items.reduce((sum, item) => sum + item.amount, 0);
  const byCategory = CATEGORIES.map((name) => ({ name, spent: items.filter((item) => item.category === name).reduce((sum, item) => sum + item.amount, 0) })).filter((item) => item.spent > 0);
  return { total: budget, spent, remaining: Math.max(budget - spent, 0), used: budget ? Math.round((spent / budget) * 100) : 0, byCategory };
}
