import { FC } from "react";
import { ContinueProps } from "@lib/event-checkout/typings";
import Button from "@common/components/Button";

const Continue: FC<ContinueProps> = (props) => {
  return (
    <div>
      <Button size={"lg"} className={"w-6/12 md:w-4/12"} {...props}>
        Continue
      </Button>
    </div>
  );
};

export default Continue;
