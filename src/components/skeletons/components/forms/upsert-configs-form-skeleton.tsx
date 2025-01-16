// components
import { Input } from '@/components/ui/input'

export function UpsertConfigsFormSkeleton() {
  return (
    <div className="p-4 flex flex-col gap-2 rounded-lg w-full skeleton">
      {Array.from({ length: 9 }, (_, index) => (
        <>
          <span key={index} className="text-2xl text-primary-foreground max-w-[150px] max-h-5">
            &nbsp;
          </span>
          <Input />
        </>
      ))}
    </div>
  )
}
