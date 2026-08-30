/**
 * Emora research prototype backend.
 * Runtime: Google Apps Script V8, deployed as a Web App.
 */

const SHEETS = {
  Users: ["id", "name", "email", "password_hash", "password_salt", "role", "status", "created_at", "updated_at"],
  Biodata: ["id", "user_id", "nama", "usia", "jenis_kelamin", "pendidikan", "pekerjaan", "domisili", "created_at", "updated_at"],
  Questions: ["id", "question_number", "question_text_en", "question_text_id", "strategy", "scale_min", "scale_max", "translation_status", "is_active"],
  Assessments: ["id", "user_id", "status", "started_at", "completed_at", "created_at"],
  Responses: ["assessment_id", "user_id"].concat(Array.from({ length: 30 }, (_, i) => `Q${String(i + 1).padStart(2, "0")}`), ["updated_at", "submitted_at"]),
  Results: [
    "assessment_id", "user_id",
    "behavioral_activation", "problem_solving", "situational_avoidance", "social_withdrawal", "distraction",
    "rumination", "acceptance", "cognitive_reappraisal", "expressive_suppression", "social_sharing",
    "behavioral_activation_category", "problem_solving_category", "situational_avoidance_category",
    "social_withdrawal_category", "distraction_category", "rumination_category", "acceptance_category",
    "cognitive_reappraisal_category", "expressive_suppression_category", "social_sharing_category", "calculated_at"
  ],
  Materials: ["id", "slug", "title", "summary", "content", "image", "status", "created_at", "updated_at"]
};

const STRATEGIES = [
  { key: "behavioral_activation", label: "Behavioral Activation", items: [4, 14, 23], mean: 14.78, sd: 3.62 },
  { key: "problem_solving", label: "Problem Solving", items: [6, 16, 25], mean: 16.12, sd: 3.32 },
  { key: "situational_avoidance", label: "Situational Avoidance", items: [5, 15, 24], mean: 14.56, sd: 4.10 },
  { key: "social_withdrawal", label: "Social Withdrawal", items: [11, 21, 30], mean: 13.10, sd: 4.92 },
  { key: "distraction", label: "Distraction", items: [9, 19, 28], mean: 15.48, sd: 3.69 },
  { key: "rumination", label: "Rumination", items: [8, 18, 27], mean: 10.39, sd: 4.59 },
  { key: "acceptance", label: "Acceptance", items: [10, 20, 29], mean: 14.89, sd: 4.04 },
  { key: "cognitive_reappraisal", label: "Cognitive Reappraisal", items: [1, 3, 12], mean: 14.97, sd: 3.97 },
  { key: "expressive_suppression", label: "Expressive Suppression", items: [2, 13, 22], mean: 12.52, sd: 4.86 },
  { key: "social_sharing", label: "Social Sharing", items: [7, 17, 26], mean: 12.01, sd: 4.97 }
];

/**
 * English wording copied exactly from the official Preece & Gross (2026)
 * ERQ-30 questionnaire supplied by the project owner.
 *
 * The Indonesian wording is a project translation based on the original
 * ERQ-30 and must not be represented as an officially validated Indonesian
 * version. Translation/adaptation requires permission from the copyright holders.
 */
