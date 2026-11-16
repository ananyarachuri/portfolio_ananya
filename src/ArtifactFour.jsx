import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal, SectionHead, Icon, PageNav, ArtifactTemplate, ease } from "./ui.jsx";
import { Lightbox } from "./ArtifactThree.jsx";

const BASE = "/artifact-4";
const CASE_PDF = `${BASE}/when-the-data-fights-back.pdf`;

/* ---------- Scenario content (answers quoted from the case file) ---------- */
const SCENARIOS = [
  {
    id: "s1",
    no: "1",
    stage: "Before training",
    name: "Data quality & cleaning",
    org: "ReviewPulse",
    brief: "800,000 messy customer reviews: exact and near-duplicates, missing fields, mixed formats and languages, emoji-only reviews, bot spam, and sentiment labels partly derived from star ratings. The team wants to train fast.",
    qa: [
      ["What would you do before training, in what order, and why does the order matter?", "I'd first check where the data came from, clean it, look for bias, and then split it before training, because skipping or mixing up these steps could lead to inaccurate or unfair results.", "independent"],
      ["Emoji-only and non-English reviews: remove, keep, or something else?", "I'd keep both because emojis can express emotions and non-English reviews offer valuable perspectives; I'd just process emojis properly and translate or use multilingual tools so we don't lose useful information or introduce bias.", "probe"],
      ["What happens if near-duplicates land in both training and test sets?", "The model might look more accurate than it really is because it has already seen similar reviews, so I'd check for near-duplicates and group them together before splitting the data into training and test sets.", "probe"],
      ["How would you check that cleaning improved the data rather than quietly changing whose reviews are represented?", "I'd compare the data before and after cleaning to see what changed, especially the languages, review types, and sentiment distribution, so I can make sure I improved the quality without leaving certain groups out.", "probe"],
    ],
    idea: "Unusual isn't invalid. Cleaning decides whose voice the model hears, and duplicates that leak across splits make the test set lie.",
    coach: "Star ratings don't always match the review text, so a sample of labels deserves a human spot-check. Keep an untouched raw copy and document every cleaning decision.",
  },
  {
    id: "s2",
    no: "2",
    stage: "Before scaling",
    name: "Bias, shift & responsible scaling",
    org: "TalentBridge",
    brief: "A résumé screener trained on ten years of one company's applications and hiring decisions. Strong on held-out historical data. Now headed to a country the company has never operated in, at ten times the volume.",
    qa: [
      ["What risks do you see, and what evidence would you require before scaling?", "I'd be worried about the model carrying old hiring biases into a completely new country and struggling with more applications. Before scaling, I'd test it on local data, check for unfair decisions, and make sure it can handle the extra workload.", "independent"],
      ["Is “hired in the past” the same as “would perform well in the job”?", "No, getting hired doesn't necessarily mean someone would perform well at the job. The model might have learned the company's past hiring preferences and biases rather than what actually makes someone a good employee.", "probe"],
      ["Could a 90% overall accuracy hide a problem for one group? Which error worries you most?", "Yes, a high accuracy score could hide unfair treatment of certain groups, so I'd compare rejection rates and error rates across different applicants. False negatives worry me most because qualified people could lose job opportunities without even getting a fair chance.", "probe"],
      ["What would a safe rollout look like, and what would you keep watching?", "I'd start with a small pilot where recruiters review every AI decision and applicants can appeal rejections. After launch, I'd keep checking accuracy, unfair rejection rates across groups, and applicant feedback, and pause the system if serious issues appear.", "probe"],
    ],
    idea: "A historical label measures history. Good scores on yesterday's data are not a passport to a new country.",
    coach: "Résumé formats and credentials in a new country may look nothing like the training data, and some features can act as proxies for background. At 10× volume, reviewing every decision becomes a staffing problem, so decide which decisions still get human review.",
  },
  {
    id: "s3",
    no: "3",
    stage: "Before sharing",
    name: "Privacy, security & governance",
    org: "Riverbend + Lakeside",
    brief: "Two hospitals want a shared diagnostic model. Each dataset is too small alone, records are sensitive, coding practices differ, and neither side will transfer raw records into the other's systems.",
    qa: [
      ["What collaboration approach would protect patients and produce a trustworthy model?", "I'd have hospitals work together using federated learning so patient data stays private while improving the model. I'd also make sure there are strong privacy protections, bias checks, and proper testing before using it on real patients.", "independent"],
      ["Raw records stay local, but something still travels. Could it reveal anything about patients?", "Instead of patient records, hospitals share model updates like weights or gradients, but those could still reveal sensitive information about patients. That's why I'd use encryption, secure aggregation, and differential privacy to reduce the risk.", "probe"],
      ["Given different coding practices, could pooling make the model worse? How would you test it?", "I'd compare how both hospitals collect, label, and format their data to make sure they're consistent. Combining them could make the model worse if the data is too different, so I'd test it separately on each hospital's data and compare accuracy, bias, and performance against their original models.", "probe"],
      ["Who decides how the model and data are used, and what happens when the collaboration ends?", "I'd have both hospitals agree on the rules with input from doctors, privacy experts, and patient representatives, including who can access and use the model. They should also agree upfront on what gets deleted, retained, or shared when the collaboration ends.", "probe"],
    ],
    idea: "Federated learning changes what moves, not whether risk exists. Trust takes layers: privacy, security, and people with a say.",
    coach: "Differential privacy adds noise, so stronger privacy can reduce accuracy, especially for rare conditions or small patient groups, which are the cases a diagnostic model often matters most for.",
  },
];

