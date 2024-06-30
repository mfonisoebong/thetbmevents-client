import { FC } from "react";
import { ChannelProps } from "@lib/admin-testimonies/typings";
import Twitter from "@common/components/Icons/Twitter";
import Facebook from "@common/components/Icons/Facebook";
import Instagram from "@common/components/Icons/Instagram";
import { useFormContext } from "react-hook-form";
import { TestimoniesFormType } from "@lib/admin-testimonies/utils/testimoniesSchema";
import InstagramColored from "@common/components/Icons/InstagramColored";

const ChannelItem: FC<ChannelProps> = ({ channel, index }) => {
  const { watch, setValue } = useFormContext<TestimoniesFormType>();

  const selectedChannel = watch(`testimonies.${index}.channel`);
  const isSelected = selectedChannel === channel;
  const selectedColor = isSelected ? "#097EF3" : "black";

  const changeChannel = () => {
    setValue(`testimonies.${index}.channel`, channel);
  };

  return (
    <>
      {channel === "twitter" && (
        <Twitter onClick={changeChannel} size={20} color={selectedColor} />
      )}
      {channel === "facebook" && (
        <Facebook onClick={changeChannel} size={20} color={selectedColor} />
      )}
      {channel === "instagram" && (
        <>
          {isSelected ? (
            <InstagramColored onClick={changeChannel} size={20} />
          ) : (
            <Instagram onClick={changeChannel} size={20} color={"black"} />
          )}
        </>
      )}
    </>
  );
};

export default ChannelItem;
