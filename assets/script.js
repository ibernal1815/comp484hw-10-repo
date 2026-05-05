/* ================================================================
   script.js — HW10 Chrome DevTools Demo
   Isaiah | COMP 484/L

   Sections:
     1. Shared data store (filter tab)
     2. Tab navigation
     3. Helper functions
     4. Message Logging demos
     5. Browser Error demos
     6. Filter Message demos
     7. Debugging demos
     8. Boot
   ================================================================ */


/* ----------------------------------------------------------------
   1. SHARED DATA STORE
   Populated by seedAll(). Each entry has:
     level  — 'info' | 'warn' | 'error' | 'log'
     source — 'script' | 'network' | 'browser'
     text   — message string
     user   — true if written by user JS, false if browser-generated
   ---------------------------------------------------------------- */
var store = [];


/* ================================================================
   2. TAB NAVIGATION
   Event delegation on the nav element. Reads data-tab to find and
   show the matching section, hiding all others.
   ================================================================ */
document.getElementById('nav').addEventListener('click', function(e) {
  if (e.target.tagName !== 'BUTTON') return;

  document.querySelectorAll('nav button').forEach(function(b) {
    b.classList.remove('active');
  });
  document.querySelectorAll('.section').forEach(function(s) {
    s.classList.remove('active');
  });

  e.target.classList.add('active');
  document.getElementById('tab-' + e.target.dataset.tab).classList.add('active');
});


/* ================================================================
   3. HELPER FUNCTIONS
   ================================================================ */

/*
 * addLine(id, cls, text)
 * Appends a styled line to a console preview element.
 * cls: 'i'=info, 'w'=warn, 'e'=error, 'l'=log, 'g'=group, 'v'=custom
 */
function addLine(id, cls, text) {
  var d = document.getElementById(id);
  if (!d) return;
  var row = document.createElement('div');
  row.className = 'cline ' + cls;
  row.textContent = text;
  d.appendChild(row);
}

/*
 * clear(id)
 * Clears a console preview before writing fresh output.
 */
function clear(id) {
  var d = document.getElementById(id);
  if (d) d.innerHTML = '';
}


/* ================================================================
   4. MESSAGE LOGGING
   ================================================================ */

/*
 * runInfo()
 * console.info() — blue icon in DevTools, filterable under Info level.
 */
function runInfo() {
  var msg = 'App initialized. Session started at ' + new Date().toLocaleTimeString();
  console.info(msg);
  clear('out-info');
  addLine('out-info', 'i', msg);
}

/*
 * runWarn()
 * console.warn() — yellow triangle in DevTools. For non-fatal issues.
 */
function runWarn() {
  var msg = 'Deprecated endpoint detected. /api/v1/users is scheduled for removal in v3.0';
  console.warn(msg);
  clear('out-warn');
  addLine('out-warn', 'w', msg);
}

/*
 * runError()
 * console.error() — red X with stack trace. Increments error counter.
 */
function runError() {
  var msg = 'Authentication failed. Token expired or invalid. Re-login required.';
  console.error(msg);
  clear('out-error');
  addLine('out-error', 'e', msg);
}

/*
 * runTable()
 * console.table() — renders an array of objects as a sortable table
 * in DevTools. Each key becomes a column header.
 */
function runTable() {
  var analysts = [
    { name: 'Alice', role: 'SOC Analyst',   clearance: 'L1' },
    { name: 'Bob',   role: 'Threat Hunter', clearance: 'L3' },
    { name: 'Carol', role: 'Pen Tester',    clearance: 'L2' }
  ];
  console.table(analysts);
  clear('out-table');
  addLine('out-table', 'l', 'console.table() sent to DevTools. See Console tab for the interactive table.');
}

/*
 * runGroup()
 * console.group() / console.groupEnd() — nests messages under a
 * collapsible header. Groups can be nested for deeper hierarchy.
 */
function runGroup() {
  console.group('Network Request Details');
    console.log('URL: https://api.example.com/v2/threats');
    console.log('Method: GET');
    console.info('Status: 200 OK');
    console.group('Response Headers');
      console.log('Content-Type: application/json');
      console.log('X-RateLimit-Remaining: 95');
    console.groupEnd();
    console.warn('Response time: 843ms  above threshold');
  console.groupEnd();

  clear('out-group');
  addLine('out-group', 'g', 'Network Request Details');
  addLine('out-group', 'l', '  URL: https://api.example.com/v2/threats');
  addLine('out-group', 'l', '  Method: GET');
  addLine('out-group', 'i', '  Status: 200 OK');
  addLine('out-group', 'g', '  Response Headers');
  addLine('out-group', 'l', '    Content-Type: application/json');
  addLine('out-group', 'l', '    X-RateLimit-Remaining: 95');
  addLine('out-group', 'w', '  Response time: 843ms  above threshold');
}

