import { Interaction } from "discord.js";
import { CommandData } from "../index";

const command: CommandData = {
  meta: {
    name: "ping",
    description: "im just a ping command",
  },
  handler: (interaction: Interaction) => {
    if (!interaction.isRepliable()) return;
    interaction.reply('pong')
  },
};

export default command;
