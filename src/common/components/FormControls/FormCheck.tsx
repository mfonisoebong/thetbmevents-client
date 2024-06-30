import { InputCheckBoxProps } from "@common/typings";
import { forwardRef } from "react";
import styles from "./styles.module.css";
import { twMerge } from "tailwind-merge";

const FormCheck = forwardRef<null, InputCheckBoxProps>((props, ref) => {
  const { children, className, ...restProps } = props;

  const c = twMerge(styles.formcheck, className);

  return (
    <label className={c}>
      <input
        className={styles.checkbox}
        type="checkbox"
        {...restProps}
        ref={ref}
      />
      {children && <span className={"text-xs md:text-sm"}>{children}</span>}
    </label>
  );
});

FormCheck.displayName = "FormCheck";

export default FormCheck;
