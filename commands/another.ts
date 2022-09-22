import { Interaction } from "discord.js";
import { CommandData } from "../index";

const command: CommandData = {
  meta: {
    name: "another",
    description: "This is a another description",
  },
  handler: (interaction: Interaction) => {
    interaction.isRepliable() ? interaction.reply("another test") : console.log("no");
  },
};

export default command;
