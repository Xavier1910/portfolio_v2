import { useState, useCallback, useRef } from "react";
import { motion, useInView } from 'framer-motion';
const COMMITS = [
  { id:"init", type:"init", date:"Apr 2025", hash:"b3e1a00", branch:"main", title:"Junior Developer @ Ewall", desc:"Set up local dev environment, codebase orientation, and module scaffolding. Established coding conventions across PHP, RequireJS, and Magento DI.", stack:["Magento 2","PHP","MySQL","Linux CLI"] },
  { id:"rma", type:"feat", date:"Apr 2025", hash:"c7f2d14", branch:"feat/rma", title:"RMA Module", desc:"Built RMA module end-to-end: service contracts, repository pattern, ACL permissions, admin grid, observer hooks, and full return lifecycle.", stack:["PHP","Magento 2","EAV","UI Components"], branchFrom:"init", mergesTo:"odoosync" },
  { id:"helpdesk", type:"feat", date:"May 2025", hash:"e9a3f27", branch:"feat/helpdesk", title:"Helpdesk System", desc:"Dependency-driven dropdowns via switcherConfig. SLA pause/mark-met logic. Agent performance reports. Paginated, sortable, searchable ticket list.", stack:["PHP","Magento 2","RequireJS","JavaScript","UI Components"], branchFrom:"init", mergesTo:"odoosync" },
  { id:"odoosync", type:"merge", date:"Jun 2025", hash:"a2d5e81", branch:"main", title:"Odoo ERP Sync", desc:"Preview-and-confirm order push to Odoo. Button injected via beforeSetLayout plugin — zero core modification. Full order payload mapping.", stack:["PHP","Magento 2","Odoo REST API","Admin UI"] },
  { id:"adminlens", type:"feat", date:"May 2025", hash:"f1b8c39", branch:"feat/adminlens", title:"AdminLens", desc:"Keyboard-driven command palette. Slide-out panels for Products, Orders, Customers. /compare, /flush commands. Macro builder. 8-theme CSS design system.", stack:["PHP","RequireJS/AMD","CSS Custom Properties","SQL","EAV","MSI"], branchFrom:"init", mergesTo:"odoosync" },
  { id:"erp", type:"feat", date:"Jun 2025", hash:"d4c9b52", branch:"main", title:"Custom ERP Suite", desc:"Ewall_StockAdjustment with full audit trail. AJAX tab switching. Sales history averaging with bundle child handling.", stack:["PHP","Magento 2","UI Components","AJAX","EAV","MySQL"] },
  { id:"megaparts", type:"feat", date:"Aug 2025", hash:"3b8a1d9", branch:"main", title:"Mobile Navigation Drawer", desc:"Bottom-sheet navigation with slide animations and multi-panel traversal. Recursive category tree building.", stack:["Alpine.js","Magento 2","PHP","CSS"] },
  { id:"perf", type:"perf", date:"Jul 2025", hash:"7e1f2c3", branch:"main", title:"Storefront Performance", desc:"GTM deferral + Alpine.js defer rules. CLS elimination via aspect-ratio CSS. GA4/GTM event fixes. Lighthouse 53 → 95.", stack:["Hyvä","Alpine.js","Tailwind CSS","GTM","GA4","CSP"] },
  { id:"head", type:"head", date:"Present", hash:"HEAD", branch:"main", title:"Active Development", desc:"Ongoing work across multiple Magento 2 projects.", stack:[] },
];

const NC = { init:"#58a6ff", feat:"#3fb950", merge:"#bc8cff", perf:"#e3b341", head:"#58a6ff" };
const COL_MAIN = 42, FEAT_COLS = [108,158,208], ROW_H =220, PAD_TOP = 28, SVG_W = 260;

function computeLayout() {
  const L = {}; let row = 0;
  const mains = COMMITS.filter(c => !c.branchFrom), feats = COMMITS.filter(c => c.branchFrom);
  const slots = [null, null, null];
  mains.forEach((mc, mi) => {
    L[mc.id] = { x: COL_MAIN, y: PAD_TOP + row * ROW_H }; row++;
    feats.filter(f => f.branchFrom === mc.id).forEach(fc => {
      let s = slots.findIndex(x => x === null); if (s < 0) s = 0;
      slots[s] = fc.id; L[fc.id] = { x: FEAT_COLS[s], y: PAD_TOP + row * ROW_H }; row++;
    });
    const nxt = mains[mi + 1];
    if (nxt) feats.forEach(fc => { if (fc.mergesTo === nxt.id) { const s = slots.indexOf(fc.id); if (s >= 0) slots[s] = null; } });
  });
  return L;
}

const LAYOUT = computeLayout();
const TOTAL_H = Math.max(...Object.values(LAYOUT).map(l => l.y)) + 72;
const nx = id => LAYOUT[id]?.x ?? COL_MAIN;
const ny = id => LAYOUT[id]?.y ?? 0;

