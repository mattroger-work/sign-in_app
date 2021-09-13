* Instructions to start application:
    * Must have python and node installed on the computer
    * Open the cmd and cd into sign-in_app
    * Enter the command python start_server.py
    * It will ask you to enter you City, State which will be saved under json_files/location.json
    * It will begin downloading files and if it asks "Which package do you want to use" select "Not listed" and type "edge-js"
    * Search in the browser for localhost:3000 and give the application some time in order to load up the users, this will reset every 3 hours if the index page is accessed
    * If there is any error delete json_files, node_modules and visitor_tag folders and repeat the setup steps
    * It is better to keep the server running but to close it select the cmd and enter ctrl-c then Y
