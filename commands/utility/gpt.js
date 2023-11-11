const fetch = require('node-fetch');
const { SlashCommandBuilder } = require('discord.js');
const { OpenAI } = require("openai");
const { gpt } = require('../../config.json');

const apiKey = gpt;
const openai = new OpenAI({ apiKey: `${apiKey}` });

module.exports = {
  data: new SlashCommandBuilder()
    .setName('gpt')
    .setDescription('Envía un mensaje a ChatGPT y recibe una respuesta.')
    .addStringOption(option =>
      option.setName('message')
        .setDescription('Mensaje para ChatGPT')
        .setRequired(true)),
  async execute(interaction) {
    const message = interaction.options.getString('message');

    // HACER CHATS POR PERSONA
    // IDEA DE HACER CHATS GRUPALES Y CREAR CONVERSACIONES DE VARIAS PERSONAS
    // AÑADIR AL COMANDO OPTION DE PROMPT DEFAULT
    
    try {
      // Enviar una respuesta provisional y almacenarla en una variable
      const responseMessage = await interaction.reply({ content: 'Procesando su solicitud...', ephemeral: true });

      const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: `${message}` }],
        model: "gpt-3.5-turbo",
      });

      const gptResponse = completion.choices[0].message.content;

      // Eliminar la respuesta provisional
      await responseMessage.delete();

      // Enviar la respuesta de ChatGPT al usuario en Discord
      if (gptResponse) {
        // Dividir la respuesta en partes de 1500 caracteres o menos
        const segments = []
        const maxLength = 1500;

        for (let i = 0; i < gptResponse.length; i += maxLength) {
          segments.push(gptResponse.slice(i, i + maxLength));
        }

        // Enviar cada segmento en un mensaje separado
        segments.forEach(async (s, i) => {
          await interaction.followUp(`**${interaction.user} dice:** ${message.length > 250 ? '*Mensaje demasiado largo para mostrarlo :(*' : message}.\n\n**Respuesta${segments.length > 1 ? ` [Parte ${i + 1}]` : ''}:** ${s}`);
        });
      } else {
        await interaction.followUp(`
        - Tu mensaje: ${message}.
        - CHAT GPT no ha podido responder :(
        `);
      }
    } catch (error) {
      console.error(error);
      await interaction.reply('Ocurrió un error al procesar tu solicitud a ChatGPT.');
    }
  },
};