const ERQ30_QUESTIONS = [
  [1, "When I want to feel more positive emotion (such as joy or amusement), I change the way I’m thinking about the situation.", "Ketika saya ingin merasakan lebih banyak emosi positif (seperti kegembiraan atau rasa terhibur), saya mengubah cara saya memikirkan situasi tersebut.", "Cognitive Reappraisal"],
  [2, "I keep my emotions to myself.", "Saya menyimpan emosi saya untuk diri sendiri.", "Expressive Suppression"],
  [3, "When I want to feel less negative emotion (such as sadness or anger), I change the way I’m thinking about the situation.", "Ketika saya ingin merasakan lebih sedikit emosi negatif (seperti kesedihan atau kemarahan), saya mengubah cara saya memikirkan situasi tersebut.", "Cognitive Reappraisal"],
  [4, "I control my emotions by regularly doing pleasant and meaningful activities throughout my week.", "Saya mengendalikan emosi saya dengan secara rutin melakukan kegiatan yang menyenangkan dan bermakna sepanjang minggu.", "Behavioral Activation"],
  [5, "When I am faced with a stressful situation, I try to get away from that situation as quickly as possible.", "Ketika saya menghadapi situasi yang penuh tekanan, saya berusaha menjauh dari situasi tersebut secepat mungkin.", "Situational Avoidance"],
  [6, "When I want to feel more positive emotion, I look for practical solutions that will fix the issues or unpleasant situations in my life.", "Ketika saya ingin merasakan lebih banyak emosi positif, saya mencari solusi praktis yang akan mengatasi masalah atau situasi tidak menyenangkan dalam hidup saya.", "Problem Solving"],
  [7, "I control my emotions by talking with other people about what I’m feeling.", "Saya mengendalikan emosi saya dengan berbicara kepada orang lain tentang apa yang saya rasakan.", "Social Sharing"],
  [8, "When I am faced with a stressful situation, I manage my emotions by repeatedly thinking about the negative parts of the situation.", "Ketika saya menghadapi situasi yang penuh tekanan, saya mengelola emosi saya dengan berulang kali memikirkan bagian-bagian negatif dari situasi tersebut.", "Rumination"],
  [9, "When I want to feel less negative emotion, I distract myself.", "Ketika saya ingin merasakan lebih sedikit emosi negatif, saya mengalihkan perhatian saya.", "Distraction"],
  [10, "I control my emotions by accepting the things in my life that I cannot change.", "Saya mengendalikan emosi saya dengan menerima hal-hal dalam hidup saya yang tidak dapat saya ubah.", "Acceptance"],
  [11, "When I want to feel more positive emotion, I retreat into my own space, away from others.", "Ketika saya ingin merasakan lebih banyak emosi positif, saya menarik diri ke ruang saya sendiri, menjauh dari orang lain.", "Social Withdrawal"],
  [12, "I control my emotions by changing the way I think about the situation I’m in.", "Saya mengendalikan emosi saya dengan mengubah cara saya memikirkan situasi yang sedang saya hadapi.", "Cognitive Reappraisal"],
  [13, "I control my emotions by not expressing them.", "Saya mengendalikan emosi saya dengan tidak mengekspresikannya.", "Expressive Suppression"],
  [14, "When I want to feel more positive emotion, I make a point of doing enjoyable activities throughout the week that are consistent with what I want in life.", "Ketika saya ingin merasakan lebih banyak emosi positif, saya secara sengaja melakukan kegiatan menyenangkan sepanjang minggu yang selaras dengan apa yang saya inginkan dalam hidup.", "Behavioral Activation"],
  [15, "When I want to feel less negative emotion, I avoid any situations that seem like they potentially may get stressful.", "Ketika saya ingin merasakan lebih sedikit emosi negatif, saya menghindari situasi apa pun yang tampaknya berpotensi menjadi penuh tekanan.", "Situational Avoidance"],
  [16, "When I am faced with a stressful situation, I make realistic plans to help solve the situation.", "Ketika saya menghadapi situasi yang penuh tekanan, saya membuat rencana realistis untuk membantu menyelesaikan situasi tersebut.", "Problem Solving"],
  [17, "When I want to feel more positive emotion, I let others know what I’m feeling.", "Ketika saya ingin merasakan lebih banyak emosi positif, saya memberi tahu orang lain tentang apa yang saya rasakan.", "Social Sharing"],
  [18, "I manage my emotions by ‘ruminating’ about stressful situations (thinking about the bad parts of situations again and again).", "Saya mengelola emosi saya dengan melakukan ‘ruminasi’ tentang situasi yang penuh tekanan (memikirkan bagian-bagian buruk dari situasi tersebut berulang kali).", "Rumination"],
  [19, "During stressful situations, I distract myself to feel better.", "Selama situasi yang penuh tekanan, saya mengalihkan perhatian saya agar merasa lebih baik.", "Distraction"],
  [20, "When I want to feel more positive emotion, I try to accept the parts of upsetting situations in my life that I cannot change.", "Ketika saya ingin merasakan lebih banyak emosi positif, saya mencoba menerima bagian-bagian dari situasi yang mengusik perasaan dalam hidup saya yang tidak dapat saya ubah.", "Acceptance"],
  [21, "I control my emotions by distancing myself from other people.", "Saya mengendalikan emosi saya dengan menjaga jarak dari orang lain.", "Social Withdrawal"],
  [22, "When I am feeling negative emotions, I make sure not to express them.", "Ketika saya merasakan emosi negatif, saya memastikan untuk tidak mengekspresikannya.", "Expressive Suppression"],
  [23, "When I want to feel less negative emotion, I make sure to do things that will get me energized by moving physically.", "Ketika saya ingin merasakan lebih sedikit emosi negatif, saya memastikan untuk melakukan hal-hal yang membuat saya lebih berenergi dengan bergerak secara fisik.", "Behavioral Activation"],
  [24, "When I want to feel more positive emotion, I try to avoid all situations that might end up being uncomfortable.", "Ketika saya ingin merasakan lebih banyak emosi positif, saya mencoba menghindari semua situasi yang pada akhirnya mungkin terasa tidak nyaman.", "Situational Avoidance"],
  [25, "I control my emotions by solving the problems or stressful situations in my life.", "Saya mengendalikan emosi saya dengan menyelesaikan masalah atau situasi yang penuh tekanan dalam hidup saya.", "Problem Solving"],
  [26, "When I am faced with a stressful situation, I share what I’m feeling in order to feel better.", "Ketika saya menghadapi situasi yang penuh tekanan, saya membagikan apa yang saya rasakan agar merasa lebih baik.", "Social Sharing"],
  [27, "When I want to feel better about an upsetting situation, I go over and over what happened and why.", "Ketika saya ingin merasa lebih baik tentang situasi yang mengusik perasaan, saya memikirkan berulang kali apa yang terjadi dan mengapa hal itu terjadi.", "Rumination"],
  [28, "I distract myself during upsetting situations to feel better.", "Saya mengalihkan perhatian saya selama situasi yang mengusik perasaan agar merasa lebih baik.", "Distraction"],
  [29, "When I am faced with a stressful situation, I try to keep calm by accepting the parts of it that I cannot change.", "Ketika saya menghadapi situasi yang penuh tekanan, saya berusaha tetap tenang dengan menerima bagian-bagian dari situasi tersebut yang tidak dapat saya ubah.", "Acceptance"],
  [30, "When I want to feel less negative emotion, I isolate myself, away from friends or family.", "Ketika saya ingin merasakan lebih sedikit emosi negatif, saya mengisolasi diri, menjauh dari teman atau keluarga.", "Social Withdrawal"]
];

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;
// Edit this one list if the study later changes its demographic fields.
const BIODATA_FIELDS = ["nama", "usia", "jenis_kelamin", "pendidikan", "pekerjaan", "domisili"];

