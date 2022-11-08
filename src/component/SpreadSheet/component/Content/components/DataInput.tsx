import React from "react";
import { CellHeight, CellWidth } from "src/common/constants";
import { CellData } from "src/component/SpreadSheet";

interface IDataInputProp {
    getData: Function,
    setData: Function,
    rowIndex: number,
    columnIndex: number,
    initialValue: CellData | undefined,

    submit: Function
}

interface IDataInputState {
    value: CellData
}

class DataInput extends React.Component<IDataInputProp, IDataInputState> {
    inputRef: React.RefObject<HTMLInputElement>;
    isSubmit = true;

    constructor(props: IDataInputProp) {
        super(props);
        const cellData = props.getData(props.columnIndex, props.rowIndex)
        this.state = {
            value: this.props.initialValue === undefined ? (cellData === null ? { value: '', format: {} } : cellData) : this.props.initialValue
        }
        this.inputRef = React.createRef();
    }

    componentDidMount = () => {
        this.inputRef.current!.focus();
    }

    componentDidUpdate = () => {
        this.inputRef.current!.focus();
    }

    componentWillUnmount = () => {
        if (this.isSubmit)
            this.props.setData(this.props.columnIndex, this.props.rowIndex, this.state.value);
    }

    handleChange = (e: any) => {
        this.setState(prev => ({
            value: {
                value: e.target.value,
                format: prev.value.format
            }
        }))
    }

    handleBlur = () => {
        this.props.submit("Escape");
    }

    handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === "Tab"
            || e.key === "ArrowDown" || e.key === "ArrowUp") {
            this.props.submit(e.key);
        } else if (e.key === "Escape") {
            this.isSubmit = false;
            this.props.submit(e.key);
        }
    }

    render() {

        const { rowIndex, columnIndex } = this.props;

        return (
            <div
                style={{
                    position: "absolute",
                    left: (columnIndex - 1) * CellWidth,
                    top: (rowIndex - 1) * CellHeight,
                    width: CellWidth - 1,
                    height: CellHeight - 1,
                    backgroundColor: "rgb(240, 240, 240)"
                }}
            >

                <input type={"text"}
                    ref={this.inputRef}
                    style={{
                        height: "100%",
                        width: CellWidth - 3,
                        padding: 0,
                        paddingLeft: 2,
                        lineHeight: CellHeight - 1,
                        background: "none",
                        outline: "none",
                        border: "none"
                    }}
                    value={this.state.value.value}
                    onChange={this.handleChange}
                    onKeyDown={this.handleKeyDown}
                    onBlur={this.handleBlur}
                />
            </div>
        )
    }
}

export default DataInput;