/*
 * runCustom()
 * console.log() with %c — applies CSS to console output.
 * Each %c token is styled by the corresponding string argument.
 * Chromium-only feature.
 */
function runCustom() {
  var s1 = 'background:#0a1a0f;color:#3dffa0;font-size:13px;font-weight:600;padding:4px 10px;border-left:3px solid #3dffa0';
  var s2 = 'background:#0b1e2e;color:#4db8ff;font-size:11px;padding:3px 10px';
  var s3 = 'color:#52525a;font-size:10px;padding:2px 10px';
  console.log('%c[ALERT] Intrusion detected', s1);
  console.log('%cSource IP: 192.168.4.22   Severity: HIGH', s2);
  console.log('%cTimestamp: ' + new Date().toISOString(), s3);

  clear('out-custom');
  var d1 = document.createElement('div');
  d1.className = 'cline g';
  d1.innerHTML = '<span style="font-weight:600">[ALERT] Intrusion detected</span>';
  document.getElementById('out-custom').appendChild(d1);
  var d2 = document.createElement('div');
  d2.className = 'cline i';
  d2.textContent = 'Source IP: 192.168.4.22   Severity: HIGH';
  document.getElementById('out-custom').appendChild(d2);
  addLine('out-custom', 'l', 'Timestamp: ' + new Date().toISOString());
}


/* ================================================================
   5. BROWSER ERRORS
   ================================================================ */

/*
 * cause404()
 * Fetches a path that does not exist. The browser returns HTTP 404
 * and logs a red network error in the Console automatically.
 * The same request appears in the Network tab with status 404.
 */
function cause404() {
  var url = '/nonexistent-resource-hw10.json';
  document.getElementById('out-404').textContent = 'Fetching ' + url + '...';
  fetch(url)
    .then(function(r) {
      if (!r.ok) throw new Error('HTTP ' + r.status + ' ' + r.statusText);
      return r.json();
    })
    .catch(function(err) {
      document.getElementById('out-404').textContent =
        'GET ' + url + '\n' + err.message +
        '\n\nCheck the Console and Network tabs in DevTools for the 404 entry.';
      console.error('Fetch failed:', err.message, 'URL:', url);
    });
}

/*
 * causeTypeError()
 * Calls .toUpperCase() on undefined — produces a TypeError.
 * Caught with try/catch so the page keeps running, then passed
 * to console.error() so DevTools shows the full stack trace.
 */
function causeTypeError() {
  try {
    var data = undefined;
    data.toUpperCase(); /* TypeError: Cannot read properties of undefined */
  } catch(e) {
    document.getElementById('out-type').textContent =
      e.name + ': ' + e.message +
      '\n\nSee the Console in DevTools for the full stack trace.';
    console.error(e);
  }
}

/*
 * causeViolation()
 * Triggers [Violation] warnings two ways:
 *   1. Forced reflow — alternating style writes and offsetWidth reads
 *      forces the browser to recalculate layout synchronously 20k times.
 *   2. Busy-wait loop — blocks the main thread for ~120ms.
 * Set Console log level to Verbose to see [Violation] entries.
 */
function causeViolation() {
  document.getElementById('out-violation').textContent = 'Running blocking task...';
  var temp = document.createElement('div');
  document.body.appendChild(temp);
  var start = Date.now();
  for (var i = 0; i < 20000; i++) {
    temp.style.width = (i % 200) + 'px'; /* write: marks layout dirty */
    void temp.offsetWidth;               /* read: forces synchronous reflow */
  }
  document.body.removeChild(temp);
  var elapsed = Date.now() - start;
  var now = Date.now();
  while (Date.now() - now < 120) { /* busy wait — blocks thread */ }
  document.getElementById('out-violation').textContent =
    'Synchronous task completed in ~' + elapsed + 'ms\n\n' +
    'Enable Verbose log level in the DevTools Console to see [Violation] entries.\n' +
    'Look for: "Forced reflow" or "Long running JavaScript task"';
  console.warn('Long-running task executed in ' + elapsed + 'ms. Check Verbose level for [Violation] entries.');
}


