# Portfolio — AI-Powered Multi-Agent Portfolio System

**Portfolio** is not just a typical developer portfolio — it’s a fully AI-driven, multi-agent system that uses **Google Cloud’s Vertex AI**, **RAG (Retrieval-Augmented Generation)**, and a **session-based architecture** to make conversations with visitors intelligent, contextual, and dynamic.  
Every response you see is generated and grounded in real data about my work, powered by distributed AI agents orchestrated in real-time.

---

## Overview

**Portfolio** is built using the **Agent Development Kit (ADK)** with a **multi-agent architecture**, where each agent is designed to perform a specialized role — query understanding, retrieval, model invocation, or response generation.  
It uses **Vertex AI’s Model Garden** for LLM invocation, a **custom RAG Engine** backed by **Vertex AI Search** for contextual knowledge retrieval, and is deployed seamlessly on **Google Cloud Run** for serverless scalability.

Each user session is tracked individually, with **Redis-based rate limiting** (token bucket algorithm) to prevent abuse, and all user interactions are stored securely in **Google Cloud Storage** for analytics and insights.

---

## Architecture

### **Multi-Agent System**
- Built with **Agent Development Kit (ADK)**.
- Each agent handles a specific responsibility:
  - **Orchestrator Agent:** Routes user requests to the right agents.
  - **Retrieval Agent:** Fetches contextual data from the RAG corpus.
  - **Response Agent:** Invokes Vertex AI models for text generation.
  - **Session Agent:** Maintains session continuity and memory.
  - **Analytics Agent:** Logs user interactions to Cloud Storage.

### **Retrieval-Augmented Generation (RAG)**
- RAG corpus created and indexed in the **RAG Engine**.
- Uses **Vertex AI Search** for semantic retrieval.
- Each user query is contextually grounded before LLM invocation.

### **Cloud-Native Deployment**
- Fully deployed on **Google Cloud Run**.
- Integrates with:
  - **Vertex AI** → Model invocation & vector search.
  - **Redis** → Rate limiting (Token Bucket Algorithm).
  - **Google Cloud Storage (GCS)** → Logging & analytics.
- Auto-scaled with **serverless compute**.
- Zero-downtime updates via CI/CD pipeline.

---

## Key AI Features

- **LLM Invocation:** Powered by **Vertex AI’s Model Garden**.
- **Contextual Memory:** Session-based request–response tracking.
- **RAG System:** Ensures all responses are factually grounded.
- **Multi-Agent Intelligence:** Dynamic orchestration between specialized agents.
- **Rate Limiting:** Redis-based token bucket ensures fair API usage.
- **Conversation Logging:** All queries stored in Cloud Storage for insights.

---

## Tech Stack

### **AI & Backend**
- Agent Development Kit (ADK)
- Node.js / TypeScript
- Vertex AI (Model Garden, Search, Embeddings)
- Redis (Rate Limiting)
- Google Cloud Storage (Logging)
- RAG Engine (Custom-built)
- Cloud Run (Serverless Deployment)

### **DevOps & Infrastructure**
- Google Cloud Platform (GCP)
- CI/CD with GitHub Actions
- SSL/TLS & IAM roles
- Session Management & CORS Security

---

## Workflow

1. **User Interaction:**  
   A new session is created when a user visits the portfolio.

2. **Query Processing:**  
   The **Orchestrator Agent** determines the query type and delegates tasks.

3. **Context Retrieval:**  
   The **Retrieval Agent** queries the **RAG Engine** using **Vertex AI Search**.

4. **Response Generation:**  
   The **Response Agent** invokes **Vertex AI’s Model Garden** to generate grounded answers.

5. **Rate Limiting & Logging:**  
   Redis ensures fair usage, and Cloud Storage logs queries for insights.

6. **Response Delivery:**  
   The answer is returned to the user, preserving session continuity.

---

## Security & Reliability

- **Redis Rate Limiter** with Token Bucket algorithm to prevent query abuse.
- **Session-based Context Tracking** with secure isolation.
- **Cloud IAM Policies** for controlled access between components.
- **SSL/TLS Encryption** on all endpoints.
- **Automatic Scaling** via Cloud Run for load handling.

---

## Analytics & Insights

All user queries and interactions are stored in **Google Cloud Storage** for:
- AI query pattern analysis.
- System performance monitoring.
- RAG corpus improvement insights.

This data helps refine how the AI interacts, making future sessions more intelligent and relevant.

---

## Why Portfolio is Unique

Unlike traditional portfolios, **Portfolio** is:
- **Conversational:** You can talk to it like a person.
- **Contextual:** It remembers session context and adapts responses.
- **Cloud-Native:** Fully managed via Google Cloud services.
- **Autonomous:** Powered by a multi-agent architecture with intelligent delegation.
- **Secure & Scalable:** Designed for production workloads, not just demos.

---

## Future Enhancements

- Integration of **voice-based interaction** (Speech-to-Text + TTS via Vertex AI).  
- **RAG Corpus Expansion** with project metadata and live data sync.  
- **Advanced analytics dashboard** for real-time query visualization.  
- Integration of a **persona adaptation agent** for tone adjustment.

---

## Deployment

Deployed on **Google Cloud Run** with continuous integration via GitHub Actions.  
Built images are automatically deployed to Cloud Run with zero downtime.  
Private environment variables handle API keys and configuration securely.

---

## Author

**Uday Raj**  
AI Engineer • Full-Stack Developer • Cloud Enthusiast  
Building intelligent, scalable systems powered by AI and cloud infrastructure.  


---

## Summary

**Portfolio** is a demonstration of how an AI system can represent a person’s work, skills, and experience interactively.  
It blends **AI orchestration, RAG-based retrieval, Vertex AI integration, and Google Cloud scalability** into a single unified system.  
Every aspect — from the multi-agent architecture to the Redis rate limiter — has been designed by me to ensure performance, intelligence, and robustness at production scale.

> “Not just a portfolio — it’s an intelligent agent that truly knows me.”
