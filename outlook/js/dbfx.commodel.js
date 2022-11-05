DBFX.RegisterNamespace("DBFX.ComponentsModel");

DBFX.ComponentsModel.TypeConverter = function () {

}
//类型元数据描述
DBFX.ComponentsModel.ClassDescriptor = function ()
{

    //设置类的显示名称
    this.DisplayName = null;


    //设置类型的描述
    this.Description = null;

    //设置类型的系列化提供者 
    this.Serializer = null;

    //类型哈希
    this.HashCode = function () {
        var hash = 0;
        var str = this.DisplayName + this.Description + this.Serializer;
        if (str.length == 0) return hash;

        for (i = 0; i < str.length; i++) {

            char = str.charCodeAt(i);

            hash = ((hash << 5) - hash) + char;

            hash = hash & hash;

        }

        return hash;

    }

    this.Designers = null;
    this.DesignTimePreparer = null;

}


//属性描述
DBFX.ComponentsModel.PropertyDescriptor = function (n,pt,te,cvt,s,t,d,c) {

    var pd = new Object();
    //属性名称
    pd.Name = n;
    //属性类型
    pd.PropertyType = pt;
    //属性类型编辑器
    pd.TypeEditor =te;
    //类型转换器
    pd.Converter = cvt;
    //系列化提供者
    pd.Serializer = s;
    
    //属性标题
    pd.Title = t;

    //属性描述
    pd.Description = d;

    //属性分类
    pd.Category = c;

    return pd;
}

DBFX.ComponentsModel.Property = function (name) {

    var p = new Object();

    p.Name = name;


    return p;

}

//命令参数
DBFX.ComponentsModel.Parameter = function (t, n, k, v) {

    var pa = { paramText: t, paramName: n, paramKey: k, paramValue: v };

    Object.defineProperty(pa, "ParamText", {
        get: function () {
            return pa.paramText;
        },
        set: function (v) {
            pa.paramText = v;
            pa.OnPropertyChanged("ParamText", v);
        }

    });

    Object.defineProperty(pa, "ParamName", {
        get: function () {
            return pa.paramName;
        },
        set: function (v) {
            pa.paramName = v;
            pa.OnPropertyChanged("ParamName", v);
        }

    });

    Object.defineProperty(pa, "ParamKey", {
        get: function () {
            return pa.paramKey;
        },
        set: function (v) {
            pa.paramKey = v;
            pa.OnPropertyChanged("ParamKey", v);
        }

    });

    Object.defineProperty(pa, "ParamValue", {
        get: function () {
            return pa.paramValue;
        },
        set: function (v) {
            pa.paramValue = v;
            pa.OnPropertyChanged("ParamValue", v);
        }

    });

    pa.ToObject = function () {


    }

    pa.GetType=function()
    {
        return "Parameter";
    }
    return pa;

}

//绑定
DBFX.ComponentsModel.Binding = function (obd) {

    var bd = { target: undefined, propertyName: "", path: "", mode: "OnWay", format: "", source: undefined, srcPath: "" };

    if (obd != undefined) {

        bd.propertyName = obd.propertyName;
        bd.path = obd.path;
        bd.source = obd.source;
        bd.srcPath = obd.srcPath;
        bd.format = obd.format;
        bd.mode = obd.mode;

    }

    Object.defineProperty(bd, "Target", {
        get: function () {
            return bd.target;
        },
        set: function (v) {
            bd.target = v;
            bd.OnPropertyChanged("Target", v);
        }

    });

    Object.defineProperty(bd, "PropertyName", {
        get: function () {
            return bd.propertyName;
        },
        set: function (v) {
            bd.propertyName = v;
            bd.OnPropertyChanged("PropertyName", v);
        }

    });

    Object.defineProperty(bd, "Path", {
        get: function () {
            return bd.path;
        },
        set: function (v) {
            bd.path = v;
            bd.OnPropertyChanged("Path", v);
        }

    });

    Object.defineProperty(bd, "Mode", {
        get: function () {
            return bd.mode;
        },
        set: function (v) {
            bd.mode = v;
            bd.OnPropertyChanged("Mode", v);
        }

    });

    Object.defineProperty(bd, "Format", {
        get: function () {
            return bd.format;
        },
        set: function (v) {
            bd.format = v;
            bd.OnPropertyChanged("Format", v);
        }

    });

    Object.defineProperty(bd, "Source", {
        get: function () {
            return bd.source;
        },
        set: function (v) {
            bd.source = v;
            bd.OnPropertyChanged("Source", v);
        }

    });

    Object.defineProperty(bd, "SrcPath", {
        get: function () {
            return bd.srcPath;
        },
        set: function (v) {
            bd.srcPath = v;
            bd.OnPropertyChanged("SrcPath", v);
        }

    });

    bd.GetType = function () {
        return "Binding";
    }

    bd.Bind = function () {



    }

    return bd;

}


