/*
   Created by eoswebnetbp1
*/
'use strict';

const slack = require('slack');

function slackAppender(config) {
  return (loggingEvent) => {
    console.error('\x1b[33m%s\x1b[0m', loggingEvent);
    const data = {
      token: config.token,
      channel: config.channel_id,
      text: `[${new Date()}] ${loggingEvent}`,
      icon_url: config.icon_url,
      username: config.username
    };

    slack.chat.postMessage(data, (err) => {
      if (err) {
        console.error('SLACK - Error sending log to slack: ', err);
      }
    });
  };
}

function configure(config) {
  return slackAppender(config);
}

module.exports.configure = configure;