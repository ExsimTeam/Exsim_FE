import { ReactNode } from "react";
import { RouteObject, useRoutes } from "react-router-dom";
import { getData } from "./storageUtils";

export interface AuthorizedRouteObject {
  element?: ReactNode,
  authority?: number,
  children?: AuthorizedRouteObject[],
  index?: boolean,
  path?: string
}

/**
 * 用于将AuthorizedRouteObject鉴权并转换为RouteObject的辅助递归函数
 * @param routesAuthorized 
 * @param unauthorized 
 * @returns 
 */
function getAuthorizedRoutes(routesAuthorized: AuthorizedRouteObject[], unauthorized: ReactNode) {
  let routes: RouteObject[] = routesAuthorized.map(value => {
    let { authority, children, element, path, index } = value;
    if (authority === undefined) {
      authority = 9999;
    }

    let permit = getData('permit');

    let p: number = 9999;
    if (permit !== null) {
      p = parseInt(permit);
    }

    return {
      element: p <= authority ? element : unauthorized,
      path: path,
      index: index,
      children: children === undefined ? undefined :
        getAuthorizedRoutes(children, unauthorized)
    } as RouteObject
  })

  return routes;
}

/**
 * 用于对路由进行鉴权
 * @param routesAuthorized 带鉴权的路由表
 * @param unauthorized 权限不足时指向的页面
 * @returns 鉴权后的路由
 */
export default function useAuthorizedRoutes(routesAuthorized: AuthorizedRouteObject[], unauthorized: ReactNode) {
  return useRoutes(getAuthorizedRoutes(routesAuthorized, unauthorized));
}