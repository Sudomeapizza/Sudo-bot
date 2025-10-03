const { SlashCommandBuilder, InteractionContextType, MessageFlags, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js')
const cheerio = require('cheerio');

module.exports = {
    category: 'tools',
    data: new SlashCommandBuilder()
        .setName('wikify')
        .setDescription("Newsify the site!")
        .addStringOption(option =>
            option.setName('sites')
                .setDescription('which wiki site to search')
                .setRequired(true)
                .addChoices(
                    { name: 'Wikipedia', value: "wikipedia" },
                    { name: 'Rossmann', value: "rossmann" },
                )
        )
        .addStringOption(option =>
            option.setName('subject')
                .setDescription('what do you want to lookup?')
                .setRequired(true)
        )
        .addBooleanOption(option =>
            option.setName('silent')
                .setDescription('Invisible reply (Default=True)')
        )
        .setContexts(
            InteractionContextType.BotDM,
            InteractionContextType.PrivateChannel,
            InteractionContextType.Guild
        ),
    async execute(interaction, client) {

        const silent = interaction.options.getBoolean('silent') ?? true;
        const targetUrl = interaction.options.getString('sites');
        const query = interaction.options.getString('subject');


        var message = await interaction.deferReply({
            flags: silent ? MessageFlags.Ephemeral : undefined,
            withResponse: true,
            content: "Parsing: ..."
        });

        const link = {
            "rossmann": "https://consumerrights.wiki/api.php",
            "wikipedia": "https://wikipedia.org/w/api.php"
        }

        console.log("searching wiki");

        if (targetUrl === "rossmann") {
            await interaction.editReply({ content: "Please be patient, loading..." });
        }

        var results = await searchWiki("search", link[targetUrl], query);

        let listings = "";
        const row = new ActionRowBuilder()
        const row2 = new ActionRowBuilder()

        for (var a = 0; a < results[0].length; a++) {
            listings += `${a}) [${results[1][a]}](<${results[3][a]}>)\n`
            if (a <= 4) {
                row.addComponents(
                    new ButtonBuilder()
                        .setCustomId(a.toString())
                        .setLabel(a.toString())
                        .setStyle(ButtonStyle.Secondary)
                );
            } else if (a >= 5 && a < 10) {
                row2.addComponents(
                    new ButtonBuilder()
                        .setCustomId(a.toString())
                        .setLabel(a.toString())
                        .setStyle(ButtonStyle.Secondary)
                );
            }
        }

        var embed = new EmbedBuilder()
            .setColor(16747008)
            .setTitle(targetUrl)
            .setTimestamp(new Date())
            .addFields(
                { name: "Search Results:", value: listings },
            );

        message = await interaction.editReply({ content: "", components: [row, row2], embeds: [embed], fetchReply: true });

        const collectorFilter = (i) => i.user.id === interaction.user.id;
        const collectorFilterBad = (i) => i.user.id !== interaction.user.id;
        const collectionTimer = 60000; // 60 seconds

        // ====  ALLOWED COLLECTOR  ====
        const confirmation = message.createMessageComponentCollector({
            filter: collectorFilter,
            time: collectionTimer,
        });

        confirmation.on('collect', async i => {
            console.log(confirmation.customId);
            if (targetUrl === "rossmann") {
                embed.setFields(
                    { name: "Loading:", value: "Please be patient, loading..." }
                )
                await interaction.editReply({ content: "", components: [], embeds: [embed] });
            }
            let authorName = results[1][i.customId];
            let authorUrl = results[3][i.customId];
            // console.log("obtaining page info");
            results = await searchWiki((targetUrl === "rossmann") ? "lookupRights" : "lookup", link[targetUrl], results[3][i.customId])
            embed.setFields(
                { name: "Result:", value: results.substring(0, 500) }
            )
                .setAuthor({
                    name: targetUrl,
                    iconURL: (targetUrl === "rossmann") ?
                        await fetchFavicon("https://consumerrights.wiki") :
                        await fetchFavicon("https://en.wikipedia.com"),
                })
                .setTitle(authorName)
                .setURL(authorUrl)

            await interaction.editReply({ content: "", components: [], embeds: [embed] });

            confirmation.stop('finished');
        });

        confirmation.on('end', async (_, reason) => {
            if (reason === 'time')
                await interaction.editReply({
                    content: 'Interaction timed out.',
                    components: [],
                });
        });

        // ====  NOT‑ALLOWED COLLECTOR  ====
        const notAllowed = message.createMessageComponentCollector({
            filter: collectorFilterBad,
            time: collectionTimer,
        });

        notAllowed.on('collect', async i => {
            await i.deferUpdate();
            await i.followUp({
                content: `These ain't your buttons!`,
                flags: MessageFlags.Ephemeral,
            });
        });




        // try {
        //     const confirmation = await message.awaitMessageComponent({
        //         filter: collectorFilter,
        //         time: collectionTimer
        //     });
        //     console.log(confirmation.customId);
        //     if (targetUrl === "rossmann") {
        //         embed.setFields(
        //             { name: "Loading:", value: "Please be patient, loading..." }
        //         )
        //         await interaction.editReply({ content: "", components: [], embeds: [embed] });
        //     }
        //     let authorName = results[1][confirmation.customId];
        //     let authorUrl = results[3][confirmation.customId];
        //     console.log("obtaining page info");
        //     results = await searchWiki((targetUrl === "rossmann") ? "lookupRights" : "lookup", link[targetUrl], results[3][confirmation.customId])
        //     embed.setFields(
        //         { name: "Result:", value: results.substring(0, 500) }
        //     )
        //         .setAuthor({
        //             name: targetUrl,
        //             iconURL: (targetUrl === "rossmann") ?
        //                 await fetchFavicon("https://consumerrights.wiki") :
        //                 await fetchFavicon("https://en.wikipedia.com"),
        //         })
        //         .setTitle(authorName)
        //         .setURL(authorUrl)

        //     await interaction.editReply({ content: "", components: [], embeds: [embed] });
        // } catch {
        //     await interaction.editReply({ content: "Interaction timed out", components: [], embed: [] });
        // }
    }
}

async function fetchFavicon(baseUrl) {
    try {
        const res = await fetch(baseUrl);
        if (!res.ok) return `${baseUrl}favicon.ico`;

        const html = await res.text();
        const $ = cheerio.load(html);

        let iconHref = $('link[rel*="icon"]').attr("href");

        if (!iconHref) {
            return new URL("/favicon.ico", baseUrl).href;
        }

        if (iconHref.startsWith("http")) return iconHref;
        return new URL(iconHref, baseUrl).href;

    } catch (err) {
        console.error("fetchFavicon failed:", err);
        return new URL("/favicon.ico", baseUrl).href;
    }
}

async function searchWiki(queryType, link, queryString) {
    const apiUrl = link;
    // console.log(`Query String::: ${queryString}`)
    var params = "";
    if (queryType === "search") {
        params = {
            action: "opensearch",
            format: "json",
            errorformat: "plaintext",
            search: `${queryString}`,
            formatversion: "2",
        };
    } else if (queryType === "lookup") {
        queryString = queryString.substring(queryString.lastIndexOf("/") + 1)
        queryString = decodeURIComponent(queryString)
        // console.log(`query String: ${queryString}`);
        params = {
            action: "query",
            format: "json",
            titles: `${queryString}`,
            prop: "extracts",
            exintro: true,
            explaintext: true,
            redirects: 1
        };
    } else if (queryType === "lookupRights") {
        queryString = queryString.substring(queryString.lastIndexOf("/") + 1)
        queryString = decodeURIComponent(queryString)
        // console.log(`query String: ${queryString}`);
        params = {
            action: "parse",
            format: "json",
            page: `${queryString}`,
            redirects: 1,
            prop: `text`,
        };
    }

    queryString = new URLSearchParams(params).toString();
    const requestUrl = `${apiUrl}?${queryString}`;
    console.log(requestUrl)

    return await fetch(requestUrl) // Add return here
        .then((response) => {
            if (!response.ok) {
                console.error(`HTTP error! status: ${response.status}`);
                throw new Error(`HTTP error! status: ${response.status}`); // Throw an error to be caught by the catch block
            }
            return response.json();
        })
        .then((data) => {
            if (queryType === "lookup") {
                const pages = data.query.pages;
                const pageId = Object.keys(pages)[0];
                const extractContent = pages[pageId].extract;
                console.log("obtained wikipedia site info")
                return extractContent
            } else if (queryType === "lookupRights") {
                const plainhtml = data.parse.text["*"];
                var textContent = plainhtml
                    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
                    .replace(/<[^>]*>/g, '')
                    .replace(/&nbsp;/g, ' ')
                    .replace(/&amp;/g, '&')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&quot;/g, '"')
                    .replace(/&#039;/g, "'")
                    .replace(/\n\s*\n/g, '\n\n')
                    .replace(/([0-9]&|&)#[0-9]?[0-9];/g, '')
                    .trim();
                let longLines = "";
                const lines = textContent.split("\n");

                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];
                    if (line.length > 50) {
                        longLines += line + "\n";
                    }
                }

                const lastDelim = textContent.lastIndexOf("\\n\\n                "); // matches last instance of 
                textContent = textContent.substring(lastDelim + 1)
                data = {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(
                                {
                                    title: data.parse.title,
                                    pageid: data.parse.pageid,
                                    content: longLines,
                                    categories: data.parse.categories?.map((cat) => cat["*"]) || [],
                                    sections: data.parse.sections || [],
                                    internalLinks: data.parse.links?.map((link) => link["*"]) || [],
                                    externalLinks: data.parse.externallinks || [],
                                    url: `${apiUrl}/${data.parse.title.replace(/ /g, "_")}`,
                                },
                                null,
                                2,
                            ),
                        },
                    ],
                };
                return longLines;
            } else {
                return data;
            }
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
            throw error; // Re-throw the error for the caller to handle
        });
}