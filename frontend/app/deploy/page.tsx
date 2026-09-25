"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { io } from "socket.io-client";
import axios from "axios";
import { Fira_Code } from "next/font/google";
import {
    ArrowLeft,
    ArrowUpRight,
    CheckCircle2,
    Loader2,
    Rocket,
    Terminal,
    XCircle,
} from "lucide-react";

const socket = io("http://localhost:9002");

const firaCode = Fira_Code({ subsets: ["latin"] });

export default function DeployPage() {
    const [repoURL, setURL] = useState("");
    const [logs, setLogs] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const [projectId, setProjectId] = useState<string | undefined>();
    const [deployPreviewURL, setDeployPreviewURL] = useState<
        string | undefined
    >();

    const [deploymentComplete, setDeploymentComplete] = useState(false);
    const [error, setError] = useState("");

    const logContainerRef = useRef<HTMLElement>(null);

    const isValidURL: [boolean, string | null] = useMemo(() => {
        if (!repoURL || repoURL.trim() === "") {
            return [false, null];
        }

        const regex =
            /^(?:https?:\/\/)?(?:www\.)?github\.com\/([^\/]+)\/([^\/]+)(?:\/)?$/;

        return [
            regex.test(repoURL.trim()),
            "Enter a valid GitHub repository URL",
        ];
    }, [repoURL]);

    const handleClickDeploy = useCallback(async () => {
        setLoading(true);
        setDeploymentComplete(false);
        setLogs([]);
        setDeployPreviewURL(undefined);
        setError("");

        try {
            const { data } = await axios.post(
                "http://localhost:9001/project",
                {
                    gitURL: repoURL.trim(),
                    slug: projectId,
                }
            );

            if (data && data.data) {
                const { projectSlug, url } = data.data;

                setProjectId(projectSlug);
                setDeployPreviewURL(url);

                console.log(`Subscribing to logs:${projectSlug}`);

                socket.emit("subscribe", `logs:${projectSlug}`);
            }
        } catch (error) {
            console.error("Deployment failed:", error);

            setLoading(false);
            setError(
                "Deployment could not be started. Make sure the Launchyard API is running."
            );
        }
    }, [projectId, repoURL]);

    const handleSocketIncomingMessage = useCallback((message: string) => {
        console.log("[Incoming Socket Message]:", message);

        try {
            const { log } = JSON.parse(message);

            setLogs((prev) => [...prev, log]);

            if (log.trim() === "Done") {
                setDeploymentComplete(true);
                setLoading(false);
            }

            requestAnimationFrame(() => {
                logContainerRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                });
            });
        } catch (error) {
            console.error("Invalid socket message:", error);
        }
    }, []);

    useEffect(() => {
        socket.on("message", handleSocketIncomingMessage);

        return () => {
            socket.off("message", handleSocketIncomingMessage);
        };
    }, [handleSocketIncomingMessage]);

    return (
        <main className="min-h-screen bg-black text-white">
            {/* Navbar */}
            <header className="border-b border-neutral-900">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-sm font-semibold"
                    >
                        <span className="flex h-7 w-7 items-center justify-center rounded-md border border-neutral-800">
                            <Rocket className="h-4 w-4" />
                        </span>

                        Launchyard
                    </Link>

                    <Link
                        href="/"
                        className="flex items-center gap-2 text-sm text-neutral-400 transition-colors hover:text-white"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to home
                    </Link>
                </div>
            </header>

            {/* Page */}
            <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
                {/* Grid */}
                <div className="pointer-events-none absolute inset-0">
                    <div
                        className="absolute inset-0 opacity-60"
                        style={{
                            backgroundImage:
                                "linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)",
                            backgroundSize: "44px 44px",
                        }}
                    />
                </div>

                <div className="relative mx-auto max-w-3xl px-6 py-20">
                    {/* Heading */}
                    <div className="mb-10 text-center">
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs text-neutral-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-white" />
                            Launch a new deployment
                        </div>

                        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                            Deploy your application.
                        </h1>

                        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-neutral-400">
                            Connect your GitHub repository and Launchyard will build and
                            deploy your application.
                        </p>
                    </div>

                    {/* Deployment Card */}
                    <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6 shadow-2xl sm:p-8">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-800 bg-black">
                                <svg
                                    viewBox="0 0 24 24"
                                    className="h-5 w-5"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-1.98c-3.2.7-3.88-1.35-3.88-1.35-.53-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.26-1.28-5.26-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18A11.1 11.1 0 0 1 12 6.08c.98 0 1.97.13 2.89.38 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.42-2.71 5.39-5.29 5.68.42.36.78 1.07.78 2.16v3.2c0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
                                </svg>
                            </div>

                            <div>
                                <p className="text-sm font-medium">GitHub repository</p>
                                <p className="text-xs text-neutral-500">
                                    Enter the repository you want to deploy
                                </p>
                            </div>
                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();

                                if (!loading && isValidURL[0]) {
                                    handleClickDeploy();
                                }
                            }}
                        >
                            <div className="rounded-lg border border-neutral-800 bg-black transition-colors focus-within:border-neutral-600">
                                <input
                                    type="url"
                                    value={repoURL}
                                    onChange={(e) => setURL(e.target.value)}
                                    disabled={loading}
                                    placeholder="https://github.com/username/repository"
                                    className="h-12 w-full bg-transparent px-4 text-sm text-white outline-none placeholder:text-neutral-600 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>

                            {!isValidURL[0] && repoURL.length > 0 && (
                                <p className="mt-2 text-xs text-red-400">
                                    {isValidURL[1]}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={!isValidURL[0] || loading}
                                className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-white px-5 text-sm font-medium text-black transition-colors hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Deploying...
                                    </>
                                ) : (
                                    <>
                                        <Rocket className="h-4 w-4" />
                                        Deploy
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Error */}
                        {error && (
                            <div className="mt-6 flex gap-3 rounded-lg border border-red-900/50 bg-red-950/20 p-4">
                                <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />

                                <div>
                                    <p className="text-sm font-medium text-red-300">
                                        Deployment failed
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-red-400/80">
                                        {error}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Deployment Status */}
                        {logs.length > 0 && (
                            <div className="mt-8">
                                <div className="mb-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Terminal className="h-4 w-4 text-neutral-500" />

                                        <span className="text-sm font-medium">
                                            Deployment logs
                                        </span>
                                    </div>

                                    {loading && (
                                        <span className="flex items-center gap-2 text-xs text-neutral-500">
                                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                            Running
                                        </span>
                                    )}

                                    {deploymentComplete && (
                                        <span className="flex items-center gap-2 text-xs text-neutral-400">
                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                            Complete
                                        </span>
                                    )}
                                </div>

                                <div
                                    className={`${firaCode.className} h-[320px] overflow-y-auto rounded-lg border border-neutral-800 bg-black p-4 text-xs leading-6 text-neutral-400`}
                                >
                                    <pre>
                                        {logs.map((log, i) => (
                                            <code
                                                key={i}
                                                ref={
                                                    logs.length - 1 === i
                                                        ? logContainerRef
                                                        : undefined
                                                }
                                                className="block"
                                            >
                                                <span className="mr-2 text-neutral-700">
                                                    {">"}
                                                </span>
                                                {log}
                                            </code>
                                        ))}
                                    </pre>
                                </div>
                            </div>
                        )}

                        {/* Successful deployment */}
                        {deploymentComplete && deployPreviewURL && (
                            <div className="mt-6 rounded-lg border border-neutral-800 bg-black p-5">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-neutral-800 bg-neutral-950">
                                        <CheckCircle2 className="h-4 w-4" />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-sm font-medium">
                                            Deployment successful
                                        </p>

                                        <p className="mt-1 text-xs text-neutral-500">
                                            Your application is now running.
                                        </p>

                                        <a
                                            href={deployPreviewURL}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-3 inline-flex max-w-full items-center gap-2 truncate text-sm text-white underline underline-offset-4 hover:text-neutral-300"
                                        >
                                            {deployPreviewURL}
                                            <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* GitHub */}
                    <div className="mt-8 text-center">
                        <a
                            href="https://github.com/D4rsh11/launchyard"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-white"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                className="h-5 w-5"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-1.98c-3.2.7-3.88-1.35-3.88-1.35-.53-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.26-1.28-5.26-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18A11.1 11.1 0 0 1 12 6.08c.98 0 1.97.13 2.89.38 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.42-2.71 5.39-5.29 5.68.42.36.78 1.07.78 2.16v3.2c0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
                            </svg>
                            View Launchyard on GitHub
                            <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
}