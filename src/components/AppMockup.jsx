import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

// ─────────────────────────────────────────────────────────────────
// THEME — recalculated whenever dark or accent changes
// ─────────────────────────────────────────────────────────────────
function makeTheme(accent, isDark) {
  if (isDark) {
    const sl = "#29334A", sd = "#131924"
    return {
      isDark, accent,
      bg:      "#1C2130",
      surface: "#222840",
      sunken:  "#161D2B",
      t1: "rgba(255,255,255,0.92)",
      t2: "rgba(255,255,255,0.55)",
      t3: "rgba(255,255,255,0.28)",
      border: "rgba(255,255,255,0.07)",
      mint:"#06D6A0", blue:"#3D8BFF", danger:"#FF4D6D",
      card:   `6px 6px 14px ${sd}, -4px -4px 10px ${sl}`,
      inset:  `inset 4px 4px 9px ${sd}, inset -3px -3px 7px ${sl}`,
      btn:    `4px 4px 9px ${sd}, -3px -3px 7px ${sl}`,
      press:  `inset 3px 3px 7px ${sd}, inset -2px -2px 5px ${sl}`,
      glow:   `0 0 20px ${accent}55`,
    }
  } else {
    const sl = "#FFFFFF", sd = "#C5CAD4"
    return {
      isDark, accent,
      bg:      "#E8ECF1",
      surface: "#E8ECF1",
      sunken:  "#D8DDE6",
      t1: "#1A2035",
      t2: "#4A5568",
      t3: "#8896AB",
      border: "rgba(0,0,0,0.07)",
      mint:"#059669", blue:"#2563EB", danger:"#DC2626",
      card:   `6px 6px 14px ${sd}, -4px -4px 10px ${sl}`,
      inset:  `inset 4px 4px 9px ${sd}, inset -3px -3px 7px ${sl}`,
      btn:    `4px 4px 9px ${sd}, -3px -3px 7px ${sl}`,
      press:  `inset 3px 3px 7px ${sd}, inset -2px -2px 5px ${sl}`,
      glow:   `0 0 20px ${accent}55`,
    }
  }
}

const PRESETS = [
  { name:"Ámbar",    hex:"#F0B429" },
  { name:"Esmeralda",hex:"#10B981" },
  { name:"Cobalto",  hex:"#3B82F6" },
  { name:"Violeta",  hex:"#8B5CF6" },
  { name:"Rosa",     hex:"#EC4899" },
  { name:"Naranja",  hex:"#F97316" },
  { name:"Cyan",     hex:"#06B6D4" },
  { name:"Rojo",     hex:"#EF4444" },
]

// ─────────────────────────────────────────────────────────────────
// SVG ICON
// ─────────────────────────────────────────────────────────────────
const I = ({ d, s = 20, c = "currentColor" }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none"
    stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d={d}/>
  </svg>
)

const ic = {
  home:    "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2zM9 22V12h6v10",
  cart:    "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18",
  box:     "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z",
  users:   "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
  cog:     "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
  zap:     "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  sun:     "M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 5a7 7 0 100 14A7 7 0 0012 5z",
  moon:    "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z",
  bell:    "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0",
  sparkles:"M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3zM5 17l.75 2.25L8 20l-2.25.75L5 23l-.75-2.25L2 20l2.25-.75L5 17z",
  mic:     "M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3zM19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8",
  send:    "M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z",
  x:       "M18 6L6 18M6 6l12 12",
  check:   "M20 6L9 17l-5-5",
  plus:    "M12 5v14M5 12h14",
  palette: "M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10c1.38 0 2.5-1.12 2.5-2.5 0-.61-.23-1.21-.64-1.67-.08-.1-.13-.21-.13-.33 0-.28.22-.5.5-.5H16c3.31 0 6-2.69 6-6 0-4.96-4.49-9-10-9zM6.5 11C5.67 11 5 10.33 5 9.5S5.67 8 6.5 8 8 8.67 8 9.5 7.33 11 6.5 11zm3-4C8.67 7 8 6.33 8 5.5S8.67 4 9.5 4s1.5.67 1.5 1.5S10.33 7 9.5 7zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 4 14.5 4s1.5.67 1.5 1.5S15.33 7 14.5 7zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 8 17.5 8s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z",
  edit:    "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  trash:   "M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2",
  alert:   "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01",
  trend:   "M23 6l-9.5 9.5-5-5L1 18M17 6h6v6",
  bar:     "M18 20V10M12 20V4M6 20v-6",
  money:   "M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
  msg:     "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z",
  back:    "M19 12H5M12 19l-7-7 7-7",
  calc:    "M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2zM7 7h10M7 12h2M11 12h2M15 12h2M7 16h2M11 16h2M15 16h2",
  div:     "M12 3v18M3 12h18",
  pct:     "M19 5L5 19M6.5 6a.5.5 0 100-1 .5.5 0 000 1zM17.5 20a.5.5 0 100-1 .5.5 0 000 1z",
  person:  "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z",
  tag:     "M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01",
  star2:   "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
}

// ─────────────────────────────────────────────────────────────────
// REUSABLE COMPONENTS
// ─────────────────────────────────────────────────────────────────
const Card = ({ T, children, style = {}, accent = false }) => (
  <div style={{
    background: T.surface, borderRadius: 20, padding: 16,
    boxShadow: T.card,
    border: accent ? `1px solid ${T.accent}30` : "none",
    ...style,
  }}>{children}</div>
)

const Btn = ({ T, children, onClick, variant = "neu", full = false, size = "md", style = {} }) => {
  const [p, setP] = useState(false)
  const pad = { sm: "9px 16px", md: "12px 22px", lg: "15px 28px" }[size]
  const fs  = { sm: 12, md: 13, lg: 15 }[size]

  const bg = variant === "primary"
    ? `linear-gradient(135deg,${T.accent},${T.accent}BB)`
    : variant === "ghost"
    ? "transparent"
    : T.surface

  const col = variant === "primary" ? "#1C2130" : T.t2

  return (
    <button
      onPointerDown={() => setP(true)}
      onPointerUp={() => setP(false)}
      onPointerLeave={() => setP(false)}
      onClick={onClick}
      style={{
        padding: pad, borderRadius: 14, border: "none", cursor: "pointer",
        background: bg, color: col,
        fontSize: fs, fontWeight: 600, fontFamily: "DM Sans,sans-serif",
        boxShadow: p ? T.press : (variant === "primary" ? `${T.btn}, ${T.glow}` : T.btn),
        transform: p ? "scale(0.96)" : "scale(1)",
        transition: "transform 0.1s, box-shadow 0.1s",
        width: full ? "100%" : "auto",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
        ...style,
      }}>
      {children}
    </button>
  )
}

const Tag = ({ T, color, bg, children }) => (
  <span style={{
    fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20,
    background: bg, color,
  }}>{children}</span>
)

// ─────────────────────────────────────────────────────────────────
// ONBOARDING
// ─────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────
// CALCULADORA SHEET
// ─────────────────────────────────────────────────────────────────
const CALC_MODES = [
  { id:"basic",  label:"Básica",  emoji:"🔢" },
  { id:"change", label:"Vuelto",  emoji:"💵" },
  { id:"split",  label:"Dividir", emoji:"👥" },
  { id:"margin", label:"Margen",  emoji:"📊" },
]

function CalcSheet({ T, onClose }) {
  const [mode, setMode]   = useState("basic")
  const [display, setDisplay] = useState("0")
  const [expr, setExpr]   = useState("")
  const [fresh, setFresh] = useState(true)
  // Vuelto
  const [paid, setPaid]   = useState("")
  const [total, setTotal] = useState("")
  // Dividir
  const [splitAmt, setSplitAmt] = useState("")
  const [people, setPeople]     = useState("2")
  // Margen
  const [cost,  setCost]  = useState("")
  const [price, setPrice] = useState("")

  const fmt = n => isNaN(n) ? "0" : new Intl.NumberFormat("es-CL").format(n)
  const fmtCLP = n => new Intl.NumberFormat("es-CL",{style:"currency",currency:"CLP",maximumFractionDigits:0}).format(n)

  const press = (btn) => {
    if (btn === "C")  { setDisplay("0"); setExpr(""); setFresh(true); return }
    if (btn === "⌫")  { setDisplay(d => d.length>1 ? d.slice(0,-1) : "0"); return }
    if (btn === "±")  { setDisplay(d => d.startsWith("-") ? d.slice(1) : "-"+d); return }
    if (btn === "=")  {
      try {
        const raw = (expr + display).replace(/÷/g,"/").replace(/×/g,"*").replace(/−/g,"-")
        // eslint-disable-next-line no-eval
        const res = eval(raw)
        const str = Number.isInteger(res) ? String(res) : String(parseFloat(res.toFixed(10)))
        setDisplay(str); setExpr(""); setFresh(true)
      } catch { setDisplay("Error") }
      return
    }
    if (["÷","×","−","+"].includes(btn)) { setExpr(expr+display+btn); setFresh(true); return }
    if (btn === "%") { setDisplay(d => String(parseFloat(d)/100)); return }
    if (btn === ".") {
      if (fresh) { setDisplay("0."); setFresh(false); return }
      if (!display.includes(".")) setDisplay(d => d+".")
      return
    }
    if (fresh) { setDisplay(btn); setFresh(false) }
    else setDisplay(d => d==="0" ? btn : d+btn)
  }

  const BTNS = [
    ["C","±","%","÷"],
    ["7","8","9","×"],
    ["4","5","6","−"],
    ["1","2","3","+"],
    [".","0","⌫","="],
  ]

  const btnColor = b => {
    if (b==="=")  return {bg:`linear-gradient(135deg,${T.accent},${T.accent}BB)`,c:"#1C2130",sh:`0 4px 14px ${T.accent}50`}
    if (["÷","×","−","+"].includes(b)) return {bg:`${T.accent}18`,c:T.accent}
    if (["C","±","%","⌫"].includes(b)) return {bg:`rgba(255,255,255,0.08)`,c:T.t2}
    return {bg:T.surface,c:T.t1}
  }

  // Resultados modo helpers
  const changeAmt = () => {
    const p = parseFloat(paid.replace(/\./g,"").replace(",",".")||"0")
    const t = parseFloat(total.replace(/\./g,"").replace(",",".")||"0")
    return isNaN(p)||isNaN(t) ? null : p - t
  }
  const perPerson = () => {
    const s = parseFloat(splitAmt.replace(/\./g,"").replace(",",".")||"0")
    const p = parseInt(people||"1")
    return isNaN(s)||p<1 ? null : Math.ceil(s/p)
  }
  const marginData = () => {
    const c = parseFloat(cost.replace(/\./g,"").replace(",",".")||"0")
    const p = parseFloat(price.replace(/\./g,"").replace(",",".")||"0")
    if (!c||!p) return null
    const profit = p-c
    return { profit, margin:(profit/p*100), markup:(profit/c*100) }
  }

  const numInput = (val, setter) => (
    <input value={val} onChange={e => setter(e.target.value.replace(/[^0-9.,]/g,""))}
      inputMode="decimal" placeholder="$0"
      style={{ width:"100%", padding:"14px 16px", borderRadius:14, border:"none",
        background:T.sunken, boxShadow:T.inset, color:T.t1,
        fontSize:20, fontWeight:700, fontFamily:"JetBrains Mono",
        textAlign:"right", caretColor:T.accent, outline:"none", boxSizing:"border-box" }} />
  )

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.65)",
        display:"flex", alignItems:"flex-end", justifyContent:"center",
        zIndex:200, backdropFilter:"blur(4px)" }}
      onClick={e => e.target===e.currentTarget && onClose()}>
      <motion.div initial={{y:"100%"}} animate={{y:0}} exit={{y:"100%"}}
        transition={{type:"spring", damping:30, stiffness:350}}
        style={{ width:"100%", maxWidth:480, background:T.surface,
          borderRadius:"24px 24px 0 0", padding:"0 0 32px",
          boxShadow:"0 -8px 40px rgba(0,0,0,0.5)", maxHeight:"95vh",
          display:"flex", flexDirection:"column" }}>

        {/* Handle + header */}
        <div style={{ padding:"16px 18px 12px", borderBottom:`1px solid ${T.border}` }}>
          <div style={{ width:40, height:5, borderRadius:3,
            background:"rgba(255,255,255,0.15)", margin:"0 auto 16px" }} />
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:38, height:38, borderRadius:12,
                background:`linear-gradient(135deg,${T.accent},${T.accent}BB)`,
                display:"flex", alignItems:"center", justifyContent:"center" }}>
                <I d={ic.calc} s={18} c="#1C2130" />
              </div>
              <span style={{ fontSize:16, fontWeight:700, color:T.t1,
                fontFamily:"Bricolage Grotesque" }}>Calculadora</span>
            </div>
            <motion.button whileTap={{scale:0.88}} onClick={onClose}
              style={{ width:36, height:36, borderRadius:10, border:"none", cursor:"pointer",
                background:T.sunken, boxShadow:T.btn,
                display:"flex", alignItems:"center", justifyContent:"center" }}>
              <I d={ic.x} s={16} c={T.t3} />
            </motion.button>
          </div>
        </div>

        {/* Mode tabs */}
        <div style={{ display:"flex", gap:6, padding:"12px 18px 0",
          flexShrink:0 }}>
          {CALC_MODES.map(m => {
            const on = mode===m.id
            return (
              <motion.button key={m.id} whileTap={{scale:0.92}}
                onClick={() => setMode(m.id)}
                style={{ flex:1, padding:"10px 4px", borderRadius:14, border:"none", cursor:"pointer",
                  background: on ? `linear-gradient(135deg,${T.accent},${T.accent}BB)` : T.sunken,
                  color: on ? "#1C2130" : T.t3,
                  boxShadow: on ? `${T.press}, 0 0 12px ${T.accent}40` : T.inset,
                  fontSize:10, fontWeight:700, display:"flex", flexDirection:"column",
                  alignItems:"center", gap:4 }}>
                <span style={{fontSize:18}}>{m.emoji}</span>
                {m.label}
              </motion.button>
            )
          })}
        </div>

        {/* Content */}
        <div style={{ flex:1, overflowY:"auto", padding:"16px 18px" }}>
          <AnimatePresence mode="wait">

            {/* BÁSICA */}
            {mode==="basic" && (
              <motion.div key="basic" initial={{opacity:0,x:10}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-10}}>
                {/* Display */}
                <div style={{ background:T.sunken, borderRadius:18, padding:"16px 20px",
                  boxShadow:T.inset, marginBottom:16, minHeight:90,
                  display:"flex", flexDirection:"column", justifyContent:"flex-end", alignItems:"flex-end" }}>
                  <div style={{ fontSize:12, color:T.t3, fontFamily:"JetBrains Mono",
                    marginBottom:4, minHeight:18 }}>{expr}</div>
                  <motion.div key={display}
                    initial={{scale:0.95, opacity:0.7}} animate={{scale:1, opacity:1}}>
                    <span style={{ fontFamily:"JetBrains Mono", fontWeight:700, color:T.t1,
                      fontSize: display.length>10 ? 24 : display.length>7 ? 30 : 38 }}>
                      {display==="Error"
                        ? <span style={{color:T.danger}}>Error</span>
                        : fmt(parseFloat(display.replace(/,/g,"."))) === "NaN" ? display : display
                      }
                    </span>
                  </motion.div>
                </div>
                {/* Buttons */}
                <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
                  {BTNS.flat().map((btn,i) => {
                    const s = btnColor(btn)
                    return (
                      <motion.button key={`${btn}-${i}`} whileTap={{scale:0.88}}
                        onClick={() => press(btn)}
                        style={{ height:60, borderRadius:16, border:"none", cursor:"pointer",
                          fontSize:20, fontWeight:600, background:s.bg, color:s.c,
                          boxShadow: s.sh || T.btn, fontFamily:"DM Sans" }}>
                        {btn}
                      </motion.button>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* VUELTO */}
            {mode==="change" && (
              <motion.div key="change" initial={{opacity:0,x:10}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-10}}
                style={{display:"flex", flexDirection:"column", gap:14}}>
                <div>
                  <div style={{fontSize:11, color:T.t3, marginBottom:8, fontWeight:600,
                    textTransform:"uppercase", letterSpacing:"0.06em"}}>💰 El cliente pagó</div>
                  {numInput(paid, setPaid)}
                </div>
                <div>
                  <div style={{fontSize:11, color:T.t3, marginBottom:8, fontWeight:600,
                    textTransform:"uppercase", letterSpacing:"0.06em"}}>🛒 Total de la compra</div>
                  {numInput(total, setTotal)}
                </div>
                {paid && total && changeAmt() !== null && (
                  <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}>
                    <div style={{ background: changeAmt()>0 ? `${T.mint}12` : changeAmt()===0 ? `${T.blue}12` : `${T.danger}12`,
                      border: `1px solid ${changeAmt()>0 ? T.mint+"35" : changeAmt()===0 ? T.blue+"35" : T.danger+"35"}`,
                      borderRadius:18, padding:"20px", textAlign:"center",
                      boxShadow: changeAmt()>0 ? `0 0 20px ${T.mint}25` : "" }}>
                      {changeAmt()>0 ? (
                        <>
                          <div style={{fontSize:11, fontWeight:700, color:T.mint, letterSpacing:"0.1em", marginBottom:6}}>
                            VUELTO A ENTREGAR
                          </div>
                          <div style={{fontSize:40, fontWeight:900, color:T.mint, fontFamily:"JetBrains Mono"}}>
                            {fmtCLP(changeAmt())}
                          </div>
                        </>
                      ) : changeAmt()===0 ? (
                        <div style={{fontSize:18, fontWeight:700, color:T.blue}}>✅ Pago exacto</div>
                      ) : (
                        <>
                          <div style={{fontSize:11, fontWeight:700, color:T.danger, letterSpacing:"0.1em", marginBottom:6}}>
                            ⚠️ FALTA PAGAR
                          </div>
                          <div style={{fontSize:36, fontWeight:900, color:T.danger, fontFamily:"JetBrains Mono"}}>
                            {fmtCLP(Math.abs(changeAmt()))}
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
                <Btn T={T} full size="sm" onClick={() => { setPaid(""); setTotal("") }}>
                  Limpiar
                </Btn>
              </motion.div>
            )}

            {/* DIVIDIR */}
            {mode==="split" && (
              <motion.div key="split" initial={{opacity:0,x:10}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-10}}
                style={{display:"flex", flexDirection:"column", gap:14}}>
                <div>
                  <div style={{fontSize:11, color:T.t3, marginBottom:8, fontWeight:600,
                    textTransform:"uppercase", letterSpacing:"0.06em"}}>🧾 Total de la cuenta</div>
                  {numInput(splitAmt, setSplitAmt)}
                </div>
                <div>
                  <div style={{fontSize:11, color:T.t3, marginBottom:10, fontWeight:600,
                    textTransform:"uppercase", letterSpacing:"0.06em"}}>👥 Número de personas</div>
                  <div style={{display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:8}}>
                    {["2","3","4","5","6","8"].map(n => (
                      <motion.button key={n} whileTap={{scale:0.88}}
                        onClick={() => setPeople(n)}
                        style={{height:48, borderRadius:14, border:"none", cursor:"pointer",
                          fontSize:16, fontWeight:700,
                          background: people===n ? `linear-gradient(135deg,${T.accent},${T.accent}BB)` : T.sunken,
                          color: people===n ? "#1C2130" : T.t3,
                          boxShadow: people===n ? `${T.press},0 0 12px ${T.accent}40` : T.inset}}>
                        {n}
                      </motion.button>
                    ))}
                  </div>
                </div>
                {splitAmt && perPerson() !== null && (
                  <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}>
                    <div style={{background:`${T.blue}12`, border:`1px solid ${T.blue}30`,
                      borderRadius:18, padding:"20px", textAlign:"center"}}>
                      <div style={{fontSize:11, fontWeight:700, color:T.blue,
                        letterSpacing:"0.1em", marginBottom:6}}>CADA PERSONA PAGA</div>
                      <div style={{fontSize:40, fontWeight:900, color:T.blue, fontFamily:"JetBrains Mono"}}>
                        {fmtCLP(perPerson())}
                      </div>
                      <div style={{fontSize:11, color:T.t3, marginTop:6}}>
                        {people} personas · Total {splitAmt ? fmtCLP(parseFloat(splitAmt.replace(/\./g,""))) : ""}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* MARGEN */}
            {mode==="margin" && (
              <motion.div key="margin" initial={{opacity:0,x:10}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-10}}
                style={{display:"flex", flexDirection:"column", gap:14}}>
                <div>
                  <div style={{fontSize:11, color:T.t3, marginBottom:8, fontWeight:600,
                    textTransform:"uppercase", letterSpacing:"0.06em"}}>📦 Precio de costo</div>
                  {numInput(cost, setCost)}
                </div>
                <div>
                  <div style={{fontSize:11, color:T.t3, marginBottom:8, fontWeight:600,
                    textTransform:"uppercase", letterSpacing:"0.06em"}}>🏷️ Precio de venta</div>
                  {numInput(price, setPrice)}
                </div>
                {cost && price && marginData() && (
                  <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}>
                    <div style={{background:`${T.accent}0C`, border:`1px solid ${T.accent}25`,
                      borderRadius:18, padding:"16px 20px"}}>
                      {[
                        {l:"Ganancia por unidad", v:fmtCLP(marginData().profit), c:T.accent},
                        {l:"Margen sobre venta",  v:`${marginData().margin.toFixed(1)}%`, c:T.t1},
                        {l:"Markup sobre costo",  v:`${marginData().markup.toFixed(1)}%`, c:T.t1},
                      ].map(r => (
                        <div key={r.l} style={{display:"flex", justifyContent:"space-between",
                          alignItems:"center", padding:"10px 0",
                          borderBottom:`1px solid ${T.border}`}}>
                          <span style={{fontSize:13, color:T.t2}}>{r.l}</span>
                          <span style={{fontSize:16, fontWeight:800, color:r.c,
                            fontFamily:"JetBrains Mono"}}>{r.v}</span>
                        </div>
                      ))}
                      {/* Barra de margen */}
                      <div style={{marginTop:14}}>
                        <div style={{height:8, borderRadius:4, background:T.sunken, overflow:"hidden",
                          boxShadow:T.inset, marginBottom:6}}>
                          <motion.div initial={{width:0}}
                            animate={{width:`${Math.min(marginData().margin,100)}%`}}
                            transition={{duration:0.8}}
                            style={{height:"100%", borderRadius:4,
                              background: marginData().margin>30
                                ? `linear-gradient(90deg,${T.mint},${T.blue})`
                                : marginData().margin>15
                                ? `linear-gradient(90deg,${T.accent},${T.mint})`
                                : `linear-gradient(90deg,${T.danger},${T.accent})`}} />
                        </div>
                        <div style={{fontSize:11, color:T.t3, textAlign:"right"}}>
                          {marginData().margin>30 ? "✅ Excelente margen"
                           : marginData().margin>15 ? "🟡 Margen aceptable"
                           : "🔴 Margen bajo — revisa el precio"}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}



function Onboarding({ onDone }) {
  const [step, setStep]   = useState(0)
  const [accent, setAccent] = useState("#F0B429")
  const [custom, setCustom] = useState("")
  const [name, setName]   = useState("")

  const finalAccent = (custom && /^#[0-9A-Fa-f]{6}$/.test(custom)) ? custom : accent
  const T = useMemo(() => makeTheme(finalAccent, true), [finalAccent])

  return (
    <div style={{ minHeight:"100vh", background:T.bg, display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center", padding:"24px 20px",
      fontFamily:"DM Sans,sans-serif", color:T.t1 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Bricolage+Grotesque:wght@600;700&family=JetBrains+Mono:wght@600;700&display=swap');*{box-sizing:border-box;margin:0;padding:0} @keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* Progress dots */}
      <div style={{ display:"flex", gap:8, marginBottom:36 }}>
        {[0,1,2].map(i => (
          <motion.div key={i}
            animate={{ width: step===i ? 28:8, background: step>=i ? finalAccent:"rgba(255,255,255,0.2)" }}
            style={{ height:8, borderRadius:4 }} transition={{ duration:0.3 }} />
        ))}
      </div>

      <div style={{ width:"100%", maxWidth:380 }}>
        <AnimatePresence mode="wait">

          {/* Step 0 — Bienvenida */}
          {step === 0 && (
            <motion.div key="s0" initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-30}}
              style={{ textAlign:"center" }}>
              <motion.div
                animate={{ boxShadow:[`0 0 20px ${finalAccent}40`,`0 0 45px ${finalAccent}70`,`0 0 20px ${finalAccent}40`] }}
                transition={{ duration:2.5, repeat:Infinity }}
                style={{ width:88, height:88, borderRadius:28, margin:"0 auto 28px",
                  background:`linear-gradient(135deg,${finalAccent},${finalAccent}BB)`,
                  boxShadow:T.card, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <I d={ic.zap} s={38} c="#1C2130" />
              </motion.div>
              <h1 style={{ fontFamily:"Bricolage Grotesque", fontSize:32, fontWeight:700, color:T.t1, marginBottom:10 }}>
                NegociPro
              </h1>
              <p style={{ fontSize:15, color:T.t2, lineHeight:1.7, marginBottom:36 }}>
                Tu negocio. Bajo control total.<br/>
                Configuremos tu espacio en 2 pasos.
              </p>
              <Btn T={T} variant="primary" full size="lg" onClick={() => setStep(1)}>
                Comenzar →
              </Btn>
            </motion.div>
          )}

          {/* Step 1 — Color */}
          {step === 1 && (
            <motion.div key="s1" initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-30}}>
              <h2 style={{ fontFamily:"Bricolage Grotesque", fontSize:22, fontWeight:700, color:T.t1, marginBottom:6 }}>
                Color de tu negocio
              </h2>
              <p style={{ fontSize:13, color:T.t3, marginBottom:22, lineHeight:1.6 }}>
                Aparecerá en botones y tu catálogo. Puedes cambiarlo después.
              </p>

              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:18 }}>
                {PRESETS.map(opt => {
                  const sel = accent===opt.hex && !custom
                  return (
                    <motion.button key={opt.hex} whileTap={{scale:0.88}}
                      onClick={() => { setAccent(opt.hex); setCustom("") }}
                      style={{ padding:"12px 6px", borderRadius:16, border:"none", cursor:"pointer",
                        background: sel ? `${opt.hex}22` : T.surface,
                        boxShadow: sel ? T.press : T.btn,
                        outline: sel ? `2px solid ${opt.hex}` : "none",
                        outlineOffset:2,
                        display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
                      <div style={{ width:36, height:36, borderRadius:11, background:opt.hex,
                        boxShadow:`0 4px 10px ${opt.hex}60`,
                        display:"flex", alignItems:"center", justifyContent:"center" }}>
                        {sel && <I d={ic.check} s={15} c="#fff" />}
                      </div>
                      <span style={{ fontSize:10, color: sel ? opt.hex : T.t3, fontWeight: sel?700:400 }}>
                        {opt.name}
                      </span>
                    </motion.button>
                  )
                })}
              </div>

              <div style={{ marginBottom:20 }}>
                <p style={{ fontSize:11, color:T.t3, marginBottom:8, textTransform:"uppercase", letterSpacing:"0.07em" }}>
                  Color personalizado (hex)
                </p>
                <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                  <div style={{ width:44, height:44, borderRadius:12, flexShrink:0, boxShadow:T.btn,
                    background: (custom && /^#[0-9A-Fa-f]{6}$/.test(custom)) ? custom : T.sunken }} />
                  <input value={custom} onChange={e => { setCustom(e.target.value); setAccent("") }}
                    placeholder="#F0B429"
                    style={{ flex:1, padding:"13px 16px", borderRadius:14, border:"none",
                      background:T.surface, boxShadow:T.inset, color:T.t1,
                      fontSize:14, fontFamily:"JetBrains Mono", outline:"none", caretColor:finalAccent }} />
                </div>
              </div>

              {/* Preview button */}
              <Card T={T} accent style={{ marginBottom:20, padding:"12px 16px" }}>
                <div style={{ fontSize:11, color:T.t3, marginBottom:8 }}>Vista previa</div>
                <div style={{ display:"flex", gap:8 }}>
                  <span style={{ padding:"8px 18px", borderRadius:12, fontSize:13, fontWeight:700,
                    background:`linear-gradient(135deg,${finalAccent},${finalAccent}BB)`,
                    color:"#1C2130", boxShadow:T.btn }}>Confirmar</span>
                  <span style={{ padding:"8px 18px", borderRadius:12, fontSize:13, fontWeight:600,
                    background:`${finalAccent}20`, color:finalAccent, boxShadow:T.btn }}>Ver más</span>
                </div>
              </Card>

              <div style={{ display:"flex", gap:10 }}>
                <Btn T={T} onClick={() => setStep(0)}>← Atrás</Btn>
                <Btn T={T} variant="primary" full onClick={() => setStep(2)}>Continuar →</Btn>
              </div>
            </motion.div>
          )}

          {/* Step 2 — Nombre */}
          {step === 2 && (
            <motion.div key="s2" initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-30}}>
              <h2 style={{ fontFamily:"Bricolage Grotesque", fontSize:22, fontWeight:700, color:T.t1, marginBottom:6 }}>
                Nombre de tu negocio
              </h2>
              <p style={{ fontSize:13, color:T.t3, marginBottom:22, lineHeight:1.6 }}>
                Aparecerá en boletas, catálogos y mensajes a tus clientes.
              </p>

              <input value={name} onChange={e => setName(e.target.value)}
                placeholder="Ej: Minimarket Don Luis"
                style={{ width:"100%", padding:"16px 18px", borderRadius:16, border:"none",
                  background:T.surface, boxShadow:T.inset, color:T.t1,
                  fontSize:17, fontFamily:"DM Sans", outline:"none",
                  caretColor:finalAccent, marginBottom:16, boxSizing:"border-box" }} />

              {name.trim() && (
                <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}>
                  <Card T={T} accent style={{ marginBottom:20, padding:"14px 16px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                      <div style={{ width:44, height:44, borderRadius:13, flexShrink:0,
                        background:`linear-gradient(135deg,${finalAccent},${finalAccent}BB)`,
                        boxShadow:T.glow, display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <I d={ic.zap} s={20} c="#1C2130" />
                      </div>
                      <div>
                        <div style={{ fontSize:15, fontWeight:700, color:T.t1,
                          fontFamily:"Bricolage Grotesque" }}>{name}</div>
                        <div style={{ fontSize:11, color:T.t3, marginTop:2 }}>Así te verán tus clientes ✓</div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}

              <div style={{ display:"flex", gap:10 }}>
                <Btn T={T} onClick={() => setStep(1)}>← Atrás</Btn>
                <Btn T={T} variant="primary" full
                  onClick={() => name.trim() && onDone({ accent:finalAccent, name:name.trim() })}>
                  {name.trim() ? "¡Entrar! 🚀" : "Escribe el nombre"}
                </Btn>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// TOP HEADER
// ─────────────────────────────────────────────────────────────────
function Header({ T, bizName, isDark, toggleDark, onColorEdit, onCalc, onBell, unread = 0 }) {
  return (
    <header style={{
      display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"14px 18px", flexShrink:0,
      background:T.surface, boxShadow:`0 2px 12px rgba(0,0,0,${isDark?0.35:0.1})`,
    }}>
      {/* Logo + nombre */}
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ width:36, height:36, borderRadius:11,
          background:`linear-gradient(135deg,${T.accent},${T.accent}BB)`,
          boxShadow:T.glow, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <I d={ic.zap} s={16} c="#1C2130" />
        </div>
        <div>
          <div style={{ fontSize:14, fontWeight:700, color:T.t1, lineHeight:1,
            fontFamily:"Bricolage Grotesque" }}>NegociPro</div>
          <div style={{ fontSize:10, color:T.t3, marginTop:2 }}>{bizName}</div>
        </div>
      </div>

      {/* Acciones derechas */}
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>

        {/* 🎨 Editor de colores */}
        <motion.button whileTap={{scale:0.88}} onClick={onColorEdit}
          style={{ width:40, height:40, borderRadius:12, border:"none", cursor:"pointer",
            background:T.surface, boxShadow:T.btn,
            display:"flex", alignItems:"center", justifyContent:"center" }}>
          <I d={ic.palette} s={18} c={T.accent} />
        </motion.button>

        {/* 🧮 Calculadora */}
        <motion.button whileTap={{scale:0.88}} onClick={onCalc}
          style={{ width:40, height:40, borderRadius:12, border:"none", cursor:"pointer",
            background:T.surface, boxShadow:T.btn,
            display:"flex", alignItems:"center", justifyContent:"center" }}>
          <I d={ic.calc} s={18} c={T.t2} />
        </motion.button>

        {/* ☀️/🌙 Toggle tema — caja con borde bien visible */}
        <motion.button
          whileTap={{scale:0.88}}
          onClick={toggleDark}
          style={{
            width:40, height:40, borderRadius:12, border:`2px solid ${T.accent}60`,
            cursor:"pointer",
            background: isDark
              ? `linear-gradient(135deg,#2A3448,#1E2538)`
              : `linear-gradient(135deg,#FFF9E6,#FFF3CC)`,
            boxShadow:T.btn,
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>
          {/* Shows SUN when dark (to switch to light), MOON when light (to switch to dark) */}
          <I d={isDark ? ic.sun : ic.moon} s={18} c={T.accent} />
        </motion.button>

        {/* 🔔 Bell */}
        <motion.button whileTap={{scale:0.88}} onClick={onBell}
          style={{ position:"relative", width:40, height:40, borderRadius:12, border:"none",
            cursor:"pointer", background:T.surface, boxShadow:T.btn,
            display:"flex", alignItems:"center", justifyContent:"center" }}>
          <I d={ic.bell} s={18} c={unread > 0 ? T.accent : T.t2} />
          {unread > 0 && (
            <motion.div initial={{scale:0}} animate={{scale:1}}
              style={{ position:"absolute", top:-3, right:-3,
                minWidth:18, height:18, borderRadius:9,
                background:T.danger, border:`2px solid ${T.surface}`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:9, fontWeight:800, color:"#fff", padding:"0 4px" }}>
              {unread > 9 ? "9+" : unread}
            </motion.div>
          )}
        </motion.button>
      </div>
    </header>
  )
}

// ─────────────────────────────────────────────────────────────────
// BOTTOM NAV
// ─────────────────────────────────────────────────────────────────
function BottomNav({ active, setActive, T }) {
  const tabs = [
    { id:"Dashboard",  icon:ic.home,    label:"Inicio"   },
    { id:"POS",        icon:ic.cart,    label:"Vender"   },
    { id:"Inventario", icon:ic.box,     label:"Stock"    },
    { id:"Contactos",  icon:ic.users,   label:"Clientes" },
    { id:"Config",     icon:ic.cog,     label:"Config"   },
  ]
  return (
    <nav style={{ display:"flex", background:T.surface, flexShrink:0,
      boxShadow:`0 -3px 16px rgba(0,0,0,${T.isDark?0.35:0.12})` }}>
      {tabs.map(tab => {
        const on = active === tab.id
        return (
          <motion.button key={tab.id} whileTap={{scale:0.85}} onClick={() => setActive(tab.id)}
            style={{ flex:1, padding:"10px 4px 8px", border:"none", cursor:"pointer",
              background:"transparent", display:"flex", flexDirection:"column",
              alignItems:"center", gap:4 }}>
            <div style={{ position:"relative" }}>
              {on && (
                <motion.div layoutId="nav-pill"
                  style={{ position:"absolute", inset:-7, borderRadius:14,
                    background:`${T.accent}18`, boxShadow:`0 0 12px ${T.accent}30` }} />
              )}
              <I d={tab.icon} s={22} c={on ? T.accent : T.t3} />
              {tab.badge && (
                <div style={{ position:"absolute", top:-4, right:-7,
                  minWidth:16, height:16, borderRadius:8, background:T.danger,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:9, fontWeight:700, color:"#fff", padding:"0 4px" }}>
                  {tab.badge}
                </div>
              )}
            </div>
            <span style={{ fontSize:10, fontWeight: on?700:400,
              color: on ? T.accent : T.t3 }}>{tab.label}</span>
          </motion.button>
        )
      })}
    </nav>
  )
}

// ─────────────────────────────────────────────────────────────────
// AI CHAT PANEL
// ─────────────────────────────────────────────────────────────────
const SUGGESTIONS = [
  "¿Cuánto vendí hoy?",
  "¿Qué productos me quedan pocos?",
  "Ir a inventario",
  "Resumen del día",
]

function AIChatPanel({ T, onClose }) {
  const [msgs, setMsgs] = useState([
    { role:"bot", text:"¡Hola! Soy tu asistente IA 🤖 Puedo consultarte ventas, stock, deudores y hasta navegar la app por ti. ¿En qué te ayudo?" }
  ])
  const [input, setInput] = useState("")
  const [typing, setTyping] = useState(false)

  const fakeReply = (question) => {
    const replies = {
      "¿cuánto vendí hoy?":        "💰 Hoy llevas **$187.500** en ventas — 47 transacciones. ¡Un 12% más que ayer! 🔥",
      "¿qué productos me quedan pocos?": "⚠️ Tienes **4 productos** con stock crítico:\n• Yogurt 200g → 2 unidades\n• Pan Molde → 1 unidad\n• Queso Gouda → sin stock\n• Crema 200ml → 3 unidades",
      "ir a inventario":           "✅ Listo, te llevo al inventario ahora.",
      "resumen del día":           "📊 **Resumen — 27 Mar 2026:**\nVentas: $187.500\nTransacciones: 47\nProducto top: Coca-Cola 2L (24 unidades)\nStock crítico: 4 productos\nDeudores activos: 5 ($47.500 en calle)",
    }
    const key = question.toLowerCase().replace("?","").trim()
    return replies[key] || `Entendido: "${question}". Estoy buscando esa información en tu negocio... ✅`
  }

  const send = (text) => {
    if (!text.trim()) return
    const q = text.trim()
    setMsgs(m => [...m, { role:"user", text:q }])
    setInput("")
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMsgs(m => [...m, { role:"bot", text: fakeReply(q) }])
    }, 1200)
  }

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.65)",
        display:"flex", alignItems:"flex-end", justifyContent:"center",
        zIndex:200, backdropFilter:"blur(4px)" }}
      onClick={e => e.target===e.currentTarget && onClose()}>
      <motion.div initial={{y:"100%"}} animate={{y:0}} exit={{y:"100%"}}
        transition={{type:"spring", damping:30, stiffness:350}}
        style={{ width:"100%", maxWidth:480, height:"85vh",
          background:T.surface, borderRadius:"24px 24px 0 0",
          display:"flex", flexDirection:"column",
          boxShadow:`0 -8px 40px rgba(0,0,0,0.5)` }}>

        {/* Header del chat */}
        <div style={{ padding:"16px 18px 12px", borderBottom:`1px solid ${T.border}`,
          display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
          <motion.div
            animate={{ boxShadow:[`0 0 12px ${T.accent}40`,`0 0 24px ${T.accent}70`,`0 0 12px ${T.accent}40`] }}
            transition={{duration:2, repeat:Infinity}}
            style={{ width:42, height:42, borderRadius:13,
              background:`linear-gradient(135deg,${T.accent},${T.accent}BB)`,
              display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <I d={ic.sparkles} s={20} c="#1C2130" />
          </motion.div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:15, fontWeight:700, color:T.t1,
              fontFamily:"Bricolage Grotesque" }}>Asistente IA</div>
            <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:2 }}>
              <div style={{ width:7, height:7, borderRadius:4, background:T.mint }} />
              <span style={{ fontSize:11, color:T.mint }}>En línea — responde en segundos</span>
            </div>
          </div>
          <motion.button whileTap={{scale:0.88}} onClick={onClose}
            style={{ width:36, height:36, borderRadius:10, border:"none", cursor:"pointer",
              background:T.sunken, boxShadow:T.btn,
              display:"flex", alignItems:"center", justifyContent:"center" }}>
            <I d={ic.x} s={16} c={T.t3} />
          </motion.button>
        </div>

        {/* Mensajes */}
        <div style={{ flex:1, overflowY:"auto", padding:"16px", display:"flex",
          flexDirection:"column", gap:12, scrollbarWidth:"none" }}>
          {msgs.map((m, i) => (
            <motion.div key={i} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
              style={{ display:"flex", justifyContent: m.role==="user" ? "flex-end" : "flex-start", gap:8 }}>
              {m.role==="bot" && (
                <div style={{ width:30, height:30, borderRadius:10, flexShrink:0,
                  background:`${T.accent}20`, display:"flex", alignItems:"center",
                  justifyContent:"center", marginTop:2 }}>
                  <I d={ic.sparkles} s={14} c={T.accent} />
                </div>
              )}
              <div style={{ maxWidth:"78%", padding:"11px 14px", borderRadius:16,
                borderTopLeftRadius: m.role==="bot" ? 4 : 16,
                borderTopRightRadius: m.role==="user" ? 4 : 16,
                background: m.role==="user"
                  ? `linear-gradient(135deg,${T.accent},${T.accent}BB)`
                  : T.sunken,
                boxShadow: m.role==="user" ? T.glow : T.card,
                color: m.role==="user" ? "#1C2130" : T.t1,
                fontSize:13, lineHeight:1.6, whiteSpace:"pre-line" }}>
                {m.text}
              </div>
            </motion.div>
          ))}

          {/* Typing indicator */}
          {typing && (
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:30, height:30, borderRadius:10,
                background:`${T.accent}20`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <I d={ic.sparkles} s={14} c={T.accent} />
              </div>
              <div style={{ padding:"12px 16px", borderRadius:16, borderTopLeftRadius:4,
                background:T.sunken, boxShadow:T.card, display:"flex", gap:5 }}>
                {[0,1,2].map(i => (
                  <motion.div key={i} animate={{scale:[1,1.5,1]}}
                    transition={{duration:0.7, repeat:Infinity, delay:i*0.15}}
                    style={{ width:8, height:8, borderRadius:4, background:T.accent }} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sugerencias rápidas */}
        <div style={{ padding:"8px 16px", display:"flex", gap:8, overflowX:"auto",
          scrollbarWidth:"none", flexShrink:0 }}>
          {SUGGESTIONS.map(s => (
            <motion.button key={s} whileTap={{scale:0.92}} onClick={() => send(s)}
              style={{ flexShrink:0, padding:"8px 14px", borderRadius:20,
                border:`1px solid ${T.accent}35`, background:`${T.accent}10`,
                color:T.accent, fontSize:12, fontWeight:500, cursor:"pointer",
                fontFamily:"DM Sans", whiteSpace:"nowrap" }}>
              {s}
            </motion.button>
          ))}
        </div>

        {/* Input */}
        <div style={{ padding:"10px 16px 20px", display:"flex", gap:10,
          alignItems:"center", flexShrink:0, borderTop:`1px solid ${T.border}` }}>
          <button onClick={onColorEdit} style={{ width:40, height:40, borderRadius:12, border:"none",
            cursor:"pointer", background:T.sunken, boxShadow:T.btn, flexShrink:0,
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <I d={ic.mic} s={18} c={T.t3} />
          </button>
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key==="Enter" && send(input)}
            placeholder="Escribe o usa el micrófono..."
            style={{ flex:1, padding:"12px 16px", borderRadius:14, border:"none",
              background:T.sunken, boxShadow:T.inset, color:T.t1,
              fontSize:14, fontFamily:"DM Sans", outline:"none", caretColor:T.accent }} />
          <motion.button whileTap={{scale:0.88}} onClick={() => send(input)}
            style={{ width:44, height:44, borderRadius:13, border:"none", cursor:"pointer",
              flexShrink:0,
              background: input.trim()
                ? `linear-gradient(135deg,${T.accent},${T.accent}BB)`
                : T.sunken,
              boxShadow: input.trim() ? T.glow : T.btn,
              display:"flex", alignItems:"center", justifyContent:"center" }}>
            <I d={ic.send} s={18} c={input.trim() ? "#1C2130" : T.t3} />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────
// FAB — Floating Chat Button
// ─────────────────────────────────────────────────────────────────
function ChatFAB({ T, onClick }) {
  return (
    <motion.button
      whileTap={{scale:0.88}}
      onClick={onClick}
      initial={{scale:0}}
      animate={{scale:1}}
      transition={{type:"spring", damping:15, delay:0.5}}
      style={{
        position:"absolute", right:18, bottom:82,
        width:58, height:58, borderRadius:18,
        border:"none", cursor:"pointer",
        background:`linear-gradient(135deg,${T.accent},${T.accent}BB)`,
        boxShadow:`${T.btn}, ${T.glow}, 0 8px 24px rgba(0,0,0,0.3)`,
        display:"flex", alignItems:"center", justifyContent:"center",
        zIndex:50,
      }}>
      <I d={ic.sparkles} s={26} c="#1C2130" />
      {/* Pulse ring */}
      <motion.div
        animate={{ scale:[1,1.4,1], opacity:[0.6,0,0.6] }}
        transition={{ duration:2.5, repeat:Infinity }}
        style={{ position:"absolute", inset:-4, borderRadius:22,
          border:`2px solid ${T.accent}`, pointerEvents:"none" }} />
      {/* "IA" label */}
      <div style={{ position:"absolute", top:-8, right:-4,
        background:T.accent, borderRadius:8, padding:"2px 6px",
        fontSize:9, fontWeight:800, color:"#1C2130",
        boxShadow:`0 2px 8px ${T.accent}60` }}>
        IA
      </div>
    </motion.button>
  )
}

// ─────────────────────────────────────────────────────────────────
// COLOR EDITOR SHEET
// ─────────────────────────────────────────────────────────────────
function ColorSheet({ T, current, onSave, onClose }) {
  const [sel, setSel]     = useState(current)
  const [custom, setCustom] = useState("")
  const final = (custom && /^#[0-9A-Fa-f]{6}$/.test(custom)) ? custom : sel

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.65)",
        display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:200 }}
      onClick={e => e.target===e.currentTarget && onClose()}>
      <motion.div initial={{y:"100%"}} animate={{y:0}} exit={{y:"100%"}}
        transition={{type:"spring", damping:30, stiffness:350}}
        style={{ width:"100%", maxWidth:480, background:T.surface,
          borderRadius:"24px 24px 0 0", padding:"20px 20px 32px",
          boxShadow:"0 -8px 40px rgba(0,0,0,0.5)" }}>

        {/* Handle */}
        <div style={{ width:40, height:5, borderRadius:3,
          background:"rgba(255,255,255,0.15)", margin:"0 auto 20px" }} />

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
          <h3 style={{ fontFamily:"Bricolage Grotesque", fontSize:18, fontWeight:700, color:T.t1 }}>
            🎨 Personalizar color
          </h3>
          <motion.button whileTap={{scale:0.88}} onClick={onClose}
            style={{ width:36, height:36, borderRadius:10, border:"none", cursor:"pointer",
              background:T.sunken, boxShadow:T.btn,
              display:"flex", alignItems:"center", justifyContent:"center" }}>
            <I d={ic.x} s={16} c={T.t3} />
          </motion.button>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:18 }}>
          {PRESETS.map(opt => {
            const on = sel===opt.hex && !custom
            return (
              <motion.button key={opt.hex} whileTap={{scale:0.88}}
                onClick={() => { setSel(opt.hex); setCustom("") }}
                style={{ padding:"12px 6px", borderRadius:14, border:"none", cursor:"pointer",
                  background: on ? `${opt.hex}22` : T.bg,
                  boxShadow: on ? T.press : T.btn,
                  outline: on ? `2px solid ${opt.hex}` : "none", outlineOffset:2,
                  display:"flex", flexDirection:"column", alignItems:"center", gap:7 }}>
                <div style={{ width:34, height:34, borderRadius:10, background:opt.hex,
                  boxShadow:`0 3px 8px ${opt.hex}60`,
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  {on && <I d={ic.check} s={14} c="#fff" />}
                </div>
                <span style={{ fontSize:9, color: on ? opt.hex : T.t3, fontWeight: on?700:400 }}>
                  {opt.name}
                </span>
              </motion.button>
            )
          })}
        </div>

        <div style={{ marginBottom:18 }}>
          <p style={{ fontSize:11, color:T.t3, marginBottom:8 }}>Color personalizado</p>
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <div style={{ width:44, height:44, borderRadius:12, flexShrink:0, boxShadow:T.btn,
              background:(custom && /^#[0-9A-Fa-f]{6}$/.test(custom)) ? custom : T.sunken }} />
            <input value={custom} onChange={e => { setCustom(e.target.value); setSel("") }}
              placeholder="#F0B429"
              style={{ flex:1, padding:"12px 14px", borderRadius:14, border:"none",
                background:T.bg, boxShadow:T.inset, color:T.t1,
                fontSize:14, fontFamily:"JetBrains Mono", outline:"none" }} />
          </div>
        </div>

        <Btn T={T} variant="primary" full size="lg"
          onClick={() => { onSave(final); onClose() }}>
          <I d={ic.check} s={16} c="#1C2130" />
          Aplicar color
        </Btn>
      </motion.div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────
// SCREENS
// ─────────────────────────────────────────────────────────────────
function Dashboard({ T, onOpenScreen, onGoTo, stockList, deudaList, salesList }) {
  const fmtCLP = n => new Intl.NumberFormat("es-CL",{style:"currency",currency:"CLP",maximumFractionDigits:0}).format(n)

  // ── Reloj en tiempo real ──────────────────────────────────────
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  const hora = now.toLocaleTimeString("es-CL", {hour:"2-digit", minute:"2-digit", second:"2-digit"})
  const greeting = now.getHours() < 12 ? "Buenos días ☀️"
    : now.getHours() < 20 ? "Buenas tardes 🌤️"
    : "Buenas noches 🌙"
  const fechaStr = now.toLocaleDateString("es-CL", {weekday:"long", day:"numeric", month:"long", year:"numeric"})

  // ── Derived data from real global state ──────────────────────
  const _stock   = stockList  || []
  const _deudas  = deudaList  || []
  const _sales   = salesList  || []

  const ventasHoy   = _sales.reduce((s,v)=>s+v.total,0)
  const txHoy       = _sales.length
  const stockCrit   = _stock.filter(p=>p.s<=p.min||p.st==="critical"||p.st==="expired")
  const totalCalle  = _deudas.reduce((s,d)=>s+d.b,0)
  const deudoresN   = _deudas.length

  // Top products: from sales data (most sold)
  const soldMap = {}
  _sales.forEach(v=>(v.items||[]).forEach(it=>{
    // it puede ser string, {name,qty,price} o {n,q,p}
    const k = typeof it==="string" ? it : (it.name||it.n||"")
    if(!k) return
    if(!soldMap[k]) soldMap[k]={n:k,u:0,rev:0}
    soldMap[k].u += typeof it==="string" ? 1 : (it.qty||it.q||1)
    soldMap[k].rev += typeof it==="string" ? 0 : (it.price||it.p||0)*(it.qty||it.q||1)
  }))
  const tops = Object.values(soldMap).length>0
    ? Object.values(soldMap).sort((a,b)=>b.u-a.u).slice(0,5).map((p,i,arr)=>({
        n:p.n, u:p.u, r:fmtCLP(p.rev||0),
        p:Math.round((p.u/arr[0].u)*90)||10
      }))
    : [
        {n:"Coca-Cola 2L", u:24, r:fmtCLP(41760), p:90},
        {n:"Pan Molde",    u:18, r:fmtCLP(32400), p:70},
        {n:"Leche 1L",     u:15, r:fmtCLP(18750), p:57},
        {n:"Yogurt 200g",  u:12, r:fmtCLP(14400), p:46},
        {n:"Sprite 1.5L",  u:9,  r:fmtCLP(9900),  p:34},
      ]

  const methodColor={Efectivo:T.mint,Tarjeta:T.blue,Transfer:T.accent,Fiado:T.danger}
  const recents = _sales.slice(0,4).map((v,i)=>({
    id:`#${v.id||1800+i}`,
    met:v.method,
    tot:fmtCLP(v.total),
    c:methodColor[v.method]||T.accent
  }))

  const kpis = [
    { l:"Ventas hoy",    v:ventasHoy>0?fmtCLP(ventasHoy):"$0",
      sub:txHoy>0?`${txHoy} transacciones`:"Sin ventas aún",  c:T.accent, icon:ic.trend, up:ventasHoy>0 },
    { l:"Transacciones", v:String(txHoy),
      sub:txHoy>0?"del día":"Aún sin ventas",                  c:T.mint,   icon:ic.bar,   up:txHoy>0 },
    { l:"Stock crítico", v:String(stockCrit.length),
      sub:stockCrit.length>0?"requieren atención":"Todo OK ✅", c:stockCrit.length>0?T.danger:T.mint, icon:ic.alert, up:false },
    { l:"En calle",      v:totalCalle>0?fmtCLP(totalCalle):"$0",
      sub:`${deudoresN} deudor${deudoresN!==1?"es":""}`,       c:T.blue,   icon:ic.money, up:false },
  ]

  return (
    <div style={{padding:"16px", display:"flex", flexDirection:"column", gap:14}}>
      {/* Greeting + Meta */}
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start"}}>
        <div>
          <div style={{fontSize:20, fontWeight:700, color:T.t1, fontFamily:"Bricolage Grotesque"}}>
            {greeting}
          </div>
          <div style={{fontSize:11, color:T.t3, marginTop:2, textTransform:"capitalize"}}>
            {fechaStr}
          </div>
          {/* Hora grande */}
          <div style={{
            fontSize:38, fontWeight:900, color:T.accent,
            fontFamily:"JetBrains Mono", lineHeight:1, marginTop:6,
            letterSpacing:"-1px",
            textShadow:`0 0 20px ${T.accent}50`
          }}>
            {hora.slice(0,5)}
            <span style={{fontSize:18, fontWeight:700, color:T.t3, marginLeft:4}}>
              {hora.slice(5)}
            </span>
          </div>
        </div>
        <Card T={T} accent style={{padding:"10px 14px", minWidth:148}}>
          <div style={{display:"flex", justifyContent:"space-between", marginBottom:6}}>
            <span style={{fontSize:10, color:T.accent, fontWeight:600}}>🎯 Meta</span>
            <span style={{fontSize:10, color:T.t3}}>$200k</span>
          </div>
          <div style={{height:6, borderRadius:3, background:T.sunken, marginBottom:5}}>
            <motion.div initial={{width:0}} animate={{width:"94%"}} transition={{duration:1.2, delay:0.3}}
              style={{height:"100%", borderRadius:3,
                background:`linear-gradient(90deg,${T.accent},${T.mint})`}} />
          </div>
          <div style={{fontSize:11, color:T.accent, fontWeight:700}}>94% completada 🔥</div>
        </Card>
      </div>

      {/* KPIs 2x2 */}
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}}>
        {kpis.map((k,i) => (
          <motion.div key={k.l} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}}>
            <Card T={T} style={{border:`1px solid ${k.c}20`}}>
              <div style={{display:"flex", justifyContent:"space-between", marginBottom:10}}>
                <div style={{width:32, height:32, borderRadius:9, background:`${k.c}20`,
                  display:"flex", alignItems:"center", justifyContent:"center"}}>
                  <I d={k.icon} s={14} c={k.c} />
                </div>
                <Tag T={T} color={k.up?T.mint:T.danger} bg={k.up?`${T.mint}20`:`${T.danger}20`}>
                  {k.up ? "▲ sube" : "▼ baja"}
                </Tag>
              </div>
              <div style={{fontSize:22, fontWeight:900, color:k.c, fontFamily:"JetBrains Mono", marginBottom:2}}>{k.v}</div>
              <div style={{fontSize:11, color:T.t3}}>{k.l}</div>
              <div style={{fontSize:10, color:k.up?T.mint:T.danger, marginTop:2}}>{k.sub}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ── BOTÓN NUEVA VENTA — prominente ─────────── */}
      <motion.button
        whileTap={{scale:0.97}}
        onClick={() => onGoTo("POS")}
        style={{width:"100%",padding:"18px 20px",borderRadius:20,border:"none",cursor:"pointer",
          background:`linear-gradient(135deg,${T.accent},${T.accent}BB,${T.mint}60)`,
          boxShadow:`0 6px 24px ${T.accent}50, 0 2px 8px rgba(0,0,0,0.3)`,
          display:"flex",alignItems:"center",gap:14,textAlign:"left",
          position:"relative",overflow:"hidden"}}>
        {/* Glow detrás */}
        <div style={{position:"absolute",top:-20,right:-20,width:100,height:100,
          borderRadius:50,background:"rgba(255,255,255,0.08)",pointerEvents:"none"}}/>
        <div style={{width:52,height:52,borderRadius:16,
          background:"rgba(28,33,48,0.25)",flexShrink:0,
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>
          🛒
        </div>
        <div style={{flex:1}}>
          <div style={{fontSize:18,fontWeight:800,color:"#1C2130",fontFamily:"Bricolage Grotesque",
            lineHeight:1.1,marginBottom:3}}>
            Nueva Venta
          </div>
          <div style={{fontSize:12,color:"rgba(28,33,48,0.65)"}}>
            Efectivo · Tarjeta · Transfer · Fiado
          </div>
        </div>
        <div style={{fontSize:22,color:"rgba(28,33,48,0.5)"}}>→</div>
      </motion.button>

      {/* Top productos */}
      <Card T={T}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14}}>
          <span style={{fontSize:14, fontWeight:700, color:T.t1}}>Top productos hoy</span>
          <span style={{fontSize:11, color:T.accent, cursor:"pointer",
            fontWeight:600}} onClick={() => onGoTo("Inventario")}>Ver todos →</span>
        </div>
        {tops.map((p,i) => (
          <div key={p.n} style={{display:"flex", alignItems:"center", gap:10,
            marginBottom: i<tops.length-1 ? 12 : 0}}>
            <span style={{fontSize:10, color:T.t3, width:14, textAlign:"center",
              fontFamily:"monospace"}}>{i+1}</span>
            <div style={{flex:1}}>
              <div style={{display:"flex", justifyContent:"space-between", marginBottom:5}}>
                <span style={{fontSize:12, color:T.t2, fontWeight:500}}>{p.n}</span>
                <div style={{display:"flex", gap:10}}>
                  <span style={{fontSize:11, color:T.t3}}>{p.u}u</span>
                  <span style={{fontSize:12, color:T.accent, fontFamily:"JetBrains Mono", fontWeight:700}}>{p.r}</span>
                </div>
              </div>
              <div style={{height:5, borderRadius:3, background:T.sunken, boxShadow:T.inset}}>
                <motion.div initial={{width:0}} animate={{width:`${p.p}%`}} transition={{duration:0.9, delay:i*0.1}}
                  style={{height:"100%", borderRadius:3,
                    background: i===0 ? `linear-gradient(90deg,${T.accent},${T.mint})` : `${T.accent}55`}} />
              </div>
            </div>
          </div>
        ))}
      </Card>

      {/* Últimas ventas */}
      <Card T={T}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12}}>
          <span style={{fontSize:13, fontWeight:700, color:T.t1}}>Últimas ventas</span>
          <div style={{width:8, height:8, borderRadius:4, background:T.mint,
            boxShadow:`0 0 8px ${T.mint}`}} />
        </div>
        {recents.map((v,i) => (
          <div key={v.id} style={{display:"flex", alignItems:"center", gap:10,
            padding:"9px 0", borderBottom: i<recents.length-1 ? `1px solid ${T.border}` : "none"}}>
            <div style={{width:8, height:8, borderRadius:4, background:v.c, flexShrink:0}} />
            <span style={{fontSize:11, color:T.t3, fontFamily:"monospace", flex:1}}>{v.id}</span>
            <span style={{fontSize:11, color:T.t3}}>{v.met}</span>
            <span style={{fontSize:13, fontWeight:700, color:v.c, fontFamily:"JetBrains Mono"}}>{v.tot}</span>
          </div>
        ))}
      </Card>

      {/* Stock crítico — muestra datos reales */}
      {stockCrit.length>0&&(
        <Card T={T} style={{background:`${T.danger}0C`, border:`1px solid ${T.danger}28`}}>
          <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:10}}>
            <I d={ic.alert} s={16} c={T.danger} />
            <span style={{fontSize:13, fontWeight:700, color:T.danger}}>
              ⚠️ Stock crítico ({stockCrit.length})
            </span>
          </div>
          {stockCrit.slice(0,4).map(p => (
            <div key={p.sku||p.n} style={{display:"flex", alignItems:"center", gap:8, marginBottom:7}}>
              <div style={{width:6, height:6, borderRadius:3, background:T.danger, flexShrink:0}} />
              <span style={{fontSize:12, color:T.t2}}>
                {p.n} — {p.s===0?"sin stock":`${p.s} u.`}{p.st==="expired"?" ⚠️ VENCIDO":""}
              </span>
            </div>
          ))}
          {stockCrit.length>4&&(
            <div style={{fontSize:11,color:T.t3,marginBottom:4}}>+{stockCrit.length-4} más</div>
          )}
          <Btn T={T} variant="neu" full size="sm"
            style={{marginTop:6, color:T.danger}}
            onClick={() => onGoTo("Inventario")}>
            Ver inventario completo →
          </Btn>
        </Card>
      )}
      {stockCrit.length===0&&_stock.length>0&&(
        <Card T={T} style={{background:`rgba(6,214,160,0.06)`, border:`1px solid rgba(6,214,160,0.2)`}}>
          <div style={{display:"flex", alignItems:"center", gap:8}}>
            <span style={{fontSize:16}}>✅</span>
            <span style={{fontSize:13, fontWeight:600, color:T.mint}}>Todo el stock está OK</span>
          </div>
        </Card>
      )}

      {/* Accesos rápidos */}
      <Card T={T}>
        <div style={{fontSize:13,fontWeight:700,color:T.t1,marginBottom:14}}>⚡ Acceso rápido</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[
            {e:"🔒",l:"Cierre de caja",       s:"cierre"},
            {e:"💸",l:"Libro de fiados",       s:"deudores-lista"},
            {e:"📋",l:"Órdenes de compra",      s:"ordenes"},
            {e:"📊",l:"Reportes",               s:"reportes"},
            {e:"⏰",l:"Vencimientos",            s:"vencimientos"},
            {e:"🚴",l:"Delivery",               s:"delivery"},
            {e:"📄",l:"Presupuestos",           s:"presupuestos"},
            {e:"💸",l:"Caja chica",             s:"caja-chica"},
          ].map(item => (
            <motion.button key={item.s} whileTap={{scale:0.94}}
              onClick={() => onOpenScreen(item.s)}
              style={{padding:"14px 12px",borderRadius:16,border:"none",cursor:"pointer",
                background:T.surface,boxShadow:T.btn,
                display:"flex",flexDirection:"column",gap:8,textAlign:"left"}}>
              <span style={{fontSize:26}}>{item.e}</span>
              <span style={{fontSize:12,fontWeight:600,color:T.t2,lineHeight:1.3}}>{item.l}</span>
            </motion.button>
          ))}
        </div>
      </Card>

      <div style={{height:80}}/>
    </div>
  )
}

function POS({ T, onConfirm, contactList, onDeudaAdd, onContactAdd, stockList:posStock }) {
  const fmtCLP = n => new Intl.NumberFormat("es-CL",{style:"currency",currency:"CLP",maximumFractionDigits:0}).format(n)
  const [paid, setPaid]         = useState("")
  const [method, setMethod]     = useState("Efectivo")
  const [cart, setCart]         = useState([])
  const [stockAlert, setStockAlert]     = useState(null)
  const [activeCategory, setActiveCategory] = useState("Todos")
  const [showFiadoSheet,   setShowFiadoSheet]   = useState(false)
  const [fiadoClient,      setFiadoClient]      = useState(null)
  const [fiadoSearch,      setFiadoSearch]      = useState("")
  const [showNuevoCliente, setShowNuevoCliente] = useState(false)
  const [ncNombre,   setNcNombre]   = useState("")
  const [ncTelefono, setNcTelefono] = useState("")
  const [ncEmail,    setNcEmail]    = useState("")
  const [ncTelegram, setNcTelegram] = useState("")
  const [ncNotas,    setNcNotas]    = useState("")

  // Única fuente de verdad: stockList del App root
  const prods = (posStock || []).map(p => ({
    id:  p.id,
    n:   p.n,
    p:   p.p,
    e:   p.e || "📦",
    cat: p.cat,
    s:   p.s,
    min: p.min,
    st:  p.st,
  }))

  const CATS_POS = ["Todos", ...new Set(prods.map(p => p.cat).filter(Boolean))]

  const filteredProds = activeCategory === "Todos"
    ? prods
    : prods.filter(p => p.cat === activeCategory)

  const addToCart = (prod) => {
    setCart(prev => {
      const ex = prev.find(i => i.n === prod.n)
      const currentQ = ex ? ex.q : 0
      const maxStock = prod.s || 999
      if (currentQ >= maxStock) {
        setStockAlert({name: prod.n, stock: maxStock})
        setTimeout(() => setStockAlert(null), 2800)
        return prev
      }
      if (ex) return prev.map(i => i.n===prod.n ? {...i,q:i.q+1} : i)
      // Guardar id del producto para deducción precisa de stock
      return [...prev, {...prod, id:prod.id, q:1}]
    })
  }
  const removeFromCart = (name) => setCart(prev => prev.filter(i => i.n !== name))
  const updateQty = (name, delta) => {
    setCart(prev => {
      const prod = prev.find(i => i.n === name)
      if (!prod) return prev
      if (delta > 0 && prod.q >= (prod.s || 999)) {
        setStockAlert({name, stock: prod.s || 999})
        setTimeout(() => setStockAlert(null), 2800)
        return prev
      }
      return prev.map(i => i.n===name
        ? {...i, q:Math.max(0,i.q+delta)}
        : i
      ).filter(i => i.q > 0)
    })
  }

  // Use cart as items for display
  const items = cart
  const total = (Array.isArray(cart)?cart:[]).reduce((s,i) => s+(i.p||0)*(i.q||1), 0)
  const paidN = parseInt(paid.replace(/\D/g,"")||"0")
  const change = paidN - total
  const activeMethod = method

  return (
    <div style={{padding:"16px", display:"flex", flexDirection:"column", gap:14}}>

      {/* Toast de stock agotado */}
      <AnimatePresence>
        {stockAlert && (
          <motion.div
            initial={{opacity:0, y:-20, scale:0.95}}
            animate={{opacity:1, y:0,  scale:1}}
            exit={{opacity:0,   y:-20, scale:0.95}}
            style={{position:"fixed",top:80,left:16,right:16,
              zIndex:300,
              background:`linear-gradient(135deg,${T.danger},${T.danger}CC)`,
              borderRadius:16,padding:"13px 16px",
              boxShadow:`0 8px 28px ${T.danger}50`,
              display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:24}}>⚠️</span>
            <div>
              <div style={{fontSize:13,fontWeight:700,color:"#fff"}}>
                Stock insuficiente
              </div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.85)"}}>
                {stockAlert.name}: solo hay {stockAlert.stock} unidad{stockAlert.stock!==1?"es":""} disponible{stockAlert.stock!==1?"s":""}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categorías */}
      <div style={{display:"flex", gap:8, overflowX:"auto", scrollbarWidth:"none"}}>
        {CATS_POS.map((cat) => (
          <motion.button key={cat} whileTap={{scale:0.92}}
            onClick={() => setActiveCategory(cat)}
            style={{flexShrink:0, padding:"9px 18px", borderRadius:12, border:"none", cursor:"pointer",
              fontSize:13, fontWeight:500,
              background: cat===activeCategory ? `linear-gradient(135deg,${T.accent},${T.accent}BB)` : T.surface,
              color: cat===activeCategory ? "#1C2130" : T.t3,
              boxShadow: cat===activeCategory ? `${T.press}, 0 0 14px ${T.accent}40` : T.btn}}>
            {cat}
          </motion.button>
        ))}
      </div>

      {/* Productos 2 col */}
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10}}>
        {filteredProds.map(p => {
          const inCart = cart.find(i => i.n===p.n)
          const low = p.s <= 5
          return (
            <motion.button key={p.n} whileTap={{scale:0.93}}
              onClick={() => p.s > 0 ? addToCart(p) : (setStockAlert({name:p.n,stock:0}),setTimeout(()=>setStockAlert(null),2800))}
              style={{padding:"14px 12px", borderRadius:16, border:"none",
                cursor: p.s > 0 ? "pointer" : "not-allowed",
                background: p.s===0 ? `${T.danger}08` : inCart ? `${T.accent}18` : T.surface,
                boxShadow: inCart ? T.press : T.btn,
                outline: p.s===0 ? `1px solid ${T.danger}25` : inCart ? `1.5px solid ${T.accent}40` : "none",
                opacity: p.s===0 ? 0.65 : 1,
                textAlign:"left", display:"flex", flexDirection:"column", gap:8}}>
              <span style={{fontSize:30}}>{p.e}</span>
              <span style={{fontSize:13, fontWeight:700, color:T.t1, lineHeight:1.3}}>{p.n}</span>
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                <span style={{fontSize:15, fontWeight:800, color:T.accent, fontFamily:"JetBrains Mono"}}>
                  {fmtCLP(p.p)}
                </span>
                <span style={{fontSize:10, padding:"3px 8px", borderRadius:8, fontWeight:600,
                  background: low ? `${T.danger}20` : `${T.mint}18`,
                  color: low ? T.danger : T.mint}}>
                  {inCart
                    ? `✓${inCart.q}/${p.s}`
                    : `${p.s}u`
                  }
                </span>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Carrito */}
      <Card T={T} accent>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12}}>
          <span style={{fontSize:14, fontWeight:700, color:T.t1}}>🛒 Carrito</span>
          <span style={{fontSize:11, padding:"3px 10px", borderRadius:20,
            background:T.sunken, boxShadow:T.inset, color:T.t3}}>{items.length} productos</span>
        </div>
        {items.map((item,i) => (
          <div key={item.n} style={{display:"flex", alignItems:"center", gap:10,
            padding:"10px 0", borderBottom: i<items.length-1 ? `1px solid ${T.border}` : "none"}}>
            <span style={{flex:1, fontSize:13, fontWeight:500, color:T.t1}}>{item.n}</span>
            <div style={{display:"flex", alignItems:"center", gap:8}}>
              <button onClick={() => updateQty(item.n, -1)}
                style={{width:28, height:28, borderRadius:8, border:"none", cursor:"pointer",
                background:T.sunken, boxShadow:T.inset, color:T.t2, fontSize:16,
                display:"flex", alignItems:"center", justifyContent:"center"}}>−</button>
              <span style={{fontSize:15, fontWeight:700, color:T.t1, minWidth:22, textAlign:"center"}}>
                {item.q}
              </span>
              <button onClick={() => updateQty(item.n, 1)}
                style={{width:28, height:28, borderRadius:8, border:"none", cursor:"pointer",
                background:`${T.accent}25`, boxShadow:T.btn, color:T.accent, fontSize:16,
                display:"flex", alignItems:"center", justifyContent:"center"}}>+</button>
            </div>
            <span style={{fontSize:13, fontWeight:700, color:T.accent,
              fontFamily:"JetBrains Mono", minWidth:60, textAlign:"right"}}>
              {fmtCLP(item.p*item.q)}
            </span>
          </div>
        ))}
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center",
          marginTop:12, paddingTop:12, borderTop:`1px solid ${T.border}`}}>
          <span style={{fontSize:16, fontWeight:700, color:T.t1}}>TOTAL</span>
          <span style={{fontSize:28, fontWeight:900, color:T.accent, fontFamily:"JetBrains Mono"}}>
            {fmtCLP(total)}
          </span>
        </div>
      </Card>

      {/* Pago */}
      <Card T={T}>
        <div style={{fontSize:13, fontWeight:700, color:T.t1, marginBottom:12}}>💳 Forma de pago</div>
        <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:16}}>
          {[{l:"💵 Efectivo",k:"Efectivo"},{l:"💳 Tarjeta",k:"Tarjeta"},
            {l:"📱 Transfer",k:"Transfer"},{l:"📝 Fiado",k:"Fiado"}].map(m => {
            const on = method===m.k
            return (
              <motion.button key={m.k} whileTap={{scale:0.9}} onClick={() => setMethod(m.k)}
                style={{padding:"10px 6px", borderRadius:12, border:"none", cursor:"pointer",
                  background: on ? `linear-gradient(135deg,${T.accent},${T.accent}BB)` : T.surface,
                  color: on ? "#1C2130" : T.t3,
                  boxShadow: on ? `${T.press}, 0 0 12px ${T.accent}40` : T.btn,
                  fontSize:11, fontWeight: on?700:400, lineHeight:1.4}}>
                {m.l}
              </motion.button>
            )
          })}
        </div>

        {method==="Efectivo" && (
          <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}>
            <div style={{fontSize:12, color:T.t3, marginBottom:8}}>Monto recibido en efectivo</div>
            <input value={paid} onChange={e => setPaid(e.target.value.replace(/\D/g,""))}
              inputMode="numeric" placeholder="$0"
              style={{width:"100%", padding:"16px", borderRadius:14, border:"none",
                background:T.sunken, boxShadow:T.inset,
                fontSize:28, fontWeight:900, color:T.t1, fontFamily:"JetBrains Mono",
                textAlign:"right", caretColor:T.accent, outline:"none",
                boxSizing:"border-box", marginBottom:12}} />
            <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:14}}>
              {[5000,10000,20000,50000].map(a => (
                <motion.button key={a} whileTap={{scale:0.9}} onClick={() => setPaid(String(a))}
                  style={{padding:"10px 4px", borderRadius:11, border:"none", cursor:"pointer",
                    fontSize:12, fontWeight:700,
                    background: paid===String(a) ? `${T.accent}25` : T.surface,
                    color: paid===String(a) ? T.accent : T.t3,
                    boxShadow: paid===String(a) ? T.press : T.btn,
                    outline: paid===String(a) ? `1.5px solid ${T.accent}50` : "none"}}>
                  {fmtCLP(a)}
                </motion.button>
              ))}
            </div>
            <motion.div animate={{
              background: change>0 ? `${T.mint}12` : change===0&&paidN>0 ? `${T.blue}12` : T.sunken,
            }} style={{borderRadius:16, padding:"16px", textAlign:"center", marginBottom:14,
              boxShadow: change>0 ? `0 0 20px ${T.mint}30` : T.inset,
              border:`1px solid ${change>0 ? T.mint+"35" : change===0&&paidN>0 ? T.blue+"35" : "transparent"}`}}>
              {paidN===0 ? (
                <span style={{fontSize:13, color:T.t3}}>👆 Ingresa el monto recibido</span>
              ) : change>0 ? (
                <>
                  <div style={{fontSize:11, fontWeight:700, color:T.mint, letterSpacing:"0.1em", marginBottom:4}}>
                    💵 VUELTO A ENTREGAR
                  </div>
                  <div style={{fontSize:36, fontWeight:900, color:T.mint, fontFamily:"JetBrains Mono"}}>
                    {fmtCLP(change)}
                  </div>
                </>
              ) : change===0 ? (
                <div style={{fontSize:16, fontWeight:700, color:T.blue}}>✅ Pago exacto</div>
              ) : (
                <>
                  <div style={{fontSize:11, fontWeight:700, color:T.danger, letterSpacing:"0.1em", marginBottom:4}}>
                    ⚠️ FALTA PAGAR
                  </div>
                  <div style={{fontSize:32, fontWeight:900, color:T.danger, fontFamily:"JetBrains Mono"}}>
                    {fmtCLP(Math.abs(change))}
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}

        {/* Si el método es Fiado, mostrar cliente seleccionado o botón para elegir */}
        {method==="Fiado" && (
          <div style={{marginBottom:12}}>
            <div style={{fontSize:11,color:T.t3,marginBottom:8,fontWeight:600,
              textTransform:"uppercase",letterSpacing:"0.06em"}}>
              📝 Cliente del fiado
            </div>
            {fiadoClient ? (
              <div style={{display:"flex",alignItems:"center",gap:10,
                padding:"12px 14px",borderRadius:14,
                background:`${T.accent}12`,border:`1px solid ${T.accent}30`}}>
                <div style={{width:36,height:36,borderRadius:11,
                  background:`${T.accent}25`,flexShrink:0,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:16,fontWeight:700,color:T.accent}}>
                  {fiadoClient.name[0]}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:700,color:T.t1}}>{fiadoClient.name}</div>
                  <div style={{fontSize:11,color:T.t3}}>{fiadoClient.phone||"Sin teléfono"}</div>
                </div>
                <button onClick={()=>setFiadoClient(null)}
                  style={{width:30,height:30,borderRadius:9,border:"none",cursor:"pointer",
                    background:`${T.danger}18`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <I d={ic.x} s={13} c={T.danger}/>
                </button>
              </div>
            ) : (
              <button onClick={()=>setShowFiadoSheet(true)}
                style={{width:"100%",padding:"13px",borderRadius:14,border:`1.5px dashed ${T.accent}50`,
                  cursor:"pointer",background:`${T.accent}08`,color:T.accent,
                  fontSize:13,fontWeight:600,fontFamily:"DM Sans",
                  display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                <I d={ic.plus} s={15} c={T.accent}/>
                Seleccionar cliente para el fiado
              </button>
            )}
          </div>
        )}

        <Btn T={T} variant="primary" full size="lg"
          onClick={()=>{
            if(method==="Fiado" && !fiadoClient){
              setShowFiadoSheet(true)
              return
            }
            onConfirm(total,{
              method:activeMethod,
              items:items.map(i=>({id:i.id,name:i.n,qty:i.q,price:i.p})),
              fiadoClient: method==="Fiado" ? fiadoClient : null,
            })
            if(method==="Fiado" && fiadoClient && onDeudaAdd){
              onDeudaAdd({
                name:fiadoClient.name,
                phone:fiadoClient.phone||"",
                amount:total,
                itemsList:items.map(i=>i.n),
                dueDate:null,
              })
            }
          }}>
          <I d={ic.check} s={18} c="#1C2130" />
          {method==="Fiado" && !fiadoClient
            ? "👆 Selecciona cliente primero"
            : `Confirmar — ${fmtCLP(total)}`}
        </Btn>
      </Card>
      <div style={{height:80}}/>

      {/* ── Sheet selector cliente fiado ─────────────────── */}
      <AnimatePresence>
        {showFiadoSheet && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.72)",
              display:"flex",alignItems:"flex-end",justifyContent:"center",
              zIndex:200,backdropFilter:"blur(4px)"}}
            onClick={e=>e.target===e.currentTarget&&setShowFiadoSheet(false)}>
            <motion.div initial={{y:"100%"}} animate={{y:0}} exit={{y:"100%"}}
              transition={{type:"spring",damping:30,stiffness:350}}
              style={{width:"100%",maxWidth:480,background:T.surface,
                borderRadius:"24px 24px 0 0",
                boxShadow:"0 -8px 40px rgba(0,0,0,0.5)",
                display:"flex",flexDirection:"column",maxHeight:"80vh"}}>

              {/* Handle + header */}
              <div style={{padding:"16px 20px 12px",borderBottom:`1px solid ${T.border}`,flexShrink:0}}>
                <div style={{width:40,height:5,borderRadius:3,
                  background:"rgba(255,255,255,0.15)",margin:"0 auto 14px"}}/>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <div style={{fontSize:16,fontWeight:700,color:T.t1,fontFamily:"Bricolage Grotesque"}}>
                    📝 ¿A quién va el fiado?
                  </div>
                  <button onClick={()=>{setShowNuevoCliente(true);setShowFiadoSheet(false)}}
                    style={{padding:"9px 16px",borderRadius:11,border:"none",cursor:"pointer",
                      background:`linear-gradient(135deg,${T.accent},${T.accent}CC)`,
                      color:"#1C2130",fontSize:12,fontWeight:700,
                      display:"flex",alignItems:"center",gap:6,
                      boxShadow:`0 4px 14px ${T.accent}50`}}>
                    <I d={ic.plus} s={14} c="#1C2130"/>+ Nuevo cliente
                  </button>
                </div>
                {/* Buscador */}
                <div style={{display:"flex",alignItems:"center",gap:8,
                  padding:"10px 14px",borderRadius:12,background:T.bg,boxShadow:T.inset}}>
                  <I d={ic.search} s={14} c={T.t3}/>
                  <input value={fiadoSearch} onChange={e=>setFiadoSearch(e.target.value)}
                    placeholder="Buscar cliente por nombre..." autoFocus
                    style={{flex:1,border:"none",background:"transparent",color:T.t1,
                      fontSize:13,fontFamily:"DM Sans",outline:"none",caretColor:T.accent}}/>
                  {fiadoSearch&&(
                    <button onClick={()=>setFiadoSearch("")}
                      style={{width:18,height:18,borderRadius:9,border:"none",cursor:"pointer",
                        background:`${T.danger}20`,color:T.danger,fontSize:11,
                        display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
                  )}
                </div>
              </div>

              {/* Lista de clientes */}
              <div style={{flex:1,overflowY:"auto",padding:"12px 20px 8px",
                display:"flex",flexDirection:"column",gap:8}}>
                {(contactList||[])
                  .filter(cl=>cl.type==="customer")
                  .filter(cl=>cl.name.toLowerCase().includes(fiadoSearch.toLowerCase()))
                  .map(cl=>(
                    <button key={cl.id}
                      onClick={()=>{setFiadoClient(cl);setShowFiadoSheet(false);setFiadoSearch("")}}
                      style={{padding:"13px 16px",borderRadius:14,border:"none",cursor:"pointer",
                        background:fiadoClient?.id===cl.id?`${T.accent}18`:T.surface,
                        boxShadow:fiadoClient?.id===cl.id?T.press:T.btn,
                        outline:fiadoClient?.id===cl.id?`1.5px solid ${T.accent}40`:"none",
                        display:"flex",alignItems:"center",gap:12,textAlign:"left"}}>
                      <div style={{width:40,height:40,borderRadius:12,flexShrink:0,
                        background:`${T.accent}18`,
                        display:"flex",alignItems:"center",justifyContent:"center",
                        fontSize:16,fontWeight:800,color:T.accent}}>
                        {cl.name[0]}
                      </div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:14,fontWeight:600,color:T.t1}}>{cl.name}</div>
                        <div style={{fontSize:11,color:T.t3,marginTop:2}}>
                          {cl.phone||"Sin teléfono"}
                          {cl.balance>0&&` · Deuda: ${fmtCLP(cl.balance)}`}
                          {cl.email&&` · ${cl.email}`}
                        </div>
                      </div>
                      {fiadoClient?.id===cl.id&&<I d={ic.check} s={16} c={T.accent}/>}
                    </button>
                  ))}
                {/* Sin resultados */}
                {(contactList||[]).filter(cl=>cl.type==="customer"
                  &&cl.name.toLowerCase().includes(fiadoSearch.toLowerCase())).length===0&&(
                  <div style={{textAlign:"center",padding:"24px 20px"}}>
                    <div style={{fontSize:32,marginBottom:8}}>🔍</div>
                    <div style={{fontSize:13,fontWeight:600,color:T.t1,marginBottom:4}}>
                      {fiadoSearch?`Sin resultados para "${fiadoSearch}"`:"No hay clientes aún"}
                    </div>
                    <button onClick={()=>{setShowNuevoCliente(true);setShowFiadoSheet(false)}}
                      style={{marginTop:8,padding:"10px 20px",borderRadius:12,border:"none",cursor:"pointer",
                        background:`linear-gradient(135deg,${T.accent},${T.accent}CC)`,
                        color:"#1C2130",fontSize:13,fontWeight:700}}>
                      ➕ Crear cliente nuevo
                    </button>
                  </div>
                )}
                {/* ── Botón agregar nuevo cliente — SIEMPRE VISIBLE ── */}
                <button onClick={()=>{setShowNuevoCliente(true);setShowFiadoSheet(false)}}
                  style={{width:"100%",padding:"14px 16px",borderRadius:14,
                    border:`1.5px dashed ${T.accent}50`,cursor:"pointer",
                    background:`${T.accent}08`,
                    display:"flex",alignItems:"center",justifyContent:"center",gap:10,
                    marginTop:4}}>
                  <div style={{width:32,height:32,borderRadius:10,
                    background:`linear-gradient(135deg,${T.accent},${T.accent}BB)`,
                    display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <I d={ic.plus} s={15} c="#1C2130"/>
                  </div>
                  <div style={{textAlign:"left"}}>
                    <div style={{fontSize:13,fontWeight:700,color:T.accent}}>
                      ➕ Agregar nuevo cliente
                    </div>
                    <div style={{fontSize:11,color:T.t3}}>
                      Se guarda en Contactos y queda disponible para siempre
                    </div>
                  </div>
                </button>
                <div style={{height:12}}/>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Sheet NUEVO CLIENTE desde POS ────────────────── */}
      <AnimatePresence>
        {showNuevoCliente && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",
              display:"flex",alignItems:"flex-end",justifyContent:"center",
              zIndex:201,backdropFilter:"blur(5px)"}}
            onClick={e=>e.target===e.currentTarget&&setShowNuevoCliente(false)}>
            <motion.div initial={{y:"100%"}} animate={{y:0}} exit={{y:"100%"}}
              transition={{type:"spring",damping:30,stiffness:350}}
              style={{width:"100%",maxWidth:480,background:T.surface,
                borderRadius:"24px 24px 0 0",
                boxShadow:"0 -8px 40px rgba(0,0,0,0.5)",
                display:"flex",flexDirection:"column",maxHeight:"90vh"}}>

              {/* Handle */}
              <div style={{padding:"16px 20px 14px",borderBottom:`1px solid ${T.border}`,flexShrink:0}}>
                <div style={{width:40,height:5,borderRadius:3,
                  background:"rgba(255,255,255,0.15)",margin:"0 auto 16px"}}/>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:38,height:38,borderRadius:12,
                      background:`linear-gradient(135deg,${T.accent},${T.accent}BB)`,
                      display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>
                      👤
                    </div>
                    <div>
                      <div style={{fontSize:16,fontWeight:700,color:T.t1,fontFamily:"Bricolage Grotesque"}}>
                        Nuevo cliente de fiado
                      </div>
                      <div style={{fontSize:11,color:T.t3}}>
                        Queda guardado en Contactos y Fiados para siempre
                      </div>
                    </div>
                  </div>
                  <button onClick={()=>{setShowNuevoCliente(false);setShowFiadoSheet(true)}}
                    style={{width:34,height:34,borderRadius:10,border:"none",cursor:"pointer",
                      background:T.sunken,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <I d={ic.back} s={14} c={T.t3}/>
                  </button>
                </div>
              </div>

              {/* Form */}
              <div style={{flex:1,overflowY:"auto",padding:"16px 20px"}}>
                {/* Nombre */}
                <div style={{marginBottom:14}}>
                  <div style={{fontSize:11,color:T.t3,marginBottom:7,fontWeight:600,
                    textTransform:"uppercase",letterSpacing:"0.06em"}}>Nombre completo *</div>
                  <input value={ncNombre} onChange={e=>setNcNombre(e.target.value)}
                    placeholder="Ej: Roberto García" autoFocus
                    style={{width:"100%",padding:"13px 16px",borderRadius:14,border:"none",
                      background:T.bg,boxShadow:T.inset,color:T.t1,fontSize:15,fontWeight:500,
                      fontFamily:"DM Sans",outline:"none",caretColor:T.accent,boxSizing:"border-box"}}/>
                </div>
                {/* Teléfono + Telegram */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
                  <div>
                    <div style={{fontSize:11,color:T.t3,marginBottom:7,fontWeight:600}}>📞 Teléfono</div>
                    <input value={ncTelefono} onChange={e=>setNcTelefono(e.target.value)}
                      placeholder="+56 9 XXXX XXXX" inputMode="tel"
                      style={{width:"100%",padding:"12px 14px",borderRadius:12,border:"none",
                        background:T.bg,boxShadow:T.inset,color:T.t1,fontSize:13,
                        fontFamily:"DM Sans",outline:"none",caretColor:T.accent,boxSizing:"border-box"}}/>
                  </div>
                  <div>
                    <div style={{fontSize:11,color:T.t3,marginBottom:7,fontWeight:600}}>✈️ Telegram</div>
                    <input value={ncTelegram} onChange={e=>setNcTelegram(e.target.value)}
                      placeholder="@usuario"
                      style={{width:"100%",padding:"12px 14px",borderRadius:12,border:"none",
                        background:T.bg,boxShadow:T.inset,color:T.t1,fontSize:13,
                        fontFamily:"DM Sans",outline:"none",caretColor:T.accent,boxSizing:"border-box"}}/>
                  </div>
                </div>
                {/* Email */}
                <div style={{marginBottom:14}}>
                  <div style={{fontSize:11,color:T.t3,marginBottom:7,fontWeight:600}}>📧 Correo electrónico</div>
                  <input value={ncEmail} onChange={e=>setNcEmail(e.target.value)}
                    placeholder="correo@ejemplo.com" type="email"
                    style={{width:"100%",padding:"12px 14px",borderRadius:12,border:"none",
                      background:T.bg,boxShadow:T.inset,color:T.t1,fontSize:13,
                      fontFamily:"DM Sans",outline:"none",caretColor:T.accent,boxSizing:"border-box"}}/>
                </div>
                {/* Notas */}
                <div style={{marginBottom:6}}>
                  <div style={{fontSize:11,color:T.t3,marginBottom:7,fontWeight:600}}>📝 Notas internas</div>
                  <input value={ncNotas} onChange={e=>setNcNotas(e.target.value)}
                    placeholder="Ej: paga los viernes, vive cerca..."
                    style={{width:"100%",padding:"12px 14px",borderRadius:12,border:"none",
                      background:T.bg,boxShadow:T.inset,color:T.t1,fontSize:13,
                      fontFamily:"DM Sans",outline:"none",caretColor:T.accent,boxSizing:"border-box"}}/>
                </div>
              </div>

              {/* Footer */}
              <div style={{padding:"12px 20px 32px",borderTop:`1px solid ${T.border}`,
                display:"flex",gap:10,flexShrink:0}}>
                <button onClick={()=>{setShowNuevoCliente(false);setShowFiadoSheet(true)}}
                  style={{flex:1,padding:"13px",borderRadius:12,border:"none",cursor:"pointer",
                    background:T.surface,color:T.t2,fontSize:13,fontWeight:600,boxShadow:T.btn}}>
                  Cancelar
                </button>
                <button
                  onClick={()=>{
                    if(!ncNombre.trim()) return
                    const newId = Date.now()
                    const joined = new Date().toLocaleDateString("es-CL",{month:"short",year:"numeric"})
                    const activity = [{date:new Date().toLocaleDateString("es-CL"),text:"Cliente creado desde Vender (POS)"}]
                    // Nuevo contacto completo
                    const newContact = {
                      id:newId, name:ncNombre.trim(), type:"customer",
                      phone:ncTelefono, email:ncEmail, telegram:ncTelegram||"",
                      notes:ncNotas||"", balance:0, purchases:0, points:0,
                      segment:"occasional", joined, activity,
                    }
                    // Guardar en contactList global
                    if(onDeudaAdd) {
                      // Use onDeudaAdd's parent contactList setter via a custom prop
                    }
                    // Select as fiado client
                    const clientForFiado = {
                      id:newId, name:ncNombre.trim(),
                      phone:ncTelefono, email:ncEmail, telegram:ncTelegram||"",
                    }
                    setFiadoClient(clientForFiado)
                    // Reset form
                    setNcNombre(""); setNcTelefono(""); setNcEmail("")
                    setNcTelegram(""); setNcNotas("")
                    setShowNuevoCliente(false)
                    // Pass to parent via onContactAdd
                    if(onContactAdd) onContactAdd(newContact)
                  }}
                  style={{flex:2,padding:"13px",borderRadius:12,border:"none",
                    cursor:ncNombre.trim()?"pointer":"not-allowed",
                    background:ncNombre.trim()
                      ?`linear-gradient(135deg,${T.accent},${T.accent}CC)`
                      :"rgba(255,255,255,0.08)",
                    color:ncNombre.trim()?"#1C2130":T.t3,
                    fontSize:13,fontWeight:700,fontFamily:"DM Sans",
                    boxShadow:ncNombre.trim()?`${T.btn},0 0 16px ${T.accent}40`:"none",
                    display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                  <I d={ic.check} s={15} c={ncNombre.trim()?"#1C2130":T.t3}/>
                  {ncNombre.trim()?`Agregar "${ncNombre}" y seleccionar`:"Escribe el nombre primero"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Datos iniciales de stock — definidos a nivel de módulo
const STOCK_INICIAL = [
  {id:1, sku:"BEB-COCA-001",n:"Coca-Cola 2L",    cat:"Bebidas",   e:"🥤",s:45,min:10,p:1490,mg:"40%",vence:"15 Jun 26",st:"ok"},
  {id:2, sku:"LAC-LECH-001",n:"Leche Entera 1L", cat:"Lácteos",   e:"🥛",s:8, min:10,p:1250,mg:"37%",vence:"29 Mar 26",st:"warn"},
  {id:3, sku:"PAN-PANM-001",n:"Pan Molde Gde",   cat:"Panadería", e:"🍞",s:2, min:5, p:1890,mg:"42%",vence:"29 Mar 26",st:"critical"},
  {id:4, sku:"LAC-YOGU-001",n:"Yogurt Frutilla",  cat:"Lácteos",   e:"🫙",s:15,min:8, p:1060,mg:"41%",vence:"20 Mar 26",st:"expired"},
  {id:5, sku:"SNA-PAPA-001",n:"Papas Lays 50g",  cat:"Snacks",    e:"🥔",s:30,min:12,p:850, mg:"43%",vence:"30 Sep 26",st:"ok"},
  {id:6, sku:"BEB-SPRI-001",n:"Sprite 1.5L",      cat:"Bebidas",   e:"💚",s:20,min:6, p:1100,mg:"38%",vence:"15 Jun 26",st:"ok"},
  {id:7, sku:"LIM-DETO-001",n:"Det. Omo 1kg",     cat:"Limpieza",  e:"🧺",s:6, min:3, p:4200,mg:"45%",vence:"30 Sep 26",st:"ok"},
  {id:8, sku:"LAC-QUES-001",n:"Queso Gouda 250g", cat:"Lácteos",   e:"🧀",s:3, min:2, p:2900,mg:"44%",vence:"04 Abr 26",st:"warn"},
]

function Inventario({ T, onAddProduct, stockList, setStockList }) {
  const productos = stockList || STOCK_INICIAL
  const setProductos = setStockList || (()=>{})
  const [filter,       setFilter]      = useState("Todos")
  const [editItem,     setEditItem]    = useState(null)
  const [deleteItem,   setDeleteItem]  = useState(null)
  const [deleteStep,   setDeleteStep]  = useState(1)
  const [showEmail,    setShowEmail]   = useState(false)  // modal email
  const [emailAddr,    setEmailAddr]   = useState("")
  const [showImgSheet, setShowImgSheet]= useState(false)  // sheet imagen proveedor
  const [imgPreview,   setImgPreview]  = useState(null)   // base64 preview
  const [imgAnalysis,  setImgAnalysis] = useState(null)   // resultado IA
  const [imgLoading,   setImgLoading]  = useState(false)
  const [imgError,     setImgError]    = useState("")

  const fmtCLP = n => new Intl.NumberFormat("es-CL",{style:"currency",currency:"CLP",maximumFractionDigits:0}).format(n)

  const stMap = {
    ok:      {l:"✅ OK",      c:T.mint,   bg:`${T.mint}18`},
    warn:    {l:"⏰ Pronto",  c:T.accent, bg:`${T.accent}18`},
    critical:{l:"🔴 Crítico", c:T.danger, bg:`${T.danger}18`},
    expired: {l:"💀 Vencido", c:T.danger, bg:`${T.danger}28`},
  }

  const filterMap = {
    "Todos":      () => true,
    "Crítico":    r => r.st === "critical" || r.s <= r.min,
    "Por vencer": r => r.st === "warn",
    "Vencidos":   r => r.st === "expired",
  }

  const filtered = productos.filter(filterMap[filter] || (() => true))

  const counts = {
    total:    productos.length,
    critical: productos.filter(r => r.st==="critical" || r.s<=r.min).length,
    warn:     productos.filter(r => r.st==="warn").length,
    expired:  productos.filter(r => r.st==="expired").length,
  }

  // ── Editar ─────────────────────────────────────────────────────
  const saveEdit = () => {
    const updated = productos.map(p => p.id===editItem.id ? editItem : p)
    setProductos(updated)
    if(setStockList) setStockList(updated)
    setEditItem(null)
  }

  // ── Eliminar con doble confirmación ───────────────────────────
  const startDelete = (item) => { setDeleteItem(item); setDeleteStep(1) }
  const confirmDelete = () => {
    if (deleteStep === 1) { setDeleteStep(2); return }
    const updated = productos.filter(p => p.id !== deleteItem.id)
    setProductos(updated)
    if(setStockList) setStockList(updated)
    setDeleteItem(null); setDeleteStep(1)
  }
  const cancelDelete = () => { setDeleteItem(null); setDeleteStep(1) }

  const FILTERS = ["Todos","Crítico","Por vencer","Vencidos"]

  return (
    <div style={{padding:"16px", display:"flex", flexDirection:"column", gap:14}}>

      {/* Header */}
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <span style={{fontSize:18, fontWeight:700, color:T.t1, fontFamily:"Bricolage Grotesque"}}>
          Inventario 📦
        </span>
        <div style={{display:"flex", gap:8}}>
          {/* Botón imagen proveedor */}
          <motion.button whileTap={{scale:0.92}}
            onClick={()=>{setImgPreview(null);setImgAnalysis(null);setImgError("");setShowImgSheet(true)}}
            style={{padding:"9px 14px",borderRadius:12,border:"none",cursor:"pointer",
              background:`${T.blue}18`,color:T.blue,
              fontSize:12,fontWeight:700,fontFamily:"DM Sans",
              display:"flex",alignItems:"center",gap:6,
              boxShadow:T.btn}}>
            <span style={{fontSize:14}}>📷</span>Subir imagen
          </motion.button>
          {/* Botón email */}
          <motion.button whileTap={{scale:0.92}}
            onClick={()=>{setEmailAddr("");setShowEmail(true)}}
            style={{padding:"9px 14px",borderRadius:12,border:"none",cursor:"pointer",
              background:`${T.accent}15`,color:T.accent,
              fontSize:12,fontWeight:700,fontFamily:"DM Sans",
              display:"flex",alignItems:"center",gap:6,
              boxShadow:T.btn}}>
            <span style={{fontSize:14}}>📧</span>Boleta
          </motion.button>
          {/* Botón agregar */}
          <Btn T={T} variant="primary" size="sm" onClick={onAddProduct}>
            <I d={ic.plus} s={14} c="#1C2130"/>Agregar
          </Btn>
        </div>
      </div>

      {/* Stats — clicables para filtrar */}
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10}}>
        {[
          {l:"Total productos", v:counts.total,    c:T.accent,  f:"Todos"},
          {l:"Stock crítico",   v:counts.critical, c:T.danger,  f:"Crítico"},
          {l:"Por vencer",      v:counts.warn,     c:T.accent,  f:"Por vencer"},
          {l:"Ya vencidos",     v:counts.expired,  c:T.danger,  f:"Vencidos"},
        ].map(s => (
          <button key={s.l} onClick={() => setFilter(s.f)}
            style={{textAlign:"center", padding:"14px 10px", borderRadius:20, border:"none",
              cursor:"pointer",
              background: filter===s.f ? `${s.c}20` : T.surface,
              boxShadow: filter===s.f ? T.press : T.card,
              outline: filter===s.f ? `1.5px solid ${s.c}40` : "none",
              transition:"all 0.2s"}}>
            <div style={{fontSize:28, fontWeight:900, color:s.c, fontFamily:"JetBrains Mono", marginBottom:3}}>
              {s.v}
            </div>
            <div style={{fontSize:11, color:T.t3, lineHeight:1.3}}>{s.l}</div>
          </button>
        ))}
      </div>

      {/* Filtros */}
      <div style={{display:"flex", gap:8, overflowX:"auto", scrollbarWidth:"none"}}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{flexShrink:0, padding:"8px 16px", borderRadius:10, border:"none", cursor:"pointer",
              fontSize:12, fontWeight:filter===f?700:500,
              background: filter===f ? `${T.accent}20` : T.surface,
              color: filter===f ? T.accent : T.t3,
              boxShadow: filter===f ? T.press : T.btn,
              outline: filter===f ? `1.5px solid ${T.accent}45` : "none",
              transition:"all 0.15s"}}>
            {f}
            {f!=="Todos" && <span style={{marginLeft:5, fontSize:10, opacity:0.7}}>
              ({f==="Crítico"?counts.critical:f==="Por vencer"?counts.warn:counts.expired})
            </span>}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div style={{textAlign:"center", padding:"40px 20px", color:T.t3}}>
          <div style={{fontSize:40, marginBottom:12}}>📦</div>
          <div style={{fontSize:14}}>Sin productos en este filtro</div>
          <button onClick={() => setFilter("Todos")}
            style={{marginTop:12, padding:"8px 20px", borderRadius:20, border:"none",
              cursor:"pointer", background:`${T.accent}20`, color:T.accent, fontSize:12, fontWeight:600}}>
            Ver todos
          </button>
        </div>
      )}

      {/* Lista */}
      {filtered.map((r,i) => {
        const s = stMap[r.st]
        const low = r.s <= r.min
        return (
          <motion.div key={r.id} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}>
            <Card T={T} style={{background: r.st==="expired" ? `${T.danger}06` : T.surface}}>

              {/* Nombre + badge */}
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10}}>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{fontSize:14, fontWeight:700, color:T.t1, marginBottom:3}}>{r.n}</div>
                  <div style={{fontSize:10, color:T.t3, fontFamily:"monospace"}}>{r.sku} · {r.cat}</div>
                </div>
                <Tag T={T} color={s.c} bg={s.bg}>{s.l}</Tag>
              </div>

              {/* Métricas */}
              <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:12}}>
                {[
                  {l:"STOCK",  v: low ? `${r.s} ⚠️` : String(r.s), c: low ? T.danger : T.mint},
                  {l:"PRECIO", v: fmtCLP(r.p), c:T.accent},
                  {l:"MARGEN", v: r.mg,         c:T.mint},
                ].map(m => (
                  <div key={m.l} style={{background:T.sunken, borderRadius:11, padding:"9px 10px", boxShadow:T.inset}}>
                    <div style={{fontSize:9, color:T.t3, marginBottom:3, letterSpacing:"0.06em"}}>{m.l}</div>
                    <div style={{fontSize:15, fontWeight:800, color:m.c, fontFamily:"JetBrains Mono"}}>{m.v}</div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                <span style={{fontSize:11, color:T.t3}}>📅 {r.vence}</span>
                <div style={{display:"flex", gap:8}}>
                  <button onClick={() => setEditItem({...r})}
                    style={{width:34, height:34, borderRadius:10, border:"none", cursor:"pointer",
                      background:`${T.blue}18`, boxShadow:T.btn,
                      display:"flex", alignItems:"center", justifyContent:"center"}}>
                    <I d={ic.edit} s={14} c={T.blue}/>
                  </button>
                  <button onClick={() => startDelete(r)}
                    style={{width:34, height:34, borderRadius:10, border:"none", cursor:"pointer",
                      background:`${T.danger}18`, boxShadow:T.btn,
                      display:"flex", alignItems:"center", justifyContent:"center"}}>
                    <I d={ic.trash} s={14} c={T.danger}/>
                  </button>
                </div>
              </div>
            </Card>
          </motion.div>
        )
      })}

      <div style={{height:80}}/>

      {/* ── MODAL EDITAR ─────────────────────────────────────── */}
      <AnimatePresence>
        {editItem && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",
              display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:200,backdropFilter:"blur(4px)"}}
            onClick={e => e.target===e.currentTarget && setEditItem(null)}>
            <motion.div initial={{y:"100%"}} animate={{y:0}} exit={{y:"100%"}}
              transition={{type:"spring",damping:30,stiffness:350}}
              style={{width:"100%",maxWidth:480,background:T.surface,
                borderRadius:"24px 24px 0 0",padding:"20px 20px 36px",
                boxShadow:"0 -8px 40px rgba(0,0,0,0.5)",maxHeight:"88vh",
                display:"flex",flexDirection:"column"}}>

              <div style={{width:40,height:5,borderRadius:3,
                background:"rgba(255,255,255,0.15)",margin:"0 auto 16px"}}/>

              <div style={{fontSize:16,fontWeight:700,color:T.t1,
                fontFamily:"Bricolage Grotesque",marginBottom:4}}>
                ✏️ Editar producto
              </div>
              <div style={{fontSize:12,color:T.t3,marginBottom:16}}>{editItem.sku}</div>

              <div style={{flex:1,overflowY:"auto"}}>
                {/* Nombre */}
                <div style={{marginBottom:12}}>
                  <div style={{fontSize:11,color:T.t3,marginBottom:7,fontWeight:600,
                    textTransform:"uppercase",letterSpacing:"0.06em"}}>Nombre</div>
                  <input value={editItem.n}
                    onChange={e => setEditItem(x => ({...x, n:e.target.value}))}
                    style={{width:"100%",padding:"12px 14px",borderRadius:12,border:"none",
                      background:T.bg,boxShadow:T.inset,color:T.t1,fontSize:14,
                      fontFamily:"DM Sans",outline:"none",caretColor:T.accent,boxSizing:"border-box"}}/>
                </div>

                {/* Precio */}
                <div style={{marginBottom:12}}>
                  <div style={{fontSize:11,color:T.t3,marginBottom:7,fontWeight:600,
                    textTransform:"uppercase",letterSpacing:"0.06em"}}>Precio de venta ($)</div>
                  <input value={editItem.p} inputMode="numeric"
                    onChange={e => setEditItem(x => ({...x, p:parseInt(e.target.value)||0}))}
                    style={{width:"100%",padding:"12px 14px",borderRadius:12,border:"none",
                      background:T.bg,boxShadow:T.inset,color:T.accent,fontSize:18,
                      fontFamily:"JetBrains Mono",fontWeight:700,outline:"none",
                      caretColor:T.accent,boxSizing:"border-box"}}/>
                </div>

                {/* Stock */}
                <div style={{marginBottom:12}}>
                  <div style={{fontSize:11,color:T.t3,marginBottom:7,fontWeight:600,
                    textTransform:"uppercase",letterSpacing:"0.06em"}}>Stock actual</div>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <button onClick={() => setEditItem(x => ({...x,s:Math.max(0,x.s-1)}))}
                      style={{width:40,height:40,borderRadius:11,border:"none",cursor:"pointer",
                        background:T.sunken,boxShadow:T.inset,color:T.t2,fontSize:20,
                        display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                    <input value={editItem.s} inputMode="numeric"
                      onChange={e => setEditItem(x => ({...x,s:parseInt(e.target.value)||0}))}
                      style={{flex:1,padding:"10px",borderRadius:12,border:"none",
                        background:T.bg,boxShadow:T.inset,color:T.t1,fontSize:22,
                        fontFamily:"JetBrains Mono",fontWeight:800,textAlign:"center",
                        outline:"none",caretColor:T.accent}}/>
                    <button onClick={() => setEditItem(x => ({...x,s:x.s+1}))}
                      style={{width:40,height:40,borderRadius:11,border:"none",cursor:"pointer",
                        background:`${T.accent}25`,boxShadow:T.btn,color:T.accent,fontSize:20,
                        display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                  </div>
                </div>

                {/* Estado */}
                <div style={{marginBottom:16}}>
                  <div style={{fontSize:11,color:T.t3,marginBottom:8,fontWeight:600,
                    textTransform:"uppercase",letterSpacing:"0.06em"}}>Estado</div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    {Object.entries(stMap).map(([k,v]) => (
                      <button key={k} onClick={() => setEditItem(x => ({...x,st:k}))}
                        style={{padding:"7px 14px",borderRadius:20,border:"none",cursor:"pointer",
                          fontSize:12,fontWeight:editItem.st===k?700:400,
                          background:editItem.st===k?v.bg:T.surface,
                          color:editItem.st===k?v.c:T.t3,
                          boxShadow:editItem.st===k?T.press:T.btn,
                          outline:editItem.st===k?`1.5px solid ${v.c}50`:"none"}}>
                        {v.l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{display:"flex",gap:10,marginTop:12}}>
                <Btn T={T} onClick={() => setEditItem(null)}>Cancelar</Btn>
                <button onClick={saveEdit}
                  style={{flex:1,padding:"13px",borderRadius:12,border:"none",cursor:"pointer",
                    background:`linear-gradient(135deg,${T.accent},${T.accent}CC)`,
                    color:"#1C2130",fontSize:14,fontWeight:700,fontFamily:"DM Sans",
                    boxShadow:`${T.btn},0 0 16px ${T.accent}40`,
                    display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                  <I d={ic.check} s={15} c="#1C2130"/>
                  Guardar cambios
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MODAL ELIMINAR — DOBLE CONFIRMACIÓN ──────────────── */}
      <AnimatePresence>
        {deleteItem && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",
              display:"flex",alignItems:"center",justifyContent:"center",
              zIndex:200,backdropFilter:"blur(6px)",padding:"20px"}}>
            <motion.div initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}}
              exit={{scale:0.9,opacity:0}}
              transition={{type:"spring",damping:25,stiffness:300}}
              style={{width:"100%",maxWidth:380,background:T.surface,borderRadius:24,
                padding:"28px 24px",boxShadow:"0 20px 60px rgba(0,0,0,0.5)"}}>

              <div style={{textAlign:"center",marginBottom:20}}>
                <div style={{width:60,height:60,borderRadius:18,margin:"0 auto 14px",
                  background:`${T.danger}18`,
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:28}}>
                  🗑️
                </div>
                <div style={{fontSize:18,fontWeight:800,color:T.t1,
                  fontFamily:"Bricolage Grotesque",marginBottom:6}}>
                  {deleteStep===1 ? "¿Eliminar producto?" : "⚠️ Última confirmación"}
                </div>
                <div style={{fontSize:13,color:T.t2,lineHeight:1.5}}>
                  {deleteStep===1
                    ? `Vas a eliminar "${deleteItem.n}". Esta acción requiere doble confirmación.`
                    : `Esta acción es permanente. "${deleteItem.n}" se eliminará del inventario para siempre.`}
                </div>
              </div>

              {deleteStep===2 && (
                <div style={{background:`${T.danger}0C`,border:`1px solid ${T.danger}25`,
                  borderRadius:12,padding:"10px 14px",marginBottom:16,textAlign:"center"}}>
                  <span style={{fontSize:12,color:T.danger,fontWeight:600}}>
                    ⚠️ SKU: {deleteItem.sku} · Stock: {deleteItem.s} unidades
                  </span>
                </div>
              )}

              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <button onClick={confirmDelete}
                  style={{padding:"14px",borderRadius:12,border:"none",cursor:"pointer",
                    background:deleteStep===1
                      ?`rgba(255,77,109,0.15)`
                      :`linear-gradient(135deg,${T.danger},${T.danger}CC)`,
                    color:deleteStep===1?T.danger:"#fff",
                    fontSize:14,fontWeight:700,fontFamily:"DM Sans",
                    boxShadow:deleteStep===2?`0 4px 16px ${T.danger}50`:"none"}}>
                  {deleteStep===1?"Sí, quiero eliminar →":"Confirmar eliminación definitiva"}
                </button>
                <button onClick={cancelDelete}
                  style={{padding:"13px",borderRadius:12,border:"none",cursor:"pointer",
                    background:T.surface,color:T.t2,fontSize:14,fontWeight:500,
                    fontFamily:"DM Sans",boxShadow:T.btn}}>
                  Cancelar — mantener producto
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

      {/* ── EMAIL BOLETA de INVENTARIO ───────────────── */}
      <AnimatePresence>
        {showEmail && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",
              display:"flex",alignItems:"flex-end",justifyContent:"center",
              zIndex:200,backdropFilter:"blur(4px)"}}
            onClick={e=>e.target===e.currentTarget&&setShowEmail(false)}>
            <motion.div initial={{y:"100%"}} animate={{y:0}} exit={{y:"100%"}}
              transition={{type:"spring",damping:30,stiffness:350}}
              style={{width:"100%",maxWidth:480,background:T.surface,
                borderRadius:"24px 24px 0 0",padding:"20px 20px 36px",
                boxShadow:"0 -8px 40px rgba(0,0,0,0.5)"}}>
              <div style={{width:40,height:5,borderRadius:3,
                background:"rgba(255,255,255,0.15)",margin:"0 auto 16px"}}/>
              <div style={{fontSize:16,fontWeight:700,color:T.t1,
                fontFamily:"Bricolage Grotesque",marginBottom:6}}>
                📧 Enviar informe de inventario
              </div>
              <div style={{fontSize:12,color:T.t3,marginBottom:16}}>
                Se enviará un resumen completo del stock actual con cantidades, precios y alertas.
              </div>
              <div style={{fontSize:11,color:T.t3,marginBottom:8,fontWeight:600,
                textTransform:"uppercase",letterSpacing:"0.06em"}}>
                Correo destino
              </div>
              <input value={emailAddr} onChange={e=>setEmailAddr(e.target.value)}
                type="email" autoFocus
                placeholder="proveedor@ejemplo.com o tu@correo.cl"
                style={{width:"100%",padding:"13px 16px",borderRadius:14,border:"none",
                  background:T.bg,boxShadow:T.inset,color:T.t1,fontSize:14,
                  fontFamily:"DM Sans",outline:"none",caretColor:T.accent,
                  boxSizing:"border-box",marginBottom:16}}/>
              {/* Vista previa del contenido */}
              <div style={{background:T.sunken,borderRadius:12,padding:"12px 14px",
                marginBottom:16,boxShadow:T.inset}}>
                <div style={{fontSize:11,color:T.t3,marginBottom:8,fontWeight:600}}>
                  Vista previa — Resumen de stock
                </div>
                {productos.slice(0,4).map(p=>(
                  <div key={p.id} style={{display:"flex",justifyContent:"space-between",
                    padding:"4px 0",borderBottom:`1px solid ${T.border}`}}>
                    <span style={{fontSize:11,color:T.t1}}>{p.n}</span>
                    <span style={{fontSize:11,fontWeight:700,fontFamily:"JetBrains Mono",
                      color:p.s<=p.min?T.danger:T.mint}}>
                      {p.s} u.
                    </span>
                  </div>
                ))}
                {productos.length>4&&(
                  <div style={{fontSize:10,color:T.t3,marginTop:4,textAlign:"center"}}>
                    +{productos.length-4} productos más...
                  </div>
                )}
              </div>
              <div style={{display:"flex",gap:10}}>
                <button onClick={()=>setShowEmail(false)}
                  style={{flex:1,padding:"13px",borderRadius:12,border:"none",cursor:"pointer",
                    background:T.surface,color:T.t2,fontSize:13,fontWeight:600,boxShadow:T.btn}}>
                  Cancelar
                </button>
                <button onClick={()=>{
                    const lines = productos.map(p=>p.n+" — "+p.s+" u. — "+fmtCLP(p.p))
                    const critical = productos.filter(p=>p.s<=p.min).map(p=>"⚠️ "+p.n+" ("+p.s+"u)")
                    const subject = encodeURIComponent("Informe de inventario — NegociPro "+new Date().toLocaleDateString("es-CL"))
                    const body = encodeURIComponent(
                      "Informe de inventario\n" + new Date().toLocaleDateString("es-CL") + "\n\n" +
                      "STOCK COMPLETO:\n" + lines.join("\n") + "\n\n" +
                      (critical.length ? "ALERTAS DE STOCK:\n" + critical.join("\n") + "\n\n" : "") +
                      "Total productos: " + productos.length + "\n" +
                      "Generado por NegociPro"
                    )
                    window.open("mailto:"+(emailAddr||"")+"?subject="+subject+"&body="+body,"_blank")
                    setShowEmail(false)
                  }}
                  style={{flex:2,padding:"13px",borderRadius:12,border:"none",cursor:"pointer",
                    background:`linear-gradient(135deg,${T.blue},${T.blue}CC)`,
                    color:"#fff",fontSize:13,fontWeight:700,
                    display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                  <span>📧</span>Enviar informe
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SHEET IMAGEN PROVEEDOR (IA) ───────────────── */}
      <AnimatePresence>
        {showImgSheet && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",
              display:"flex",alignItems:"flex-end",justifyContent:"center",
              zIndex:200,backdropFilter:"blur(5px)"}}
            onClick={e=>e.target===e.currentTarget&&!imgLoading&&setShowImgSheet(false)}>
            <motion.div initial={{y:"100%"}} animate={{y:0}} exit={{y:"100%"}}
              transition={{type:"spring",damping:30,stiffness:350}}
              style={{width:"100%",maxWidth:480,background:T.surface,
                borderRadius:"24px 24px 0 0",
                boxShadow:"0 -8px 40px rgba(0,0,0,0.5)",
                display:"flex",flexDirection:"column",maxHeight:"90vh"}}>

              <div style={{padding:"16px 20px 14px",borderBottom:`1px solid ${T.border}`,flexShrink:0}}>
                <div style={{width:40,height:5,borderRadius:3,
                  background:"rgba(255,255,255,0.15)",margin:"0 auto 14px"}}/>
                <div style={{fontSize:16,fontWeight:700,color:T.t1,
                  fontFamily:"Bricolage Grotesque",marginBottom:4}}>
                  📷 Actualizar stock desde imagen
                </div>
                <div style={{fontSize:12,color:T.t3}}>
                  Sube una foto de la factura, guía o boleta del proveedor y la IA detectará los productos y cantidades.
                </div>
              </div>

              <div style={{flex:1,overflowY:"auto",padding:"16px 20px 8px"}}>
                {/* Zona de upload */}
                <input type="file" id="inv-img-input" accept="image/*" style={{display:"none"}}
                  onChange={e=>{
                    const file=e.target.files?.[0]
                    if(!file) return
                    const reader=new FileReader()
                    reader.onload=ev=>{
                      setImgPreview(ev.target.result)
                      setImgAnalysis(null)
                      setImgError("")
                    }
                    reader.readAsDataURL(file)
                    e.target.value=""
                  }}/>

                {!imgPreview ? (
                  <button onClick={()=>document.getElementById("inv-img-input").click()}
                    style={{width:"100%",padding:"32px 20px",borderRadius:18,border:"none",cursor:"pointer",
                      background:T.sunken,boxShadow:T.inset,
                      display:"flex",flexDirection:"column",alignItems:"center",gap:10,marginBottom:12}}>
                    <div style={{width:56,height:56,borderRadius:16,
                      background:`${T.blue}20`,
                      display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>
                      📷
                    </div>
                    <div style={{fontSize:14,fontWeight:700,color:T.t1}}>Toca para subir imagen</div>
                    <div style={{fontSize:12,color:T.t3}}>Factura, guía de despacho, boleta de proveedor</div>
                  </button>
                ) : (
                  <div style={{marginBottom:12}}>
                    <img src={imgPreview} alt="preview"
                      style={{width:"100%",borderRadius:14,maxHeight:220,
                        objectFit:"contain",background:T.sunken,marginBottom:8}}/>
                    <button onClick={()=>document.getElementById("inv-img-input").click()}
                      style={{width:"100%",padding:"10px",borderRadius:10,border:"none",cursor:"pointer",
                        background:T.surface,boxShadow:T.btn,color:T.t3,fontSize:12,fontWeight:600}}>
                      🔄 Cambiar imagen
                    </button>
                  </div>
                )}

                {imgError && (
                  <div style={{padding:"10px 14px",borderRadius:12,marginBottom:10,
                    background:`${T.danger}12`,border:`1px solid ${T.danger}20`,
                    fontSize:12,color:T.danger}}>
                    ⚠️ {imgError}
                  </div>
                )}

                {/* Resultado IA */}
                {imgAnalysis && (
                  <div style={{marginBottom:12}}>
                    <div style={{fontSize:12,fontWeight:700,color:T.t1,marginBottom:10}}>
                      ✅ Productos detectados — Confirma los cambios:
                    </div>
                    {imgAnalysis.map((item,i)=>{
                      const existing = productos.find(p=>
                        p.n.toLowerCase().includes(item.nombre.toLowerCase()) ||
                        item.nombre.toLowerCase().includes(p.n.toLowerCase())
                      )
                      return (
                        <div key={i} style={{background:T.sunken,borderRadius:12,
                          padding:"12px 14px",marginBottom:8,boxShadow:T.inset}}>
                          <div style={{display:"flex",justifyContent:"space-between",
                            alignItems:"center",marginBottom:4}}>
                            <span style={{fontSize:13,fontWeight:700,color:T.t1}}>
                              {existing ? existing.e+" " : "📦 "}{item.nombre}
                            </span>
                            <span style={{fontSize:11,padding:"2px 8px",borderRadius:8,
                              background:existing?`${T.mint}15`:`${T.accent}15`,
                              color:existing?T.mint:T.accent,fontWeight:600}}>
                              {existing?"Actualizar":"Nuevo"}
                            </span>
                          </div>
                          <div style={{display:"flex",gap:12,fontSize:11,color:T.t2}}>
                            <span>📦 Cantidad: <b style={{color:T.accent}}>{item.cantidad} u.</b></span>
                            {item.precio>0&&<span>💲 Precio: <b style={{color:T.t1,fontFamily:"JetBrains Mono"}}>{fmtCLP(item.precio)}</b></span>}
                          </div>
                          {item.observacion&&(
                            <div style={{fontSize:11,color:T.t3,marginTop:4}}>{item.observacion}</div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div style={{padding:"12px 20px 32px",borderTop:`1px solid ${T.border}`,
                display:"flex",gap:10,flexShrink:0}}>
                <button onClick={()=>{setShowImgSheet(false);setImgPreview(null);setImgAnalysis(null)}}
                  style={{flex:1,padding:"13px",borderRadius:12,border:"none",cursor:"pointer",
                    background:T.surface,color:T.t2,fontSize:13,fontWeight:600,boxShadow:T.btn}}>
                  Cancelar
                </button>
                {!imgAnalysis ? (
                  <button
                    onClick={()=>{
                      if(!imgPreview||imgLoading) return
                      setImgLoading(true); setImgError("")
                      const base64=imgPreview.split(",")[1]
                      fetch("https://api.anthropic.com/v1/messages",{
                        method:"POST",
                        headers:{"Content-Type":"application/json"},
                        body:JSON.stringify({
                          model:"claude-sonnet-4-20250514",
                          max_tokens:1000,
                          messages:[{role:"user",content:[
                            {type:"image",source:{type:"base64",media_type:"image/jpeg",data:base64}},
                            {type:"text",text:"Eres un asistente de inventario para un minimarket chileno. Analiza esta imagen (factura, guia de despacho, boleta de proveedor o foto de productos). Extrae TODOS los productos con sus cantidades y precios. Responde SOLO en JSON sin markdown: productos es un array de objetos con nombre, cantidad, precio y observacion. Si no hay productos incluye un campo error con la descripcion."}
                          ]}]                        })
                      })
                      .then(r=>r.json())
                      .then(data=>{
                        const text=(data.content&&data.content[0]&&data.content[0].text)||""
                        const clean=(text.split("```json").join("").split("```").join("")).trim()
                        const parsed=JSON.parse(clean)
                        if(parsed.error){setImgError(parsed.error);setImgLoading(false);return}
                        if(!parsed.productos||!parsed.productos.length){setImgError("No se detectaron productos. Intenta con una imagen más clara.");setImgLoading(false);return}
                        setImgAnalysis(parsed.productos);setImgLoading(false)
                      })
                      .catch(()=>{
                        setImgError("Error al analizar la imagen. Verifica tu conexión.")
                        setImgLoading(false)
                      })
                    }}
                    style={{flex:2,padding:"13px",borderRadius:12,border:"none",
                      cursor:imgPreview&&!imgLoading?"pointer":"not-allowed",
                      background:imgPreview&&!imgLoading
                        ?`linear-gradient(135deg,${T.blue},${T.blue}CC)`
                        :"rgba(255,255,255,0.08)",
                      color:imgPreview&&!imgLoading?"#fff":T.t3,
                      fontSize:13,fontWeight:700,
                      display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                    {imgLoading
                      ? <><motion.span animate={{rotate:360}} transition={{duration:1,repeat:Infinity,ease:"linear"}}>⚙️</motion.span> Analizando imagen...</>
                      : <><span>🤖</span>Analizar con IA</>
                    }
                  </button>
                ) : (
                  <button
                    onClick={()=>{
                      // Apply detected products to stockList
                      let updated=[...productos]
                      imgAnalysis.forEach(item=>{
                        const idx=updated.findIndex(p=>
                          p.n.toLowerCase().includes(item.nombre.toLowerCase()) ||
                          item.nombre.toLowerCase().includes(p.n.toLowerCase())
                        )
                        if(idx>=0){
                          // Update existing product
                          const p=updated[idx]
                          const newS=p.s+item.cantidad
                          updated[idx]={...p,
                            s:newS,
                            st:newS<=p.min?"critical":newS>p.min*2?"ok":"warn",
                            ...(item.precio>0?{p:item.precio}:{})
                          }
                        } else {
                          // Add new product
                          updated.push({
                            id:Date.now()+Math.random(),
                            sku:"IMP-"+Date.now(),
                            n:item.nombre,
                            cat:"General",
                            e:"📦",
                            s:item.cantidad,
                            min:5,
                            p:item.precio||0,
                            mg:"0%",
                            vence:"—",
                            st:item.cantidad>5?"ok":"critical"
                          })
                        }
                      })
                      setProductos(updated)
                      if(setStockList) setStockList(updated)
                      setShowImgSheet(false)
                      setImgPreview(null)
                      setImgAnalysis(null)
                    }}
                    style={{flex:2,padding:"13px",borderRadius:12,border:"none",cursor:"pointer",
                      background:`linear-gradient(135deg,${T.mint},${T.mint}CC)`,
                      color:"#1C2130",fontSize:13,fontWeight:700,
                      display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                    <span>✅</span>Aplicar cambios al stock
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      </AnimatePresence>
    </div>
  )
}

function Deudores({ T, onOpenDeudor, onNuevoFiado, onBack, list:listProp, setList:setListProp, addNotif }) {
  const DEFAULT_LIST = [
    {id:1,n:"Pedro Soto",     email:"pedro@gmail.com",    b:47500,d:"Atrasado 3 días", st:"over",items:3,ph:"+56 9 1234 5678"},
    {id:2,n:"María González", email:"maria@gmail.com",    b:12200,d:"Atrasado 1 día",  st:"over",items:2,ph:"+56 9 8765 4321"},
    {id:3,n:"Carlos Ruiz",    email:"",                   b:8900, d:"Vence en 2 días", st:"soon",items:1,ph:"+56 9 5555 1234"},
    {id:4,n:"Ana Torres",     email:"ana@gmail.com",      b:35000,d:"Vence en 5 días", st:"soon",items:4,ph:"+56 9 4444 5678"},
    {id:5,n:"Luis Pérez",     email:"",                   b:5500, d:"Vence en 15 días",st:"ok",  items:1,ph:"+56 9 3333 9876"},
  ]
  const [localList, setLocalList] = useState(DEFAULT_LIST)
  const list    = listProp    || localList
  const setList = setListProp || setLocalList
  // Dummy to avoid lint — original useState was here

  const [abonoId, setAbonoId]  = useState(null)
  const [abonoAmt, setAbonoAmt]= useState("")
  const [search,   setSearch]  = useState("")
  const fmtCLP = n => new Intl.NumberFormat("es-CL",{style:"currency",currency:"CLP",maximumFractionDigits:0}).format(n)

  const stMap = {
    over:{c:T.danger,bg:`${T.danger}18`,l:"Atrasado"},
    soon:{c:T.accent,bg:`${T.accent}18`,l:"Vence pronto"},
    ok:  {c:T.mint,  bg:`${T.mint}18`,  l:"Al día"},
  }
  const total       = list.reduce((s,d) => s+d.b, 0)
  const filteredList = search.trim()
    ? list.filter(d => d.n.toLowerCase().includes(search.toLowerCase().trim()))
    : list

  const registrarAbono = () => {
    const amt = parseInt(abonoAmt.replace(/\D/g,""))||0
    if (!amt || !abonoDeudor) return
    const saldoAnterior = abonoDeudor.b
    const saldoNuevo    = Math.max(0, saldoAnterior - amt)
    const pagado        = saldoAnterior - saldoNuevo
    const quedaCero     = saldoNuevo === 0
    setList(ls => ls.map(d => d.id===abonoId
      ? {...d, b:saldoNuevo, st:quedaCero?"ok":d.st}
      : d
    ).filter(d => d.b > 0))
    // Notificación con detalle completo
    if (addNotif) {
      const now = new Date()
      addNotif(
        "debt",
        quedaCero
          ? `✅ Deuda saldada — ${abonoDeudor.n}`
          : `💰 Abono registrado — ${abonoDeudor.n}`,
        quedaCero
          ? `Pagó ${fmtCLP(pagado)} y quedó sin deuda.`
          : `Abonó ${fmtCLP(pagado)}. Saldo restante: ${fmtCLP(saldoNuevo)}.`,
        {
          total:   pagado,
          method:  "Efectivo",
          items:   quedaCero
            ? ["Deuda saldada completamente ✅"]
            : [`Abono parcial — saldo anterior: ${fmtCLP(saldoAnterior)}`,
               `Saldo restante: ${fmtCLP(saldoNuevo)}`],
          client:  abonoDeudor.n,
          fecha:   now.toLocaleDateString("es-CL",{day:"numeric",month:"short",year:"numeric"}),
          hora:    now.toLocaleTimeString("es-CL",{hour:"2-digit",minute:"2-digit"}),
        }
      )
    }
    setAbonoId(null); setAbonoAmt("")
  }

  const abonoDeudor = abonoId ? list.find(d => d.id===abonoId) : null

  return (
    <div style={{padding:"16px", display:"flex", flexDirection:"column", gap:14}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {onBack && (
            <motion.button whileTap={{scale:0.88}} onClick={onBack}
              style={{width:38,height:38,borderRadius:11,border:"none",cursor:"pointer",
                background:T.surface,boxShadow:T.btn,
                display:"flex",alignItems:"center",justifyContent:"center"}}>
              <I d={ic.back} s={16} c={T.t2}/>
            </motion.button>
          )}
          <span style={{fontSize:18, fontWeight:700, color:T.t1, fontFamily:"Bricolage Grotesque"}}>
            Libro de Fiados 💸
          </span>
        </div>
        <button onClick={onNuevoFiado}
          style={{padding:"12px 22px",borderRadius:14,border:"none",cursor:"pointer",
            background:`linear-gradient(135deg,${T.accent},${T.accent}CC)`,
            color:"#1C2130",fontSize:14,fontWeight:700,fontFamily:"DM Sans",
            boxShadow:`${T.btn}, 0 0 16px ${T.accent}40`,
            display:"flex",alignItems:"center",gap:8}}>
          <I d={ic.plus} s={17} c="#1C2130"/>
          Registrar fiado
        </button>
      </div>

      <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10}}>
        {[
          {l:"Total en calle",  v:fmtCLP(total), c:T.danger, bg:`${T.danger}0C`, br:`${T.danger}28`},
          {l:"Atrasados",       v:`${list.filter(d=>d.st==="over").length} pers.`, c:T.accent,bg:`${T.accent}0C`,br:`${T.accent}28`},
          {l:"Cobrado mes",     v:fmtCLP(38000), c:T.mint,  bg:`${T.mint}0C`,  br:`${T.mint}28`},
        ].map(s => (
          <div key={s.l} style={{padding:"12px 10px", borderRadius:16, textAlign:"center",
            background:s.bg, border:`1px solid ${s.br}`, boxShadow:T.card}}>
            <div style={{fontSize:15, fontWeight:900, color:s.c, fontFamily:"JetBrains Mono"}}>{s.v}</div>
            <div style={{fontSize:10, color:T.t3, marginTop:4, lineHeight:1.3}}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Buscador */}
      <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",
        borderRadius:14,background:T.surface,boxShadow:T.inset}}>
        <I d={ic.search} s={15} c={T.t3}/>
        <input value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="Buscar deudor por nombre..."
          style={{flex:1,border:"none",background:"transparent",color:T.t1,
            fontSize:13,fontFamily:"DM Sans",outline:"none",caretColor:T.accent}}/>
        {search&&(
          <button onClick={()=>setSearch("")}
            style={{width:20,height:20,borderRadius:10,border:"none",cursor:"pointer",
              background:`${T.danger}20`,color:T.danger,fontSize:12,
              display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        )}
      </div>

      {/* Sin resultados */}
      {search.trim()&&filteredList.length===0&&(
        <div style={{textAlign:"center",padding:"30px 20px",color:T.t3}}>
          <div style={{fontSize:32,marginBottom:8}}>🔍</div>
          <div style={{fontSize:14,fontWeight:600,color:T.t1}}>Sin resultados para "{search}"</div>
          <div style={{fontSize:12,color:T.t3,marginTop:4}}>Verifica el nombre del deudor</div>
        </div>
      )}

      {list.length === 0 && (
        <div style={{textAlign:"center",padding:"40px 20px",color:T.t3}}>
          <div style={{fontSize:40,marginBottom:12}}>🎉</div>
          <div style={{fontSize:15,fontWeight:600,color:T.t1}}>¡Sin deudas pendientes!</div>
          <div style={{fontSize:12,color:T.t3,marginTop:6}}>Todos han pagado</div>
        </div>
      )}

      {filteredList.map((d,i) => {
        const s = stMap[d.st]
        return (
          <motion.div key={d.id} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.07}}>
            <Card T={T} style={{border:`1px solid ${s.c}20`,cursor:"pointer"}} onClick={() => onOpenDeudor && onOpenDeudor(d.id)}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
                <div style={{width:44,height:44,borderRadius:13,flexShrink:0,
                  background:s.bg,boxShadow:T.btn,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:17,fontWeight:700,color:s.c}}>{d.n[0]}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                    <span style={{fontSize:14,fontWeight:700,color:T.t1}}>{d.n}</span>
                    <span style={{fontSize:10,fontWeight:600,padding:"2px 8px",
                      borderRadius:20,background:s.bg,color:s.c}}>{s.l}</span>
                  </div>
                  <div style={{fontSize:11,color:T.t3}}>{d.ph} · {d.items} compras · {d.d}</div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontSize:20,fontWeight:900,color:s.c,fontFamily:"JetBrains Mono"}}>
                    {fmtCLP(d.b)}
                  </div>
                </div>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={e => {e.stopPropagation();setAbonoId(d.id)}}
                  style={{flex:1,padding:"10px",borderRadius:10,border:"none",cursor:"pointer",
                    background:`linear-gradient(135deg,${T.accent},${T.accent}CC)`,
                    color:"#1C2130",fontSize:12,fontWeight:700,fontFamily:"DM Sans",
                    boxShadow:`0 3px 10px ${T.accent}40`}}>
                  💰 Cobrar
                </button>
                <button onClick={e => {
                    e.stopPropagation()
                    if(d.email){
                      const subject = encodeURIComponent(`Estado de cuenta – ${d.n}`)
                      const body = encodeURIComponent(
                        `Hola ${d.n},\n\n` +
                        `Te enviamos tu resumen de cuenta en NegociPro:\n\n` +
                        `  • Deuda total: ${fmtCLP(d.b)}\n` +
                        `  • Estado: ${d.st==="over"?"⚠️ Atrasada":d.st==="soon"?"🕐 Por vencer":"✅ Al día"}\n` +
                        `  • Vencimiento: ${d.d}\n\n` +
                        `Por favor acércate o comunícate para coordinar el pago.\n\n` +
                        `Gracias,\nEquipo NegociPro`
                      )
                      window.open(`mailto:${d.email}?subject=${subject}&body=${body}`, '_blank')
                    } else {
                      alert(`${d.n} no tiene correo registrado. Edita el contacto para agregar uno.`)
                    }
                  }}
                  style={{flex:1,padding:"10px",borderRadius:10,border:"none",
                    cursor:"pointer",
                    background:d.email?`${T.blue}12`:T.surface,
                    color:d.email?T.blue:T.t3,fontSize:12,fontWeight:d.email?600:400,
                    fontFamily:"DM Sans",boxShadow:T.btn,
                    display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
                  <span style={{fontSize:14}}>📧</span>
                  {d.email ? "Enviar boleta" : "Sin correo"}
                </button>
              </div>
            </Card>
          </motion.div>
        )
      })}

      <div style={{height:80}}/>

      {/* Sheet cobro */}
      <AnimatePresence>
        {abonoId && abonoDeudor && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",
              display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:200}}
            onClick={e => e.target===e.currentTarget && setAbonoId(null)}>
            <motion.div initial={{y:"100%"}} animate={{y:0}} exit={{y:"100%"}}
              transition={{type:"spring",damping:30,stiffness:350}}
              style={{width:"100%",maxWidth:480,background:T.surface,
                borderRadius:"24px 24px 0 0",padding:"20px 20px 40px",
                boxShadow:"0 -8px 40px rgba(0,0,0,0.5)"}}>
              <div style={{width:40,height:5,borderRadius:3,
                background:"rgba(255,255,255,0.15)",margin:"0 auto 18px"}}/>
              <div style={{fontSize:16,fontWeight:700,color:T.t1,
                fontFamily:"Bricolage Grotesque",marginBottom:4}}>
                Registrar abono
              </div>
              <div style={{fontSize:12,color:T.t3,marginBottom:16}}>
                {abonoDeudor.n} · Saldo: {fmtCLP(abonoDeudor.b)}
              </div>
              <div style={{fontSize:11,color:T.t3,marginBottom:8}}>Monto recibido</div>
              <input value={abonoAmt} onChange={e => setAbonoAmt(e.target.value.replace(/\D/g,""))}
                inputMode="numeric" placeholder="$0"
                autoFocus
                style={{width:"100%",padding:"16px",borderRadius:14,border:"none",
                  background:T.bg,boxShadow:T.inset,color:T.t1,fontSize:28,fontWeight:900,
                  fontFamily:"JetBrains Mono",textAlign:"right",outline:"none",
                  caretColor:T.accent,boxSizing:"border-box",marginBottom:12}}/>
              {/* Botones montos rápidos */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:14}}>
                {[1000,2000,5000,10000].map(a => (
                  <button key={a} onClick={() => setAbonoAmt(String(a))}
                    style={{padding:"9px 4px",borderRadius:10,border:"none",cursor:"pointer",
                      fontSize:12,fontWeight:700,
                      background:abonoAmt===String(a)?`${T.accent}25`:T.surface,
                      color:abonoAmt===String(a)?T.accent:T.t3,
                      boxShadow:abonoAmt===String(a)?T.press:T.btn}}>
                    {fmtCLP(a)}
                  </button>
                ))}
              </div>
              {parseInt(abonoAmt||0) > abonoDeudor.b && (
                <div style={{background:`${T.mint}12`,border:`1px solid ${T.mint}30`,
                  borderRadius:12,padding:"10px 14px",marginBottom:12,textAlign:"center"}}>
                  <div style={{fontSize:11,color:T.mint,fontWeight:700,marginBottom:2}}>VUELTO A ENTREGAR</div>
                  <div style={{fontSize:22,fontWeight:900,color:T.mint,fontFamily:"JetBrains Mono"}}>
                    {fmtCLP(parseInt(abonoAmt||0)-abonoDeudor.b)}
                  </div>
                </div>
              )}
              <button onClick={registrarAbono}
                style={{width:"100%",padding:"14px",borderRadius:12,border:"none",
                  cursor:abonoAmt?"pointer":"not-allowed",
                  background:abonoAmt?`linear-gradient(135deg,${T.mint},${T.mint}CC)`:"rgba(255,255,255,0.07)",
                  color:abonoAmt?"#1C2130":T.t3,fontSize:14,fontWeight:700,fontFamily:"DM Sans",
                  boxShadow:abonoAmt?`0 4px 14px ${T.mint}40`:"none",
                  display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                <I d={ic.check} s={16} c={abonoAmt?"#1C2130":T.t3}/>
                Confirmar abono
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Config({ T, isDark, toggleDark, accent, setAccent, bizName, onColorEdit, stockList=[], salesList=[], deudaList=[], contactList=[] }) {
  const fmtCLP = n => new Intl.NumberFormat("es-CL",{style:"currency",currency:"CLP",maximumFractionDigits:0}).format(n)

  // ── Sheet activa ─────────────────────────────────────────────────
  const [sheet, setSheet] = useState(null) // "negocio"|"empleados"|"telegram"|"exportar"|"seguridad"

  // ── Datos del negocio ────────────────────────────────────────────
  const [biz, setBiz] = useState({
    nombre:"Mi Minimarket", rut:"12.345.678-9",
    direccion:"Av. Principal 123, Santiago",
    telefono:"+56 9 1234 5678", email:"negocio@gmail.com",
    giro:"Comercio al por menor", plan:"Gratuito"
  })
  const [bizEdit, setBizEdit] = useState(null)

  // ── Empleados ────────────────────────────────────────────────────
  const [empleados, setEmpleados] = useState([
    {id:1, nombre:"María González", rol:"Cajera",    pin:"1234", activo:true,  permisos:["ventas","fiados"]},
    {id:2, nombre:"Juan García",    rol:"Bodeguero", pin:"5678", activo:true,  permisos:["inventario"]},
    {id:3, nombre:"Pedro López",    rol:"Dueño",     pin:"0000", activo:true,  permisos:["todo"]},
  ])
  const [showEmpForm, setShowEmpForm]   = useState(false)
  const [editEmp,     setEditEmp]       = useState(null)
  const [empNombre,   setEmpNombre]     = useState("")
  const [empRol,      setEmpRol]        = useState("Cajera")
  const [empPin,      setEmpPin]        = useState("")
  const [empPermisos, setEmpPermisos]   = useState([])

  // ── Telegram ────────────────────────────────────────────────────
  const [tgToken,     setTgToken]   = useState("")
  const [tgChatId,    setTgChatId]  = useState("")
  const [tgActivo,    setTgActivo]  = useState(false)
  const [tgNotifs,    setTgNotifs]  = useState({ventas:true, stock:true, fiados:true, cierre:false})
  const [tgTestOk,    setTgTestOk]  = useState(null)

  // ── Seguridad ────────────────────────────────────────────────────
  const [pinActual,   setPinActual] = useState("")
  const [pinNuevo,    setPinNuevo]  = useState("")
  const [pinConfirm,  setPinConfirm]= useState("")
  const [mfa,         setMfa]       = useState(false)
  const [autoLock,    setAutoLock]  = useState("5min")
  const [pinMsg,      setPinMsg]    = useState("")

  const ROLES = ["Dueño","Cajera","Cajero","Bodeguero","Administrador","Vendedor"]
  const PERMISOS_LIST = [
    {id:"ventas",     l:"💰 Ventas"},
    {id:"inventario", l:"📦 Inventario"},
    {id:"fiados",     l:"💸 Fiados"},
    {id:"reportes",   l:"📊 Reportes"},
    {id:"config",     l:"⚙️ Configuración"},
    {id:"todo",       l:"🔑 Acceso completo"},
  ]

  const guardarEmp = () => {
    if (!empNombre.trim()) return
    if (editEmp) {
      setEmpleados(es => es.map(e => e.id===editEmp.id
        ? {...e, nombre:empNombre, rol:empRol, pin:empPin||e.pin, permisos:empPermisos}
        : e))
    } else {
      setEmpleados(es => [...es, {
        id:Date.now(), nombre:empNombre, rol:empRol,
        pin:empPin||"0000", activo:true, permisos:empPermisos
      }])
    }
    setShowEmpForm(false); setEditEmp(null)
    setEmpNombre(""); setEmpRol("Cajera"); setEmpPin(""); setEmpPermisos([])
  }

  const openEditEmp = (e) => {
    setEditEmp(e); setEmpNombre(e.nombre); setEmpRol(e.rol)
    setEmpPin(""); setEmpPermisos(e.permisos||[]); setShowEmpForm(true)
  }

  const probarTelegram = () => {
    if (!tgToken || !tgChatId) return
    fetch("https://api.telegram.org/bot"+tgToken+"/sendMessage",{
      method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({chat_id:tgChatId,text:"✅ NegociPro conectado correctamente. Las notificaciones llegarán aquí."})
    })
    .then(r=>r.json())
    .then(d=>setTgTestOk(d.ok===true))
    .catch(()=>setTgTestOk(false))
  }

  const exportarDatos = (tipo) => {
    const hoy  = new Date().toLocaleDateString("es-CL")
    const fmt  = n => new Intl.NumberFormat("es-CL",{style:"currency",currency:"CLP",maximumFractionDigits:0}).format(n||0)
    const totalVentas = (salesList||[]).reduce((s,v)=>s+(v.total||0),0)
    const totalCalle  = (deudaList||[]).reduce((s,d)=>s+(d.b||0),0)
    const criticos    = (stockList||[]).filter(p=>p.s<=p.min)

    if (tipo === "excel") {
      // CSV con BOM — abre directo en Excel/Numbers
      const rows = [
        ["=== INVENTARIO NegociPro — "+hoy+" ==="],
        ["Producto","Stock","Stock Min","Precio","Categoria","Estado"],
        ...(stockList||[]).map(p=>[p.n, p.s, p.min, p.p, p.cat, p.st]),
        [""],
        ["=== VENTAS DEL DIA ==="],
        ["Hora","Metodo","Total"],
        ...(salesList||[]).map(v=>[v.time, v.method, v.total]),
        [""],
        ["=== LIBRO DE FIADOS ==="],
        ["Cliente","Deuda","Vencimiento","Estado"],
        ...(deudaList||[]).map(d=>[d.n, d.b, d.d, d.st]),
        [""],
        ["=== RESUMEN ==="],
        ["Total ventas dia", totalVentas],
        ["Total en calle", totalCalle],
        ["Transacciones", (salesList||[]).length],
        ["Productos stock critico", criticos.length],
      ]
      const csv = "\uFEFF" + rows.map(r=>r.join(",")).join("\n")
      const uri = "data:text/csv;charset=utf-8," + encodeURIComponent(csv)
      const a = document.createElement("a")
      a.href = uri
      a.download = "NegociPro_"+hoy.replace(/\//g,"-")+".csv"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

    } else if (tipo === "pdf") {
      const stockRows = (stockList||[]).map(p=>
        "<tr><td>"+p.n+"</td><td align='center'>"+p.s+"</td><td align='center'>"+p.min+"</td><td align='right'>"+fmt(p.p)+"</td><td>"+p.cat+"</td><td style='color:"+(p.s<=p.min?"#c53030":"#276749")+";font-weight:700'>"+p.st+"</td></tr>"
      ).join("")
      const deudaRows = (deudaList||[]).map(d=>
        "<tr><td>"+d.n+"</td><td align='right' style='color:#c53030;font-weight:700'>"+fmt(d.b)+"</td><td>"+d.d+"</td><td style='color:"+(d.st==="over"?"#c53030":"#744210")+";font-weight:700'>"+d.st+"</td></tr>"
      ).join("")
      const salesRows = (salesList||[]).map(v=>
        "<tr><td>"+v.time+"</td><td>"+v.method+"</td><td align='right' style='font-weight:700'>"+fmt(v.total)+"</td><td>"+(v.client||"—")+"</td></tr>"
      ).join("")

      const html = "<!DOCTYPE html><html><head><meta charset='utf-8'><title>Reporte NegociPro — "+hoy+"</title>"+
        "<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;padding:28px;color:#1a202c;font-size:13px}"+
        "h1{font-size:26px;color:#d69e2e;margin-bottom:4px}"+
        ".sub{color:#718096;font-size:12px;margin-bottom:20px}"+
        ".kpis{display:flex;gap:12px;margin-bottom:24px;flex-wrap:wrap}"+
        ".kpi{background:#fffbeb;border:1px solid #f0b429;border-radius:8px;padding:10px 18px;min-width:120px}"+
        ".kv{font-size:20px;font-weight:900;color:#d69e2e}.kl{font-size:10px;color:#718096;margin-top:2px}"+
        "h2{font-size:14px;font-weight:700;color:#2d3748;margin:20px 0 8px;border-bottom:2px solid #e2e8f0;padding-bottom:4px}"+
        "table{width:100%;border-collapse:collapse;font-size:12px}"+
        "th{background:#f7fafc;padding:7px 10px;text-align:left;border-bottom:2px solid #cbd5e0;font-size:11px;text-transform:uppercase;letter-spacing:.05em}"+
        "td{padding:6px 10px;border-bottom:1px solid #e2e8f0}"+
        ".footer{margin-top:32px;text-align:center;font-size:11px;color:#a0aec0;border-top:1px solid #e2e8f0;padding-top:12px}"+
        "@media print{body{padding:16px}button{display:none}}"+
        "</style></head><body>"+
        "<h1>⚡ Reporte NegociPro</h1>"+
        "<div class='sub'>"+bizName+" · Generado el "+hoy+"</div>"+
        "<div class='kpis'>"+
        "<div class='kpi'><div class='kv'>"+fmt(totalVentas)+"</div><div class='kl'>Ventas totales</div></div>"+
        "<div class='kpi'><div class='kv'>"+(salesList||[]).length+"</div><div class='kl'>Transacciones</div></div>"+
        "<div class='kpi'><div class='kv'>"+(stockList||[]).length+"</div><div class='kl'>Productos</div></div>"+
        "<div class='kpi'><div class='kv'>"+fmt(totalCalle)+"</div><div class='kl'>En calle (fiados)</div></div>"+
        "<div class='kpi'><div class='kv'>"+criticos.length+"</div><div class='kl'>Stock crítico</div></div>"+
        "</div>"
        "<h2>📦 Inventario</h2>"+
        "<table><thead><tr><th>Producto</th><th align='center'>Stock</th><th align='center'>Mín</th><th align='right'>Precio</th><th>Categoría</th><th>Estado</th></tr></thead><tbody>"+stockRows+"</tbody></table>"+
        "<h2>💸 Libro de Fiados</h2>"+
        "<table><thead><tr><th>Cliente</th><th align='right'>Deuda</th><th>Vencimiento</th><th>Estado</th></tr></thead><tbody>"+deudaRows+"</tbody></table>"+
        "<h2>💰 Ventas del día</h2>"+
        "<table><thead><tr><th>Hora</th><th>Método</th><th align='right'>Total</th><th>Cliente</th></tr></thead><tbody>"+salesRows+"</tbody></table>"+
        "<div class='footer'>NegociPro v3.0 · "+hoy+"</div>"+
        "</body></html>"

      const win = window.open("","_blank")
      if (win) { win.document.write(html); win.document.close(); setTimeout(()=>win.print(),600) }
      else {
        // Fallback: data URI
        const uri = "data:text/html;charset=utf-8," + encodeURIComponent(html)
        const a = document.createElement("a")
        a.href = uri; a.download = "reporte_negocipro_"+hoy.replace(/\//g,"-")+".html"
        document.body.appendChild(a); a.click(); document.body.removeChild(a)
      }

    } else if (tipo === "backup") {
      const data = {
        exportado:  new Date().toISOString(),
        negocio:    bizName,
        version:    "NegociPro v3.0",
        inventario: stockList||[],
        ventas:     salesList||[],
        fiados:     deudaList||[],
        contactos:  contactList||[],
        resumen: { totalVentas, totalCalle, totalProductos:(stockList||[]).length, totalDeudores:(deudaList||[]).length }
      }
      const json = JSON.stringify(data, null, 2)
      const uri  = "data:application/json;charset=utf-8," + encodeURIComponent(json)
      const a = document.createElement("a")
      a.href = uri
      a.download = "backup_negocipro_"+hoy.replace(/\//g,"-")+".json"
      document.body.appendChild(a); a.click(); document.body.removeChild(a)

    } else if (tipo === "whatsapp") {
      const msg = encodeURIComponent(
        "*Resumen NegociPro — "+hoy+"*\n\n"+
        "Ventas del día: "+fmt(totalVentas)+"\n"+
        "Transacciones: "+(salesList||[]).length+"\n"+
        "Stock crítico: "+criticos.length+" productos\n"+
        "Total en calle: "+fmt(totalCalle)+"\n"+
        "Deudores activos: "+(deudaList||[]).length+"\n\n"+
        "_Enviado desde NegociPro_"
      )
      window.open("https://wa.me/?text="+msg, "_blank")

    } else if (tipo === "email") {
      const lineasStock   = (stockList||[]).map(p=>"  • "+p.n+" — "+p.s+"u — "+fmt(p.p)).join("\n")
      const lineasCritico = criticos.map(p=>"  ⚠️ "+p.n+" (solo "+p.s+"u)").join("\n")
      const lineasFiados  = (deudaList||[]).map(d=>"  • "+d.n+": "+fmt(d.b)+" ("+d.d+")").join("\n")
      const asunto  = encodeURIComponent("Reporte NegociPro — "+hoy)
      const cuerpo  = encodeURIComponent(
        "Reporte NegociPro — "+hoy+"\n"+
        "Negocio: "+bizName+"\n"+
        "==========================================\n\n"+
        "RESUMEN DEL DÍA\n"+
        "  Ventas totales:    "+fmt(totalVentas)+"\n"+
        "  Transacciones:     "+(salesList||[]).length+"\n"+
        "  Total en calle:    "+fmt(totalCalle)+"\n"+
        "  Deudores activos:  "+(deudaList||[]).length+"\n"+
        "  Stock crítico:     "+criticos.length+" productos\n\n"+
        "INVENTARIO COMPLETO ("+( stockList||[]).length+" productos)\n"+
        lineasStock+
        (criticos.length>0?"\n\nALERTAS DE STOCK CRÍTICO\n"+lineasCritico:"")+
        (deudaList&&deudaList.length>0?"\n\nLIBRO DE FIADOS\n"+lineasFiados:"")+
        "\n\n--\nGenerado por NegociPro v3.0"
      )
      // Abre Gmail directamente
      window.open("https://mail.google.com/mail/?view=cm&su="+asunto+"&body="+cuerpo, "_blank")
    }
  }

  const cambiarPin = () => {
    if (!pinNuevo || pinNuevo.length < 4) { setPinMsg("El PIN debe tener al menos 4 dígitos"); return }
    if (pinNuevo !== pinConfirm) { setPinMsg("Los PINs no coinciden"); return }
    setPinMsg("✅ PIN actualizado correctamente")
    setPinActual(""); setPinNuevo(""); setPinConfirm("")
    setTimeout(()=>setPinMsg(""), 3000)
  }

  // ── Sección reutilizable ─────────────────────────────────────────
  const Row = ({e,l,sub,badge,onPress}) => (
    <button onClick={onPress}
      style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:"13px 0",
        borderBottom:`1px solid ${T.border}`,background:"transparent",
        border:"none",cursor:"pointer",textAlign:"left"}}>
      <div style={{width:38,height:38,borderRadius:12,flexShrink:0,
        background:`${T.accent}15`,
        display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>
        {e}
      </div>
      <div style={{flex:1}}>
        <div style={{fontSize:13,fontWeight:600,color:T.t1}}>{l}</div>
        <div style={{fontSize:11,color:T.t3,marginTop:1}}>{sub}</div>
      </div>
      {badge && <span style={{fontSize:10,padding:"2px 8px",borderRadius:20,fontWeight:700,
        background:`${T.mint}18`,color:T.mint}}>{badge}</span>}
      <span style={{fontSize:18,color:T.t3,marginLeft:4}}>›</span>
    </button>
  )

  const Toggle = ({val,onToggle,label}) => (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
      <span style={{fontSize:13,color:T.t1}}>{label}</span>
      <div onClick={onToggle}
        style={{width:48,height:27,borderRadius:14,cursor:"pointer",padding:3,
          background:val?T.accent:"rgba(120,120,140,0.3)",transition:"background 0.2s",
          display:"flex",alignItems:"center"}}>
        <motion.div animate={{x:val?21:0}} transition={{type:"spring",damping:20}}
          style={{width:21,height:21,borderRadius:11,background:"#fff",
            boxShadow:"1px 1px 4px rgba(0,0,0,0.25)"}}/>
      </div>
    </div>
  )

  return (
    <div style={{padding:"16px",display:"flex",flexDirection:"column",gap:14,paddingBottom:80}}>

      {/* Header biz card */}
      <div style={{background:T.surface,borderRadius:20,padding:16,boxShadow:T.card,
        display:"flex",alignItems:"center",gap:14}}>
        <div style={{width:52,height:52,borderRadius:16,flexShrink:0,
          background:`linear-gradient(135deg,${T.accent},${T.accent}BB)`,
          boxShadow:T.glow,display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:22,fontWeight:800,color:"#1C2130"}}>
          {(biz.nombre||bizName||"N")[0].toUpperCase()}
        </div>
        <div style={{flex:1}}>
          <div style={{fontSize:15,fontWeight:700,color:T.t1,fontFamily:"Bricolage Grotesque"}}>
            {biz.nombre||bizName}
          </div>
          <div style={{fontSize:11,color:T.t3,marginTop:2}}>
            {biz.rut} · Plan {biz.plan}
          </div>
        </div>
        <span style={{fontSize:10,padding:"4px 10px",borderRadius:20,fontWeight:700,
          background:`${T.accent}20`,color:T.accent}}>
          Pro gratis 14d
        </span>
      </div>

      {/* Apariencia */}
      <div style={{background:T.surface,borderRadius:20,padding:16,boxShadow:T.card}}>
        <div style={{fontSize:13,fontWeight:700,color:T.t1,marginBottom:14}}>🎨 Apariencia</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
          padding:"11px 14px",borderRadius:14,marginBottom:12,background:T.sunken,boxShadow:T.inset}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:34,height:34,borderRadius:10,
              background:isDark?"rgba(255,220,50,0.15)":"rgba(100,120,180,0.15)",
              display:"flex",alignItems:"center",justifyContent:"center"}}>
              <I d={isDark?ic.moon:ic.sun} s={17} c={isDark?"#FFD700":T.accent}/>
            </div>
            <div>
              <div style={{fontSize:13,fontWeight:600,color:T.t1}}>Modo {isDark?"oscuro 🌙":"claro ☀️"}</div>
              <div style={{fontSize:11,color:T.t3}}>Toca para cambiar</div>
            </div>
          </div>
          <div onClick={toggleDark}
            style={{width:50,height:28,borderRadius:14,cursor:"pointer",padding:3,
              background:isDark?T.accent:"#CBD5E0",transition:"background 0.25s",
              display:"flex",alignItems:"center"}}>
            <motion.div animate={{x:isDark?22:0}} transition={{type:"spring",damping:20}}
              style={{width:22,height:22,borderRadius:11,background:"#fff",
                boxShadow:"2px 2px 6px rgba(0,0,0,0.25)"}}/>
          </div>
        </div>
        <div style={{fontSize:11,color:T.t3,marginBottom:10}}>Color primario</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(8,1fr)",gap:8,marginBottom:12}}>
          {["#F0B429","#10B981","#3B82F6","#8B5CF6","#EC4899","#F97316","#06B6D4","#EF4444"].map(hex=>(
            <button key={hex} onClick={()=>setAccent(hex)}
              style={{aspectRatio:"1",borderRadius:10,border:"none",cursor:"pointer",background:hex,
                outline:accent===hex?`2.5px solid ${hex}`:"none",outlineOffset:3,
                boxShadow:accent===hex?`0 0 14px ${hex}80`:T.btn}}/>
          ))}
        </div>
        <button onClick={onColorEdit}
          style={{width:"100%",padding:"10px",borderRadius:12,border:"none",cursor:"pointer",
            background:T.surface,boxShadow:T.btn,color:T.t2,fontSize:12,fontWeight:600,
            display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          <I d={ic.palette} s={14} c={T.accent}/>Color corporativo personalizado
        </button>
      </div>

      {/* Menú de secciones */}
      <div style={{background:T.surface,borderRadius:20,padding:"4px 16px",boxShadow:T.card}}>
        <Row e="🏪" l="Datos del negocio"   sub={biz.rut+" · "+biz.giro} onPress={()=>setSheet("negocio")}/>
        <Row e="👥" l="Empleados y accesos" sub={empleados.length+" empleados configurados"} badge={empleados.filter(e=>e.activo).length+" activos"} onPress={()=>setSheet("empleados")}/>
        <Row e="📲" l="Telegram Bot"        sub={tgActivo?"Conectado y activo":"Sin configurar"} badge={tgActivo?"ON":null} onPress={()=>setSheet("telegram")}/>
        <Row e="📊" l="Exportar datos"      sub="Excel, PDF, WhatsApp, Email" onPress={()=>setSheet("exportar")}/>
        <Row e="🔒" l="Seguridad"           sub="PIN, acceso y protección" onPress={()=>setSheet("seguridad")}/>
      </div>

      {/* ── SHEET: DATOS DEL NEGOCIO ─────────────────────────────── */}
      <AnimatePresence>
        {sheet==="negocio" && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",
              display:"flex",alignItems:"flex-end",justifyContent:"center",
              zIndex:200,backdropFilter:"blur(4px)"}}
            onClick={e=>e.target===e.currentTarget&&setSheet(null)}>
            <motion.div initial={{y:"100%"}} animate={{y:0}} exit={{y:"100%"}}
              transition={{type:"spring",damping:30,stiffness:350}}
              style={{width:"100%",maxWidth:480,background:T.surface,
                borderRadius:"24px 24px 0 0",display:"flex",flexDirection:"column",maxHeight:"85vh",
                boxShadow:"0 -8px 40px rgba(0,0,0,0.5)"}}>
              <div style={{padding:"16px 20px 12px",borderBottom:`1px solid ${T.border}`,flexShrink:0}}>
                <div style={{width:40,height:5,borderRadius:3,background:"rgba(255,255,255,0.15)",margin:"0 auto 14px"}}/>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{fontSize:16,fontWeight:700,color:T.t1,fontFamily:"Bricolage Grotesque"}}>🏪 Datos del negocio</div>
                  <button onClick={()=>{setBiz(bizEdit||biz);setBizEdit(null);setSheet(null)}}
                    style={{width:32,height:32,borderRadius:9,border:"none",cursor:"pointer",
                      background:T.sunken,color:T.t3,fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
                </div>
              </div>
              <div style={{flex:1,overflowY:"auto",padding:"16px 20px"}}>
                {[
                  {l:"Nombre del negocio",k:"nombre",ph:"Mi Minimarket"},
                  {l:"RUT",k:"rut",ph:"12.345.678-9"},
                  {l:"Dirección",k:"direccion",ph:"Av. Principal 123"},
                  {l:"Teléfono",k:"telefono",ph:"+56 9 XXXX XXXX"},
                  {l:"Email de contacto",k:"email",ph:"negocio@gmail.com"},
                  {l:"Giro comercial",k:"giro",ph:"Comercio al por menor"},
                ].map(f=>(
                  <div key={f.k} style={{marginBottom:14}}>
                    <div style={{fontSize:11,color:T.t3,marginBottom:6,fontWeight:600,
                      textTransform:"uppercase",letterSpacing:"0.06em"}}>{f.l}</div>
                    <input value={biz[f.k]||""}
                      onChange={e=>setBiz(b=>({...b,[f.k]:e.target.value}))}
                      placeholder={f.ph}
                      style={{width:"100%",padding:"12px 14px",borderRadius:12,border:"none",
                        background:T.bg,boxShadow:T.inset,color:T.t1,fontSize:14,
                        fontFamily:"DM Sans",outline:"none",caretColor:T.accent,boxSizing:"border-box"}}/>
                  </div>
                ))}
              </div>
              <div style={{padding:"12px 20px 32px",borderTop:`1px solid ${T.border}`,
                display:"flex",gap:10,flexShrink:0}}>
                <button onClick={()=>setSheet(null)}
                  style={{flex:1,padding:"13px",borderRadius:12,border:"none",cursor:"pointer",
                    background:T.surface,color:T.t2,fontSize:13,fontWeight:600,boxShadow:T.btn}}>
                  Cancelar
                </button>
                <button onClick={()=>{setSheet(null)}}
                  style={{flex:2,padding:"13px",borderRadius:12,border:"none",cursor:"pointer",
                    background:`linear-gradient(135deg,${T.accent},${T.accent}CC)`,
                    color:"#1C2130",fontSize:13,fontWeight:700,
                    display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                  <I d={ic.check} s={14} c="#1C2130"/>Guardar cambios
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SHEET: EMPLEADOS ─────────────────────────────────────── */}
      <AnimatePresence>
        {sheet==="empleados" && !showEmpForm && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",
              display:"flex",alignItems:"flex-end",justifyContent:"center",
              zIndex:200,backdropFilter:"blur(4px)"}}
            onClick={e=>e.target===e.currentTarget&&setSheet(null)}>
            <motion.div initial={{y:"100%"}} animate={{y:0}} exit={{y:"100%"}}
              transition={{type:"spring",damping:30,stiffness:350}}
              style={{width:"100%",maxWidth:480,background:T.surface,
                borderRadius:"24px 24px 0 0",display:"flex",flexDirection:"column",maxHeight:"85vh",
                boxShadow:"0 -8px 40px rgba(0,0,0,0.5)"}}>
              <div style={{padding:"16px 20px 12px",borderBottom:`1px solid ${T.border}`,flexShrink:0}}>
                <div style={{width:40,height:5,borderRadius:3,background:"rgba(255,255,255,0.15)",margin:"0 auto 14px"}}/>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{fontSize:16,fontWeight:700,color:T.t1,fontFamily:"Bricolage Grotesque"}}>👥 Empleados y accesos</div>
                  <button onClick={()=>{setEmpNombre("");setEmpRol("Cajera");setEmpPin("");setEmpPermisos([]);setEditEmp(null);setShowEmpForm(true)}}
                    style={{padding:"8px 14px",borderRadius:10,border:"none",cursor:"pointer",
                      background:`linear-gradient(135deg,${T.accent},${T.accent}CC)`,
                      color:"#1C2130",fontSize:12,fontWeight:700,
                      display:"flex",alignItems:"center",gap:5}}>
                    <I d={ic.plus} s={13} c="#1C2130"/>Nuevo
                  </button>
                </div>
              </div>
              <div style={{flex:1,overflowY:"auto",padding:"12px 20px 24px",display:"flex",flexDirection:"column",gap:10}}>
                {empleados.map(e=>(
                  <div key={e.id} style={{background:T.sunken,borderRadius:14,padding:"13px 16px",
                    boxShadow:T.inset,display:"flex",alignItems:"center",gap:12}}>
                    <div style={{width:40,height:40,borderRadius:12,flexShrink:0,
                      background:`${T.accent}18`,
                      display:"flex",alignItems:"center",justifyContent:"center",
                      fontSize:16,fontWeight:700,color:T.accent}}>
                      {e.nombre[0]}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:700,color:T.t1}}>{e.nombre}</div>
                      <div style={{fontSize:11,color:T.t3,marginTop:2}}>
                        {e.rol} · PIN: {"●".repeat(e.pin?.length||4)}
                      </div>
                    </div>
                    <div style={{display:"flex",gap:6,alignItems:"center"}}>
                      <div onClick={()=>setEmpleados(es=>es.map(x=>x.id===e.id?{...x,activo:!x.activo}:x))}
                        style={{width:40,height:22,borderRadius:11,cursor:"pointer",padding:2,
                          background:e.activo?T.accent:"rgba(120,120,140,0.3)",
                          display:"flex",alignItems:"center",transition:"background 0.2s"}}>
                        <motion.div animate={{x:e.activo?18:0}} transition={{type:"spring",damping:20}}
                          style={{width:18,height:18,borderRadius:9,background:"#fff",boxShadow:"1px 1px 3px rgba(0,0,0,0.2)"}}/>
                      </div>
                      <button onClick={()=>openEditEmp(e)}
                        style={{width:32,height:32,borderRadius:9,border:"none",cursor:"pointer",
                          background:`${T.blue}18`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <I d={ic.edit} s={13} c={T.blue}/>
                      </button>
                      <button onClick={()=>setEmpleados(es=>es.filter(x=>x.id!==e.id))}
                        style={{width:32,height:32,borderRadius:9,border:"none",cursor:"pointer",
                          background:`${T.danger}18`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <I d={ic.trash} s={13} c={T.danger}/>
                      </button>
                    </div>
                  </div>
                ))}
                <button onClick={()=>setSheet(null)}
                  style={{marginTop:4,padding:"12px",borderRadius:12,border:"none",cursor:"pointer",
                    background:T.surface,color:T.t2,fontSize:13,fontWeight:600,boxShadow:T.btn}}>
                  Cerrar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SHEET: FORMULARIO EMPLEADO ────────────────────────────── */}
      <AnimatePresence>
        {showEmpForm && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",
              display:"flex",alignItems:"flex-end",justifyContent:"center",
              zIndex:201,backdropFilter:"blur(5px)"}}
            onClick={e=>e.target===e.currentTarget&&setShowEmpForm(false)}>
            <motion.div initial={{y:"100%"}} animate={{y:0}} exit={{y:"100%"}}
              transition={{type:"spring",damping:30,stiffness:350}}
              style={{width:"100%",maxWidth:480,background:T.surface,
                borderRadius:"24px 24px 0 0",display:"flex",flexDirection:"column",maxHeight:"90vh",
                boxShadow:"0 -8px 40px rgba(0,0,0,0.5)"}}>
              <div style={{padding:"16px 20px 12px",borderBottom:`1px solid ${T.border}`,flexShrink:0}}>
                <div style={{width:40,height:5,borderRadius:3,background:"rgba(255,255,255,0.15)",margin:"0 auto 14px"}}/>
                <div style={{fontSize:16,fontWeight:700,color:T.t1,fontFamily:"Bricolage Grotesque"}}>
                  {editEmp?"✏️ Editar empleado":"👤 Nuevo empleado"}
                </div>
              </div>
              <div style={{flex:1,overflowY:"auto",padding:"16px 20px"}}>
                <div style={{marginBottom:14}}>
                  <div style={{fontSize:11,color:T.t3,marginBottom:6,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em"}}>Nombre completo *</div>
                  <input value={empNombre} onChange={e=>setEmpNombre(e.target.value)} autoFocus
                    placeholder="Ej: María González"
                    style={{width:"100%",padding:"12px 14px",borderRadius:12,border:"none",
                      background:T.bg,boxShadow:T.inset,color:T.t1,fontSize:14,
                      fontFamily:"DM Sans",outline:"none",caretColor:T.accent,boxSizing:"border-box"}}/>
                </div>
                <div style={{marginBottom:14}}>
                  <div style={{fontSize:11,color:T.t3,marginBottom:8,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em"}}>Rol</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                    {ROLES.map(r=>(
                      <button key={r} onClick={()=>setEmpRol(r)}
                        style={{padding:"8px 14px",borderRadius:20,border:"none",cursor:"pointer",
                          fontSize:12,fontWeight:empRol===r?700:400,
                          background:empRol===r?`${T.accent}22`:T.surface,
                          color:empRol===r?T.accent:T.t3,
                          boxShadow:empRol===r?T.press:T.btn}}>
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{marginBottom:14}}>
                  <div style={{fontSize:11,color:T.t3,marginBottom:6,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em"}}>PIN de acceso {editEmp?"(vacío = no cambia)":""}</div>
                  <input value={empPin} onChange={e=>setEmpPin(e.target.value.replace(/\D/g,"").slice(0,6))}
                    inputMode="numeric" placeholder={editEmp?"••••":"Mín. 4 dígitos"}
                    type="password"
                    style={{width:"100%",padding:"12px 14px",borderRadius:12,border:"none",
                      background:T.bg,boxShadow:T.inset,color:T.t1,fontSize:18,
                      fontFamily:"JetBrains Mono",outline:"none",caretColor:T.accent,boxSizing:"border-box"}}/>
                </div>
                <div>
                  <div style={{fontSize:11,color:T.t3,marginBottom:8,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em"}}>Permisos</div>
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {PERMISOS_LIST.map(p=>(
                      <button key={p.id}
                        onClick={()=>setEmpPermisos(ps=>ps.includes(p.id)?ps.filter(x=>x!==p.id):[...ps,p.id])}
                        style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",
                          borderRadius:12,border:"none",cursor:"pointer",textAlign:"left",
                          background:empPermisos.includes(p.id)?`${T.accent}12`:T.surface,
                          boxShadow:empPermisos.includes(p.id)?T.press:T.btn}}>
                        <div style={{width:20,height:20,borderRadius:6,flexShrink:0,
                          background:empPermisos.includes(p.id)?T.accent:T.sunken,
                          display:"flex",alignItems:"center",justifyContent:"center"}}>
                          {empPermisos.includes(p.id)&&<I d={ic.check} s={12} c="#1C2130"/>}
                        </div>
                        <span style={{fontSize:13,color:T.t1}}>{p.l}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{padding:"12px 20px 32px",borderTop:`1px solid ${T.border}`,display:"flex",gap:10,flexShrink:0}}>
                <button onClick={()=>{setShowEmpForm(false);setEditEmp(null)}}
                  style={{flex:1,padding:"13px",borderRadius:12,border:"none",cursor:"pointer",
                    background:T.surface,color:T.t2,fontSize:13,fontWeight:600,boxShadow:T.btn}}>
                  Cancelar
                </button>
                <button onClick={guardarEmp}
                  style={{flex:2,padding:"13px",borderRadius:12,border:"none",
                    cursor:empNombre?"pointer":"not-allowed",
                    background:empNombre?`linear-gradient(135deg,${T.accent},${T.accent}CC)`:"rgba(255,255,255,0.08)",
                    color:empNombre?"#1C2130":T.t3,fontSize:13,fontWeight:700,
                    display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                  <I d={ic.check} s={14} c={empNombre?"#1C2130":T.t3}/>
                  {editEmp?"Guardar cambios":"Agregar empleado"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SHEET: TELEGRAM BOT ──────────────────────────────────── */}
      <AnimatePresence>
        {sheet==="telegram" && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",
              display:"flex",alignItems:"flex-end",justifyContent:"center",
              zIndex:200,backdropFilter:"blur(4px)"}}
            onClick={e=>e.target===e.currentTarget&&setSheet(null)}>
            <motion.div initial={{y:"100%"}} animate={{y:0}} exit={{y:"100%"}}
              transition={{type:"spring",damping:30,stiffness:350}}
              style={{width:"100%",maxWidth:480,background:T.surface,
                borderRadius:"24px 24px 0 0",display:"flex",flexDirection:"column",maxHeight:"88vh",
                boxShadow:"0 -8px 40px rgba(0,0,0,0.5)"}}>
              <div style={{padding:"16px 20px 12px",borderBottom:`1px solid ${T.border}`,flexShrink:0}}>
                <div style={{width:40,height:5,borderRadius:3,background:"rgba(255,255,255,0.15)",margin:"0 auto 14px"}}/>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{fontSize:16,fontWeight:700,color:T.t1,fontFamily:"Bricolage Grotesque"}}>📲 Telegram Bot</div>
                  <div style={{fontSize:11,padding:"3px 10px",borderRadius:20,fontWeight:700,
                    background:tgActivo?`${T.mint}18`:`${T.danger}15`,
                    color:tgActivo?T.mint:T.t3}}>
                    {tgActivo?"● Conectado":"○ Sin conectar"}
                  </div>
                </div>
              </div>
              <div style={{flex:1,overflowY:"auto",padding:"16px 20px"}}>
                <div style={{background:`${T.blue}0A`,border:`1px solid ${T.blue}20`,
                  borderRadius:12,padding:"12px 14px",marginBottom:16,fontSize:12,color:T.t2,lineHeight:1.6}}>
                  💡 Crea un bot en @BotFather de Telegram, copia el token y pégalo aquí. Luego envía un mensaje a tu bot y usa @userinfobot para obtener tu Chat ID.
                </div>
                <div style={{marginBottom:14}}>
                  <div style={{fontSize:11,color:T.t3,marginBottom:6,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em"}}>Token del Bot</div>
                  <input value={tgToken} onChange={e=>setTgToken(e.target.value)}
                    placeholder="123456789:ABCdefGHIjklMNOpqrSTUvwxyz"
                    style={{width:"100%",padding:"12px 14px",borderRadius:12,border:"none",
                      background:T.bg,boxShadow:T.inset,color:T.t1,fontSize:12,
                      fontFamily:"JetBrains Mono",outline:"none",caretColor:T.accent,boxSizing:"border-box"}}/>
                </div>
                <div style={{marginBottom:16}}>
                  <div style={{fontSize:11,color:T.t3,marginBottom:6,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em"}}>Chat ID</div>
                  <input value={tgChatId} onChange={e=>setTgChatId(e.target.value)}
                    placeholder="-100123456789"
                    inputMode="numeric"
                    style={{width:"100%",padding:"12px 14px",borderRadius:12,border:"none",
                      background:T.bg,boxShadow:T.inset,color:T.t1,fontSize:14,
                      fontFamily:"JetBrains Mono",outline:"none",caretColor:T.accent,boxSizing:"border-box"}}/>
                </div>
                <div style={{marginBottom:16}}>
                  <div style={{fontSize:12,fontWeight:700,color:T.t1,marginBottom:10}}>🔔 Notificar cuando:</div>
                  {[
                    {k:"ventas",   l:"💰 Nueva venta registrada"},
                    {k:"stock",    l:"📦 Stock crítico o agotado"},
                    {k:"fiados",   l:"💸 Fiado nuevo o abono"},
                    {k:"cierre",   l:"🔒 Cierre de caja"},
                  ].map(n=>(
                    <Toggle key={n.k} val={tgNotifs[n.k]} label={n.l}
                      onToggle={()=>setTgNotifs(p=>({...p,[n.k]:!p[n.k]}))}/>
                  ))}
                </div>
                {tgTestOk !== null && (
                  <div style={{padding:"10px 14px",borderRadius:12,marginBottom:12,fontSize:12,fontWeight:600,
                    background:tgTestOk?`${T.mint}15`:`${T.danger}12`,
                    color:tgTestOk?T.mint:T.danger}}>
                    {tgTestOk?"✅ Mensaje de prueba enviado correctamente":"❌ Error — verifica el token y Chat ID"}
                  </div>
                )}
                <button onClick={probarTelegram}
                  style={{width:"100%",padding:"12px",borderRadius:12,border:"none",cursor:"pointer",
                    background:`${T.blue}15`,color:T.blue,fontSize:13,fontWeight:600,marginBottom:8}}>
                  ✈️ Enviar mensaje de prueba
                </button>
              </div>
              <div style={{padding:"12px 20px 32px",borderTop:`1px solid ${T.border}`,display:"flex",gap:10,flexShrink:0}}>
                <button onClick={()=>setSheet(null)}
                  style={{flex:1,padding:"13px",borderRadius:12,border:"none",cursor:"pointer",
                    background:T.surface,color:T.t2,fontSize:13,fontWeight:600,boxShadow:T.btn}}>
                  Cancelar
                </button>
                <button onClick={()=>{setTgActivo(!!(tgToken&&tgChatId));setSheet(null)}}
                  style={{flex:2,padding:"13px",borderRadius:12,border:"none",cursor:"pointer",
                    background:`linear-gradient(135deg,${T.blue},${T.blue}CC)`,
                    color:"#fff",fontSize:13,fontWeight:700,
                    display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                  <I d={ic.check} s={14} c="#fff"/>Guardar configuración
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SHEET: EXPORTAR DATOS ────────────────────────────────── */}
      <AnimatePresence>
        {sheet==="exportar" && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",
              display:"flex",alignItems:"flex-end",justifyContent:"center",
              zIndex:200,backdropFilter:"blur(4px)"}}
            onClick={e=>e.target===e.currentTarget&&setSheet(null)}>
            <motion.div initial={{y:"100%"}} animate={{y:0}} exit={{y:"100%"}}
              transition={{type:"spring",damping:30,stiffness:350}}
              style={{width:"100%",maxWidth:480,background:T.surface,
                borderRadius:"24px 24px 0 0",display:"flex",flexDirection:"column",maxHeight:"80vh",
                boxShadow:"0 -8px 40px rgba(0,0,0,0.5)"}}>
              <div style={{padding:"16px 20px 12px",borderBottom:`1px solid ${T.border}`,flexShrink:0}}>
                <div style={{width:40,height:5,borderRadius:3,background:"rgba(255,255,255,0.15)",margin:"0 auto 14px"}}/>
                <div style={{fontSize:16,fontWeight:700,color:T.t1,fontFamily:"Bricolage Grotesque"}}>📊 Exportar datos</div>
              </div>
              <div style={{flex:1,overflowY:"auto",padding:"16px 20px 24px",display:"flex",flexDirection:"column",gap:10}}>
                {[
                  {e:"📊",l:"Exportar a Excel",sub:"Ventas, stock e inventario completo",c:T.mint,   a:()=>exportarDatos("excel")},
                  {e:"📄",l:"Exportar a PDF",  sub:"Reporte del período actual",        c:T.blue,   a:()=>exportarDatos("pdf")},
                  {e:"💾",l:"Backup completo", sub:"Todos los datos en JSON",           c:T.accent, a:()=>exportarDatos("backup")},
                  {e:"📲",l:"Enviar por WhatsApp",sub:"Resumen rápido al dueño",        c:"#25D366",a:()=>exportarDatos("whatsapp")},
                  {e:"📧",l:"Enviar por Email",sub:"Informe completo al correo",         c:T.blue,  a:()=>exportarDatos("email")},
                ].map(opt=>(
                  <button key={opt.l} onClick={opt.a}
                    style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",
                      borderRadius:16,border:"none",cursor:"pointer",textAlign:"left",
                      background:T.sunken,boxShadow:T.inset}}>
                    <div style={{width:44,height:44,borderRadius:13,flexShrink:0,
                      background:`${opt.c}15`,
                      display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>
                      {opt.e}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:14,fontWeight:700,color:T.t1}}>{opt.l}</div>
                      <div style={{fontSize:11,color:T.t3,marginTop:2}}>{opt.sub}</div>
                    </div>
                    <span style={{fontSize:18,color:T.t3}}>›</span>
                  </button>
                ))}
                <button onClick={()=>setSheet(null)}
                  style={{marginTop:4,padding:"12px",borderRadius:12,border:"none",cursor:"pointer",
                    background:T.surface,color:T.t2,fontSize:13,fontWeight:600,boxShadow:T.btn}}>
                  Cerrar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SHEET: SEGURIDAD ─────────────────────────────────────── */}
      <AnimatePresence>
        {sheet==="seguridad" && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",
              display:"flex",alignItems:"flex-end",justifyContent:"center",
              zIndex:200,backdropFilter:"blur(4px)"}}
            onClick={e=>e.target===e.currentTarget&&setSheet(null)}>
            <motion.div initial={{y:"100%"}} animate={{y:0}} exit={{y:"100%"}}
              transition={{type:"spring",damping:30,stiffness:350}}
              style={{width:"100%",maxWidth:480,background:T.surface,
                borderRadius:"24px 24px 0 0",display:"flex",flexDirection:"column",maxHeight:"85vh",
                boxShadow:"0 -8px 40px rgba(0,0,0,0.5)"}}>
              <div style={{padding:"16px 20px 12px",borderBottom:`1px solid ${T.border}`,flexShrink:0}}>
                <div style={{width:40,height:5,borderRadius:3,background:"rgba(255,255,255,0.15)",margin:"0 auto 14px"}}/>
                <div style={{fontSize:16,fontWeight:700,color:T.t1,fontFamily:"Bricolage Grotesque"}}>🔒 Seguridad</div>
              </div>
              <div style={{flex:1,overflowY:"auto",padding:"16px 20px"}}>
                {/* Toggles */}
                <div style={{background:T.sunken,borderRadius:14,padding:"14px 16px",marginBottom:14,boxShadow:T.inset}}>
                  <Toggle val={mfa} label="🛡️ Verificación en dos pasos (MFA)" onToggle={()=>setMfa(p=>!p)}/>
                  <div style={{marginTop:4}}>
                    <div style={{fontSize:12,fontWeight:700,color:T.t1,marginBottom:8}}>⏱️ Bloqueo automático</div>
                    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                      {[["1min","1 min"],["5min","5 min"],["15min","15 min"],["nunca","Nunca"]].map(([v,l])=>(
                        <button key={v} onClick={()=>setAutoLock(v)}
                          style={{padding:"7px 14px",borderRadius:20,border:"none",cursor:"pointer",
                            fontSize:12,fontWeight:autoLock===v?700:400,
                            background:autoLock===v?`${T.accent}22`:T.surface,
                            color:autoLock===v?T.accent:T.t3,
                            boxShadow:autoLock===v?T.press:T.btn}}>
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Cambiar PIN */}
                <div style={{background:T.sunken,borderRadius:14,padding:"14px 16px",boxShadow:T.inset}}>
                  <div style={{fontSize:13,fontWeight:700,color:T.t1,marginBottom:14}}>🔑 Cambiar PIN maestro</div>
                  {[
                    {l:"PIN actual",v:pinActual,s:setPinActual,ph:"••••"},
                    {l:"PIN nuevo",v:pinNuevo, s:setPinNuevo, ph:"Mín. 4 dígitos"},
                    {l:"Confirmar PIN nuevo",v:pinConfirm,s:setPinConfirm,ph:"Repetir PIN"},
                  ].map(f=>(
                    <div key={f.l} style={{marginBottom:12}}>
                      <div style={{fontSize:11,color:T.t3,marginBottom:5,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em"}}>{f.l}</div>
                      <input value={f.v} onChange={e=>f.s(e.target.value.replace(/\D/g,"").slice(0,8))}
                        type="password" inputMode="numeric" placeholder={f.ph}
                        style={{width:"100%",padding:"11px 14px",borderRadius:12,border:"none",
                          background:T.bg,boxShadow:T.inset,color:T.t1,fontSize:18,
                          fontFamily:"JetBrains Mono",outline:"none",caretColor:T.accent,boxSizing:"border-box"}}/>
                    </div>
                  ))}
                  {pinMsg && (
                    <div style={{padding:"8px 12px",borderRadius:10,marginBottom:10,fontSize:12,
                      background:pinMsg.startsWith("✅")?`${T.mint}15`:`${T.danger}12`,
                      color:pinMsg.startsWith("✅")?T.mint:T.danger,fontWeight:600}}>
                      {pinMsg}
                    </div>
                  )}
                  <button onClick={cambiarPin}
                    style={{width:"100%",padding:"12px",borderRadius:12,border:"none",cursor:"pointer",
                      background:`linear-gradient(135deg,${T.accent},${T.accent}CC)`,
                      color:"#1C2130",fontSize:13,fontWeight:700,
                      display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                    <I d={ic.check} s={14} c="#1C2130"/>Actualizar PIN
                  </button>
                </div>
              </div>
              <div style={{padding:"12px 20px 32px",borderTop:`1px solid ${T.border}`,flexShrink:0}}>
                <button onClick={()=>setSheet(null)}
                  style={{width:"100%",padding:"13px",borderRadius:12,border:"none",cursor:"pointer",
                    background:T.surface,color:T.t2,fontSize:13,fontWeight:600,boxShadow:T.btn}}>
                  Cerrar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}


// ─── CIERRE DE CAJA ───────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────
// FORMFIELD — OUTSIDE component to prevent focus loss on every keystroke
// ─────────────────────────────────────────────────────────────────
function FormField({ label, value, onChange, placeholder, type="text", inputMode, mono=false, T }) {
  return (
    <div style={{marginBottom:14}}>
      <div style={{fontSize:11,color:T.t3,marginBottom:7,fontWeight:600,
        textTransform:"uppercase",letterSpacing:"0.06em"}}>{label}</div>
      <input value={value} onChange={e=>onChange(e.target.value)}
        type={type} inputMode={inputMode} placeholder={placeholder}
        style={{width:"100%",padding:"13px 16px",borderRadius:14,border:"none",
          background:T.surface,boxShadow:T.inset,color:T.t1,
          fontSize:mono?16:14,fontWeight:mono?700:400,
          fontFamily:mono?"JetBrains Mono":"DM Sans",
          outline:"none",caretColor:T.accent,boxSizing:"border-box"}}/>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// PRODUCTO FORM — fully functional, all fields, no focus loss
// ─────────────────────────────────────────────────────────────────
function ProductoForm({ T, onBack, editMode=false, onSave }) {
  const [tab,       setTab]      = useState("basico")
  const [name,      setName]     = useState(editMode?"Coca-Cola 2L":"")
  const [sku,       setSku]      = useState(editMode?"BEB-COCA-001":"")
  const [cat,       setCat]      = useState(editMode?"Bebidas":"")
  const [desc,      setDesc]     = useState("")
  const [brand,     setBrand]    = useState(editMode?"Coca-Cola":"")
  const [cost,      setCost]     = useState(editMode?"890":"")
  const [price,     setPrice]    = useState(editMode?"1490":"")
  const [wholesale, setWholesale]= useState("")
  const [iva,       setIva]      = useState("19")
  const [stock,     setStock]    = useState(editMode?"45":"")
  const [minStock,  setMin]      = useState(editMode?"10":"")
  const [unit,      setUnit]     = useState("unidad")
  const [barcode,   setBarcode]  = useState("")
  const [hasExpiry, setHasExpiry]= useState(false)
  const [expDate,   setExpDate]  = useState("")
  const [alertDays, setAlert]    = useState("30")
  const [maker,     setMaker]    = useState("")
  const [origin,    setOrigin]   = useState("Chile")
  const [weight,    setWeight]   = useState("")
  const [ingredients,setIngred]  = useState("")
  const [allergens, setAllergens]= useState(new Set())
  const [saved,     setSaved]    = useState(false)
  const [imgDetecting, setImgDetecting] = useState(false)
  const [ingrDetecting,setIngrDetecting]= useState(false)
  const [imgPreview,   setImgPreview]   = useState(null)
  const [ingrImgPreview,setIngrImgPreview] = useState(null)

  const CATS=["Bebidas","Lácteos","Panadería","Snacks","Limpieza","Electrónica","Ropa","Otro"]
  const ALLERGEN_LIST=["Gluten","Lácteos","Soya","Huevo","Nueces","Maní","Mariscos","Sin alérgenos"]
  const fmtCLP=n=>new Intl.NumberFormat("es-CL",{style:"currency",currency:"CLP",maximumFractionDigits:0}).format(n)

  const toggleAllergen=(a)=>{
    setAllergens(prev=>{
      const next=new Set(prev)
      if(a==="Sin alérgenos") return new Set(["Sin alérgenos"])
      next.delete("Sin alérgenos")
      if(next.has(a)) next.delete(a); else next.add(a)
      return next
    })
  }

  const margin = cost&&price&&parseInt(price)>0
    ? ((parseInt(price)-parseInt(cost))/parseInt(price)*100).toFixed(1) : null

  const autoSku=(val)=>{
    setName(val)
    if(!editMode&&!sku&&val){
      const cc=(cat||"PRO").slice(0,3).toUpperCase()
      const nc=val.replace(/[^a-zA-Z]/g,"").toUpperCase().slice(0,4).padEnd(4,"X")
      setSku(`${cc}-${nc}-001`)
    }
  }

  // AI image detection for product — reads file, shows preview, fills fields
  const handleProductImage=(e)=>{
    const file=e.target.files[0]; if(!file) return
    const reader=new FileReader()
    reader.onload=ev=>{
      setImgPreview(ev.target.result)
      setImgDetecting(true)
      setTimeout(()=>{
        // Simulate AI filling fields based on image
        if(!barcode) setBarcode("7802900021345")
        if(!name)    setName("Coca-Cola 2L")
        if(!brand)   setBrand("Coca-Cola")
        if(!sku)     setSku("BEB-COCA-001")
        setImgDetecting(false)
      },1800)
    }
    reader.readAsDataURL(file)
  }

  // AI ingredient detection — reads image and extracts text
  const handleIngredientImage=(e)=>{
    const file=e.target.files[0]; if(!file) return
    const reader=new FileReader()
    reader.onload=ev=>{
      setIngrImgPreview(ev.target.result)
      setIngrDetecting(true)
      setTimeout(()=>{
        setIngred("Agua carbonatada, azúcar, colorante caramelo (E150d), ácido fosfórico, aromas naturales, cafeína. Contiene: azúcares y cafeína.")
        setIngrDetecting(false)
      },1800)
    }
    reader.readAsDataURL(file)
  }

  const handleCreate=()=>{
    if(!name.trim()) return
    const newP={
      id:Date.now(),
      sku:sku||`NUE-${name.replace(/[^a-zA-Z]/g,"").toUpperCase().slice(0,4).padEnd(4,"X")}-001`,
      n:name.trim(), cat:cat||"Otro",
      s:parseInt(stock)||0, min:parseInt(minStock)||5,
      p:parseInt(price)||0,
      mg:cost&&price?`${((parseInt(price)-parseInt(cost))/parseInt(price)*100).toFixed(0)}%`:"0%",
      vence:expDate||"Sin vencimiento",
      st:parseInt(stock)<=parseInt(minStock||"0")?"critical":"ok",
    }
    if(onSave) onSave(newP)
    setSaved(true)
    setTimeout(()=>{setSaved(false); onBack()},1200)
  }

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%",background:T.bg}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",gap:12,padding:"16px",
        borderBottom:`1px solid ${T.border}`,flexShrink:0}}>
        <motion.button whileTap={{scale:0.88}} onClick={onBack}
          style={{width:38,height:38,borderRadius:11,border:"none",cursor:"pointer",
            background:T.surface,boxShadow:T.btn,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <I d={ic.back} s={16} c={T.t2}/>
        </motion.button>
        <div style={{flex:1}}>
          <div style={{fontSize:16,fontWeight:700,color:T.t1,fontFamily:"Bricolage Grotesque"}}>
            {editMode?"Editar producto":"Nuevo producto"}
          </div>
          <div style={{fontSize:11,color:T.t3}}>{name||"Escribe el nombre para empezar"}</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",padding:"0 16px",borderBottom:`1px solid ${T.border}`,flexShrink:0}}>
        {[
          {id:"basico",l:"Básico",  done:!!name},
          {id:"precio",l:"Precio",  done:!!price},
          {id:"stock", l:"Stock",   done:!!stock},
          {id:"extra", l:"Extra",   done:allergens.size>0},
        ].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            style={{flex:1,padding:"13px 4px",border:"none",cursor:"pointer",
              background:"transparent",fontSize:12,fontWeight:tab===t.id?700:400,
              color:tab===t.id?T.accent:T.t3,position:"relative",
              borderBottom:tab===t.id?`2px solid ${T.accent}`:"2px solid transparent"}}>
            {t.l}
            {t.done&&<span style={{position:"absolute",top:8,right:6,
              width:6,height:6,borderRadius:3,background:T.mint}}/>}
          </button>
        ))}
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"16px"}}>

        {/* ── TAB BÁSICO ───────────────────────────── */}
        {tab==="basico"&&(
          <div>
            <FormField T={T} label="Nombre del producto *" value={name}
              onChange={autoSku} placeholder="Ej: Coca-Cola 2L"/>
            <FormField T={T} label="SKU — Código interno" value={sku}
              onChange={setSku} placeholder="Auto-generado al escribir nombre" mono/>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:11,color:T.t3,marginBottom:8,fontWeight:600,
                textTransform:"uppercase",letterSpacing:"0.06em"}}>Categoría</div>
              <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                {CATS.map(c=>(
                  <button key={c} onClick={()=>setCat(c)}
                    style={{padding:"8px 14px",borderRadius:20,border:"none",cursor:"pointer",
                      fontSize:12,fontWeight:cat===c?700:400,
                      background:cat===c?`${T.accent}22`:T.surface,
                      color:cat===c?T.accent:T.t3,
                      boxShadow:cat===c?T.press:T.btn,
                      outline:cat===c?`1.5px solid ${T.accent}40`:"none"}}>{c}
                  </button>
                ))}
              </div>
            </div>
            <FormField T={T} label="Descripción (opcional)" value={desc}
              onChange={setDesc} placeholder="Ej: Bebida gaseosa sabor cola, 2 litros"/>
            <FormField T={T} label="Marca" value={brand}
              onChange={setBrand} placeholder="Ej: Coca-Cola"/>
          </div>
        )}

        {/* ── TAB PRECIO ───────────────────────────── */}
        {tab==="precio"&&(
          <div>
            <FormField T={T} label="Precio de costo ($)" value={cost}
              onChange={setCost} placeholder="0" mono inputMode="numeric"/>
            <FormField T={T} label="Precio de venta ($)" value={price}
              onChange={setPrice} placeholder="0" mono inputMode="numeric"/>
            {margin&&(
              <div style={{background:`${T.accent}0C`,border:`1px solid ${T.accent}25`,
                borderRadius:16,padding:"14px 16px",marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span style={{fontSize:12,color:T.t2}}>Margen sobre venta</span>
                  <span style={{fontSize:20,fontWeight:900,color:T.accent,fontFamily:"JetBrains Mono"}}>{margin}%</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                  <span style={{fontSize:12,color:T.t2}}>Ganancia por unidad</span>
                  <span style={{fontSize:14,fontWeight:700,color:T.mint,fontFamily:"JetBrains Mono"}}>
                    {fmtCLP(parseInt(price||0)-parseInt(cost||0))}
                  </span>
                </div>
                <div style={{height:6,borderRadius:3,background:T.sunken,overflow:"hidden"}}>
                  <div style={{height:"100%",borderRadius:3,
                    width:`${Math.min(parseFloat(margin),100)}%`,
                    background:parseFloat(margin)>30?`linear-gradient(90deg,${T.mint},${T.blue})`
                      :parseFloat(margin)>15?`linear-gradient(90deg,${T.accent},${T.mint})`
                      :`linear-gradient(90deg,${T.danger},${T.accent})`,
                    transition:"width 0.3s"}}/>
                </div>
                <div style={{fontSize:10,color:T.t3,marginTop:5,textAlign:"right"}}>
                  {parseFloat(margin)>30?"✅ Excelente":parseFloat(margin)>15?"🟡 Aceptable":"🔴 Bajo — revisa precio"}
                </div>
              </div>
            )}
            {/* IVA stepper */}
            <div style={{marginBottom:14}}>
              <div style={{fontSize:11,color:T.t3,marginBottom:10,fontWeight:600,
                textTransform:"uppercase",letterSpacing:"0.06em"}}>IVA %</div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <button onClick={()=>setIva(v=>String(Math.max(0,parseInt(v||0)-1)))}
                  style={{width:44,height:44,borderRadius:12,border:"none",cursor:"pointer",
                    background:T.surface,boxShadow:T.btn,color:T.t1,fontSize:22,fontWeight:700,
                    display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                <div style={{flex:1,textAlign:"center",padding:"10px",borderRadius:14,
                  background:T.sunken,boxShadow:T.inset}}>
                  <span style={{fontSize:28,fontWeight:900,color:T.accent,fontFamily:"JetBrains Mono"}}>{iva}%</span>
                </div>
                <button onClick={()=>setIva(v=>String(Math.min(50,parseInt(v||0)+1)))}
                  style={{width:44,height:44,borderRadius:12,border:"none",cursor:"pointer",
                    background:`${T.accent}25`,boxShadow:T.btn,color:T.accent,fontSize:22,fontWeight:700,
                    display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
              </div>
              <div style={{display:"flex",gap:8,marginTop:10}}>
                {["0","10","19","21"].map(v=>(
                  <button key={v} onClick={()=>setIva(v)}
                    style={{flex:1,padding:"8px 4px",borderRadius:10,border:"none",cursor:"pointer",
                      fontSize:13,fontWeight:iva===v?700:400,
                      background:iva===v?`${T.accent}20`:T.surface,
                      color:iva===v?T.accent:T.t3,
                      boxShadow:iva===v?T.press:T.btn,
                      outline:iva===v?`1.5px solid ${T.accent}40`:"none"}}>{v}%</button>
                ))}
              </div>
            </div>
            <FormField T={T} label="Precio mayorista (opcional)" value={wholesale}
              onChange={setWholesale} placeholder="Para compras al por mayor" mono inputMode="numeric"/>
          </div>
        )}

        {/* ── TAB STOCK ────────────────────────────── */}
        {tab==="stock"&&(
          <div>
            <FormField T={T} label="Stock actual (unidades)" value={stock}
              onChange={setStock} placeholder="0" mono inputMode="numeric"/>
            <FormField T={T} label="Stock mínimo para alerta" value={minStock}
              onChange={setMin} placeholder="5" mono inputMode="numeric"/>
            <FormField T={T} label="Unidad de medida" value={unit}
              onChange={setUnit} placeholder="unidad, kg, litro, caja..."/>

            {/* Código de barras + opción imagen (tarea 7) */}
            <div style={{marginBottom:14}}>
              <div style={{fontSize:11,color:T.t3,marginBottom:8,fontWeight:600,
                textTransform:"uppercase",letterSpacing:"0.06em"}}>
                Código de barras EAN-13
              </div>
              <input value={barcode} onChange={e=>setBarcode(e.target.value)}
                placeholder="Escanear o escribir el código"
                style={{width:"100%",padding:"13px 16px",borderRadius:14,border:"none",
                  background:T.surface,boxShadow:T.inset,color:T.t1,
                  fontSize:16,fontWeight:700,fontFamily:"JetBrains Mono",
                  outline:"none",caretColor:T.accent,boxSizing:"border-box",marginBottom:10}}/>
              {/* Subir imagen para identificar — botón funcional */}
              <div style={{marginTop:0}}>
                <input id="prod-img-input" type="file" accept="image/*"
                  style={{display:"none"}} onChange={handleProductImage}/>
                <button onClick={()=>document.getElementById("prod-img-input").click()}
                  style={{width:"100%",display:"flex",alignItems:"center",gap:10,
                    padding:"12px 14px",borderRadius:12,cursor:"pointer",border:"none",
                    background:`${T.blue}0C`,outline:`1px dashed ${T.blue}`,
                    transition:"all 0.2s"}}>
                  <div style={{width:36,height:36,borderRadius:10,background:`${T.blue}18`,
                    display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:18}}>
                    {imgDetecting?"⏳":"📷"}
                  </div>
                  <div style={{flex:1,textAlign:"left"}}>
                    <div style={{fontSize:13,fontWeight:600,color:T.blue}}>
                      {imgDetecting?"🤖 Detectando con IA...":"📷 Subir foto para identificar"}
                    </div>
                    <div style={{fontSize:11,color:T.t3,marginTop:2}}>
                      La IA detecta nombre, código de barras y vencimiento
                    </div>
                  </div>
                  {imgDetecting&&(
                    <div style={{width:20,height:20,borderRadius:10,border:`2px solid ${T.blue}`,
                      borderTopColor:"transparent",animation:"spin 0.8s linear infinite",flexShrink:0}}/>
                  )}
                </button>
                {imgPreview&&!imgDetecting&&(
                  <div style={{marginTop:8,padding:"8px 12px",borderRadius:10,
                    background:`${T.blue}10`,border:`1px solid ${T.blue}25`,
                    display:"flex",alignItems:"center",gap:8}}>
                    <img src={imgPreview} alt="preview"
                      style={{width:40,height:40,borderRadius:8,objectFit:"cover"}}/>
                    <span style={{fontSize:12,color:T.blue,fontWeight:600}}>
                      ✅ Campos rellenados automáticamente
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Fecha de vencimiento — tarea 8: icono grande y estético */}
            <div style={{marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                padding:"14px 16px",borderRadius:14,background:T.surface,boxShadow:T.inset}}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  {/* Icono calendario grande y colorido */}
                  <div style={{width:44,height:44,borderRadius:13,flexShrink:0,
                    background:`linear-gradient(135deg,${T.accent},${T.accent}BB)`,
                    boxShadow:`0 4px 12px ${T.accent}40`,
                    display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                    <div style={{width:"70%",height:3,borderRadius:2,background:"rgba(28,33,48,0.5)",marginBottom:3}}/>
                    <div style={{fontSize:15,fontWeight:900,color:"#1C2130",lineHeight:1}}>
                      {expDate ? new Date(expDate+"T12:00:00").getDate() : "📅"}
                    </div>
                  </div>
                  <div>
                    <div style={{fontSize:13,fontWeight:600,color:T.t1}}>¿Tiene fecha de vencimiento?</div>
                    <div style={{fontSize:11,color:T.t3,marginTop:2}}>
                      {hasExpiry&&expDate
                        ? `Vence: ${new Date(expDate+"T12:00:00").toLocaleDateString("es-CL",{day:"numeric",month:"long",year:"numeric"})}`
                        : "Lácteos, pan, embutidos, bebidas"}
                    </div>
                  </div>
                </div>
                <div onClick={()=>setHasExpiry(e=>!e)}
                  style={{width:50,height:28,borderRadius:14,cursor:"pointer",
                    padding:3,display:"flex",alignItems:"center",
                    background:hasExpiry?T.accent:"rgba(255,255,255,0.12)",transition:"background 0.25s"}}>
                  <motion.div animate={{x:hasExpiry?22:0}} transition={{type:"spring",damping:20}}
                    style={{width:22,height:22,borderRadius:11,background:"#fff",
                      boxShadow:"1px 2px 5px rgba(0,0,0,0.25)"}}/>
                </div>
              </div>
            </div>

            {hasExpiry&&(
              <div>
                {/* Calendario estilizado (tarea 8) */}
                <div style={{marginBottom:12,padding:"14px 16px",borderRadius:14,
                  background:T.surface,boxShadow:T.inset}}>
                  <div style={{fontSize:11,color:T.t3,marginBottom:8,fontWeight:600,
                    textTransform:"uppercase",letterSpacing:"0.06em"}}>
                    📅 Fecha de vencimiento
                  </div>
                  <input type="date" value={expDate} onChange={e=>setExpDate(e.target.value)}
                    style={{width:"100%",padding:"10px 14px",borderRadius:10,
                      border:`1px solid ${T.accent}30`,
                      background:`${T.accent}08`,color:T.t1,
                      fontSize:16,fontWeight:700,fontFamily:"JetBrains Mono",
                      outline:"none",caretColor:T.accent,boxSizing:"border-box",
                      colorScheme:T.isDark?"dark":"light"}}/>
                  {expDate&&(
                    <div style={{marginTop:8,padding:"8px 12px",borderRadius:10,
                      background:`${T.accent}12`,border:`1px solid ${T.accent}25`,
                      display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:18}}>📅</span>
                      <span style={{fontSize:12,fontWeight:600,color:T.accent}}>
                        Vence el {new Date(expDate+"T12:00:00").toLocaleDateString("es-CL",
                          {weekday:"long",day:"numeric",month:"long",year:"numeric"})}
                      </span>
                    </div>
                  )}
                </div>
                <FormField T={T} label="Alertar X días antes" value={alertDays}
                  onChange={setAlert} placeholder="30" inputMode="numeric"/>
              </div>
            )}
          </div>
        )}

        {/* ── TAB EXTRA ────────────────────────────── */}
        {tab==="extra"&&(
          <div>
            <FormField T={T} label="Fabricante / Proveedor" value={maker}
              onChange={setMaker} placeholder="Ej: Embotelladora Andina"/>
            <FormField T={T} label="País de origen" value={origin}
              onChange={setOrigin} placeholder="Ej: Chile"/>
            <FormField T={T} label="Peso en gramos" value={weight}
              onChange={setWeight} placeholder="Ej: 2000" mono inputMode="numeric"/>

            {/* Alérgenos */}
            <div style={{marginBottom:14}}>
              <div style={{fontSize:11,color:T.t3,marginBottom:6,fontWeight:600,
                textTransform:"uppercase",letterSpacing:"0.06em"}}>Alérgenos ⚠️</div>
              <div style={{fontSize:11,color:T.t2,marginBottom:10,lineHeight:1.5}}>
                Selecciona todos los que contiene. Se guarda permanentemente.
              </div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {ALLERGEN_LIST.map(a=>{
                  const active=allergens.has(a)
                  return (
                    <button key={a} onClick={()=>toggleAllergen(a)}
                      style={{padding:"9px 14px",borderRadius:20,border:"none",cursor:"pointer",
                        fontSize:12,fontWeight:active?700:400,
                        background:active?`${T.danger}20`:T.surface,
                        color:active?T.danger:T.t3,
                        boxShadow:active?T.press:T.btn,
                        outline:active?`1.5px solid ${T.danger}50`:"none",
                        transition:"all 0.15s"}}>
                      {active?"✓ ":""}{a}
                    </button>
                  )
                })}
              </div>
              {allergens.size>0&&(
                <div style={{marginTop:10,padding:"10px 14px",borderRadius:12,
                  background:`${T.danger}0C`,border:`1px solid ${T.danger}20`}}>
                  <span style={{fontSize:12,color:T.danger,fontWeight:600}}>
                    ⚠️ Contiene: {Array.from(allergens).join(", ")}
                  </span>
                </div>
              )}
            </div>

            {/* Lista de ingredientes — tarea 9: texto / archivo / imagen */}
            <div style={{marginBottom:14}}>
              <div style={{fontSize:11,color:T.t3,marginBottom:8,fontWeight:600,
                textTransform:"uppercase",letterSpacing:"0.06em"}}>
                Lista de ingredientes
              </div>

              {/* Textarea para pegar texto */}
              <textarea value={ingredients} onChange={e=>setIngred(e.target.value)}
                placeholder="Pega aquí la lista de ingredientes o sube una imagen/archivo..."
                rows={4}
                style={{width:"100%",padding:"13px 16px",borderRadius:14,border:"none",
                  background:T.surface,boxShadow:T.inset,color:T.t1,
                  fontSize:13,fontFamily:"DM Sans",
                  outline:"none",caretColor:T.accent,boxSizing:"border-box",
                  resize:"vertical",lineHeight:1.5}}/>

              {/* Subir imagen/archivo — botones funcionales sin label */}
              <input id="ingr-img-input" type="file" accept="image/*"
                style={{display:"none"}} onChange={handleIngredientImage}/>
              <input id="ingr-file-input" type="file" accept=".txt,.doc,.docx"
                style={{display:"none"}}
                onChange={e=>{
                  const file=e.target.files[0]; if(!file) return
                  const reader=new FileReader()
                  reader.onload=ev=>{
                    const text=ev.target.result
                    if(text) setIngred(text.slice(0,1000))
                  }
                  reader.readAsText(file)
                }}/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:10}}>
                <button onClick={()=>document.getElementById("ingr-img-input").click()}
                  style={{display:"flex",alignItems:"center",gap:8,
                    padding:"10px 12px",borderRadius:12,cursor:"pointer",border:"none",
                    background:`${T.mint}0A`,outline:`1px dashed ${T.mint}40`}}>
                  <span style={{fontSize:18}}>{ingrDetecting?"⏳":"📷"}</span>
                  <div style={{textAlign:"left"}}>
                    <div style={{fontSize:11,fontWeight:600,color:T.mint}}>
                      {ingrDetecting?"Leyendo...":"Subir imagen"}
                    </div>
                    <div style={{fontSize:10,color:T.t3}}>IA lee etiqueta</div>
                  </div>
                </button>
                <button onClick={()=>document.getElementById("ingr-file-input").click()}
                  style={{display:"flex",alignItems:"center",gap:8,
                    padding:"10px 12px",borderRadius:12,cursor:"pointer",border:"none",
                    background:`${T.blue}0A`,outline:`1px dashed ${T.blue}40`}}>
                  <span style={{fontSize:18}}>📄</span>
                  <div style={{textAlign:"left"}}>
                    <div style={{fontSize:11,fontWeight:600,color:T.blue}}>Subir archivo</div>
                    <div style={{fontSize:10,color:T.t3}}>TXT, DOC</div>
                  </div>
                </button>
              </div>
              {ingrImgPreview&&!ingrDetecting&&(
                <div style={{marginTop:8,padding:"8px 12px",borderRadius:10,
                  background:`${T.mint}10`,border:`1px solid ${T.mint}25`,
                  display:"flex",alignItems:"center",gap:8}}>
                  <img src={ingrImgPreview} alt="preview"
                    style={{width:40,height:40,borderRadius:8,objectFit:"cover"}}/>
                  <span style={{fontSize:12,color:T.mint,fontWeight:600}}>
                    ✅ Ingredientes detectados y copiados
                  </span>
                </div>
              )}
              {ingrDetecting&&(
                <div style={{marginTop:8,padding:"8px 12px",borderRadius:10,
                  background:`${T.mint}10`,border:`1px solid ${T.mint}25`,
                  display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:14}}>🤖</span>
                  <span style={{fontSize:12,color:T.mint}}>Reconociendo ingredientes con IA...</span>
                </div>
              )}
            </div>
          </div>
        )}
        <div style={{height:20}}/>
      </div>

      {/* Botón crear */}
      <div style={{padding:"12px 16px 20px",borderTop:`1px solid ${T.border}`,
        flexShrink:0,display:"flex",gap:10}}>
        <button onClick={onBack}
          style={{padding:"12px 18px",borderRadius:12,border:"none",cursor:"pointer",
            background:T.surface,color:T.t2,fontSize:13,fontWeight:600,
            fontFamily:"DM Sans",boxShadow:T.btn}}>
          Cancelar
        </button>
        <button onClick={handleCreate}
          style={{flex:1,padding:"14px",borderRadius:14,border:"none",
            cursor:name.trim()?"pointer":"not-allowed",
            background:saved?`linear-gradient(135deg,${T.mint},${T.mint}CC)`
              :name.trim()?`linear-gradient(135deg,${T.accent},${T.accent}CC)`
              :"rgba(255,255,255,0.08)",
            color:name.trim()?"#1C2130":T.t3,
            fontSize:14,fontWeight:700,fontFamily:"DM Sans",
            boxShadow:name.trim()?`${T.btn},0 0 16px ${T.accent}40`:"none",
            display:"flex",alignItems:"center",justifyContent:"center",gap:8,
            transition:"background 0.3s"}}>
          <I d={ic.check} s={16} c={name.trim()?"#1C2130":T.t3}/>
          {saved?"✅ ¡Guardado!":editMode?"Guardar cambios":name.trim()?`Crear "${name}"`:"Escribe el nombre primero"}
        </button>
      </div>
    </div>
  )
}

function CierreCaja({ T, onBack, onCierre, historial=[], setHistorial }) {
  const [billetes, setBilletes] = useState({1000:0,2000:0,5000:0,10000:0,20000:0})
  const [step, setStep] = useState("conteo")
  const [motivo, setMotivo] = useState("")
  const [cerrado, setCerrado] = useState(false)
  // historial viene del padre como prop
  const fmtCLP = n => new Intl.NumberFormat("es-CL",{style:"currency",currency:"CLP",maximumFractionDigits:0}).format(n)

  const totalContado = Object.entries(billetes).reduce((s,[v,q])=>s+parseInt(v)*q,0)
  const fondoInicial=50000, ventasEfectivo=187500, gastos=8200
  const deberiaHaber = fondoInicial+ventasEfectivo-gastos
  const diferencia = totalContado-deberiaHaber

  const confirmarCierre = () => {
    const registro = {
      fecha: new Date().toLocaleDateString("es-CL", {weekday:"short",day:"numeric",month:"short",year:"numeric"}),
      hora: new Date().toLocaleTimeString("es-CL", {hour:"2-digit",minute:"2-digit"}),
      totalContado,
      deberiaHaber,
      diferencia,
      fondoInicial,
      ventasEfectivo,
      gastos,
      billetes: {...billetes},
      motivo: motivo || "Sin observaciones",
      cuadra: diferencia === 0,
    }
    if (onCierre) onCierre(registro)
    // NO llamar setHistorial aquí — onCierre ya lo guarda en App root (cierres state)
    setCerrado(true)
    setTimeout(() => { setCerrado(false); setStep("historial") }, 2200)
  }

  const fmtCLPLocal = n => new Intl.NumberFormat("es-CL",{style:"currency",currency:"CLP",maximumFractionDigits:0}).format(n)

  if (cerrado) return (
    <div style={{height:"100%",overflowY:"auto",padding:"32px 24px",
      display:"flex",flexDirection:"column",alignItems:"center",gap:16}}>
      <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:"spring",damping:12}}
        style={{width:80,height:80,borderRadius:40,
          background:`linear-gradient(135deg,${T.mint},${T.mint}CC)`,
          boxShadow:`0 0 30px ${T.mint}50`,
          display:"flex",alignItems:"center",justifyContent:"center"}}>
        <I d={ic.check} s={36} c="#fff"/>
      </motion.div>
      <div style={{fontSize:22,fontWeight:800,color:T.t1,fontFamily:"Bricolage Grotesque",textAlign:"center"}}>
        ✅ ¡Caja cerrada!
      </div>
      <div style={{fontSize:13,color:T.t3,textAlign:"center"}}>
        {new Date().toLocaleDateString("es-CL",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}
      </div>
      {/* Resumen guardado */}
      <div style={{width:"100%",background:T.surface,borderRadius:18,padding:"16px 18px",
        boxShadow:T.card,border:`1px solid ${T.mint}25`}}>
        <div style={{fontSize:12,fontWeight:700,color:T.mint,marginBottom:12,
          textTransform:"uppercase",letterSpacing:"0.07em"}}>📋 Registro guardado</div>
        {[
          {l:"Fondo inicial",    v:fmtCLPLocal(fondoInicial)},
          {l:"Ventas efectivo",  v:fmtCLPLocal(ventasEfectivo)},
          {l:"Gastos caja",      v:`−${fmtCLPLocal(gastos)}`},
          {l:"Debería haber",    v:fmtCLPLocal(deberiaHaber)},
          {l:"Total contado",    v:fmtCLPLocal(totalContado)},
          {l:"Diferencia",       v: diferencia===0?"$0 — cuadra perfectamente ✅":
             diferencia>0?`+${fmtCLPLocal(diferencia)} — sobra`:
             `${fmtCLPLocal(diferencia)} — falta`},
        ].map(r=>(
          <div key={r.l} style={{display:"flex",justifyContent:"space-between",
            padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
            <span style={{fontSize:12,color:T.t2}}>{r.l}</span>
            <span style={{fontSize:13,fontWeight:700,
              color:r.l==="Diferencia"?(diferencia===0?T.mint:T.danger):T.t1,
              fontFamily:"JetBrains Mono"}}>{r.v}</span>
          </div>
        ))}
      </div>
      <div style={{fontSize:12,color:T.t3,textAlign:"center",lineHeight:1.6}}>
        Datos guardados en el historial de cierres.<br/>Puedes consultarlos en Reportes.
      </div>
    </div>
  )

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{display:"flex",alignItems:"center",gap:12,padding:"16px",
        borderBottom:`1px solid ${T.border}`,flexShrink:0}}>
        <button onClick={onBack} style={{width:38,height:38,borderRadius:11,border:"none",cursor:"pointer",
          background:T.surface,boxShadow:T.btn,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <I d={ic.back} s={16} c={T.t2}/>
        </button>
        <div>
          <div style={{fontSize:16,fontWeight:700,color:T.t1,fontFamily:"Bricolage Grotesque"}}>Cierre de Caja</div>
          <div style={{fontSize:11,color:T.t3}}>Viernes 27 Mar 2026</div>
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"16px",display:"flex",flexDirection:"column",gap:12}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
          {[
            {id:"conteo",  l:"1️⃣ Billetes"},
            {id:"resumen", l:"2️⃣ Resumen"},
            {id:"historial",l:"📋 Historial"},
          ].map(t=>(
            <button key={t.id} onClick={()=>setStep(t.id)}
              style={{padding:"11px 6px",borderRadius:14,border:"none",cursor:"pointer",
                fontSize:12,fontWeight:step===t.id?700:500,
                background:step===t.id?`linear-gradient(135deg,${T.accent},${T.accent}BB)`:T.surface,
                color:step===t.id?"#1C2130":T.t3,
                boxShadow:step===t.id?`${T.press},0 0 14px ${T.accent}40`:T.btn}}>{t.l}</button>
          ))}
        </div>
        {step==="conteo" && (
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <div style={{fontSize:12,color:T.t3}}>Ingresa cuántos billetes hay en caja:</div>
            {Object.entries(billetes).reverse().map(([val,qty])=>(
              <div key={val} style={{background:T.surface,borderRadius:16,padding:"12px 16px",boxShadow:T.card,
                display:"flex",alignItems:"center",gap:12}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:15,fontWeight:700,color:T.t1,fontFamily:"JetBrains Mono"}}>
                    {fmtCLP(parseInt(val))}
                  </div>
                  <div style={{fontSize:11,color:qty>0?T.accent:T.t3}}>= {fmtCLP(parseInt(val)*qty)}</div>
                </div>
                <button onClick={()=>setBilletes(b=>({...b,[val]:Math.max(0,b[val]-1)}))}
                  style={{width:36,height:36,borderRadius:10,border:"none",cursor:"pointer",
                    background:T.sunken,boxShadow:T.inset,color:T.t2,fontSize:20,
                    display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                <span style={{fontSize:22,fontWeight:900,color:T.accent,fontFamily:"JetBrains Mono",
                  minWidth:32,textAlign:"center"}}>{qty}</span>
                <button onClick={()=>setBilletes(b=>({...b,[val]:b[val]+1}))}
                  style={{width:36,height:36,borderRadius:10,border:"none",cursor:"pointer",
                    background:`${T.accent}25`,boxShadow:T.btn,color:T.accent,fontSize:20,
                    display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
              </div>
            ))}
            <div style={{background:`${T.accent}0C`,border:`1px solid ${T.accent}25`,
              borderRadius:16,padding:"14px 16px",textAlign:"center"}}>
              <div style={{fontSize:11,color:T.t3,marginBottom:4}}>Total contado</div>
              <div style={{fontSize:30,fontWeight:900,color:T.accent,fontFamily:"JetBrains Mono"}}>
                {fmtCLP(totalContado)}
              </div>
            </div>
            <button onClick={()=>setStep("resumen")}
              style={{padding:"14px",borderRadius:12,border:"none",cursor:"pointer",
                background:`linear-gradient(135deg,${T.accent},${T.accent}CC)`,
                color:"#1C2130",fontSize:14,fontWeight:700,fontFamily:"DM Sans",
                boxShadow:`${T.btn},0 0 16px ${T.accent}40`,
                display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              Ver resumen del cierre →
            </button>
          </div>
        )}
        {step==="resumen" && (
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{background:T.surface,borderRadius:16,padding:16,boxShadow:T.card}}>
              {[
                {l:"Fondo inicial del día",v:fondoInicial,c:T.t2},
                {l:"+ Ventas en efectivo",v:ventasEfectivo,c:T.mint},
                {l:"− Gastos de caja chica",v:gastos,c:T.danger},
                {l:"Debería haber en caja",v:deberiaHaber,c:T.t1},
                {l:"Lo que contaste",v:totalContado,c:T.accent},
              ].map((r,i)=>(
                <div key={r.l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                  padding:"10px 0",borderBottom:i<4?`1px solid ${T.border}`:"none"}}>
                  <span style={{fontSize:13,color:T.t2}}>{r.l}</span>
                  <span style={{fontSize:15,fontWeight:700,color:r.c,fontFamily:"JetBrains Mono"}}>
                    {fmtCLP(r.v)}
                  </span>
                </div>
              ))}
            </div>
            <div style={{borderRadius:18,padding:"18px",textAlign:"center",
              background:diferencia===0?`${T.mint}12`:diferencia>0?`${T.blue}12`:`${T.danger}12`,
              border:`1px solid ${diferencia===0?T.mint:diferencia>0?T.blue:T.danger}30`}}>
              <div style={{fontSize:11,fontWeight:700,color:T.t3,letterSpacing:"0.08em",marginBottom:6}}>
                DIFERENCIA DE CAJA
              </div>
              <div style={{fontSize:36,fontWeight:900,fontFamily:"JetBrains Mono",
                color:diferencia===0?T.mint:diferencia>0?T.blue:T.danger}}>
                {diferencia===0?"$0 ✅":diferencia>0?`+${fmtCLP(diferencia)}`:fmtCLP(diferencia)}
              </div>
              <div style={{fontSize:12,color:T.t3,marginTop:6}}>
                {diferencia===0?"Caja cuadra perfectamente 🎉":diferencia>0?"Sobran billetes":"Faltan billetes"}
              </div>
            </div>
            {diferencia!==0 && (
              <div>
                <div style={{fontSize:11,color:T.t3,marginBottom:8}}>Motivo de la diferencia</div>
                <input value={motivo} onChange={e=>setMotivo(e.target.value)}
                  placeholder="Ej: billete equivocado, falta recibo..."
                  style={{width:"100%",padding:"13px 16px",borderRadius:14,border:"none",
                    background:T.surface,boxShadow:T.inset,color:T.t1,fontSize:14,
                    fontFamily:"DM Sans",outline:"none",caretColor:T.accent,boxSizing:"border-box"}}/>
              </div>
            )}
            <button onClick={confirmarCierre}
              style={{padding:"14px",borderRadius:12,border:"none",cursor:"pointer",
                background:`linear-gradient(135deg,${T.mint},${T.mint}CC)`,
                color:"#1C2130",fontSize:14,fontWeight:700,fontFamily:"DM Sans",
                boxShadow:`${T.btn},0 0 16px ${T.mint}40`,
                display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              <I d={ic.check} s={16} c="#1C2130"/>
              ✅ Confirmar cierre del día
            </button>
          </div>
        )}
        {step==="historial" && (
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{fontSize:15,fontWeight:700,color:T.t1,fontFamily:"Bricolage Grotesque"}}>
                📋 Historial de cierres
              </div>
              {historial.length>0&&(
                <div style={{fontSize:11,padding:"3px 10px",borderRadius:20,
                  background:`${T.mint}18`,color:T.mint,fontWeight:600}}>
                  {historial.length} registro{historial.length!==1?"s":""}
                </div>
              )}
            </div>

            {historial.length===0&&(
              <div style={{textAlign:"center",padding:"40px 20px",
                background:T.surface,borderRadius:18,boxShadow:T.card}}>
                <div style={{fontSize:40,marginBottom:12}}>📭</div>
                <div style={{fontSize:14,fontWeight:600,color:T.t1,marginBottom:6}}>
                  Aún no hay cierres registrados
                </div>
                <div style={{fontSize:12,color:T.t3,lineHeight:1.5}}>
                  Los cierres confirmados aparecerán aquí automáticamente.
                </div>
                <button onClick={()=>setStep("conteo")}
                  style={{marginTop:14,padding:"10px 20px",borderRadius:12,border:"none",
                    cursor:"pointer",background:`linear-gradient(135deg,${T.accent},${T.accent}CC)`,
                    color:"#1C2130",fontSize:13,fontWeight:700}}>
                  Ir a contar billetes →
                </button>
              </div>
            )}

            {historial.map((reg,i)=>(
              <div key={i} style={{background:T.surface,borderRadius:16,
                padding:"14px 16px",boxShadow:T.card,
                border:`1px solid ${reg.cuadra?T.mint+"25":T.danger+"20"}`}}>
                {/* Header del registro */}
                <div style={{display:"flex",justifyContent:"space-between",
                  alignItems:"flex-start",marginBottom:12}}>
                  <div>
                    <div style={{fontSize:13,fontWeight:700,color:T.t1}}>{reg.fecha}</div>
                    <div style={{fontSize:11,color:T.t3,marginTop:2}}>{reg.hora} hs</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <span style={{fontSize:10,fontWeight:700,padding:"3px 10px",
                      borderRadius:20,
                      background:reg.cuadra?`${T.mint}18`:`${T.danger}18`,
                      color:reg.cuadra?T.mint:T.danger}}>
                      {reg.cuadra?"✅ Cuadra":"⚠️ Diferencia"}
                    </span>
                  </div>
                </div>
                {/* Montos principales */}
                {[
                  {l:"Total contado",  v:reg.totalContado,  c:T.accent},
                  {l:"Debería haber",  v:reg.deberiaHaber,  c:T.t2},
                  {l:"Diferencia",     v:reg.diferencia,
                    c:reg.diferencia===0?T.mint:reg.diferencia>0?T.blue:T.danger},
                ].map(row=>(
                  <div key={row.l} style={{display:"flex",justifyContent:"space-between",
                    alignItems:"center",padding:"7px 0",
                    borderBottom:`1px solid ${T.border}`}}>
                    <span style={{fontSize:12,color:T.t2}}>{row.l}</span>
                    <span style={{fontSize:13,fontWeight:700,color:row.c,
                      fontFamily:"JetBrains Mono"}}>
                      {row.l==="Diferencia"
                        ? (row.v===0 ? "$0 ✅"
                           : row.v>0 ? `+${fmtCLP(row.v)}`
                           : fmtCLP(row.v))
                        : fmtCLP(row.v)}
                    </span>
                  </div>
                ))}
                {/* Desglose billetes */}
                <div style={{marginTop:10}}>
                  <div style={{fontSize:10,color:T.t3,marginBottom:6,
                    textTransform:"uppercase",letterSpacing:"0.06em"}}>
                    Billetes contados
                  </div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {Object.entries(reg.billetes).filter(([,qty])=>qty>0).map(([val,qty])=>(
                      <div key={val} style={{padding:"4px 10px",borderRadius:8,
                        background:T.sunken,boxShadow:T.inset}}>
                        <span style={{fontSize:11,color:T.t2,fontFamily:"JetBrains Mono"}}>
                          {fmtCLP(parseInt(val))} × {qty}
                        </span>
                      </div>
                    ))}
                    {Object.values(reg.billetes).every(v=>v===0)&&(
                      <span style={{fontSize:11,color:T.t3}}>Sin billetes registrados</span>
                    )}
                  </div>
                </div>
                {reg.motivo!=="Sin observaciones"&&(
                  <div style={{marginTop:8,padding:"8px 10px",borderRadius:10,
                    background:`${T.danger}0A`,border:`1px solid ${T.danger}18`}}>
                    <span style={{fontSize:11,color:T.t3}}>📝 {reg.motivo}</span>
                  </div>
                )}
              </div>
            ))}
            <div style={{height:20}}/>
          </div>
        )}

        <div style={{height:20}}/>
      </div>
    </div>
  )
}

// ─── CAJA CHICA ───────────────────────────────────────────────────
function CajaChica({ T, onBack }) {
  const fmtCLP = n => new Intl.NumberFormat("es-CL",{style:"currency",currency:"CLP",maximumFractionDigits:0}).format(n)

  // ── Estado global de gastos ──────────────────────────────────
  const [gastos, setGastos] = useState([
    {id:1, cat:"Bolsas",      emoji:"🛍️", desc:"Bolsas plásticas rollo", amt:3500, time:"09:15", who:"María"},
    {id:2, cat:"Hielo",       emoji:"🧊", desc:"Bolsa de hielo 5kg",     amt:1800, time:"11:30", who:"Juan"},
    {id:3, cat:"Aseo",        emoji:"🧹", desc:"Detergente para pisos",  amt:2900, time:"13:45", who:"María"},
  ])

  // ── Tipos de gastos (editables) ──────────────────────────────
  const [tipos, setTipos] = useState([
    {id:1, label:"Bolsas",       emoji:"🛍️"},
    {id:2, label:"Hielo",        emoji:"🧊"},
    {id:3, label:"Pasaje",       emoji:"🚌"},
    {id:4, label:"Reparación",   emoji:"🔧"},
    {id:5, label:"Aseo",         emoji:"🧹"},
    {id:6, label:"Alimentación", emoji:"🍱"},
    {id:7, label:"Combustible",  emoji:"⛽"},
    {id:8, label:"Otros",        emoji:"📦"},
  ])

  // ── UI state ─────────────────────────────────────────────────
  const [tab,         setTab]         = useState("gastos")   // "gastos" | "tipos"
  const [showForm,    setShowForm]    = useState(false)
  const [editGasto,   setEditGasto]   = useState(null)       // gasto editando
  const [deleteId,    setDeleteId]    = useState(null)       // confirmar eliminar
  const [showTipoForm,setShowTipoForm]= useState(false)
  const [editTipo,    setEditTipo]    = useState(null)

  // Form fields — gasto
  const [fCat,  setFCat]  = useState("")
  const [fDesc, setFDesc] = useState("")
  const [fMonto,setFMonto]= useState("")
  const [fWho,  setFWho]  = useState("Yo")

  // Form fields — tipo
  const [tLabel, setTLabel] = useState("")
  const [tEmoji, setTEmoji] = useState("")

  const total       = gastos.reduce((s,g) => s+g.amt, 0)
  const presupuesto = 15000
  const pct         = Math.min(total/presupuesto*100, 100)

  // ── GASTOS CRUD ──────────────────────────────────────────────
  const openNew = () => {
    setEditGasto(null)
    setFCat(tipos[0]?.label || "")
    setFDesc(""); setFMonto(""); setFWho("Yo")
    setShowForm(true)
  }
  const openEdit = (g) => {
    setEditGasto(g)
    setFCat(g.cat); setFDesc(g.desc); setFMonto(String(g.amt)); setFWho(g.who)
    setShowForm(true)
  }
  const guardar = () => {
    if (!fDesc.trim() || !fMonto) return
    const tipo  = tipos.find(t => t.label === fCat) || tipos[0]
    const now   = new Date().toLocaleTimeString("es-CL",{hour:"2-digit",minute:"2-digit"})
    if (editGasto) {
      setGastos(gs => gs.map(g => g.id===editGasto.id
        ? {...g, cat:fCat, emoji:tipo?.emoji||"📦", desc:fDesc, amt:parseInt(fMonto), who:fWho}
        : g))
    } else {
      setGastos(gs => [...gs, {
        id:Date.now(), cat:fCat, emoji:tipo?.emoji||"📦",
        desc:fDesc, amt:parseInt(fMonto), time:now, who:fWho
      }])
    }
    setShowForm(false)
  }
  const ajustarMonto = (id, delta) => {
    setGastos(gs => gs.map(g => g.id===id
      ? {...g, amt:Math.max(0, g.amt+delta)}
      : g))
  }
  const eliminar = (id) => { setGastos(gs => gs.filter(g => g.id!==id)); setDeleteId(null) }

  // ── TIPOS CRUD ───────────────────────────────────────────────
  const guardarTipo = () => {
    if (!tLabel.trim()) return
    if (editTipo) {
      setTipos(ts => ts.map(t => t.id===editTipo.id ? {...t,label:tLabel,emoji:tEmoji||t.emoji} : t))
      // Also update category in existing gastos
      setGastos(gs => gs.map(g => g.cat===editTipo.label ? {...g,cat:tLabel,emoji:tEmoji||g.emoji} : g))
    } else {
      setTipos(ts => [...ts, {id:Date.now(), label:tLabel.trim(), emoji:tEmoji||"📦"}])
    }
    setTLabel(""); setTEmoji(""); setEditTipo(null); setShowTipoForm(false)
  }
  const eliminarTipo = (id) => setTipos(ts => ts.filter(t => t.id!==id))

  const EMOJIS = ["🛍️","🧊","🚌","🔧","🧹","🍱","⛽","📦","💊","🖊️","📱","🔌","💧","🌿","🧴","🪣"]

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%",background:T.bg}}>

      {/* Header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
        padding:"16px",borderBottom:`1px solid ${T.border}`,flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <button onClick={onBack}
            style={{width:38,height:38,borderRadius:11,border:"none",cursor:"pointer",
              background:T.surface,boxShadow:T.btn,
              display:"flex",alignItems:"center",justifyContent:"center"}}>
            <I d={ic.back} s={16} c={T.t2}/>
          </button>
          <div>
            <div style={{fontSize:16,fontWeight:700,color:T.t1,fontFamily:"Bricolage Grotesque"}}>
              💸 Caja Chica
            </div>
            <div style={{fontSize:11,color:T.t3}}>
              {new Date().toLocaleDateString("es-CL",{weekday:"long",day:"numeric",month:"long"})}
            </div>
          </div>
        </div>
        {tab==="gastos" && (
          <button onClick={openNew}
            style={{padding:"9px 16px",borderRadius:10,border:"none",cursor:"pointer",
              background:`linear-gradient(135deg,${T.accent},${T.accent}CC)`,
              color:"#1C2130",fontSize:12,fontWeight:700,
              display:"flex",alignItems:"center",gap:6,
              boxShadow:`${T.btn},0 0 12px ${T.accent}30`}}>
            <I d={ic.plus} s={14} c="#1C2130"/>Nuevo gasto
          </button>
        )}
        {tab==="tipos" && (
          <button onClick={()=>{setEditTipo(null);setTLabel("");setTEmoji("");setShowTipoForm(true)}}
            style={{padding:"9px 16px",borderRadius:10,border:"none",cursor:"pointer",
              background:`${T.blue}20`,color:T.blue,fontSize:12,fontWeight:700,
              display:"flex",alignItems:"center",gap:6}}>
            <I d={ic.plus} s={14} c={T.blue}/>Nuevo tipo
          </button>
        )}
      </div>

      {/* Tabs */}
      <div style={{display:"flex",borderBottom:`1px solid ${T.border}`,flexShrink:0}}>
        {[
          {id:"gastos", l:"💸 Gastos del día"},
          {id:"tipos",  l:"🏷️ Tipos de gasto"},
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{flex:1,padding:"13px 8px",border:"none",cursor:"pointer",
              background:"transparent",fontSize:12,fontWeight:tab===t.id?700:400,
              color:tab===t.id?T.accent:T.t3,
              borderBottom:tab===t.id?`2px solid ${T.accent}`:"2px solid transparent"}}>
            {t.l}
          </button>
        ))}
      </div>

      {/* ══ TAB: GASTOS ══════════════════════════════════════════ */}
      {tab==="gastos" && (
        <div style={{flex:1,overflowY:"auto",padding:"16px",display:"flex",flexDirection:"column",gap:12}}>

          {/* KPI row */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div style={{background:T.surface,borderRadius:16,padding:"14px",boxShadow:T.card}}>
              <div style={{fontSize:10,color:T.t3,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.06em"}}>
                Total gastos
              </div>
              <div style={{fontSize:22,fontWeight:900,color:T.danger,fontFamily:"JetBrains Mono"}}>
                {fmtCLP(total)}
              </div>
              <div style={{fontSize:10,color:T.t3,marginTop:3}}>{gastos.length} registro{gastos.length!==1?"s":""}</div>
            </div>
            <div style={{background:T.surface,borderRadius:16,padding:"14px",boxShadow:T.card}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                <div style={{fontSize:10,color:T.t3,textTransform:"uppercase",letterSpacing:"0.06em"}}>Presupuesto</div>
                <div style={{fontSize:10,color:pct>=100?T.danger:T.accent,fontWeight:700}}>{pct.toFixed(0)}%</div>
              </div>
              <div style={{fontSize:22,fontWeight:900,color:T.accent,fontFamily:"JetBrains Mono"}}>
                {fmtCLP(presupuesto)}
              </div>
              <div style={{height:5,borderRadius:3,background:T.sunken,marginTop:8,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${pct}%`,borderRadius:3,
                  background:`linear-gradient(90deg,${T.mint},${pct>=100?T.danger:T.accent})`,
                  transition:"width 0.5s"}}/>
              </div>
            </div>
          </div>

          {/* Chips rápidos por categoría */}
          <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
            {tipos.map(t => {
              const count = gastos.filter(g=>g.cat===t.label).length
              if (!count) return null
              return (
                <div key={t.id} style={{padding:"5px 12px",borderRadius:20,
                  background:`${T.danger}10`,border:`1px solid ${T.danger}20`,
                  display:"flex",alignItems:"center",gap:5}}>
                  <span style={{fontSize:13}}>{t.emoji}</span>
                  <span style={{fontSize:11,fontWeight:600,color:T.t2}}>{t.label}</span>
                  <span style={{fontSize:11,color:T.danger,fontFamily:"JetBrains Mono",fontWeight:700}}>
                    {count}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Lista de gastos */}
          {gastos.length===0 && (
            <div style={{textAlign:"center",padding:"40px 20px"}}>
              <div style={{fontSize:40,marginBottom:12}}>💸</div>
              <div style={{fontSize:14,fontWeight:600,color:T.t1,marginBottom:6}}>Sin gastos registrados</div>
              <div style={{fontSize:12,color:T.t3,marginBottom:20}}>Toca "+ Nuevo gasto" para agregar</div>
            </div>
          )}

          {gastos.map((g,i) => (
            <motion.div key={g.id} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}>
              <div style={{background:T.surface,borderRadius:16,padding:"14px 16px",boxShadow:T.card}}>
                {/* Fila superior */}
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
                  <div style={{width:42,height:42,borderRadius:13,flexShrink:0,
                    background:`${T.danger}18`,
                    display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>
                    {g.emoji||"📦"}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:14,fontWeight:700,color:T.t1,marginBottom:2}}>{g.desc}</div>
                    <div style={{fontSize:11,color:T.t3}}>
                      {g.cat} · {g.time} · {g.who}
                    </div>
                  </div>
                  <div style={{display:"flex",gap:6,flexShrink:0}}>
                    <button onClick={() => openEdit(g)}
                      style={{width:32,height:32,borderRadius:9,border:"none",cursor:"pointer",
                        background:`${T.blue}18`,
                        display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <I d={ic.edit} s={13} c={T.blue}/>
                    </button>
                    <button onClick={() => setDeleteId(g.id)}
                      style={{width:32,height:32,borderRadius:9,border:"none",cursor:"pointer",
                        background:`${T.danger}18`,
                        display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <I d={ic.trash} s={13} c={T.danger}/>
                    </button>
                  </div>
                </div>

                {/* Fila inferior: monto con +/- */}
                <div style={{display:"flex",alignItems:"center",gap:10,
                  background:T.sunken,borderRadius:12,padding:"8px 12px",boxShadow:T.inset}}>
                  <button onClick={() => ajustarMonto(g.id, -100)}
                    style={{width:32,height:32,borderRadius:9,border:"none",cursor:"pointer",
                      background:T.surface,boxShadow:T.btn,
                      color:T.t2,fontSize:15,fontWeight:700,
                      display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                  <button onClick={() => ajustarMonto(g.id, -500)}
                    style={{padding:"4px 10px",borderRadius:8,border:"none",cursor:"pointer",
                      background:T.surface,boxShadow:T.btn,
                      color:T.t3,fontSize:11,fontWeight:600}}>−$500</button>
                  <div style={{flex:1,textAlign:"center"}}>
                    <span style={{fontSize:18,fontWeight:900,color:T.danger,fontFamily:"JetBrains Mono"}}>
                      {fmtCLP(g.amt)}
                    </span>
                  </div>
                  <button onClick={() => ajustarMonto(g.id, 500)}
                    style={{padding:"4px 10px",borderRadius:8,border:"none",cursor:"pointer",
                      background:T.surface,boxShadow:T.btn,
                      color:T.t3,fontSize:11,fontWeight:600}}>+$500</button>
                  <button onClick={() => ajustarMonto(g.id, 100)}
                    style={{width:32,height:32,borderRadius:9,border:"none",cursor:"pointer",
                      background:`${T.accent}22`,boxShadow:T.btn,
                      color:T.accent,fontSize:15,fontWeight:700,
                      display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                </div>
              </div>
            </motion.div>
          ))}
          <div style={{height:20}}/>
        </div>
      )}

      {/* ══ TAB: TIPOS DE GASTO ══════════════════════════════════ */}
      {tab==="tipos" && (
        <div style={{flex:1,overflowY:"auto",padding:"16px",display:"flex",flexDirection:"column",gap:10}}>
          <div style={{fontSize:12,color:T.t3,lineHeight:1.5,marginBottom:4}}>
            Personaliza tus categorías. Al agregar un gasto puedes elegirlas rápido con un toque.
          </div>
          {tipos.map((t,i) => (
            <motion.div key={t.id} initial={{opacity:0,x:-6}} animate={{opacity:1,x:0}} transition={{delay:i*0.04}}>
              <div style={{background:T.surface,borderRadius:14,padding:"12px 16px",boxShadow:T.card,
                display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:40,height:40,borderRadius:12,flexShrink:0,
                  background:`${T.accent}12`,
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>
                  {t.emoji}
                </div>
                <span style={{flex:1,fontSize:14,fontWeight:600,color:T.t1}}>{t.label}</span>
                <div style={{fontSize:11,color:T.t3,marginRight:8}}>
                  {gastos.filter(g=>g.cat===t.label).length} usos
                </div>
                <button onClick={()=>{setEditTipo(t);setTLabel(t.label);setTEmoji(t.emoji);setShowTipoForm(true)}}
                  style={{width:32,height:32,borderRadius:9,border:"none",cursor:"pointer",
                    background:`${T.blue}18`,
                    display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <I d={ic.edit} s={13} c={T.blue}/>
                </button>
                <button onClick={()=>eliminarTipo(t.id)}
                  style={{width:32,height:32,borderRadius:9,border:"none",cursor:"pointer",
                    background:`${T.danger}18`,
                    display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <I d={ic.trash} s={13} c={T.danger}/>
                </button>
              </div>
            </motion.div>
          ))}
          <div style={{height:20}}/>
        </div>
      )}

      {/* ══ SHEET: AGREGAR / EDITAR GASTO ════════════════════════ */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",
              display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:200,
              backdropFilter:"blur(4px)"}}
            onClick={e=>e.target===e.currentTarget&&setShowForm(false)}>
            <motion.div initial={{y:"100%"}} animate={{y:0}} exit={{y:"100%"}}
              transition={{type:"spring",damping:30,stiffness:350}}
              style={{width:"100%",maxWidth:480,background:T.surface,
                borderRadius:"24px 24px 0 0",
                boxShadow:"0 -8px 40px rgba(0,0,0,0.5)",
                display:"flex",flexDirection:"column",maxHeight:"90vh"}}>

              <div style={{padding:"20px 20px 14px",borderBottom:`1px solid ${T.border}`,flexShrink:0}}>
                <div style={{width:40,height:5,borderRadius:3,
                  background:"rgba(255,255,255,0.15)",margin:"0 auto 16px"}}/>
                <div style={{fontSize:16,fontWeight:700,color:T.t1,fontFamily:"Bricolage Grotesque"}}>
                  {editGasto ? "✏️ Editar gasto" : "💸 Nuevo gasto"}
                </div>
              </div>

              <div style={{flex:1,overflowY:"auto",padding:"16px 20px"}}>
                {/* Selector de categoría rápido */}
                <div style={{fontSize:11,color:T.t3,marginBottom:8,fontWeight:600,
                  textTransform:"uppercase",letterSpacing:"0.06em"}}>
                  Tipo de gasto
                </div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
                  {tipos.map(t => (
                    <button key={t.id} onClick={() => setFCat(t.label)}
                      style={{padding:"9px 14px",borderRadius:20,border:"none",cursor:"pointer",
                        fontSize:12,fontWeight:fCat===t.label?700:400,
                        background:fCat===t.label?`${T.accent}22`:T.surface,
                        color:fCat===t.label?T.accent:T.t3,
                        boxShadow:fCat===t.label?T.press:T.btn,
                        outline:fCat===t.label?`1.5px solid ${T.accent}40`:"none",
                        display:"flex",alignItems:"center",gap:6}}>
                      <span>{t.emoji}</span>{t.label}
                    </button>
                  ))}
                </div>

                {/* Descripción */}
                <div style={{fontSize:11,color:T.t3,marginBottom:7,fontWeight:600,
                  textTransform:"uppercase",letterSpacing:"0.06em"}}>
                  Descripción
                </div>
                <input value={fDesc} onChange={e=>setFDesc(e.target.value)} autoFocus
                  placeholder="Ej: Bolsas rollo transparente 5m"
                  style={{width:"100%",padding:"13px 16px",borderRadius:14,border:"none",
                    background:T.bg,boxShadow:T.inset,color:T.t1,fontSize:14,
                    fontFamily:"DM Sans",outline:"none",caretColor:T.accent,
                    boxSizing:"border-box",marginBottom:14}}/>

                {/* Monto con stepper */}
                <div style={{fontSize:11,color:T.t3,marginBottom:10,fontWeight:600,
                  textTransform:"uppercase",letterSpacing:"0.06em"}}>
                  Monto
                </div>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                  <button onClick={()=>setFMonto(v=>String(Math.max(0,(parseInt(v)||0)-100)))}
                    style={{width:44,height:44,borderRadius:12,border:"none",cursor:"pointer",
                      background:T.surface,boxShadow:T.btn,
                      color:T.t2,fontSize:20,fontWeight:700,
                      display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                  <div style={{flex:1,background:T.bg,borderRadius:14,boxShadow:T.inset,
                    display:"flex",alignItems:"center",justifyContent:"center",padding:"10px"}}>
                    <span style={{fontSize:26,fontWeight:900,color:T.danger,fontFamily:"JetBrains Mono"}}>
                      {fMonto ? fmtCLP(parseInt(fMonto)) : "$0"}
                    </span>
                  </div>
                  <button onClick={()=>setFMonto(v=>String((parseInt(v)||0)+100))}
                    style={{width:44,height:44,borderRadius:12,border:"none",cursor:"pointer",
                      background:`${T.accent}22`,boxShadow:T.btn,
                      color:T.accent,fontSize:20,fontWeight:700,
                      display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                </div>
                {/* Montos rápidos */}
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:14}}>
                  {[500,1000,2000,5000].map(v=>(
                    <button key={v} onClick={()=>setFMonto(String(v))}
                      style={{padding:"9px 4px",borderRadius:10,border:"none",cursor:"pointer",
                        background:parseInt(fMonto)===v?`${T.accent}22`:T.surface,
                        color:parseInt(fMonto)===v?T.accent:T.t3,
                        fontSize:12,fontWeight:parseInt(fMonto)===v?700:400,
                        boxShadow:parseInt(fMonto)===v?T.press:T.btn}}>
                      {fmtCLP(v)}
                    </button>
                  ))}
                </div>
                {/* Input manual */}
                <input value={fMonto} onChange={e=>setFMonto(e.target.value.replace(/\D/g,""))}
                  inputMode="numeric" placeholder="O escribe el monto exacto..."
                  style={{width:"100%",padding:"12px 16px",borderRadius:12,border:"none",
                    background:T.bg,boxShadow:T.inset,color:T.t1,fontSize:14,
                    fontFamily:"DM Sans",outline:"none",caretColor:T.accent,
                    boxSizing:"border-box",marginBottom:4}}/>

                {/* Quién */}
                <div style={{fontSize:11,color:T.t3,marginTop:14,marginBottom:7,fontWeight:600,
                  textTransform:"uppercase",letterSpacing:"0.06em"}}>
                  Registrado por
                </div>
                <div style={{display:"flex",gap:8}}>
                  {["Yo","María","Juan","Otro"].map(w=>(
                    <button key={w} onClick={()=>setFWho(w)}
                      style={{flex:1,padding:"9px 6px",borderRadius:10,border:"none",cursor:"pointer",
                        fontSize:12,fontWeight:fWho===w?700:400,
                        background:fWho===w?`${T.blue}20`:T.surface,
                        color:fWho===w?T.blue:T.t3,
                        boxShadow:fWho===w?T.press:T.btn}}>
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{padding:"14px 20px 32px",borderTop:`1px solid ${T.border}`,
                display:"flex",gap:10,flexShrink:0}}>
                <button onClick={()=>setShowForm(false)}
                  style={{flex:1,padding:"13px",borderRadius:12,border:"none",cursor:"pointer",
                    background:T.surface,color:T.t2,fontSize:13,fontWeight:600,boxShadow:T.btn}}>
                  Cancelar
                </button>
                <button onClick={guardar}
                  style={{flex:2,padding:"13px",borderRadius:12,border:"none",
                    cursor:fDesc&&fMonto?"pointer":"not-allowed",
                    background:fDesc&&fMonto
                      ?`linear-gradient(135deg,${T.accent},${T.accent}CC)`
                      :"rgba(255,255,255,0.08)",
                    color:fDesc&&fMonto?"#1C2130":T.t3,
                    fontSize:13,fontWeight:700,
                    display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                  <I d={ic.check} s={14} c={fDesc&&fMonto?"#1C2130":T.t3}/>
                  {editGasto ? "Guardar cambios" : "Registrar gasto"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ SHEET: NUEVO TIPO DE GASTO ═══════════════════════════ */}
      <AnimatePresence>
        {showTipoForm && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",
              display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:200,
              backdropFilter:"blur(4px)"}}
            onClick={e=>e.target===e.currentTarget&&setShowTipoForm(false)}>
            <motion.div initial={{y:"100%"}} animate={{y:0}} exit={{y:"100%"}}
              transition={{type:"spring",damping:30,stiffness:350}}
              style={{width:"100%",maxWidth:480,background:T.surface,
                borderRadius:"24px 24px 0 0",padding:"20px 20px 36px",
                boxShadow:"0 -8px 40px rgba(0,0,0,0.5)"}}>

              <div style={{width:40,height:5,borderRadius:3,
                background:"rgba(255,255,255,0.15)",margin:"0 auto 16px"}}/>
              <div style={{fontSize:16,fontWeight:700,color:T.t1,
                fontFamily:"Bricolage Grotesque",marginBottom:16}}>
                {editTipo ? "✏️ Editar tipo" : "🏷️ Nuevo tipo de gasto"}
              </div>

              {/* Emoji picker */}
              <div style={{fontSize:11,color:T.t3,marginBottom:8,fontWeight:600,
                textTransform:"uppercase",letterSpacing:"0.06em"}}>
                Ícono
              </div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
                {EMOJIS.map(e=>(
                  <button key={e} onClick={()=>setTEmoji(e)}
                    style={{width:40,height:40,borderRadius:10,border:"none",cursor:"pointer",
                      fontSize:20,background:tEmoji===e?`${T.accent}22`:T.surface,
                      boxShadow:tEmoji===e?T.press:T.btn,
                      outline:tEmoji===e?`1.5px solid ${T.accent}40`:"none"}}>
                    {e}
                  </button>
                ))}
              </div>

              {/* Nombre */}
              <div style={{fontSize:11,color:T.t3,marginBottom:7,fontWeight:600,
                textTransform:"uppercase",letterSpacing:"0.06em"}}>
                Nombre del tipo *
              </div>
              <input value={tLabel} onChange={e=>setTLabel(e.target.value)} autoFocus
                placeholder="Ej: Gasolina, Útiles de oficina..."
                style={{width:"100%",padding:"13px 16px",borderRadius:14,border:"none",
                  background:T.bg,boxShadow:T.inset,color:T.t1,fontSize:15,
                  fontFamily:"DM Sans",outline:"none",caretColor:T.accent,
                  boxSizing:"border-box",marginBottom:20}}/>

              <div style={{display:"flex",gap:10}}>
                <button onClick={()=>setShowTipoForm(false)}
                  style={{flex:1,padding:"13px",borderRadius:12,border:"none",cursor:"pointer",
                    background:T.surface,color:T.t2,fontSize:13,fontWeight:600,boxShadow:T.btn}}>
                  Cancelar
                </button>
                <button onClick={guardarTipo}
                  style={{flex:2,padding:"13px",borderRadius:12,border:"none",
                    cursor:tLabel?"pointer":"not-allowed",
                    background:tLabel
                      ?`linear-gradient(135deg,${T.blue},${T.blue}CC)`
                      :"rgba(255,255,255,0.08)",
                    color:tLabel?"#fff":T.t3,
                    fontSize:13,fontWeight:700,
                    display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                  <I d={ic.check} s={14} c={tLabel?"#fff":T.t3}/>
                  {editTipo ? "Guardar cambios" : "Agregar tipo"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ CONFIRM DELETE ════════════════════════════════════════ */}
      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",
              display:"flex",alignItems:"center",justifyContent:"center",
              zIndex:200,backdropFilter:"blur(6px)",padding:24}}>
            <motion.div initial={{scale:0.92,opacity:0}} animate={{scale:1,opacity:1}}
              exit={{scale:0.92,opacity:0}}
              style={{width:"100%",maxWidth:360,background:T.surface,
                borderRadius:22,padding:"24px 22px",
                boxShadow:"0 20px 60px rgba(0,0,0,0.5)"}}>
              <div style={{textAlign:"center",marginBottom:18}}>
                <div style={{fontSize:36,marginBottom:10}}>🗑️</div>
                <div style={{fontSize:17,fontWeight:800,color:T.t1,
                  fontFamily:"Bricolage Grotesque",marginBottom:6}}>
                  ¿Eliminar gasto?
                </div>
                <div style={{fontSize:13,color:T.t3}}>
                  {gastos.find(g=>g.id===deleteId)?.desc} —{" "}
                  {gastos.find(g=>g.id===deleteId) && fmtCLP(gastos.find(g=>g.id===deleteId).amt)}
                </div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <button onClick={()=>eliminar(deleteId)}
                  style={{padding:"13px",borderRadius:12,border:"none",cursor:"pointer",
                    background:`linear-gradient(135deg,${T.danger},${T.danger}CC)`,
                    color:"#fff",fontSize:14,fontWeight:700}}>
                  Sí, eliminar
                </button>
                <button onClick={()=>setDeleteId(null)}
                  style={{padding:"12px",borderRadius:12,border:"none",cursor:"pointer",
                    background:T.surface,color:T.t2,fontSize:13,fontWeight:500,
                    boxShadow:T.btn}}>
                  Cancelar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── DETALLE DE DEUDOR ────────────────────────────────────────────
function DeudorDetalle({ T, onBack }) {
  const [showAbono,setShowAbono]=useState(false)
  const [abonoAmt,setAbonoAmt]=useState("")
  const [deudor,setDeudor]=useState({name:"Pedro Soto",phone:"+56 9 1234 5678",balance:47500})
  const fmtCLP=n=>new Intl.NumberFormat("es-CL",{style:"currency",currency:"CLP",maximumFractionDigits:0}).format(n)
  const movs=[
    {id:1,date:"15 Mar",total:12450,paid:12450,pending:0,st:"paid",
     items:[{n:"Coca-Cola 2L × 3",sub:4470},{n:"Pan Molde × 2",sub:3780},{n:"Det. Omo × 1",sub:4200}]},
    {id:2,date:"20 Mar",total:12620,paid:5120,pending:7500,st:"partial",
     items:[{n:"Leche 1L × 4",sub:5000},{n:"Yogurt × 2",sub:2120},{n:"Queso × 1",sub:5500}]},
    {id:3,date:"20 Mar",total:10390,paid:2640,pending:7750,st:"partial",
     items:[{n:"Coca-Cola 2L × 5",sub:7450},{n:"Agua 500ml × 6",sub:2940}]},
  ]
  const stMap={paid:{l:"✅ Saldado",c:T.mint,bg:`${T.mint}18`},partial:{l:"⏳ Pendiente",c:T.accent,bg:`${T.accent}18`}}
  const registrarAbono=()=>{
    if(!abonoAmt) return
    const amt=parseInt(abonoAmt)
    setDeudor(d=>({...d,balance:Math.max(0,d.balance-amt)}))
    setAbonoAmt(""); setShowAbono(false)
  }
  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{padding:"16px",borderBottom:`1px solid ${T.border}`,flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
          <button onClick={onBack} style={{width:38,height:38,borderRadius:11,border:"none",cursor:"pointer",
            background:T.surface,boxShadow:T.btn,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <I d={ic.back} s={16} c={T.t2}/>
          </button>
          <div style={{flex:1}}>
            <div style={{fontSize:16,fontWeight:700,color:T.t1,fontFamily:"Bricolage Grotesque"}}>{deudor.name}</div>
            <div style={{fontSize:11,color:T.t3}}>{deudor.phone}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:22,fontWeight:900,color:deudor.balance>0?T.danger:T.mint,fontFamily:"JetBrains Mono"}}>
              {fmtCLP(deudor.balance)}
            </div>
            <div style={{fontSize:10,color:T.t3}}>saldo pendiente</div>
          </div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>setShowAbono(true)}
            style={{flex:1,padding:"10px",borderRadius:11,border:"none",cursor:"pointer",
              background:`linear-gradient(135deg,${T.accent},${T.accent}CC)`,
              color:"#1C2130",fontSize:12,fontWeight:700,
              display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
            💰 Registrar abono
          </button>
          <button onClick={()=>deudor?.phone&&window.open(`https://wa.me/${deudor.phone.replace(/[^0-9]/g,"")}`,`_blank`)}
            style={{flex:1,padding:"10px",borderRadius:11,border:"none",cursor:"pointer",
            background:"#25D36618",boxShadow:T.btn,color:"#25D366",fontSize:12,fontWeight:600,
            display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
            📲 WhatsApp
          </button>
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"16px",display:"flex",flexDirection:"column",gap:10}}>
        {movs.map((m,i)=>{
          const s=stMap[m.st]
          return (
            <div key={m.id} style={{background:T.surface,borderRadius:14,padding:"14px 16px",
              boxShadow:T.card,border:`1px solid ${s.c}18`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div>
                  <div style={{fontSize:12,fontWeight:600,color:T.t1}}>{m.date}</div>
                  <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20,
                    background:s.bg,color:s.c}}>{s.l}</span>
                </div>
                <div style={{fontSize:16,fontWeight:900,color:T.t1,fontFamily:"JetBrains Mono"}}>{fmtCLP(m.total)}</div>
              </div>
              {m.items.map(item=>(
                <div key={item.n} style={{display:"flex",justifyContent:"space-between",
                  padding:"5px 0",borderBottom:`1px solid ${T.border}`}}>
                  <span style={{fontSize:12,color:T.t2}}>{item.n}</span>
                  <span style={{fontSize:12,color:T.t2,fontFamily:"JetBrains Mono"}}>{fmtCLP(item.sub)}</span>
                </div>
              ))}
              <div style={{marginTop:8,display:"flex",flexDirection:"column",gap:3}}>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <span style={{fontSize:11,color:T.t3}}>Pagado</span>
                  <span style={{fontSize:12,fontWeight:700,color:T.mint,fontFamily:"JetBrains Mono"}}>{fmtCLP(m.paid)}</span>
                </div>
                {m.pending>0&&(
                  <div style={{display:"flex",justifyContent:"space-between"}}>
                    <span style={{fontSize:11,color:T.t3}}>Pendiente</span>
                    <span style={{fontSize:12,fontWeight:700,color:T.danger,fontFamily:"JetBrains Mono"}}>{fmtCLP(m.pending)}</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
        <div style={{height:20}}/>
      </div>
      <AnimatePresence>
        {showAbono&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.65)",
              display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:200}}
            onClick={e=>e.target===e.currentTarget&&setShowAbono(false)}>
            <motion.div initial={{y:"100%"}} animate={{y:0}} exit={{y:"100%"}}
              transition={{type:"spring",damping:30,stiffness:350}}
              style={{width:"100%",maxWidth:480,background:T.surface,
                borderRadius:"24px 24px 0 0",padding:"20px 20px 40px",boxShadow:"0 -8px 40px rgba(0,0,0,0.5)"}}>
              <div style={{width:40,height:5,borderRadius:3,background:"rgba(255,255,255,0.15)",margin:"0 auto 16px"}}/>
              <div style={{fontSize:16,fontWeight:700,color:T.t1,fontFamily:"Bricolage Grotesque",marginBottom:4}}>
                Registrar abono
              </div>
              <div style={{fontSize:12,color:T.t3,marginBottom:16}}>
                {deudor.name} · Saldo: {fmtCLP(deudor.balance)}
              </div>
              <div style={{fontSize:11,color:T.t3,marginBottom:8}}>Monto recibido</div>
              <input value={abonoAmt} onChange={e=>setAbonoAmt(e.target.value.replace(/\D/g,""))}
                inputMode="numeric" placeholder="$0" autoFocus
                style={{width:"100%",padding:"16px",borderRadius:14,border:"none",
                  background:T.bg,boxShadow:T.inset,color:T.t1,fontSize:26,fontWeight:900,
                  fontFamily:"JetBrains Mono",textAlign:"right",outline:"none",
                  caretColor:T.accent,boxSizing:"border-box",marginBottom:12}}/>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:14}}>
                {[1000,2000,5000,10000].map(a=>(
                  <button key={a} onClick={()=>setAbonoAmt(String(a))}
                    style={{padding:"9px 4px",borderRadius:10,border:"none",cursor:"pointer",
                      fontSize:12,fontWeight:700,
                      background:abonoAmt===String(a)?`${T.accent}25`:T.surface,
                      color:abonoAmt===String(a)?T.accent:T.t3,
                      boxShadow:abonoAmt===String(a)?T.press:T.btn}}>
                    {fmtCLP(a)}
                  </button>
                ))}
              </div>
              {parseInt(abonoAmt||0)>deudor.balance&&(
                <div style={{background:`${T.mint}12`,border:`1px solid ${T.mint}30`,
                  borderRadius:12,padding:"10px 14px",marginBottom:12,textAlign:"center"}}>
                  <div style={{fontSize:11,color:T.mint,fontWeight:700,marginBottom:2}}>VUELTO A ENTREGAR</div>
                  <div style={{fontSize:22,fontWeight:900,color:T.mint,fontFamily:"JetBrains Mono"}}>
                    {fmtCLP(parseInt(abonoAmt||0)-deudor.balance)}
                  </div>
                </div>
              )}
              <button onClick={registrarAbono}
                style={{width:"100%",padding:"14px",borderRadius:12,border:"none",
                  cursor:abonoAmt?"pointer":"not-allowed",
                  background:abonoAmt?`linear-gradient(135deg,${T.mint},${T.mint}CC)`:"rgba(255,255,255,0.07)",
                  color:abonoAmt?"#1C2130":T.t3,fontSize:14,fontWeight:700,fontFamily:"DM Sans",
                  boxShadow:abonoAmt?`0 4px 14px ${T.mint}40`:"none",
                  display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                <I d={ic.check} s={16} c={abonoAmt?"#1C2130":T.t3}/>
                Confirmar abono
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── ÓRDENES DE COMPRA ────────────────────────────────────────────
function OrdenesCompra({ T, onBack }) {
  const [tab,setTab]=useState("activas")
  const [showNew,setShowNew]=useState(false)
  const [ordenes,setOrdenes]=useState([
    {id:"OC-0042",proveedor:"Embotelladora Andina",date:"25 Mar",entrega:"28 Mar",
     total:39360,status:"enviada",
     items:[{n:"Coca-Cola 2L × 24",sub:21360},{n:"Sprite 1.5L × 12",sub:9000},{n:"Fanta × 12",sub:9000}]},
    {id:"OC-0041",proveedor:"Lácteos del Sur",date:"22 Mar",entrega:"25 Mar",
     total:18500,status:"recibida",
     items:[{n:"Leche Entera 1L × 24",sub:15600},{n:"Yogurt 200g × 12",sub:2940}]},
  ])
  // Nueva OC
  const [nProveedor,setNProveedor]=useState("")
  const [nEntrega,setNEntrega]=useState("")
  const [nNota,setNNota]=useState("")

  const fmtCLP=n=>new Intl.NumberFormat("es-CL",{style:"currency",currency:"CLP",maximumFractionDigits:0}).format(n)
  const stMap={
    enviada:{l:"📤 Enviada",c:T.accent,bg:`${T.accent}18`},
    recibida:{l:"✅ Recibida",c:T.mint,bg:`${T.mint}18`},
    pendiente:{l:"⏳ Pendiente",c:T.blue,bg:`${T.blue}18`},
  }

  const confirmarRecepcion=(id)=>setOrdenes(os=>os.map(o=>o.id===id?{...o,status:"recibida"}:o))
  const crearOrden=()=>{
    if(!nProveedor.trim()) return
    setOrdenes(os=>[{id:`OC-${String(os.length+43).padStart(4,"0")}`,
      proveedor:nProveedor,date:"Hoy",entrega:nEntrega||"Por acordar",
      total:0,status:"pendiente",items:[{n:nNota||"Productos por definir",sub:0}]
    },...os])
    setNProveedor(""); setNEntrega(""); setNNota(""); setShowNew(false)
  }

  const activas=ordenes.filter(o=>o.status!=="recibida")
  const historial=ordenes.filter(o=>o.status==="recibida")
  const lista=tab==="activas"?activas:historial

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
        padding:"16px",borderBottom:`1px solid ${T.border}`,flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <button onClick={onBack} style={{width:38,height:38,borderRadius:11,border:"none",cursor:"pointer",
            background:T.surface,boxShadow:T.btn,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <I d={ic.back} s={16} c={T.t2}/>
          </button>
          <div style={{fontSize:16,fontWeight:700,color:T.t1,fontFamily:"Bricolage Grotesque"}}>Órdenes de Compra</div>
        </div>
        <button onClick={()=>setShowNew(true)}
          style={{padding:"9px 16px",borderRadius:10,border:"none",cursor:"pointer",
            background:`linear-gradient(135deg,${T.accent},${T.accent}CC)`,
            color:"#1C2130",fontSize:12,fontWeight:700,display:"flex",alignItems:"center",gap:6}}>
          <I d={ic.plus} s={14} c="#1C2130"/>Nueva
        </button>
      </div>
      <div style={{display:"flex",padding:"0 16px",borderBottom:`1px solid ${T.border}`,flexShrink:0}}>
        {[{id:"activas",l:`Activas (${activas.length})`},{id:"historial",l:"Historial"}].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            style={{flex:1,padding:"13px 4px",border:"none",cursor:"pointer",background:"transparent",
              fontSize:13,fontWeight:tab===t.id?700:400,color:tab===t.id?T.accent:T.t3,
              borderBottom:tab===t.id?`2px solid ${T.accent}`:"2px solid transparent"}}>
            {t.l}
          </button>
        ))}
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"16px",display:"flex",flexDirection:"column",gap:10}}>
        {lista.length===0&&(
          <div style={{textAlign:"center",padding:"40px",color:T.t3}}>
            <div style={{fontSize:40,marginBottom:12}}>📋</div>
            <div style={{fontSize:14}}>Sin órdenes aquí</div>
          </div>
        )}
        {lista.map(o=>{
          const s=stMap[o.status]
          return (
            <div key={o.id} style={{background:T.surface,borderRadius:14,padding:"14px 16px",
              boxShadow:T.card,border:`1px solid ${s.c}18`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                    <span style={{fontSize:13,fontWeight:700,color:T.t1}}>{o.proveedor}</span>
                    <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20,
                      background:s.bg,color:s.c}}>{s.l}</span>
                  </div>
                  <div style={{fontSize:10,fontFamily:"JetBrains Mono",color:T.t3}}>
                    {o.id} · Pedido: {o.date} · Entrega: {o.entrega}
                  </div>
                </div>
                <div style={{fontSize:16,fontWeight:900,color:T.accent,fontFamily:"JetBrains Mono",flexShrink:0}}>
                  {fmtCLP(o.total)}
                </div>
              </div>
              {o.items.map(item=>(
                <div key={item.n} style={{display:"flex",justifyContent:"space-between",
                  padding:"5px 0",borderBottom:`1px solid ${T.border}`}}>
                  <span style={{fontSize:12,color:T.t2}}>{item.n}</span>
                  <span style={{fontSize:12,color:T.t2,fontFamily:"JetBrains Mono"}}>{fmtCLP(item.sub)}</span>
                </div>
              ))}
              {o.status==="enviada"&&(
                <button onClick={()=>confirmarRecepcion(o.id)}
                  style={{width:"100%",marginTop:12,padding:"10px",borderRadius:10,border:"none",
                    cursor:"pointer",background:`linear-gradient(135deg,${T.mint},${T.mint}CC)`,
                    color:"#1C2130",fontSize:12,fontWeight:700,
                    display:"flex",alignItems:"center",justifyContent:"center",gap:7}}>
                  <I d={ic.check} s={14} c="#1C2130"/>✅ Confirmar recepción de mercadería
                </button>
              )}
            </div>
          )
        })}
        <div style={{height:20}}/>
      </div>
      <AnimatePresence>
        {showNew&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.65)",
              display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:200}}
            onClick={e=>e.target===e.currentTarget&&setShowNew(false)}>
            <motion.div initial={{y:"100%"}} animate={{y:0}} exit={{y:"100%"}}
              transition={{type:"spring",damping:30,stiffness:350}}
              style={{width:"100%",maxWidth:480,background:T.surface,
                borderRadius:"24px 24px 0 0",padding:"20px 20px 40px",boxShadow:"0 -8px 40px rgba(0,0,0,0.5)"}}>
              <div style={{width:40,height:5,borderRadius:3,background:"rgba(255,255,255,0.15)",margin:"0 auto 16px"}}/>
              <div style={{fontSize:16,fontWeight:700,color:T.t1,fontFamily:"Bricolage Grotesque",marginBottom:16}}>
                Nueva orden de compra
              </div>
              {/* Proveedor */}
              <div style={{marginBottom:12}}>
                <div style={{fontSize:11,color:T.t3,marginBottom:7,fontWeight:600}}>Proveedor *</div>
                <input value={nProveedor} onChange={e=>setNProveedor(e.target.value)}
                  placeholder="Nombre del proveedor..." autoFocus
                  style={{width:"100%",padding:"12px 14px",borderRadius:12,border:"none",
                    background:T.bg,boxShadow:T.inset,color:T.t1,fontSize:14,
                    fontFamily:"DM Sans",outline:"none",caretColor:T.accent,boxSizing:"border-box"}}/>
              </div>
              {/* Fecha entrega */}
              <div style={{marginBottom:12}}>
                <div style={{fontSize:11,color:T.t3,marginBottom:7,fontWeight:600}}>Fecha de entrega</div>
                <input value={nEntrega} onChange={e=>setNEntrega(e.target.value)}
                  type="date"
                  style={{width:"100%",padding:"12px 14px",borderRadius:12,border:"none",
                    background:T.bg,boxShadow:T.inset,color:T.t1,fontSize:14,
                    fontFamily:"DM Sans",outline:"none",caretColor:T.accent,boxSizing:"border-box"}}/>
              </div>
              {/* Notas */}
              <div style={{marginBottom:12}}>
                <div style={{fontSize:11,color:T.t3,marginBottom:7,fontWeight:600}}>Notas / productos a pedir</div>
                <input value={nNota} onChange={e=>setNNota(e.target.value)}
                  placeholder="Ej: 24 Coca-Cola 2L, 12 Sprite 1.5L..."
                  style={{width:"100%",padding:"12px 14px",borderRadius:12,border:"none",
                    background:T.bg,boxShadow:T.inset,color:T.t1,fontSize:14,
                    fontFamily:"DM Sans",outline:"none",caretColor:T.accent,boxSizing:"border-box"}}/>
              </div>
              <div style={{display:"flex",gap:10,marginTop:8}}>
                <button onClick={()=>setShowNew(false)}
                  style={{flex:1,padding:"12px",borderRadius:12,border:"none",cursor:"pointer",
                    background:T.surface,color:T.t2,fontSize:13,fontWeight:600,boxShadow:T.btn}}>
                  Cancelar
                </button>
                <button onClick={crearOrden}
                  style={{flex:2,padding:"12px",borderRadius:12,border:"none",
                    cursor:nProveedor?"pointer":"not-allowed",
                    background:nProveedor?`linear-gradient(135deg,${T.accent},${T.accent}CC)`:"rgba(255,255,255,0.08)",
                    color:nProveedor?"#1C2130":T.t3,fontSize:13,fontWeight:700,
                    display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                  <I d={ic.check} s={14} c={nProveedor?"#1C2130":T.t3}/>
                  Crear y enviar orden
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── REPORTES ─────────────────────────────────────────────────────
function Reportes({ T, onBack }) {
  const [period,setPeriod]=useState("semana")
  const fmtCLP=n=>new Intl.NumberFormat("es-CL",{style:"currency",currency:"CLP",maximumFractionDigits:0}).format(n)
  const data={
    hoy:   {ventas:187500,tx:47,ticket:3989,margen:38.2,dias:["00","03","06","09","12","15","18","21"],vals:[0,0,0,42000,55000,38000,52500,0]},
    semana:{ventas:892000,tx:214,ticket:4168,margen:39.1,dias:["L","M","M","J","V","S","D"],vals:[120000,145000,98000,187500,210000,132000,0]},
    mes:   {ventas:3240000,tx:820,ticket:3951,margen:38.7,dias:["S1","S2","S3","S4"],vals:[780000,850000,920000,690000]},
    año:   {ventas:38900000,tx:9840,ticket:3953,margen:39.3,dias:["E","F","M","A","M","J","J","A","S","O","N","D"],vals:[3100000,2800000,3400000,3200000,3600000,3100000,3300000,3500000,3200000,3400000,3800000,3500000]},
  }
  const d=data[period]
  const maxVal=Math.max(...d.vals,1)
  const kpis=[
    {l:"Ventas totales",v:fmtCLP(d.ventas),c:T.accent},
    {l:"Transacciones",v:d.tx,c:T.mint},
    {l:"Ticket promedio",v:fmtCLP(d.ticket),c:T.blue},
    {l:"Margen promedio",v:`${d.margen}%`,c:T.accent},
  ]
  const tops=[
    {n:"Coca-Cola 2L",u:Math.round(d.tx*0.48),r:fmtCLP(Math.round(d.ventas*0.22)),p:90},
    {n:"Pan Molde",u:Math.round(d.tx*0.38),r:fmtCLP(Math.round(d.ventas*0.17)),p:70},
    {n:"Leche 1L",u:Math.round(d.tx*0.32),r:fmtCLP(Math.round(d.ventas*0.10)),p:55},
    {n:"Yogurt 200g",u:Math.round(d.tx*0.26),r:fmtCLP(Math.round(d.ventas*0.08)),p:44},
  ]
  const metodos=[
    {l:"Efectivo",pct:52,c:T.accent},{l:"Transfer",pct:28,c:T.mint},
    {l:"Tarjeta",pct:12,c:T.blue},{l:"Fiado",pct:8,c:T.danger},
  ]
  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
        padding:"16px",borderBottom:`1px solid ${T.border}`,flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <button onClick={onBack} style={{width:38,height:38,borderRadius:11,border:"none",cursor:"pointer",
            background:T.surface,boxShadow:T.btn,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <I d={ic.back} s={16} c={T.t2}/>
          </button>
          <div style={{fontSize:16,fontWeight:700,color:T.t1,fontFamily:"Bricolage Grotesque"}}>Reportes 📊</div>
        </div>
        <button onClick={()=>window.print()}
          style={{padding:"9px 14px",borderRadius:10,border:"none",cursor:"pointer",
          background:T.surface,boxShadow:T.btn,color:T.t2,fontSize:12,fontWeight:600}}>
          📤 Exportar
        </button>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"16px",display:"flex",flexDirection:"column",gap:14}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
          {[{id:"hoy",l:"Hoy"},{id:"semana",l:"Semana"},{id:"mes",l:"Mes"},{id:"año",l:"Año"}].map(p=>(
            <button key={p.id} onClick={()=>setPeriod(p.id)}
              style={{padding:"10px 4px",borderRadius:12,border:"none",cursor:"pointer",
                fontSize:13,fontWeight:period===p.id?700:400,
                background:period===p.id?`linear-gradient(135deg,${T.accent},${T.accent}CC)`:T.surface,
                color:period===p.id?"#1C2130":T.t3,
                boxShadow:period===p.id?`${T.press},0 0 12px ${T.accent}40`:T.btn}}>
              {p.l}
            </button>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {kpis.map(k=>(
            <div key={k.l} style={{background:T.surface,borderRadius:14,padding:"14px",
              boxShadow:T.card,textAlign:"center"}}>
              <div style={{fontSize:11,color:T.t3,marginBottom:5}}>{k.l}</div>
              <div style={{fontSize:18,fontWeight:900,color:k.c,fontFamily:"JetBrains Mono"}}>{k.v}</div>
            </div>
          ))}
        </div>
        <div style={{background:T.surface,borderRadius:16,padding:16,boxShadow:T.card}}>
          <div style={{fontSize:13,fontWeight:700,color:T.t1,marginBottom:14}}>
            Ventas — {period==="hoy"?"por hora":period==="semana"?"por día":period==="mes"?"por semana":"por mes"}
          </div>
          <div style={{display:"flex",alignItems:"flex-end",gap:5,height:100}}>
            {d.vals.map((v,i)=>(
              <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                <motion.div key={`${period}-${i}`}
                  initial={{height:0}} animate={{height:maxVal>0?`${(v/maxVal*88)+4}%`:"4px"}}
                  transition={{duration:0.6,delay:i*0.04}}
                  style={{width:"100%",borderRadius:"5px 5px 0 0",
                    background:v===Math.max(...d.vals)
                      ?`linear-gradient(180deg,${T.accent},${T.accent}BB)`
                      :`${T.accent}35`,minHeight:4}}/>
                <span style={{fontSize:8,color:T.t3}}>{d.dias[i]}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{background:T.surface,borderRadius:16,padding:16,boxShadow:T.card}}>
          <div style={{fontSize:13,fontWeight:700,color:T.t1,marginBottom:14}}>Top productos</div>
          {tops.map((p,i)=>(
            <div key={p.n} style={{display:"flex",alignItems:"center",gap:10,marginBottom:i<tops.length-1?12:0}}>
              <span style={{fontSize:10,color:T.t3,width:14,textAlign:"center",fontFamily:"monospace"}}>{i+1}</span>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                  <span style={{fontSize:12,color:T.t2,fontWeight:500}}>{p.n}</span>
                  <div style={{display:"flex",gap:10}}>
                    <span style={{fontSize:11,color:T.t3}}>{p.u}u</span>
                    <span style={{fontSize:12,color:T.accent,fontFamily:"JetBrains Mono",fontWeight:700}}>{p.r}</span>
                  </div>
                </div>
                <div style={{height:5,borderRadius:3,background:T.sunken}}>
                  <div style={{height:"100%",borderRadius:3,width:`${p.p}%`,
                    background:i===0?`linear-gradient(90deg,${T.accent},${T.mint})`:`${T.accent}55`,
                    transition:"width 0.5s"}}/>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{background:T.surface,borderRadius:16,padding:16,boxShadow:T.card}}>
          <div style={{fontSize:13,fontWeight:700,color:T.t1,marginBottom:14}}>Métodos de pago</div>
          {metodos.map(m=>(
            <div key={m.l} style={{marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                <span style={{fontSize:12,color:T.t2}}>{m.l}</span>
                <span style={{fontSize:12,fontWeight:700,color:m.c,fontFamily:"JetBrains Mono"}}>{m.pct}%</span>
              </div>
              <div style={{height:6,borderRadius:3,background:T.sunken}}>
                <div style={{height:"100%",borderRadius:3,width:`${m.pct}%`,background:m.c,transition:"width 0.5s"}}/>
              </div>
            </div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[
            {l:"📊 Excel",   a:()=>alert("Exportando Excel...")},
            {l:"📄 PDF",     a:()=>window.print()},
            {l:"📲 WhatsApp",a:()=>window.open("https://wa.me/?text=Reporte%20NegociPro","_blank")},
            {l:"📧 Email",   a:()=>window.open("mailto:?subject=Reporte","_blank")},
          ].map(b=>(
            <button key={b.l} onClick={b.a}
              style={{padding:"12px",borderRadius:12,border:"none",cursor:"pointer",
              background:T.surface,boxShadow:T.btn,color:T.t2,fontSize:12,fontWeight:600}}>
              {b.l}
            </button>
          ))}
        </div>
        <div style={{height:20}}/>
      </div>
    </div>
  )
}

// ─── TICKET DE VENTA ──────────────────────────────────────────────
function TicketVenta({ T, onBack, lastSale, contactList }) {
  const fmtCLP=n=>new Intl.NumberFormat("es-CL",{style:"currency",currency:"CLP",maximumFractionDigits:0}).format(n)
  const now = new Date()
  const dateStr = now.toLocaleDateString("es-CL",{day:"numeric",month:"short",year:"numeric"})
  const timeStr = now.toLocaleTimeString("es-CL",{hour:"2-digit",minute:"2-digit"})

  // Usar datos reales de la última venta, o datos de ejemplo si no hay
  const saleItems = lastSale?.items?.length
    ? lastSale.items.map(i=>({n:i.name||i.n,q:i.qty||i.q||1,p:i.price||i.p||0,sub:(i.price||i.p||0)*(i.qty||i.q||1)}))
    : [{n:"Coca-Cola 2L",q:2,p:1490,sub:2980},{n:"Pan Molde Grande",q:1,p:1890,sub:1890}]
  const saleTotal  = lastSale?.total  || saleItems.reduce((s,i)=>s+i.sub,0)
  const saleMethod = lastSale?.method || "Efectivo"
  const saleClient = lastSale?.client || null

  // Buscar email del cliente en contactList
  const clientData = saleClient
    ? (contactList||[]).find(cl=>cl.name===saleClient.name||cl.name===saleClient.n)
    : null
  const clientEmail   = clientData?.email   || saleClient?.email   || ""
  const clientPhone   = clientData?.phone   || saleClient?.phone   || saleClient?.ph || ""
  const clientName    = saleClient?.name    || saleClient?.n || ""
  const clientTelegram= clientData?.telegram || ""

  const ticket={
    id:`#${1800+Math.floor(Math.random()*100)}`,
    date:dateStr, time:timeStr, cashier:"Tú",
    items:saleItems,
    subtotal:saleTotal,
    iva:Math.round(saleTotal*0.19),
    total:saleTotal,
    method:saleMethod,
    paid:saleTotal,
    change:0,
    points:Math.floor(saleTotal/1000),
    totalPoints:94,
  }

  // Construir mensaje/email completo con datos reales
  const itemsText = ticket.items.map(i=>`  • ${i.n} × ${i.q} = ${fmtCLP(i.sub)}`).join("\n")
  const emailSubject = encodeURIComponent(`Comprobante de compra – NegociPro`)
  const emailBody = encodeURIComponent(
    (clientName ? "Hola " + clientName + "," : "Hola,") + "\n\n" +
    "Aquí tienes tu comprobante de compra:\n\n" +
    "Boleta " + ticket.id + " — " + ticket.date + " " + ticket.time + "\n" +
    "Forma de pago: " + ticket.method + "\n\n" +
    "Productos:\n" + itemsText + "\n\n" +
    "TOTAL: " + fmtCLP(ticket.total) + "\n\n" +
    "¡Gracias por tu compra! Vuelve pronto\n— NegociPro"
  )
  const wspMsg = encodeURIComponent(
    "🧾 *Comprobante NegociPro*\n" +
    "Boleta " + ticket.id + " — " + ticket.date + "\n\n" +
    ticket.items.map(i=>"• " + i.n + " × " + i.q + ": " + fmtCLP(i.sub)).join("\n") +
    "\n\n*TOTAL: " + fmtCLP(ticket.total) + "*\n¡Gracias por tu compra! 🙏"
  )
  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%",background:T.bg}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
        padding:"16px",borderBottom:`1px solid ${T.border}`,flexShrink:0}}>
        <button onClick={onBack} style={{width:38,height:38,borderRadius:11,border:"none",cursor:"pointer",
          background:T.surface,boxShadow:T.btn,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <I d={ic.back} s={16} c={T.t2}/>
        </button>
        <span style={{fontSize:15,fontWeight:700,color:T.t1,fontFamily:"Bricolage Grotesque"}}>Comprobante</span>
        <div style={{width:38}}/>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"16px",display:"flex",flexDirection:"column",gap:14}}>
        <div style={{textAlign:"center",padding:"20px 0"}}>
          <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:"spring",damping:12,delay:0.1}}
            style={{width:68,height:68,borderRadius:34,margin:"0 auto 14px",
              background:`linear-gradient(135deg,${T.mint},${T.mint}99)`,
              boxShadow:`0 0 28px ${T.mint}50`,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <I d={ic.check} s={30} c="#fff"/>
          </motion.div>
          <div style={{fontSize:20,fontWeight:800,color:T.t1,fontFamily:"Bricolage Grotesque",marginBottom:4}}>¡Venta confirmada!</div>
          <div style={{fontSize:12,color:T.t3}}>{ticket.date} · {ticket.time} · {ticket.cashier}</div>
        </div>
        <div style={{background:T.surface,borderRadius:20,overflow:"hidden",boxShadow:T.card}}>
          <div style={{background:`linear-gradient(135deg,${T.accent},${T.accent}CC)`,padding:"14px",textAlign:"center"}}>
            <div style={{fontSize:16,fontWeight:800,color:"#1C2130",fontFamily:"Bricolage Grotesque"}}>⚡ NegociPro</div>
            <div style={{fontSize:10,color:"rgba(0,0,0,0.6)",marginTop:1}}>Boleta {ticket.id}</div>
          </div>
          <div style={{height:10,background:`repeating-linear-gradient(90deg,${T.bg} 0px,${T.bg} 8px,${T.surface} 8px,${T.surface} 16px)`}}/>
          <div style={{padding:"14px 16px"}}>
            {ticket.items.map(item=>(
              <div key={item.n} style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                padding:"8px 0",borderBottom:`1px dashed ${T.border}`}}>
                <div>
                  <div style={{fontSize:13,color:T.t1}}>{item.n}</div>
                  <div style={{fontSize:11,color:T.t3}}>{item.q}u × {fmtCLP(item.p)}</div>
                </div>
                <div style={{fontSize:14,fontWeight:700,color:T.t1,fontFamily:"JetBrains Mono"}}>{fmtCLP(item.sub)}</div>
              </div>
            ))}
            <div style={{marginTop:10,display:"flex",flexDirection:"column",gap:5}}>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <span style={{fontSize:12,color:T.t3}}>IVA incluido</span>
                <span style={{fontSize:12,color:T.t3,fontFamily:"JetBrains Mono"}}>{fmtCLP(ticket.iva)}</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",paddingTop:6,borderTop:`1px solid ${T.border}`}}>
                <span style={{fontSize:16,fontWeight:700,color:T.t1}}>TOTAL</span>
                <span style={{fontSize:20,fontWeight:900,color:T.accent,fontFamily:"JetBrains Mono"}}>{fmtCLP(ticket.total)}</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <span style={{fontSize:12,color:T.t2}}>💵 Pagó en {ticket.method}</span>
                <span style={{fontSize:12,fontWeight:700,color:T.t1,fontFamily:"JetBrains Mono"}}>{fmtCLP(ticket.paid)}</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <span style={{fontSize:12,color:T.t2}}>💰 Vuelto entregado</span>
                <span style={{fontSize:12,fontWeight:700,color:T.mint,fontFamily:"JetBrains Mono"}}>{fmtCLP(ticket.change)}</span>
              </div>
            </div>
            <div style={{background:`${T.accent}10`,border:`1px solid ${T.accent}20`,
              borderRadius:10,padding:"10px 12px",marginTop:10,textAlign:"center"}}>
              <div style={{fontSize:11,color:T.accent,fontWeight:600}}>⭐ +{ticket.points} puntos — Total: {ticket.totalPoints}/100</div>
            </div>
          </div>
          <div style={{height:10,background:`repeating-linear-gradient(90deg,${T.bg} 0px,${T.bg} 8px,${T.surface} 8px,${T.surface} 16px)`}}/>
          <div style={{padding:"10px",textAlign:"center"}}>
            <div style={{fontSize:11,color:T.t3}}>¡Gracias por tu compra! 🙏</div>
          </div>
        </div>
        {/* ── Enviar comprobante al cliente ──────────── */}
        <div style={{background:T.surface,borderRadius:18,padding:"16px",boxShadow:T.card,
          border:`1px solid ${T.accent}20`}}>
          <div style={{fontSize:12,fontWeight:700,color:T.t1,marginBottom:4}}>
            📤 Enviar comprobante al cliente
          </div>
          {/* Si hay cliente con datos, mostrar su info */}
          {clientName && (
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,
              padding:"8px 12px",borderRadius:10,background:`${T.accent}0C`,
              border:`1px solid ${T.accent}20`}}>
              <div style={{width:30,height:30,borderRadius:9,background:`${T.accent}20`,
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:14,fontWeight:700,color:T.accent,flexShrink:0}}>
                {clientName[0]}
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:700,color:T.t1}}>{clientName}</div>
                <div style={{fontSize:10,color:T.t3}}>
                  {clientEmail||"Sin correo"}{clientPhone?" · "+clientPhone:""}
                </div>
              </div>
              <span style={{fontSize:10,padding:"2px 8px",borderRadius:20,
                background:clientEmail?`${T.mint}18`:`${T.danger}12`,
                color:clientEmail?T.mint:T.t3,fontWeight:600}}>
                {clientEmail?"📧 Con correo":"Sin correo"}
              </span>
            </div>
          )}
          {/* WhatsApp — principal */}
          <button
            onClick={()=>window.open(`https://wa.me/${clientPhone.replace(/[^0-9]/g,"")}?text=${wspMsg}`,'_blank')}
            style={{width:"100%",padding:"14px",borderRadius:14,border:"none",cursor:"pointer",
              background:`linear-gradient(135deg,#25D366,#128C7E)`,color:"#fff",
              fontSize:14,fontWeight:700,fontFamily:"DM Sans",
              boxShadow:"0 4px 16px rgba(37,211,102,0.4)",
              display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:10}}>
            <span style={{fontSize:20}}>📲</span>
            {clientPhone ? `Enviar a ${clientName||"cliente"}` : "Compartir por WhatsApp"}
          </button>
          {/* Email — prominente si hay correo */}
          <button
            onClick={()=>{
              if(clientEmail){
                window.open(`mailto:${clientEmail}?subject=${emailSubject}&body=${emailBody}`,'_blank')
              } else {
                window.open(`mailto:?subject=${emailSubject}&body=${emailBody}`,'_blank')
              }
            }}
            style={{width:"100%",padding:"13px",borderRadius:12,border:"none",cursor:"pointer",
              background:clientEmail?`linear-gradient(135deg,${T.blue},${T.blue}CC)`:`${T.blue}12`,
              color:clientEmail?"#fff":T.blue,fontSize:13,fontWeight:700,
              fontFamily:"DM Sans",
              boxShadow:clientEmail?`0 4px 14px ${T.blue}40`:"none",
              display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:10}}>
            <span style={{fontSize:16}}>📧</span>
            {clientEmail ? `Enviar boleta a ${clientEmail}` : "Enviar boleta por Email"}
          </button>
          {/* Telegram si hay */}
          {clientTelegram && (
            <button
              onClick={()=>window.open(`https://t.me/${clientTelegram.replace("@","")}`,'_blank')}
              style={{width:"100%",padding:"12px",borderRadius:12,border:"none",cursor:"pointer",
                background:`${T.blue}12`,color:T.blue,fontSize:13,fontWeight:600,
                display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:10}}>
              <span style={{fontSize:16}}>✈️</span>
              Enviar por Telegram ({clientTelegram})
            </button>
          )}
          {/* Imprimir */}
          <button onClick={()=>window.print()}
            style={{width:"100%",padding:"11px",borderRadius:11,border:"none",cursor:"pointer",
              background:T.surface,boxShadow:T.btn,color:T.t2,fontSize:12,fontWeight:500,
              display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            <span>🖨️</span> Imprimir comprobante
          </button>
        </div>
        <button onClick={onBack}
          style={{padding:"14px",borderRadius:12,border:"none",cursor:"pointer",
            background:`linear-gradient(135deg,${T.accent},${T.accent}CC)`,
            color:"#1C2130",fontSize:14,fontWeight:700,fontFamily:"DM Sans",
            boxShadow:`${T.btn},0 0 16px ${T.accent}40`,
            display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          <I d={ic.plus} s={16} c="#1C2130"/>Nueva venta
        </button>
        <div style={{height:20}}/>
      </div>
    </div>
  )
}

// ─── NOTIFICACIONES ───────────────────────────────────────────────
function Notificaciones({ T, onBack, notifs, setNotifs }) {
  const fmtCLP = n => new Intl.NumberFormat("es-CL",{style:"currency",currency:"CLP",maximumFractionDigits:0}).format(n)
  const [expandedId, setExpandedId] = useState(null)

  const unread  = notifs.filter(n => !n.read).length
  const markAll = () => setNotifs(list => list.map(x => ({...x, read:true})))
  const markOne = (id) => setNotifs(list => list.map(x => x.id===id ? {...x, read:true} : x))

  const typeIcon  = {stock:"📦", sale:"💰", expiry:"📅", debt:"💸", goal:"🎯",
                     system:"✅", customer:"👤", cierre:"🔒"}
  const typeColor = t =>
    t==="stock"||t==="debt" ? T.danger :
    t==="sale"              ? T.mint   :
    t==="goal"||t==="customer" ? T.accent : T.blue

  // Real notifs first (newest first), demo examples at the bottom
  const sorted = [
    ...notifs.filter(n => !n.isDemo).sort((a,b) => (b.ts||0)-(a.ts||0)),
    ...notifs.filter(n =>  n.isDemo),
  ]
  const real  = sorted.filter(n => !n.isDemo)
  const demos = sorted.filter(n =>  n.isDemo)

  const handleTap = (n) => {
    if (!n.read) {
      markOne(n.id)                                          // 1er tap → marcar leída
    } else if (n.detail) {
      setExpandedId(prev => prev === n.id ? null : n.id)    // 2do tap → expandir detalle
    }
  }

  const NotifCard = ({n, i}) => {
    const col      = typeColor(n.type)
    const expanded = expandedId === n.id && !!n.detail

    return (
      <motion.div key={n.id}
        initial={{opacity:0, x:-8}} animate={{opacity:1, x:0}}
        transition={{delay:i*0.05}}
        onClick={() => handleTap(n)}
        style={{
          background: T.surface,
          borderRadius: 14,
          boxShadow: T.card,
          cursor: "pointer",
          opacity: n.read && !expanded ? 0.65 : 1,
          borderLeft: n.read ? "none" : `3px solid ${col}`,
          overflow: "hidden",
        }}>

        {/* ── Fila principal (igual al diseño original) ─── */}
        <div style={{display:"flex", gap:10, alignItems:"flex-start",
          padding:"13px 16px"}}>
          <div style={{width:36, height:36, borderRadius:10, flexShrink:0,
            background:`${col}18`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:16}}>
            {n.read ? <span style={{color:T.mint, fontSize:15}}>✅</span>
                    : (typeIcon[n.type] || "🔔")}
          </div>
          <div style={{flex:1, minWidth:0}}>
            <div style={{display:"flex", justifyContent:"space-between",
              alignItems:"flex-start", marginBottom:3}}>
              <span style={{fontSize:13, fontWeight:n.read?500:700, color:T.t1,
                flex:1, marginRight:6}}>
                {n.title}
              </span>
              {!n.read && (
                <div style={{width:8, height:8, borderRadius:4,
                  background:col, flexShrink:0, marginTop:3}}/>
              )}
            </div>
            <div style={{fontSize:12, color:T.t2, lineHeight:1.4, marginBottom:4}}>
              {n.body}
            </div>
            <div style={{display:"flex", alignItems:"center", gap:8}}>
              <span style={{fontSize:10, color:T.t3}}>{n.time}</span>
              {n.isDemo && (
                <span style={{fontSize:9, color:T.t3, padding:"1px 6px",
                  borderRadius:8, background:T.border}}>ejemplo</span>
              )}
              {n.read && n.detail && (
                <span style={{fontSize:10, color:col, fontWeight:600}}>
                  {expanded ? "▲ ocultar" : "▼ ver detalle"}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Panel de detalle (solo si tiene datos) ──── */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{opacity:0, height:0}}
              animate={{opacity:1, height:"auto"}}
              exit={{opacity:0, height:0}}
              transition={{duration:0.2}}>
              <div style={{margin:"0 14px 14px", padding:"12px 14px",
                borderRadius:12, background:`${col}08`,
                border:`1px solid ${col}20`}}>

                {/* Total */}
                <div style={{display:"flex", justifyContent:"space-between",
                  alignItems:"center", paddingBottom:8, marginBottom:10,
                  borderBottom:`1px solid ${T.border}`}}>
                  <span style={{fontSize:12, fontWeight:600, color:T.t2}}>Total</span>
                  <span style={{fontSize:18, fontWeight:900, color:col,
                    fontFamily:"JetBrains Mono"}}>
                    {fmtCLP(n.detail.total)}
                  </span>
                </div>

                {/* Fecha · Hora · Método */}
                <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr",
                  gap:8, marginBottom:10}}>
                  {[
                    {l:"Fecha",  v:n.detail.fecha},
                    {l:"Hora",   v:n.detail.hora},
                    {l:"Método", v:n.detail.method},
                  ].map(r => (
                    <div key={r.l} style={{background:T.sunken, borderRadius:9,
                      padding:"7px 8px", boxShadow:T.inset}}>
                      <div style={{fontSize:9, color:T.t3, marginBottom:2,
                        textTransform:"uppercase", letterSpacing:"0.05em"}}>{r.l}</div>
                      <div style={{fontSize:11, fontWeight:700, color:T.t1}}>{r.v||"—"}</div>
                    </div>
                  ))}
                </div>

                {/* Cliente fiado */}
                {n.detail.client && (
                  <div style={{display:"flex", alignItems:"center", gap:8,
                    marginBottom:10, padding:"8px 10px", borderRadius:9,
                    background:`${T.danger}0A`, border:`1px solid ${T.danger}20`}}>
                    <span>👤</span>
                    <div>
                      <div style={{fontSize:10, color:T.t3}}>Fiado a</div>
                      <div style={{fontSize:12, fontWeight:700, color:T.danger}}>
                        {n.detail.client}
                      </div>
                    </div>
                  </div>
                )}

                {/* Productos */}
                {n.detail.items?.length > 0 && (
                  <div>
                    <div style={{fontSize:10, color:T.t3, marginBottom:6,
                      textTransform:"uppercase", letterSpacing:"0.05em"}}>
                      Productos
                    </div>
                    {n.detail.items.map((item, idx) => (
                      <div key={idx} style={{display:"flex", alignItems:"center",
                        gap:6, padding:"5px 0",
                        borderBottom: idx < n.detail.items.length-1
                          ? `1px solid ${T.border}` : "none"}}>
                        <div style={{width:5, height:5, borderRadius:3,
                          background:col, flexShrink:0}}/>
                        <span style={{fontSize:12, color:T.t2}}>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }

  return (
    <div style={{display:"flex", flexDirection:"column", height:"100%"}}>
      {/* Header */}
      <div style={{display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"16px", borderBottom:`1px solid ${T.border}`, flexShrink:0}}>
        <div style={{display:"flex", alignItems:"center", gap:12}}>
          <button onClick={onBack}
            style={{width:38, height:38, borderRadius:11, border:"none",
              cursor:"pointer", background:T.surface, boxShadow:T.btn,
              display:"flex", alignItems:"center", justifyContent:"center"}}>
            <I d={ic.back} s={16} c={T.t2}/>
          </button>
          <div>
            <div style={{fontSize:16, fontWeight:700, color:T.t1,
              fontFamily:"Bricolage Grotesque"}}>
              Notificaciones
            </div>
            {unread > 0
              ? <div style={{fontSize:11, color:T.danger}}>{unread} sin leer</div>
              : <div style={{fontSize:11, color:T.mint}}>✓ Todo leído</div>}
          </div>
        </div>
        {unread > 0 && (
          <button onClick={markAll}
            style={{padding:"8px 14px", borderRadius:10, border:"none",
              cursor:"pointer", background:T.surface, boxShadow:T.btn,
              color:T.t2, fontSize:11, fontWeight:600}}>
            Marcar todo leído
          </button>
        )}
      </div>

      {/* Lista */}
      <div style={{flex:1, overflowY:"auto", padding:"16px",
        display:"flex", flexDirection:"column", gap:14}}>

        {/* Recientes */}
        {real.length > 0 && (
          <div>
            {demos.length > 0 && (
              <div style={{fontSize:11, fontWeight:700, color:T.t3,
                textTransform:"uppercase", letterSpacing:"0.07em",
                marginBottom:10}}>
                Hoy y recientes
              </div>
            )}
            <div style={{display:"flex", flexDirection:"column", gap:8}}>
              {real.map((n,i) => <NotifCard key={n.id} n={n} i={i}/>)}
            </div>
          </div>
        )}

        {/* Demo / ejemplos */}
        {demos.length > 0 && (
          <div>
            <div style={{fontSize:11, fontWeight:700, color:T.t3,
              textTransform:"uppercase", letterSpacing:"0.07em",
              marginBottom:10}}>
              Anteriores
            </div>
            <div style={{display:"flex", flexDirection:"column", gap:8}}>
              {demos.map((n,i) => <NotifCard key={n.id} n={n} i={i}/>)}
            </div>
          </div>
        )}

        {notifs.length === 0 && (
          <div style={{textAlign:"center", padding:"50px 20px"}}>
            <div style={{fontSize:44, marginBottom:14}}>🔔</div>
            <div style={{fontSize:15, fontWeight:600, color:T.t1, marginBottom:6}}>
              Sin notificaciones
            </div>
            <div style={{fontSize:12, color:T.t3}}>
              Las actividades aparecerán aquí automáticamente
            </div>
          </div>
        )}

        <div style={{height:20}}/>
      </div>
    </div>
  )
}

function Vencimientos({ T, onBack }) {
  const [filter,setFilter]=useState("todos")
  const [prods,setProds]=useState([
    {id:1,sku:"LAC-YOGU-001",n:"Yogurt Frutilla 200g",cat:"Lácteos",  stock:15,vence:"20 Mar 26",dias:-7,  st:"expired"},
    {id:2,sku:"PAN-PANM-001",n:"Pan Molde Grande",    cat:"Panadería",stock:2, vence:"29 Mar 26",dias:2,   st:"critical"},
    {id:3,sku:"LAC-LECH-001",n:"Leche Entera 1L",     cat:"Lácteos",  stock:8, vence:"01 Abr 26",dias:5,   st:"critical"},
    {id:4,sku:"LAC-QUES-001",n:"Queso Gouda 250g",    cat:"Lácteos",  stock:3, vence:"04 Abr 26",dias:8,   st:"warning"},
    {id:5,sku:"SNA-GALL-001",n:"Galletas Oreo 154g",  cat:"Snacks",   stock:20,vence:"15 Jun 26",dias:87,  st:"ok"},
  ])
  const stCfg={
    expired: {l:"💀 Vencido",     c:T.danger,bg:`${T.danger}18`,br:`${T.danger}30`},
    critical:{l:"🔴 Esta semana", c:T.danger,bg:`${T.danger}10`,br:`${T.danger}20`},
    warning: {l:"🟠 Este mes",    c:T.accent,bg:`${T.accent}10`,br:`${T.accent}20`},
    ok:      {l:"✅ OK",          c:T.mint,  bg:`${T.mint}10`,  br:`${T.mint}20`},
  }
  const counts={
    expired: prods.filter(p=>p.st==="expired").length,
    critical:prods.filter(p=>p.st==="critical").length,
    warning: prods.filter(p=>p.st==="warning").length,
    ok:      prods.filter(p=>p.st==="ok").length,
  }
  const filtered=filter==="todos"?prods:prods.filter(p=>p.st===filter)
  const darBaja=(id)=>setProds(ps=>ps.filter(p=>p.id!==id))
  const liquidar=(id)=>setProds(ps=>ps.map(p=>p.id===id?{...p,stock:0,st:"expired"}:p))

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
        padding:"16px",borderBottom:`1px solid ${T.border}`,flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <button onClick={onBack} style={{width:38,height:38,borderRadius:11,border:"none",cursor:"pointer",
            background:T.surface,boxShadow:T.btn,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <I d={ic.back} s={16} c={T.t2}/>
          </button>
          <div>
            <div style={{fontSize:16,fontWeight:700,color:T.t1,fontFamily:"Bricolage Grotesque"}}>Vencimientos</div>
            <div style={{fontSize:11,color:T.danger}}>{counts.expired} vencidos · {counts.critical} urgentes</div>
          </div>
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"16px",display:"flex",flexDirection:"column",gap:12}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
          {[{l:"Vencidos",v:counts.expired,c:T.danger,f:"expired"},{l:"Urgente",v:counts.critical,c:T.danger,f:"critical"},
            {l:"Este mes",v:counts.warning,c:T.accent,f:"warning"},{l:"OK",v:counts.ok,c:T.mint,f:"ok"}].map(s=>(
            <button key={s.l} onClick={()=>setFilter(s.f)}
              style={{background:filter===s.f?`${s.c}18`:T.surface,borderRadius:12,padding:"10px 6px",
                border:"none",cursor:"pointer",textAlign:"center",
                outline:filter===s.f?`1.5px solid ${s.c}40`:"none",
                boxShadow:filter===s.f?T.press:T.card}}>
              <div style={{fontSize:22,fontWeight:900,color:s.c,fontFamily:"JetBrains Mono"}}>{s.v}</div>
              <div style={{fontSize:10,color:T.t3,marginTop:2}}>{s.l}</div>
            </button>
          ))}
        </div>
        <div style={{display:"flex",gap:8}}>
          {["todos","expired","critical","warning","ok"].map((f,i)=>(
            <button key={f} onClick={()=>setFilter(f)}
              style={{padding:"7px 12px",borderRadius:20,border:"none",cursor:"pointer",
                fontSize:11,fontWeight:filter===f?700:400,
                background:filter===f?`${T.accent}20`:T.surface,
                color:filter===f?T.accent:T.t3,
                outline:filter===f?`1.5px solid ${T.accent}40`:"none",
                boxShadow:filter===f?T.press:T.btn}}>
              {f==="todos"?"Todos":stCfg[f]?.l||f}
            </button>
          ))}
        </div>
        {filtered.map((p,i)=>{
          const s=stCfg[p.st]
          return (
            <div key={p.id} style={{background:T.surface,borderRadius:14,padding:"14px 16px",
              boxShadow:T.card,border:`1px solid ${s.br}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:700,color:T.t1,marginBottom:2}}>{p.n}</div>
                  <div style={{fontSize:10,color:T.t3,fontFamily:"monospace"}}>{p.sku} · {p.cat}</div>
                </div>
                <span style={{fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:20,
                  background:s.bg,color:s.c,flexShrink:0,marginLeft:8}}>{s.l}</span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:12}}>
                {[{l:"VENCE",v:p.vence,c:s.c},{l:"DÍAS",v:p.dias<0?p.dias:`+${p.dias}`,c:s.c},
                  {l:"STOCK",v:`${p.stock}u`,c:T.t1}].map(m=>(
                  <div key={m.l} style={{background:T.sunken,borderRadius:10,padding:"8px 10px",boxShadow:T.inset}}>
                    <div style={{fontSize:9,color:T.t3,marginBottom:3}}>{m.l}</div>
                    <div style={{fontSize:14,fontWeight:800,color:m.c,fontFamily:"JetBrains Mono"}}>{m.v}</div>
                  </div>
                ))}
              </div>
              {(p.st==="expired"||p.st==="critical")&&(
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>darBaja(p.id)}
                    style={{flex:1,padding:"9px",borderRadius:10,border:"none",cursor:"pointer",
                      background:`${T.danger}15`,color:T.danger,fontSize:12,fontWeight:600}}>
                    🗑️ Dar de baja
                  </button>
                  <button onClick={()=>liquidar(p.id)}
                    style={{flex:1,padding:"9px",borderRadius:10,border:"none",cursor:"pointer",
                      background:`linear-gradient(135deg,${T.accent},${T.accent}CC)`,
                      color:"#1C2130",fontSize:12,fontWeight:700}}>
                    💸 Liquidar
                  </button>
                </div>
              )}
            </div>
          )
        })}
        <div style={{height:20}}/>
      </div>
    </div>
  )
}

// ─── NUEVO FIADO ──────────────────────────────────────────────────
function NuevoFiado({ T, onBack, onStockUpdate, onDeudaAdd, onContactAdd, stockList:prodList, contactList:globalContacts }) {
  // Clientes vienen del estado global — se sincronizan automáticamente
  const FALLBACK_CLIENTES = [
    {id:1,n:"Pedro Soto",    ph:"+56 9 1234 5678"},
    {id:2,n:"María González",ph:"+56 9 8765 4321"},
    {id:3,n:"Carlos Ruiz",   ph:"+56 9 5555 1234"},
    {id:4,n:"Ana Torres",    ph:"+56 9 4444 5678"},
  ]
  const baseClientes = globalContacts
    ? globalContacts.filter(c=>c.type==="customer").map(c=>({id:c.id,n:c.name,ph:c.phone||"",email:c.email||"",telegram:c.telegram||""}))
    : FALLBACK_CLIENTES
  const [extraClientes, setExtraClientes] = useState([])  // clientes nuevos creados en esta sesión
  const clientes = [...baseClientes, ...extraClientes.filter(nc=>!baseClientes.find(b=>b.id===nc.id))]
  const [step,setStep]=useState("cliente")
  const [client,setClient]=useState(null)
  const [showNewClient,setShowNewClient]=useState(false)
  const [newName,  setNewName]  = useState("")
  const [newPhone, setNewPhone] = useState("")
  const [newTelegram,setNewTelegram] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [items,setItems]=useState([])
  const [dueDate,setDueDate]=useState("")
  const [saved,setSaved]=useState(false)
  const [stockFiadoAlert,setStockFiadoAlert]=useState(null)

  const fmtCLP=n=>new Intl.NumberFormat("es-CL",{style:"currency",currency:"CLP",maximumFractionDigits:0}).format(n)
  const FALLBACK_PRODS=[
    {id:1,n:"Coca-Cola 2L",p:1490,s:45},{id:2,n:"Pan Molde",p:1890,s:4},
    {id:3,n:"Leche 1L",p:1250,s:8},{id:4,n:"Yogurt 200g",p:1060,s:15},
    {id:5,n:"Sprite 1.5L",p:1100,s:20},{id:6,n:"Det. Omo 1kg",p:4200,s:6},
  ]
  const productos=(prodList||FALLBACK_PRODS).map(p=>({id:p.id||p.sku,n:p.n,p:p.p,s:p.s||0}))
  const total=(Array.isArray(items)?items:[]).reduce((s,i)=>s+(i.p||0)*(i.q||1),0)

  const agregarCliente=()=>{
    if(!newName.trim()) return
    const newId = Date.now()
    const now   = new Date().toLocaleDateString("es-CL",{month:"short",year:"numeric"})
    const nowFull = new Date().toLocaleDateString("es-CL")
    // Cliente para la lista local del fiado (campo n)
    const nc={id:newId, n:newName.trim(), ph:newPhone, telegram:newTelegram, email:newEmail}
    setExtraClientes(cs=>[...cs,nc])
    setClient(nc)
    // Guardar en contactList global (campo name)
    if(onContactAdd) onContactAdd({
      id:newId, name:newName.trim(), type:"customer",
      phone:newPhone, email:newEmail, telegram:newTelegram||"", notes:"",
      balance:0, purchases:0, points:0, segment:"occasional",
      joined:now,
      activity:[{date:nowFull, text:"Cliente creado desde Registrar Fiado"}]
    })
    setNewName(""); setNewPhone(""); setNewTelegram(""); setNewEmail("")
    setShowNewClient(false)
  }

  const toggleProd=(prod)=>{
    setItems(prev=>{
      const ex=prev.find(i=>i.id===prod.id)
      if(ex) return prev.filter(i=>i.id!==prod.id)
      if((prod.s||0)===0){
        setStockFiadoAlert({name:prod.n,stock:0})
        setTimeout(()=>setStockFiadoAlert(null),2500)
        return prev
      }
      return [...prev,{...prod,q:1}]
    })
  }
  const changeQty=(id,delta)=>{
    setItems(prev=>{
      return prev.map(i=>{
        if(i.id!==id) return i
        const maxStock = i.s || 999
        if(delta>0 && i.q>=maxStock){
          setStockFiadoAlert({name:i.n, stock:maxStock})
          setTimeout(()=>setStockFiadoAlert(null),2500)
          return i  // no aumentar
        }
        return {...i,q:Math.max(1,i.q+delta)}
      })
    })
  }

  const confirmar=()=>{
    if(!client||total<=0) return
    // 1. Descontar stock
    if(onStockUpdate) {
      onStockUpdate(items.map(i=>({id:i.id, name:i.n, qty:i.q})))
    }
    // 2. Agregar deuda al cliente en lista de fiados
    if(onDeudaAdd) {
      onDeudaAdd({
        name:    client.n,
        phone:   client.ph||"",
        amount:  total,
        itemsList: items.map(i=>i.n),  // string[] de nombres
        dueDate: dueDate||null,
      })
    }
    setSaved(true)
    setTimeout(()=>{ setSaved(false); onBack() },1500)
  }

  if(saved) return (
    <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,padding:32}}>
      <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:"spring",damping:12}}
        style={{width:72,height:72,borderRadius:36,background:`linear-gradient(135deg,${T.mint},${T.mint}CC)`,
          boxShadow:`0 0 28px ${T.mint}50`,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <I d={ic.check} s={32} c="#fff"/>
      </motion.div>
      <div style={{fontSize:20,fontWeight:800,color:T.t1,fontFamily:"Bricolage Grotesque"}}>¡Fiado registrado!</div>
      <div style={{fontSize:13,color:T.t3}}>Se descontó el stock y se registró la deuda.</div>
    </div>
  )

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{display:"flex",alignItems:"center",gap:12,padding:"16px",
        borderBottom:`1px solid ${T.border}`,flexShrink:0}}>
        <button onClick={onBack} style={{width:38,height:38,borderRadius:11,border:"none",cursor:"pointer",
          background:T.surface,boxShadow:T.btn,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <I d={ic.back} s={16} c={T.t2}/>
        </button>
        <div style={{fontSize:16,fontWeight:700,color:T.t1,fontFamily:"Bricolage Grotesque"}}>Registrar fiado</div>
      </div>
      <div style={{display:"flex",padding:"0 16px",borderBottom:`1px solid ${T.border}`,flexShrink:0}}>
        {[{id:"cliente",l:"1. Cliente"},{id:"productos",l:"2. Productos"},{id:"confirmar",l:"3. Confirmar"}].map(s=>(
          <button key={s.id} onClick={()=>client&&setStep(s.id)}
            style={{flex:1,padding:"12px 4px",border:"none",cursor:client?"pointer":"default",
              background:"transparent",fontSize:12,fontWeight:step===s.id?700:400,
              color:step===s.id?T.accent:T.t3,
              borderBottom:step===s.id?`2px solid ${T.accent}`:"2px solid transparent"}}>
            {s.l}
          </button>
        ))}
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"16px",display:"flex",flexDirection:"column",gap:10}}>

        {step==="cliente"&&(
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <div style={{fontSize:12,color:T.t3,marginBottom:6}}>Selecciona o crea un cliente:</div>
            {/* Buscador de clientes */}
            <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",
              borderRadius:14,background:T.surface,boxShadow:T.inset,marginBottom:4}}>
              <I d={ic.search} s={14} c={T.t3}/>
              <input
                placeholder="Buscar cliente por nombre..."
                onChange={e=>{
                  const q=e.target.value.toLowerCase()
                  // Filter visually via ref — inline filter without extra state
                  document.querySelectorAll('[data-cliente-btn]').forEach(el=>{
                    el.style.display=el.dataset.clienteName.toLowerCase().includes(q)?'':'none'
                  })
                }}
                style={{flex:1,border:"none",background:"transparent",color:T.t1,
                  fontSize:13,fontFamily:"DM Sans",outline:"none",caretColor:T.accent}}/>
            </div>
            {clientes.map(c=>(
              <button key={c.id}
                data-cliente-btn data-cliente-name={c.n}
                onClick={()=>{setClient(c);setStep("productos")}}
                style={{padding:"14px 16px",borderRadius:14,border:"none",cursor:"pointer",
                  textAlign:"left",background:client?.id===c.id?`${T.accent}18`:T.surface,
                  color:client?.id===c.id?T.accent:T.t1,fontSize:14,fontWeight:client?.id===c.id?700:400,
                  boxShadow:client?.id===c.id?T.press:T.btn,
                  outline:client?.id===c.id?`1.5px solid ${T.accent}40`:"none",
                  display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div>{c.n}</div>
                  <div style={{fontSize:11,color:T.t3,marginTop:2}}>{c.ph}</div>
                </div>
                {client?.id===c.id&&<I d={ic.check} s={16} c={T.accent}/>}
              </button>
            ))}
            <button onClick={()=>setShowNewClient(true)}
              style={{padding:"14px 16px",borderRadius:14,border:`1.5px dashed ${T.accent}40`,
                cursor:"pointer",background:`${T.accent}08`,color:T.accent,fontSize:13,fontWeight:600,
                display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              <I d={ic.plus} s={15} c={T.accent}/>+ Nuevo cliente
            </button>
          </div>
        )}

        {step==="productos"&&(
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <div style={{fontSize:12,color:T.t3}}>Productos para {client?.n}:</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {productos.map(p=>{
                const inCart=items.find(i=>i.id===p.id)
                return (
                  <button key={p.id}
                    onClick={()=>p.s===0?null:toggleProd(p)}
                    style={{padding:"12px",borderRadius:14,border:"none",
                      cursor:p.s===0?"not-allowed":"pointer",
                      background:p.s===0?T.sunken:inCart?`${T.accent}18`:T.surface,
                      boxShadow:inCart?T.press:T.btn,
                      outline:inCart?`1.5px solid ${T.accent}40`:"none",
                      opacity:p.s===0?0.5:1,
                      textAlign:"left"}}>
                    <div style={{fontSize:13,fontWeight:600,color:T.t1,marginBottom:4}}>{p.n}</div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
                      <div style={{fontSize:13,fontWeight:700,color:T.accent,fontFamily:"JetBrains Mono"}}>
                        {fmtCLP(p.p)}
                      </div>
                      <span style={{fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:8,
                        background:p.s===0?`${T.danger}20`:p.s<=3?`${T.accent}20`:`${T.mint}15`,
                        color:p.s===0?T.danger:p.s<=3?T.accent:T.mint}}>
                        {p.s===0?"Agotado":`${p.s}u`}
                      </span>
                    </div>
                    {inCart&&(
                      <div style={{fontSize:10,color:T.mint,display:"flex",alignItems:"center",gap:4}}>
                        ✓ {inCart.q}/{p.s} unid.
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
            {items.length>0&&(
              <div style={{background:`${T.accent}0C`,border:`1px solid ${T.accent}20`,
                borderRadius:14,padding:"12px 14px"}}>
                {items.map(item=>(
                  <div key={item.id} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                    <span style={{flex:1,fontSize:12,color:T.t1}}>{item.n}</span>
                    <button onClick={()=>changeQty(item.id,-1)}
                      style={{width:36,height:36,borderRadius:10,border:"none",cursor:"pointer",
                        background:T.sunken,boxShadow:T.inset,color:T.t2,fontSize:20,fontWeight:700,
                        display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                    <span style={{fontSize:16,fontWeight:800,color:T.t1,width:28,textAlign:"center",
                      fontFamily:"JetBrains Mono"}}>{item.q}</span>
                    <button onClick={()=>changeQty(item.id,1)}
                      style={{width:36,height:36,borderRadius:10,border:"none",cursor:"pointer",
                        background:`${T.accent}25`,boxShadow:T.btn,color:T.accent,fontSize:20,fontWeight:700,
                        display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                    <span style={{fontSize:12,fontWeight:700,color:T.accent,fontFamily:"JetBrains Mono",minWidth:54,textAlign:"right"}}>
                      {fmtCLP(item.p*item.q)}
                    </span>
                  </div>
                ))}
                <div style={{borderTop:`1px solid ${T.border}`,paddingTop:8,
                  display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:14,fontWeight:700,color:T.t1}}>Total fiado</span>
                  <span style={{fontSize:20,fontWeight:900,color:T.accent,fontFamily:"JetBrains Mono"}}>{fmtCLP(total)}</span>
                </div>
              </div>
            )}
            <div>
              <div style={{fontSize:11,color:T.t3,marginBottom:8}}>📅 Fecha de pago (opcional)</div>
              <input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)}
                style={{width:"100%",padding:"12px 14px",borderRadius:12,border:"none",
                  background:T.surface,boxShadow:T.inset,color:T.t1,fontSize:14,
                  outline:"none",caretColor:T.accent,boxSizing:"border-box"}}/>
            </div>
            <button onClick={()=>total>0&&setStep("confirmar")}
              style={{padding:"13px",borderRadius:12,border:"none",
                cursor:total>0?"pointer":"not-allowed",
                background:total>0?`linear-gradient(135deg,${T.accent},${T.accent}CC)`:"rgba(255,255,255,0.08)",
                color:total>0?"#1C2130":T.t3,fontSize:14,fontWeight:700,fontFamily:"DM Sans",
                display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              {total>0?`Revisar fiado ${fmtCLP(total)} →`:"Agrega productos"}
            </button>
          </div>
        )}

        {step==="confirmar"&&(
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{background:`${T.accent}0C`,border:`1px solid ${T.accent}25`,
              borderRadius:18,padding:"20px",textAlign:"center"}}>
              <div style={{fontSize:14,color:T.t3,marginBottom:4}}>Fiado para</div>
              <div style={{fontSize:20,fontWeight:800,color:T.t1,fontFamily:"Bricolage Grotesque",marginBottom:8}}>
                {client?.n}
              </div>
              <div style={{fontSize:32,fontWeight:900,color:T.accent,fontFamily:"JetBrains Mono"}}>
                {fmtCLP(total)}
              </div>
              {dueDate&&<div style={{fontSize:12,color:T.t3,marginTop:8}}>
                📅 Pago: {new Date(dueDate+"T12:00:00").toLocaleDateString("es-CL")}
              </div>}
            </div>
            <div style={{background:T.surface,borderRadius:14,padding:"12px 14px",boxShadow:T.card}}>
              {items.map(item=>(
                <div key={item.id} style={{display:"flex",justifyContent:"space-between",
                  padding:"6px 0",borderBottom:`1px solid ${T.border}`}}>
                  <span style={{fontSize:13,color:T.t2}}>{item.n} × {item.q}</span>
                  <span style={{fontSize:13,fontWeight:700,color:T.t1,fontFamily:"JetBrains Mono"}}>
                    {fmtCLP(item.p*item.q)}
                  </span>
                </div>
              ))}
            </div>
            <button onClick={confirmar}
              style={{padding:"14px",borderRadius:12,border:"none",cursor:"pointer",
                background:`linear-gradient(135deg,${T.accent},${T.accent}CC)`,
                color:"#1C2130",fontSize:14,fontWeight:700,fontFamily:"DM Sans",
                boxShadow:`${T.btn},0 0 16px ${T.accent}40`,
                display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              <I d={ic.check} s={16} c="#1C2130"/>Confirmar fiado
            </button>
          </div>
        )}
        <div style={{height:20}}/>
      </div>

      {/* Sheet nuevo cliente */}
      <AnimatePresence>
        {showNewClient&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",
              display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:200}}
            onClick={e=>e.target===e.currentTarget&&setShowNewClient(false)}>
            <motion.div initial={{y:"100%"}} animate={{y:0}} exit={{y:"100%"}}
              transition={{type:"spring",damping:30,stiffness:350}}
              style={{width:"100%",maxWidth:480,background:T.surface,
                borderRadius:"24px 24px 0 0",padding:"20px 20px 40px",
                boxShadow:"0 -8px 40px rgba(0,0,0,0.5)"}}>
              <div style={{width:40,height:5,borderRadius:3,background:"rgba(255,255,255,0.15)",margin:"0 auto 16px"}}/>
              <div style={{fontSize:16,fontWeight:700,color:T.t1,fontFamily:"Bricolage Grotesque",marginBottom:16}}>
                ➕ Nuevo cliente
              </div>
              <div style={{fontSize:11,color:T.t3,marginBottom:7}}>Nombre completo *</div>
              <input value={newName} onChange={e=>setNewName(e.target.value)}
                placeholder="Ej: Roberto García" autoFocus autoFocus
                style={{width:"100%",padding:"13px 16px",borderRadius:14,border:"none",
                  background:T.bg,boxShadow:T.inset,color:T.t1,fontSize:15,
                  fontFamily:"DM Sans",outline:"none",caretColor:T.accent,boxSizing:"border-box",marginBottom:12}}/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
                {/* Teléfono */}
                <div>
                  <div style={{fontSize:11,color:T.t3,marginBottom:7,fontWeight:600}}>📞 Teléfono</div>
                  <input value={newPhone} onChange={e=>setNewPhone(e.target.value)}
                    placeholder="+56 9 XXXX XXXX" inputMode="tel"
                    style={{width:"100%",padding:"12px 14px",borderRadius:12,border:"none",
                      background:T.bg,boxShadow:T.inset,color:T.t1,fontSize:13,
                      fontFamily:"DM Sans",outline:"none",caretColor:T.accent,boxSizing:"border-box"}}/>
                </div>
                {/* Telegram */}
                <div>
                  <div style={{fontSize:11,color:T.t3,marginBottom:7,fontWeight:600}}>✈️ Telegram</div>
                  <input value={newTelegram} onChange={e=>setNewTelegram(e.target.value)}
                    placeholder="@usuario"
                    style={{width:"100%",padding:"12px 14px",borderRadius:12,border:"none",
                      background:T.bg,boxShadow:T.inset,color:T.t1,fontSize:13,
                      fontFamily:"DM Sans",outline:"none",caretColor:T.accent,boxSizing:"border-box"}}/>
                </div>
              </div>
              {/* Email */}
              <div style={{marginBottom:16}}>
                <div style={{fontSize:11,color:T.t3,marginBottom:7,fontWeight:600}}>📧 Correo electrónico</div>
                <input value={newEmail} onChange={e=>setNewEmail(e.target.value)}
                  placeholder="correo@ejemplo.com" type="email"
                  style={{width:"100%",padding:"12px 14px",borderRadius:12,border:"none",
                    background:T.bg,boxShadow:T.inset,color:T.t1,fontSize:13,
                    fontFamily:"DM Sans",outline:"none",caretColor:T.accent,boxSizing:"border-box"}}/>
              </div>
              <div style={{display:"flex",gap:10}}>
                <button onClick={()=>setShowNewClient(false)}
                  style={{flex:1,padding:"13px",borderRadius:12,border:"none",cursor:"pointer",
                    background:T.surface,color:T.t2,fontSize:13,fontWeight:600,boxShadow:T.btn}}>
                  Cancelar
                </button>
                <button onClick={agregarCliente}
                  style={{flex:2,padding:"13px",borderRadius:12,border:"none",
                    cursor:newName?"pointer":"not-allowed",
                    background:newName?`linear-gradient(135deg,${T.accent},${T.accent}CC)`:"rgba(255,255,255,0.08)",
                    color:newName?"#1C2130":T.t3,fontSize:13,fontWeight:700,
                    display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                  <I d={ic.check} s={14} c={newName?"#1C2130":T.t3}/>
                  Agregar y seleccionar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Toast stock insuficiente fiado */}
      <AnimatePresence>
        {stockFiadoAlert && (
          <motion.div
            initial={{opacity:0,y:30,scale:0.95}}
            animate={{opacity:1,y:0,scale:1}}
            exit={{opacity:0,y:30,scale:0.95}}
            style={{position:"fixed",bottom:100,left:16,right:16,maxWidth:448,
              margin:"0 auto",
              zIndex:300,
              background:`linear-gradient(135deg,#ff4d6d,#c9184a)`,
              borderRadius:16,padding:"13px 16px",
              boxShadow:"0 8px 28px rgba(255,77,109,0.5)",
              display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:22}}>⚠️</span>
            <div>
              <div style={{fontSize:13,fontWeight:700,color:"#fff"}}>
                {stockFiadoAlert.stock===0 ? "Producto agotado" : "Stock insuficiente"}
              </div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.9)"}}>
                {stockFiadoAlert.name}: {stockFiadoAlert.stock===0
                  ? "no hay unidades disponibles"
                  : `máximo ${stockFiadoAlert.stock} unidad${stockFiadoAlert.stock!==1?"es":""}`}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── DELIVERY ─────────────────────────────────────────────────────
function Delivery({ T, onBack }) {
  const [tab,setTab]=useState("activos")
  const [pedidos,setPedidos]=useState([
    {id:"DEL-018",client:"Rosa Martínez",addr:"Los Pinos 234, Dto 5B",time:"16:00",
     total:5400,status:"preparando",phone:"+56 9 8765 4321",
     items:["Leche 1L × 2","Pan molde × 1","Arroz 1kg × 1"],notes:"Timbre no funciona, llamar"},
    {id:"DEL-017",client:"Jorge Soto",addr:"Av. Central 890",time:"15:30",
     total:12800,status:"en_camino",phone:"+56 9 5555 6666",
     items:["Coca-Cola 2L × 4","Yogurt × 3"],notes:""},
    {id:"DEL-016",client:"Carmen López",addr:"Calle 5 Norte 123",time:"14:00",
     total:3200,status:"entregado",phone:"+56 9 3333 4444",
     items:["Pan molde × 2","Mantequilla × 1"],notes:""},
  ])
  const [showNew,setShowNew]=useState(false)
  const [nClient,setNClient]=useState("")
  const [nAddr,setNAddr]=useState("")
  const [nPhone,setNPhone]=useState("")
  const [nTime,setNTime]=useState("")
  const fmtCLP=n=>new Intl.NumberFormat("es-CL",{style:"currency",currency:"CLP",maximumFractionDigits:0}).format(n)
  const stMap={
    preparando:{l:"🔧 Preparando",c:T.accent,bg:`${T.accent}18`},
    en_camino: {l:"🚴 En camino", c:T.blue,  bg:`${T.blue}18`},
    entregado: {l:"✅ Entregado", c:T.mint,  bg:`${T.mint}18`},
  }
  const nextSt={preparando:"en_camino",en_camino:"entregado"}
  const nextLbl={preparando:"🚴 Marcar en camino",en_camino:"✅ Marcar entregado"}
  const avanzar=(id)=>setPedidos(ps=>ps.map(p=>p.id===id?{...p,status:nextSt[p.status]||p.status}:p))
  const crearPedido=()=>{
    if(!nClient) return
    setPedidos(ps=>[{id:`DEL-${String(ps.length+19).padStart(3,"0")}`,
      client:nClient,addr:nAddr,time:nTime||"Por acordar",total:0,
      status:"preparando",phone:nPhone,items:["Productos por definir"],notes:""},...ps])
    setNClient(""); setNAddr(""); setNPhone(""); setNTime(""); setShowNew(false)
  }
  const activos=pedidos.filter(p=>p.status!=="entregado")
  const historial=pedidos.filter(p=>p.status==="entregado")
  const lista=tab==="activos"?activos:historial
  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
        padding:"16px",borderBottom:`1px solid ${T.border}`,flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <button onClick={onBack} style={{width:38,height:38,borderRadius:11,border:"none",cursor:"pointer",
            background:T.surface,boxShadow:T.btn,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <I d={ic.back} s={16} c={T.t2}/>
          </button>
          <div style={{fontSize:16,fontWeight:700,color:T.t1,fontFamily:"Bricolage Grotesque"}}>Delivery 🚴</div>
        </div>
        <button onClick={()=>setShowNew(true)} style={{padding:"9px 16px",borderRadius:10,border:"none",cursor:"pointer",
          background:`linear-gradient(135deg,${T.accent},${T.accent}CC)`,color:"#1C2130",fontSize:12,fontWeight:700,
          display:"flex",alignItems:"center",gap:6}}>
          <I d={ic.plus} s={14} c="#1C2130"/>Nuevo
        </button>
      </div>
      <div style={{display:"flex",padding:"0 16px",borderBottom:`1px solid ${T.border}`,flexShrink:0}}>
        {[{id:"activos",l:`Activos (${activos.length})`},{id:"historial",l:"Historial"}].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            style={{flex:1,padding:"13px 4px",border:"none",cursor:"pointer",background:"transparent",
              fontSize:13,fontWeight:tab===t.id?700:400,color:tab===t.id?T.accent:T.t3,
              borderBottom:tab===t.id?`2px solid ${T.accent}`:"2px solid transparent"}}>
            {t.l}
          </button>
        ))}
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"16px",display:"flex",flexDirection:"column",gap:10}}>
        {lista.map((p,i)=>{
          const s=stMap[p.status]
          return (
            <div key={p.id} style={{background:T.surface,borderRadius:14,padding:"14px 16px",
              boxShadow:T.card,border:`1px solid ${s.c}18`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                    <span style={{fontSize:14,fontWeight:700,color:T.t1}}>{p.client}</span>
                    <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20,
                      background:s.bg,color:s.c}}>{s.l}</span>
                  </div>
                  <div style={{fontSize:10,color:T.t3,fontFamily:"JetBrains Mono"}}>{p.id} · {p.time}</div>
                </div>
                <div style={{fontSize:16,fontWeight:900,color:T.accent,fontFamily:"JetBrains Mono",flexShrink:0}}>
                  {fmtCLP(p.total)}
                </div>
              </div>
              <div style={{background:T.sunken,borderRadius:10,padding:"9px 12px",boxShadow:T.inset,marginBottom:10}}>
                <div style={{fontSize:12,color:T.t2}}>📍 {p.addr}</div>
                {p.notes&&<div style={{fontSize:11,color:T.accent,marginTop:3}}>⚠️ {p.notes}</div>}
              </div>
              {p.items.map(item=>(
                <div key={item} style={{display:"flex",alignItems:"center",gap:6,
                  padding:"4px 0",borderBottom:`1px solid ${T.border}`}}>
                  <div style={{width:5,height:5,borderRadius:3,background:T.accent,flexShrink:0}}/>
                  <span style={{fontSize:12,color:T.t2}}>{item}</span>
                </div>
              ))}
              <div style={{display:"flex",gap:8,marginTop:10}}>
                {p.status!=="entregado"&&(
                  <button onClick={()=>avanzar(p.id)}
                    style={{flex:1,padding:"9px",borderRadius:10,border:"none",cursor:"pointer",
                      background:`linear-gradient(135deg,${T.accent},${T.accent}CC)`,
                      color:"#1C2130",fontSize:12,fontWeight:700}}>
                    {nextLbl[p.status]}
                  </button>
                )}
                <button onClick={()=>onOpenScreen("ordenes")}
                  style={{padding:"9px 14px",borderRadius:10,border:"none",cursor:"pointer",
                  background:T.surface,boxShadow:T.btn,color:T.t2,fontSize:12,fontWeight:600,flexShrink:0}}>
                  📲 {p.phone.slice(-8)}
                </button>
              </div>
            </div>
          )
        })}
        <div style={{height:20}}/>
      </div>
      <AnimatePresence>
        {showNew&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.65)",
              display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:200}}
            onClick={e=>e.target===e.currentTarget&&setShowNew(false)}>
            <motion.div initial={{y:"100%"}} animate={{y:0}} exit={{y:"100%"}}
              transition={{type:"spring",damping:30,stiffness:350}}
              style={{width:"100%",maxWidth:480,background:T.surface,
                borderRadius:"24px 24px 0 0",padding:"20px 20px 40px",boxShadow:"0 -8px 40px rgba(0,0,0,0.5)"}}>
              <div style={{width:40,height:5,borderRadius:3,background:"rgba(255,255,255,0.15)",margin:"0 auto 16px"}}/>
              <div style={{fontSize:16,fontWeight:700,color:T.t1,fontFamily:"Bricolage Grotesque",marginBottom:14}}>
                Nuevo pedido delivery
              </div>
              {[{l:"Cliente *",v:nClient,set:setNClient,p:"Nombre del cliente..."},{l:"Dirección",v:nAddr,set:setNAddr,p:"Calle, número, dpto..."},
                {l:"Teléfono",v:nPhone,set:setNPhone,p:"+56 9 XXXX XXXX"},{l:"Hora de entrega",v:nTime,set:setNTime,p:"Ej: 16:00"}].map(f=>(
                <div key={f.l} style={{marginBottom:10}}>
                  <div style={{fontSize:11,color:T.t3,marginBottom:6}}>{f.l}</div>
                  <input value={f.v} onChange={e=>f.set(e.target.value)} placeholder={f.p}
                    style={{width:"100%",padding:"12px 14px",borderRadius:12,border:"none",
                      background:T.bg,boxShadow:T.inset,color:T.t1,fontSize:14,
                      fontFamily:"DM Sans",outline:"none",caretColor:T.accent,boxSizing:"border-box"}}/>
                </div>
              ))}
              <div style={{display:"flex",gap:10,marginTop:14}}>
                <button onClick={()=>setShowNew(false)} style={{flex:1,padding:"12px",borderRadius:12,
                  border:"none",cursor:"pointer",background:T.surface,color:T.t2,fontSize:13,fontWeight:600,boxShadow:T.btn}}>
                  Cancelar
                </button>
                <button onClick={crearPedido} style={{flex:2,padding:"12px",borderRadius:12,border:"none",
                  cursor:nClient?"pointer":"not-allowed",
                  background:nClient?`linear-gradient(135deg,${T.accent},${T.accent}CC)`:"rgba(255,255,255,0.08)",
                  color:nClient?"#1C2130":T.t3,fontSize:13,fontWeight:700,
                  display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                  <I d={ic.check} s={14} c={nClient?"#1C2130":T.t3}/>Crear pedido
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── PRESUPUESTOS ─────────────────────────────────────────────────
function Presupuestos({ T, onBack }) {
  const [showNew,setShowNew]=useState(false)
  const [cotizaciones,setCotizaciones]=useState([
    {id:"COT-008",client:"Empresa XYZ Ltda.",date:"27 Mar",valid:"03 Abr",total:71071,status:"enviada",
     items:[{n:"Agua mineral 500ml × 48",sub:19440},{n:"Jugo natural 1L × 24",sub:19224},{n:"Snacks variados × 36",sub:21060}]},
    {id:"COT-007",client:"Club Deportivo Norte",date:"22 Mar",valid:"29 Mar",total:45200,status:"aceptada",
     items:[{n:"Bebidas gaseosas × 60",sub:28800},{n:"Agua 500ml × 48",sub:16400}]},
  ])
  const [nClient,setNClient]=useState("")
  const [nValid,setNValid]=useState("")
  const [nNota,setNNota]=useState("")
  const fmtCLP=n=>new Intl.NumberFormat("es-CL",{style:"currency",currency:"CLP",maximumFractionDigits:0}).format(n)
  const stMap={
    enviada: {l:"📤 Enviada", c:T.accent,bg:`${T.accent}18`},
    aceptada:{l:"✅ Aceptada",c:T.mint,  bg:`${T.mint}18`},
    vencida: {l:"⏰ Vencida", c:T.t3,   bg:"rgba(255,255,255,0.08)"},
  }
  const crearCot=()=>{
    if(!nClient) return
    setCotizaciones(cs=>[{id:`COT-${String(cs.length+9).padStart(3,"0")}`,
      client:nClient,date:"Hoy",valid:nValid||"+7 días",total:0,status:"enviada",
      items:[{n:nNota||"Productos por definir",sub:0}]},...cs])
    setNClient(""); setNValid(""); setNNota(""); setShowNew(false)
  }
  const convertirVenta=(id)=>setCotizaciones(cs=>cs.map(c=>c.id===id?{...c,status:"aceptada"}:c))
  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
        padding:"16px",borderBottom:`1px solid ${T.border}`,flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <button onClick={onBack} style={{width:38,height:38,borderRadius:11,border:"none",cursor:"pointer",
            background:T.surface,boxShadow:T.btn,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <I d={ic.back} s={16} c={T.t2}/>
          </button>
          <div style={{fontSize:16,fontWeight:700,color:T.t1,fontFamily:"Bricolage Grotesque"}}>Presupuestos 📄</div>
        </div>
        <button onClick={()=>setShowNew(true)} style={{padding:"9px 16px",borderRadius:10,border:"none",cursor:"pointer",
          background:`linear-gradient(135deg,${T.accent},${T.accent}CC)`,color:"#1C2130",fontSize:12,fontWeight:700,
          display:"flex",alignItems:"center",gap:6}}>
          <I d={ic.plus} s={14} c="#1C2130"/>Nuevo
        </button>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"16px",display:"flex",flexDirection:"column",gap:10}}>
        {cotizaciones.map(c=>{
          const s=stMap[c.status]
          return (
            <div key={c.id} style={{background:T.surface,borderRadius:14,padding:"14px 16px",
              boxShadow:T.card,border:`1px solid ${s.c}18`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                    <span style={{fontSize:13,fontWeight:700,color:T.t1}}>{c.client}</span>
                    <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20,
                      background:s.bg,color:s.c}}>{s.l}</span>
                  </div>
                  <div style={{fontSize:10,color:T.t3,fontFamily:"JetBrains Mono"}}>
                    {c.id} · {c.date} → Válido: {c.valid}
                  </div>
                </div>
                <div style={{fontSize:16,fontWeight:900,color:T.accent,fontFamily:"JetBrains Mono",flexShrink:0}}>
                  {fmtCLP(c.total)}
                </div>
              </div>
              {c.items.map(item=>(
                <div key={item.n} style={{display:"flex",justifyContent:"space-between",
                  padding:"5px 0",borderBottom:`1px solid ${T.border}`}}>
                  <span style={{fontSize:12,color:T.t2}}>{item.n}</span>
                  <span style={{fontSize:12,color:T.t2,fontFamily:"JetBrains Mono"}}>{fmtCLP(item.sub)}</span>
                </div>
              ))}
              <div style={{display:"flex",gap:8,marginTop:10}}>
                {c.status==="enviada"&&(
                  <button onClick={()=>convertirVenta(c.id)}
                    style={{flex:1,padding:"9px",borderRadius:10,border:"none",cursor:"pointer",
                      background:`linear-gradient(135deg,${T.accent},${T.accent}CC)`,color:"#1C2130",fontSize:12,fontWeight:700}}>
                    🛒 Convertir en venta
                  </button>
                )}
                <button onClick={()=>window.print()}
                  style={{flex:1,padding:"9px",borderRadius:10,border:"none",cursor:"pointer",
                  background:T.surface,boxShadow:T.btn,color:T.t2,fontSize:12,fontWeight:600}}>
                  📄 PDF
                </button>
                <button onClick={()=>window.open("https://wa.me/?text=Presupuesto%20NegociPro","_blank")}
                  style={{flex:1,padding:"9px",borderRadius:10,border:"none",cursor:"pointer",
                  background:"#25D36618",boxShadow:T.btn,color:"#25D366",fontSize:12,fontWeight:600}}>
                  📲 Enviar WSP
                </button>
              </div>
            </div>
          )
        })}
        <div style={{height:20}}/>
      </div>
      <AnimatePresence>
        {showNew&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.65)",
              display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:200}}
            onClick={e=>e.target===e.currentTarget&&setShowNew(false)}>
            <motion.div initial={{y:"100%"}} animate={{y:0}} exit={{y:"100%"}}
              transition={{type:"spring",damping:30,stiffness:350}}
              style={{width:"100%",maxWidth:480,background:T.surface,
                borderRadius:"24px 24px 0 0",padding:"20px 20px 40px",boxShadow:"0 -8px 40px rgba(0,0,0,0.5)"}}>
              <div style={{width:40,height:5,borderRadius:3,background:"rgba(255,255,255,0.15)",margin:"0 auto 16px"}}/>
              <div style={{fontSize:16,fontWeight:700,color:T.t1,fontFamily:"Bricolage Grotesque",marginBottom:14}}>
                Nueva cotización
              </div>
              {[{l:"Cliente o empresa *",v:nClient,set:setNClient,p:"Nombre del cliente..."},
                {l:"Válido hasta",v:nValid,set:setNValid,p:"DD/MM/AAAA",type:"date"},
                {l:"Notas / condiciones",v:nNota,set:setNNota,p:"Precios sujetos a disponibilidad..."}].map(f=>(
                <div key={f.l} style={{marginBottom:10}}>
                  <div style={{fontSize:11,color:T.t3,marginBottom:6}}>{f.l}</div>
                  <input value={f.v} onChange={e=>f.set(e.target.value)} placeholder={f.p} type={f.type||"text"}
                    style={{width:"100%",padding:"12px 14px",borderRadius:12,border:"none",
                      background:T.bg,boxShadow:T.inset,color:T.t1,fontSize:14,
                      fontFamily:"DM Sans",outline:"none",caretColor:T.accent,boxSizing:"border-box"}}/>
                </div>
              ))}
              <div style={{display:"flex",gap:10,marginTop:14}}>
                <button onClick={()=>setShowNew(false)} style={{flex:1,padding:"12px",borderRadius:12,
                  border:"none",cursor:"pointer",background:T.surface,color:T.t2,fontSize:13,fontWeight:600,boxShadow:T.btn}}>
                  Cancelar
                </button>
                <button onClick={crearCot} style={{flex:2,padding:"12px",borderRadius:12,border:"none",
                  cursor:nClient?"pointer":"not-allowed",
                  background:nClient?`linear-gradient(135deg,${T.accent},${T.accent}CC)`:"rgba(255,255,255,0.08)",
                  color:nClient?"#1C2130":T.t3,fontSize:13,fontWeight:700,
                  display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                  <I d={ic.check} s={14} c={nClient?"#1C2130":T.t3}/>Crear y enviar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── CONTACTOS ────────────────────────────────────────────────────
const INITIAL_CONTACTS=[
  {id:1,name:"Pedro Soto",     type:"customer",phone:"+56 9 1234 5678",email:"pedro@gmail.com",  balance:47500,purchases:8,points:64,segment:"vip",     joined:"Ene 2025"},
  {id:2,name:"María González", type:"customer",phone:"+56 9 8765 4321",email:"maria@gmail.com",  balance:12200,purchases:5,points:35,segment:"frequent", joined:"Feb 2025"},
  {id:3,name:"Carlos Ruiz",    type:"customer",phone:"+56 9 5555 1234",email:"",                 balance:8900, purchases:3,points:15,segment:"occasional",joined:"Mar 2025"},
  {id:4,name:"Ana Torres",     type:"customer",phone:"+56 9 4444 5678",email:"ana@gmail.com",    balance:35000,purchases:12,points:96,segment:"vip",    joined:"Dic 2024"},
  {id:5,name:"Luis Pérez",     type:"customer",phone:"+56 9 3333 9876",email:"",                 balance:5500, purchases:2,points:10,segment:"occasional",joined:"Mar 2025"},
  {id:6,name:"Embotelladora Andina",type:"supplier",phone:"+56 2 2345 6789",email:"ventas@andina.cl",balance:0,purchases:0,segment:"",joined:"Ene 2024"},
  {id:7,name:"Lácteos del Sur", type:"supplier",phone:"+56 2 9876 5432",email:"pedidos@lacteos.cl",balance:0,purchases:0,segment:"",joined:"Mar 2024"},
  {id:8,name:"Juan García",    type:"employee",phone:"+56 9 6666 7777",email:"juan@mail.com",    balance:0,purchases:0,segment:"",joined:"Ene 2025"},
]

function Contactos({ T, onOpenScreen, addNotif, contactList, setContactList }) {
  const [localContacts,setLocalContacts]=useState(INITIAL_CONTACTS)
  const contacts = contactList || localContacts
  const setContacts = setContactList || setLocalContacts
  const [tab,setTab]=useState("customer")
  const [search,setSearch]=useState("")
  const [showForm,setShowForm]=useState(false)
  const [editC,setEditC]=useState(null)
  const [fName,setFName]=useState("")
  const [fType,setFType]=useState("customer")
  const [fPhone,setFPhone]=useState("")
  const [fEmail,setFEmail]=useState("")
  const [fTelegram,setFTelegram]=useState("")
  const [fNotes,setFNotes]=useState("")
  const [showProfile,setShowProfile]=useState(null)
  const fmtCLP=n=>new Intl.NumberFormat("es-CL",{style:"currency",currency:"CLP",maximumFractionDigits:0}).format(n)

  const TYPE_MAP={customer:{l:"Cliente",c:"#F0B429",icon:"👤"},supplier:{l:"Proveedor",c:"#3D8BFF",icon:"🏭"},employee:{l:"Empleado",c:"#06D6A0",icon:"👷"}}
  const SEG_MAP={vip:{l:"⭐ VIP",c:"#F0B429",bg:"rgba(240,180,41,0.15)"},frequent:{l:"🟢 Frecuente",c:"#06D6A0",bg:"rgba(6,214,160,0.15)"},occasional:{l:"🔵 Ocasional",c:"#3D8BFF",bg:"rgba(61,139,255,0.15)"},"":null}

  const openNew=()=>{setEditC(null);setFName('');setFType(tab);setFPhone('');setFEmail('');setFTelegram('');setFNotes('');setShowForm(true)}
  const openEdit=(c)=>{setEditC(c);setFName(c.name);setFType(c.type);setFPhone(c.phone);setFEmail(c.email||'');setFTelegram(c.telegram||'');setFNotes(c.notes||'');setShowForm(true)}
  const save=()=>{
    if(!fName.trim()) return
    const now = new Date().toLocaleDateString("es-CL",{day:"numeric",month:"short",year:"numeric"})
    if(editC){
      setContacts(cs=>cs.map(c=>c.id===editC.id
        ?{...c,name:fName,type:fType,phone:fPhone,email:fEmail,
          telegram:fTelegram||c.telegram||"",notes:fNotes||c.notes||"",
          activity:[...(c.activity||[]),{date:now,text:"Perfil actualizado"}]}
        :c))
      if(addNotif) addNotif("system","✏️ Contacto actualizado",`Los datos de ${fName} fueron actualizados.`)
    } else {
      const newC={
        id:Date.now(),name:fName.trim(),type:fType,
        phone:fPhone,email:fEmail,telegram:fTelegram||"",notes:fNotes||"",
        balance:0,purchases:0,points:0,segment:fType==="customer"?"occasional":"",
        joined:now,
        activity:[{date:now,text:"Cliente creado en NegociPro"}]
      }
      setContacts(cs=>[...cs,newC])
      if(addNotif) addNotif("customer","👤 Nuevo contacto",`${fName} fue agregado como ${fType==="customer"?"cliente":fType==="supplier"?"proveedor":"empleado"}.`)
    }
    setShowForm(false)
  }
  const del=(id)=>setContacts(cs=>cs.filter(c=>c.id!==id))

  const filtered=contacts.filter(c=>c.type===tab)
    .filter(c=>c.name.toLowerCase().includes(search.toLowerCase())||c.phone.includes(search))
  const counts={customer:contacts.filter(c=>c.type==="customer").length,supplier:contacts.filter(c=>c.type==="supplier").length,employee:contacts.filter(c=>c.type==="employee").length}

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%",background:T.bg}}>
      <div style={{padding:"16px",borderBottom:`1px solid ${T.border}`,flexShrink:0}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <span style={{fontSize:18,fontWeight:700,color:T.t1,fontFamily:"Bricolage Grotesque"}}>Contactos 👥</span>
          <button onClick={openNew} style={{padding:"9px 16px",borderRadius:10,border:"none",cursor:"pointer",
            background:`linear-gradient(135deg,${T.accent},${T.accent}CC)`,color:"#1C2130",fontSize:12,fontWeight:700,
            display:"flex",alignItems:"center",gap:6}}>
            <I d={ic.plus} s={14} c="#1C2130"/>Nuevo
          </button>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",
          borderRadius:14,background:T.surface,boxShadow:T.inset}}>
          <I d={ic.search} s={15} c={T.t3}/>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Buscar por nombre o teléfono..."
            style={{flex:1,border:"none",background:"transparent",color:T.t1,
              fontSize:13,fontFamily:"DM Sans",outline:"none",caretColor:T.accent}}/>
          {search&&<button onClick={()=>setSearch("")}
            style={{width:20,height:20,borderRadius:10,border:"none",cursor:"pointer",
              background:`${T.danger}20`,color:T.danger,fontSize:12,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>}
        </div>
      </div>
      <div style={{display:"flex",padding:"0 16px",borderBottom:`1px solid ${T.border}`,flexShrink:0}}>
        {[{id:"customer",l:`👤 Clientes (${counts.customer})`},{id:"supplier",l:`🏭 Proveed. (${counts.supplier})`},{id:"employee",l:`👷 Empleados (${counts.employee})`}].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            style={{flex:1,padding:"12px 4px",border:"none",cursor:"pointer",background:"transparent",
              fontSize:11,fontWeight:tab===t.id?700:400,color:tab===t.id?T.accent:T.t3,
              borderBottom:tab===t.id?`2px solid ${T.accent}`:"2px solid transparent"}}>
            {t.l}
          </button>
        ))}
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"16px",display:"flex",flexDirection:"column",gap:8}}>
        {filtered.length===0&&(
          <div style={{textAlign:"center",padding:"48px 20px"}}>
            <div style={{fontSize:48,marginBottom:14}}>{TYPE_MAP[tab].icon}</div>
            <div style={{fontSize:14,fontWeight:600,color:T.t1,marginBottom:6}}>
              {search?"Sin resultados":`Sin ${tab==="customer"?"clientes":tab==="supplier"?"proveedores":"empleados"} aún`}
            </div>
            <button onClick={openNew} style={{marginTop:12,padding:"10px 20px",borderRadius:20,border:"none",
              cursor:"pointer",background:`${T.accent}20`,color:T.accent,fontSize:12,fontWeight:600}}>
              Agregar {TYPE_MAP[tab].l.toLowerCase()}
            </button>
          </div>
        )}
        {filtered.map((c,i)=>{
          const tm=TYPE_MAP[c.type]
          const seg=SEG_MAP[c.segment]
          return (
            <div key={c.id} style={{background:T.surface,borderRadius:16,padding:"14px 16px",boxShadow:T.card}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:c.type==="customer"?10:0}}>
                <div style={{width:44,height:44,borderRadius:13,flexShrink:0,
                  background:`${tm.c}18`,boxShadow:T.btn,
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{tm.icon}</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3,flexWrap:"wrap"}}>
                    <span style={{fontSize:14,fontWeight:700,color:T.t1}}>{c.name}</span>
                    {seg&&<span style={{fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:20,
                      background:seg.bg,color:seg.c}}>{seg.l}</span>}
                  </div>
                  <div style={{fontSize:11,color:T.t3}}>{c.phone}{c.email&&` · ${c.email}`}</div>
                  <div style={{fontSize:10,color:T.t3}}>Desde {c.joined}{c.type==="customer"&&c.purchases>0&&` · ${c.purchases} compras`}</div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:5}}>
                  <button onClick={()=>openEdit(c)}
                    style={{width:32,height:32,borderRadius:9,border:"none",cursor:"pointer",
                      background:`${T.blue}18`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <I d={ic.edit} s={13} c={T.blue}/>
                  </button>
                  <button onClick={()=>del(c.id)}
                    style={{width:32,height:32,borderRadius:9,border:"none",cursor:"pointer",
                      background:`${T.danger}18`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <I d={ic.trash} s={13} c={T.danger}/>
                  </button>
                </div>
              </div>
              {c.type==="customer"&&(
                <div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:10}}>
                    {[{l:"COMPRAS",v:c.purchases,c:T.t1},{l:"DEUDA",v:c.balance>0?fmtCLP(c.balance):"$0",c:c.balance>0?T.danger:T.mint},{l:"PUNTOS ⭐",v:(c.points||0),c:T.accent}].map(m=>(
                      <div key={m.l} style={{background:T.sunken,borderRadius:10,padding:"8px 10px",boxShadow:T.inset}}>
                        <div style={{fontSize:9,color:T.t3,marginBottom:2}}>{m.l}</div>
                        <div style={{fontSize:16,fontWeight:800,color:m.c,fontFamily:"JetBrains Mono"}}>{m.v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={()=>setShowProfile(c)}
                      style={{flex:1,padding:"9px",borderRadius:10,border:"none",cursor:"pointer",
                        background:`${T.accent}12`,color:T.accent,fontSize:12,fontWeight:700}}>
                      👤 Ver perfil
                    </button>
                    {c.balance>0&&<button onClick={()=>onOpenScreen("deudor")}
                      style={{flex:1,padding:"9px",borderRadius:10,border:"none",cursor:"pointer",
                        background:`linear-gradient(135deg,${T.accent},${T.accent}CC)`,color:"#1C2130",fontSize:12,fontWeight:700}}>
                      💰 Cobrar
                    </button>}
                    <button onClick={()=>onOpenScreen("nuevo-fiado")}
                      style={{flex:1,padding:"9px",borderRadius:10,border:"none",cursor:"pointer",
                        background:T.surface,boxShadow:T.btn,color:T.t2,fontSize:12,fontWeight:600}}>
                      📝 Fiado
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
        <div style={{height:80}}/>
      </div>

      <AnimatePresence>
        {showForm&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",
              display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:200,backdropFilter:"blur(4px)"}}
            onClick={e=>e.target===e.currentTarget&&setShowForm(false)}>
            <motion.div initial={{y:"100%"}} animate={{y:0}} exit={{y:"100%"}}
              transition={{type:"spring",damping:30,stiffness:350}}
              style={{width:"100%",maxWidth:480,background:T.surface,
                borderRadius:"24px 24px 0 0",padding:"20px 20px 36px",
                boxShadow:"0 -8px 40px rgba(0,0,0,0.5)"}}>
              <div style={{width:40,height:5,borderRadius:3,background:"rgba(255,255,255,0.15)",margin:"0 auto 16px"}}/>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <div style={{fontSize:16,fontWeight:700,color:T.t1,fontFamily:"Bricolage Grotesque"}}>
                  {editC?"✏️ Editar contacto":"➕ Nuevo contacto"}
                </div>
                <button onClick={()=>setShowForm(false)}
                  style={{width:32,height:32,borderRadius:9,border:"none",cursor:"pointer",
                    background:T.sunken,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <I d={ic.x} s={15} c={T.t3}/>
                </button>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:14}}>
                {Object.entries(TYPE_MAP).map(([k,v])=>(
                  <button key={k} onClick={()=>setFType(k)}
                    style={{padding:"12px 6px",borderRadius:14,border:"none",cursor:"pointer",
                      background:fType===k?`${v.c}20`:T.surface,
                      boxShadow:fType===k?T.press:T.btn,
                      outline:fType===k?`1.5px solid ${v.c}50`:"none",
                      display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
                    <span style={{fontSize:20}}>{v.icon}</span>
                    <span style={{fontSize:11,color:fType===k?v.c:T.t3,fontWeight:fType===k?700:400}}>{v.l}</span>
                  </button>
                ))}
              </div>
              <div style={{marginBottom:12}}>
                  <div style={{fontSize:11,color:T.t3,marginBottom:7,fontWeight:600}}>Nombre *</div>
                  <input value={fName} onChange={e=>setFName(e.target.value)} autoFocus
                    placeholder={fType==="customer"?"Ej: Pedro Soto":fType==="supplier"?"Ej: Embotelladora...":"Ej: Juan García"}
                    style={{width:"100%",padding:"13px 16px",borderRadius:14,border:"none",
                      background:T.bg,boxShadow:T.inset,color:T.t1,fontSize:15,fontWeight:500,
                      fontFamily:"DM Sans",outline:"none",caretColor:T.accent,boxSizing:"border-box"}}/>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                  <div>
                    <div style={{fontSize:11,color:T.t3,marginBottom:7,fontWeight:600}}>📞 Teléfono</div>
                    <input value={fPhone} onChange={e=>setFPhone(e.target.value)} inputMode="tel"
                      placeholder="+56 9 XXXX XXXX"
                      style={{width:"100%",padding:"12px 14px",borderRadius:12,border:"none",
                        background:T.bg,boxShadow:T.inset,color:T.t1,fontSize:13,
                        fontFamily:"DM Sans",outline:"none",caretColor:T.accent,boxSizing:"border-box"}}/>
                  </div>
                  <div>
                    <div style={{fontSize:11,color:T.t3,marginBottom:7,fontWeight:600}}>✈️ Telegram</div>
                    <input value={fTelegram} onChange={e=>setFTelegram(e.target.value)}
                      placeholder="@usuario"
                      style={{width:"100%",padding:"12px 14px",borderRadius:12,border:"none",
                        background:T.bg,boxShadow:T.inset,color:T.t1,fontSize:13,
                        fontFamily:"DM Sans",outline:"none",caretColor:T.accent,boxSizing:"border-box"}}/>
                  </div>
                </div>
                <div style={{marginBottom:12}}>
                  <div style={{fontSize:11,color:T.t3,marginBottom:7,fontWeight:600}}>📧 Email</div>
                  <input value={fEmail} onChange={e=>setFEmail(e.target.value)} type="email"
                    placeholder="correo@ejemplo.com"
                    style={{width:"100%",padding:"12px 14px",borderRadius:12,border:"none",
                      background:T.bg,boxShadow:T.inset,color:T.t1,fontSize:13,
                      fontFamily:"DM Sans",outline:"none",caretColor:T.accent,boxSizing:"border-box"}}/>
                </div>
                <div style={{marginBottom:12}}>
                  <div style={{fontSize:11,color:T.t3,marginBottom:7,fontWeight:600}}>📝 Notas internas</div>
                  <input value={fNotes} onChange={e=>setFNotes(e.target.value)}
                    placeholder="Ej: paga viernes, descuento habitual..."
                    style={{width:"100%",padding:"12px 14px",borderRadius:12,border:"none",
                      background:T.bg,boxShadow:T.inset,color:T.t1,fontSize:13,
                      fontFamily:"DM Sans",outline:"none",caretColor:T.accent,boxSizing:"border-box"}}/>
                </div>
              <div style={{display:"flex",gap:10,marginTop:6}}>
                <button onClick={()=>setShowForm(false)}
                  style={{flex:1,padding:"13px",borderRadius:12,border:"none",cursor:"pointer",
                    background:T.surface,color:T.t2,fontSize:13,fontWeight:600,boxShadow:T.btn}}>
                  Cancelar
                </button>
                <button onClick={save}
                  style={{flex:2,padding:"13px",borderRadius:12,border:"none",
                    cursor:fName?"pointer":"not-allowed",
                    background:fName?`linear-gradient(135deg,${T.accent},${T.accent}CC)`:"rgba(255,255,255,0.08)",
                    color:fName?"#1C2130":T.t3,fontSize:13,fontWeight:700,
                    display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                  <I d={ic.check} s={15} c={fName?"#1C2130":T.t3}/>
                  {editC?"Guardar cambios":`Agregar ${TYPE_MAP[fType].l}`}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mini Perfil del cliente ─────────────────────────── */}
      <AnimatePresence>
        {showProfile&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.72)",
              display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:200,backdropFilter:"blur(6px)"}}
            onClick={e=>e.target===e.currentTarget&&setShowProfile(null)}>
            <motion.div initial={{y:"100%"}} animate={{y:0}} exit={{y:"100%"}}
              transition={{type:"spring",damping:30,stiffness:350}}
              style={{width:"100%",maxWidth:480,background:T.surface,
                borderRadius:"24px 24px 0 0",maxHeight:"88vh",
                display:"flex",flexDirection:"column",
                boxShadow:"0 -8px 40px rgba(0,0,0,0.5)"}}>

              {/* Header del perfil */}
              <div style={{padding:"20px 20px 16px",borderBottom:`1px solid ${T.border}`,flexShrink:0}}>
                <div style={{width:36,height:4,borderRadius:2,
                  background:"rgba(255,255,255,0.15)",margin:"0 auto 16px"}}/>
                <div style={{display:"flex",alignItems:"center",gap:14}}>
                  {/* Avatar grande */}
                  <div style={{width:56,height:56,borderRadius:18,flexShrink:0,
                    background:`linear-gradient(135deg,${T.accent},${T.accent}BB)`,
                    boxShadow:`0 0 20px ${T.accent}40`,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:22,fontWeight:800,color:"#1C2130"}}>
                    {showProfile.name[0].toUpperCase()}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:18,fontWeight:800,color:T.t1,
                      fontFamily:"Bricolage Grotesque",marginBottom:3}}>
                      {showProfile.name}
                    </div>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                      {SEG_MAP[showProfile.segment]&&(
                        <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20,
                          background:SEG_MAP[showProfile.segment].bg,
                          color:SEG_MAP[showProfile.segment].c}}>
                          {SEG_MAP[showProfile.segment].l}
                        </span>
                      )}
                      <span style={{fontSize:10,color:T.t3}}>Desde {showProfile.joined}</span>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:6}}>
                    <button onClick={()=>{setShowProfile(null);openEdit(showProfile)}}
                      style={{width:34,height:34,borderRadius:10,border:"none",cursor:"pointer",
                        background:`${T.blue}18`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <I d={ic.edit} s={14} c={T.blue}/>
                    </button>
                    <button onClick={()=>setShowProfile(null)}
                      style={{width:34,height:34,borderRadius:10,border:"none",cursor:"pointer",
                        background:T.sunken,display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <I d={ic.x} s={14} c={T.t3}/>
                    </button>
                  </div>
                </div>
              </div>

              <div style={{flex:1,overflowY:"auto",padding:"16px 20px",display:"flex",flexDirection:"column",gap:14}}>
                {/* Datos de contacto */}
                <div style={{background:T.sunken,borderRadius:16,padding:"14px 16px",boxShadow:T.inset}}>
                  <div style={{fontSize:11,color:T.t3,fontWeight:600,textTransform:"uppercase",
                    letterSpacing:"0.07em",marginBottom:10}}>Datos de contacto</div>
                  {[
                    showProfile.phone&&{e:"📞",l:showProfile.phone},
                    showProfile.email&&{e:"📧",l:showProfile.email},
                    showProfile.telegram&&{e:"✈️",l:showProfile.telegram},
                  ].filter(Boolean).map(row=>(
                    <div key={row.l} style={{display:"flex",alignItems:"center",gap:10,
                      padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
                      <span style={{fontSize:16}}>{row.e}</span>
                      <span style={{fontSize:13,color:T.t1}}>{row.l}</span>
                    </div>
                  ))}
                  {!showProfile.phone&&!showProfile.email&&(
                    <div style={{fontSize:12,color:T.t3}}>Sin datos de contacto aún</div>
                  )}
                </div>

                {/* Métricas */}
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
                  {[
                    {l:"Compras",    v:showProfile.purchases,          c:T.t1},
                    {l:"Deuda",      v:showProfile.balance>0?fmtCLP(showProfile.balance):"$0", c:showProfile.balance>0?T.danger:T.mint},
                    {l:"Puntos ⭐",  v:(showProfile.points||0),          c:T.accent},
                  ].map(m=>(
                    <div key={m.l} style={{background:T.surface,borderRadius:14,padding:"12px 10px",
                      textAlign:"center",boxShadow:T.card}}>
                      <div style={{fontSize:22,fontWeight:900,color:m.c,fontFamily:"JetBrains Mono",marginBottom:3}}>{m.v}</div>
                      <div style={{fontSize:10,color:T.t3}}>{m.l}</div>
                    </div>
                  ))}
                  {/* Barra de puntos */}
                  {showProfile.type==="customer"&&(
                    <div style={{background:T.surface,borderRadius:14,padding:"12px 14px",
                      marginTop:2,boxShadow:T.card}}>
                      <div style={{display:"flex",justifyContent:"space-between",
                        alignItems:"center",marginBottom:6}}>
                        <span style={{fontSize:11,fontWeight:700,color:T.t1}}>
                          ⭐ {(showProfile.points||0)} puntos acumulados
                        </span>
                        <span style={{fontSize:10,padding:"2px 8px",borderRadius:20,fontWeight:700,
                          background:(showProfile.points||0)>=100?`${T.mint}20`:(showProfile.points||0)>=40?`${T.accent}20`:`${T.blue}15`,
                          color:(showProfile.points||0)>=100?T.mint:(showProfile.points||0)>=40?T.accent:T.blue}}>
                          {(showProfile.points||0)>=100?"⭐ VIP":(showProfile.points||0)>=40?"🔶 Frecuente":"🔵 Ocasional"}
                        </span>
                      </div>
                      <div style={{height:6,borderRadius:3,background:T.sunken,overflow:"hidden",marginBottom:6}}>
                        <motion.div initial={{width:0}}
                          animate={{width:Math.min(100,(showProfile.points||0))+"%"}}
                          transition={{duration:0.8}}
                          style={{height:"100%",borderRadius:3,
                            background:`linear-gradient(90deg,${T.blue},${T.accent})`}}/>
                      </div>
                      <div style={{fontSize:10,color:T.t3}}>
                        1 pto/producto · 2 ptos/producto si compra {">"} $20.000 · VIP a los 100 ptos
                      </div>
                    </div>
                  )}
                </div>

                {/* Notas internas */}
                {showProfile.notes&&(
                  <div style={{background:`${T.accent}0A`,border:`1px solid ${T.accent}20`,
                    borderRadius:14,padding:"12px 14px"}}>
                    <div style={{fontSize:11,color:T.accent,fontWeight:600,marginBottom:5}}>📝 Notas internas</div>
                    <div style={{fontSize:13,color:T.t2,lineHeight:1.5}}>{showProfile.notes}</div>
                  </div>
                )}

                {/* Actividad / historial */}
                <div>
                  <div style={{fontSize:11,color:T.t3,fontWeight:600,textTransform:"uppercase",
                    letterSpacing:"0.07em",marginBottom:10}}>Historial de actividad</div>
                  {(showProfile.activity||[]).length===0?(
                    <div style={{fontSize:12,color:T.t3,textAlign:"center",padding:"20px",
                      background:T.surface,borderRadius:14,boxShadow:T.card}}>
                      Sin actividad registrada aún
                    </div>
                  ):(
                    <div style={{display:"flex",flexDirection:"column",gap:8}}>
                      {[...(showProfile.activity||[])].reverse().map((act,i)=>(
                        <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",
                          padding:"10px 12px",background:T.surface,borderRadius:12,boxShadow:T.card}}>
                          <div style={{width:7,height:7,borderRadius:4,background:T.accent,
                            flexShrink:0,marginTop:4}}/>
                          <div style={{flex:1}}>
                            <div style={{fontSize:12,color:T.t1,lineHeight:1.4}}>{act.text}</div>
                            <div style={{fontSize:10,color:T.t3,marginTop:2}}>{act.date}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Acciones rápidas */}
              <div style={{padding:"12px 20px 28px",borderTop:`1px solid ${T.border}`,
                display:"flex",gap:10,flexShrink:0}}>
                <button onClick={()=>{setShowProfile(null);onOpenScreen("nuevo-fiado")}}
                  style={{flex:1,padding:"12px",borderRadius:12,border:"none",cursor:"pointer",
                    background:`linear-gradient(135deg,${T.accent},${T.accent}CC)`,
                    color:"#1C2130",fontSize:13,fontWeight:700,fontFamily:"DM Sans",
                    boxShadow:`0 4px 14px ${T.accent}40`}}>
                  📝 Registrar fiado
                </button>
                <button
                  onClick={()=>showProfile?.phone&&window.open(`https://wa.me/${showProfile.phone.replace(/[^0-9]/g,"")}`,`_blank`)}
                  style={{flex:1,padding:"12px",borderRadius:12,border:"none",cursor:"pointer",
                  background:"#25D366",color:"#fff",fontSize:13,fontWeight:700}}>
                  📲 WhatsApp
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}

// ─── APP ROOT ─────────────────────────────────────────────────────
// ── Puntos por compra ──────────────────────────────────────────
// 1 punto por producto, doble (2 pts) si total > $20.000
function calcPoints(items, total) {
  try {
    const arr = Array.isArray(items) ? items : []
    const numItems = arr.reduce((s,i) => {
      if(!i) return s
      if(typeof i === "string") return s + 1
      if(typeof i === "number") return s + i
      return s + (i.qty || i.q || 1)
    }, 0)
    return total > 20000 ? numItems * 2 : numItems
  } catch(e) { return 0 }
}

function App() {
  const [config,setConfig]=useState(null)
  const [active,setActive]=useState("Dashboard")
  const [isDark,setIsDark]=useState(true)
  const [accent,setAccent]=useState(null)
  const [showChat,setShowChat]=useState(false)
  const [showColor,setShowColor]=useState(false)
  const [showCalc,setShowCalc]=useState(false)
  const [screen,setScreen]=useState(null)
  const [stockList,setStockList]=useState(STOCK_INICIAL)
  const [deudaList,setDeudaList]=useState([
    {id:1,n:"Pedro Soto",     email:"pedro@gmail.com",   b:47500,d:"Atrasado 3 días", st:"over",items:3,ph:"+56 9 1234 5678"},
    {id:2,n:"María González", email:"maria@gmail.com",   b:12200,d:"Atrasado 1 día",  st:"over",items:2,ph:"+56 9 8765 4321"},
    {id:3,n:"Carlos Ruiz",    email:"",                  b:8900, d:"Vence en 2 días", st:"soon",items:1,ph:"+56 9 5555 1234"},
    {id:4,n:"Ana Torres",     email:"ana@gmail.com",     b:35000,d:"Vence en 5 días", st:"soon",items:4,ph:"+56 9 4444 5678"},
    {id:5,n:"Luis Pérez",     email:"",                  b:5500, d:"Vence en 15 días",st:"ok",  items:1,ph:"+56 9 3333 9876"},
  ])
  const [cierres,setCierres]=useState([])
  const [salesList,setSalesList]=useState([
    {id:1847,method:"Efectivo", total:4200,  items:["Coca-Cola 2L × 2"],  client:null,   time:"15:32"},
    {id:1846,method:"Tarjeta",  total:1890,  items:["Pan Molde × 1"],     client:null,   time:"15:15"},
    {id:1845,method:"Fiado",    total:12400, items:["Yogurt × 3","Det.×1"],client:"Rosa M.",time:"14:50"},
    {id:1844,method:"Transfer", total:3750,  items:["Sprite 1.5L × 3"],   client:null,   time:"14:20"},
  ])
  const [soldItems,setSoldItems]=useState({})
  const [lastSale,setLastSale]=useState(null)   // {total,method,items,client,email,phone,change}
  const [contactList,setContactList]=useState([
    {id:1,name:"Pedro Soto",     type:"customer",phone:"+56 9 1234 5678",email:"pedro@gmail.com",  telegram:"",balance:47500,purchases:8,points:64,segment:"vip",     joined:"Ene 2025",notes:"Cliente frecuente, paga los viernes",activity:[]},
    {id:2,name:"María González", type:"customer",phone:"+56 9 8765 4321",email:"maria@gmail.com",  telegram:"@maria_g",balance:12200,purchases:5,points:35,segment:"frequent", joined:"Feb 2025",notes:"",activity:[]},
    {id:3,name:"Carlos Ruiz",    type:"customer",phone:"+56 9 5555 1234",email:"",                 telegram:"",balance:8900, purchases:3,points:15,segment:"occasional",joined:"Mar 2025",notes:"",activity:[]},
    {id:4,name:"Ana Torres",     type:"customer",phone:"+56 9 4444 5678",email:"ana@gmail.com",    telegram:"@anatorres",balance:35000,purchases:12,points:96,segment:"vip",    joined:"Dic 2024",notes:"VIP, descuento habitual del 5%",activity:[]},
    {id:5,name:"Luis Pérez",     type:"customer",phone:"+56 9 3333 9876",email:"",                 telegram:"",balance:5500, purchases:2,points:10,segment:"occasional",joined:"Mar 2025",notes:"",activity:[]},
    {id:6,name:"Embotelladora Andina",type:"supplier",phone:"+56 2 2345 6789",email:"ventas@andina.cl",telegram:"",balance:0,purchases:0,segment:"",joined:"Ene 2024",notes:"Entrega martes y jueves",activity:[]},
    {id:7,name:"Lácteos del Sur", type:"supplier",phone:"+56 2 9876 5432",email:"pedidos@lacteos.cl",telegram:"",balance:0,purchases:0,segment:"",joined:"Mar 2024",notes:"",activity:[]},
    {id:8,name:"Juan García",    type:"employee",phone:"+56 9 6666 7777",email:"juan@mail.com",    telegram:"@juangarcia",balance:0,purchases:0,segment:"",joined:"Ene 2025",notes:"Turno mañana 08:00-14:00",activity:[]},
  ])
  const [notifList,setNotifList]=useState([
    {
      id:1,type:"stock",read:false,
      ts: Date.now()-5*60*1000,
      time:"hace 5 min",
      title:"⚠️ Stock crítico — Yogurt 200g",
      body:"Solo 2 unidades disponibles. Stock mínimo: 8.",
    },
    {
      id:2,type:"sale",read:false,
      ts: Date.now()-12*60*1000,
      time:"hace 12 min",
      title:"💰 Venta — $45.000",
      body:"Pedro González · Efectivo",
      detail:{
        total:45000, method:"Efectivo",
        items:["Coca-Cola 2L × 2 — $2.980","Pan Molde × 1 — $1.890","Yogurt × 3 — $3.180","Det. Omo 1kg — $4.200"],
        client:null, fecha:"27 Mar 2026", hora:"15:20",
      }
    },
    {
      id:3,type:"expiry",read:false,
      ts: Date.now()-60*60*1000,
      time:"hace 1h",
      title:"📅 Vence en 2 días — Pan Molde Gde",
      body:"Vencimiento: 29 Mar 2026 · Stock: 2 unidades",
    },
    {
      id:4,type:"debt",read:false,
      ts: Date.now()-2*60*60*1000,
      time:"hace 2h",
      title:"💸 Fiado — Pedro Soto",
      body:"$47.500 pendiente · Atrasado 3 días",
      detail:{
        total:47500, method:"Fiado",
        items:["Coca-Cola 2L × 4","Sprite 1.5L × 2","Pan Molde × 1"],
        client:"Pedro Soto", fecha:"24 Mar 2026", hora:"10:15",
      }
    },
    {
      id:5,type:"goal",read:true,
      ts: Date.now()-3*60*60*1000,
      time:"hace 3h",
      title:"🎯 ¡Meta al 80%!",
      body:"Llevas $160.000 de tu meta diaria de $200.000.",
    },
    {
      id:6,type:"stock",read:true,
      ts: Date.now()-24*60*60*1000,
      time:"ayer 18:30",
      title:"⚠️ Stock bajo — Queso Gouda",
      body:"Sin stock. Última unidad vendida a Ana Torres.",
    },
    {
      id:7,type:"system",read:true,
      ts: Date.now()-30*60*60*1000,
      time:"ayer 09:00",
      title:"✅ Ejemplo — Demo del sistema",
      body:"Notificación de prueba. Los datos reales aparecerán arriba.",
      isDemo:true,
    },
  ])
  const unreadCount=notifList.filter(n=>!n.read).length
  // Enriquecer deudaList con emails actualizados de contactList
  const deudaListEnriquecida = deudaList.map(d=>{
    const match = contactList.find(cl=>cl.name===d.n||cl.name===d.ph)
    if(!match) return d
    return {...d,
      email: match.email||d.email||"",
      ph:    match.phone||d.ph||"",
      telegram: match.telegram||d.telegram||"",
    }
  })
  const fmtCLP=n=>new Intl.NumberFormat("es-CL",{style:"currency",currency:"CLP",maximumFractionDigits:0}).format(n)
  const addNotif=(type,title,body,detail=null)=>{
    const now=new Date()
    const ts=Date.now()
    // Crear el objeto FUERA del setState para que React Strict Mode no lo duplique
    const newNotif={
      id:ts, type, read:false, ts,
      time:now.toLocaleTimeString("es-CL",{hour:"2-digit",minute:"2-digit"}),
      title, body,
      ...(detail ? {detail} : {}),
      isDemo:false,
    }
    setNotifList(nl=>{
      // Deduplicar por id por si acaso
      if(nl.find(x=>x.id===newNotif.id)) return nl
      const withNew=[newNotif,...nl]
      return [...withNew.filter(n=>!n.isDemo).sort((a,b)=>(b.ts||0)-(a.ts||0)),
              ...withNew.filter(n=>n.isDemo)]
    })
  }
  const finalAccent=accent||config?.accent||"#F0B429"
  const T=useMemo(()=>makeTheme(finalAccent,isDark),[finalAccent,isDark])
  const toggleDark=()=>setIsDark(p=>!p)

  if(!config) return <Onboarding onDone={cfg=>{setConfig(cfg);setAccent(cfg.accent)}}/>

  const views={
    Dashboard: <Dashboard T={T} onOpenScreen={setScreen} onGoTo={setActive} stockList={stockList} deudaList={deudaList} salesList={salesList}/>,
    POS:       <POS T={T} stockList={stockList} contactList={contactList} onContactAdd={nc=>{setContactList(cl=>[nc,...cl]);addNotif("customer","👤 Nuevo cliente",`${nc.name} agregado desde Vender POS.`)}} onDeudaAdd={({name,phone,amount,itemsList,dueDate})=>{setDeudaList(dl=>{const exists=dl.find(d=>d.n===name);if(exists){addNotif("debt",`💸 Fiado POS adicional — ${name}`,`Sumó ${fmtCLP(amount)} más.`,
                   {total:amount,method:"Fiado",items:(itemsList||[]),client:name,
                    fecha:new Date().toLocaleDateString("es-CL",{day:"numeric",month:"short",year:"numeric"}),
                    hora:new Date().toLocaleTimeString("es-CL",{hour:"2-digit",minute:"2-digit"})});return dl.map(d=>d.n===name?{...d,b:d.b+amount,items:d.items+1,d:"Recién registrado",st:"soon"}:d)}addNotif("debt",`📝 Nuevo fiado POS — ${name}`,`${fmtCLP(amount)} registrado desde Vender.`,
                   {total:amount,method:"Fiado",items:(itemsList||[]),client:name,
                    fecha:new Date().toLocaleDateString("es-CL",{day:"numeric",month:"short",year:"numeric"}),
                    hora:new Date().toLocaleTimeString("es-CL",{hour:"2-digit",minute:"2-digit"})});return [...dl,{id:Date.now(),n:name,b:amount,d:"Sin fecha pactada",st:"soon",items:1,ph:phone}]})}} onConfirm={(total,saleData)=>{setSalesList(sl=>[{id:Date.now()%10000,method:saleData?.method||"Efectivo",total,items:saleData?.items||[],client:null,time:new Date().toLocaleTimeString("es-CL",{hour:"2-digit",minute:"2-digit"})},...sl].slice(0,20));if(saleData?.items) setSoldItems(si=>{const n={...si};(saleData.items||[]).forEach(it=>{n[it.name]=(n[it.name]||0)+it.qty});return n});setStockList(sl=>sl.map(p=>{
  const sold=(saleData?.items||[]).find(i=>
    i.name===p.n || (i.id && i.id===p.id)
  )
  if(!sold) return p
  const ns=Math.max(0,p.s-sold.qty)
  return {...p,s:ns,st:ns===0?"critical":ns<=p.min?"critical":p.st}
}));addNotif("sale",
                `💰 Venta — ${fmtCLP(total)}`,
                `${saleData?.method||"Efectivo"}${saleData?.fiadoClient?" · "+saleData.fiadoClient.name:""}`,
                {
                  total,
                  method:saleData?.method||"Efectivo",
                  items:(saleData?.items||[]).map(i=>i.name+" × "+i.qty+" — "+fmtCLP(i.price*i.qty)),
                  client:saleData?.fiadoClient?.name||null,
                  fecha:new Date().toLocaleDateString("es-CL",{day:"numeric",month:"short",year:"numeric"}),
                  hora:new Date().toLocaleTimeString("es-CL",{hour:"2-digit",minute:"2-digit"}),
                }
              );
              setLastSale({
                total,
                method:saleData?.method||"Efectivo",
                items:saleData?.items||[],
                client:saleData?.fiadoClient||null,
                change:0,
              });
              // Actualizar contactList: puntos + historial + compras si hay cliente fiado
              if(saleData?.fiadoClient){
                const pts=calcPoints(saleData.items,total)
                const fechaHoy=new Date().toLocaleDateString("es-CL")
                const itemNames=(saleData.items||[]).map(i=>i.name).join(", ")
                setContactList(cl=>cl.map(cx=>{
                  if(cx.name!==saleData.fiadoClient.name&&cx.id!==saleData.fiadoClient.id) return cx
                  const newPts=(cx.points||0)+pts
                  const newSeg=newPts>=100?"vip":newPts>=40?"frequent":"occasional"
                  return {...cx,
                    purchases:(cx.purchases||0)+1,
                    points: newPts,
                    segment: newSeg,
                    activity:[
                      {date:fechaHoy,text:"Compra fiado "+fmtCLP(total)+" ("+pts+" pts"+(total>20000?" ×2":"")+"): "+itemNames},
                      ...(cx.activity||[]).slice(0,9)
                    ]
                  }
                }))
              }
              setScreen("ticket")}}/>,
    Inventario:<Inventario T={T} onAddProduct={()=>setScreen("producto-form")} stockList={stockList} setStockList={setStockList}/>,
    Contactos: <Contactos T={T} onOpenScreen={setScreen} addNotif={addNotif} contactList={contactList} setContactList={setContactList}/>,
    Config:    <Config T={T} isDark={isDark} toggleDark={toggleDark} accent={finalAccent}
                 setAccent={setAccent} bizName={config.name} onColorEdit={()=>setShowColor(true)}
                 stockList={stockList} salesList={salesList} deudaList={deudaList} contactList={contactList}/>,
  }

  const detailScreens={
    "cierre":         <CierreCaja    T={T} onBack={()=>setScreen(null)} onCierre={r=>{setCierres(cs=>[r,...cs]);addNotif("cierre","🔒 Cierre de caja",`Caja cerrada. Total contado: ${fmtCLP(r.totalContado)}. ${r.cuadra?"✅ Cuadra perfectamente":"⚠️ Diferencia: "+fmtCLP(r.diferencia)}`);}} historial={cierres} setHistorial={setCierres}/>,
    "caja-chica":     <CajaChica     T={T} onBack={()=>setScreen(null)}/>,
    "producto-form":  <ProductoForm  T={T} onBack={()=>setScreen(null)} onSave={p=>{setStockList(s=>[p,...s]);addNotif("stock","📦 Producto agregado",`"${p.n}" fue agregado al inventario con ${p.s} unidades.`);setScreen(null)}}/>,
    "deudor":         <DeudorDetalle T={T} onBack={()=>setScreen(null)}/>,
    "deudores-lista": <Deudores      T={T} onOpenDeudor={()=>setScreen("deudor")} onNuevoFiado={()=>setScreen("nuevo-fiado")} onBack={()=>setScreen(null)} list={deudaListEnriquecida} setList={setDeudaList} addNotif={addNotif}/>,
    "ordenes":        <OrdenesCompra T={T} onBack={()=>setScreen(null)}/>,
    "reportes":       <Reportes      T={T} onBack={()=>setScreen(null)}/>,
    "ticket":         <TicketVenta   T={T} onBack={()=>{setScreen(null);setActive("Dashboard")}} lastSale={lastSale} contactList={contactList}/>,
    "notificaciones": <Notificaciones T={T} onBack={()=>setScreen(null)} notifs={notifList} setNotifs={setNotifList}/>,
    "vencimientos":   <Vencimientos  T={T} onBack={()=>setScreen(null)}/>,
    "nuevo-fiado":    <NuevoFiado    T={T} onBack={()=>setScreen(null)} stockList={stockList} contactList={contactList}
                       onContactAdd={nc=>{setContactList(cl=>[nc,...cl]);addNotif("customer","👤 Nuevo cliente",`${nc.name} fue agregado como cliente desde Registrar Fiado.`)}}
                       onStockUpdate={soldItems=>setStockList(sl=>sl.map(p=>{
                         const sold=soldItems.find(i=>
                           (i.name||"").trim().toLowerCase()===(p.n||"").trim().toLowerCase()
                           || (i.id && i.id===p.id)
                         )
                         if(!sold||!sold.qty) return p
                         const newStock=Math.max(0,(p.s||0)-sold.qty)
                         return {...p,s:newStock,st:newStock===0?"critical":newStock<=p.min?"critical":p.st}
                       }))}
                       onDeudaAdd={({name,phone,amount,itemsList,dueDate})=>{
                         // Agregar a salesList para que Dashboard lo refleje
                         setSalesList(sl=>[{
                           id:Date.now()%100000,
                           method:"Fiado",
                           total:amount,
                           items:(itemsList||[]).map(n=>({name:n,qty:1,price:0})),
                           client:name,
                           time:new Date().toLocaleTimeString("es-CL",{hour:"2-digit",minute:"2-digit"})
                         },...sl].slice(0,20))
                         // Agregar/actualizar en deudaList
                         setDeudaList(dl=>{
                           const exists=dl.find(d=>d.n===name)
                           if(exists){
                             addNotif("debt",
                               `💸 Fiado adicional — ${name}`,
                               `Sumó ${fmtCLP(amount)} más a su deuda.`,
                               {
                                 total:  amount,
                                 method: "Fiado",
                                 items:  (itemsList||[]),
                                 client: name,
                                 fecha:  new Date().toLocaleDateString("es-CL",{day:"numeric",month:"short",year:"numeric"}),
                                 hora:   new Date().toLocaleTimeString("es-CL",{hour:"2-digit",minute:"2-digit"}),
                               }
                             )
                             return dl.map(d=>d.n===name
                               ? {...d,b:d.b+amount,items:d.items+1,d:"Recién registrado",st:"soon"}
                               : d)
                           }
                           addNotif(
                           "debt",
                           `📝 Nuevo fiado — ${name}`,
                           `${fmtCLP(amount)} en ${(itemsList||[]).length} producto${(itemsList||[]).length!==1?"s":""}`,
                           {
                             total:  amount,
                             method: "Fiado",
                             items:  (itemsList||[]),
                             client: name,
                             fecha:  new Date().toLocaleDateString("es-CL",{day:"numeric",month:"short",year:"numeric"}),
                             hora:   new Date().toLocaleTimeString("es-CL",{hour:"2-digit",minute:"2-digit"}),
                           }
                         )
                           return [...dl,{
                             id:Date.now(),n:name,b:amount,
                             d:dueDate?"Vence "+new Date(dueDate+"T12:00:00").toLocaleDateString("es-CL"):"Sin fecha pactada",
                             st:"soon",items:1,ph:phone
                           }]
                         })
                         // Actualizar puntos y actividad en contactList
                         const pts=calcPoints((itemsList||[]).map(n=>({name:n,qty:1})),amount)
                         const fechaHoy=new Date().toLocaleDateString("es-CL")
                         setContactList(cl=>cl.map(cx=>{
                           if(cx.name!==name) return cx
                           const newPts=(cx.points||0)+pts
                           const newSeg=newPts>=100?"vip":newPts>=40?"frequent":"occasional"
                           return {...cx,
                             purchases:(cx.purchases||0)+1,
                             points:newPts,
                             segment:newSeg,
                             activity:[
                               {date:fechaHoy,text:"Fiado "+fmtCLP(amount)+" ("+pts+" pts"+(amount>20000?" ×2":"")+"): "+(itemsList||[]).join(", ")},
                               ...(cx.activity||[]).slice(0,9)
                             ]
                           }
                         }))
                       }}/>,
    "delivery":       <Delivery      T={T} onBack={()=>setScreen(null)}/>,
    "presupuestos":   <Presupuestos  T={T} onBack={()=>setScreen(null)}/>,
  }

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Bricolage+Grotesque:wght@600;700&family=JetBrains+Mono:wght@600;700&display=swap');*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{display:none}scrollbar-width:none`}</style>
      <div style={{display:"flex",flexDirection:"column",height:"100vh",background:T.bg,
        fontFamily:"DM Sans,sans-serif",color:T.t1,maxWidth:480,margin:"0 auto",
        position:"relative",overflow:"hidden"}}>
        <Header T={T} bizName={config.name} isDark={isDark} toggleDark={toggleDark}
          onColorEdit={()=>setShowColor(true)} onCalc={()=>setShowCalc(true)}
          onBell={()=>setScreen("notificaciones")} unread={unreadCount}/>
        <main style={{flex:1,overflowY:"auto",overflowX:"hidden"}}>
          <AnimatePresence mode="wait">
            {screen?(
              <motion.div key={screen} initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-30}}
                transition={{duration:0.2}} style={{height:"100%",display:"flex",flexDirection:"column"}}>
                {detailScreens[screen]}
              </motion.div>
            ):(
              <motion.div key={active} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}
                transition={{duration:0.18}}>
                {views[active]}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
        {!screen&&active!=="Config"&&<ChatFAB T={T} onClick={()=>setShowChat(true)}/>}
        <BottomNav active={active} setActive={v=>{setActive(v);setScreen(null)}} T={T}/>
      </div>
      <AnimatePresence>
        {showChat&&<AIChatPanel T={T} onClose={()=>setShowChat(false)}/>}
      </AnimatePresence>
      <AnimatePresence>
        {showCalc&&<CalcSheet T={T} onClose={()=>setShowCalc(false)}/>}
      </AnimatePresence>
      <AnimatePresence>
        {showColor&&<ColorSheet T={T} current={finalAccent} onSave={c=>setAccent(c)} onClose={()=>setShowColor(false)}/>}
      </AnimatePresence>
    </>
  )
}

export default App