/* ================================================================
   6. FILTER MESSAGES
   ================================================================ */

/*
 * seedAll()
 * Writes 10 mixed entries to the DevTools Console and to store[].
 * All filter functions below operate on store[].
 */
function seedAll() {
  store.length = 0;
  var entries = [
    { level:'info',  source:'script',  text:'App loaded successfully',                 user:true  },
    { level:'warn',  source:'network', text:'Slow fetch from /api/alerts (1240ms)',    user:false },
    { level:'error', source:'script',  text:'TypeError: Cannot read property of null', user:true  },
    { level:'log',   source:'script',  text:'User login: user@example.com',            user:true  },
    { level:'error', source:'network', text:'404 Not Found: /api/v1/threats.json',     user:false },
    { level:'info',  source:'browser', text:'CSP blocked inline script execution',     user:false },
    { level:'warn',  source:'browser', text:'[Violation] Forced reflow detected',      user:false },
    { level:'log',   source:'script',  text:'Dashboard rendered in 312ms',             user:true  },
    { level:'error', source:'script',  text:'Auth token expired, re-login required',   user:true  },
    { level:'info',  source:'network', text:'WebSocket connection established',        user:false },
  ];
  entries.forEach(function(e) {
    store.push(e);
    if (e.level === 'info')  console.info(e.text, '| source:', e.source);
    if (e.level === 'warn')  console.warn(e.text, '| source:', e.source);
    if (e.level === 'error') console.error(e.text, '| source:', e.source);
    if (e.level === 'log')   console.log(e.text, '| source:', e.source);
  });
  document.getElementById('seed-hint').textContent =
    '10 entries written to DevTools console at ' + new Date().toLocaleTimeString();
}

/* Maps a log level string to its badge CSS class */
function tagClass(level) {
  var map = { info:'ti', warn:'tw', error:'te', log:'tl' };
  return map[level] || 'tl';
}

/*
 * renderFilter(id, results)
 * Injects matched entries into the given result container.
 * Each row: [level tag] [source tag] message text
 */
function renderFilter(id, results) {
  var d = document.getElementById(id);
  if (!results.length) {
    d.innerHTML = '<span style="color:var(--text3)">No matching entries</span>';
    return;
  }
  d.innerHTML = results.map(function(r) {
    return '<div class="fline">' +
      '<span class="tag ' + tagClass(r.level) + '">' + r.level + '</span>' +
      '<span class="tag ts">' + r.source + '</span>' +
      '<span class="msg">' + r.text + '</span>' +
    '</div>';
  }).join('');
}

/* Filter by log level — mirrors the DevTools log-level dropdown */
function filterLevel() {
  var v = document.getElementById('level-select').value;
  renderFilter('level-result', v === 'all' ? store : store.filter(function(e) { return e.level === v; }));
}

/* Filter by text — mirrors the DevTools filter bar plain-text mode */
function filterText() {
  var v = document.getElementById('text-input').value.toLowerCase();
  renderFilter('text-result', v ? store.filter(function(e) { return e.text.toLowerCase().indexOf(v) !== -1; }) : store);
}

/*
 * filterRegex()
 * Detects /pattern/flags syntax and builds a RegExp.
 * Mirrors DevTools: prefix filter with / to enable regex mode.
 */
function filterRegex() {
  var raw = document.getElementById('regex-input').value;
  if (!raw) { renderFilter('regex-result', store); return; }
  try {
    var m = raw.match(/^\/(.+)\/([gimsuy]*)$/);
    var rx = m ? new RegExp(m[1], m[2]) : new RegExp(raw, 'i');
    renderFilter('regex-result', store.filter(function(e) { return rx.test(e.text); }));
  } catch(err) {
    document.getElementById('regex-result').innerHTML =
      '<span style="color:var(--red)">Invalid regex pattern</span>';
  }
}

/* Filter by source — mirrors the DevTools Console sidebar source filter */
function filterSource() {
  var v = document.getElementById('source-select').value;
  renderFilter('source-result', v === 'all' ? store : store.filter(function(e) { return e.source === v; }));
}

/*
 * filterUser()
 * user:true  = messages from user JS code (console.*)
 * user:false = messages logged by the browser automatically
 * Mirrors the DevTools "User messages" sidebar shortcut.
 */
function filterUser() {
  var v = document.getElementById('user-select').value;
  var res = store;
  if (v === 'user')    res = store.filter(function(e) { return e.user; });
  if (v === 'browser') res = store.filter(function(e) { return !e.user; });
  renderFilter('user-result', res);
}


