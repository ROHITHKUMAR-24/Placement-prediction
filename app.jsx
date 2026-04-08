import { useState, useRef } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #080c14; --surface: #0e1520; --surface2: #141d2e;
    --border: #1e2d45; --accent: #00d4ff; --accent2: #7c3aed;
    --accent3: #10b981; --text: #e2eaf6; --muted: #5a7099;
    --danger: #f87171; --warn: #fbbf24;
  }
  body { background: var(--bg); color: var(--text); font-family: 'Syne', sans-serif; min-height: 100vh; }
  .app {
    min-height: 100vh; background: var(--bg);
    background-image:
      radial-gradient(ellipse 80% 50% at 20% -10%, rgba(0,212,255,0.08) 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 80% 110%, rgba(124,58,237,0.08) 0%, transparent 60%);
  }
  .header {
    border-bottom: 1px solid var(--border); padding: 14px 28px;
    display: flex; align-items: center; justify-content: space-between;
    background: rgba(14,21,32,0.92); backdrop-filter: blur(12px);
    position: sticky; top: 0; z-index: 100; flex-wrap: wrap; gap: 10px;
  }
  .logo { display: flex; align-items: center; gap: 10px; }
  .logo-icon { width: 32px; height: 32px; background: linear-gradient(135deg, var(--accent), var(--accent2)); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 15px; }
  .logo-text { font-size: 16px; font-weight: 800; letter-spacing: -0.5px; }
  .logo-text span { color: var(--accent); }
  .nav-tabs { display: flex; gap: 3px; background: var(--surface); border-radius: 10px; padding: 3px; border: 1px solid var(--border); }
  .nav-tab { padding: 7px 14px; border-radius: 7px; border: none; cursor: pointer; font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 600; transition: all 0.2s; color: var(--muted); background: transparent; white-space: nowrap; }
  .nav-tab.active { background: var(--accent); color: #000; }
  .nav-tab:hover:not(.active) { color: var(--text); background: var(--surface2); }
  .main { max-width: 1020px; margin: 0 auto; padding: 40px 20px; }
  .section-title { font-size: 28px; font-weight: 800; line-height: 1.1; margin-bottom: 7px; letter-spacing: -1px; }
  .section-title span { color: var(--accent); }
  .section-sub { color: var(--muted); font-size: 13px; margin-bottom: 28px; font-family: 'Space Mono', monospace; }

  /* SKILL MATCHER */
  .skill-input-label { font-size: 11px; font-weight: 700; color: var(--muted); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 9px; }
  .skill-tags-box { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 11px; display: flex; flex-wrap: wrap; gap: 7px; align-items: center; min-height: 50px; transition: border-color 0.2s; margin-bottom: 10px; }
  .skill-tags-box:focus-within { border-color: var(--accent); }
  .skill-tag { background: rgba(0,212,255,0.12); border: 1px solid rgba(0,212,255,0.3); color: var(--accent); border-radius: 6px; padding: 3px 9px; font-size: 12px; font-weight: 600; display: flex; align-items: center; gap: 5px; font-family: 'Space Mono', monospace; }
  .skill-tag button { background: none; border: none; color: var(--accent); cursor: pointer; font-size: 14px; line-height: 1; opacity: 0.6; }
  .skill-tag button:hover { opacity: 1; }
  .skill-input { background: transparent; border: none; outline: none; color: var(--text); font-family: 'Syne', sans-serif; font-size: 13px; min-width: 130px; flex: 1; }
  .skill-input::placeholder { color: var(--muted); }
  .popular-label { font-size: 11px; color: var(--muted); margin-bottom: 6px; font-family: 'Space Mono', monospace; }
  .popular-chips { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 20px; }
  .popular-chip { background: var(--surface2); border: 1px solid var(--border); color: var(--muted); border-radius: 6px; padding: 3px 8px; font-size: 11px; cursor: pointer; transition: all 0.15s; font-family: 'Space Mono', monospace; }
  .popular-chip:hover { border-color: var(--accent); color: var(--accent); }

  .analyze-btn { width: 100%; padding: 14px; border-radius: 12px; border: none; background: linear-gradient(135deg, var(--accent), #0099bb); color: #000; font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 800; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 9px; }
  .analyze-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .analyze-btn:not(:disabled):hover { transform: translateY(-1px); box-shadow: 0 8px 28px rgba(0,212,255,0.3); }

  .results { margin-top: 32px; }
  .results-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 18px; }
  @media(max-width:660px){.results-grid{grid-template-columns:1fr}}
  .role-card { background: var(--surface); border: 1px solid var(--border); border-radius: 13px; padding: 18px; transition: all 0.2s; animation: fadeUp 0.4s ease forwards; opacity: 0; }
  .role-card:nth-child(1){animation-delay:.05s}.role-card:nth-child(2){animation-delay:.1s}.role-card:nth-child(3){animation-delay:.15s}.role-card:nth-child(4){animation-delay:.2s}
  .role-card:hover { border-color: var(--accent); transform: translateY(-2px); }
  @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  .role-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 9px; }
  .role-name { font-size: 14px; font-weight: 700; }
  .match-badge { font-size: 10px; font-weight: 700; font-family: 'Space Mono', monospace; padding: 2px 8px; border-radius: 20px; white-space: nowrap; margin-left: 7px; }
  .match-high { background: rgba(16,185,129,0.15); color: var(--accent3); border: 1px solid rgba(16,185,129,0.3); }
  .match-mid  { background: rgba(251,191,36,0.15);  color: var(--warn);    border: 1px solid rgba(251,191,36,0.3); }
  .match-low  { background: rgba(248,113,113,0.15); color: var(--danger);  border: 1px solid rgba(248,113,113,0.3); }
  .role-desc { font-size: 12px; color: var(--muted); line-height: 1.5; margin-bottom: 10px; }
  .skills-section { margin-bottom: 8px; }
  .skills-label { font-size: 10px; font-weight: 700; color: var(--muted); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 4px; }
  .skills-list { display: flex; flex-wrap: wrap; gap: 4px; }
  .skill-pill { font-size: 10px; font-family: 'Space Mono', monospace; padding: 2px 6px; border-radius: 4px; }
  .skill-pill.have { background: rgba(0,212,255,0.1); color: var(--accent); border: 1px solid rgba(0,212,255,0.2); }
  .skill-pill.need { background: rgba(248,113,113,0.1); color: var(--danger); border: 1px solid rgba(248,113,113,0.25); }
  .learn-section { background: rgba(124,58,237,0.08); border: 1px solid rgba(124,58,237,0.2); border-radius: 8px; padding: 9px; margin-top: 9px; }
  .learn-label { font-size: 10px; font-weight: 700; color: #a78bfa; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 5px; }
  .learn-item { font-size: 11px; color: var(--muted); display: flex; align-items: flex-start; gap: 5px; margin-bottom: 3px; line-height: 1.4; }
  .learn-item::before { content:"→"; color:#a78bfa; flex-shrink:0; }

  /* ATS */
  .upload-zone { border: 2px dashed var(--border); border-radius: 14px; padding: 50px 36px; text-align: center; background: var(--surface); transition: all 0.2s; cursor: pointer; }
  .upload-zone:hover,.upload-zone.drag { border-color: var(--accent); background: rgba(0,212,255,0.04); }
  .upload-icon { font-size: 40px; margin-bottom: 12px; }
  .upload-title { font-size: 17px; font-weight: 700; margin-bottom: 5px; }
  .upload-hint { font-size: 12px; color: var(--muted); font-family: 'Space Mono', monospace; }
  .upload-input { display: none; }
  .file-selected { background: rgba(0,212,255,0.06); border: 1px solid rgba(0,212,255,0.3); border-radius: 9px; padding: 11px 14px; margin-top: 12px; display: flex; align-items: center; gap: 10px; }
  .file-name { font-size: 13px; font-weight: 600; }
  .file-size { font-size: 10px; color: var(--muted); font-family: 'Space Mono', monospace; }
  .file-remove { margin-left: auto; background: none; border: none; color: var(--muted); cursor: pointer; font-size: 16px; }
  .file-remove:hover { color: var(--danger); }
  .job-input-row { display: grid; grid-template-columns: 1fr; gap: 12px; margin-top: 18px; }
  .field-group { display: flex; flex-direction: column; gap: 6px; }
  .field-label { font-size: 11px; font-weight: 700; color: var(--muted); letter-spacing: 1px; text-transform: uppercase; }
  .field-input,.field-textarea { background: var(--surface); border: 1px solid var(--border); border-radius: 9px; color: var(--text); font-family: 'Syne', sans-serif; font-size: 13px; padding: 10px 13px; outline: none; transition: border-color 0.2s; width: 100%; }
  .field-input:focus,.field-textarea:focus { border-color: var(--accent); }
  .field-textarea { resize: vertical; min-height: 100px; }
  .ats-score-ring { display: flex; flex-direction: column; align-items: center; margin-bottom: 28px; }
  .score-circle { width: 120px; height: 120px; border-radius: 50%; background: conic-gradient(var(--accent) 0%, var(--accent) var(--pct), var(--surface2) var(--pct), var(--surface2) 100%); position: relative; margin-bottom: 12px; display:flex; align-items:center; justify-content:center; }
  .score-inner { width: 94px; height: 94px; border-radius: 50%; background: var(--surface); display: flex; flex-direction: column; align-items: center; justify-content: center; position: absolute; }
  .score-num { font-size: 28px; font-weight: 800; font-family: 'Space Mono', monospace; }
  .score-label { font-size: 10px; color: var(--muted); font-family: 'Space Mono', monospace; }
  .score-title { font-size: 18px; font-weight: 700; }
  .score-verdict { font-size: 12px; color: var(--muted); font-family: 'Space Mono', monospace; margin-top: 3px; }
  .ats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media(max-width:660px){.ats-grid{grid-template-columns:1fr}}
  .ats-card { background: var(--surface); border: 1px solid var(--border); border-radius: 13px; padding: 16px; animation: fadeUp 0.4s ease forwards; opacity: 0; }
  .ats-card:nth-child(1){animation-delay:.05s}.ats-card:nth-child(2){animation-delay:.1s}.ats-card:nth-child(3){animation-delay:.15s}.ats-card:nth-child(4){animation-delay:.2s}
  .ats-card-title { font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 11px; }
  .check-item { display: flex; align-items: flex-start; gap: 7px; margin-bottom: 6px; font-size: 12px; line-height: 1.5; }
  .keyword-grid { display: flex; flex-wrap: wrap; gap: 5px; }
  .kw-pill { font-size: 10px; font-family: 'Space Mono', monospace; padding: 2px 8px; border-radius: 4px; }
  .kw-found   { background: rgba(16,185,129,0.1); color: var(--accent3); border: 1px solid rgba(16,185,129,0.25); }
  .kw-missing { background: rgba(248,113,113,0.1); color: var(--danger);  border: 1px solid rgba(248,113,113,0.25); }
  .improve-item { font-size: 12px; color: var(--muted); padding: 6px 9px; border-left: 2px solid var(--accent2); margin-bottom: 5px; line-height: 1.5; }
  .divider { border: none; border-top: 1px solid var(--border); margin: 28px 0; }
  .error-box { background: rgba(248,113,113,0.08); border: 1px solid rgba(248,113,113,0.3); border-radius: 9px; padding: 12px; color: var(--danger); font-size: 12px; margin-top: 16px; }

  /* ── COMPANY GUIDE ── */
  .company-search-row { display: flex; gap: 9px; margin-bottom: 26px; }
  .company-search-input { flex: 1; background: var(--surface); border: 1px solid var(--border); border-radius: 9px; color: var(--text); font-family: 'Syne', sans-serif; font-size: 13px; padding: 11px 14px; outline: none; transition: border-color 0.2s; }
  .company-search-input:focus { border-color: var(--accent); }
  .company-search-btn { padding: 11px 20px; border-radius: 9px; border: none; background: linear-gradient(135deg, var(--accent), #0099bb); color: #000; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 800; cursor: pointer; transition: all 0.2s; white-space:nowrap; }
  .company-search-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .company-search-btn:not(:disabled):hover { transform: translateY(-1px); box-shadow: 0 5px 18px rgba(0,212,255,0.3); }
  .company-category { margin-bottom: 26px; }
  .cat-label { font-size: 10px; font-weight: 700; color: var(--muted); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 10px; font-family: 'Space Mono', monospace; display: flex; align-items: center; gap: 8px; }
  .cat-label::after { content:''; flex:1; height:1px; background: var(--border); }
  .company-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 9px; }
  .company-card { background: var(--surface); border: 1px solid var(--border); border-radius: 11px; padding: 14px 10px; text-align: center; cursor: pointer; transition: all 0.2s; display: flex; flex-direction: column; align-items: center; gap: 7px; }
  .company-card:hover { border-color: var(--accent); transform: translateY(-2px); background: var(--surface2); }
  .company-card.active { border-color: var(--accent); background: rgba(0,212,255,0.07); }
  .company-logo { font-size: 26px; line-height: 1; }
  .company-name { font-size: 12px; font-weight: 700; }
  .company-type { font-size: 9px; color: var(--muted); font-family: 'Space Mono', monospace; }
  .loader { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 20px; gap: 16px; }
  .loader-ring { width: 40px; height: 40px; border-radius: 50%; border: 3px solid var(--border); border-top-color: var(--accent); animation: spin 0.8s linear infinite; }
  @keyframes spin { to{transform:rotate(360deg)} }
  .loader-text { font-size: 12px; color: var(--muted); font-family: 'Space Mono', monospace; }

  /* COMPANY DETAIL */
  .company-detail { animation: fadeUp 0.4s ease forwards; }
  .company-detail-header { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 24px; background: var(--surface); border: 1px solid var(--border); border-radius: 13px; padding: 18px 20px; flex-wrap:wrap; }
  .company-detail-logo { font-size: 36px; flex-shrink:0; }
  .company-detail-info { flex:1; min-width:200px; }
  .company-detail-name { font-size: 22px; font-weight: 800; margin-bottom: 4px; }
  .company-detail-overview { font-size: 12px; color: var(--muted); line-height: 1.5; }
  .back-btn { background: var(--surface2); border: 1px solid var(--border); color: var(--muted); border-radius: 7px; padding: 7px 14px; cursor: pointer; font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 600; transition: all 0.15s; align-self:flex-start; }
  .back-btn:hover { color: var(--text); border-color: var(--accent); }

  .company-sections { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  @media(max-width:660px){.company-sections{grid-template-columns:1fr}}
  .full-width { grid-column: 1 / -1; }

  .cs-box { background: var(--surface); border: 1px solid var(--border); border-radius: 13px; padding: 18px; animation: fadeUp 0.4s ease forwards; opacity: 0; }
  .cs-box:nth-child(1){animation-delay:.05s}.cs-box:nth-child(2){animation-delay:.1s}.cs-box:nth-child(3){animation-delay:.15s}.cs-box:nth-child(4){animation-delay:.2s}.cs-box:nth-child(5){animation-delay:.25s}.cs-box:nth-child(6){animation-delay:.3s}
  .cs-title { font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 14px; display:flex; align-items:center; gap:6px; }

  .must-skill-item { display: flex; align-items: flex-start; gap: 9px; margin-bottom: 9px; padding: 10px 11px; background: var(--surface2); border-radius: 8px; border-left: 3px solid var(--accent); }
  .must-skill-content { flex: 1; min-width: 0; }
  .must-skill-name { font-size: 13px; font-weight: 700; margin-bottom: 2px; }
  .must-skill-why { font-size: 11px; color: var(--muted); line-height: 1.4; }
  .must-skill-level { font-size: 10px; font-family: 'Space Mono', monospace; padding: 2px 7px; border-radius: 10px; flex-shrink: 0; align-self: flex-start; margin-top: 1px; }
  .level-MUST  { background: rgba(248,113,113,0.15); color: var(--danger);  border: 1px solid rgba(248,113,113,0.3); }
  .level-GOOD  { background: rgba(251,191,36,0.15);  color: var(--warn);    border: 1px solid rgba(251,191,36,0.3); }
  .level-BONUS { background: rgba(16,185,129,0.15);  color: var(--accent3); border: 1px solid rgba(16,185,129,0.3); }

  .round-item { display: flex; gap: 11px; margin-bottom: 9px; align-items: flex-start; }
  .round-num { width: 22px; height: 22px; border-radius: 50%; background: rgba(0,212,255,0.1); border: 1px solid rgba(0,212,255,0.3); color: var(--accent); font-size: 10px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-family: 'Space Mono', monospace; margin-top:1px; }
  .round-name { font-size: 13px; font-weight: 700; margin-bottom: 2px; }
  .round-desc { font-size: 11px; color: var(--muted); line-height: 1.4; }
  .tip-item { font-size: 12px; color: var(--muted); padding: 6px 9px; border-left: 2px solid #a78bfa; margin-bottom: 5px; line-height: 1.5; }
  .tag-cloud { display: flex; flex-wrap: wrap; gap: 5px; }
  .tag-item { font-size: 11px; font-family: 'Space Mono', monospace; padding: 3px 8px; border-radius: 5px; background: rgba(124,58,237,0.1); color: #a78bfa; border: 1px solid rgba(124,58,237,0.25); }
  .salary-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--border); }
  .salary-row:last-child { border-bottom: none; }
  .salary-role { font-size: 12px; color: var(--muted); }
  .salary-amount { font-size: 13px; font-weight: 700; color: var(--accent3); font-family: 'Space Mono', monospace; }
  .note-text { font-size: 10px; color: var(--muted); margin-top: 7px; font-family: 'Space Mono', monospace; }

  /* ── ROADMAP PLANNER ── */
  .rm-form { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 24px; margin-bottom: 24px; }
  .rm-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
  @media(max-width:620px){ .rm-form-grid { grid-template-columns:1fr; } }
  .rm-select { background: var(--surface2); border: 1px solid var(--border); border-radius: 9px; color: var(--text); font-family: 'Syne', sans-serif; font-size: 13px; padding: 10px 14px; outline: none; transition: border-color 0.2s; width: 100%; cursor: pointer; }
  .rm-select:focus { border-color: var(--accent); }
  .rm-select option { background: #0e1520; }
  .month-pills { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 6px; }
  .month-pill { padding: 8px 18px; border-radius: 8px; border: 1px solid var(--border); background: var(--surface2); color: var(--muted); cursor: pointer; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 600; transition: all 0.15s; }
  .month-pill.active { background: rgba(0,212,255,0.12); border-color: var(--accent); color: var(--accent); }
  .month-pill:hover:not(.active) { border-color: var(--muted); color: var(--text); }
  .rm-header-bar { background: linear-gradient(135deg, rgba(0,212,255,0.08), rgba(124,58,237,0.08)); border: 1px solid var(--border); border-radius: 14px; padding: 20px 24px; margin-bottom: 28px; display: flex; align-items: center; gap: 16px; flex-wrap:wrap; }
  .rm-header-logo { font-size: 34px; }
  .rm-header-info { flex:1; }
  .rm-header-title { font-size: 20px; font-weight: 800; margin-bottom: 3px; }
  .rm-header-meta { font-size: 12px; color: var(--muted); font-family: 'Space Mono', monospace; }
  .rm-reset-btn { background: var(--surface2); border: 1px solid var(--border); color: var(--muted); border-radius: 7px; padding: 7px 14px; cursor: pointer; font-family:'Syne',sans-serif; font-size: 12px; font-weight: 600; transition: all 0.15s; }
  .rm-reset-btn:hover { color: var(--text); border-color: var(--accent); }
  .rm-overview-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px,1fr)); gap: 10px; margin-bottom: 28px; }
  .rm-stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 11px; padding: 14px 16px; text-align: center; }
  .rm-stat-num { font-size: 22px; font-weight: 800; font-family: 'Space Mono', monospace; color: var(--accent); }
  .rm-stat-label { font-size: 11px; color: var(--muted); margin-top: 3px; }
  .rm-phase { margin-bottom: 32px; }
  .rm-phase-header { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; padding: 12px 16px; border-radius: 10px; border: 1px solid var(--border); }
  .rm-phase-icon { font-size: 20px; }
  .rm-phase-name { font-size: 15px; font-weight: 800; }
  .rm-phase-range { font-size: 11px; color: var(--muted); font-family:'Space Mono',monospace; margin-left:auto; }
  .rm-weeks { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px,1fr)); gap: 12px; }
  .rm-week-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 16px; animation: fadeUp 0.4s ease forwards; opacity: 0; position: relative; overflow: hidden; }
  .rm-week-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background: var(--wc, var(--accent)); }
  .rm-week-label { font-size: 10px; font-weight:700; color: var(--muted); letter-spacing:1px; text-transform:uppercase; font-family:'Space Mono',monospace; margin-bottom:6px; }
  .rm-week-title { font-size: 14px; font-weight: 800; margin-bottom: 8px; }
  .rm-week-tasks { list-style: none; }
  .rm-week-tasks li { font-size: 12px; color: var(--muted); padding: 4px 0; border-bottom: 1px solid var(--border); display: flex; align-items: flex-start; gap: 7px; line-height: 1.4; }
  .rm-week-tasks li:last-child { border-bottom: none; }
  .rm-task-dot { width:5px; height:5px; border-radius:50%; background:var(--wc,var(--accent)); flex-shrink:0; margin-top:5px; }
  .rm-week-goal { margin-top: 10px; padding: 7px 10px; border-radius: 7px; background: rgba(0,212,255,0.06); border: 1px solid rgba(0,212,255,0.15); font-size: 11px; color: var(--accent); font-family:'Space Mono',monospace; }
  .rm-rounds { margin-top: 28px; }
  .rm-section-title { font-size: 16px; font-weight:800; margin-bottom: 14px; }
  .rm-section-title span { color: var(--accent); }
  .rm-round-strip { display: flex; align-items: flex-start; gap: 14px; padding: 14px 16px; background: var(--surface); border: 1px solid var(--border); border-radius: 11px; margin-bottom: 10px; animation: fadeUp 0.4s ease forwards; opacity:0; }
  .rm-round-strip:nth-child(1){animation-delay:.05s}.rm-round-strip:nth-child(2){animation-delay:.1s}.rm-round-strip:nth-child(3){animation-delay:.15s}.rm-round-strip:nth-child(4){animation-delay:.2s}.rm-round-strip:nth-child(5){animation-delay:.25s}
  .rm-round-num { width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:800; font-family:'Space Mono',monospace; flex-shrink:0; background:rgba(0,212,255,0.1); border:1px solid rgba(0,212,255,0.3); color:var(--accent); }
  .rm-round-name { font-size:13px; font-weight:800; margin-bottom:3px; }
  .rm-round-desc { font-size:12px; color:var(--muted); line-height:1.5; margin-bottom:6px; }
  .rm-round-tips { display:flex; flex-wrap:wrap; gap:5px; }
  .rm-round-tip { font-size:10px; font-family:'Space Mono',monospace; padding:2px 8px; border-radius:4px; background:rgba(124,58,237,0.1); color:#a78bfa; border:1px solid rgba(124,58,237,0.2); }
  .rm-daily-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(180px,1fr)); gap:10px; margin-top:14px; }
  .rm-daily-card { background: var(--surface); border:1px solid var(--border); border-radius:11px; padding:14px; animation: fadeUp 0.4s ease forwards; opacity:0; }
  .rm-daily-card:nth-child(1){animation-delay:.05s}.rm-daily-card:nth-child(2){animation-delay:.1s}.rm-daily-card:nth-child(3){animation-delay:.15s}.rm-daily-card:nth-child(4){animation-delay:.2s}.rm-daily-card:nth-child(5){animation-delay:.25s}.rm-daily-card:nth-child(6){animation-delay:.3s}.rm-daily-card:nth-child(7){animation-delay:.35s}
  .rm-daily-day { font-size:11px; font-weight:700; color:var(--muted); letter-spacing:1px; text-transform:uppercase; font-family:'Space Mono',monospace; margin-bottom:5px; }
  .rm-daily-focus { font-size:13px; font-weight:700; margin-bottom:4px; }
  .rm-daily-hours { font-size:10px; color:var(--accent); font-family:'Space Mono',monospace; }
  .rm-divider { border:none; border-top:1px solid var(--border); margin:28px 0; }
