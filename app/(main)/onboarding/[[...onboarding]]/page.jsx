"use client"

import { OrganizationList, useOrganization } from '@clerk/nextjs'
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef } from 'react'

const Onboarding = () => {
  const { organization } = useOrganization();
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (organization && !hasRedirected.current) {
      hasRedirected.current = true;
      router.push(`/organization/${organization.slug}`);
    }
  }, [organization, router]);

  return (
    <div className='flex justify-center items-center pt-14'>
      <OrganizationList
        hidePersonal
        afterCreateOrganizationUrl='/organization/:slug'
        afterSelectOrganizationUrl='/organization/:slug'
      />
    </div>
  )
}

export default Onboarding