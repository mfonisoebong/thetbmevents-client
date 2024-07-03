import { FC } from "react";
import ButtonLink from "@common/components/ButtonLink";
import useMediaQuery from "@common/hooks/useMediaQuery";
import { Device } from "@common/typings";

export const HeaderActions: FC = () => {
  const isLargeScreen = useMediaQuery(Device.large);

  return (
    <div className="flex items-center">
      <ButtonLink
        size={isLargeScreen ? undefined : "sm"}
        variant={"outline"}
        className={"text-sm"}
        href={"/organizer/dashboard/coupons/create"}
      >
        Add new
      </ButtonLink>
    </div>
  );
};
