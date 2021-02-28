# MMM-NextCloud-Tasks

This is a module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/).

This module loads a ToDo list via webDav from the NextCloud Tasks app using the "private link" and [NextCloud App Password](https://docs.nextcloudpi.com/en/two-factor-authentication-for-nextcloud/)

current development status: **work in progress**

![Small Screenshot](/assets/small_screenshot.png?raw=true)

## Dependencies

- Working NextCloud installation
- Installed Tasks app

## NextCloud preparations

- Create new App Password following this [Guide](https://docs.nextcloudpi.com/en/two-factor-authentication-for-nextcloud/)
- Create the Private Link to the ToDo list you want to display like this:
![Tasks Screenshot](/assets/generate_private_link.png?raw=true)

## Installing the module

1. run `git clone https://github.com/SoulOfNoob/MMM-NextCloud-Tasks.git` inside `MagicMirror/modules` directory.
2. run `npm install` to install dependencies. (This could take several minutes because of the WebDav module)

## Using the module

To use this module, add the following configuration block to the modules array in the `config/config.js` file:

```js
var config = {
    modules: [
        {
            module: 'MMM-NextCloud-Tasks',
            config: {
                // See 'Configuration options' for more information.
                updateInterval: 60000,
                listUrl: "<NEXTCLOUD_TASKS_PRIVATE_LINK>",
                hideCompletedTasks: true,
                webDavAuth: {
                    username: "<NEXTCLOUD_APP_USERNAME>",
                    password: "<NEXTCLOUD_APP_PASSWORD>",
                }
            }
        }
    ]
}
```

## Configuration options

| Option               | Description
|----------------------|-----------
| `listUrl`            | *Required* "Private Link" url from your desired NextCloud task-list
| `webDavAuth`         | *Required* WebDav Authentication object consisting of username and password. <br> Example: `{username: "<NEXTCLOUD_APP_USERNAME>", password: "<NEXTCLOUD_APP_PASSWORD>",}`
| `updateInterval`     | *Optional* How often should the data be refreshed (in milliseconds)
| `hideCompletedTasks` | *Optional* should completed tasks show up or not

## Screenshots

![Module Screenshot](/assets/demo_screenshot.png?raw=true)
