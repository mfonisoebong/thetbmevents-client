import Input from "@common/components/FormControls/Input"
import Select from "@common/components/FormControls/Select"
import Location from "@common/components/Icons/Location"
import Sorting from "@common/components/Icons/Sorting"
import { ChangeEvent, FC } from "react"
import styles from "../styles.module.css"
import { useRouter } from "next/router"
import useCountries from "@common/hooks/useCountries"
import useCategories from "@lib/events/hooks/useCategories"
import { capitalizeFirstLetter } from "@common/utils/capitalizeFirstLetter"
import Loader from "@common/components/Icons/Loader"

const FilterOptions: FC = () => {
  const router = useRouter()
  const { data: categories } = useCategories()

  const { countries, changeCountryCode, states } = useCountries()
  const onInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    queryKey: string
  ) => {
    router.push(
      {
        query: {
          [queryKey]: e.target.value.trim(),
        },
      },
      undefined,
      {
        scroll: false,
        shallow: true,
      }
    )
  }

  const onCountryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onInputChange(e, "location")
    const country = countries.data?.find((c) => c.name === e.target.value)

    if (country) {
      changeCountryCode(country?.code)
    }
  }

  const stateInputIcon = states.isLoading ? (
    <Loader color="black" size={17} />
  ) : (
    <Location className="fill-slate-900" size={17} />
  )

  return (
    <div className={styles.filteroptions}>
      <Select
        onChange={onCountryChange}
        icon={<Location className="fill-slate-900" size={17} />}
      >
        {countries.data?.map((c) => (
          <option key={c.dial_code + c.name} value={c.name}>
            {c.name}
          </option>
        ))}
      </Select>
      <Select
        onChange={(e) => onInputChange(e, "location")}
        icon={stateInputIcon}
      >
        <option value="">States/cities</option>
        {states.data?.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </Select>
      <Input
        type="date"
        onChange={(e) => onInputChange(e, "date")}
        placeholder="DD/MM/YY"
        className="w-max"
      />
      <Select
        defaultValue="1"
        onChange={(e) => onInputChange(e, "category")}
        icon={<Sorting className="fill-slate-900" size={17} />}
      >
        <option disabled>Categories</option>
        <option value="">--Select--</option>
        {categories?.map((c) => (
          <option key={c.id} value={c.category}>
            {capitalizeFirstLetter(c.category)}
          </option>
        ))}
      </Select>
    </div>
  )
}

export default FilterOptions
