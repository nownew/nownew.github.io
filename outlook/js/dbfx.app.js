DBFX.RegisterNamespace("DBFX.Dbsoft");
DBFX.RegisterNamespace("DBFX.Dbsoft.System");
DBFX.RegisterNamespace("DBFX.Dbsoft.System.Notification");
DBFX.RegisterNamespace("DBFX.Dbsoft.System.HomeIcon");
DBFX.RegisterNamespace("DBFX.Dbsoft.System.Advance");
DBFX.RegisterNamespace("DBFX.Dbsoft.System.Advance.QR");
DBFX.RegisterNamespace("DBFX.Dbsoft.System.Advance.CameraAdvance");
DBFX.RegisterNamespace("DBFX.Dbsoft.System.Advance.PickerImage");
DBFX.RegisterNamespace("DBFX.Dbsoft.System.Advance.PickerVideo");
DBFX.RegisterNamespace("DBFX.Dbsoft.System.Advance.TakeAndPickPhotos");
DBFX.RegisterNamespace("DBFX.Dbsoft.System.Advance.MessageAlarm");
DBFX.RegisterNamespace("DBFX.Dbsoft.System.Advance.RecordVideo");
DBFX.RegisterNamespace("DBFX.Dbsoft.System.Advance.IDCardScan");
DBFX.RegisterNamespace("DBFX.Dbsoft.System.ReceiveUDPData");
DBFX.RegisterNamespace("DBFX.Dbsoft.Device");
DBFX.RegisterNamespace("DBFX.Dbsoft.Device.Power");
DBFX.RegisterNamespace("DBFX.Dbsoft.Device.NFC");
DBFX.RegisterNamespace("DBFX.Dbsoft.Device.GPS");
DBFX.RegisterNamespace("DBFX.Dbsoft.Device.BlueTooth");
DBFX.RegisterNamespace("DBFX.Dbsoft.Device.BlueToothServer");
DBFX.RegisterNamespace("DBFX.Dbsoft.Device.Camera");
DBFX.RegisterNamespace("DBFX.Dbsoft.Device.GV_Sensor");
DBFX.RegisterNamespace("DBFX.Dbsoft.Device.Light");
DBFX.RegisterNamespace("DBFX.Dbsoft.Device.Display");
DBFX.RegisterNamespace("DBFX.Dbsoft.Device.Media");
DBFX.RegisterNamespace("DBFX.Dbsoft.Device.Media.Recorder");
DBFX.RegisterNamespace("DBFX.Dbsoft.Device.Media.Player");
DBFX.RegisterNamespace("DBFX.Dbsoft.Device.Media.RecordVideo");
DBFX.RegisterNamespace("DBFX.Dbsoft.Device.UsbSerial");
DBFX.RegisterNamespace("DBFX.Dbsoft.Network");
DBFX.RegisterNamespace("DBFX.Dbsoft.Network.UDPConnection");
DBFX.RegisterNamespace("DBFX.Dbsoft.Network.TCPConnection");
DBFX.RegisterNamespace("DBFX.Dbsoft.Network.HTTPConnection");
DBFX.RegisterNamespace("DBFX.Dbsoft.Storage");
DBFX.RegisterNamespace("DBFX.Dbsoft.Storage.FileObject");
DBFX.RegisterNamespace("DBFX.Dbsoft.Printer");
DBFX.RegisterNamespace("DBFX.Dbsoft.Pay");
DBFX.RegisterNamespace("DBFX.Dbsoft.Login");
DBFX.RegisterNamespace("DBFX.Dbsoft.MiniProgram");
DBFX.RegisterNamespace("Dbsoft");
DBFX.CallBack = new Object();

DBFX.CallBack.call = function (callBack)
{
    var name = "callback_" + new Date().getTime() + Math.round(Math.random() * 10000);
    DBFX.CallBack[name] = function (data) {
        callBack(data);
        delete DBFX.CallBack[name];
    }

    return "DBFX.CallBack." + name;
}

DBFX.Dbsoft.MiniProgram.Go = function (appid, path, exdata, mode, openid) {
    if (openid == undefined)
        openid = "gh_71299d3d69ec";
    WXSDK.NavToMiniProgram(openid, path, exdata);
}

DBFX.Dbsoft.System.setRuntimeMode=function(homeurl)
{

    if(Dbsoft!=undefined && Dbsoft.System!=undefined && Dbsoft.System.setRuntimeMode!=undefined)
        Dbsoft.System.setRuntimeMode(homeurl);


}

DBFX.Dbsoft.System.getRuntimeMode=function()
{
    var homeurl="https://lc.dbazure.cn";
    if(Dbsoft!=undefined && Dbsoft.System!=undefined && Dbsoft.System.getRuntimeMode!=undefined)
        homeurl=Dbsoft.System.getRuntimeMode();

    return homeurl;
}

/*
   显示通知标题和内容并打开界面传递Url参数
   Id 唯一标识
   Title 标题
   Content 内容
   Url 显示URL地址
*/

DBFX.Dbsoft.System.Notification.showNotification = function (id, title, content,mode) {

    if (Dbsoft.System!=undefined && Dbsoft.System.Notification != undefined)
    {
        if(mode==undefined)
            mode="1";
        Dbsoft.System.Notification.showNotification(id,title,content,mode);
    }

}


DBFX.Dbsoft.Network.UShare = function (title, descr, thumImage, webpageUrl) {

    if (typeof WXSDK != "undefined")
    {
        
        DBFX.Web.Controls.ShareSelector(title, descr, thumImage, webpageUrl);
        
    }
    else
    {
        Dbsoft.Network.UShare(title, descr, thumImage, webpageUrl)
    }

}

//
DBFX.Dbsoft.System.Notification.getDeviceToken = function ()
 {
    if (Dbsoft.System!=undefined && Dbsoft.System.Notification != undefined && Dbsoft.System.Notification.getDeviceToken != undefined) {
        var tokenb64 = Dbsoft.System.Notification.getDeviceToken();
        var u8array = Converter.Base64ToUint8Array(tokenb64);
        var tokenstr = "";
        for (var i = 0; i < u8array.length; i++) {
            var u8 = u8array[i].toString(16);
            if (u8 == "20")
                continue;
            if (u8.length < 2)
                u8 = "0" + u8;

            tokenstr += u8;

        }
        return tokenstr;
    }
    else
        return "";
}

/*
 添加快捷方式（图片base64）
 Title 标题
 Icon 图标（base64,图片PNG格式）
 Url 显示URL地址
*/
DBFX.Dbsoft.System.HomeIcon.addIcon = function (Title, Icon, Url) {
    Dbsoft.System.HomeIcon.addIcon(Title, Icon, Url);
}
/*
    添加快捷方式（图片URL）
    Title 标题
    IconUrl 图标Url
    Url 显示URL地址
*/
DBFX.Dbsoft.System.HomeIcon.addIconByIconUrl = function (Title, IconUrl, Url) {
    Dbsoft.System.HomeIcon.addIconByIconUrl(Title, IconUrl, Url);
}

/*
   打电话
   Phone 电话
*/
DBFX.Dbsoft.System.call = function (Phone) {
    Dbsoft.System.call(Phone);
}

/*
   发短信
   Phone 电话
   Message 内容
   返回值 : 返回1成功，0失败
*/
DBFX.Dbsoft.System.sendSms = function (Phone, Message) {
    Dbsoft.System.sendSms(Phone, Message);
}

/*
   注册接受短信
   callBack 回调函数名称
   phone 手机号
   content 短信内容
   datetime 时间
   返回值1注册成功，0此回调函数已经注册过
*/
DBFX.Dbsoft.System.registerReceiveSms = function (callback) {
    Dbsoft.System.registerReceiveSms(DBFX.CallBack.call(callBack));
}
/*
   取消注册接受短信
   callBack 回调函数名称
   返回值1取消成功，0没有发现此回调函数，2，没有调用过注册接口
*/
DBFX.Dbsoft.System.unRegisterReceiveSms = function (callback) {
    Dbsoft.System.unRegisterReceiveSms(DBFX.CallBack.call(callBack));
}

/*
   获取通讯录
   返回值 : 返回数据(json格式)
*/
DBFX.Dbsoft.System.getContacts = function () {
    Dbsoft.System.getContacts(DBFX.CallBack.call(callBack));
}

/*
   添加联系人到通讯录
   Name 名称
   Phone  电话
*/
DBFX.Dbsoft.System.addContact = function (Name, Phone) {
    Dbsoft.System.addContact(Name, Phone);
}

/*
   设置标题
   Flag  1,无标题，2自定义标题，3默认标题
   Title  标题
*/
DBFX.Dbsoft.System.setViewTitle = function (Flag, Title) {
    Dbsoft.System.setViewTitle(Flag, Title);
}

/*
   退出系统
*/
DBFX.Dbsoft.System.exitApp = function () {
    Dbsoft.System.exitApp();
}

/*
   清除缓存
*/
DBFX.Dbsoft.System.clearWebCache = function () {
    Dbsoft.System.clearWebCache();
}

/*
   刷新
*/
DBFX.Dbsoft.System.refreshWeb = function () {
    Dbsoft.System.refreshWeb();
}

/*
   手机按键监听
   Type 监听类别
   callBack  回调函数名称
   说明：Type类型说明
   82  手机菜单按键
   4  手机返回按键
*/
DBFX.Dbsoft.System.addKeyListener = function (Type, callBack) {
    Dbsoft.System.addKeyListener(Type, DBFX.CallBack.call(callBack));
}

/*
   GZIP压缩
   BaseStr  压缩字符串（Base64）
   返回值：压缩后的字符串（base64）
*/
DBFX.Dbsoft.System.gzip = function (BaseStr) {
    Dbsoft.System.gzip(BaseStr);
}

/*
   UNGZIP解压缩
   BaseStr  压缩字符串（Base64）
*/
DBFX.Dbsoft.System.ungzip = function (BaseStr) {
    Dbsoft.System.ungzip(BaseStr);
}

/*
   AES加密
   Key 密钥
   Data  加密字符串
   返回值：加密后的字符串
*/
DBFX.Dbsoft.System.encryptionByAES = function (Key, Data) {
    Dbsoft.System.encryptionByAES(Key, Data);
}


/*
   AES解密
   Key 密钥
   Data  解密字符串(base64)
*/
DBFX.Dbsoft.System.decryptionByAES = function (Key, Data) {
    Dbsoft.System.decryptionByAES(Key, Data);
}

/*
   复制
   Content 复制文本
   返回值：返回1 复制成功
*/
DBFX.Dbsoft.System.copy = function (Content) {
    Dbsoft.System.copy(Content);
}

/*
   粘贴
   Content 复制文本
   返回值：剪切板内容

*/
DBFX.Dbsoft.System.paste = function (Content) {
    Dbsoft.System.paste(Content);
}

/*
   保存系统配置
   Name 配置名称
   JsonString Json字符串
   返回值：返回值 1 保存成功0 保存失败
*/
DBFX.Dbsoft.System.saveConfiguration = function (Name, JsonString) {
    Dbsoft.System.saveConfiguration(Name, JsonString);
}

/*
   加载系统配置
   Name 配置名称
   返回值：返回值 json字符串
   备注：返回空字符串代表加载失败
*/
DBFX.Dbsoft.System.loadConfiguration = function (Name) {
    return Dbsoft.System.loadConfiguration(Name);
}