const CSS = `
@keyframes pulse-dot{0%,100%{box-shadow:0 0 4px #3fb950,0 0 8px #3fb95066}50%{box-shadow:0 0 10px #3fb950,0 0 20px #3fb950aa}}
@keyframes node-ring{0%,100%{r:13;opacity:0.13}50%{r:17;opacity:0.42}}
@keyframes spine-flow{0%{stroke-dashoffset:20}100%{stroke-dashoffset:0}}
@keyframes feat-flow{0%{stroke-dashoffset:40}100%{stroke-dashoffset:0}}
@keyframes card-breathe{0%,100%{box-shadow:0 0 0 1px rgba(88,166,255,0.12)}50%{box-shadow:0 0 0 2px rgba(88,166,255,0.3),0 4px 24px rgba(88,166,255,0.1)}}
@keyframes shimmer-sweep{0%{left:-75%}60%,100%{left:125%}}
.gt-card-anim{transition:border-color 0.3s ease,background 0.3s ease,box-shadow 0.3s ease;will-change:transform,box-shadow}
.gt-card-anim::before{content:'';position:absolute;inset:0;border-radius:12px;opacity:0;transition:opacity 0.3s;background:linear-gradient(135deg,rgba(255,255,255,0.04) 0%,transparent 60%);pointer-events:none}
.gt-card-anim:hover::before{opacity:1}
.gt-card-anim:active{transform:scale(0.98) !important}
.gt-badge-anim{transition:transform 0.3s ease}
.gt-card-anim:hover .gt-badge-anim{transform:translateX(2px)}
.gt-title-anim{transition:color 0.3s,letter-spacing 0.3s}
.gt-card-anim:hover .gt-title-anim{letter-spacing:0.01em}
.gt-tag-anim{transition:background 0.25s,border-color 0.25s,color 0.25s,transform 0.25s;display:inline-block}
.gt-card-anim:hover .gt-tag-anim{transform:translateY(-1px)}
.gt-shimmer{position:absolute;inset:0;border-radius:12px;overflow:hidden;pointer-events:none}
.gt-shimmer::after{content:'';position:absolute;top:-50%;left:-75%;width:50%;height:200%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.04),transparent);animation:shimmer-sweep 3s ease-in-out infinite}
@media(max-width:520px){.gt-desktop{display:none!important}.gt-mobile{display:flex!important}}
.gt-mobile{display:none;flex-direction:column;gap:12px;padding-top:1rem}
.gt-mobile-card{background:rgba(18,24,32,0.92);border:1px solid #2a3240;border-radius:12px;padding:13px 15px;cursor:pointer;transition:transform 0.25s cubic-bezier(.22,.68,0,1.15),border-color 0.3s,box-shadow 0.3s}
.gt-mobile-card:hover{transform:scale(1.015) translateY(-2px);box-shadow:0 6px 24px rgba(0,0,0,0.4)}
.gt-mobile-card:active{transform:scale(0.98)}
`;

