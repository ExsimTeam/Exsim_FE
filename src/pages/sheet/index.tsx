import { message } from "antd";
import { Component, useEffect } from "react";
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";
import { getFileBody, openFile } from "src/api/file";
import { color } from "src/common/constants";
import { isNumeric, toJSON, toName } from "src/common/utils";
import SheetNav from "src/component/SheetNav";
import SpreadSheet, { CellData } from "src/component/SpreadSheet";
import { Loading } from "src/utils/lazyLoad";

import "./index.scss";

interface SheetMainProps {
  sheetId: string | undefined,
  navigate: NavigateFunction
}

interface SheetMainState {
  isLoading: boolean,
  fileName: string,
  author: string,
  lastModify: string,
  curX: number,
  curY: number,
  collaborator: {
    author: string,
    x: number,
    y: number
  }[],
  ws: WebSocket | null,
  spin: boolean
}

class SheetMain extends Component<SheetMainProps, SheetMainState> {

  data: Array<Array<CellData>>;
  status: boolean[];
  sheet: SpreadSheet | null = null;
  utoken: string = ''
  fileId: number = 0

  constructor(props: any) {
    super(props);
    this.data = new Array(100);
    this.status = [];
    this.state = {
      isLoading: true,
      fileName: '',
      author: '',
      lastModify: '',
      curX: 1,
      curY: 1,
      collaborator: [],
      ws: null,
      spin: true
    }

    const sheetId = this.props.sheetId
    if (isNumeric(sheetId)) {
      this.fileId = parseInt(sheetId!)
      this.openWebsocket()
    } else {
      this.props.navigate('/')
    }
  }

  openWebsocket = () => {
    if (this.state.ws !== null && this.state.ws.readyState !== WebSocket.CLOSED) {
      return
    }
    // Get the utoken of file
    openFile(this.fileId)
      .then(response => {
        if (response.code === 1) {
          this.setState({
            fileName: response.data.fileName,
            author: response.data.author,
            lastModify: response.data.lastModify
          })

          this.utoken = response.data.utoken

          let ws = new WebSocket(`wss://exsim.idyh.xyz/api/edit?utoken=${this.utoken}`)

          ws.onopen = (e) => {
            console.log('WebSocket connection established')
            this.keepAlive()
          }

          ws.onmessage = (e) => {
            let data
            try {
              data = JSON.parse(e.data)
            } catch (error) {
              message.error('????????????')
            }
            console.log(data)

            if (data.code === 1) {
              switch (data.opcode) {
                case -1: {
                  // Server message
                  if (this.state.isLoading)
                    this.setState({
                      isLoading: false,
                      spin: false
                    })
                  break
                }
                case 0: {
                  // Modify a cell
                  let opt = toJSON(data.data, () => message.error('????????????'))
                  console.log(opt)
                  this.setData(opt.col, opt.row, { value: opt.value, format: opt.format }, true)
                  this.sheet?.setState({})
                  break
                }
                case 1: {

                  break;
                }
                case 2: {
                  break
                }
                case 3: {
                  break
                }
                case 4: {
                  const author = data.sender
                  const x = 1
                  const y = 1
                  this.setState(prev => {
                    let flag = false
                    let newList = prev.collaborator.map((value, index) => {
                      if (value.author === author) flag = true
                      return value.author === author ? {
                        author: value.author,
                        x: x,
                        y: y
                      } : value
                    })
                    if (!flag) newList.push({
                      author: author,
                      x: x,
                      y: y
                    })

                    return {
                      collaborator: newList
                    }
                  })
                  break
                }
                case 5: {
                  let opt = toJSON(data.data, () => message.error('????????????'))
                  const author = data.sender;
                  const x = opt.x;
                  const y = opt.y;
                  this.setState(prev => {
                    let flag = false
                    let newList = prev.collaborator.map((value, index) => {
                      if (value.author === author) flag = true
                      return value.author === author ? {
                        author: value.author,
                        x: x,
                        y: y
                      } : value
                    })
                    if (!flag) newList.push({
                      author: author,
                      x: x,
                      y: y
                    })

                    return {
                      collaborator: newList
                    }
                  })
                  break
                }
              }
            } else if (data.code === 400) {
              message.error('????????????')
            } else if (data.code === 401) {
              // message.error('??????????????????')
              // setTimeout(() => {
              //   this.props.navigate('/')
              // }, 1000)
            } else {
              message.error('????????????')
            }
          }

          ws.onclose = (e) => {
            this.cancelKeepAlive()
            console.log('WebSocket closed')
            console.log(e)
            this.setState({
              spin: true
            })
            this.openWebsocket()
          }

          ws.onerror = (e) => {
            this.cancelKeepAlive()
            message.error('????????????')
            this.openWebsocket()
          }

          this.setState({
            ws: ws
          })
        } else if (response.code === 100) {
          message.error('???????????????')
          setTimeout(() => {
            this.props.navigate('/')
          }, 1000)
        } else {
          message.error(response.code + ': ' + response.msg)
          setTimeout(() => {
            this.props.navigate('/')
          }, 1000)
        }
      })
  }