/*
   通过SSID和WIFI密码连接WIFI
   callBack 回调函数
   WifiCipherType  WIFI加密类型
   SSID WIFI SSID
   Passwd  WIFI密码
   返回值： 说明：WifiCipherType :0代表无密码，1代表WEP,2代表WPA
   enabled 1可用 0 不可用  connected  1已连接 0 未连接
*/
DBFX.Dbsoft.System.connectWifi = function (callBack, WifiCipherType, SSID, Passwd) {
    Dbsoft.System.connectWifi(DBFX.CallBack.call(callBack), WifiCipherType, SSID, Passwd);
}

/*
    扫码
    callBack	回调函数
*/
DBFX.Dbsoft.System.Advance.QR.scan = function (callBack,t) {

    if (Dbsoft.System.Advance.QR != undefined)
    {
        if (app.IsWechatRuntime == true) {

            Dbsoft.System.Advance.QR.scan(DBFX.CallBack.call(callBack),t);

        }
        else
        {
            Dbsoft.System.Advance.QR.scan(DBFX.CallBack.call(callBack));
        }
    }
    else
        if (Dbsoft.System.Advance.BarCodeScan != undefined)
            Dbsoft.System.Advance.BarCodeScan(DBFX.CallBack.call(callBack));
        else
            Dbsoft.System.Advance.barCodeScan(DBFX.CallBack.call(callBack));

}


DBFX.Dbsoft.System.Advance.QR.CreateMPQRCode = function (scene, page, cb,appid,version) {

    DBFX.Net.WebClient.ExecuteWebRequest("minprogram.ashx?cmd=2"+(appid==undefined?"":"&mpid="+appid), "GET", function (resp) {

        resp = JSON.parse(resp);
        if (resp.access_token != undefined)
        {
            version = (version == undefined ? "release" : version);
            var data = { page: (page == "" ? 'pages/index/index' : page), scene: scene, check_path:false , env_version: version }
            DBFX.Net.WebClient.ExecuteWebRequest("minprogram.ashx?cmd=3&token=" + resp.access_token, "POST", function (idata) {


                if (typeof (cb) == "function")
                    cb("data:image/png;base64," + idata);



            }, {}, JSON.stringify(data));

        }

    });

}


/*
    拍照上传
    callBack	回调函数
    UploadUrl  上传地址
    上传结果(json isupload=1上传成功，-1失败,-2 取消上传)
*/
DBFX.Dbsoft.System.Advance.CameraAdvance.start = function (callBack, UploadUrl) {

    if (Dbsoft.System.Advance.CameraAdvance != undefined)
        Dbsoft.System.Advance.CameraAdvance.start(DBFX.CallBack.call(callBack), UploadUrl);
    else {
        Dbsoft.System.Advance.cameraStart(DBFX.CallBack.call(callBack), UploadUrl, "", 0, 0);
    }
}

/*
    拍照上传(带参数)
    callBack	回调函数
    UploadUrl  上传地址
    MsgBody  Post请求参数（” MsgBody”为请求参数的名称）
    上传结果(json isupload=1上传成功，-1失败,-2 取消上传)
*/
DBFX.Dbsoft.System.Advance.CameraAdvance.start = function (callBack, UploadUrl, MsgBody)
{

    if(Dbsoft.System.Advance.CameraAdvance!=undefined)
        Dbsoft.System.Advance.CameraAdvance.start(DBFX.CallBack.call(callBack), UploadUrl, MsgBody);
    else
        Dbsoft.System.Advance.cameraStart(DBFX.CallBack.call(callBack), UploadUrl, MsgBody,0, 0);
}

/*
    检测新增加图片数量
    UploadUrl  上传地址
    返回值 : 整数
*/
DBFX.Dbsoft.System.Advance.PickerImage.checkCount = function (UploadUrl) {
    Dbsoft.System.Advance.PickerImage.checkCount(UploadUrl);
}

/*
    选择照片上传
    callBack  回调函数名称
    UploadUrl  上传地址
    上传结果(json isupload=1上传成功，-1失败)
*/
DBFX.Dbsoft.System.Advance.PickerImage.start = function (callBack, UploadUrl)
{
    if(Dbsoft.System.Advance.PickerImage!=undefined)
        Dbsoft.System.Advance.PickerImage.start(DBFX.CallBack.call(callBack), UploadUrl);
    else
        Dbsoft.System.Advance.pickingImage(DBFX.CallBack.call(callBack), UploadUrl,"",0,0);
}

/*
    选择照片上传(带有参数)
    callBack  回调函数名称
    UploadUrl  上传地址
    MsgBody  Post请求参数（” MsgBody”为请求参数的名称）
    上传结果(json isupload=1上传成功，-1失败)
*/
DBFX.Dbsoft.System.Advance.PickerImage.start = function (callBack, UploadUrl, MsgBody) {

    if (Dbsoft.System.Advance.PickerImage != undefined)
        Dbsoft.System.Advance.PickerImage.start(DBFX.CallBack.call(callBack), UploadUrl);
    else
        Dbsoft.System.Advance.pickingImage(DBFX.CallBack.call(callBack), UploadUrl, MsgBody, 0, 0);
}


/*
    选择照片上传(带有参数)
    callBack  回调函数名称
    UploadUrl  上传地址
    MsgBody  Post请求参数（” MsgBody”为请求参数的名称）
    上传结果(json isupload=1上传成功，-1失败)
*/
DBFX.Dbsoft.System.Advance.TakeAndPickPhotos.start = function (callBack, UploadUrl,w,h,croppermode,aspectratio) {

    if (Dbsoft.System.Advance.TakeAndPickPhotos != undefined)
        Dbsoft.System.Advance.TakeAndPickPhotos.start(DBFX.CallBack.call(callBack), UploadUrl, "{}");
    else
        Dbsoft.System.Advance.take2PickImage(DBFX.CallBack.call(callBack), UploadUrl,w,h,croppermode,aspectratio);
}


/*
    检测新增加视频数量
    UploadUrl  上传地址
    返回值 : 整数
*/
DBFX.Dbsoft.System.Advance.PickerVideo.checkCount = function (UploadUrl) {
    Dbsoft.System.Advance.PickerVideo.checkCount(UploadUrl);
}

/*
    选择视频上传
    callBack  回调函数名称
    UploadUrl  上传地址
    上传结果(json isupload=1上传成功，-1失败)
*/
DBFX.Dbsoft.System.Advance.PickerVideo.start = function (callBack, UploadUrl) {
    Dbsoft.System.Advance.PickerVideo.start(DBFX.CallBack.call(callBack), UploadUrl);
}

/*
    选择视频上传(带参数)
    callBack  回调函数名称
    UploadUrl  上传地址
    MsgBody  Post请求参数（” MsgBody”为请求参数的名称）
    上传结果(json isupload=1上传成功，-1失败)
*/
DBFX.Dbsoft.System.Advance.PickerVideo.start = function (callBack, UploadUrl, MsgBody) {
    Dbsoft.System.Advance.PickerVideo.start(DBFX.CallBack.call(callBack), UploadUrl, MsgBody);
}

/*
    消息提醒服务
    Phone 电话
    Flag 1启动服务，0停止服务
    返回值 : 返回值消息提醒服务启动成功，2服务停止成功，0启动失败，手机号不能为空
*/
DBFX.Dbsoft.System.Advance.MessageAlarm.startService = function (Phone, Flag) {
    Dbsoft.System.Advance.MessageAlarm.startService(Phone, Flag);
}

/*
    消息提醒界面
*/
DBFX.Dbsoft.System.Advance.MessageAlarm.startView = function () {
    Dbsoft.System.Advance.MessageAlarm.startView();
}

/*
    录视频上传
    callBack 回调函数名称
    UploadUrl  上传地址
    上传结果(json isupload=1上传成功，-1失败)
*/
DBFX.Dbsoft.System.Advance.RecordVideo.start = function (callBack, UploadUrl) {
    Dbsoft.System.Advance.RecordVideo.start(DBFX.CallBack.call(callBack), UploadUrl);
}

/*
    获取设备信息
    返回值 : 设备列表(json格式)
*/
DBFX.Dbsoft.Device.deviceInfos = function () {
    return Dbsoft.Device.deviceInfos();
}

/*
    Power（电源）注册获取电量
    callBack 回调函数名称
    返回值：返回值1注册成功，0此回调函数已经注册过
    level  当前电量   scale  总电量
*/
DBFX.Dbsoft.Device.Power.registerReceiveBattery = function (callback) {
    Dbsoft.Device.Power.registerReceiveBattery(DBFX.CallBack.call(callBack));
}

/*
    取消注册接受电量
    callBack 回调函数名称
    返回值 :返回值1取消成功，0没有发现此回调函数，2，没有调用过注册接口
*/
DBFX.Dbsoft.Device.Power.unRegisterReceiveBattery = function (callback) {
    Dbsoft.Device.Power.unRegisterReceiveBattery(DBFX.CallBack.call(callBack));
}

/*
    NFC（近场通信）打开NFC
    返回值 : 返回0不支持NFC,1NFC已打开，2打开NFC
*/
DBFX.Dbsoft.Device.NFC.open = function () {
    Dbsoft.Device.NFC.open();
}

/*
    读取NFC数据
    callBack 回调函数名称
    返回值 : 返回0不支持NFC,1NFC已打开，2打开NFC
    data 字符串（base64）
*/
DBFX.Dbsoft.Device.NFC.read = function (callback) {
    Dbsoft.Device.NFC.read(DBFX.CallBack.call(callBack));
}

/*
    写入NFC数据
    callBack 回调函数名称
    返回值 : 返回0不支持NFC,1NFC已打开，2打开NFC
    data 字符串（base64）
    result	整型，1成功，0失败
*/
DBFX.Dbsoft.Device.NFC.write = function (callBack, Data) {
    Dbsoft.Device.NFC.write(DBFX.CallBack.call(callBack), Data);
}

/*
    GPS（地理位置）读取GPS信息
    callBackGPSStatus 回调函数GPS状态
    callBackGPSLocation 回调函数GPS定位信息
    返回值：返回值1注册成功，0此回调函数已经注册过,3GPS已打开,4打开GPS,5取消打开GPS
    Status 0：当前GPS服务区外，1：当前GPS暂停服务，2：当前GPS可用
    lat 纬度  nlong 经度  speed  速度  naddr 海拔  time 时间(时间戳)
*/
DBFX.Dbsoft.Device.GPS.registerReceiveGPS = function (callBackGPSStatus, callBackGPSLocation) {
    Dbsoft.Device.GPS.registerReceiveGPS(callBackGPSStatus, callBackGPSLocation);
}

/*
    取消注册接受GPS
    callBackGPSStatus 回调函数GPS状态
    callBackGPSLocation 回调函数GPS定位信息
    返回值：返回值1注册成功，0此回调函数已经注册过,3GPS已打开,4打开GPS,5取消打开GPS
*/
DBFX.Dbsoft.Device.GPS.unRegisterReceiveGPS = function (callBackGPSStatus, callBackGPSLocation) {
    Dbsoft.Device.GPS.unRegisterReceiveGPS(callBackGPSStatus, callBackGPSLocation);
}

/*
    BlueTooth（蓝牙）
    callBack  回调函数名称
    回调参数名称 address  蓝牙地址
    返回值：返回值1注册成功，0此回调函数已经注册过,3GPS已打开,4打开GPS,5取消打开GPS
*/
DBFX.Dbsoft.Device.BlueTooth.openSetView = function (callBack) {
    Dbsoft.Device.BlueTooth.openSetView(DBFX.CallBack.call(callBack));
}