const LEDGER = [
  { q: "S1 · Emoji & non-English reviews", call: "Keep & process", type: "action", r: "Emojis can express emotions and non-English reviews offer valuable perspectives… so we don't lose useful information or introduce bias." },
  { q: "S1 · Near-duplicates", call: "Group before split", type: "risk", r: "The model might look more accurate than it really is because it has already seen similar reviews." },
  { q: "S1 · Did cleaning help?", call: "Before/after compare", type: "check", r: "Especially the languages, review types, and sentiment distribution… without leaving certain groups out." },
  { q: "S2 · What the label measures", call: "Past preference", type: "risk", r: "The model might have learned the company's past hiring preferences and biases rather than what actually makes someone a good employee." },
  { q: "S2 · Hidden unfairness", call: "Subgroup error rates", type: "check", r: "False negatives worry me most because qualified people could lose job opportunities without even getting a fair chance." },
  { q: "S2 · Rollout", call: "Pilot + appeals + pause", type: "action", r: "Recruiters review every AI decision and applicants can appeal rejections… pause the system if serious issues appear." },
  { q: "S3 · Collaboration design", call: "Federated learning", type: "action", r: "Hospitals share model updates like weights or gradients, but those could still reveal sensitive information about patients." },
  { q: "S3 · Safeguards", call: "Layered", type: "action", r: "Encryption, secure aggregation, and differential privacy to reduce the risk." },
  { q: "S3 · Compatibility", call: "Per-site testing", type: "check", r: "Test it separately on each hospital's data and compare… against their original models." },
  { q: "S3 · Governance", call: "Shared rules", type: "action", r: "Input from doctors, privacy experts, and patient representatives… what gets deleted, retained, or shared when the collaboration ends." },
];

const FIGS = [
  "Session opening and Scenario 1 prompt with my first answer",
  "Scenario 1 follow-ups: emoji/non-English reviews and near-duplicate leakage",
  "Scenario 1 validation answer, feedback and takeaway",
  "Scenario 2 follow-ups: subgroup error rates and safe rollout",
  "Scenario 2 feedback and takeaway",
  "Scenario 3 prompt, federated learning proposal and update-leakage follow-up",
  "Scenario 3 feedback and the cross-scenario synthesis",
].map((cap, i) => ({ src: `${BASE}/fig-${String(i + 1).padStart(2, "0")}.jpg`, cap, n: i + 1 }));

