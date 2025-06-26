'use server'

import { db } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server";

export async function createProject(data) {
    const { userId, orgId, sessionClaims } = await auth();

    if (!userId) throw new Error("Unauthorized");
    if (!orgId) throw new Error("No Organization Selected");

    const role = sessionClaims?.o?.rol;

    if (role !== "admin") {
        const { data: membershipList } = await clerkClient.organizationMemberships.getOrganizationMembershipList({ organizationId: orgId });
        const membership = membershipList.find(m => m.publicUserData?.userId === userId);
        if (!membership || membership.role !== "admin") {
            throw new Error("Only organization admins can create projects");
        }
    }

    try {
        const project = await db.project.create({
            data: {
                name: data.name,
                key: data.key,
                description: data.description,
                organizationId: orgId,
            },
        });

        return project;
    } catch (error) {
        throw new Error("Error creating project: " + error.message);
    }
}
