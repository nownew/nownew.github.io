var DBFX = new Object();
var Converter = new Object();
DBFX.RegisterNamespace = function (ns) {

    var nsseg = ns.split(".");

    var tobj = undefined;

    for (var i = 0; i < nsseg.length; i++) {

        var tns = nsseg[i];
        var cobj = undefined;
        if (i == 0) {

            cobj = window[tns];

        }
        else
            cobj = tobj[tns];

        if (cobj == undefined)
            cobj = new Object();

        if (tobj != undefined) {

            tobj[tns] = cobj;
        }
        else
            window[tns] = cobj;

        tobj = cobj;


    }

}

DBFX.DataDomain = function () {

    var dd = new Object();
    dd.GetType = function () {

        return "DataDomain";
    }

    return dd;
}

//数据类型转换器

Converter.ToInt32 = function (v) {

    return v * 1;
}

Converter.ToDate = function (v) {
    var dv = new Date(v)
    if (isNaN(dv))
        dv = new Date(v.replace("-", "/"));
    return dv;
}

Converter.ToString = function(ov, format) {

    var rv= "";
    if (ov == undefined)
        ov = "";


    if (format == undefined || format==""){
        rv=ov;
    } else if (format == "C") {
        var v = ov*1;
        rv = v.toFixed(2);
        var lang = navigator.language || navigator.browserLanguage;

        if (lang.toLowerCase().indexOf("zh-cn") >= 0)
            rv = "￥" + rv;
        else
            rv = "$" + rv;

    } else if (format.toLowerCase() == "yyyy-mm-dd" || format.toLowerCase() == "yyyy-mm-dd hh:mm:ss" || format.toLowerCase() == "yyyy-mm-dd hh:mm" || format.toLowerCase() == "yyyy-mm" || format.toLowerCase() == "hh:mm:ss" || format.toLowerCase() == "hh:mm")
    {
        rv = Converter.ToDateString(ov,format);

    } else if (format.indexOf("##0") >= 0 || format.indexOf("0.00") >= 0) {

        var v1=ov*1.0;
        if(isNaN(v1))
            v1=0;

        var fs = format.split(".");
        if (fs.length > 1) {
            rv = v1.toFixed(fs[1].length);
        } else {
            rv = v1.toFixed(0);
        }

    } else if(typeof format == "string" && /^(cn)/.test(format.toLowerCase())){
        rv = Converter.ToCH_NumberString(ov, format);
    }else {

        var ns = ov.toString().split(".");
        var fns = format.split(".");

        if (ns[0].length < fns[0].length)
            rv = fns[0].substring(0, (fns[0].length - ns[0].length)) + ns;
        else
            rv = ov;
    }

    return rv;
}


Converter.ToCH_NumberString = function (ov, format) {
    var rv = parseFloat(ov) ? parseFloat(ov):ov;
    var unit = "";
    format = typeof format == "string" ? format.toLowerCase() : "";
    var format_1 = format.split("cn"),
        c1 = parseInt(format_1[1]) ? parseInt(format_1[1]):0;

    //TODO:判断数据大小 根据数据所在范围进行格式化
    if(typeof rv == "number" && !isNaN(rv)){
        if(Math.abs(rv)<10000){
            // format = "t"+c1;
            format = "s"+c1;
        }else if(Math.abs(rv)<100000000){
            format = "m"+c1;
        }else {
            format = "b"+c1;
        }
    }

    switch (0){
        case format.indexOf("s")://小于1万只处理小数部分
            var f = format.split("s");
            var c = parseInt(f[1]) ? parseInt(f[1]):0;
            rv = rv.toFixed(c);
            break;
        case format.indexOf("t")://千-thousands
            var f = format.split("t");
            var c = parseInt(f[1]) ? parseInt(f[1]):0;
            rv = (rv/1000).toFixed(c);
            unit = "千";
            break;
        case format.indexOf("m")://m-万
            var f = format.split("m");
            var c = parseInt(f[1]) ? parseInt(f[1]):0;
            rv = (rv/10000).toFixed(c);
            unit = "万";
            break;

        case format.indexOf("b")://亿-hundred million
            var f = format.split("b");
            var c = parseInt(f[1]) ? parseInt(f[1]):0;
            rv = (rv/100000000).toFixed(c);
            unit = "亿";
            break;
        default:
            break;
    }
    return rv+unit;
}

