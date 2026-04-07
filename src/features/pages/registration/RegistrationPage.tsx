import { useNavigate } from "react-router-dom";
import type { ChangeEvent } from "react";
import { useToast } from "../../../utils/ToastContext";
import { useRegistration } from "../../../hooks/context/RegistrationContext";
import BrandLogo from "../../../components/shared/BrandLogo";
import { REG_SCHEMA } from "../../../data/registrationSchema";
import swamiji from '../../../assets/hero.svg';
import type {
  FieldSchema,
  FormValue,
  FormDataMap,
} from "../../../types/registration";

interface RegistrationPageProps {
  onBackHome: () => void;
}

function renderField(
  field: FieldSchema,
  value: FormValue | undefined,
  onUpdateField: (id: string, value: FormValue) => void,
  onToggleChip: (fieldId: string, value: string) => void,
  formData: FormDataMap,
) {
  if (field.type === "text" || field.type === "email" || field.type === "tel") {
    return (
      <input
        type={field.type}
        placeholder={field.placeholder || ""}
        value={typeof value === "string" ? value : ""}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onUpdateField(field.id, event.target.value)
        }
        disabled={field.id === "email"}
        className={
          field.id === "email" ? "opacity-60 cursor-not-allowed bg-gray-50" : ""
        }
      />
    );
  }

  if (field.type === "textarea") {
    return (
      <textarea
        placeholder={field.placeholder || ""}
        value={typeof value === "string" ? value : ""}
        onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
          onUpdateField(field.id, event.target.value)
        }
      />
    );
  }

  if (field.type === "select") {
    return (
      <div className="flex flex-col gap-2">
        <select
          value={typeof value === "string" ? value : ""}
          onChange={(event: ChangeEvent<HTMLSelectElement>) =>
            onUpdateField(field.id, event.target.value)
          }
        >
          <option value="">Select...</option>
          {(field.options || []).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {value === "Others" && (
          <input
            type="text"
            placeholder="Please specify..."
            value={typeof formData[`${field.id}_other`] === "string" ? formData[`${field.id}_other`] : ""}
            onChange={(e) => onUpdateField(`${field.id}_other`, e.target.value)}
            className="mt-2"
          />
        )}
      </div>
    );
  }

  if (field.type === "chips") {
    const selected = Array.isArray(value) ? value : [];
    return (
      <div className="flex flex-col gap-3">
        <div className="chip-group">
          {(field.options || []).map((option) => (
            <button
              type="button"
              className={`chip ${selected.includes(option) ? "selected" : ""}`}
              onClick={() => onToggleChip(field.id, option)}
              key={option}
            >
              {option}
            </button>
          ))}
        </div>
        {selected.includes("Others") && (
          <input
            type="text"
            placeholder="Please specify..."
            value={typeof formData[`${field.id}_other`] === "string" ? formData[`${field.id}_other`] : ""}
            onChange={(e) => onUpdateField(`${field.id}_other`, e.target.value)}
            className="mt-1"
          />
        )}
      </div>
    );
  }

  if (field.type === "scale") {
    const min = field.min || 1;
    const max = field.max || 5;
    const labels = field.labels || [];
    const selectedValue = typeof value === "number" ? value : Number(value);

    return (
      <div className="scale-group">
        {Array.from({ length: max - min + 1 }, (_, offset) => {
          const n = min + offset;
          return (
            <div style={{ textAlign: "center" }} key={n}>
              <button
                type="button"
                className={`scale-btn ${selectedValue === n ? "selected" : ""}`}
                onClick={() => onUpdateField(field.id, n)}
              >
                {n}
              </button>
              {labels[n - 1] ? (
                <div className="scale-label">{labels[n - 1]}</div>
              ) : (
                <div className="h-5"> </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return null;
}

function RegistrationPage({ onBackHome }: RegistrationPageProps) {
  const navigate = useNavigate();
  const { showSuccess, showInfo } = useToast();
  const {
    currentSection,
    formData,
    submitted,
    progressPct,
    goToSection,
    updateField,
    toggleChip,
    submitForm,
    isSectionComplete
  } = useRegistration();

  const section = REG_SCHEMA[currentSection];

  if (!section) return null;

  return (
    <div className="reg-page active" id="regPage">
      <div className="reg-topbar">
        <button className="reg-back" onClick={onBackHome}>
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M10 3L5 8l5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to Home
        </button>

        <a className="nav-logo" style={{ textDecoration: "none" }}>
          <BrandLogo compact />
        </a>
      </div>

      <div className="reg-banner">
        <div className="reg-banner-inner">
          <h2>
            Let's Shape Your <em>AI Path</em>
          </h2>
          <p className="">
            The more we know you, the better we curate your learning journey.
            Tell us your story — your curiosity is the first algorithm.
          </p>
        </div>
      </div>
<img className='h-96 w-80 fixed top-56 left-10' src={swamiji} alt="swamiji" />
      <div className="reg-layout">
        
        <div className="reg-sidebar">
          <div className="reg-progress-pct">{progressPct}% Complete</div>
          <div className="reg-progress-bar">
            <div
              className="reg-progress-fill"
              style={{ width: `${progressPct}%` }}
            ></div>
          </div>

          <div className="reg-sections">
            {REG_SCHEMA.map((item, index) => {
              const active = index === currentSection;
              const completed = isSectionComplete(index);
              return (
                <button
                  type="button"
                  className={`reg-sec-item ${active ? "active" : ""} ${completed && !active ? "completed" : ""}`}
                  onClick={() => goToSection(index)}
                  key={item.id}
                >
                  <div className="reg-sec-dot">
                    {completed ? (
                      <svg
                        className="reg-sec-check"
                        viewBox="0 0 10 10"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M2 5l2.5 2.5L8 3"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : null}
                  </div>
                  {item.title}
                </button>
              );
            })}
          </div>
        </div>

        <div className="reg-main">
          {!submitted ? (
            <>
              <div className="reg-form-header">
                <h2>{section.title}</h2>
                <p>{section.subtitle}</p>
              </div>

              <div className="reg-form-body">
                {currentSection === 0 ? (
                  <div className="reg-import">
                    <label className="reg-import-btn">
                      <svg viewBox="0 0 18 18" fill="none" aria-hidden="true">
                        <path
                          d="M9 2v10m0 0l-3-3m3 3l3-3"
                          stroke="currentColor"
                          strokeWidth="1.3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M3 13v2a1 1 0 001 1h10a1 1 0 001-1v-2"
                          stroke="currentColor"
                          strokeWidth="1.3"
                          strokeLinecap="round"
                        />
                      </svg>
                      Upload Resume
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(event) => {
                          const fileName = event.target.files?.[0]?.name;
                          if (fileName) {
                            showSuccess(
                              "Resume Uploaded",
                              `Resume ${fileName} uploaded successfully! In a production system, we would parse this to pre-fill your details.`,
                            );
                          }
                        }}
                      />
                    </label>

                    <button
                      type="button"
                      className="reg-import-btn"
                      onClick={() =>
                        showInfo(
                          "LinkedIn Import",
                          "LinkedIn import would redirect to LinkedIn OAuth in a production system. For now, please fill in the details manually.",
                        )
                      }
                    >
                      <svg viewBox="0 0 18 18" fill="none" aria-hidden="true">
                        <rect
                          x="1"
                          y="1"
                          width="16"
                          height="16"
                          rx="3"
                          stroke="#0077B5"
                          strokeWidth="1.3"
                        />
                        <path
                          d="M5.5 7.5v5m3.5-5v5m0-3.5a2 2 0 014 0v3.5"
                          stroke="#0077B5"
                          strokeWidth="1.3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle cx="5.5" cy="5.5" r=".8" fill="#0077B5" />
                      </svg>
                      Import from LinkedIn
                    </button>
                  </div>
                ) : null}

                {section.fields.map((field) => {
                  const value = formData[field.id];
                  const isFilled = Array.isArray(value)
                    ? value.length > 0
                    : value !== undefined && String(value).trim() !== "";

                  return (
                    <div
                      className={`reg-field ${isFilled ? "filled" : ""}`}
                      key={field.id}
                    >
                      <label>
                        {field.label}
                        {field.required ? <span className="req">*</span> : null}
                      </label>
                      {renderField(field, value, updateField, toggleChip, formData)}
                      {field.hint ? (
                        <div className="hint">{field.hint}</div>
                      ) : null}
                    </div>
                  );
                })}
              </div>

              <div className="reg-nav">
                {currentSection > 0 ? (
                  <button
                    type="button"
                    className="reg-nav-prev"
                    onClick={() => goToSection(currentSection - 1)}
                  >
                    <svg viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path
                        d="M9 3L4 7l5 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Previous
                  </button>
                ) : (
                  <div></div>
                )}

                {currentSection < REG_SCHEMA.length - 1 ? (
                  <button
                    type="button"
                    className="reg-nav-next"
                    onClick={() => goToSection(currentSection + 1)}
                  >
                    Next
                    <svg viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path
                        d="M5 3l5 4-5 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="reg-nav-next submit"
                    onClick={submitForm}
                  >
                    Submit Registration
                    <svg viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path
                        d="M2 7l3.5 3.5L12 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="reg-success">
              <div className="reg-success-icon">
                <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
                  <path
                    d="M8 20l8 8L32 12"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h2>You're On the Radar!</h2>
              <p>
                Thanks for sharing your story with us. Our team is now crafting
                the perfect learning path just for you. We'll notify you shortly
                with your course details, schedule, and everything you need to
                hit the ground running.
              </p>
              <p
                style={{
                  fontStyle: "italic",
                  color: "var(--orange)",
                  fontWeight: 600,
                }}
              >
                "The best algorithms start with great inputs — and yours are
                brilliant."
              </p>
              <button
                className="btn-signin btn-signin-fill"
                style={{
                  backgroundColor: "var(--orange)",
                  color: "#fff",
                  border: "none",
                  padding: ".8rem 2rem",
                  fontSize: "1rem",
                  borderRadius: "10px",
                  fontWeight: 600,
                }}
                onClick={() => navigate('/dashboard')}
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RegistrationPage;

