import StayForm from "@/components/admin/StayForm";
import { getStayById } from "@/lib/staysStore";
import { notFound } from "next/navigation";

export default async function EditStayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const stay = await getStayById(id);
  if (!stay) return notFound();

  return (
    <div className="pb-10">
      <StayForm initialData={stay} />
    </div>
  );
}
