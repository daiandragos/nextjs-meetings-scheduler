"use server";

import { auth } from "@clerk/nextjs/server";
import { writeClient } from "@/sanity/lib/writeClient";
import { getOrCreateUser } from "./availability";

export async function submitFeedback(
  content: string,
): Promise<{ success: boolean }> {
  const trimmed = content?.trim();
  if (!trimmed || trimmed.length === 0) {
    throw new Error("Feedback content is required");
  }
  if (trimmed.length > 5000) {
    throw new Error("Feedback content is too long");
  }

  const { userId } = await auth();
  if (!userId) {
    throw new Error("Not authenticated");
  }
  const user = await getOrCreateUser(userId);

  await writeClient.create({
    _type: "feedback",
    user: {
      _type: "reference",
      _ref: user._id,
    },
    content,
    createdAt: new Date().toISOString(),
  });

  return { success: true };
}
