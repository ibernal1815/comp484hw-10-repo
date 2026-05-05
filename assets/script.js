/* ================================================================
   script.js — HW10 Chrome DevTools Demo
   Isaiah | CIT 336

   This file handles all interactivity on the page:
     - Tab navigation (show/hide sections)
     - Message Logging demos  (console.info/warn/error/table/group/%c)
     - Browser Error demos    (404, TypeError, Violation)
     - Filter Message demos   (level, text, regex, source, user)

   The store[] array holds the seeded log entries that the filter
   functions operate on — it mirrors what would be in the DevTools
   Console after clicking "Seed Console".
   ================================================================ */


/* ----------------------------------------------------------------
   SHARED DATA STORE
   Populated by seedAll(). Each object represents one console entry:
     { level, source, text, user }
   The filter functions read this array instead of parsing the
   real DevTools console (which is not accessible from JS).
   ---------------------------------------------------------------- */
var store = [];


/* ================================================================
   TAB NAVIGATION
   Listens for clicks on the <nav id="nav"> element. When a button
   is clicked, the handler:
     1. Removes .active from all nav buttons
     2. Removes .active from all sections
     3. Adds .active to the clicked button
     4. Adds .active to the section whose id matches "tab-" + data-tab
   This is event delegation — one listener handles all tab buttons.
   ================================================================ */
document.getElementById('nav').addEventListener('click', function(e) {
  /* Ignore clicks on the nav background, only handle button clicks */
  if (e.target.tagName !== 'BUTTON') return;

  /* Deactivate all tabs and sections */
  document.querySelectorAll('nav button').forEach(function(b) {
    b.classList.remove('active');
  });
  document.querySelectorAll('.section').forEach(function(s) {
    s.classList.remove('active');
  });

  /* Activate the clicked tab and its corresponding section */
  e.target.classList.add('active');
  document.getElementById('tab-' + e.target.dataset.tab).classList.add('active');
});


/* ================================================================
   HELPER FUNCTIONS
   ================================================================ */

/*
 * addLine(id, cls, text)
 * Creates a <div class="cline {cls}">{text}</div> and appends it
 * to the console-body element with the given id.
 * Called by every logging demo to mirror the DevTools output inline.
 *
 * cls values:
 *   'i' = info  (blue)
 *   'w' = warn  (amber)
 *   'e' = error (red)
 *   'l' = log   (muted)
 *   'g' = group (green)
 *   'v' = custom/violet
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
 * Empties the console-body element before writing new output.
 * Ensures each button press shows a fresh result instead of
 * appending to the previous run.
 */
function clear(id) {
  var d = document.getElementById(id);
  if (d) d.innerHTML = '';
}


/* ================================================================
   SECTION 1 — MESSAGE LOGGING
   Each function below:
     1. Calls the real console method so DevTools captures it
     2. Calls addLine() to show an inline preview on the page
   ================================================================ */

/*
 * runInfo()
 * Demonstrates console.info().
 * DevTools shows a blue (i) icon. Filterable under "Info" level.
 */
function runInfo() {
  var msg = 'App initialized. Session started at ' + new Date().toLocaleTimeString();

  /* Real call — appears in DevTools Console */
  console.info(msg);

  /* Inline preview */
  clear('out-info');
  addLine('out-info', 'i', msg);
}

/*
 * runWarn()
 * Demonstrates console.warn().
 * DevTools shows a yellow triangle icon. Filterable under "Warnings".
 * Use for non-fatal issues: deprecated APIs, slow responses, etc.
 */
function runWarn() {
  var msg = 'Deprecated endpoint detected. /api/v1/users is scheduled for removal in v3.0';

  console.warn(msg);

  clear('out-warn');
  addLine('out-warn', 'w', msg);
}

/*
 * runError()
 * Demonstrates console.error().
 * DevTools shows a red X icon with a full stack trace attached.
 * Also increments the error counter in the DevTools toolbar.
 */
function runError() {
  var msg = 'Authentication failed. Token expired or invalid. Re-login required.';

  console.error(msg);

  clear('out-error');
  addLine('out-error', 'e', msg);
}

