
GithubLastCommitTimeChecker
============

Monitors a specified repository's last commit time and sends and alert email if time of last commit is older than allowed.


1. Create config.js with your settings. For example:

    ```js
    var config = {
        checkInterval : 60 * 60 * 1000,              //how often to check github in milliseconds
        expirationInterval : 2 * 60 * 60 * 1000,    //the allowed maximum time-window since last commit before triggering alerts (when nowTime - lastCommitTime is greater than expirationInterval)
        gitHubRepoPath : '/JohnSmith/MyRepository',
        notifyEmail: 'someone@gmail.com'
    };
    module.exports = config;
    ```    

2. Create emailConf.js with following settings:

    ```js
    //nodemailer settings
    module.exports = {
        service : 'Gmail',
        auth : {
            user: 'john.smith@gmail.com',
            pass: 'johnsmithspassword'
        },
        from: 'John Smith Automation <john.smith@gmail.com>'
    };
    ```

3. Run 'node main.js'