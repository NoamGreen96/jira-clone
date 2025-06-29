'use server'

import { db } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

export async function createProject(data) {
    const { userId, orgId, sessionClaims } = await auth()

    if (!userId) throw new Error("Unauthorized")
    if (!orgId) throw new Error("No Organization Selected")

    const role = sessionClaims?.o?.rol

    if (role !== "admin") {
        const { data: membershipList } = await clerkClient.organizationMemberships.getOrganizationMembershipList({ organizationId: orgId })
        const membership = membershipList.find(m => m.publicUserData?.userId === userId)
        if (!membership || membership.role !== "admin") {
            throw new Error("Only organization admins can create projects")
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
        })

        return project
    } catch (error) {
        throw new Error("Error creating project: " + error.message)
    }
}

export async function getProjects(orgId) {
    const { userId } = await auth()

    if (!userId) throw new Error("Unauthorized")

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    })

    if (!user) throw new Error('User not found')

    const projects = await db.project.findMany({
        where: { organizationId: orgId },
        orderBy: { createdAt: 'desc' }
    })

    return projects
}

export async function deleteProject(projectId) {
    const { userId, orgId, sessionClaims } = await auth()

    if (!userId || !orgId) throw new Error('Unauthorized')

    const role = sessionClaims?.o?.rol
    if (role !== 'admin') {
        throw new Error('Only organization admins can delete projects')
    }

    const project = await db.project.findUnique({
        where: { id: projectId },
    })

    if (!project || project.organizationId !== orgId) {
        throw new Error("Project not found or you don't have permission to delete it")
    }

    await db.project.delete({
        where: { id: projectId },
    })

    return { success: true }
}

export async function getProject(projectId) {
    const { userId, orgId } = await auth()

    if (!userId || !orgId) throw new Error('Unauthorized')

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    })

    if (!user) throw new Error('User not found')

    const project = await db.project.findUnique({
        where: { id: projectId },
        include: {
            sprints: {
                orderBy: { createdAt: 'desc' }
            }
        }
    })

    if (!project) return null
    if (project.organizationId !== orgId) return null

    return project
}