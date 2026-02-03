import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function AvailabilityPage() {
  const { userId } = await auth();

  return <div>AvailabilityPage</div>;
}

export default AvailabilityPage;
