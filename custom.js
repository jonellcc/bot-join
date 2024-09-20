const cron = require('node-cron');
const axios = require("axios");
//auto accept function hshs 
const autoAcceptFriendRequests = async (api) => {
  const form = {
    av: api.getCurrentUserID(),
    fb_api_req_friendly_name: "FriendingCometFriendRequestsRootQueryRelayPreloader",
    fb_api_caller_class: "RelayModern",
    doc_id: "4499164963466303",
    variables: JSON.stringify({ input: { scale: 3 } })
  };

  try {
    const listRequest = JSON.parse(await api.httpPost("https://www.facebook.com/api/graphql/", form)).data.viewer.friending_possibilities.edges;

    const success = [];
    const failed = [];

    for (const user of listRequest) {
      const acceptForm = {
        av: api.getCurrentUserID(),
        fb_api_caller_class: "RelayModern",
        fb_api_req_friendly_name: "FriendingCometFriendRequestConfirmMutation",
        doc_id: "3147613905362928",
        variables: JSON.stringify({
          input: {
            source: "friends_tab",
            actor_id: api.getCurrentUserID(),
            friend_requester_id: user.node.id,
            client_mutation_id: Math.round(Math.random() * 19).toString()
          },
          scale: 3,
          refresh_num: 0
        })
      };

      try {
        await api.httpPost("https://www.facebook.com/api/graphql/", acceptForm);
        success.push(user.node.name);
      } catch (err) {
        failed.push(user.node.name);
      }
    }

    if (success.length > 0) {
      console.log(`Auto-accepted friend requests:\n${success.join("\n")}`);
    }
    if (failed.length > 0) {
      console.log(`Failed to accept friend requests:\n${failed.join("\n")}`);
    }
  } catch (err) {
    console.log(`Error fetching friend requests: ${err.message}`);
  }
};

module.exports = async ({ api }) => {
  cron.schedule('*/5 * * * * *', () => {
    autoAcceptFriendRequests(api);
  }, {
    scheduled: true,
    timezone: "Asia/Manila"
  });

  cron.schedule(`*/40 * * * *`, () => {
    api.getThreadList(20, null, ['INBOX']).then((list) => {
      list.forEach((thread) => {
        if (thread.isGroup) {
          console.log(`Restarting bot in thread: ${thread.threadID}`);
        }
      });
      console.log('Start rebooting the system!');
      process.exit(1);
    }).catch((error) => {
      console.log(`Error getting thread list for restart: ${error}`);
    });
  });
};