function setupDatabase() {
  const spreadsheet = getSpreadsheet_();
  Object.keys(SHEETS).forEach(name => ensureSheet_(spreadsheet, name, SHEETS[name]));
  seedErq30Questions();
  seedMaterials_();
  return "Database Emora siap. Semua 30 item ERQ-30 telah dimasukkan dan diaktifkan.";
}

function doGet(e) {
  return handleRequest_(Object.assign({}, e && e.parameter ? e.parameter : {}, { _method: "GET" }));
}

function doPost(e) {
  let body = {};
  try { body = e && e.postData && e.postData.contents ? JSON.parse(e.postData.contents) : {}; }
  catch (error) { return json_({ ok: false, error: "Payload JSON tidak valid." }); }
  return handleRequest_(Object.assign({}, e && e.parameter ? e.parameter : {}, body, { _method: "POST" }));
}

function handleRequest_(payload) {
  try {
    verifyApiSecret_(payload.apiSecret);
    const action = String(payload.action || "");
    const routes = {
      health: () => ({ status: "ok" }),
      register: () => register_(payload),
      login: () => login_(payload),
      logout: () => logout_(payload),
      getProfile: () => getProfile_(payload),
      saveBiodata: () => saveBiodata_(payload),
      startAssessment: () => startAssessment_(payload),
      saveAssessment: () => saveAssessment_(payload),
      submitAssessment: () => submitAssessment_(payload),
      getMyResult: () => getMyResult_(payload),
      getMaterials: () => getMaterials_(payload),
      adminDashboard: () => adminDashboard_(payload),
      adminUsers: () => adminUsers_(payload),
      adminUserDetail: () => adminUserDetail_(payload),
      adminResponses: () => adminResponses_(payload),
      adminResults: () => adminResults_(payload),
      adminInstrument: () => adminInstrument_(payload),
      exportData: () => exportData_(payload)
    };
    if (!routes[action]) throw new Error("Action API tidak dikenal.");
    return json_({ ok: true, data: routes[action]() });
  } catch (error) {
    return json_({ ok: false, error: error && error.message ? error.message : "Terjadi kesalahan pada server." });
  }
}

