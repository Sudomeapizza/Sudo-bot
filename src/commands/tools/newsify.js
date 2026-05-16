const { SlashCommandBuilder, InteractionContextType, MessageFlags, EmbedBuilder, ChannelType } = require('discord.js')
const cheerio = require('cheerio');
const { reportCrash } = require('../../helpers/crash');
const { getVideoDetails, fetchFavicon } = require('../../helpers/website');
const user = require('./user');
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

var paragraphCount,commentCount

// "Lemmy", "Youtube", "3rd Party", "Pifed" etc...
var site;

/** MERMAID.LIVE FLOWCHART
flowchart LR
    A[Get URL] -->
    A2{Test if the link is an https link via Regex} -->|OK| A3
        A2 -->|BAD| AB[Reply to user for only URL]
    A3[Disect Link properties and test Lemmy Community]-->
    
    A4{Test Link}
        A4 --> |Lemmy| B1[Lemmy]
        B1 --> C1[Grab Lemmy Info]

        A4 -->|Pifed| B2[Pifed]
        B2 --> C2[Grab Pifed Info]
        
        A4 -->|Youtube| B3[Youtube]
        B3 --> C3[Grab Youtube Info]
        
        A4 --> |Other| B4[General News site]
        B4 --> C4[Cheerio the site]
 */



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
        .addStringOption(option =>
            option.setName('usermsg')
                .setDescription('accompanying message')
        )
        .addStringOption(option =>
            option.setName('ping')
                .setDescription('wanna ping?')
        )
        // .addIntegerOption(option =>
        //     option.setName('paragraphcount')
        //         .setDescription('# of paragraphs from article (default 1 | 0..5)')
        // )
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

        // Options from command interaction
        var usermsg = interaction.options.getString('usermsg') ?? null;
        var pingmsg = interaction.options.getString('ping') ?? null;
        const silent = interaction.options.getBoolean('silent') ?? false;
        // paragraphCount = interaction.options.getInteger('paragraphcount') ?? 1;
        commentCount = interaction.options.getInteger('commentcount') ?? 1;
        var targetUrl = interaction.options.getString('url');
        var userEmbed, postEmbed, imageEmbed;
        const userProfile = await interaction.user.fetch();
        
        // Inferred settings from command interaction
        const isDM = [ChannelType.DM, ChannelType.GroupDM].includes(interaction.channel.type);
        
        // To-be-filled variable
        var embedList = [];
        
        var message = await interaction.reply({
            flags: (silent) ? MessageFlags.Ephemeral : undefined,
            // flags: MessageFlags.SuppressNotifications,
            withResponse: true,
            content: "Parsing News Site, Please wait..."
        });

        // If a message has been added, put who sent that message at the front:
        if (usermsg) {
            userEmbed = new EmbedBuilder()
                .setAuthor({
                    // Get User Display Name
                    name: userProfile.globalName,
                    iconURL: userProfile.displayAvatarURL()
                })
                // Get User Color? ... No workie atm...
                // .setColor(userProfile.hexAccentColor)
                .setDescription(usermsg);
        }

        // check bounds of comments to be 0..3
        (commentCount > 3) ? commentCount == 3: commentCount;
        (commentCount < 0) ? commentCount == 0: commentCount;
        
        // check bounds of paragraphs to be 0..5
        // (paragraphCount > 5) ? paragraphCount == 5: paragraphCount;
        // (paragraphCount < 0) ? paragraphCount == 0: paragraphCount;


        // Remove the `t.` for tesseract links
        targetUrl = targetUrl.replace("//t.","//");

        var match = targetUrl.match(/https?:\/\/[^\s]+/);
        if (match == targetUrl) {

            message = await interaction.editReply({

                withResponse: true,
                content: "Parsing: <" + match + "> ..."
            });

            

            var url = match[0];
            // was intended for general news sites, but breaks lemmy links...
            // url = (url.match("html") != null) ? url : url + "index.html"
            var u = new URL(url);
            var baseUrl = `${u.protocol}//${u.host}/`;
            try {
                var postId = url.match(`([0-9]{6,10})`)[0];
            } catch (e) { var postId = null; }
            // var ogUrl = "";

            // console.log(`URL: ${url}`)
            // console.log(`Post ID: ${postId}`)

            var { data, result, siteType } = await testURL(baseUrl, postId);

            if (siteType === "Lemmy") {
                // console.log("verified Lemmy")
                site = "Lemmy"
                data = await fetchLemmyPostData(baseUrl, postId);
            } else if (siteType === "Pifed") {
                // console.log("verified Pifed")
                site = "Pifed"
                data = await fetchLemmyPostData(baseUrl, postId);
            } else if (siteType === "generic") {
                site = "Generic"
                // data = await fetchLemmyPostData(baseUrl, postId);
            } else {
                console.log("wtf: " + siteType)
            }

            console.log(`Creating Newsify Post. Type: ${siteType}`);

            // Test if Lemmy Community
            if (siteType == "generic") {
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
                        .setImage(article.articlePreviewImage)
                        .setTimestamp(new Date())
                        .addFields(
                        );
                        
                        if (article.content) {
                            embed.addFields(
                                {
                                    name: "Article", value:
                                    `[${url.substring(8)}](${url})`
                                },
                                { 
                                    name: "Article Content",
                                    value: (article.content ?? "Missing Content").substring(0, 1020) + " ..."
                                }

                        )
                    }


                    await interaction.deleteReply({});
                    client.channels.cache.get(`${interaction.channelId}`).send({
                        flags: silent ? MessageFlags.Ephemeral : undefined,
                        content: usermsg,
                        embeds: [embed] });


                    // await interaction.editReply({ content: usermsg, embeds: [embed] });
                    return
                }

                await interaction.editReply({ content: "Invalid Post link" });
                return;
            }
            try {
                
                var postData = ``;

                
                const favicon = await fetchFavicon(baseUrl);
                    console.log(`  Favicon: ` + favicon);


                // what is this???


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
                    `\n:arrow_up: ${data.postUpvotes} :arrow_down: ${data.postDownvotes}\n` +

                    // Show time post was posted 
                    `[${url.substring(8)}](${url}) • <t:${Date.parse(new Date(data.publishedDate)) / 1000}:f>\n`;

                if (data.embed_description){
                    if (data.embed_description.length > 500) {
                        lemmypostData +=
                        // post Desc
                        `\n` +
                        `**Post Description:**\n${data.embed_description.substring(0, 500) + " ..."}\n`;
                    } else {
                        lemmypostData +=
                        // post Desc
                        `\n` +
                        `**Post Description:**\n${data.embed_description}\n`;
                    }
                }

                var articleName = "";

                if (data.articleUrl){
                    console.log("ArticleName")
                    articleName = `[${data.articleUrl.substring(8)}](${data.articleUrl})`
                } else if (data.snippet) {
                    console.log("ArticleSnippet")
                    articleName = `[${data.snippet.articleTitle}](${data.articleUrl})`
                }


                // var postThumbnail = data.thumbnail_url ?? data.snippet.articlePreviewImage ?? null;
                var postThumbnail = data.thumbnail_url ?? "";
                
                if (data.snippet) {console.log(`  Thumbnail: `+ postThumbnail)};
            
                const imageURLRegex = /\.(webp|png|jpg|gif|avif|heif)/i;
                const isImage = (data.post_view.post.url != null) ? data.post_view.post.url.match(imageURLRegex) : false;
                console.log("post url: "+ data.post_view.post.url)

                postEmbed = new EmbedBuilder()
                    .setAuthor({
                        name: formatCommunity(data.communityActor, data.communityTitle), // Autofill News Site -> dbzer0
                        URL: url,
                        iconURL: (data.favicon ?? favicon)
                    })
                    .setColor(16747008)
                    .setTitle((data.postName ?? "Lemmy Post"))
                    .setURL(url)
                    .setTimestamp(new Date())
                    .addFields(
                        { name: `${site} Post:`, value: lemmypostData }
                    );

                if (isImage) {
                    console.log("adding image to post");
                    postEmbed.setImage(data.post_view.post.url);
                }
                
                if (postThumbnail) {
                    postEmbed.setThumbnail(postThumbnail);
                }
                
                if (commentCount > 0) {
                    postEmbed.addFields(
                        { name: "Top Comments:", value: (data.topComments) ? commentDataFormatted(data.topComments) : "No replies on this post" }
                    )
                }
                
                if (data.snippet && paragraphCount > 0 && !isImage) {
                    postEmbed.addFields(
                        { name: "Article", value: articleName }
                    )
                }
                
                
                embedList.push(postEmbed);

                if (usermsg) embedList.push(userEmbed);

                if (!isDM) {
                    await interaction.deleteReply({});
                    client.channels.cache.get(`${interaction.channelId}`).send({
                            content: pingmsg,
                            flags: silent ? MessageFlags.Ephemeral : undefined,
                            embeds: embedList });
                } else {
                    await interaction.editReply({
                            content: pingmsg,
                            flags: silent ? MessageFlags.Ephemeral : undefined,
                            embeds: embedList });
                }


                // await interaction.editReply({ content: usermsg, embeds: [embed] });
            } catch (err) {
                await reportCrash(client, "Newsify Command", { /*"ogUrl": ogUrl,*/ "url": url }, err);
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

async function testURL(baseUrl, postId) {
    var apiUrl, res, postData;
    
    /**
     * If no postID
     *      Test for YT
     *  else default webpage
     * else test lemmy api
     * else test pifed api
     * else test kbin api???
     * 
     */

    if (!postId){
        if (baseUrl.substring(0, 16) === "https://youtu.be" || baseUrl.substring(0, 19) === "https://youtube.com") {
            return { result: false, siteType: "youtube", data: null}
        }
    } else {

        // test lemmy

        // NOT ABLE TO TEST FOR BROKEN/FALSE LINKS, ONLY TESTING FOR DOMAIN LEVEL
        apiUrl = `${baseUrl}api/v3/post?id=${postId}`;

        console.log(`---- ${baseUrl}`)

        console.log("Testing Lemmy: " + apiUrl);
        res = await fetch(apiUrl);

        // postData = await res.json();

        try {
            // if (postData.post_view != null) {
            if (baseUrl == "https://lemmy.dbzer0.com/") {
                console.log("Lemmy");
                postData = await res.json();
                return {
                    result: res.ok,
                    siteType: "Lemmy",
                    data: postData
                };
            }
        } catch (err) {}

        // else test pifed

        apiUrl = `${baseUrl}api/alpha/post?id=${postId}`;
        console.log("Testing Pifed: " + apiUrl);
        res = await fetch(apiUrl);

        try {
            if (postData.post_view != null) {
                console.log("Pifed");
                postData = await res.json();
                
                return {
                    result: res.ok,
                    siteType: "Pifed",
                    data: postData
                };
            }
        } catch (err) {}
    }

    return {
        result: false,
        siteType: "generic",
        data: postData
    };
}

async function fetchPost(baseUrl, postId) {
    const postRes = await fetch(`${baseUrl}api/${(site==="Pifed")?"alpha":"v3"}/post?id=${postId}`);
    console.log(`  ${baseUrl}api/${(site==="Pifed")?"alpha":"v3"}/post?id=${postId}`)
    if (!postRes.ok) console.error("Failed to fetch post");
    const postData = (!postRes.ok) ? "Failed to fetch post" : await postRes.json();

    if (site === "Pifed") {
        console.log("   is pifed: " + site)
        return {
            postData,
            post_view: postData.post_view,
            postUpvotes: postData.post_view.counts.upvotes,
            postDownvotes: postData.post_view.counts.downvotes,
            postCommentsCount: postData.post_view.counts.comments,
            communityName: postData.post_view.community.name,
            communityTitle: postData.post_view.community.title,
            communityActor: postData.post_view.community.actor_id,
            publishedDate: postData.post_view.counts.published,
            embed_description: postData.post_view.post.body,
            thumbnail_url: postData.post_view.post.thumbnail_url,
            postName: postData.post_view.post.title,
            apId: postData.post_view.post.ap_id,
            favicon: postData.post_view.community.icon
        }
    } else {
        console.log("   is NOT pifed: " + site)
        return {
            postData,
            post_view: postData.post_view,
            postUpvotes: postData.post_view.counts.upvotes,
            postDownvotes: postData.post_view.counts.downvotes,
            postCommentsCount: postData.post_view.counts.comments,
            communityName: postData.post_view.community.name,
            communityTitle: postData.post_view.community.title,
            communityActor: postData.post_view.community.actor_id,
            publishedDate: postData.post_view.counts.published,
            embed_description: postData.post_view.post.embed_description ?? 
                postData.post_view.post.body,
            thumbnail_url: postData.post_view.post.thumbnail_url,
            postName: postData.post_view.post.name,
            apId: postData.post_view.post.ap_id
        }
    }
}

async function fetchPostComments(baseUrl, postId) {

    //https://lemmy.dbzer0.com/post/57854507
    const url = `${baseUrl}api/${(site=="Pifed")?"alpha":"v3"}/comment/list?post_id=${postId}&type_=All&sort=Top`;
    console.log(`  ${baseUrl}api/${(site=="Pifed")?"alpha":"v3"}/comment/list?post_id=${postId}&type_=All&sort=Top`)
    const res = await fetch(url);
    const data = await res.json();
    const comments = data.comments || [];
    var topComments = [];

    if (!comments) return topComments;

    if (commentCount === 0) return topComments;

    if  (site === "Pifed") {
        for (const c of comments) {
            topComments.push({
                author: c.creator?.user_name || "NA",
                actor_id: c.creator?.actor_id || "NA",
                text: c.comment?.body || "NA",
                upvotes: c.counts?.upvotes ?? 0,
                downvotes: c.counts?.downvotes ?? 0,
            });
            if (topComments.length >= commentCount) return { topComments };
        }
    } else {
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
}

async function fetchLemmyPostData(baseUrl, postId) {

    const { postData, post_view, postUpvotes, postDownvotes, postCommentsCount, communityActor, communityName,
        communityTitle, publishedDate, embed_description, thumbnail_url, postName, apId, favicon } =
        await fetchPost(baseUrl, postId);

    const { topComments } = await fetchPostComments(baseUrl, postId) ?? [];

    const articleUrl = postData.post_view.post.url;
    var content;
    if (articleUrl)
        content = await fetchArticleSnippet(articleUrl, paragraphCount);

    return {
        siteDomain: baseUrl,
        postId,
        post_view,
        publishedDate,
        postUpvotes,
        postDownvotes,
        postCommentsCount,
        topComments,
        articleUrl,
        snippet: content,
        communityActor,
        communityName,
        communityTitle,
        embed_description,
        thumbnail_url,
        postName,
        apId,
        favicon
    };
}

async function fetchArticleSnippet(articleUrl, paraCount) {
    var textSnippets = [];
    try {
        // console.log(`articleurl:: ${articleUrl}`)
        if (site === "youtube") {
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
        if (!res.ok) return "Could not fetch article.";

        const html = await res.text();
        const $ = cheerio.load(html);

        // === 1. Collect text from first N <p> tags ===
        // if (paraCount > 0) {
        //     $("p").each((i, el) => {
        //         if (i < paraCount) {
        //             const content = $(el).text().trim();
        //             if (content.length > 0) textSnippets.push(content);
        //         }
        //     });
        // }

        // Wish it workie, but don't
        // const content = $('h2').first().text() || $('.article-subtitle').text();

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
            // content: textSnippets.join("\n\n")
            content: ""
        };
    } catch (err) {
        console.error("Error in fetchArticleSnippet:", err);
        return "Error fetching article.";
    }
}
