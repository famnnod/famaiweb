"use client";
import { useState, useEffect } from "react";

// (ข้อ 29) สร้าง Type สำหรับผลลัพธ์ Detection
type Detection = {
    class: string;
    confidence: number;
    bbox: {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
    };
};

export function DetectionPanel() {
    const [status, setStatus] = useState("Waiting");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [detections, setDetections] = useState<Detection[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [hasAnalyzed, setHasAnalyzed] = useState(false);

    useEffect(() => {
        if (!selectedFile) {
            // eslint-disable-next-line
            setPreviewUrl(null);
            return;
        }
        const url = URL.createObjectURL(selectedFile);
        // eslint-disable-next-line
        setPreviewUrl(url);
        
        return () => {
            URL.revokeObjectURL(url);
        };
    }, [selectedFile]);

    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setDetections([]);
            setHasAnalyzed(false);
            setError("");
        }
    }

    async function detectObjects() {
        if (!selectedFile) {
            setError("Please select an image");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const formData = new FormData();
            formData.append("image", selectedFile);

            const response = await fetch("http://127.0.0.1:5000/predict", {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                throw new Error("Detection failed");
            }

            const data = await response.json();
            setDetections(data.detected_objects);
            
            // เพิ่มการเปลี่ยนสถานะว่า AI วิเคราะห์ภาพเสร็จสมบูรณ์แล้ว
            setHasAnalyzed(true);

        } catch (error) {
            setError("Cannot detect objects");
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="ux-card ux-detection">
            <div className="ux-section-heading">
                <p className="ux-eyebrow">AI IMAGE ANALYSIS</p>
                <h2>Object Detection</h2>
                <p className="ux-muted">
                    Upload an image to identify objects using the YOLO model.
                </p>
            </div>

            {/* ส่วนของ Upload */}
            <div className="ux-upload">
                <label className="ux-file-button">
                    <input
                        className="ux-file-input"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={loading}
                    />
                    <span>Choose Image</span>
                </label>
                <span className="ux-file-name">
                    {selectedFile ? selectedFile.name : "No image selected"}
                </span>
            </div>

            {/* แสดงรูปภาพพรีวิว */}
            {previewUrl && (
                <div className="ux-preview">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={previewUrl}
                        alt="Selected image preview"
                    />
                </div>
            )}

            {/* ปุ่ม Detect */}
            <button
                className="ux-button"
                onClick={detectObjects}
                disabled={loading}
            >
                {loading ? "Detecting..." : "Detect Objects"}
            </button>

            {/* แสดง Error */}
            {error && (
                <div className="ux-error">
                    {error}
                </div>
            )}

            {/* แสดงผลลัพธ์ (รองรับ Empty State และโค้ด Map แบบใหม่) */}
            {hasAnalyzed && (
                <>
                    <div className="ux-result-heading">
                        <h3>Detection Result</h3>
                    </div>

                    {detections.length > 0 ? (
                        <div className="ux-results">
                            {detections.map((item, index) => (
                                <article
                                    className="ux-result-item"
                                    key={index}
                                >
                                    <strong>{item.class}</strong>
                                    <p>Confidence: {item.confidence}%</p>
                                    <div className="ux-confidence-track">
                                        <div 
                                            className="ux-confidence-fill" 
                                            style={{ 
                                                width: `${Math.max(0, Math.min(100, item.confidence))}%` 
                                            }}
                                        />
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <p className="ux-muted">No objects detected.</p>
                    )}
                </>
            )}

            <hr style={{ margin: '24px 0', border: 'none', borderTop: '1px solid var(--ux-border)' }} />

            {/* ส่วน Status เดิม */}
            <div className="ux-status">
                <p style={{ marginBottom: '10px' }}>Status: {status}</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="ux-button" onClick={() => setStatus("Ready")}>
                        Prepare Detection
                    </button>
                    <button 
                        className="ux-button" 
                        style={{ background: 'var(--ux-muted)' }} 
                        onClick={() => setStatus("Waiting")}
                    >
                        Reset
                    </button>
                </div>
            </div>
        </section>
    );
}