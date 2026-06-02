import { useState } from "react";
import { X, Eye, EyeOff, Mail, Lock, User, Phone, CheckCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const PINK = "#D70F64";

function SocialBtn({ children, onClick, loading }: { children: React.ReactNode; onClick: () => void; loading?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl border-2 border-gray-200 bg-white hover:bg-gray-50 transition-colors text-sm font-semibold text-gray-700 disabled:opacity-60"
    >
      {loading ? <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" /> : children}
    </button>
  );
}

export function AuthModal() {
  const { showAuthModal, closeAuthModal, login, signup, loginWithGoogle, loginWithFacebook, pendingAction } = useAuth();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<"google" | "facebook" | null>(null);
  const [done, setDone] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupPass, setSignupPass] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");

  if (!showAuthModal) return null;

  const reset = () => {
    setError(""); setDone(false); setLoading(false); setSocialLoading(null);
    setLoginEmail(""); setLoginPass("");
    setSignupName(""); setSignupEmail(""); setSignupPhone(""); setSignupPass(""); setSignupConfirm("");
  };

  const handleClose = () => { reset(); closeAuthModal(); };
  const switchTab = (t: "login" | "signup") => { setTab(t); setError(""); };

  const finish = () => {
    setDone(true);
    setTimeout(() => { handleClose(); if (pendingAction) pendingAction(); }, 900);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPass) { setError("Please fill in all fields"); return; }
    setLoading(true); setError("");
    try { await login(loginEmail, loginPass); finish(); }
    catch { setError("Invalid email or password"); setLoading(false); }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName || !signupEmail || !signupPass) { setError("Please fill in all required fields"); return; }
    if (signupPass !== signupConfirm) { setError("Passwords do not match"); return; }
    if (signupPass.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true); setError("");
    try { await signup(signupName, signupEmail, signupPass, signupPhone); finish(); }
    catch { setError("Something went wrong. Please try again."); setLoading(false); }
  };

  const handleSocial = async (provider: "google" | "facebook") => {
    setSocialLoading(provider); setError("");
    try {
      if (provider === "google") await loginWithGoogle();
      else await loginWithFacebook();
      finish();
    } catch { setError("Social login failed. Try again."); setSocialLoading(null); }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] overflow-y-auto">

        <button onClick={handleClose} className="absolute top-4 right-4 z-10 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="px-6 pt-8 pb-6 text-center" style={{ background: `linear-gradient(135deg, ${PINK} 0%, #ff4d94 100%)` }}>
          <div className="text-4xl mb-2">🍽️</div>
          <h2 className="text-white font-black text-xl">
            {done ? (tab === "login" ? "Welcome back!" : "Welcome to EatZone!") : tab === "login" ? "Log in to EatZone" : "Create your account"}
          </h2>
          {!done && (
            <p className="text-white/75 text-sm mt-1">
              {tab === "login" ? "Order your favourite food in seconds" : "Join us and start ordering today"}
            </p>
          )}
        </div>

        {done ? (
          <div className="p-10 flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-9 h-9 text-green-500" />
            </div>
            <p className="text-gray-600 text-sm font-medium">
              {tab === "login" ? "You're logged in!" : "Account created successfully!"}
            </p>
          </div>
        ) : (
          <div className="p-6">
            {/* Tabs */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-5">
              {(["login", "signup"] as const).map((t) => (
                <button key={t} onClick={() => switchTab(t)}
                  className="flex-1 py-2 rounded-lg text-sm font-bold transition-all"
                  style={tab === t ? { backgroundColor: "white", color: PINK, boxShadow: "0 1px 4px rgba(0,0,0,0.1)" } : { color: "#6b7280" }}>
                  {t === "login" ? "Log in" : "Sign up"}
                </button>
              ))}
            </div>

            {/* Social login */}
            <div className="flex gap-2.5 mb-4">
              <SocialBtn onClick={() => handleSocial("google")} loading={socialLoading === "google"}>
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </SocialBtn>
              <SocialBtn onClick={() => handleSocial("facebook")} loading={socialLoading === "facebook"}>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </SocialBtn>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium">or continue with email</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {error && (
              <div className="mb-4 px-4 py-2.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
                {error}
              </div>
            )}

            {tab === "login" ? (
              <form onSubmit={handleLogin} className="space-y-3">
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="email" placeholder="Email address" value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 border border-transparent focus:border-pink-300 transition-all" />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type={showPass ? "text" : "password"} placeholder="Password" value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    className="w-full h-11 pl-10 pr-10 rounded-xl bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 border border-transparent focus:border-pink-300 transition-all" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div
                      onClick={() => setRememberMe(!rememberMe)}
                      className="w-4 h-4 rounded border-2 flex items-center justify-center transition-colors cursor-pointer"
                      style={rememberMe ? { backgroundColor: PINK, borderColor: PINK } : { borderColor: "#d1d5db" }}
                    >
                      {rememberMe && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
                    </div>
                    <span className="text-xs text-gray-600">Remember me</span>
                  </label>
                  <button type="button" className="text-xs font-semibold" style={{ color: PINK }}>Forgot password?</button>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl font-black text-white text-sm transition-opacity hover:opacity-90 disabled:opacity-70 flex items-center justify-center gap-2"
                  style={{ backgroundColor: PINK }}>
                  {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {loading ? "Logging in..." : "Log in"}
                </button>
                <p className="text-center text-xs text-gray-400">
                  Don't have an account?{" "}
                  <button type="button" onClick={() => switchTab("signup")} className="font-bold" style={{ color: PINK }}>Sign up</button>
                </p>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="space-y-3">
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" placeholder="Full name" value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 border border-transparent focus:border-pink-300 transition-all" />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="email" placeholder="Email address" value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 border border-transparent focus:border-pink-300 transition-all" />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="tel" placeholder="Phone number (optional)" value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 border border-transparent focus:border-pink-300 transition-all" />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type={showPass ? "text" : "password"} placeholder="Password (min. 6 characters)" value={signupPass}
                    onChange={(e) => setSignupPass(e.target.value)}
                    className="w-full h-11 pl-10 pr-10 rounded-xl bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 border border-transparent focus:border-pink-300 transition-all" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type={showConfirm ? "text" : "password"} placeholder="Confirm password" value={signupConfirm}
                    onChange={(e) => setSignupConfirm(e.target.value)}
                    className="w-full h-11 pl-10 pr-10 rounded-xl bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 border border-transparent focus:border-pink-300 transition-all" />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password strength */}
                {signupPass && (
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex-1 h-1 rounded-full transition-all"
                          style={{ backgroundColor: signupPass.length >= i * 4 ? (i === 1 ? "#ef4444" : i === 2 ? "#f97316" : "#22c55e") : "#e5e7eb" }} />
                      ))}
                    </div>
                    <p className="text-xs text-gray-400">
                      {signupPass.length < 4 ? "Weak" : signupPass.length < 8 ? "Medium" : "Strong"} password
                    </p>
                  </div>
                )}

                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl font-black text-white text-sm transition-opacity hover:opacity-90 disabled:opacity-70 flex items-center justify-center gap-2"
                  style={{ backgroundColor: PINK }}>
                  {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {loading ? "Creating account..." : "Create account"}
                </button>
                <p className="text-xs text-gray-400 text-center">
                  By signing up you agree to our{" "}
                  <span className="underline cursor-pointer" style={{ color: PINK }}>Terms</span> &{" "}
                  <span className="underline cursor-pointer" style={{ color: PINK }}>Privacy Policy</span>
                </p>
                <p className="text-center text-xs text-gray-400">
                  Already have an account?{" "}
                  <button type="button" onClick={() => switchTab("login")} className="font-bold" style={{ color: PINK }}>Log in</button>
                </p>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
