import { FunctionComponent } from "react";

interface HomeProps {

}

const Home: FunctionComponent<HomeProps> = (props: HomeProps) => {
  return (
    <h1>
      This is the home page.
    </h1>
  )
}

export default Home;