"use client";
import { useState } from "react";

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
    
    // (ข้อ 30) State สำหรับเก็บ Array ของผลลัพธ์
    const [detections, setDetections] = useState<Detection[]>([]);
    
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(""); 

    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0]; 
        if (file) {
            setSelectedFile(file); 
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
            
            // (ข้อ 31) นำข้อมูล detected_objects ที่ได้มาเก็บลงใน State
            setDetections(data.detected_objects);

        } catch (error) {
            setError("Cannot detect objects"); 
        } finally {
            setLoading(false); 
        }
    }

    return (
        <section>
            <h2>Object Detection</h2>
            <br></br>

            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
            />
            
            {selectedFile && (
                <p style={{ color: 'blue' }}>
                    Selected: {selectedFile.name}
                </p>
            )}
            <br></br>

            <button
                onClick={detectObjects}
                disabled={loading}
            >
                {loading ? "Detecting..." : "Detect Objects"}
            </button>
            <br></br>

            {error && (
                <p style={{ color: 'red' }}>{error}</p>
            )}

            {/* (ข้อ 32) ส่วนสำหรับแสดงผลลัพธ์ Class และ Confidence บนหน้าเว็บ */}
            <h3>Detection Result</h3>
            {detections.map((item, index) => (
                <div key={index} style={{ marginBottom: '10px' }}>
                    <strong>{item.class}</strong>
                    <p>Confidence: {item.confidence}%</p>
                </div>
            ))}

            <hr style={{ margin: '20px 0' }} />

            <p>Status: {status}</p>
            <button onClick={() => setStatus("Ready")}>
                Prepare Detection
            </button>
            <br></br>
            <button onClick={() => setStatus("Waiting")}>
                Reset
            </button>
        </section>
    );
}