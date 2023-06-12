import * as React from "react"
import Svg, { Path } from "react-native-svg"

const SvgComponent = (props) => (
  <Svg
    height="20"
    width="20"
    viewBox="0 0 512 512"
    xmlns="http://www.w3.org/2000/svg"
    className="svg-icon--custom svg-icon btn-icon"
    data-name="SvgIcon--CustomFacebook"
    {...props}
  >
    <Path
      d="M483.738 0h-455.5C12.641.008-.004 12.66 0 28.262v455.5C.008 499.359 12.66 512.004 28.262 512h455.476c15.606.004 28.258-12.645 28.262-28.25V28.238C511.992 12.641 499.34-.004 483.738 0zm0 0"
      fill="#4267b2"
    />
    <Path
      d="M353.5 512V314h66.75l10-77.5H353.5v-49.36c0-22.386 6.215-37.64 38.316-37.64H432.5V80.371c-7.078-.941-31.363-3.047-59.621-3.047-59 0-99.379 36-99.379 102.14V236.5H207V314h66.5v198zm0 0"
      fill="#fff"
    />
  </Svg>
)

export default SvgComponent
