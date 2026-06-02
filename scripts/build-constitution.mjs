import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const source = JSON.parse(
  fs.readFileSync(path.join(__dirname, "source-constitution.json"), "utf8")
);

const PART_RANGES = [
  { part: "Preamble", test: (n) => n === "preamble" },
  { part: "The Union and its Territories", min: 1, max: 4 },
  { part: "Citizenship", min: 5, max: 11 },
  { part: "Fundamental Rights", min: 12, max: 35 },
  { part: "Directive Principles", min: 36, max: 51 },
  { part: "Fundamental Duties", letters: ["51a"] },
  { part: "The Union", min: 52, max: 151 },
  { part: "The States", min: 152, max: 237 },
  { part: "The Union Territories", min: 239, max: 242 },
  { part: "The Panchayats", min: 243, max: 243 },
  { part: "The Municipalities", min: 243, max: 243 },
  { part: "Scheduled and Tribal Areas", min: 244, max: 244 },
  { part: "Relations between the Union and the States", min: 245, max: 263 },
  { part: "Finance, Property, Contracts", min: 264, max: 300 },
  { part: "Finance, Property, Contracts", letters: ["300a"] },
  { part: "Trade, Commerce and Intercourse", min: 301, max: 307 },
  { part: "Services under the Union", min: 308, max: 323 },
  { part: "Tribunals", min: 323, max: 323 },
  { part: "Elections", min: 324, max: 329 },
  { part: "Special Provisions", min: 330, max: 342 },
  { part: "Official Language", min: 343, max: 351 },
  { part: "Emergency Provisions", min: 352, max: 360 },
  { part: "Miscellaneous", min: 361, max: 367 },
  { part: "Amendment of the Constitution", min: 368, max: 368 },
  { part: "Temporary, Transitional", min: 369, max: 392 },
  { part: "Short Title and Commencement", min: 393, max: 395 },
];

function normalizeArticleKey(raw) {
  if (raw === 0 || raw === "0") return "preamble";
  return String(raw).toLowerCase().replace(/\s/g, "");
}

function parseArticleNum(key) {
  if (key === "preamble") return { key, num: 0, suffix: "" };
  const match = key.match(/^(\d+)([a-z]*)$/i);
  if (!match) return { key, num: NaN, suffix: "" };
  return { key, num: parseInt(match[1], 10), suffix: (match[2] || "").toLowerCase() };
}

function resolvePart(key) {
  if (key === "preamble") return "Preamble";
  const { num, suffix } = parseArticleNum(key);
  const full = suffix ? `${num}${suffix}` : String(num);

  for (const range of PART_RANGES) {
    if (range.letters?.includes(full)) return range.part;
    if (range.test?.(key)) return range.part;
    if (range.min != null && suffix === "" && num >= range.min && num <= range.max) {
      return range.part;
    }
  }

  if (num >= 243 && num <= 243) return "Part IX — The Panchayats";
  if (full.startsWith("243") && suffix) return "Part IXA — The Municipalities";
  if (num >= 323 && suffix) return "Part XIVA — Tribunals";

  return "Constitution of India";
}

function toDisplayNumber(key) {
  if (key === "preamble") return "Preamble";
  const { num, suffix } = parseArticleNum(key);
  return `Article ${num}${suffix.toUpperCase()}`;
}

function toId(key) {
  return key === "preamble" ? "preamble" : `art-${key}`;
}

function cleanContent(text) {
  return text
    .replace(/\u00a0/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+\n/g, "\n")
    .trim();
}

function buildSummary(title, content) {
  const first = content.replace(/\s+/g, " ").trim();
  if (first.length <= 200) return first;
  return `${first.slice(0, 197)}…`;
}

function extractKeywords(title, content) {
  const text = `${title} ${content}`.toLowerCase();

  // Base word extraction (frequent meaningful words)
  const words = text.replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((w) => w.length > 4);
  const freq = {};
  for (const w of words) {
    freq[w] = (freq[w] || 0) + 1;
  }
  const top = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([w]) => w);

  // Extra curated terms to improve discoverability
  const EXTRA_TERMS = [
    "indian constitution",
    "constitution of india",
    "constitution articles",
    "constitution schedules",
    "fundamental rights",
    "fundamental duties",
    "directive principles",
    "preamble",
    "parliament",
    "lok sabha",
    "rajya sabha",
    "president of india",
    "prime minister",
    "supreme court",
    "high court",
    "judiciary",
    "constitutional law",
    "indian legal system",
    "constitution amendment",
    "article 14",
    "article 19",
    "article 21",
    "article 32",
    "article 226",
    "emergency provisions",
    "federalism",
    "citizenship",
    "writ petition",
    "judicial review",
    "basic structure",
    "landmark judgments",
    "case laws",
    "clat",
    "ailet",
    "upsc polity",
    "law student",
    "advocate",
    "legal news",
    "supreme court judgments",
    "constitution learning",
    "indian law",
    "legal education",
  ];

  const extras = EXTRA_TERMS.filter((term) => text.includes(term));

  return Array.from(new Set([...top, ...extras])).slice(0, 12);
}

const articles = source.map((row) => {
  const key = normalizeArticleKey(row.article);
  const content = cleanContent(row.description || "");
  const title = row.title?.trim() || toDisplayNumber(key);
  return {
    id: toId(key),
    number: toDisplayNumber(key),
    articleKey: key,
    title,
    part: resolvePart(key),
    summary: buildSummary(title, content),
    content,
    keywords: extractKeywords(title, content),
  };
});

