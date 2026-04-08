import type {
  WeekData,
  Flashcard,
  Person,
  Announcement,
} from "./course-learning.models";

export const WK: WeekData[] = [
  {
    id: "w1",
    t: "Advanced Prompt Engineering",
    short: "Week 1",
    ul: true,
    color: "#E87A2E",
    topics: [
      {
        d: "Day 1",
        t: "What is Prompt Engineering",
        n: "RACE framework, why prompting matters, zero-shot vs structured",
      },
      {
        d: "Day 2",
        t: "Chain-of-Thought Prompting",
        n: "CoT techniques, step-by-step reasoning, complex problem decomposition",
      },
      {
        d: "Day 3",
        t: "Few-Shot & System Prompts",
        n: "Pattern-based prompting, role engineering, output formatting",
      },
      {
        d: "Day 4",
        t: "Industry Case Study",
        n: "How McKinsey uses prompt engineering across 30K+ consultants",
      },
      {
        d: "Day 5",
        t: "Assessment + Discussion + Project",
        n: "8 questions, cohort discussion, prompt library project",
      },
    ],
    subs: [
      {
        id: "w1s1",
        type: "reading",
        title: "What is Prompt Engineering?",
        content:
          '<h2>The Art of Talking to AI</h2><p>Prompt engineering is the skill of crafting instructions that reliably produce high-quality outputs from Large Language Models. Think of it as a <strong>communication protocol</strong> between human intent and machine capability.</p><h2>The RACE Framework</h2><p>Every effective prompt follows the <strong>RACE</strong> structure:</p><ul><li><strong>Role</strong> — Define who the AI should be</li><li><strong>Action</strong> — State the specific task</li><li><strong>Context</strong> — Provide background information</li><li><strong>Expectation</strong> — Define the output format</li></ul><h2>Why Does Prompting Matter?</h2><p>The same LLM produces wildly different outputs based on how you ask:</p><blockquote>"Tell me about climate change" vs. "You are a climate scientist writing for a general audience. Explain the 3 most impactful effects of climate change on South Asian agriculture in the next decade."</blockquote><p>The second prompt is specific, gives context, defines scope, and specifies format. This is prompt engineering.</p><div class="bg-blue-500/10 rounded-[8px] p-3 my-3 text-[12.5px] flex gap-2"><p class="m-0"><strong>Key insight:</strong> Prompt engineering reduces ambiguity so the model focuses its capabilities on exactly what you need.</p></div>',
      },
      {
        id: "w1s2",
        type: "reading",
        title: "Chain-of-Thought Prompting",
        content:
          '<h2>Making AI Think Step-by-Step</h2><p>Chain-of-Thought (CoT) prompting instructs the LLM to break reasoning into explicit steps before arriving at a final answer. This dramatically improves performance on math, logic, and multi-step analysis.</p><h2>Simple CoT</h2><p>Append <code>"Let\'s think step by step"</code> to any complex prompt. But sophisticated CoT structures the reasoning path:</p><blockquote>"First identify the key stakeholders. Then list each stakeholder\'s primary concern. Next find conflicts between concerns. Finally propose a resolution addressing 80%+ of concerns."</blockquote><h2>When to Use CoT</h2><ul><li>Mathematical calculations or logic puzzles</li><li>Multi-step business analysis</li><li>Code debugging (trace execution path)</li><li>Ethical dilemmas (weigh multiple perspectives)</li></ul><div class="bg-blue-500/10 rounded-[8px] p-3 my-3 text-[12.5px] flex gap-2"><p class="m-0"><strong>Pro tip:</strong> CoT works because it forces the model to allocate computation to intermediate reasoning steps, reducing logical shortcuts that cause errors.</p></div>',
      },
      {
        id: "w1s3",
        type: "reading",
        title: "Few-Shot & System Prompts",
        content:
          '<h2>Teaching by Example</h2><p><strong>Few-Shot prompting</strong> provides 2-3 examples of desired input→output pairs. The model learns the pattern:</p><blockquote>Review: "Amazing battery life!" → Positive<br>Review: "Terrible service" → Negative<br>Review: "Works fine for basics but struggles with video" → Mixed<br>Review: "3 months and still perfect!" →</blockquote><p>The model sees the pattern and applies it.</p><h2>System Prompts: Setting the Stage</h2><p>System prompts set <strong>persistent behavioral constraints</strong> for the entire conversation:</p><ul><li>Persona definition ("You are a senior data scientist...")</li><li>Output constraints ("Always respond in JSON format")</li><li>Safety guardrails ("Never provide medical diagnoses")</li><li>Tone and style ("Write in a friendly, professional tone")</li></ul><h2>Combining All Techniques</h2><p>The real power comes from combining CoT + Few-Shot + System Prompts. You define who the AI is, show it how to think, and give it examples to follow.</p>',
      },
      {
        id: "w1s4",
        type: "video",
        title: "Industry Case Study: McKinsey & Prompt Engineering",
        videoTitle:
          "How McKinsey Uses Prompt Engineering to Transform Consulting",
        videoDesc: "McKinsey & Company · Management Consulting · 22 min",
      },
      {
        id: "w1s5",
        type: "assess",
        title: "Week 1 Assessment",
        questions: {
          critical: [
            {
              q: 'A healthcare startup says "just use ChatGPT" for medication recommendations. What are 3 reasons this is dangerous, and how would you redesign it with prompt engineering guardrails?',
              type: "subjective",
            },
            {
              q: "WHY does Chain-of-Thought prompting improve reasoning?",
              opts: [
                "Makes the model run longer",
                "Forces decomposition of problems, reducing logical shortcuts",
                "Activates a special reasoning mode",
                "Uses more training data",
              ],
              ans: 1,
              type: "mcq",
            },
          ],
          technical: [
            {
              q: "What is the primary difference between a system prompt and a user prompt?",
              opts: [
                "System prompts use more tokens",
                "System prompts set persistent constraints; user prompts are per-turn",
                "System prompts are encrypted",
                "No functional difference",
              ],
              ans: 1,
              type: "mcq",
            },
            {
              q: "Write a RACE-framework prompt to analyze EV impact on India's petroleum industry by 2030. Include a CoT instruction.",
              type: "subjective",
            },
          ],
          problem: [
            {
              q: "Design a 3-step prompt chain for processing 10,000 customer support emails: classify urgency, extract core issue, generate draft response. Explain your ordering.",
              type: "subjective",
            },
            {
              q: "A few-shot prompt with 3 examples gets 70% accuracy. What MOST improves it?",
              opts: [
                "Add 10 more examples",
                "Add CoT reasoning to each example showing WHY the classification was made",
                "Set temperature to 0",
                "Remove examples, use zero-shot",
              ],
              ans: 1,
              type: "mcq",
            },
          ],
          subjective: [
            {
              q: "Design a system prompt for Indian Railways AI helpdesk, considering: multiple languages, varying digital literacy, scale of operations.",
              type: "subjective",
            },
            {
              q: '"Prompt engineering will become obsolete as AI gets smarter." Agree or disagree? Give 3 supporting points.',
              type: "subjective",
            },
          ],
        },
      },
      {
        id: "w1s6",
        type: "discussion",
        title: "Cohort Discussion",
        topic:
          "How can prompt engineering transform education in rural India? Consider language barriers, limited internet, and teacher shortages.",
        seeds: [
          {
            n: "Kavya R.",
            a: "KR",
            tm: "3h ago",
            tx: "A well-designed system prompt could make a single LLM serve as tutor in Hindi, Bengali, Tamil simultaneously. The key is few-shot examples in each language.",
            lk: 9,
          },
          {
            n: "Amit S.",
            a: "AS",
            tm: "2h ago",
            tx: "The RACE framework could help teachers with no AI experience create effective prompts for generating exam papers, lesson plans, and student feedback.",
            lk: 6,
          },
          {
            n: "Dr. Sharma",
            a: "DS",
            tm: "1h ago",
            tx: "Great points! Consider how CoT prompting could help students learn problem-solving methodology — not just get answers, but understand the reasoning process.",
            lk: 14,
          },
        ],
      },
      {
        id: "w1s7",
        type: "project",
        title: "Industry Project: Build a Prompt Library",
        brief:
          "Create a documented library of 10+ reusable prompt templates covering different professional use cases — consulting, education, healthcare, content creation.",
        reqs: [
          "10 templates across 4+ categories",
          "Each uses at least one advanced technique (CoT, Few-Shot, System Prompt)",
          "Include a README.md explaining organization",
          "Test each with 2+ different inputs, document outputs",
          "Format: ZIP or GitHub repository link",
        ],
      },
    ],
  },
  {
    id: "w2",
    t: "Multimodal Creativity",
    short: "Week 2",
    ul: false,
    color: "#E8A040",
    topics: [
      {
        d: "Day 1",
        t: "The Multimodal AI Landscape",
        n: "Text, image, code, audio — how AI works across modalities",
      },
      {
        d: "Day 2",
        t: "Code Generation with AI",
        n: "GitHub Copilot, Cursor, code completion and generation",
      },
      {
        d: "Day 3",
        t: "Image & Research Synthesis",
        n: "DALL-E, Midjourney, AI for research paper analysis",
      },
      {
        d: "Day 4",
        t: "Industry Case Study",
        n: "How Adobe uses multimodal AI in Creative Cloud",
      },
      {
        d: "Day 5",
        t: "Assessment + Discussion + Project",
        n: "Evaluation, cohort discussion, multimodal content pipeline",
      },
    ],
    subs: [
      {
        id: "w2s1",
        type: "reading",
        title: "The Multimodal AI Landscape",
        content: "<p>🔒 Complete Week 1 to unlock this content.</p>",
      },
      {
        id: "w2s2",
        type: "reading",
        title: "Code Generation with GitHub Copilot",
        content: "<p>🔒 Complete Week 1 to unlock.</p>",
      },
      {
        id: "w2s3",
        type: "reading",
        title: "Image & Research Synthesis with AI",
        content: "<p>🔒 Complete Week 1 to unlock.</p>",
      },
      {
        id: "w2s4",
        type: "video",
        title: "Industry Case Study: Adobe & Multimodal AI",
        videoTitle: "How Adobe Firefly Powers Creative Cloud",
        videoDesc: "Adobe · Creative Technology · 20 min",
      },
      {
        id: "w2s5",
        type: "assess",
        title: "Week 2 Assessment",
        questions: { critical: [], technical: [], problem: [], subjective: [] },
      },
      {
        id: "w2s6",
        type: "discussion",
        title: "Cohort Discussion",
        topic:
          "How can multimodal AI democratize creative tools for non-designers in Indian startups?",
        seeds: [],
      },
      {
        id: "w2s7",
        type: "project",
        title: "Project: Multimodal Content Pipeline",
        brief:
          "Build an AI-powered content pipeline that takes a topic and generates: a blog outline (text), code snippets (code), and image prompts (multimodal).",
        reqs: [
          "Use at least 2 AI modalities",
          "Document your prompt chains",
          "Include before/after comparisons",
          "Deliverable: Jupyter notebook + samples",
        ],
      },
    ],
  },
  {
    id: "w3",
    t: "Python for AI",
    short: "Week 3",
    ul: false,
    color: "#66BB6A",
    topics: [
      {
        d: "Day 1",
        t: "Python Essentials for AI",
        n: "Variables, loops, functions, data structures for AI workflows",
      },
      {
        d: "Day 2",
        t: "NumPy & Pandas Mastery",
        n: "Array operations, DataFrames, data cleaning pipelines",
      },
      {
        d: "Day 3",
        t: "Automation Scripts for AI",
        n: "API integration, file processing, batch operations",
      },
      {
        d: "Day 4",
        t: "Industry Case Study",
        n: "How Flipkart uses Python for 1.4B daily decisions",
      },
      {
        d: "Day 5",
        t: "Assessment + Discussion + Project",
        n: "Evaluation, cohort discussion, data automation project",
      },
    ],
    subs: [
      {
        id: "w3s1",
        type: "reading",
        title: "Python Essentials for AI",
        content: "<p>🔒 Complete Week 2 to unlock.</p>",
      },
      {
        id: "w3s2",
        type: "reading",
        title: "NumPy & Pandas Mastery",
        content: "<p>🔒 Complete Week 2 to unlock.</p>",
      },
      {
        id: "w3s3",
        type: "reading",
        title: "Building Automation Scripts",
        content: "<p>🔒 Complete Week 2 to unlock.</p>",
      },
      {
        id: "w3s4",
        type: "video",
        title: "Industry Case Study: Flipkart & Python",
        videoTitle: "How Flipkart Powers 1.4B Decisions with Python",
        videoDesc: "Flipkart · E-Commerce · 18 min",
      },
      {
        id: "w3s5",
        type: "assess",
        title: "Week 3 Assessment",
        questions: { critical: [], technical: [], problem: [], subjective: [] },
      },
      {
        id: "w3s6",
        type: "discussion",
        title: "Cohort Discussion",
        topic:
          "How is Python transforming Indian agriculture through crop prediction and soil analysis?",
        seeds: [],
      },
      {
        id: "w3s7",
        type: "project",
        title: "Project: AI Data Pipeline",
        brief:
          "Build a Python automation script that fetches real data, cleans it, analyzes it, and generates a visual report — all automated.",
        reqs: [
          "Use NumPy, Pandas, and Matplotlib",
          "Process at least 1000 rows of real data",
          "Automate end-to-end (fetch → clean → analyze → visualize)",
          "Include error handling",
          "Deliverable: Python script + sample output",
        ],
      },
    ],
  },
  {
    id: "w4",
    t: "Real Industry Use Cases & Responsible Prompting",
    short: "Week 4",
    ul: false,
    color: "#4CAF50",
    topics: [
      {
        d: "Day 1",
        t: "Prompt Engineering in Enterprise",
        n: "How consulting, banking, healthcare firms use prompting at scale",
      },
      {
        d: "Day 2",
        t: "Responsible AI & Ethical Prompting",
        n: "Bias detection, safety guardrails, privacy-first design",
      },
      {
        d: "Day 3",
        t: "Building Your Prompt Portfolio",
        n: "Documenting, versioning, and sharing prompt libraries",
      },
      {
        d: "Day 4",
        t: "Industry Panel Discussion",
        n: "Live session with AI leaders on responsible deployment",
      },
      {
        d: "Day 5",
        t: "Capstone Presentations",
        n: "Demo day, peer review, certificates, career guidance",
      },
    ],
    subs: [
      {
        id: "w4s1",
        type: "reading",
        title: "Prompt Engineering in Enterprise",
        content: "<p>🔒 Complete Week 3 to unlock.</p>",
      },
      {
        id: "w4s2",
        type: "reading",
        title: "Responsible AI & Ethical Prompting",
        content: "<p>🔒 Complete Week 3 to unlock.</p>",
      },
      {
        id: "w4s3",
        type: "reading",
        title: "Building Your Prompt Portfolio",
        content: "<p>🔒 Complete Week 3 to unlock.</p>",
      },
      {
        id: "w4s4",
        type: "video",
        title: "Industry Panel: AI Leaders on Responsible Deployment",
        videoTitle: "Responsible AI in Indian Enterprise — A Panel Discussion",
        videoDesc: "Industry Leaders · Cross-Sector · 30 min",
      },
      {
        id: "w4s5",
        type: "assess",
        title: "Week 4 Assessment",
        questions: { critical: [], technical: [], problem: [], subjective: [] },
      },
      {
        id: "w4s6",
        type: "discussion",
        title: "Cohort Discussion",
        topic:
          "What is the most impactful responsible AI project you could build for your local community?",
        seeds: [],
      },
      {
        id: "w4s7",
        type: "project",
        title: "Capstone: Personal AI Research Assistant",
        brief:
          "Build a complete AI research assistant combining all skills — prompt engineering, multimodal tools, and Python automation.",
        reqs: [
          "Combine skills from all 4 weeks",
          "Summarize any uploaded document",
          "Generate structured outputs (quizzes, summaries, mind maps)",
          "Include responsible AI guardrails",
          "Full documentation + presentation deck",
          "Peer review 2 other projects",
        ],
      },
    ],
  },
];