  timerId: any = null
  keepAlive = () => {
    console.log('alive')
    let timeout = 15000
    if (this.state.ws?.readyState === this.state.ws?.OPEN) {
      this.state.ws?.send(JSON.stringify({
        opcode: -1,
        data: {}
      }))
    }
    this.timerId = setTimeout(this.keepAlive, timeout)
  }

  cancelKeepAlive = () => {
    if (this.timerId)
      clearTimeout(this.timerId)
  }

  modifyCell = (sheetId: number, x: number, y: number, s: CellData) => {
    let data = JSON.stringify({
      opcode: 0,
      data: {
        sheetId: sheetId,
        row: y,
        col: x,
        value: s.value,
        format: s.format
      }
    })
    console.log(s.format)
    console.log(data)
    this.state.ws?.send(data)
  }

  setPos = (x: number, y: number) => {
    this.setState(prev => {
      if (!(x === prev.curX && y === prev.curY)) {
        const data = JSON.stringify({
          opcode: 5,
          data: {
            x: x,
            y: y
          }
        })
        this.state.ws?.send(data)
      }
      return {
        curX: x,
        curY: y
      }
    })

  }

  getData = (x: number, y: number) => {
    if (this.data[x - 1] !== undefined) {
      if (this.data[x - 1][y - 1] !== undefined) {
        return this.data[x - 1][y - 1];
      }
    }

    return null;
  }

  setData = (x: number, y: number, s: any, websocket = false) => {
    if (this.data[x - 1] === undefined) {
      this.data[x - 1] = [];
    }
    this.data[x - 1][y - 1] = s;
    if (!websocket) this.modifyCell(0, x, y, s)
  }

  // return if horizontal page of pageIndex is ready
  getStatus = (pageIndex: number) => {
    if (this.status[pageIndex] === undefined) {
      this.status[pageIndex] = false;

      // Request data here
      getFileBody(this.fileId, pageIndex, 0)
        .then(response => {
          if (response.code === 1) {
            this.status[pageIndex] = true
            const rows = response.data.rows

            // Read rows
            for (let i = 0; i < rows.length; i++) {
              let row = rows[i]
              let rowNum = row.row

              // Read columns
              for (let key in row) {
                if (isNumeric(key)) {
                  let colNum = parseInt(key)
                  let v = row[key]

                  // Try to parse format into JSON
                  let format = toJSON(v.format, () => message.warn(`?????????${toName(colNum)}${rowNum}????????????`))
                  this.setData(colNum, rowNum, {
                    value: v.value,
                    format: format ? format : {}
                  }, true)
                }
              }
            }

            this.sheet?.setState({})
          } else {
            message.error('??????????????????')
          }
        })
    }
    return this.status[pageIndex];
  }

  render() {
    const { isLoading, fileName, lastModify, author, spin } = this.state
    return isLoading ? <Loading /> :
      <div className="sheet-container">
        <SheetNav fileName={fileName} createdTime={lastModify} author={author} loading={spin} />

        <div className="sheet-input">
          <span style={{ fontWeight: 'bold' }}>
            {toName(this.state.curX) + this.state.curY}
          </span>
          <span style={{ flex: 1, textAlign: 'left' }}>
            {this.getData(this.state.curX, this.state.curY)?.value}
          </span>
        </div>

        <div className="sheet-spreadsheet">
          <SpreadSheet
            ref={v => this.sheet = v}
            getData={this.getData}
            setData={this.setData}
            setPos={this.setPos}
            getStatus={this.getStatus}
            preloadHorizontalNum={1}
            preloadVerticalNum={1}
            collaborator={this.state.collaborator}
          />
        </div>
        <div className="collaborators">
          <span style={{ color: '#8c8c8c' }}>???????????????</span>
          {
            this.state.collaborator.map((value, index) => {
              return <span style={{ color: color[index % color.length] }}>
                {value.author}
              </span>
            })
          }
        </div>
      </div>

  }
}


const Sheet = () => {
  const { sheetId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (sheetId === undefined) navigate('/')
  })

  return sheetId === undefined ? <></> : <SheetMain sheetId={sheetId} navigate={navigate} />
}

export default Sheet;