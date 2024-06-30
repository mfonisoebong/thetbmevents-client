import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { FeaturesFormType } from "@lib/admin-features/utils/featuresSchema";
import FeatureForm from "@lib/admin-features/components/Features/FeatureForm";

const Features: FC = () => {
  const { watch } = useFormContext<FeaturesFormType>();
  const features = watch("features");
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {features.map((_, index) => (
        <FeatureForm index={index} key={index.toString()} />
      ))}
    </div>
  );
};

export default Features;