Converter.ToDateString = function (ov, format) {
    var rv = "";
    var date = "";
    //通过判断屏蔽错误的日期格式
    if (ov == undefined || ov == null || ov == "") {
        rv = "";
        // rv = "无效的日期";
        return rv;
    }

    if (format == undefined || format == "") {//没有格式化字符串 返回原值
        rv = ov;
        return rv;
    } else if (ov.getSeconds) {//如果为日期对象  直接赋值
        date = ov;
    } else {//非日期对象 作为参数创建日期对象
        date = new Date(ov);
        if ((typeof ov == "string") && isNaN(date)) {
            var reStr = ov.replace(/,|-/g, "/");
            date = new Date(reStr);
            //处理传入的日期字符串为"05 31 2022"
            if (isNaN(date.getTime()) && Array.isArray(ov.split(" "))) {
                var dateArr = ov.split(" ");
                var year_index = 0;
                dateArr.forEach(function (value, index) {
                    if (value.length == 4) {
                        year_index = index;
                    }
                })

                if (year_index == 2) {
                    date = new Date(dateArr[2] + "/" + dateArr[0] + "/" + dateArr[1]);
                }
                if (year_index == 0) {
                    date = new Date(dateArr[0] + "/" + dateArr[1] + "/" + dateArr[2]);
                }

            }
        }
    }

    ov = date;

    //处理时间格式
    format = format.toLowerCase().trim();
    switch (format) {

        case "yyyy-mm-dd":
            if (!isNaN(ov)) {
                rv = ov.getFullYear().ToString(2) + "-" + (ov.getMonth() + 1).ToString(2) + "-" + ov.getDate().ToString(2);
            } else {
                rv = "无效的日期";
            }
            break;

        case "hh:mm:ss":
            if (!isNaN(ov)) {
                rv = ov.getHours().ToString(2) + ":" + ov.getMinutes().ToString(2) + ":" + ov.getSeconds().ToString(2);
            } else {
                rv = "无效的日期";
            }
            break;

        case "hh:mm":
            if (!isNaN(ov)) {
                rv = ov.getHours().ToString(2) + ":" + ov.getMinutes().ToString(2);
            } else {
                rv = "无效的日期";
            }
            break;
        case "yyyy-mm":
            if (!isNaN(ov)) {
                rv = ov.getFullYear() + "-" + (ov.getMonth() + 1).ToString(2);
            } else {
                rv = "无效的日期";
            }
            break;
        case "yyyy-mm-dd hh:mm":
            if (!isNaN(ov)) {
                rv = ov.getFullYear() + "-" + (ov.getMonth() + 1).ToString(2) + "-" + ov.getDate().ToString(2) + " " + ov.getHours().ToString(2) + ":" + ov.getMinutes().ToString(2);
            } else {
                rv = "无效的日期";
            }
            break;
        case "yyyy-mm-dd hh:mm:ss":
        default:
            if (!isNaN(ov)) {
                rv = ov.getFullYear() + "-" + (ov.getMonth() + 1).ToString(2) + "-" + ov.getDate().ToString(2) + " " + ov.getHours().ToString(2) + ":" + ov.getMinutes().ToString(2) + ":" + ov.getSeconds().ToString(2);
            } else {
                rv = "无效的日期";
            }
            break;
    }

    return rv;
}


Converter.Base64ToArrayBuffer = function (base64) {

    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }

    return bytes.buffer;

}

Converter.Base64ToUint8Array = function (base64) {

    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }

    return bytes;

}

Converter.ArrayBufferToBase64 = function (buf) {

    var binstr = Array.prototype.map.call(buf, function (ch) {
        return String.fromCharCode(ch);
    }).join('');
    return btoa(binstr);

}


Converter.StringToBase64 = function (str) {

    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
        return String.fromCharCode('0x' + p1);
    }));
}

