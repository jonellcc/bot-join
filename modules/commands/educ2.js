module.exports.config = {
    name: "educ2",
    hasPermission: 0,
    description: "Join the group chat",
    credits: "Jonell Magallanes",
    usePrefix: true,
    cooldowns: 10,
    commandCategory: "Utility",
};

module.exports.handleReply = function({ api, event, handleReply }) {
    if (event.senderID !== handleReply.senderID) {
        return;
    }

    const userResponse = event.body.trim().toLowerCase();
    const tid = handleReply.threadID;

    if (userResponse === "yes") {
        try {
            api.getThreadInfo(tid, (err, info) => {
                if (err) {
                    console.error('Error fetching thread info:', err);
                    api.sendMessage('There was an error processing your request. Please try again later.', event.threadID, event.messageID);
                    return;
                }

                if (info.participantIDs.includes(handleReply.senderID)) {
                    api.sendMessage(`You are already a member of the group "${info.threadName}".`, event.threadID, event.messageID);
                } else {
                    api.addUserToGroup(handleReply.senderID, tid, (err) => {
                        if (err) {
                            console.error('Error adding user to group:', err);
                            api.sendMessage('There was an error adding you to the group. Please try again later.', event.threadID, event.messageID);
                        } else {
                            api.sendMessage('You have been successfully added to the group check your message request or spam message', event.threadID, event.messageID);
                        }
                    });
                }
            });
        } catch (error) {
            console.error('Error processing request:', error);
            api.sendMessage('There was an error processing your request. Please try again later.', event.threadID, event.messageID);
        }
    } else if (userResponse === "no") {
        api.sendMessage('You have chosen not to join the group.', event.threadID, event.messageID);
    } else {
        api.sendMessage('Invalid response. Please reply with "yes" or "no".', event.threadID, event.messageID);
    }
};

module.exports.run = function({ api, event }) {
    const senderID = event.senderID;
    const tid = "6818650021506302";

    api.getThreadInfo(tid, (err, info) => {
        if (err) {
            console.error('Error fetching thread info:', err);
            api.sendMessage('There was an error fetching group information. Please try again later.', event.threadID);
            return;
        }

        if (info.participantIDs.includes(senderID)) {
            api.sendMessage(`You are already a member of the group "${info.threadName}".`, event.threadID);
        } else {
            api.sendMessage(`Do you want to join the group chat with ${info.threadName} ? Reply with "yes" to confirm or "no" to cancel.`, event.threadID, (err, info) => {
                if (err) {
                    console.error('Error sending confirmation message:', err);
                    return;
                }
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
