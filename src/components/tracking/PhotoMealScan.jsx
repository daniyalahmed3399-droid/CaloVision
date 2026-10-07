"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Camera, ImagePlus, RefreshCw, Sparkles, Trash2 } from "lucide-react";

import FeatureNotReady from "./FeatureNotReady";
import Button from "../ui/Button";
import FormAlert from "../ui/FormAlert";
import PageHeader from "../ui/PageHeader";
import SelectField from "../ui/SelectField";
import { MEAL_OPTIONS, MEAL_ORDER, defaultMealForNow } from "../../lib/tracking";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 10 * 1024 * 1024;

// UI PREVIEW of "scan a meal photo". It lets the user choose or take a photo,
// shows it, and runs the same states the real feature will have (choosing,
// validation errors, "analyzing"), but there is no photo-analysis service yet:
// nothing is uploaded or saved, and "Analyze" ends with a notice saying the
// feature isn't connected. When the backend exists, replace the fake wait in
// `analyze` with the real call and show the shared review step.
export default function PhotoMealScan() {
  const params = useSearchParams();
  const requestedMeal = params.get("meal");

  const [mealType, setMealType] = useState(
    MEAL_ORDER.includes(requestedMeal) ? requestedMeal : defaultMealForNow()
  );
  const [photo, setPhoto] = useState(null); // { url, name, size }
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [done, setDone] = useState(false);

  const fileInput = useRef(null);
  const cameraInput = useRef(null);
  const timer = useRef(null);

  // Free the preview URL and any pending timer when the photo changes or the
  // page closes.
  useEffect(() => {
    const url = photo?.url;

    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [photo]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const choose = (file) => {
    setDone(false);

    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("That file type isn't supported. Choose a JPG, PNG or WebP photo.");
      return;
    }

    if (file.size > MAX_BYTES) {
      setError("That photo is too large. Choose one under 10 MB.");
      return;
    }

    setError("");
    setPhoto({ url: URL.createObjectURL(file), name: file.name, size: file.size });
  };

  const onPick = (event) => {
    choose(event.target.files?.[0]);
    // Allow choosing the same file again after removing it.
    event.target.value = "";
  };

  const remove = () => {
    setPhoto(null);
    setError("");
    setDone(false);
  };

  const analyze = () => {
    // Guards a second click while the first is "running".
    if (!photo || analyzing) return;

    setAnalyzing(true);
    setDone(false);

    timer.current = setTimeout(() => {
      setAnalyzing(false);
      setDone(true);
    }, 1200);
  };

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
        title="Scan a meal photo"
        description="Upload or take a photo of your meal and we'll estimate what's on the plate."
      />

      <p className="mb-5 rounded-xl bg-[#f6f9f1] px-4 py-3 text-xs leading-5 text-gray-600">
        <span className="font-semibold text-gray-800">Preview:</span> this screen
        shows how photo scanning will work. The analysis isn&apos;t connected
        yet, so your photo stays on your device and nothing is saved.
      </p>

      <div className="rounded-[24px] border border-gray-100 bg-white p-4 shadow-sm min-[400px]:p-6 sm:p-8">
        <div className="space-y-5">
          <FormAlert>{error}</FormAlert>

          {/* Hidden inputs: one for the file chooser, one that opens the
              camera on phones and tablets (desktops show the file chooser). */}
          <input
            ref={fileInput}
            type="file"
            accept={ACCEPTED_TYPES.join(",")}
            onChange={onPick}
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
          />
          <input
            ref={cameraInput}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={onPick}
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
          />

          {photo ? (
            <div>
              <div className="overflow-hidden rounded-2xl bg-[#f6f9f1]">
                {/* A local blob preview, so next/image can't optimise it. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt="Your meal photo, ready to analyze"
                  className="mx-auto max-h-[420px] w-full object-contain"
                />
              </div>

              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="min-w-0 truncate text-xs text-gray-500">
                  {photo.name} · {(photo.size / (1024 * 1024)).toFixed(1)} MB
                </p>

                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => fileInput.current?.click()}
                    disabled={analyzing}
                    className="flex min-h-10 items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 text-xs font-bold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
                  >
                    <RefreshCw size={14} />
                    Replace
                  </button>

                  <button
                    type="button"
                    onClick={remove}
                    disabled={analyzing}
                    className="flex min-h-10 items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 text-xs font-bold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 size={14} />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setDragging(false);
                choose(event.dataTransfer.files?.[0]);
              }}
              className={`flex flex-col items-center rounded-2xl border-2 border-dashed px-4 py-10 text-center transition-colors sm:py-14 ${
                dragging
                  ? "border-[#4dbb08] bg-[#f6f9f1]"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf5df] text-[#4dbb08]">
                <ImagePlus size={26} />
              </div>

              <p className="mt-4 text-base font-bold text-gray-900">
                Add a photo of your meal
              </p>

              <p className="mt-1 max-w-sm text-sm leading-6 text-gray-500">
                Drag a photo here, or choose one. JPG, PNG or WebP, up to 10 MB.
              </p>

              <div className="mt-5 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <Button
                  variant="green"
                  className="sm:min-w-[170px]"
                  onClick={() => fileInput.current?.click()}
                >
                  <ImagePlus size={18} />
                  Choose a photo
                </Button>

                <Button
                  variant="secondary"
                  className="sm:min-w-[170px]"
                  onClick={() => cameraInput.current?.click()}
                >
                  <Camera size={18} />
                  Take a photo
                </Button>
              </div>
            </div>
          )}

          <ul className="space-y-1 text-xs leading-5 text-gray-500">
            <li>• Use good lighting and keep the whole plate in the frame.</li>
            <li>• One meal per photo gives the best estimate.</li>
          </ul>

          <SelectField
            label="Add to"
            options={MEAL_OPTIONS}
            value={mealType}
            onChange={(event) => setMealType(event.target.value)}
            disabled={analyzing}
            className="sm:max-w-[240px]"
          />

          <Button
            variant="green"
            onClick={analyze}
            loading={analyzing}
            disabled={!photo}
            className="w-full sm:w-auto sm:min-w-[200px]"
          >
            {!analyzing && <Sparkles size={18} />}
            {analyzing ? "Analyzing…" : "Analyze photo"}
          </Button>

          {done && (
            <FeatureNotReady
              title="Photo scanning isn't available yet"
              mealType={mealType}
            >
              This feature will work once the CaloVision service is fully
              connected. Your photo wasn&apos;t uploaded or saved. For now you
              can log this meal in another way.
            </FeatureNotReady>
          )}
        </div>
      </div>
    </div>
  );
}