Converter.Base64ToString = function (str) {

    return decodeURIComponent(Array.prototype.map.call(atob(str), function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(""));


}
Converter.ToFixString = function (str, fchar, len) {
    str = str.toString();
    var l = len - str.length;
    var lstr = "";
    for (var idx = 0; idx < l; idx++)
        lstr = lstr + fchar;

    str = lstr + str;
    return str;

}

Converter.Int16ToBytes = function (d) {

    var buff = new ArrayBuffer(2);

    var i16v = new Uint16Array(buff);
    i16v[0] = d * 1;
    var u8a = new Uint8Array(buff);

    return u8a;

}


/**
 * 个人信息脱敏处理；
 * 姓名：微信和支付宝：只保留最后一个字；
 * 11位手机号码：显示前3位和后4位，中间四位显示*号
 * 身份证号：隐藏出生年月日；
 * 家庭住址：
 * 银行卡号：支付宝-**** 1234；微信- •••• •••• •••• 1234；银行-6222****1234；•••• 1234；
 * 邮箱：
 * @param str 需要处理的信息字符串
 * @param rule  处理规则:All-全部隐藏；Name-姓名；PhoneNumber-11位手机号码； IdentityCard-身份证号 18位；
 *                      Address-住址信息；BankCard-银行卡号；Email-邮箱;Passport-护照9位，一位字母和八位数字组bai成
 * 默认不隐藏
 * @constructor
 */
Converter.Desensitization = function (str, rule) {
    if (typeof str != 'string') return str;
    switch (rule) {
        case "Name":
            return Converter.HideKeyInfo(str, 0, str.length - 1);
            break;
        case "PhoneNumber":
            return Converter.HideKeyInfo(str, 3, 7);
            break;
        case "IdentityCard":
            return Converter.HideKeyInfo(str, 6, 14);
            break;
        case "Passport":
            return Converter.HideKeyInfo(str, 1, 7);
            break;
        case "Address":
            return Converter.HideKeyInfo(str, 6, str.length);
            break;
        case "BankCard":
            return str.replace(str.substring(4, str.length - 4), "****");
            // return HideKeyInfo(str,6,str.length);
            break;
        case "Email":
            var index = str.indexOf('@');
            return Converter.HideKeyInfo(str, index <= 1 ? 0 : 1, index);
            break;
        case "All":
            return Converter.HideKeyInfo(str, 0, str.length);
            break;
        default://没有规则不隐藏信息
            return str;
            break;
    }
}

/**
 * 隐藏关键信息
 * @param str 需要处理的字符串
 * @param start 隐藏信息的起始位置，从0开始（包含起始位置）；
 * @param end   隐藏信息的终止位置(不包含终止位置)；
 * @constructor
 */
Converter.HideKeyInfo = function (str, start, end) {
    if (typeof str != 'string') return;
    start = start * 1;
    end = end * 1;
    var len = str.length;
    end = end > len ? len : end;
    var gap = end - start;
    if (isNaN(gap * 1) || gap * 1 <= 0 || start > len || end <= 0) return str;

    var replaceStr = "****************************************************************************************************";
    replaceStr = replaceStr.substr(0, gap);
    return str.replace(str.substring(start, end), replaceStr);
}

//XML格式转成JSON格式对象
Converter.XMLToJSONObject = function(xml){
    var xmlDoc = undefined;
    if(typeof xml == 'object' && xml.nodeName != undefined){
        xmlDoc = xml;
    }else if(typeof xml == 'string'){
        var domparser = new DOMParser();
        xmlDoc = domparser.parseFromString(xml, 'application/xhtml+xml');
    }else {
        return {error:'传递的参数不是xml格式！'};
    }
    return Converter.XMLDocumentToJSON(xmlDoc);
    
}

//xml文档对象解析成json格式对象
Converter.XMLDocumentToJSON = function(xml){
    //创建返回对象
    var obj = {};
    
    if (xml.nodeType == 1) { // 元素
        var atts = xml.attributes;
        //解析节点元素属性
        if (atts.length > 0) {
            obj["attributes"] = {};
            for (var j = 0; j < atts.length; j++) {
                var attribute = atts.item(j);
                obj["attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType == 3) { // text
        obj = xml.nodeValue;
    }
    
    //解析子元素
    if (xml.hasChildNodes()) {
        if(xml.children.length > 0){
            for (var i = 0; i < xml.children.length; i++) {
                var item = xml.children.item(i);
                var nodeName = item.nodeName;
                if (typeof (obj[nodeName]) == "undefined") {
                    obj[nodeName] = Converter.XMLDocumentToJSON (item);
                } else {
                    if (typeof (obj[nodeName].push) == "undefined") {
                        var old = obj[nodeName];
                        obj[nodeName] = [];
                        obj[nodeName].push(old);
                    }
                    obj[nodeName].push(Converter.XMLDocumentToJSON(item));
                }
            }
        }else {
            obj = xml.textContent;
        }
    }
    return obj;
}

//JSON格式转成xml文档对象
Converter.JSONToXMLObject = function(json){
    //判断传入的参数是否为JSON格式
    if(!json || typeof json == 'number'){
        return '请传入JSON格式的对象！';
    }
    try{
        if(typeof json == 'string'){
            json = JSON.parse(json);
        }
    }catch (e) {
        return '请传入JSON格式的对象！';
    }
    
    var parser=new DOMParser();
    var xmlstr = '<?xml version="1.0" encoding="UTF-8"?><b></b>';
    var xmlDoc = parser.parseFromString(xmlstr,"text/xml");
    xmlDoc.removeChild(xmlDoc.childNodes[0]);
    Converter._JSONToXML(xmlDoc,json,xmlDoc);
    return xmlDoc;
}

//递归处理json格式，创建xml节点对象
Converter._JSONToXML = function(node,json,doc) {
    if(json && typeof json == 'object'){
        try {
            JSON.stringify(json);
        }catch (e) {
            return undefined;
        }
    }else if(typeof json != 'function'){
        node.innerHTML = json;
        return undefined;
    }else {
        return undefined;
    }
    
    if(Array.isArray(json)){//如果为数组，移除之前创建的节点，遍历数组创建节点
        
        var nodeName = node.nodeName;
        var parenNode = node.parentNode;
        parenNode.removeChild(node);
        for (var i = 0; i < json.length; i++) {
            var ele = doc.createElement(nodeName);
            parenNode.appendChild(ele);
            Converter._JSONToXML(ele,json[i],doc);
        }
        
    }else {
        for(var attr in json){//如果为键值对，遍历属性创建节点
            
            if(attr != 'attributes' && typeof json[attr] != "function" && attr != 'propertyChangedCbs'){
                var el = doc.createElement(attr);
                try{
                    el && node.appendChild(el);
                }catch (e) {
                    console.log(e)
                }
                
                Converter._JSONToXML(el,json[attr],doc)
            }else if(attr == 'attributes'){
                var attrs = json[attr];
                for (var att in attrs){
                    if(typeof attrs[att] != "function" && att != 'propertyChangedCbs'){
                        node.setAttribute(att,attrs[att]);
                    }
                }
            }
        }
    }
    
}



//转换MongoDB的ID
window.ObjectId = function (v) {

    return v;
}

window.CSUUID = function (v) {

    return v;
}

window.NumberLong = function (v) {

    return v;

}

window.ISODate = function (v) {
    var dv = new Date(v);

    if (isNaN(dv))
        dv = new Date();

    return dv;
}

Math.TwoPointDistance = function (x, y, x1, y1) {

    var calX = x1 - x;
    var calY = y1 - y;
    var v=Math.pow((calX * calX + calY * calY), 0.5);
    return v;
}

function Map() {

    Object.defineProperty(Map, "constructor", { enumerable: false, value: DBFX.Map });
    Map.prototype.list = new Array();
    Map.prototype.Add = function (k, v) {
        var item = new Object();
        item.Key = k;
        item.Value = v;
        this.list.push(item);
    }

    Map.prototype.Get = function (k) {

        for (var i = 0; i < this.list.length; i++) {

            if (this.list[i].Key == k)
                return this.list[i].Value;

        }

        return null;
       
    }

}


function ISODate(v) {
    return v;
}

var EventArg = function (sender, objs) {

    var arg = new Object();
    arg.Sender = sender;
    arg.Objects = objs;

    return arg;

}


var EventHandler = function (cb,f) {
    var eh = new Object();
    eh.f = f;
    eh.cb = cb;
    eh.ObjType = "EventHandler";
    return eh;

}

Object.prototype.OnPropertyChanged = function (propertyname, value) {

    if (Object.prototype.PropertyChanged != undefined)
        Object.prototype.PropertyChanged(propertyname, value, this);

}

Object.prototype.propertyChanged = function (propertyname, value,o) {

    if (this.propertyChangedCbs.length == 0)
        return;



    for (var i = 0; i < this.propertyChangedCbs.length; i++) {
        var cb = this.propertyChangedCbs[i];
        
        cb(propertyname, value,o);

    }

}

Object.prototype.propertyChangedCbs = new Array();

Object.defineProperty(Object.prototype, "PropertyChanged", {
    get: function () {

        return Object.prototype.propertyChanged;

    },
    set: function (v) {

        //Object.prototype.propertyChanged = v;
        if (v.ObjType != "EventHandler")
            throw ("无效的句柄");

        if (v.f == 1) {
            if(Object.prototype.propertyChangedCbs.indexOf(v.cb)<0)
                Object.prototype.propertyChangedCbs.Add(v.cb);
        }
        else {

            Object.prototype.propertyChangedCbs.Remove(v.cb);
        }

    }
});

Object.getOwnPropertyDescriptor(Object.prototype, "propertyChangedCbs").enumerable = false;


Object.prototype.ToJSon = function () {

    var ojson = JSON.stringify(this);
    var o = JSON.parse(ojson);
    
    if (o.propertyChangedCbs != undefined)
        delete o.propertyChangedCbs;

    ojson = JSON.stringify(o);
    return ojson;

}

Object.prototype.Clone = function () {

    var ojson = JSON.stringify(this);
    var o = JSON.parse(ojson);
    return o;

}

Object.prototype.ToBoolean = function () {

    if ((this==undefined || this ==null || this!=true || this == "false" || this == false) && (this.toString()!="true"))
        return false;
    else
        return true;


}

Object.prototype.ToString=function(format) {
    return Converter.ToString(this.valueOf(), format);

}

//20201210-适配低版本Object.assign不可用问题
if (typeof Object.assign != 'function') {
    Object.assign = function (target) {
        'use strict';
        if (target == null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }

        target = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var source = arguments[index];
            if (source != null) {
                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
        }
        return target;
    };
}

//数组扩展操作
//查找指定值得位置
Array.prototype.IndexOf = function (val) {
    return this.indexOf(val);
};
//移除指定的值
Array.prototype.Remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
//移除指定的索引位置的值
Array.prototype.RemoveAt = function (index) {
    if (index > -1) {
        this.splice(index, 1);
    }
};
//移除指定的索引位置的值
Array.prototype.Clear = function () {

        this.splice(0, this.length);

};
//添加元素
Array.prototype.Add = function (val) {


    this.push(val);

};
//获取类型
Array.prototype.GetType = function () {

    return "Array";
}
//插入
Array.prototype.Insert = function (val, tval) {
    var idx = this.IndexOf(tval);
    this.splice(idx, 0, val)

}
//在指定位置插入
Array.prototype.InsertAt = function (idx,val) {

    this.splice(idx, 0, val);

}


var iif = function (v,tv,fv) {

    if (v == true)
        return tv;
    else
        return fv;

}



var Msg = function (id, body) {
    var m = new Object();
    m.MsgId = id;
    m.Body = body;
    return m;
}

var DataItem = function () {

    var item = new Object();

    Object.defineProperty(item, "Title", {
        get: function () {

            return item.title;

        },
        set: function (v) {

            item.title = v;
        }
    });

    Object.defineProperty(item, "Name", {
        get: function () {

            return item.name;

        },
        set: function (v) {

            item.name = v;
        }
    });

    Object.defineProperty(item, "Description", {
        get: function () {

            return item.description;
        },
        set: function (v) {

            item.deescription = v;
        }
    });

    Object.defineProperty(item, "Value", {
        get: function () {

            return item.value;
        },
        set: function (v) {

            item.value = v;

        }
    });

    Object.defineProperty(item, "Categories", {
        get: function () {

            return item.categories;

        },
        set: function (v) {

            item.categories = v;
        }
    });

    Object.defineProperty(item, "DataType", {
        get: function () {

            return item.datatype;

        },
        set: function (v) {

            item.datatype = v;

        }
    });

    return item;

}


//命名元素数组
var NamedArray = function () {
    var narray = new Array();
    narray.ObjType = "NamedArray";
    narray.Add = function (key, val) {

        if (narray[name] != undefined)
            throw ("元素已经存在!");

        narray[key] = val;
        narray.push(val);


    }
    narray.BaseInsert = narray.Insert;
    narray.Insert=function(name, val, tval)
    {
        narray[name] = val;
        narray.BaseInsert(val, tval);

    }

    narray.Remove = function (name, val) {
        
        if (typeof name != "string" && val == undefined) {

            val = name;
            var index = narray.indexOf(val);

            if (index > -1) {
                narray.splice(index, 1);
            }

            for (var k in narray) {

                if(narray[k]==val)
                    delete narray[k];
            }

        }
        else {
            delete narray[name];

            var index = narray.indexOf(val);
            if (index > -1) {
                narray.splice(index, 1);
            }
        }

    }

    return narray;

}

var Dictionary = function () {

    var dic = new Object();

    dic.Values = new Array();
    dic.Keys = new Object();


    dic.IndexOf = function (o) {

        return dic.Values.indexOf(o, 0);

    }

    dic.Add = function (k,o) {

        if (dic.Keys[k] != undefined)
            throw ("字典对象中不允许存储同名的元素!");


        dic.Keys[k] = o;
        dic.Values.push(o);

    }


    dic.Remove = function (k) {

        if (dic.Keys[k] == undefined)
            throw ("字段对象中不存在 "+k+" 的元素!");


        dic.Values.Remove(dic.Keys[k]);

        delete dic.Keys[k];


    }

    dic.Clear = function () {

        dic.Keys = new Object();
        dic.Value.splice(0, dic.Values.length);

    }

    dic.ContainsKey = function (k) {

        return (dic.Keys[k] != undefined);

    }

    dic.Contains = function (o) {

        return (dic.Values.IndexOf(o)>=0);

    }

    dic.GetValue = function (k) {
        return dic.Keys[k];
    }

    dic.SetValue = function (k, o) {

        var idx=dic.Values.IndexOf(dic.Keys[k]);
        dic.Values[idx] = o;
        dic.Keys[k] = o;

    }

    Object.defineProperty(dic, "length", {
        get: function () {

            return dic.Values.length;

        }
    });
   
    return dic;

}

DBFX.GetUniqueNumber = ((
	function () {
	    var value = 0;
	    return function () {
	        return ++value;
	    };
	}
)());

window.BaseAlert = alert;
window.alert = function (msgtext,title) {

    if (DBFX.Web == undefined) {
        window.BaseAlert(msgtext);
    } else {

        DBFX.Web.Forms.MessageBox.Show(msgtext, document.title, function (r) {


        }, undefined, undefined, undefined, undefined, false);
    }
}


/*
 *
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS PUB 180-1
 *
 * By lizq
 *
 * 2006-11-11
 *
 */
/*
 *
 * Configurable variables.
 *
 */
var hexcase = 0; /* hex output format. 0 - lowercase; 1 - uppercase */
var chrsz = 8; /* bits per input character. 8 - ASCII; 16 - Unicode */
/*
 *
 * The main function to calculate message digest
 *
 */
function hex_sha1(s) {

    return binb2hex(core_sha1(AlignSHA1(s)));

}

/*
 *
 * Perform a simple self-test to see if the VM is working
 *
 */
function sha1_vm_test() {

    return hex_sha1("abc") == "a9993e364706816aba3e25717850c26c9cd0d89d";

}

/*
 *
 * Calculate the SHA-1 of an array of big-endian words, and a bit length
 *
 */
function core_sha1(blockArray) {

    var x = blockArray; // append padding
    var w = Array(80);

    var a = 1732584193;

    var b = -271733879;

    var c = -1732584194;

    var d = 271733878;

    var e = -1009589776;

    for (var i = 0; i < x.length; i += 16) // 每次处理512位 16*32
    {

        var olda = a;

        var oldb = b;

        var oldc = c;

        var oldd = d;

        var olde = e;

        for (var j = 0; j < 80; j++) // 对每个512位进行80步操作
        {

            if (j < 16)
                w[j] = x[i + j];

            else
                w[j] = rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);

            var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)), safe_add(safe_add(e, w[j]), sha1_kt(j)));

            e = d;

            d = c;

            c = rol(b, 30);

            b = a;

            a = t;

        }

        a = safe_add(a, olda);

        b = safe_add(b, oldb);

        c = safe_add(c, oldc);

        d = safe_add(d, oldd);

        e = safe_add(e, olde);

    }

    return new Array(a, b, c, d, e);

}

