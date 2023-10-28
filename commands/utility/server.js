const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('server')
    .setDescription('Muestra información del servidor.'),
  async execute(interaction) {
    const guild = interaction.guild;

    // Verificar si el servidor (guild) es válido
    if (guild) {
      await guild.members.fetch(guild.ownerId); // Asegurarse de tener información sobre el propietario

      const owner = guild.members.cache.get(guild.ownerId);
      const iconURL = guild.iconURL({ dynamic: true, size: 4096 }); // Obtener la URL del ícono en su tamaño máximo

      await interaction.reply({ content:
        `>>> ## **Servidor**: ${guild.name}
        - **Datos**:
         - **Miembros:** *${guild.memberCount}*
         - **ID del servidor:** *${guild.id}*
         - **Propietario:** *${owner.user.tag}*
         - **Fecha de creación:** *${new Date(guild.createdTimestamp).toLocaleDateString()}*
         - **Número de roles:** *${guild.roles.cache.size}*
         - **Icono del servidor:** ${iconURL}
        `
      });
    } else {
      await interaction.reply("No se ha encontrado información del servidor.");
    }
  },
};
