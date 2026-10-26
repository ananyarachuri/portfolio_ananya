import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1];
export const COACH_URL = "https://claude.ai/artifact/MtzLyELJ6mFkZUT2bCstWM";

function Reveal({ children, i = 0, className, as = "div" }) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{ y: 18 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.6, ease, delay: i * 0.06 }}
    >
      {children}
    </Tag>
  );
}

function Bar({ file, right }) {
  return (
    <div className="editor-bar">
      <span className="lights" aria-hidden="true"><i /><i /><i /></span>
      <span className="editor-file mono">{file}</span>
      {right && <span className="mono c-dim">{right}</span>}
    </div>
  );
}

function Head({ cmd, title, note }) {
  return (
    <Reveal className="section-head">
      <p className="cmd mono"><span className="c-dim">$</span> {cmd}</p>
      <h2 className="mono">{title}</h2>
      {note && <p className="note">{note}</p>}
    </Reveal>
  );
}

const MODES = [
  {
    key: "mock_interview",
    name: "Mock interview",
    what: "The coach asks one question at a time and scores each answer out of 5.",
    returns: ["A score out of 5", "One thing that worked", "One specific improvement", "A stronger sample opening line"],
    mix: "Behavioral (STAR), technical (SQL, stats, Python in words), case and metrics, plus one GenAI/ML question for AI roles.",
  },
  {
    key: "resume_review",
    name: "Resume bullet review",
    what: "Paste up to 5 bullets and get impact-focused rewrites.",
    returns: ["What's strong", "What's missing: verb, tool, scale, result", "One rewrite per bullet", "[X%] placeholders instead of made-up numbers"],
    mix: "If a metric is missing, the coach asks for the real figure rather than inventing one.",
  },
  {
    key: "job_post_match",
    name: "Job post match",
    what: "Paste a job posting and a few lines about yourself to see where you stand.",
    returns: ["Top 5 required skills", "Strong / Partial / Gap rating per skill", "3 likely interview questions", "2 ways to close the biggest gap"],
    mix: "Ratings are based only on what the user shares, never assumed experience.",
  },
];

const FLOW = [
  { k: "Set target", v: "Role and experience level" },
  { k: "Pick a mode", v: "Interview, resume or job match" },
  { k: "Rules applied", v: "Coaching prompt built for that role and mode" },
  { k: "Claude replies", v: "Streams one focused response at a time" },
  { k: "Scorecard", v: "Scores parsed into an average and bar chart" },
  { k: "Wrap up", v: "Strengths, gaps and next 3 steps" },
];

const RULES = [
  "Invent experience, degrees or numbers the user didn't give it",
  "Promise an offer or quote exact salaries",
  "Ask for SSN, age, visa status, address or other private details",
  "Coach anyone to be dishonest with an employer or cheat in a live interview",
];

const DECISIONS = [
  { t: "One question at a time", d: "Mirrors a real interview and keeps answers focused instead of dumping a list of ten questions." },
  { t: "Machine-readable scores", d: "Every score is written as [Score: X/5], so the page can parse it into a live scorecard." },
  { t: "Short replies", d: "About 200 words per turn keeps feedback readable and actionable." },
  { t: "Fit to the level", d: "Question difficulty follows the selected level, from new grad to senior." },
];

const SAMPLE_SCORES = [3, 3.5, 4, 3.5, 4.5];

