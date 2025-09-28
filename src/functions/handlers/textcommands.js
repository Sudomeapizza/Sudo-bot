// const { joinVoiceChannel } = require('@discordjs/voice');
const { getArray, restart, gitpull, pokemon, pokemonStop, pushCode, getVersion } = require('../../helpers/replycalc.js');
// const { joinVoiceChannel, VoiceConnection, VoiceConnectionStatus, VoiceConnectionDisconnectReason, VoiceChannel, getVoiceConnection } = require('@discordjs/voice');
const { Events, EmbedBuilder, MessageFlags, subtext } = require('discord.js');
const Guild = require('../../schemas/guild');
const mongoose = require('mongoose');
const cheerio = require('cheerio');
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

module.exports = (client) => {

    client.on('guildCreate', async (guild) => {
        console.log(`Bot joined a new guild: ${guild.name} (id: ${guild.id}).`);

        var guildProfile = await Guild.findOne({ guildId: guild.id });
        if (!guildProfile) {
            guildProfile = await new Guild({
                _id: new mongoose.Types.ObjectId(),
                guildId: guild.id,
                guildName: guild.name,
                guildIcon: guild.iconURL() ? guild.iconURL() : "None..",
            })
            await guildProfile.save().catch(console.error);
            console.log(guildProfile);
        }
    });

    client.on('guildDelete', async (guild) => {
        console.log(`Bot left a guild: ${guild.name} (id: ${guild.id}).`);

        await Guild.findOneAndDelete({ guildId: guild.id });
    });

    // I ain't questioning it, but it WORKS
    client.on("messageCreate", async (message) => {
        if (message.author.bot) return false;

        //If the bot gets pinged
        if (message.content.includes("<@823697716076347423>")) {
            switch (true) {
                // if " pet " is mentioned
                case message.content.includes(" pet "):
                    console.log("pet");
                    response(message, 1, `*pets you instead*`);
                    break;
                // if The Bot is the only content of the message
                case message.content.replace(/\s+/g, '') == "<@823697716076347423>":
                    response(message, 1, getArray("wiki"));
                    break;
                default:
                    console.log("uh oh");
                    break;
            }
        }

        // If Sudo sent a message
        if (message.author.id === '210932800000491520') {

            console.log("Sudo sent a message")
            // const match = message.content.match(/https?:\/\/[^\s]+/);
            // console.log(match + " --- " + message.content);
            // if (match == message.content) {

            //     console.log("Link matched: " + match);
            //     // Errant #News-stuffs
            //     // if (message.guild?.id !== 1076645110390984714 || message.channel.id !== 1085298877890056272) return;
            //     // TestServer #testbot-test

            //     if (message.guild.id !== "1174218330962395146" || message.channel.id !== "1416204394894069871") {
            //         console.log(
            //             "NO MATCH:\n" +
            //             "Guild 1174218330962395146 /= " + message.guild.id +
            //             "\nChannel 1416204394894069871 /= " + message.channel.id
            //         )
            //         return
            //     };
            //     console.log("MATCH")

            //     message.delete()

            //     var newsPostMessage = await message.channel.send({
            //         withResponse: true,
            //         content: "Parsing: <" + match + "> ..."
            //     });

            //     var url = match[0];
            //     var u = new URL(url);
            //     var baseUrl = `${u.protocol}//${u.host}/`;
            //     var postId = url.split("/post/")[1];
            //     var ogUrl = "";

            //     var { data, result } = await testLemmyCommunity(baseUrl, postId);

            //     // Test if Lemmy Community
            //     if (!result) {
            //         await newsPostMessage.edit({ content: `Parsing news site: <${url}>` });
            //         // data = await fetchLemmyPostData(baseUrl, postId);

            //         console.log("NOT LEMMY")
            //         const article = await fetchArticleSnippet(url, 5);

            //         console.log(article.articleFavicon)

            //         /**
            //          * BUILD EMBED
            //          */
            //         const embed = new EmbedBuilder()
            //             .setAuthor({
            //                 name: article.articleNewsSite,
            //                 URL: url,
            //                 iconURL: article.articleFavicon

            //             })
            //             .setColor(parseInt("580085", 16))
            //             .setTitle(article.articleTitle)
            //             .setURL(url)
            //             .setThumbnail(article.articlePreviewImage)
            //             .setTimestamp(new Date())
            //             .addFields(
            //                 {
            //                     name: "Article", value:
            //                         `[${url.substring(8)}](${url})`
            //                 },
            //                 { name: "Article Content", value: article.content.substring(0, 1020) + " ..." }
            //             );


            //         await newsPostMessage.edit({ content: "", embeds: [embed] });
            //         return;
            //     }

            //     try {

            //         if (url != data.post_view.post.ap_id) {
            //             ogUrl = url;
            //             url = data.post_view.post.ap_id
            //             u = new URL(url)
            //             baseUrl = `${u.protocol}//${u.host}/`;
            //             postId = url.split("/post/")[1];

            //             var { data, result } = await testLemmyCommunity(baseUrl, postId);
            //             console.log(result)
            //         }

            //         const favicon = await fetchFavicon(baseUrl);
            //         data = await fetchLemmyPostData(baseUrl, postId);

            //         /**
            //          * BUILD EMBED
            //          */
            //         const embed = new EmbedBuilder()
            //             .setAuthor({
            //                 name: formatCommunity(data.communityActor, data.communityTitle), // Autofill News Site -> dbzer0
            //                 URL: url,
            //                 iconURL: favicon
            //             })
            //             .setColor(16747008)
            //             .setTitle(data.post_view.post.name || "Lemmy Post")
            //             .setURL(url)
            //             .setThumbnail(data.post_view.post.thumbnail_url)
            //             .setFooter({
            //                 text: message.author.globalName,
            //                 iconURL: message.author.avatarURL()
            //             })
            //             .setTimestamp(new Date())
            //             .addFields(
            //                 {
            //                     name: "Lemmy Post:", value:
            //                         `\n:arrow_up: ${data.postUpvotes} :arrow_down: ${data.postDownvotes}\n` +
            //                         `${ogUrl ? "Via: [" + ogUrl.substring(8) + "](" + ogUrl + ")\n" : ""}` +
            //                         `[${url.substring(8)}](${url}) • <t:${Date.parse(new Date(data.publishedDate)) / 1000}:f>\n\n` +
            //                         `${commentDataFormatted(data.topComments)}`
            //                 },
            //                 {
            //                     name: "Article", value:
            //                         `[${data.articleUrl.substring(8)}](${data.articleUrl})`
            //                 },
            //                 { name: "Article Content", value: data.snippet.content.substring(0, 1020) + " ..." }
            //             );


            //         newsPostMessage.edit({ content: "", embeds: [embed] });
            //     } catch (err) {
            //         await newsPostMessage.edit({ content: "ahhh! brokie! Lemme know it brokie!" });
            //         console.error(err)
            //     }
            // } else {
            //     if (match) {
            //         console.log("Link NOT matched: " + match)
            //         await newsPostMessage.edit({ content: "Resend with *only* the web url!" });
            //     }
            // }


            if (message.content.toLowerCase().substring(0, 8) == "!restart") {
                console.log("restart");
                console.log(messagess);
                const replyMessage = await message.reply({ content: "Restarting...", flags: silence ? MessageFlags.Ephemeral : undefined });
                var messagess = restart(message.content.toLowerCase().split(" ")[1]).toString();
                const fetchedReplyMessage = await message.channel.messages.fetch(replyMessage.id);
                fetchedReplyMessage.edit({ content: messagess, flags: silence ? MessageFlags.Ephemeral : undefined });
            }

            if (message.content.toLowerCase().substring(0, 8) == "!gitpull") {
                console.log("gitpull");

                const replyMessage = await message.reply({ content: `Checking github...` });
                const fetchedReplyMessage = await message.channel.messages.fetch(replyMessage.id);
                fetchedReplyMessage.edit({ content: gitpull(parseInt(message.content.toLowerCase().split(" ")[1])) });
            }

            if (message.content.toLowerCase().substring(0, 11) == "!getversion") {
                console.log("getversion");

                const replyMessage = await message.reply({ content: `Checking Version...`, flags: silence ? MessageFlags.Ephemeral : undefined });
                const fetchedReplyMessage = await message.channel.messages.fetch(replyMessage.id);
                fetchedReplyMessage.edit({ content: getVersion(message.content.toLowerCase().split(" ")[1]), flags: silence ? MessageFlags.Ephemeral : undefined });
            }

            // Usage: `!pushcode "title" "body"`
            if (message.content.toLowerCase().substring(0, 9) == "!pushcode") {
                console.log("Pushcode");

                const replyMessage = await message.reply({ content: `Pushing Github...` });
                const fetchedReplyMessage = await message.channel.messages.fetch(replyMessage.id);

                function extractValues(inputString) {
                    const regex = /"([^"]*)"/g;
                    const matches = inputString.match(regex);

                    if (!matches || matches.length < 2) return null;

                    const title = matches[0].replace(/"/g, '');
                    const body = matches[1].replace(/"/g, '');

                    return { title, body };
                }

                // Example usage:
                const values = extractValues(message.content.toLowerCase());
                console.log(values);
                if (values) {
                    fetchedReplyMessage.edit({ content: pushCode(values.title, values.body) });
                } else {
                    fetchedReplyMessage.edit({ content: `!pushcode "title" "body"` });
                }
            }
        }

        if (message.author.id === '210932800000491520' || message.author.id === '1166148722867056681' || message.author.
id === "308766485461991434") {

            // if (message.content.toLowerCase().includes("pokemon")) {
            if (message.content.toLowerCase().substring(0, 8) == "!pokemon") {
                console.log("pokemon");
                var option = message.content.toLowerCase().substring(8);
                var messagess, replyMessage;
                if (option == 'stop') {
                    replyMessage = await message.reply({ content: "Stopping..." });
                    messagess = pokemonStop().toString();
                } else {
                    replyMessage = await message.reply({ content: `Starting up ${option}...` });
                    messagess = pokemon(option).toString();
                }
                console.log(messagess);
                const fetchedReplyMessage = await message.channel.messages.fetch(replyMessage.id);
                fetchedReplyMessage.edit({ content: messagess });
            }
        }
        // if (message.author.id === '165615258965114880' || message.author.id === '210932800000491520') {
            // if (Math.floor(Math.random() * 10) == 0) {
            // if (message.content.toLowerCase().includes("bloody")) {
            //     console.log("bloody");
            //     message.channel.send(`${getArray("wiki")}` || "None2");
            // }
            // }
        // }

        // // convert messages
        // var localTimeZone = await client.getTimeZone(message.author.id);
        // if (localTimeZone) {
        //     const result = timeConvert(message, localTimeZone.timeZone);
        //     if (result) {
        //         console.log(result);
        //         message.channel.send(result);
        //     }
        // } else {
        //     // maybe something?
        //     console.log(`No time region set for {${message.author.tag} : ${message.author.id}}`);
        // }
    })
}

