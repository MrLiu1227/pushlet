//设置全局服务器url
var serverUrl = "/cssOffice/";
//全局appJson信息，第一次加载桌面app会初始化
var g_appJsonData;
//全局userJson信息，第一次加载桌面app会初始化
var g_userJsonData;
// 面板app最大数量
var panelMaxApp = 24; 
//托盘app最大数量
var bottomMaxApp = 5;  
// 打开app的方式，1 单击， 2双击， 默认双击
var openAppType;

var loginFlag = 2;//1-已经登录 2-未登录
