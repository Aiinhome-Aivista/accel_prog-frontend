import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, useMemo } from "react";
import { useToast } from "../../../utils/ToastContext";
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

  // Initial Greeting
  useEffect(() => {
    if (messages.length === 0) {
      const startChat = async () => {
        const firstName = user?.name?.split(" ")[0] || "there";
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
      <div className="reg-topbar">
        <button className="reg-back" onClick={onBackHome}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>
        <BrandLogo compact />
        <div style={{ width: 60 }}></div>
      </div>

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
                <div className="profile-header">Registration Summary</div>
                <div className="profile-description">
                  Excellent! Your profile for <strong>{String(formData["fullName"] || user?.name || "Student")}</strong> has been prepared.
                  We'll customize your experience based on your background in {String(formData["branch"] || "your field")}.
                </div>
                <button className="btn-letsgo" onClick={handleLetsGo} disabled={isSubmitting}>
                  {isSubmitting ? "Finalizing..." : "Complete Registration & Go! 🚀"}
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
                {(currentField.options || (currentField.type === "scale" ? Array.from({length: (currentField.max||5)-(currentField.min||1)+1}, (_, i) => String((currentField.min||1)+i)) : [])).map((opt) => {
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
                  <button className="chip-choice" style={{background: '#f06428', color: 'white'}} onClick={() => processNextStep(String(formData[currentField.id]))}>
                    Confirm ✓
                  </button>
                )}
              </>
            ) : (
              <div className="flex flex-col gap-2 w-full max-w-md">
                 {currentField.type === "textarea" ? (
                   <textarea
                     className="bubble-assistant border w-full"
                     style={{borderRadius: 18, minHeight: 100, padding: '1rem'}}
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
                     style={{borderRadius: 20, padding: '0.8rem 1.2rem'}}
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