/*
    BlueTooth（蓝牙）
    Address 蓝牙地址
    回调参数名称 address  蓝牙地址
    返回值 : 返回句柄；-1初始化失败
*/
DBFX.Dbsoft.Device.BlueTooth.createObj = function (Address) {
    Dbsoft.Device.BlueTooth.createObj(Address);
}

/*
    蓝牙连接
    HandleFlag 句柄
    返回值：1成功，0失败,2未创建蓝牙对象
*/
DBFX.Dbsoft.Device.BlueTooth.connect = function (HandleFlag) {
    Dbsoft.Device.BlueTooth.connect(HandleFlag);
}

/*
    发送数据
    HandleFlag 句柄
    data 发送的数据
    返回值：1成功，0失败，-1异常,2未创建蓝牙对象
*/
DBFX.Dbsoft.Device.BlueTooth.send = function (HandleFlag, data) {
    Dbsoft.Device.BlueTooth.send(HandleFlag, data);
}

/*
    接受数据
    HandleFlag 句柄
    callBack 回调函数名称
    返回值：返回1无异常，2未创建蓝牙对象
    回调函数参数  data  响应数据
*/
DBFX.Dbsoft.Device.BlueTooth.receive = function (callBack, HandleFlag) {
    Dbsoft.Device.BlueTooth.receive(DBFX.CallBack.call(callBack), HandleFlag);
}

/*
    关闭蓝牙
    HandleFlag 句柄
    返回值：返回1关闭成功，0关闭失败
*/
DBFX.Dbsoft.Device.BlueTooth.close = function (HandleFlag) {
    Dbsoft.Device.BlueTooth.close(HandleFlag);
}

/*
    启动接受数据服务
    callBack 回调函数名称
    返回值 1启动成功，0失败，2已启动服务
    回调函数参数	data 结果(Base64)
*/
DBFX.Dbsoft.Device.BlueToothServer.accept = function (callBack) {
    Dbsoft.Device.BlueToothServer.accept(DBFX.CallBack.call(callBack));
}

/*
    关闭蓝牙服务
    HandleFlag 句柄
    返回值：返回1关闭成功，0关闭失败,2未启动接受数据服务
*/
DBFX.Dbsoft.Device.BlueToothServer.close = function () {
    Dbsoft.Device.BlueToothServer.close();
}

/*
    Camera（照相机）拍照
    callBack 回调函数名称
    AspectX 裁剪框比例X(横向)
    AspectY  裁剪框比例Y(纵向)
    OutputX  输出大小X(横向)
    OutputY  输出大小Y(纵向)
    返回值：1成功，0没有SD卡
    data 字符串（base64）
*/
DBFX.Dbsoft.Device.Camera.start = function (callBack, AspectX, AspectY, OutputX, OutputY,url)
{
    if(Dbsoft.Device.Camera.start!=undefined)
        Dbsoft.Device.Camera.start(DBFX.CallBack.call(callBack), AspectX, AspectY, OutputX, OutputY);

    if (Dbsoft.System.Advance.cameraStart != undefined)
    {
        if (url == undefined)
            url = "https://lc.dbazure.cn/wfs/wfs.ashx?AppId=" + app.CurrentApp.AppId + "&OwnerId=" + app.EnvironVariables.UId;

        if(OutputY==undefined )
            OutputY=0;

        if (OutputX == undefined)
            OutputX = 0;

        Dbsoft.System.Advance.cameraStart(DBFX.CallBack.call(callBack), url, '', OutputX, OutputY)

    }

}

DBFX.Dbsoft.System.Advance.TakePicture = function (cb, url, msgbody, w, h) {



}

/*
    GV_Sensor（重力感应）获取重力感应数据值
    callBack 回调函数名称
    回调函数参数 isEnable true 返回正常数据，false 没有数据
    X X轴重力值 Y Y轴重力值  Z Z轴重力值
*/
DBFX.Dbsoft.Device.GV_Sensor.getValue = function (callback) {
    Dbsoft.Device.GV_Sensor.getValue(DBFX.CallBack.call(callBack));
}

/*
    Light（闪光灯） 打开闪光灯
    返回值 1打开，0失败
*/
DBFX.Dbsoft.Device.Light.onLight = function () {
    Dbsoft.Device.Light.onLight();
}

/*
    Light（闪光灯） 关闭闪光灯
    返回值 1打开，0失败
*/
DBFX.Dbsoft.Device.Light.offLight = function () {
    Dbsoft.Device.Light.offLight();
}

/*
    Display（屏幕亮度）获取屏幕亮度模式
    返回值：-1获取失败,1.自动模式，0手动模式
*/
DBFX.Dbsoft.Device.Display.getModel = function () {
    Dbsoft.Device.Display.getModel();
}

/*
    获取屏幕亮度
    返回值：获取当前屏幕亮度值0-255，返回-1获取失败
*/
DBFX.Dbsoft.Device.Display.getBright = function () {
    Dbsoft.Device.Display.getBright();
}

/*
    设置屏幕亮度
    参数设置当前屏幕亮度值0-255,-1自动模式
    返回值：1设置成功，0设置失败
*/
DBFX.Dbsoft.Device.Display.setBright = function (Bright) {
    Dbsoft.Device.Display.setBright(Bright);
}

/*
    保存屏幕亮度
    参数设置当前屏幕亮度值0-255
    返回值：1保存成功 0保存失败
    说明：保存屏幕亮度使之生效
*/
DBFX.Dbsoft.Device.Display.saveBright = function (Bright) {
    Dbsoft.Device.Display.saveBright(Bright);
}

/*
    Media（媒体）Recorder(录音)
    开始录音
    callBack 回调函数名称
    返回值：返回值 1 正常录音 0 录音异常 -1上一次录音没有释放资源
    回调函数参数：duration 录音长度（毫秒）
                data  字符串（base64）
*/
DBFX.Dbsoft.Device.Media.Recorder.startRecord = function (callBack) {
    Dbsoft.Device.Media.Recorder.startRecord(DBFX.CallBack.call(callBack));
}

/*
    停止录音
    返回值 : 返回1停止成功 0，停止失败
*/
DBFX.Dbsoft.Device.Media.Recorder.stopRecord = function () {
    Dbsoft.Device.Media.Recorder.stopRecord();
}

/*
    开始录音(上传)
    callBack 回调函数名称
    UploadUrl  上传URL
    返回值：返回值 1 正常录音 0 录音异常 -1上一次录音没有释放资源
    回调函数参数：duration 录音长度（毫秒）
                status  1请求成功 0请求失败
                result 字符串（base64）
*/
DBFX.Dbsoft.Device.Media.Recorder.startRecordByU = function (callBack, UploadUrl) {
    Dbsoft.Device.Media.Recorder.startRecordByU(DBFX.CallBack.call(callBack), UploadUrl);
}

/*
    开始录音(上传带参数)
    callBack 回调函数名称
    UploadUrl  上传URL
    MsgBody  Post请求参数（” MsgBody”为请求参数的名称）
    返回值：返回值 1 正常录音 0 录音异常 -1上一次录音没有释放资源
    回调函数参数：duration 录音长度（毫秒）
                status  1请求成功 0请求失败
                result 字符串（base64）
*/
DBFX.Dbsoft.Device.Media.Recorder.startRecordByUM = function (callBack, UploadUrl, MsgBody) {
    Dbsoft.Device.Media.Recorder.startRecordByUM(DBFX.CallBack.call(callBack), UploadUrl, MsgBody);
}

/*
    开始录音(计时)
    callBack 回调函数名称
    Delay  录音时长（毫秒）
    返回值：返回值 1 正常录音 0 录音异常 -1上一次录音没有释放资源
    回调函数参数：duration 录音长度（毫秒）
                data 字符串（base64）
*/
DBFX.Dbsoft.Device.Media.Recorder.startRecordByD = function (callBack, Delay) {
    Dbsoft.Device.Media.Recorder.startRecordByD(DBFX.CallBack.call(callBack), Delay);
}

/*
    开始录音(计时) (上传)
    callBack 回调函数名称
    UploadUrl 上传URL
    Delay  录音时长（毫秒）
    返回值：返回值 1 正常录音 0 录音异常 -1上一次录音没有释放资源
    回调函数参数：duration 录音长度（毫秒）
                status 1请求成功 0请求失败
                result 字符串（base64）
*/
DBFX.Dbsoft.Device.Media.Recorder.startRecordByUD = function (callBack, UploadUrl, Delay) {
    Dbsoft.Device.Media.Recorder.startRecordByUD(DBFX.CallBack.call(callBack), UploadUrl, Delay);
}

/*
    开始录音(计时) (上传带参数)
    callBack 回调函数名称
    UploadUrl 上传URL
    Delay  录音时长（毫秒）
    MsgBody Post请求参数（” MsgBody”为请求参数的名称）
    返回值：返回值 1 正常录音 0 录音异常 -1上一次录音没有释放资源
    回调函数参数：duration 录音长度（毫秒）
                status 1请求成功 0请求失败
                result 字符串（base64）
*/
DBFX.Dbsoft.Device.Media.Recorder.startRecord = function (callBack, UploadUrl, Delay, MsgBody) {
    Dbsoft.Device.Media.Recorder.startRecord(DBFX.CallBack.call(callBack), UploadUrl, Delay, MsgBody);
}

/*
    Recorder(播放声音) 播放声音
    callBack 回调函数名称
    Data 字符串（base64）
    返回值：返回1 正常播放 ；-1上一次播放没有释放资源（调用停止播放接口）；-2播放异常
    回调函数参数：flag 1 正常播放 0 播放完成
                    -1上一次播放没有释放资源（调用停止播放接口）
*/
DBFX.Dbsoft.Device.Media.Player.play = function (callBack, Data) {
    Dbsoft.Device.Media.Player.play(DBFX.CallBack.call(callBack), Data);
}

/*
    停止播放
    返回值 : 返回1停止成功 0，停止失败
*/
DBFX.Dbsoft.Device.Media.Player.stop = function () {
    Dbsoft.Device.Media.Player.stop();
}

/*
    Video(录视频) 开始录视频
    callBack  回调函数名称
    返回值：返回值：1成功，0没有SD卡
    回调函数参数：duration  视频长度（毫秒）
                data 字符串（base64）
*/
DBFX.Dbsoft.Device.Media.RecordVideo.startRecord = function (callBack) {
    Dbsoft.Device.Media.RecordVideo.startRecord(DBFX.CallBack.call(callBack));
}

/*
    开始录视频(上传)
    callBack  回调函数名称
    UploadUrl 上传URL
    返回值：返回值：1成功，0没有SD卡
    回调函数参数：duration  视频长度（毫秒）
                status  1请求成功 0请求失败
                result 字符串（base64）
*/
DBFX.Dbsoft.Device.Media.RecordVideo.startRecord = function (callBack, UploadUrl) {
    Dbsoft.Device.Media.RecordVideo.startRecord(DBFX.CallBack.call(callBack), UploadUrl);
}

