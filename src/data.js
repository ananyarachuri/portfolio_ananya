export const profile = {
  name: "Ananya Rachuri",
  role: "Customer Insights Analyst",
  location: "Allen, TX",
  email: "ananyarachuri99@gmail.com",
  linkedin: "https://linkedin.com/in/ananya-rachuri",
  github: "https://github.com/ananyarachuri",
};

export const impact = [
  { value: 50, suffix: "K+", label: "reviews, ratings and survey responses analyzed every month", where: "Cigna" },
  { value: 30, suffix: "%", label: "of 1–2★ reviews traced back to late deliveries", where: "Shipium" },
  { value: 25, prefix: "−", suffix: "%", label: "drop in delivery-related negative reviews after fixes", where: "Shipium" },
  { value: 25, prefix: "+", suffix: "%", label: "review volume on key launches via request campaigns", where: "Cigna" },
  { value: 60, suffix: "%", label: "fewer manual data-quality checks across 2M+ records", where: "Cigna" },
  { value: 88, suffix: "%", label: "precision on a churn model across 50K customers", where: "Project" },
];

export const experience = [
  {
    company: "TEK Mind Systems",
    client: "Client: Shipium",
    role: "Data Analyst (contract)",
    dates: "Jun 2025 – Present",
    current: true,
    points: [
      "Matched monthly customer reviews against on-time and delivery-promise data for retail clients. Late deliveries drove 30% of 1–2★ reviews.",
      "Built a Power BI scorecard of ratings, sentiment and top complaints. Delivery-related negative reviews fell 25%.",
      "Ran 3 analytics projects at once in Databricks; cut data prep 35% and release cycles 40%.",
    ],
    tags: ["Power BI", "Databricks", "SQL", "Sentiment"],
  },
  {
    company: "Cigna Healthcare",
    role: "Market Insights Analyst",
    dates: "Jun 2024 – May 2025",
    points: [
      "Owned VOC analytics for 50K+ monthly reviews and surveys, unifying Medallia and Qualtrics in one Power BI dashboard.",
      "Tagged comments by sentiment and theme; presented monthly scorecards and competitor benchmarks to VP-level leaders.",
      "Grew review volume 25% on key launches; co-built Doctor, a data-quality monitor that cut manual checks 60%.",
    ],
    tags: ["Medallia", "Qualtrics", "NPS / CSAT", "SSIS"],
  },
  {
    company: "Avis Solutions",
    role: "Data Analyst",
    dates: "Jun 2023 – Apr 2024",
    points: [
      "Cut ad-hoc report requests 30% with self-service Power BI and Tableau dashboards for 500K+ users.",
      "Defined KPIs and metric logic with product and engineering; ran UAT before release.",
    ],
    tags: ["Tableau", "Power BI", "KPI design"],
  },
  {
    company: "Mindtree",
    role: "Junior Data Engineer",
    dates: "Jan 2021 – Dec 2021",
    points: [
      "Built Python and SQL automation across AWS, GCP and Azure; ETL ran 25% faster and saved 3 hours of manual work a day.",
    ],
    tags: ["Python", "SQL", "AWS · GCP · Azure"],
  },
];

export const projects = [
  {
    name: "SafeGuard AI",
    kind: "AI text classification system",
    year: "2026",
    stack: ["Python", "Claude API", "RAG", "Streamlit"],
    summary:
      "A RAG-based classifier on the Claude API that sorts free text into SAFE, REVIEW or BLOCK using 13 editable policy rules.",
    stats: [
      { k: "10/10", v: "test cases passed" },
      { k: "<2s", v: "per classification" },
      { k: "13", v: "editable policy rules" },
    ],
    visual: "classifier",
  },
  {
    name: "Credit Card Campaign Analytics",
    kind: "Churn prediction system",
    year: "2025",
    stack: ["Python", "SQL", "Scikit-learn", "Tableau"],
    summary:
      "A Python ETL, a SQL validation layer and a logistic regression model that flags likely churners, with results in Tableau.",
    stats: [
      { k: "88%", v: "precision" },
      { k: "50K", v: "customer records" },
      { k: "3", v: "pipeline layers" },
    ],
    visual: "churn",
  },
];

export const toolkit = [
  { group: "Voice of customer", items: ["Medallia", "Qualtrics", "Sentiment analysis", "Theme detection", "NPS / CSAT", "Review programs", "Competitive benchmarking"] },
  { group: "AI & text analytics", items: ["NLP classification", "LLM text analytics", "Claude API", "RAG", "Prompt engineering"] },
  { group: "BI & data", items: ["Power BI", "Tableau", "SQL", "Python · Pandas", "PySpark", "Databricks", "Snowflake", "BigQuery", "Excel · Power Query", "SSIS"] },
  { group: "Delivery", items: ["Executive reporting", "Stakeholder management", "Agile", "JIRA", "Confluence"] },
];

export const education = [
  { school: "Indiana Wesleyan University", degree: "MS, Artificial Intelligence (Data Analytics)", dates: "2026 – 2028 (expected)", now: true },
  { school: "The University of Texas at Dallas", degree: "MS, Management Information Systems", dates: "2021 – 2023" },
  { school: "GITAM", degree: "B.Tech, Computer Science Engineering", dates: "2020" },
];

export const certs = ["Databricks Fundamentals", "Databricks Gen AI Fundamentals", "AWS Academy ML", "AWS Academy Data Analytics"];
