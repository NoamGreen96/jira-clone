'use client';

import React, { Suspense } from 'react';

const ProjectLayout = ({ children }) => {
    return (
        <div className="mx-auto">
            <Suspense
                fallback={
                    <div className="flex items-center justify-center h-[300px] w-full">
                        <span className="animate-spin rounded-full border-4 border-blue-500 border-t-transparent h-8 w-8"></span>
                        <span className="ml-4 text-sm text-blue-200">Loading Projects...</span>
                    </div>
                }
            >
                {children}
            </Suspense>
        </div>
    );
};

export default ProjectLayout;
