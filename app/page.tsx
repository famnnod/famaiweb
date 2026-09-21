import { AppHeader } from "@/components/AppHeader";
import { FeatureCard } from "@/components/FeatureCard";
import { DetectionPanel } from "@/components/DetectionPanel";
// 1. เพิ่มบรรทัดนี้เพื่อ Import Component เข้ามาครับ
import { ApiStatus } from "@/components/ApiStatus";

export default function Home() {
    return (
        <main className="ux-shell">
            <AppHeader />
            <div className="ux-grid">
                <FeatureCard
                    title="Object Detection"
                    description="ตรวจจับวัตถุจากรูปภาพด้วย AI"
                />
                <FeatureCard
                    title="AI Chat"
                    description="สนทนากับ Generative AI"
                />
            </div>
            <DetectionPanel />
            <ApiStatus />
        </main>
    );
}