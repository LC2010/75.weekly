var consoler = require('consoler');
var prompt = require('prompt');
var api = require('beer');

var promptSchema = {
    properties: {
        title: {
            description: 'ArticleTitle',
            type: 'string',
            required: true
        },
        url: {
            description: 'ArticleURL',
            type: 'string',
            required: true
        },
        reason: {
            description: 'RecommandReason',
            type: 'string',
            required: true
        },
        keywords: {
            description: 'Keywords',
            type: 'string',
            required: true
        },
        author: {
            description: 'AuthorName',
            type: 'string',
            required: true
        }
    }
};

function sendMessageForWeekly(info, callback) {
    var title = info.title;
    var url = info.url;
    var reason = info.reason;
    var keywords = info.keywords;
    var author = info.author;

    info = {
        title: title,
        url: url,
        description: reason,
        tags: keywords,
        provider: author        
    };

    api.post('http://www.75team.com/weekly/admin/article.php?action=add', {
        json: info
    }, function(err, ret) {
        var result = ret.body;
        console.log(result);
        if (result.errno == 0) return callback(null, info);
        return callback(result.errmsg);
    });
}

function startUp() {
    console.log([
        "",
        "请按照提示信息输入周刊信息："
    ].join('\n'));
    prompt.start();
    prompt.get(promptSchema, function (err, result) {
        if (err) return consoler.error(err);
        sendMessageForWeekly(result, function (err, ret) {
            if (err) return consoler.error(err);
            consoler.success('感谢您的投稿，' + ret.author + '。您的文章已经投递成功，文章标题为：' + ret.title);
            console.log([
                "",
                "如果不继续投稿请按^C退出命令行"
            ].join('\n'));
            startUp();
        });
    });    
}

exports = module.exports = function() {
    console.log('');
    consoler.align(4);
    consoler.info('75周刊命令行版本');
    startUp();
};