// Frappe HR onboarding journey — runs inside the Custom HTML Block shadow root.
// `root_element` (the shadowRoot) and the global `frappe` are provided by the host.

const $root = root_element;
const _ = typeof __ === "function" ? __ : (s) => (window.__ ? window.__(s) : s);

// ---- icons ----
const I = {
	leave: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v4M16 2v4M3 10h18"/><rect x="3" y="4" width="18" height="18" rx="2"/><path d="m9 16 2 2 4-4"/></svg>',
	attendance:
		'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
	payroll:
		'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 12h.01M18 12h.01"/></svg>',
	recruitment:
		'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
	expenses:
		'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1V2l-2 1-2-1-2 1-2-1-2 1-2-1Z"/><path d="M8 7h8M8 11h8M8 15h5"/></svg>',
	performance:
		'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></svg>',
	check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
	link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>',
	chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 15l3-4 3 2 4-6"/></svg>',
	arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>',
};

// shared foundation steps: completing one is reflected in every module that needs it
const SHARED = {
	employees: {
		key: "employees",
		name: "Add your first employee",
		sub: "The core people record every other module builds on.",
		check: "Employee",
		route: { t: "new", dt: "Employee" },
	},
	holiday: {
		key: "holiday",
		name: "Set up a holiday list",
		sub: "Weekends and public holidays for the year.",
		check: "Holiday List",
		route: { t: "new", dt: "Holiday List" },
	},
};

