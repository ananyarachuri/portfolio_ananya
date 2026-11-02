import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Reveal, SectionHead, Icon, PageNav, ease } from "./ui.jsx";

/* ---------- Retina illustration (generated, not a real patient image) ---------- */
function rng(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildRetina(S) {
  const r = rng(7);
  const cx = S / 2, cy = S / 2, R = S * 0.46;
  const disc = { x: cx + 0.42 * R, y: cy - 0.04 * R, r: 0.13 * R };
  const macula = { x: cx - 0.12 * R, y: cy + 0.03 * R };
  const segs = [];
  const branch = (x, y, a, len, w, depth) => {
    let px = x, py = y, ang = a;
    for (let k = 0; k < 4; k++) {
      ang += (r() - 0.5) * 0.35;
      const nx = px + Math.cos(ang) * (len / 4);
      const ny = py + Math.sin(ang) * (len / 4);
      segs.push({ x1: px, y1: py, x2: nx, y2: ny, w });
      px = nx; py = ny;
    }
    if (depth > 0) {
      branch(px, py, ang + 0.3 + r() * 0.35, len * 0.74, w * 0.68, depth - 1);
      branch(px, py, ang - 0.3 - r() * 0.35, len * 0.74, w * 0.68, depth - 1);
    }
  };
  [-2.55, -2.95, 2.55, 2.95, -1.75, 1.75, -0.6, 0.6].forEach((a, i) =>
    branch(disc.x, disc.y, a, R * (i < 4 ? 0.42 : 0.26), S * 0.011, i < 4 ? 4 : 3)
  );
  const lr = rng(11);
  const lesions = Array.from({ length: 11 }, () => {
    const ang = lr() * Math.PI * 2;
    const d = R * (0.12 + lr() * 0.42);
    return { x: macula.x + Math.cos(ang) * d * 1.1, y: macula.y + Math.sin(ang) * d * 0.8, s: 0.6 + lr() * 0.8, kind: lr() > 0.55 ? "ex" : "ma" };
  });
  return { cx, cy, R, disc, macula, segs, lesions };
}

function drawRetina(ctx, S, mode) {
  const g = buildRetina(S);
  const { cx, cy, R, disc, macula, segs, lesions } = g;
  ctx.clearRect(0, 0, S, S);
  ctx.save();
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();

  const photo = mode === "photo" || mode === "lesions";
  if (photo) {
    const bg = ctx.createRadialGradient(cx - 0.1 * R, cy, 0, cx, cy, R);
    bg.addColorStop(0, "#e98b45"); bg.addColorStop(0.55, "#c95f27");
    bg.addColorStop(0.88, "#80300f"); bg.addColorStop(1, "#2a0d06");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, S, S);
    const mac = ctx.createRadialGradient(macula.x, macula.y, 0, macula.x, macula.y, R * 0.22);
    mac.addColorStop(0, "rgba(110,35,12,0.55)"); mac.addColorStop(1, "rgba(110,35,12,0)");
    ctx.fillStyle = mac; ctx.fillRect(0, 0, S, S);
  } else {
    ctx.fillStyle = "#0b0f17"; ctx.fillRect(0, 0, S, S);
  }

  ctx.lineCap = "round";
  if (photo) {
    ctx.strokeStyle = "rgba(120,24,10,0.85)";
    segs.forEach((s) => { ctx.lineWidth = s.w; ctx.beginPath(); ctx.moveTo(s.x1, s.y1); ctx.lineTo(s.x2, s.y2); ctx.stroke(); });
    const dg = ctx.createRadialGradient(disc.x, disc.y, 0, disc.x, disc.y, disc.r);
    dg.addColorStop(0, "#fff6d6"); dg.addColorStop(0.7, "#f6c873"); dg.addColorStop(1, "rgba(246,200,115,0)");
    ctx.fillStyle = dg; ctx.beginPath(); ctx.arc(disc.x, disc.y, disc.r * 1.15, 0, Math.PI * 2); ctx.fill();
    if (mode === "photo") {
      lesions.forEach((l) => {
        ctx.fillStyle = l.kind === "ex" ? "rgba(255,226,140,0.9)" : "rgba(110,10,10,0.9)";
        ctx.beginPath(); ctx.arc(l.x, l.y, S * 0.006 * l.s, 0, Math.PI * 2); ctx.fill();
      });
    }
  } else if (mode === "edges") {
    segs.forEach((s) => { ctx.strokeStyle = "#7fb4ff"; ctx.lineWidth = s.w + 1.6; ctx.beginPath(); ctx.moveTo(s.x1, s.y1); ctx.lineTo(s.x2, s.y2); ctx.stroke(); });
    segs.forEach((s) => { ctx.strokeStyle = "#0b0f17"; ctx.lineWidth = Math.max(s.w - 0.4, 0.4); ctx.beginPath(); ctx.moveTo(s.x1, s.y1); ctx.lineTo(s.x2, s.y2); ctx.stroke(); });
    ctx.strokeStyle = "#7fb4ff"; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(disc.x, disc.y, disc.r, 0, Math.PI * 2); ctx.stroke();
  } else if (mode === "vessels") {
    ctx.strokeStyle = "#e7ecf5";
    segs.forEach((s) => { ctx.lineWidth = s.w; ctx.beginPath(); ctx.moveTo(s.x1, s.y1); ctx.lineTo(s.x2, s.y2); ctx.stroke(); });
    ctx.fillStyle = "rgba(231,236,245,0.35)";
    ctx.beginPath(); ctx.arc(disc.x, disc.y, disc.r, 0, Math.PI * 2); ctx.fill();
  }

  if (mode === "lesions") {
    ctx.fillStyle = "rgba(11,15,23,0.62)"; ctx.fillRect(0, 0, S, S);
    lesions.forEach((l) => {
      const rr = S * 0.022 * l.s;
      const glow = ctx.createRadialGradient(l.x, l.y, 0, l.x, l.y, rr * 2.2);
      glow.addColorStop(0, "rgba(255,190,90,0.95)"); glow.addColorStop(1, "rgba(255,190,90,0)");
      ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(l.x, l.y, rr * 2.2, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#ffd36b"; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.arc(l.x, l.y, rr, 0, Math.PI * 2); ctx.stroke();
    });
  }
  ctx.restore();
  if (!photo) {
    ctx.strokeStyle = "rgba(127,180,255,0.35)"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
  }
}

function Retina({ mode = "photo", label }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const S = 360;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = S * dpr; c.height = S * dpr;
    const ctx = c.getContext("2d");
    ctx.scale(dpr, dpr);
    drawRetina(ctx, S, mode);
  }, [mode]);
  return <canvas ref={ref} className="retina" role="img" aria-label={label} />;
}

