const STORAGE_KEY = "smarttex-system";
const CRITICAL_SEEN_KEY = "smarttex-critical-alerts-seen";
const launchParameters = new URLSearchParams(window.location.search);

if (launchParameters.has("fresh")) {
  localStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem(CRITICAL_SEEN_KEY);
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${window.location.hash || "#dashboard"}`
  );
}

const roleProfiles = {
  admin: {
    name: "مريم عادل",
    label: "مسؤول النظام",
    initials: "MA",
    description: "إدارة الهوية والصلاحيات والحسابات وتعيين الأدوار",
  },
  owner: {
    name: "علي الدين",
    label: "المالك / الرئيس التنفيذي",
    initials: "AD",
    description: "الموافقات والمتابعة والتقارير وسجل المراجعة",
  },
  manager: {
    name: "محمد بدوي",
    label: "المدير",
    initials: "MB",
    description: "إدارة المبيعات والمشتريات والموردين والأقساط والمدفوعات",
  },
  inventory: {
    name: "نور حسن",
    label: "مسؤول المخزون",
    initials: "NH",
    description: "إدارة المخزون والتحويلات وفروق الاستلام والجرد",
  },
  sales: {
    name: "سلمى علي",
    label: "موظف المبيعات",
    initials: "SA",
    description: "طلبات العملاء وتسجيل المبيعات والاستلام ومهام المخزون",
  },
};

const navigation = {
  admin: [
    ["dashboard", "لوحة التحكم", "DB"],
    ["access", "المستخدمون والصلاحيات", "IA"],
    ["settings", "حدود المخزون", "ST"],
    ["audit", "سجل المراجعة", "AU"],
  ],
  owner: [
    ["dashboard", "لوحة التحكم", "DB"],
    ["approvals", "الموافقات", "AP"],
    ["reports", "التقارير", "RP"],
    ["audit", "سجل المراجعة", "AU"],
  ],
  manager: [
    ["dashboard", "لوحة التحكم", "DB"],
    ["alerts", "قائمة التنبيهات", "AL"],
    ["sales", "تأكيدات المبيعات", "SL"],
    ["purchasing", "أوامر الشراء", "PO"],
    ["invoices", "الأقساط والمدفوعات", "IN"],
    ["reports", "التقارير", "RP"],
  ],
  inventory: [
    ["dashboard", "لوحة التحكم", "DB"],
    ["inventory", "المخزون", "IV"],
    ["receiving", "الاستلام", "RC"],
    ["counts", "الجرد وحالة القماش", "CT"],
  ],
  sales: [
    ["dashboard", "لوحة التحكم", "DB"],
    ["availability", "بحث التوفر", "AV"],
    ["sales", "مبيعات العملاء", "SL"],
    ["transfers", "تحويلات المعرض", "TR"],
    ["receiving", "استلام شحنة", "RC"],
    ["counts", "مهام المخزون", "CT"],
  ],
};

const scenarioSteps = [
  { role: "sales", title: "تسجيل طلب بيع", detail: "أنجيليكا · كحلي · 8 أمتار" },
  { role: "manager", title: "تأكيد عملية البيع", detail: "رصيد المعرض يصبح 22 مترًا" },
  { role: "sales", title: "تحويل مخزون للمعرض", detail: "نقل 50 مترًا من المخزن" },
  { role: "inventory", title: "إرسال توصية إعادة الطلب", detail: "التحقق من النقص وإرسال كمية مقترحة للمدير" },
  { role: "manager", title: "إنشاء أمر شراء", detail: "طلب شراء عاجل معبأ مسبقًا من توصية النظام" },
  { role: "owner", title: "الموافقة على أمر الشراء", detail: "الموافقة على PO-1048" },
  { role: "manager", title: "متابعة أمر الشراء مع المورد", detail: "إرسال الأمر المعتمد وتسجيل تأكيد المورد" },
  { role: "sales", title: "تسجيل استلام الشحنة", detail: "تسجيل الطوب والأمتار المستلمة" },
  { role: "inventory", title: "إدارة فرق الاستلام", detail: "النظام يكتشف فرق 5 أمتار تلقائيًا" },
  { role: "manager", title: "إعداد جدول أقساط أمر الشراء", detail: "تحديد عدد الأقساط ومواعيدها بعد استلام الشحنة" },
  { role: "owner", title: "الموافقة على دفعة المورد", detail: "الموافقة على الدفعة الأولى" },
];

const salePurposes = {
  evening: {
    label: "فستان سهرة أو مناسبة",
    fabrics: ["أنجيليكا", "ستان ألتا مودا", "حرير ستان", "ستان تركي", "كريب رويال", "روزالين", "كريب باربي"],
  },
  blouse: {
    label: "بلوزة أو قميص",
    fabrics: ["شيفون سادة", "شيفون مشجر", "حرير ستان", "كريب مشجر", "سوفت مشجر", "جوميه"],
  },
  tailoring: {
    label: "بدلة أو جاكيت أو بنطلون",
    fabrics: ["كتان فرنسي سادة", "كتان إسباني سادة", "جينز", "صوف جوخ", "صوف مبرد", "صوف تويد مشجر"],
  },
  winter: {
    label: "معطف أو ملابس شتوية",
    fabrics: ["ميلتون", "سمر ميلتون سادة", "صوف مشعر سادة", "صوف جوخ", "صوف تريكو مشجر", "صوف عجينة مشجر"],
  },
  stretch: {
    label: "فستان أو قطعة مرنة",
    fabrics: ["تول سترتش", "روزالين", "جوميه", "كريب باربي", "سوفت مشجر"],
  },
  decoration: {
    label: "تزيين أو طبقات شفافة",
    fabrics: ["تول قطن", "تول سترتش", "شيفون سادة", "شيفون مشجر", "ستان مشجر"],
  },
  printed: {
    label: "ملابس منقوشة أو مشجرة",
    fabrics: ["كريب مشجر", "شيفون مشجر", "ستان مشجر", "كتان مشجر", "سوفت مشجر", "صوف تويد مشجر", "صوف تريكو مشجر", "صوف عجينة مشجر"],
  },
};

function salePurposeOptions(selected = "") {
  return Object.entries(salePurposes)
    .map(([value, purpose]) => `<option value="${value}" ${value === selected ? "selected" : ""}>${purpose.label}</option>`)
    .join("");
}

function seedState() {
  return {
    role: "manager",
    route: "dashboard",
    day: 0,
    thresholds: {
      showroom: 25,
      lastPull: 30,
    },
    reorderRecommendations: [],
    customers: [
      { phone: "01012345678", name: "أحمد محمود", type: "عميل عادي" },
      { phone: "01123456789", name: "منى حسن", type: "ترزي" },
    ],
    suppliers: [
      { name: "شركة النور للأقمشة", leadDays: 9, unitPrice: 330, fabrics: ["أنجيليكا", "ستان ألتا مودا", "شمواه سويدي", "ستان تركي", "ستان مشجر"] },
      { name: "الشرق للنسيج", leadDays: 14, unitPrice: 320, fabrics: ["أنجيليكا", "شيفون سادة", "حرير ستان", "تول قطن", "جوميه", "شيفون مشجر", "سوفت مشجر"] },
      { name: "المصرية للأقمشة", leadDays: 12, unitPrice: 315, fabrics: ["شيفون سادة", "روزالين", "كريب رويال", "SBH", "كريب باربي", "كريب مشجر"] },
      { name: "القاهرة للنسيج", leadDays: 7, unitPrice: 345, fabrics: ["كتان فرنسي سادة", "جينز", "صوف جوخ", "كتان إسباني سادة", "صوف مبرد", "كتان مشجر", "صوف تويد مشجر"] },
      { name: "دلتا للأقمشة", leadDays: 11, unitPrice: 300, fabrics: ["تول سترتش", "ميلتون", "كريب باربي", "صوف مشعر سادة", "صوف تريكو مشجر", "صوف عجينة مشجر", "سمر ميلتون سادة"] },
    ],
    scenarioStep: 0,
    inventory: [
      { id: 1, fabric: "أنجيليكا", color: "كحلي", showroom: 30, warehouse: 80, reserve: 35, rate: 9.4, salePrice: 420, status: "متوفر" },
      { id: 2, fabric: "روزالين", color: "نبيتي", showroom: 64, warehouse: 190, reserve: 40, rate: 4.1, salePrice: 380, status: "متوفر" },
      { id: 3, fabric: "شيفون سادة", color: "أوف وايت", showroom: 26, warehouse: 42, reserve: 30, rate: 7.8, salePrice: 290, status: "منخفض" },
      { id: 4, fabric: "كتان فرنسي سادة", color: "زيتي", showroom: 92, warehouse: 260, reserve: 45, rate: 2.7, status: "متوفر" },
      { id: 5, fabric: "ستان ألتا مودا", color: "أسود", showroom: 18, warehouse: 0, reserve: 25, rate: 8.6, status: "حرج" },
      { id: 6, fabric: "شمواه سويدي", color: "أخضر زمردي", showroom: 48, warehouse: 105, reserve: 30, rate: 3.2, status: "متوفر" },
      { id: 7, fabric: "كريب رويال", color: "رمادي", showroom: 55, warehouse: 140, reserve: 35, rate: 5.6, status: "متوفر" },
      { id: 8, fabric: "تول سترتش", color: "بيج", showroom: 44, warehouse: 95, reserve: 30, rate: 3.9, status: "متوفر" },
      { id: 9, fabric: "جينز", color: "أزرق غامق", showroom: 38, warehouse: 120, reserve: 35, rate: 4.8, status: "متوفر" },
      { id: 10, fabric: "ميلتون", color: "بني", showroom: 50, warehouse: 170, reserve: 40, rate: 4.4, status: "متوفر" },
      { id: 11, fabric: "صوف جوخ", color: "فحمي", showroom: 41, warehouse: 130, reserve: 35, rate: 6.2, status: "متوفر" },
      { id: 12, fabric: "SBH", color: "موف", showroom: 36, warehouse: 85, reserve: 30, rate: 3.5, status: "متوفر" },
      { id: 13, fabric: "كريب باربي", color: "وردي", showroom: 62, warehouse: 155, reserve: 35, rate: 4.9, status: "متوفر" },
      { id: 14, fabric: "ستان تركي", color: "أحمر", showroom: 47, warehouse: 125, reserve: 30, rate: 4.2, status: "متوفر" },
      { id: 15, fabric: "حرير ستان", color: "ذهبي", showroom: 39, warehouse: 110, reserve: 30, rate: 3.8, status: "متوفر" },
      { id: 16, fabric: "تول قطن", color: "أبيض", showroom: 58, warehouse: 145, reserve: 35, rate: 3.1, status: "متوفر" },
      { id: 17, fabric: "جوميه", color: "سكري", showroom: 45, warehouse: 115, reserve: 30, rate: 3.6, status: "متوفر" },
      { id: 18, fabric: "كتان إسباني سادة", color: "بيج", showroom: 34, warehouse: 70, reserve: 30, rate: 2.2, status: "متوفر" },
      { id: 19, fabric: "صوف مشعر سادة", color: "رمادي فاتح", showroom: 42, warehouse: 100, reserve: 30, rate: 4.1, status: "متوفر" },
      { id: 20, fabric: "صوف مبرد", color: "أسود", showroom: 38, warehouse: 96, reserve: 30, rate: 3.7, status: "متوفر" },
      { id: 21, fabric: "كريب مشجر", color: "متعدد الألوان", showroom: 52, warehouse: 135, reserve: 35, rate: 5.2, status: "متوفر" },
      { id: 22, fabric: "شيفون مشجر", color: "وردي مشجر", showroom: 49, warehouse: 128, reserve: 35, rate: 5.0, status: "متوفر" },
      { id: 23, fabric: "ستان مشجر", color: "أزرق مشجر", showroom: 37, warehouse: 90, reserve: 30, rate: 3.3, status: "متوفر" },
      { id: 24, fabric: "كتان مشجر", color: "زيتي مشجر", showroom: 43, warehouse: 105, reserve: 30, rate: 3.4, status: "متوفر" },
      { id: 25, fabric: "سوفت مشجر", color: "موف مشجر", showroom: 46, warehouse: 112, reserve: 30, rate: 3.8, status: "متوفر" },
      { id: 26, fabric: "صوف تويد مشجر", color: "بني مشجر", showroom: 40, warehouse: 98, reserve: 30, rate: 3.6, status: "متوفر" },
      { id: 27, fabric: "صوف تريكو مشجر", color: "كحلي مشجر", showroom: 35, warehouse: 88, reserve: 30, rate: 3.9, status: "متوفر" },
      { id: 28, fabric: "صوف عجينة مشجر", color: "رمادي مشجر", showroom: 44, warehouse: 108, reserve: 30, rate: 3.5, status: "متوفر" },
      { id: 29, fabric: "سمر ميلتون سادة", color: "جملي", showroom: 48, warehouse: 118, reserve: 30, rate: 3.2, status: "متوفر" },
    ],
    alerts: [
      { id: 1, audience: ["manager", "owner"], severity: "critical", title: "دفعة مورد مستحقة اليوم", detail: "شركة النور للأقمشة · 31,500 جنيه · يجب اتخاذ قرار السداد اليوم", action: "إدارة دفعة اليوم", type: "payment-due", scheduleId: "SCH-1046", approvalId: "APR-310" },
      { id: 6, audience: ["manager"], severity: "approaching", title: "موعد دفعة مورد يقترب", detail: "المصرية للأقمشة · 22,000 جنيه · متبقي 5 أيام · تواصل مع المورد أو ابدأ الموافقة", action: "متابعة الموعد", type: "payment-approaching", scheduleId: "SCH-1047" },
      { id: 2, audience: ["inventory"], severity: "urgent", title: "إعادة الطلب مطلوبة للحفاظ على التوفر", detail: "أنجيليكا · كحلي · ابدأ طلب التوريد وفق معدل المبيعات ومدة المورد", action: "إدارة إعادة الطلب", type: "reorder", inventoryId: 1 },
      { id: 3, audience: ["manager"], severity: "approaching", title: "موعد توريد يقترب", detail: "PO-1047 · المصرية للأقمشة · متوقع غدًا", action: "إدارة التوريد", type: "delivery" },
      { id: 4, audience: ["inventory"], severity: "urgent", title: "إعادة طلب ستان ألتا مودا مطلوبة الآن", detail: "ستان ألتا مودا · أسود · ابدأ طلب التوريد للحفاظ على استمرارية التوفر", action: "إدارة إعادة الطلب", type: "reorder", inventoryId: 5 },
      { id: 5, audience: ["sales"], severity: "approaching", title: "المعرض يحتاج إلى تزويد", detail: "شيفون سادة · أوف وايت · الكمية 26 مترًا", action: "تحويل مخزون", type: "transfer" },
    ],
    sales: [
      { id: "SAL-2081", staff: "سلمى علي", fabric: "روزالين", color: "نبيتي", meters: 12, status: "بانتظار التأكيد", time: "10:22 ص" },
      { id: "SAL-2080", staff: "عمر خالد", fabric: "شمواه سويدي", color: "أخضر زمردي", meters: 6, status: "مؤكد", time: "9:45 ص" },
    ],
    purchaseOrders: [
      { id: "PO-1047", date: "22 أكتوبر 2026", supplier: "المصرية للأقمشة", fabric: "شيفون سادة", color: "أوف وايت", quantity: 220, total: 68200, status: "بانتظار المورد", delivery: "غدًا" },
      { id: "PO-1046", date: "18 أكتوبر 2026", supplier: "شركة النور للأقمشة", fabric: "ستان ألتا مودا", color: "أسود", quantity: 300, total: 94500, status: "معتمد", delivery: "28 أكتوبر" },
    ],
    invoices: [
      { id: "SCH-1046", supplier: "شركة النور للأقمشة", po: "PO-1046", installments: 3, total: 94500, paid: 31500, due: "اليوم", status: "يستحق اليوم", cadence: "كل أسبوعين" },
      { id: "SCH-1047", supplier: "المصرية للأقمشة", po: "PO-1047", installments: 3, total: 68200, paid: 0, due: "بعد 5 أيام", status: "يقترب", cadence: "كل شهر" },
      { id: "SCH-1041", supplier: "المصرية للأقمشة", po: "PO-1041", installments: 1, total: 61000, paid: 61000, due: "مدفوع", status: "مدفوع", cadence: "دفعة واحدة" },
    ],
    approvals: [
      { id: "APR-310", type: "دفعة مورد", request: "SCH-1046 · الدفعة الثانية", amount: 31500, requestedBy: "محمد بدوي", status: "قيد الانتظار", comments: [{ by: "محمد بدوي", role: "المدير", time: "اليوم", text: "دفعة مستحقة اليوم وفق الجدول المتفق عليه." }] },
      { id: "APR-309", type: "أمر شراء", request: "PO-1046 · ستان ألتا مودا / أسود", amount: 94500, requestedBy: "محمد بدوي", status: "معتمد", comments: [] },
    ],
    receipts: [
      { id: "REC-778", po: "PO-1045", supplier: "القاهرة للنسيج", expected: 180, received: 175, result: "يوجد فرق", detail: "نقص 5 أمتار" },
      { id: "REC-777", po: "PO-1044", supplier: "دلتا للأقمشة", expected: 240, received: 240, result: "متطابق", detail: "تم التحقق تلقائيًا" },
    ],
    users: [
      { name: "مريم عادل", role: "مسؤول النظام", access: "الهوية والصلاحيات", status: "نشط" },
      { name: "علي الدين", role: "المالك / الرئيس التنفيذي", access: "الموافقات والعرض", status: "نشط" },
      { name: "محمد بدوي", role: "المدير", access: "العمليات التجارية", status: "نشط" },
      { name: "نور حسن", role: "مسؤول المخزون", access: "عمليات المخزون", status: "نشط" },
      { name: "سلمى علي", role: "موظف المبيعات", access: "المبيعات والمهام المسندة", status: "نشط" },
    ],
    audit: [
      { time: "اليوم، 10:31 ص", user: "النظام", action: "تمت مطابقة الاستلام REC-777 تلقائيًا", record: "PO-1044" },
      { time: "اليوم، 10:24 ص", user: "محمد بدوي", action: "أكد عملية بيع للعميل", record: "SAL-2080" },
      { time: "اليوم، 9:50 ص", user: "علي الدين", action: "وافق على أمر الشراء", record: "PO-1046" },
      { time: "أمس، 4:18 م", user: "مريم عادل", action: "عيّن دور مسؤول المخزون", record: "نور حسن" },
    ],
  };
}

let state = loadState();
let activeAlertQueue = [];
let activeAlertQueueIndex = 0;
let activeAlertQueueDestination = "dashboard";
let suppressCriticalPopupOnce = false;
let seenCriticalAlerts = loadSeenCriticalAlerts();

function loadSeenCriticalAlerts() {
  try {
    return new Set(JSON.parse(sessionStorage.getItem(CRITICAL_SEEN_KEY) || "[]"));
  } catch {
    sessionStorage.removeItem(CRITICAL_SEEN_KEY);
    return new Set();
  }
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...seedState(), ...JSON.parse(saved) } : seedState();
  } catch {
    return seedState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function resetCriticalPopupHistory() {
  seenCriticalAlerts = new Set();
  sessionStorage.removeItem(CRITICAL_SEEN_KEY);
}

function resetPriorityPopupForRole(role) {
  seenCriticalAlerts = new Set(
    [...seenCriticalAlerts].filter((key) => !key.startsWith(`${role}:`))
  );
  sessionStorage.setItem(CRITICAL_SEEN_KEY, JSON.stringify([...seenCriticalAlerts]));
}

const main = document.querySelector("#main-content");
const nav = document.querySelector("#primary-nav");
const pageTitle = document.querySelector("#page-title");
const roleSelect = document.querySelector("#role-select");
const modal = document.querySelector("#modal");

function money(value) {
  return new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  }).format(value);
}

function statusClass(value) {
  const normalized = value.toLowerCase().replaceAll(" ", "-");
  if (normalized.includes("pending") || normalized.includes("قيد-الانتظار")) return "status-pending";
  if (normalized.includes("awaiting") || normalized.includes("بانتظار")) return "status-awaiting";
  if (normalized.includes("approve") || normalized.includes("معتمد") || normalized.includes("مؤكد")) return "status-approved";
  if (normalized.includes("paid") || normalized.includes("مدفوع")) return "status-paid";
  if (normalized.includes("match") || normalized.includes("متطابق")) return "status-matched";
  if (normalized.includes("difference") || normalized.includes("فرق")) return "status-critical";
  if (normalized.includes("urgent") || normalized.includes("عاجل")) return "status-urgent";
  if (normalized.includes("critical") || normalized.includes("حرج")) return "status-critical";
  if (normalized.includes("overdue") || normalized.includes("متأخر")) return "status-overdue";
  return "status-info";
}

function renderNav() {
  nav.innerHTML = navigation[state.role]
    .map(([route, label, icon], index) => `
      <a class="nav-link" href="#${route}" data-route="${route}"
         aria-keyshortcuts="Alt+${index + 1}" title="${label} — Alt+${index + 1}"
         ${state.route === route ? 'aria-current="page"' : ""}>
        <span class="nav-icon" aria-hidden="true">${icon}</span>
        <span>${label}</span>
        <kbd class="nav-shortcut" aria-hidden="true">Alt+${index + 1}</kbd>
      </a>
    `)
    .join("");
}

function updateIdentity() {
  const profile = roleProfiles[state.role];
  roleSelect.value = state.role;
  document.querySelector("#user-name").textContent = profile.name;
  document.querySelector("#user-role").textContent = profile.label;
  document.querySelector("#user-initials").textContent = profile.initials;
  const count = state.alerts.filter((alert) => alert.audience.includes(state.role)).length;
  document.querySelector("#notification-count").textContent = count;
}

const ARABIC_UI = new Map([
  ["Dashboard", "لوحة التحكم"],
  ["Connected workflow", "سير العمل المترابط"],
  ["Workflow completed", "اكتمل سير العمل"],
  ["Perform this step", "تنفيذ هذه الخطوة"],
  ["Start a new workflow", "بدء دورة عمل جديدة"],
  ["Priority work", "الأعمال ذات الأولوية"],
  ["Color and text labels identify urgency.", "يتم توضيح درجة الأهمية بالنص واللون معًا."],
  ["Open all alerts", "فتح كل التنبيهات"],
  ["Active workflow", "سير العمل الحالي"],
  ["Completed", "مكتمل"],
  ["Current", "الحالي"],
  ["Next", "التالي"],
  ["Critical", "حرج"],
  ["Urgent", "عاجل"],
  ["Approaching", "يقترب"],
  ["Information", "معلومات"],
  ["Today's alerts", "تنبيهات اليوم"],
  ["Select critical alerts to manage now", "اختار التنبيهات الحرجة اللي هتتعامل معاها دلوقتي"],
  ["Manage selected alerts", "إدارة التنبيهات المحددة"],
  ["Remind me later", "ذكرني لاحقًا"],
  ["Defer and open next", "تأجيل وفتح التالي"],
  ["Complete and open next", "إكمال وفتح التالي"],
  ["Immediate action recommended", "يوصى بإجراء فوري"],
  ["Recommended action", "الإجراء المقترح"],
  ["Resolution note", "ملاحظة الإجراء"],
  ["Manage alerts and build your work queue", "إدارة التنبيهات وتكوين قائمة العمل"],
  ["Select the items you need to handle now. The system will open selected alerts one by one.", "اختار التنبيهات اللي محتاج تتعامل معاها دلوقتي، والنظام هيفتحها واحدة واحدة."],
  ["Start selected tasks", "بدء المهام المحددة"],
  ["Check fabric and color availability", "التحقق من توفر الخامة واللون"],
  ["Select a fabric and then a color. The color choices are filtered from recorded inventory.", "اختار الخامة ثم اللون، وهتظهر الألوان المسجلة للخامة فقط."],
  ["Fabric", "الخامة"],
  ["Color", "اللون"],
  ["Select a fabric", "اختار الخامة"],
  ["Select fabric first", "اختار الخامة أولًا"],
  ["Select a color", "اختار اللون"],
  ["Check availability", "التحقق من التوفر"],
  ["Select fabric and color", "اختار الخامة واللون"],
  ["Showroom and warehouse quantities will appear here.", "هتظهر هنا كميات المعرض والمخزن."],
  ["Availability is calculated from confirmed inventory movements.", "التوفر محسوب من حركات المخزون المؤكدة."],
  ["Available", "متوفر"],
  ["Not available in showroom", "غير متوفر في المعرض"],
  ["Start customer sale", "بدء عملية بيع"],
  ["Inventory by fabric, color, and location", "المخزون حسب الخامة واللون والموقع"],
  ["Quantities are shown separately for the showroom and warehouse. Status labels do not rely on color alone.", "تظهر كميات المعرض والمخزن بشكل منفصل، ويتم توضيح الحالة بالنص واللون."],
  ["Start stock count", "بدء جرد المخزون"],
  ["Showroom", "المعرض"],
  ["Warehouse", "المخزن"],
  ["Customer sales", "مبيعات العملاء"],
  ["Manage customer sale confirmations", "إدارة تأكيدات مبيعات العملاء"],
  ["Confirming a sale atomically reduces showroom stock and may generate a replenishment alert.", "تأكيد البيع يخصم الكمية من المعرض مرة واحدة وقد ينشئ تنبيه تزويد."],
  ["Select fabric, color, and meters with minimum keyboard input.", "اختار الخامة واللون والأمتار بأقل قدر من الكتابة."],
  ["New customer sale", "عملية بيع جديدة"],
  ["Recent customer sale requests", "أحدث طلبات البيع"],
  ["ID", "الرقم"],
  ["Fabric / color", "الخامة / اللون"],
  ["Meters", "الأمتار"],
  ["Submitted by", "مقدم الطلب"],
  ["Status", "الحالة"],
  ["Action", "الإجراء"],
  ["Manage sale", "إدارة البيع"],
  ["View details", "عرض التفاصيل"],
  ["Showroom replenishment", "تزويد المعرض"],
  ["Transfer stock from the warehouse when showroom stock reaches the configured threshold.", "تحويل كمية من المخزن عندما يصل رصيد المعرض إلى الحد المحدد."],
  ["Items requiring showroom replenishment", "الخامات التي تحتاج إلى تزويد المعرض"],
  ["Suggested transfer", "الكمية المقترحة"],
  ["Transfer stock", "تحويل مخزون"],
  ["Manage purchase orders", "إدارة أوامر الشراء"],
  ["Reorder alerts prefill the fabric, color, and suggested quantity. Supplier options come from recorded supplier data.", "تنبيه إعادة الطلب يعبئ الخامة واللون والكمية المقترحة، ويعرض الموردين المسجلين."],
  ["Create purchase order", "إنشاء أمر شراء"],
  ["Purchase-order workflow status", "حالة سير أوامر الشراء"],
  ["Supplier", "المورد"],
  ["Quantity", "الكمية"],
  ["Total", "الإجمالي"],
  ["Manage PO", "إدارة أمر الشراء"],
  ["Manage supplier installments and payments", "إدارة أقساط ومدفوعات الموردين"],
  ["Installment tracking begins after the purchase order is received.", "يبدأ تتبع الأقساط بعد استلام أمر الشراء."],
  ["Supplier installment and payment status", "حالة أقساط ومدفوعات الموردين"],
  ["Schedule", "الجدول"],
  ["Supplier / PO", "المورد / أمر الشراء"],
  ["Paid", "المدفوع"],
  ["Next due", "الاستحقاق التالي"],
  ["Manage installments", "إدارة الأقساط"],
  ["Record supplier shipment", "تسجيل شحنة مورد"],
  ["Manage receiving and exceptions", "إدارة الاستلام والفروق"],
  ["Record actual rolls and meters. The system compares the received quantity with the purchase order.", "سجل الطوب والأمتار الفعلية، والنظام يقارن الكمية المستلمة بأمر الشراء."],
  ["Matching receipts verify automatically. Only detected differences require human action.", "يتم اعتماد الاستلام المتطابق تلقائيًا، والفروق فقط تحتاج تدخل المستخدم."],
  ["Record shipment", "تسجيل الشحنة"],
  ["Recent automatic receipt comparisons", "أحدث مقارنات الاستلام التلقائية"],
  ["Receipt", "الاستلام"],
  ["Expected", "المتوقع"],
  ["Received", "المستلم"],
  ["System result", "نتيجة النظام"],
  ["Manage exception", "إدارة الفرق"],
  ["View comparison", "عرض المقارنة"],
  ["Approvals", "الموافقات"],
  ["The Owner approves or rejects requests but does not perform operational data entry.", "المالك يوافق أو يرفض الطلبات ولا يقوم بإدخال البيانات التشغيلية."],
  ["Requests awaiting or recently receiving an Owner decision", "الطلبات المعلقة وأحدث قرارات المالك"],
  ["Request", "الطلب"],
  ["Type", "النوع"],
  ["Details", "التفاصيل"],
  ["Amount", "القيمة"],
  ["Requested by", "مقدم الطلب"],
  ["Decision", "القرار"],
  ["Decision recorded", "تم تسجيل القرار"],
  ["Identity and access administration", "إدارة الهوية والصلاحيات"],
  ["Admin manages accounts and role assignments. Owner access is limited to approvals and viewing.", "مسؤول النظام يدير الحسابات والأدوار، وصلاحيات المالك للموافقات والعرض فقط."],
  ["Add user", "إضافة مستخدم"],
  ["System users and assigned access", "المستخدمون والصلاحيات المسندة"],
  ["User", "المستخدم"],
  ["Role", "الدور"],
  ["Access scope", "نطاق الصلاحيات"],
  ["Manage access", "إدارة الصلاحيات"],
  ["Assigned stock tasks", "مهام المخزون المسندة"],
  ["Manage counts and stock condition", "إدارة الجرد وحالة القماش"],
  ["Physical differences, remnants, and damage are recorded with a reason and routed to the correct approval level.", "يتم تسجيل فروق الجرد والبواقي والتالف مع السبب وإرسالها لمستوى الموافقة الصحيح."],
  ["Record count", "تسجيل الجرد"],
  ["Assign stock count", "إسناد مهمة جرد"],
  ["Count assigned", "تم إسناد الجرد"],
  ["Physical quantity", "الكمية الفعلية"],
  ["Difference detected", "تم اكتشاف فرق"],
  ["Manage adjustment", "إدارة التسوية"],
  ["Reports and business visibility", "التقارير ومتابعة النشاط"],
  ["Read-only summaries support Owner and Manager decisions.", "ملخصات للعرض فقط تدعم قرارات المالك والمدير."],
  ["Fast-moving combinations", "الخامات والألوان سريعة الحركة"],
  ["Calculated from confirmed sales history.", "محسوبة من تاريخ المبيعات المؤكدة."],
  ["Fabric colors ordered by average daily sales", "الخامات والألوان مرتبة حسب متوسط البيع اليومي"],
  ["Daily rate", "المعدل اليومي"],
  ["Estimated days", "الأيام المتوقعة"],
  ["Classification", "التصنيف"],
  ["Audit history", "سجل المراجعة"],
  ["Sensitive business actions are recorded with the user, time, action, and related record.", "يتم تسجيل الإجراءات المهمة مع المستخدم والوقت والإجراء والسجل المرتبط."],
  ["Cancel", "إلغاء"],
  ["Close", "إغلاق"],
  ["Return", "رجوع"],
  ["Save access", "حفظ الصلاحيات"],
  ["Create user", "إنشاء المستخدم"],
  ["Submit receipt", "تأكيد الاستلام"],
  ["Confirm resolution", "تأكيد المعالجة"],
  ["Request Owner approval", "طلب موافقة المالك"],
  ["Send for Owner approval", "إرسال لموافقة المالك"],
  ["Send through WhatsApp", "إرسال عبر واتساب"],
  ["Confirm transfer", "تأكيد التحويل"],
  ["Submit for confirmation", "إرسال للتأكيد"],
  ["Confirm sale", "تأكيد البيع"],
  ["Reject", "رفض"],
  ["Record opened", "تم فتح السجل"],
  ["Critical alert remains active", "التنبيه الحرج ما زال نشطًا"],
  ["It remains in Today's Alerts but will not interrupt this user again during the current session.", "سيظل موجودًا في تنبيهات اليوم ولن يظهر كنافذة منبثقة لهذا المستخدم مرة أخرى خلال الجلسة الحالية."],
  ["Selected alert queue finished", "انتهت قائمة التنبيهات المحددة"],
  ["Completed alerts were removed. Deferred alerts remain active.", "تمت إزالة التنبيهات المكتملة، وتظل التنبيهات المؤجلة نشطة."],
  ["Workflow updated", "تم تحديث سير العمل"],
  ["Workflow restarted", "تم بدء دورة عمل جديدة"],
  ["All workflow records returned to their starting state.", "عادت سجلات سير العمل إلى حالتها الأصلية."],
  ["Alert completed", "تم إكمال التنبيه"],
  ["The item was removed from the active work queue.", "تمت إزالة العنصر من قائمة العمل النشطة."],
  ["Select at least one alert", "اختار تنبيهًا واحدًا على الأقل"],
  ["Use the checkboxes to build your work queue.", "استخدم مربعات الاختيار لتكوين قائمة العمل."],
  ["Work queue created", "تم إنشاء قائمة العمل"],
  ["Sale submitted", "تم إرسال طلب البيع"],
  ["The Manager received a confirmation request. Inventory has not changed.", "وصل طلب التأكيد إلى المدير ولم تتغير كمية المخزون."],
  ["Sale confirmed", "تم تأكيد البيع"],
  ["Showroom inventory was updated atomically.", "تم تحديث مخزون المعرض كوحدة واحدة."],
  ["Sale rejected", "تم رفض البيع"],
  ["Inventory was not changed.", "لم تتغير كمية المخزون."],
  ["Transfer completed", "تم التحويل"],
  ["Showroom and warehouse quantities were updated together.", "تم تحديث كميات المعرض والمخزن معًا."],
  ["Purchase order submitted", "تم إرسال أمر الشراء"],
  ["The Owner received an approval request.", "وصل طلب الموافقة إلى المالك."],
  ["WhatsApp message prepared", "تم تجهيز رسالة واتساب"],
  ["PO status changed to Pending supplier confirmation.", "تغيرت حالة أمر الشراء إلى بانتظار تأكيد المورد."],
  ["Invoice confirmed", "تم تأكيد الفاتورة"],
  ["Three equal payment rows were created and due-date alerts activated.", "تم إنشاء ثلاث دفعات متساوية وتفعيل تنبيهات الاستحقاق."],
  ["Approval requested", "تم طلب الموافقة"],
  ["The Owner received the supplier-payment request.", "وصل طلب دفعة المورد إلى المالك."],
  ["Receipt automatically verified", "تم التحقق من الاستلام تلقائيًا"],
  ["Receiving exception created", "تم إنشاء تنبيه فرق استلام"],
  ["Warehouse inventory was updated.", "تم تحديث مخزون المخزن."],
  ["The Inventory Manager received the exact difference.", "وصل فرق الكمية بالتحديد إلى مسؤول المخزون."],
  ["Exception resolved", "تمت معالجة الفرق"],
  ["The accepted quantity entered warehouse stock and the decision was audited.", "دخلت الكمية المقبولة إلى المخزن وتم تسجيل القرار."],
  ["User created", "تم إنشاء المستخدم"],
  ["The assigned role controls all visible functions.", "الدور المسند يحدد كل الوظائف المتاحة للمستخدم."],
  ["Access saved", "تم حفظ الصلاحيات"],
  ["The change was added to audit history.", "تمت إضافة التغيير إلى سجل المراجعة."],
  ["Count submitted", "تم إرسال الجرد"],
  ["Count assigned", "تم إسناد الجرد"],
  ["Any calculated difference will be routed to the Inventory Manager.", "سيتم إرسال أي فرق محسوب إلى مسؤول المخزون."],
  ["Role switched", "تم تغيير المستخدم"],
  ["Approval and viewing role", "دور للموافقة والعرض"],
  ["Use the Approvals page for items requiring an Owner decision.", "استخدم صفحة الموافقات للطلبات التي تحتاج قرار المالك."],
  ["Data refreshed", "تم تحديث البيانات"],
  ["The system returned to its initial workflow state.", "عاد النظام إلى حالة سير العمل الأساسية."],
  ["No alerts assigned", "لا توجد تنبيهات مسندة"],
  ["This role has no current alerts.", "لا توجد تنبيهات حالية لهذا المستخدم."],
  ["Showroom inventory", "مخزون المعرض"],
  ["Across recorded colors", "إجمالي الألوان المسجلة"],
  ["Warehouse inventory", "مخزون المخزن"],
  ["Available and reserved", "المتاح والمحجوز"],
  ["Manage inventory alerts", "إدارة تنبيهات المخزون"],
  ["Fabric, color, and location selected", "تم اختيار الخامة واللون والموقع"],
  ["Sales Staff records meters and rolls", "يسجل موظف المبيعات الأمتار والأثواب"],
  ["System calculates the variance", "يحسب النظام فرق الجرد"],
  ["Inventory Manager resolves or routes approval", "يعالج مسؤول المخزون الفرق أو يرسله للموافقة"],
  ["Workflow progress", "تقدم سير العمل"],
  ["The customer sale, replenishment, purchase, receipt, installment, and payment workflow is complete.", "اكتمل سير عمل بيع العميل والتزويد والشراء والاستلام والأقساط والدفع."],
  ["Open purchase value", "قيمة أوامر الشراء المفتوحة"],
  ["Current supplier orders", "أوامر الموردين الحالية"],
  ["Outstanding supplier commitments", "التزامات الموردين غير المسددة"],
  ["Select critical alerts to manage now", "اختار التنبيهات الحرجة اللي هتتعامل معاها دلوقتي"],
  ["Select the alerts you want to handle. The system will open them one by one.", "حدد التنبيهات المطلوبة، والنظام هيفتحها لك واحدًا بعد الآخر."],
]);

function translateArabicText(value) {
  if (ARABIC_UI.has(value)) return ARABIC_UI.get(value);
  return value
    .replace(/^Step (\d+): /, "الخطوة $1: ")
    .replace(/^Good morning, /, "صباح الخير يا ")
    .replace(/^Good evening, /, "مساء الخير يا ")
    .replace(/^Requires /, "يتطلب دور ")
    .replace(/^(\d+) of (\d+) actions completed$/, "تم إكمال $1 من $2 إجراءات")
    .replace(/^(\d+) active items for /, "$1 تنبيهات نشطة لـ ")
    .replace(/^Critical queue · Alert (\d+) of (\d+)$/, "قائمة التنبيهات الحرجة · التنبيه $1 من $2")
    .replace(/^Manage (\d+) selected alert$/, "إدارة تنبيه واحد محدد")
    .replace(/^Manage (\d+) selected alerts$/, "إدارة $1 تنبيهات محددة")
    .replace(/^Current user: (.+)\.$/, "المستخدم الحالي: $1.")
    .replace(/^(.+) completed\. The next user action is ready\.$/, "تم إكمال $1، والإجراء التالي جاهز.")
    .replace(/^(\d+) alerts? selected\. Opening the first item\.$/, "تم اختيار $1 تنبيهات، وسيتم فتح أول تنبيه.")
    .replace(/^(.+) is available in this workflow\.$/, "السجل $1 متاح في سير العمل.")
    .replace(/^(.+) Switch to (.+) and complete the required action\.$/, "$1 انتقل إلى دور $2 ونفذ الإجراء المطلوب.")
    .replace(/^Delivery: (.+)$/, "التسليم: $1")
    .replace(/^(.+) · ([\d.]+) m average daily sales$/, "$1 · متوسط المبيعات اليومية $2 متر")
    .replace(/^Last-pull reserve: (\d+) meters$/, "احتياطي آخر سحبة: $1 متر")
    .replace(/^(.+) summary$/, "ملخص $1")
    .replace(/^(\d+) critical alert requires attention$/, "عدد التنبيهات الحرجة التي تحتاج انتباهك: $1")
    .replace(/^(\d+) critical alerts require attention$/, "عدد التنبيهات الحرجة التي تحتاج انتباهك: $1")
    .replace(/^Select critical alert: (.+)$/, "تحديد التنبيه الحرج: $1");
}

function localizeArabic(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach((node) => {
    const original = node.nodeValue;
    const trimmed = original.trim();
    if (!trimmed) return;
    const translated = translateArabicText(trimmed);
    if (translated !== trimmed) {
      node.nodeValue = `${original.match(/^\s*/)[0]}${translated}${original.match(/\s*$/)[0]}`;
    }
  });

  root.querySelectorAll("[aria-label], [placeholder], [title]").forEach((element) => {
    ["aria-label", "placeholder", "title"].forEach((attribute) => {
      const value = element.getAttribute(attribute);
      if (value) element.setAttribute(attribute, translateArabicText(value));
    });
  });
}

function render() {
  const allowedRoutes = navigation[state.role].map(([route]) => route);
  if (!allowedRoutes.includes(state.route)) state.route = "dashboard";

  renderNav();
  updateIdentity();

  const label = navigation[state.role].find(([route]) => route === state.route)?.[1] || "Dashboard";
  pageTitle.textContent = label;
  document.title = `${label} | SmartTex`;

  const routeRenderer = routes[state.route] || renderDashboard;
  main.innerHTML = routeRenderer();
  localizeArabic(main);
  bindPageEvents();
  if (state.route === "dashboard" && !suppressCriticalPopupOnce) {
    window.setTimeout(showCriticalAlertPopup, 80);
  }
  suppressCriticalPopupOnce = false;
}

function intro(title, description, actions = "") {
  return `
    <section class="page-intro">
      <div>
        <h2>${title}</h2>
        <p>${description}</p>
      </div>
      ${actions ? `<div class="button-row">${actions}</div>` : ""}
    </section>
  `;
}

function scenarioBanner() {
  const step = scenarioSteps[state.scenarioStep];
  const completed = state.scenarioStep >= scenarioSteps.length;
  return `
    <section class="scenario-banner" aria-labelledby="scenario-title">
      <div>
        <p class="eyebrow">Connected workflow</p>
        <h2 id="scenario-title">${completed ? "Workflow completed" : `Step ${state.scenarioStep + 1}: ${step.title}`}</h2>
        <p>${completed
          ? "The customer sale, replenishment, purchase, receipt, installment, and payment workflow is complete."
          : `${step.detail}. Switch to ${roleProfiles[step.role].label} and complete the required action.`}
        </p>
      </div>
      ${completed
        ? `<button class="button" type="button" data-action="reset-scenario">Start a new workflow</button>`
        : `<button class="button" type="button" data-action="scenario" ${state.role === step.role ? "" : "disabled"}>
             ${state.role === step.role ? "Perform this step" : `Requires ${roleProfiles[step.role].label}`}
           </button>`}
    </section>
  `;
}

function dashboardStats() {
  const statsByRole = {
    admin: [
      ["المستخدمون النشطون", state.users.filter((u) => u.status === "نشط").length, "كل الحسابات متاحة"],
      ["الأدوار المعرفة", "5", "صلاحيات حسب الحاجة"],
      ["تغييرات الصلاحيات", "1", "هذا الأسبوع"],
      ["أحداث المراجعة", state.audit.length, "أحدث النشاطات"],
    ],
    owner: [
      ["الموافقات المعلقة", state.approvals.filter((a) => a.status === "قيد الانتظار").length, "تحتاج إلى قرار"],
      ["قيمة أوامر الشراء المفتوحة", money(state.purchaseOrders.reduce((sum, po) => sum + po.total, 0)), "إجمالي الأوامر الحالية"],
      ["رصيد الموردين", money(state.invoices.reduce((sum, inv) => sum + inv.total - inv.paid, 0)), "الالتزامات المتبقية"],
      ["التنبيهات الحرجة", state.alerts.filter((a) => a.severity === "critical" && a.audience.includes("owner")).length, "حالات تحتاج الانتباه"],
    ],
    manager: [
      ["تنبيهات تحتاج إجراء", state.alerts.filter((a) => a.audience.includes("manager")).length, "قائمة عمل مرتبة بالأولوية"],
      ["مبيعات بانتظار التأكيد", state.sales.filter((s) => s.status === "بانتظار التأكيد").length, "طلبات العملاء"],
      ["أوامر الشراء المفتوحة", state.purchaseOrders.length, "سير عمل الموردين"],
      ["الالتزامات القادمة", money(50000), "خلال 30 يومًا"],
    ],
    inventory: [
      ["خامات وألوان منخفضة", state.inventory.filter((i) => i.showroom <= 25 || i.warehouse <= i.reserve).length, "على مستوى الخامة واللون"],
      ["فروق الاستلام", state.receipts.filter((r) => r.result === "يوجد فرق").length, "تحتاج إلى إجراء"],
      ["أمتار المخزن", state.inventory.reduce((sum, item) => sum + item.warehouse, 0), "الكمية المسجلة"],
      ["مهام الجرد", "3", "مطلوبة هذا الأسبوع"],
    ],
    sales: [
      ["المهام المسندة", "3", "تحويلات واستلام"],
      ["مبيعات اليوم", state.sales.length, "معلقة ومكتملة"],
      ["تنبيهات المعرض", state.alerts.filter((a) => a.audience.includes("sales")).length, "تحتاج إلى تزويد"],
      ["الخامات والألوان المتاحة", state.inventory.filter((i) => i.showroom > 0).length, "جاهزة للبحث"],
    ],
  };

  return `
    <section class="stats-grid" aria-label="${roleProfiles[state.role].label} summary">
      ${statsByRole[state.role].map(([label, value, trend]) => `
        <article class="stat-card">
          <span class="stat-label">${label}</span>
          <strong class="stat-value">${value}</strong>
          <span class="stat-trend">${trend}</span>
        </article>
      `).join("")}
    </section>
  `;
}

function renderDashboard() {
  const profile = roleProfiles[state.role];
  const roleAlerts = state.alerts.filter((alert) => alert.audience.includes(state.role));
  const hasAlertRoute = navigation[state.role].some(([route]) => route === "alerts");
  return `
    ${scenarioBanner()}
    ${intro(
      `Good ${new Date().getHours() < 12 ? "morning" : "evening"}, ${profile.name.split(" ")[0]}`,
      profile.description
    )}
    ${dashboardStats()}
    <div class="dashboard-grid">
      <section class="panel" aria-labelledby="priority-heading">
        <div class="panel-header">
          <div>
            <h2 id="priority-heading">Priority work</h2>
            <p>Color and text labels identify urgency.</p>
          </div>
          ${roleAlerts.length && hasAlertRoute ? `<button class="link-button" data-route="alerts">Open all alerts</button>` : ""}
        </div>
        ${roleAlerts.length ? alertList(roleAlerts.slice(0, 4), false) : emptyState("No alerts assigned", "This role has no current alerts.")}
      </section>
      <aside class="panel" aria-labelledby="workflow-heading">
        <div class="panel-header">
          <div>
            <h2 id="workflow-heading">Active workflow</h2>
            <p>${Math.min(state.scenarioStep, scenarioSteps.length)} of ${scenarioSteps.length} actions completed</p>
          </div>
        </div>
        <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="${scenarioSteps.length}"
             aria-valuenow="${Math.min(state.scenarioStep, scenarioSteps.length)}"
             aria-label="Workflow progress">
          <span style="width:${Math.min(100, state.scenarioStep / scenarioSteps.length * 100)}%"></span>
        </div>
        <div class="task-stack">
          ${scenarioSteps.slice(Math.max(0, state.scenarioStep - 1), state.scenarioStep + 2).map((step, index) => {
            const realIndex = Math.max(0, state.scenarioStep - 1) + index;
            return `
              <article class="task-card">
                <span class="status ${realIndex < state.scenarioStep ? "status-complete" : realIndex === state.scenarioStep ? "status-pending" : "status-info"}">
                  ${realIndex < state.scenarioStep ? "Completed" : realIndex === state.scenarioStep ? "Current" : "Next"}
                </span>
                <h4>${step.title}</h4>
                <p>${roleProfiles[step.role].label} · ${step.detail}</p>
              </article>
            `;
          }).join("")}
        </div>
      </aside>
    </div>
  `;
}

function alertList(alerts, selectable = true) {
  return `
    <div class="alert-list">
      ${alerts.map((alert) => `
        <article class="alert-item severity-${alert.severity}">
          ${selectable
            ? `<input type="checkbox" aria-label="تحديد التنبيه: ${alert.title}" value="${alert.id}" class="alert-check">`
            : `<span class="status status-${alert.severity}">${alert.severity === "critical" ? "Critical" : alert.severity === "urgent" ? "Urgent" : alert.severity === "approaching" ? "Approaching" : "Information"}</span>`}
          <span class="severity-bar" aria-hidden="true"></span>
          <div class="alert-copy">
            <strong>${alert.title}</strong>
            <small>${alert.detail}</small>
          </div>
          <button class="button button-secondary" type="button" data-action="manage-alert" data-id="${alert.id}">
            ${alert.action}
          </button>
        </article>
      `).join("")}
    </div>
  `;
}

function renderAlerts() {
  const alerts = state.alerts.filter((alert) => alert.audience.includes(state.role));
  return `
    ${intro(
      state.role === "manager" ? "Manage alerts and build your work queue" : "Manage inventory alerts",
      state.role === "inventory"
        ? "يحسب النظام خطر النفاد من الرصيد ومعدل البيع ومدة توريد الموردين، ثم يطلب من مسؤول المخزون مراجعة طلب الشراء المعبأ مسبقًا."
        : "بعد مراجعة مسؤول المخزون، يستلم المدير طلب شراء عاجلًا مع الخامة واللون والكمية والمورد ومدة التوريد لإنشاء أمر الشراء.",
      alerts.length ? `<button class="button" type="button" data-action="start-queue">Start selected tasks</button>` : ""
    )}
    <section class="panel" aria-labelledby="today-alerts">
      <div class="panel-header">
        <div>
          <h2 id="today-alerts">Today's alerts</h2>
          <p>${alerts.length} active items for ${roleProfiles[state.role].label}</p>
        </div>
      </div>
      ${alerts.length ? alertList(alerts) : emptyState("Work queue clear", "There are no active alerts for this role.")}
    </section>
  `;
}

function renderAvailability() {
  return `
    ${intro("بدء بيع العميل والبحث عن التوفر", "ابدأ برقم هاتف العميل. بعد تحميل بياناته أو تسجيله، ابحث عن الخامة والبدائل المناسبة.")}
    <section class="panel">
      <form id="availability-customer-form" class="filters">
        <label class="field field-grow">
          <span>رقم هاتف العميل</span>
          <input id="availability-customer-phone" type="tel" inputmode="tel" placeholder="مثال: 01012345678" required>
        </label>
        <button class="button" type="submit">البحث عن العميل</button>
      </form>
      <div id="availability-customer-result" aria-live="polite"></div>
      <div id="availability-search-section" hidden>
        <div class="form-grid">
          <label class="field"><span>اسم العميل</span><input id="availability-customer-name"></label>
          <label class="field"><span>نوع العميل</span><select id="availability-customer-type"><option>عميل عادي</option><option>ترزي</option></select></label>
        </div>
        <form id="availability-form" class="filters">
          <label class="field field-grow">
            <span>غرض الاستخدام</span>
            <select id="sale-purpose-filter" required>
              <option value="">اختر غرض الاستخدام</option>
              ${salePurposeOptions()}
            </select>
          </label>
          <label class="field field-grow">
            <span>الخامة المطلوبة</span>
            <select id="fabric-filter" required>
              <option value="">اختر الخامة</option>
              ${[...new Set(state.inventory.map((item) => item.fabric))].map((fabric) => `<option>${fabric}</option>`).join("")}
            </select>
          </label>
          <label class="field field-grow">
            <span>اللون المطلوب</span>
            <select id="color-filter" required disabled>
              <option value="">اختر الخامة أولًا</option>
            </select>
          </label>
          <label class="field">
            <span>الأمتار المطلوبة</span>
            <input id="availability-meters" type="number" min="0.5" step="0.5" value="8" required>
          </label>
          <button class="button" type="submit">فحص التوفر واقتراح البدائل</button>
        </form>
      </div>
      <div id="availability-result">
        ${emptyState("ابدأ برقم هاتف العميل", "لن يبدأ بحث التوفر قبل تحديد العميل ونوعه.")}
      </div>
    </section>
  `;
}

function renderInventory() {
  return `
    ${intro(
      "متابعة المخزون ومستويات إعادة الطلب",
      "يعرض النظام الرصيد الحالي ومستوى إعادة الطلب المحسوب لكل خامة ولون حتى يبدأ مسؤول المخزون الإجراء قبل نفاد الرصيد.",
      `<button class="button" type="button" data-action="new-count">Start stock count</button>`
    )}
    <section class="panel">
      <div class="callout">
        <strong>كيف يُحسب حد بدء إعادة الطلب؟</strong>
        <p>متوسط البيع اليومي × مدة أسرع مورد + حد آخر سحبة من المخزن الذي حدده مسؤول النظام (${state.thresholds.lastPull} مترًا). تتم المقارنة مع رصيد المخزن فقط، ولا يدخل المعروض في المحل في حساب إعادة الطلب.</p>
      </div>
      <div class="table-wrap">
        <table>
          <caption>مقارنة الرصيد الحالي بمستوى إعادة الطلب</caption>
          <thead><tr><th>الخامة واللون</th><th>الرصيد الحالي بالمخزن</th><th>المعروض في المحل</th><th>حد بدء إعادة الطلب</th><th>الموقف من الحد</th><th>مدة أسرع مورد</th><th>الحالة</th><th>الإجراء</th></tr></thead>
          <tbody>
            ${state.inventory.map((item) => {
              const {
                supplier,
                warehouseAvailable,
                reorderLevel,
                difference,
              } = calculateReorderMetrics(item);
              const needsReorder = difference !== null && difference <= 0;
              const reorderAlert = state.alerts.find((alert) =>
                alert.type === "reorder"
                && alert.audience.includes("inventory")
                && (
                  alert.inventoryId === item.id
                  || (
                    !alert.inventoryId
                    && alert.detail.includes(item.fabric)
                    && alert.detail.includes(item.color)
                  )
                )
              );
              return `
                <tr>
                  <td><strong>${item.fabric}</strong><br><small>${item.color}</small></td>
                  <td><strong>${warehouseAvailable} مترًا</strong></td>
                  <td><strong>${item.showroom} مترًا</strong></td>
                  <td>${supplier
                    ? `<strong>${reorderLevel} مترًا</strong><br><small>${item.rate} متر/يوم × ${supplier.leadDays} يومًا + ${state.thresholds.lastPull} مترًا حد آخر سحبة</small>`
                    : `<strong>غير محسوب</strong><br><small>مدة التوريد غير متاحة</small>`}</td>
                  <td>${difference === null
                    ? "غير متاح"
                    : difference < 0
                      ? `<strong>عجز ${Math.abs(difference)} مترًا</strong>`
                      : difference === 0
                        ? "<strong>وصل إلى الحد</strong>"
                        : `فائض ${difference} مترًا`}</td>
                  <td>${supplier ? `${supplier.leadDays} يومًا · ${supplier.name}` : "لا يوجد مورد مسجل"}</td>
                  <td><span class="status ${!supplier || needsReorder ? "status-critical" : difference <= state.thresholds.lastPull ? "status-urgent" : "status-approved"}">${!supplier ? "فجوة مورد" : needsReorder ? "ابدأ إعادة الطلب" : difference <= state.thresholds.lastPull ? "تحت المتابعة" : "مستقر"}</span></td>
                  <td>${reorderAlert
                    ? `<button class="button button-secondary" type="button" data-action="manage-alert" data-id="${reorderAlert.id}">إدارة إعادة الطلب</button>`
                    : `<button class="button button-secondary" type="button" data-action="create-reorder" data-id="${item.id}">إنشاء طلب إعادة</button>`}</td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    </section>
    <div class="inventory-grid">
      ${state.inventory.map((item) => `
        <article class="inventory-card">
          <span class="status ${item.status === "حرج" ? "status-critical" : item.status === "منخفض" ? "status-urgent" : "status-approved"}">${item.status}</span>
          <h3>${item.fabric}</h3>
          <p>${item.color} · ${item.rate} m average daily sales</p>
          <div class="stock-split">
            <div class="stock-value"><small>Showroom</small><strong>${item.showroom} m</strong></div>
            <div class="stock-value"><small>Warehouse</small><strong>${item.warehouse} m</strong></div>
          </div>
          <div class="progress" role="progressbar" aria-label="${item.fabric} ${item.color} total stock"
               aria-valuemin="0" aria-valuemax="400" aria-valuenow="${item.showroom + item.warehouse}">
            <span style="width:${Math.min(100, (item.showroom + item.warehouse) / 4)}%"></span>
          </div>
          <small>Last-pull reserve: ${state.thresholds.lastPull} meters</small>
        </article>
      `).join("")}
    </div>
  `;
}

function renderSales() {
  const canCreate = state.role === "sales";
  const canConfirm = state.role === "manager";
  return `
    ${intro(
      canConfirm ? "Manage customer sale confirmations" : "Customer sales",
      canConfirm
        ? "Confirming a sale atomically reduces showroom stock and may generate a replenishment alert."
        : "Select fabric, color, and meters with minimum keyboard input.",
      canCreate ? `<button class="button" type="button" data-action="new-sale">New customer sale</button>` : ""
    )}
    <section class="panel">
      <div class="table-wrap">
        <table>
          <caption>Recent customer sale requests</caption>
          <thead><tr><th>المرجع</th><th>العميل</th><th>الخامة واللون</th><th>الأمتار</th><th>الموظف</th><th>الحالة</th><th>الإجراء</th></tr></thead>
          <tbody>
            ${state.sales.map((sale) => `
              <tr>
                <td><strong>${sale.id}</strong><br><small>${sale.time}</small></td>
                <td>${sale.customerName || "عميل نقدي"}<br><small>${sale.customerPhone || "غير مسجل"}</small></td>
                <td>${sale.fabric}<br><small>${sale.color}${sale.purpose ? ` · ${sale.purpose}` : ""}</small></td>
                <td>${sale.meters} مترًا</td>
                <td>${sale.staff}</td>
                <td><span class="status ${statusClass(sale.status)}">${sale.status}</span></td>
                <td>
                  ${canConfirm && sale.status === "بانتظار التأكيد"
                    ? `<button class="button button-secondary" data-action="confirm-sale" data-id="${sale.id}">Manage sale</button>`
                    : `<button class="link-button" data-action="view-record" data-id="${sale.id}">View details</button>`}
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderTransfers() {
  const transferAlerts = state.alerts.filter(
    (alert) => alert.type === "transfer" && alert.audience.includes("sales")
  );
  const lowItems = state.inventory.filter(
    (item) =>
      item.warehouse > 0
      && (
        item.showroom <= state.thresholds.showroom
        || transferAlerts.some(
          (alert) => alert.detail.includes(item.fabric) && alert.detail.includes(item.color)
        )
      )
  );
  return `
    ${intro("Showroom replenishment", "Transfer stock from the warehouse when showroom stock reaches the configured threshold.")}
    <section class="panel">
      <div class="table-wrap">
        <table>
          <caption>Items requiring showroom replenishment</caption>
          <thead><tr><th>Fabric / color</th><th>Showroom</th><th>Warehouse</th><th>Suggested transfer</th><th>Action</th></tr></thead>
          <tbody>
            ${lowItems.length ? lowItems.map((item) => `
              <tr>
                <td><strong>${item.fabric}</strong><br><small>${item.color}</small></td>
                <td>${item.showroom} m</td>
                <td>${item.warehouse} m</td>
                <td>${Math.min(50, item.warehouse)} m</td>
                <td><button class="button" data-action="transfer" data-id="${item.id}">Transfer stock</button></td>
              </tr>
            `).join("") : `<tr><td colspan="5">${emptyState("لا توجد تحويلات مطلوبة", "لا توجد خامات منخفضة في المعرض ولها رصيد متاح في المخزن.")}</td></tr>`}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderPurchasing() {
  const recommendations = state.reorderRecommendations || [];
  return `
    ${intro(
      "Manage purchase orders",
      "Reorder alerts prefill the fabric, color, and suggested quantity. Supplier options come from recorded supplier data.",
      `<button class="button" type="button" data-action="new-po">Create purchase order</button>`
    )}
    ${recommendations.length ? `
      <section class="panel" aria-labelledby="reorder-recommendations">
        <div class="panel-header">
          <div>
            <h2 id="reorder-recommendations">توصيات إعادة الطلب من مسؤول المخزون</h2>
            <p>تحقق مسؤول المخزون من الكمية وأرسل التوصية إلى المدير لإنشاء أمر الشراء.</p>
          </div>
        </div>
        <div class="table-wrap">
          <table>
            <caption>توصيات إعادة الطلب</caption>
            <thead><tr><th>المرجع</th><th>الخامة واللون</th><th>المتبقي</th><th>التغطية الحالية</th><th>المورد المقترح</th><th>الكمية المقترحة</th><th>الحالة</th><th>الإجراء</th></tr></thead>
            <tbody>
              ${recommendations.map((item) => `
                <tr>
                  <td><strong>${item.id}</strong></td>
                  <td>${item.fabric}<br><small>${item.color}</small></td>
                  <td>${item.remaining} متر</td>
                  <td>خلال ${item.daysToStockout} أيام</td>
                  <td>${item.supplier}<br><small>مدة التوريد ${item.leadDays} أيام</small></td>
                  <td>${item.suggested} متر</td>
                  <td><span class="status ${item.status === "تم إنشاء أمر الشراء" ? "status-approved" : "status-pending"}">${item.status}</span></td>
                  <td>${item.status === "أرسلت للمدير"
                    ? `<button class="button button-secondary" data-action="new-po-from-request" data-id="${item.id}">إنشاء أمر شراء</button>`
                    : "تمت المعالجة"}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </section>
    ` : ""}
    <section class="panel">
      <div class="table-wrap">
        <table>
          <caption>Purchase-order workflow status</caption>
          <thead><tr><th>PO</th><th>Supplier</th><th>Fabric / color</th><th>Quantity</th><th>Total</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            ${state.purchaseOrders.map((po) => `
              <tr>
                <td><strong>${po.id}</strong><br><small>Delivery: ${po.delivery}</small></td>
                <td>${po.supplier}</td>
                <td>${po.fabric}<br><small>${po.color}</small></td>
                <td>${po.quantity} m</td>
                <td>${money(po.total)}</td>
                <td><span class="status ${statusClass(po.status)}">${po.status}</span></td>
                <td><button class="button button-secondary" data-action="manage-po" data-id="${po.id}">Manage PO</button></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderInvoices() {
  return `
    ${intro(
      "إدارة أقساط أوامر الشراء والمدفوعات",
      "بعد تأكيد استلام أمر الشراء، يحدد المدير عدد الأقساط ومبالغها ومواعيدها، ثم يتابع كل دفعة حتى موافقة المالك والسداد.",
      ""
    )}
    <section class="panel">
      <div class="table-wrap">
        <table>
          <caption>جداول أقساط أوامر الشراء والمدفوعات</caption>
          <thead><tr><th>الجدول</th><th>المورد / أمر الشراء</th><th>عدد الأقساط</th><th>الإجمالي</th><th>المدفوع</th><th>الاستحقاق التالي</th><th>الحالة</th><th>الإجراء</th></tr></thead>
          <tbody>
            ${state.invoices.map((invoice) => `
              <tr>
                <td><strong>${invoice.id}</strong></td>
                <td>${invoice.supplier}<br><small>${invoice.po}</small></td>
                <td>${invoice.installments || 1}<br><small>${invoice.cadence || "تواريخ مخصصة"}</small></td>
                <td>${money(invoice.total)}</td>
                <td>${money(invoice.paid)}</td>
                <td>${invoice.due}</td>
                <td><span class="status ${statusClass(invoice.status)}">${invoice.status}</span></td>
                <td><button class="button button-secondary" data-action="manage-invoice" data-id="${invoice.id}">إدارة الأقساط</button></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderReceiving() {
  return `
    ${intro(
      state.role === "sales" ? "Record supplier shipment" : "Manage receiving and exceptions",
      state.role === "sales"
        ? "اختر أمر الشراء وسجل الكمية المستلمة فعليًا. يقارن النظام الكمية المستلمة بالكمية المطلوبة في أمر الشراء."
        : "Matching receipts verify automatically. Only detected differences require human action.",
      state.role === "sales" ? `<button class="button" type="button" data-action="receive-shipment">Record shipment</button>` : ""
    )}
    <section class="panel">
      <div class="table-wrap">
        <table>
          <caption>Recent automatic receipt comparisons</caption>
          <thead><tr><th>Receipt</th><th>Supplier / PO</th><th>Expected</th><th>Received</th><th>System result</th><th>Action</th></tr></thead>
          <tbody>
            ${state.receipts.map((receipt) => `
              <tr>
                <td><strong>${receipt.id}</strong></td>
                <td>${receipt.supplier}<br><small>${receipt.po}</small></td>
                <td>${receipt.expected} m</td>
                <td>${receipt.received} m</td>
                <td><span class="status ${statusClass(receipt.result)}">${receipt.result}</span><br><small>${receipt.detail}</small></td>
                <td>${receipt.result === "يوجد فرق" && state.role === "inventory"
                  ? `<button class="button" data-action="resolve-receipt" data-id="${receipt.id}">Manage exception</button>`
                  : `<button class="link-button" data-action="view-record" data-id="${receipt.id}">View comparison</button>`}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderApprovals() {
  return `
    ${intro("الموافقات", "يفتح المالك تفاصيل الطلب وتعليقاته، ثم يوافق عليه أو يعيده للمدير مع سبب واضح.")}
    <section class="panel">
      <div class="table-wrap">
        <table>
          <caption>Requests awaiting or recently receiving an Owner decision</caption>
          <thead><tr><th>Request</th><th>Type</th><th>Details</th><th>Amount</th><th>Requested by</th><th>Status</th><th>Decision</th></tr></thead>
          <tbody>
            ${state.approvals.map((approval) => `
              <tr>
                <td><strong>${approval.id}</strong></td>
                <td>${approval.type}</td>
                <td>${approval.request}</td>
                <td>${money(approval.amount)}</td>
                <td>${approval.requestedBy}</td>
                <td><span class="status ${statusClass(approval.status)}">${approval.status}</span></td>
                <td><button class="button button-secondary" data-action="manage-approval" data-id="${approval.id}">عرض وإدارة الطلب</button></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderAccess() {
  return `
    ${intro(
      "Identity and access administration",
      "Admin manages accounts and role assignments. Owner access is limited to approvals and viewing.",
      `<button class="button" data-action="new-user">Add user</button>`
    )}
    <section class="panel">
      <div class="table-wrap">
        <table>
          <caption>System users and assigned access</caption>
          <thead><tr><th>User</th><th>Role</th><th>Access scope</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            ${state.users.map((user, index) => `
              <tr>
                <td><strong>${user.name}</strong></td>
                <td>${user.role}</td>
                <td>${user.access}</td>
                <td><span class="status status-approved">${user.status}</span></td>
                <td><button class="button button-secondary" data-action="manage-user" data-id="${index}">Manage access</button></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderSettings() {
  return `
    ${intro(
      "إعداد حدود المخزون",
      "مسؤول النظام يحدد القواعد الرقمية، بينما يتحقق مسؤول المخزون من الحالة ويرسل توصية إعادة الطلب للمدير."
    )}
    <section class="panel">
      <form id="threshold-settings-form" class="form-grid">
        <label class="field">
          <span>حد تزويد المعرض بالمتر</span>
          <input id="showroom-threshold" type="number" min="1" step="1" value="${state.thresholds.showroom}" required>
          <small>إذا أصبح رصيد المعرض مساويًا لهذا الحد أو أقل، يُرسل تنبيه لموظف المبيعات لإجراء تحويل.</small>
        </label>
        <label class="field">
          <span>حد آخر سحبة بالمخزن</span>
          <input id="last-pull-threshold" type="number" min="1" step="1" value="${state.thresholds.lastPull}" required>
          <small>إذا أصبح رصيد المخزن مساويًا لهذا الحد أو أقل، يُرسل التنبيه لمسؤول المخزون للتحقق وللمدير للمتابعة.</small>
        </label>
        <div class="callout full-width">
          <strong>توزيع المسؤولية</strong>
          <p>مسؤول النظام يضبط الحدود، النظام يراقب الكميات، مسؤول المخزون يتحقق ويقترح، والمدير ينشئ أمر الشراء.</p>
        </div>
        <div class="button-row full-width">
          <button class="button" type="submit">حفظ حدود المخزون</button>
        </div>
      </form>
    </section>
  `;
}

function renderCounts() {
  return `
    ${intro(
      state.role === "sales" ? "Assigned stock tasks" : "Manage counts and stock condition",
      "Physical differences, remnants, and damage are recorded with a reason and routed to the correct approval level.",
      `<button class="button" data-action="new-count">${state.role === "sales" ? "Record count" : "Assign stock count"}</button>`
    )}
    <div class="workflow-steps">
      <article class="workflow-step" aria-current="step"><span class="step-number">1</span><strong>Count assigned</strong><small>Fabric, color, and location selected</small></article>
      <article class="workflow-step"><span class="step-number">2</span><strong>Physical quantity</strong><small>Sales Staff records meters and rolls</small></article>
      <article class="workflow-step"><span class="step-number">3</span><strong>Difference detected</strong><small>System calculates the variance</small></article>
      <article class="workflow-step"><span class="step-number">4</span><strong>Manage adjustment</strong><small>Inventory Manager resolves or routes approval</small></article>
    </div>
  `;
}

function renderReports() {
  const totalShowroom = state.inventory.reduce((sum, item) => sum + item.showroom, 0);
  const totalWarehouse = state.inventory.reduce((sum, item) => sum + item.warehouse, 0);
  return `
    ${intro("التقارير ومتابعة النشاط", "ملخصات للعرض فقط تدعم قرارات المالك والمدير.")}
    <section class="stats-grid" aria-label="ملخص التقارير">
      <article class="stat-card"><span class="stat-label">مخزون المعرض</span><strong class="stat-value">${totalShowroom} متر</strong><span class="stat-trend">إجمالي الألوان المسجلة</span></article>
      <article class="stat-card"><span class="stat-label">مخزون المخزن</span><strong class="stat-value">${totalWarehouse} متر</strong><span class="stat-trend">المتاح والمحجوز</span></article>
      <article class="stat-card"><span class="stat-label">قيمة أوامر الشراء المفتوحة</span><strong class="stat-value">${money(state.purchaseOrders.reduce((sum, po) => sum + po.total, 0))}</strong><span class="stat-trend">أوامر الموردين الحالية</span></article>
      <article class="stat-card"><span class="stat-label">التزامات الموردين غير المسددة</span><strong class="stat-value">${money(state.invoices.reduce((sum, inv) => sum + inv.total - inv.paid, 0))}</strong><span class="stat-trend">الرصيد المتبقي من الأقساط</span></article>
    </section>
    <section class="panel">
      <div class="panel-header"><div><h2>الخامات والألوان سريعة الحركة</h2><p>محسوبة من تاريخ المبيعات المؤكدة.</p></div></div>
      <div class="table-wrap">
        <table>
          <caption>الخامات والألوان مرتبة حسب متوسط البيع اليومي</caption>
          <thead><tr><th>الخامة</th><th>اللون</th><th>المعدل اليومي</th><th>المتاح</th><th>أيام التغطية</th><th>التصنيف</th></tr></thead>
          <tbody>
            ${[...state.inventory].sort((a, b) => b.rate - a.rate).slice(0, 5).map((item) => {
              const available = item.showroom + item.warehouse;
              const days = Math.floor(available / item.rate);
              return `<tr><td>${item.fabric}</td><td>${item.color}</td><td>${item.rate} متر/يوم</td><td>${available} متر</td><td>${days} يومًا</td><td><span class="status ${days < 10 ? "status-critical" : days < 20 ? "status-urgent" : "status-approved"}">${days < 10 ? "إعادة طلب مبكرة" : days < 20 ? "تحت المتابعة" : "مستقر"}</span></td></tr>`;
            }).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderAudit() {
  return `
    ${intro("Audit history", "Sensitive business actions are recorded with the user, time, action, and related record.")}
    <section class="panel">
      <div class="timeline">
        ${state.audit.map((event) => `
          <article class="timeline-item">
            <div class="timeline-marker" aria-hidden="true"></div>
            <div class="timeline-copy">
              <strong>${event.action}</strong>
              <small>${event.time} · ${event.user} · ${event.record}</small>
            </div>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

const routes = {
  dashboard: renderDashboard,
  alerts: renderAlerts,
  availability: renderAvailability,
  inventory: renderInventory,
  sales: renderSales,
  transfers: renderTransfers,
  purchasing: renderPurchasing,
  invoices: renderInvoices,
  receiving: renderReceiving,
  approvals: renderApprovals,
  access: renderAccess,
  settings: renderSettings,
  counts: renderCounts,
  reports: renderReports,
  audit: renderAudit,
};

function emptyState(title, detail) {
  return `<div class="empty-state"><strong>${title}</strong><span>${detail}</span></div>`;
}

function bindPageEvents() {
  document.querySelectorAll("[data-route]").forEach((element) => {
    element.addEventListener("click", (event) => {
      event.preventDefault();
      navigate(element.dataset.route);
    });
  });

  document.querySelectorAll("[data-action]").forEach((element) => {
    element.addEventListener("click", () => handleAction(element.dataset.action, element.dataset));
  });

  const fabricFilter = document.querySelector("#fabric-filter");
  if (fabricFilter) {
    fabricFilter.addEventListener("change", updateColorFilter);
    document.querySelector("#availability-form").addEventListener("submit", showAvailability);
    document.querySelector("#availability-customer-form").addEventListener("submit", identifyAvailabilityCustomer);
  }

  const thresholdForm = document.querySelector("#threshold-settings-form");
  if (thresholdForm) thresholdForm.addEventListener("submit", saveThresholdSettings);

  bindTableFilters();
}

function identifyAvailabilityCustomer(event) {
  event.preventDefault();
  const phone = document.querySelector("#availability-customer-phone").value.replace(/\s+/g, "");
  const customer = state.customers.find((item) => item.phone === phone);
  const name = document.querySelector("#availability-customer-name");
  const type = document.querySelector("#availability-customer-type");
  const result = document.querySelector("#availability-customer-result");
  const section = document.querySelector("#availability-search-section");
  if (!phone) return;
  name.value = customer?.name || "";
  type.value = customer?.type || "عميل عادي";
  name.readOnly = Boolean(customer);
  type.disabled = Boolean(customer);
  result.innerHTML = customer
    ? `<div class="callout"><strong>تم العثور على العميل:</strong> ${customer.name} · ${customer.type || "عميل عادي"}</div>`
    : `<div class="callout"><strong>عميل جديد.</strong> أدخل الاسم وحدد هل هو ترزي أم عميل عادي قبل البحث عن القماش.</div>`;
  section.hidden = false;
  document.querySelector("#availability-result").innerHTML = emptyState(
    "حدد غرض الاستخدام والخامة واللون",
    "سيظهر التوفر الفعلي والبدائل المناسبة بعد تحديد بيانات العميل."
  );
  if (!customer) name.focus();
}

function bindTableFilters() {
  main.querySelectorAll(".table-wrap").forEach((wrapper, index) => {
    const table = wrapper.querySelector("table");
    const rows = [...table.querySelectorAll("tbody tr")];
    if (!rows.length) return;
    const caption = table.querySelector("caption")?.textContent.trim() || "الجدول";
    const filterId = `table-filter-${state.route}-${index}`;
    const toolbar = document.createElement("div");
    toolbar.className = "table-filter-bar";
    toolbar.innerHTML = `
      <label class="table-filter" for="${filterId}">
        <span>بحث وتصفية</span>
        <input id="${filterId}" type="search" placeholder="اكتب للبحث في ${caption}" autocomplete="off">
      </label>
      <span class="table-filter-count" aria-live="polite">${rows.length} سجل</span>
    `;
    wrapper.before(toolbar);
    const input = toolbar.querySelector("input");
    const count = toolbar.querySelector(".table-filter-count");
    input.addEventListener("input", () => {
      const query = input.value.trim().toLocaleLowerCase("ar");
      let visible = 0;
      rows.forEach((row) => {
        const matches = !query || row.textContent.toLocaleLowerCase("ar").includes(query);
        row.hidden = !matches;
        if (matches) visible += 1;
      });
      count.textContent = `${visible} من ${rows.length} سجل`;
    });
  });
}

function navigate(route) {
  state.route = route;
  saveState();
  render();
  window.location.hash = route;
  main.focus();
}

function handleAction(action, data = {}) {
  const handlers = {
    "scenario": confirmScenarioStep,
    "reset-scenario": resetScenario,
    "manage-alert": () => manageAlert(Number(data.id)),
    "create-reorder": () => createReorderFromInventory(Number(data.id)),
    "start-queue": startQueue,
    "new-sale": openNewSale,
    "confirm-sale": () => confirmSale(data.id),
    "transfer": () => transferStock(Number(data.id)),
    "new-po": () => openNewPO(),
    "new-po-from-request": () => openNewPO(data.id),
    "manage-po": () => managePO(data.id),
    "manage-invoice": () => manageInvoice(data.id),
    "receive-shipment": openReceiving,
    "resolve-receipt": () => resolveReceipt(data.id),
    "manage-approval": () => manageApproval(data.id),
    "approval-decision": () => decideApproval(data.id, data.decision),
    "new-user": openNewUser,
    "manage-user": () => manageUser(Number(data.id)),
    "new-count": openCount,
    "view-record": () => showToast("Record opened", `${data.id} is available in this workflow.`),
  };

  handlers[action]?.();
}

function confirmScenarioStep() {
  if (state.scenarioStep >= scenarioSteps.length) return;
  const step = scenarioSteps[state.scenarioStep];
  if (step.role !== state.role) return;

  openModal({
    kicker: "تأكيد الإجراء",
    title: step.title,
    content: `
      <div class="modal-summary">
        <p>${step.detail}</p>
        <p><strong>المستخدم المسؤول:</strong> ${roleProfiles[state.role].label} — ${roleProfiles[state.role].name}</p>
      </div>
    `,
    actions: `
      <button class="button button-secondary" type="button" id="cancel-scenario-action">إلغاء</button>
      <button class="button" type="button" id="confirm-scenario-action">تأكيد الإجراء</button>
    `,
  });
  document.querySelector("#cancel-scenario-action").addEventListener("click", closeModal);
  document.querySelector("#confirm-scenario-action").addEventListener("click", () => {
    closeModal();
    performScenarioStep();
  });
}

function openModal({ kicker = "إجراء في سير العمل", title, content, actions }) {
  document.querySelector("#modal-kicker").textContent = kicker;
  document.querySelector("#modal-title").textContent = title;
  document.querySelector("#modal-content").innerHTML = content;
  document.querySelector("#modal-actions").innerHTML = actions;
  localizeArabic(modal);
  modal.showModal();
}

function closeModal() {
  modal.close();
}

function showCriticalAlertPopup() {
  if (modal.open) return;
  const priorityAlerts = state.alerts.filter(
    (alert) =>
      alert.audience.includes(state.role)
      && ["critical", "urgent"].includes(alert.severity)
      && !seenCriticalAlerts.has(`${state.role}:${alert.id}`)
  );
  if (!priorityAlerts.length) return;

  priorityAlerts.forEach((alert) => seenCriticalAlerts.add(`${state.role}:${alert.id}`));
  sessionStorage.setItem(CRITICAL_SEEN_KEY, JSON.stringify([...seenCriticalAlerts]));

  const destination = navigation[state.role].some(([route]) => route === "alerts")
    ? "alerts"
    : navigation[state.role].some(([route]) => route === "approvals")
      ? "approvals"
      : "dashboard";

  openModal({
    kicker: "تنبيهات اليوم",
    title: "اختار التنبيهات المهمة اللي هتتعامل معاها دلوقتي",
    content: `
      <div class="callout callout-critical" role="alert">
        <strong>عدد التنبيهات المهمة التي تحتاج انتباهك: ${priorityAlerts.length}</strong>
        <p>حدد التنبيهات المطلوبة، والنظام هيفتحها لك واحدًا بعد الآخر.</p>
      </div>
      <div class="critical-popup-list">
        ${priorityAlerts.map((alert) => `
          <label class="critical-popup-item">
            <input class="critical-popup-check" type="checkbox" value="${alert.id}"
                   aria-label="تحديد التنبيه: ${alert.title}">
            <span class="critical-symbol" aria-hidden="true">!</span>
            <div>
              <span class="status ${alert.severity === "critical" ? "status-critical" : "status-urgent"}">${alert.severity === "critical" ? "حرج" : "عاجل"}</span>
              <h3>${alert.title}</h3>
              <p>${alert.detail}</p>
            </div>
          </label>
        `).join("")}
      </div>
    `,
    actions: `
      <button class="button button-secondary" type="button" id="remind-critical">ذكرني لاحقًا</button>
      <button class="button button-danger" type="button" id="manage-critical" disabled>إدارة التنبيهات المحددة</button>
    `,
  });

  const manageButton = document.querySelector("#manage-critical");
  const checkboxes = [...document.querySelectorAll(".critical-popup-check")];
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const selectedCount = checkboxes.filter((item) => item.checked).length;
      manageButton.disabled = selectedCount === 0;
      manageButton.textContent = selectedCount
        ? `إدارة ${selectedCount} من التنبيهات المحددة`
        : "إدارة التنبيهات المحددة";
    });
  });
  document.querySelector("#remind-critical").addEventListener("click", () => {
    closeModal();
    showToast(
      "التنبيه ما زال نشطًا",
      "سيظل موجودًا في تنبيهات اليوم وسيظهر مرة أخرى عند الرجوع إلى هذا المستخدم."
    );
  });
  manageButton.addEventListener("click", () => {
    const selected = checkboxes.filter((item) => item.checked).map((item) => Number(item.value));
    if (!selected.length) return;
    beginAlertQueue(selected, destination);
  });
}

function beginAlertQueue(ids, destination = state.route) {
  activeAlertQueue = [...new Set(ids)].filter((id) => state.alerts.some((alert) => alert.id === id));
  activeAlertQueueIndex = 0;
  activeAlertQueueDestination = destination;
  if (!activeAlertQueue.length) return;
  if (modal.open) closeModal();
  window.setTimeout(openCurrentQueuedAlert, 40);
}

function openCurrentQueuedAlert() {
  if (activeAlertQueueIndex >= activeAlertQueue.length) {
    activeAlertQueue = [];
    activeAlertQueueIndex = 0;
    suppressCriticalPopupOnce = true;
    if (
      activeAlertQueueDestination !== "dashboard"
      && navigation[state.role].some(([route]) => route === activeAlertQueueDestination)
    ) {
      state.route = activeAlertQueueDestination;
      window.history.replaceState(null, "", `#${activeAlertQueueDestination}`);
    }
    saveState();
    render();
    showToast("تمت إدارة التنبيهات المحددة", "تم الانتهاء من الإجراءات المحددة واحدًا بعد الآخر.");
    return;
  }

  const id = activeAlertQueue[activeAlertQueueIndex];
  const alert = state.alerts.find((item) => item.id === id);
  if (!alert) {
    activeAlertQueueIndex += 1;
    openCurrentQueuedAlert();
    return;
  }

  suppressCriticalPopupOnce = true;
  openAlertBusinessAction(alert);
}

function completeCurrentQueuedAlert(expectedTypes = []) {
  if (!activeAlertQueue.length || activeAlertQueueIndex >= activeAlertQueue.length) return;
  const id = activeAlertQueue[activeAlertQueueIndex];
  const alert = state.alerts.find((item) => item.id === id);
  if (!alert || (expectedTypes.length && !expectedTypes.includes(alert.type))) return;
  completeAlertForCurrentRole(alert);
  advanceCurrentQueuedAlert();
}

function advanceCurrentQueuedAlert() {
  if (!activeAlertQueue.length || activeAlertQueueIndex >= activeAlertQueue.length) return;
  activeAlertQueueIndex += 1;
  suppressCriticalPopupOnce = true;
  window.setTimeout(openCurrentQueuedAlert, 80);
}

function openAlertBusinessAction(alert) {
  if (alert.type === "purchase-requisition" && state.role === "manager") {
    openNewPO(alert.requestId);
    return;
  }
  if (alert.type === "reorder" && state.role === "inventory") {
    manageAlert(alert.id);
    return;
  }
  if (alert.type === "payment-approaching" && state.role === "manager") {
    navigate("invoices");
    const schedule = state.invoices.find((item) => item.id === alert.scheduleId);
    if (schedule) window.setTimeout(() => manageInvoice(schedule.id, "approaching"), 40);
    showToast("موعد الدفعة يقترب", "تواصل مع المورد، أو اتفق على موعد جديد، أو ابدأ طلب الموافقة مبكرًا.");
    return;
  }
  if (alert.type === "payment-due") {
    if (state.role === "owner") {
      navigate("approvals");
      const approval = state.approvals.find((item) => item.id === alert.approvalId);
      if (approval) window.setTimeout(() => manageApproval(approval.id), 40);
    } else {
      navigate("invoices");
      const schedule = state.invoices.find((item) => item.id === alert.scheduleId);
      if (schedule) window.setTimeout(() => manageInvoice(schedule.id, "due"), 40);
    }
    showToast("دفعة مستحقة اليوم", state.role === "owner"
      ? "اتخذ قرار الموافقة أو أعد الطلب للمدير مع السبب."
      : "تابع موافقة المالك أو حدّث الموعد بعد الاتفاق مع المورد.");
    return;
  }
  if (alert.type === "installments" && state.role === "manager") {
    openInstallmentSchedule(alert.poId);
    return;
  }
  if (alert.type === "returned-approval" && state.role === "manager") {
    manageReturnedApproval(alert.approvalId);
    return;
  }
  if (alert.type === "delivery") {
    navigate("purchasing");
    const poId = alert.detail.match(/PO-\d+/)?.[0];
    if (poId) window.setTimeout(() => managePO(poId), 40);
    return;
  }
  if (alert.type === "transfer") {
    navigate("transfers");
    return;
  }
  if (alert.type === "receiving") {
    navigate("receiving");
    return;
  }
  navigate(navigation[state.role].some(([route]) => route === "alerts") ? "alerts" : "dashboard");
}

function showToast(title, detail) {
  const region = document.querySelector("#toast-region");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<strong>${title}</strong><span>${detail}</span>`;
  localizeArabic(toast);
  region.append(toast);
  setTimeout(() => toast.remove(), 4500);
}

function saveThresholdSettings(event) {
  event.preventDefault();
  state.thresholds.showroom = Number(document.querySelector("#showroom-threshold").value);
  state.thresholds.lastPull = Number(document.querySelector("#last-pull-threshold").value);
  state.audit.unshift({
    time: "الآن",
    user: roleProfiles.admin.name,
    action: "حدّث حدود المخزون",
    record: `المعرض ${state.thresholds.showroom} م · آخر سحبة ${state.thresholds.lastPull} م`,
  });
  saveState();
  showToast("تم حفظ حدود المخزون", "سيستخدم النظام القيم الجديدة عند مراقبة حركات المخزون القادمة.");
  render();
}

function performScenarioStep() {
  if (state.scenarioStep >= scenarioSteps.length) return;
  const completedStepIndex = state.scenarioStep;
  const step = scenarioSteps[state.scenarioStep];
  if (step.role !== state.role) return;

  const effects = [
    () => state.sales.unshift({ id: "SAL-2082", staff: "سلمى علي", customerName: "أحمد محمود", customerPhone: "01012345678", fabric: "أنجيليكا", color: "كحلي", meters: 8, status: "بانتظار التأكيد", time: "الآن" }),
    () => {
      const sale = state.sales.find((item) => item.id === "SAL-2082");
      if (sale) {
        sale.status = "مؤكد";
        prepareCustomerInvoice(sale);
      }
      state.inventory[0].showroom = 22;
      addAlert(
        ["sales"],
        "approaching",
        `رصيد المعرض وصل إلى حد ${state.thresholds.showroom} مترًا`,
        `أنجيليكا · كحلي · متبقي 22 مترًا · الحد الذي حدده مسؤول النظام ${state.thresholds.showroom} مترًا`,
        "تحويل مخزون",
        "transfer"
      );
    },
    () => {
      state.inventory[0].showroom += 50;
      state.inventory[0].warehouse -= 50;
      const plan = buildReorderPlan(state.inventory[0]);
      addAlert(
        ["inventory"],
        "urgent",
        "إعادة الطلب مطلوبة للحفاظ على استمرارية التوفر",
        `أنجيليكا · كحلي · التغطية الحالية ${plan.daysToStockout} أيام · المورد الموصى به يحتاج ${plan.leadDays} أيام · ابدأ الطلب الآن ليصل قبل نفاد الرصيد`,
        "إدارة إعادة الطلب",
        "reorder",
        { inventoryId: state.inventory[0].id }
      );
    },
    () => {
      const alert = state.alerts.find(
        (item) => item.type === "reorder" && item.detail.includes("ليصل قبل نفاد الرصيد")
      );
      if (alert) {
        const plan = buildReorderPlan(state.inventory[0]);
        submitReorderRecommendation(alert, state.inventory[0], plan.recommendedQuantity);
      }
    },
    () => {
      const recommendation = state.reorderRecommendations.find((item) => item.id === "RR-301");
      const quantity = recommendation?.suggested || 250;
      const unitPrice = recommendation?.unitPrice || 330;
      const total = quantity * unitPrice;
      state.purchaseOrders.unshift({ id: "PO-1048", date: "23 أكتوبر 2026", supplier: recommendation?.supplier || "شركة النور للأقمشة", fabric: "أنجيليكا", color: "كحلي", quantity, total, status: "بانتظار المالك", delivery: "بانتظار الموافقة" });
      state.approvals.unshift({ id: "APR-311", type: "أمر شراء", request: "PO-1048 · أنجيليكا / كحلي", amount: total, requestedBy: "محمد بدوي", status: "قيد الانتظار" });
      if (recommendation) recommendation.status = "تم إنشاء أمر الشراء";
      state.alerts = state.alerts.filter((item) => item.title !== "طلب شراء عاجل من مسؤول المخزون");
    },
    () => {
      const po = state.purchaseOrders.find((item) => item.id === "PO-1048");
      if (po) po.status = "معتمد";
      const approval = state.approvals.find((item) => item.request.startsWith("PO-1048"));
      if (approval) approval.status = "معتمد";
    },
    () => {
      const po = state.purchaseOrders.find((item) => item.id === "PO-1048");
      if (po) {
        po.status = "بانتظار تأكيد المورد";
        po.delivery = "متوقع خلال 9 أيام";
      }
    },
    () => {
      state.receipts.unshift({ id: "REC-779", po: "PO-1048", supplier: "شركة النور للأقمشة", expected: 250, received: 245, result: "يوجد فرق", detail: "المقارنة التلقائية: نقص 5 أمتار" });
      addAlert(["inventory"], "critical", "تم اكتشاف فرق في الشحنة", "PO-1048 · المتوقع 250 م · المستلم 245 م", "إدارة الفرق", "receiving");
      state.alerts.unshift({ id: Date.now(), audience: ["manager"], severity: "urgent", title: "إعداد أقساط أمر الشراء المستلم", detail: "PO-1048 · 23 أكتوبر 2026 · شركة النور للأقمشة · المستلم 245 مترًا من 250", action: "إعداد جدول الأقساط", type: "installments", poId: "PO-1048" });
    },
    () => {
      const receipt = state.receipts.find((item) => item.id === "REC-779");
      if (receipt) {
        receipt.result = "متطابق";
        receipt.detail = "تمت إدارة الفرق والتحقق من 245 مترًا";
      }
      state.inventory[0].warehouse += 245;
      state.alerts = state.alerts.filter((alert) => !(alert.type === "receiving" && alert.detail.includes("PO-1048")));
    },
    () => {
      state.invoices.unshift({ id: "SCH-1048", supplier: "شركة النور للأقمشة", po: "PO-1048", installments: 3, total: 82500, paid: 0, due: "كل 2 أسبوع", status: "مجدول", cadence: "كل 2 أسبوع", equalAmounts: true, customDates: [] });
      state.alerts = state.alerts.filter((alert) => !(alert.type === "installments" && alert.poId === "PO-1048"));
      state.approvals.unshift({ id: "APR-312", type: "دفعة مورد", request: "SCH-1048 · الدفعة الأولى", amount: 27500, requestedBy: "محمد بدوي", status: "قيد الانتظار" });
    },
    () => {
      const approval = state.approvals.find((item) => item.id === "APR-312");
      if (approval) approval.status = "معتمد";
    },
  ];

  effects[state.scenarioStep]();
  state.audit.unshift({
    time: "Just now",
    user: roleProfiles[state.role].name,
    action: step.title,
    record: step.detail,
  });
  state.scenarioStep += 1;
  saveState();
  showToast("Workflow updated", `${step.title} completed. The next user action is ready.`);
  render();
  openModal({
    kicker: "تم تنفيذ الإجراء",
    title: "تمت العملية بنجاح",
    content: `
      <div class="modal-summary">
        <p>تم تنفيذ <strong>${step.title}</strong> وحفظ التحديثات في النظام.</p>
        <p>يمكن الآن الانتقال إلى الإجراء التالي في سير العمل.</p>
      </div>
    `,
    actions: `<button class="button" type="button" id="acknowledge-scenario-action">موافق</button>`,
  });
  document.querySelector("#acknowledge-scenario-action").addEventListener("click", () => {
    closeModal();
    if (completedStepIndex === 1) {
      const sale = state.sales.find((item) => item.id === "SAL-2082");
      if (sale) openCustomerInvoice(sale);
    }
  });
}

function resetScenario() {
  const role = state.role;
  state = seedState();
  state.role = role;
  resetCriticalPopupHistory();
  saveState();
  render();
  showToast("Workflow restarted", "All workflow records returned to their starting state.");
}

function addAlert(audience, severity, title, detail, action, type, linkedRecord = {}) {
  state.alerts.unshift({
    id: Date.now(),
    audience,
    severity,
    title,
    detail,
    action,
    type,
    ...linkedRecord,
  });
}

function createReorderFromInventory(itemId) {
  const item = state.inventory.find((record) => record.id === itemId);
  if (!item) return;
  const existing = state.alerts.find(
    (alert) => alert.type === "reorder"
      && alert.audience.includes("inventory")
      && (
        alert.inventoryId === item.id
        || (
          !alert.inventoryId
          && alert.detail.includes(item.fabric)
          && alert.detail.includes(item.color)
        )
      )
  );
  if (existing) {
    manageAlert(existing.id);
    return;
  }
  const plan = buildReorderPlan(item);
  const proactive = plan.difference === null || plan.difference > 0;
  const alert = {
    id: Date.now(),
    audience: ["inventory"],
    severity: proactive ? "approaching" : "urgent",
    title: proactive ? "طلب إعادة استباقي" : "إعادة الطلب مطلوبة للحفاظ على التوفر",
    detail: `${item.fabric} · ${item.color} · التغطية الحالية ${plan.daysToStockout} أيام · المورد الموصى به يحتاج ${plan.leadDays || "مدة غير مسجلة"} أيام`,
    action: "إدارة إعادة الطلب",
    type: "reorder",
    inventoryId: item.id,
  };
  state.alerts.unshift(alert);
  saveState();
  manageAlert(alert.id);
}

function eligibleSuppliersFor(fabric) {
  return state.suppliers
    .filter((supplier) => supplier.fabrics.includes(fabric))
    .sort((left, right) => left.leadDays - right.leadDays);
}

function calculateReorderMetrics(item) {
  const supplier = eligibleSuppliersFor(item.fabric)[0] || null;
  const warehouseAvailable = item.warehouse;
  const leadTimeDemand = supplier ? item.rate * supplier.leadDays : null;
  const reorderLevel = supplier
    ? Math.ceil(leadTimeDemand + state.thresholds.lastPull)
    : null;
  return {
    supplier,
    warehouseAvailable,
    leadTimeDemand,
    reorderLevel,
    difference: reorderLevel === null ? null : warehouseAvailable - reorderLevel,
  };
}

function buildReorderPlan(item) {
  const {
    supplier,
    warehouseAvailable,
    reorderLevel,
    difference,
  } = calculateReorderMetrics(item);
  const daysToStockout = Math.max(0, Math.floor(warehouseAvailable / item.rate));
  const reviewPeriodDays = 20;
  const leadDays = supplier?.leadDays || 0;
  const demandUntilNextReview = item.rate * (leadDays + reviewPeriodDays);
  const recommendedQuantity = Math.max(
    10,
    Math.ceil((demandUntilNextReview - item.warehouse) / 10) * 10
  );
  return {
    supplier,
    warehouseAvailable,
    reorderLevel,
    difference,
    daysToStockout,
    leadDays: supplier?.leadDays || null,
    recommendedQuantity,
    shortageBeforeDelivery: supplier ? daysToStockout < supplier.leadDays : true,
  };
}

function manageAlert(id) {
  const alert = state.alerts.find((item) => item.id === id);
  if (!alert) return;
  if (state.role === "manager" && alert.type === "purchase-requisition") {
    openNewPO(alert.requestId);
    return;
  }
  if (state.role === "inventory" && alert.type === "reorder") {
    const item = state.inventory.find((record) => record.id === alert.inventoryId)
      || state.inventory.find(
        (record) => alert.detail.includes(record.fabric) && alert.detail.includes(record.color)
      );
    if (!item) {
      showToast("تعذر فتح إعادة الطلب", "لم يعد سجل المخزون المرتبط بهذا التنبيه متاحًا.");
      return;
    }
    const plan = buildReorderPlan(item);
    openModal({
      kicker: "مسؤولية مسؤول المخزون",
      title: "مراجعة طلب الشراء الذكي وإرساله",
      content: `
        <p>${alert.detail}</p>
        <div class="form-grid">
          <label class="field"><span>الرصيد الحالي بالمخزن</span><input value="${plan.warehouseAvailable} مترًا" readonly></label>
          <label class="field"><span>المعروض في المحل</span><input value="${item.showroom} مترًا" readonly></label>
          <label class="field"><span>حد بدء إعادة الطلب</span><input value="${plan.reorderLevel === null ? "غير محسوب" : `${plan.reorderLevel} مترًا`}" readonly></label>
          <label class="field"><span>الموقف من الحد</span><input value="${plan.difference === null ? "غير متاح حتى تسجيل مورد" : plan.difference < 0 ? `عجز ${Math.abs(plan.difference)} مترًا` : plan.difference === 0 ? "وصل إلى الحد" : `فائض ${plan.difference} مترًا`}" readonly></label>
          <label class="field"><span>متوسط المبيعات اليومية</span><input value="${item.rate} متر يوميًا" readonly></label>
          <label class="field"><span>تغطية المخزون الحالية</span><input value="${plan.daysToStockout} أيام" readonly></label>
          <label class="field"><span>المورد المؤهل الأسرع</span><input value="${plan.supplier?.name || "لا يوجد مورد مسجل لهذه الخامة"}" readonly></label>
          <label class="field"><span>مدة التوريد المسجلة</span><input value="${plan.leadDays ? `${plan.leadDays} يومًا` : "غير متاحة"}" readonly></label>
          <label class="field"><span>حالة التوريد</span><input value="${!plan.supplier ? "يجب تسجيل مورد مؤهل أولًا" : plan.shortageBeforeDelivery ? "يلزم اختيار توريد أسرع أو كمية طارئة" : "المورد الموصى به يصل قبل انتهاء التغطية"}" readonly></label>
          <label class="field full-width"><span>الكمية المحسوبة المقترحة</span><input id="recommended-reorder-quantity" type="number" min="1" step="1" value="${plan.recommendedQuantity}"></label>
        </div>
        <div class="callout">
          <strong>كيف حسب النظام الاقتراح؟</strong>
          <p>استخدم معدل المبيعات، والرصيد الحالي، والموردين المسجلين لهذه الخامة، ومدة توريد كل مورد. راجع مسؤول المخزون البيانات ثم يرسل طلب الشراء للمدير.</p>
        </div>
      `,
      actions: `
        <button class="button button-secondary" value="cancel">إبقاء التنبيه مفتوحًا</button>
        <button class="button" type="button" id="submit-reorder-recommendation" ${plan.supplier ? "" : "disabled"}>إرسال طلب الشراء للمدير</button>
      `,
    });
    document.querySelector("#submit-reorder-recommendation").addEventListener("click", () => {
      submitReorderRecommendation(alert, item, Number(document.querySelector("#recommended-reorder-quantity").value));
      advanceCurrentQueuedAlert();
      saveState();
      closeModal();
      render();
      showToast("تم إرسال طلب الشراء", "استلم المدير تنبيهًا عاجلًا بنموذج معبأ مسبقًا لإنشاء أمر الشراء.");
    });
    return;
  }
  if (["payment-approaching", "payment-due", "delivery", "transfer", "receiving", "installments", "returned-approval"].includes(alert.type)) {
    openAlertBusinessAction(alert);
    return;
  }
  openModal({
    kicker: `${alert.severity} alert`,
    title: alert.title,
    content: `
      <p>${alert.detail}</p>
      <div class="callout ${alert.severity === "critical" ? "callout-warning" : ""}">
        <strong>Recommended action</strong><br>${alert.action}. The record will remain visible until completed or deferred with a reason.
      </div>
      <label class="field"><span>Resolution note</span><textarea id="resolution-note" placeholder="Optional note for the audit history"></textarea></label>
    `,
    actions: `
      <button class="button button-secondary" value="cancel">Keep open</button>
      <button class="button" type="button" id="complete-alert">Complete alert</button>
    `,
  });
  document.querySelector("#complete-alert").addEventListener("click", () => {
    completeAlertForCurrentRole(alert);
    saveState();
    closeModal();
    render();
    showToast("Alert completed", "The item was removed from the active work queue.");
  });
}

function completeAlertForCurrentRole(alert) {
  alert.audience = alert.audience.filter((role) => role !== state.role);
  if (!alert.audience.length) {
    state.alerts = state.alerts.filter((item) => item.id !== alert.id);
  }
}

function submitReorderRecommendation(alert, item, suggested) {
  const plan = buildReorderPlan(item);
  let recommendation = state.reorderRecommendations.find(
    (recommendation) => recommendation.fabric === item.fabric
      && recommendation.color === item.color
      && recommendation.status !== "تم إنشاء أمر الشراء"
  );
  if (!recommendation) {
    recommendation = {
      id: `RR-${301 + state.reorderRecommendations.length}`,
      fabric: item.fabric,
      color: item.color,
      remaining: item.warehouse,
      suggested,
      supplier: plan.supplier?.name || "",
      leadDays: plan.leadDays,
      unitPrice: plan.supplier?.unitPrice || 0,
      daysToStockout: plan.daysToStockout,
      status: "أرسلت للمدير",
    };
    state.reorderRecommendations.unshift(recommendation);
  }
  alert.audience = ["manager"];
  alert.severity = "urgent";
  alert.title = "طلب شراء عاجل من مسؤول المخزون";
  alert.detail = `${item.fabric} · ${item.color} · ${suggested} مترًا · ${plan.supplier?.name || "لا يوجد مورد مؤهل"} · مدة التوريد ${plan.leadDays ? `${plan.leadDays} يومًا` : "غير متاحة"}`;
  alert.action = "إنشاء أمر شراء";
  alert.type = "purchase-requisition";
  alert.requestId = recommendation.id;
}

function startQueue() {
  const selected = [...document.querySelectorAll(".alert-check:checked")].map((input) => Number(input.value));
  if (!selected.length) {
    showToast("Select at least one alert", "Use the checkboxes to build your work queue.");
    return;
  }
  showToast("Work queue created", `${selected.length} alert${selected.length === 1 ? "" : "s"} selected. Opening the first item.`);
  beginAlertQueue(selected, "alerts");
}

function updateColorFilter(event) {
  const color = document.querySelector("#color-filter");
  const options = state.inventory.filter((item) => item.fabric === event.target.value);
  color.innerHTML = `<option value="">اختر اللون</option>${options.map((item) => `<option>${item.color}</option>`).join("")}`;
  color.disabled = options.length === 0;
}

function showAvailability(event) {
  event.preventDefault();
  const customerPhone = document.querySelector("#availability-customer-phone").value.replace(/\s+/g, "");
  const customerName = document.querySelector("#availability-customer-name").value.trim();
  const customerType = document.querySelector("#availability-customer-type").value;
  const purposeId = document.querySelector("#sale-purpose-filter").value;
  const fabric = document.querySelector("#fabric-filter").value;
  const color = document.querySelector("#color-filter").value;
  const requestedMeters = Number(document.querySelector("#availability-meters").value);
  const item = state.inventory.find((record) => record.fabric === fabric && record.color === color);
  const result = document.querySelector("#availability-result");
  if (!customerPhone || !customerName || !customerType) {
    result.innerHTML = `<div class="callout callout-warning">أكمل اسم العميل ونوعه قبل فحص التوفر.</div>`;
    return;
  }
  if (!item) return;
  const purpose = salePurposes[purposeId];
  const immediatelyAvailable = item.showroom >= requestedMeters;
  const alternatives = state.inventory
    .filter((candidate) =>
      candidate.id !== item.id
      && purpose?.fabrics.includes(candidate.fabric)
      && candidate.showroom >= requestedMeters
    )
    .sort((left, right) => {
      const leftColorMatch = left.color === color ? 1 : 0;
      const rightColorMatch = right.color === color ? 1 : 0;
      return rightColorMatch - leftColorMatch || right.showroom - left.showroom;
    })
    .slice(0, 4);

  result.innerHTML = `
    <article class="inventory-card">
      <span class="status ${immediatelyAvailable ? "status-approved" : "status-critical"}">${immediatelyAvailable ? "متوفر بالكمية المطلوبة" : "غير متوفر بالكمية المطلوبة"}</span>
      <h3>${item.fabric} · ${item.color}</h3>
      <p><strong>غرض الاستخدام:</strong> ${purpose?.label || "غير محدد"} · <strong>المطلوب:</strong> ${requestedMeters} مترًا</p>
      <div class="stock-split">
        <div class="stock-value"><small>رصيد المعرض</small><strong>${item.showroom} مترًا</strong></div>
        <div class="stock-value"><small>رصيد المخزن فقط</small><strong>${item.warehouse} مترًا</strong></div>
        <div class="stock-value"><small>إجمالي الرصيد الحالي</small><strong>${item.showroom + item.warehouse} مترًا</strong></div>
      </div>
      ${immediatelyAvailable
        ? `<div class="button-row" style="margin-top:16px">
            <button class="button" type="button" id="start-requested-sale">بدء عملية البيع بهذه الخامة</button>
          </div>`
        : `<div class="callout callout-warning" style="margin-top:16px">
            <strong>الكمية المتاحة في المعرض لا تكفي الطلب.</strong>
            <p>${item.warehouse >= requestedMeters ? "توجد كمية كافية في المخزن ويمكن إنشاء مهمة تزويد للمعرض." : "يعرض النظام أدناه خامات بديلة مناسبة لنفس غرض الاستخدام."}</p>
          </div>`}
    </article>
    ${!immediatelyAvailable ? `
      <section class="availability-alternatives" aria-labelledby="alternative-heading">
        <div class="panel-header">
          <div>
            <h3 id="alternative-heading">بدائل مقترحة لغرض: ${purpose?.label || ""}</h3>
            <p>تم ترتيب البدائل حسب تطابق اللون أولًا ثم كمية المعرض المتاحة.</p>
          </div>
        </div>
        ${alternatives.length ? `
          <div class="inventory-grid">
            ${alternatives.map((alternative, index) => `
              <article class="inventory-card alternative-card">
                <span class="status ${index === 0 ? "status-approved" : "status-info"}">${index === 0 ? "البديل الموصى به" : "بديل مناسب"}</span>
                <h3>${alternative.fabric} · ${alternative.color}</h3>
                <p>${alternative.color === color ? "نفس اللون المطلوب" : `لون بديل: ${alternative.color}`} · مناسب لـ ${purpose?.label || "الغرض المحدد"}</p>
                <div class="stock-split">
                  <div class="stock-value"><small>رصيد المعرض</small><strong>${alternative.showroom} مترًا</strong></div>
                  <div class="stock-value"><small>رصيد المخزن فقط</small><strong>${alternative.warehouse} مترًا</strong></div>
                  <div class="stock-value"><small>إجمالي الرصيد الحالي</small><strong>${alternative.showroom + alternative.warehouse} مترًا</strong></div>
                </div>
                <button class="button button-secondary choose-alternative" type="button" data-id="${alternative.id}">اختيار هذا البديل وبدء البيع</button>
              </article>
            `).join("")}
          </div>
        ` : emptyState("لا توجد بدائل متاحة بالكمية المطلوبة", "يمكن تسجيل الطلب غير المتوفر ليستخدمه مسؤول المخزون عند إعادة الطلب.")}
      </section>
    ` : ""}
  `;
  localizeArabic(result);
  result.querySelector("#start-requested-sale")?.addEventListener("click", () => {
    openNewSale({ purposeId, fabric: item.fabric, color: item.color, meters: requestedMeters, customerPhone, customerName, customerType });
  });
  result.querySelectorAll(".choose-alternative").forEach((button) => {
    button.addEventListener("click", () => {
      const alternative = state.inventory.find((candidate) => candidate.id === Number(button.dataset.id));
      if (alternative) {
        openNewSale({
          purposeId,
          fabric: alternative.fabric,
          color: alternative.color,
          meters: requestedMeters,
          customerPhone,
          customerName,
          customerType,
        });
      }
    });
  });
}

function openNewSale(prefill = {}) {
  if (prefill instanceof Event) prefill = {};
  const fabrics = [...new Set(state.inventory.map((item) => item.fabric))];
  const firstFabric = prefill.fabric && fabrics.includes(prefill.fabric) ? prefill.fabric : fabrics[0];
  const firstColors = state.inventory.filter((item) => item.fabric === firstFabric);
  const firstColor = firstColors.some((item) => item.color === prefill.color)
    ? prefill.color
    : firstColors[0]?.color;
  openModal({
    title: "التعرف على العميل وبدء البيع",
    content: `
      <div class="form-grid">
        <label class="field full-width"><span>رقم هاتف العميل</span><input id="customer-phone" type="tel" inputmode="tel" placeholder="مثال: 01012345678" autocomplete="tel" value="${prefill.customerPhone || ""}"></label>
      </div>
      <div class="button-row">
        <button class="button button-secondary" type="button" id="lookup-customer">البحث عن العميل</button>
      </div>
      <div id="customer-lookup-result" aria-live="polite"></div>
      <div id="sale-entry-fields" hidden>
        <hr>
        <div class="form-grid">
          <label class="field full-width"><span>اسم العميل</span><input id="customer-name" autocomplete="name"></label>
          <label class="field full-width"><span>نوع العميل</span><select id="customer-type"><option>عميل عادي</option><option>ترزي</option></select></label>
          <label class="field full-width"><span>غرض الاستخدام</span><select id="sale-purpose" required><option value="">اختر غرض الاستخدام</option>${salePurposeOptions(prefill.purposeId || "")}</select></label>
          <label class="field"><span>الخامة</span><select id="sale-fabric">${fabrics.map((fabric) => `<option ${fabric === firstFabric ? "selected" : ""}>${fabric}</option>`).join("")}</select></label>
          <label class="field"><span>اللون</span><select id="sale-color">${firstColors.map((item) => `<option ${item.color === firstColor ? "selected" : ""}>${item.color}</option>`).join("")}</select></label>
          <label class="field"><span>الأمتار المطلوبة</span><input id="sale-meters" type="number" min="0.5" step="0.5" value="${prefill.meters || 8}"></label>
          <label class="field"><span>المتاح في المعرض</span><input id="sale-available" value="${firstColors.find((item) => item.color === firstColor)?.showroom || 0} مترًا متاحًا" readonly></label>
        </div>
        <div class="callout">${prefill.fabric
          ? "تم تعبئة الخامة واللون والكمية من نتيجة بحث التوفر. لن يخصم النظام الكمية قبل تأكيد المدير."
          : "لن يخصم النظام الكمية من المخزون قبل تأكيد المدير."}
        </div>
      </div>
    `,
    actions: `<button class="button button-secondary" value="cancel">إلغاء</button><button class="button" type="button" id="submit-sale" disabled>إرسال للتأكيد</button>`,
  });

  const phoneInput = document.querySelector("#customer-phone");
  const customerName = document.querySelector("#customer-name");
  const customerType = document.querySelector("#customer-type");
  const result = document.querySelector("#customer-lookup-result");
  const saleFields = document.querySelector("#sale-entry-fields");
  const submit = document.querySelector("#submit-sale");
  const purpose = document.querySelector("#sale-purpose");
  const fabric = document.querySelector("#sale-fabric");
  const color = document.querySelector("#sale-color");
  const available = document.querySelector("#sale-available");

  const updateAvailability = () => {
    const item = state.inventory.find(
      (record) => record.fabric === fabric.value && record.color === color.value
    );
    available.value = `${item?.showroom || 0} مترًا متاحًا`;
  };

  document.querySelector("#lookup-customer").addEventListener("click", () => {
    const phone = phoneInput.value.replace(/\s+/g, "");
    if (!phone) {
      result.innerHTML = `<div class="callout callout-warning">أدخل رقم هاتف العميل أولًا.</div>`;
      saleFields.hidden = true;
      submit.disabled = true;
      return;
    }
    const customer = state.customers.find((item) => item.phone === phone);
    customerName.value = customer?.name || prefill.customerName || "";
    customerType.value = customer?.type || prefill.customerType || "عميل عادي";
    customerName.readOnly = Boolean(customer);
    customerType.disabled = Boolean(customer);
    result.innerHTML = customer
      ? `<div class="callout"><strong>تم العثور على العميل:</strong> ${customer.name} · ${customer.type || "عميل عادي"}</div>`
      : `<div class="callout"><strong>عميل جديد.</strong> أدخل الاسم وحدد نوع العميل ثم أكمل بيانات البيع.</div>`;
    saleFields.hidden = false;
    submit.disabled = false;
    if (!customer) customerName.focus();
  });

  fabric.addEventListener("change", () => {
    const colors = state.inventory.filter((item) => item.fabric === fabric.value);
    color.innerHTML = colors.map((item) => `<option>${item.color}</option>`).join("");
    updateAvailability();
  });
  color.addEventListener("change", updateAvailability);

  document.querySelector("#submit-sale").addEventListener("click", () => {
    const phone = phoneInput.value.replace(/\s+/g, "");
    const name = customerName.value.trim();
    const type = customerType.value;
    if (!phone || !name || !type || !purpose.value) {
      result.innerHTML = `<div class="callout callout-warning">يجب تسجيل رقم الهاتف واسم العميل ونوعه وغرض الاستخدام قبل إرسال البيع.</div>`;
      return;
    }
    if (!state.customers.some((item) => item.phone === phone)) {
      state.customers.push({ phone, name, type });
    }
    state.sales.unshift({
      id: `SAL-${2081 + state.sales.length}`,
      staff: roleProfiles.sales.name,
      customerName: name,
      customerPhone: phone,
      customerType: type,
      purposeId: purpose.value,
      purpose: salePurposes[purpose.value]?.label || "",
      fabric: fabric.value,
      color: color.value,
      meters: Number(document.querySelector("#sale-meters").value),
      status: "بانتظار التأكيد",
      time: "الآن",
    });
    saveState();
    closeModal();
    render();
    showToast("Sale submitted", "The Manager received a confirmation request. Inventory has not changed.");
  });
  if (prefill.customerPhone) {
    document.querySelector("#lookup-customer").click();
  }
}

function prepareCustomerInvoice(sale) {
  const item = state.inventory.find(
    (inventory) => inventory.fabric === sale.fabric && inventory.color === sale.color
  );
  if (!item?.salePrice) return;
  sale.unitPrice = item.salePrice;
  sale.total = sale.meters * sale.unitPrice;
  sale.invoiceNumber = sale.invoiceNumber || `CSI-${sale.id.replace("SAL-", "")}`;
  sale.confirmedAt = sale.confirmedAt || new Intl.DateTimeFormat("ar-EG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date());
}

function customerInvoiceMarkup(sale) {
  return `
    <article class="customer-invoice" aria-label="فاتورة بيع العميل">
      <div class="invoice-heading">
        <div>
          <span class="status status-approved">بيع مؤكد</span>
          <h3>فاتورة بيع</h3>
        </div>
        <div class="invoice-number">
          <small>رقم الفاتورة</small>
          <strong>${sale.invoiceNumber}</strong>
        </div>
      </div>
      <dl class="invoice-details">
        <div><dt>التاريخ</dt><dd>${sale.confirmedAt}</dd></div>
        <div><dt>موظف المبيعات</dt><dd>${sale.staff}</dd></div>
        <div><dt>الخامة</dt><dd>${sale.fabric}</dd></div>
        <div><dt>اللون</dt><dd>${sale.color}</dd></div>
        <div><dt>الكمية</dt><dd>${sale.meters} متر</dd></div>
        <div><dt>سعر المتر</dt><dd>${money(sale.unitPrice)}</dd></div>
      </dl>
      <div class="invoice-total">
        <span>الإجمالي</span>
        <strong>${money(sale.total)}</strong>
      </div>
    </article>
  `;
}

function openCustomerInvoice(sale) {
  if (!sale.invoiceNumber) prepareCustomerInvoice(sale);
  if (!sale.invoiceNumber) {
    showToast("تعذر إنشاء الفاتورة", "لا يوجد سعر بيع مسجل لهذه الخامة واللون.");
    return;
  }
  openModal({
    kicker: "فاتورة العميل",
    title: "تم تأكيد البيع وإنشاء الفاتورة",
    content: customerInvoiceMarkup(sale),
    actions: `
      <button class="button button-secondary" value="cancel">إغلاق</button>
      <button class="button" type="button" id="print-customer-invoice">طباعة الفاتورة</button>
    `,
  });
  document.querySelector("#print-customer-invoice").addEventListener("click", () => {
    printCustomerInvoice(sale);
  });
}

function printCustomerInvoice(sale) {
  const printWindow = window.open("", "_blank", "width=800,height=900");
  if (!printWindow) {
    showToast("تعذرت الطباعة", "اسمح بفتح النوافذ المنبثقة ثم حاول مرة أخرى.");
    return;
  }
  printWindow.document.write(`<!doctype html>
    <html lang="ar" dir="rtl">
      <head>
        <meta charset="utf-8">
        <title>${sale.invoiceNumber} | SmartTex</title>
        <style>
          body{font-family:Tahoma,Arial,sans-serif;color:#1d2b39;margin:40px;line-height:1.6}
          header{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #173f61;padding-bottom:18px;margin-bottom:24px}
          h1{margin:0;color:#173f61} small{color:#637386}
          dl{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:24px 0}
          dl div{border:1px solid #d9e1e8;border-radius:10px;padding:12px}
          dt{color:#637386;font-size:13px} dd{margin:4px 0 0;font-weight:700}
          .total{display:flex;justify-content:space-between;background:#e8f2fa;border-radius:12px;padding:18px;font-size:22px}
        </style>
      </head>
      <body>
        <header><div><h1>SmartTex</h1><small>فاتورة بيع عميل</small></div><strong>${sale.invoiceNumber}</strong></header>
        <dl>
          <div><dt>التاريخ</dt><dd>${sale.confirmedAt}</dd></div>
          <div><dt>موظف المبيعات</dt><dd>${sale.staff}</dd></div>
          <div><dt>الخامة</dt><dd>${sale.fabric}</dd></div>
          <div><dt>اللون</dt><dd>${sale.color}</dd></div>
          <div><dt>الكمية</dt><dd>${sale.meters} متر</dd></div>
          <div><dt>سعر المتر</dt><dd>${money(sale.unitPrice)}</dd></div>
        </dl>
        <div class="total"><span>الإجمالي</span><strong>${money(sale.total)}</strong></div>
        <script>window.addEventListener("load",()=>window.print());<\/script>
      </body>
    </html>`);
  printWindow.document.close();
}

function confirmSale(id) {
  const sale = state.sales.find((item) => item.id === id);
  openModal({
    title: `إدارة عملية البيع ${id}`,
    content: `
      <div class="form-grid">
        <div><p class="eyebrow">الخامة واللون</p><strong>${sale.fabric} · ${sale.color}</strong></div>
        <div><p class="eyebrow">الكمية المطلوبة</p><strong>${sale.meters} متر</strong></div>
      </div>
      <div class="callout">يخصم التأكيد الكمية من مخزون المعرض كوحدة واحدة. إذا أصبح الرصيد ${state.thresholds.showroom} مترًا أو أقل، ينشئ النظام مهمة تزويد لموظف المبيعات.</div>
    `,
    actions: `<button class="button button-secondary" value="cancel">رجوع</button><button class="button button-danger" type="button" id="reject-sale">رفض</button><button class="button" type="button" id="approve-sale">تأكيد البيع</button>`,
  });
  document.querySelector("#approve-sale").addEventListener("click", () => {
    sale.status = "مؤكد";
    const item = state.inventory.find((inventory) => inventory.fabric === sale.fabric && inventory.color === sale.color);
    if (item) {
      item.showroom -= sale.meters;
      if (item.showroom <= state.thresholds.showroom) {
        addAlert(
          ["sales"],
          "approaching",
          `رصيد المعرض يحتاج إلى تزويد`,
          `${item.fabric} · ${item.color} · متبقي ${item.showroom} مترًا`,
          "تحويل مخزون",
          "transfer"
        );
      }
    }
    prepareCustomerInvoice(sale);
    saveState();
    closeModal();
    render();
    showToast("Sale confirmed", "Showroom inventory was updated atomically.");
    openCustomerInvoice(sale);
  });
  document.querySelector("#reject-sale").addEventListener("click", () => {
    sale.status = "مرفوض";
    saveState();
    closeModal();
    render();
    showToast("Sale rejected", "Inventory was not changed.");
  });
}

function transferStock(id) {
  const item = state.inventory.find((record) => record.id === id);
  if (!item || item.warehouse <= 0) {
    showToast("التحويل غير متاح", "لا يوجد رصيد متاح في المخزن لهذه الخامة.");
    return;
  }
  const suggestion = Math.min(50, item.warehouse);
  openModal({
    title: "تحويل مخزون إلى المعرض",
    content: `
      <p><strong>${item.fabric} · ${item.color}</strong></p>
      <div class="form-grid">
        <label class="field"><span>كمية المعرض</span><input value="${item.showroom} متر" readonly></label>
        <label class="field"><span>كمية المخزن</span><input value="${item.warehouse} متر" readonly></label>
        <label class="field full-width"><span>الأمتار المحولة</span><input id="transfer-meters" type="number" min="1" max="${item.warehouse}" value="${suggestion}"></label>
      </div>
    `,
    actions: `<button class="button button-secondary" value="cancel">إلغاء</button><button class="button" id="confirm-transfer" type="button">تأكيد التحويل</button>`,
  });
  document.querySelector("#confirm-transfer").addEventListener("click", () => {
    const meters = Number(document.querySelector("#transfer-meters").value);
    if (!Number.isFinite(meters) || meters <= 0 || meters > item.warehouse) {
      showToast("كمية التحويل غير صحيحة", `أدخل كمية بين 1 و${item.warehouse} مترًا.`);
      return;
    }
    item.showroom += meters;
    item.warehouse -= meters;
    const plan = buildReorderPlan(item);
    if (plan.difference !== null && plan.difference <= 0) {
      addAlert(
        ["inventory"],
        "urgent",
        "إعادة الطلب مطلوبة للحفاظ على استمرارية التوفر",
        `${item.fabric} · ${item.color} · التغطية الحالية ${plan.daysToStockout} أيام · المورد الموصى به يحتاج ${plan.leadDays} أيام`,
        "إدارة إعادة الطلب",
        "reorder",
        { inventoryId: item.id }
      );
    }
    completeCurrentQueuedAlert(["transfer"]);
    state.alerts = state.alerts.filter(
      (alert) => !(
        alert.type === "transfer"
        && alert.audience.includes("sales")
        && alert.detail.includes(item.fabric)
        && alert.detail.includes(item.color)
      )
    );
    saveState();
    closeModal();
    render();
    showToast("Transfer completed", "Showroom and warehouse quantities were updated together.");
  });
}

function supplierOptionsFor(fabric, preferredSupplier = "") {
  const eligibleSuppliers = eligibleSuppliersFor(fabric);
  const recommended = eligibleSuppliers.find((supplier) => supplier.name === preferredSupplier)
    || eligibleSuppliers[0]
    || null;
  const options = eligibleSuppliers.length
    ? eligibleSuppliers.map((supplier) => `
        <option value="${supplier.name}" ${supplier.name === recommended?.name ? "selected" : ""}>
          ${supplier.name}${supplier.name === recommended?.name ? ` — موصى به: الأسرع (${supplier.leadDays} يومًا)` : ` — ${supplier.leadDays} يومًا`}
        </option>
      `).join("")
    : `<option value="">لا يوجد مورد مسجل لهذه الخامة</option>`;
  return { eligibleSuppliers, recommended, options };
}

function openNewPO(recommendationId = "") {
  const recommendation = recommendationId
    ? state.reorderRecommendations.find(
        (item) => item.id === recommendationId && item.status === "أرسلت للمدير"
      )
    : null;
  const isPrefilled = Boolean(recommendation);
  const fabrics = [...new Set(state.inventory.map((item) => item.fabric))];
  const fabric = recommendation?.fabric || fabrics[0];
  const colors = state.inventory.filter((item) => item.fabric === fabric).map((item) => item.color);
  const color = recommendation?.color || colors[0];
  const supplierData = supplierOptionsFor(fabric, recommendation?.supplier);
  openModal({
    kicker: isPrefilled ? "طلب شراء من مسؤول المخزون" : "أمر شراء جديد",
    title: isPrefilled ? "إنشاء أمر شراء من الطلب المرسل" : "إنشاء أمر شراء جديد",
    content: `
      <div class="form-grid">
        <label class="field"><span>الخامة</span>${isPrefilled
          ? `<input id="po-fabric" value="${fabric}" readonly>`
          : `<select id="po-fabric">${fabrics.map((item) => `<option>${item}</option>`).join("")}</select>`}
        </label>
        <label class="field"><span>اللون</span>${isPrefilled
          ? `<input id="po-color" value="${color}" readonly>`
          : `<select id="po-color">${colors.map((item) => `<option>${item}</option>`).join("")}</select>`}
        </label>
        <label class="field"><span>${isPrefilled ? "الكمية المقترحة" : "الكمية المطلوبة"}</span><input id="po-quantity" type="number" min="1" value="${recommendation?.suggested || 100}"></label>
        <label class="field"><span>المورد المسجل</span><select id="po-supplier">${supplierData.options}</select></label>
        <label class="field"><span>سعر الوحدة التقديري</span><input id="po-unit-price" value="${supplierData.recommended ? money(supplierData.recommended.unitPrice) : "غير متاح"}" readonly></label>
        <label class="field"><span>مدة توريد المورد</span><input id="po-lead-time" value="${supplierData.recommended ? `${supplierData.recommended.leadDays} يومًا` : "غير متاحة"}" readonly></label>
      </div>
      <div class="callout">${isPrefilled
        ? "عبّأ النظام النموذج من طلب مسؤول المخزون، ويمكن للمدير مراجعة الكمية واختيار مورد مؤهل آخر."
        : "اختار الخامة واللون والكمية. سيعرض النظام الموردين المسجلين للخامة المختارة فقط، ويحدد الأسرع كمورد موصى به."}
      </div>
    `,
    actions: `<button class="button button-secondary" value="cancel">إلغاء</button><button class="button" type="button" id="submit-po" ${supplierData.recommended ? "" : "disabled"}>إرسال لموافقة المالك</button>`,
  });

  const updateSupplierDetails = () => {
    const supplier = state.suppliers.find(
      (item) => item.name === document.querySelector("#po-supplier").value
    );
    document.querySelector("#po-unit-price").value = supplier ? money(supplier.unitPrice) : "غير متاح";
    document.querySelector("#po-lead-time").value = supplier ? `${supplier.leadDays} يومًا` : "غير متاحة";
    document.querySelector("#submit-po").disabled = !supplier;
  };

  const updateSupplierOptions = (selectedFabric, preferredSupplier = "") => {
    const data = supplierOptionsFor(selectedFabric, preferredSupplier);
    document.querySelector("#po-supplier").innerHTML = data.options;
    updateSupplierDetails();
  };

  const fabricControl = document.querySelector("#po-fabric");
  if (!isPrefilled) {
    fabricControl.addEventListener("change", () => {
      const selectedFabric = fabricControl.value;
      const fabricColors = state.inventory
        .filter((item) => item.fabric === selectedFabric)
        .map((item) => item.color);
      document.querySelector("#po-color").innerHTML = fabricColors
        .map((item) => `<option>${item}</option>`)
        .join("");
      updateSupplierOptions(selectedFabric);
    });
  }
  document.querySelector("#po-supplier").addEventListener("change", updateSupplierDetails);

  document.querySelector("#submit-po").addEventListener("click", () => {
    const id = `PO-${1046 + state.purchaseOrders.length}`;
    const selectedFabric = document.querySelector("#po-fabric").value;
    const selectedColor = document.querySelector("#po-color").value;
    const quantity = Number(document.querySelector("#po-quantity").value);
    const supplierName = document.querySelector("#po-supplier").value;
    const supplier = state.suppliers.find((item) => item.name === supplierName);
    if (!supplier || !supplier.fabrics.includes(selectedFabric)) return;
    const total = quantity * supplier.unitPrice;
    state.purchaseOrders.unshift({ id, date: new Intl.DateTimeFormat("ar-EG", { dateStyle: "medium" }).format(new Date()), supplier: supplier.name, fabric: selectedFabric, color: selectedColor, quantity, total, status: "بانتظار المالك", delivery: "بانتظار الموافقة" });
    state.approvals.unshift({ id: `APR-${310 + state.approvals.length}`, type: "أمر شراء", request: `${id} · ${selectedFabric} / ${selectedColor}`, amount: total, requestedBy: roleProfiles.manager.name, status: "قيد الانتظار" });
    if (recommendation) {
      recommendation.status = "تم إنشاء أمر الشراء";
      completeCurrentQueuedAlert(["purchase-requisition"]);
      state.alerts = state.alerts.filter((item) => item.requestId !== recommendation.id);
    }
    saveState();
    closeModal();
    render();
    showToast("Purchase order submitted", "The Owner received an approval request.");
  });
}

function managePO(id) {
  const po = state.purchaseOrders.find((item) => item.id === id);
  const approved = ["معتمد", "بانتظار المورد", "بانتظار تأكيد المورد"].includes(po.status);
  openModal({
    title: `إدارة ${po.id}`,
    content: `
      <p><strong>${po.supplier}</strong> · ${po.fabric} / ${po.color} · ${po.quantity} متر</p>
      <div class="callout ${approved ? "" : "callout-warning"}">
        <strong>الحالة الحالية: ${po.status}</strong>
        <p>${approved
          ? "وافق المالك على أمر الشراء، ويمكن الآن إرساله إلى المورد وتسجيل رده."
          : "لا يمكن إرسال أمر الشراء إلى المورد أو تسجيل أي رد قبل موافقة المالك."}
        </p>
      </div>
      ${approved ? `
        <label class="field"><span>رد المورد</span><select id="supplier-response">
          <option>مؤكد</option>
          <option>تغيير الكمية</option>
          <option>تغيير السعر</option>
          <option>تأخير التوريد</option>
          <option>متوفر جزئيًا</option>
        </select></label>
      ` : ""}
    `,
    actions: `<button class="button button-secondary" value="cancel">إغلاق</button>${approved
      ? `<button class="button" id="send-whatsapp" type="button">إرسال أمر الشراء عبر واتساب</button>`
      : `<button class="button" type="button" disabled>بانتظار موافقة المالك</button>`}`,
  });
  if (!approved) return;
  document.querySelector("#send-whatsapp").addEventListener("click", () => {
    po.status = "بانتظار تأكيد المورد";
    const supplier = state.suppliers.find((item) => item.name === po.supplier);
    po.delivery = supplier ? `متوقع خلال ${supplier.leadDays} أيام` : "بانتظار تأكيد المورد";
    completeCurrentQueuedAlert(["delivery"]);
    saveState();
    closeModal();
    render();
    showToast("تم إرسال أمر الشراء", "تم تحديث الحالة إلى بانتظار تأكيد المورد.");
  });
}

function openInstallmentSchedule(preselectedPoId = "") {
  const receivedPoIds = new Set(state.receipts.map((receipt) => receipt.po));
  const eligibleOrders = state.purchaseOrders.filter(
    (po) => receivedPoIds.has(po.id) || po.id === preselectedPoId
  );
  const orders = eligibleOrders.length ? eligibleOrders : state.purchaseOrders;
  const selectedOrder = orders.find((po) => po.id === preselectedPoId) || orders[0];
  if (!selectedOrder) {
    showToast("لا يوجد أمر شراء مستلم", "يجب تسجيل استلام أمر شراء قبل إعداد جدول الأقساط.");
    return;
  }
  openModal({
    title: "إعداد جدول أقساط أمر الشراء",
    content: `
      <div class="form-grid">
        <label class="field full-width"><span>أمر الشراء المستلم وتاريخه</span><select id="installment-po">${orders.map((po) => `<option value="${po.id}" ${po.id === selectedOrder.id ? "selected" : ""}>${po.id} · ${po.date || "التاريخ غير مسجل"} · ${po.supplier}</option>`).join("")}</select></label>
        <label class="field"><span>عدد الأقساط المتفق عليها</span><input id="installment-count" type="number" min="1" max="24" value="3"></label>
        <label class="field"><span>إجمالي أمر الشراء</span><input id="installment-total" value="${money(selectedOrder.total)}" readonly></label>
      </div>
      <label class="critical-popup-item">
        <input id="equal-installment-amounts" type="checkbox" checked>
        <div><strong>الأقساط متساوية القيمة</strong><p>يقسم النظام إجمالي أمر الشراء بالتساوي على عدد الأقساط.</p></div>
      </label>
      <label class="critical-popup-item">
        <input id="recurring-installment-dates" type="checkbox" checked>
        <div><strong>مواعيد دورية ثابتة</strong><p>حدد التكرار، مثل كل أسبوعين أو كل شهر.</p></div>
      </label>
      <div id="recurring-installment-fields" class="form-grid">
        <label class="field"><span>كل عدد</span><input id="installment-interval" type="number" min="1" value="2"></label>
        <label class="field"><span>وحدة التكرار</span><select id="installment-unit"><option value="يوم">أيام</option><option value="أسبوع" selected>أسابيع</option><option value="شهر">أشهر</option></select></label>
      </div>
      <label class="critical-popup-item">
        <input id="custom-installment-dates" type="checkbox">
        <div><strong>تواريخ مخصصة</strong><p>ينشئ النظام حقول تاريخ بعدد الأقساط المدخل.</p></div>
      </label>
      <div id="custom-installment-fields" class="form-grid" hidden></div>
      <div class="callout">يبدأ تتبع الاستحقاقات والتنبيهات بعد حفظ الجدول. عند حلول موعد دفعة، يرسل المدير طلب موافقة إلى المالك.</div>
    `,
    actions: `<button class="button button-secondary" value="cancel">إلغاء</button><button class="button" id="save-installment-schedule" type="button">حفظ جدول الأقساط</button>`,
  });

  const poSelect = document.querySelector("#installment-po");
  const countInput = document.querySelector("#installment-count");
  const recurring = document.querySelector("#recurring-installment-dates");
  const custom = document.querySelector("#custom-installment-dates");
  const recurringFields = document.querySelector("#recurring-installment-fields");
  const customFields = document.querySelector("#custom-installment-fields");

  const renderCustomDates = () => {
    const count = Math.max(1, Number(countInput.value) || 1);
    customFields.innerHTML = Array.from({ length: count }, (_, index) => `
      <label class="field"><span>تاريخ القسط ${index + 1}</span><input class="custom-installment-date" type="date" required></label>
    `).join("");
  };
  const updateScheduleMode = (useCustom) => {
    custom.checked = useCustom;
    recurring.checked = !useCustom;
    customFields.hidden = !useCustom;
    recurringFields.hidden = useCustom;
    if (useCustom) renderCustomDates();
  };

  poSelect.addEventListener("change", () => {
    const po = state.purchaseOrders.find((item) => item.id === poSelect.value);
    document.querySelector("#installment-total").value = money(po?.total || 0);
  });
  recurring.addEventListener("change", () => updateScheduleMode(!recurring.checked));
  custom.addEventListener("change", () => updateScheduleMode(custom.checked));
  countInput.addEventListener("input", () => {
    if (custom.checked) renderCustomDates();
  });

  document.querySelector("#save-installment-schedule").addEventListener("click", () => {
    const po = state.purchaseOrders.find((item) => item.id === poSelect.value);
    const count = Math.max(1, Number(countInput.value) || 1);
    if (!po) return;
    const customDates = custom.checked
      ? [...document.querySelectorAll(".custom-installment-date")].map((input) => input.value)
      : [];
    if (custom.checked && customDates.some((date) => !date)) {
      showToast("أكمل تواريخ الأقساط", "يجب تحديد تاريخ لكل قسط مخصص.");
      return;
    }
    const interval = Number(document.querySelector("#installment-interval").value);
    const unit = document.querySelector("#installment-unit").value;
    const schedule = {
      id: `SCH-${po.id.replace("PO-", "")}`,
      supplier: po.supplier,
      po: po.id,
      installments: count,
      total: po.total,
      paid: 0,
      due: custom.checked ? customDates[0] : `كل ${interval} ${unit}`,
      status: "مجدول",
      cadence: custom.checked ? "تواريخ مخصصة" : `كل ${interval} ${unit}`,
      equalAmounts: document.querySelector("#equal-installment-amounts").checked,
      customDates,
    };
    state.invoices = state.invoices.filter((item) => item.po !== po.id);
    state.invoices.unshift(schedule);
    completeCurrentQueuedAlert(["installments"]);
    state.alerts = state.alerts.filter(
      (alert) => !(alert.type === "installments" && alert.poId === po.id && alert.audience.includes("manager"))
    );
    saveState();
    closeModal();
    render();
    showToast("تم حفظ جدول الأقساط", `تم إنشاء ${count} أقساط لأمر الشراء ${po.id} وبدأ تتبع المواعيد.`);
  });
}

function manageInvoice(id, alertStage = "") {
  const invoice = state.invoices.find((item) => item.id === id);
  const existingApproval = state.approvals.find(
    (approval) => approval.type === "دفعة مورد"
      && approval.request.startsWith(`${invoice.id} ·`)
      && ["قيد الانتظار", "معاد للمدير"].includes(approval.status)
  );
  const approaching = alertStage === "approaching" || invoice.status === "يقترب";
  openModal({
    title: `إدارة أقساط ${invoice.po}`,
    content: `
      <div class="form-grid">
        <div><p class="eyebrow">إجمالي أمر الشراء</p><strong>${money(invoice.total)}</strong></div>
        <div><p class="eyebrow">المبلغ المتبقي</p><strong>${money(invoice.total - invoice.paid)}</strong></div>
      </div>
      <div class="callout ${approaching ? "" : "callout-warning"}">
        <strong>${approaching ? "الموعد يقترب" : "الدفعة مستحقة اليوم"}</strong>
        <p>${approaching
          ? "تواصل مع المورد مبكرًا. يمكنك بدء الموافقة أو تسجيل موعد جديد تم الاتفاق عليه."
          : "يجب متابعة قرار المالك اليوم. إذا أعاد الطلب، عدّل الموعد بعد الاتفاق مع المورد ثم أرسله مرة أخرى."}</p>
      </div>
      <p><strong>الموعد الحالي:</strong> ${invoice.due}</p>
      ${existingApproval ? `<div class="callout"><strong>حالة طلب الموافقة:</strong> ${existingApproval.status}</div>` : ""}
    `,
    actions: `
      <button class="button button-secondary" value="cancel">إغلاق</button>
      <button class="button button-secondary" id="postpone-payment" type="button">تأجيل باتفاق المورد</button>
      ${existingApproval
        ? `<button class="button" type="button" id="view-payment-approval">${existingApproval.status === "معاد للمدير" ? "تعديل الطلب المعاد" : "عرض طلب الموافقة"}</button>`
        : `<button class="button" id="request-payment" type="button">طلب موافقة المالك</button>`}
    `,
  });
  document.querySelector("#postpone-payment").addEventListener("click", () => {
    openPostponePayment(invoice);
  });
  document.querySelector("#request-payment")?.addEventListener("click", () => {
    const approval = {
      id: `APR-${310 + state.approvals.length}`,
      type: "دفعة مورد",
      request: `${invoice.id} · الدفعة التالية`,
      amount: Math.min(invoice.total - invoice.paid, 31500),
      requestedBy: roleProfiles.manager.name,
      status: "قيد الانتظار",
      comments: [{ by: roleProfiles.manager.name, role: roleProfiles.manager.label, time: "الآن", text: `طلب موافقة للدفعة المستحقة في ${invoice.due}.` }],
    };
    state.approvals.unshift(approval);
    if (!state.alerts.some((alert) => alert.type === "payment-due" && alert.approvalId === approval.id)) {
      state.alerts.unshift({
        id: Date.now(),
        audience: ["owner"],
        severity: invoice.status === "يستحق اليوم" ? "critical" : "urgent",
        title: invoice.status === "يستحق اليوم" ? "دفعة مورد مستحقة اليوم" : "طلب موافقة على دفعة قادمة",
        detail: `${invoice.supplier} · ${money(approval.amount)} · ${invoice.due}`,
        action: "إدارة طلب الدفع",
        type: "payment-due",
        scheduleId: invoice.id,
        approvalId: approval.id,
      });
    }
    completeCurrentQueuedAlert([approaching ? "payment-approaching" : "payment-due"]);
    saveState();
    closeModal();
    render();
    showToast("تم طلب الموافقة", "وصل طلب دفعة المورد إلى المالك.");
  });
  document.querySelector("#view-payment-approval")?.addEventListener("click", () => {
    closeModal();
    if (existingApproval.status === "معاد للمدير") manageReturnedApproval(existingApproval.id);
    else manageApproval(existingApproval.id);
  });
}

function openPostponePayment(invoice) {
  closeModal();
  openModal({
    kicker: "اتفاق جديد مع المورد",
    title: `تأجيل موعد ${invoice.id}`,
    content: `
      <p><strong>${invoice.supplier}</strong> · الموعد الحالي: ${invoice.due}</p>
      <div class="form-grid">
        <label class="field"><span>الموعد الجديد المتفق عليه</span><input id="postponed-due-date" type="date" required></label>
        <label class="field full-width"><span>ملاحظة الاتفاق مع المورد</span><textarea id="postponement-note" required placeholder="سجل سبب التأجيل وكيف تم الاتفاق مع المورد"></textarea></label>
      </div>
    `,
    actions: `<button class="button button-secondary" value="cancel">إلغاء</button><button class="button" type="button" id="confirm-postponement">حفظ الموعد الجديد</button>`,
  });
  document.querySelector("#confirm-postponement").addEventListener("click", () => {
    const newDate = document.querySelector("#postponed-due-date").value;
    const note = document.querySelector("#postponement-note").value.trim();
    if (!newDate || !note) {
      showToast("بيانات التأجيل مطلوبة", "حدد الموعد الجديد وسجل ملاحظة الاتفاق.");
      return;
    }
    invoice.due = newDate;
    invoice.status = "مؤجل باتفاق المورد";
    invoice.postponements = invoice.postponements || [];
    invoice.postponements.push({ date: newDate, note, by: roleProfiles.manager.name, time: "الآن" });
    completeCurrentQueuedAlert(["payment-approaching", "payment-due"]);
    state.alerts = state.alerts.filter(
      (alert) => !(
        ["payment-approaching", "payment-due"].includes(alert.type)
        && alert.scheduleId === invoice.id
        && alert.audience.includes("manager")
      )
    );
    saveState();
    closeModal();
    render();
    showToast("تم تحديث موعد الدفعة", "تم حفظ الموعد الجديد وملاحظة الاتفاق مع المورد.");
  });
}

function openReceiving() {
  const receivableOrders = state.purchaseOrders.filter((po) =>
    ["معتمد", "بانتظار المورد", "بانتظار تأكيد المورد", "مؤكد من المورد", "مستلم جزئيًا"].includes(po.status)
  );
  const orders = receivableOrders.length ? receivableOrders : state.purchaseOrders;
  const selectedOrder = orders[0];
  if (!selectedOrder) {
    showToast("لا يوجد أمر شراء متاح", "يجب اعتماد أمر شراء قبل تسجيل الاستلام.");
    return;
  }
  openModal({
    title: "تسجيل شحنة المورد",
    content: `
      <div class="form-grid">
        <label class="field full-width"><span>أمر الشراء وتاريخه</span><select id="receiving-po">${orders.map((po) => `<option value="${po.id}">${po.id} · ${po.date || "التاريخ غير مسجل"} · ${po.fabric} / ${po.color}</option>`).join("")}</select></label>
        <label class="field"><span>الكمية المطلوبة في أمر الشراء</span><input id="ordered-meters" value="${selectedOrder.quantity} مترًا" readonly></label>
        <label class="field"><span>الأثواب المستلمة</span><input type="number" value="5"></label>
        <label class="field"><span>الأمتار المستلمة فعليًا</span><input id="received-meters" type="number" min="0" value="${selectedOrder.quantity}"></label>
        <label class="field full-width"><span>حالة الشحنة</span><select><option>لا يوجد تلف ظاهر</option><option>تم تسجيل تلف</option></select></label>
      </div>
      <div class="callout">يقارن النظام الكمية المستلمة فعليًا بالكمية المطلوبة في أمر الشراء فقط. بعد التأكيد، يرسل طلبًا للمدير لإعداد جدول الأقساط.</div>
    `,
    actions: `<button class="button button-secondary" value="cancel">إلغاء</button><button class="button" id="submit-receipt" type="button">تأكيد الاستلام</button>`,
  });
  const poSelect = document.querySelector("#receiving-po");
  poSelect.addEventListener("change", () => {
    const po = state.purchaseOrders.find((item) => item.id === poSelect.value);
    document.querySelector("#ordered-meters").value = `${po?.quantity || 0} مترًا`;
    document.querySelector("#received-meters").value = po?.quantity || 0;
  });
  document.querySelector("#submit-receipt").addEventListener("click", () => {
    const po = state.purchaseOrders.find((item) => item.id === poSelect.value);
    if (!po) return;
    const received = Number(document.querySelector("#received-meters").value);
    const matched = received === po.quantity;
    const difference = po.quantity - received;
    state.receipts.unshift({ id: `REC-${778 + state.receipts.length}`, po: po.id, supplier: po.supplier, expected: po.quantity, received, result: matched ? "متطابق" : "يوجد فرق", detail: matched ? "تمت المطابقة مع أمر الشراء" : `فرق الاستلام: ${difference > 0 ? `نقص ${difference}` : `زيادة ${Math.abs(difference)}`} أمتار` });
    po.status = matched ? "مستلم" : "مستلم جزئيًا";
    if (!matched) addAlert(["inventory"], "critical", "تم اكتشاف فرق في الشحنة", `${po.id} · المطلوب ${po.quantity} مترًا · المستلم ${received} مترًا`, "إدارة فرق الاستلام", "receiving");
    if (!state.alerts.some((alert) => alert.type === "installments" && alert.poId === po.id)) {
      const alertId = Date.now();
      state.alerts.unshift({
        id: alertId,
        audience: ["manager"],
        severity: "urgent",
        title: "إعداد أقساط أمر الشراء المستلم",
        detail: `${po.id} · ${po.date || "التاريخ غير مسجل"} · ${po.supplier} · المستلم ${received} مترًا من ${po.quantity}`,
        action: "إعداد جدول الأقساط",
        type: "installments",
        poId: po.id,
      });
    }
    saveState();
    closeModal();
    render();
    showToast(
      matched ? "تمت مطابقة الاستلام" : "تم تسجيل فرق الاستلام",
      "استلم المدير طلبًا لإعداد جدول أقساط أمر الشراء، واستلم مسؤول المخزون أي فرق مكتشف."
    );
  });
}

function resolveReceipt(id) {
  const receipt = state.receipts.find((item) => item.id === id);
  openModal({
    title: `إدارة فرق الاستلام ${receipt.id}`,
    content: `
      <p><strong>${receipt.supplier} · ${receipt.po}</strong></p>
      <div class="form-grid">
        <div><p class="eyebrow">المتوقع</p><strong>${receipt.expected} مترًا</strong></div>
        <div><p class="eyebrow">المستلم</p><strong>${receipt.received} مترًا</strong></div>
      </div>
      <div class="callout callout-warning">${receipt.detail}. الكمية محل الفرق فقط هي المعلقة.</div>
      <label class="field"><span>قرار المعالجة</span><select id="receipt-resolution"><option>قبول الكمية المستلمة فعليًا</option><option>إعادته لموظف المبيعات للتصحيح</option><option>التواصل مع المورد</option></select></label>
    `,
    actions: `<button class="button button-secondary" value="cancel">إبقاء الفرق مفتوحًا</button><button class="button" id="resolve-exception" type="button">تأكيد المعالجة</button>`,
  });
  document.querySelector("#resolve-exception").addEventListener("click", () => {
    receipt.result = "متطابق";
    receipt.detail = "تمت إدارة الفرق والتحقق من الكمية الفعلية";
    completeCurrentQueuedAlert(["receiving"]);
    saveState();
    closeModal();
    render();
    showToast("تمت معالجة فرق الاستلام", "دخلت الكمية المقبولة إلى المخزن وتم تسجيل القرار.");
  });
}

function approvalCommentsMarkup(approval) {
  const comments = approval.comments || [];
  return comments.length
    ? `<div class="timeline">${comments.map((comment) => `
        <article class="timeline-item">
          <div class="timeline-marker" aria-hidden="true"></div>
          <div class="timeline-copy">
            <strong>${comment.by} · ${comment.role}</strong>
            <small>${comment.time}</small>
            <p>${comment.text}</p>
          </div>
        </article>
      `).join("")}</div>`
    : `<div class="empty-state"><strong>لا توجد تعليقات</strong><span>سيظهر هنا سبب الإعادة وأي رد من المدير.</span></div>`;
}

function manageApproval(id) {
  const approval = state.approvals.find((item) => item.id === id);
  if (!approval) return;
  const pending = approval.status === "قيد الانتظار";
  openModal({
    kicker: "تفاصيل طلب الموافقة",
    title: `${approval.type} · ${approval.id}`,
    content: `
      <div class="form-grid">
        <div><p class="eyebrow">الطلب</p><strong>${approval.request}</strong></div>
        <div><p class="eyebrow">القيمة</p><strong>${money(approval.amount)}</strong></div>
        <div><p class="eyebrow">مقدم الطلب</p><strong>${approval.requestedBy}</strong></div>
        <div><p class="eyebrow">الحالة</p><strong>${approval.status}</strong></div>
      </div>
      <h3>سجل التعليقات</h3>
      ${approvalCommentsMarkup(approval)}
    `,
    actions: pending
      ? `<button class="button button-secondary" type="button" id="return-approval">إعادة للمدير</button>
         <button class="button" type="button" id="approve-request">موافقة</button>`
      : `<button class="button button-secondary" value="cancel">إغلاق</button>`,
  });
  if (!pending) return;
  document.querySelector("#approve-request").addEventListener("click", () => {
    decideApproval(id, "معتمد");
  });
  document.querySelector("#return-approval").addEventListener("click", () => {
    openReturnApproval(id);
  });
}

function openReturnApproval(id) {
  const approval = state.approvals.find((item) => item.id === id);
  if (!approval) return;
  closeModal();
  openModal({
    kicker: "إعادة الطلب للتعديل",
    title: `سبب إعادة ${approval.type}`,
    content: `
      <p>${approval.request}</p>
      <label class="field"><span>سبب الإعادة للمدير</span><textarea id="approval-return-reason" required placeholder="اكتب التعديل المطلوب بوضوح"></textarea></label>
    `,
    actions: `<button class="button button-secondary" value="cancel">إلغاء</button><button class="button" type="button" id="confirm-return-approval">تأكيد الإعادة</button>`,
  });
  document.querySelector("#confirm-return-approval").addEventListener("click", () => {
    const reason = document.querySelector("#approval-return-reason").value.trim();
    if (!reason) {
      showToast("سبب الإعادة مطلوب", "اكتب السبب حتى يستطيع المدير تعديل الطلب.");
      return;
    }
    approval.status = "معاد للمدير";
    approval.comments = approval.comments || [];
    approval.comments.push({ by: roleProfiles.owner.name, role: roleProfiles.owner.label, time: "الآن", text: reason });
    if (approval.type === "أمر شراء") {
      const po = state.purchaseOrders.find((item) => item.id === approval.request.split(" · ")[0]);
      if (po) po.status = "معاد للتعديل";
    }
    const alertId = Date.now();
    state.alerts.unshift({
      id: alertId,
      audience: ["manager"],
      severity: "urgent",
      title: `طلب معاد للتعديل: ${approval.type}`,
      detail: `${approval.request} · ${reason}`,
      action: "تعديل وإعادة الإرسال",
      type: "returned-approval",
      approvalId: approval.id,
    });
    saveState();
    closeModal();
    render();
    showToast("تمت إعادة الطلب", "استلم المدير سبب الإعادة ويمكنه تعديل الطلب وإرساله مرة أخرى.");
  });
}

function manageReturnedApproval(id) {
  const approval = state.approvals.find((item) => item.id === id);
  if (!approval) return;
  const isPO = approval.type === "أمر شراء";
  const recordId = approval.request.split(" · ")[0];
  const po = isPO ? state.purchaseOrders.find((item) => item.id === recordId) : null;
  const schedule = !isPO ? state.invoices.find((item) => item.id === recordId) : null;
  openModal({
    kicker: "طلب معاد من المالك",
    title: `تعديل ${approval.type} وإعادة إرساله`,
    content: `
      <h3>سجل التعليقات</h3>
      ${approvalCommentsMarkup(approval)}
      <div class="form-grid">
        ${isPO
          ? `<label class="field"><span>الكمية المعدلة</span><input id="returned-quantity" type="number" min="1" value="${po?.quantity || 1}"></label>`
          : `<label class="field"><span>موعد الدفعة المعدل</span><input id="returned-due-date" type="date"></label>`}
        <label class="field full-width"><span>رد المدير</span><textarea id="manager-response" required placeholder="وضح التعديل الذي تم تنفيذه"></textarea></label>
      </div>
    `,
    actions: `<button class="button button-secondary" value="cancel">إبقاء الطلب عند المدير</button><button class="button" type="button" id="resubmit-approval">إعادة الإرسال للمالك</button>`,
  });
  document.querySelector("#resubmit-approval").addEventListener("click", () => {
    const response = document.querySelector("#manager-response").value.trim();
    if (!response) {
      showToast("رد المدير مطلوب", "وضح التعديل قبل إعادة إرسال الطلب.");
      return;
    }
    if (isPO && po) {
      po.quantity = Number(document.querySelector("#returned-quantity").value);
      const supplier = state.suppliers.find((item) => item.name === po.supplier);
      po.total = po.quantity * (supplier?.unitPrice || 0);
      po.status = "بانتظار المالك";
      approval.amount = po.total;
    }
    if (!isPO && schedule) {
      const dueDate = document.querySelector("#returned-due-date").value;
      if (!dueDate) {
        showToast("الموعد الجديد مطلوب", "حدد الموعد المتفق عليه مع المورد.");
        return;
      }
      schedule.due = dueDate;
      schedule.status = "مؤجل باتفاق المورد";
    }
    approval.status = "قيد الانتظار";
    approval.comments = approval.comments || [];
    approval.comments.push({ by: roleProfiles.manager.name, role: roleProfiles.manager.label, time: "الآن", text: response });
    state.alerts = state.alerts.filter((alert) => !(alert.type === "returned-approval" && alert.approvalId === approval.id));
    state.alerts.unshift({
      id: Date.now(),
      audience: ["owner"],
      severity: "urgent",
      title: `طلب ${approval.type} معدل`,
      detail: `${approval.request} · أعاد المدير إرساله بعد التعديل`,
      action: "مراجعة الطلب المعدل",
      type: "approval",
      approvalId: approval.id,
    });
    saveState();
    closeModal();
    render();
    showToast("تمت إعادة الإرسال", "عاد الطلب إلى المالك مع التعديل ورد المدير.");
  });
}

function decideApproval(id, decision) {
  const approval = state.approvals.find((item) => item.id === id);
  if (!approval) return;
  approval.status = decision;
  if (approval.type === "أمر شراء" || approval.type === "Purchase order") {
    const poId = approval.request.split(" · ")[0];
    const po = state.purchaseOrders.find((item) => item.id === poId);
    if (po) po.status = decision;
  }
  if (approval.type === "دفعة مورد") {
    const scheduleId = approval.request.split(" · ")[0];
    const schedule = state.invoices.find((item) => item.id === scheduleId);
    if (schedule && decision === "معتمد") schedule.status = "معتمد للسداد";
    completeCurrentQueuedAlert(["payment-due"]);
  }
  state.audit.unshift({ time: "الآن", user: roleProfiles.owner.name, action: `${decision}: ${approval.type}`, record: approval.request });
  saveState();
  closeModal();
  render();
  showToast("تمت الموافقة على الطلب", "تم تسجيل القرار وإخطار المدير.");
}

function openNewUser() {
  openModal({
    title: "إضافة مستخدم للنظام",
    content: `
      <div class="form-grid">
        <label class="field"><span>الاسم الكامل</span><input id="new-user-name" value="موظف جديد"></label>
        <label class="field"><span>الدور</span><select id="new-user-role"><option>موظف المبيعات</option><option>مسؤول المخزون</option><option>المدير</option><option>مسؤول النظام</option></select></label>
      </div>
      <div class="callout">دور المالك / الرئيس التنفيذي للموافقات والعرض، ومسؤول النظام يدير الهوية والصلاحيات.</div>
    `,
    actions: `<button class="button button-secondary" value="cancel">إلغاء</button><button class="button" id="create-user" type="button">إنشاء المستخدم</button>`,
  });
  document.querySelector("#create-user").addEventListener("click", () => {
    const role = document.querySelector("#new-user-role").value;
    state.users.push({ name: document.querySelector("#new-user-name").value, role, access: role === "موظف المبيعات" ? "المبيعات والمهام المسندة" : role === "مسؤول المخزون" ? "عمليات المخزون" : "صلاحيات حسب الدور", status: "نشط" });
    saveState();
    closeModal();
    render();
    showToast("User created", "The assigned role controls all visible functions.");
  });
}

function manageUser(index) {
  const user = state.users[index];
  openModal({
    title: `إدارة صلاحيات ${user.name}`,
    content: `
      <p><strong>${user.role}</strong> · ${user.access}</p>
      <div class="callout">تحدد الأدوار الصلاحيات المتاحة لكل مستخدم، وتقتصر صلاحيات المالك على الموافقات والعرض.</div>
      <label class="field"><span>حالة الحساب</span><select><option>نشط</option><option>معطل مؤقتًا</option></select></label>
    `,
    actions: `<button class="button button-secondary" value="cancel">إغلاق</button><button class="button" type="button" id="save-user">حفظ الصلاحيات</button>`,
  });
  document.querySelector("#save-user").addEventListener("click", () => {
    closeModal();
    showToast("Access saved", "The change was added to audit history.");
  });
}

function openCount() {
  openModal({
    title: state.role === "sales" ? "تسجيل الجرد الفعلي" : "إنشاء مهمة جرد",
    content: `
      <div class="form-grid">
        <label class="field"><span>الخامة</span><select><option>أنجيليكا</option><option>روزالين</option></select></label>
        <label class="field"><span>اللون</span><select><option>كحلي</option><option>نبيتي</option></select></label>
        <label class="field"><span>الموقع</span><select><option>المعرض</option><option>المخزن</option></select></label>
        <label class="field"><span>${state.role === "sales" ? "الأمتار الفعلية" : "إسناد إلى"}</span>${state.role === "sales" ? '<input type="number" value="72">' : "<select><option>سلمى علي</option><option>عمر خالد</option></select>"}</label>
      </div>
    `,
    actions: `<button class="button button-secondary" value="cancel">إلغاء</button><button class="button" id="save-count" type="button">${state.role === "sales" ? "إرسال الجرد" : "إسناد المهمة"}</button>`,
  });
  document.querySelector("#save-count").addEventListener("click", () => {
    closeModal();
    showToast(state.role === "sales" ? "Count submitted" : "Count assigned", "Any calculated difference will be routed to the Inventory Manager.");
  });
}

roleSelect.addEventListener("change", () => {
  state.role = roleSelect.value;
  resetPriorityPopupForRole(state.role);
  state.route = "dashboard";
  window.history.replaceState(null, "", "#dashboard");
  saveState();
  render();
  showToast("تم تغيير المستخدم", `المستخدم الحالي: ${roleProfiles[state.role].label}.`);
});

document.querySelector("#notification-button").addEventListener("click", () => {
  const hasAlerts = navigation[state.role].some(([route]) => route === "alerts");
  if (hasAlerts) navigate("alerts");
  else showToast("دور للموافقة والعرض", "استخدم صفحة الموافقات للطلبات التي تحتاج قرار المالك.");
});

document.addEventListener("keydown", (event) => {
  if (!event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.repeat) return;
  const match = event.code.match(/^(?:Digit|Numpad)([1-9])$/);
  if (!match) return;
  const index = Number(match[1]) - 1;
  const destination = navigation[state.role][index]?.[0];
  if (!destination) return;
  event.preventDefault();
  if (modal.open) closeModal();
  navigate(destination);
});

window.addEventListener("hashchange", () => {
  const route = window.location.hash.slice(1);
  if (route) {
    state.route = route;
    render();
  }
});

const initialHash = window.location.hash.slice(1);
if (initialHash) state.route = initialHash;
render();
