import { prisma } from "@/lib/prisma";
import CampaignForm from "./CampaignForm";
import CampaignRow from "./CampaignRow";

export default async function AdminCampaignsPage() {
  const campaigns = await prisma.campaignBanner.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div>
      <h2 className="text-xl">Homepage Campaigns</h2>
      <p className="mt-1 max-w-[60ch] text-sm text-inkInverseSoft">Controls the hero headline, caption, image and call-to-action on the homepage. The most recently created <strong>active</strong> campaign that&apos;s within its start/end dates (if set) is shown; when none qualifies, the default hero content is used.</p>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          {campaigns.map((c) => (
            <CampaignRow key={c.id} campaign={{ id: c.id, title: c.title, caption: c.caption, active: c.active, startDate: c.startDate ? c.startDate.toISOString().slice(0, 10) : "", endDate: c.endDate ? c.endDate.toISOString().slice(0, 10) : "" }} />
          ))}
          {campaigns.length === 0 && <p className="text-inkInverseSoft">No campaigns yet — create one to take over the hero section.</p>}
        </div>
        <CampaignForm />
      </div>
    </div>
  );
}