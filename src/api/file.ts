import { useAxios } from "src/utils/hooks/useAxios"
import service from "src/utils/service"

export interface FileInfo {
  fileName: string,
  id: number,
  authorUsername: string,
  authorUserId: number,
  property: number,
  createdTime: string,
  lastModifyTime: string
}

export const useFileList = () => {

  return useAxios<{
  }, {
    files: FileInfo[]
  }>({
    method: 'GET',
    url: 'file/getFileList'
  })
}

export const useNewFile = () => {
  return useAxios<{
    fileName: string,
    property: number,
    description?: string
  }, {}>({
    method: 'POST',
    url: 'file/newFile'
  })
}

export const useDeleteFile = () => {
  return useAxios<{
    fileId: number
  }, {}>({
    method: 'POST',
    url: 'file/deleteFile'
  })
}

export const useShareFile = () => {
  return useAxios<{
    shareToEmail: string,
    permission: number,
    fileId: number
  }, {
    username: string
  }>({
    method: 'POST',
    url: 'file/shareFile'
  })
}

export const openFile = (fileId: number) => {
  return service({
    method: 'GET',
    url: 'file/openFile',
    params: {
      fileId: fileId
    }
  })
    .then(response => {
      return response as unknown as {
        code: number,
        msg: string,
        data: {
          utoken: string,
          fileInfoVo: {
            info: number,
            sheetNum: number,
            sheets: any,
            sheetPtr: number
          },
          fileName: string,
          author: string,
          lastModify: string
        }
      }
    })
}

export const getFileBody = (fileId: number, page: number, sheetId: number) => {
  return service({
    method: 'GET',
    url: 'file/getFileBody',
    params: {
      fileId: fileId,
      page: page,
      sheetId: sheetId
    }
  })
    .then(response => {
      return response as unknown as {
        code: number,
        msg: string,
        data: {
          rows: any[]
        }
      }
    })
}