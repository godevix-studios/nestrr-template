import type { Route } from "./+types/home";
import { useMemo, useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Nestrr | Estado de conexión" },
    {
      name: "description",
      content: "Vista para validar la conexión entre frontend y backend.",
    },
  ];
}

export default function Home() {
  const healthUrl =
    import.meta.env.VITE_API_HEALTH_URL ?? "/api/health";

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [message, setMessage] = useState("Sin comprobaciones todavía.");

  const badgeClassName = useMemo(() => {
    if (status === "ok") {
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    }

    if (status === "error") {
      return "bg-rose-100 text-rose-700 border-rose-200";
    }

    return "bg-slate-100 text-slate-700 border-slate-200";
  }, [status]);

  async function checkBackendConnection() {
    try {
      setIsLoading(true);
      setStatus("idle");
      setMessage("Validando conexión...");

      const response = await fetch(healthUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }

      const data = (await response.json()) as { status?: string };

      if (data.status === "ok") {
        setStatus("ok");
        setMessage("Conexión exitosa con el backend.");
        return;
      }

      setStatus("error");
      setMessage("El backend respondió, pero con un formato inesperado.");
    } catch (error) {
      const details = error instanceof Error ? error.message : "Error desconocido";
      setStatus("error");
      setMessage(`No se pudo conectar con el backend: ${details}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dcfce7,#f8fafc_35%,#ffffff_65%)] px-4 py-14 text-slate-900">
      <section className="mx-auto w-full max-w-2xl rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_20px_80px_-35px_rgba(15,23,42,0.4)] backdrop-blur sm:p-10">
        <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
          Nestrr
        </p>

        <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
          Checar conexión con backend
        </h1>

        <p className="mt-3 text-base leading-relaxed text-slate-600">
          Esta vista consulta el endpoint de salud de la API para comprobar que
          el monolito está comunicando frontend y backend correctamente.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={checkBackendConnection}
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Verificando..." : "Checar conexión"}
          </button>

          <span
            className={`inline-flex w-fit rounded-full border px-3 py-1 text-sm font-medium ${badgeClassName}`}
          >
            {status === "idle" && "Pendiente"}
            {status === "ok" && "Conectado"}
            {status === "error" && "Sin conexión"}
          </span>
        </div>

        <p className="mt-4 text-sm text-slate-700">{message}</p>

        <p className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-xs text-slate-600">
          Endpoint: {healthUrl}
        </p>
      </section>
    </main>
  );
}
