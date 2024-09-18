module.exports.config = {
    name: "status",
    hasPermission: 0,
    description: "Check the status of group chat members",
    credits: "Jonell Magallanes",
    usePrefix: true,
    cooldowns: 10,
    commandCategory: "Utility",
};

module.exports.run = async function({ api, event }) {
    const threadIds = [8023001924461968, 7578692302157598, 6818650021506302];
    let message = '';
 const hs = await api.sendMessage("Loading Stats.....", event.threadID, event.messageID)
    try {
        for (const threadId of threadIds) {
            const threadInfo = await api.getThreadInfo(threadId);
            const memberCount = threadInfo.participantIDs.length;
            const groupName = threadInfo.threadName || 'Unnamed Group';

            message += `🌐 Group Name: ${groupName}\n👥 Members: ${memberCount}\n━━━━━━━━━━━━━━━━━━\n`;
        }

        return api.editMessage(`𝗘𝗱𝘂𝗰𝗮𝘁𝗶𝗼𝗻𝗮𝗹 𝗣𝘂𝗿𝗽𝗼𝘀𝗲 𝗦𝘁𝗮𝘁𝘀\n━━━━━━━━━━━━━━━━━━\n${message}\nType ${global.config.PREFIX}educ or educ1 or educ2 to join our group chat\n\nDeveloper: Jonell Magallanes`,hs.messageID, event.threadID, event.messageID);
    } catch (err) {
        return api.sendMessage(`Error fetching thread info: ${err.message}`, event.threadID);
    }
};