/* ---------- Small visual pieces ---------- */
function Ring({ value, label, sub, color }) {
  const r = 46, c = 2 * Math.PI * r;
  return (
    <div className="ring">
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle cx="60" cy="60" r={r} fill="none" stroke="var(--line-2)" strokeWidth="10" />
        <motion.circle
          cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: c * (1 - value / 100) }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease }}
          transform="rotate(-90 60 60)"
        />
      </svg>
      <div className="ring-center"><b>{value}%</b></div>
      <p className="ring-label">{label}</p>
      <p className="muted small">{sub}</p>
    </div>
  );
}

function Meter({ level, tone }) {
  return (
    <span className={`meter meter-${tone}`} aria-hidden="true">
      {[1, 2, 3].map((n) => <i key={n} className={n <= level ? "on" : ""} />)}
    </span>
  );
}

function ProsCons({ goodTitle, good, badTitle, bad }) {
  return (
    <div className="grid-2 proscons">
      <Reveal className="card">
        <h3 className="pc-title"><Icon name="check" size={18} className="ok" /> {goodTitle}</h3>
        <ul className="pc-list">
          {good.map(([t, d]) => <li key={t}><b>{t}</b><span className="muted">{d}</span></li>)}
        </ul>
      </Reveal>
      <Reveal i={1} className="card">
        <h3 className="pc-title"><Icon name="cross" size={18} className="bad" /> {badTitle}</h3>
        <ul className="pc-list">
          {bad.map(([t, d]) => <li key={t}><b>{t}</b><span className="muted">{d}</span></li>)}
        </ul>
      </Reveal>
    </div>
  );
}

const A = ({ href, children }) => <a href={href} target="_blank" rel="noreferrer">{children}</a>;

/* ---------- Data ---------- */
const APPLICANT = [
  ["Payment history", "No late payments", 0.55],
  ["Credit utilization", "78% of limit", -0.9],
  ["Length of history", "4 years", 0.25],
  ["Recent inquiries", "5 in 6 months", -0.6],
  ["Income", "$62K / year", 0.3],
];