function formatCommunity(actor_id, communityTitle) {
    const u = new URL(actor_id);
    const domain = u.hostname;
    return `${domain} @ ${communityTitle}`;
}

function commentDataFormatted(comments) {
    var output = "";

    comments.forEach(obj => {
        const u = new URL(obj.actor_id);
        const domain = u.hostname;
        if ((obj.text).length > 250) {
            obj.text = (obj.text).substring(0, 250) + " ..."
        }
        output +=
            `:arrow_up: ${obj.upvotes} :arrow_down: ${obj.downvotes}  ` +
            `**${obj.author}@${domain}**:\n` +
            `*${obj.text}*\n\n`
    });
    return output
}


async function fetchFavicon(baseUrl) {
    try {
        const res = await fetch(baseUrl);
        if (!res.ok) return `${baseUrl}favicon.ico`;

        const html = await res.text();
        const $ = cheerio.load(html);

        // Find all <link rel="..."> that contain "icon"
        let iconHref = $('link[rel*="icon"]').attr("href");

        if (!iconHref) {
            // fallback to common default
            return new URL("/favicon.ico", baseUrl).href;
        }

        // Normalize to absolute URL
        if (iconHref.startsWith("http")) return iconHref;
        return new URL(iconHref, baseUrl).href;

    } catch (err) {
        console.error("fetchFavicon failed:", err);
        return new URL("/favicon.ico", baseUrl).href;
    }
}