/*
 *
 * Perform the appropriate triplet combination function for the current
 * iteration
 *
 * 返回对应F函数的值
 *
 */
function sha1_ft(t, b, c, d) {

    if (t < 20)
        return (b & c) | ((~b) & d);

    if (t < 40)
        return b ^ c ^ d;

    if (t < 60)
        return (b & c) | (b & d) | (c & d);

    return b ^ c ^ d; // t<80
}

/*
 *
 * Determine the appropriate additive constant for the current iteration
 *
 * 返回对应的Kt值
 *
 */
function sha1_kt(t) {

    return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 : (t < 60) ? -1894007588 : -899497514;

}

/*
 *
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 *
 * to work around bugs in some JS interpreters.
 *
 * 将32位数拆成高16位和低16位分别进行相加，从而实现 MOD 2^32 的加法
 *
 */
function safe_add(x, y) {

    var lsw = (x & 0xFFFF) + (y & 0xFFFF);

    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);

    return (msw << 16) | (lsw & 0xFFFF);

}

/*
 *
 * Bitwise rotate a 32-bit number to the left.
 *
 * 32位二进制数循环左移
 *
 */
function rol(num, cnt) {

    return (num << cnt) | (num >>> (32 - cnt));

}

/*
 *
 * The standard SHA1 needs the input string to fit into a block
 *
 * This function align the input string to meet the requirement
 *
 */
