"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Mic, RotateCcw, Sparkles, Square, Trash2, X } from "lucide-react";

import FeatureNotReady from "./FeatureNotReady";
import Button from "../ui/Button";
import FormAlert from "../ui/FormAlert";
import PageHeader from "../ui/PageHeader";
import SelectField from "../ui/SelectField";
import TextAreaField from "../ui/TextAreaField";
import {
  MEAL_OPTIONS,
  MEAL_ORDER,
  MEAL_TEXT_MAX,
  defaultMealForNow,
} from "../../lib/tracking";

const MAX_SECONDS = 60;

const clock = (total) =>
  `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;

// UI PREVIEW of "speak your meal". It asks for the microphone only when the
// user taps Record, records a short clip, and lets them play it back, discard
// it or record again, with a typed fallback for anyone who can't or would
// rather not use the microphone. There is no speech-to-text or analysis
// service yet: the recording stays in the browser, no transcript is made,
// and "Analyze" ends with a notice saying the feature isn't connected. When
// the backend exists, send the clip for transcription, show the transcript,
// then reuse the text meal review step.
export default function VoiceMealLog() {
  const params = useSearchParams();
  const requestedMeal = params.get("meal");

  const [mealType, setMealType] = useState(
    MEAL_ORDER.includes(requestedMeal) ? requestedMeal : defaultMealForNow()
  );
  // idle -> requesting (waiting for the browser's permission prompt) ->
  // recording -> recorded
  const [phase, setPhase] = useState("idle");
  const [seconds, setSeconds] = useState(0);
  const [clip, setClip] = useState(null); // { url, seconds }
  const [micError, setMicError] = useState("");
  const [text, setText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [done, setDone] = useState(false);

  const stream = useRef(null);
  const recorder = useRef(null);
  const chunks = useRef([]);
  const ticker = useRef(null);
  const elapsed = useRef(0);
  const discarding = useRef(false);
  const analyzeTimer = useRef(null);

  const releaseMic = () => {
    clearInterval(ticker.current);
    stream.current?.getTracks().forEach((track) => track.stop());
    stream.current = null;
  };

  // Free the playback URL when the clip changes or the page closes.
  useEffect(() => {
    const url = clip?.url;

    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [clip]);

  // Leaving the page must switch the microphone off.
  useEffect(
    () => () => {
      discarding.current = true;
      clearTimeout(analyzeTimer.current);
      releaseMic();
      if (recorder.current?.state === "recording") recorder.current.stop();
    },
    []
  );

  const start = async () => {
    setDone(false);
    setMicError("");

    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setMicError(
        "Voice recording isn't supported in this browser. You can type what you ate below instead."
      );
      return;
    }

    setPhase("requesting");

    try {
      stream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (error) {
      setPhase("idle");
      setMicError(
        error?.name === "NotFoundError"
          ? "We couldn't find a microphone. Plug one in, or type what you ate below."
          : "Microphone access was blocked. Allow it in your browser's site settings, or type what you ate below."
      );
      return;
    }

    chunks.current = [];
    discarding.current = false;
    elapsed.current = 0;
    setSeconds(0);

    const mediaRecorder = new MediaRecorder(stream.current);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.current.push(event.data);
    };

    mediaRecorder.onstop = () => {
      releaseMic();

      if (discarding.current || chunks.current.length === 0) {
        setPhase("idle");
        return;
      }

      const blob = new Blob(chunks.current, {
        type: mediaRecorder.mimeType || "audio/webm",
      });

      setClip({ url: URL.createObjectURL(blob), seconds: elapsed.current });
      setPhase("recorded");
    };

    recorder.current = mediaRecorder;
    mediaRecorder.start();
    setPhase("recording");

    ticker.current = setInterval(() => {
      elapsed.current += 1;
      setSeconds(elapsed.current);

      if (elapsed.current >= MAX_SECONDS) stop();
    }, 1000);
  };

  const stop = () => {
    clearInterval(ticker.current);

    if (recorder.current?.state === "recording") recorder.current.stop();
  };

  // Stop and throw the recording away.
  const cancel = () => {
    discarding.current = true;
    stop();
  };

  const discardClip = () => {
    setClip(null);
    setPhase("idle");
    setDone(false);
  };

  const canAnalyze = Boolean(clip) || text.trim().length > 0;
  const textError =
    text.length > MEAL_TEXT_MAX ? `Keep it under ${MEAL_TEXT_MAX} characters.` : "";

  const analyze = () => {
    // Guards a second click while the first is "running".
    if (!canAnalyze || analyzing || textError) return;

    setAnalyzing(true);
    setDone(false);

    analyzeTimer.current = setTimeout(() => {
      setAnalyzing(false);
      setDone(true);
    }, 1200);
  };

  const busy = phase === "recording" || phase === "requesting" || analyzing;

  return (
    <div className="mx-auto max-w-[900px]">
      <Link
        href="/app/food/add"
        className="mb-2 inline-flex items-center gap-2 py-2.5 text-sm font-semibold text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft size={16} />
        All ways to add food
      </Link>

      <PageHeader
        eyebrow="Food"
        title="Speak your meal"
        description="Say what you ate, like “two eggs, toast and a glass of milk”, and we'll turn it into a meal."
      />

      <p className="mb-5 rounded-xl bg-[#f6f9f1] px-4 py-3 text-xs leading-5 text-gray-600">
        <span className="font-semibold text-gray-800">Preview:</span> this screen
        shows how voice logging will work. The speech analysis isn&apos;t
        connected yet, so your recording stays in your browser and nothing is
        saved.
      </p>

      <div className="rounded-[24px] border border-gray-100 bg-white p-4 shadow-sm min-[400px]:p-6 sm:p-8">
        <div className="space-y-6">
          <FormAlert>{micError}</FormAlert>

          {/* ---- recorder ---- */}
          <div className="flex flex-col items-center rounded-2xl bg-gray-50 px-4 py-8 text-center sm:py-10">
            {phase === "recorded" && clip ? (
              <>
                <p className="text-sm font-bold text-gray-900">
                  Recording ready · {clock(clip.seconds)}
                </p>

                {/* Native player: play back and check the recording. */}
                <audio
                  controls
                  src={clip.url}
                  aria-label="Your recording"
                  className="mt-4 w-full max-w-sm"
                />

                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      discardClip();
                      start();
                    }}
                    disabled={analyzing}
                    className="flex min-h-10 items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 text-xs font-bold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
                  >
                    <RotateCcw size={14} />
                    Record again
                  </button>

                  <button
                    type="button"
                    onClick={discardClip}
                    disabled={analyzing}
                    className="flex min-h-10 items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 text-xs font-bold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 size={14} />
                    Discard
                  </button>
                </div>
              </>
            ) : phase === "recording" ? (
              <>
                <div className="relative flex h-20 w-20 items-center justify-center">
                  <span className="absolute inset-0 animate-ping rounded-full bg-red-400/30 motion-reduce:animate-none" />
                  <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-red-500 text-white">
                    <Mic size={28} />
                  </span>
                </div>

                <p
                  role="timer"
                  aria-label="Recording time"
                  className="mt-4 text-3xl font-extrabold tabular-nums text-gray-900"
                >
                  {clock(seconds)}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Recording… up to {MAX_SECONDS} seconds
                </p>

                <div className="mt-5 flex gap-3">
                  <Button variant="green" className="min-w-[130px]" onClick={stop}>
                    <Square size={16} />
                    Stop
                  </Button>

                  <Button variant="secondary" className="min-w-[130px]" onClick={cancel}>
                    <X size={16} />
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={start}
                  disabled={phase === "requesting" || analyzing}
                  aria-label="Start recording"
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-[#4dbb08] text-white shadow-lg transition-colors hover:bg-[#3c9705] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4dbb08]/30 disabled:opacity-60"
                >
                  <Mic size={32} />
                </button>

                <p className="mt-4 text-base font-bold text-gray-900">
                  {phase === "requesting" ? "Waiting for permission…" : "Tap to record"}
                </p>

                <p className="mt-1 max-w-sm text-sm leading-6 text-gray-500">
                  {phase === "requesting"
                    ? "Choose “Allow” when your browser asks to use the microphone."
                    : "We only ask to use your microphone when you tap the button."}
                </p>
              </>
            )}
          </div>

          {/* ---- typed fallback ---- */}
          <TextAreaField
            label="Or type what you said"
            placeholder="e.g. two eggs, toast and a glass of milk"
            rows={3}
            value={text}
            maxLength={MEAL_TEXT_MAX}
            onChange={(event) => {
              setText(event.target.value);
              setDone(false);
            }}
            error={textError}
            hint="Handy if your microphone isn't available, or to correct what the recording says."
            disabled={analyzing}
          />

          <SelectField
            label="Add to"
            options={MEAL_OPTIONS}
            value={mealType}
            onChange={(event) => setMealType(event.target.value)}
            disabled={busy}
            className="sm:max-w-[240px]"
          />

          <Button
            variant="green"
            onClick={analyze}
            loading={analyzing}
            disabled={!canAnalyze || phase === "recording" || phase === "requesting"}
            className="w-full sm:w-auto sm:min-w-[200px]"
          >
            {!analyzing && <Sparkles size={18} />}
            {analyzing ? "Analyzing…" : "Analyze meal"}
          </Button>

          {done && (
            <FeatureNotReady
              title="Voice logging isn't available yet"
              mealType={mealType}
            >
              This feature will work once the CaloVision service is fully
              connected. Your recording and text weren&apos;t uploaded or
              saved. For now you can log this meal in another way.
            </FeatureNotReady>
          )}
        </div>
      </div>
    </div>
  );
}
