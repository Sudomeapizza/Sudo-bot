const { SlashCommandBuilder, InteractionContextType, MessageFlags, EmbedBuilder } = require('discord.js')
const cheerio = require('cheerio');
const { reportCrash } = require('../../helpers/crash');
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('newsify')
        .setDescription("Newsify the site!")
        .addStringOption(option =>
            option.setName('url')
                .setDescription('full web url')
                .setRequired(true)
        )
        .setContexts(
            InteractionContextType.BotDM,
            InteractionContextType.PrivateChannel,
            InteractionContextType.Guild
        ),
    // .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages,PermissionFlagsBits.SendMessagesInThreads),
    async execute(interaction, client) {


        var message = await interaction.deferReply({
            withResponse: true,
            content: "Parsing: ..."
        });

        const targetUrl = interaction.options.getString('url');

        const match = targetUrl.match(/https?:\/\/[^\s]+/);
        if (match == targetUrl) {

            message = await interaction.editReply({
                withResponse: true,
                content: "Parsing: <" + match + "> ..."
            });

            var url = match[0];
            var u = new URL(url);
            var baseUrl = `${u.protocol}//${u.host}/`;
            var postId = url.split("/post/")[1];
            var ogUrl = "";

            var { data, result } = await testLemmyCommunity(baseUrl, postId);

            // Test if Lemmy Community
            if (!result) {
                await interaction.editReply({ content: `Parsing news site: <${url}>` });

                const article = await fetchArticleSnippet(url, 5);

                /**
                 * BUILD EMBED
                 */
                const embed = new EmbedBuilder()
                    .setAuthor({
                        name: article.articleNewsSite,
                        URL: url,
                        iconURL: article.articleFavicon

                    })
                    .setColor(parseInt("580085", 16))
                    .setTitle(article.articleTitle)
                    .setURL(url)
                    .setThumbnail(article.articlePreviewImage)
                    .setTimestamp(new Date())
                    .addFields(
                        {
                            name: "Article", value:
                                `[${url.substring(8)}](${url})`
                        },
                        { name: "Article Content", value: article.content.substring(0, 1020) + " ..." }
                    );


                await interaction.editReply({ content: "", embeds: [embed] });
                return;
            }
            try {

                if (url != data.post_view.post.ap_id) {
                    ogUrl = url;
                    url = data.post_view.post.ap_id
                    u = new URL(url)
                    baseUrl = `${u.protocol}//${u.host}/`;
                    postId = url.split("/post/")[1];

                    var { data, result } = await testLemmyCommunity(baseUrl, postId);
                }

                const favicon = await fetchFavicon(baseUrl);
                data = await fetchLemmyPostData(baseUrl, postId);

                if (!data) {
                    await reportCrash(client, "Newsify Command", { "ogUrl": ogUrl, "url": url }, err);
                }
                /**
                 * BUILD EMBED
                 */
                const embed = new EmbedBuilder()
                    .setAuthor({
                        name: formatCommunity(data.communityActor, data.communityTitle), // Autofill News Site -> dbzer0
                        URL: url,
                        iconURL: favicon
                    })
                    .setColor(16747008)
                    .setTitle(data.post_view.post.name || "Lemmy Post")
                    .setURL(url)
                    .setThumbnail(data.post_view.post.thumbnail_url)
                    // .setFooter({
                    //     text: message.author.globalName,
                    //     iconURL: message.author.avatarURL()
                    // })
                    .setTimestamp(new Date())
                    .addFields(
                        {
                            name: "Lemmy Post:", value:
                                `\n:arrow_up: ${data.postUpvotes} :arrow_down: ${data.postDownvotes}\n` +
                                `${ogUrl ? "Via: [" + ogUrl.substring(8) + "](" + ogUrl + ")\n" : ""}` +
                                `[${url.substring(8)}](${url}) • <t:${Date.parse(new Date(data.publishedDate)) / 1000}:f>\n\n` +
                                `${commentDataFormatted(data.topComments)}`
                        },
                        {
                            name: "Article", value:
                                `[${data.articleUrl.substring(8)}](${data.articleUrl})`
                        },
                        { name: "Article Content", value: data.snippet.content.substring(0, 1020) + " ..." }

                        // { name: "Article Content", value: (data.snippet.content ? data.snippet.content.substring(0, 1020) + " ...": data.snippet)}
                    );


                await interaction.editReply({ content: "", embeds: [embed] });
            } catch (err) {
                await reportCrash(client, "Newsify Command", { "ogUrl": ogUrl, "url": url }, err);
                await interaction.editReply({ content: "I broke! Report sent!" });
                console.error(err)
                console.error(JSON.stringify(data))
            }
        } else {
            console.log("Link NOT matched: " + match)
            await interaction.editReply({ content: "Resend with *only* the web url!" });
        }
    }
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
            obj.text = (obj.text).substring(0, 200) + " ..."
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
        console.log(articleUrl);
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
