import { iconSizes } from "@common/constants/iconSizes"
import { IconProps } from "@common/typings"
import { FC } from "react"

const Sorting: FC<IconProps> = (props) => {
  const { color, size = 19, ...restProps } = props

  const iconSize = typeof size === "string" ? iconSizes[size] : size

  return (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      {...restProps}
    >
      <rect width="10" height="10" fill="url(#pattern0)" />
      <defs>
        <pattern
          id="pattern0"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use xlinkHref="#image0_89_377" transform="scale(0.0104167)" />
        </pattern>
        <image
          id="image0_89_377"
          width="96"
          height="96"
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAABOElEQVR4nO3ZQWoDMQxAUR2kXefsDYFcrC1NLuBuZlXK1Ktakt+DWQVjkIYk8CMAAAAA4NxrRNwi4nk894i4TA5tNH/+Zfgfv1z8eXz2l9UDGtUXcDu5/DpxfvWARvUFPE8uf0ycXz2g0XkBXxPnVw9oVF/A/eTyt4nzqwc0qi/gcvzg/rz4PSJeJs6vHtCovoA4/u1cj+/8x/Hmzww/EgxodFgAAACwn517wHK794Dldu8By+3eA5bbvQcst3sPWG73HpDCzj0AAABgic49IL3uPSC97j0gve49IL3uPSC97j0gve49oITOPQAAACClyj2gvOo9oLzqPaC86j2gvOo9oLzqPaC86j2ghco9AAAAoKTMPaC97D2gvew9oL3sPaC97D2gvew9oL3sPWALmXsAAAAAAERG3wiEMXh7aF+AAAAAAElFTkSuQmCC"
        />
      </defs>
    </svg>
  )
}

export default Sorting
