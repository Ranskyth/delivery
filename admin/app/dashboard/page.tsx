import { getDashboardStats } from "@/app/lib/actions"
import { SectionCards } from "@/components/section-cards"

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <SectionCards stats={stats} />
    </>
  )
}
