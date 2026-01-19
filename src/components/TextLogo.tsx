import {cn} from "@lib/utils";

export default function TextLogo({className, imgClassName}: {className?: string, imgClassName?: string}) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <img src="/images/tbm-logo.png" alt="logo" className={cn("w-20 inline-block", imgClassName)}/>
      <span className="font-bold text-xl">TBM <span className="text-brand-yellow">EVENTS</span></span>
    </div>
  )
}