DBFX.ComponentsModel.BaseCommand = function (cmdline,cmdobj)
{
    var cmd = new Object();
    cmd.type = "command";
    cmd.Sender = null;
    cmd.TargetObject = "";
    cmd.Title = "";
    cmd.MethodName = "";
    cmd.Instance = "";
    cmd.CommandLine = "";
    cmd.MethodType = "0";
    cmd.CallBack = undefined;
    cmd.Parameters = new NamedArray();
    
    if (cmdline != undefined && cmdline != null)
        cmd.CommandLine = cmdline;

    if (cmdobj != undefined)
    {
        cmd._id = cmdobj._id;
        cmd.MethodName = cmdobj.MethodName;
        cmd.Title = cmdobj.Title;
        cmd.Instance = cmdobj.Instance;
        cmd.CommandLine = cmdobj.CommandLine;
        cmd.MethodType = cmdobj.MethodType;
        cmd.CallBack = cmdobj.CallBack;
        if (cmdobj.Parameters != undefined) {
            cmd.Parameters.forEach(function (opa) {

                var pa = new DBFX.ComponentsModel.Parameter(opa.ParamText,opa.ParamName,opa.ParamKey,opa.ParamValue);
                cmd.Parameters.Add(opa.ParamName, opa);

            });
        }

    }

    cmd.Execute = function (cb)
    {
        var o = undefined;
        try{
            if (cb != undefined)
                cmd.CallBack = cb;

            var cmdline = cmd.CommandLine;
            var paras="@#"
            for (var k in cmd.Parameters) {

                if (typeof cmd.Parameters[k] == "function" || Object.prototype[k]!=undefined)
                    continue;

            
                paras += ",cmd.Parameters[\"" + k + "\"]";

            }

            paras = paras.replace("@#,", "");
            paras = paras.replace("@#", "");
            if (paras == "")
                paras = "cmd";
            else
                paras = "cmd," + paras;

            if (typeof cmdline == "function") {

                o=cmdline(cmd);
            }
            else {

                cmdline += "(" + paras + ");";
                o = eval(cmdline);
            }
        } catch (ex) {


        }
        return o;

    }
    cmd.GetType = function () {

        return "Command";
    }

    return cmd;

}

//执行流程
DBFX.ComponentsModel.ExecuteFlow = function () {

    var eflow = new Object();

    eflow.Activities = new Array();

    eflow.Execute = function () {



    }

    return eflow;

}

//执行流程活动
DBFX.ComponentsModel.ExecuteFlowActivity = function () {

    var efact = new Object();


    efac.Execute = function () {



    }

    return efact;

}


//流程执行命令
DBFX.ComponentsModel.FlowExecuteCommand = function () {

    var fecmd = new DBFX.ComponentsModel.BaseCommand();


    

    return fecmd;

}

//数据访问请求执行
DBFX.ComponentsModel.DACommand = function () {
    var dacmd = new DBFX.ComponentsModel.BaseCommand();

    return dacmd;
}

