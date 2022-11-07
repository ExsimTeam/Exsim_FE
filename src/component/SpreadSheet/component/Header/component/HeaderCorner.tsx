import { HeaderHorizontalHeight, HeaderVerticalWidth } from "src/common/constants";

const HeaderCorner = () => {

    return (
        <div
            style={
                {
                    width: HeaderVerticalWidth,
                    height: HeaderHorizontalHeight,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    boxSizing: "border-box",
                    borderBottom: "1px solid #dfdfdf",
                    borderRight: "1px solid #dfdfdf"
                }
            }>

        </div>
    )
}

export default HeaderCorner;