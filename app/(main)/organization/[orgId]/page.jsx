import { getActiveOrganization } from '@/actions/organization';
import OrgSwitcher from '@/components/org-swicher';
import React from 'react'
import ProjectList from './_components/project-list';

const Organization = async ({ params }) => {
  const { orgId } = await params
  const organization = await getActiveOrganization(orgId);

  if (!organization) {
    return <div>Organization not found</div>
  }

  return (
    <div className="container mx-auto">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start">
        <h1 className="text-5xl font-bold gradient-title pb-2">
          {organization.name}&rsquo;s Projects
        </h1>
        <OrgSwitcher />
      </div>
      <div className="mb-4">
        <ProjectList orgId={organization.id} />

        Show org projects </div>
      <div className="mt-8">Show user assigned and reported issues here</div>
    </div>
  );
}

export default Organization