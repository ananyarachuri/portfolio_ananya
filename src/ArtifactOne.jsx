import { motion } from "framer-motion";
import { Reveal, SectionHead, Icon, PageNav, ease } from "./ui.jsx";

export const COACH_URL = "https://claude.ai/artifact/MtzLyELJ6mFkZUT2bCstWM";

const MODES = [
  {
    icon: "chat",
    name: "Mock interview",
    what: "The coach asks one question at a time and scores each answer out of 5.",
    returns: ["A score out of 5", "One thing that worked", "One specific improvement", "A stronger opening line"],
    note: "Mixes behavioral, technical, case and GenAI questions, matched to the candidate's level.",
  },
  {
    icon: "doc",
    name: "Resume bullet review",
    what: "Paste up to 5 bullets and get impact-focused rewrites.",
    returns: ["What's already strong", "What's missing: verb, tool, scale, result", "One rewrite per bullet", "Placeholders instead of made-up numbers"],
    note: "If a metric is missing, the coach asks for the real figure instead of inventing one.",
  },
  {
    icon: "target",
    name: "Job post match",
    what: "Paste a job posting and a few lines about yourself to see where you stand.",
    returns: ["Top 5 required skills", "Strong, Partial or Gap for each", "3 likely interview questions", "2 ways to close the biggest gap"],
    note: "Ratings use only what the candidate shares, never assumed experience.",
  },
];

const FLOW = [
  ["Set target", "Role and experience level"],
  ["Pick a mode", "Interview, resume or job match"],
  ["Rules applied", "Coaching prompt built for that role and mode"],
  ["Coach replies", "One focused response at a time"],
  ["Scorecard", "Scores become an average and a chart"],
  ["Wrap up", "Strengths, gaps and next 3 steps"],
];

const DECISIONS = [
  ["One question at a time", "Mirrors a real interview and keeps answers focused instead of listing ten questions at once."],
  ["Scores the page can read", "Every score is written as [Score: X/5], so the page turns it into a live scorecard."],
  ["Short replies", "About 200 words per turn keeps feedback readable and actionable."],
  ["Fit to the level", "Question difficulty follows the selected level, from new grad to senior."],
];

const RULES = [
  "Invent experience, degrees or numbers the user didn't give it",
  "Promise an offer or quote exact salaries",
  "Ask for SSN, age, visa status, address or other private details",
  "Coach anyone to be dishonest or cheat in a live interview",
];

const SAMPLE_SCORES = [3, 3.5, 4, 3.5, 4.5];

