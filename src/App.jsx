import { useEffect, useMemo, useRef, useState } from "react";
import { motion, MotionConfig, AnimatePresence, useInView, animate } from "framer-motion";
import ArtifactOnePage from "./ArtifactOne.jsx";
import { profile, experience, projects, toolkit, education, certs } from "./data.js";

const ease = [0.22, 1, 0.36, 1];

function Reveal({ children, i = 0, className, as = "div", id }) {
  const Tag = motion[as];
  return (
    <Tag
      id={id}
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

function useCopyEmail(id) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      const el = document.getElementById(id);
      if (!el) return;
      const r = document.createRange();
      r.selectNodeContents(el);
      const s = window.getSelection();
      s.removeAllRanges();
      s.addRange(r);
    }
  };
  return [copied, copy];
}

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "");

/* ---------------- NAV (page tabs) ---------------- */
const PAGES = [
  { id: "home", file: "home.md", label: "Home", ext: "md" },
  { id: "artifact-1", file: "artifact_01.md", label: "Artifact 01", ext: "py" },
];

const pageFromHash = () => {
  const h = (window.location.hash || "").replace("#", "");
  return PAGES.some((p) => p.id === h) && h !== "home" ? h : "home";
};

function Nav({ page, go }) {
  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <a href="#home" className="brand mono" onClick={(e) => { e.preventDefault(); go("home"); }}>
          <span className="c-fn">ananya</span><span className="c-dim">@</span><span className="c-kw">portfolio</span>
          <span className="c-dim">:~$</span>
        </a>
        <nav className="tabs" aria-label="Pages">
          {PAGES.map((t) => (
            <a
              key={t.id}
              href={`#${t.id}`}
              aria-current={page === t.id ? "page" : undefined}
              className={`tab ${page === t.id ? "is-active" : ""}`}
              onClick={(e) => { e.preventDefault(); go(t.id); }}
            >
              <span className={`dot ext-${t.ext}`} aria-hidden="true" />
              <span className="tab-file">{t.file}</span>
              {page === t.id && (
                <motion.span layoutId="tab-line" className="tab-line" transition={{ type: "spring", stiffness: 400, damping: 34 }} />
              )}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

/* ---------------- HERO ---------------- */
const QUERY = [
  [["SELECT", "kw"], [" name, role, focus, location", "id"]],
  [["FROM", "kw"], ["   analysts", "id"]],
  [["WHERE", "kw"], ["  skills ", "id"], ["@>", "op"], [" ARRAY", "fn"], ["[", "id"], ["'SQL'", "str"], [", ", "id"], ["'Power BI'", "str"], [", ", "id"], ["'LLMs'", "str"], ["]", "id"]],
  [["  AND", "kw"], ["  years_experience ", "id"], [">=", "op"], [" 5", "num"]],
  [["  AND", "kw"], ["  open_to_work ", "id"], ["=", "op"], [" TRUE", "kw"], [";", "id"]],
];

function TypedQuery({ onDone }) {
  const chars = useMemo(() => {
    const out = [];
    QUERY.forEach((line, li) => {
      line.forEach(([text, cls]) => [...text].forEach((ch) => out.push({ ch, cls, li })));
      if (li < QUERY.length - 1) out.push({ ch: "\n", cls: "id", li });
    });
    return out;
  }, []);
  const [n, setN] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setN(chars.length); return; }
    const id = setInterval(() => {
      setN((v) => {
        if (v >= chars.length) { clearInterval(id); return v; }
        return v + 1;
      });
    }, 14);
    return () => clearInterval(id);
  }, [chars.length]);

  useEffect(() => {
    if (n >= chars.length && !done.current) {
      done.current = true;
      const t = setTimeout(onDone, 350);
      return () => clearTimeout(t);
    }
  }, [n, chars.length, onDone]);

  // Build lines from typed chars
  const lines = [[]];
  chars.slice(0, n).forEach((c) => {
    if (c.ch === "\n") lines.push([]);
    else lines[lines.length - 1].push(c);
  });

  return (
    <pre className="code" aria-label="SELECT name, role, focus, location FROM analysts WHERE skills include SQL, Power BI and LLMs AND years_experience >= 5 AND open_to_work = TRUE">
      {QUERY.map((_, li) => (
        <div className="code-line" key={li}>
          <span className="ln">{li + 1}</span>
          <span className="code-text">
            {(lines[li] || []).map((c, i) => (
              <span key={i} className={`t-${c.cls}`}>{c.ch}</span>
            ))}
            {li === lines.length - 1 && n < chars.length && <span className="caret" />}
          </span>
        </div>
      ))}
    </pre>
  );
}

function Editor() {
  const [ran, setRan] = useState(false);
  return (
    <div className="editor">
      <div className="editor-bar">
        <span className="lights" aria-hidden="true"><i /><i /><i /></span>
        <span className="editor-file mono">find_analyst.sql</span>
        <span className={`run mono ${ran ? "is-done" : ""}`}>{ran ? "✓ executed" : "▶ running"}</span>
      </div>
      <TypedQuery onDone={() => setRan(true)} />
      <div className="results">
        <div className="results-head mono">
          <span>Query results</span>
          <AnimatePresence>
            {ran && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="c-dim">
                1 row · 0.04s
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <div className="grid-wrap">
          <table className="grid mono">
            <thead>
              <tr><th>name</th><th>role</th><th>focus</th><th>location</th></tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {ran && (
                  <motion.tr
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease }}
                  >
                    <td className="t-str">'Ananya Rachuri'</td>
                    <td className="t-str">'Data Analyst'</td>
                    <td className="t-str">'Customer insights + AI'</td>
                    <td className="t-str">'Allen, TX'</td>
                  </motion.tr>
                )}
              </AnimatePresence>
              {!ran && (
                <tr><td colSpan={4} className="c-dim">waiting for query…</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  const [copied, copy] = useCopyEmail("hero-email");
  const item = (d) => ({
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease, delay: d },
  });
  return (
    <section className="hero" id="top">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <motion.p className="prompt mono" {...item(0)}>
            <span className="c-str">~</span> <span className="c-dim">$</span> whoami
          </motion.p>
          <motion.h1 className="mono" {...item(0.08)}>
            Ananya<br />Rachuri<span className="cursor" aria-hidden="true" />
          </motion.h1>
          <motion.p className="role" {...item(0.16)}>
            <span className="c-kw mono">Data Analyst</span>
            <span className="c-dim"> · </span>
            Customer Insights & AI
          </motion.p>
          <motion.p className="lede" {...item(0.22)}>
            I turn customer reviews, ratings and survey data into prioritized fixes for
            product and marketing teams. Five years in analytics across logistics,
            healthcare and SaaS, now applying LLM-based text analytics to the same problems.
          </motion.p>
          <motion.div className="actions" {...item(0.3)}>
            <a href="#projects" className="btn btn-primary mono">
              <span className="c-dim">$</span> ./view_projects
            </a>
            <button type="button" className="btn btn-ghost mono" onClick={copy}>
              <span id="hero-email">{copied ? "✓ copied to clipboard" : profile.email}</span>
            </button>
          </motion.div>
          <motion.div className="links mono" {...item(0.36)}>
            <span className="c-dim"># {profile.location}</span>
          </motion.div>
        </div>
        <motion.div className="hero-editor" {...item(0.2)}>
          <Editor />
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- STATS ---------------- */
function Counter({ value, prefix = "", suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const [n, setN] = useState(value);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, value, { duration: 1.3, ease, onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, value]);
  return <span ref={ref}>{prefix}{n}{suffix}</span>;
}

function Stats() {
  const stats = [
    { key: "reviews_per_month", value: 50, suffix: "K+", label: "reviews and survey responses analyzed monthly", src: "cigna" },
    { key: "late_delivery_share", value: 30, suffix: "%", label: "of 1–2 star reviews traced to late deliveries", src: "shipium" },
    { key: "negative_reviews", value: 25, prefix: "−", suffix: "%", label: "delivery-related negative reviews after fixes", src: "shipium" },
    { key: "manual_checks", value: 60, prefix: "−", suffix: "%", label: "manual data-quality checks across 2M+ records", src: "cigna" },
  ];
  return (
    <section className="stats-band" aria-label="Selected results">
      <div className="wrap">
        <p className="stats-cmd mono"><span className="c-cm">-- impact metrics, from shipped work</span></p>
        <div className="stats">
          {stats.map((s, i) => (
            <Reveal key={s.key} i={i} className="stat">
              <span className="stat-key mono">{s.key}</span>
              <span className="stat-value mono t-num"><Counter {...s} /></span>
              <p>{s.label}</p>
              <span className="stat-src mono c-dim">@{s.src}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- SECTION HEAD ---------------- */
function SectionHead({ cmd, title, note }) {
  return (
    <Reveal className="section-head">
      <p className="cmd mono"><span className="c-dim">$</span> {cmd}</p>
      <h2 className="mono">{title}</h2>
      {note && <p className="note">{note}</p>}
    </Reveal>
  );
}

/* ---------------- EXPERIENCE (git log) ---------------- */
const HASHES = ["e7a91c2", "4b2d0f8", "9c13ae5", "1f6b7d4"];

function Experience() {
  return (
    <section className="section" id="experience">
      <div className="wrap">
        <SectionHead cmd='git log --author="ananya"' title="Experience" />
        <ol className="gitlog">
          {experience.map((job, i) => (
            <Reveal as="li" key={job.company} i={i} className="commit">
              <span className="node" aria-hidden="true" />
              <div className="commit-meta mono">
                <span className="hash">{HASHES[i]}</span>
                {job.current && <span className="head">(HEAD → current)</span>}
                <span className="c-dim">{job.dates}</span>
              </div>
              <h3>{job.role}</h3>
              <p className="org">
                {job.company}
                {job.client && <span className="c-dim"> · {job.client}</span>}
              </p>
              <ul className="diff">
                {job.points.map((p) => (
                  <li key={p}><span className="plus mono" aria-hidden="true">+</span>{p}</li>
                ))}
              </ul>
              <div className="tags mono">
                {job.tags.map((t) => <span key={t} className="tag">#{slug(t)}</span>)}
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------------- PROJECTS ---------------- */
const FILES = { classifier: "safeguard_ai.py", churn: "churn_model.py" };

function Projects() {
  return (
    <section className="section" id="projects">
      <div className="wrap">
        <SectionHead cmd="ls ~/projects" title="Projects" />
        <div className="projects">
          {projects.map((p, i) => (
            <Reveal key={p.name} i={i} as="article" className="window project">
              <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 24 }} className="window-inner">
                <div className="editor-bar">
                  <span className="lights" aria-hidden="true"><i /><i /><i /></span>
                  <span className="editor-file mono">{FILES[p.visual]}</span>
                  <span className="mono c-dim">{p.year}</span>
                </div>
                <div className="project-body">
                  <p className="imports mono">
                    <span className="t-kw">import</span>{" "}
                    {p.stack.map((s, k) => (
                      <span key={s}><span className="t-id">{slug(s)}</span>{k < p.stack.length - 1 && <span className="c-dim">, </span>}</span>
                    ))}
                  </p>
                  <p className="kind mono c-cm"># {p.kind}</p>
                  <h3 className="mono">{p.name}</h3>
                  <p className="summary">{p.summary}</p>
                  <dl className="results-dict mono">
                    {p.stats.map((s) => (
                      <div key={s.v}>
                        <dt className="t-str">"{s.v}"</dt>
                        <dd className="t-num">{s.k}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- SKILLS (JSON) ---------------- */
function Skills() {
  return (
    <section className="section" id="skills">
      <div className="wrap">
        <SectionHead cmd="cat skills.json" title="Skills" />
        <Reveal className="window">
          <div className="editor-bar">
            <span className="lights" aria-hidden="true"><i /><i /><i /></span>
            <span className="editor-file mono">skills.json</span>
            <span className="mono c-dim">{toolkit.reduce((a, g) => a + g.items.length, 0)} entries</span>
          </div>
          <div className="json mono">
            <div className="j-line"><span className="t-id">{"{"}</span></div>
            {toolkit.map((g, gi) => (
              <div key={g.group} className="j-group">
                <div className="j-key">
                  <span className="t-fn">"{g.group}"</span><span className="t-id">: [</span>
                </div>
                <motion.div
                  className="j-items"
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={{ show: { transition: { staggerChildren: 0.03 } } }}
                >
                  {g.items.map((t, ti) => (
                    <motion.span
                      key={t}
                      className="j-item"
                      variants={{ hidden: { y: 6 }, show: { y: 0 } }}
                    >
                      <span className="t-str">"{t}"</span>
                      {ti < g.items.length - 1 && <span className="t-id">,</span>}
                    </motion.span>
                  ))}
                </motion.div>
                <div className="j-key"><span className="t-id">]{gi < toolkit.length - 1 ? "," : ""}</span></div>
              </div>
            ))}
            <div className="j-line"><span className="t-id">{"}"}</span></div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- ARTIFACTS ---------------- */
function Artifacts({ go }) {
  return (
    <section className="section" id="artifacts">
      <div className="wrap">
        <SectionHead
          cmd="tree artifacts/"
          title="Portfolio artifacts"
          note="Coursework from my MS in Artificial Intelligence at Indiana Wesleyan University, each prepared for a specific audience."
        />
        <div className="artifacts">
          <Reveal className="window tree mono">
            <div className="tree-line"><span className="t-fn">artifacts/</span></div>
            <div className="tree-line"><span className="c-dim">├── </span><span className="t-kw">01_offer-ready-coach/</span> <span className="c-cm"># AI interview coach</span></div>
            <div className="tree-line"><span className="c-dim">├── </span><span className="c-dim">02/</span> <span className="c-cm"># reserved</span></div>
            <div className="tree-line"><span className="c-dim">└── </span><span className="c-dim">03/</span> <span className="c-cm"># reserved</span></div>
          </Reveal>
          <Reveal i={1} className="window artifact">
            <div className="editor-bar">
              <span className="lights" aria-hidden="true"><i /><i /><i /></span>
              <span className="editor-file mono">01_offer-ready-coach/README.md</span>
              <span className="badge mono">live</span>
            </div>
            <div className="artifact-body">
              <p className="mono c-cm"># artifact 01 · workshop 1 · AI lab</p>
              <h3 className="mono">Offer Ready Coach</h3>
              <p>An AI interview-prep coach for Data Analyst and AI roles: scored mock interviews, honest resume rewrites and job-post matching, with guardrails built into the prompt.</p>
              <div className="tags mono">
                <span className="tag">#claude</span><span className="tag">#promptengineering</span><span className="tag">#responsibleai</span>
              </div>
              <button type="button" className="btn btn-ghost mono open-btn" onClick={() => go("artifact-1")}>
                <span>read the case study →</span>
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------------- EDUCATION ---------------- */
function Education() {
  return (
    <section className="section" id="education">
      <div className="wrap">
        <SectionHead cmd="cat education.md" title="Education" />
        <div className="edu-grid">
          <div className="edu">
            {education.map((e, i) => (
              <Reveal key={e.school} i={i} className="edu-item">
                <span className="mono c-dim edu-date">{e.dates}</span>
                <div>
                  <h3>{e.degree}</h3>
                  <p>{e.school}</p>
                </div>
                {e.now && <span className="badge mono">active</span>}
              </Reveal>
            ))}
          </div>
          <Reveal i={1} className="window certs">
            <div className="editor-bar">
              <span className="lights" aria-hidden="true"><i /><i /><i /></span>
              <span className="editor-file mono">certifications.md</span>
            </div>
            <ul className="mono">
              {certs.map((c) => (
                <li key={c}><span className="t-str">[x]</span> {c}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------------- CONTACT ---------------- */
function Contact() {
  const [copied, copy] = useCopyEmail("contact-email");
  return (
    <section className="section contact" id="contact">
      <div className="wrap">
        <Reveal className="window terminal">
          <div className="editor-bar">
            <span className="lights" aria-hidden="true"><i /><i /><i /></span>
            <span className="editor-file mono">contact.sh — zsh</span>
          </div>
          <div className="terminal-body">
            <p className="mono"><span className="c-str">~</span> <span className="c-dim">$</span> echo $NEXT_ROLE</p>
            <h2 className="mono">Data Analyst where customer data meets AI.</h2>
            <p className="mono"><span className="c-str">~</span> <span className="c-dim">$</span> cat contact.txt</p>
            <div className="contact-row">
              <span className="email mono" id="contact-email">{profile.email}</span>
              <button type="button" className="btn btn-primary mono" onClick={copy}>
                {copied ? "✓ copied" : "copy email"}
              </button>
            </div>
            <p className="mono"><span className="c-str">~</span> <span className="c-dim">$</span> <span className="cursor" aria-hidden="true" /></p>
          </div>
        </Reveal>
      </div>
      <div className="wrap footer mono">
        <span>© 2026 Ananya Rachuri</span>
        <span className="c-dim">built with react + framer-motion</span>
      </div>
    </section>
  );
}

export default function App() {
  const [page, setPage] = useState(pageFromHash);

  useEffect(() => {
    const onHash = () => {
      const h = (window.location.hash || "").replace("#", "");
      if (PAGES.some((p) => p.id === h)) setPage(h);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const go = (id) => {
    setPage(id);
    try { history.replaceState(null, "", `#${id}`); } catch {}
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  };

  return (
    <MotionConfig reducedMotion="user">
      <Nav page={page} go={go} />
      <AnimatePresence mode="wait">
        <motion.main
          key={page}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease }}
        >
          {page === "home" ? (
            <>
              <Hero />
              <Stats />
              <Experience />
              <Projects />
              <Skills />
              <Artifacts go={go} />
              <Education />
              <Contact />
            </>
          ) : (
            <>
              <ArtifactOnePage go={go} />
              <Footer />
            </>
          )}
        </motion.main>
      </AnimatePresence>
    </MotionConfig>
  );
}

function Footer() {
  return (
    <div className="wrap footer mono">
      <span>© 2026 Ananya Rachuri</span>
      <span className="c-dim">built with react + framer-motion</span>
    </div>
  );
}