/*
    开始录视频(上传带参数)
    callBack  回调函数名称
    UploadUrl 上传URL
    MsgBody Post请求参数（” MsgBody”为请求参数的名称）
    返回值：返回值：1成功，0没有SD卡
    回调函数参数：duration  视频长度（毫秒）
                status  1请求成功 0请求失败
                result 字符串（base64）
*/
DBFX.Dbsoft.Device.Media.RecordVideo.startRecord = function (callBack, UploadUrl, MsgBody) {
    Dbsoft.Device.Media.RecordVideo.startRecord(DBFX.CallBack.call(callBack), UploadUrl, MsgBody);
}

/*
    USB串口通讯 串口通讯初始化（OTG）
    callBack  回调函数名称
    BaudRate 波段  115200 9600
    Databits 数据位数  默认 8
    Stopbits 停止位数 默认1
    Parity 校验 默认0 不校验
    返回值： 1注册成功
    回调函数参数：data (字节转Base64数据)
*/
DBFX.Dbsoft.Device.UsbSerial.initByOTG = function (callBack, BaudRate, Databits, Stopbits, Parity) {
    Dbsoft.Device.UsbSerial.initByOTG(DBFX.CallBack.call(callBack), BaudRate, Databits, Stopbits, Parity);
}

/*
    串口通讯写入数据（OTG）
    Data Base64数据
    返回值： 1发送成功 0串口未初始化
    回调函数参数：data (字节转Base64数据)
*/
DBFX.Dbsoft.Device.UsbSerial.writeByOTG = function (Data) {
    Dbsoft.Device.UsbSerial.writeByOTG(Data);
}

/*
    串口通讯初始化（ACCESSORY）
    callBack  回调函数名称
    BaudRate 波段  115200 9600
    Databits 数据位数  默认 8
    Stopbits 停止位数 默认1
    Parity 校验 默认0 不校验
    返回值： 1注册成功
    回调函数参数：data (字节转Base64数据)
*/
DBFX.Dbsoft.Device.UsbSerial.initByAccessory = function (callBack, BaudRate, Databits, Stopbits, Parity) {
    Dbsoft.Device.UsbSerial.initByAccessory(DBFX.CallBack.call(callBack), BaudRate, Databits, Stopbits, Parity);
}

/*
    串口通讯写入数据（ACCESSORY）
    Data Base64数据
    返回值： 1发送成功 0串口未初始化
*/
DBFX.Dbsoft.Device.UsbSerial.writeByAccessory = function (Data) {
    Dbsoft.Device.UsbSerial.writeByAccessory(Data);
}

/*
    Network（网络）UDPConnection 创建Socket对象
    返回值：整型（句柄），-2创建异常
    说明：创建socket并返回句柄
*/
DBFX.Dbsoft.Network.UDPConnection.createObj = function () {
    return Dbsoft.Network.UDPConnection.createObj();
}

/*
    创建Socket对象(端口)
    DstPort 端口
    返回值：整型（句柄），-1失败，-2创建异常
    说明：创建socket并返回句柄
*/
DBFX.Dbsoft.Network.UDPConnection.createObj = function (DstPort) {
    return Dbsoft.Network.UDPConnection.createObj(DstPort);
}

/*
    Socket发送数据
    HandleFlag  句柄
    DstAddress 地址
    DstPort  端口
    Data  发送的数据(base64)
    返回值：返回1发送成功，0发送异常,2未创建对象
*/
DBFX.Dbsoft.Network.UDPConnection.send = function (HandleFlag, DstAddress, DstPort, Data) {
    return Dbsoft.Network.UDPConnection.send(HandleFlag, DstAddress, DstPort, Data);
}

/*
    Socket接收数据
    HandleFlag  句柄
    DstAddress 地址
    DstPort  端口
    Data  发送的数据(base64)
    返回值：返回1发送成功，0发送异常,2未创建对象
*/
DBFX.Dbsoft.Network.UDPConnection.receive = function (callBack, HandleFlag) {
    return Dbsoft.Network.UDPConnection.receive(DBFX.CallBack.call(callBack), HandleFlag);
}

/*
    Socket关闭
    HandleFlag  句柄
    返回值：返回1关闭成功,0关闭异常，2未创建对象
*/
DBFX.Dbsoft.Network.UDPConnection.close = function (HandleFlag) {
    return Dbsoft.Network.UDPConnection.close(HandleFlag);
}

/*
    判断socket是否链接
    HandleFlag  句柄
    返回值：返回1关闭成功,0关闭异常，2未创建对象
*/
DBFX.Dbsoft.Network.UDPConnection.isConnect = function (HandleFlag) {
    return Dbsoft.Network.UDPConnection.isConnect(HandleFlag);
}

/*
    判断socket是否关闭
    HandleFlag  句柄
    返回值：返回1关闭成功,0关闭异常，2未创建对象
*/
DBFX.Dbsoft.Network.UDPConnection.isClose = function (HandleFlag) {
    return Dbsoft.Network.UDPConnection.isClose(HandleFlag);
}

/*
    TCPConnection 创建Socket对象
    判断socket是否关闭
    DstName 地址
    DstPort 端口
    返回值：整型（句柄），-2创建异常
    说明：创建socket并返回句柄
*/
DBFX.Dbsoft.Network.TCPConnection.createObj = function (DstName, DstName) {
    return Dbsoft.Network.TCPConnection.createObj(DstName, DstName);
}

/*
    创建Socket对象(端口)
    DstPort 端口
    返回值：整型（句柄），-1失败，-2创建异常
    说明：创建socket并返回句柄
*/
DBFX.Dbsoft.Network.TCPConnection.createObj = function (DstPort) {
    return Dbsoft.Network.TCPConnection.createObj(DstPort);
}

/*
    Socket请求
    HandleFlag 句柄
    callBack  回调函数
    Data  请求数据(base64)
    返回值：返回1发送成功，0发送异常,2未创建对象
    回调函数参数： data 接受数据(base64)
*/
DBFX.Dbsoft.Network.TCPConnection.execute = function (HandleFlag, callBack, Data) {
    return Dbsoft.Network.TCPConnection.execute(HandleFlag, DBFX.CallBack.call(callBack), Data);
}

/*
    Socket接收数据
    HandleFlag 句柄
    callBack  回调函数
    返回值：返回1发送成功，0发送异常,2未创建对象
    回调函数参数： data 接受数据(base64)
*/
DBFX.Dbsoft.Network.TCPConnection.accept = function (callBack, HandleFlag) {
    return Dbsoft.Network.TCPConnection.accept(DBFX.CallBack.call(callBack), HandleFlag);
}

/*
    Socket关闭
    HandleFlag 句柄
    返回值：返回1关闭成功,0关闭异常，2未创建对象
*/
DBFX.Dbsoft.Network.TCPConnection.close = function (HandleFlag) {
    return Dbsoft.Network.TCPConnection.close(HandleFlag);
}

/*
    判断socket是否链接
    HandleFlag 句柄
    返回值：返回1已连接,0未连接，2未创建蓝牙对象
*/
DBFX.Dbsoft.Network.TCPConnection.isConnect = function (HandleFlag) {
    return Dbsoft.Network.TCPConnection.isConnect(HandleFlag);
}

/*
    判断socket是否关闭
    HandleFlag 句柄
    返回值：返回1已连接,0未连接，2未创建蓝牙对象
*/
DBFX.Dbsoft.Network.TCPConnection.isClose = function (HandleFlag) {
    return Dbsoft.Network.TCPConnection.isClose(HandleFlag);
}

/*
    创建HTTP对象
    返回值：整型（句柄），-2创建异常
*/
DBFX.Dbsoft.Network.HTTPConnection.createObj = function () {
    return Dbsoft.Network.HTTPConnection.createObj();
}


/*
    设置HTTP 请求头
    HandleFlag	句柄
    Name	参数名称
    Value	参数值
    返回1成功，0失败2未创建对象
*/
DBFX.Dbsoft.Network.HTTPConnection.setHeader = function (HandleFlag, Name, Value) {
    return Dbsoft.Network.HTTPConnection.setHeader(HandleFlag, Name, Value);
}

/*
    添加HTTP 请求头
    HandleFlag	句柄
    Name	参数名称
    Value	参数值
    返回1成功，0失败2未创建对象
*/
DBFX.Dbsoft.Network.HTTPConnection.addHeader = function (HandleFlag, Name, Value) {
    return Dbsoft.Network.HTTPConnection.addHeader(HandleFlag, Name, Value);
}

/*
    添加HTTP 请求参数
    HandleFlag	句柄
    Name	参数名称
    Value	参数值
    返回1成功，0失败2未创建对象
*/
DBFX.Dbsoft.Network.HTTPConnection.addParam = function (HandleFlag, Name, Value) {
    return Dbsoft.Network.HTTPConnection.addParam(HandleFlag, Name, Value);
}

/*
   设置HTTP 方法
   HandleFlag	句柄
   Url	url地址
   Method	请求方法(“get”,”post”)

   返回1成功，0失败2未创建对象
*/
DBFX.Dbsoft.Network.HTTPConnection.setMethod = function (HandleFlag, Url, Method) {
    return Dbsoft.Network.HTTPConnection.setMethod(HandleFlag, Url, Method);
}

/*
   HTTP请求
   HandleFlag	句柄
   callBack	回调函数

   1发送成功，0发送异常,2未创建对象
*/
DBFX.Dbsoft.Network.HTTPConnection.execute = function (HandleFlag, callBack) {
    return Dbsoft.Network.HTTPConnection.execute(HandleFlag, DBFX.CallBack.call(callBack));
}

/*
   ReceiveUDPData 注册接收UDP回调方法
   Data UDP消息
   callBack	回调函数
   返回值：返回1注册成功，2回调方法已注册
   回调函数参数：data UDP数据
*/
DBFX.Dbsoft.System.ReceiveUDPData.registerReceiveUDPData = function (callBack, Data) {
    return Dbsoft.System.ReceiveUDPData.registerReceiveUDPData(DBFX.CallBack.call(callBack), Data);
}

/*
   ReceiveUDPData 注册接收UDP回调方法
   callBack	回调函数
   返回值：返回1取消成功，2回调方法未注册
*/
DBFX.Dbsoft.System.ReceiveUDPData.unRegisterReceiveUDPData = function (callBack) {
    return Dbsoft.System.ReceiveUDPData.unRegisterReceiveUDPData(DBFX.CallBack.call(callBack));
}

/*
   Storage（本地存储） 获取存储信息
   说明：存储信息(JSON格式)
*/
DBFX.Dbsoft.Storage.getInfo = function () {
    return Dbsoft.Storage.getInfo();
}

/*
    获取文件夹目录
    Filepath 文件夹绝对路径
    返回值：返回目录(json格式)
*/
DBFX.Dbsoft.Storage.getFiles = function (Filepath) {
    return Dbsoft.Storage.getFiles(Filepath);
}

/*
    创建文件
    Filepath 文件绝对路径
    返回值：返回1 成功，2已存在，3创建文件夹失败，0失败,-1异常
*/
DBFX.Dbsoft.Storage.createFile = function (Filepath) {
    return Dbsoft.Storage.createFile(Filepath);
}

/*
    删除文件
    Filepath 文件绝对路径
    返回值：返回1 成功，0失败，2文件不存在
*/
DBFX.Dbsoft.Storage.deleteFile = function (Filepath) {
    return Dbsoft.Storage.deleteFile(Filepath);
}

/*
    读取文件
    Filepath 文件绝对路径
    返回值：返回字符串(base64)
*/
DBFX.Dbsoft.Storage.readFile = function (Filepath) {
    return Dbsoft.Storage.readFile(Filepath);
}