function AlignSHA1(str) {

    var nblk = ((str.length + 8) >> 6) + 1, blks = new Array(nblk * 16);

    for (var i = 0; i < nblk * 16; i++)
        blks[i] = 0;

    for (i = 0; i < str.length; i++)

        blks[i >> 2] |= str.charCodeAt(i) << (24 - (i & 3) * 8);

    blks[i >> 2] |= 0x80 << (24 - (i & 3) * 8);

    blks[nblk * 16 - 1] = str.length * 8;

    return blks;

}

/*
 *
 * Convert an array of big-endian words to a hex string.
 *
 */
function binb2hex(binarray) {

    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";

    var str = "";

    for (var i = 0; i < binarray.length * 4; i++) {

        str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) +

        hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);

    }

    return str;

}

/*
 *
 * calculate MessageDigest accord to source message that inputted
 *
 */
function calcDigest() {

    var digestM = hex_sha1(document.SHAForm.SourceMessage.value);

    document.SHAForm.MessageDigest.value = digestM;

}

DBFX.StringWriter = function () {

    var sw = new Object();
    sw.StringItems = new Array();
    sw.Indent = 0;
    //加入
    sw.AddLine = function (str, indent) {
        
        if (indent == undefined)
            indent = 0;

        if(indent<0)
            sw.Indent += indent;

        sw.StringItems.Add(sw.PaddingStr(" ", sw.Indent) + str + "\n");

        if(indent>0)
            sw.Indent += indent;

    }

    sw.ToString = function () {

        var str = "";
        for (var i = 0; i < sw.StringItems.length; i++)
            str += sw.StringItems[i];

        return str;

    }

    sw.PaddingStr = function (c, count) {

        var str="";
        for (var i = 0; i < count; i++)
            str += c;
        return str;

    }

    return sw;

}

