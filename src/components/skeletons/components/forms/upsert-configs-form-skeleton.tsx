// packages
import { Fragment } from 'react'

// components
import { Input } from '@/components/ui/input'

export function UpsertConfigsFormSkeleton() {
  return (
    <div className="p-4 flex flex-col gap-2 rounded-lg w-full skeleton-no-bg">
      {Array.from({ length: 9 }, (_, index) => (
        <Fragment key={index}>
          <span className="text-2xl text-primary-foreground max-w-[150px] max-h-5">
            &nbsp;
          </span>
          
          <Input />
        </Fragment>
      ))}
    </div>
  )
}
