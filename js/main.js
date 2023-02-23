var layer;
var element;
var form;
let newDataArr = [];
let callback = null;
layui.use(['element', 'layer', 'form'], function () {
    element = layui.element;
    layer = layui.layer;
    form = layui.form;
    setNotice();
    callback = setScore;
    let data = localStorage.getItem("valorant_book");
    if (data) {
        let tempData = JSON.parse(data);
        access_token = tempData.access_token;
        id_token = tempData.id_token;
        expires_in = tempData.expires_in;
        entitlements_token = tempData.entitlements_token;
        playerId = tempData.playerId;
        playerName = tempData.playerName;
        shopInfo = tempData.shopInfo;
        localStorage.clear();
        setShopInfo();
    } else {
        location.href = './index.html'
    }
    getRecentlyData((res) => {
        recentlyData = res.data.data;
        $(".match-content").html("");
        for (const data of recentlyData) {
            let html = $(".match-content").html();
            if (recentlyData.indexOf(data) == recentlyData.length - 1) {
                $(".match-content").html(`${html}<div class="bbs-detail bbs-last">
                <div class="bbs-avatar">
                    <img src="${data.mapIcon}"
                        alt="${data.mapName}">
                </div>
                <div class="bbs-info">
                    <div class="bbs-comment"> 
                        <h2>
                            ${data.mapName}
                        </h2>
                        <h3 style="color:${checkWin(data) ? "#00b41b" : "#ff1356"}">${checkWin(data) ? "胜利" : "失败"} ${data.matchInfo[0].numPoints}:${data.matchInfo[1].numPoints}</h3>
                        <div class="bbs-info-bottom">
                            <cite>时间：${formatDate(data.startTime)}</cite>
                        </div>
                    </div>
                </div>
                <div class="bbs-jingtie"> 
                    <a class="match-${recentlyData.indexOf(data)}" href="#"><span class="layui-badge layui-bg-black">点击查看详细</span></a>
                </div>
            </div>`)
            } else {
                $(".match-content").html(`${html}<div class="bbs-detail">
                <div class="bbs-avatar">
                <img src="${data.mapIcon}"
                    alt="${data.mapName}">
            </div>
            <div class="bbs-info">
                <div class="bbs-comment">
                    <h2>
                        ${data.mapName}
                    </h2>
                <h3 style="color:${checkWin(data) ? "#00b41b" : "#ff1356"}">${checkWin(data) ? "胜利" : "失败"} ${data.matchInfo[0].numPoints}:${data.matchInfo[1].numPoints}</h3>
                    <div class="bbs-info-bottom">
                        <cite>时间：${formatDate(data.startTime)}</cite>
                    </div>
                </div>
            </div>
            <div class="bbs-jingtie"> 
                <a class="match-${recentlyData.indexOf(data)}" href="#"><span class="layui-badge layui-bg-black">点击查看详细</span></a>
            </div>
            </div>`)
            }
        }


        for (let i = 0; i < recentlyData.length; i++) {
            let tempHtml1 = "";
            let tempHtml2 = "";
            let team1 = [];
            let team2 = []
            for (const playerInfo of recentlyData[i].players) {
                if (playerInfo.teamId == "Blue") {
                    team1.push(playerInfo);
                } else {
                    team2.push(playerInfo);
                }
            }
            team1.sort((a, b) => {
                return b.score - a.score;
            });
            team2.sort((a, b) => {
                return b.score - a.score;
            });
            for (const data of team1) {
                tempHtml1 += ` <tr>
                <td>${data.gameName}</td>
                <td> <img class="match-img" src="${data.characterIcon}"
                alt="${data.characterName}"></td>
                <td>${data.characterName}</td>
                <td>${data.kills}</td>
                <td>${data.deaths}</td>
                <td>${data.assists}</td>
                <td>${data.score}</td>
                <td>${data.accountLevel}</td>
              </tr>`
            }
            for (const data of team2) {
                tempHtml2 += ` <tr>
                <td>${data.gameName}</td>
                <td> <img class="match-img" src="${data.characterIcon}"
                alt="${data.characterName}"></td>
                <td>${data.characterName}</td>
                <td>${data.kills}</td>
                <td>${data.deaths}</td>
                <td>${data.assists}</td>
                <td>${data.score}</td>
                <td>${data.accountLevel}</td>
              </tr>`
            }
            $(`.match-${i}`).click(() => {
                layer.open({
                    title: `地图：${recentlyData[i].mapName} 开始时间：${formatDate(recentlyData[i].startTime)} 持续时间：${formatChineseSeconds(recentlyData[i].playTime / 1000)}`,
                    type: 1,
                    btn: ["关闭"],
                    area: [`${isPC() ? "850px" : "auto"}`, `${isPC() ? "750px" : "auto"}`],
                    content: `<div><h1 align="center" style="color:${checkWin(recentlyData[i]) ? "#00b41b" : "#ff1356"}">${checkWin(recentlyData[i]) ? "胜利" : "失败"} ${recentlyData[i].matchInfo[0].numPoints}:${recentlyData[i].matchInfo[1].numPoints}</h1><table class="layui-table">
                    <colgroup>
                    </colgroup>
                    <thead>
                      <tr>
                        <th>玩家名称</th>
                        <th>英雄头像</th>
                        <th>英雄名称</th>
                        <th>杀敌数量</th>
                        <th>死亡次数</th>
                        <th>助攻次数</th>
                        <th>获得分数</th>
                        <th>玩家等级</th>
                      </tr> 
                    </thead>
                    <tbody> 
                    ${tempHtml2}
                    <tr> <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                    ${tempHtml1}
                    </tbody>
                  </table></div>` //这里content是一个普通的String
                });
            });
        }
    });
    $(".hello-text").html(`欢迎你，${playerName}`)

    $("#shop").click(() => {
        $(".shop-header").removeClass("hide");
        $(".shop-content").removeClass("hide");
        $(".match-header").addClass("hide");
        $(".match-content").addClass("hide");
    });
    $("#match").click(() => {
        $(".match-header").removeClass("hide");
        $(".match-content").removeClass("hide");
        $(".shop-header").addClass("hide");
        $(".shop-content").addClass("hide");
    });

    function isPC() {
        let userAgentInfo = navigator.userAgent;
        let Agents = ["Android", "iPhone",
            "SymbianOS", "Windows Phone",
            "iPad", "iPod"];
        let flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false;
                break;
            }
        }
        return flag;
    }

    async function setShopInfo() {
        let index = layer.load(2);
        let shopDataArr = shopInfo.data.data.SkinsPanelLayout.SingleItemStoreOffers;
        newDataArr = [];
        for (const data of shopDataArr) {
            let temp = await getItemInfo(data);
            newDataArr.push(temp);
        }
        layer.close(index);
        $(".shop-content").html("");
        for (const data of newDataArr) {
            let html = $(".shop-content").html();
            if (newDataArr.indexOf(data) == newDataArr.length - 1) {
                $(".shop-content").html(`${html}<div class="bbs-detail bbs-last">
                <div class="bbs-avatar">
                    <img src="${data.displayIcon}"
                        alt="${data.displayName}">
                </div>
                <div class="bbs-info">
                    <div class="bbs-comment">
                        <h2>
                            ${data.displayName}
                        </h2>
                        <div class="bbs-info-bottom">
                            <cite>价格：${data.cost}</cite>
                        </div>
                    </div>
                </div>
                <div class="bbs-jingtie"> 
                    <a class="weapon-score-${newDataArr.indexOf(data)}" href="#"><span class="layui-badge layui-bg-black">${data.score == 0 ? "暂无评分" : `评分${data.score}`} </span></a>
                </div>
            </div>`)
            } else {
                $(".shop-content").html(`${html}<div class="bbs-detail">
                <div class="bbs-avatar">
                    <img src="${data.displayIcon}"
                        alt="${data.displayName}">
                </div>
                <div class="bbs-info">
                    <div class="bbs-comment">
                        <h2>
                            ${data.displayName}
                        </h2>
                        <div class="bbs-info-bottom">
                            <cite>价格：${data.cost}</cite>
                        </div>
                    </div>
                </div>
                <div class="bbs-jingtie"> 
                <a class="weapon-score-${newDataArr.indexOf(data)}" href="#"> <span class="layui-badge layui-bg-black">${data.score == 0 ? "暂无评分" : `评分${data.score}`} </span></a>
                </div>
            </div>`)
            }
        }

        for (let i = 0; i < newDataArr.length; i++) {
            $(`.weapon-score-${i}`).click(() => {
                setScore(i);
            });
        }

    }

    function checkWin(data) {
        let team = "";
        for (const player of data.players) {
            if (player.playerId == playerId) {
                team = player.teamId;
            }
        }
        for (const teamInfo of data.matchInfo) {
            if (teamInfo.teamId == team) {
                return teamInfo.won;
            }
        }
        return false;
    }

    function getItemInfo(data) {
        let temp = new Promise((resp) => {
            getWeaponInfo(data.OfferID, (res) => {
                let tempData = {
                    uuid: data.OfferID,
                    displayName: res.data.data.data.displayName,
                    displayIcon: res.data.data.data.displayIcon,
                    cost: data.Cost["85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741"]
                }
                getWeaponScore(data.OfferID, (res) => {
                    if (res == null) {
                        tempData.score = 0;
                    } else {
                        tempData.score = (res.data.data.star / res.data.data.times).toFixed(1);
                    }
                    resp(tempData);
                });
            });
        });
        return temp;
    }

    function setNotice() {
        getNotice((res) => {
            let msg = res.data.msg;
            $(".bbs-gonggao").html(msg);
        });
    }

    function setScore(index) {
        let data = newDataArr[index];
        layer.open({
            title: "评分",
            content: `为【${data.displayName}】进行评分`,
            btn: ["5分", "4分", "3分", "2分", "1分"],
            yes: function (index, layero) {
                layer.load(2);
                setWeaponScore(data.uuid, 5, (res) => {
                    if (res) {
                        $(`.weapon-score-${newDataArr.indexOf(data)} span`).html(`评分${(res.data.data.star / res.data.data.times).toFixed(1)}`)
                    }
                    layer.closeAll();
                });
            },
            btn2: function (index, layero) {
                layer.load(2);
                setWeaponScore(data.uuid, 4, (res) => {
                    if (res) {
                        $(`.weapon-score-${newDataArr.indexOf(data)} span`).html(`评分${(res.data.data.star / res.data.data.times).toFixed(1)}`)
                    }
                    layer.closeAll();
                });
            },
            btn3: function (index, layero) {
                layer.load(2);
                setWeaponScore(data.uuid, 3, (res) => {
                    if (res) {
                        $(`.weapon-score-${newDataArr.indexOf(data)} span`).html(`评分${(res.data.data.star / res.data.data.times).toFixed(1)}`)
                    }
                    layer.closeAll();
                });
            },
            btn4: function (index, layero) {
                layer.load(2);
                setWeaponScore(data.uuid, 2, (res) => {
                    if (res) {
                        $(`.weapon-score-${newDataArr.indexOf(data)} span`).html(`评分${(res.data.data.star / res.data.data.times).toFixed(1)}`)
                    }
                    layer.closeAll();
                });
            },
            btn5: function (index, layero) {
                layer.load(2);
                setWeaponScore(data.uuid, 1, (res) => {
                    if (res) {
                        $(`.weapon-score-${newDataArr.indexOf(data)} span`).html(`评分${(res.data.data.star / res.data.data.times).toFixed(1)}`)
                    }
                    layer.closeAll();
                });
            }
        });
    }

    function formatDate(timestamp) {
        let now = new Date(Number(timestamp));
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var date = now.getDate();
        var hour = now.getHours();
        var minute = now.getMinutes();
        var second = now.getSeconds();
        return year + "-" + month + "-" + date + "   " + hour + ":" + minute + ":" + second;
    }

    function formatChineseSeconds(value) {
        let result = parseInt(value)
        let h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
        let m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
        let s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));

        let res = '';
        if (h != 0) {
            res += `${h}时`;
        }
        res += `${m}分`;
        res += `${s}秒`;
        return res;
    }


});
$('.gotop').gototop({
    fadeInDelay: 1000,
    css: {
        bottom: '10ev',
    }
});
