import Button from "@common/components/Button";
import FormField from "@common/components/FormControls/FormField";
import useAlertContext from "@common/hooks/useAlertContext";
import { errorParser } from "@common/utils/errorParser";
import { zodResolver } from "@hookform/resolvers/zod";
import OverviewCard from "@lib/dashboard-overview/components/OverviewCard";
import { changePassword } from "@lib/dashboard-profile/helpers/changePassword";
import {
  PasswordForm,
  passwordSchema,
} from "@lib/dashboard-profile/utils/passwordFormSchema";
import { useMutation } from "@tanstack/react-query";
import { FC } from "react";
import { useForm } from "react-hook-form";

const ChangePassword: FC = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });
  const { handleOpenAlert } = useAlertContext();
  const { mutate, isLoading } = useMutation({
    mutationFn: changePassword,
    onSuccess() {
      handleOpenAlert({
        body: "Password changed successfully",
        title: "Success",
        type: "success",
      });
      reset();
    },
    onError(err) {
      handleOpenAlert({
        body: errorParser(err),
        title: "Error",
        type: "error",
      });
    },
  });

  const onFormSubmit = (data: PasswordForm) => {
    mutate(data);
  };

  return (
    <OverviewCard theme={"light"} title="Change password">
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
        <div className="mt-6 flex flex-col justify-center  space-y-4 md:space-y-0 md:flex-row md:space-x-8">
          <FormField
            error={errors.password?.message}
            label="Password"
            type="password"
            {...register("password")}
            className="lg:w-1/2"
          />
          <FormField
            error={errors.confirmPassword?.message}
            label="Confirm password"
            type="password"
            {...register("confirmPassword")}
            className="lg:w-1/2"
          />
        </div>
        <Button
          loading={isLoading}
          type="submit"
          size="lg"
          className="mx-auto px-12"
        >
          Submit
        </Button>
      </form>
    </OverviewCard>
  );
};

export default ChangePassword;
