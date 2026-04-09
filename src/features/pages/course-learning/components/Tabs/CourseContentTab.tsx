import React, { useState, useEffect } from "react";
import type { WeekData } from "../../course-learning.models";

import {
  UploadCloud,
  CheckCircle2,
  ChevronRight,
  FileText,
  Video,
  PenSquare,
  MessageSquare,
  Briefcase,
  Loader,
} from "lucide-react";
import { dashboardService } from "../../../../../services/dashboardService";

interface CourseContentTabProps {
  weeks: WeekData[];
  curW: number;
  setCurW: (w: number) => void;
  done: Set<string>;
  markDone: (id: string) => void;
  courseId?: number;
  userId?: number;
}

export const CourseContentTab: React.FC<CourseContentTabProps> = ({
  weeks,
  curW,
  setCurW,
  done,
  markDone,
  courseId = 1,
  userId = 323,
}) => {
  const [curS, setCurS] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [discussions, setDiscussions] = useState<Record<string, any>>({});
  const [uploads, setUploads] = useState<Record<string, string[]>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [loadingSubtopic, setLoadingSubtopic] = useState<string | null>(null);

  // Provide new seed format properly on unmount/mount or just locally
  const [localMessage, setLocalMessage] = useState("");

  useEffect(() => {
    setCurS(0);
    setIsEditing(false);
  }, [curW]);

  const handleMarkComplete = async (subtopicId: string) => {
    const moduleId = curW + 1; // Using week index as module ID
    const subtopicNum = parseInt(subtopicId.split("s")[1] || "0");
    
    try {
      setLoadingSubtopic(subtopicId);
      await dashboardService.completeSubtopicModuleCourseWiseByUser(
        courseId,
        moduleId,
        subtopicNum,
        userId
      );
      markDone(subtopicId);
    } catch (error) {
      console.error("Error marking subtopic complete:", error);
    } finally {
      setLoadingSubtopic(null);
    }
  };

  if (!weeks || weeks.length === 0) return null;
  const w = weeks[curW];

  if (!w.ul) {
    return (
      <div className="max-w-[860px] mx-auto p-[1rem] md:p-[1.3rem_1.8rem_3rem]">
        <WeekTabs w={weeks} curW={curW} setCurW={setCurW} />
        <div className="bg-white rounded-[14px] border border-[#E5DDD4] mb-[1rem]">
          <div className="p-[2rem] text-center text-[#9597A6]">
            <div className="text-[1.6rem] mb-[0.5rem]">🔒</div>
            <h3 className="font-['DM_Serif_Display'] text-[1.17em] text-[#2B2D42] mb-[0.2rem] mt-0">
              Week Locked
            </h3>
            <p className="text-[0.78rem] m-0">
              Complete the previous week to unlock.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const sub = w.subs[curS];
  const isDone = done.has(sub.id);

  const isSubLocked = (wi: number, si: number) => {
    if (si === 0) return !weeks[wi].ul;
    const prev = weeks[wi].subs[si - 1];
    return !done.has(prev.id);
  };
  const lk = isSubLocked(curW, curS);

  const nextSub = curS < w.subs.length - 1 ? w.subs[curS + 1] : null;
  const canNext = done.has(sub.id);

  const doneCount = w.subs.filter((s) => done.has(s.id)).length;
  const pct = Math.round((doneCount / w.subs.length) * 100);

  const postDiscussion = () => {
    if (!localMessage.trim()) return;
    const newMsg = {
      n: "You",
      a: "Y",
      tm: "Now",
      tx: localMessage.trim(),
      lk: 0,
    };
    setDiscussions((prev) => ({
      ...prev,
      [sub.id]: [newMsg, ...(prev[sub.id] || sub.seeds || [])],
    }));
    setLocalMessage("");
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const fileNames = Array.from(e.target.files).map((f) => f.name);
    setUploads((prev) => ({
      ...prev,
      [sub.id]: [...(prev[sub.id] || []), ...fileNames],
    }));
  };

  // const toggleEdit = () => {
  //   if (isEditing) {
  //     if (sub.content !== undefined) {
  //       sub.content = editContent;
  //     }
  //     setIsEditing(false);
  //   } else {
  //     setEditContent(sub.content || "");
  //     setIsEditing(true);
  //   }
  // };

  return (
    <div className="max-w-[860px] mx-auto p-[1rem] md:p-[1.3rem_1.8rem_3rem]">
      <WeekTabs w={weeks} curW={curW} setCurW={setCurW} />

      <div
        className="text-[1.3rem] text-[#2B2D42] mb-[1.2rem] font-medium"
        style={{ fontFamily: '"DM Serif Display", serif' }}
      >
        {w.t}
      </div>

      <div className="bg-white rounded-[14px] border border-[#E5DDD4] p-[0.6rem] mb-[1.2rem]">
        {w.subs.map((s, si) => {
          const a = si === curS;
          const d = done.has(s.id);
          const l = isSubLocked(curW, si);

          let Icon = FileText;
          if (s.type === "video") Icon = Video;
          else if (s.type === "assess") Icon = PenSquare;
          else if (s.type === "discussion") Icon = MessageSquare;
          else if (s.type === "project") Icon = Briefcase;

          return (
            <div
              key={si}
              className={`flex items-center gap-[0.45rem] p-[0.45rem_0.6rem] rounded-[8px] cursor-pointer text-[0.73rem] font-medium transition-all mb-[0.15rem] ${
                a
                  ? "bg-[#e87a2e1f] text-[#E87A2E] font-semibold"
                  : d
                    ? "text-[#4CAF50] hover:bg-[#F9F5F0]"
                    : l
                      ? "opacity-35 cursor-default hover:bg-transparent text-[#6B6D7B]"
                      : "text-[#6B6D7B] hover:bg-[#F9F5F0] hover:text-[#2B2D42]"
              }`}
              onClick={() => {
                if (!l) setCurS(si);
              }}
            >
              <div
                className={`w-[7px] h-[7px] rounded-full border-[1.5px] shrink-0 ${
                  a
                    ? "bg-[#E87A2E] border-[#E87A2E]"
                    : d
                      ? "bg-[#4CAF50] border-[#4CAF50]"
                      : "border-[#E5DDD4] bg-transparent"
                }`}
              ></div>
              <Icon size={13} className="opacity-40 shrink-0" />
              <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                {s.title}
              </div>
              {d && <CheckCircle2 size={14} className="text-[#4CAF50]" />}
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-[14px] border border-[#E5DDD4] p-[0.7rem_1rem] mb-[1.2rem] flex items-center gap-[0.8rem]">
        <span className="text-[0.74rem] font-semibold text-[#2B2D42] whitespace-nowrap">
          {doneCount} of {w.subs.length} completed
        </span>
        <div className="flex-1 h-[6px] bg-[#E5DDD4] rounded-[3px] overflow-hidden">
          <div
            className="h-full rounded-[3px] bg-gradient-to-r from-[#E87A2E] to-[#4CAF50] transition-all duration-400"
            style={{ width: `${pct}%` }}
          ></div>
        </div>
        <span className="text-[0.7rem] font-bold text-[#E87A2E] whitespace-nowrap">
          {pct}%
        </span>
      </div>

      {lk ? (
        <div className="bg-white rounded-[14px] border border-[#E5DDD4] mb-[1rem]">
          <div className="p-[2rem] text-center text-[#9597A6]">
            <div className="text-[1.4rem] mb-[0.4rem]">🔒</div>
            <p className="text-[0.78rem] m-0">
              Complete the previous sub-topic to unlock this one.
            </p>
          </div>
        </div>
      ) : (
        <>
          {sub.type === "reading" && (
            <div className="bg-white rounded-[14px] border border-[#E5DDD4] overflow-hidden mb-[1rem]">
              <div className="p-[0.5rem_0.8rem] bg-[#F9F5F0] border-b border-[#E5DDD4] flex items-center justify-between">
                <span className="text-[0.7rem] font-semibold text-[#6B6D7B] flex items-center gap-1.5">
                  <FileText size={14} /> {sub.title}
                </span>
                {/* <button
                  className={`px-[0.6rem] py-[0.25rem] rounded-[5px] border text-[0.66rem] font-semibold cursor-pointer font-inherit transition-all ${isEditing ? "bg-[#E87A2E] text-white border-[#E87A2E]" : "bg-white text-[#6B6D7B] border-[#E5DDD4] hover:border-[#E87A2E] hover:text-[#E87A2E]"}`}
                  onClick={toggleEdit}
                >
                  {isEditing ? "Save" : "Edit"}
                </button> */}
              </div>
              <div className="p-[1.5rem] leading-[1.75] text-[0.86rem] min-h-[180px]">
                {isEditing ? (
                  <textarea
                    className="w-full h-full min-h-[300px] p-[10px] border border-[#E5DDD4] rounded-[5px] font-inherit text-[0.86rem] focus:outline-none focus:border-[#E87A2E]"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                  />
                ) : (
                  <div
                    className="prose prose-sm prose-slate max-w-none text-[#6B6D7B] [&>h2]:font-['DM_Serif_Display'] [&>h2]:text-[1.05rem] [&>h2]:text-[#2B2D42] [&>h2]:mt-[1.2rem] [&>h2]:mb-[0.4rem] [&>h2:first-child]:mt-0 [&>p]:mb-[0.7rem] [&>blockquote]:border-l-[3px] [&>blockquote]:border-[#E87A2E] [&>blockquote]:p-[0.5rem_0.9rem] [&>blockquote]:my-[0.7rem] [&>blockquote]:bg-[#e87a2e1f] [&>blockquote]:rounded-r-[8px] [&>blockquote]:italic [&>strong]:text-[#2B2D42] [&_code]:bg-[#F9F5F0] [&_code]:p-[0.1rem_0.3rem] [&_code]:rounded-[3px] [&_code]:font-mono [&_code]:text-[0.78rem] [&_code]:text-[#D06A20]"
                    dangerouslySetInnerHTML={{ __html: sub.content || "" }}
                  />
                )}
              </div>
            </div>
          )}

          {sub.type === "video" && (
            <div className="bg-black rounded-[14px] overflow-hidden aspect-video relative mb-[0.8rem] group">
              <video
                className="w-full h-full object-cover"
                src="https://www.w3schools.com/html/mov_bbb.mp4"
                controls={true}
              ></video>
            </div>
          )}

          {sub.type === "assess" &&
            sub.questions &&
            ["critical", "technical", "problem", "subjective"].map((catKey) => {
              const qs = sub.questions
                ? sub.questions[catKey as keyof typeof sub.questions]
                : [];
              if (!qs || qs.length === 0) return null;

              const catData = {
                critical: {
                  label: "Critical Thinking",
                  icon: "🧠",
                  bg: "rgba(156,39,176,.08)",
                  c: "#9C27B0",
                },
                technical: {
                  label: "Technical Depth",
                  icon: "⚙️",
                  bg: "rgba(66,133,244,.1)",
                  c: "#4285F4",
                },
                problem: {
                  label: "Problem Solving",
                  icon: "🧩",
                  bg: "#e87a2e1f",
                  c: "#E87A2E",
                },
                subjective: {
                  label: "Subjective",
                  icon: "✍️",
                  bg: "#E8F5E9",
                  c: "#4CAF50",
                },
              }[catKey];

              return (
                <div
                  key={catKey}
                  className="bg-white rounded-[14px] border border-[#E5DDD4] mb-[0.8rem] overflow-hidden"
                >
                  <div className="p-[0.7rem_1rem] border-b border-[#E5DDD4] flex items-center gap-[0.4rem]">
                    <div
                      className="w-[22px] h-[22px] rounded-[5px] flex items-center justify-center shrink-0 text-[0.75rem]"
                      style={{
                        backgroundColor: catData?.bg,
                        color: catData?.c,
                      }}
                    >
                      {catData?.icon}
                    </div>
                    <h4 className="text-[0.8rem] font-bold text-[#2B2D42] m-0">
                      {catData?.label}
                    </h4>
                    <div className="ml-auto text-[0.6rem] font-semibold text-[#9597A6]">
                      {qs.length}Q
                    </div>
                  </div>
                  <div className="p-[0.9rem_1rem]">
                    {qs.map((q, qi) => {
                      const qid = `${sub.id}_${catKey}_${qi}`;
                      const isMcq = q.type === "mcq";
                      const sel = answers[qid];
                      const submitted = answers[`${qid}_sub`];

                      return (
                        <div
                          key={qi}
                          className="mb-[1rem] pb-[0.8rem] border-b border-black/5 last:border-none last:mb-0 last:pb-0"
                        >
                          <div className="text-[0.63rem] font-bold text-[#E87A2E] uppercase tracking-[0.05em] mb-[0.25rem]">
                            {catData?.label} · Q{qi + 1}
                          </div>
                          <div className="text-[0.82rem] text-[#2B2D42] font-semibold leading-[1.5] mb-[0.5rem]">
                            {q.q}
                          </div>

                          {isMcq ? (
                            <div className="flex flex-col gap-[0.25rem]">
                              {q.opts?.map((o, oi) => {
                                let cls =
                                  "flex items-start gap-[0.4rem] p-[0.45rem_0.6rem] rounded-[8px] border-[1.5px] cursor-pointer text-[0.78rem] transition-all ";
                                if (sel !== undefined) {
                                  if (oi === sel && oi === q.ans)
                                    cls +=
                                      "border-[#4CAF50] bg-[#E8F5E9] text-[#2E7D32]";
                                  else if (oi === sel)
                                    cls +=
                                      "border-[#EA4335] bg-[#ea433514] text-[#C62828]";
                                  else if (oi === q.ans)
                                    cls +=
                                      "border-[#4CAF50] bg-[#E8F5E9] text-[#2E7D32]";
                                  else cls += "border-[#E5DDD4] text-[#6B6D7B]";
                                } else {
                                  cls +=
                                    "border-[#E5DDD4] text-[#6B6D7B] hover:border-[#E87A2E] hover:text-[#E87A2E] hover:bg-[#e87a2e1f]";
                                }

                                return (
                                  <div
                                    key={oi}
                                    className={cls}
                                    onClick={() => {
                                      if (sel === undefined)
                                        setAnswers((p) => ({
                                          ...p,
                                          [qid]: oi,
                                        }));
                                    }}
                                  >
                                    <div className="w-[15px] h-[15px] rounded-full border-2 shrink-0 mt-[1px] flex items-center justify-center border-current">
                                      {sel !== undefined &&
                                        (oi === sel || oi === q.ans) && (
                                          <div className="w-[7px] h-[7px] rounded-full bg-current"></div>
                                        )}
                                    </div>
                                    {o}
                                  </div>
                                );
                              })}
                              {sel !== undefined && (
                                <div
                                  className={`p-[0.4rem_0.6rem] rounded-[8px] text-[0.74rem] mt-[0.3rem] leading-[1.4] ${sel === q.ans ? "bg-[#E8F5E9] text-[#2E7D32]" : "bg-[#ea433514] text-[#C62828]"}`}
                                >
                                  {sel === q.ans
                                    ? "Correct!"
                                    : "Review the reading material."}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div>
                              <textarea
                                className="w-full p-[0.5rem_0.7rem] border-[1.5px] border-[#E5DDD4] rounded-[8px] text-[0.8rem] font-inherit min-h-[70px] resize-y bg-[#F9F5F0] focus:outline-none focus:border-[#E87A2E] focus:bg-white"
                                placeholder="Write your answer..."
                                value={sel || ""}
                                onChange={(e) => {
                                  if (!submitted)
                                    setAnswers((p) => ({
                                      ...p,
                                      [qid]: e.target.value,
                                    }));
                                }}
                                disabled={submitted}
                              ></textarea>
                              {!submitted && (
                                <button
                                  className="px-[1rem] py-[0.4rem] rounded-[7px] bg-[#E87A2E] text-white text-[0.74rem] font-semibold cursor-pointer border-none mt-[0.3rem]"
                                  onClick={() =>
                                    setAnswers((p) => ({
                                      ...p,
                                      [`${qid}_sub`]: 1,
                                    }))
                                  }
                                >
                                  Submit
                                </button>
                              )}
                              {submitted && (
                                <div className="p-[0.4rem_0.6rem] rounded-[8px] text-[0.74rem] mt-[0.3rem] leading-[1.4] bg-[#E8F5E9] text-[#2E7D32]">
                                  Submitted for review.
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

          {sub.type === "discussion" && (
            <div className="mb-[1rem]">
              <div className="bg-[#1A1B2E] rounded-t-[14px] p-[0.9rem_1.1rem] text-white">
                <h4 className="font-['DM_Serif_Display'] text-[0.88rem] mb-[0.1rem] m-0">
                  {sub.topic}
                </h4>
                <p className="text-[0.68rem] text-white/50 m-0">
                  Cohort Alpha-3 · {w.t}
                </p>
              </div>
              <div className="bg-white border text-[#2B2D42] border-t-0 border-[#E5DDD4] rounded-b-[14px] p-[0.8rem]">
                <div className="flex gap-[0.4rem] mb-[0.6rem] items-start">
                  <div className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-[0.55rem] font-bold shrink-0 bg-[#e87a2e1f] text-[#E87A2E]">
                    Y
                  </div>
                  <textarea
                    className="flex-1 p-[0.4rem_0.5rem] border-[1.5px] border-[#E5DDD4] rounded-[8px] text-[0.76rem] font-inherit min-h-[36px] resize-y bg-[#F9F5F0] focus:outline-none focus:border-[#E87A2E] focus:bg-white"
                    placeholder="Share your thoughts..."
                    value={localMessage}
                    onChange={(e) => setLocalMessage(e.target.value)}
                  ></textarea>
                  <button
                    className="px-[0.65rem] py-[0.28rem] rounded-[6px] bg-[#E87A2E] text-white text-[0.68rem] font-semibold cursor-pointer border-none self-end shrink-0 hover:bg-[#D06A20]"
                    onClick={postDiscussion}
                  >
                    Post
                  </button>
                </div>
                {(discussions[sub.id] || sub.seeds || []).map(
                  (m: any, i: number) => (
                    <div
                      key={i}
                      className="flex gap-[0.4rem] py-[0.4rem] border-b border-black/5 last:border-none"
                    >
                      <div
                        className={`w-[26px] h-[26px] rounded-full flex items-center justify-center text-[0.55rem] font-bold shrink-0 ${i % 2 ? "bg-[#E8F5E9] text-[#4CAF50]" : "bg-[#e87a2e1f] text-[#E87A2E]"}`}
                      >
                        {m.a}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-[0.25rem] mb-[0.08rem]">
                          <span className="text-[0.7rem] font-bold text-[#2B2D42]">
                            {m.n}
                          </span>
                          <span className="text-[0.58rem] text-[#9597A6]">
                            {m.tm}
                          </span>
                        </div>
                        <div className="text-[0.74rem] text-[#6B6D7B] leading-[1.5]">
                          {m.tx}
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          )}

          {sub.type === "project" && (
            <div className="bg-white rounded-[14px] border border-[#E5DDD4] p-[1.1rem] mb-[1rem]">
              <h4 className="font-['DM_Serif_Display'] text-[0.9rem] text-[#2B2D42] mb-[0.3rem] m-0">
                {sub.title}
              </h4>
              <p className="text-[0.78rem] text-[#6B6D7B] leading-[1.6] mb-[0.4rem]">
                {sub.brief}
              </p>
              <ul className="m-0 ml-[1rem] p-0 mb-[0.6rem] text-[0.76rem] text-[#6B6D7B] leading-[1.5]">
                {sub.reqs?.map((r, i) => (
                  <li key={i} className="mb-[0.15rem]">
                    {r}
                  </li>
                ))}
              </ul>

              <label
                htmlFor={`fu${sub.id}`}
                className="border-2 border-dashed border-[#E5DDD4] rounded-[14px] p-[1.3rem] text-center cursor-pointer transition-all mb-[0.4rem] block hover:border-[#E87A2E] hover:bg-[#e87a2e1f]"
              >
                <UploadCloud
                  size={22}
                  className="text-[#9597A6] mx-auto mb-[0.2rem] opacity-70"
                />
                <p className="text-[0.72rem] text-[#9597A6] m-0">
                  Drop files or{" "}
                  <strong className="text-[#E87A2E]">browse</strong>
                </p>
                <input
                  type="file"
                  id={`fu${sub.id}`}
                  multiple
                  className="hidden"
                  onChange={handleUpload}
                />
              </label>

              {(uploads[sub.id] || []).map((f, i) => (
                <div
                  key={i}
                  className="flex items-center gap-[0.25rem] p-[0.25rem_0.45rem] bg-[#E8F5E9] rounded-[5px] text-[0.68rem] font-medium text-[#4CAF50] mb-[0.15rem] w-max"
                >
                  <CheckCircle2 size={12} /> {f}
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between py-[1rem] mt-[0.6rem] border-t border-[#E5DDD4] gap-[0.5rem]">
            <button
              className={`px-[1.1rem] py-[0.5rem] rounded-[9px] border text-[0.78rem] font-semibold flex items-center gap-[0.3rem] transition-all cursor-pointer ${
                isDone
                  ? "bg-[#4CAF50] text-white border-[#4CAF50] hover:bg-[#388E3C]"
                  : loadingSubtopic === sub.id
                    ? "bg-[#E87A2E] text-white border-[#E87A2E] opacity-75 cursor-wait"
                    : "bg-[#F9F5F0] text-[#6B6D7B] border-[#E5DDD4] hover:border-[#4CAF50] hover:text-[#4CAF50]"
              }`}
              onClick={() => !isDone && !loadingSubtopic && handleMarkComplete(sub.id)}
              disabled={isDone || loadingSubtopic === sub.id}
            >
              {loadingSubtopic === sub.id ? (
                <>
                  <Loader size={14} className="animate-spin" />
                  Loading...
                </>
              ) : isDone ? (
                "✓ Completed"
              ) : (
                "Mark Complete"
              )}
            </button>

            {nextSub && (
              <button
                className={`px-[1.1rem] py-[0.5rem] rounded-[9px] border-none text-[0.78rem] font-semibold flex items-center gap-[0.3rem] transition-all ${
                  canNext
                    ? "bg-[#E87A2E] text-white cursor-pointer hover:bg-[#D06A20]"
                    : "bg-[#E87A2E] text-white opacity-35 cursor-default pointer-events-none"
                }`}
                onClick={() => canNext && setCurS(curS + 1)}
              >
                Next:{" "}
                {nextSub.title.length > 20
                  ? nextSub.title.substring(0, 20) + "…"
                  : nextSub.title}
                <ChevronRight size={14} />
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const WeekTabs: React.FC<{
  w: WeekData[];
  curW: number;
  setCurW: (i: number) => void;
}> = ({ w, curW, setCurW }) => (
  <div className="flex gap-[0.4rem] mb-[1rem] flex-wrap">
    {w.map((wk, i) => (
      <button
        key={i}
        className={`px-[1rem] py-[0.45rem] rounded-full border-[1.5px] font-semibold text-[0.72rem] transition-all font-inherit ${
          i === curW
            ? "bg-[#E87A2E] text-white border-[#E87A2E]"
            : !wk.ul
              ? "bg-white border-[#E5DDD4] text-[#6B6D7B] opacity-40 cursor-default hover:border-[#E5DDD4] hover:text-[#6B6D7B]"
              : "bg-white border-[#E5DDD4] text-[#6B6D7B] cursor-pointer hover:border-[#E87A2E] hover:text-[#E87A2E]"
        }`}
        onClick={() => wk.ul && setCurW(i)}
      >
        {wk.short}
        {!wk.ul ? " 🔒" : ""}
      </button>
    ))}
  </div>
);