// export const FC: Flashcard[] = [
//   { q: 'RACE stands for?', a: 'Role, Action, Context, Expectation' },
//   { q: 'Zero-shot vs Few-shot?', a: 'Zero-shot: no examples. Few-shot: 2-3 input→output examples.' },
//   { q: 'What is CoT?', a: 'Chain-of-Thought: instruct AI to reason step-by-step.' },
//   { q: 'System prompt purpose?', a: 'Set persistent behavioral constraints for entire conversation.' },
//   { q: 'Why does CoT work?', a: 'Forces decomposition, reducing logical shortcuts that cause errors.' },
//   { q: 'Multimodal AI?', a: 'AI that works across text, code, images, audio — multiple modalities.' },
//   { q: 'NumPy vs Pandas?', a: 'NumPy: numerical arrays. Pandas: labeled DataFrames for tabular data.' }
// ];

export const PP: Person[] = [
  { n: "You", r: "Learner", a: "Y", bg: "#E87A2E1F", c: "#E87A2E" }, // var(--og), var(--o)
  { n: "Kavya R.", r: "Cohort", a: "KR", bg: "#E8F5E9", c: "#4CAF50" }, // var(--gl), var(--g)
  {
    n: "Amit S.",
    r: "Cohort",
    a: "AS",
    bg: "rgba(66,133,244,.1)",
    c: "#4285F4",
  }, // var(--bb), var(--b)
  { n: "Neha P.", r: "Learner", a: "NP", bg: "#E87A2E1F", c: "#E87A2E" },
  {
    n: "Dr. Sharma",
    r: "Instructor",
    a: "DS",
    bg: "rgba(156,39,176,.1)",
    c: "#9C27B0",
  },
];

export const ANN: Announcement[] = [
  {
    t: "🎉 Week 1 is live — Advanced Prompt Engineering!",
    tx: 'Start with "What is Prompt Engineering?" reading. Complete each sub-topic to unlock the next.',
    tm: "Today, 9 AM",
  },
  {
    t: "👥 Cohort Alpha-3 assigned",
    tx: "You, Kavya, and Amit are a team. Connect in the Discussion section!",
    tm: "Today, 10 AM",
  },
  {
    t: "📅 Office Hours: Friday 4 PM",
    tx: "Dr. Sharma covers advanced CoT techniques. Bring your trickiest prompts!",
    tm: "Today, 2 PM",
  },
  {
    t: "🏆 Flashcard Challenge",
    tx: "Master all 7 cards this week for a bonus badge.",
    tm: "Yesterday",
  },
  {
    t: "📊 AI Companion launched",
    tx: "Ask questions about any topic in real-time using the chat bubble (bottom-right).",
    tm: "Yesterday",
  },
];
