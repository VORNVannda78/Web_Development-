import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Star, Camera, CheckCircle } from "lucide-react";
import { useToast } from "../../context/ToastContext";

const PINK = "#D70F64";

const foodTags = ["Delicious 😋", "Fresh 🥬", "Portion was great 👌", "Good packaging 📦", "Authentic taste 🍛", "Could be hotter 🌡️", "Arrived cold ❄️"];
const riderTags = ["Super fast ⚡", "Friendly 😊", "Followed instructions 📋", "Professional 👍", "Good packaging 📦", "Late delivery ⏰", "Hard to find 📍"];

function StarRating({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
  const [hover, setHover] = useState(0);
  const labels = ["", "Terrible", "Poor", "OK", "Good", "Excellent"];
  return (
    <div>
      <div className="text-sm font-bold text-gray-700 mb-2">{label}</div>
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((s) => (
          <button key={s}
            onMouseEnter={() => setHover(s)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange(s)}
            className="transition-transform hover:scale-110 active:scale-95">
            <Star className="w-9 h-9 transition-colors"
              style={{
                fill: s <= (hover || value) ? "#f59e0b" : "transparent",
                stroke: s <= (hover || value) ? "#f59e0b" : "#d1d5db",
                strokeWidth: 1.5,
              }} />
          </button>
        ))}
        {(hover || value) > 0 && (
          <span className="text-sm font-bold text-amber-500 ml-1">{labels[hover || value]}</span>
        )}
      </div>
    </div>
  );
}

