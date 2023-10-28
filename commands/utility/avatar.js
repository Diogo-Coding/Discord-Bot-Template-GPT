const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Muestra el avatar tuyo o de otra persona.')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('Indica el usuario')
        .setRequired(false)),
  async execute(interaction) {
    let target = interaction.options.getUser('target');
    let content;

    if (!target) {
      target = interaction.user;
    }

    // Obtén el miembro del servidor para obtener el apodo y la fecha de unión
    const member = interaction.guild.members.cache.get(target.id);

    if (member) {
      // Obtén la URL del avatar en su tamaño máximo
      const avatarURL = target.displayAvatarURL({ dynamic: true, size: 4096 });
      content = avatarURL;
    } else {
      content = `No se ha encontrado al usuario`;
    }

    await interaction.reply({ content: content });
  },
};
