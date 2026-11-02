import { useEffect, useRef, useState } from "react";
import { motion, MotionConfig, AnimatePresence, useInView, animate } from "framer-motion";
import { profile, experience, projects, toolkit, education, certs } from "./data.js";
import { Reveal, SectionHead, Icon, ease } from "./ui.jsx";
import ArtifactOnePage from "./ArtifactOne.jsx";
import ArtifactTwoPage from "./ArtifactTwo.jsx";

/* Pages and artifacts. Add a new artifact here and it appears in the top bar and on Home. */
export const ARTIFACTS = [
  {
    id: "artifact-1",
    no: "01",
    tab: "Interview Coach",
    title: "Offer Ready Coach",
    kind: "AI chat application",
    summary: "An AI coach that runs scored mock interviews, rewrites resume bullets honestly and matches candidates to job posts.",
    audience: "Job seekers in data and AI",
    icon: "chat",
  },
  {
    id: "artifact-2",
    no: "02",
    tab: "ML vs Deep Learning",
    title: "Machine Learning vs. Deep Learning",
    kind: "Research brief",
    summary: "Two real-world cases, credit scoring and diabetic eye screening, showing how the data decides which approach fits.",
    audience: "Business and product decision-makers",
    icon: "layers",
  },
];

const PAGES = [{ id: "home", tab: "Home" }, ...ARTIFACTS];

const pageFromHash = () => {
  const h = (window.location.hash || "").replace("#", "");
  return PAGES.some((p) => p.id === h) ? h : "home";
};

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

