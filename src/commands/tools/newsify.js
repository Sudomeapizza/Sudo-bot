const { SlashCommandBuilder, InteractionContextType, MessageFlags, EmbedBuilder } = require('discord.js')
const cheerio = require('cheerio');
const { reportCrash } = require('../../helpers/crash');
const { getVideoDetails, fetchFavicon } = require('../../helpers/website')
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

var paragraphCount,commentCount

// "Lemmy", "Youtube", "3rd Party", "Pifed" etc...
var postOrigin;

module.exports = {
    category: 'tools',
    data: new SlashCommandBuilder()
        .setName('newsify')
        .setDescription("Newsify the site!")
        .addStringOption(option =>
            option.setName('url')
                .setDescription('full web url')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('paragraphcount')
                .setDescription('# of paragraphs from article (default 1 | 0..5)')
        )
        .addIntegerOption(option =>
            option.setName('commentcount')
                .setDescription('# of comments from lemmy (default 1 | 0..3)')
        )
        .addBooleanOption(option =>
            option.setName('silent')
                .setDescription('Invisible reply (Default false)')
        )
        .setContexts(
            InteractionContextType.BotDM,
            InteractionContextType.PrivateChannel,
            InteractionContextType.Guild
        ),
    async execute(interaction, client) {

        const silent = interaction.options.getBoolean('silent') ?? false;
        paragraphCount = interaction.options.getInteger('paragraphcount');
        commentCount = interaction.options.getInteger('commentcount');
        const targetUrl = interaction.options.getString('url');

        var message = await interaction.deferReply({
            flags: silent ? MessageFlags.Ephemeral : undefined,
            withResponse: true,
            content: "Parsing: ..."
        });

        (commentCount > 3) ? commentCount == 3: commentCount;
        (commentCount < 0) ? commentCount == 0: commentCount;
        (paragraphCount > 5) ? paragraphCount == 5: paragraphCount;
        (paragraphCount < 0) ? paragraphCount == 0: paragraphCount;


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
                postOrigin = "3rd Party"
                await interaction.editReply({ content: `Parsing news site: <${url}>` });

                const article = await fetchArticleSnippet(url, paragraphCount);
                var embed = 0;

                if (article !== "Could not fetch article.") {
                    embed = new EmbedBuilder()
                        .setAuthor({
                            name: article.articleNewsSite ?? "Missing Author",
                            URL: url,
                            iconURL: article.articleFavicon

                        })
                        .setColor(parseInt("580085", 16))
                        .setTitle(article.articleTitle ?? "Missing Title")
                        .setURL(url)
                        .setThumbnail(article.articlePreviewImage)
                        .setTimestamp(new Date())
                        .addFields(
                            {
                                name: "Article", value:
                                    `[${url.substring(8)}](${url})`
                            },
                            { name: "Article Content", value: (article.content ?? "Missing Content").substring(0, 1020) + " ..." }
                        );
                    await interaction.editReply({ content: "", embeds: [embed] });
                    return
                }

                await interaction.editReply({ content: "Invalid Post link" });
                return;
            }
            try {

                console.log("Posting Lemmy Newsify Post:")
                var ogData = await fetchLemmyPostData(baseUrl, postId);
                var ogBaseUrl = baseUrl;
                var ogPostId = postId;

                // var data,result = "";
                if (url != data.post_view.post.ap_id) {
                    ogUrl = url;
                    url = data.post_view.post.ap_id
                    u = new URL(url)
                    baseUrl = `${u.protocol}//${u.host}/`;
                    postId = url.split("/post/")[1];

                    var { data, result } = await testLemmyCommunity(baseUrl, postId);
                }
                var postData = ``;

                
                const favicon = await fetchFavicon(baseUrl);
                    console.log(`  Favicon: ` + favicon);
                // if lemmy
                
                if (!result) {
                    postOrigin = "Lemmy"
                    data = await fetchLemmyPostData(baseUrl, postId);
                } else {
                    postOrigin = "Pifed"
                    data = await fetchLemmyPostData(ogBaseUrl, ogPostId);
                }


                // data.snippet.content
                if (data == "Unable to grab pifed.social comments.") {
                    postData = data;
                } else if (!data) {
                    postData = "No post data found";
                    // await reportCrash(client, "Newsify Command", { "ogUrl": ogUrl, "url": url }, err);
                } else if (!data.snippet) {
                    postData = "Unable to grab post data";
                } else if (!data.snippet.content) {
                    postData = "Unable to grab post data content";
                } else {
                    postData = data.snippet.content.substring(0, 1020) + " ...";
                }

                var lemmypostData = 
                        // Post up/downvotes
                        `\n:arrow_up: ${ogData.postUpvotes} :arrow_down: ${ogData.postDownvotes}\n` +

                        // Display if post if referenced by another community
                        `${ogUrl ? "Via: [" + ogUrl.substring(8) + "](" + ogUrl + ")\n" : ""}` +

                        // Show time post was posted 
                        `[${url.substring(8)}](${url}) • <t:${Date.parse(new Date(ogData.publishedDate)) / 1000}:f>\n` +

                        // post Desc
                        `\n` +
                        `**Post Description:**\n${ogData.post_view.post.embed_description}\n`;

                var articleName = "";
                console.log(`  Article Title: ${data.snippet.articleTitle}\n  BaseUrl: ${baseUrl}`)
                if (postOrigin = "Pifed") {
                    articleName = `[${ogData.articleUrl.substring(8)}](${ogData.articleUrl})`
                } else if (data.articleUrl.substring(0, 16) === "https://youtu.be" || data.articleUrl.substring(0, 19) === "https://youtube.com") {
                    articleName = `[${data.snippet.articleTitle}](${data.articleUrl})`
                } else {
                    articleName = `[${data.articleUrl.substring(8)}](${data.articleUrl})`
                }

                console.log(`  Thumbnail: `+(data.post_view.post.thumbnail_url ?? data.snippet.articlePreviewImage ?? "https://http.cat/images/403.jpg"));

                /**
                 * BUILD EMBED
                 */
                const embed = new EmbedBuilder()
                    .setAuthor({
                        name: (postOrigin = "Pifed") ? formatCommunity(ogData.communityActor, ogData.communityTitle) : formatCommunity(data.communityActor, data.communityTitle), // Autofill News Site -> dbzer0
                        URL: url,
                        iconURL: favicon
                    })
                    .setColor(16747008)
                    .setTitle((postOrigin = "Pifed") ? ogData.post_view.post.name : (ogData.post_view.post.name ?? "Lemmy Post"))
                    .setURL(url)
                    .setThumbnail((postOrigin = "Pifed") ? ogData.post_view.post.thumbnail_url : (data.post_view.post.thumbnail_url ?? data.snippet.articlePreviewImage ?? "https://http.cat/images/403.jpg") ?? "https://http.cat/images/404.jpg")
                    // .setFooter({
                    //     text: message.author.globalName,
                    //     iconURL: message.author.avatarURL()
                    // })
                    .setTimestamp(new Date())
                    .addFields(
                        { name: "Lemmy Post:", value: lemmypostData },
                        { name: "Top Comments:", value: commentDataFormatted(data.topComments) },
                        { name: "Article", value: articleName }
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

async function testLemmyCommunity(baseUrl, postId) {
    // console.log("testing: `" + baseUrl + "` === `" + baseUrl.substring(0, 16) + "`")
    if (baseUrl.substring(0, 16) === "https://youtu.be" || baseUrl.substring(0, 19) === "https://youtube.com") {
        return { result: false }
    }
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
    if (!postRes.ok) console.error("Failed to fetch post");
    const postData = (!postRes.ok) ? "Failed to fetch post" : await postRes.json();

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

    //https://lemmy.dbzer0.com/post/57854507
    const url = `${baseUrl}api/v3/comment/list?post_id=${postId}&type_=All&sort=Top`;
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
        if (topComments.length >= commentCount) return { topComments };
    }
}

async function fetchLemmyPostData(baseUrl, postId) {

    const { postData, post_view, postUpvotes, postDownvotes, postCommentsCount, communityActor, communityName, communityTitle } =
        await fetchPost(baseUrl, postId);

    const { topComments } = await fetchPostComments(baseUrl, postId);

    const articleUrl = postData.post_view.post.url;
    const content = await fetchArticleSnippet(articleUrl, paragraphCount);

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
        communityTitle,
        embed_description: postData.post_view.post.embed_description
    };
}

async function fetchArticleSnippet(articleUrl, paraCount = 3) {
    try {
        // console.log(`articleurl:: ${articleUrl}`)
        if (articleUrl.substring(0, 16) === "https://youtu.be" || articleUrl.substring(0, 19) === "https://youtube.com") {
            const results = await getVideoDetails(articleUrl.substring(articleUrl.lastIndexOf("/") + 1));

            if (results.ok) {
                return {
                    articleNewsSite: "Youtube",
                    articleTitle: results.title,
                    articlePreviewImage: `https://img.youtube.com/vi/${articleUrl.substring(articleUrl.lastIndexOf("/") + 1)}/hqdefault.jpg`,
                    articleFavicon: fetchFavicon("https://youtube.com"),
                    content: results.description.substring(0, 250)
                };
            }
        }

        const res = await fetch(articleUrl);
        // console.log(articleUrl);
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