/* ---------- Scenario diagrams ---------- */
function CleaningFlow() {
  const steps = [
    ["Check provenance", "Where did the reviews come from?"],
    ["Clean, keep the unusual", "Process emoji, translate non-English"],
    ["Group near-duplicates", "So copies can't straddle the split"],
    ["Split train / test", "Only after grouping"],
    ["Validate", "Compare languages, types, sentiment before vs after"],
  ];
  return (
    <div className="flow4">
      {steps.map(([t, d], i) => (
        <motion.div
          key={t}
          className="flow4-step"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.45, ease }}
        >
          <span className="flow4-n">{i + 1}</span>
          <b>{t}</b>
          <span className="muted small">{d}</span>
        </motion.div>
      ))}
      <div className="leak">
        <p className="eyebrow">Why grouping comes first</p>
        <div className="leak-grid">
          {[
            { t: "Split first", bad: true, note: "Near-copies sit in both sets, so the test set flatters the model." },
            { t: "Group, then split", bad: false, note: "Each group of copies stays on one side, so the score is honest." },
          ].map((c) => (
            <div key={c.t} className={`leak-case ${c.bad ? "is-bad" : "is-good"}`}>
              <span className="leak-title">{c.bad ? <Icon name="cross" size={14} /> : <Icon name="check" size={14} />} {c.t}</span>
              <div className="leak-sets" aria-hidden="true">
                <span className="leak-set"><em>Train</em>{[0, 1, 2, 3, 4].map((k) => <i key={k} className={k === 1 || k === 3 ? "dup" : ""} />)}</span>
                <span className="leak-set"><em>Test</em>{[0, 1, 2].map((k) => <i key={k} className={c.bad && k < 2 ? "dup" : ""} />)}</span>
              </div>
              <span className="small muted">{c.note}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ScalingVisual() {
  const ladder = ["Small pilot", "Recruiters review every decision", "Applicants can appeal", "Monitor rejection rates by group", "Pause if serious issues appear"];
  return (
    <div className="scale-viz">
      <div className="acc">
        <p className="eyebrow">Why one accuracy number isn't enough</p>
        <div className="acc-row"><span>Overall</span><span className="acc-track"><motion.span className="acc-fill" initial={{ width: 0 }} whileInView={{ width: "90%" }} viewport={{ once: true }} transition={{ duration: 1, ease }} /></span><b>90%</b></div>
        <div className="acc-row"><span>Group A</span><span className="acc-track"><motion.span className="acc-fill" initial={{ width: 0 }} whileInView={{ width: "94%" }} viewport={{ once: true }} transition={{ duration: 1, ease, delay: 0.15 }} /></span><b className="muted">higher</b></div>
        <div className="acc-row"><span>Group B</span><span className="acc-track"><motion.span className="acc-fill warn" initial={{ width: 0 }} whileInView={{ width: "68%" }} viewport={{ once: true }} transition={{ duration: 1, ease, delay: 0.3 }} /></span><b className="warn-t">lower</b></div>
        <p className="small muted">Illustration: a strong overall score can hide a group that is wrongly rejected more often. The coach set the 90% figure; group values are hypothetical.</p>
      </div>
      <div className="ladder">
        <p className="eyebrow">My rollout plan</p>
        <ol>
          {ladder.map((l, i) => (
            <motion.li
              key={l}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4, ease }}
              className={i === ladder.length - 1 ? "is-stop" : ""}
            >
              {l}
            </motion.li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function FederatedVisual() {
  return (
    <div className="fed">
      <div className="fed-diagram" role="img" aria-label="Two hospitals keep raw records local and send protected model updates to a shared model">
        {["Riverbend Hospital", "Lakeside Medical Center"].map((h) => (
          <div key={h} className="fed-site">
            <b>{h}</b>
            <span className="fed-local"><Icon name="shield" size={14} /> Raw records stay here</span>
            <span className="small muted">Tested on its own data</span>
          </div>
        ))}
        {[0, 1].map((k) => (
          <motion.div
            key={k}
            className="fed-flow"
            initial={{ scaleY: 0.2 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease, delay: k * 0.1 }}
          >
            <span className="fed-line" aria-hidden="true" />
            <em>model updates only</em>
          </motion.div>
        ))}
        <div className="fed-center">
          <b>Shared model</b>
          <span className="small">Learns from both sites</span>
        </div>
      </div>
      <div className="fed-layers">
        {[
          ["Privacy", "Differential privacy", "ml"],
          ["Security", "Encryption, secure aggregation", "dl"],
          ["Governance", "Doctors, privacy experts, patient representatives; deletion and retention terms", "acc"],
        ].map(([k, v, t], i) => (
          <motion.div
            key={k}
            className={`fed-layer t-${t}`}
            initial={{ y: 8 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.12, duration: 0.45, ease }}
          >
            <b>{k}</b><span>{v}</span>
          </motion.div>
        ))}
      </div>
      <p className="small muted">Updates like weights or gradients can still leak patient information, which is why the plan layers all three.</p>
    </div>
  );
}

const DIAGRAMS = { s1: CleaningFlow, s2: ScalingVisual, s3: FederatedVisual };

/* ---------- Page ---------- */
export default function ArtifactFourPage({ go, prev, next }) {
  const [active, setActive] = useState("s1");
  const [open, setOpen] = useState(null);
  const [type, setType] = useState("all");
  const sc = SCENARIOS.find((s) => s.id === active);
  const Diagram = DIAGRAMS[active];
  const step = (d) => setOpen((o) => (o == null ? o : (o + d + FIGS.length) % FIGS.length));
  const ledger = LEDGER.filter((l) => type === "all" || l.type === type);
  const indep = SCENARIOS.reduce((a, s) => a + s.qa.filter((q) => q[2] === "independent").length, 0);
  const probed = SCENARIOS.reduce((a, s) => a + s.qa.filter((q) => q[2] === "probe").length, 0);

  return (
    <div className="artifact-page a4">
      {/* HERO */}
      <section className="a-hero">
        <div className="wrap a-hero-grid">
          <Reveal className="a-hero-copy">
            <p className="a-kicker"><span className="a-no">Artifact 4</span> Coached case study · AIML-500 Machine Learning Fundamentals</p>
            <h1>When the Data Fights Back</h1>
            <p className="lede">
              A coached session on three real machine-learning data problems: cleaning 800,000 messy
              reviews, scaling a biased résumé screener to a new country, and letting two hospitals build
              a model together without sharing patient records.
            </p>
            <div className="actions">
              <a className="btn btn-primary" href={CASE_PDF} target="_blank" rel="noreferrer">
                Open the full case file <Icon name="ext" size={16} />
              </a>
              <a className="btn btn-ghost" href="#a4-evidence" onClick={(e) => { e.preventDefault(); document.getElementById("a4-evidence")?.scrollIntoView({ behavior: "smooth" }); }}>
                <span>See the evidence</span>
              </a>
            </div>
          </Reveal>
          <Reveal i={1} className="lab-stats">
            {[["3", "scenarios cleared"], ["12", "decisions defended"], ["9", "probes answered"], ["1", "practice summary"]].map(([k, v], i) => (
              <motion.div key={v} className="lab-stat" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.08, duration: 0.5, ease }}>
                <b>{k}</b><span>{v}</span>
              </motion.div>
            ))}
            <div className="lab-takeaway">
              <p className="eyebrow">Key takeaway</p>
              <p>Every data decision is also a decision about people. Good ML means validating those choices, not assuming them.</p>
            </div>
          </Reveal>
        </div>
      </section>

      <ArtifactTemplate
        title="When the Data Fights Back: a machine-learning case file"
        objective="Apply machine-learning fundamentals to three real data challenges: data quality, bias and distribution shift, and privacy-safe data sharing."
        audience="Data and product teams about to train, scale or share a model, and the hiring managers who need to trust how I handle data risk."
        process={[
          "Worked through three scenarios with an AI coach, one decision at a time",
          "Gave a first answer independently, then defended it under follow-up probes",
          "Recorded every call and my reasoning in a decision ledger",
          "Collected the coach's feedback and a practice summary",
          "Wrote a reflection and documented the session as a case file",
        ]}
        tools={{ chips: ["Claude (Data Challenge Scenarios Coach)", "Case file (PDF)", "Screenshots as evidence", "React + Framer Motion"] }}
        value="Before a model is trained, scaled or shared, I can name what could go wrong, who it would hurt, and how to check it, which is the difference between a model that scores well and one a team can trust."
      />

      {/* LIFECYCLE */}
      <section className="section">
        <div className="wrap">
          <SectionHead
            eyebrow="How the three cases connect"
            title="One lifecycle, three checkpoints"
            note="Each scenario is a moment where a team is tempted to move fast. Select one to see the case, the questions, my answers and the coach's feedback."
          />
          <div className="life" role="tablist" aria-label="Scenarios">
            {SCENARIOS.map((s, i) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={active === s.id}
                className={`life-step ${active === s.id ? "is-on" : ""}`}
                onClick={() => setActive(s.id)}
              >
                {active === s.id && <motion.span layoutId="life-pill" className="life-pill" transition={{ type: "spring", stiffness: 380, damping: 34 }} />}
                <span className="life-stage">{s.stage}</span>
                <span className="life-name"><span className="life-no">{s.no}</span>{s.name}</span>
                <span className="life-org">{s.org}</span>
                {i < SCENARIOS.length - 1 && <span className="life-arrow" aria-hidden="true"><Icon name="arrow" size={16} /></span>}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={sc.id}
              className="scn"
              role="tabpanel"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease }}
            >
              <div className="scn-case card">
                <p className="eyebrow">The case · {sc.org}</p>
                <p>{sc.brief}</p>
              </div>
              <div className="card scn-diagram"><Diagram /></div>
              <div className="qa">
                {sc.qa.map(([q, a, kind], i) => (
                  <div key={i} className="qa-pair">
                    <div className="qa-q"><span className="qa-who">Coach asked</span>{q}</div>
                    <div className="qa-a">
                      <span className="qa-who">My answer <span className={`qa-tag ${kind}`}>{kind === "independent" ? "Independent" : "After probe"}</span></span>
                      {a}
                    </div>
                  </div>
                ))}
              </div>
              <div className="scn-foot">
                <div className="stage-idea"><Icon name="bolt" size={14} /> <span><b>Key idea.</b> {sc.idea}</span></div>
                <div className="coach-note"><span className="eyebrow">Coach feedback</span><p>{sc.coach}</p></div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* LEDGER */}
      <section className="section">
        <div className="wrap">
          <SectionHead
            eyebrow="Decision ledger"
            title="Every call I made, sorted by type"
            note="My reasoning, quoted from the session. Action is what I'd do, Risk is what could go wrong, Check is how I'd verify it."
          />
          <div className="filters ledger-filters" role="group" aria-label="Filter decisions">
            {[["all", "All"], ["action", "Action"], ["risk", "Risk"], ["check", "Check"]].map(([k, l]) => (
              <button key={k} type="button" className={`filter ${type === k ? "is-on" : ""}`} aria-pressed={type === k} onClick={() => setType(k)}>
                {l} <span className="filter-n">{k === "all" ? LEDGER.length : LEDGER.filter((x) => x.type === k).length}</span>
              </button>
            ))}
          </div>
          <motion.div layout className="ledger">
            <AnimatePresence initial={false}>
              {ledger.map((l) => (
                <motion.article
                  key={l.q}
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.3, ease }}
                  className={`ledger-item lt-${l.type}`}
                >
                  <div className="ledger-top">
                    <span className="muted small">{l.q}</span>
                    <span className={`ledger-call lc-${l.type}`}>{l.call}</span>
                  </div>
                  <p>“{l.r}”</p>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
          <Reveal className="conclusion">
            <blockquote className="pull">“Qualified people could lose job opportunities without even getting a fair chance.”</blockquote>
            <p className="muted small">My standout line, from Scenario 2.</p>
          </Reveal>
        </div>
      </section>

      {/* FEEDBACK */}
      <section className="section">
        <div className="wrap">
          <SectionHead
            eyebrow="Feedback and growth"
            title="Where my thinking started, and where the probes took it"
            note="I answered each scenario's first question on my own. The coach then probed nine times, and my most specific reasoning came after those follow-ups."
          />
          <div className="grid-2">
            <Reveal className="card">
              <p className="eyebrow">My answers</p>
              <div className="probe-bar" role="img" aria-label={`${indep} independent answers, ${probed} after probes`}>
                <motion.span className="pb-ind" initial={{ flexGrow: 0 }} whileInView={{ flexGrow: indep }} viewport={{ once: true }} transition={{ duration: 0.9, ease }}>{indep}</motion.span>
                <motion.span className="pb-pro" initial={{ flexGrow: 0 }} whileInView={{ flexGrow: probed }} viewport={{ once: true }} transition={{ duration: 0.9, ease }}>{probed}</motion.span>
              </div>
              <div className="vb-legend"><span><i className="dot-ind" /> Independent</span><span><i className="dot-pro" /> After a probe</span></div>
              <div className="shift">
                <p className="eyebrow">The moment my thinking changed</p>
                <div className="shift-row">
                  <span className="shift-before">“Federated learning so patient data stays private”</span>
                  <Icon name="arrow" size={16} />
                  <span className="shift-after">Shared gradients can still leak information, so privacy has to be layered, not assumed</span>
                </div>
              </div>
            </Reveal>
            <Reveal i={1} className="card">
              <p className="eyebrow">From the coach's practice summary</p>
              <ul className="checklist">
                <li><Icon name="check" size={15} className="ok" />Consistently linked metrics to affected people</li>
                <li><Icon name="check" size={15} className="ok" />Built layered safeguards rather than relying on one technique</li>
              </ul>
              <p className="eyebrow">Area to keep developing</p>
              <ul className="crosslist">
                <li><Icon name="arrow" size={15} className="dl-t" />Opening answers were high-level; the most specific reasoning came after follow-ups</li>
                <li><Icon name="arrow" size={15} className="dl-t" />Label quality, such as whether star ratings reflect real sentiment, was not addressed</li>
              </ul>
              <div className="next-q">
                <span className="eyebrow">Practical next step</span>
                <p>Before proposing a fix, ask: “What does this label actually measure, and how could it be wrong?”</p>
              </div>
              <p className="small muted">AI-generated practice summary, not an instructor grade.</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* EVIDENCE */}
      <section className="section" id="a4-evidence">
        <div className="wrap">
          <SectionHead eyebrow="Evidence" title="Screenshots from the session" note="Seven figures captured from the live coaching conversation, in order. Select one to enlarge." />
          <div className="gallery gallery-7">
            {FIGS.map((f, i) => (
              <Reveal key={f.src} i={i % 4} className="gal-item">
                <button type="button" className="gal-btn wide" onClick={() => setOpen(i)} aria-label={`Enlarge figure ${f.n}: ${f.cap}`}>
                  <img src={f.src} alt="" loading="lazy" />
                  <span className="gal-zoom"><Icon name="ext" size={14} /></span>
                </button>
                <p className="small"><b>Figure {f.n}</b> <span className="muted">{f.cap}</span></p>
              </Reveal>
            ))}
          </div>
          <Reveal className="badge-card">
            <span className="badge-medal" aria-hidden="true"><Icon name="doc" size={28} /></span>
            <div>
              <p className="eyebrow">Full case file</p>
              <h3>12 pages: rubric evidence map, all three scenarios, screenshots, decision ledger, coach summary and reflection</h3>
            </div>
            <a className="btn btn-ghost" href={CASE_PDF} target="_blank" rel="noreferrer"><span>Open PDF</span> <Icon name="ext" size={15} /></a>
          </Reveal>
        </div>
      </section>

      <Lightbox fig={open == null ? null : FIGS[open]} onClose={() => setOpen(null)} onStep={step} />
      <PageNav prev={prev} next={next} go={go} />
    </div>
  );
}
