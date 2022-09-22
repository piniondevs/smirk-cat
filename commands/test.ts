import { Interaction } from "discord.js";
import { CommandData } from "../index";

const command: CommandData = {
  meta: {
    name: "test",
    description: "This is a description",
  },
  handler: (interaction: Interaction) => {
    interaction.isRepliable() ? interaction.reply("test") : console.log("no");
  },
};

export default command;
