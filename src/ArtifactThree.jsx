import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal, SectionHead, Icon, PageNav, ArtifactTemplate, ease } from "./ui.jsx";

const BASE = "/artifact-3";
export const LAB_PDF = `${BASE}/inside-the-mind-of-a-language-model.pdf`;

const STAGES = [
  {
    n: "1",
    name: "Be the Model",
    task: "Finish sentences on gut instinct alone, with no searching and no checking.",
    idea: "Familiar facts sit “in the back of the mind.” Velmora had nothing there to pull from, so holding back was the honest move.",
    figs: "Figures 1–2",
  },
  {
    n: "2",
    name: "Reveal the Mechanism",
    task: "Learn why fluent text isn't the same as true text, then explain it in my own words.",
    idea: "Models, like people, can fill a gap with a confident guess. For a model, the cause is next-token prediction, not real knowledge.",
    figs: "Figures 3–4",
  },
  {
    n: "3",
    name: "Guess the Training Mix",
    task: "Sort 11 kinds of text by how much of each was likely in the training data.",
    idea: "Public material may be in the training data. Private chats and confidential memos should never be assumed to be.",
    figs: "Figures 5–7",
  },
  {
    n: "4",
    name: "Good Fit / Danger Zone",
    task: "Judge 10 real tasks: where an LLM shines, and where it needs a source, a tool or an expert.",
    idea: "The task is the same; what changes is the source.",
    figs: "Figures 7–9",
  },
];

const ROUNDS = [
  { prompt: "The capital of France is ___", answer: "Paris", pattern: 3, note: "Seen countless times. The answer jumps out." },
  { prompt: "Once upon a ___", answer: "time", pattern: 3, note: "A different kind of text, same instant pattern pull." },
  { prompt: "The current president of the small island nation of Velmora, founded in 1998, is ___", answer: "I am not sure", pattern: 0, note: "Velmora doesn't exist. There was nothing to draw on, so I held back." },
];

const MIX = [
  { level: "A lot", tone: "hi", items: ["Wikipedia article", "GitHub README", "Public blog or news article", "Public legal-contract template", "Public-domain literature"] },
  { level: "A little / depends", tone: "mid", items: ["Public Reddit thread", "Full text of a peer-reviewed paper", "Low-resource language conversation"] },
  { level: "Basically none", tone: "lo", items: ["Private text-message conversation", "Company's internal confidential memo", "Today's stock price or weather"] },
];

const TASKS = [
  { t: "Drafting a cover letter", v: "good", tag: "Good Fit, with caveat", r: "Cover letters follow very common patterns, so a model writes them fluently. But it doesn't know my actual experience. If I give it vague input, it may invent achievements or metrics that sound right but aren't mine, so I'd check every personal fact." },
  { t: "Explaining binary search", v: "good", tag: "Good Fit", r: "It's documented thousands of times in textbooks, tutorials, and code, so the patterns are strong. I'd still review any code it writes, because off-by-one errors in the boundaries are a classic mistake." },
  { t: "Current stock price", v: "bad", tag: "Danger Zone", r: "Training data is a snapshot from the past. The model may have seen historical prices, but it can't know today's value. It could still produce a confident-looking number, which is worse than saying “I don't know.” It needs a live data source." },
  { t: "Low-resource language translation", v: "bad", tag: "Danger Zone", r: "There's very little training text in that language, so the patterns are weak. The output might read smoothly to me but be wrong, and I couldn't tell. It needs a native speaker to verify." },
  { t: "Exact multi-digit multiplication", v: "bad", tag: "Danger Zone", r: "The model predicts digits as text patterns rather than actually calculating. As a data analyst, I'd never put a number in a report without checking it in Python, SQL, or a calculator. The same rule applies here." },
  { t: "Summarizing research published last week", v: "bad", tag: "Danger Zone, from memory", r: "The paper came out after the training data was collected. It might summarize a paper that sounds plausible but doesn't exist, which is the Velmora problem again. If I paste in the paper or turn on search, it becomes a Good Fit. The task is the same; what changes is the source." },
  { t: "Legal advice for one person's situation", v: "bad", tag: "Danger Zone", r: "Law depends on jurisdiction, changes over time, and turns on specific facts. Applying it to one person's case is high-stakes. A confident wrong answer could cause real harm, so this needs a licensed attorney." },
  { t: "Poem inspired by a public-domain poet", v: "good", tag: "Good Fit", r: "Creative writing is pure pattern work, and poets like Emily Dickinson or Shakespeare appear heavily in training data. There's no single “correct” answer that could be falsified." },
  { t: "Brainstorming product names", v: "good", tag: "Good Fit, with check", r: "Generating lots of options is a strength. But the model can't verify whether a name is already trademarked, taken as a domain, or means something awkward in another market. The legal and market checks still fall to me." },
  { t: "Recalling a private conversation", v: "bad", tag: "Danger Zone", r: "The model was never given that conversation, so anything it “recalls” would be invented. That's especially risky because it's about real people. If the transcript were supplied, summarizing it would be a different, suitable task." },
];

