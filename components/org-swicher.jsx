"use client";

import {
  OrganizationSwitcher,
  useOrganization,
  useUser,
} from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import React from "react";

const OrgSwitcher = () => {
  const { isLoaded } = useOrganization();
  const { isLoaded: isUserLoaded } = useUser();
  const pathname = usePathname();

  if (!isLoaded || !isUserLoaded) return null;

  return (
    <OrganizationSwitcher
      hidePersonal
      afterCreateOrganizationUrl={(org) => `/organization/${org.slug}`}
      afterSelectOrganizationUrl={(org) => `/organization/${org.slug}`}
      createOrganizationMode={pathname === "/onboarding" ? "navigation" : "modal"}
      createOrganizationUrl="/onboarding"
      appearance={{
        elements: {
          organizationSwitcherTrigger:
            'border border-gray-300 rounded-md px-5 py-5',
          organizationSwitcherTriggerIcon:
            'text-white',
        }
      }}
    />
  );
};

export default OrgSwitcher;