async function testLemmyCommunity(baseUrl, postId) {
    const apiUrl = `${baseUrl}api/v3/post?id=${postId}`;
    const res = await fetch(apiUrl);
    var postData = "";
    if (res.ok)
        postData = await res.json();
    return {
        result: res.ok,
        data: postData
    };
}

async function fetchPost(baseUrl, postId) {
    const postRes = await fetch(`${baseUrl}api/v3/post?id=${postId}`);
    if (!postRes.ok) throw new Error("Failed to fetch post");
    const postData = await postRes.json();
    return {
        postData,
        post_view: postData.post_view,
        postUpvotes: postData.post_view.counts.upvotes,
        postDownvotes: postData.post_view.counts.downvotes,
        postCommentsCount: postData.post_view.counts.comments,
        communityName: postData.post_view.community.name,
        communityTitle: postData.post_view.community.title,
        communityActor: postData.post_view.community.actor_id,
    }
}

async function fetchPostComments(baseUrl, postId) {
    const url = `${baseUrl}api/v3/comment/list?post_id=${postId}&sort=Top&limit=3`;
    const res = await fetch(url);
    const data = await res.json();
    const comments = data.comments || [];
    const topComments = [];

    for (const c of comments) {
        topComments.push({
            author: c.creator?.name || "NA",
            actor_id: c.creator?.actor_id || "NA",
            text: c.comment?.content || "NA",
            upvotes: c.counts?.upvotes ?? 0,
            downvotes: c.counts?.downvotes ?? 0,
        });
    }
    return { topComments };
}

