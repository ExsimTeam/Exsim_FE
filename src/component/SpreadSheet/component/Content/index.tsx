import React from 'react';
import { CellHeight, CellWidth, color, DirectionType, PageHeight, PageWidth } from 'src/common/constants';
import PlaceHolder from '../PlaceHolder';
import DataInput from './components/DataInput';
import HorizontalPageContainer from './components/HorizontalPageContainer';
import Selection from './components/Selection';

interface IContentProp {
    contentRef: React.RefObject<HTMLDivElement>,

    currentHorizontalIndex: number,
    currentVerticalIndex: number,
    preloadHorizontalNum: number,
    preloadVerticalNum: number,

    onScroll: React.UIEventHandler<HTMLDivElement>,

    getData: Function,
    setData: Function,
    getStatus: Function,

    changeSelection: Function,

    selectedTop: number,
    selectedBottom: number,
    selectedLeft: number,
    selectedRight: number

    collaborator: {
        author: string,
        x: number,
        y: number
    }[],
}

interface IContentState {
    isInputing: boolean,
    inputRowIndex: number,
    inputColumnIndex: number
}


class Content extends React.Component<IContentProp, IContentState> {
    inputInitialValue: any = undefined;

    constructor(props: IContentProp) {
        super(props);
        this.state = {
            isInputing: false,
            inputColumnIndex: 1,
            inputRowIndex: 1
        }
    }

    componentDidMount = () => {
        document.addEventListener("keypress", this.onKeyPress);
        document.addEventListener("keydown", this.onKeyDown);
        this.inputInitialValue = undefined;
    }

    componentDidUpdate = () => {
        this.inputInitialValue = undefined;
    }

    componentWillUnmount = () => {
        document.removeEventListener("keydown", this.onKeyDown);
        document.removeEventListener("keypress", this.onKeyPress);
        window.removeEventListener("mousemove", this.onMouseMove);
        window.removeEventListener("mouseup", this.onMouseUp);
    }

    handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        this.setState({
            isInputing: false
        })

        const content = this.props.contentRef.current!;

        const x = Math.floor((e.clientX - content.getBoundingClientRect().x + content.scrollLeft) / CellWidth) + 1;
        const y = Math.floor((e.clientY - content.getBoundingClientRect().y + content.scrollTop) / CellHeight) + 1;
        this.props.changeSelection(y, y, x, x);