Date.prototype.addDays = function (day) {
    
    return new Date(this.getFullYear(), this.getMonth() , this.getDate()+day, this.getHours(), this.getMinutes(), this.getSeconds(), 0);
}

Date.prototype.addHours = function (hour) {

    return new Date(this.getFullYear(), this.getMonth(), this.getDate(), this.getHours()+hour, this.getMinutes(), this.getSeconds(), 0);


}

Date.prototype.addMinutes = function (minutes) {

    return new Date(this.getFullYear(), this.getMonth(), this.getDate(), this.getHours(), this.getMinutes() + minutes, this.getSeconds(), 0);


}

Date.prototype.addSeconds = function (seconds) {

    return new Date(this.getFullYear(), this.getMonth(), this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds() + seconds, 0);


}


Date.prototype.addYears = function (y) {

    return new Date(this.getFullYear()+y,this.getMonth(),this.getDate(),this.getHours(),this.getMinutes(),this.getSeconds(),0);

}

Date.prototype.addMonth = function (m) {


    return new Date(this.getFullYear(),this.getMonth()+m,this.getDate(),this.getHours(),this.getMinutes(),this.getSeconds(),0);

}

//
Date.prototype.toLongTimeString=function() {

    return this.getHours().ToString(2) + ":" + this.getMinutes().ToString(2) + ":" + this.getSeconds().ToString(2);

}