async function fetchLemmyPostData(baseUrl, postId) {

    const { postData, post_view, postUpvotes, postDownvotes, postCommentsCount, communityActor, communityName, communityTitle } =
        await fetchPost(baseUrl, postId);

    const { topComments } = await fetchPostComments(baseUrl, postId);

    const articleUrl = postData.post_view.post.url;
    const content = await fetchArticleSnippet(articleUrl, 5);

    return {
        siteDomain: baseUrl,
        postId,
        post_view,
        publishedDate: postData.post_view.counts.published,
        postUpvotes,
        postDownvotes,
        postCommentsCount,
        topComments,
        articleUrl,
        snippet: content,
        communityActor,
        communityName,
        communityTitle
    };
}

async function fetchArticleSnippet(articleUrl, paraCount = 3) {
    try {
        const res = await fetch(articleUrl);
        if (!res.ok) return "Could not fetch article.";

        const html = await res.text();
        const $ = cheerio.load(html);

        // === 1. Collect text from first N <p> tags ===
        let textSnippets = [];
        $("p").each((i, el) => {
            if (i < paraCount) {
                const content = $(el).text().trim();
                if (content.length > 0) textSnippets.push(content);
            }
        });

        if (textSnippets.length === 0) {
            return {
                articleNewsSite: new URL(articleUrl).hostname,
                articleTitle: $("title").text() || "Untitled",
                articlePreviewImage: null,
                articleFavicon: new URL("/favicon.ico", articleUrl).href,
                content: "No paragraph content found."
            };
        }

        // === 2. Get metadata ===
        const articleNewsSite = new URL(articleUrl).hostname;

        // Title: prefer og:title > twitter:title > <title>
        const articleTitle =
            $('meta[property="og:title"]').attr("content") ||
            $('meta[name="twitter:title"]').attr("content") ||
            $("title").text() ||
            "Untitled";

        // Preview image: prefer og:image > twitter:image
        let articlePreviewImage =
            $('meta[property="og:image"]').attr("content") ||
            $('meta[name="twitter:image"]').attr("content") ||
            null;
        if (articlePreviewImage && !articlePreviewImage.startsWith("http")) {
            articlePreviewImage = new URL(articlePreviewImage, articleUrl).href;
        }

        // Favicon: <link rel*="icon">
        let articleFavicon =
            $('link[rel*="icon"]').attr("href") || "/favicon.ico";
        if (!articleFavicon.startsWith("http")) {
            articleFavicon = (new URL(articleFavicon, articleUrl).href).split("?")[0];;
        }

        return {
            articleNewsSite,
            articleTitle,
            articlePreviewImage,
            articleFavicon,
            content: textSnippets.join("\n\n")
        };
    } catch (err) {
        console.error("Error in fetchArticleSnippet:", err);
        return "Error fetching article.";
    }
}

function response(message, chance, responseMessage) {
    if (Math.floor(Math.random() * chance) == 0) {
        console.log("workie2.5");
        console.log(responseMessage);
        message.channel.send(responseMessage || "None1");
        console.log("workie2.6");
    }
}