function register_(payload) {
  requireFields_(payload, ["name", "email", "password"]);
  const name = String(payload.name).trim();
  const email = normalizeEmail_(payload.email);
  const password = String(payload.password);
  if (name.length < 2) throw new Error("Nama terlalu pendek.");
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error("Alamat email tidak valid.");
  if (password.length < 8) throw new Error("Password minimal 8 karakter.");
  if (findBy_("Users", "email", email)) throw new Error("Email sudah terdaftar.");

  const now = now_();
  const salt = randomToken_().slice(0, 48);
  const user = {
    id: makeId_("USR"), name, email,
    password_hash: hashPassword_(password, salt), password_salt: salt,
    role: "user", status: "active", created_at: now, updated_at: now
  };
  appendObject_("Users", user);
  return createSessionResponse_(user);
}

function login_(payload) {
  requireFields_(payload, ["email", "password"]);
  const user = findBy_("Users", "email", normalizeEmail_(payload.email));
  if (!user || user.status !== "active" || !constantTimeEqual_(user.password_hash, hashPassword_(String(payload.password), user.password_salt))) {
    throw new Error("Email atau password tidak sesuai.");
  }
  if (payload.requireRole && user.role !== payload.requireRole) throw new Error("Akun ini tidak memiliki akses admin.");
  return createSessionResponse_(user);
}

function logout_(payload) {
  if (payload.token) PropertiesService.getScriptProperties().deleteProperty(sessionKey_(payload.token));
  return { loggedOut: true };
}

function getProfile_(payload) {
  const user = requireUser_(payload.token);
  const biodata = findBy_("Biodata", "user_id", user.id);
  const assessment = latestByUser_("Assessments", user.id);
  return { user: safeUser_(user), biodata: biodata || null, assessment: assessment || null };
}

function saveBiodata_(payload) {
  const user = requireUser_(payload.token);
  const data = payload.biodata || {};
  const clean = {};
  BIODATA_FIELDS.forEach(key => clean[key] = data[key] == null ? "" : String(data[key]).trim());
  if (!clean.nama) clean.nama = user.name;
  if (clean.usia && (!Number.isInteger(Number(clean.usia)) || Number(clean.usia) < 12 || Number(clean.usia) > 120)) throw new Error("Usia tidak valid.");
  const existing = findBy_("Biodata", "user_id", user.id);
  const now = now_();
  const record = Object.assign({}, existing || {}, clean, {
    id: existing ? existing.id : makeId_("BIO"), user_id: user.id,
    created_at: existing ? existing.created_at : now, updated_at: now
  });
  upsertObject_("Biodata", "user_id", user.id, record);
  return record;
}

function startAssessment_(payload) {
  const user = requireUser_(payload.token);
  const all = rowsAsObjects_("Assessments").filter(row => row.user_id === user.id);
  let assessment = all.filter(row => row.status === "in_progress").sort(sortNewest_)[0];
  if (!assessment) {
    const completed = all.filter(row => row.status === "completed").sort(sortNewest_)[0];
    if (completed && !payload.allowRepeat) assessment = completed;
  }
  if (!assessment || (assessment.status === "completed" && payload.allowRepeat)) {
    const now = now_();
    assessment = { id: makeId_("ASM"), user_id: user.id, status: "in_progress", started_at: now, completed_at: "", created_at: now };
    appendObject_("Assessments", assessment);
  }
  const response = findBy_("Responses", "assessment_id", assessment.id);
  const questions = rowsAsObjects_("Questions").filter(row => truthy_(row.is_active) && String(row.question_text_en).trim()).sort((a, b) => Number(a.question_number) - Number(b.question_number));
  return { assessment, answers: responseToAnswers_(response), questions };
}

function saveAssessment_(payload) {
  const user = requireUser_(payload.token);
  requireFields_(payload, ["assessmentId"]);
  const assessment = findBy_("Assessments", "id", payload.assessmentId);
  if (!assessment || assessment.user_id !== user.id) throw new Error("Assessment tidak ditemukan.");
  if (assessment.status === "completed") throw new Error("Assessment sudah dikirim.");
  const existing = findBy_("Responses", "assessment_id", assessment.id);
  const answers = normalizeAnswers_(payload.answers || {});
  const record = Object.assign(emptyResponse_(assessment.id, user.id), existing || {}, answers, { updated_at: now_() });
  upsertObject_("Responses", "assessment_id", assessment.id, record);
  return { assessmentId: assessment.id, saved: Object.keys(responseToAnswers_(record)).length, updatedAt: record.updated_at };
}

