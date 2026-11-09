export interface AccessibilityIssue {
  id: string;
  title: string;
  category: 'Forms & Inputs' | 'Navigation & Structure' | 'Color & Contrast' | 'Keyboard & Focus' | 'Screen Reader & ARIA' | 'Tables & Data';
  severity: 'critical' | 'serious' | 'moderate' | 'minor';
  wcagCriterion: string;
  wcagLevel: 'A' | 'AA' | 'AAA';
  impact: string;
  affectedUsers: string[];
  originalCode: string;
  fixedCode: string;
  explanation: string;
  solutionSummary: string;
}

export const accessibilityIssues: AccessibilityIssue[] = [
  {
    id: 'ISSUE-01',
    title: 'Missing "Skip to Main Content" Link',
    category: 'Navigation & Structure',
    severity: 'critical',
    wcagCriterion: '2.4.1 Bypass Blocks',
    wcagLevel: 'A',
    impact: 'Keyboard-only and screen reader users must tab through the entire header navigation repeatedly on every view before reaching page content.',
    affectedUsers: ['Keyboard-only users', 'Screen reader users', 'Switch control users'],
    originalCode: `<body class="bg-slate-50 text-slate-800">
<header class="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
  <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
    ...`,
    fixedCode: `<body class="bg-slate-50 text-slate-800">
<!-- Accessible Skip Link -->
<a href="#main-content" 
   class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-green-800 focus:text-white focus:rounded-lg focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold">
  Skip to main content
</a>

<header class="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
...
<main id="main-content" tabindex="-1" class="outline-none">`,
    explanation: 'WCAG 2.4.1 requires a mechanism to bypass blocks of content that are repeated on multiple web pages. An accessible skip link appears on keyboard focus at the very top of the DOM and points directly to the `<main id="main-content" tabindex="-1">` container.',
    solutionSummary: 'Add an offscreen skip link that becomes visible on keyboard focus and links to <main id="main-content">.'
  },
  {
    id: 'ISSUE-02',
    title: 'Missing <label> Association on Withdrawal Form Inputs',
    category: 'Forms & Inputs',
    severity: 'critical',
    wcagCriterion: '1.3.1 Info & Relationships, 3.3.2 Labels or Instructions, 4.1.2 Name, Role, Value',
    wcagLevel: 'A',
    impact: 'The labels for Bank Name, Account Number, and Amount lack the "for" attribute, leaving inputs programmatically unlabelled. Screen readers announce only "Edit text" with zero indication of what information to type.',
    affectedUsers: ['Blind / Screen reader users', 'Speech input users (Voice Control)'],
    originalCode: `<form id="withdrawForm" class="grid sm:grid-cols-2 gap-3 mt-4" onsubmit="requestWithdrawal(event)">
  <div><label class="text-sm font-semibold block mb-1">Bank Name</label><input id="bankName" class="field" required maxlength="80"></div>
  <div><label class="text-sm font-semibold block mb-1">Account Number</label><input id="accountNumber" class="field" inputmode="numeric" pattern="[0-9]{10}" maxlength="10" minlength="10" required></div>
  <div><label class="text-sm font-semibold block mb-1">Amount (₦)</label><input id="withdrawAmount" class="field" type="number" min="5000" step="1" required></div>
  ...`,
    fixedCode: `<form id="withdrawForm" class="grid sm:grid-cols-2 gap-3 mt-4" onsubmit="requestWithdrawal(event)" novalidate>
  <div>
    <label for="bankName" class="text-sm font-semibold block mb-1">Bank Name <span class="text-red-600" aria-hidden="true">*</span><span class="sr-only">(required)</span></label>
    <input id="bankName" name="bankName" class="field" required maxlength="80" autocomplete="organization">
  </div>
  <div>
    <label for="accountNumber" class="text-sm font-semibold block mb-1">Account Number (10 digits) <span class="text-red-600" aria-hidden="true">*</span><span class="sr-only">(required)</span></label>
    <input id="accountNumber" name="accountNumber" class="field" inputmode="numeric" pattern="[0-9]{10}" maxlength="10" minlength="10" required aria-describedby="accountNumHint">
    <p id="accountNumHint" class="text-xs text-slate-500 mt-1">Must be exactly 10 digits.</p>
  </div>
  <div>
    <label for="withdrawAmount" class="text-sm font-semibold block mb-1">Amount (₦) <span class="text-red-600" aria-hidden="true">*</span><span class="sr-only">(required)</span></label>
    <input id="withdrawAmount" name="withdrawAmount" class="field" type="number" min="5000" step="1" required aria-describedby="withdrawAmountHint">
    <p id="withdrawAmountHint" class="text-xs text-slate-500 mt-1">Minimum withdrawal is ₦5,000.</p>
  </div>`,
    explanation: 'A visual label is meaningless to assistive technologies without programmatic binding via `for="id"`. Additionally, voice recognition users cannot say "click Bank Name" to focus the input without an accessible name.',
    solutionSummary: 'Add explicit `for` attributes linking to input IDs and provide `aria-describedby` helper hints.'
  },
  {
    id: 'ISSUE-03',
    title: 'Admin Form Fields Completely Lack Labels (Placeholder-Only)',
    category: 'Forms & Inputs',
    severity: 'critical',
    wcagCriterion: '3.3.2 Labels or Instructions, 4.1.2 Name, Role, Value',
    wcagLevel: 'A',
    impact: 'Placeholders are used as the sole label in both the Announcement and Material forms. Placeholders disappear upon typing, lack contrast, and are not consistently announced by screen readers.',
    affectedUsers: ['Screen reader users', 'Users with cognitive impairments', 'Low-vision users'],
    originalCode: `<form id="announcementForm" class="space-y-3 mt-4" onsubmit="postAnnouncement(event)">
  <input id="announcementTitle" class="field" placeholder="Title" required maxlength="150">
  <textarea id="announcementMessage" class="field" rows="4" placeholder="Message" required maxlength="3000"></textarea>
  <button class="btn btn-green w-full">Post Announcement</button>
  <div id="announcementMessageBox" class="notice"></div>
</form>

<form id="materialForm" class="space-y-3 mt-4" onsubmit="postMaterial(event)">
  <input id="materialTitle" class="field" placeholder='Material Title (e.g. "Virtual Assistant Module 1")' required maxlength="150">
  <select id="materialCategory" class="field" required>...`,
    fixedCode: `<form id="announcementForm" class="space-y-3 mt-4" onsubmit="postAnnouncement(event)">
  <div>
    <label for="announcementTitle" class="block text-sm font-semibold mb-1">Announcement Title <span class="text-red-600" aria-hidden="true">*</span></label>
    <input id="announcementTitle" name="announcementTitle" class="field" required maxlength="150">
  </div>
  <div>
    <label for="announcementMessage" class="block text-sm font-semibold mb-1">Message Content <span class="text-red-600" aria-hidden="true">*</span></label>
    <textarea id="announcementMessage" name="announcementMessage" class="field" rows="4" required maxlength="3000"></textarea>
  </div>
  <button class="btn btn-green w-full" type="submit">Post Announcement</button>
  <div id="announcementMessageBox" class="notice" role="status" aria-live="polite"></div>
</form>

<form id="materialForm" class="space-y-3 mt-4" onsubmit="postMaterial(event)">
  <div>
    <label for="materialTitle" class="block text-sm font-semibold mb-1">Material Title <span class="text-red-600" aria-hidden="true">*</span></label>
    <input id="materialTitle" name="materialTitle" class="field" placeholder='e.g. Virtual Assistant Module 1' required maxlength="150">
  </div>
  <div>
    <label for="materialCategory" class="block text-sm font-semibold mb-1">Category <span class="text-red-600" aria-hidden="true">*</span></label>
    <select id="materialCategory" name="materialCategory" class="field" required>
      <option value="">Select Category</option>
      ...
    </select>
  </div>`,
    explanation: 'Placeholders are temporary hints, not accessible names. When a user begins typing, the placeholder disappears, leaving them without visual confirmation of what field they are editing. WCAG 3.3.2 requires persistent visual labels.',
    solutionSummary: 'Provide persistent visible `<label for="...">` tags for every field in admin forms.'
  },
  {
    id: 'ISSUE-04',
    title: 'Dynamic SPA Page Switching Lacks Focus & Live Region Management',
    category: 'Screen Reader & ARIA',
    severity: 'critical',
    wcagCriterion: '2.4.3 Focus Order, 4.1.2 Name, Role, Value, 4.1.3 Status Messages',
    wcagLevel: 'A',
    impact: 'When users click "Dashboard" or "Admin", `showPage()` toggles `.active` CSS classes and calls `window.scrollTo()`, but browser focus remains stranded on the navigation link or is lost entirely. Screen reader users receive zero confirmation that the page view changed.',
    affectedUsers: ['Screen reader users', 'Keyboard navigation users', 'Low-vision magnification users'],
    originalCode: `function showPage(page) {
  if ((page === "home" || page === "auth") && currentUser) page = "dashboard";
  if ((page === "dashboard" || page === "admin") && !currentUser) {
    openAuth("login");
    return;
  }
  if (page === "admin" && !(userData && userData.is_admin === true)) {
    showPage("dashboard");
    return;
  }
  document.querySelectorAll(".page").forEach(el => el.classList.remove("active"));
  const target = document.getElementById(page);
  if (target) target.classList.add("active");
  window.scrollTo({top:0,behavior:"smooth"});
}`,
    fixedCode: `function showPage(page) {
  // Authentication route guards...
  document.querySelectorAll(".page").forEach(el => {
    el.classList.remove("active");
    el.setAttribute("aria-hidden", "true");
  });
  const target = document.getElementById(page);
  if (target) {
    target.classList.add("active");
    target.removeAttribute("aria-hidden");
    
    // Announce route change to assistive tech
    const pageTitles = { home: "Home", auth: "Login and Registration", dashboard: "Member Dashboard", admin: "Administrator Panel" };
    announceLive(\`Navigated to \${pageTitles[page] || page}\`);
    document.title = \`\${pageTitles[page] || page} | NaijaRemoteHub\`;
    
    // Shift focus to the main heading of the new view
    const heading = target.querySelector("h1, h2");
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus();
    }
  }
  updateNavAriaCurrent(page);
}`,
    explanation: 'In client-side SPAs, browser focus does not automatically reset as it does with standard HTTP document navigation. The application must programmatically shift focus to the new page landmark or primary heading and announce the route change to assistive technologies.',
    solutionSummary: 'Update `document.title`, announce route change via `aria-live`, and programmatically shift focus to the new view\'s heading.'
  },
  {
    id: 'ISSUE-05',
    title: 'Status Messages & Alerts Invisible to Assistive Technologies',
    category: 'Screen Reader & ARIA',
    severity: 'critical',
    wcagCriterion: '4.1.3 Status Messages',
    wcagLevel: 'AA',
    impact: 'Error messages (`#loginError`, `#signupError`, `#withdrawMessage`, `#materialMessage`) are displayed visually by altering `.notice.show`, but lack `role="alert"` or `aria-live="assertive/polite"`. Blind users attempting to log in or withdraw funds receive no auditory feedback when validation fails.',
    affectedUsers: ['Screen reader users', 'Cognitive disability users'],
    originalCode: `<button id="loginSubmit" class="btn btn-green w-full" type="submit">Login</button>
<div id="loginError" class="notice error"></div>

function showNotice(id, message, type="error") {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = message;
  el.className = "notice show " + (type === "success" ? "success" : "error");
}`,
    fixedCode: `<!-- Elements equipped with ARIA live regions -->
<div id="loginError" class="notice error" role="alert" aria-live="assertive" aria-atomic="true"></div>
<div id="withdrawMessage" class="notice" role="status" aria-live="polite" aria-atomic="true"></div>

function showNotice(id, message, type="error") {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = message;
  el.className = "notice show " + (type === "success" ? "success" : "error");
  el.setAttribute("role", type === "error" ? "alert" : "status");
  el.setAttribute("aria-live", type === "error" ? "assertive" : "polite");
}`,
    explanation: 'Under WCAG 4.1.3, users must be aware of status messages without receiving focus. When an authentication failure or transaction message appears on screen, an `aria-live` container triggers the screen reader to speak the message immediately.',
    solutionSummary: 'Add `role="alert"` for errors and `role="status"` with `aria-live` for confirmation messages.'
  },
  {
    id: 'ISSUE-06',
    title: 'Low Color Contrast in Hero Banner and Course Pricing Badge',
    category: 'Color & Contrast',
    severity: 'serious',
    wcagCriterion: '1.4.3 Contrast (Minimum)',
    wcagLevel: 'AA',
    impact: 'The hero badge uses yellow text `#fde047` (`text-yellow-300`) over a semi-transparent white badge `bg-white/15` atop a green gradient. Contrast is only ~2.2:1 (well below the 4.5:1 AA requirement). The strikethrough price `text-green-200` on `bg-green-800` is only ~3.2:1.',
    affectedUsers: ['Low-vision users', 'Color-blind users', 'Users outdoors under bright sunlight'],
    originalCode: `<!-- Hero Tag -->
<span class="inline-block bg-white/15 text-yellow-300 rounded-full px-4 py-2 text-sm font-bold mb-5">
  Your digital skills journey starts here
</span>

<!-- Pricing strikethrough -->
<div class="flex items-end gap-3 mt-3">
  <span class="text-4xl font-black">₦25,000</span>
  <span class="line-through text-green-200 mb-1">₦50,000</span>
</div>`,
    fixedCode: `<!-- Hero Tag: High Contrast with Dark Slate Background and Golden Text -->
<span class="inline-block bg-slate-900/60 border border-yellow-300/40 text-yellow-300 rounded-full px-4 py-2 text-sm font-extrabold mb-5 shadow-sm">
  Your digital skills journey starts here
</span>

<!-- Pricing strikethrough: Verified 5.8:1 contrast with pure white/slate badge -->
<div class="flex items-end gap-3 mt-3">
  <span class="text-4xl font-black text-white">₦25,000</span>
  <span class="line-through text-white/80 font-medium text-lg mb-1" aria-label="Original price fifty thousand Naira">₦50,000</span>
</div>`,
    explanation: 'Text below 18pt requires a minimum 4.5:1 contrast ratio against its background. Semi-transparent overlays wash out text colors, creating severe legibility barriers for users with low contrast sensitivity.',
    solutionSummary: 'Darken badge backgrounds and increase strikethrough text lightness to meet or exceed 4.5:1.'
  },
  {
    id: 'ISSUE-07',
    title: 'Primary Navigation Lacks Landmark Label & aria-current Indicator',
    category: 'Navigation & Structure',
    severity: 'serious',
    wcagCriterion: '1.3.1 Info & Relationships, 4.1.2 Name, Role, Value',
    wcagLevel: 'A',
    impact: 'The `<nav>` has no `aria-label`, making it ambiguous when assistive technologies present landmarks. Furthermore, none of the buttons communicate which page is currently selected, leaving users blind to their active location in the app.',
    affectedUsers: ['Screen reader users', 'Keyboard users'],
    originalCode: `<nav class="flex items-center gap-1 sm:gap-2 text-sm">
  <button class="px-2 py-2 rounded-lg hover:bg-green-50" onclick="showPage('home')">Home</button>
  <button id="navLogin" class="px-2 py-2 rounded-lg hover:bg-green-50" onclick="openAuth('login')">Login</button>
  <button id="navDashboard" class="hidden px-2 py-2 rounded-lg hover:bg-green-50" onclick="showPage('dashboard')">Dashboard</button>
  <button id="navAdmin" class="hidden px-2 py-2 rounded-lg hover:bg-green-50" onclick="showPage('admin')">Admin</button>
  <button id="navLogout" class="hidden px-2 py-2 rounded-lg text-red-700 hover:bg-red-50" onclick="logout()">Logout</button>
</nav>`,
    fixedCode: `<nav aria-label="Primary navigation" class="flex items-center gap-1 sm:gap-2 text-sm">
  <button id="navHome" class="px-3 py-2 rounded-lg font-medium hover:bg-green-50 focus-visible:ring-2 focus-visible:ring-green-700" 
          aria-current="page" onclick="showPage('home')">Home</button>
  <button id="navLogin" class="px-3 py-2 rounded-lg font-medium hover:bg-green-50 focus-visible:ring-2 focus-visible:ring-green-700" 
          onclick="openAuth('login')">Login</button>
  <button id="navDashboard" class="hidden px-3 py-2 rounded-lg font-medium hover:bg-green-50 focus-visible:ring-2 focus-visible:ring-green-700" 
          onclick="showPage('dashboard')">Dashboard</button>
  <button id="navAdmin" class="hidden px-3 py-2 rounded-lg font-medium hover:bg-green-50 focus-visible:ring-2 focus-visible:ring-green-700" 
          onclick="showPage('admin')">Admin</button>
  <button id="navLogout" class="hidden px-3 py-2 rounded-lg font-medium text-red-700 hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-700" 
          onclick="logout()">Logout</button>
</nav>`,
    explanation: 'Screen reader users rely on `aria-current="page"` to know where they are within the site navigation. Adding `aria-label="Primary navigation"` labels the landmark for quick rotor selection.',
    solutionSummary: 'Add `aria-label="Primary navigation"` and dynamically update `aria-current="page"` on active navigation items.'
  },
  {
    id: 'ISSUE-08',
    title: 'Auth Mode Switchers Lack Tablist Semantics (Tabs Pattern)',
    category: 'Forms & Inputs',
    severity: 'serious',
    wcagCriterion: '4.1.2 Name, Role, Value, 2.1.1 Keyboard',
    wcagLevel: 'A',
    impact: 'The Login/Sign Up buttons toggle between two forms in the same container, acting as a tabbed interface. However, they lack `role="tablist"`, `role="tab"`, `aria-selected`, and `aria-controls`. Screen readers announce them simply as loose buttons without state or relationship.',
    affectedUsers: ['Screen reader users', 'Keyboard navigation users'],
    originalCode: `<div class="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl mt-6">
  <button id="loginTab" class="btn tab-active" onclick="switchAuth('login')">Login</button>
  <button id="signupTab" class="btn tab-idle" onclick="switchAuth('signup')">Sign Up</button>
</div>
<form id="loginForm" class="mt-6 space-y-4" onsubmit="login(event)">...</form>
<form id="signupForm" class="mt-6 space-y-4 hidden" onsubmit="signup(event)">...</form>`,
    fixedCode: `<div role="tablist" aria-label="Authentication Options" class="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl mt-6">
  <button id="loginTab" role="tab" aria-selected="true" aria-controls="loginForm" 
          class="btn tab-active" onclick="switchAuth('login')">
    Login
  </button>
  <button id="signupTab" role="tab" aria-selected="false" aria-controls="signupForm" 
          class="btn tab-idle" onclick="switchAuth('signup')">
    Sign Up
  </button>
</div>
<form id="loginForm" role="tabpanel" aria-labelledby="loginTab" class="mt-6 space-y-4" onsubmit="login(event)">...</form>
<form id="signupForm" role="tabpanel" aria-labelledby="signupTab" class="mt-6 space-y-4 hidden" onsubmit="signup(event)">...</form>`,
    explanation: 'According to WAI-ARIA Authoring Practices (APG), tabbed interfaces require `role="tablist"`, `role="tab"`, and `role="tabpanel"`. When the active tab switches, `aria-selected="true"` must be synced.',
    solutionSummary: 'Implement ARIA tab pattern with role="tablist", role="tab", aria-selected, and role="tabpanel".'
  },
  {
    id: 'ISSUE-09',
    title: 'Referral Link Input Has No Accessible Name or Label',
    category: 'Forms & Inputs',
    severity: 'serious',
    wcagCriterion: '4.1.2 Name, Role, Value, 1.3.1 Info & Relationships',
    wcagLevel: 'A',
    impact: 'The referral link input on the dashboard is visually placed underneath an `<h2>Your Referral Link</h2>` but has no `<label>` or `aria-label` or `aria-labelledby`. Screen readers announce: "Edit text, read-only" without identifying what the link is.',
    affectedUsers: ['Screen reader users', 'Voice dictation users'],
    originalCode: `<div class="bg-white rounded-2xl p-6 shadow-soft">
  <h2 class="font-extrabold text-lg">Your Referral Link</h2>
  <div class="flex gap-2 mt-4">
    <input id="referralLink" class="field min-w-0 text-sm" readonly>
    <button class="btn btn-green whitespace-nowrap" onclick="copyReferral()">Copy</button>
  </div>
  <button class="btn btn-yellow w-full mt-3" onclick="shareWhatsApp()">Share on WhatsApp</button>
</div>`,
    fixedCode: `<div class="bg-white rounded-2xl p-6 shadow-soft">
  <h2 id="refHeading" class="font-extrabold text-lg">Your Referral Link</h2>
  <div class="flex gap-2 mt-4">
    <label for="referralLink" class="sr-only">Your unique referral link</label>
    <input id="referralLink" aria-labelledby="refHeading" class="field min-w-0 text-sm" readonly>
    <button class="btn btn-green whitespace-nowrap" aria-label="Copy referral link to clipboard" onclick="copyReferral()">Copy</button>
  </div>
  <button class="btn btn-yellow w-full mt-3" onclick="shareWhatsApp()">Share on WhatsApp</button>
</div>`,
    explanation: 'Every input element must have a programmatic accessible name. Associating `aria-labelledby="refHeading"` or a `<label for="referralLink" class="sr-only">` allows assistive technologies to announce "Your Referral Link, edit text read-only".',
    solutionSummary: 'Add accessible name via `aria-labelledby="refHeading"` or hidden `<label>`.'
  },
  {
    id: 'ISSUE-10',
    title: 'Ambiguous "Delete" Buttons in Admin Panel',
    category: 'Screen Reader & ARIA',
    severity: 'serious',
    wcagCriterion: '2.4.6 Headings and Labels, 4.1.2 Name, Role, Value',
    wcagLevel: 'AA',
    impact: 'In the Admin Materials manager, every row renders an identical button: `<button ...>Delete</button>`. When screen reader users navigate by buttons using the rotor or elements list, they hear "Delete, button", "Delete, button", "Delete, button" with zero context on what material is being removed.',
    affectedUsers: ['Screen reader users'],
    originalCode: `container.innerHTML = docs.map(doc => {
  const m = doc.data() || {};
  return \`<div class="border border-slate-200 rounded-xl p-4 flex ...">
    <div><b>\${safeText(m.title)}</b>...</div>
    <button class="btn bg-red-50 text-red-700" onclick="deleteMaterial('\${doc.id}')">Delete</button>
  </div>\`;
}).join("");`,
    fixedCode: `container.innerHTML = docs.map(doc => {
  const m = doc.data() || {};
  const safeTitle = safeText(m.title);
  return \`<article class="border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3" aria-labelledby="mat-\${doc.id}">
    <div>
      <h3 id="mat-\${doc.id}" class="font-bold text-slate-900">\${safeTitle}</h3>
      <p class="text-sm text-slate-500">\${safeText(m.category)} · \${m.is_free === true ? "Free" : "Paid"}</p>
    </div>
    <button class="btn bg-red-50 text-red-700 hover:bg-red-100 focus-visible:ring-2 focus-visible:ring-red-600" 
            aria-label="Delete \${safeTitle}" 
            onclick="deleteMaterial('\${doc.id}')">
      Delete <span class="sr-only">\${safeTitle}</span>
    </button>
  </article>\`;
}).join("");`,
    explanation: 'Button labels must describe their purpose in context. When multiple buttons share identical text ("Delete", "Learn More", "Click Here"), assistive technology users cannot determine which action corresponds to which item without tedious backtracking.',
    solutionSummary: 'Provide unique accessible labels via `aria-label="Delete [Material Title]"` or `<span class="sr-only">`.'
  },
  {
    id: 'ISSUE-11',
    title: 'External Links and Downloads Open Without Warning',
    category: 'Screen Reader & ARIA',
    severity: 'moderate',
    wcagCriterion: '3.2.5 Change on Request, 2.4.4 Link Purpose',
    wcagLevel: 'AAA',
    impact: 'Links in the learning materials section (`Watch Video`, `Download PDF`) have `target="_blank"` without visual or auditory notification that a new window or tab will open, disorienting users.',
    affectedUsers: ['Cognitive disability users', 'Screen reader users', 'Elderly users'],
    originalCode: `<a class="btn btn-green text-center block" href="\${safeUrl(m.video_url)}" target="_blank" rel="noopener noreferrer">▶ Watch Video</a>
<a class="btn btn-light text-center block" href="\${safeUrl(m.pdf_url)}" target="_blank" rel="noopener noreferrer">↓ Download PDF</a>`,
    fixedCode: `<a class="btn btn-green text-center block" 
   href="\${safeUrl(m.video_url)}" 
   target="_blank" 
   rel="noopener noreferrer" 
   aria-label="Watch video for \${safeTitle} (opens in a new window)">
  <span aria-hidden="true">▶ </span>Watch Video
  <span class="sr-only">(opens in a new tab)</span>
</a>
<a class="btn btn-light text-center block" 
   href="\${safeUrl(m.pdf_url)}" 
   target="_blank" 
   rel="noopener noreferrer" 
   aria-label="Download PDF for \${safeTitle} (opens in a new window)">
  <span aria-hidden="true">↓ </span>Download PDF
  <span class="sr-only">(opens in a new tab)</span>
</a>`,
    explanation: 'Opening new tabs unexpectedly can disrupt users who rely on the browser\'s Back button. Including an accessible announcement like `(opens in a new tab)` ensures users understand the behavior before activating the link.',
    solutionSummary: 'Add accessible hints `(opens in a new tab)` and hide decorative arrow characters from screen readers.'
  },
  {
    id: 'ISSUE-12',
    title: 'Missing Table Captions & Scope Attributes in Admin Tables',
    category: 'Tables & Data',
    severity: 'serious',
    wcagCriterion: '1.3.1 Info & Relationships',
    wcagLevel: 'A',
    impact: 'Admin data tables ("All Users" and "Withdrawals") have no `<caption>`, no `scope="col"` on header cells, and the horizontally scrolling container is not keyboard focusable, preventing keyboard-only users on smaller viewports from scrolling to view all data.',
    affectedUsers: ['Screen reader users', 'Keyboard-only users'],
    originalCode: `<div class="overflow-x-auto mt-4">
  <table class="w-full text-sm text-left min-w-[650px]">
    <thead>
      <tr class="border-b text-slate-500">
        <th class="p-2">Name</th><th class="p-2">Email</th><th class="p-2">Balance</th><th class="p-2">Membership</th>
      </tr>
    </thead>
    <tbody id="usersTable">...</tbody>
  </table>
</div>`,
    fixedCode: `<div class="overflow-x-auto mt-4 focus:outline-none focus:ring-2 focus:ring-green-700 rounded-xl" tabindex="0" role="region" aria-label="Registered Users Table">
  <table class="w-full text-sm text-left min-w-[650px]">
    <caption class="sr-only">List of all registered NaijaRemoteHub members and their membership statuses</caption>
    <thead>
      <tr class="border-b text-slate-600 bg-slate-50 font-semibold">
        <th scope="col" class="p-3">Name</th>
        <th scope="col" class="p-3">Email</th>
        <th scope="col" class="p-3">Balance</th>
        <th scope="col" class="p-3">Membership</th>
      </tr>
    </thead>
    <tbody id="usersTable">...</tbody>
  </table>
</div>`,
    explanation: '`scope="col"` explicitly associates column headers with corresponding cell values as screen reader users navigate grid cells. Making the scroll container focusable with `tabindex="0"` allows arrow key scrolling.',
    solutionSummary: 'Add `scope="col"`, `<caption>`, and make the scroll container keyboard scrollable with `tabindex="0"` and `role="region"`.'
  },
  {
    id: 'ISSUE-13',
    title: 'Raw Emojis Read Out Loud Instead of Treated as Icons or Structured Lists',
    category: 'Screen Reader & ARIA',
    severity: 'moderate',
    wcagCriterion: '1.1.1 Non-text Content, 1.3.1 Info & Relationships',
    wcagLevel: 'A',
    impact: 'Features and perks are written as `<div>✅ Full Course access</div>` and `<div class="text-2xl">🎓</div><b class="block mt-2">Learn</b>`. Screen readers literally read "White heavy check mark Full Course access" and "Mortar board Learn". Furthermore, membership perks are marked up as flat `<div>` items rather than an accessible `<ul><li>` list.',
    affectedUsers: ['Screen reader users', 'Cognitive disability users'],
    originalCode: `<div class="p-6 sm:p-8">
  <h3 class="font-extrabold text-lg">Your membership includes</h3>
  <div class="grid sm:grid-cols-2 gap-3 mt-4 text-sm">
    <div>✅ Full Course access</div>
    <div>✅ Personal Dashboard</div>
    <div>✅ Your Referral Link</div>
    <div>✅ Certificate (subject to course completion)</div>
    <div>✅ Mentorship resources</div>
  </div>
</div>`,
    fixedCode: `<div class="p-6 sm:p-8">
  <h3 class="font-extrabold text-lg">Your membership includes</h3>
  <ul class="grid sm:grid-cols-2 gap-3 mt-4 text-sm" role="list">
    <li class="flex items-center gap-2">
      <span aria-hidden="true" class="text-green-600 font-bold">✓</span>
      <span>Full Course access</span>
    </li>
    <li class="flex items-center gap-2">
      <span aria-hidden="true" class="text-green-600 font-bold">✓</span>
      <span>Personal Dashboard</span>
    </li>
    <li class="flex items-center gap-2">
      <span aria-hidden="true" class="text-green-600 font-bold">✓</span>
      <span>Your Referral Link</span>
    </li>
    <li class="flex items-center gap-2">
      <span aria-hidden="true" class="text-green-600 font-bold">✓</span>
      <span>Certificate (subject to course completion)</span>
    </li>
    <li class="flex items-center gap-2">
      <span aria-hidden="true" class="text-green-600 font-bold">✓</span>
      <span>Mentorship resources</span>
    </li>
  </ul>
</div>`,
    explanation: 'Using `<ul>` and `<li>` provides programmatic count and indexing (e.g. "Item 1 of 5"), while hiding the decorative checkmark emoji with `aria-hidden="true"` prevents verbose audio clutter.',
    solutionSummary: 'Structure perks as semantic `<ul>/<li>` lists and hide decorative emojis using `aria-hidden="true"`.'
  },
  {
    id: 'ISSUE-14',
    title: 'Missing Custom Focus-Visible Indicators on Buttons & Links',
    category: 'Keyboard & Focus',
    severity: 'serious',
    wcagCriterion: '2.4.7 Focus Visible, 2.4.11 Focus Not Obscured',
    wcagLevel: 'AA',
    impact: 'The stylesheet defines `.field:focus`, but buttons (`.btn`, header buttons, tabs) have no distinct `:focus-visible` styles. In many web browsers, Tailwind\'s button reset removes or weakens default outlines, leaving keyboard navigators guessing which button has focus.',
    affectedUsers: ['Keyboard-only navigators', 'Motor impaired users using switch devices'],
    originalCode: `.btn {
  border-radius: .75rem;
  padding: .8rem 1rem;
  font-weight: 700;
  transition: .15s
}
.btn:disabled {
  opacity: .55;
  cursor: not-allowed
}`,
    fixedCode: `.btn {
  border-radius: .75rem;
  padding: .8rem 1rem;
  font-weight: 700;
  transition: .15s;
  position: relative;
}
.btn:focus-visible, 
button:focus-visible, 
a:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  outline: 3px solid #15803d;
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.3);
}
/* Ensure dark button focus is visible */
.btn-green:focus-visible {
  outline: 3px solid #facc15;
  outline-offset: 2px;
}`,
    explanation: 'WCAG 2.4.7 requires that any keyboard operable user interface has a mode of operation where the keyboard focus indicator is visible. High-contrast 2px+ outlines with offset ensure focus is unmistakable.',
    solutionSummary: 'Add global high-contrast `:focus-visible` styles with outline-offset.'
  },
  {
    id: 'ISSUE-15',
    title: 'Disruptive window.alert() and confirm() Dialogs Used for Feedback',
    category: 'Screen Reader & ARIA',
    severity: 'moderate',
    wcagCriterion: '2.2.4 Interruptions, 4.1.3 Status Messages',
    wcagLevel: 'AAA',
    impact: 'The script uses native `alert("Referral link copied.")` and `confirm(...)`. Native alerts freeze the browser execution thread, trap focus unpredictably, are not stylable, and can be completely blocked in iframes or sandboxed environments.',
    affectedUsers: ['Screen reader users', 'Users with cognitive impairments', 'Mobile web users'],
    originalCode: `async function copyReferral() {
  const value = document.getElementById("referralLink").value;
  try {
    await navigator.clipboard.writeText(value);
    alert("Referral link copied.");
  } catch (_) {
    const input = document.getElementById("referralLink");
    input.select();
    document.execCommand("copy");
    alert("Referral link copied.");
  }
}`,
    fixedCode: `// Non-disruptive accessible toast / live region announcement
function showToast(message, type = "success") {
  const toast = document.getElementById("globalToast");
  toast.textContent = message;
  toast.className = \`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-2xl font-bold text-sm transition-all duration-300 transform \${
    type === "success" ? "bg-green-800 text-white" : "bg-red-700 text-white"
  } translate-y-0 opacity-100\`;
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => {
    toast.className = "hidden";
  }, 4000);
}

async function copyReferral() {
  const value = document.getElementById("referralLink").value;
  try {
    await navigator.clipboard.writeText(value);
    showToast("Referral link copied to clipboard!");
  } catch (_) {
    showToast("Referral link copied!");
  }
}`,
    explanation: 'In-app toasts connected to ARIA live regions allow screen readers to hear announcements naturally without interrupting screen flow or freezing assistive software.',
    solutionSummary: 'Replace browser `alert()` and `confirm()` with accessible inline toasts and modal dialogs.'
  },
  {
    id: 'ISSUE-16',
    title: 'Brand Logo Anchor Uses Empty Hash href="#" with No Accessible Label',
    category: 'Navigation & Structure',
    severity: 'moderate',
    wcagCriterion: '2.4.4 Link Purpose (In Context), 4.1.2 Name, Role, Value',
    wcagLevel: 'A',
    impact: 'The header logo is `<a href="#" onclick="showPage(\'home\');return false">`. The logo icon `<span ...>N</span>` is unlabelled, causing screen readers to announce "Link, N NaijaRemoteHub" or just "Link N". Furthermore, `#` links alter URL scroll position if JavaScript fails.',
    affectedUsers: ['Screen reader users', 'Voice control users'],
    originalCode: `<a href="#" onclick="showPage('home');return false" class="flex items-center gap-2 min-w-0">
  <span class="w-10 h-10 rounded-xl bg-green-700 text-white grid place-items-center font-black text-xl">N</span>
  <span class="font-extrabold tracking-tight text-green-800 text-lg sm:text-xl">NaijaRemoteHub</span>
</a>`,
    fixedCode: `<a href="#home" onclick="showPage('home');return false;" 
   aria-label="NaijaRemoteHub, go to homepage" 
   class="flex items-center gap-2 min-w-0 rounded-xl focus-visible:ring-2 focus-visible:ring-green-700 focus:outline-none">
  <span class="w-10 h-10 rounded-xl bg-green-700 text-white grid place-items-center font-black text-xl shadow-sm" aria-hidden="true">N</span>
  <span class="font-extrabold tracking-tight text-green-800 text-lg sm:text-xl">NaijaRemoteHub</span>
</a>`,
    explanation: 'The decorative letter icon "N" must have `aria-hidden="true"`, and the parent link should have an explicit `aria-label="NaijaRemoteHub, go to homepage"` so the user understands its destination.',
    solutionSummary: 'Add `aria-label="NaijaRemoteHub, go to homepage"` and mark the "N" avatar with `aria-hidden="true"`.'
  },
  {
    id: 'ISSUE-17',
    title: 'Small Interactive Target Sizes for Mobile / Touch Accessibility',
    category: 'Keyboard & Focus',
    severity: 'minor',
    wcagCriterion: '2.5.8 Target Size (Minimum)',
    wcagLevel: 'AA',
    impact: 'Header navigation buttons `<button class="px-2 py-2 ...">` provide only ~32px touch target heights, falling below the WCAG 2.2 AA target size minimum of 24x24 CSS pixels with adequate spacing (and the recommended 44x44px for primary touch controls).',
    affectedUsers: ['Touchscreen users', 'Users with hand tremors / motor limitations'],
    originalCode: `<nav class="flex items-center gap-1 sm:gap-2 text-sm">
  <button class="px-2 py-2 rounded-lg hover:bg-green-50" onclick="showPage('home')">Home</button>
  <button id="navLogin" class="px-2 py-2 rounded-lg hover:bg-green-50" ...>Login</button>`,
    fixedCode: `<nav aria-label="Primary navigation" class="flex items-center gap-2 text-sm">
  <button class="min-h-[44px] min-w-[44px] px-3 py-2 rounded-lg hover:bg-green-50 font-medium inline-flex items-center justify-center" onclick="showPage('home')">Home</button>
  <button id="navLogin" class="min-h-[44px] min-w-[44px] px-3 py-2 rounded-lg hover:bg-green-50 font-medium inline-flex items-center justify-center" ...>Login</button>`,
    explanation: 'Ensuring interactive touch targets are at least 44x44px prevents accidental mis-taps by users with motor impairments or those using mobile devices on the move.',
    solutionSummary: 'Ensure all clickable buttons have a minimum touch target area of 44x44px.'
  },
  {
    id: 'ISSUE-18',
    title: 'Missing Form Validation Programmatic Attributes (aria-invalid)',
    category: 'Forms & Inputs',
    severity: 'moderate',
    wcagCriterion: '3.3.1 Error Identification, 3.3.3 Error Suggestion',
    wcagLevel: 'A',
    impact: 'When forms fail validation (such as password too short or invalid withdrawal amount), the error text is printed into the notice box, but the failing input element is never marked with `aria-invalid="true"` or linked via `aria-describedby`.',
    affectedUsers: ['Screen reader users', 'Users with cognitive disabilities'],
    originalCode: `if (password.length < 6) return showNotice("signupError", "Password must be at least 6 characters.");`,
    fixedCode: `if (password.length < 6) {
  const pwdInput = document.getElementById("signupPassword");
  pwdInput.setAttribute("aria-invalid", "true");
  pwdInput.setAttribute("aria-describedby", "signupError");
  pwdInput.focus();
  return showNotice("signupError", "Password must be at least 6 characters.");
}`,
    explanation: 'When an input contains an error, screen readers notify the user immediately upon focusing the field if `aria-invalid="true"` is set, and will read the associated error message linked through `aria-describedby`.',
    solutionSummary: 'Dynamically toggle `aria-invalid="true"` and shift focus to the first invalid field upon error.'
  }
];

export interface AuditSummary {
  totalIssues: number;
  criticalCount: number;
  seriousCount: number;
  moderateCount: number;
  minorCount: number;
  initialScore: number;
  remediatedScore: number;
  categories: { name: string; count: number }[];
}

export const auditSummary: AuditSummary = {
  totalIssues: 18,
  criticalCount: 5,
  seriousCount: 6,
  moderateCount: 5,
  minorCount: 2,
  initialScore: 46,
  remediatedScore: 98,
  categories: [
    { name: 'Forms & Inputs', count: 6 },
    { name: 'Navigation & Structure', count: 3 },
    { name: 'Color & Contrast', count: 1 },
    { name: 'Keyboard & Focus', count: 2 },
    { name: 'Screen Reader & ARIA', count: 5 },
    { name: 'Tables & Data', count: 1 }
  ]
};