Date.prototype.toLongDateString=function() {

    return (this.getFullYear() +"-"+(this.getMonth() + 1).ToString(2) + "-" + this.getDate().ToString(2));

}

//获取日期段
//range：需要计算的日期范围/跨度 字符串 year:年;  month:月; week:周; day:日; hour:时; minute:分钟
//mode: 计算模式 数值  负数：从传入的日期对象往前数一定的日期范围；0或者不传：包括计算时间在内的日期范围；整数：从传入的日期对象往后数一定的日期范围
//返回值：对象{start:startDate,end:endDate}
Date.prototype.GetDateRange = function(range,mode) {

    if(!mode || isNaN(mode*1)){
        mode = 0;
    }

    if(!(range == "year" || range == "month" || range == "week" || range == "day" || range == "hour" || range == "minute")){
        range = "day";
    }


    //获取传入日期的各个部分
    var y = this.getFullYear(),
        m = this.getMonth(),
        d = this.getDate(),
        w = this.getDay(),
        h = this.getHours(),
        mm = this.getMinutes(),
        s = this.getSeconds(),
        startY = y,
        endY = y,
        startM = m,
        endM = m,
        startD = d,
        endD = d,
        startH = h,
        endH = h,
        startMM = mm,
        endMM = mm,
        startS = s,
        endS = s;


    var startDate = new Object();
    var endDate = new Object();

    //根据时间范围计算起、止时间
    switch (range){
        //跨度 年
        case "year":

            if(mode<0){ //前mode年
                startY = y+mode;
                endY = y-1;
            }else if(mode == 0){ //当前年
                startY = endY = y;
            }else { //后mode年
                startY = y+1;
                endY = y+mode;
            }

            startM = 0;
            endM = 11;
            startD = 1;
            endD = 31;
            startH = 0;
            endH = 23;
            startMM = 0;
            endMM = 59;
            startS = 0;
            endS = 59;

            break;
        //跨度 月
        case "month":

            if(mode<0){
                startM = m+mode;
                endM = m;
            }else if(mode == 0){ //本月
                // startY = endY = y;
                startM = m;
                endM = m+1;

            }else {
                startM = m+1;
                endM = m+mode+1;
            }

            startD = 1;
            endD = 0;
            startH = 0;
            endH = 23;
            startMM = 0;
            endMM = 59;
            startS = 0;
            endS = 59;

            break;
        //跨度 周
        case "week":

            if(mode<0){
                startD = d+mode*7;
                if(w == 0){ //周日
                    startD = startD-6;
                    endD = d - 7;
                }else {
                    startD = startD-w+1;
                    endD = startD + Math.abs(mode)*7-1;
                }


            }else if(mode == 0){ //本周
                startY = endY = y;
                startM = endM = m;


                if(w == 0){ //周日
                    startD = d-6;
                    endD = d;
                }else {
                    startD = d-w+1;
                    endD = d+(6-w)+1;
                }

            }else {

                if(w == 0){ //周日
                    startD = startD+1;
                    endD = startD + Math.abs(mode)*7-1;
                }else {
                    startD = startD+(7-w)+1;
                    endD = startD + mode*7-1;
                }
            }

            startH = 0;
            endH = 23;
            startMM = 0;
            endMM = 59;
            startS = 0;
            endS = 59;

            break;
        //跨度 天
        case "day":
            if(mode<0){
                startD = d+mode;
                endD = d-1;
            }else if(mode == 0){ //当天

            }else {
                startD = d+1;
                endD = d+mode;
            }

            startH = 0;
            endH = 23;
            startMM = 0;
            endMM = 59;
            startS = 0;
            endS = 59;

            break;
        //跨度 时
        case "hour":

            if(mode<0){
                startH = h+mode;
                endH = h-1;
            }else if(mode == 0){ //本时

                startH = endH = h;

            }else {
                startH = h+1;
                endH = h+mode;
            }

            startMM = 0;
            endMM = 59;
            startS = 0;
            endS = 59;
            break;
        //跨度 分
        case "minute":
            if(mode<0){
                startMM = mm+mode;
                endMM = mm-1;
            }else if(mode == 0){

                startMM = endMM = mm;

            }else {
                startMM = mm+1;
                endMM = mm+mode;
            }

            startS = 0;
            endS = 59;
            break;

        default:
            break;
    }

    startDate = new Date(startY,startM,startD,startH,startMM,startS,0);
    endDate = new Date(endY,endM,endD,endH,endMM,endS,999);
    return {start:startDate,end:endDate};

}



