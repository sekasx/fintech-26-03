import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { Geist } from "next/font/google";
import styles from "@/styles/Home.module.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const sidebarItems = [
  {
    id: "senior-java",
    title: "Senior Java Developer",
    description: "Enterprise-grade platform revamp / Spring + microservices.",
  },
  {
    id: "junior-backend",
    title: "Junior Backend Developer",
    description: "API integrations and internal tooling with Node.",
  },
  {
    id: "frontend",
    title: "Frontend Developer",
    description: "Next.js experience for AI-document viewers.",
  },
  {
    id: "devops",
    title: "DevOps Engineer",
    description: "Hybrid cloud rollout, IaC, observability at scale.",
  },
];

const initialAgents = [
  {
    id: "my-gpt-5.1-mini",
    name: "my-gpt-5.1-mini",
    settings: {
      llmModel: "gpt-4o-mini",
      embeddingsModel: "text-embedding-3-small",
      rerankingModel: "colbert-latest",
      maxTokens: "1024",
      temperature: "0.3",
      behavior: "Respond concisely with actionable next steps.",
    },
  },
  {
    id: "support-pro",
    name: "support-pro",
    settings: {
      llmModel: "gpt-4.1",
      embeddingsModel: "text-embedding-3-large",
      rerankingModel: "bge-large",
      maxTokens: "2048",
      temperature: "0.2",
      behavior: "Sound professional and detail every diagnostic step.",
    },
  },
  {
    id: "concierge-lite",
    name: "concierge-lite",
    settings: {
      llmModel: "gpt-3.5-turbo",
      embeddingsModel: "text-embedding-3-small",
      rerankingModel: "mini-lm-rerank",
      maxTokens: "768",
      temperature: "0.6",
      behavior: "Friendly tone, focus on travel and hospitality questions.",
    },
  },
];

const MY_USER_ID = "user-primary";