const COMPARE = [
  { f: "Data type", ml: "Structured, tabular fields", dl: "Unstructured retinal images" },
  { f: "Feature engineering", ml: "Manual, guided by domain experts", dl: "Learned automatically by the network" },
  { f: "Data volume needed", ml: "Moderate", dl: "Very large labeled image sets", mlL: 2, dlL: 3 },
  { f: "Explainability need", ml: "High: specific reasons required by law", dl: "Moderate: accuracy validated in clinical trials", mlL: 3, dlL: 2 },
  { f: "Compute cost", ml: "Low", dl: "High for training", mlL: 1, dlL: 3 },
  { f: "Typical algorithms", ml: "Logistic regression, gradient-boosted trees", dl: "Convolutional neural networks" },
];

const REFS = [
  ["Abràmoff, M. D., Lavin, P. T., Birch, M., Shah, N., & Folk, J. C. (2018). Pivotal trial of an autonomous AI-based diagnostic system for detection of diabetic retinopathy in primary care offices. npj Digital Medicine, 1, 39.", "https://doi.org/10.1038/s41746-018-0040-6"],
  ["Gulshan, V., et al. (2016). Development and validation of a deep learning algorithm for detection of diabetic retinopathy in retinal fundus photographs. JAMA, 316(22), 2402–2410.", "https://doi.org/10.1001/jama.2016.17216"],
  ["IDx. (2018, April 12). FDA permits marketing of IDx-DR for automated detection of diabetic retinopathy in primary care. BioSpace.", "https://www.biospace.com/fda-permits-marketing-of-idx-dr-for-automated-detection-of-diabetic-retinopathy-in-primary-care"],
  ["Jones Day. (2018, May). FDA permits marketing of first autonomous artificial intelligence-based medical device.", "https://www.jonesday.com/en/insights/2018/05/fda-permits-marketing-of-first-autonomous-artifici"],
  ["Optometry Today. (2018, August 31). FDA approves AI for detection of eye disease.", "https://www.aop.org.uk/ot/news/2018/08/31/fda-approves-ai-for-detection-of-eye-disease"],
  ["FICO. Combining machine learning and scorecards to assess credit risk. Computer Weekly.", "https://www.computerweekly.com/blog/Data-Matters/Combining-machine-learning-and-scorecards-to-assess-credit-risk"],
  ["myFICO. What are credit score reason codes?", "https://www.myfico.com/credit-education/blog/reason-codes"],
  ["TechBullion. (2026). How credit scoring algorithms guide U.S. lending.", "https://techbullion.com/how-credit-scoring-algorithms-guide-us-2026/"],
];

