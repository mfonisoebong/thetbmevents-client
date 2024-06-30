import { FC } from "react";
import { IndividualFormProps } from "@lib/dashboard-edit-profile/typings";
import { useForm } from "react-hook-form";
import {
  IndividualProfileFormType,
  individualProfileSchema,
} from "@lib/dashboard-edit-profile/utils/profileSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import OverviewCard from "@lib/dashboard-overview/components/OverviewCard";
import FormField from "@common/components/FormControls/FormField";
import FormFieldset from "@common/components/FormControls/FormFieldset";
import useCountries from "@common/hooks/useCountries";
import Loader from "@common/components/Icons/Loader";
import ArrowDown from "@common/components/Icons/ArrowDown";
import FormSelectField from "@common/components/FormControls/FormSelectField";
import Button from "@common/components/Button";
import { useMutation } from "@tanstack/react-query";
import { updateUser } from "@lib/dashboard-edit-profile/helpers/updateUser";
import { compareObjects } from "@common/utils/compareObjects";
import useAuth from "@common/hooks/useAuth";
import useAlertContext from "@common/hooks/useAlertContext";
import EditAvatar from "@lib/dashboard-edit-profile/components/EditAvatar";

const IndividualForm: FC<IndividualFormProps> = ({ user }) => {
  const userData = {
    country: user.country,
    email: user.email,
    dialCode: user.phone_dial_code,
    firstName: user.first_name,
    lastName: user.last_name,
    phoneNumber: user.phone_number,
  };
  const {
    register,
    formState: { errors },
    watch,
    handleSubmit,
  } = useForm<IndividualProfileFormType>({
    resolver: zodResolver(individualProfileSchema),
    defaultValues: userData,
  });
  const formData = watch();
  const { user: authUser } = useAuth();
  const { handleOpenAlert } = useAlertContext();
  const isSameData = compareObjects(userData, formData);
  const { mutate, isLoading } = useMutation({
    mutationFn: updateUser,
    onSuccess() {
      handleOpenAlert({
        body: "Profile updated successfully",
        type: "success",
        title: "Success",
      });
      authUser.refetch();
    },
    onError() {
      handleOpenAlert({
        body: "An error occured",
        type: "error",
        title: "Error",
      });
    },
  });
  const { countries } = useCountries();
  const inputIcon = countries.isLoading ? (
    <Loader color="black" size={18} />
  ) : (
    <ArrowDown color="black" size={18} />
  );

  const onFormSubmit = (data: IndividualProfileFormType) => {
    if (isSameData.isSame) return;
    mutate(data);
  };

  return (
    <OverviewCard theme={"light"}>
      <div className={"lg:px-12"}>
        <EditAvatar />
        <form onSubmit={handleSubmit(onFormSubmit)} className={"space-y-6"}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <FormField
              error={errors.firstName?.message}
              label={"First name"}
              {...register("firstName")}
            />
            <FormField
              error={errors.lastName?.message}
              label={"Last name"}
              {...register("lastName")}
            />
            <FormField
              error={errors.email?.message}
              label={"Email address"}
              {...register("email")}
            />
            <FormSelectField
              error={errors.country?.message}
              icon={inputIcon}
              label={"Country"}
              key={`${countries.isSuccess}`}
              defaultValue={user.country}
              {...register("country")}
            >
              <option value="">--Select a country--</option>
              {countries.data?.map((c) => (
                <option key={c.code + c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </FormSelectField>
            <FormFieldset
              label={"Phone number"}
              errors={[errors.dialCode?.message, errors.phoneNumber?.message]}
            >
              <FormSelectField
                {...register("dialCode")}
                key={`${countries.isSuccess}`}
                className="w-3/12"
                icon={inputIcon}
                defaultValue={user.phone_dial_code}
              >
                <option value="">-- Select an option --</option>
                {countries.data?.map((c) => (
                  <option key={c.code + c.name} value={c.dial_code}>
                    {c.code} ({c.dial_code})
                  </option>
                ))}
              </FormSelectField>
              <FormField className="w-9/12" {...register("phoneNumber")} />
            </FormFieldset>
          </div>
          <div>
            <Button
              disabled={isSameData.isSame}
              loading={isLoading}
              size={"lg"}
              type={"submit"}
              className={"mx-auto w-full md:w-max md:px-12"}
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </OverviewCard>
  );
};

export default IndividualForm;
