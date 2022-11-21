import Discord, { TextChannel } from "discord.js";
import dotenv from "dotenv";
import fs from "fs/promises";
import { DateTime } from "luxon";

dotenv.config();

const client = new Discord.Client({
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
  ],
});

export interface CommandData {
  meta: Discord.ApplicationCommandDataResolvable;
  handler: Function;
}

async function getCommands() {
  let files = await fs.readdir("./commands");
  files = files.map((item) => item.split(".")[0]);
  let commands: any = {};

  for (const file of files) {
    let command = await import(`./commands/${file}`);
    commands[command.default.meta.name] = command.default;
  }
  return commands;
}

async function loadCommands() {
  const commands = await getCommands();
  const keys = Object.keys(commands);
  const res = [];
  for (const key of keys) {
    res.push(commands[key].meta);
  }
  return res;
}

client.on("ready", async () => {
  console.log(`Bot is ready`);

  const guild = client.guilds.cache.get("982327785009864904");
  let commands;

  if (guild) {
    commands = guild.commands;
  } else {
    commands = client.application?.commands;
  }

  const botCommands = await loadCommands();

  for (const command of botCommands) {
    commands?.create(command);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  const commands = await getCommands();

  if (!commands[commandName]) {
    interaction.reply({ content: "Dont Got That Command", ephemeral: true });
    return;
  }

  commands[commandName].handler(interaction);
});

// Custom Code Starts from here
client.on("messageCreate", async (message) => {
  if (!message.content) return;
  if (/zeida/g.test(message.content.toLowerCase())) {
    await message.guild?.members.fetch();

    const user = message.guild?.members.cache.get("453146976008011777");

    const dm = await user?.createDM();
    dm?.send(`someone mentioned your name`);
  }
});

client.on("messageDelete", async (message) => {
  if (!message.content) return;
  if (
    /<@453146976008011777>|@(here|everyone)|zeida/g.test(
      message.content.toLowerCase()
    )
  ) {
    await message.guild?.members.fetch();

    const user = message.guild?.members.cache.get("453146976008011777");

    const dm = await user?.createDM();

    if (!(message.channel instanceof TextChannel)) return;

    const embed = new Discord.MessageEmbed()
      .setColor("BLURPLE")
      .setTitle("Ghost Ping Detected")
      .setDescription("this is just some placeholder text")
      .addFields(
        { name: "Sender:", value: `<@${message.author?.id}>` },
        { name: "Channel Name:", value: `\`${message.channel.name}\`` },
        { name: "Message Content:", value: message.content },
        {
          name: "Sent At:",
          value: `\`${DateTime.fromMillis(message.createdTimestamp)
            .setZone("UTC+6")
            .toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS)}\``,
        }
      );

    dm?.send({ embeds: [embed] });
  } else {
    return;
  }
});

client.login(process.env.TOKEN);
