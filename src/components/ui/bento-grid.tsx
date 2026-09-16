import { cn } from "@/lib/utils";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "row-span-1 rounded-3xl group/bento hover:shadow-2xl transition duration-200 shadow-input p-4 bg-[#202427] border border-[#8C9390]/20 justify-between flex flex-col space-y-4 hover:border-[#C8FF3D]/50 relative overflow-hidden",
        className
      )}
    >
      {header}
      <div className="group-hover/bento:translate-x-1 transition duration-200 z-10">
        {icon}
        <div className="font-sans font-black text-[#F4F3EE] uppercase tracking-tight mb-2 mt-2">
          {title}
        </div>
        <div className="font-sans font-normal text-[#8C9390] text-xs leading-relaxed">
          {description}
        </div>
      </div>
    </div>
  );
};
