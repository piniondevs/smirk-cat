import Discord from "discord.js";
import dotenv from "dotenv";
import fs from "fs/promises";

dotenv.config();

const client = new Discord.Client({
  intents: [Discord.Intents.FLAGS.GUILDS],
});


export interface CommandData {
  meta: Discord.ApplicationCommandDataResolvable
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
  // ill do this later
}

client.on("ready", () => {
  console.log(`Bot is ready`);

  const guild = client.guilds.cache.get("982327785009864904");
  let commands;

  if (guild) {
    commands = guild.commands;
  } else {
    commands = client.application?.commands;
  }

  // for (let i = 0; i < botCommands.length; i++) {
  //   commands?.create(botCommands[i]);
  // }
});

client.on("interaction", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  const commands = await getCommands();

  if (!commands[commandName]) {
    interaction.reply({ content: "Dont Got That Command", ephemeral: true });
    return;
  }

  commands[commandName].handler(interaction);
});

client.login(process.env.TOKEN);