function submitAssessment_(payload) {
  const user = requireUser_(payload.token);
  const assessment = findBy_("Assessments", "id", payload.assessmentId);
  if (!assessment || assessment.user_id !== user.id) throw new Error("Assessment tidak ditemukan.");
  if (assessment.status === "completed") return getResultForAssessment_(assessment.id, user.id);
  const existing = findBy_("Responses", "assessment_id", assessment.id);
  const record = Object.assign(emptyResponse_(assessment.id, user.id), existing || {}, normalizeAnswers_(payload.answers || {}));
  const answers = responseToAnswers_(record);
  if (Object.keys(answers).length !== 30) throw new Error("Semua 30 pertanyaan harus dijawab sebelum dikirim.");
  record.updated_at = now_();
  record.submitted_at = record.updated_at;
  upsertObject_("Responses", "assessment_id", assessment.id, record);
  assessment.status = "completed";
  assessment.completed_at = record.submitted_at;
  upsertObject_("Assessments", "id", assessment.id, assessment);
  const result = calculateResult_(assessment.id, user.id, answers);
  upsertObject_("Results", "assessment_id", assessment.id, result);
  return decorateResult_(result);
}

function getMyResult_(payload) {
  const user = requireUser_(payload.token);
  const result = rowsAsObjects_("Results").filter(row => row.user_id === user.id).sort((a, b) => String(b.calculated_at).localeCompare(String(a.calculated_at)))[0];
  return result ? decorateResult_(result) : null;
}

function getMaterials_() {
  return rowsAsObjects_("Materials").filter(row => row.status === "published").sort((a, b) => String(b.updated_at).localeCompare(String(a.updated_at)));
}

function adminDashboard_(payload) {
  requireAdmin_(payload.token);
  const users = rowsAsObjects_("Users").filter(row => row.role === "user");
  const assessments = rowsAsObjects_("Assessments");
  const completed = assessments.filter(row => row.status === "completed").length;
  const inProgress = assessments.filter(row => row.status === "in_progress").length;
  const notStarted = Math.max(users.length - new Set(assessments.map(row => row.user_id)).size, 0);
  return {
    totalUsers: users.length, completed, inProgress, notStarted,
    spreadsheetUrl: getSpreadsheet_().getUrl(),
    recent: adminUsersData_().sort((a, b) => String(b.updated_at).localeCompare(String(a.updated_at))).slice(0, 8)
  };
}

function adminUsers_(payload) { requireAdmin_(payload.token); return adminUsersData_(); }

function adminUserDetail_(payload) {
  requireAdmin_(payload.token);
  const user = findBy_("Users", "id", payload.userId);
  if (!user) throw new Error("Pengguna tidak ditemukan.");
  return {
    user: safeUser_(user), biodata: findBy_("Biodata", "user_id", user.id),
    assessments: rowsAsObjects_("Assessments").filter(row => row.user_id === user.id),
    results: rowsAsObjects_("Results").filter(row => row.user_id === user.id).map(decorateResult_)
  };
}

function adminResponses_(payload) { requireAdmin_(payload.token); return rowsAsObjects_("Responses"); }
function adminResults_(payload) { requireAdmin_(payload.token); return rowsAsObjects_("Results").map(decorateResult_); }
function adminInstrument_(payload) { requireAdmin_(payload.token); return rowsAsObjects_("Questions").sort((a, b) => Number(a.question_number) - Number(b.question_number)); }

function exportData_(payload) {
  requireAdmin_(payload.token);
  const kind = String(payload.kind || "combined");
  const data = {
    biodata: rowsAsObjects_("Biodata"),
    responses: rowsAsObjects_("Responses"),
    results: rowsAsObjects_("Results")
  };
  if (kind !== "combined") return { kind, rows: data[kind] || [], spreadsheetUrl: getSpreadsheet_().getUrl() };
  const users = rowsAsObjects_("Users");
  const biodataByUser = indexBy_(data.biodata, "user_id");
  const resultsByAssessment = indexBy_(data.results, "assessment_id");
  const userById = indexBy_(users, "id");
  const rows = data.responses.map(response => Object.assign(
    { respondent_id: response.user_id, respondent_email: userById[response.user_id] ? userById[response.user_id].email : "" },
    biodataByUser[response.user_id] || {}, response, resultsByAssessment[response.assessment_id] || {}
  ));
  return { kind, rows, spreadsheetUrl: getSpreadsheet_().getUrl() };
}

