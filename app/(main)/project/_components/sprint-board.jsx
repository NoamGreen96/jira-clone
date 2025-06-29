'use client'

import React, { useState } from 'react'
import SprintManager from './sprint-manager'

const SprintBoard = ({ sprints, projectId, orgId }) => {
    const [currentsprint, setCurrentSprint] = useState(
        sprints.find((spr) => spr.status === "ACTIVE" || sprints[0])
    )

    return (
        <div>
            {/* Sprint Manager */}

            <SprintManager
                sprint={currentsprint}
                setSprint={setCurrentSprint}
                sprints={sprints}
                projectId={projectId}

            />

            {/* Kanban Board */}
        </div>
    )
}

export default SprintBoard