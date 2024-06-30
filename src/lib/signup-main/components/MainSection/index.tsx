import Container from "@common/components/Container";
import FormHeader from "@lib/auth-pages/components/FormHeader";
import { FC } from "react";
import OrganizationForm from "../OrganizationForm";

const MainSection: FC = () => {
  return (
    <Container className="space-y-4 py-12 h-full">
      <FormHeader
        title="Hello friend!"
        subTitle="Tell us more about your organization"
      />
      <OrganizationForm />
    </Container>
  );
};
export default MainSection;