function GitGraph({ activeId, onActivate }) {
  const mains = COMMITS.filter(c => !c.branchFrom), feats = COMMITS.filter(c => c.branchFrom);
  const mainYs = mains.map(c => ny(c.id));
  const sTop = Math.min(...mainYs), sBot = Math.max(...mainYs);

  return (
    <svg width={SVG_W} height={TOTAL_H} style={{ display:"block", overflow:"visible" }}>
      <defs>
        <filter id="glow2"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      {COMMITS.map(c => (
        <line key={`d-${c.id}`} x1={nx(c.id)+13} y1={ny(c.id)} x2={SVG_W-2} y2={ny(c.id)}
          stroke="#1a2232" strokeWidth="2" strokeDasharray="3 5"/>
      ))}
      <line x1={COL_MAIN} y1={sTop} x2={COL_MAIN} y2={sBot} stroke="#0c1520" strokeWidth="4" strokeLinecap="round"/>
      <line x1={COL_MAIN} y1={sTop} x2={COL_MAIN} y2={sBot} stroke="#58a6ff" strokeWidth="2"
        strokeLinecap="round" strokeDasharray="8 6" opacity="0.75"
        style={{ animation:"spine-flow 1.1s linear infinite" }}/>
      {feats.map((fc, i) => {
        const fx=nx(fc.id),fy=ny(fc.id),ox=nx(fc.branchFrom),oy=ny(fc.branchFrom);
        const d=`M${ox},${oy} C${ox},${oy+52} ${fx},${fy-52} ${fx},${fy}`;
        return (
          <g key={`fo-${fc.id}`}>
            <path d={d} fill="none" stroke="#091508" strokeWidth="2.5"/>
            <path d={d} fill="none" stroke="#3fb950" strokeWidth="1.5" strokeLinecap="round"
              strokeDasharray="6 5" opacity="0.88"
              style={{ animation:`feat-flow 0.95s linear infinite`, animationDelay:`${i*0.14}s` }}/>
          </g>
        );
      })}
      {feats.filter(fc=>fc.mergesTo).map((fc,i) => {
        const fx=nx(fc.id),fy=ny(fc.id),tx=nx(fc.mergesTo),ty=ny(fc.mergesTo);
        const d=`M${fx},${fy} C${fx},${fy+65} ${tx},${ty-65} ${tx},${ty}`;
        return <path key={`mg-${fc.id}`} d={d} fill="none" stroke="#bc8cff" strokeWidth="1"
          strokeLinecap="round" strokeDasharray="5 6" opacity="0.5"
          style={{ animation:`feat-flow 1.25s linear infinite`, animationDelay:`${i*0.18}s` }}/>;
      })}
      {COMMITS.map((c,i) => {
        const x=nx(c.id),y=ny(c.id),col=NC[c.type]||"#58a6ff";
        const r=c.type==="head"?9:c.type==="init"?8:7,isAct=activeId===c.id;
        return (
          <g key={c.id} onClick={()=>onActivate(c.id)} style={{ cursor:"pointer" }}>
            <circle cx={x} cy={y} r={13} fill={col} opacity={0.13}
              style={{ animation:`node-ring 2s ease-in-out infinite`, animationDelay:`${i*0.22}s` }}/>
            {isAct && <circle cx={x} cy={y} r={r+8} fill={`${col}22`} stroke={col} strokeWidth="1" opacity="0.7"/>}
            <circle cx={x} cy={y} r={r} fill={col} stroke="#0d1117" strokeWidth="2.5" filter={isAct?"url(#glow2)":undefined}/>
            <text x={x+r+5} y={y+4} fontFamily="'SF Mono','Fira Code',monospace" fontSize="9" fill={isAct?col:"#3a4d62"}>{c.hash}</text>
            {c.branch!=="main" && <text x={x+r+5} y={y-9} fontFamily="'SF Mono','Fira Code',monospace" fontSize="9" fill={col} fontWeight="700">{c.branch}</text>}
          </g>
        );
      })}
    </svg>
  );
}

function WorkCard({ commit, activeId, onActivate }) {
  const col = NC[commit.type] || "#58a6ff";
  const isActive = activeId === commit.id;
  const ref = useRef(null);

  const onMouseMove = useCallback(e => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const dx = (e.clientX - r.left) / r.width - 0.5;
    const dy = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.transform = `perspective(900px) rotateX(${-dy*6}deg) rotateY(${dx*8}deg) scale(1.032) translateY(-4px)`;
  }, []);

  const onMouseLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = '';
  }, []);

  return (
    <div ref={ref} className="gt-card-anim"
      onClick={() => onActivate(commit.id)}
      onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}
      style={{
        position:"absolute", top:ny(commit.id)-40, left:0, right:0,
        background: isActive ? "rgba(24,32,44,0.98)" : "rgba(18,24,32,0.92)",
        border:`1px solid ${isActive ? col : "#2a3240"}`,
        borderRadius:12, padding:"13px 15px", cursor:"pointer",
        boxShadow: isActive ? `0 0 0 1px ${col}25,0 10px 36px rgba(0,0,0,0.55)` : "",
        animation: isActive ? "card-breathe 3s ease-in-out infinite" : "none",
        zIndex: isActive ? 5 : 1,
      }}
    >
      <div className="gt-shimmer" style={{ opacity: isActive ? 1 : 0 }}/>
      <div className="gt-badge-anim" style={{
        display:"inline-flex", alignItems:"center", gap:5,
        fontFamily:"'SF Mono','Fira Code',monospace", fontSize:10, fontWeight:600,
        padding:"2px 9px", borderRadius:4, marginBottom:8,
        background:`${col}18`, color:col, border:`1px solid ${col}30`
      }}>
        <span style={{ fontSize:7 }}>⬡</span>{commit.branch}
      </div>
      <div className="gt-title-anim" style={{ fontSize:13, fontWeight:700, marginBottom:5, color:isActive?"#f0f6fc":"#c9d1d9", lineHeight:1.4 }}>{commit.title}</div>
      <div style={{ fontSize:11, color:isActive?"#a0aab4":"#6e7f96", lineHeight:1.65, marginBottom:10 }}>{commit.desc}</div>
      {commit.stack.length > 0 && (
        <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginBottom:10 }}>
          {commit.stack.map((s,si) => (
            <span key={s} className="gt-tag-anim" style={{
              fontSize:9, fontFamily:"'SF Mono','Fira Code',monospace", borderRadius:3, padding:"2px 7px",
              background:isActive?`${col}14`:"rgba(255,255,255,0.04)",
              border:`1px solid ${isActive?col+"35":"#2a3240"}`,
              color:isActive?col:"#6e7f96",
              transitionDelay:`${si*0.03}s`,
            }}>{s}</span>
          ))}
        </div>
      )}
      <div style={{ display:"flex", justifyContent:"space-between", borderTop:`1px solid ${isActive?col+"22":"#1e2733"}`, paddingTop:8, fontFamily:"'SF Mono','Fira Code',monospace", fontSize:10, transition:"border-color 0.3s" }}>
        <span style={{ color:isActive?col:"#3d4f66", transition:"color 0.3s" }}>{commit.hash}</span>
        <span style={{ color:"#4a5568" }}>{commit.date}</span>
      </div>
    </div>
  );
}

