import { ReviewCardProps } from "@lib/home/typings";
import { FC } from "react";
import styles from "../styles.module.css";
import Image from "next/image";
import Twitter from "@common/components/Icons/Twitter";
import Instagram from "@common/components/Icons/Instagram";
import useMediaQuery from "@common/hooks/useMediaQuery";
import { Device } from "@common/typings";
import Facebook from "@common/components/Icons/Facebook";

const TestimonyCard: FC<ReviewCardProps> = (props) => {
  const isMediumScreen = useMediaQuery(Device.medium);

  return (
    <div className={styles.card}>
      <div className="space-y-2">
        <Image
          src={props.avatar}
          alt={props.name}
          unoptimized
          width={60}
          className={"w-16 h-16 rounded-full object-cover"}
          height={60}
        />
        <h4 className="text-xl lg:text-2xl font-semibold">{props.name}</h4>
      </div>
      <div className="h-[50%]">
        <p className=" text-lg font-bold">“</p>
        <p className="text-sm md:text-base">{props.body}</p>
        <p className="text-right  text-lg font-bold">“</p>
      </div>

      <div className="flex justify-end">
        {props.source === "twitter" && <Twitter size={24} />}
        {props.source === "facebook" && <Facebook size={24} />}
        {props.source === "instagram" && <Instagram size={24} />}
      </div>
    </div>
  );
};

export default TestimonyCard;
