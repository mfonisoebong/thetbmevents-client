import { FC } from "react";
import styles from "../styles.module.css";
import IconButton from "@common/components/IconButton";
import Filter from "@common/components/Icons/Filter";
import Options from "@lib/admin-dashboard/components/Select/Options";
import { SORT_FILTERS } from "@lib/admin-users/constants/filters";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import useToggle from "@common/hooks/useToggle";
const SortFilterSm: FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedOption = searchParams.get("sort") ?? undefined;
  const { toggle, handleToggle } = useToggle();
  const onSelect = async (option: string) => {
    try {
      await router.push({
        query: {
          ...router.query,
          sort: option,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.sortfiltersm}>
      <IconButton onClick={handleToggle} icon={<Filter color={"black"} />} />
      {toggle && (
        <div className={styles.sortfiltersmoptions}>
          <Options
            options={SORT_FILTERS}
            selectedOption={selectedOption}
            onSelect={onSelect}
          />
        </div>
      )}
    </div>
  );
};

export default SortFilterSm;
