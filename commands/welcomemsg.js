const
  Command = require('../classes/Command'),
  Server = require('../classes/Server'),
  channelNames = require('../channel-names');

const failure = (err, args) => {
  console.error(err);
  args.channel.send(`A message to ${Server.mention(Server.findChannel(channelNames.WELCOME))} failed to send. (HTTP ${err.statusCode})\n${Server.mentionOwner(args.authorID)} should see what caused the issue in the logs.`);
};

module.exports = new Command({
  name: 'welcomemsg',
  help: () => `Sends the welcome message to the ${Server.mention(Server.findChannel(channelNames.WELCOME))} channel.`,
  perm: 'isStaff',
  usage: [true],
  allowPM: true,
  action: async args => {
    if (!args.isPM)
      Server.wipeMessage(args.message);

    const welcomeChannel = Server.findChannel(channelNames.WELCOME);
    const oldMessages = await welcomeChannel.messages.fetch({ limit: 10 });

    try {
      // Post rules to #welcome
      await Server.send(welcomeChannel, `__**Welcome to the MLP-VectorClub's Discord Server!**__`);
      const rulesText = `We have a few rules that you should keep in mind:\n\n${Server.getRules()}`;
      await Server.sendSlices(welcomeChannel, rulesText);
      await Server.send(welcomeChannel, `Please send the command **/read** to this channel to reveal the rest of the channels on our server and start chatting. You can always get this information again by running the \`/rules\` command.`);

      // Scrub old messages
      await Promise.all(oldMessages.map(message => message.delete()));

      // Notify the staff channel
      Server.send(Server.findChannel(channelNames.STAFF_CHAT), `${Server.mention(args.author)} updated the rules in ${Server.mention(welcomeChannel)}`);
    } catch (err) {
      console.log('fail', err);
      failure(err, args);
    }
  },
});
