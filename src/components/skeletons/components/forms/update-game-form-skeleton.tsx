// package
import { Fragment } from 'react'

// components
import { Input } from '@/components/ui/input'

export function UpdateGameFormSkeleton() {
  return (
    <div className="p-4 flex flex-col gap-2 rounded-lg w-full skeleton-no-bg">
      <div className="w-full flex justify-between not-skeleton">
        <Input className="max-w-[40%]" />
        <Input className="max-w-[20%]" />
      </div>

      {Array.from({ length: 7 }, (_, index) => (
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
