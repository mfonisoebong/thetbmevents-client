import { FC } from "react";
import IconButton from "@common/components/IconButton";
import ArrowLeft from "@common/components/Icons/ArrowLeft";
import { useRouter } from "next/router";

const Previous: FC = () => {
  const router = useRouter();
  const view = router.query?.view;

  if (!view) return null;

  return (
    <div className={"py-5"}>
      <IconButton
        onClick={router.back}
        icon={<ArrowLeft size={20} color={"black"} />}
      >
        Back
      </IconButton>
    </div>
  );
};

export default Previous;