/*
    写入文件
    Filepath 文件绝对路径
     Data 数据(base64)
    返回值：返回值 1成功 -1异常，3 创建目录失败 2文件不存在
*/
DBFX.Dbsoft.Storage.writeFile = function (Filepath, Data) {
    return Dbsoft.Storage.writeFile(Filepath, Data);
}

/*
    创建文件夹
    Filepath 文件夹绝对路径
     Data 数据(base64)
    返回值：返回1 成功，2已存在，0失败
*/
DBFX.Dbsoft.Storage.createDir = function (Filepath) {
    return Dbsoft.Storage.createDir(Filepath);
}

/*
    删除文件夹
    Filepath 文件夹绝对路径
     Data 数据(base64)
    返回值：返回1 成功，0失败,2不存在
*/
DBFX.Dbsoft.Storage.deleteDir = function (Filepath) {
    return Dbsoft.Storage.deleteDir(Filepath);
}

/*
    文件管理对象（按句柄）创建文件对象
    返回值句柄
*/
DBFX.Dbsoft.Storage.FileObject.createObj = function () {
    return Dbsoft.Storage.FileObject.createObj();
}

/*
    创建文件
    HandleFlag 句柄
    Filepath 文件绝对路径
    返回值1 成功，2已存在，3创建文件夹失败,0失败,-1异常
*/
DBFX.Dbsoft.Storage.FileObject.createFile = function (HandleFlag, Filepath) {
    return Dbsoft.Storage.createFile.createObj(HandleFlag, Filepath);
}

/*
    删除文件
    HandleFlag 句柄
    返回值：返回值1.删除成功，0删除失败，4 未创建文件对象
*/
DBFX.Dbsoft.Storage.FileObject.deleteFile = function (HandleFlag) {
    return Dbsoft.Storage.createFile.deleteFile(HandleFlag);
}

/*
    读取文件
    HandleFlag 句柄
    返回值：返回字符串(base64)
*/
DBFX.Dbsoft.Storage.FileObject.readFile = function (HandleFlag) {
    return Dbsoft.Storage.createFile.readFile(HandleFlag);
}

/*
    写文件
    HandleFlag 句柄
    Data 数据(base64)
    返回值：返回值1.写入成功，0写入失败，4 未创建文件对象
*/
DBFX.Dbsoft.Storage.FileObject.writeFile = function (HandleFlag, Data) {
    return Dbsoft.Storage.createFile.writeFile(HandleFlag, Data);
}

/*
    Printer（打印） BlueToothPrinter（蓝牙打印机）
    蓝牙打印初始化
    callBack 回调函数名称
    10连接成功11连接失败;12蓝牙未连接;
*/
DBFX.Dbsoft.Printer.init = function (callBack) {
    return Dbsoft.Printer.init(DBFX.CallBack.call(callBack));
}

/*
    蓝牙打印
    callBack 回调函数名称
    Data  数据
    返回值：返回1正在打印，2未初始化打印机
    0打印成功;1打印失败;2蓝牙连接失败;3打印出错;-1未选择蓝牙打印机;
*/
DBFX.Dbsoft.Printer.print = function (callBack, Data) {
    return Dbsoft.Printer.print(DBFX.CallBack.call(callBack), Data);
}

//打印二维码
DBFX.Dbsoft.Printer.printCanvas = function (callBack, Data) {
    return Dbsoft.Printer.printCanvas(DBFX.CallBack.call(callBack), Data);
}


/*
    设置蓝牙打印
    返回值：返回1打开设置界面，返回2未初始化
*/
DBFX.Dbsoft.Printer.setPrinter = function () {
    return Dbsoft.Printer.setPrinter();
}

/*
    NetPrinter（网络打印机）
    网络打印设置
    备注：调用设置界面设置IP和端口
*/
DBFX.Dbsoft.Printer.setNetPrinter = function () {
    return Dbsoft.Printer.setNetPrinter();
}

/*
    网络打印
    callBack 回调函数名称
    Data 数据
    返回值：返回1网络打印机配置正确，0请先配置网络打印机
    0打印成功;1打印失败;
*/
DBFX.Dbsoft.Printer.printByNet = function (callBack, Data) {
    return Dbsoft.Printer.printByNet(DBFX.CallBack.call(callBack), Data);
}

/*
    IDCardScan（二代身份证扫描器）
    初始化
    callBack 回调函数名称
    返回值 1.初始化成功 2，已经初始化过,3不支持蓝牙 4打开蓝牙
    10连接成功11连接失败;12蓝牙未连接;
*/
DBFX.Dbsoft.System.Advance.IDCardScan.init = function (callBack) {
    return Dbsoft.System.Advance.IDCardScan.init(DBFX.CallBack.call(callBack));
}

/*
    读取信息
    callBack 回调函数名称
    返回值 ：返回1正在读取，2未初始化
    10连接成功11连接失败;12蓝牙未连接;
*/
DBFX.Dbsoft.System.Advance.IDCardScan.read = function (callBack) {
    return Dbsoft.System.Advance.IDCardScan.read(DBFX.CallBack.call(callBack));
}

/*
    设置
    callBack 回调函数名称
    返回值：返回1打开设置界面，返回2未初始化
*/
DBFX.Dbsoft.System.Advance.IDCardScan.setIDCardScan = function () {
    return Dbsoft.System.Advance.IDCardScan.setIDCardScan();
}

/*
    修复文件
    callBack 回调函数名称
    返回值：返回1修复成功，0失败，返回2未初始化
*/
DBFX.Dbsoft.System.Advance.IDCardScan.repairIDCardFile = function () {
    return Dbsoft.System.Advance.IDCardScan.repairIDCardFile();
}

/*
    Pay（支付）
    微信支付
    callBack 回调函数名称
    AppId appid
    PartnerId 商户号
    PrepayId  prepayId
    PackageValue packageValue
    NonceStr nonceStr
    Timestamp 时间戳
    Sign 签名
    回调函数参数：Code 支付状态码
                Str 支付说明
*/
DBFX.Dbsoft.Pay.WXPay = function (callBack, AppId, mchId, PrepayId, PackageValue, NonceStr, TimeStamp, Sign)
{
    if (Dbsoft.WxPay != undefined) {

        return Dbsoft.WxPay.wxPay(DBFX.CallBack.call(callBack), AppId, mchId, PrepayId, PackageValue, NonceStr, TimeStamp, Sign);
    }
    else {
        return Dbsoft.Pay.WXPay(DBFX.CallBack.call(callBack), AppId, mchId, PrepayId, PackageValue, NonceStr, TimeStamp, Sign);
    }
}

/*
    支付宝支付
    callBack 回调函数名称
    PayInfo 支付消息
    回调函数参数：status 支付状态
                info  支付信息
                memo  支付说明
*/
DBFX.Dbsoft.Pay.AliPay = function (callBack, PayInfo)
{
    if (Dbsoft.AliPay != undefined) {
        return Dbsoft.AliPay.aliPay(DBFX.CallBack.call(callBack), PayInfo);
    }
    else
        return Dbsoft.Pay.AliPay(DBFX.CallBack.call(callBack), PayInfo);
}

//微信登录
DBFX.Dbsoft.Login.WXLogin = function (callBack) {
    return Dbsoft.Login.WXLogin(DBFX.CallBack.call(callBack));
}

//检测微信是否存在
DBFX.Dbsoft.Login.CheckWXExist = function () {

    if (Dbsoft != undefined && Dbsoft.Login != undefined && Dbsoft.Login.CheckWXExist!=undefined)
        return Dbsoft.Login.CheckWXExist();
    else
        return false;

}


DBFX.Dbsoft.Device.GetDeviceId=function()
{
    var result = "";
    try {
       
        if (Dbsoft != undefined && Dbsoft.DeviceInfo != undefined) {
            result = Dbsoft.DeviceInfo.getDeviceId();
        }
        else {

            result = Dbsoft.Device.GetDeviceId();

        }
    } catch (ex) {
        //alert("getDeviceId:" + ex.toString());
    }
    return result;

}

//图片浏览器
DBFX.Dbsoft.System.ShowPictures = function (json) {

    Dbsoft.System.ShowPictures(json);

}

DBFX.Dbsoft.System.UploadImages = function (json) {

    return Dbsoft.System.UploadImages(json);

}