export default function Home() {
  const [activeItem, setActiveItem] = useState(sidebarItems[0]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredItems, setFilteredItems] = useState(sidebarItems);
  const [searchLoading, setSearchLoading] = useState(false);
  const [agents, setAgents] = useState(initialAgents);
  const [activeAgentId, setActiveAgentId] = useState(initialAgents[0].id);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsAgentId, setSettingsAgentId] = useState(initialAgents[0].id);
  const [settingsForm, setSettingsForm] = useState({
    name: initialAgents[0].name,
    llmModel: initialAgents[0].settings.llmModel,
    embeddingsModel: initialAgents[0].settings.embeddingsModel,
    rerankingModel: initialAgents[0].settings.rerankingModel,
    maxTokens: initialAgents[0].settings.maxTokens,
    temperature: initialAgents[0].settings.temperature,
    behavior: initialAgents[0].settings.behavior,
  });
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([
    {
      id: "1",
      author: "System",
      userId: "agent",
      text: "Welcome! Pick a document to start chatting.",
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
    {
      id: "2",
      author: "You",
      userId: MY_USER_ID,
      text: "Can you summarize the onboarding checklist?",
      createdAt: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
    },
    {
      id: "3",
      author: "Agent",
      userId: "agent",
      text: "Absolutely. It covers hardware pickup, HR docs, and first-week buddies.",
      createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
    },
  ]);
  const historyRef = useRef(null);

  useEffect(() => {
    const node = historyRef.current;
    if (node) {
      node.scrollTop = node.scrollHeight;
    }
  }, [history]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!message.trim()) {
      return;
    }
    setHistory((current) => [
      ...current,
      {
        id: `${Date.now()}-${Math.random()}`,
        author: "You",
        userId: MY_USER_ID,
        text: message.trim(),
        createdAt: new Date().toISOString(),
      },
    ]);
    setMessage("");
  };

  const activeAgent = agents.find((agent) => agent.id === activeAgentId) ?? agents[0];
  const orderedHistory = [...history].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  useEffect(() => {
    let debounceTimer;
    let mockRequestTimer;

    if (!searchInput.trim()) {
      setFilteredItems(sidebarItems);
      setSearchLoading(false);
      return () => {
        clearTimeout(debounceTimer);
        clearTimeout(mockRequestTimer);
      };
    }

    setSearchLoading(true);
    debounceTimer = setTimeout(() => {
      const target = searchInput.trim().toLowerCase();
      const matches = sidebarItems.filter((item) => {
        const haystack = `${item.title} ${item.description}`.toLowerCase();
        return haystack.includes(target);
      });
      mockRequestTimer = setTimeout(() => {
        setFilteredItems(matches);
        setSearchLoading(false);
      }, 300);
    }, 200);

    return () => {
      clearTimeout(debounceTimer);
      clearTimeout(mockRequestTimer);
    };
  }, [searchInput]);

  const openSettings = () => {
    const current = agents.find((agent) => agent.id === activeAgentId);
    if (current) {
      setSettingsAgentId(current.id);
      setSettingsForm({
        name: current.name,
        ...current.settings,
      });
    }
    setSettingsOpen(true);
  };

  const handleAgentSelect = (event) => {
    const agentId = event.target.value;
    setSettingsAgentId(agentId);
    const agent = agents.find((entry) => entry.id === agentId);
    if (agent) {
      setSettingsForm({
        name: agent.name,
        ...agent.settings,
      });
    }
  };

  const handleCreateNew = () => {
    setSettingsAgentId("new");
    setSettingsForm({
      name: "",
      llmModel: "",
      embeddingsModel: "",
      rerankingModel: "",
      maxTokens: "",
      temperature: "",
      behavior: "",
    });
  };

  const handleSettingsChange = (event) => {
    const { name, value } = event.target;
    setSettingsForm((current) => ({ ...current, [name]: value }));
  };

  const handleSaveSettings = () => {
    if (settingsAgentId === "new") {
      const generatedId =
        settingsForm.name?.trim().replace(/\s+/g, "-").toLowerCase() ||
        `agent-${Date.now()}`;
      const nextAgent = {
        id: generatedId,
        name: settingsForm.name || generatedId,
        settings: {
          llmModel: settingsForm.llmModel,
          embeddingsModel: settingsForm.embeddingsModel,
          rerankingModel: settingsForm.rerankingModel,
          maxTokens: settingsForm.maxTokens,
          temperature: settingsForm.temperature,
          behavior: settingsForm.behavior,
        },
      };
      setAgents((current) => [...current, nextAgent]);
      setActiveAgentId(nextAgent.id);
    } else {
      setAgents((current) =>
        current.map((agent) =>
          agent.id === settingsAgentId
            ? {
                ...agent,
                name: settingsForm.name || agent.name,
                settings: {
                  llmModel: settingsForm.llmModel,
                  embeddingsModel: settingsForm.embeddingsModel,
                  rerankingModel: settingsForm.rerankingModel,
                  maxTokens: settingsForm.maxTokens,
                  temperature: settingsForm.temperature,
                  behavior: settingsForm.behavior,
                },
              }
            : agent
        )
      );
      setActiveAgentId(settingsAgentId);
    }
    setSettingsOpen(false);
  };

  useEffect(() => {
    if (!settingsOpen) {
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSettingsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [settingsOpen]);

  return (
    <>
      <Head>
        <title>Chat Console</title>
        <meta name="description" content="Sidebar plus chat playground" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`${styles.page} ${geistSans.variable}`}>
        <div className={styles.sidebar}>
          <label className={styles.searchLabel} htmlFor="semantic-search">
            Workspace search
          </label>
          <textarea
            id="semantic-search"
            className={styles.searchArea}
            rows={3}
            placeholder="Semantic search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <h1 className={styles.sidebarTitle}>Documents</h1>
          <div className={styles.sidebarListWrapper}>
            <ul className={styles.sidebarList}>
              {filteredItems.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`${styles.sidebarItem} ${
                      activeItem.id === item.id ? styles.sidebarItemActive : ""
                    }`}
                    onClick={() => setActiveItem(item)}
                  >
                    <span className={styles.sidebarItemTitle}>{item.title}</span>
                    <span className={styles.sidebarItemDescription}>
                      {item.description}
                    </span>
                  </button>
                </li>
              ))}
              {filteredItems.length === 0 && !searchLoading && (
                <li className={styles.emptyState}>No documents match that query.</li>
              )}
            </ul>
            {searchLoading && (
              <div className={styles.sidebarLoading}>
                <div className={styles.spinner} />
                <span>Searching...</span>
              </div>
            )}
          </div>
        </div>

        <main className={styles.chatPanel}>
          <header className={styles.chatHeader}>
            <div>
              <p className={styles.chatEyebrow}>
                model: {activeAgent?.name ?? "loading..."}
              </p>
              <h2 className={styles.chatTitle}>{activeItem.title}</h2>
              <p className={styles.chatSubtitle}>{activeItem.description}</p>
            </div>
            <button
              type="button"
              className={styles.settingsButton}
              onClick={openSettings}
              aria-label="Open agent settings"
            >
              ⚙️
            </button>
          </header>

          <section className={styles.chatHistory} ref={historyRef}>
            {orderedHistory.map((entry) => {
              const isMine = entry.userId === MY_USER_ID;
              return (
                <article
                  key={entry.id}
                  className={`${styles.chatMessage} ${
                    isMine ? styles.chatMessageMine : styles.chatMessageOther
                  }`}
                >
                  <div className={styles.chatMessageHeader}>
                    <span className={styles.chatAuthor}>{entry.author}</span>
                    <time className={styles.chatTimestamp}>
                      {new Date(entry.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                  </div>
                  <p>{entry.text}</p>
                </article>
              );
            })}
          </section>

          <form className={styles.chatInputArea} onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Type a message and hit enter..."
              className={styles.chatInput}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
          </form>
        </main>
      </div>
      {settingsOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Agent settings</h3>
              <button
                type="button"
                className={styles.closeButton}
                onClick={() => setSettingsOpen(false)}
                aria-label="Close settings"
              >
                ×
              </button>
            </div>
            <div className={styles.modalRow}>
              <label className={styles.modalLabel}>Agent</label>
              <div className={styles.modalAgentControls}>
                <select
                  className={styles.modalSelect}
                  value={settingsAgentId}
                  onChange={handleAgentSelect}
                >
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className={styles.createButton}
                  onClick={handleCreateNew}
                >
                  Create new
                </button>
              </div>
            </div>
            <div className={styles.modalGrid}>
            <label className={styles.modalLabel}>
                Agent name
                <input
                  type="text"
                  name="name"
                  value={settingsForm.name}
                  onChange={handleSettingsChange}
                />
              </label>
              <label>
                LLM model
                <input
                  type="text"
                  name="llmModel"
                  value={settingsForm.llmModel}
                  onChange={handleSettingsChange}
                />
              </label>
              <label>
                Embeddings model
                <input
                  type="text"
                  name="embeddingsModel"
                  value={settingsForm.embeddingsModel}
                  onChange={handleSettingsChange}
                />
              </label>
              <label>
                ReRanking model
                <input
                  type="text"
                  name="rerankingModel"
                  value={settingsForm.rerankingModel}
                  onChange={handleSettingsChange}
                />
              </label>
              <label>
                Max tokens
                <input
                  type="number"
                  name="maxTokens"
                  value={settingsForm.maxTokens}
                  onChange={handleSettingsChange}
                />
              </label>
              <label>
                Temperature
                <input
                  type="number"
                  step="0.1"
                  name="temperature"
                  value={settingsForm.temperature}
                  onChange={handleSettingsChange}
                />
              </label>
            </div>
            <label className={styles.behaviorLabel}>
              Agent behavior
              <textarea
                rows={4}
                name="behavior"
                value={settingsForm.behavior}
                onChange={handleSettingsChange}
              />
            </label>
            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.saveButton}
                onClick={handleSaveSettings}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
