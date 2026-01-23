import React from "react";
import { toast, type ToastOptions } from "react-hot-toast";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";

type ToastVariant = "success" | "error";

type ToastProps = {
  variant: ToastVariant;
  message: string;
  visible: boolean;
};

const baseOptions: ToastOptions = {
  duration: 3500,
  position: "top-right",
};

function AppToast({ variant, message, visible }: ToastProps) {
  const isSuccess = variant === "success";
  const Icon = isSuccess ? CheckCircleIcon : ExclamationCircleIcon;

  return (
    <div
      className={
        "pointer-events-auto w-fit max-w-md rounded-xl shadow-lg ring-1 ring-black/10 " +
        "backdrop-blur-md " +
        "px-4 py-3 flex items-start gap-3 " +
        "transition " +
        (visible ? "toast-enter" : "toast-leave")
      }
      style={{
        background: isSuccess
          ? "linear-gradient(90deg, rgba(20,215,104,0.18) 0%, rgba(18,78,198,0.10) 100%)"
          : "linear-gradient(90deg, rgba(242,7,7,0.15) 0%, rgba(18,78,198,0.08) 100%)",
      }}
    >
      <div
        className={
          "mt-0.5 flex h-9 w-9 items-center justify-center rounded-full " +
          (isSuccess ? "bg-success/15" : "bg-error/15")
        }
      >
        <Icon
          className={"h-5 w-5 " + (isSuccess ? "text-success" : "text-error")}
        />
      </div>

      <div className="flex-1">
        <p className="text-sm font-semibold text-subtle-black">
          {isSuccess ? "Success" : "Something went wrong"}
        </p>
        <p className="text-sm text-subtle-black/80 leading-snug">{message}</p>
      </div>
    </div>
  );
}

export function successToast(message: string, options?: ToastOptions) {
  return toast.custom(
    (t) => <AppToast variant="success" message={message} visible={t.visible} />,
    { ...baseOptions, ...options }
  );
}

export function errorToast(message: string, options?: ToastOptions) {
  return toast.custom(
    (t) => <AppToast variant="error" message={message} visible={t.visible} />,
    { ...baseOptions, ...options }
  );
}
