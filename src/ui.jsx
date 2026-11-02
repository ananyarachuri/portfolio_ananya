import { motion } from "framer-motion";

export const ease = [0.22, 1, 0.36, 1];

export function Reveal({ children, i = 0, className, as = "div", id, style }) {
  const Tag = motion[as];
  return (
    <Tag
      id={id}
      className={className}
      style={style}
      initial={{ y: 18 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.6, ease, delay: i * 0.06 }}
    >
      {children}
    </Tag>
  );
}

export function SectionHead({ eyebrow, title, note, id }) {
  return (
    <Reveal className="section-head" id={id}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
      {note && <p className="note">{note}</p>}
    </Reveal>
  );
}

const paths = {
  check: <path d="M5 12.5l4.5 4.5L19 7" />,
  cross: <path d="M6 6l12 12M18 6L6 18" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  back: <path d="M19 12H5M11 6l-6 6 6 6" />,
  ext: <path d="M7 17L17 7M9 7h8v8" />,
  chat: <><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" /><path d="M9 10h6M9 14h4" /></>,
  doc: <><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></>,
  target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.2" fill="currentColor" /></>,
  table: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 10h18M3 15h18M10 4v16" /></>,
  image: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="M21 16l-5-5-9 9" /></>,
  scale: <><path d="M12 3v18M5 7h14" /><path d="M5 7l-3 7h6zM19 7l-3 7h6z" /></>,
  eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>,
  bolt: <path d="M13 2L4 14h7l-1 8 9-12h-7z" />,
  layers: <><path d="M12 3l9 5-9 5-9-5z" /><path d="M3 13l9 5 9-5" /></>,
  shield: <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />,
};

export function Icon({ name, size = 18, className }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

export function PageNav({ prev, next, go }) {
  return (
    <div className="wrap page-nav">
      {prev ? (
        <button type="button" className="page-nav-btn" onClick={() => go(prev.id)}>
          <span className="page-nav-dir"><Icon name="back" size={14} /> Previous</span>
          <span className="page-nav-title">{prev.title}</span>
        </button>
      ) : <span />}
      {next ? (
        <button type="button" className="page-nav-btn is-next" onClick={() => go(next.id)}>
          <span className="page-nav-dir">Next <Icon name="arrow" size={14} /></span>
          <span className="page-nav-title">{next.title}</span>
        </button>
      ) : <span />}
    </div>
  );
}