export default function ArtifactOnePage({ go }) {
  const avg = (SAMPLE_SCORES.reduce((a, b) => a + b, 0) / SAMPLE_SCORES.length).toFixed(1);

  return (
    <div className="artifact-page">
      {/* HEADER */}
      <section className="a1-hero">
        <div className="wrap a1-hero-grid">
          <Reveal className="a1-intro">
            <p className="cmd mono"><span className="c-dim">$</span> open artifacts/01_workshop-1</p>
            <div className="page-meta mono">
              <span className="badge">Artifact 01</span>
              <span className="c-dim">Workshop 1 · AI Lab</span>
            </div>
            <h1 className="mono page-title">Offer Ready Coach</h1>
            <p className="a1-lede">
              An AI interview-prep coach for people going after Data Analyst and AI roles. It runs mock
              interviews with scored feedback, rewrites resume bullets without inventing numbers, and
              compares a candidate against a real job posting.
            </p>
            <div className="actions">
              <a className="btn btn-primary mono" href={COACH_URL} target="_blank" rel="noreferrer">
                <span className="c-dim">$</span> ./try_the_coach ↗
              </a>
              <button type="button" className="btn btn-ghost mono" onClick={() => go("home")}>
                <span>← home.md</span>
              </button>
            </div>
            <p className="a1-footnote mono c-dim"># the live coach replies when you're signed in to Claude</p>
          </Reveal>

          <Reveal i={1} className="window a1-facts">
            <Bar file="artifact.yaml" />
            <dl className="yaml mono">
              {[
                ["name", "Offer Ready Coach"],
                ["type", "AI chat application"],
                ["audience", "Job seekers targeting Data Analyst & AI roles"],
                ["levels", "New grad → senior, plus career switchers"],
                ["built_with", "Claude · prompt engineering · HTML/CSS/JS"],
                ["session_length", "~15 minutes"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="t-fn">{k}:</dt>
                  <dd className="t-str">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* WHY */}
      <section className="section">
        <div className="wrap">
          <Head
            cmd="cat why.md"
            title="Why I built it"
            note="Interview prep usually means generic question lists with no feedback. Candidates rarely hear how their answer actually landed or what a stronger version sounds like. I wanted a coach that practices the way a real interview works and tells you, honestly, what to fix."
          />
          <div className="a1-audience">
            {[
              ["Who it's for", "Students, early-career analysts, mid-level professionals and career switchers preparing for data and AI interviews."],
              ["What they get", "Scored practice answers, sharper resume bullets and a clear view of skill gaps for a specific job."],
              ["What it shows about me", "Prompt design, responsible-AI guardrails, and turning model output into structured data on screen."],
            ].map(([t, d], i) => (
              <Reveal key={t} i={i} className="window a1-card">
                <div className="a1-card-body">
                  <p className="mono c-cm"># {t.toLowerCase()}</p>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* MODES */}
      <section className="section">
        <div className="wrap">
          <Head cmd="ls modes/" title="Three ways to practice" />
          <div className="a1-modes">
            {MODES.map((m, i) => (
              <Reveal key={m.key} i={i} className="window a1-mode">
                <Bar file={`${m.key}.py`} right={`0${i + 1}`} />
                <div className="a1-card-body">
                  <h3 className="mono">{m.name}</h3>
                  <p>{m.what}</p>
                  <p className="mono c-cm a1-returns-label"># returns</p>
                  <ul className="diff a1-diff">
                    {m.returns.map((r) => (
                      <li key={r}><span className="plus mono" aria-hidden="true">+</span>{r}</li>
                    ))}
                  </ul>
                  <p className="a1-mix">{m.mix}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FLOW */}
      <section className="section">
        <div className="wrap">
          <Head cmd="cat pipeline.txt" title="How a session runs" />
          <ol className="a1-flow">
            {FLOW.map((f, i) => (
              <Reveal as="li" key={f.k} i={i} className="a1-step">
                <span className="a1-step-n mono">{String(i + 1).padStart(2, "0")}</span>
                <b>{f.k}</b>
                <span>{f.v}</span>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* PROMPT DESIGN */}
      <section className="section">
        <div className="wrap">
          <Head
            cmd="cat coach_prompt.txt"
            title="Prompt design"
            note="The coach's behavior comes from one system prompt that's rebuilt every turn with the selected role, level and mode."
          />
          <div className="a1-prompt-grid">
            <Reveal className="window">
              <Bar file="coach_prompt.txt" right="excerpt" />
              <pre className="code a1-code">
{[
  ["You are ", "id"], ['"Offer Ready Coach"', "str"], [", a friendly, direct\njob-search prep coach. The user is preparing for a\n", "id"],
  ["${role}", "num"], [" role at the ", "id"], ["${level}", "num"], [" level.\n\n", "id"],
  ["HOW TO ENGAGE\n", "kw"],
  ["- Ask ONE question at a time and wait.\n- Keep each reply under about 200 words.\n- Show scores as ", "id"], ["[Score: X/5]", "str"], [".\n\n", "id"],
  ["DO NOT\n", "kw"],
  ["- Invent experience, degrees or metrics.\n- Guarantee outcomes or quote exact salaries.\n- Ask for sensitive data (SSN, age, visa status).\n- Coach lying or cheating in a live interview.", "id"],
].map(([t, c], k) => <span key={k} className={`t-${c}`}>{t}</span>)}
              </pre>
            </Reveal>
            <div className="a1-decisions">
              {DECISIONS.map((d, i) => (
                <Reveal key={d.t} i={i} className="a1-decision">
                  <h3 className="mono"><span className="t-kw">def</span> <span className="t-fn">{d.t.toLowerCase().replace(/[^a-z]+/g, "_")}</span>()</h3>
                  <p>{d.d}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SCORECARD + FEEDBACK FORMAT */}
      <section className="section">
        <div className="wrap">
          <Head cmd="cat scorecard.md" title="Feedback you can see" />
          <div className="a1-score-grid">
            <Reveal className="window">
              <Bar file="session_scorecard" right="example data" />
              <div className="a1-score">
                <div className="a1-score-top">
                  <div>
                    <span className="a1-score-num mono t-num">{avg}</span>
                    <span className="mono c-dim"> /5 avg</span>
                  </div>
                  <span className="mono c-dim">{SAMPLE_SCORES.length} answers scored</span>
                </div>
                <div className="a1-bars" role="img" aria-label={`Example scores: ${SAMPLE_SCORES.join(", ")} out of 5`}>
                  {SAMPLE_SCORES.map((s, i) => (
                    <div key={i} className="a1-bar-col">
                      <span className="mono">{s}</span>
                      <motion.div
                        className={`a1-bar ${s >= 4 ? "hi" : ""}`}
                        initial={{ height: "8%" }}
                        whileInView={{ height: `${(s / 5) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, ease, delay: i * 0.08 }}
                      />
                      <span className="mono c-dim">Q{i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal i={1} className="window">
              <Bar file="feedback_format.md" />
              <div className="a1-card-body">
                <p className="a1-q">
                  <span className="mono t-kw">Q:</span> Tell me about a time your analysis changed a business
                  decision. What data did you use, and how did you know it worked?
                </p>
                <p className="mono c-cm"># every answer comes back with</p>
                <ul className="a1-format">
                  <li><span className="mono t-str">[Score: X/5]</span> shown as a 5-step meter</li>
                  <li><span className="mono t-fn">worked</span> one thing the answer did well</li>
                  <li><span className="mono t-fn">improve</span> one specific fix</li>
                  <li><span className="mono t-fn">stronger_open</span> a better first line to borrow</li>
                </ul>
                <p className="a1-mix">After five questions, or when the user is done, the coach writes a session summary with strengths, things to work on and the next three steps.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* GUARDRAILS */}
      <section className="section">
        <div className="wrap">
          <Head
            cmd="cat guardrails.md"
            title="Responsible by design"
            note="A career coach handles personal stories and resumes, so the limits are written into the prompt and shown to the user."
          />
          <Reveal className="window">
            <Bar file="guardrails.md" right={`${RULES.length} rules`} />
            <ul className="a1-rules">
              {RULES.map((r) => (
                <li key={r}><span className="mono a1-minus" aria-hidden="true">−</span>{r}</li>
              ))}
              <li className="a1-rule-note"><span className="mono t-str" aria-hidden="true">i</span>The input box reminds users to remove names, emails and phone numbers before pasting a resume.</li>
            </ul>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="wrap">
          <Reveal className="window terminal">
            <Bar file="try.sh — zsh" />
            <div className="terminal-body">
              <p className="mono"><span className="c-str">~</span> <span className="c-dim">$</span> ./offer_ready_coach --role "Data Analyst with AI / ML"</p>
              <h2 className="mono">Practice a mock interview in about 15 minutes.</h2>
              <div className="actions">
                <a className="btn btn-primary mono" href={COACH_URL} target="_blank" rel="noreferrer">
                  <span>open the live coach ↗</span>
                </a>
                <button type="button" className="btn btn-ghost mono" onClick={() => go("home")}>
                  <span>← back to home.md</span>
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
