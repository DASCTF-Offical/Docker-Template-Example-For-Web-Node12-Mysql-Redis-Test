var express = require('express');
var router = express.Router();
const connection = require('../mysql');//导入mysq配置文件

// 创建一个connection连接
// https://www.jianshu.com/p/d7d1ea38b3a3
connection.connect(function(err) {
    if (err) {
        console.log('[query] - :' + err);
        return;
    }
    console.log('[mysql connection] succeed!'); // 如果连接成功 控制台输出 success 了
});

var redis = require('redis'),
    RDS_PORT = 6379,        //端口号
    RDS_HOST = '127.0.0.1',    //服务器IP
    RDS_PWD = 'root',
    RDS_OPTS = {auth_pass: RDS_PWD},            //设置项
    client = redis.createClient(RDS_PORT, RDS_HOST, RDS_OPTS);

client.on('ready',function(res){
    console.log('[redis connection] ready!');
});


/* GET home page. */
router.get('/', function(req, res, next) {
    var id = req.query.id;
    var sql = "select * from users where id = " + id;
    connection.query(sql, function(err, rows, fields) {
        if (err) {
            console.log('[query] - :' + err);
            return;
        }
        
        //测试 Redis
        client.set('testKey', 'HelloRedis');
        client.get('testKey', function(err, reply) {
            res.render('index', { 'title': 'Express', result: rows[0].id + "|" + rows[0].username, 'redis_result': reply});
        });
    });
});

module.exports = router;
