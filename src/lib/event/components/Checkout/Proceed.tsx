import { FC } from "react";
import ButtonLink from "@common/components/ButtonLink";
import { useRouter } from "next/router";
import useEventContext from "@lib/event/hooks/useEventContext";

const Proceed: FC = () => {
  const { query } = useRouter();
  const slug = query?.slug;

  return (
    <div>
      <ButtonLink href={`/events/${slug}/checkout`}>
        Purchase tickets
      </ButtonLink>
    </div>
  );
};

export default Proceed;
