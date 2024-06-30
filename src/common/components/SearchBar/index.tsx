import { SearchBarProps } from "@common/typings";
import { FC, useRef } from "react";
import Close from "../Icons/Close";
import Search from "../Icons/Search";
import { twMerge } from "tailwind-merge";

const SearchBar: FC<SearchBarProps> = (props) => {
  const {
    closeAction,
    closeButtonShow,
    style,
    className,
    iconPosition,
    ...restInputProps
  } = props;
  const inputRef = useRef<HTMLInputElement>(null);

  const clearInput = () => {
    inputRef.current!.value = "";
    closeAction && closeAction();
  };
  const closeBtnShow = (props.value && props.value !== "") || closeButtonShow;

  const c = twMerge("w-full relative", className);
  const iconClass = twMerge(
    "absolute fill-main top-[37%]",
    iconPosition === "right" ? "right-5" : "left-5",
  );

  return (
    <div className={c}>
      {closeBtnShow && (
        <Close onClick={clearInput} className={iconClass} size={18} />
      )}

      {!closeBtnShow && <Search className={iconClass} size={18} />}
      <input
        {...restInputProps}
        className="block w-full min-h-[1.5rem] h-[3.5rem]  placeholder:font-medium placeholder:text-gray-800 outline-0  border-solid border-[0.15rem] bg-white border-gray-500 rounded-3xl text-gray-800 pl-5 shadow-sm "
        ref={inputRef}
        style={{ paddingLeft: "2.7rem", ...style }}
      />
    </div>
  );
};

export default SearchBar;
