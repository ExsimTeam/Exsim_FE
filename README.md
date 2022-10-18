# The Web Front End of the Exsim Project

## Brief
This is the web front end of the Exsim project, written in React with TypeScript.

## Before Coding
***Don't push to branch `main` directly!***

Instead, create a new branch and use 'Pull Request' to merge on main. After the merging, you can simply delete the branch.

## Prerequisites
* Node.js

## Install & Build
### `npm install`
Install dependencies.

### `npm start`
Run the app in the development mode.\
A server will be open by default on [http://localhost:3000](http://localhost:3000). You can view it in the browser.

### `npm run build`
Build the app for production mode to the `build` folder.\
It will optimize the build for best performance.

## Folder Structure
```
/exsim
    README.md
    node_modules/
    package.json
    public/
        index.html
    src/
        index.tsx
        api/
        components/
        pages/
        res/
        utils/
```
* `node_modules/` Where the node modules are located.
* `public/` Where the static resouces are located. `index.html` is needed for webpack to build the project.
* `src/` Where our source code is located.
* `src/index.tsx` The entry point of the project.
* `src/api` Where the api classes are located.
* `src/components/` Where the public components are located.
* `src/pages/` Where the pages(pages that has a router) are located.
* `src/res/` Where resouces like images are located.
* `src/utils/` Where the utils are located. Such as utils to manage local storage.
* `src/common/` Where some other things like global constants are located.