const FIGS = [
  ["Stage 1 rounds: France, “Once upon a,” Velmora (1 of 2)"],
  ["Stage 1 rounds: France, “Once upon a,” Velmora (2 of 2)"],
  ["Velmora reveal, reflection and Stage 2 mechanism (1 of 2)"],
  ["Velmora reveal, reflection and Stage 2 mechanism (2 of 2)"],
  ["Stage 3 training-mix batches (1 of 2)"],
  ["Stage 3 training-mix batches (2 of 2)"],
  ["Stage 3 reflection and Stage 4 batch 1 (1 of 2)"],
  ["Stage 3 reflection and Stage 4 batch 1 (2 of 2)"],
  ["Stage 4 batch 2 and big-picture takeaway"],
  ["Completion summary and badge"],
].map(([cap], i) => ({ src: `${BASE}/fig-${String(i + 1).padStart(2, "0")}.jpg`, cap, n: i + 1 }));

export function Lightbox({ fig, onClose, onStep }) {
  useEffect(() => {
    if (!fig) return;
    const k = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onStep(1);
      if (e.key === "ArrowLeft") onStep(-1);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [fig, onClose, onStep]);
  return (
    <AnimatePresence>
      {fig && (
        <motion.div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Figure ${fig.n}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.figure
            className="lightbox-fig"
            initial={{ scale: 0.96, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.97 }}
            transition={{ duration: 0.25, ease }}
            onClick={(e) => e.stopPropagation()}
          >
            <img src={fig.src} alt={`Figure ${fig.n}: ${fig.cap}`} />
            <figcaption>
              <span>Figure {fig.n} · {fig.cap}</span>
              <span className="lightbox-ctrl">
                <button type="button" onClick={() => onStep(-1)} aria-label="Previous figure"><Icon name="back" size={16} /></button>
                <button type="button" onClick={() => onStep(1)} aria-label="Next figure"><Icon name="arrow" size={16} /></button>
                <button type="button" onClick={onClose}>Close</button>
              </span>
            </figcaption>
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function ArtifactThreePage({ go, prev, next }) {
  const [open, setOpen] = useState(null);
  const [filter, setFilter] = useState("all");
  const good = TASKS.filter((t) => t.v === "good").length;
  const bad = TASKS.length - good;
  const shown = TASKS.filter((t) => filter === "all" || t.v === filter);
  const step = (d) => setOpen((o) => (o == null ? o : (o + d + FIGS.length) % FIGS.length));

  return (
    <div className="artifact-page a3">
      {/* HERO */}
      <section className="a-hero">
        <div className="wrap a-hero-grid">
          <Reveal className="a-hero-copy">
            <p className="a-kicker"><span className="a-no">Artifact 03</span> Interactive AI lab · Lab notebook</p>
            <h1>Inside the Mind of a Language Model</h1>
            <p className="lede">
              An interactive session with Professor Predict, an AI tutor, on how large language models
              are trained and why they sometimes make things up with total confidence. I played the
              model, learned the mechanism, sorted its likely training data and judged ten real tasks.
            </p>
            <div className="actions">
              <a className="btn btn-primary" href={LAB_PDF} target="_blank" rel="noreferrer">
                Open the full lab notebook <Icon name="ext" size={16} />
              </a>
              <a className="btn btn-ghost" href="#evidence" onClick={(e) => { e.preventDefault(); document.getElementById("evidence")?.scrollIntoView({ behavior: "smooth" }); }}>
                <span>See the evidence</span>
              </a>
            </div>
          </Reveal>
          <Reveal i={1} className="lab-stats">
            {[["4", "learning stages"], ["11", "data sources sorted"], ["10", "tasks judged"], ["1", "badge earned"]].map(([k, v], i) => (
              <motion.div
                key={v}
                className="lab-stat"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.5, ease }}
              >
                <b>{k}</b><span>{v}</span>
              </motion.div>
            ))}
            <div className="lab-takeaway">
              <p className="eyebrow">Key takeaway</p>
              <p>LLMs produce plausible continuations from learned patterns, not verified truth.</p>
            </div>
          </Reveal>
        </div>
      </section>

      <ArtifactTemplate
        title="Inside the Mind of a Language Model: a lab notebook"
        objective="Understand how large language models are trained, why they hallucinate, and which tasks they can be trusted with on their own."
        audience="Non-technical colleagues and managers who use AI tools at work and need to know when to trust the output."
        process={[
          "Played the model: finished sentences on instinct, including a trap question",
          "Learned the mechanism: pretraining, post-training and next-token prediction",
          "Sorted 11 sources by how likely each was in the training data",
          "Judged 10 real tasks as Good Fit or Danger Zone, with written reasoning",
          "Documented the session as a lab notebook with screenshots",
        ]}
        tools={{ chips: ["Claude (Professor Predict tutor)", "Lab notebook (PDF)", "Screenshots as evidence", "React + Framer Motion"] }}
        value="I can tell a team when an AI answer is safe to use and when it needs a live source, a calculator, a human expert or a verification step, which is the habit that keeps confident-but-wrong numbers out of reports."
      />

      {/* PROCESS */}
      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="Process" title="Four stages, one lesson" note="Each stage built on the last, and every response is recorded in the lab notebook." />
          <ol className="stages">
            {STAGES.map((s, i) => (
              <Reveal as="li" key={s.n} i={i} className="stage">
                <span className="stage-n">{s.n}</span>
                <div className="stage-body">
                  <h3>{s.name}</h3>
                  <p className="muted">{s.task}</p>
                  <p className="stage-idea"><Icon name="bolt" size={14} /> {s.idea}</p>
                  <span className="muted small">{s.figs}</span>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* STAGE 1 VISUAL */}
      <section className="section">
        <div className="wrap">
          <SectionHead
            eyebrow="Stage 1 · Be the model"
            title="Three prompts, one trap"
            note="Strong patterns make the answer feel obvious. When there is no pattern to draw on, a model still produces something that sounds right. I didn't."
          />
          <div className="grid-3">
            {ROUNDS.map((r, i) => (
              <Reveal key={r.prompt} i={i} className={`card round ${r.pattern ? "" : "round-trap"}`}>
                <p className="eyebrow">Round {i + 1}{r.pattern ? "" : " · the trap"}</p>
                <p className="round-prompt">“{r.prompt}”</p>
                <p className="round-answer">My answer: <b>{r.answer}</b></p>
                <div className="pattern">
                  <span className="muted small">Pattern in memory</span>
                  <span className="pattern-bar">
                    <motion.span
                      initial={{ width: 0 }}
                      whileInView={{ width: r.pattern ? "100%" : "4%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, ease, delay: 0.2 + i * 0.1 }}
                    />
                  </span>
                  <span className="small">{r.pattern ? "Strong" : "None"}</span>
                </div>
                <p className="muted small">{r.note}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* STAGE 2 MECHANISM */}
      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="Stage 2 · The mechanism" title="Why fluent isn't the same as true" />
          <Reveal className="mech card">
            {[
              ["Pretraining", "Learns one skill over and over: predict the next token from the text before it."],
              ["Post-training", "Learns to follow instructions and sometimes admit uncertainty."],
              ["No built-in fact-checker", "Nothing verifies each sentence against reality."],
            ].map(([t, d], i) => (
              <motion.div
                key={t}
                className="mech-step"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5, ease }}
              >
                <span className="mech-n">{i + 1}</span>
                <b>{t}</b>
                <span className="muted small">{d}</span>
              </motion.div>
            ))}
            <motion.div
              className="mech-out"
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5, ease }}
            >
              <span className="mech-eq">Fluent ≠ verified</span>
              <span className="small">A question shaped like “The president is ___” pulls toward a name-shaped answer, whether or not real knowledge sits behind it.</span>
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* STAGE 3 TRAINING MIX */}
      <section className="section">
        <div className="wrap">
          <SectionHead
            eyebrow="Stage 3 · Guess the training mix"
            title="What a model has likely read, and what it hasn't"
            note="Where the 11 sources landed after discussion with Professor Predict. Exact datasets differ by model and are often not public, so these are broad tendencies."
          />
          <div className="mix">
            {MIX.map((col, ci) => (
              <Reveal key={col.level} i={ci} className={`mix-col mix-${col.tone}`}>
                <div className="mix-head">
                  <span>{col.level}</span>
                  <span className="mix-count">{col.items.length}</span>
                </div>
                <div className="mix-items">
                  {col.items.map((it, k) => (
                    <motion.span
                      key={it}
                      className="mix-item"
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 + ci * 0.1 + k * 0.06, duration: 0.4, ease }}
                    >
                      {it}
                    </motion.span>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="callout">
            <Icon name="shield" size={18} />
            <p><b>What surprised me most:</b> the private-versus-public line. It is the difference between “the model might have seen this” and “the model shouldn't be assumed to know this at all.”</p>
          </Reveal>
        </div>
      </section>

      {/* STAGE 4 MATRIX */}
      <section className="section">
        <div className="wrap">
          <SectionHead
            eyebrow="Stage 4 · Good fit or danger zone"
            title="Ten tasks, judged with my own reasoning"
            note="Assuming no web search, calculator, private database or supplied documents. Reasoning below is quoted from my answers."
          />
          <Reveal className="verdict-bar card">
            <div className="vb-track" role="img" aria-label={`${good} Good Fit, ${bad} Danger Zone`}>
              <motion.span className="vb-good" initial={{ flexGrow: 0 }} whileInView={{ flexGrow: good }} viewport={{ once: true }} transition={{ duration: 1, ease }} />
              <motion.span className="vb-bad" initial={{ flexGrow: 0 }} whileInView={{ flexGrow: bad }} viewport={{ once: true }} transition={{ duration: 1, ease }} />
            </div>
            <div className="vb-legend">
              <span><i className="dot-good" /> {good} Good Fit</span>
              <span><i className="dot-bad" /> {bad} Danger Zone</span>
            </div>
            <div className="filters" role="group" aria-label="Filter tasks">
              {[["all", "All 10"], ["good", "Good Fit"], ["bad", "Danger Zone"]].map(([k, l]) => (
                <button key={k} type="button" className={`filter ${filter === k ? "is-on" : ""}`} aria-pressed={filter === k} onClick={() => setFilter(k)}>{l}</button>
              ))}
            </div>
          </Reveal>
          <motion.div layout className="tasks">
            <AnimatePresence initial={false}>
              {shown.map((t) => (
                <motion.article
                  key={t.t}
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.3, ease }}
                  className={`task task-${t.v}`}
                >
                  <div className="task-top">
                    <h3>{t.t}</h3>
                    <span className={`verdict v-${t.v}`}><Icon name={t.v === "good" ? "check" : "cross"} size={13} /> {t.tag}</span>
                  </div>
                  <p className="muted">{t.r}</p>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
          <Reveal className="conclusion">
            <blockquote className="pull">The task is the same; what changes is the source.</blockquote>
            <p className="muted small">My standout line from Stage 4. Professor Predict called it “better than my answer key.”</p>
          </Reveal>
        </div>
      </section>

      {/* EVIDENCE */}
      <section className="section" id="evidence">
        <div className="wrap">
          <SectionHead
            eyebrow="Evidence"
            title="Screenshots from the session"
            note="Ten figures from the original conversation with Professor Predict. Select one to enlarge."
          />
          <div className="gallery">
            {FIGS.map((f, i) => (
              <Reveal key={f.src} i={i % 4} className="gal-item">
                <button type="button" className="gal-btn" onClick={() => setOpen(i)} aria-label={`Enlarge figure ${f.n}: ${f.cap}`}>
                  <img src={f.src} alt="" loading="lazy" />
                  <span className="gal-zoom"><Icon name="ext" size={14} /></span>
                </button>
                <p className="small"><b>Figure {f.n}</b> <span className="muted">{f.cap}</span></p>
              </Reveal>
            ))}
          </div>

          <Reveal className="badge-card">
            <span className="badge-medal" aria-hidden="true">
              <svg viewBox="0 0 48 48" width="44" height="44"><path d="M14 4h8l4 12-6 2zM34 4h-8l-4 12 6 2z" fill="var(--ml)" /><circle cx="24" cy="30" r="13" fill="var(--accent)" /><path d="M24 22l2.4 5 5.4.6-4 3.7 1.1 5.3L24 34l-4.9 2.6 1.1-5.3-4-3.7 5.4-.6z" fill="#7a5200" /></svg>
            </span>
            <div>
              <p className="eyebrow">Badge unlocked</p>
              <h3>Knows Why the Robot Sometimes Makes Stuff Up</h3>
              <p className="muted">From Professor Predict's completion summary: “You also refused to trust model arithmetic without verifying it in Python, SQL, or a calculator.”</p>
            </div>
            <a className="btn btn-ghost" href={LAB_PDF} target="_blank" rel="noreferrer"><span>Full notebook (PDF)</span> <Icon name="ext" size={15} /></a>
          </Reveal>
        </div>
      </section>

      <Lightbox fig={open == null ? null : FIGS[open]} onClose={() => setOpen(null)} onStep={step} />
      <PageNav prev={prev} next={next} go={go} />
    </div>
  );
}