function MobileCard({ commit, activeId, onActivate }) {
  const col = NC[commit.type] || "#58a6ff";
  const isActive = activeId === commit.id;
  return (
    <div className="gt-mobile-card" onClick={() => onActivate(commit.id)}
      style={{ borderColor:isActive?col:"#2a3240", boxShadow:isActive?`0 0 0 1px ${col}25,0 8px 28px rgba(0,0,0,0.5)`:"" }}>
      <div style={{ display:"inline-flex", alignItems:"center", gap:5, fontFamily:"'SF Mono','Fira Code',monospace", fontSize:10, fontWeight:600, padding:"2px 9px", borderRadius:4, marginBottom:8, background:`${col}18`, color:col, border:`1px solid ${col}30` }}>
        <span style={{ fontSize:7 }}>⬡</span>{commit.branch}
      </div>
      <div style={{ fontSize:13, fontWeight:700, marginBottom:5, color:isActive?"#f0f6fc":"#c9d1d9" }}>{commit.title}</div>
      <div style={{ fontSize:11, color:isActive?"#a0aab4":"#6e7f96", lineHeight:1.65, marginBottom:10 }}>{commit.desc}</div>
      {commit.stack.length > 0 && (
        <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginBottom:10 }}>
          {commit.stack.map(s => <span key={s} style={{ fontSize:9, fontFamily:"'SF Mono','Fira Code',monospace", borderRadius:3, padding:"2px 7px", background:isActive?`${col}14`:"rgba(255,255,255,0.04)", border:`1px solid ${isActive?col+"35":"#2a3240"}`, color:isActive?col:"#6e7f96" }}>{s}</span>)}
        </div>
      )}
      <div style={{ display:"flex", justifyContent:"space-between", borderTop:`1px solid ${isActive?col+"22":"#1e2733"}`, paddingTop:8, fontFamily:"'SF Mono','Fira Code',monospace", fontSize:10 }}>
        <span style={{ color:isActive?col:"#3d4f66" }}>{commit.hash}</span>
        <span style={{ color:"#4a5568" }}>{commit.date}</span>
      </div>
    </div>
  );
}

export default function WorkSection() {
  const [activeId, setActiveId] = useState("init");

  return (
    <section style={{ padding:"clamp(1.5rem,4vw,3rem) clamp(0.75rem,3vw,2.5rem)", fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" }}>
      <style>{CSS}</style>
      <div style={{ marginBottom:"1.5rem" }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(88,166,255,0.10)", border:"1px solid rgba(88,166,255,0.22)", borderRadius:20, padding:"4px 14px 4px 10px", fontFamily:"'SF Mono','Fira Code',monospace", fontSize:11, color:"#58a6ff", marginBottom:12 }}>
          <span style={{ width:7, height:7, borderRadius:"50%", background:"#3fb950", display:"inline-block", animation:"pulse-dot 2.2s ease-in-out infinite", flexShrink:0 }}/>
          experience.log
        </div>
        <div style={{ fontSize:"clamp(20px,4vw,28px)", fontWeight:800, letterSpacing:-0.5, color:"#f0f6fc" }}>Work Experience</div>
        <div style={{ fontSize:11, color:"#4a5568", marginTop:6, fontFamily:"'SF Mono','Fira Code',monospace" }}>$ git log --graph --oneline --all --decorate</div>
      </div>

      {/* Desktop: graph + cards */}
      <div className="gt-desktop" style={{ display:"flex", gap:0, maxWidth:920 }}>
        <div style={{ flexShrink:0, width:SVG_W }}>
          <GitGraph activeId={activeId} onActivate={setActiveId}/>
        </div>
        <div className="flex-1 relative" style={{ height:TOTAL_H }}>
          {COMMITS.map(c => <WorkCard key={c.id} commit={c} activeId={activeId} onActivate={setActiveId}/>)}
        </div>
      </div>

      {/* Mobile: stacked list */}
      <div className="gt-mobile">
        {COMMITS.map(c => <MobileCard key={c.id} commit={c} activeId={activeId} onActivate={setActiveId}/>)}
      </div>
    </section>
  );
}