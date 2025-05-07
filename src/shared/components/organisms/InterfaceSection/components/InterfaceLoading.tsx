import { Skeleton } from "@/shared/components/atoms";

const InterfaceLoading = () => (
  <div>
    {[...Array(3)].map((_, idx) => (
      <div
        key={idx}
        className="flex justify-between items-center h-[14px] mt-2 "
      >
        <div className="w-[200px] h-[14px] flex gap-2">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} isLoading className="!h-4">
              Place holder
            </Skeleton>
          ))}
        </div>
        <div className="w-[80px] flex gap-2">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} isLoading className="!h-4">
              Place holder
            </Skeleton>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default InterfaceLoading;
