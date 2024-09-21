import { Skeleton } from "../ui/skeleton"


export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[150px] w-[300px] rounded-xl  bg-slate-300" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[300px] bg-slate-300" />
        <Skeleton className="h-4 w-[250px]  bg-slate-300" />
      </div>
    </div>
  )
}
