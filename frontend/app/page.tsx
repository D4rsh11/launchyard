"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io, Socket } from "socket.io-client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
    const [repoURL, setRepoURL] = useState("");
    const [logs, setLogs] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [projectId, setProjectId] = useState<string>();
    const [deployPreviewURL, setDeployPreviewURL] = useState<string>();

    const logContainerRef = useRef<HTMLDivElement>(null);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        const socket = io("http://localhost:9002");

        socketRef.current = socket;

        socket.on("connect", () => {
            console.log("Connected to Socket.IO:", socket.id);
        });

        socket.on("message", (message: string) => {
            try {
                const data = JSON.parse(message);

                if (data.log) {
                    setLogs((prev) => [...prev, data.log]);
                }
            } catch {
                console.log("Received:", message);
            }
        });

        socket.on("connect_error", (error) => {
            console.error("Socket connection error:", error);
        });

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, []);

    useEffect(() => {
        const container = logContainerRef.current;

        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }, [logs]);

    const handleDeploy = async () => {
        if (!repoURL.trim()) {
            return;
        }

        setLoading(true);
        setLogs([]);
        setDeployPreviewURL(undefined);

        try {
            const { data } = await axios.post(
                "http://localhost:9000/project",
                {
                    gitURL: repoURL,
                    slug: projectId,
                }
            );

            if (data?.data) {
                const { projectSlug, url } = data.data;

                setProjectId(projectSlug);
                setDeployPreviewURL(url);

                console.log(`Subscribing to logs:${projectSlug}`);

                socketRef.current?.emit(
                    "subscribe",
                    `logs:${projectSlug}`
                );
            }
        } catch (error) {
            console.error("Deployment failed:", error);

            setLogs((prev) => [
                ...prev,
                "Deployment failed. Check the API server.",
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-black text-white">
            <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-16">

                {/* Header */}
                <div className="mb-12 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">
                        Launchyard
                    </h1>

                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-zinc-400 transition hover:text-white"
                    >
                        GitHub
                    </a>
                </div>

                {/* Hero */}
                <div className="flex flex-1 flex-col items-center justify-center">
                    <div className="mb-10 text-center">
                        <h2 className="text-5xl font-bold tracking-tight">
                            Deploy your project
                        </h2>

                        <p className="mt-4 text-zinc-400">
                            Enter a GitHub repository and deploy it with Launchyard.
                        </p>
                    </div>

                    {/* Repository input */}
                    <div className="flex w-full max-w-2xl gap-3">
                        <Input
                            value={repoURL}
                            onChange={(event) =>
                                setRepoURL(event.target.value)
                            }
                            placeholder="https://github.com/username/repository"
                            className="h-12 border-zinc-700 bg-zinc-900 text-white placeholder:text-zinc-500"
                        />

                        <Button
                            onClick={handleDeploy}
                            disabled={loading || !repoURL.trim()}
                            className="h-12 px-6"
                        >
                            {loading ? "Deploying..." : "Deploy"}
                        </Button>
                    </div>

                    {/* Preview URL */}
                    {deployPreviewURL && (
                        <div className="mt-6 w-full max-w-2xl rounded-lg border border-zinc-800 bg-zinc-950 p-4">
                            <p className="mb-2 text-sm text-zinc-400">
                                Deployment URL
                            </p>

                            <a
                                href={deployPreviewURL}
                                target="_blank"
                                rel="noreferrer"
                                className="break-all text-sm text-blue-400 hover:underline"
                            >
                                {deployPreviewURL}
                            </a>
                        </div>
                    )}

                    {/* Logs */}
                    <div className="mt-8 w-full max-w-2xl">
                        <div
                            ref={logContainerRef}
                            className="h-96 overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-950 p-4 font-mono text-sm"
                        >
                            {logs.length === 0 ? (
                                <div className="text-zinc-600">
                                    Build logs will appear here...
                                </div>
                            ) : (
                                logs.map((log, index) => (
                                    <div
                                        key={index}
                                        className="whitespace-pre-wrap text-green-400"
                                    >
                                        {log}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}