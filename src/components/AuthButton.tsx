"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { authClient } from "@/lib/auth-client";

export default function AuthButton() {
  const session = authClient.useSession();
  const [showMenu, setShowMenu] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const user = session.data?.user;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        const result = await authClient.signUp.email({
          email: form.email,
          password: form.password,
          name: form.name,
        });
        if (result.error) {
          setError(result.error.message || "Error al registrarse");
        } else {
          setShowLogin(false);
          setForm({ name: "", username: "", email: "", password: "" });
        }
      } else {
        const result = await authClient.signIn.email({
          email: form.email,
          password: form.password,
        });
        if (result.error) {
          setError(result.error.message || "Email o contrasena incorrectos");
        } else {
          setShowLogin(false);
          setForm({ name: "", username: "", email: "", password: "" });
        }
      }
    } catch {
      setError("Error de conexion");
    } finally {
      setLoading(false);
    }
  };

  // Logged in: show avatar + menu
  if (user) {
    return (
      <div className="relative">
        <button
          className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white"
          onClick={() => setShowMenu(!showMenu)}
          type="button"
        >
          {user.name?.charAt(0).toUpperCase() || "U"}
        </button>

        {showMenu && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowMenu(false)}
            />
            <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-zinc-200 bg-white p-2 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
              <div className="border-b border-zinc-100 px-3 py-2 dark:border-zinc-800">
                <p className="font-medium text-sm text-zinc-900 dark:text-white">
                  {user.name}
                </p>
                <p className="text-xs text-zinc-500">{user.email}</p>
              </div>
              <button
                className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
                onClick={async () => {
                  await authClient.signOut();
                  setShowMenu(false);
                }}
                type="button"
              >
                Cerrar sesion
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  // Logged out: show login button + modal
  return (
    <>
      <button
        className="rounded-lg bg-emerald-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-emerald-600"
        onClick={() => {
          setShowLogin(true);
          setError("");
        }}
        type="button"
      >
        Iniciar sesion
      </button>

      {showLogin && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowLogin(false)}
        >
          <div
            className="mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4 text-center font-bold text-xl text-zinc-900 dark:text-white">
              {isRegister ? "Crear cuenta" : "Iniciar sesion"}
            </h2>

            <form className="space-y-3" onSubmit={handleSubmit}>
              {isRegister && (
                <>
                  <input
                    className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    placeholder="Nombre"
                    required
                    type="text"
                    value={form.name}
                  />
                  <input
                    className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    onChange={(e) =>
                      setForm({ ...form, username: e.target.value })
                    }
                    placeholder="Nombre de usuario"
                    type="text"
                    value={form.username}
                  />
                </>
              )}
              <input
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email"
                required
                type="email"
                value={form.email}
              />
              <input
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                placeholder="Contrasena"
                required
                type="password"
                value={form.password}
              />

              {error && (
                <p className="text-center text-sm text-red-500">{error}</p>
              )}

              <button
                className="w-full rounded-lg bg-emerald-500 py-2 font-medium text-sm text-white transition-colors hover:bg-emerald-600 disabled:opacity-50"
                disabled={loading}
                type="submit"
              >
                {loading
                  ? "..."
                  : isRegister
                    ? "Registrarse"
                    : "Entrar"}
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-zinc-500">
              {isRegister ? "Ya tienes cuenta?" : "No tienes cuenta?"}{" "}
              <button
                className="font-medium text-emerald-500 hover:text-emerald-600"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError("");
                }}
                type="button"
              >
                {isRegister ? "Inicia sesion" : "Registrate"}
              </button>
            </p>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