export default function ArtifactOnePage({ go, prev, next }) {
  const avg = (SAMPLE_SCORES.reduce((a, b) => a + b, 0) / SAMPLE_SCORES.length).toFixed(1);

  return (
    <div className="artifact-page">
      <section className="a-hero">
        <div className="wrap a-hero-grid">
          <Reveal className="a-hero-copy">
            <p className="a-kicker"><span className="a-no">Artifact 01</span> AI chat application · Workshop 1 AI Lab</p>
            <h1>Offer Ready Coach</h1>
            <p className="lede">
              An AI interview-prep coach for people going after Data Analyst and AI roles. It runs mock
              interviews with scored feedback, rewrites resume bullets without inventing numbers, and
              compares a candidate against a real job posting.
            </p>
            <div className="actions">
              <a className="btn btn-primary" href={COACH_URL} target="_blank" rel="noreferrer">
                Try the live coach <Icon name="ext" size={16} />
              </a>
            </div>
            <p className="muted small">The live coach replies when you're signed in to Claude.</p>
          </Reveal>
          <Reveal i={1} className="card facts">
            {[
              ["Audience", "Job seekers targeting Data Analyst and AI roles"],
              ["Levels", "New grad to senior, plus career switchers"],
              ["Built with", "Claude, prompt engineering, HTML/CSS/JS"],
              ["Session", "About 15 minutes"],
            ].map(([k, v]) => (
              <div key={k} className="fact-row"><span className="fact-k">{k}</span><span>{v}</span></div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SectionHead
            eyebrow="Why I built it"
            title="Practice that tells you how your answer landed"
            note="Interview prep usually means generic question lists with no feedback. Candidates rarely hear how their answer came across or what a stronger version sounds like. I wanted a coach that practices the way a real interview works and says honestly what to fix."
          />
          <div className="grid-3">
            {[
              ["Who it's for", "Students, early-career analysts, mid-level professionals and career switchers preparing for data and AI interviews."],
              ["What they get", "Scored practice answers, sharper resume bullets and a clear view of skill gaps for a specific job."],
              ["What it shows about me", "Prompt design, responsible-AI guardrails, and turning model output into structured data on screen."],
            ].map(([t, d], i) => (
              <Reveal key={t} i={i} className="card">
                <h3>{t}</h3>
                <p className="muted">{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="Features" title="Three ways to practice" />
          <div className="grid-3">
            {MODES.map((m, i) => (
              <Reveal key={m.name} i={i} className="card mode">
                <span className="icon-tile"><Icon name={m.icon} size={20} /></span>
                <h3>{m.name}</h3>
                <p className="muted">{m.what}</p>
                <ul className="checklist">
                  {m.returns.map((r) => <li key={r}><Icon name="check" size={15} className="ok" />{r}</li>)}
                </ul>
                <p className="muted small mode-note">{m.note}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="How it works" title="One session, start to finish" />
          <ol className="flow">
            {FLOW.map(([k, v], i) => (
              <Reveal as="li" key={k} i={i} className="flow-step">
                <span className="flow-n">{i + 1}</span>
                <b>{k}</b>
                <span className="muted small">{v}</span>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SectionHead
            eyebrow="Prompt design"
            title="The rules behind the coach"
            note="One set of instructions, rebuilt every turn with the selected role, level and mode, shapes how the coach behaves."
          />
          <div className="split">
            <Reveal className="card quote-block">
              <p className="eyebrow">Excerpt from the coach's instructions</p>
              <blockquote>
                <p>You are "Offer Ready Coach", a friendly, direct job-search prep coach.</p>
                <p><b>How to engage:</b> ask one question at a time and wait. Keep each reply under about 200 words. Show scores as [Score: X/5].</p>
                <p><b>Do not:</b> invent experience, degrees or metrics. Guarantee outcomes or quote exact salaries. Ask for sensitive data. Coach lying or cheating.</p>
              </blockquote>
            </Reveal>
            <div className="decisions">
              {DECISIONS.map(([t, d], i) => (
                <Reveal key={t} i={i} className="decision">
                  <h3>{t}</h3>
                  <p className="muted">{d}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="Feedback" title="Scores you can see" />
          <div className="grid-2">
            <Reveal className="card">
              <div className="score-top">
                <div><span className="score-num">{avg}</span><span className="muted"> / 5 average</span></div>
                <span className="tag-example">Example data</span>
              </div>
              <div className="bars" role="img" aria-label={`Example scores: ${SAMPLE_SCORES.join(", ")} out of 5`}>
                {SAMPLE_SCORES.map((s, i) => (
                  <div key={i} className="bar-col">
                    <span className="small">{s}</span>
                    <motion.div
                      className={`bar ${s >= 4 ? "hi" : ""}`}
                      initial={{ height: "6%" }}
                      whileInView={{ height: `${(s / 5) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, ease, delay: i * 0.08 }}
                    />
                    <span className="muted small">Q{i + 1}</span>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal i={1} className="card">
              <p className="sample-q">
                "Tell me about a time your analysis changed a business decision. What data did you use, and how did you know it worked?"
              </p>
              <p className="eyebrow">Every answer comes back with</p>
              <ul className="checklist">
                <li><Icon name="check" size={15} className="ok" />A score shown as a 5-step meter</li>
                <li><Icon name="check" size={15} className="ok" />One thing the answer did well</li>
                <li><Icon name="check" size={15} className="ok" />One specific fix</li>
                <li><Icon name="check" size={15} className="ok" />A better first line to borrow</li>
              </ul>
              <p className="muted small">After five questions, the coach writes a summary with strengths, things to work on and the next three steps.</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SectionHead
            eyebrow="Responsible AI"
            title="What the coach won't do"
            note="A career coach handles personal stories and resumes, so the limits are written into the instructions and shown to the user."
          />
          <Reveal className="card">
            <ul className="crosslist">
              {RULES.map((r) => <li key={r}><Icon name="cross" size={15} className="bad" />{r}</li>)}
            </ul>
            <p className="muted small rule-note"><Icon name="shield" size={15} /> The input box reminds users to remove names, emails and phone numbers before pasting a resume.</p>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Reveal className="cta-card">
            <div>
              <h2>Practice a mock interview in about 15 minutes.</h2>
              <p className="muted">Pick a role and level, then answer one question at a time.</p>
            </div>
            <a className="btn btn-primary" href={COACH_URL} target="_blank" rel="noreferrer">
              Open the live coach <Icon name="ext" size={16} />
            </a>
          </Reveal>
        </div>
      </section>

      <PageNav prev={prev} next={next} go={go} />
    </div>
  );
}
