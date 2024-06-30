import { FC } from "react";
import { WorkItemProps } from "@lib/how-it-works/typings";
import Link from "next/link";

const WorkItem: FC<WorkItemProps> = ({ title, id, body, links }) => {
  return (
    <div className={"space-y-2 text-sm"}>
      <h5 className={"font-bold"}>
        {id}. {title}
      </h5>
      <p className={"font-normal"}>{body}</p>
      {links?.map((l) => (
        <Link
          href={l.href}
          key={l.href}
          className={"block text-mainDark underline"}
        >
          {l.title}
        </Link>
      ))}
    </div>
  );
};

export default WorkItem;