`;

const COMPANIES = {
  "Indian IT Giants": [
    { name:"TCS",          logo:"🔵", type:"IT Services"  },
    { name:"Infosys",      logo:"🟦", type:"IT Services"  },
    { name:"Wipro",        logo:"⚙️",  type:"IT Services"  },
    { name:"HCL Tech",     logo:"🟩", type:"IT Services"  },
    { name:"Tech Mahindra",logo:"🌐", type:"IT Services"  },
    { name:"Cognizant",    logo:"🔷", type:"IT Services"  },
  ],
  "Product Companies": [
    { name:"Zoho",         logo:"🟠", type:"SaaS Product" },
    { name:"Freshworks",   logo:"🌿", type:"SaaS Product" },
    { name:"Chargebee",    logo:"⚡", type:"SaaS Product" },
    { name:"Razorpay",     logo:"💙", type:"Fintech"      },
    { name:"CRED",         logo:"🖤", type:"Fintech"      },
    { name:"Zepto",        logo:"🟡", type:"Q-Commerce"   },
  ],
  "MNCs & Big Tech": [
    { name:"Accenture",    logo:"🔺", type:"Consulting"   },
    { name:"Capgemini",    logo:"🌊", type:"Consulting"   },
    { name:"Deloitte",     logo:"🟢", type:"Consulting"   },
    { name:"IBM",          logo:"🔵", type:"Tech MNC"     },
    { name:"Microsoft",    logo:"🪟", type:"Big Tech"     },
    { name:"Amazon",       logo:"📦", type:"Big Tech"     },
    { name:"Google",       logo:"🎨", type:"Big Tech"     },
    { name:"Samsung R&D",  logo:"📱", type:"Consumer Tech"},
  ],
  "Startups & Unicorns": [
    { name:"PhonePe",      logo:"💜", type:"Fintech"      },
    { name:"Swiggy",       logo:"🍊", type:"FoodTech"     },
    { name:"Ola",          logo:"🟡", type:"Mobility"     },
    { name:"Paytm",        logo:"💙", type:"Fintech"      },
    { name:"Meesho",       logo:"🛍️",  type:"E-Commerce"   },
    { name:"BYJU'S",       logo:"🎓", type:"EdTech"       },
  ],
};

const POPULAR_SKILLS = ["Python","JavaScript","React","Machine Learning","SQL","Java","Node.js","AWS","Docker","Data Analysis","TensorFlow","Excel","Figma","C++","NLP","Cybersecurity","Django","MongoDB","Flutter","Kubernetes"];

async function callClaude(messages, sys, maxTokens=2000) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST", headers:{"Content-Type":"application/json"},
    body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:maxTokens, system:sys, messages }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API error ${res.status}: ${err}`);
  }
  const d = await res.json();
  if (d.error) throw new Error(d.error.message || "API returned error");
  return d.content.map(b => b.text||"").join("");
}
function parseJSON(raw) {
  // strip markdown fences
  let clean = raw.replace(/```json\s*/gi,"").replace(/```\s*/gi,"").trim();
  // extract first {...} block if there's surrounding text
  const match = clean.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
  if (match) clean = match[0];
  return JSON.parse(clean);
}
function MiniSpinner() {
  return <span style={{width:17,height:17,border:"2px solid rgba(0,0,0,0.2)",borderTopColor:"#000",borderRadius:"50%",display:"inline-block",animation:"spin 0.8s linear infinite",flexShrink:0}} />;
}

