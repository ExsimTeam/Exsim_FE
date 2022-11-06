import { Button, Result } from "antd";
import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { lazyLoad } from "src/utils/lazyLoad";

const Home = lazy(() => import('src/pages/home'))
const Login = lazy(() => import('src/pages/login'))

const routes: RouteObject[] = [
  {
    path: '/',
    children: [
      {
        index: true,
        element: lazyLoad(<Home />)
      },
      {
        path: '/login',
        element: lazyLoad(<Login />)
      }
    ]
  },
  {
    path: '*',
    element: lazyLoad(
      <Result
        status="404"
        title="404"
        subTitle="您访问的页面不存在"
        extra={<Button
          type="primary"
          onClick={() => window.location.href = "/"}
        >返回首页</Button>}
      />
    )
  }
]

export default routes