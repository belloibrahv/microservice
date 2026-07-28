import type { Product, ResearchMetric, ServiceHealth, TeamMember } from "@/lib/types";

const buildImageUrl = (prompt: string, imageSize: string) =>
  `https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(
    prompt
  )}&image_size=${imageSize}`;

export const supervisor: TeamMember = {
  name: "Dr. A. A. Owoade",
  role: "Project Supervisor",
  specialty: "Software architecture, cloud-native systems, and academic project oversight",
  imageUrl: "/supervisor.png",
};

export const researchers: TeamMember[] = [
  {
    name: "Ayangbenro Clement-Goodness Jesutunmise",
    role: "Student Researcher",
    matricNumber: "20220294019",
    specialty: "Architecture design, frontend storytelling, and cloud workflow mapping",
    imageUrl: buildImageUrl(
      "professional portrait of a Nigerian male computer science final year student, smart casual academic style, modern research lab setting, realistic photography, detailed skin tones, calm confident expression",
      "portrait_4_3"
    ),
  },
  {
    name: "Olusegun Afolabi Oluwapelumi",
    role: "Student Researcher",
    matricNumber: "20220294010",
    specialty: "API design, microservice coordination, and deployment planning",
    imageUrl: buildImageUrl(
      "professional portrait of a Nigerian male software engineering student, clean academic look, cloud computing environment, realistic photography, premium lighting, focused expression",
      "portrait_4_3"
    ),
  },
  {
    name: "Moyosore Gawat Awe",
    role: "Student Researcher",
    matricNumber: "20220294016",
    specialty: "Observability, product research translation, and service experience design",
    imageUrl: buildImageUrl(
      "professional portrait of a Nigerian student researcher in computer science, elegant smart outfit, technology studio background, realistic photography, cinematic soft light, approachable expression",
      "portrait_4_3"
    ),
  },
];

export const productsSeed: Product[] = [
  {
    id: "prod-edge-node",
    name: "Edge Node Laptop",
    category: "Compute",
    price: 185000,
    stock: 10,
    leadTime: "24 hours",
    accent: "from-amber-300/30 via-orange-500/20 to-transparent",
    description:
      "A premium performance laptop package used as the flagship demo item for order orchestration and stock validation.",
    imageUrl: buildImageUrl(
      "sleek modern laptop on dark reflective surface, premium ecommerce product photography, dramatic studio lighting, realistic, high detail",
      "landscape_4_3"
    ),
  },
  {
    id: "prod-observe-kit",
    name: "Observability Sensor Kit",
    category: "Monitoring",
    price: 72000,
    stock: 18,
    leadTime: "Same day",
    accent: "from-emerald-300/30 via-teal-500/20 to-transparent",
    description:
      "An instrumentation starter kit representing the paper's observability pillar with logs, metrics, and trace-ready demos.",
    imageUrl: buildImageUrl(
      "futuristic monitoring hardware kit arranged on polished desk, realistic ecommerce product photo, subtle neon accents, high detail",
      "landscape_4_3"
    ),
  },
  {
    id: "prod-gateway-router",
    name: "Gateway Router Pro",
    category: "Networking",
    price: 94000,
    stock: 8,
    leadTime: "48 hours",
    accent: "from-sky-300/30 via-cyan-500/20 to-transparent",
    description:
      "A networking appliance that symbolizes API gateway routing, security enforcement, and edge traffic control.",
    imageUrl: buildImageUrl(
      "premium black enterprise network router, realistic product photography, moody blue highlights, clean background",
      "landscape_4_3"
    ),
  },
  {
    id: "prod-queue-stack",
    name: "Message Queue Stack",
    category: "Messaging",
    price: 56000,
    stock: 14,
    leadTime: "Instant delivery",
    accent: "from-violet-300/30 via-fuchsia-500/20 to-transparent",
    description:
      "A conceptual digital product representing async event processing between order, payment, and notification services.",
    imageUrl: buildImageUrl(
      "glowing stacked server cubes connected by data lines, premium digital product render, realistic lighting, dark studio backdrop",
      "landscape_4_3"
    ),
  },
  {
    id: "prod-k8s-cluster",
    name: "Cluster Deployment Bundle",
    category: "Cloud",
    price: 128000,
    stock: 7,
    leadTime: "72 hours",
    accent: "from-indigo-300/30 via-blue-500/20 to-transparent",
    description:
      "A deployment bundle illustrating Docker packaging, Kubernetes scaling, and cloud-native rollout practices.",
    imageUrl: buildImageUrl(
      "cloud infrastructure control panel visualization, premium tech product illustration, realistic dashboard aesthetic",
      "landscape_4_3"
    ),
  },
  {
    id: "prod-team-pass",
    name: "Research Showcase Pass",
    category: "Academic",
    price: 36000,
    stock: 25,
    leadTime: "Same day",
    accent: "from-rose-300/30 via-pink-500/20 to-transparent",
    description:
      "A showcase-friendly item used to demonstrate fast order placement, notifications, and customer dashboards.",
    imageUrl: buildImageUrl(
      "premium conference access badge on elegant surface, realistic product photography, warm lighting, minimal composition",
      "landscape_4_3"
    ),
  },
];

export const researchMetrics: ResearchMetric[] = [
  {
    label: "Microservices",
    value: "5 services",
    detail: "Identity, Catalog, Order, Payment, and Notification services form the bounded contexts.",
  },
  {
    label: "Support Layers",
    value: "4 pillars",
    detail: "Gateway, message broker, observability, and Kubernetes complete the ecosystem.",
  },
  {
    label: "Research Goal",
    value: "Scalable cloud app",
    detail: "The implementation shows fault isolation, deployment flexibility, and independent service growth.",
  },
];

export const serviceHealthSeed: ServiceHealth[] = [
  {
    name: "API Gateway",
    status: "healthy",
    replicas: 2,
    latencyMs: 41,
    summary: "Routes traffic, applies token checks, and exposes a single entry point.",
  },
  {
    name: "Identity Service",
    status: "healthy",
    replicas: 2,
    latencyMs: 37,
    summary: "Registers users, validates credentials, and issues demo tokens.",
  },
  {
    name: "Catalog Service",
    status: "healthy",
    replicas: 3,
    latencyMs: 49,
    summary: "Serves the product inventory and validates product availability.",
  },
  {
    name: "Order Service",
    status: "healthy",
    replicas: 3,
    latencyMs: 54,
    summary: "Creates pending orders and manages the order event trail.",
  },
  {
    name: "Payment Service",
    status: "degraded",
    replicas: 2,
    latencyMs: 88,
    summary: "Simulates event-driven payment confirmation or failure for demo orders.",
  },
  {
    name: "Notification Service",
    status: "healthy",
    replicas: 2,
    latencyMs: 44,
    summary: "Dispatches order received and payment update notifications.",
  },
];

export const architecturePillars = [
  "API gateway routing and token validation",
  "Database-per-service thinking with isolated models",
  "Asynchronous event flow for payment and notifications",
  "Structured observability with logs, metrics, and traces",
  "Cloud deployment readiness through Docker and Kubernetes",
];