const MODULES = [
	{
		id: "leave",
		name: "Leaves",
		icon: "leave",
		ws: "Leaves",
		desc: "Configure leave types, policies and let employees apply.",
		keywords: "leave leaves holiday vacation time off pto absence allocation policy",
		intro: "Get employees applying for leave. We start with the shared basics, then leave-specific setup.",
		steps: [
			SHARED.employees,
			SHARED.holiday,
			{
				name: "Define leave types",
				sub: "Casual, sick, earned — with annual limits.",
				check: "Leave Type",
				route: { t: "list", dt: "Leave Type" },
			},
			{
				name: "Build a leave policy",
				sub: "Group types and assign to grades or departments.",
				check: "Leave Policy",
				route: { t: "list", dt: "Leave Policy" },
			},
			{
				name: "Allocate leaves",
				sub: "Grant balances for the current leave period.",
				check: "Leave Allocation",
				route: { t: "list", dt: "Leave Allocation" },
			},
			{
				name: "Open your leave dashboard",
				sub: "Who's off this week, team balances and upcoming leaves.",
				dash: true,
				route: { t: "ws", name: "Leaves" },
			},
		],
	},

	{
		id: "attendance",
		name: "Attendance & Shift",
		icon: "attendance",
		ws: "Shift & Attendance",
		desc: "Track check-ins, define shifts and roster your team.",
		keywords: "attendance check-in checkin shift roster clock biometric regularization",
		intro: "Let people check in and track attendance. Shared basics first, then your shift setup.",
		steps: [
			SHARED.employees,
			SHARED.holiday,
			{
				name: "Create shift types",
				sub: "Start/end times and grace periods.",
				check: "Shift Type",
				route: { t: "list", dt: "Shift Type" },
			},
			{
				name: "Assign shifts",
				sub: "Roster employees to their shifts.",
				check: "Shift Assignment",
				route: { t: "list", dt: "Shift Assignment" },
			},
			{
				name: "Review check-ins",
				sub: "See check-ins captured from web and mobile.",
				check: "Employee Checkin",
				route: { t: "list", dt: "Employee Checkin" },
			},
			{
				name: "Open your attendance dashboard",
				sub: "Check-in trends, late arrivals and absenteeism.",
				dash: true,
				route: { t: "ws", name: "Shift & Attendance" },
			},
		],
	},

	{
		id: "payroll",
		name: "Payroll",
		icon: "payroll",
		ws: "Payroll",
		desc: "Build salary structures and run payroll with confidence.",
		keywords:
			"payroll salary payslip pay slip salary slip tax ctc component deduction pf esi bank",
		intro: "Run payroll end to end. Payroll leans on employees and the holiday list, so those come first.",
		steps: [
			SHARED.employees,
			SHARED.holiday,
			{
				name: "Define salary components",
				sub: "Earnings, deductions and formulae.",
				check: "Salary Component",
				route: { t: "list", dt: "Salary Component" },
			},
			{
				name: "Assign salary structures",
				sub: "Map structures to your employees.",
				check: "Salary Structure",
				route: { t: "list", dt: "Salary Structure" },
			},
			{
				name: "Run a payroll entry",
				sub: "Generate and submit salary slips.",
				check: "Payroll Entry",
				route: { t: "new", dt: "Payroll Entry" },
			},
			{
				name: "Open your payroll dashboard",
				sub: "Monthly cost, salary register and last run summary.",
				dash: true,
				route: { t: "ws", name: "Payroll" },
			},
		],
	},

	{
		id: "recruitment",
		name: "Recruitment",
		icon: "recruitment",
		ws: "Recruitment",
		desc: "Post openings, track applicants and send offers.",
		keywords:
			"recruit recruitment job opening applicant candidate interview offer hire hiring vacancy",
		intro: "A self-contained journey — you can hire before you have a single employee on the books.",
		steps: [
			{
				name: "Create a job opening",
				sub: "Title, department and headcount.",
				check: "Job Opening",
				route: { t: "new", dt: "Job Opening" },
			},
			{
				name: "Schedule interviews",
				sub: "Define rounds and interviewers.",
				check: "Interview",
				route: { t: "list", dt: "Interview" },
			},
			{
				name: "Track applicants",
				sub: "Move candidates from applied to offer.",
				check: "Job Applicant",
				route: { t: "list", dt: "Job Applicant" },
			},
			{
				name: "Open your hiring dashboard",
				sub: "Pipeline funnel, open positions and time to hire.",
				dash: true,
				route: { t: "ws", name: "Recruitment" },
			},
		],
	},

	{
		id: "expenses",
		name: "Expense Claims",
		icon: "expenses",
		ws: "Expenses",
		desc: "Approve claims, advances and travel requests.",
		keywords: "expense claim reimbursement advance travel request receipt approve mileage",
		intro: "Let employees submit and get reimbursed. Just needs employees, then your claim setup.",
		steps: [
			SHARED.employees,
			{
				name: "Define claim types",
				sub: "Travel, food, equipment and limits.",
				check: "Expense Claim Type",
				route: { t: "list", dt: "Expense Claim Type" },
			},
			{
				name: "Record an expense claim",
				sub: "Try the flow employees will use.",
				check: "Expense Claim",
				route: { t: "new", dt: "Expense Claim" },
			},
			{
				name: "Open your expense dashboard",
				sub: "Pending approvals and spend by category.",
				dash: true,
				route: { t: "ws", name: "Expenses" },
			},
		],
	},

	{
		id: "performance",
		name: "Performance",
		icon: "performance",
		ws: "Performance",
		desc: "Run appraisal cycles, goals and feedback.",
		keywords: "performance appraisal goal kra feedback review cycle rating self assessment",
		intro: "Run reviews across your team. Needs employees in place, then your appraisal setup.",
		steps: [
			SHARED.employees,
			{
				name: "Create an appraisal cycle",
				sub: "Define the review period.",
				check: "Appraisal Cycle",
				route: { t: "new", dt: "Appraisal Cycle" },
			},
			{
				name: "Set KRAs and templates",
				sub: "Weighted objectives per role.",
				check: "Appraisal Template",
				route: { t: "list", dt: "Appraisal Template" },
			},
			{
				name: "Collect feedback",
				sub: "Self, peer and manager reviews.",
				check: "Appraisal",
				route: { t: "list", dt: "Appraisal" },
			},
			{
				name: "Open your performance dashboard",
				sub: "Appraisal progress, goal completion and rating spread.",
				dash: true,
				route: { t: "ws", name: "Performance" },
			},
		],
	},
];