const schedules = [
  { id: "schedule-1", number: "First Schedule", title: "States and Union Territories", part: "Schedules", summary: "Lists the States and Union territories of India and their territories.", content: "The First Schedule of the Constitution contains lists of States and Union territories along with territorial descriptions as amended from time to time." },
  { id: "schedule-2", number: "Second Schedule", title: "Salaries and Allowances", part: "Schedules", summary: "Provisions relating to salaries, allowances, and privileges.", content: "The Second Schedule sets out provisions as to the salaries, allowances, and privileges for the President, Governors, Speakers, Judges, and Comptroller and Auditor-General." },
  { id: "schedule-3", number: "Third Schedule", title: "Oaths and Affirmations", part: "Schedules", summary: "Forms of oaths and affirmations for constitutional offices.", content: "The Third Schedule prescribes forms of oath or affirmation for Union and State ministers, candidates for legislature, judges, and Comptroller and Auditor-General." },
  { id: "schedule-4", number: "Fourth Schedule", title: "Allocation of Seats in Rajya Sabha", part: "Schedules", summary: "Allocates Rajya Sabha seats among States and Union territories.", content: "The Fourth Schedule allocates seats in the Council of States (Rajya Sabha) to each State and Union territory." },
  { id: "schedule-5", number: "Fifth Schedule", title: "Scheduled Areas and Scheduled Tribes", part: "Schedules", summary: "Administration and control of Scheduled Areas and Scheduled Tribes.", content: "The Fifth Schedule deals with provisions as to the administration and control of Scheduled Areas and Scheduled Tribes." },
  { id: "schedule-6", number: "Sixth Schedule", title: "Tribal Areas in Assam, Meghalaya, Tripura and Mizoram", part: "Schedules", summary: "Autonomous districts and regions in North-Eastern tribal areas.", content: "The Sixth Schedule contains provisions for the administration of tribal areas in Assam, Meghalaya, Tripura and Mizoram through Autonomous District and Regional Councils." },
  { id: "schedule-7", number: "Seventh Schedule", title: "Union, State and Concurrent Lists", part: "Schedules", summary: "Legislative subjects under Union, State and Concurrent jurisdiction.", content: "The Seventh Schedule divides legislative subjects into the Union List, State List, and Concurrent List defining federal distribution of law-making power." },
  { id: "schedule-8", number: "Eighth Schedule", title: "Languages", part: "Schedules", summary: "Recognised languages of the Republic of India.", content: "The Eighth Schedule lists the recognised languages of India, presently comprising 22 languages." },
  { id: "schedule-9", number: "Ninth Schedule", title: "Validation of Certain Acts and Regulations", part: "Schedules", summary: "Laws immunised from judicial review on fundamental rights grounds.", content: "The Ninth Schedule was added to protect certain laws from challenge on the ground of inconsistency with fundamental rights, subject to basic structure limitations after judicial review." },
  { id: "schedule-10", number: "Tenth Schedule", title: "Anti-Defection", part: "Schedules", summary: "Disqualification on ground of defection from political parties.", content: "The Tenth Schedule (Anti-Defection Law) provides for disqualification of members on grounds of defection and adjudication by the Speaker/Chairman." },
  { id: "schedule-11", number: "Eleventh Schedule", title: "Panchayat Subjects", part: "Schedules", summary: "29 subjects for Panchayat governance.", content: "The Eleventh Schedule lists 29 subjects within the ambit of Panchayats under Article 243G." },
  { id: "schedule-12", number: "Twelfth Schedule", title: "Municipality Subjects", part: "Schedules", summary: "18 subjects for Municipal governance.", content: "The Twelfth Schedule lists 18 subjects within the ambit of Municipalities under Article 243W." },
];

const amendments = [
  { id: "amendment-1", number: "1st Amendment", year: 1951, title: "Freedom of speech restrictions", summary: "Land reform and freedom of speech restrictions; Ninth Schedule." },
  { id: "amendment-42", number: "42nd Amendment", year: 1976, title: "Mini Constitution", summary: "Added socialist, secular to Preamble; Fundamental Duties; expanded DPSP." },
  { id: "amendment-44", number: "44th Amendment", year: 1978, title: "Post-Emergency reforms", summary: "Strengthened liberty; Right to Property removed as FR; emergency limits." },
  { id: "amendment-73", number: "73rd Amendment", year: 1992, title: "Panchayati Raj", summary: "Constitutional status to Panchayats; Eleventh Schedule." },
  { id: "amendment-74", number: "74th Amendment", year: 1992, title: "Urban local bodies", summary: "Constitutional status to Municipalities; Twelfth Schedule." },
  { id: "amendment-86", number: "86th Amendment", year: 2002, title: "Right to Education", summary: "Article 21A — free and compulsory education for children 6–14." },
  { id: "amendment-101", number: "101st Amendment", year: 2016, title: "GST", summary: "Goods and Services Tax constitutional framework." },
  { id: "amendment-103", number: "103rd Amendment", year: 2019, title: "EWS reservation", summary: "10% reservation for economically weaker sections." },
  { id: "amendment-106", number: "106th Amendment", year: 2023, title: "Women's reservation", summary: "Reservation of seats for women in Lok Sabha and State legislatures." },
];

const output = {
  meta: {
    version: "1.0.0",
    source: "civictech-India/constitution-of-india (articles) + LTLG schedules/amendments",
    articleCount: articles.length,
    scheduleCount: schedules.length,
    amendmentCount: amendments.length,
    generatedAt: new Date().toISOString(),
  },
  articles,
  schedules,
  amendments,
};

const outPath = path.join(__dirname, "..", "src", "data", "constitution.json");
fs.writeFileSync(outPath, JSON.stringify(output, null, 0));
console.log(`Wrote ${articles.length} articles, ${schedules.length} schedules to ${outPath}`);
console.log(`File size: ${(fs.statSync(outPath).size / 1024).toFixed(1)} KB`);
