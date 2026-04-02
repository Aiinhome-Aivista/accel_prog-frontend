import type { CourseItem } from "../types/registration";

export const COURSE_DATA: CourseItem[] = [
  {
    label: "Course 1",
    title: "The AI Consumer & Builder",
    focus: 'Demystifying AI and moving from "using" to "instructing".',
    level: "Foundation",
    color: 1,
    modules: [
      {
        name: "Module 1: Advanced Prompt Engineering",
        desc: "Go beyond simple chat. Master Chain-of-Thought (CoT) reasoning, Few-Shot prompting, and structured prompt design.",
      },
      {
        name: "Module 2: Multimodal Creativity",
        desc: "Harness Gen AI across modalities - GitHub Copilot for code, diffusion models for images, AI-powered research synthesis.",
      },
      {
        name: "Module 3: Python for AI",
        desc: "NumPy for numerical computing, Pandas for data manipulation, and building automation scripts that integrate with AI APIs.",
      },
    ],
    outcome:
      "Students build a Personal AI Research Assistant that summarizes their college syllabus and generates mock test papers.",
  },
  {
    label: "Course 2",
    title: "The Data & ML Architect",
    focus: 'Understanding the "Brain" behind the bot.',
    level: "Core",
    color: 2,
    modules: [
      {
        name: "Module 1: Statistics & Mathematics for AI",
        desc: "Practical linear algebra and probability in neural network architectures - every concept tied to a real AI use case.",
      },
      {
        name: "Module 2: Classic Machine Learning",
        desc: "Supervised vs. Unsupervised learning with Scikit-learn. Classifiers, regressors, clustering, bias-variance tradeoff.",
      },
      {
        name: "Module 3: Introduction to Neural Networks",
        desc: "Build a digit classifier from scratch. Perceptrons, backpropagation, activation functions, and training fundamentals.",
      },
    ],
    outcome:
      "Students develop a Predictive Model - e.g., predicting local weather patterns in Assam or stock market trends for Indian MSMEs.",
  },
  {
    label: "Course 3",
    title: "The Gen AI & RAG Specialist",
    focus: "Building enterprise-grade applications.",
    level: "Applied",
    color: 3,
    modules: [
      {
        name: "Module 1: LLM Fundamentals",
        desc: "Transformer architecture, tokenization, context windows, and the pre-training vs. fine-tuning paradigm.",
      },
      {
        name: "Module 2: Retrieval Augmented Generation (RAG)",
        desc: "Build systems that talk to your data using Pinecone and Chroma. Embedding generation, semantic search, and RAG pipeline design.",
      },
      {
        name: "Module 3: Responsible AI & Governance",
        desc: "Bias detection, data privacy frameworks, and ethical AI guidelines for fair, transparent, compliant systems.",
      },
    ],
    outcome:
      "Students build a Custom Knowledge Bot for a local domain - e.g., a Tea Industry Expert bot trained on regional agricultural data.",
  },
  {
    label: "Course 4",
    title: "The Agentic & Deep Tech Engineer",
    focus: "Moving from chatbots to autonomous agents.",
    level: "Advanced",
    color: 4,
    modules: [
      {
        name: "Module 1: Agentic AI Workflows",
        desc: "Multi-agent systems using CrewAI and LangGraph. Tool-use chains, ReAct patterns, and autonomous task execution.",
      },
      {
        name: "Module 2: MLOps & Deployment",
        desc: "Notebook to production. Docker, Cloud APIs, monitoring, A/B testing, and continuous deployment pipelines.",
      },
      {
        name: "Module 3: Deep Tech Frontiers",
        desc: "Quantum AI concepts, AI for Sustainability, neuromorphic computing, and emerging technologies shaping the next decade.",
      },
    ],
    outcome:
      "AI for Social Good capstone - autonomous agent for water neutrality management or disaster response in the North East.",
  },
];

export const DETAIL_BG = [
  "",
  "var(--orange-glow)",
  "rgba(232,160,64,0.12)",
  "rgba(102,187,106,0.12)",
  "rgba(76,175,80,0.12)",
];
export const DETAIL_TEXT = [
  "",
  "var(--orange)",
  "#C08830",
  "#388E3C",
  "#2E7D32",
];
export const DETAIL_BORDER = [
  "",
  "var(--orange)",
  "#E8A040",
  "#66BB6A",
  "var(--green)",
];