// ---- live completion state, derived from real site data ----
const counts = {}; // doctype -> row count
const DASH_KEY = "hr_onb_dash_seen";
let dashSeen = {};
try {
	dashSeen = JSON.parse(localStorage.getItem(DASH_KEY) || "{}");
} catch (e) {
	dashSeen = {};
}

function isDone(mod, step) {
	if (step.dash) return !!dashSeen[mod.id];
	if (step.check) return (counts[step.check] || 0) > 0;
	return false;
}
function progress(mod) {
	let d = 0;
	mod.steps.forEach((s) => {
		if (isDone(mod, s)) d++;
	});
	return { done: d, total: mod.steps.length };
}
function otherUsers(sharedKey, exceptId) {
	return MODULES.filter(
		(m) => m.id !== exceptId && m.steps.some((s) => s.key === sharedKey),
	).map((m) => m.name);
}

// ---- routing into the real desk ----
function go(route, mod) {
	if (!route) return;
	if (route.t === "ws" && mod) {
		dashSeen[mod.id] = 1;
		try {
			localStorage.setItem(DASH_KEY, JSON.stringify(dashSeen));
		} catch (e) {}
	}
	if (route.t === "new") frappe.new_doc(route.dt);
	else if (route.t === "list") frappe.set_route("List", route.dt);
	else if (route.t === "ws") frappe.set_route(frappe.router.slug(route.name));
}

// ---- render grid ----
const grid = $root.querySelector("[data-grid]");

function stateOf(p) {
	return p.done === 0 ? "not-started" : p.done === p.total ? "done" : "in-progress";
}

function renderGrid() {
	grid.innerHTML = "";
	MODULES.forEach((mod) => {
		const p = progress(mod);
		const pct = Math.round((p.done / p.total) * 100);
		const state = stateOf(p);

		const sharedSteps = mod.steps.filter((s) => s.key);
		let sharedHint = "";
		if (sharedSteps.length) {
			const allDone = sharedSteps.every((s) => isDone(mod, s));
			const names = sharedSteps
				.map((s) => (s.key === "employees" ? _("Employees") : _("Holiday list")))
				.join(" · ");
			sharedHint = `<span class="onb-shared ${allDone ? "all-done" : ""}">${I.link}${
				allDone ? _("Shared setup done") : _("Shared setup") + ": " + names
			}</span>`;
		}

		const footLabel =
			state === "done"
				? `${I.check}${_("Complete")}`
				: state === "not-started"
				  ? `${p.total} ${_("steps")}`
				  : `${p.done} / ${p.total} ${_("done")}`;

		const card = document.createElement("button");
		card.type = "button";
		card.className = `onb-card ${state}`;
		card.innerHTML =
			`<span class="onb-arrow">${I.arrow}</span>` +
			`<div class="onb-card-top"><span class="onb-ico">${I[mod.icon]}</span>` +
			`<div><p class="onb-card-name">${_(mod.name)}</p><p class="onb-card-desc">${_(
				mod.desc,
			)}</p></div></div>` +
			sharedHint +
			`<div class="onb-card-foot"><span class="onb-mini-track"><span class="onb-mini-fill" style="width:${pct}%"></span></span>` +
			`<span class="onb-foot-label">${footLabel}</span></div>`;
		card.addEventListener("click", () => openPanel(mod));
		grid.appendChild(card);
	});
	updateOverall();
}

function updateOverall() {
	let done = 0,
		total = 0;
	MODULES.forEach((m) => {
		const p = progress(m);
		done += p.done;
		total += p.total;
	});
	const pct = total ? Math.round((done / total) * 100) : 0;
	$root.querySelector("[data-overall-pct]").textContent = pct;
	$root.querySelector("[data-overall-fill]").style.width = pct + "%";
}