function calculateResult_(assessmentId, userId, answers) {
  const result = { assessment_id: assessmentId, user_id: userId };
  STRATEGIES.forEach(strategy => {
    const score = strategy.items.reduce((sum, number) => sum + Number(answers[`Q${String(number).padStart(2, "0")}`]), 0);
    result[strategy.key] = score;
    result[`${strategy.key}_category`] = score >= strategy.mean + strategy.sd ? "high" : score <= strategy.mean - strategy.sd ? "low" : "average";
  });
  result.calculated_at = now_();
  return result;
}

function decorateResult_(result) {
  return {
    assessmentId: result.assessment_id,
    userId: result.user_id,
    calculatedAt: result.calculated_at,
    normSource: "US general community adult normative sample (official ERQ-30 documentation)",
    strategies: STRATEGIES.map(strategy => ({
      key: strategy.key, label: strategy.label, score: Number(result[strategy.key]), min: 3, max: 21,
      mean: strategy.mean, sd: strategy.sd, category: result[`${strategy.key}_category`]
    }))
  };
}

function adminUsersData_() {
  const biodata = indexBy_(rowsAsObjects_("Biodata"), "user_id");
  const assessments = rowsAsObjects_("Assessments");
  return rowsAsObjects_("Users").filter(user => user.role === "user").map(user => {
    const latest = assessments.filter(item => item.user_id === user.id).sort(sortNewest_)[0];
    return Object.assign(safeUser_(user), biodata[user.id] || {}, {
      assessment_status: latest ? latest.status : "not_started",
      assessment_id: latest ? latest.id : "",
      updated_at: latest ? (latest.completed_at || latest.started_at) : user.updated_at
    });
  });
}

function createSessionResponse_(user) {
  const token = randomToken_();
  const expiresAt = Date.now() + SESSION_TTL_MS;
  PropertiesService.getScriptProperties().setProperty(sessionKey_(token), JSON.stringify({ userId: user.id, role: user.role, expiresAt }));
  return { token, expiresAt: new Date(expiresAt).toISOString(), user: safeUser_(user) };
}

function requireUser_(token) {
  if (!token) throw new Error("Sesi diperlukan.");
  const properties = PropertiesService.getScriptProperties();
  const key = sessionKey_(token);
  const raw = properties.getProperty(key);
  if (!raw) throw new Error("Sesi tidak valid atau sudah berakhir.");
  const session = JSON.parse(raw);
  if (Date.now() > Number(session.expiresAt)) { properties.deleteProperty(key); throw new Error("Sesi sudah berakhir."); }
  const user = findBy_("Users", "id", session.userId);
  if (!user || user.status !== "active") throw new Error("Akun tidak aktif.");
  return user;
}

function requireAdmin_(token) {
  const user = requireUser_(token);
  if (user.role !== "admin") throw new Error("Akses admin diperlukan.");
  return user;
}

function getResultForAssessment_(assessmentId, userId) {
  const result = findBy_("Results", "assessment_id", assessmentId);
  if (!result || result.user_id !== userId) throw new Error("Hasil belum tersedia.");
  return decorateResult_(result);
}

function normalizeAnswers_(answers) {
  const clean = {};
  Object.keys(answers).forEach(key => {
    const normalized = /^Q\d{2}$/.test(key) ? key : `Q${String(Number(key)).padStart(2, "0")}`;
    const number = Number(normalized.slice(1));
    const value = Number(answers[key]);
    if (number >= 1 && number <= 30 && Number.isInteger(value) && value >= 1 && value <= 7) clean[normalized] = value;
    else throw new Error(`Jawaban ${normalized} harus berupa angka 1–7.`);
  });
  return clean;
}

function emptyResponse_(assessmentId, userId) {
  const response = { assessment_id: assessmentId, user_id: userId };
  for (let i = 1; i <= 30; i += 1) response[`Q${String(i).padStart(2, "0")}`] = "";
  response.updated_at = ""; response.submitted_at = "";
  return response;
}

