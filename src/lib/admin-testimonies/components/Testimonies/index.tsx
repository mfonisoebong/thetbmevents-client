import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { TestimoniesFormType } from "@lib/admin-testimonies/utils/testimoniesSchema";
import TestimonyForm from "@lib/admin-testimonies/components/Testimonies/TestimonyForm";

const Testimonies: FC = () => {
  const { watch } = useFormContext<TestimoniesFormType>();
  const testimonies = watch("testimonies");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
      {testimonies.map((t, index) => (
        <TestimonyForm index={index} key={index.toString()} />
      ))}
    </div>
  );
};

export default Testimonies;
