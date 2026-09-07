"use client";
import { useState } from "react";

export function ApiStatus() {
    const [status, setStatus] = useState("Not checked");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function checkApi() {
        try {
            setLoading(true);
            setError("");

            const response = await fetch("http://127.0.0.1:5000/health");

            if (!response.ok) {
                throw new Error("API request failed");
            }

            const data = await response.json();
            setStatus(data.status);

        } catch (error) {
            setError("Cannot connect to API");
        } finally {
            setLoading(false);
        }
    }

    return (
        <section>
            <h2>Backend API</h2>
            <p>API Status: {status}</p>

            <button onClick={checkApi} disabled={loading}>
                {loading ? "Checking..." : "Check API"}
            </button>

            {error && (
                <p style={{ color: "red" }}>{error}</p>
            )}
        </section>
    );
}