//******************************************
//*** entrypoint 应用程序入口点
//*** 加载应用程序视图
//***********************************************
function Application(entrypoint) {

    Object.defineProperty(Application, "constructor", { enumerable: false, value: DBFX.Application });
    Application.prototype.DynamicModules= new NamedArray();
    Application.prototype.RootVisual = null;
    Application.prototype.MainForm = new DBFX.Web.Controls.Control("MainForm");
    Application.prototype.MainForm.Controls = new Array();
    Application.prototype.MainForm.FormContext = new Object;
    Application.prototype.MainForm.FormContext.Form = Application.prototype.MainForm;
    Application.prototype.GlobalCommands = new Object();

    Application.prototype.GlobalCommands.Register = function (k, cb) {

        var cmd = DBFX.ComponentsModel.BaseCommand();
        cmd.CommandLine = cb;
        app.GlobalCommands[k] = cmd;


    }

    Application.prototype.StartUp = function () {

        //加载主题
        if(app.CoreType()!="WindowsPC")
            DBFX.Theme.LoadTheme("dbtheme");
        else
            DBFX.Theme.LoadTheme("dbtheme",1);

        //初始化应用程序环境变量
        this.EnvironVariables.Add("Host", document.location.host);
        this.EnvironVariables.Add("Path", document.location.pathname);
        this.EnvironVariables.Add("Url", document.location.href);
        var qs = document.location.search.substring(1, document.location.search.length);
        this.EnvironVariables.Add("QueryString", qs);
        var ks = qs.split("&");
        for (var i = 0; i < ks.length; i++) {

            var k = ks[i].split("=");

            if (k.length > 1)
                this.EnvironVariables.Add(k[0], k[1]);


        }


        if (Dbsoft.DeviceInfo != undefined) {
            this.EnvironVariables.Add("DeviceSN", Dbsoft.DeviceInfo.getDeviceSN());
            
        }
        
        //加载应用程序JSon设置
        var url = "";
        if (document.location.pathname == "/")
            url = document.location.href.split("?")[0] + "app.json";
        else
            url = document.location.href.replace(document.location.pathname+document.location.search, "/app.json");

        if(url.indexOf("?AppId=")>=0)
        {
            document.title="";
        }
        else
        {
            
            DBFX.Resources.LoadJSonResource(url, function (appsetting) {

                app.EnvironVariables.Add("AppTitle", appsetting["AppTitle"]);
                app.EnvironVariables.Add("AppName", appsetting["AppName"]);
                
                if(document.location.href.indexOf("sharepage.aspx")<0)
                    document.title = appsetting["AppTitle"];

                if (app.Platform() == "Windows_PC")
                {
                    document.body.style.backgroundImage = "url('" + appsetting.BackgroundImage.ImageUrl + "')";
                    document.body.style.backgroundSize = appsetting.BackgroundImage.Size;
                }

            });
        }

        this.RootVisual = document.getElementById("LayoutRoot");
        this.MainForm.VisualElement = this.RootVisual;
        this.MainForm.ClientDiv = this.MainForm.VisualElement;
        this.Scale = 1;
        this.RootVisual.onmousewheel = function (e) {

            if (event.ctrlKey == true) {

                //if (event.wheelDelta > 0)
                //    app.Scale += 0.5;
                //else
                //    app.Scale -= 0.5;
                app.Scale += event.wheelDelta * 0.01;

                e.preventDefault();

                if (Dbsoft != undefined && Dbsoft.System != undefined && Dbsoft.System.SetZoomLevel != undefined)
                    Dbsoft.System.SetZoomLevel(app.Scale.toString());
                
   
            }


        }

        window.InDBWebView = false;
        if (window.external != undefined && window.external.System != undefined) {
            Dbsoft = window.external;
            try {
                Dbsoft_System_loadConfigurationWeb = function (name) {
                    var cfg = window.localStorage.getItem(name);
                    if (cfg == null)
                        cfg = "";
                    return cfg;
                }

                Dbsoft_System_saveConfigurationWeb = function (name, jsonstring) {

                    window.localStorage.setItem(name, jsonstring);


                }

                app.EnvironVariables.Add("MAC", Dbsoft.System.GetMAC());
                app.EnvironVariables.Add("CPUID", Dbsoft.System.GetCPUID());
                app.EnvironVariables.Add("MBDID", Dbsoft.System.GetMBDID());
                app.EnvironVariables.Add("DeviceId", Dbsoft.System.GetMBDID() + Dbsoft.System.GetCPUID());


                if (Dbsoft.Printer.CreatePrintDocument == undefined) {

                    Dbsoft.Printer.CreatePrintDocument = function () {


                        return new DBFX.Printing.PrintDocument();



                    }

                }


            }
            catch (ex) { }

        }

        //初始化框架服务
        if (typeof Dbsoft == 'undefined' || Dbsoft.System==undefined) {

            Dbsoft = new Object();
            Dbsoft.System = new Object();
            Dbsoft.System.loadConfiguration = function (name) {
                try {
                    var cfg = window.localStorage.getItem(name);
                    if (cfg == null)
                        cfg = "";

                    return cfg;

                } catch (ex) { }

                return undefined;

            }

            Dbsoft.System.saveConfiguration = function (name, jsonstring) {

                try {
                    window.localStorage.setItem(name, jsonstring);
                } catch (ex) { }


            }

            Dbsoft.System.clearWebCache = function () {

            }

            Dbsoft.Printer = {};

            Dbsoft.Printer.CreatePrintDocument = function (title, fileType) {
                var iframe = document.createElement('IFRAME');
                iframe.setAttribute('style', 'position:absolute;width:0px;height:0px;left:-500px;top:-500px;');
                document.body.appendChild(iframe);
                var doc = iframe.contentWindow.document;
                var originTitle = document.title;
                // document.title = title;

                iframe.isPrinting = false;

                iframe.WriteHtmlData = function (htmlData) {
                    doc.write(htmlData);
                }

                iframe.Print = function () {
                    // doc.close();
                    iframe.ExecutePrint();
                }

                iframe.ShowDialog = function (title, printer) {
                    iframe.ExecutePrint();
                }

                iframe.ExecutePrint = function () {
                    if (iframe.isPrinting) return;
                    DBFX.Web.Controls.LoadingPanel.Show("正在生成打印文档！");
                    iframe.contentWindow.focus();

                    //超时处理


                    doc.body.onbeforeprint = function (ev) {
                        iframe.isPrinting = false;

                        console.log('onbeforeprint');
                    }

                    doc.body.onafterprint = function (ev) {
                        iframe.isPrinting = false;
                        doc.close();
                        // document.title = originTitle;
                        document.body.removeChild(iframe);
                        console.log('onafterprint');
                    }

                    var imageList = doc.body.querySelectorAll("img");
                    var imageUrls = [];
                    for (var i = 0; i < imageList.length; i++) {
                        imageUrls.push(imageList[i].src);
                    }

                    var j = 0;
                    function ImageLoaded(imgSrc, complete) {
                        var _img = new Image();
                        _img.src = imgSrc;
                        //图片加载完成
                        _img.onload = function () {
                            //判断是否加载到最后一个图片
                            if (j < imageUrls.length - 1) {
                                j++;
                                ImageLoaded(imageUrls[j], complete);
                            } else {
                                if (typeof complete == 'function') complete();
                            }
                        }

                        //图片加载失败
                        _img.onerror = function (event) {
                            console.log('图片加载失败');
                            //判断是否加载到最后一个图片
                            if (j < imageUrls.length - 1) {
                                j++;
                                ImageLoaded(imageUrls[j], complete);
                            } else {
                                if (typeof complete == 'function') complete();
                            }
                        }
                    }

                    ImageLoaded(imageUrls[j], function () {
                        DBFX.Web.Controls.LoadingPanel.Close();
                        console.log("图片全部加载完成！");
                        clearTimeout(timeID);
                        if (loadFlag == true) return;
                        iframe.contentWindow.print();
                    });

                    var loadFlag = false;
                    //加载超时处理
                    var timeID = setTimeout(function () {
                        loadFlag = true;
                        console.log('超时处理');
                        DBFX.Web.Controls.LoadingPanel.Close();
                        iframe.contentWindow.print();
                    }, 10000);

                }

                return iframe;
            }

            Dbsoft.Printer.ShowDialog = function (htmlData, title, fileType) {

                var pd = new Dbsoft.Printer.CreatePrintDocument("", "");
                pd.WriteHtmlData(htmlData);
                pd.ShowDialog(title, "");

            }


        }

        setTimeout(function () {

            if (typeof Dbsoft != 'undefined' && Dbsoft.System != undefined) {

                window.InDBWebView = true;
                //获取设备ID
                try {

                    //获取设备ID
                    var devid = DBFX.Dbsoft.Device.GetDeviceId();

                    if (devid != "")
                        app.EnvironVariables.Add("DeviceId", devid);
                    else
                        app.EnvironVariables.Add("DeviceId", "No DeviceId");





                } catch (ex) {

                    alert(ex.toString());
                }

            }

            if (Dbsoft.System.Advance == undefined) {
                Dbsoft.System.Advance = {};
                Dbsoft.System.Advance.makeVideoCall = function (uid, appId, rootName, title, iconImage, mode, w, h) {

                    if (mode == 0) {
                        DBFX.Web.NavControls.UIViewController.ActivedViewController.NavToUIView(undefined, "视频通话", function (uiView) {

                            var iframe = document.createElement("iframe");
                            iframe.style.display = "block";

                            iframe.style.position = "relative";
                            iframe.style.width = "100%";
                            iframe.style.height = "100%";
                            uiView.ControlDiv.appendChild(iframe);
                            var callurl = location.protocol + "//" + location.host + '/videocall/videocall.html?{"uid":"","appId":"' + appId + '","rootName":"' + rootName + '"}';
                            iframe.src = callurl;


                        });
                    } else {

                        var form = new DBFX.Web.Forms.Form("视频通话[" + rootName + "]", "", undefined);
                        if (w == undefined)
                            w = "640px";

                        if (h == undefined)
                            h = "480px";

                        form.Width = w;
                        form.Height = h;
                        var iframe = document.createElement("iframe");
                        iframe.style.display = "block";
                        iframe.style.position = "relative";
                        iframe.style.width = "100%";
                        iframe.style.height = "100%";
                        form.ClientDiv.appendChild(iframe);
                        var callurl = location.protocol + "//" + location.host + '/videocall/videocall.html?{"uid":"","appId":"' + appId + '","rootName":"' + rootName + '"}';
                        iframe.src = callurl;
                        form.ShowModal();
                    }
                }
            }


        }, 3000);

        try {

            app.EnvironVariables.CurrentPosition = {Longitude:0,Latitude:0,Speed:0};
            //注册位置服务
            if (window.InkstoneUserInfo == undefined && navigator.geolocation != undefined && Dbsoft.System==undefined)
            {
                
                //navigator.geolocation.watchPosition(function(pos){
                //    app.EnvironVariables.CurrentPosition = { Longitude: pos.coords.longitude, Latitude: pos.coords.latitude, Speed: pos.coords.speed };
                
                //},function(err)
                //{

                

                //});
                
            }

            app.M_I_D = 0;



        }catch(ex)
        {
            alert(ex.toString());
        }



        //禁止上下问菜单
        document.body.oncontextmenu = function (e) {

            if (!app.MainForm.IsAllowContextMenu && e.srcElement.tagName.toLowerCase() != "input")
                e.preventDefault();

        }

        //注册通用系统命令
        var formclose = new DBFX.ComponentsModel.BaseCommand();
        formclose.CommandLine = "DBFX_Form_Close";
        app.GlobalCommands["DBFX_Form_Close"] = formclose;

        window.DBFX_Form_Close = function (cmd) {
            cmd.Sender.FormContext.Form.CloseForm();
        }


        app.GlobalCommands.Register("Global_UIViewController_GoBack", function () {

            app.GoBack();

        });

        app.GlobalCommands.Register("UIViewController_GoBack", function () {

            app.GoBack();

        });

        //注册安全控制台
        app.GlobalCommands.Register("DBFX_Security_LoadConsole", DBFX.Security.LoadConsole);

        window.onpopstate = app.History.PopupState;

        //监听返回键
        app.IsEnabledBackKey = true;
        if (Dbsoft.System != undefined && Dbsoft.System.addKeyListener != undefined) {
            DBFX.Dbsoft.System.addKeyListener(4, function (e) {


            });
        }

        //初始化消息服务
        DBFX.Notifications.StartNotiSvc();

    }

    Application.prototype.MainForm.IsAllowContextMenu = false;

    Application.prototype.MainForm.EnableContextMenu = function () {

        Application.prototype.MainForm.IsAllowContextMenu = true;

    }

    Application.prototype.MainForm.AddControl = function (c) {


        c.FormContext = app.MainForm.FormContext;
        app.MainForm.VisualElement.appendChild(c.VisualElement);
        app.MainForm.Controls.Add(c);
        c.DataContext = app.MainForm.dataContext;


    }

    Application.prototype.MainForm.Remove = function (c) {

        app.MainForm.VisualElement.removeChild(c.VisualElement);
        app.MainForm.Controls.Remove(c);
    }

    Application.prototype.MainForm.Clear = function (e) {

        app.MainForm.VisualElement.innerHTML = "";
        app.MainForm.FormControls = new Object();
        app.MainForm.FormContext = new Object();
        app.MainForm.FormContext.Form = app.MainForm;

    }

    Application.prototype.MainForm.AddElement = function (e) {

        app.MainForm.VisualElement.appendChild(e);

    }

    Application.prototype.MainForm.RemoveElement = function (e) {

        app.MainForm.VisualElement.removeChild(e);

    }

    Application.prototype.MainForm.OnResize = function (e) {

        //LayoutRoot.style.minHeight = window.innerHeight + "px";
        
        LayoutRoot.style.height = "";
        LayoutRoot.style.minHeight = "";

    }

    Application.prototype.MainForm.OnLoad = function (e) {

        app.MainForm.Controls.forEach(function (c) {

            c.OnLoad();

        });

        if (app.MainForm.Load != undefined)
        {
            if (typeof app.MainForm.Load == "function")
                app.MainForm.Load();


            if (app.MainForm.Load.GetType() == "Command") {
                app.MainForm.Load.Sender = app.MainForm;
                app.MainForm.Load.Execute();
            }
        }

    }

    Application.prototype.MainForm.OnUnLoad = function () {
        app.MainForm.Load = undefined;
        app.MainForm.Controls.forEach(function (c) {

            c.OnUnLoad();

        });

        app.MainForm.Controls.Clear();

    }

    Application.prototype.Exit = function ()
    {
        this.RootVisual.innerHTML = "<H> Appliction Exit</H1>";

    }

    Application.prototype.EnvironVariables = new Object();
    
    Application.prototype.EnvironVariables.Contains = function (k) {

        var o=Application.prototype.EnvironVariables[k];
        return (o!=undefined);

    }

    Application.prototype.EnvironVariables.Add = function (k,v) {

        Application.prototype.EnvironVariables[k]=v;

    }

    Application.prototype.EnvironVariables.ParsingToString = function (str) {

        for (var k in app.EnvironVariables) {

            try{
                str = str.replace("%" + k.toLowerCase() + "%", app.EnvironVariables[k]);
            } catch (ex) { } finally { }


        }

        return str;

    }

    Application.prototype.GlobalCommands.Add = function (key, cmdline) {

        var cmd = new DBFX.ComponentsModel.BaseCommand(cmdline);
        app.GlobalCommands[key] = cmd;

    }

    //应用程序消息处理
    Application.prototype.Notifications = new Object();
    Application.prototype.Notifications.Filters = new Array();
    //
    Application.prototype.Notifications.AddFilter = function (msgid, callback,appid) {

        var filter = new Object();
        filter.MsgId = msgid;
        filter.Callback = callback;
        filter.AppId=appid;
        app.Notifications.Filters.push(filter);
        console.log("Add Filter:"+JSON.stringify(filter));
        return filter;

    }
    //
    Application.prototype.Notifications.RemoveFilter = function (filter) {

        app.Notifications.Filters.Remove(filter);

    }

    //处理应用程序消息
    Application.prototype.Notifications.PostMessage=function(m)
    {
        try{
             //调用消息处理函数
            //console.log("App PostMessage:"+JSON.stringify(m));
            console.log("App Notifications.Filters:"+app.Notifications.Filters.length);
            if(m.msgid!=undefined || m.appid!=undefined)
            {
                app.Notifications.Filters.forEach(function (filter)
                {
                    try{
                        console.log("App Filter:"+JSON.stringify(filter));
                        if(filter.MsgId.indexOf(m.msgid)>=0 && m.appid==filter.AppId && (filter.Callback != undefined && filter.Callback != undefined))
                        {
                            console.log("App PostMessage1:"+JSON.stringify(m));
                            filter.Callback(m);
                        
                        }
                        else
                        if(filter.Global==true && filter.Callback!=undefined)
                        {
                            //console.log("App PostMessage2:"+m);
                            filter.Callback(m);
                        }
                    }
                    catch(ex1)
                    {
                        console.log(ex1.toString());
                    }

                });
            }
            //TODO 显示到本地消息
            if(m.m!=undefined && m.m.toString()=="1")
            {
                DBFX.Dbsoft.System.Notification.showNotification(0,m.title,m.body,m.f);
            }

        }
        catch(ex2)
        {
            //console.log("App PostMessage3:"+ex2.toString());
        }
    }

    //
    Application.prototype.GetActionCode= function (code,cb) {

        var dareq = new DBFX.Data.DACrequest("SP_GLI_GetActionCodeContext", { code: code }, "DBAzure", "DB_Azure", function (daresp) {
            if (daresp.State == 0) {

                var act = daresp.DataObj;
                if (act.State == "-1") {

                    cb({ State: -1, Exception: "未找到对应的功能码！" });

                }
                else {

                    
                    cb(daresp.DataObj);

                }

            }
            else {

                cb({ State: -1, Exception: daresp.Exception });
            }

        });

        dareq.Execute();



    }
    
    //执行CodeAction
    Application.prototype.ExecuteCodeAction = function (code) {

        var r = false;
        //找到需要执行的动作的码
        if (code.indexOf("://") >= 0) {

            r = true;

            app.GetActionCode(code, function (resp) {

                var act = resp;
                if(act.ExData!=undefined)
                    app.EnvironVariables.Add("CodeActionData", act.ExData);

                app.ProcingCodeAction(act);


            });


        }

        return r;

    }

    //
    Application.prototype.ProcingCodeAction = function (act) {

        //如果码为应用自定义码，调用应用程序自定义处理程序
        if (act.Type == "ACC") {

            //判断应用是否初始化
            if (app.CurrentApp == undefined || app.CurrentApp.AppId != act.AppId) {
                //初始化完成
                app.InitializeApp(act.AppId, function () {


                    app.CurrentApp.CurrentAction = act;

                    var cb = undefined;
                    var cbisexisits = eval(act.Callback + "!=undefined");
                    if (cbisexisits)
                        eval("cb=" + act.Callback);

                    if (typeof (cb) == "function")
                        cb(act);
                    else
                        alert("回调方法不正确!");


                });
            }
            else {


                app.CurrentApp.CurrentAction = act;
                var cb = undefined;
                var cbisexisits = eval(act.Callback + "!=undefined");
                if (cbisexisits)
                    eval("cb=" + act.Callback);

                if (typeof (cb) == "function")
                    cb(act);
                else
                    alert("回调方法不正确!");

            }



        }
 

        //加载应用UI
        if (act.Type == "UI") {

            app.EnvironVariables.Add("CoId", act.CoId);
            app.EnvironVariables.Add("BuId", act.BuId);

            if (act.ExData != undefined)
                for (var k in act.ExData) {

                    if (Object.prototype[k] != undefined)
                        continue;

                    app.EnvironVariables.Add(k, act.ExData[k]);


                }



            //判断应用是否初始化
            if (app.CurrentApp == undefined || app.CurrentApp.AppId != act.AppId) {
                //初始化完成
                app.InitializeApp(act.AppId, function () {

                    //登录应用
                    app.CurrentApp.CurrentAction = act;
                    if (app.CurrentApp.login != undefined) {
                        app.CurrentApp.login(function () {
                            act = app.CurrentApp.CurrentAction;

                            var cb = undefined;
                            var cbisexisits = eval(act.Callback + "!=undefined");
                            if (cbisexisits)
                                eval("cb=" + act.Callback);

                            var onresume = undefined;
                            cbisexisits = eval(act.OnResume + "!=undefined");
                            if (cbisexisits)
                                eval("onresume=" + act.OnResume);

                            var resuri = app.EnvironVariables.ParsingToString(act.ResourceUri);
                            app.LoadAppResource(resuri, act.Text, act.ExData, 0, cb, onresume);

                        });
                    }

                });
            }
            else {

                //登录应用
                app.CurrentApp.CurrentAction = act;
                if (app.CurrentApp.login != undefined) {
                    app.CurrentApp.login(function () {
                        act = app.CurrentApp.CurrentAction;

                        var cb = undefined;
                        var cbisexisits = eval(act.Callback + "!=undefined");
                        if (cbisexisits)
                            eval("cb=" + act.Callback);

                        var onresume = undefined;
                        cbisexisits = eval(act.OnResume + "!=undefined");
                        if (cbisexisits)
                            eval("onresume=" + act.OnResume);

                        var resuri = app.EnvironVariables.ParsingToString(act.ResourceUri);
                        app.LoadAppResource(resuri, act.Text, act.ExData, 0, cb,onresume);

                    });
                }


            }

        }

        if (act.Type == "WIFI") {

            try {

                DBFX.Dbsoft.System.connectWifi(function (en) {

                    alert(en);

                }, act.WCType, act.SSID, act.Password)
            } catch (ex) {
                alert(ex.toString());
            }

        }

    }

    //初始化应用程序
    Application.prototype.InitializeApp = function (appid, cb, uiview) {

        //Unload CurrentAPP

        //DBFX.Web.Controls.LoadingPanel.Show();

        if (app.CurrentApp != undefined)
            app.HomeApp = app.CurrentApp;

        app.CurrentApp = { EnvironVariables: {} };
        app.CurrentApp.Modules = new Object();
        app.CurrentApp.ScriptLib = new Object();
        var cappid = appid;
        app.CurrentApp.AppId = cappid;
        app.EnvironVariables.Add("CurrentApp_Path", "apps/" + cappid);
        app.EnvironVariables.Add("CurrentApp_AppId", cappid);
        //加载应用程序附加脚本
        var appcurl = "apps/" + cappid + "/ResourceCode.json";
        DBFX.Resources.LoadJSonResource(appcurl, function (appcodes) {

            if (Array.isArray(appcodes.ResInfos)) {
                app.CurrentApp.AppCodes = new Object();
                appcodes.ResInfos.forEach(function (code) {

                    var ck = code.ResId.split(".")[0];
                    app.CurrentApp.AppCodes[ck] = code;

                    if (code.Flag == undefined || code.Flag == "1") {
                        var key = "Script_" + code.CodeBase.replace(".", "");
                        if (app.CurrentApp.ScriptLib[key] == undefined) {

                            app.CurrentApp.ScriptLib[key] = document.createElement("SCRIPT");
                            app.CurrentApp.ScriptLib[key].src = "apps/" + cappid + "/" + code.CodeBase;
                            document.body.appendChild(app.CurrentApp.ScriptLib[key]);

                        }
                    }

                });
            }

            //加载应用入口脚本
            var appscript = document.createElement("SCRIPT");
            appscript.src = "apps/" + cappid + "/M" + cappid + ".js";
            document.body.appendChild(appscript);
            app.CurrentApp.ScriptLib.Script_AppScript = appscript;

        });


        app.LoadingTimeOut = 15000;

        if(app.LoadingTimer!=undefined)
            clearInterval(app.LoadingTimer);

        //等待应用入口脚本加载
        app.LoadingTimer = setInterval(function () {
            try {

                app.LoadingTimeOut -= 100;


                //判断是否加载成功
                if (app.CurrentApp.startup != undefined) {

                    //清除计时器
                    clearInterval(app.LoadingTimer);
                    app.LoadingTimer=undefined;
                    //初始化入口函数
                    app.CurrentApp.startup(cb, uiview);

                    DBFX.Web.Controls.LoadingPanel.Close();

                }

                //判断初始化超时
                if (app.LoadingTimeOut <= 0) {

                    clearInterval(app.LoadingTimer);
                    app.LoadingTimer=undefined;
                    app.UnloadApp();
                    DBFX.Web.Controls.LoadingPanel.Close();

                }

            }
            catch (ex) {

                clearInterval(app.LoadingTimer);
                app.LoadingTimer=undefined;
                app.UnloadApp();
                DBFX.Web.Controls.LoadingPanel.Close();

            }
            finally { }
        }, 100);



    }

    //加载应用程序
    Application.prototype.LoadAppResource = function (uri, t, data, mode, cb, rcb) {

        if (uri == undefined || uri == null)
            return;

        try {
            if (data!=undefined && data.Params != undefined) {
                app.EnvironVariables.App_Params = data.Params;
            }

            uri = app.EnvironVariables.ParsingToString(uri);
            //加载应用程序
            if (uri.indexOf("app://") >= 0)
            {
                DBFX.Web.NavControls.UIViewController.ActivedViewController.NavToUIView(undefined, data.AppTitle, function (uiView)
                {
                    uiView.IsHideHeader = true;
                    //DBFX.Web.Controls.LoadingPanel.Show();
                    var cappid = uri.replace("app://", "");
                    app.InitializeApp(cappid, function ()
                    {
                        //登录应用

                        if (app.CurrentApp.login != undefined) {
                            app.CurrentApp.login(function ()
                            {

                                var uri = app.EnvironVariables.ParsingToString(app.CurrentApp.CurrentUser.WorkSpace.ResourceUri);
                                var text = app.CurrentApp.CurrentUser.WorkSpace.Text;

                                if ((text == undefined || text == "") && data != undefined)
                                    text = data.AppTitle;

                                var cb = undefined;
                                var cbisexisits = eval(app.CurrentApp.CurrentUser.WorkSpace.Callback + "!=undefined");
                                if (cbisexisits)
                                    eval("cb=" + app.CurrentApp.CurrentUser.WorkSpace.Callback);

                                //加载入口主界面
                                uiView.Text = text;
                                DBFX.Resources.LoadResource(uri, function (appUIView) {
                                    appUIView.Unload = app.UnloadApp;
                                    appUIView.IsHideHeader = true;

                                    if (cb != undefined)
                                        cb(appUIView);

                                }, uiView);
                            });
                        }
                        else {

                            //加载入口主界面
                            uri = app.CurrentApp.CurrentUser.WorkSpace.ResourceUri;
                            uiView.Text = app.CurrentApp.CurrentUser.WorkSpace.Text;
                            DBFX.Resources.LoadResource(uri, function (appUIView) {
                                appUIView.Unload = app.UnloadApp;
                                appUIView.IsHideHeader = true;

                                if (cb != undefined)
                                    cb(appUIView);

                            }, uiView);

                        }
                    },uiView);
                }, rcb);

            }
            else { //加载某个资源文件

                //移动设备视图控制器加载
                if (mode == 0) {
                    DBFX.Web.NavControls.UIViewController.ActivedViewController.NavToUIView(undefined, t, function (uiView) {
                        //DBFX.Web.Controls.LoadingPanel.Show();
                        DBFX.Resources.LoadResource(uri, function (appUIView) {

                            appUIView.DataContext = data;

                            if (cb != undefined)
                                cb(appUIView);

                        }, uiView);

                    }, rcb);
                }

                //大尺寸设备停靠管理器加载模式
                if (mode == 1) {

                    DBFX.Web.LayoutControls.DockManager.ActivedDockManager.LoadResource(t, t, 3, uri, function (dockcontent) {

                        dockcontent.UnloadCallback = rcb;

                        if (data != undefined)
                            dockcontent.DataContext = data;

                        if (cb != undefined)
                            cb(dockcontent);


                    });

                }


                //弹出式窗口加载模式
                if (mode == 2) {

                    var form = new DBFX.Web.Forms.Form(t, uri, function (form) {

                        if (data != undefined && data != null)
                            form.DataContext = data;

                        if (cb != undefined)
                            cb(form);

                    });
                    form.UnloadCallback = rcb;
                    form.ShowModal();

                }

                //整体页面切换模式
                if (mode == 3) {

                    if(DBFX.Web.NavControls.UIViewController.ActivedViewController==undefined)
                    {
                        if (app.MainForm.Unload != undefined && app.MainForm.Unload.GetType() == "Command") {
                            app.MainForm.Unload.Sender = uiView;
                            app.MainForm.Unload.Execute();
                        }
                        app.MainForm.OnUnLoad();
                        DBFX.Resources.LoadResource(uri, function (appUIView) {
                            //appUIView.IsHideHeader = true;
                            appUIView.DataContext = data;
                            if (cb != undefined)
                                cb(appUIView);

                        }, app.MainForm);

                    }
                    else
                    {
                        var uiView = DBFX.Web.NavControls.UIViewController.ActivedViewController.CurrentViewPanel;
                        if (uiView != undefined && uiView.UIViewController.HomeView != uiView)
                        {
                            if(uiView.Unload!=undefined && uiView.Unload.GetType()=="Command")
                            {
                                uiView.Unload.Sender=uiView;
                                uiView.Unload.Execute();
                            }

                            uiView.Resume=undefined;
                            DBFX.Resources.LoadResource(uri, function (appUIView) {
                                //appUIView.IsHideHeader = true;
                                appUIView.DataContext = data;
                                if (cb != undefined)
                                    cb(appUIView);

                            }, uiView);

                        }
                        else
                        {
                            DBFX.Web.NavControls.UIViewController.ActivedViewController.NavToUIView(undefined, t, function (uiView) {
                                //DBFX.Web.Controls.LoadingPanel.Show();
                                DBFX.Resources.LoadResource(uri, function (appUIView) {
                                    appUIView.Unload = app.UnloadApp;
                                    appUIView.IsHideHeader = true;
                                    appUIView.DataContext = data;
                                    if (cb != undefined)
                                        cb(appUIView);

                                }, uiView);

                            }, rcb);
                        }
                    }
                }

                //大尺寸设备停靠管理器加载模式
                if (mode == 4) {

                    DBFX.Web.LayoutControls.DockManager.ActivedDockManager.LoadResource(uri, t, 3, uri, function (dockcontent) {

                        dockcontent.UnloadCallback = rcb;

                        if (data != undefined)
                            dockcontent.DataContext = data;

                        if (cb != undefined)
                            cb(dockcontent);


                    },1);

                }

                //弹出式漂浮窗口
                if(mode==5)
                {

                    var pwnd=new DBFX.Web.Forms.PopupWindow(uri,cb);
                    pwnd.DataContext=data;
                    pwnd.Show();



                }


                //移动设备视图控制器加载
                if (mode == 6) {
                    DBFX.Web.NavControls.UIViewController.ActivedViewController.NavToUIView(undefined, t, function (uiView) {
                        uiView.IsHideHeader = true;
                        DBFX.Resources.LoadResource(uri, function (appUIView) {

                            appUIView.DataContext = data;

                            if (cb != undefined)
                                cb(appUIView);

                        }, uiView);

                    }, rcb,true);
                }


                //弹出表单整体页面切换
                if (mode == 7) {

                    var form = null;
                    if (DBFX.Web.Forms.Form.Windows.length > 0) //当前弹出窗口
                    {
                        form = DBFX.Web.Forms.Form.Windows[DBFX.Web.Forms.Form.Windows.length - 1];

                        form.OnUnLoad(); //卸载表单
                        form.Clear();
                        
                        DBFX.Resources.LoadResource(uri, function (appUIView) {

                            appUIView.DataContext = data;
                            form.ComputeSize();
                            if (cb != undefined)
                                cb(appUIView);

                        }, form);

                    }
                    else { //无弹出窗口自动弹出新窗口


                        var form = new DBFX.Web.Forms.Form(t, uri, function (form) {

                            if (data != undefined && data != null)
                                form.DataContext = data;

                            if (cb != undefined)
                                cb(form);

                        });
                        form.UnloadCallback = rcb;
                        form.ShowModal();

                    }




                }
                
                //弹出式漂浮窗口页面替换/切换
                if (mode == 8) {
                    var windows = DBFX.Web.Forms.PopupWindow.PopupWindows;
                    if (windows.length > 0) {
                        var pwin = windows[windows.length - 1];
                        DBFX.Resources.LoadResource(uri, function (pform) {
                
                            pform.DataContext = data;
                            cb(pform);
                
                        }, pwin);
                    }else {
                        var pwnd = new DBFX.Web.Forms.PopupWindow(uri, cb);
                        pwnd.DataContext = data;
                        pwnd.Show();
                    }
                }

            }

        }
        catch (ex) {
            alert(ex.toString());
        }
        finally { }

    }

    //
    Application.prototype.UnloadApp = function () {

        DBFX.Web.Controls.LoadingPanel.Close();

        if (app.CurrentApp != undefined && app.CurrentApp.ScriptLib != undefined) {

            for (var k in app.CurrentApp.ScriptLib) {

                if (k.indexOf("Script_") < 0)
                    continue;
                
                if(document.body.contains(app.CurrentApp.ScriptLib[k])==true)
                    document.body.removeChild(app.CurrentApp.ScriptLib[k]);

            }

        }



        app.EnvironVariables.App_Params = undefined;
        app.CurrentApp = app.HomeApp;

        //卸载主题
        DBFX.Theme.UnLoadTheme();

    }

    //
    Application.prototype.MainForm.DataBind = function (e) {

        for (var i = 0; i < app.MainForm.Controls.length; i++) {

            app.MainForm.Controls[i].DataContext = app.MainForm.dataContext;

        }

    }
    //
    Application.prototype.Platform = function () {

        if(Application.prototype.platform ==undefined)
            Application.prototype.platform = "Mobile"; //         "Windows_PC"; //

        if (Dbsoft != undefined && Dbsoft.System != undefined && Dbsoft.System.Platform != undefined)
            Application.prototype.platform = Dbsoft.System.Platform;

        return Application.prototype.platform;

    }
    //
    Application.prototype.OSType = function () {

        var r = "windows";
        if (navigator.appName.toLowerCase() == "netscape" && navigator.platform.toLowerCase().indexOf("linux") >= 0)
            r="android";

        if (navigator.appName.toLowerCase() == "netscape" && navigator.platform.toLowerCase().indexOf("iphone") >= 0)
            r = "ios";

        return r;

    }
    //
    Application.prototype.CoreType = function () {

        var coretype="InkStone";
    
        if (navigator.userAgent.indexOf("MicroMessenger") >= 0) {

            coretype = "Wechat";

        }

        if (navigator.userAgent.indexOf("WindowsPC") >= 0) {

            coretype = "WindowsPC";

        }

        return coretype;

    }




    Application.prototype.History = new Object();
    //
    Application.prototype.History.Callbacks = new Object();

    //压入历史状态
    Application.prototype.History.PushState = function (hstate) {

        window.history.pushState(hstate,hstate.Title,hstate.Url);
        

    }

    //弹出历史状态
    Application.prototype.History.PopupState = function (hstate) {
        var state=hstate.state;
        if (state != undefined && state.Callback != undefined) {

            var cb = app.History.Callbacks[state.Callback];
            cb(state);

            eval("delete app.History.Callbacks." + state.Callback+";");

        }


    }

    //
    Application.prototype.SaveState = function (title, cb)
    {

        //修改当前状态
        var url = window.location.href;//.split("#")[0];
        //var po = { Title: document.title, Url: url };
        var po = { Title: title, Url: url };
        po.Callback = "M" + Math.random().toString().replace(".", "");
        app.History.Callbacks[po.Callback] = cb;
        window.history.replaceState(po, po.Title, po.Url);

        //加入新状态
        var url = window.location.href.split("#")[0];
        var po = { Title: title, Url: url + "#Page=" + Math.floor(Math.random() * 10000) };
        app.History.PushState(po);

    }

    //清除状态
    Application.prototype.ClearState = function () {
        
        app.History.Callbacks = {};
        for (var i = 0; i < 10; i++)
            window.history.back();

    }

    //
    Application.prototype.GoBack = function (levels) {

        if(levels==undefined)
            window.history.back();
        else
        {
            window.BackLevels=levels;

            setTimeout(app.InternalGoBack,1);

        }
        

    }

    //
    Application.prototype.InternalGoBack=function()
   {
        if(window.BackLevels>0)
        {
            window.history.back();
            setTimeout(app.InternalGoBack,100);
        }
        window.BackLevels--;
        
    }

    //
    Application.prototype.ScreenMode = function () {

        var m = 0;
        if (window.innerHeight < window.innerWidth)
            m = 1;

        return m;

    }




}

window.app = new Application();

window.app.StartUp();