/*
 * runTable()
 * Demonstrates console.table().
 * Passes an array of objects — DevTools renders it as an interactive,
 * sortable table. Each object key becomes a column header.
 * The static HTML table in index.html shows the same data visually.
 */
function runTable() {
  var analysts = [
    { name: 'Alice', role: 'SOC Analyst',   clearance: 'L1' },
    { name: 'Bob',   role: 'Threat Hunter', clearance: 'L3' },
    { name: 'Carol', role: 'Pen Tester',    clearance: 'L2' }
  ];

  /* Sends the structured array to DevTools as an interactive table */
  console.table(analysts);

  clear('out-table');
  addLine('out-table', 'l', 'console.table() sent to DevTools. See Console tab for the interactive table.');
}

/*
 * runGroup()
 * Demonstrates console.group() and console.groupEnd().
 * All console calls between group() and groupEnd() are indented
 * under a collapsible header in DevTools. Groups can be nested —
 * this demo nests "Response Headers" inside "Network Request Details".
 */
function runGroup() {
  /* Outer group — opens a collapsible "Network Request Details" header */
  console.group('Network Request Details');
    console.log('URL: https://api.example.com/v2/threats');
    console.log('Method: GET');
    console.info('Status: 200 OK');

    /* Inner group — nested under the outer group */
    console.group('Response Headers');
      console.log('Content-Type: application/json');
      console.log('X-RateLimit-Remaining: 95');
    console.groupEnd(); /* closes "Response Headers" */

    console.warn('Response time: 843ms  above threshold');
  console.groupEnd(); /* closes "Network Request Details" */

  /* Inline preview showing indentation with spaces */
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
 * Demonstrates styled console output using the %c format specifier.
 * Each %c in the format string is replaced by the text that follows,
 * styled with the corresponding CSS string argument.
 * Multiple %c tokens can appear in one call for multi-styled output.
 * This feature is Chromium-only.
 */
function runCustom() {
  /* CSS styles for each line — defined separately for readability */
  var s1 = 'background:#0a1a0f;color:#3dffa0;font-size:13px;font-weight:600;padding:4px 10px;border-left:3px solid #3dffa0';
  var s2 = 'background:#0b1e2e;color:#4db8ff;font-size:11px;padding:3px 10px';
  var s3 = 'color:#52525a;font-size:10px;padding:2px 10px';

  /* %c applies s1 to the text that follows it */
  console.log('%c[ALERT] Intrusion detected', s1);
  console.log('%cSource IP: 192.168.4.22   Severity: HIGH', s2);
  console.log('%cTimestamp: ' + new Date().toISOString(), s3);

  /* Inline preview — approximates the styled output using class names */
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
   SECTION 2 — BROWSER ERRORS
   These functions intentionally trigger error conditions so the
   browser logs messages to the Console automatically — as it would
   in a real application when something goes wrong.
   ================================================================ */

/*
 * cause404()
 * Triggers a 404 network error by fetching a path that does not exist.
 * The browser automatically logs a red network error in the Console
 * (and shows the failed request in the Network tab).
 * The .catch() handler re-logs with console.error() and updates the
 * on-page output box with the error text.
 */
function cause404() {
  var url = '/nonexistent-resource-hw10.json';

  /* Update the output box immediately to show the request is in flight */
  document.getElementById('out-404').textContent = 'Fetching ' + url + '...';

  fetch(url)
    .then(function(r) {
      /* fetch() resolves even for 4xx/5xx — we throw manually for non-OK */
      if (!r.ok) throw new Error('HTTP ' + r.status + ' ' + r.statusText);
      return r.json();
    })
    .catch(function(err) {
      /* Update the output box with the error details */
      document.getElementById('out-404').textContent =
        'GET ' + url + '\n' + err.message +
        '\n\nCheck the Console and Network tabs in DevTools for the 404 entry.';

      /* Logs to DevTools console with the full error object */
      console.error('Fetch failed:', err.message, 'URL:', url);
    });
}

/*
 * causeTypeError()
 * Intentionally produces a TypeError by calling .toUpperCase() on
 * an undefined variable. The error is caught with try/catch so the
 * page keeps running, then passed to console.error() so DevTools
 * shows the full stack trace as it would for an uncaught error.
 */
function causeTypeError() {
  try {
    var data = undefined;
    data.toUpperCase(); /* TypeError: Cannot read properties of undefined */
  } catch(e) {
    /* Show the error name and message in the output box */
    document.getElementById('out-type').textContent =
      e.name + ': ' + e.message +
      '\n\nSee the Console in DevTools for the full stack trace.';

    /* Pass the Error object to console.error — DevTools shows the stack trace */
    console.error(e);
  }
}

/*
 * causeViolation()
 * Triggers [Violation] warnings in DevTools by blocking the main thread
 * in two ways:
 *
 *   1. Forced layout reflow — reading offsetWidth forces the browser to
 *      recalculate layout synchronously. Doing this inside a loop that
 *      also writes styles (style.width) causes Chrome to fire a
 *      "Forced reflow" [Violation] warning.
 *
 *   2. Busy-wait loop — spins for ~120ms doing nothing useful.
 *      Chrome fires a "Long running JavaScript task" [Violation] warning
 *      for synchronous work that blocks the thread longer than ~50ms.
 *
 * Set the DevTools Console log level to "Verbose" to see these entries.
 */
function causeViolation() {
  document.getElementById('out-violation').textContent = 'Running blocking task...';

  /* Create a temporary off-screen element to trigger layout reflow on */
  var temp = document.createElement('div');
  document.body.appendChild(temp);

  var start = Date.now();

  /*
   * Forced reflow loop:
   * Writing style.width marks layout as dirty.
   * Reading offsetWidth forces the browser to resolve that dirty layout
   * before returning the value. Alternating write/read 20,000 times
   * chains forced reflows together — Chrome flags this as a violation.
   */
  for (var i = 0; i < 20000; i++) {
    temp.style.width = (i % 200) + 'px'; /* write: marks layout dirty */
    void temp.offsetWidth;               /* read: forces synchronous reflow */
  }

  /* Clean up the temporary element */
  document.body.removeChild(temp);

  var elapsed = Date.now() - start;

  /*
   * Busy-wait loop (~120ms):
   * Keeps the main thread occupied with no useful work.
   * Chrome fires a "Long running JavaScript task" violation
   * for tasks that block execution beyond ~50ms.
   */
  var now = Date.now();
  while (Date.now() - now < 120) { /* intentional busy wait */ }

  /* Update the output box with results */
  document.getElementById('out-violation').textContent =
    'Synchronous task completed in ~' + elapsed + 'ms\n\n' +
    'Enable Verbose log level in the DevTools Console to see [Violation] entries.\n' +
    'Look for: "Forced reflow" or "Long running JavaScript task"';

  /* Also log to the DevTools console for good measure */
  console.warn(
    'Long-running task executed in ' + elapsed + 'ms. ' +
    'Check Verbose level for [Violation] entries.'
  );
}


/* ================================================================
   SECTION 3 — FILTER MESSAGES

   seedAll() populates:
     - The real DevTools Console (via console.info/warn/error/log)
     - The store[] array (used by all filter functions below)

   Each filter function reads store[], applies a filter condition,
   and calls renderFilter() to display the matching entries on the page.
   This mirrors what the DevTools filter bar does natively.
   ================================================================ */

/*
 * seedAll()
 * Writes 10 mixed log entries to the DevTools Console and to store[].
 * Entry shape:
 *   level  — 'info' | 'warn' | 'error' | 'log'
 *   source — 'script' | 'network' | 'browser'
 *   text   — the message string
 *   user   — true if written by user JS code, false if browser-generated
 */
function seedAll() {
  /* Clear previous seed data */
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
    /* Push into the in-memory store for filter functions to query */
    store.push(e);

    /* Also write to the real DevTools Console */
    if (e.level === 'info')  console.info(e.text, '| source:', e.source);
    if (e.level === 'warn')  console.warn(e.text, '| source:', e.source);
    if (e.level === 'error') console.error(e.text, '| source:', e.source);
    if (e.level === 'log')   console.log(e.text, '| source:', e.source);
  });

  /* Show a confirmation timestamp below the seed button */
  document.getElementById('seed-hint').textContent =
    '10 entries written to DevTools console at ' + new Date().toLocaleTimeString();
}