Object.prototype.GetType = function () {

    return (typeof this);

}

Number.prototype.ToString=function(len) {
    if(typeof len=="number"){
            var str = this.toString();
            var l = len - str.length;

            for (var i = 0; i < l; i++)
                str = "0" + str;

            return str;
    }
    else
        return Converter.ToString(this.valueOf(),len);

}

//定义action对象，
DBFX.Action = function (func) {
    
    var ac = new Object();
    //当前执行的函数 function类型
    ac.CurrentFunction = func;
    
    //下一个执行的函数  function类型
    ac.NextFunction = undefined;
    
    //下一个执行的动作
    ac.NextAction = undefined;
    
    //F全局回调的几种状态 1-全部执行完毕 0-执行中止，开发人员中止在某个函数;2-执行错误
    
    ac.ExecuteNext = function (parameter,callBack) {
        var count = 0;
        var paras = [parameter];
        ac._executeNext(parameter,callBack,count,paras);
    }
    
    //执行下一个函数的方法   count-已经执行到的函数索引值
    ac._executeNext = function (parameter,callBack,count,paras) {
        
        //para 下一个方法需要的参数对象  flag--下一个函数是否执行的标记
        ac.CurrentFunction(parameter,function (para,flag) {
            
            if(flag == true){
                
                if(ac.NextAction != undefined){
                    paras.push(para);
                    try{
                        ac.NextAction._executeNext(para,callBack,++count,paras);
                    }catch (e) {
                        callBack({State:2,Message:e.toString(),Index:count,Datas:paras,Data:para,FunctionName:ac.NextAction.CurrentFunction.name});
                    }
                }else {
                    callBack({State:1,Message:'全部执行完毕！',Index:count,Datas:paras,Data:para});
                }
            }else {
                callBack({State:1,Message:'执行中止！',Index:count,
                    Datas:paras,Data:para,FunctionName:ac.CurrentFunction.name,Function:ac.CurrentFunction});
                return ;
            }
        });
    }
    
    return ac;
}

/**
 * 异步串联执行
 * @param parameter  执行第一个函数需要的参数
 * @param functions  执行的函数数组  元素为字符串或者函数引用
 * @param callBack   执行的回调
 * @constructor
 */
/**
 * callBack回调函数的参数结构：
 * {
 *   State:'函数执行的结果状态',
 *   Message:'执行结果或者报错信息',
 *   Index:'执行到的函数索引',
 *   Datas:'调用链在调用过程中传递的参数集合',
 *   Data:'当前执行函数接受的参数值',
 *   FunctionName:'当前执行的函数名称',
 *   Function:'当前执行的函数对象引用'
 * }
 * */
DBFX.ExecuteActions = function(parameter,functions,callBack) {
    //
    if(!Array.isArray(functions)){
        callBack({State:-1,Message:'第二个参数需要数组，传递参数不符合规范！'});
        return 'failure';
    };
    
    //判断传递的函数集元素是否为函数对象，如果不是，需要转成砚台调用的函数对象
    var funcs = [];
    for (var j = 0; j < functions.length; j++) {
        var funC = functions[j];
        if(typeof funC == 'function'){
            funcs.push(funC);
        }else if(typeof funC == 'string' && funC.length>0 && window.app && app.DynamicModules){
            funC = app.DynamicModules[funC.split('.').pop()];
            if(typeof funC =='function') funcs.push(funC);
        }
    }
    
    //创建执行动作
    var action = new DBFX.Action(funcs[0]);
    var tmpAc = action;
    //循环遍历函数集，创建函数调用链
    for (var i = 1; i < funcs.length; i++) {
        var func = funcs[i];
        var act = new DBFX.Action(func);
        tmpAc.NextAction = act;
        tmpAc = act;
    }
    
    action.ExecuteNext(parameter,callBack);
}
