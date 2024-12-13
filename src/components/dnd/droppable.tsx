import React from 'react'

interface DroppableProps {
  id: string
  title: string
  children: React.ReactNode
}

export const Droppable: React.FC<DroppableProps> = ({
  id,
  title,
  children,
}) => {
  return (
    <div className="bg-gray-200 p-4 rounded w-64">
      <h2 className="font-bold mb-2">{title}</h2>
      <div id={id} className="space-y-2">
        {children}
      </div>
    </div>
  )
}