/*
 * tagClass(level)
 * Maps a log level string to the CSS class for its badge color.
 * Returns the class name used by the .tag element in filter results.
 */
function tagClass(level) {
  var map = { info:'ti', warn:'tw', error:'te', log:'tl' };
  return map[level] || 'tl';
}

/*
 * renderFilter(id, results)
 * Injects the filtered entries into the given result container.
 * Each row shows: [level tag] [source tag] message text
 * Shows "No matching entries" if results is empty.
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

/*
 * filterLevel()
 * Filters store[] by log level.
 * Mirrors DevTools: the log-level dropdown (Default/Info/Warnings/Errors)
 * hides entries that do not match the selected severity.
 */
function filterLevel() {
  var v = document.getElementById('level-select').value;
  var results = (v === 'all')
    ? store
    : store.filter(function(e) { return e.level === v; });

  renderFilter('level-result', results);
}

/*
 * filterText()
 * Filters store[] by a plain-text substring match (case insensitive).
 * Mirrors DevTools: typing in the filter bar hides non-matching messages.
 * Fires on every keystroke (oninput) for real-time feedback.
 */
function filterText() {
  var v = document.getElementById('text-input').value.toLowerCase();
  var results = v
    ? store.filter(function(e) { return e.text.toLowerCase().indexOf(v) !== -1; })
    : store;

  renderFilter('text-result', results);
}