/* ---------- Page ---------- */
export default function ArtifactTwoPage({ go, prev, next }) {
  return (
    <div className="artifact-page a2">
      {/* HERO */}
      <section className="a-hero">
        <div className="wrap a-hero-grid">
          <Reveal className="a-hero-copy">
            <p className="a-kicker"><span className="a-no">Artifact 02</span> Research brief · Two real-world cases</p>
            <h1>Machine Learning vs. Deep Learning</h1>
            <p className="lede">
              The right approach depends on the data and the stakes. Traditional machine learning fits
              structured data where every decision must be explained. Deep learning fits images, audio
              and text when there is enough data to learn features on its own.
            </p>
            <div className="a-facts-inline">
              <span><Icon name="eye" size={15} /> For business and product decision-makers</span>
              <span><Icon name="doc" size={15} /> About 5 minutes</span>
            </div>
          </Reveal>

          <Reveal i={1} className="shape-viz" aria-label="Credit data is rows and columns; retinal screening data is pixels">
            <div className="shape-panel ml">
              <p className="shape-label"><Icon name="table" size={15} /> Credit scoring sees rows</p>
              <div className="mini-table" aria-hidden="true">
                {Array.from({ length: 6 }).map((_, r) => (
                  <motion.div
                    key={r}
                    className="mini-row"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + r * 0.08, duration: 0.5, ease }}
                  >
                    {[0.7, 0.45, 0.85, 0.3].map((w, c) => (
                      <span key={c} style={{ width: `${(((r * 7 + c * 13) % 10) / 10) * 40 + w * 50}%` }} />
                    ))}
                  </motion.div>
                ))}
              </div>
              <p className="shape-foot">Each applicant is one row of known fields</p>
            </div>
            <div className="shape-vs" aria-hidden="true">vs</div>
            <div className="shape-panel dl">
              <p className="shape-label"><Icon name="image" size={15} /> Eye screening sees pixels</p>
              <div className="pixel-wrap">
                <Retina mode="photo" label="Illustrated retinal photograph" />
                <span className="pixel-grid" aria-hidden="true" />
              </div>
              <p className="shape-foot">Each photo is millions of raw pixels</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* DECISION GUIDE */}
      <section className="section">
        <div className="wrap">
          <SectionHead
            eyebrow="The short version"
            title="Start with the data, not the model"
            note="This report compares two real-world cases. For each, it explains why the chosen approach fits and why the other one does not."
          />
          <Reveal className="guide">
            <div className="guide-root">
              <Icon name="scale" size={20} />
              <span>What does the data look like, and who needs to understand the result?</span>
            </div>
            <div className="guide-split" aria-hidden="true"><span /><span /></div>
            <div className="guide-lanes">
              {[
                { tone: "ml", steps: ["Rows and columns", "Each decision must be explained"], out: "Traditional machine learning", eg: "Logistic regression, gradient-boosted trees", c: "Case 1: Credit scoring" },
                { tone: "dl", steps: ["Images, audio or text", "Large labeled dataset available"], out: "Deep learning", eg: "Convolutional neural networks", c: "Case 2: Retinal screening" },
              ].map((l, li) => (
                <div key={l.tone} className={`lane lane-${l.tone}`}>
                  {l.steps.map((s, si) => (
                    <motion.div
                      key={s}
                      className="lane-step"
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.15 + li * 0.1 + si * 0.15, duration: 0.5, ease }}
                    >
                      {s}
                    </motion.div>
                  ))}
                  <motion.div
                    className="lane-out"
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + li * 0.1, duration: 0.5, ease }}
                  >
                    <b>{l.out}</b>
                    <span>{l.eg}</span>
                    <em>{l.c}</em>
                  </motion.div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CASE 1 */}
      <section className="section case case-ml">
        <div className="wrap">
          <SectionHead
            eyebrow="Case 1 · Traditional machine learning"
            title="Credit scoring"
            note="A lender must decide whether to approve a loan and estimate how likely the applicant is to default. The inputs are structured fields: payment history, credit utilization, length of credit history, recent inquiries and income."
          />

          <Reveal className="pipeline card">
            <div className="pipe-col">
              <p className="pipe-label">1 · Applicant record</p>
              <dl className="record">
                {APPLICANT.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
              </dl>
            </div>
            <div className="pipe-arrow" aria-hidden="true"><Icon name="arrow" size={20} /></div>
            <div className="pipe-col">
              <p className="pipe-label">2 · Scorecard: what each field adds or subtracts</p>
              <div className="contrib">
                {APPLICANT.map(([k, , w], i) => (
                  <div key={k} className="contrib-row">
                    <span className="contrib-k">{k}</span>
                    <span className="contrib-track">
                      <span className="contrib-axis" />
                      <motion.span
                        className={`contrib-bar ${w > 0 ? "up" : "down"}`}
                        style={w > 0 ? { left: "50%" } : { right: "50%" }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${Math.abs(w) * 50}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease, delay: 0.1 + i * 0.08 }}
                      />
                    </span>
                  </div>
                ))}
                <div className="contrib-legend small muted"><span>Lowers score</span><span>Raises score</span></div>
              </div>
            </div>
            <div className="pipe-arrow" aria-hidden="true"><Icon name="arrow" size={20} /></div>
            <div className="pipe-col">
              <p className="pipe-label">3 · Decision with reasons</p>
              <div className="outcome">
                <span className="outcome-tag">Application declined</span>
                <p className="small muted">Principal reasons given to the applicant:</p>
                <ol>
                  <li>Credit utilization is too high</li>
                  <li>Too many recent credit inquiries</li>
                </ol>
              </div>
            </div>
            <p className="pipe-note small muted">Illustration with a sample applicant. Bar lengths are illustrative, not real scoring weights.</p>
          </Reveal>

          <Reveal className="real-app">
            <p className="eyebrow">Real-world application</p>
            <p>
              Credit risk scorecards, like those behind the FICO Score, take customer characteristics and
              produce a score that reflects the probability of default (<A href="https://www.computerweekly.com/blog/Data-Matters/Combining-machine-learning-and-scorecards-to-assess-credit-risk">Computer Weekly</A>).
              They are typically built with logistic regression on features analysts engineer by hand,
              such as binning utilization into ranges. Many U.S. lenders still run logistic scorecards to
              generate adverse action reasons, even when a gradient-boosted tree model makes the decision
              (<A href="https://techbullion.com/how-credit-scoring-algorithms-guide-us-2026/">TechBullion</A>).
            </p>
          </Reveal>

          <ProsCons
            goodTitle="Why traditional ML fits"
            good={[
              ["The data is already structured.", "Each applicant is one row of meaningful numeric columns. Experts know which features matter, so manual feature selection adds value."],
              ["Explainability is legally required.", <>Under the Equal Credit Opportunity Act and Regulation B, a lender that denies credit must give the specific principal reasons (<A href="https://www.myfico.com/credit-education/blog/reason-codes">myFICO</A>). A scorecard shows exactly how each feature moved the score.</>],
              ["It performs well on tabular data.", "Logistic regression and tree ensembles are strong, fast and easy to monitor, which regulators and model-risk teams expect."],
            ]}
            badTitle="Why deep learning doesn't"
            bad={[
              ["Opacity creates compliance risk.", "A neural network spreads its logic across thousands or millions of weights. The CFPB has said a complex model is no excuse for failing to give specific reasons."],
              ["Little performance gain.", "Deep learning's advantage is learning from raw, unstructured inputs. Credit data has no raw pixels or audio, so the extra complexity rarely pays off."],
              ["Higher cost and fairness risk.", "Neural networks need more data, compute and tuning, and make it harder to detect whether a feature acts as a proxy for a protected characteristic."],
            ]}
          />
        </div>
      </section>

      {/* CASE 2 */}
      <section className="section case case-dl">
        <div className="wrap">
          <SectionHead
            eyebrow="Case 2 · Deep learning"
            title="Diabetic retinopathy screening"
            note="Diabetic retinopathy is a leading cause of blindness. Catching it early means examining retinal photos for tiny lesions, bleeding and swelling, but many patients never get screened because eye specialists are scarce in primary care."
          />

          <Reveal className="pipeline card cnn">
            <div className="cnn-stage">
              <Retina mode="photo" label="Illustrated retinal photograph" />
              <p className="pipe-label">Retinal photo</p>
              <p className="small muted">Taken in a primary care clinic</p>
            </div>
            <div className="pipe-arrow" aria-hidden="true"><Icon name="arrow" size={20} /></div>
            <div className="cnn-layers">
              {[
                ["edges", "Layer 1: Edges", "Outlines and contrast"],
                ["vessels", "Layer 2: Vessels", "Shapes and structures"],
                ["lesions", "Layer 3: Lesions", "Signs of disease"],
              ].map(([m, t, s], i) => (
                <motion.div
                  key={m}
                  className="cnn-stage"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.18, duration: 0.6, ease }}
                >
                  <Retina mode={m} label={`What the network learns at ${t}`} />
                  <p className="pipe-label">{t}</p>
                  <p className="small muted">{s}</p>
                </motion.div>
              ))}
            </div>
            <div className="pipe-arrow" aria-hidden="true"><Icon name="arrow" size={20} /></div>
            <div className="cnn-result">
              <p className="pipe-label">Result in minutes</p>
              <div className="result-opt refer"><Icon name="eye" size={16} /> Refer to an eye specialist</div>
              <span className="small muted">or</span>
              <div className="result-opt clear"><Icon name="check" size={16} /> Negative, rescreen in 12 months</div>
            </div>
            <p className="pipe-note small muted">Illustration of how a convolutional network builds up features layer by layer. Images are drawn, not patient photos.</p>
          </Reveal>

          <Reveal className="real-app">
            <p className="eyebrow">Real-world application</p>
            <p>
              In April 2018 the FDA authorized IDx-DR, the first autonomous AI diagnostic system, to detect
              more than mild diabetic retinopathy in adults with diabetes (<A href="https://www.biospace.com/fda-permits-marketing-of-idx-dr-for-automated-detection-of-diabetic-retinopathy-in-primary-care">BioSpace</A>).
              A primary care clinic photographs the patient's eyes, and within minutes the system reports
              either a referral or a negative result with rescreening in a year (<A href="https://www.jonesday.com/en/insights/2018/05/fda-permits-marketing-of-first-autonomous-artifici">Jones Day</A>).
              Google researchers showed a similar result with a convolutional neural network trained on
              over 100,000 retinal images (Gulshan et al., 2016).
            </p>
          </Reveal>

          <Reveal className="trial card">
            <div className="trial-head">
              <p className="eyebrow">IDx-DR pivotal trial results</p>
              <p className="small muted">Source: <A href="https://www.aop.org.uk/ot/news/2018/08/31/fda-approves-ai-for-detection-of-eye-disease">Optometry Today</A>; Abràmoff et al., 2018</p>
            </div>
            <div className="trial-grid">
              <Ring value={87.2} label="Sensitivity" sub="Share of patients with disease the system caught" color="var(--dl)" />
              <Ring value={90.7} label="Specificity" sub="Share of healthy patients it correctly cleared" color="var(--ml)" />
              <div className="trial-facts">
                <div><b>900</b><span className="muted small">patients in the pivotal trial</span></div>
                <div><b>2018</b><span className="muted small">first FDA authorization of an autonomous AI diagnostic</span></div>
                <div><b>100K+</b><span className="muted small">retinal images used in Google's 2016 study</span></div>
              </div>
            </div>
          </Reveal>

          <ProsCons
            goodTitle="Why deep learning fits"
            good={[
              ["The data is unstructured.", "Each image contains millions of pixels. There is no table of ready-made features to feed a simple model."],
              ["Features are learned automatically.", "Convolutional networks learn their own visual features, from edges to vessels to lesions, so no one has to hand-code what a microaneurysm looks like."],
              ["Large labeled datasets exist.", "Screening programs have produced many images graded by ophthalmologists. Deep learning improves as data grows."],
              ["Accuracy is the top priority.", "A missed case can mean lost vision. Deep learning reaches specialist-level accuracy on image tasks."],
            ]}
            badTitle="Why traditional ML doesn't"
            bad={[
              ["Manual features are a bottleneck.", "Humans would need to define lesion counts, vessel width and color patterns. That is slow, fragile and misses subtle patterns."],
              ["It handles variation poorly.", "Photos vary in lighting, camera, angle and pigmentation. Hand-crafted features tend to break under those changes."],
              ["Lower accuracy on raw images.", "Classical computer-vision pipelines generally fell short of the sensitivity needed for autonomous use."],
            ]}
          />
        </div>
      </section>

      {/* COMPARISON */}
      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="Side by side" title="How the two cases compare" />
          <Reveal className="compare card">
            <div className="cmp-row cmp-head">
              <span />
              <span className="cmp-h ml"><Icon name="table" size={16} /> Credit scoring (ML)</span>
              <span className="cmp-h dl"><Icon name="image" size={16} /> Retinopathy screening (DL)</span>
            </div>
            {COMPARE.map((r) => (
              <div key={r.f} className="cmp-row">
                <span className="cmp-f">{r.f}</span>
                <span className="cmp-v">{r.mlL && <Meter level={r.mlL} tone="ml" />}<span>{r.ml}</span></span>
                <span className="cmp-v">{r.dlL && <Meter level={r.dlL} tone="dl" />}<span>{r.dl}</span></span>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* CONCLUSION */}
      <section className="section">
        <div className="wrap">
          <Reveal className="conclusion">
            <p className="eyebrow">Conclusion</p>
            <p className="muted conclusion-body">
              Neither approach is better in every case. Credit scoring uses structured data and requires
              clear reasons for each decision, so traditional machine learning is the better fit. Retinal
              screening depends on recognizing complex visual patterns in raw images, so deep learning is
              the only approach that reaches the accuracy needed.
            </p>
            <blockquote className="pull">
              As a data analyst, I take from this that the first question is not which model is most
              powerful, but what the data looks like and who needs to understand the result.
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* REFERENCES */}
      <section className="section">
        <div className="wrap">
          <Reveal>
            <details className="refs card">
              <summary><span className="eyebrow">References</span><span className="muted small">{REFS.length} sources</span></summary>
              <ul>
                {REFS.map(([t, u]) => <li key={u}>{t} <A href={u}>{u.replace(/^https?:\/\//, "").split("/")[0]}</A></li>)}
              </ul>
            </details>
          </Reveal>
        </div>
      </section>

      <PageNav prev={prev} next={next} go={go} />
    </div>
  );
}
