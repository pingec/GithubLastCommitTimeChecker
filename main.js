var requestify = require('requestify');
var nodemailer = require('nodemailer');
var email = require('./emailConf');
var config = require('./config');

setInterval(check, config.checkInterval);
check();

function check() {

    requestify.get('https://api.github.com/repos' + config.gitHubRepoPath).then(function(response) {

        var jsonResp = response.getBody(); // Get the response body (JSON parsed - JSON response or jQuery object in case of XML response)

        if (jsonResp && jsonResp.pushed_at) {

            var lastCommitEpochTime = Date.parse(jsonResp.pushed_at);
            var nowEpochTime = Date.now();

            if (nowEpochTime - lastCommitEpochTime > config.expirationInterval) {
                console.log('Found stale repo: ' + config.gitHubRepoPath + ' ', new Date(nowEpochTime), new Date(lastCommitEpochTime));
                debugger;
                sendEmail('Github repo is stale: ' + config.gitHubRepoPath, config.gitHubRepoPath + ' is stale.' + '<br/>Time of check: ' + new Date(nowEpochTime) + '<br/>Last commit time:' + new Date(lastCommitEpochTime), [config.notifyEmail]);
            } else {
                console.log("ALL is fine. ", nowEpochTime, lastCommitEpochTime);
            }
        } else {
            console.log("Something went wrong, here is the raw response: ", response, response.body);
        }
    });
}


function sendEmail(subj, msg, receivers) {
    var transporter = nodemailer.createTransport({
        service: email.service,
        auth: {
            user: email.auth.user,
            pass: email.auth.pass
        }
    });
    var mailOptions = {
        from: email.From, // sender address
        to: receivers.join(','), // list of receivers
        subject: subj, // Subject line
        text: msg, // plaintext body
        html: msg // html body
    };
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Message sent: ' + info.response);
        }
    });
}