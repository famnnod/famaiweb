import { AppHeader } from "@/components/AppHeader";
import { FeatureCard } from "@/components/FeatureCard";
import { DetectionPanel } from "@/components/DetectionPanel";
// 1. เพิ่มบรรทัดนี้เพื่อ Import Component เข้ามาครับ
import { ApiStatus } from "@/components/ApiStatus";

export default function Home() {
    return (
        <main>
            <AppHeader />
            <br></br>

            {/* 2. เรียกใช้งาน Component ตรงนี้ครับ */}
            <ApiStatus />
            <br></br>

            <FeatureCard
                title="Object Detection"
                description="ตรวจจับวัตถุจากรูปภาพด้วย AI"
            />
            <br></br>
            <FeatureCard
                title="AI Chat"
                description="สนทนากับAI"
            />
            <br></br>
            <DetectionPanel />
            <br></br>
            <ApiStatus/>
        </main>
    );
}