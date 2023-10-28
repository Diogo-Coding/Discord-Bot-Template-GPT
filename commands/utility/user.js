const { SlashCommandBuilder } = require('discord.js');

const dateOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
}; // Opciones para el formato de fecha con hora

module.exports = {
  data: new SlashCommandBuilder()
    .setName('user')
    .setDescription('Muestra información acerca tuya o de otro usuario')
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
    const activities = member.presence && member.presence.activities
      ? member.presence.activities.map(activity => activity.name).join(', ')
      : 'No tiene actividades ahora mismo';

    if (member) {
      // Filtra los roles para excluir el rol @everyone
      const roles = member.roles.cache
        .filter(role => role.name !== '@everyone')
        .map(role => role.name)
        .join(', ');

      const joinedDate = new Date(member.joinedTimestamp).toLocaleDateString('es-ES', dateOptions); // Formatea la fecha de unión
      const createdDate = new Date(target.createdAt).toLocaleDateString('es-ES', dateOptions); // Formatea la fecha de creación de la cuenta

      content = `|| >>> ## **Usuario**: ${target}
      - **Info de usuario general**:
       - **Username:** ${target.username}
       - **Alias en el servidor:** ${member.nickname}
       - **Fecha de creación de la cuenta:** ${createdDate}
       - **Fecha en la que se unió al servidor:** ${joinedDate}
       - **Roles:** ${roles}
       - **ID del usuario:** ${target.id}
			 ||`;
    } else {
      content = `No se ha encontrado al usuario`;
    }

    await interaction.reply({ content: content });
  },
};
