import { prisma } from "@/lib/prisma";

export async function getActiveCampaign() {
  const now = new Date();
  const campaigns = await prisma.campaignBanner.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" }
  });
  return (
    campaigns.find((c) => {
      const afterStart = !c.startDate || c.startDate <= now;
      const beforeEnd = !c.endDate || c.endDate >= now;
      return afterStart && beforeEnd;
    }) || null
  );
}