/* ================================================================
   7. DEBUGGING

   Scenario: a security dashboard calculates a total risk score by
   summing the numeric score from each alert. The buggy version reads
   alert.severity (a string like "high") instead of alert.score (a
   number), so the result is NaN.

   calcTotalScore()      — the buggy function (wrong property name)
   calcTotalScoreFixed() — the corrected function (right property name)
   runBuggy()            — runs the buggy version, logs NaN
   runFixed()            — runs the fixed version, logs correct total
   ================================================================ */

/* Sample alert data used by both versions of the function */
var alerts = [
  { id: 'ALT-001', name: 'Brute force login',      severity: 'high',   score: 85 },
  { id: 'ALT-002', name: 'Port scan detected',      severity: 'medium', score: 52 },
  { id: 'ALT-003', name: 'Unpatched CVE found',     severity: 'high',   score: 91 },
  { id: 'ALT-004', name: 'Suspicious DNS query',    severity: 'low',    score: 23 },
  { id: 'ALT-005', name: 'Outbound data exfil',     severity: 'critical', score: 98 },
];

/*
 * calcTotalScore() — BUGGY VERSION
 *
 * Bug: reads alert.severity instead of alert.score.
 * alert.severity is a string ("high", "medium", etc.).
 * Adding a string to a number produces NaN.
 * NaN + anything = NaN, so the total stays NaN for every iteration.
 *
 * This is the function to open in the Sources panel and set a
 * breakpoint on the "total += alert.severity" line.
 */
function calcTotalScore() {
  var total = 0;
  alerts.forEach(function(alert) {
    total += alert.severity; /* BUG: severity is a string, not a number */
  });
  return total;
}

/*
 * calcTotalScoreFixed() — FIXED VERSION
 *
 * Fix: changed alert.severity to alert.score.
 * alert.score is a number so the addition works correctly.
 * Expected result: 85 + 52 + 91 + 23 + 98 = 349
 */
function calcTotalScoreFixed() {
  var total = 0;
  alerts.forEach(function(alert) {
    total += alert.score; /* FIXED: score is the numeric field */
  });
  return total;
}

/*
 * runBuggy()
 * Calls the buggy function and shows the NaN result on the page
 * and in the DevTools Console. Used for Step 1 and Step 4 (breakpoint).
 */
function runBuggy() {
  var result = calcTotalScore();

  /* Log to DevTools so the NaN is visible in the Console */
  console.log('calcTotalScore() result:', result);
  console.warn('Expected a number but got: ' + typeof result + ' (' + result + ')');

  /* Show result in the on-page output box */
  document.getElementById('out-buggy').textContent =
    'calcTotalScore() returned: ' + result + '\n\n' +
    'Expected: 349  (85 + 52 + 91 + 23 + 98)\n' +
    'Got:      ' + result + '\n\n' +
    'Open DevTools Console to see the logged output.\n' +
    'Set a breakpoint on the "total += alert.severity" line in Sources to inspect why.';
}

/*
 * runFixed()
 * Calls the fixed function and shows the correct total on the page
 * and in the DevTools Console. Used for Step 6.
 */
function runFixed() {
  var result = calcTotalScoreFixed();

  /* Log both the result and a breakdown to the Console */
  console.log('calcTotalScoreFixed() result:', result);
  console.table(alerts.map(function(a) {
    return { id: a.id, name: a.name, score: a.score };
  }));
  console.info('Fix confirmed. Total risk score: ' + result);

  /* Show result in the on-page output box */
  document.getElementById('out-fixed').textContent =
    'calcTotalScoreFixed() returned: ' + result + '\n\n' +
    'Breakdown:\n' +
    alerts.map(function(a) { return '  ' + a.id + '  ' + a.name + '  score: ' + a.score; }).join('\n') +
    '\n\nTotal: ' + result + '\n\n' +
    'Bug fixed. Check the Console for the full breakdown table.';
}


/* ================================================================
   8. BOOT
   Fires when the script loads. Writes a styled header to the
   DevTools console so the grader knows the page loaded correctly.
   ================================================================ */
console.log(
  '%c HW10 DevTools Demo ',
  'background:#0a1a0f;color:#3dffa0;font-family:monospace;font-size:13px;font-weight:600;padding:4px 12px'
);
console.info('Page loaded. Use the buttons to trigger console events.');
