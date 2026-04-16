import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, useMemo } from "react";
import { useRegistration } from "../../../hooks/context/RegistrationContext";
import { useAuth } from "../../../hooks/context/AuthContext";
import BrandLogo from "../../../components/shared/BrandLogo";
import { REG_SCHEMA } from "../../../data/registrationSchema";
import "./RegistrationPage.css";

interface Message {
  id: string;
  type: "assistant" | "user" | "typing" | "profile" | "section";
  content?: string;
}

function RegistrationPage({ onBackHome }: { onBackHome: () => void }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    formData,
    updateField,
    submitForm,
    isSubmitting,
  } = useRegistration();

  const [messages, setMessages] = useState<Message[]>([]);
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const hasStarted = useRef(false);

  // Maintain flat list of fields AND knowledge of which section they belong to
  const allFields = useMemo(() => {
    return REG_SCHEMA.flatMap((section) =>
      section.fields.map(field => ({ ...field, sectionTitle: section.title }))
    );
  }, []);

  const currentField = allFields[currentFieldIndex];

  const addAssistantMessage = async (content: string, delay = 800) => {
    setIsTyping(true);
    await new Promise((r) => setTimeout(r, delay));
    setIsTyping(false);
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString() + Math.random(), type: "assistant", content },
    ]);
  };

  const formatFirstName = (name: string) => {
    const firstName = name.trim().split(" ")[0];
    return firstName
      ? firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase()
      : "There";
  };

  useEffect(() => {
    if (!hasStarted.current) {
      hasStarted.current = true;
      const startChat = async () => {
        const firstName = user?.name ? formatFirstName(user.name) : "there";
        await addAssistantMessage(`Hey ${firstName}! 👋 I'm your learning assistant. Let's get you registered!`);
        await addAssistantMessage(`We'll start with: ${allFields[0].sectionTitle}`);
        await addAssistantMessage(allFields[0].label);
      };
      startChat();
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const processNextStep = async (displayValue: string) => {
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, type: "user", content: displayValue },
    ]);

    if (currentFieldIndex < allFields.length - 1) {
      const nextIndex = currentFieldIndex + 1;
      const nextField = allFields[nextIndex];
      const prevField = allFields[currentFieldIndex];

      setCurrentFieldIndex(nextIndex);

      if (nextField.sectionTitle !== prevField.sectionTitle) {
        await addAssistantMessage(`Great. Now let's move to ${nextField.sectionTitle}.`);
      }

      await addAssistantMessage(nextField.label);
    } else {
      await addAssistantMessage("Thank you! I've gathered all the details.");
      setMessages((prev) => [
        ...prev,
        { id: "profile-summary", type: "profile" },
      ]);
    }
  };

  const handleOptionSelect = (fieldId: string, value: string) => {
    if (currentField.type === "chips") {
      const currentVal = String(formData[fieldId] || "");
      const items = currentVal ? currentVal.split(", ") : [];
      if (items.includes(value)) {
        items.splice(items.indexOf(value), 1);
      } else {
        items.push(value);
      }
      updateField(fieldId, items.join(", "));
    } else {
      updateField(fieldId, value);
      processNextStep(value);
    }
  };

  const handleLetsGo = async () => {
    await submitForm();
    sessionStorage.setItem("just_registered", "true");
    setTimeout(() => navigate("/dashboard"), 800);
  };
  return (
    <div className="reg-page">
      {/* Top Navigation */}
      <div className="reg-topbar">
        <button className="reg-back" onClick={onBackHome}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="#b0b0b0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Home
        </button>
        <div className="reg-logo-wrapper">
          <BrandLogo compact />
        </div>
      </div>

      {/* Hero Banner */}
      <div className="reg-banner">
        <div className="banner-content">
          <h1 className="banner-title">
            Let's Shape Your <span className="highlight-orange">AI Path</span>
          </h1>
          <p className="banner-subtitle">
            The more we know you, the better we curate your learning journey. Tell us your story — your curiosity is the first algorithm.
          </p>
        </div>
        <div className="banner-decoration decoration-1"></div>
        <div className="banner-decoration decoration-2"></div>
      </div>

      {/* Chat Interface */}
      <div className="chat-container">
        {messages.map((msg) => (
          <div key={msg.id} className={`message-${msg.type}`}>
            {msg.type === "assistant" && (
              <>
                <div className="assistant-avatar">M</div>
                <div className="bubble-assistant">{msg.content}</div>
              </>
            )}
            {msg.type === "user" && <div className="bubble-user">{msg.content}</div>}
            {msg.type === "profile" && (
              <div className="profile-card">
                <div className="profile-header">You're On the Radar!</div>
                <div className="profile-description">Thanks for sharing your story with us. Our team is now crafting
                  the perfect learning path just for you. We'll notify you shortly
                  with your course details, schedule, and everything you need to
                  hit the ground running. In the mean time explore & subscribe to
                  our pre recommended courses which may suite your need.
                </div>
                <p
                  style={{
                    fontStyle: "italic",
                    color: "var(--orange)",
                    fontWeight: 600,
                    textAlign: "center",
                  }}>
                  The best algorithms start with great inputs — and yours are brilliant.
                </p>
                <button className="btn-letsgo" onClick={handleLetsGo} disabled={isSubmitting}>
                  {isSubmitting ? "Loading..." : "Go to Dashboard"}
                </button>
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="message-assistant">
            <div className="assistant-avatar">M</div>
            <div className="bubble-assistant typing-bubble">
              <div className="dot"></div><div className="dot"></div><div className="dot"></div>
            </div>
          </div>
        )}

        {!isTyping && currentField && !messages.find(m => m.type === "profile") && (
          <div className="chat-actions">
            {(currentField.type === "chips" || currentField.type === "select" || currentField.type === "scale") ? (
              <>
                {(currentField.options || (currentField.type === "scale" ? Array.from({ length: (currentField.max || 5) - (currentField.min || 1) + 1 }, (_, i) => String((currentField.min || 1) + i)) : [])).map((opt) => {
                  const selected = String(formData[currentField.id] || "").split(", ").includes(opt);
                  return (
                    <button
                      key={opt}
                      className={`chip-choice ${selected ? 'selected' : ''}`}
                      onClick={() => handleOptionSelect(currentField.id, opt)}
                    >
                      {opt}
                    </button>
                  );
                })}
                {currentField.type === "chips" && String(formData[currentField.id] || "") && (
                  <button className="chip-choice" style={{ background: '#f06428', color: 'white' }} onClick={() => processNextStep(String(formData[currentField.id]))}>
                    Confirm ✓
                  </button>
                )}
              </>
            ) : (
              <div className="flex flex-col gap-2 w-full max-w-md">
                {currentField.type === "textarea" ? (
                  <textarea
                    className="bubble-assistant border w-full"
                    style={{ borderRadius: 18, minHeight: 100, padding: '1rem' }}
                    placeholder={currentField.placeholder || "Your answer..."}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        const val = (e.target as HTMLTextAreaElement).value;
                        if (val.trim()) {
                          processNextStep(val);
                          updateField(currentField.id, val);
                          (e.target as HTMLTextAreaElement).value = "";
                        }
                      }
                    }}
                  />
                ) : (
                  <input
                    className="bubble-assistant border w-full"
                    style={{ borderRadius: 20, padding: '0.8rem 1.2rem' }}
                    type={currentField.type}
                    placeholder={currentField.placeholder || "Type here..."}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const val = (e.target as HTMLInputElement).value;
                        if (val.trim()) {
                          processNextStep(val);
                          updateField(currentField.id, val);
                          (e.target as HTMLInputElement).value = "";
                        }
                      }
                    }}
                  />
                )}
              </div>
            )}
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
    </div>
  );
}

export default RegistrationPage;

