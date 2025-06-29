"use server";

import { auth } from "@clerk/nextjs/server";
import { createClerkClient } from "@clerk/backend";

const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
});

export async function getActiveOrganization() {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
        throw new Error("Unauthorized");
    }

    const organization = await clerkClient.organizations.getOrganization({
        organizationId: orgId,
    });

    return {
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
        createdAt: organization.createdAt,
        role: organization.role,
    };
}