// ---- slide-over panel ----
const overlay = $root.querySelector("[data-overlay]");
const panel = $root.querySelector("[data-panel]");
let openMod = null;

function renderPanel(mod) {
	openMod = mod;
	$root.querySelector("[data-p-crumb]").textContent = _(mod.name);
	$root.querySelector("[data-p-title]").textContent = _(mod.name);
	$root.querySelector("[data-p-ico]").innerHTML = I[mod.icon];
	$root.querySelector("[data-p-intro]").textContent = _(mod.intro);

	const p = progress(mod);
	$root.querySelector("[data-p-fill]").style.width = Math.round((p.done / p.total) * 100) + "%";
	$root.querySelector("[data-p-count]").textContent = `${p.done} ${_("of")} ${p.total} ${_(
		"done",
	)}`;

	const wrap = $root.querySelector("[data-p-journey]");
	wrap.innerHTML = "";
	let nextStep = null;
	mod.steps.forEach((step) => {
		const done = isDone(mod, step);
		if (!done && !nextStep) nextStep = step;
		let tag = "";
		if (step.dash) {
			tag = `<div class="onb-tag onb-tag-dash">${I.chart}${
				done ? _("Insight unlocked") : _("Your payoff")
			}</div>`;
		} else if (step.key) {
			const others = otherUsers(step.key, mod.id);
			tag = `<div class="onb-tag">${I.link}${_("Shared setup")}</div>`;
			if (others.length)
				tag += `<div class="onb-step-sub ${done ? "onb-carry" : ""}">${
					done ? "✓ " + _("Carried over to") : _("Also powers")
				} ${others.join(", ")}</div>`;
		}
		const row = document.createElement("div");
		row.className = `onb-step ${done ? "done" : ""} ${step.dash ? "dash" : ""}`;
		row.innerHTML =
			`<span class="onb-step-check">${I.check}</span>` +
			`<div class="onb-step-body"><div class="onb-step-name">${_(step.name)}</div>` +
			`<div class="onb-step-sub">${_(step.sub)}</div>${tag}</div>`;
		row.addEventListener("click", () => go(step.route, mod));
		wrap.appendChild(row);
	});

	const cta = $root.querySelector("[data-p-cta]");
	if (nextStep) {
		cta.textContent = _(nextStep.name);
		cta.onclick = () => go(nextStep.route, mod);
	} else {
		cta.textContent = `${_("Open")} ${_(mod.name)}`;
		cta.onclick = () => go({ t: "ws", name: mod.ws }, mod);
	}
}

function openPanel(mod) {
	renderPanel(mod);
	overlay.hidden = false;
	panel.setAttribute("aria-hidden", "false");
	requestAnimationFrame(() => {
		overlay.classList.add("show");
		panel.classList.add("show");
	});
}
function closePanel() {
	overlay.classList.remove("show");
	panel.classList.remove("show");
	panel.setAttribute("aria-hidden", "true");
	openMod = null;
	setTimeout(() => {
		overlay.hidden = true;
	}, 250);
}
overlay.addEventListener("click", closePanel);
$root.querySelector("[data-close]").addEventListener("click", closePanel);
document.addEventListener("keydown", (e) => {
	if (e.key === "Escape" && openMod) closePanel();
});

// ---- boot: pull live counts, then render ----
function boot() {
	const doctypes = Array.from(
		new Set(MODULES.flatMap((m) => m.steps.filter((s) => s.check).map((s) => s.check))),
	);
	renderGrid(); // initial paint (all zero) so the UI appears instantly
	Promise.all(
		doctypes.map((dt) =>
			frappe.db
				.count(dt)
				.then((n) => {
					counts[dt] = n || 0;
				})
				.catch(() => {
					counts[dt] = 0;
				}),
		),
	).then(() => renderGrid());
}
boot();
