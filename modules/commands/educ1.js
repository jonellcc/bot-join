module.exports.config = {
    name: "educ1",
    hasPermission: 0,
    description: "Join the group chat",
    credits: "Jonell Magallanes",
    usePrefix: true,
    cooldowns: 10,
    commandCategory: "Utility",
};

module.exports.handleReply = function({ api, event, handleReply }) {
    if (event.senderID !== handleReply.senderID) return;

    const userResponse = event.body.trim().toLowerCase();
    const tid = handleReply.threadID;

    if (userResponse === "yes") {
        api.getThreadInfo(tid, (err, info) => {
            if (err) {
                api.sendMessage('Error processing your request. Try again later.', event.threadID, event.messageID);
                return;
            }

            if (info.participantIDs.includes(handleReply.senderID)) {
                api.sendMessage(`You are already a member of the group "${info.threadName}".`, event.threadID, event.messageID);
            } else {
                api.addUserToGroup(handleReply.senderID, tid, (err) => {
                    if (err) {
                        api.sendMessage('Error adding you to the group. Try again later.', event.threadID, event.messageID);
                    } else {
                        api.sendMessage('You have been added to the group. Check your message requests.', event.threadID, event.messageID);
                    }
                });
            }
        });
    } else if (userResponse === "no") {
        api.sendMessage('You have chosen not to join the group.', event.threadID, event.messageID);
    } else {
        api.sendMessage('Invalid response. Reply with "yes" or "no".', event.threadID, event.messageID);
    }
};

module.exports.run = function({ api, event }) {
    const senderID = event.senderID;
    const tid = "8023001924461968";

    api.getThreadInfo(tid, (err, info) => {
        if (err) {
            api.sendMessage('Error fetching group info. Try again later.', event.threadID);
            return;
        }

        if (info.participantIDs.includes(senderID)) {
            api.sendMessage(`You are already a member of the group "${info.threadName}".`, event.threadID);
        } else {
            api.sendMessage(`Do you want to join the group "${info.threadName}"? Reply with "yes" to confirm or "no" to cancel.`, event.threadID, (err, info) => {
                if (err) return;

                global.client.handleReply.push({
                    name: module.exports.config.name,
                    messageID: info.messageID,
                    senderID: senderID,
                    threadID: tid
                });
            });
        }
    });
};