/* ---------------- NAV ---------------- */
function Nav({ page, go }) {
  useEffect(() => {
    const el = document.querySelector(".tab.is-active");
    const bar = el?.parentElement;
    if (el && bar) bar.scrollTo({ left: el.offsetLeft - bar.clientWidth / 2 + el.clientWidth / 2, behavior: "smooth" });
  }, [page]);
  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <a href="#home" className="brand" onClick={(e) => { e.preventDefault(); go("home"); }}>
          <span className="brand-mark" aria-hidden="true">AR</span>
          <span className="brand-name">Ananya Rachuri</span>
        </a>
        <nav className="tabs" aria-label="Pages">
          {PAGES.map((p) => (
            <a
              key={p.id}
              href={`#${p.id}`}
              aria-current={page === p.id ? "page" : undefined}
              className={`tab ${page === p.id ? "is-active" : ""}`}
              onClick={(e) => { e.preventDefault(); go(p.id); }}
            >
              {page === p.id && (
                <motion.span layoutId="tab-pill" className="tab-pill" transition={{ type: "spring", stiffness: 420, damping: 36 }} />
              )}
              {p.no && <span className="tab-no">{p.no}</span>}
              <span className="tab-label">{p.tab}</span>
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

/* ---------------- HERO ---------------- */
function ArtifactCard({ a, go, i }) {
  return (
    <motion.button
      type="button"
      className="art-card"
      onClick={() => go(a.id)}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease, delay: 0.25 + i * 0.1 }}
      whileHover={{ y: -3 }}
    >
      <span className="art-card-icon"><Icon name={a.icon} size={20} /></span>
      <span className="art-card-body">
        <span className="art-card-meta">Artifact {a.no} · {a.kind}</span>
        <span className="art-card-title">{a.title}</span>
        <span className="art-card-sum">{a.summary}</span>
        <span className="art-card-aud">For: {a.audience}</span>
      </span>
      <span className="art-card-go"><Icon name="arrow" size={18} /></span>
    </motion.button>
  );
}

function Hero({ go }) {
  const [copied, copy] = useCopyEmail("hero-email");
  const item = (d) => ({
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease, delay: d },
  });
  return (
    <section className="hero">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <motion.p className="avail" {...item(0)}>
            <span className="avail-dot" aria-hidden="true" />
            Open to Data Analyst roles with an AI focus
          </motion.p>
          <motion.h1 {...item(0.06)}>Ananya Rachuri</motion.h1>
          <motion.p className="role" {...item(0.12)}>Data Analyst · Customer Insights &amp; AI</motion.p>
          <motion.p className="lede" {...item(0.18)}>
            I turn customer reviews, ratings and survey data into prioritized fixes for product and
            marketing teams. Five years in analytics across logistics, healthcare and SaaS, now
            completing an MS in Artificial Intelligence.
          </motion.p>
          <motion.div className="actions" {...item(0.24)}>
            <button type="button" className="btn btn-primary" onClick={() => go(ARTIFACTS[0].id)}>
              View my artifacts <Icon name="arrow" size={16} />
            </button>
            <button type="button" className="btn btn-ghost" onClick={copy}>
              <span id="hero-email">{copied ? "Email copied" : profile.email}</span>
            </button>
          </motion.div>
        </div>

        <div className="hero-arts" aria-label="Portfolio artifacts">
          <motion.p className="eyebrow" {...item(0.2)}>Portfolio artifacts · MS in AI coursework</motion.p>
          {ARTIFACTS.map((a, i) => <ArtifactCard key={a.id} a={a} go={go} i={i} />)}
        </div>
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
    { value: 50, suffix: "K+", label: "reviews and survey responses analyzed monthly", src: "Cigna" },
    { value: 30, suffix: "%", label: "of 1–2 star reviews traced to late deliveries", src: "Shipium" },
    { value: 25, prefix: "−", suffix: "%", label: "delivery-related negative reviews after fixes", src: "Shipium" },
    { value: 60, prefix: "−", suffix: "%", label: "manual data-quality checks across 2M+ records", src: "Cigna" },
  ];
  return (
    <section className="stats-band" aria-label="Selected results">
      <div className="wrap stats">
        {stats.map((s, i) => (
          <Reveal key={s.label} i={i} className="stat">
            <span className="stat-value"><Counter {...s} /></span>
            <p>{s.label}</p>
            <span className="stat-src">{s.src}</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- EXPERIENCE ---------------- */
function Experience() {
  return (
    <section className="section">
      <div className="wrap">
        <SectionHead eyebrow="Experience" title="Where I've worked" />
        <ol className="timeline">
          {experience.map((job, i) => (
            <Reveal as="li" key={job.company} i={i} className="job">
              <span className="job-dot" aria-hidden="true" />
              <div className="job-when">
                <span>{job.dates}</span>
                {job.current && <span className="badge">Current</span>}
              </div>
              <div className="job-body">
                <h3>{job.role}</h3>
                <p className="job-org">{job.company}{job.client && <span> · {job.client}</span>}</p>
                <ul>{job.points.map((p) => <li key={p}>{p}</li>)}</ul>
                <div className="chips">{job.tags.map((t) => <span key={t} className="chip">{t}</span>)}</div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------------- PROJECTS ---------------- */
function Projects() {
  return (
    <section className="section">
      <div className="wrap">
        <SectionHead eyebrow="Projects" title="Selected projects" />
        <div className="grid-2">
          {projects.map((p, i) => (
            <Reveal key={p.name} i={i} as="article" className="card project">
              <div className="project-top">
                <span className="eyebrow">{p.kind}</span>
                <span className="muted small">{p.year}</span>
              </div>
              <h3>{p.name}</h3>
              <p className="muted">{p.summary}</p>
              <dl className="project-stats">
                {p.stats.map((s) => (
                  <div key={s.v}><dt>{s.k}</dt><dd>{s.v}</dd></div>
                ))}
              </dl>
              <div className="chips">{p.stack.map((t) => <span key={t} className="chip">{t}</span>)}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- SKILLS ---------------- */
function Skills() {
  return (
    <section className="section">
      <div className="wrap">
        <SectionHead eyebrow="Skills" title="Tools and methods" />
        <div className="skills">
          {toolkit.map((g, i) => (
            <Reveal key={g.group} i={i} className="skill-row">
              <h3>{g.group}</h3>
              <div className="chips">{g.items.map((t) => <span key={t} className="chip">{t}</span>)}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- EDUCATION ---------------- */
function Education() {
  return (
    <section className="section">
      <div className="wrap">
        <SectionHead eyebrow="Education" title="Education and certifications" />
        <div className="edu-grid">
          <div className="edu">
            {education.map((e, i) => (
              <Reveal key={e.school} i={i} className="edu-item">
                <div>
                  <h3>{e.degree} {e.now && <span className="badge">In progress</span>}</h3>
                  <p className="muted">{e.school}</p>
                </div>
                <span className="muted small nowrap">{e.dates}</span>
              </Reveal>
            ))}
          </div>
          <Reveal i={1} className="card certs">
            <p className="eyebrow">Certifications</p>
            <ul>
              {certs.map((c) => <li key={c}><Icon name="check" size={15} className="ok" />{c}</li>)}
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
    <section className="section">
      <div className="wrap">
        <Reveal className="contact-card">
          <p className="eyebrow">Contact</p>
          <h2>Looking for a Data Analyst who works where customer data meets AI?</h2>
          <div className="actions">
            <span className="email" id="contact-email">{profile.email}</span>
            <button type="button" className="btn btn-primary" onClick={copy}>{copied ? "Copied" : "Copy email"}</button>
          </div>
          <p className="muted small">{profile.location}</p>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="wrap footer">
      <span>© 2026 Ananya Rachuri</span>
      <span>Built with React and Framer Motion</span>
    </footer>
  );
}

/* ---------------- APP ---------------- */
export default function App() {
  const [page, setPage] = useState(pageFromHash);

  useEffect(() => {
    const onHash = () => setPage(pageFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const go = (id) => {
    setPage(id);
    try { history.replaceState(null, "", `#${id}`); } catch {}
    window.scrollTo({ top: 0 });
  };

  const idx = ARTIFACTS.findIndex((a) => a.id === page);
  const prev = idx > 0 ? ARTIFACTS[idx - 1] : idx === 0 ? { id: "home", title: "Home" } : null;
  const next = idx >= 0 && idx < ARTIFACTS.length - 1 ? ARTIFACTS[idx + 1] : null;

  return (
    <MotionConfig reducedMotion="user">
      <Nav page={page} go={go} />
      <AnimatePresence mode="wait">
        <motion.main
          key={page}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3, ease }}
        >
          {page === "home" && (
            <>
              <Hero go={go} />
              <Stats />
              <Experience />
              <Projects />
              <Skills />
              <Education />
              <Contact />
            </>
          )}
          {page === "artifact-1" && <ArtifactOnePage go={go} prev={prev} next={next} />}
          {page === "artifact-2" && <ArtifactTwoPage go={go} prev={prev} next={next} />}
          <Footer />
        </motion.main>
      </AnimatePresence>
    </MotionConfig>
  );
}
