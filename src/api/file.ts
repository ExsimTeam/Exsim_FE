import { useAxios } from "src/utils/hooks/useAxios"

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