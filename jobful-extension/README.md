# Chrome Companion Extension for Jobful.

## Getting started

The first step is to install necessary packages as usual:
- `npm install` in the local directory to get all the necessary packages.
    - Due to a [dependency problem](https://material-ui-pickers.dev/getting-started/installation), make sure you're getting v1.x version of @date-io adapters.
    - `npm i @date-io/date-fns@1.x date-fns` use this if it's not.

There are two ways to get the app up and running at this point:
- To run the app on the browser like a normal React app, run `npm start`
- To run the app as an extension:
    - Run `npm run build`. This converts code from the `src` folder into the `build` folder. The latter folder is what the Chrome browser will see.
    - Go to `chrome://extensions/` on your browswer and turn on Developer mode (upper right corner).
    - Click on Load Unpacked, and select the `build` folder we just created.
    - Chrome will complain that a Content Security Policy has been violated.
    - To fix this, head to `public/manifest.json`.
    - Add this line `"content_security_policy": "script-src 'self' 'YOUR SHA CODE'; object-src 'self'",`
        - Replace the SHA hash with the one in the Chrome error.
    - Build the extension and load it again. This time it will work.