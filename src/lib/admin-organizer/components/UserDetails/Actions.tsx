import { FC } from "react";
import styles from "./styles.module.css";
import ButtonLink from "@common/components/ButtonLink";
import Button from "@common/components/Button";
import useOrganizer from "@lib/admin-organizer/hooks/useOrganizer";
import { useMutation } from "@tanstack/react-query";
import { updateOrganizerSettings } from "@lib/admin-organizer/helpers/updateOrganizerSettings";
import useAlertContext from "@common/hooks/useAlertContext";
import { errorParser } from "@common/utils/errorParser";
import useEditOrganizerContext from "@lib/admin-organizer/hooks/useEditOrganizerContext";
import { useRouter } from "next/router";

const Actions: FC = () => {
  const { refetch } = useOrganizer();
  const { query } = useRouter();
  const { notEdited, organizerEdit } = useEditOrganizerContext();
  const { handleOpenAlert } = useAlertContext();
  const { mutate, isLoading } = useMutation({
    mutationFn: updateOrganizerSettings,
    onSuccess() {
      handleOpenAlert({
        body: "Updated successfully",
        title: "Success",
        type: "success",
      });
      refetch();
    },
    onError(err) {
      handleOpenAlert({
        body: errorParser(err),
        title: "Error",
        type: "error",
      });
    },
  });

  const save = () => {
    const userId = query?.id as string;
    if (!userId) return;

    mutate({
      id: userId,
      ...organizerEdit,
    });
  };

  return (
    <div className={styles.actions}>
      <ButtonLink href="/admin/event-organizers" variant="outline">
        Back
      </ButtonLink>
      <Button
        onClick={save}
        loading={isLoading}
        disabled={isLoading || notEdited}
      >
        Save settings
      </Button>
    </div>
  );
};

export default Actions;