export function ReviewPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [foodRating, setFoodRating] = useState(0);
  const [riderRating, setRiderRating] = useState(0);
  const [foodReview, setFoodReview] = useState("");
  const [riderReview, setRiderReview] = useState("");
  const [selectedFoodTags, setSelectedFoodTags] = useState<string[]>([]);
  const [selectedRiderTags, setSelectedRiderTags] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState<"food" | "rider" | "done">("food");

  const toggleTag = (tag: string, list: string[], setList: (v: string[]) => void) => {
    setList(list.includes(tag) ? list.filter((t) => t !== tag) : [...list, tag]);
  };

  const handleSubmit = () => {
    if (foodRating === 0 || riderRating === 0) {
      showToast("Please rate both food and rider", "error");
      return;
    }
    setStep("done");
    showToast("Review submitted! Thank you 🙏", "success");
  };

  if (step === "done") return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#f8f8f8" }}>
      <div className="text-center max-w-sm">
        <div className="w-24 h-24 rounded-full mx-auto mb-5 flex items-center justify-center"
          style={{ backgroundColor: "#d1fae5" }}>
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Thank you! 🙏</h2>
        <p className="text-gray-500 text-sm mb-2">Your review for order <span className="font-bold">#{orderId}</span> has been submitted.</p>
        <p className="text-xs text-gray-400 mb-6">Your feedback helps us improve and rewards great riders!</p>
        <div className="flex flex-col gap-2">
          <button onClick={() => navigate("/food/invoice/" + orderId)}
            className="w-full py-3 rounded-xl font-bold border-2 text-sm"
            style={{ borderColor: PINK, color: PINK }}>
            View Invoice
          </button>
          <button onClick={() => navigate("/food")}
            className="w-full py-3 rounded-xl font-bold text-white text-sm"
            style={{ backgroundColor: PINK }}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ backgroundColor: "#f8f8f8" }} className="min-h-screen">
      <div className="max-w-lg mx-auto px-4 py-6">
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900 mb-5">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <h1 className="text-xl font-black text-gray-900 mb-1">Rate Your Order</h1>
        <p className="text-sm text-gray-500 mb-5">Order <span className="font-bold">#{orderId}</span> · Malis Restaurant</p>

        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-6">
          {["Food Quality", "Rider Service"].map((label, i) => {
            const stepKey = i === 0 ? "food" : "rider";
            const done = (i === 0 && (step === "rider" || step === "done")) || (i === 1 && step === "done");
            const active = step === stepKey;
            return (
              <div key={label} className="flex items-center gap-2">
                {i > 0 && <div className="h-px w-8 bg-gray-200 flex-shrink-0" />}
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black transition-all"
                    style={done
                      ? { backgroundColor: "#198754", color: "#fff" }
                      : active
                      ? { backgroundColor: PINK, color: "#fff" }
                      : { backgroundColor: "#e5e7eb", color: "#9ca3af" }}>
                    {done ? "✓" : i + 1}
                  </div>
                  <span className="text-xs font-semibold"
                    style={active ? { color: PINK } : done ? { color: "#198754" } : { color: "#9ca3af" }}>
                    {label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── FOOD STEP ── */}
        {step === "food" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-gray-100" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
              {/* Restaurant photo */}
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
                <img src="https://images.unsplash.com/photo-1589942151968-89bfe5d60c61?w=80&h=80&fit=crop"
                  alt="Malis" className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                <div>
                  <div className="font-black text-gray-900">Malis Restaurant</div>
                  <div className="text-xs text-gray-500 mt-0.5">Amok Fish · Crispy Chicken Burger</div>
                </div>
              </div>

              <StarRating value={foodRating} onChange={setFoodRating} label="How was the food quality? *" />

              {foodRating > 0 && (
                <div className="mt-4 space-y-3">
                  {/* Quick tags */}
                  <div className="flex flex-wrap gap-2">
                    {foodTags.map((tag) => (
                      <button key={tag} onClick={() => toggleTag(tag, selectedFoodTags, setSelectedFoodTags)}
                        className="text-xs font-semibold px-3 py-1.5 rounded-full border-2 transition-all"
                        style={selectedFoodTags.includes(tag)
                          ? { backgroundColor: PINK, borderColor: PINK, color: "#fff" }
                          : { backgroundColor: "#fff", borderColor: "#e5e7eb", color: "#374151" }}>
                        {tag}
                      </button>
                    ))}
                  </div>

                  {/* Text review */}
                  <textarea
                    placeholder="Tell us more about your experience with the food (optional)..."
                    value={foodReview}
                    onChange={(e) => setFoodReview(e.target.value)}
                    rows={3}
                    className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none border border-gray-200 focus:border-pink-300 transition-all"
                  />

                  {/* Photo upload (UI only) */}
                  <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-gray-200 text-sm text-gray-400 hover:border-pink-300 hover:text-pink-400 transition-colors w-full justify-center">
                    <Camera className="w-4 h-4" />
                    Add Photo (optional)
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => { if (foodRating === 0) { showToast("Please rate the food first", "error"); return; } setStep("rider"); }}
              className="w-full py-3.5 rounded-xl font-black text-white text-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: PINK }}>
              Next: Rate Rider →
            </button>
          </div>
        )}

        {/* ── RIDER STEP ── */}
        {step === "rider" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-gray-100" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
              {/* Rider info */}
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-xl font-black flex-shrink-0"
                  style={{ backgroundColor: PINK }}>DS</div>
                <div>
                  <div className="font-black text-gray-900">Dara Sok</div>
                  <div className="text-xs text-gray-500 mt-0.5">Your delivery rider</div>
                  <div className="flex items-center gap-1 mt-1">
                    {[1,2,3,4,5].map((s) => (
                      <Star key={s} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-xs text-gray-400 ml-1">4.8 avg</span>
                  </div>
                </div>
              </div>

              <StarRating value={riderRating} onChange={setRiderRating} label="How was the delivery service? *" />

              {riderRating > 0 && (
                <div className="mt-4 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {riderTags.map((tag) => (
                      <button key={tag} onClick={() => toggleTag(tag, selectedRiderTags, setSelectedRiderTags)}
                        className="text-xs font-semibold px-3 py-1.5 rounded-full border-2 transition-all"
                        style={selectedRiderTags.includes(tag)
                          ? { backgroundColor: PINK, borderColor: PINK, color: "#fff" }
                          : { backgroundColor: "#fff", borderColor: "#e5e7eb", color: "#374151" }}>
                        {tag}
                      </button>
                    ))}
                  </div>
                  <textarea
                    placeholder="Any comments about your rider? (optional)..."
                    value={riderReview}
                    onChange={(e) => setRiderReview(e.target.value)}
                    rows={3}
                    className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none border border-gray-200 focus:border-pink-300 transition-all"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep("food")}
                className="flex-1 py-3.5 rounded-xl font-bold border-2 text-sm transition-colors hover:bg-pink-50"
                style={{ borderColor: PINK, color: PINK }}>
                ← Back
              </button>
              <button onClick={handleSubmit}
                className="flex-2 px-8 py-3.5 rounded-xl font-black text-white text-sm transition-opacity hover:opacity-90"
                style={{ backgroundColor: PINK }}>
                Submit Review ⭐
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