function responseToAnswers_(response) {
  const answers = {};
  if (!response) return answers;
  for (let i = 1; i <= 30; i += 1) {
    const key = `Q${String(i).padStart(2, "0")}`;
    if (response[key] !== "" && response[key] != null) answers[key] = Number(response[key]);
  }
  return answers;
}

function seedErq30Questions() {
  ensureSheet_(getSpreadsheet_(), "Questions", SHEETS.Questions);
  ERQ30_QUESTIONS.forEach(item => {
    const number = item[0];
    const id = `Q${String(number).padStart(2, "0")}`;
    upsertObject_("Questions", "id", id, {
      id,
      question_number: number,
      question_text_en: item[1],
      question_text_id: item[2],
      strategy: item[3],
      scale_min: 1,
      scale_max: 7,
      translation_status: "draft_translation",
      is_active: true
    });
  });
  return "30 item ERQ-30 bilingual berhasil dimasukkan tanpa duplikasi.";
}

function reseedErq30Questions() {
  const sheet = ensureSheet_(getSpreadsheet_(), "Questions", SHEETS.Questions);
  const lastRow = sheet.getLastRow();
  if (lastRow >= 2) {
    const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
    for (let index = ids.length - 1; index >= 0; index -= 1) {
      if (/^Q(?:0[1-9]|[12]\d|30)$/.test(String(ids[index][0]))) sheet.deleteRow(index + 2);
    }
  }
  seedErq30Questions();
  return "Baris Q01–Q30 telah diganti dengan dataset ERQ-30 bilingual terbaru. Sheet lain tidak diubah.";
}

function seedMaterials_() {
  if (rowsAsObjects_("Materials").length) return;
  const now = now_();
  [
    ["apa-itu-regulasi-emosi", "Apa Itu Regulasi Emosi?", "Mengenal proses yang membantu kita memahami, merasakan, dan merespons emosi.", "Regulasi emosi adalah proses yang kita gunakan untuk memengaruhi emosi yang dirasakan, kapan emosi muncul, serta bagaimana kita mengalami dan mengekspresikannya.\n\nTujuannya bukan selalu merasa baik, melainkan merespons dengan cara yang lebih selaras dengan keadaan dan kebutuhan."],
    ["respons-emosi-berbeda", "Mengapa Respons Emosi Setiap Orang Berbeda?", "Pengalaman, konteks, dan kebiasaan membuat respons kita tidak selalu sama.", "Respons emosi dipengaruhi pengalaman, kebiasaan, kondisi tubuh, dan konteks sosial. Perbedaan respons tidak otomatis berarti salah atau buruk.\n\nMembaca pola emosi akan lebih berguna bila dilakukan dengan rasa ingin tahu, bukan dengan menghakimi diri."],
    ["strategi-regulasi-emosi", "Mengenal Strategi Regulasi Emosi", "Satu situasi bisa dihadapi dengan banyak cara. Mari mengenalnya tanpa menghakimi.", "Sebuah strategi dapat terasa membantu dalam satu situasi, tetapi belum tentu cocok di situasi lain.\n\nHasil pengukuran perlu dibaca sebagai gambaran subskala yang muncul dari jawaban, bukan sebagai diagnosis atau penentu nilai diri."],
    ["tentang-erq-30", "Tentang Pengukuran ERQ-30", "Cara Emora menyajikan pengukuran secara nyaman dan bertanggung jawab.", "ERQ-30 melihat sepuluh strategi regulasi emosi. Setiap subskala dihitung terpisah dari tiga butir dengan rentang skor 3 sampai 21.\n\nEmora tidak menggunakan satu skor keseluruhan dan tidak menjadikan hasil sebagai diagnosis klinis."]
  ].forEach((item, index) => appendObject_("Materials", { id: `MAT-${String(index + 1).padStart(2, "0")}`, slug: item[0], title: item[1], summary: item[2], content: item[3], image: "", status: "published", created_at: now, updated_at: now }));
}

function getSpreadsheet_() {
  const id = PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");
  if (!id) throw new Error("SPREADSHEET_ID belum diatur pada Script Properties.");
  return SpreadsheetApp.openById(id);
}

function ensureSheet_(spreadsheet, name, headers) {
  let sheet = spreadsheet.getSheetByName(name);
  if (!sheet) sheet = spreadsheet.insertSheet(name);
  const current = sheet.getLastColumn() ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0] : [];
  if (!current.length || current.join("|") !== headers.join("|")) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight("bold").setBackground("#f1edff");
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, headers.length);
  }
  return sheet;
}

