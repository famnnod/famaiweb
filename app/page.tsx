import { DetectionPanel } from "@/components/DetectionPanel";
import { ApiStatus } from "@/components/ApiStatus";
import Link from "next/link";
export default function Home() {
    return (
        <main className="roadops-main">
            {/* แถบควบคุมด้านบน */}
            <header className="roadops-navbar">
                <div className="brand">
                    <h1>ROADOPS AI <span>CENTRAL COMMAND</span></h1>
                    <p className="subtitle">TRAFFIC & VEHICLE SURVEILLANCE SYSTEM</p>
                </div>
                <div className="nav-actions">
                    <Link href="/saved-prompts" className="btn-nav">
                        [ MANAGE PROMPTS ]
                    </Link>
                </div>
            </header>

            {/* พื้นที่หลักสำหรับแสดงระบบตรวจจับ */}
            <div className="dashboard-content">
                <DetectionPanel />
            </div>

            {/* แถบสถานะด้านล่าง */}
            <footer className="status-footer">
                <ApiStatus />
            </footer>
        </main>
    );
}