// ─── SKILL MATCHER ───────────────────────────────────────────────────────────
function SkillMatcher() {
  const [skills, setSkills] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  const addSkill = s => { const t=s.trim(); if(t&&!skills.includes(t)) setSkills(p=>[...p,t]); setInput(""); };
  const handleKey = e => {
    if((e.key==="Enter"||e.key===",")&&input.trim()){e.preventDefault();addSkill(input);}
    if(e.key==="Backspace"&&!input&&skills.length) setSkills(p=>p.slice(0,-1));
  };
  const analyze = async () => {
    setLoading(true); setError(""); setResults(null);
    try {
      const sys = `Career placement expert. Given student skills, return JSON array of exactly 4 roles: [{ "role":string, "match":number 0-100, "description":string 1-2 sentences, "matchedSkills":string[], "missingSkills":string[], "learningPath":string[] 3-4 steps }]. ONLY valid JSON.`;
      const raw = await callClaude([{role:"user",content:`Skills: ${skills.join(", ")}`}], sys);
      setResults(parseJSON(raw));
    } catch(e){setError("Analysis failed. Try again.");}
    setLoading(false);
  };
  const mc = m => m>=70?"match-high":m>=40?"match-mid":"match-low";
  const ml = m => m>=70?"Strong":m>=40?"Partial":"Needs Work";

  return (
    <div>
      <div className="section-title">Find Your <span>Perfect Role</span></div>
      <div className="section-sub">// Enter your skills → matched roles + learning paths</div>
      <div className="skill-input-label">Your Skills</div>
      <div className="skill-tags-box">
        {skills.map(s=>(
          <span key={s} className="skill-tag">{s}<button onClick={()=>setSkills(p=>p.filter(x=>x!==s))}>×</button></span>
        ))}
        <input className="skill-input" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={handleKey} onBlur={()=>input.trim()&&addSkill(input)} placeholder={skills.length?"Add more…":"Type a skill and press Enter…"} />
      </div>
      <div className="popular-label">// quick add popular skills</div>
      <div className="popular-chips">
        {POPULAR_SKILLS.filter(s=>!skills.includes(s)).map(s=>(
          <button key={s} className="popular-chip" onClick={()=>addSkill(s)}>{s}</button>
        ))}
      </div>
      <button className="analyze-btn" disabled={!skills.length||loading} onClick={analyze}>
        {loading?<><MiniSpinner />Analyzing…</>:"⚡ Analyze My Skills"}
      </button>
      {error&&<div className="error-box">{error}</div>}
      {results&&(
        <div className="results">
          <div className="section-title" style={{fontSize:22,marginBottom:6}}>Matched <span>Roles</span></div>
          <div className="results-grid">
            {results.map((r,i)=>(
              <div key={i} className="role-card">
                <div className="role-header"><div className="role-name">{r.role}</div><span className={`match-badge ${mc(r.match)}`}>{r.match}% · {ml(r.match)}</span></div>
                <div className="role-desc">{r.description}</div>
                {r.matchedSkills?.length>0&&<div className="skills-section"><div className="skills-label">✓ Have</div><div className="skills-list">{r.matchedSkills.map(s=><span key={s} className="skill-pill have">{s}</span>)}</div></div>}
                {r.missingSkills?.length>0&&<div className="skills-section"><div className="skills-label">✗ Learn</div><div className="skills-list">{r.missingSkills.map(s=><span key={s} className="skill-pill need">{s}</span>)}</div></div>}
                {r.learningPath?.length>0&&<div className="learn-section"><div className="learn-label">🗺 Path</div>{r.learningPath.map((s,j)=><div key={j} className="learn-item">{s}</div>)}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ATS TRACKER ─────────────────────────────────────────────────────────────
function ATSTracker() {
  const [file, setFile] = useState(null);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [drag, setDrag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const inputRef = useRef();

  const handleFile = f => { if(f){setFile(f);setResults(null);} };
  const onDrop = e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); };
  const analyze = async () => {
    setLoading(true); setError(""); setResults(null);
    try {
      const text = await new Promise((res,rej)=>{ const r=new FileReader(); r.onload=e=>res(e.target.result); r.onerror=rej; r.readAsText(file); });
      const sys = `ATS analyzer expert. Return JSON: { "score":number 0-100, "verdict":string, "strengths":string[] 3-4, "weaknesses":string[] 3-4, "keywordsFound":string[] up to 8, "keywordsMissing":string[] up to 6, "improvements":string[] 4-5, "formattingIssues":string[] up to 4 }. ONLY valid JSON.`;
      const raw = await callClaude([{role:"user",content:`Resume:\n${text.slice(0,3000)}\nJob: ${jobTitle||"General"}\nJD: ${jobDesc||"None"}`}], sys);
      setResults(parseJSON(raw));
    } catch(e){setError("Analysis failed. Try a text-based PDF or TXT.");}
    setLoading(false);
  };
  const scoreColor = results?(results.score>=75?"var(--accent3)":results.score>=50?"var(--warn)":"var(--danger)"):"var(--accent)";

  return (
    <div>
      <div className="section-title">ATS <span>Resume Scanner</span></div>
      <div className="section-sub">// Upload resume → instant ATS compatibility score</div>
      <div className={`upload-zone ${drag?"drag":""}`} onClick={()=>inputRef.current.click()} onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)} onDrop={onDrop}>
        <input ref={inputRef} type="file" className="upload-input" accept=".pdf,.txt,.docx" onChange={e=>handleFile(e.target.files[0])} />
        <div className="upload-icon">📄</div>
        <div className="upload-title">Drop your resume here</div>
        <div className="upload-hint">// PDF · DOCX · TXT &nbsp;·&nbsp; click or drag</div>
      </div>
      {file&&(
        <div className="file-selected">
          <span style={{fontSize:20}}>📋</span>
          <div><div className="file-name">{file.name}</div><div className="file-size">{(file.size/1024).toFixed(1)} KB</div></div>
          <button className="file-remove" onClick={()=>{setFile(null);setResults(null);}}>×</button>
        </div>
      )}
      <div className="job-input-row">
        <div className="field-group"><label className="field-label">Target Job Title</label><input className="field-input" placeholder="e.g. Data Scientist, Frontend Developer…" value={jobTitle} onChange={e=>setJobTitle(e.target.value)} /></div>
        <div className="field-group"><label className="field-label">Job Description (optional)</label><textarea className="field-textarea" placeholder="Paste job description for better accuracy…" value={jobDesc} onChange={e=>setJobDesc(e.target.value)} /></div>
      </div>
      <button className="analyze-btn" style={{marginTop:16}} disabled={!file||loading} onClick={analyze}>
        {loading?<><MiniSpinner />Scanning…</>:"🔍 Run ATS Analysis"}
      </button>
      {error&&<div className="error-box">{error}</div>}
      {results&&(
        <div className="results">
          <hr className="divider" />
          <div className="ats-score-ring">
            <div className="score-circle" style={{"--pct":`${results.score}%`}}>
              <div className="score-inner"><div className="score-num" style={{color:scoreColor}}>{results.score}</div><div className="score-label">/ 100</div></div>
            </div>
            <div className="score-title">ATS Score</div>
            <div className="score-verdict">{results.verdict}</div>
          </div>
          <div className="ats-grid">
            <div className="ats-card"><div className="ats-card-title" style={{color:"var(--accent3)"}}>✅ Strengths</div>{results.strengths?.map((s,i)=><div key={i} className="check-item"><span style={{color:"var(--accent3)"}}>◆</span>{s}</div>)}</div>
            <div className="ats-card"><div className="ats-card-title" style={{color:"var(--danger)"}}>⚠ Weaknesses</div>{results.weaknesses?.map((s,i)=><div key={i} className="check-item"><span style={{color:"var(--danger)"}}>◆</span>{s}</div>)}</div>
            <div className="ats-card"><div className="ats-card-title" style={{color:"var(--accent)"}}>🔑 Keywords</div><div className="keyword-grid">{results.keywordsFound?.map(k=><span key={k} className="kw-pill kw-found">{k}</span>)}{results.keywordsMissing?.map(k=><span key={k} className="kw-pill kw-missing">✗ {k}</span>)}</div></div>
            <div className="ats-card"><div className="ats-card-title" style={{color:"#a78bfa"}}>🚀 Improvements</div>{results.improvements?.map((s,i)=><div key={i} className="improve-item">{s}</div>)}</div>
          </div>
          {results.formattingIssues?.length>0&&<div className="ats-card" style={{marginTop:14}}><div className="ats-card-title" style={{color:"var(--warn)"}}>📐 Formatting Issues</div>{results.formattingIssues.map((s,i)=><div key={i} className="check-item"><span style={{color:"var(--warn)"}}>▸</span>{s}</div>)}</div>}
        </div>
      )}
    </div>
  );
}

// ─── COMPANY GUIDE ────────────────────────────────────────────────────────────
function CompanyGuide() {
  const [selected, setSelected] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchCompany = async company => {
    setSelected(company); setData(null); setLoading(true); setError("");
    try {
      const sys = `You are a tech company placement expert. Return ONLY a raw JSON object (no markdown, no explanation) for the given company with exactly these keys:
"overview" (string, 2 sentences on hiring culture),
"mustLearnSkills" (array of objects with "name" string, "why" string, "level" string one of MUST or GOOD or BONUS),
"interviewRounds" (array of objects with "round" string and "description" string),
"topicsToStudy" (array of strings),
"insiderTips" (array of strings),
"salaryRanges" (array of objects with "role" string and "ctc" string in Indian LPA),
"culture" (array of 4 keyword strings).
Sizes: mustLearnSkills 6-8, interviewRounds 4-6, topicsToStudy 8-10, insiderTips 4-5, salaryRanges 3-4.
Output ONLY the JSON object starting with { and ending with }. No other text.`;
      const raw = await callClaude([{role:"user",content:`Give me placement preparation guide for: ${company.name}`}], sys);
      const parsed = parseJSON(raw);
      setData(parsed);
    } catch(e){
      console.error("Company fetch error:", e);
      setError(`Failed to load data for ${company.name}. ${e.message || "Please try again."}`);
    }
    setLoading(false);
  };

  const handleSearch = () => {
    if(!search.trim()) return;
    fetchCompany({name:search.trim(),logo:"🏢",type:"Company"});
    setSearch("");
  };

  return (
    <div>
      <div className="section-title">Company <span>Guide</span></div>
      <div className="section-sub">// Click any company → must-learn skills, interview rounds & insider tips</div>

      <div className="company-search-row">
        <input className="company-search-input" placeholder="🔍  Search any company — e.g. Flipkart, Juspay, Oracle…"
          value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSearch()} />
        <button className="company-search-btn" disabled={!search.trim()||loading} onClick={handleSearch}>Search</button>
      </div>

      {/* company grid — hide when showing results */}
      {!data&&!loading&&(
        Object.entries(COMPANIES).map(([cat,companies])=>(
          <div key={cat} className="company-category">
            <div className="cat-label">{cat}</div>
            <div className="company-grid">
              {companies.map(c=>(
                <div key={c.name} className={`company-card ${selected?.name===c.name?"active":""}`} onClick={()=>fetchCompany(c)}>
                  <div className="company-logo">{c.logo}</div>
                  <div className="company-name">{c.name}</div>
                  <div className="company-type">{c.type}</div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {loading&&(
        <div className="loader">
          <div className="loader-ring" />
          <div className="loader-text">// Loading {selected?.name} placement guide…</div>
        </div>
      )}

      {error&&<div className="error-box">{error}</div>}

      {data&&!loading&&(
        <div className="company-detail">
          {/* Header */}
          <div className="company-detail-header">
            <div className="company-detail-logo">{selected?.logo}</div>
            <div className="company-detail-info">
              <div className="company-detail-name">{selected?.name} <span style={{fontSize:13,fontWeight:600,color:"var(--muted)",fontFamily:"Space Mono,monospace"}}>· {selected?.type}</span></div>
              <div className="company-detail-overview">{data.overview}</div>
              {data.culture?.length>0&&(
                <div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:8}}>
                  {data.culture.map((c,i)=><span key={i} style={{fontSize:10,background:"rgba(0,212,255,0.08)",border:"1px solid rgba(0,212,255,0.2)",color:"var(--accent)",borderRadius:20,padding:"2px 9px",fontFamily:"Space Mono,monospace"}}>{c}</span>)}
                </div>
              )}
            </div>
            <button className="back-btn" onClick={()=>{setData(null);setSelected(null);}}>← All Companies</button>
          </div>

          <div className="company-sections">

            {/* Must-Learn Skills — full width */}
            <div className="cs-box full-width">
              <div className="cs-title" style={{color:"var(--accent)"}}>⚡ Must-Learn Skills for {selected?.name}</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:9}}>
                {data.mustLearnSkills?.map((s,i)=>(
                  <div key={i} className="must-skill-item">
                    <div className="must-skill-content">
                      <div className="must-skill-name">{s.name}</div>
                      <div className="must-skill-why">{s.why}</div>
                    </div>
                    <span className={`must-skill-level level-${s.level}`}>{s.level}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interview Rounds */}
            <div className="cs-box">
              <div className="cs-title" style={{color:"var(--warn)"}}>🎯 Interview Rounds</div>
              {data.interviewRounds?.map((r,i)=>(
                <div key={i} className="round-item">
                  <div className="round-num">{i+1}</div>
                  <div><div className="round-name">{r.round}</div><div className="round-desc">{r.description}</div></div>
                </div>
              ))}
            </div>

            {/* Topics to Study */}
            <div className="cs-box">
              <div className="cs-title" style={{color:"#a78bfa"}}>📚 Topics to Study</div>
              <div className="tag-cloud">
                {data.topicsToStudy?.map((t,i)=><span key={i} className="tag-item">{t}</span>)}
              </div>
            </div>

            {/* Insider Tips */}
            <div className="cs-box">
              <div className="cs-title" style={{color:"var(--accent3)"}}>💡 Insider Tips</div>
              {data.insiderTips?.map((t,i)=><div key={i} className="tip-item">{t}</div>)}
            </div>

            {/* Salary Ranges */}
            <div className="cs-box">
              <div className="cs-title" style={{color:"var(--accent3)"}}>💰 Salary Ranges (India)</div>
              {data.salaryRanges?.map((s,i)=>(
                <div key={i} className="salary-row">
                  <span className="salary-role">{s.role}</span>
                  <span className="salary-amount">{s.ctc}</span>
                </div>
              ))}
              <div className="note-text">// Approximate · varies by experience & year</div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

// ─── ROADMAP PLANNER ─────────────────────────────────────────────────────────
const ALL_COMPANIES = [
  "Zoho","TCS","Infosys","Wipro","HCL Tech","Tech Mahindra","Cognizant",
  "Freshworks","Chargebee","Razorpay","CRED","Zepto","Accenture","Capgemini",
  "Deloitte","IBM","Microsoft","Amazon","Google","Samsung R&D",
  "PhonePe","Swiggy","Ola","Paytm","Meesho","BYJU'S","Flipkart","Oracle",
];
const COMPANY_LOGOS = {
  "Zoho":"🟠","TCS":"🔵","Infosys":"🟦","Wipro":"⚙️","HCL Tech":"🟩",
  "Tech Mahindra":"🌐","Cognizant":"🔷","Freshworks":"🌿","Chargebee":"⚡",
  "Razorpay":"💙","CRED":"🖤","Zepto":"🟡","Accenture":"🔺","Capgemini":"🌊",
  "Deloitte":"🟢","IBM":"🔵","Microsoft":"🪟","Amazon":"📦","Google":"🎨",
  "Samsung R&D":"📱","PhonePe":"💜","Swiggy":"🍊","Ola":"🟡","Paytm":"💙",
  "Meesho":"🛍️","BYJU'S":"🎓","Flipkart":"🛒","Oracle":"🔴",
};
const PHASE_COLORS = ["#00d4ff","#7c3aed","#10b981","#fbbf24","#f87171","#a78bfa"];

function RoadmapPlanner() {
  const [company, setCompany]   = useState("");
  const [customCo, setCustomCo] = useState("");
  const [months, setMonths]     = useState(2);
  const [mySkills, setMySkills] = useState("");
  const [loading, setLoading]   = useState(false);
  const [roadmap, setRoadmap]   = useState(null);
  const [error, setError]       = useState("");

  const targetCompany = company === "__custom__" ? customCo : company;

  const generate = async () => {
    if (!targetCompany) return;
    setLoading(true); setError(""); setRoadmap(null);
    try {
      const weeks = months * 4;
      const sys = `You are a placement coach. Return ONLY a raw JSON object (no markdown, starting with { ending with }). Be concise — keep string values short (under 15 words each). JSON structure:
{
  "summary": string,
  "totalWeeks": number,
  "totalHours": number,
  "dailyHours": number,
  "phases": [{ "name": string, "icon": string, "color": string (pick from #00d4ff #7c3aed #10b981 #fbbf24), "weekRange": string, "weeks": [{ "week": number, "title": string, "tasks": string[] (4 items max), "weeklyGoal": string }] }],
  "interviewRounds": [{ "round": string, "description": string, "howToPrepare": string, "keyTopics": string[] (3 items) }],
  "dailySchedule": [{ "day": string, "focus": string, "hours": string }],
  "finalWeekPlan": string[] (5 items),
  "doNotForget": string[] (4 items)
}
Rules: phases must cover ALL ${weeks} weeks with NO gaps. dailySchedule = 7 items Mon-Sun. interviewRounds = actual rounds for this company. Keep ALL string values SHORT (under 15 words). Output raw JSON only.`;

      const prompt = `Company: ${targetCompany}, Months: ${months} (${weeks} weeks), Current skills: ${mySkills||"beginner"}`;
      const raw = await callClaude([{role:"user", content: prompt}], sys, 4000);
      const parsed = parseJSON(raw);
      setRoadmap(parsed);
    } catch(e) {
      console.error(e);
      setError(`Failed to generate roadmap: ${e.message || "Please try again."}`);
    }
    setLoading(false);
  };

  if (roadmap) {
    const logo = COMPANY_LOGOS[targetCompany] || "🏢";
    return (
      <div>
        {/* Header bar */}
        <div className="rm-header-bar">
          <div className="rm-header-logo">{logo}</div>
          <div className="rm-header-info">
            <div className="rm-header-title">🗺️ Roadmap to crack <span style={{color:"var(--accent)"}}>{targetCompany}</span></div>
            <div className="rm-header-meta">{months} month{months>1?"s":""} · {roadmap.totalWeeks} weeks · ~{roadmap.dailyHours}hrs/day · ~{roadmap.totalHours} total hours</div>
            <div style={{fontSize:12,color:"var(--muted)",marginTop:4,lineHeight:1.5}}>{roadmap.summary}</div>
          </div>
          <button className="rm-reset-btn" onClick={()=>setRoadmap(null)}>← New Plan</button>
        </div>

        {/* Overview stats */}
        <div className="rm-overview-grid">
          {[
            {num: `${months}mo`, label:"Time Available"},
            {num: roadmap.totalWeeks, label:"Total Weeks"},
            {num: `${roadmap.dailyHours}h`, label:"Daily Hours"},
            {num: roadmap.totalHours, label:"Total Hours"},
            {num: roadmap.interviewRounds?.length, label:"Interview Rounds"},
            {num: roadmap.phases?.length, label:"Study Phases"},
          ].map((s,i)=>(
            <div key={i} className="rm-stat-card">
              <div className="rm-stat-num">{s.num}</div>
              <div className="rm-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Phase + Week breakdown */}
        {roadmap.phases?.map((phase, pi) => {
          const color = phase.color || PHASE_COLORS[pi % PHASE_COLORS.length];
          return (
            <div key={pi} className="rm-phase">
              <div className="rm-phase-header" style={{background:`${color}10`, borderColor:`${color}30`}}>
                <span className="rm-phase-icon">{phase.icon}</span>
                <span className="rm-phase-name" style={{color}}>{phase.name}</span>
                <span className="rm-phase-range">{phase.weekRange}</span>
              </div>
              <div className="rm-weeks">
                {phase.weeks?.map((w, wi) => (
                  <div key={wi} className="rm-week-card" style={{"--wc": color, animationDelay:`${wi*0.07}s`}}>
                    <div className="rm-week-label">Week {w.week}</div>
                    <div className="rm-week-title">{w.title}</div>
                    <ul className="rm-week-tasks">
                      {w.tasks?.map((t,ti)=>(
                        <li key={ti}><span className="rm-task-dot" />{t}</li>
                      ))}
                    </ul>
                    {w.weeklyGoal && <div className="rm-week-goal">🎯 {w.weeklyGoal}</div>}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <hr className="rm-divider" />

        {/* Interview Rounds */}
        <div className="rm-rounds">
          <div className="rm-section-title">🎯 How to Clear Every <span>Interview Round</span></div>
          {roadmap.interviewRounds?.map((r, i) => (
            <div key={i} className="rm-round-strip">
              <div className="rm-round-num">{i+1}</div>
              <div style={{flex:1}}>
                <div className="rm-round-name">{r.round}</div>
                <div className="rm-round-desc">{r.description}</div>
                <div style={{fontSize:12,color:"var(--accent3)",marginBottom:6,fontStyle:"italic"}}>{r.howToPrepare}</div>
                <div className="rm-round-tips">
                  {r.keyTopics?.map((t,ti)=><span key={ti} className="rm-round-tip">{t}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>

        <hr className="rm-divider" />

        {/* Daily Schedule */}
        <div className="rm-section-title">📅 Recommended <span style={{color:"var(--warn)"}}>Daily Schedule</span></div>
        <div className="rm-daily-grid">
          {roadmap.dailySchedule?.map((d,i)=>(
            <div key={i} className="rm-daily-card">
              <div className="rm-daily-day">{d.day}</div>
              <div className="rm-daily-focus">{d.focus}</div>
              <div className="rm-daily-hours">⏱ {d.hours}</div>
            </div>
          ))}
        </div>

        <hr className="rm-divider" />

        {/* Final week + Do not forget */}
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:14}}>
          {roadmap.finalWeekPlan?.length>0 && (
            <div className="cs-box">
              <div className="cs-title" style={{color:"var(--accent3)"}}>🏁 Final Week Before Interview</div>
              {roadmap.finalWeekPlan.map((t,i)=>(
                <div key={i} style={{fontSize:12,color:"var(--muted)",padding:"5px 0",borderBottom:"1px solid var(--border)",display:"flex",gap:7,alignItems:"flex-start",lineHeight:1.4}}>
                  <span style={{color:"var(--accent3)",flexShrink:0}}>✓</span>{t}
                </div>
              ))}
            </div>
          )}
          {roadmap.doNotForget?.length>0 && (
            <div className="cs-box">
              <div className="cs-title" style={{color:"var(--danger)"}}>⚠️ Common Mistakes to Avoid</div>
              {roadmap.doNotForget.map((t,i)=>(
                <div key={i} style={{fontSize:12,color:"var(--muted)",padding:"5px 0",borderBottom:"1px solid var(--border)",display:"flex",gap:7,alignItems:"flex-start",lineHeight:1.4}}>
                  <span style={{color:"var(--danger)",flexShrink:0}}>✗</span>{t}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="section-title">Placement <span>Roadmap</span></div>
      <div className="section-sub">// Pick company + months → get a complete week-by-week battle plan</div>

      <div className="rm-form">
        <div className="rm-form-grid">
          {/* Company picker */}
          <div className="field-group">
            <label className="field-label">🎯 Target Company</label>
            <select className="rm-select" value={company} onChange={e=>setCompany(e.target.value)}>
              <option value="">— Select a company —</option>
              {ALL_COMPANIES.map(c=><option key={c} value={c}>{COMPANY_LOGOS[c]||"🏢"} {c}</option>)}
              <option value="__custom__">✏️ Other company…</option>
            </select>
            {company === "__custom__" && (
              <input className="field-input" style={{marginTop:8}} placeholder="Type company name…"
                value={customCo} onChange={e=>setCustomCo(e.target.value)} />
            )}
          </div>

          {/* Current skills */}
          <div className="field-group">
            <label className="field-label">💡 Your Current Skills (optional)</label>
            <input className="field-input" placeholder="e.g. Python basics, some DSA, C++ fundamentals…"
              value={mySkills} onChange={e=>setMySkills(e.target.value)} />
          </div>
        </div>

        {/* Month selector */}
        <div className="field-group">
          <label className="field-label">⏳ How Many Months Do You Have?</label>
          <div className="month-pills">
            {[1,2,3,4,5,6].map(m=>(
              <button key={m} className={`month-pill ${months===m?"active":""}`} onClick={()=>setMonths(m)}>
                {m} {m===1?"Month":"Months"}
              </button>
            ))}
          </div>
        </div>

        {/* Generate */}
        <button className="analyze-btn" style={{marginTop:20}} disabled={!targetCompany || loading} onClick={generate}>
          {loading ? <><MiniSpinner /> Generating your {targetCompany} roadmap…</> : `🗺️ Generate ${targetCompany||"Company"} Roadmap for ${months} Month${months>1?"s":""}`}
        </button>
      </div>

      {error && <div className="error-box">{error}</div>}

      {loading && (
        <div className="loader">
          <div className="loader-ring" />
          <div className="loader-text">// Building your personalised {months}-month battle plan for {targetCompany}…</div>
        </div>
      )}

      {/* Quick pick popular companies */}
      {!loading && (
        <div>
          <div className="cat-label" style={{marginBottom:12}}>Quick pick</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {["Zoho","TCS","Accenture","Infosys","Google","Amazon","Microsoft","Freshworks","Razorpay","Wipro","Cognizant","Flipkart"].map(c=>(
              <button key={c} onClick={()=>setCompany(c)}
                style={{padding:"7px 14px",borderRadius:8,border:`1px solid ${company===c?"var(--accent)":"var(--border)"}`,
                  background:company===c?"rgba(0,212,255,0.1)":"var(--surface2)",
                  color:company===c?"var(--accent)":"var(--muted)",
                  cursor:"pointer",fontFamily:"'Syne',sans-serif",fontSize:12,fontWeight:600,transition:"all 0.15s"}}>
                {COMPANY_LOGOS[c]||"🏢"} {c}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("skills");
  return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        <header className="header">
          <div className="logo">
            <div className="logo-icon">🎯</div>
            <div className="logo-text">Placement<span>AI</span></div>
          </div>
          <div className="nav-tabs">
            <button className={`nav-tab ${tab==="skills"?"active":""}`} onClick={()=>setTab("skills")}>⚡ Skill Matcher</button>
            <button className={`nav-tab ${tab==="ats"?"active":""}`} onClick={()=>setTab("ats")}>📄 ATS Scanner</button>
            <button className={`nav-tab ${tab==="company"?"active":""}`} onClick={()=>setTab("company")}>🏢 Company Guide</button>
            <button className={`nav-tab ${tab==="roadmap"?"active":""}`} onClick={()=>setTab("roadmap")}>🗺️ Roadmap</button>
          </div>
        </header>
        <main className="main">
          {tab==="skills" && <SkillMatcher />}
          {tab==="ats"    && <ATSTracker />}
          {tab==="company"&& <CompanyGuide />}
          {tab==="roadmap"&& <RoadmapPlanner />}
        </main>
      </div>
    </>
  );
}