        window.addEventListener("mousemove", this.onMouseMove);
        window.addEventListener("mouseup", this.onMouseUp);
    }

    onMouseUp = (e: MouseEvent) => {
        e.preventDefault();

        window.removeEventListener("mousemove", this.onMouseMove);
        window.removeEventListener("mouseup", this.onMouseUp);
    }

    onMouseMove = (e: MouseEvent) => {
        e.preventDefault();

        this.setState({
            isInputing: false
        })

        const content = this.props.contentRef.current!;

        const x = Math.floor((e.clientX - content.getBoundingClientRect().x + content.scrollLeft) / CellWidth) + 1;
        const y = Math.floor((e.clientY - content.getBoundingClientRect().y + content.scrollTop) / CellHeight) + 1;
        this.props.changeSelection(this.props.selectedTop, y, this.props.selectedLeft, x);
    }

    handleDoubleClick = (e: React.MouseEvent) => {
        this.setState((prev) => ({
            isInputing: !prev.isInputing
        }));

        const content = this.props.contentRef.current!;

        const x = Math.floor((e.clientX - content.getBoundingClientRect().x + content.scrollLeft) / CellWidth) + 1;
        const y = Math.floor((e.clientY - content.getBoundingClientRect().y + content.scrollTop) / CellHeight) + 1;
        this.setState({
            inputColumnIndex: x,
            inputRowIndex: y
        })
    }

    handleInputSubmit = (key: string) => {

        if (key === "Enter" || key === "ArrowDown") {
            this.setState((prev) => ({
                isInputing: false
            }));
        } else if (key === "Tab") {
            this.setState((prev) => ({
                isInputing: false
            }));
        } else if (key === "Escape") {
            this.setState((prev) => ({
                isInputing: false
            }));
        } else if (key === "ArrowUp") {
            this.setState((prev) => ({
                isInputing: false
            }));
        }
    }

    onKeyDown = (e: KeyboardEvent) => {

        if (this.state.isInputing) return;
        const { selectedTop, selectedLeft } = this.props;

        if (e.key === "Enter" || e.key === "ArrowDown") {
            e.preventDefault();
            this.props.changeSelection(selectedTop + 1, selectedTop + 1, selectedLeft, selectedLeft);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            this.props.changeSelection(selectedTop - 1, selectedTop - 1, selectedLeft, selectedLeft);
        } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            this.props.changeSelection(selectedTop, selectedTop, selectedLeft - 1, selectedLeft - 1);
        } else if (e.key === "Tab" || e.key === "ArrowRight") {
            e.preventDefault();
            this.props.changeSelection(selectedTop, selectedTop, selectedLeft + 1, selectedLeft + 1);
        } else if (e.key === "Escape") {
            e.preventDefault();
        }
    }

    onKeyPress = (e: KeyboardEvent) => {
        if (this.state.isInputing) return;

        e.preventDefault();

        const { selectedTop, selectedLeft } = this.props;

        this.inputInitialValue = e.key;
        this.setState({
            inputRowIndex: this.props.selectedTop,
            inputColumnIndex: this.props.selectedLeft,
            isInputing: true
        });
        this.props.changeSelection(selectedTop, selectedTop, selectedLeft, selectedLeft);
    }

    render() {
        const { currentVerticalIndex, preloadVerticalNum, currentHorizontalIndex, preloadHorizontalNum } = this.props;
        // ?????????????????????page??????
        const PHVerticalPageNum = currentVerticalIndex - preloadVerticalNum - 1 > 0 ?
            currentVerticalIndex - preloadVerticalNum - 1 : 0;
        // ????????????page??????
        const startVerticalPage = currentVerticalIndex - preloadVerticalNum > 0 ?
            currentVerticalIndex - preloadVerticalNum : 1;
        // ????????????page??????
        const endVerticalPage = currentVerticalIndex + preloadVerticalNum;
        // ????????????page??????
        const endHorizontalPage = currentHorizontalIndex + preloadHorizontalNum;

        let pageRows = [];
        for (let i = startVerticalPage; i <= endVerticalPage; i++) {
            pageRows.push(
                <HorizontalPageContainer
                    key={i}
                    verticalPageIndex={i}
                    currentHorizontalIndex={currentHorizontalIndex}
                    preloadHorizontalNum={preloadHorizontalNum}
                    getData={this.props.getData}
                    isReady={this.props.getStatus(i)}
                />
            );
        }

        return (
            <div
                ref={this.props.contentRef}
                style={{
                    height: "100%",
                    width: "100%",
                    overflow: "scroll",
                    position: "relative"
                }}
                onScroll={this.props.onScroll}
            >
                <div
                    style={{
                        height: endVerticalPage * PageHeight,
                        width: endHorizontalPage * PageWidth
                    }}
                    onMouseDown={this.handleMouseDown}
                    onDoubleClick={this.handleDoubleClick}
                >

                    <PlaceHolder type={DirectionType.VERTICAL} pageNum={PHVerticalPageNum} />

                    {pageRows}




                    {
                        this.props.collaborator.map((value, index) => {
                            return <div
                                key={index}
                                style={{
                                    position: 'absolute',
                                    top: (value.y - 1) * CellHeight - 2,
                                    left: (value.x - 1) * CellWidth - 2,
                                    padding: 1,
                                    border: "2px solid " + color[index % color.length],
                                    height: CellHeight - 3,
                                    width: CellWidth - 3
                                }}
                            >
                                <span
                                    style={{
                                        backgroundColor: color[index % color.length],
                                        fontSize: 10,
                                        lineHeight: '14px',
                                        padding: '1px 5px',
                                        position: 'absolute',
                                        top: value.y === 1 ? CellHeight : -16,
                                        left: -2,
                                        zIndex: 9999
                                    }}
                                >
                                    {value.author}
                                </span>
                            </div>
                        })
                    }

                    <Selection
                        selectedTop={this.props.selectedTop}
                        selectedBottom={this.props.selectedBottom}
                        selectedLeft={this.props.selectedLeft}
                        selectedRight={this.props.selectedRight}
                    />

                </div>
                {
                    this.state.isInputing ?
                        <DataInput
                            getData={this.props.getData}
                            setData={this.props.setData}
                            rowIndex={this.state.inputRowIndex}
                            columnIndex={this.state.inputColumnIndex}
                            submit={this.handleInputSubmit}
                            initialValue={this.inputInitialValue}
                        />
                        : ''
                }
            </div>
        )
    }
}

export default Content;