let access_token = localStorage.getItem("access_token");
let id_token = "";
let expires_in = "";
let entitlements_token = "";
let playerId = "";
let choiceIndex = 2;
let playerName = "";
let shopInfo = null;
let recentlyData = null;
let user = "";
let apiUrl = "https://sh.whitedi.com/valorantApi/api"
// let apiUrl = "http://127.0.0.1:3406/api"
function getToken(userName, passWord, callback) {
    user = userName;
    axios.post(`${apiUrl}/login`, {
        userName: userName,
        passWord: passWord
    }).then((res) => {
        if (res.data.code == 200) {
            if (res.data.data.access_token) {
                access_token = res.data.data.access_token;
                id_token = res.data.data.id_token;
                expires_in = res.data.data.expires_in;
                entitlements_token = res.data.data.entitlements_token;
                playerId = res.data.data.playerId;
                playerName = res.data.data.playerName;
                getStore((res) => {
                    callback && callback("登录成功", res);
                });
            } else {
                callback && callback("输入验证码", res);
            }

        } else {
            callback && callback("帐号或者密码错误", null);
        }
    });
}

function getStore(callback) {
    axios.post(`${apiUrl}/getStore`, {
        playerId: playerId,
        access_token: access_token,
        entitlements_token: entitlements_token
    }).then((res) => {
        if (res.data.code == 200) {
            callback && callback(res);
        }
    });
}

function getWeaponInfo(weaponId, callback) {
    axios.post(`${apiUrl}/getWeaponByUUID`, {
        uuid: weaponId,
    }).then((res) => {
        if (res.data.code == 200) {
            callback && callback(res);
        }
    });
}

function getWeaponScore(weaponId, callback) {
    axios.post(`${apiUrl}/getWeaponScore`, {
        uuid: weaponId,
    }).then((res) => {
        if (res.data.code == 200) {
            callback && callback(res);
        } else {
            callback && callback(null);
        }
    });
}

function getNotice(callback) {
    axios.get("https://d.whitedi.com/valorant-book/notice/notice.json").then((res) => {
        callback && callback(res);
    });
}

function setWeaponScore(weaponId, score, callback) {
    axios.post(`${apiUrl}/setWeaponScore`, {
        uuid: weaponId,
        star: score
    }).then((res) => {
        if (res.data.code == 200) {
            callback && callback(res);
        } else {
            callback && callback(null);
        }
    });
}

function setWeaponScore(weaponId, score, callback) {
    axios.post(`${apiUrl}/setWeaponScore`, {
        uuid: weaponId,
        star: score
    }).then((res) => {
        if (res.data.code == 200) {
            callback && callback(res);
        } else {
            callback && callback(null);
        }
    });
}

function getRecentlyData(callback) {
    axios.post(`${apiUrl}/getRecentlyMatch`, {
        id: playerId,
        access_token: access_token,
        entitlements_token: entitlements_token,
        endIndex: 5,
    }).then((res) => {
        if (res.data.code == 200) {
            callback && callback(res);
        } else {
            callback && callback(null)
        }
    });
}

function putCode(code, callback) {
    axios.post(`${apiUrl}/putCode`, {
        userName: user,
        code: code,
    }).then((res) => {
        callback && callback(res);
        
    });
}