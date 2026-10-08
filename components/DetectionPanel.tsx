"use client";
import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

type Detection = {
    class: string;
    confidence: number;
    bbox: { x1: number; y1: number; x2: number; y2: number };
};

export function DetectionPanel() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [resultImg, setResultImg] = useState<string | null>(null);
    const [detections, setDetections] = useState<Detection[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // 🎛️ State สำหรับระบบ Live Filter (ค่าเริ่มต้นคือ "all")
    const [activeFilter, setActiveFilter] = useState<string>("all");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setResultImg(null);
            setDetections([]);
            setActiveFilter("all"); // รีเซ็ตฟิลเตอร์เมื่ออัปโหลดรูปใหม่
            setError("");
        }
    };

    const handleScan = async () => {
        if (!file) {
            setError("SYSTEM HALTED: No input image detected.");
            return;
        }
        setLoading(true);
        setError("");

        const formData = new FormData();
        formData.append("image", file);

        try {
            const res = await fetch("http://127.0.0.1:5000/predict", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("API Error");

            const data = await res.json();
            setResultImg(data.image_base64);
            setDetections(data.detected_objects);
            setActiveFilter("all");
        } catch (err) {
            setError("CONNECTION LOST: Cannot reach RoadOps Core Server.");
        } finally {
            setLoading(false);
        }
    };

    // 🎛️ กรองข้อมูล Detections ตาม Filter ที่เลือก
    const filteredDetections = activeFilter === "all"
        ? detections
        : detections.filter(d => d.class === activeFilter);

    // 📊 คำนวณข้อมูลสำหรับกราฟโดนัท (ใช้ข้อมูลที่ถูกกรองแล้ว)
    const processChartData = () => {
        const counts: Record<string, number> = { truck: 0, motorcycle: 0, bus: 0, car: 0 };
        filteredDetections.forEach(d => {
            if (counts[d.class] !== undefined) counts[d.class]++;
        });

        const COLORS: Record<string, string> = {
            truck: "#FFA500",
            motorcycle: "#00FF00",
            bus: "#00FFFF",
            car: "#FFFF00"
        };

        return Object.keys(counts)
            .filter(key => counts[key] > 0)
            .map(key => ({
                name: key.toUpperCase(),
                value: counts[key],
                color: COLORS[key]
            }));
    };

    const chartData = processChartData();
    const filterOptions = ["all", "truck", "motorcycle", "bus", "car"];

    return (
        <section className="ops-container">
            <div className="ops-header">
                <h2>ROADOPS AI // VISION SCANNER</h2>
                <div className="ops-status">
                    <span className="blink-dot"></span> SYSTEM ONLINE
                </div>
            </div>

            <div className="ops-grid">
                {/* กล่องซ้าย: อัปโหลดและควบคุม */}
                <div className="ops-panel control-panel">
                    <h3 className="panel-title">INPUT TERMINAL</h3>

                    <label className="ops-upload-box">
                        <input type="file" accept="image/*" onChange={handleFileChange} hidden disabled={loading} />
                        {preview ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={preview} alt="Preview" className="ops-preview-img" />
                        ) : (
                            <div className="upload-placeholder">
                                <span className="icon">[ + ]</span>
                                <p>SELECT VEHICLE IMAGE</p>
                            </div>
                        )}
                    </label>

                    <button
                        className="ops-btn-scan"
                        onClick={handleScan}
                        disabled={!file || loading}
                    >
                        {loading ? "SCANNING IN PROGRESS..." : "INITIATE SCAN"}
                    </button>

                    {error && <div className="ops-error-log">{error}</div>}
                </div>

                {/* กล่องขวา: แสดงผลลัพธ์ สถิติ และระบบกรอง */}
                <div className="ops-panel result-panel">
                    <h3 className="panel-title">ANALYSIS RESULT</h3>

                    {resultImg ? (
                        <div className="result-display">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={resultImg} alt="Result" className="ops-result-img" />

                            {/* 🎛️ แถบควบคุม Live Radar Filter */}
                            <div className="ops-filter-bar">
                                <span className="filter-label">FILTER:</span>
                                <div className="filter-buttons">
                                    {filterOptions.map(f => (
                                        <button
                                            key={f}
                                            className={`filter-btn ${activeFilter === f ? 'active' : ''} ${f}`}
                                            onClick={() => setActiveFilter(f)}
                                        >
                                            {f.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 📊 ส่วน Dashboard วิเคราะห์สถิติ */}
                            <div className="ops-analytics">
                                <div className="stat-box warning">
                                    <span className="stat-label">
                                        {activeFilter === "all" ? "TOTAL VEHICLES" : `TOTAL ${activeFilter.toUpperCase()}S`}
                                    </span>
                                    <span className="stat-value">{filteredDetections.length}</span>
                                </div>

                                {chartData.length > 0 && (
                                    <div className="chart-box">
                                        <ResponsiveContainer width="100%" height={100}>
                                            <PieChart>
                                                <Pie
                                                    data={chartData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={30}
                                                    outerRadius={45}
                                                    dataKey="value"
                                                    stroke="none"
                                                >
                                                    {chartData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#111', borderColor: '#444', color: '#fff', fontSize: '0.8rem', fontFamily: 'Courier New' }}
                                                    itemStyle={{ color: '#fff' }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}
                            </div>

                            {/* 📜 Log ข้อมูลรถ */}
                            <div className="ops-log">
                                <h4>DETECTED LOG:</h4>
                                <ul>
                                    {filteredDetections.map((obj, idx) => (
                                        <li key={idx}>
                                            <span className={`tag ${obj.class}`}>{obj.class.toUpperCase()}</span>
                                            <span className="conf">CONF: {obj.confidence}%</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div className="empty-radar">
                            <div className="radar-line"></div>
                            <p>WAITING FOR INPUT...</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}