function rowsAsObjects_(sheetName) {
  const sheet = getSpreadsheet_().getSheetByName(sheetName);
  if (!sheet || sheet.getLastRow() < 2) return [];
  const values = sheet.getDataRange().getValues();
  const headers = values.shift().map(String);
  return values.filter(row => row.some(value => value !== "")).map(row => objectFromRow_(headers, row));
}

function appendObject_(sheetName, object) {
  const sheet = getSpreadsheet_().getSheetByName(sheetName);
  const headers = SHEETS[sheetName];
  const lock = LockService.getScriptLock(); lock.waitLock(15000);
  try { sheet.appendRow(headers.map(header => object[header] == null ? "" : object[header])); }
  finally { lock.releaseLock(); }
}

function upsertObject_(sheetName, key, value, object) {
  const sheet = getSpreadsheet_().getSheetByName(sheetName);
  const headers = SHEETS[sheetName];
  const keyIndex = headers.indexOf(key);
  const lock = LockService.getScriptLock(); lock.waitLock(15000);
  try {
    const lastRow = sheet.getLastRow();
    let rowNumber = 0;
    if (lastRow >= 2) {
      const values = sheet.getRange(2, keyIndex + 1, lastRow - 1, 1).getValues();
      const found = values.findIndex(row => String(row[0]) === String(value));
      if (found >= 0) rowNumber = found + 2;
    }
    const row = headers.map(header => object[header] == null ? "" : object[header]);
    if (rowNumber) sheet.getRange(rowNumber, 1, 1, headers.length).setValues([row]);
    else sheet.appendRow(row);
  } finally { lock.releaseLock(); }
}

function findBy_(sheetName, key, value) { return rowsAsObjects_(sheetName).find(row => String(row[key]) === String(value)) || null; }
function latestByUser_(sheetName, userId) { return rowsAsObjects_(sheetName).filter(row => row.user_id === userId).sort(sortNewest_)[0] || null; }
function sortNewest_(a, b) { return String(b.created_at || b.started_at || "").localeCompare(String(a.created_at || a.started_at || "")); }
function indexBy_(rows, key) { return rows.reduce((index, row) => { index[row[key]] = row; return index; }, {}); }
function objectFromRow_(headers, row) { return headers.reduce((object, header, index) => { object[header] = normalizeCell_(row[index]); return object; }, {}); }
function normalizeCell_(value) { return value instanceof Date ? value.toISOString() : value; }
function normalizeEmail_(email) { return String(email || "").trim().toLowerCase(); }
function truthy_(value) { return value === true || String(value).toLowerCase() === "true" || Number(value) === 1; }
function safeUser_(user) { return { id: user.id, name: user.name, email: user.email, role: user.role, status: user.status, created_at: user.created_at, updated_at: user.updated_at }; }
function now_() { return new Date().toISOString(); }
function makeId_(prefix) { return `${prefix}-${Date.now()}-${Utilities.getUuid().slice(0, 8)}`; }
function randomToken_() { return `${Utilities.getUuid()}.${Utilities.getUuid()}.${Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, `${Utilities.getUuid()}${Date.now()}${Math.random()}`))}`; }
function sessionKey_(token) { return `SESSION_${hexDigest_(String(token))}`; }
function hashPassword_(password, salt) { return Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature(String(password), `${salt}:${getAppSecret_()}`)); }
function hexDigest_(value) { return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, value).map(byte => (`0${(byte < 0 ? byte + 256 : byte).toString(16)}`).slice(-2)).join(""); }
function constantTimeEqual_(a, b) { a = String(a); b = String(b); if (a.length !== b.length) return false; let result = 0; for (let i = 0; i < a.length; i += 1) result |= a.charCodeAt(i) ^ b.charCodeAt(i); return result === 0; }
function getAppSecret_() { const secret = PropertiesService.getScriptProperties().getProperty("APP_SECRET"); if (!secret || secret.length < 32) throw new Error("APP_SECRET belum diatur atau terlalu pendek."); return secret; }
function verifyApiSecret_(secret) { if (!constantTimeEqual_(String(secret || ""), getAppSecret_())) throw new Error("Permintaan API tidak diizinkan."); }
function requireFields_(payload, fields) { fields.forEach(field => { if (payload[field] == null || String(payload[field]).trim() === "") throw new Error(`${field} wajib diisi.`); }); }
function json_(value) { return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON); }