/*
 * filterRegex()
 * Filters store[] using a regular expression.
 * Mirrors DevTools: prefixing a filter with / enables regex mode.
 * Detects the /pattern/flags syntax and builds a RegExp object.
 * Shows an error message if the pattern is invalid.
 */
function filterRegex() {
  var raw = document.getElementById('regex-input').value;

  /* Show all entries if the field is empty */
  if (!raw) { renderFilter('regex-result', store); return; }

  try {
    /* Check if the input is in /pattern/flags format */
    var m = raw.match(/^\/(.+)\/([gimsuy]*)$/);

    /* Build a RegExp with flags if the format matched, or plain pattern otherwise */
    var rx = m ? new RegExp(m[1], m[2]) : new RegExp(raw, 'i');

    var results = store.filter(function(e) { return rx.test(e.text); });
    renderFilter('regex-result', results);
  } catch(err) {
    /* Invalid regex — show a red error message instead of crashing */
    document.getElementById('regex-result').innerHTML =
      '<span style="color:var(--red)">Invalid regex pattern</span>';
  }
}

/*
 * filterSource()
 * Filters store[] by message source.
 * Mirrors DevTools: the Console sidebar lets you filter by source category:
 *   network  — messages from fetch/XHR errors, CORS failures, etc.
 *   script   — messages from user-written console.* calls
 *   browser  — messages the browser logged on its own (CSP, violations, etc.)
 */
function filterSource() {
  var v = document.getElementById('source-select').value;
  var results = (v === 'all')
    ? store
    : store.filter(function(e) { return e.source === v; });

  renderFilter('source-result', results);
}

/*
 * filterUser()
 * Filters store[] by whether the message was user-generated or browser-generated.
 * Mirrors DevTools: the "User messages" shortcut in the sidebar toggles
 * visibility of only the developer's own console.* output.
 *
 * user:true  — written by user JS code (console.log/info/warn/error)
 * user:false — logged automatically by the browser (network errors, violations)
 */
function filterUser() {
  var v = document.getElementById('user-select').value;
  var res = store;

  if (v === 'user')    res = store.filter(function(e) { return e.user; });
  if (v === 'browser') res = store.filter(function(e) { return !e.user; });

  renderFilter('user-result', res);
}


/* ================================================================
   BOOT
   Fires when the script loads. Writes a styled header to the
   DevTools console so the grader can confirm the page is wired up.
   ================================================================ */
console.log(
  '%c HW10 DevTools Demo ',
  'background:#0a1a0f;color:#3dffa0;font-family:monospace;font-size:13px;font-weight:600;padding:4px 12px'
);
console.info('Page loaded. Use the buttons to trigger console events.');
