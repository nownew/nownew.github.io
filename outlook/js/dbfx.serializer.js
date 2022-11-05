
DBFX.RegisterNamespace("DBFX.Serializer");

DBFX.Serializer.Serializers = new Object();

DBFX.Serializer.Serializers.GetSerializer = function (cd) {

    var s = null;
    if (cd != undefined && cd != null && cd.Serializer != null && cd.Serializer!="") {


        var skey = "k" + cd.Serializer.replace(".","_");
        s = DBFX.Serializer.Serializers[skey];
        if (s == null) {
            s=eval("new " + cd.Serializer + "()");
            DBFX.Serializer.Serializers[skey] = s;
        }

    }

    return s;
}


DBFX.Serializer.ControlSerializer=function()
{



}

DBFX.Serializer.CommandNameToCmd = function (cmdname) {

    //初始化全局命名命令调用
    var gcmd = cmdname;
    var cmd = undefined;
    if (gcmd != undefined && gcmd != null && gcmd != "") {

        //获取全局命令实例
        cmd = app.GlobalCommands[gcmd];

        if (cmd == undefined) {
            try {

                var r = eval("typeof " + gcmd);

                if (r == "function") {

                    cmd = new DBFX.ComponentsModel.BaseCommand(eval(gcmd));

                }

            } catch (ex) {
                console.log(ex);
            }

        }


    }

    return cmd;

}

DBFX.Serializer.DeSerializeCommandName = function (c,eventname,cmdname) {

    //初始化全局命名命令调用
    var gcmd = cmdname;
    var cmd = undefined;
    if (gcmd != undefined && gcmd != null && gcmd != "") {

        //获取全局命令实例
        cmd = app.GlobalCommands[gcmd];

        if (cmd == undefined) {
            try {

                var r = eval("typeof " + gcmd);

                if (r == "function") {

                    cmd = new DBFX.ComponentsModel.BaseCommand(eval(gcmd));

                }

            } catch (ex) {
                console.log(ex);
            }

        }

        if (cmd != undefined && cmd.GetType() == "Command")
            c[eventname] = cmd;

    }


}
//系列化控件
//c为要系列化的控件
//xe为系列化的文档节点
DBFX.Serializer.DeSerializeCommand = function (eventname, xe,c) {

    //初始化全局命名命令调用
    var cmd = null;
    try{
        var eventcmd = xe.getAttribute(eventname);
        if (eventcmd!=null && eventcmd.indexOf("{") >= 0) {

            var cmdobj = JSON.parse(eventcmd);
            c[eventname] = new DBFX.ComponentsModel.BaseCommand("", cmdobj);


            if (c.DesignView != undefined) {
                c.DesignView.AddCodeItem(cmdobj);
                c.DesignView.AddNSCodeItem(cmdobj);
            }

        }
        else {
            if (eventcmd != undefined && eventcmd != null && eventcmd != "") {

                //获取全局命令实例
                cmd = app.GlobalCommands[eventcmd];

                //No Global Command
                if (cmd == null) {
                    var r = false;

                    var cbtype =eval("typeof "+eventcmd);

                    r = (cbtype == "function");

                    if (r)
                        cmd=eval(eventcmd);


                }

                if(cmd!=undefined)
                    c[eventname] = cmd;
            }
        }
    }
    catch(ex){}

}

DBFX.Serializer.SerializeCommand = function (eventname, obj, xe) {

    if (obj!=undefined &&  typeof obj.GetType == "function" && obj.GetType().toLowerCase() == "command") {

        obj.Control=undefined;
        delete obj.Control;
        if (obj.Sender != undefined) {
            delete obj.Sender;
        }

        if (DBFX.Design != undefined && DBFX.Design.DesignView != undefined && DBFX.Design.DesignView.ActivedDesignView != undefined) {
            DBFX.Design.DesignView.ActivedDesignView.AddNSCodeItem(obj);
        }

    }

    if (obj != undefined && obj != null && obj != "" && obj!="undefined" && typeof obj!="function")
        xe.setAttribute(eventname, JSON.stringify(obj));


}

//反系列化对象
DBFX.Serializer.DeSerializeObject = function (obj, xe) {

    //初始化对象属性
    for (var ai = 0; ai < xe.attributes.length; ai++) {

        var a = xe.attributes[ai];
        obj[a.name] = a.value;

    }

    if (xe.childNodes.length > 0) {
        obj["Items"] = new Array();
        //初始化子对象
        for (var j = 0; j < xe.childNodes.length; j++) {
            var cxe = xe.childNodes[j];

            if (cxe.localName == null)
                continue;

            var cobj = new Object();
            obj["Items"].push(cobj);
            DBFX.Serializer.DeSerializeObject(cobj, cxe);

        }
    }

    return obj;
}


//系列化对象
DBFX.Serializer.SerializeObject = function (obj, xe) {



}

//反系列化对象属性
DBFX.Serializer.DeSerialProperty = function (property, obj, xe) {


    var pobj = xe.getAttribute(property);

    if (pobj!=undefined && pobj != null && pobj!="undefined")
        obj[property] = pobj;


}

//系列化对象属性
DBFX.Serializer.SerialProperty = function (property, vo, xe,f) {

    if ((vo==undefined || vo==null || vo=="undefined" || typeof vo=="function" || (property == "Name" && (vo == "undefined" || vo==""))) && f!=1)
        return;

    if(vo!=undefined && vo!=null && vo.toString()!="" || f==1 )
        xe.setAttribute(property, vo);

}


//反系列化对象全部属性
DBFX.Serializer.SerializeProperties = function (obj, xe) {

    for (var i = 0; i < xe.attributes.length; i++) {

        var at = xe.attributes[i];
        
        obj[at.name] = at.value;

    } 


}

DBFX.Serializer.SerializeBindings = function (obj, xe) {

    if (Array.isArray(obj.bindings) && obj.bindings.length > 0) {

            
        xe.setAttribute("Bindings", JSON.stringify(obj.bindings));


    }


}

DBFX.Serializer.DeSerializeBindings = function (obj, xe) {

    var xbds = xe.getAttribute("Bindings");
    if (xbds != undefined && xbds != null && xbds!="") {

        var bds = JSON.parse(xbds);
        for (var i = 0; i < bds.length; i++) {

            var xbd = bds[i];
            var bd = new DBFX.ComponentsModel.Binding(xbd);
            obj.bindings.Add(bd);

        }

    }


}

DBFX.Serializer.SerializeInputRules = function (c, xe) {

    DBFX.Serializer.SerialProperty("TipText", c.TipText, xe);
    DBFX.Serializer.SerialProperty("ErrorTipText", c.ErrorTipText, xe);
    DBFX.Serializer.SerialProperty("CheckRule", c.CheckRule, xe);


}


//反系列化控件
//xe为文档对象
//返回c为反系列化成功的控件对象
DBFX.Serializer.ControlSerializer.prototype.DeSerialize = function (c, xe,ns) {

    //系列化专属属性
    DBFX.Serializer.DeSerialProperty("DataDomain", c, xe);
    DBFX.Serializer.DeSerialProperty("DataProperty", c, xe);
    //系列化对象属性
    for (var aidx = 0; aidx < xe.attributes.length; aidx++) {

        var att = xe.attributes[aidx];
        if (att.name == "T" || att.name == "DataBindings")
            continue;

        DBFX.Serializer.DeSerialProperty(att.name, c, xe);

    }

    try{
        var binding = xe.getAttribute("DataBindings");
        if (binding != null) {
            var bd = null;
            binding = "[" + binding + "]";
        
            bd = eval(binding)[0];
        
            c.DataBindings = bd;


        }
    } catch (ex) { }
    //反系列化绑定
    DBFX.Serializer.DeSerializeBindings(c, xe);;
    DBFX.Serializer.DeSerializeCommand("Click", xe, c);
    DBFX.Serializer.DeSerializeCommand("ValueChanged", xe, c);
    DBFX.Serializer.DeSerializeCommand("Keypress", xe, c);
    DBFX.Serializer.DeSerializeCommand("KeyDown", xe, c);
    DBFX.Serializer.DeSerializeCommand("KeyUp", xe, c);
    DBFX.Serializer.DeSerializeCommand("MouseDown", xe, c);
    DBFX.Serializer.DeSerializeCommand("MouseUp", xe, c);
    DBFX.Serializer.DeSerializeCommand("MouseMove", xe, c);
    DBFX.Serializer.DeSerializeCommand("MouseOver", xe, c);
    DBFX.Serializer.DeSerializeCommand("MouseWheel", xe, c);
    //执行类型系列化
    var s = DBFX.Serializer.Serializers.GetSerializer(c.ClassDescriptor);

    if (s != null) {

        s.DeSerialize(c,xe,ns);

    }
 
    return c;
}

//反系列化控件
//xe为文档对象
//返回c为反系列化成功的控件对象
DBFX.Serializer.ControlSerializer.prototype.DeSerializeProperties = function (c, xe, ns) {

    //系列化专属属性
    DBFX.Serializer.DeSerialProperty("DataDomain", c, xe);
    DBFX.Serializer.DeSerialProperty("DataProperty", c, xe);
    //系列化对象属性
    for (var aidx = 0; aidx < xe.attributes.length; aidx++) {

        var att = xe.attributes[aidx];
        if (att.name == "T" || att.name == "DataBindings")
            continue;

        DBFX.Serializer.DeSerialProperty(att.name, c, xe);

    }

    try {
        var binding = xe.getAttribute("DataBindings");
        if (binding != null) {
            var bd = null;
            binding = "[" + binding + "]";

            bd = eval(binding)[0];

            c.DataBindings = bd;


        }
    } catch (ex) { }
    //反系列化绑定
    DBFX.Serializer.DeSerializeBindings(c, xe);;


    return c;
}

//系列化控件
//c为要系列化的控件
//xe为系列化的文档节点
DBFX.Serializer.ControlSerializer.prototype.Serialize = function (c, xe, ns) {

    //系列化对象名字空间
    DBFX.Serializer.SerialProperty("T", c.NSSN + ":" + c.ObjType, xe);
    //DBFX.Serializer.SerialProperty("ObjImageUrl", c.ObjImageUrl, xe);
    //执行公共属性系列化
    DBFX.Serializer.SerialProperty("Name", c.Name, xe);
    DBFX.Serializer.SerialProperty("DataDomain", c.DataDomain, xe);
    DBFX.Serializer.SerialProperty("DataProperty", c.DataProperty, xe);
    DBFX.Serializer.SerialProperty("Dock", c.Dock, xe);
    DBFX.Serializer.SerialProperty("Height", c.Height, xe);
    DBFX.Serializer.SerialProperty("Width", c.Width, xe);
    DBFX.Serializer.SerialProperty("MinHeight", c.MinHeight, xe);
    DBFX.Serializer.SerialProperty("MinWidth", c.MinWidth, xe);
    DBFX.Serializer.SerialProperty("MaxHeight", c.MaxHeight, xe);
    DBFX.Serializer.SerialProperty("MaxWidth", c.MaxWidth, xe);
    DBFX.Serializer.SerialProperty("Margin", c.Margin, xe);
    DBFX.Serializer.SerialProperty("Padding", c.Padding, xe);
    DBFX.Serializer.SerialProperty("Left", c.Left, xe);
    DBFX.Serializer.SerialProperty("Top", c.Top, xe);
    DBFX.Serializer.SerialProperty("Bottom", c.Bottom, xe);
    DBFX.Serializer.SerialProperty("Right", c.Right, xe);
    DBFX.Serializer.SerialProperty("Position", c.Position, xe);
    DBFX.Serializer.SerialProperty("Display", c.Display, xe);
    DBFX.Serializer.SerialProperty("Float", c.Float, xe);
    DBFX.Serializer.SerialProperty("Value", c.Value, xe);
    DBFX.Serializer.SerialProperty("AccessKey", c.AccessKey, xe);
    DBFX.Serializer.SerialProperty("TabIndex", c.TabIndex, xe);
    DBFX.Serializer.SerialProperty("Text", c.Text, xe);
    DBFX.Serializer.SerialProperty("BackgroundColor", c.BackgroundColor, xe);
    DBFX.Serializer.SerialProperty("BackgroundImageUrl", c.BackgroundImageUrl, xe);
    DBFX.Serializer.SerialProperty("BackgroundSizeMode", c.BackgroundSizeMode, xe);
    DBFX.Serializer.SerialProperty("BackgroundPosition", c.BackgroundPosition, xe);
    DBFX.Serializer.SerialProperty("BackgroundRepeat", c.BackgroundRepeat, xe);
    DBFX.Serializer.SerialProperty("FlexShrink", c.FlexShrink, xe);
    DBFX.Serializer.SerialProperty("Color", c.Color, xe);
    DBFX.Serializer.SerialProperty("Position", c.Position, xe);
    DBFX.Serializer.SerialProperty("Border", c.Border, xe);
    DBFX.Serializer.SerialProperty("BorderWidth", c.BorderWidth, xe);
    DBFX.Serializer.SerialProperty("BorderStyle", c.BorderStyle, xe);
    DBFX.Serializer.SerialProperty("BorderColor", c.BorderColor, xe);
    DBFX.Serializer.SerialProperty("BorderRadius", c.BorderRadius, xe);
    DBFX.Serializer.SerialProperty("FontSize", c.FontSize, xe);
    DBFX.Serializer.SerialProperty("FontFamily", c.FontFamily, xe);
    DBFX.Serializer.SerialProperty("FontStyle", c.FontStyle, xe);
    DBFX.Serializer.SerialProperty("Enabled", c.Enabled, xe);
    DBFX.Serializer.SerialProperty("Visibled", (c.visibled?undefined:c.visibled), xe);
    DBFX.Serializer.SerialProperty("ReadOnly", c.ReadOnly, xe);
    DBFX.Serializer.SerialProperty("Align", c.Align, xe);
    DBFX.Serializer.SerialProperty("VAlign", c.VAlign, xe);
    DBFX.Serializer.SerialProperty("Opacity", c.Opacity, xe);
    DBFX.Serializer.SerialProperty("Shadow", c.Shadow, xe);
    DBFX.Serializer.SerialProperty("ZIndex", c.ZIndex, xe);
    DBFX.Serializer.SerialProperty("HorizonScrollbar", c.HorizonScrollbar, xe);
    DBFX.Serializer.SerialProperty("VerticalScrollbar", c.VerticalScrollbar, xe);
    DBFX.Serializer.SerialProperty("EnabledExpression", c.enabledExpression, xe);
    DBFX.Serializer.SerialProperty("VisibleExpression", c.visibleExpression, xe);
    DBFX.Serializer.SerialProperty("ValueChangedCommand", c.ValueChangedCommand, xe);

    //系列化快捷绑定
    if (c.DataBindings != undefined && c.DataBindings.Path != "") {

        if (typeof c.DataBindings == "string")
        {
            DBFX.Serializer.SerialProperty("DataBindings", c.DataBindings, xe);
        }
        else
        {
            DBFX.Serializer.SerialProperty("DataBindings", JSON.stringify(c.DataBindings), xe);

        }

    }

    //系列化Click方法
    DBFX.Serializer.SerializeCommand("Click", c.Click, xe);
    DBFX.Serializer.SerializeCommand("ValueChanged", c.ValueChanged, xe);
    DBFX.Serializer.SerializeCommand("Keypress", c.Keypress, xe);
    DBFX.Serializer.SerializeCommand("KeyDown", c.KeyDown, xe);
    DBFX.Serializer.SerializeCommand("KeyUp", c.KeyUp, xe);
    DBFX.Serializer.SerializeCommand("MouseDown", c.MouseDown, xe);
    DBFX.Serializer.SerializeCommand("MouseUp", c.MouseUp, xe);
    DBFX.Serializer.SerializeCommand("MouseOver", c.MouseOver, xe);
    DBFX.Serializer.SerializeCommand("MouseMove", c.MouseMove, xe);
    DBFX.Serializer.SerializeCommand("MouseWheel", c.MouseWheel, xe);
    //系列化绑定设置
    DBFX.Serializer.SerializeBindings(c, xe);
    //执行类型系列化
    var s = DBFX.Serializer.Serializers.GetSerializer(c.ClassDescriptor);

    if (s != null) {

        s.Serialize(c, xe, ns);

    }


}


//表单系列化
DBFX.Serializer.FormSerializer = function () {
    //系列化表单
    //c为要系列化的表单
    //xe为系列化的文档节点
    DBFX.Serializer.FormSerializer.prototype.Serialize = function (f, xe,ns) {

        DBFX.Serializer.SerialProperty("Opacity", f.Opacity, xe);
        DBFX.Serializer.SerialProperty("HorizonScrollbar", f.HorizonScrollbar, xe);
        DBFX.Serializer.SerialProperty("VerticalScrollbar", f.VerticalScrollbar, xe);
        DBFX.Serializer.SerialProperty("IsCanClose", f.IsCanClose, xe);
        DBFX.Serializer.SerialProperty("HasTitleBar", f.HasTitleBar, xe);
        DBFX.Serializer.SerializeCommand("UnLoad", f.UnLoad, xe);
        DBFX.Serializer.SerializeCommand("Load", f.Load, xe);
        DBFX.Serializer.SerializeCommand("Resume", f.Resume, xe);
        DBFX.Serializer.SerializeCommand("MouseDown", f.MouseDown, xe);
        DBFX.Serializer.SerializeCommand("MouseUp", f.MouseUp, xe);
        DBFX.Serializer.SerializeCommand("MouseOver", f.MouseOver, xe);
        DBFX.Serializer.SerializeCommand("MouseMove", f.MouseMove, xe);
        DBFX.Serializer.SerializeCommand("MouseWheel", f.MouseMove, xe);
        DBFX.Serializer.SerializeCommand("KeyUp", f.KeyUp, xe);
        DBFX.Serializer.SerializeCommand("KeyDown", f.KeyDown, xe);
    }

    //反系列化控件
    //xe为文档对象
    //返回c为反系列化成功的表单对象
    DBFX.Serializer.FormSerializer.prototype.DeSerialize = function (xe, f)
    {

        //var xe = xdoc.documentElement;
        if (f == null || f == undefined)
            f = new DBFX.Web.Forms.Form(xe.getAttribute("Title"));

        DBFX.Serializer.DeSerialProperty("HasTitleBar", f, xe);
        DBFX.Serializer.DeSerialProperty("IsCanClose", f, xe);
        DBFX.Serializer.DeSerialProperty("BorderStyle", f, xe);
        DBFX.Serializer.DeSerialProperty("BorderWidth", f, xe)
        DBFX.Serializer.DeSerialProperty("BorderColor", f, xe)
        DBFX.Serializer.DeSerialProperty("Shadow", f, xe)
        DBFX.Serializer.DeSerialProperty("Width", f, xe);
        DBFX.Serializer.DeSerialProperty("Height", f, xe);
        DBFX.Serializer.DeSerialProperty("Padding", f, xe);
        DBFX.Serializer.DeSerialProperty("HorizonScrollbar", f, xe);
        DBFX.Serializer.DeSerialProperty("VerticalScrollbar", f, xe);
        DBFX.Serializer.DeSerialProperty("ScrollStyle", f, xe);
        DBFX.Serializer.DeSerialProperty("BackgroundColor", f, xe);
        DBFX.Serializer.DeSerialProperty("BackgroundImageUrl", f, xe);
        DBFX.Serializer.DeSerialProperty("BackgroundSizeMode", f, xe);
        DBFX.Serializer.DeSerialProperty("Opacity", f, xe);
        //创建名称空间
        f.NS = new Object();
        var ns = xe.querySelector("xns").querySelectorAll("ns");
        for (var i = 0; i < ns.length; i++) {
            var xns = ns.item(i);
            f.NS[xns.getAttribute("k")] = xns.getAttribute("n");

        }

        var doctitle = xe.getAttribute("DocumentTitle");
        if (doctitle != undefined && doctitle != null && doctitle != "")
            document.title = doctitle;
        
        

        //创建对象
        var cs = xe.querySelector("controls")

        for (var i = 0; i < cs.childNodes.length; i++) {
            var xce = cs.childNodes[i];

            if (xce.localName != "c")
                continue;

            //创建对象实例
            var c = DBFX.Serializer.CreateInstance(xce, f.NS,f.DesignTime);

            f.AddControl(c);

            //反系列化对象
            ControlSerializer.DeSerialize(c, xce,f.NS);

            if (c.Name != undefined && c.Name != null && c.Name != "")
                f.FormContext.Form.FormControls[c.Name] = c;

        }

        //
        DBFX.Serializer.DeSerializeCommand("Load", xe, f);
        DBFX.Serializer.DeSerializeCommand("UnLoad", xe, f);
        DBFX.Serializer.DeSerializeCommand("Resume", xe, f);
        DBFX.Serializer.DeSerializeCommand("MouseDown", xe, f);
        DBFX.Serializer.DeSerializeCommand("MouseUp", xe, f);
        DBFX.Serializer.DeSerializeCommand("MouseMove", xe, f);
        DBFX.Serializer.DeSerializeCommand("MouseOver", xe, f);
        DBFX.Serializer.DeSerializeCommand("MouserWheel", xe, f);
        DBFX.Serializer.DeSerializeCommand("KeyUp", xe, f);
        DBFX.Serializer.DeSerializeCommand("KeyDown", xe, f);
        var tf = {};  //向下兼容
        DBFX.Serializer.DeSerializeCommand("OnLoad", xe, tf);
        if (tf.OnLoad != undefined && tf.OnLoad.GetType() == "Command")
            f.Load = tf.OnLoad;

        return f;

    }
}

//表单部件系列化
DBFX.Serializer.FormPartSerializer = function () {

    //系列化
    DBFX.Serializer.FormPartSerializer.prototype.Serialize = function (fp, xe,ns)
    {
        //DBFX.Serializer.SerialProperty("ResourceKey", c.ResourceKey, xe);
        //DBFX.Serializer.SerialProperty("Standalone", c.Standalone, xe);
        DBFX.Serializer.SerialProperty("Opacity", fp.Opacity, xe);
        DBFX.Serializer.SerialProperty("IsCanClose", fp.IsCanClose, xe);
        DBFX.Serializer.SerialProperty("HasTitleBar", fp.HasTitleBar, xe);

        DBFX.Serializer.SerializeCommand("UnLoad", fp.UnLoad, xe);
        DBFX.Serializer.SerializeCommand("Load", fp.Load, xe);
        DBFX.Serializer.SerializeCommand("Resume", fp.Resume, xe);
        DBFX.Serializer.SerializeCommand("MouseDown", fp.MouseDown, xe);
        DBFX.Serializer.SerializeCommand("MouseUp", fp.MouseUp, xe);
        DBFX.Serializer.SerializeCommand("MouseOver", fp.MouseOver, xe);
        DBFX.Serializer.SerializeCommand("MouseMove", fp.MouseMove, xe);
        DBFX.Serializer.SerializeCommand("MouseWheel", fp.MouseMove, xe);
        DBFX.Serializer.SerializeCommand("KeyUp", fp.KeyUp, xe);
        DBFX.Serializer.SerializeCommand("KeyDown", fp.KeyDown, xe);
    }

    //反系列化
    DBFX.Serializer.FormPartSerializer.prototype.DeSerialize=function(xe,pctrl,ns)
    {
        var cprt = null;
        if (pctrl != undefined && pctrl != null)
            cprt = pctrl;
        else {
            cprt = new DBFX.Web.Controls.Panel();
            cprt.FormContext = new Object();
            cprt.FormControls = new Object();
            cprt.FormContext.Form=cprt;
        }

        //var xe = xdoc.documentElement;
        DBFX.Serializer.DeSerialProperty("IsCanClose", cprt, xe);
        DBFX.Serializer.DeSerialProperty("HasTitleBar", cprt, xe);
        DBFX.Serializer.DeSerialProperty("BorderStyle", cprt, xe);
        DBFX.Serializer.DeSerialProperty("BorderWidth", cprt, xe)
        DBFX.Serializer.DeSerialProperty("BorderColor", cprt, xe)
        DBFX.Serializer.DeSerialProperty("Shadow", cprt, xe)
        DBFX.Serializer.DeSerialProperty("Width", cprt, xe);
        DBFX.Serializer.DeSerialProperty("MinWidth", cprt, xe);
        DBFX.Serializer.DeSerialProperty("MinHeight", cprt, xe);
        DBFX.Serializer.DeSerialProperty("Height", cprt, xe);
        DBFX.Serializer.DeSerialProperty("Padding", cprt, xe);
        DBFX.Serializer.DeSerialProperty("Position", cprt, xe);
        DBFX.Serializer.DeSerialProperty("HorizonScrollbar", cprt, xe);
        DBFX.Serializer.DeSerialProperty("VerticalScrollbar", cprt, xe);
        DBFX.Serializer.DeSerialProperty("ScrollStyle", cprt, xe);
        DBFX.Serializer.DeSerialProperty("BackgroundColor", cprt, xe);
        DBFX.Serializer.DeSerialProperty("BackgroundImageUrl", cprt, xe);
        DBFX.Serializer.DeSerialProperty("BackgroundSizeMode", cprt, xe);
        DBFX.Serializer.DeSerialProperty("Opacity", cprt, xe);
        var doctitle = xe.getAttribute("DocumentTitle");
        if (doctitle != undefined && doctitle != null && doctitle != "") {
            document.title = doctitle;
            cprt.DocuemtTitle = doctitle;
        }



        //创建名称空间
        var NS = new Object();
        var ns = xe.querySelector("xns").querySelectorAll("ns");
        for (var i = 0; i < ns.length; i++) {
            var xns = ns.item(i);
            NS[xns.getAttribute("k")] = xns.getAttribute("n");

        }

        //创建对象
        var cs = xe.querySelector("controls");

        for (var i = 0; i < cs.childNodes.length; i++) {
            var xce = cs.childNodes[i];
            if (xce.localName != "c")
                continue;
            //创建对象实例
            var c = DBFX.Serializer.CreateInstance(xce, NS,cprt.DesignTime);
            cprt.AddControl(c);
            //反系列化对象
            ControlSerializer.DeSerialize(c, xce,NS);
            
            if (c.Name != undefined && c.Name != null && c.Name != "")
                cprt.FormContext.Form.FormControls[c.Name] = c;

        }



        //
        DBFX.Serializer.DeSerializeCommand("Load", xe, cprt);
        DBFX.Serializer.DeSerializeCommand("UnLoad", xe, cprt);
        DBFX.Serializer.DeSerializeCommand("Resume", xe, cprt);
        DBFX.Serializer.DeSerializeCommand("MouseDown", xe, cprt);
        DBFX.Serializer.DeSerializeCommand("MouseUp", xe, cprt);
        DBFX.Serializer.DeSerializeCommand("MouseMove", xe, cprt);
        DBFX.Serializer.DeSerializeCommand("MouseOver", xe, cprt);
        DBFX.Serializer.DeSerializeCommand("MouserWheel", xe, cprt);
        DBFX.Serializer.DeSerializeCommand("KeyUp", xe, cprt);
        DBFX.Serializer.DeSerializeCommand("KeyDown", xe, cprt);


        var tcprt = {};
        DBFX.Serializer.DeSerializeCommand("OnLoad", xe, tcprt);
        if (tcprt.OnLoad != undefined) {

            cprt.Load = tcprt.OnLoad;

        }

        return cprt;
    }


}

//绘图系列化
DBFX.Serializer.DrawingSerializer = function () {

    //系列化
    this.Serialize = function (drawpaper, xe, ns) {

        DBFX.Serializer.SerialProperty("Width", drawpaper.Width, xe);
        DBFX.Serializer.SerialProperty("Height", drawpaper.Height, xe);
        DBFX.Serializer.SerialProperty("BackgroundColor", drawpaper.BackgroundColor, xe);
        DBFX.Serializer.SerialProperty("OnLoad", "", xe);

    }

    //反系列化
    this.DeSerialize = function (xe, drawp) {
        var drawpaper = null;
        if (drawp != undefined && drawp != null)
            drawpaper = drawp;
        else {
            drawpaper = new DBFX.Web.Controls.Panel();
            drawpaper.FormContext = new Object();
            drawpaper.FormControls = new Object();
            drawpaper.FormContext.Form = drawpaper;
        }


        DBFX.Serializer.DeSerialProperty("Width", drawpaper, xe);
        DBFX.Serializer.DeSerialProperty("Height", drawpaper, xe);
        DBFX.Serializer.DeSerialProperty("Padding", drawpaper, xe);
        DBFX.Serializer.DeSerialProperty("BackgroundColor", drawpaper, xe);
        var doctitle = xe.getAttribute("DocumentTitle");
        if (doctitle != undefined && doctitle != null && doctitle != "") {
            document.title = doctitle;
            drawpaper.DocuemtTitle = doctitle;
        }



        //创建名称空间
        var NS = new Object();
        var ns = xe.querySelector("xns").querySelectorAll("ns");
        for (var i = 0; i < ns.length; i++) {
            var xns = ns.item(i);
            NS[xns.getAttribute("k")] = xns.getAttribute("n");

        }

        //创建对象
        var cs = xe.querySelector("controls");

        for (var i = 0; i < cs.childNodes.length; i++) {
            var xce = cs.childNodes[i];
            if (xce.localName != "c")
                continue;
            //创建对象实例
            var c = DBFX.Serializer.CreateInstance(xce, NS, drawpaper.DesignTime);
            drawpaper.AddControl(c);
            //反系列化对象
            ControlSerializer.DeSerialize(c, xce, NS);

            if (c.Name != undefined && c.Name != null && c.Name != "")
                drawpaper.FormContext.Form.FormControls[c.Name] = c;

        }

        return drawpaper;
    }

}

//控件模板系列化
DBFX.Serializer.ControlTemplateSerializer = function () {

    //反系列化
    this.DeSerialize = function (xe) {

        var templates = new Object();

        //创建名称空间
        var NS = new Object();
        var ns = xe.querySelector("xns").querySelectorAll("ns");
        for (var i = 0; i < ns.length; i++) {
            var xns = ns.item(i);
            NS[xns.getAttribute("k")] = xns.getAttribute("n");

        }

        //初始化模板
        var xtemplates = xe.querySelector("Templates");
        if (xtemplates != undefined && xtemplates != null) {
            for (var i = 0; i < xtemplates.childNodes.length; i++) {

                var xtemplate = xtemplates.childNodes[i];
                if (xtemplate.localName != "t")
                    continue;

                var template = new DBFX.Web.Controls.ControlTemplate(xtemplate);
                template.Keyword = xtemplate.getAttribute("Key");
                template.Uri = xtemplate.getAttribute("Uri");
                template.Namespaces = NS;
                templates[template.Keyword] = template;

            }


        }

        return templates;
    }


    //系列化
    this.Serialize = function (c, xe, ns) {
    


    }



}

//创建实例
DBFX.Serializer.CreateInstance = function (xe,ns,dt) {

    //合成名字空间
    var cns = xe.getAttribute("T").split(":", 2);
    var assmbly = ns[cns[0]];
    if (typeof assmbly != "string")
        assmbly = ns[cns[0]].Namespace;

    var cmethod = "new " + assmbly + "." + cns[1] + "()";
    var c = null;
    c=eval(cmethod);

    //设计时设置相关参数
    if(c!=undefined && c!=null && dt!=undefined && dt==true)
    {
        c.Namespace = assmbly;//ns[cns[0]];
        c.NSSN = cns[0];
        c.ObjType = cns[1];

    }

    return c;

}


//文本框系列化
DBFX.Serializer.TextBoxSerializer = function () {

    //反系列化
    this.DeSerialize = function (c, xe, ns) {

        DBFX.Serializer.DeSerialProperty("TipText", c, xe);
        DBFX.Serializer.DeSerialProperty("IconUrl", c, xe);
        DBFX.Serializer.DeSerialProperty("ReadOnly", c, xe);
        DBFX.Serializer.DeSerialProperty("AutoSelectText", c, xe);
        DBFX.Serializer.DeSerialProperty("ValueChangedCommand", c, xe);
        DBFX.Serializer.DeSerialProperty("KeyboardType", c, xe);
        DBFX.Serializer.DeSerialProperty("MaxLength", c, xe);
        c.ValueChanged = DBFX.Serializer.CommandNameToCmd(xe.getAttribute("ValueChangedCommand"));
        c.SetIconUrl(c.IconUrl, "18px", "18px");

        DBFX.Serializer.DeSerializeCommand("ValueChanged", xe, c);

    }


    //系列化
    this.Serialize = function (c, xe, ns) {

        DBFX.Serializer.SerialProperty("TipText", c.TipText, xe);
        DBFX.Serializer.SerialProperty("IconUrl", c.IconUrl, xe);
        if (c.ReadOnly == true)
            DBFX.Serializer.SerialProperty("ReadOnly", c.ReadOnly, xe);

        if (c.AutoSelectText == true)
            DBFX.Serializer.SerialProperty("AutoSelectText", c.AutoSelectText, xe);

        DBFX.Serializer.SerialProperty("CheckRule", c.CheckRule, xe);
        DBFX.Serializer.SerialProperty("ErrorTipText", c.ErrorTipText, xe);
        DBFX.Serializer.SerialProperty("KeyboardType", c.KeyboardType, xe);
        DBFX.Serializer.SerialProperty("MaxLength", c.MaxLength, xe);

    }

}

//图片管理视图系列化
DBFX.Serializer.PictureManagerViewSerializer=function()
{

    //反系列化
    this.DeSerialize = function (c, xe, ns) {



    }


    //系列化
    this.Serialize = function (c, xe, ns) {

        DBFX.Serializer.SerialProperty("ImageHeight", c.ImageHeight, xe);
        DBFX.Serializer.SerialProperty("ImageWidth", c.ImageWidth, xe);
        DBFX.Serializer.SerialProperty("Mode", c.mode, xe);
        DBFX.Serializer.SerialProperty("ImageCount", c.ImageCount, xe);
        DBFX.Serializer.SerialProperty("ItemSource", JSON.stringify(c.ItemSource), xe);

    }


}


//密码框列化
DBFX.Serializer.PasswordBoxSerializer = function () {

    //反系列化
    this.DeSerialize = function (c, xe,ns) {

        c.SetTipText(xe.getAttribute("TipText"));
        c.SetIconUrl(xe.getAttribute("IconUrl"), "18px", "18px");
    }


    //系列化
    this.Serialize = function (c, xe,ns) {



    }

}

//图片控件系列化
DBFX.Serializer.ImageSerializer = function () {

    //反系列化
    this.DeSerialize = function (c, xe,ns) {

        DBFX.Serializer.DeSerialProperty("ImageUrl", c, xe);
        DBFX.Serializer.DeSerialProperty("CommandName", c, xe);
        DBFX.Serializer.DeSerializeCommand("Click", xe, c);
        DBFX.Serializer.DeSerializeCommandName(c, "Click", c.CommandName);

    }


    //系列化
    this.Serialize = function (c, xe,ns) {

        DBFX.Serializer.SerialProperty("ImageUrl", c.ImageUrl, xe);
        DBFX.Serializer.SerialProperty("AllowLIMG", c.AllowLIMG, xe);
        DBFX.Serializer.SerialProperty("CommandName", c.CommandName, xe);
        DBFX.Serializer.SerializeCommand("Click", c.Click, xe);

    }

}

//应用程序标题
DBFX.Serializer.AppBarSerializer = function () {

    //反系列化
    this.DeSerialize = function (c, xe,ns) {

        c.LogoUrl = xe.getAttribute("LogoUrl");
        c.Title = xe.getAttribute("Title");
    }


    //系列化
    this.Serialize = function (c, xe,ns) {



    }

}

//应用程序标题
DBFX.Serializer.PanelSerializer = function () {

    //反系列化
    this.DeSerialize = function (pc, xe, ns) {

        //系列化子控件
        var bd = xe.getAttribute("Border");
         if(bd!=null)
            pc.Border = bd;

         var shd = xe.getAttribute("Shadow");
         if (shd != null)
             pc.Shadow = shd;

        var xcs = xe.querySelector("controls");
        if (xcs != undefined && xcs != null) {
            for (var i = 0; i < xcs.childNodes.length; i++) {
                var xce = xcs.childNodes[i];
                if (xce.localName != "c")
                    continue;

                //创建对象实例
                var c = DBFX.Serializer.CreateInstance(xce, ns, pc.DesignTime);

                pc.AddControl(c);



                //设计时支持
                if (pc.DesignTime != undefined && pc.DesignTime == true) {

                    pc.DesignView.SetDesignTimeMode(c, pc);

                }


                //反系列化对象
                ControlSerializer.DeSerialize(c, xce, ns);

                if (c.Name != undefined && c.Name != null && c.Name!="")
                    pc.FormContext.Form.FormControls[c.Name] = c;



            }
        }
    }


    //系列化
    this.Serialize = function (pc, xe, ns) {
        var xdoc=xe.ownerDocument;
        DBFX.Serializer.SerialProperty("Shadow", pc.Shadow, xe);
        //系列化控件集合
        var xcs = xdoc.createElement("controls");
        xe.appendChild(xcs);

        for (var i = 0; i < pc.Controls.length; i++) {

            var cm =pc.Controls[i];
            var cxe = xdoc.createElement("c");
            xcs.appendChild(cxe);

            ControlSerializer.Serialize(cm, cxe, null);

        }



    }

}

//应用程序标题
DBFX.Serializer.NavPanelSerializer = function () {

    //反系列化
    this.DeSerialize = function (pc, xe, ns) {

        //系列化子控件
        var bd = xe.getAttribute("Border");
        if (bd != null)
            pc.Border = bd;

        var shd = xe.getAttribute("Shadow");
        if (shd != null)
            pc.Shadow = shd;

        var xcs = xe.querySelector("controls");
        if (xcs != undefined && xcs != null) {
            for (var i = 0; i < xcs.childNodes.length; i++) {
                var xce = xcs.childNodes[i];
                if (xce.localName != "c")
                    continue;

                //创建对象实例
                var c = DBFX.Serializer.CreateInstance(xce, ns, pc.DesignTime);

                pc.AddControl(c);



                //设计时支持
                if (pc.DesignTime != undefined && pc.DesignTime == true) {

                    pc.DesignView.SetDesignTimeMode(c, pc);

                }


                //反系列化对象
                ControlSerializer.DeSerialize(c, xce, ns);

                if (c.Name != undefined && c.Name != null && c.Name != "")
                    pc.FormContext.Form.FormControls[c.Name] = c;



            }
        }
    }


    //系列化
    this.Serialize = function (pc, xe, ns) {
        var xdoc = xe.ownerDocument;
        DBFX.Serializer.SerialProperty("Shadow", pc.Shadow, xe);
        DBFX.Serializer.SerialProperty("ResourceUri", pc.ResourceUri, xe);
        DBFX.Serializer.SerialProperty("ResourceText", pc.ResourceText, xe);
        DBFX.Serializer.SerialProperty("Mode", pc.Mode, xe);
        //系列化控件集合
        var xcs = xdoc.createElement("controls");
        xe.appendChild(xcs);

        for (var i = 0; i < pc.Controls.length; i++) {

            var cm = pc.Controls[i];
            var cxe = xdoc.createElement("c");
            xcs.appendChild(cxe);

            ControlSerializer.Serialize(cm, cxe, null);

        }



    }

}

//应用程序标题
DBFX.Serializer.GroupPanelSerializer = function () {

    //反系列化
    this.DeSerialize = function (pc, xe, ns) {

        var xcs = xe.querySelector("controls");
        if (xcs != undefined && xcs != null) {
            for (var i = 0; i < xcs.childNodes.length; i++) {
                var xce = xcs.childNodes[i];
                if (xce.localName != "c")
                    continue;

                //创建对象实例
                var c = DBFX.Serializer.CreateInstance(xce, ns, pc.DesignTime);

                pc.AddControl(c);



                //设计时支持
                if (pc.DesignTime != undefined && pc.DesignTime == true) {

                    pc.DesignView.SetDesignTimeMode(c, pc);

                }


                //反系列化对象
                ControlSerializer.DeSerialize(c, xce, ns);

                if (c.Name != undefined && c.Name != null && c.Name != "")
                    pc.FormContext.Form.FormControls[c.Name] = c;



            }
        }
    }


    //系列化
    this.Serialize = function (pc, xe, ns) {

        var xdoc = xe.ownerDocument;
        DBFX.Serializer.SerialProperty("OrgHeight", pc.OrgHeight, xe);
        DBFX.Serializer.SerialProperty("IsExpanded", pc.IsExpanded, xe);
        DBFX.Serializer.SerialProperty("Text", pc.Text, xe);
        DBFX.Serializer.SerialProperty("Shadow", pc.Shadow, xe);

        //系列化控件集合
        var xcs = xdoc.createElement("controls");
        xe.appendChild(xcs);

        for (var i = 0; i < pc.Controls.length; i++) {

            var cm = pc.Controls[i];
            var cxe = xdoc.createElement("c");
            xcs.appendChild(cxe);

            ControlSerializer.Serialize(cm, cxe, null);



        }



    }

}


//停靠布局控件系列化
DBFX.Serializer.ControlDockPanelSerializer = function () {

    //反系列化
    this.DeSerialize = function (pc, xe, ns) {

        //系列化子控件
        var bd = xe.getAttribute("Border");
        if (bd != null)
            pc.Border = bd;

        var xcs = xe.querySelector("controls");
        pc.IsUpdate = true;
        if (xcs != undefined && xcs != null) {
            for (var i = 0; i < xcs.childNodes.length; i++) {
                var xce = xcs.childNodes[i];
                if (xce.localName != "c")
                    continue;

                //创建对象实例
                var c = DBFX.Serializer.CreateInstance(xce, ns,pc.DesignTime);
                pc.AddControl(c);

                //设计时支持
                if (pc.DesignTime != undefined && pc.DesignTime == true) {

                    pc.DesignView.SetDesignTimeMode(c, pc);

                }


                //反系列化对象
                ControlSerializer.DeSerialize(c, xce, ns);

                if (c.Name != undefined && c.Name != null && c.Name != "")
                    pc.FormContext.Form.FormControls[c.Name] = c;

            }
        }
        pc.IsUpdate = false;
        
        if (pc.Controls.length > 0)
            pc.ReLayoutControls();
    }


    //系列化
    this.Serialize = function (c, xe, ns) {

        var xdoc = xe.ownerDocument;
        //系列化控件集合
        var xcs = xdoc.createElement("controls");
        xe.appendChild(xcs);

        for (var i = 0; i < c.Controls.length; i++) {

            var cm = c.Controls[i];
            var cxe = xdoc.createElement("c");
            xcs.appendChild(cxe);

            ControlSerializer.Serialize(cm, cxe, null);

        }

    }


}

//应用程序标题
DBFX.Serializer.PopupPanelSerializer = function () {

    //反系列化
    this.DeSerialize = function (pc, xe, ns) {


        var xcs = xe.querySelector("controls");
        if (xcs != undefined && xcs != null) {
            for (var i = 0; i < xcs.childNodes.length; i++) {
                var xce = xcs.childNodes[i];
                if (xce.localName != "c")
                    continue;

                //创建对象实例
                var c = DBFX.Serializer.CreateInstance(xce, ns, pc.DesignTime);
                pc.AddControl(c);
                //反系列化对象
                ControlSerializer.DeSerialize(c, xce, ns);

                if (c.Name != undefined && c.Name != null && c.Name != "")
                    pc.FormContext.Form.FormControls[c.Name] = c;

            }
        }
    }


    //系列化
    this.Serialize = function (c, xe, ns) {



    }

}

DBFX.Serializer.PopupMenuSerializer = function () {
    //反系列化
    this.DeSerialize = function (pc, xe, ns) {

        pc.Display = xe.getAttribute("Display");

        var xcs = xe.querySelector("controls");
        if (xcs != undefined && xcs != null) {
            for (var i = 0; i < xcs.childNodes.length; i++) {
                var xce = xcs.childNodes[i];
                if (xce.localName != "c")
                    continue;

                //创建对象实例
                var c = DBFX.Serializer.CreateInstance(xce, ns);
                pc.AddItem(c);
                //反系列化对象
                c.Text = xce.getAttribute("Text");
                c.Color = xce.getAttribute("Color");
                c.ImageUrl = xce.getAttribute("ImageUrl");
                c.CommandName = xce.getAttribute("CommandName");

                //初始化全局命名命令调用
                var gcmd = xce.getAttribute("CommandName");
                if (gcmd != undefined && gcmd != null && gcmd != "") {

                    //获取全局命令实例
                    c.Command = app.GlobalCommands[gcmd];

                }
            }
        }
    }


    //系列化
    this.Serialize = function (c, xe, ns) {



    }
}


//应用程序标题
DBFX.Serializer.DatePickerSerializer = function () {

    //反系列化
    this.DeSerialize = function (c, xe, ns) {

        DBFX.Serializer.DeSerialProperty("TipText", c, xe);
        DBFX.Serializer.DeSerialProperty("Mode", c, xe);
        DBFX.Serializer.DeSerialProperty("CheckRule", c, xe);
    }


    //系列化
    this.Serialize = function (c, xe, ns) {

        DBFX.Serializer.SerialProperty("CheckRule", c.CheckRule, xe);
        DBFX.Serializer.SerialProperty("TipText", c.TipText, xe);
        DBFX.Serializer.SerialProperty("Mode", c.Mode, xe);
    }

}

//汉堡菜单系列化
DBFX.Serializer.HamMenuSerialer = function () {

    //反系列化
    this.DeSerialize = function (pc, xe, ns) {

        //系列化子控件
        var bd = xe.getAttribute("Border");
        if (bd != null)
            pc.Border = bd;

        var xcs = xe.querySelector("controls");

        if (xcs != undefined && xcs != null) {

            for (var i = 0; i < xcs.childNodes.length; i++) {
                var xce = xcs.childNodes[i];
                if (xce.localName != "c")
                    continue;

                //创建对象实例
                var c = DBFX.Serializer.CreateInstance(xce, ns, pc.DesignTime);

                pc.AddItem(c);

                //反系列化对象
                ControlSerializer.DeSerialize(c, xce, ns);
                c.ImageUrl = xce.getAttribute("ImageUrl");

            }

        }
        DBFX.Serializer.DeSerialProperty("ItemSourceMember", pc, xe);
        DBFX.Serializer.DeSerialProperty("AutoExpanded", pc, xe);
        DBFX.Serializer.DeSerializeCommand("HamMenuItemClicked", xe, pc);

    }

    //系列化
    this.Serialize = function (c, xe, ns) {

        DBFX.Serializer.SerialProperty("ItemSourceMember", c.itemSourceMember, xe);
        DBFX.Serializer.SerialProperty("AutoExpanded", c.AutoExpanded, xe);
        DBFX.Serializer.SerializeCommand("HamMenuItemClicked", c.HamMenuItemClicked, xe);

    }


}

//汉堡菜单项目系列化
DBFX.Serializer.HamMenuItemSerialer = function () {

    //反系列化
    this.DeSerialize = function (pc, xe, ns) {

        var xcs = xe.querySelector("controls");

        if (xcs != undefined && xcs != null) {
            for (var i = 0; i < xcs.childNodes.length; i++) {
                var xce = xcs.childNodes[i];
                if (xce.localName != "c")
                    continue;

                //创建对象实例
                var c = DBFX.Serializer.CreateInstance(xce, ns);
                pc.AddItem(c);
                //反系列化对象
                ControlSerializer.DeSerialize(c, xce, ns);
                c.ImageUrl = xce.getAttribute("ImageUrl");

                DBFX.Serializer.DeSerializeCommand("OnClick", xce,c);

            }

        }

    }

    //系列化
    this.Serialize = function (c, xe, ns) {



    }


}

//上下文菜单系列化
DBFX.Serializer.ContextMenuSerializer = function () {

    //反系列化
    this.DeSerialize = function (pc, xe, ns) {

        var xcs = xe.querySelector("controls");
        if (xcs != undefined && xcs != null) {
            for (var i = 0; i < xcs.childNodes.length; i++) {
                var xce = xcs.childNodes[i];
                if (xce.localName != "c")
                    continue;

                var item = DBFX.Serializer.CreateInstance(xce, ns);

                ControlSerializer.DeSerialize(item, xce, ns);

                DBFX.Serializer.DeSerializeCommand("OnClick", xce,item);

                pc.AddItem(item);

            }
        }

        if (pc.Name != null && pc.Name != undefined) {

            DBFX.Web.Controls.ContextMenu.ContextMenus[pc.Name] = pc;

        }

    }


    //系列化
    this.Serialize = function (c, xe, ns) {



    }


}

//菜单项目系列化
DBFX.Serializer.MenuItemSerializer = function () {

    //反系列化
    this.DeSerialize = function (c, xe, ns)
    {



    }


    //系列化
    this.Serialize = function (c, xe, ns) {

        DBFX.Serializer.SerialProperty("Max", c.Max, xe);
        DBFX.Serializer.SerialProperty("Min", c.Min, xe);
        DBFX.Serializer.SerialProperty("Step", c.Step, xe);
    }

}

//网格面板系列化
DBFX.Serializer.GridPanelSerializer = function () {

    //反系列化
    this.DeSerialize = function (gpnl, xe,ns) {

        //查询行
        //var xtrs = xe.querySelectorAll("TR");
        //查询列
        for (var i=0;i<xe.childNodes.length;i++) {

            var xtr = xe.childNodes[i];
            if (xtr.tagName==undefined || xtr.tagName.toLowerCase() != "tr")
                continue;

            var tr = new DBFX.Web.LayoutControls.TRow();
            tr.Height = xtr.getAttribute("Height");
            gpnl.AddRow(tr);
            //查询行所包含的列
            //var xtcs = xtr.querySelectorAll("TC");

            for (var tci = 0; tci < xtr.childNodes.length; tci++) {

                var xtc = xtr.childNodes[tci];
                if (xtc.tagName==undefined  || xtc.tagName.toLowerCase() != "tc")
                    continue;

                var tc = new DBFX.Web.LayoutControls.TCell();
                //设置单元格合并行信息
                tc.ColSpan = xtc.getAttribute("ColSpan");
                //设置单元格合并列信息
                tc.RowSpan = xtc.getAttribute("RowSpan");
                //获取列宽度
                tc.Width = xtc.getAttribute("Width");
                tc.Padding = xtc.getAttribute("Padding");
                tc.BackgroundColor = xtc.getAttribute("BackgroundColor");
                tc.BorderStyle = xtc.getAttribute("BorderStyle");
                tc.BorderColor = xtc.getAttribute("BorderColor");
                tc.BorderWidth = xtc.getAttribute("BorderWidth");
                tc.Align = xtc.getAttribute("Align");
                tc.VAlign = xtc.getAttribute("VAlign");
                tc.MinWidth = xtc.getAttribute("MinWidth");
                tc.MinHeight = xtc.getAttribute("MinHeight");

                tr.AddCell(tc);

                //查询单元格下面的空间

                var xcs = xtc.querySelector("controls");
                if (xcs!=undefined && xcs != null)
                {
                    for (var ci = 0; ci < xcs.childNodes.length; ci++) {
                        var xc = xcs.childNodes[ci];
                        if (xc.localName != "c")
                            continue;

                        //创建控件实例
                        var c = DBFX.Serializer.CreateInstance(xc, ns, tc.DesignTime);

                        //加入单元格
                        tc.AddControl(c);
                        //反系列化对象
                        ControlSerializer.DeSerialize(c, xc, ns);

                        c.VisualElement.style.tableLayout = "auto";
                  

                        if (c.Name != undefined && c.Name != null && c.Name!="")
                            tc.GridPanel.FormContext.Form.FormControls[c.Name] = c;

                    }
                }

                
            }

        }


        
    }


    //系列化
    this.Serialize = function (c, xe,ns) {



    }

}

//下拉列表框系列化
DBFX.Serializer.ComboBoxSerializer = function () {


    //反系列化
    this.DeSerialize = function (c, xe, ns) {

        c.SetTipText(xe.getAttribute("TipText"));
        c.SetIconUrl(xe.getAttribute("IconUrl"), "18px", "18px");
        var items = new Array();
        var xitems = xe.querySelector("Items");
        if (!xitems != undefined && xitems != null) {

            for (var i = 0; i < xitems.childNodes.length; i++) {

                var xitem = xitems.childNodes[i];
                if (xitem.localName == undefined || xitem.localName == null)
                    continue;

                var item = DBFX.Serializer.DeSerializeObject(new Object(), xitem);

                items.Add(item);

            }

            c.ItemSource = items;



        }

        DBFX.Serializer.DeSerialProperty("DisplayMember", c, xe);
        DBFX.Serializer.DeSerialProperty("ValueMember", c, xe);
        DBFX.Serializer.DeSerialProperty("Value", c, xe);
        DBFX.Serializer.DeSerialProperty("CheckRule", c, xe);
        DBFX.Serializer.DeSerializeCommand("ValueChanged", xe, c);
        DBFX.Serializer.DeSerialProperty("ItemSourceMember", c, xe);
        if (c.ItemSourceString != undefined && c.ItemSourceString != null) {

            c.ItemSource = eval(c.ItemSourceString);
            delete c.ItemSourceString;
        }

        //if (c.SelectedValue != undefined)
        //    c.value = c.SelectedValue;


    }


    //系列化
    this.Serialize = function (c, xe, ns) {

        if(Array.isArray(c.ItemSource))
            DBFX.Serializer.SerialProperty("ItemSourceString", JSON.stringify(c.ItemSource), xe);

        DBFX.Serializer.SerialProperty("Value", c.Value, xe);
        DBFX.Serializer.SerialProperty("CheckRule", c.CheckRule, xe);
        DBFX.Serializer.SerialProperty("DisplayMember", c.DisplayMember, xe);
        DBFX.Serializer.SerialProperty("ValueMember", c.ValueMember, xe);
        DBFX.Serializer.SerializeInputRules(c, xe);
        DBFX.Serializer.SerializeCommand("ValueChanged", c.ValueChanged, xe);
        DBFX.Serializer.SerialProperty("ItemSourceMember", c.ItemSourceMember, xe);
    }

}
//下拉列表框系列化
DBFX.Serializer.ComboTreeSerializer = function () {


    //反系列化
    this.DeSerialize = function (c, xe, ns) {

        //DBFX.Serializer.DeSerialProperty("DisplayMember", c, xe);
        //DBFX.Serializer.DeSerialProperty("ValueMember", c, xe);
        //DBFX.Serializer.DeSerialProperty("Value", c, xe);
        //DBFX.Serializer.DeSerialProperty("CheckRule", c, xe);
        DBFX.Serializer.DeSerializeCommand("ValueChanged", xe, c);

    }


    //系列化
    this.Serialize = function (c, xe, ns) {


        DBFX.Serializer.SerialProperty("AutoExpandNodes", c.AutoExpandNodes, xe);
        DBFX.Serializer.SerialProperty("Value", c.Value, xe);
        DBFX.Serializer.SerialProperty("CheckRule", c.CheckRule, xe);
        DBFX.Serializer.SerialProperty("DisplayMember", c.DisplayMember, xe);
        DBFX.Serializer.SerialProperty("ValueMember", c.ValueMember, xe);
        DBFX.Serializer.SerialProperty("ImageUrlMember", c.ImageUrlMember, xe);
        DBFX.Serializer.SerialProperty("ListBoxHeight", c.ListBoxHeight, xe);
        DBFX.Serializer.SerializeInputRules(c, xe);
        DBFX.Serializer.SerializeCommand("ValueChanged", c.ValueChanged, xe);

    }

}

DBFX.Serializer.SilderSerializer = function () {

    //反系列化
    this.DeSerialize = function (c, xe, ns) {



    }


    //系列化
    this.Serialize = function (c, xe, ns) {



    }

}
//复选框系列化
DBFX.Serializer.CheckBoxSerializer = function () {

    //反系列化
    this.DeSerialize = function (c, xe, ns) {




        //初始化全局命名命令调用
        var gcmd = xe.getAttribute("CommandName");
        if (gcmd != undefined && gcmd != null && gcmd != "") {

            //获取全局命令实例
            c.Command = app.GlobalCommands[gcmd];

        }
        else//初始化按钮嵌入命令
        {
            var xcmd = xe.querySelector("Cmd");
            if (xcmd != null) {
                var cmd = new DBFX.ComponentsModel.BaseCommand();
                cmd.CommandLine = xcmd.getAttribute("CmdLine");
                var xpas = xcmd.querySelectorAll("P");

                for (var i = 0; i < xpas.length; i++) {

                    var k = xpas[i].getAttribute("N");
                    var v = xpas[i].getAttribute("V");
                    cmd.Parameters[k] = v;

                }
                c.Command = cmd;
            }
        }

    }


    //系列化
    this.Serialize = function (c, xe, ns) {



    }

}

//停靠面板系列化
DBFX.Serializer.DockManagerSerializer = function () {

    //反系列化
    this.DeSerialize = function (c, xe, ns) {

        //初始化预置窗口
        var xcws = xe.querySelectorAll("ContentWindow");

        for (var ci = 0; ci < xcws.length; ci++)
        {

            var xcw = xcws[ci];
            var actived = xcw.getAttribute("Actived");
            var text = xcw.getAttribute("Text");
            var cw = new DBFX.Web.Controls.Panel();
            
            cw.FormContext = c.FormContext;

            //反系列化对象
            ControlSerializer.DeSerialize(cw, xcw, ns);

            c.AddContent(text,cw, actived);


        }

    }


    //系列化
    this.Serialize = function (c, xe, ns) {



    }

}

//功能导航视图系列化
DBFX.Serializer.NavigationViewSerializer = function () {

    //反系列化
    this.DeSerialize = function (c, xe, ns) {


        //初始化模板
        var xtemplates = xe.querySelector("Templates");
        if (xtemplates != undefined && xtemplates != null) {
            for (var i = 0; i < xtemplates.childNodes.length; i++) {

                var xtemplate = xtemplates.childNodes[i];
                if (xtemplate.localName != "t")
                    continue;

                var template = new DBFX.Web.Controls.ControlTemplate(xtemplate);
                template.Keyword = xtemplate.getAttribute("Key");
                template.Uri = xtemplate.getAttribute("Uri");
                template.Namespaces = ns;
                c.Templates[template.Keyword] = template;

            }


        }

        //数据源
        var itxe = xe.querySelector("ItemSource");
        if (itxe != null) {
            var xitems = itxe.childNodes;
            var items = new Array();
            for (var i = 0; i < xitems.length; i++) {

                var xitem = xitems[i];
                var item = new Object();
                item["Title"] = xitem.getAttribute("T");
                item["ImageUrl"] = xitem.getAttribute("I");
                item["Command"] = app.GlobalCommands[xitem.getAttribute("C")];
                items.push(item);


            }

            c.ItemSource = items;
        }
        
    }


    //系列化
    this.Serialize = function (c, xe, ns) {



    }

}

//工具栏系列化
DBFX.Serializer.ToolStripSerializer = function () {

    //反系列化
    this.DeSerialize = function (pc, xe, ns) {

        
        var xcs = xe.querySelector("controls");
        pc.BeginUpdate();
        if (xcs != undefined && xcs != null) {
            for (var i = 0; i < xcs.childNodes.length; i++) {
                var xce = xcs.childNodes[i];
                if (xce.localName != "c")
                    continue;

                //创建对象实例
                var c = DBFX.Serializer.CreateInstance(xce, ns, pc.DesignTime);
                pc.AddControl(c);
                //反系列化对象
                ControlSerializer.DeSerialize(c, xce, ns);

                if (c.Name != undefined && c.Name != null && c.Name != "")
                    pc.FormContext.Form.FormControls[c.Name] = c;

            }
        }
        pc.EndUpdate();

        DBFX.Serializer.DeSerializeCommand("ToolStripItemClick", xe, pc);

    }


    //系列化
    this.Serialize = function (c, xe, ns) {

        DBFX.Serializer.SerializeCommand("ToolStripItemClick", c.ToolStripItemClick, xe);

        //系列化控件集合
        var xcs = xe.ownerDocument.createElement("controls");
        xe.appendChild(xcs);

        for (var i = 0; i < c.Controls.length; i++) {

            var cm = c.Controls[i];
            var cxe = xe.ownerDocument.createElement("c");
            xcs.appendChild(cxe);

            ControlSerializer.Serialize(cm, cxe, ns);

        }

    }


}

//工具栏选项系列化
DBFX.Serializer.ToolStripItemSerializer = function () {

    //反系列化
    this.DeSerialize = function (c, xe, ns) {
        DBFX.Serializer.DeSerialProperty("ImageUrl", c, xe);
        DBFX.Serializer.DeSerialProperty("TipText", c, xe);
        DBFX.Serializer.DeSerialProperty("Visibled", c, xe);
        DBFX.Serializer.DeSerialProperty("CommandName", c, xe);
        DBFX.Serializer.DeSerialProperty("Enabled", c, xe);
        DBFX.Serializer.DeSerializeCommand("OnClick", xe, c);
        DBFX.Serializer.DeSerializeCommand("Keypress", xe, c);
        c.Command = DBFX.Serializer.CommandNameToCmd(c.CommandName);
    }


    //系列化
    this.Serialize = function (c, xe, ns) {

        DBFX.Serializer.SerialProperty("ImageUrl", c.ImageUrl, xe);
        DBFX.Serializer.SerialProperty("TipText", c.TipText, xe);
        DBFX.Serializer.SerialProperty("Visibled", c.Visibled, xe);
        DBFX.Serializer.SerialProperty("Enabled", c.Enabled, xe);
        DBFX.Serializer.SerialProperty("CommandName", c.CommandName, xe);
        DBFX.Serializer.SerializeCommand("OnClick", c.OnClick, xe);
        DBFX.Serializer.SerializeCommand("Keypress", c.Keypress, xe);
    }


}

//工具栏项目分割系列化
DBFX.Serializer.ToolStripSeparatorSerializer = function () {

    //反系列化
    this.DeSerialize = function (pc, xe, ns) {


        pc.Disabled = true;


    }


    //系列化
    this.Serialize = function (c, xe, ns) {



    }


}


//下拉列表系列化
DBFX.Serializer.ToolStripDropdownListSerializer = function () {

    //反系列化
    this.DeSerialize = function (pc, xe, ns) {

        var xcs = xe.querySelector("Items");
        if (xcs != undefined && xcs != null) {
            for (var i = 0; i < xcs.childNodes.length; i++) {
                var xce = xcs.childNodes[i];
                if (xce.localName != "I")
                    continue;

                var item = new DBFX.Web.Controls.MenuItem(xce.getAttribute("Text"), xce.getAttribute("ImageUrl"));
                item.Value = xce.getAttribute("Value");
                pc.AddItem(item);

            }
        }

        //初始化全局命名命令调用
        var gcmd = xe.getAttribute("CommandName");
        if (gcmd != undefined && gcmd != null && gcmd != "") {

            //获取全局命令实例
            pc.Command = app.GlobalCommands[gcmd];

        }
        else//初始化按钮嵌入命令
        {
            var xcmd = xe.querySelector("Cmd");
            if (xcmd != null) {
                var cmd = new DBFX.ComponentsModel.BaseCommand();
                cmd.CommandLine = xcmd.getAttribute("CmdLine");
                var xpas = xcmd.querySelectorAll("P");

                for (var i = 0; i < xpas.length; i++) {

                    var k = xpas[i].getAttribute("N");
                    var v = xpas[i].getAttribute("V");
                    cmd.Parameters[k] = v;

                }
                pc.Command = cmd;
            }
        }

        //对方法反序列化
        DBFX.Serializer.DeSerializeCommand("SelectedItemChanged", xe, pc);

    }


    //系列化
    this.Serialize = function (c, xe, ns) {

        DBFX.Serializer.SerialProperty("SelectionText", JSON.stringify(c.ItemSource), xe);
        DBFX.Serializer.SerialProperty("SelectedIndex", c.SelectedIndex, xe);
        DBFX.Serializer.SerialProperty("DisplayMember", c.DisplayMember, xe);
        DBFX.Serializer.SerialProperty("ValueMember", c.ValueMember, xe);
        DBFX.Serializer.SerialProperty("ImageMember", c.ImageMember, xe);
        DBFX.Serializer.SerialProperty("ItemSourceMember", c.ItemSourceMember, xe);
        DBFX.Serializer.SerialProperty("ImageUrl", c.ImageUrl, xe);
        DBFX.Serializer.SerialProperty("TipText", c.TipText, xe);

        //序列化方法20190710
        DBFX.Serializer.SerializeCommand("SelectedItemChanged", c.SelectedItemChanged, xe);



    }


}


//下拉面板系列化
DBFX.Serializer.ToolStripDropdownPanelSerializer = function () {

    //反系列化
    this.DeSerialize = function (pc, xe, ns) {

        DBFX.Serializer.DeSerialProperty("ImageUrl", pc, xe);
        var xcs = xe.querySelector("controls");
        if (xcs != undefined && xcs != null) {
            for (var i = 0; i < xcs.childNodes.length; i++) {
                var xce = xcs.childNodes[i];
                if (xce.localName != "c")
                    continue;
                
                //创建对象实例
                var c = DBFX.Serializer.CreateInstance(xce, ns);
                pc.AddControl(c);
                //反系列化对象
                ControlSerializer.DeSerialize(c, xce, ns);

                if (c.Name != undefined && c.Name != null && c.Name != "")
                    pc.FormContext.Form.FormControls[c.Name] = c;

            }
        }
    }


    //系列化
    this.Serialize = function (c, xe, ns) {



    }


}

//序列化
DBFX.Serializer.RadioButtonListBoxSerializer = function () {

    this.Serialize = function (c, xe, ns) {

        DBFX.Serializer.SerialProperty("DisplayMember", c.DisplayMember, xe);
        DBFX.Serializer.SerialProperty("ItemSourceMember", c.ItemSourceMember, xe);
        DBFX.Serializer.SerialProperty("ValueMember", c.ValueMember, xe);

        if (Array.isArray(c.ItemSource))
            DBFX.Serializer.SerialProperty("ItemSourceString", JSON.stringify(c.ItemSource), xe);

        //20190805
        DBFX.Serializer.SerialProperty("SelectedValue", c.SelectedValue, xe);

        DBFX.Serializer.SerializeCommand("ValueChanged", c.ValueChanged, xe);

    }

    this.DeSerialize = function (c, xe, ns) {

        DBFX.Serializer.DeSerialProperty("ItemSourceString", c, xe);
        if (c.ItemSourceString != undefined && c.ItemSourceString != null) {

            c.ItemSource = JSON.parse(c.ItemSourceString);
            delete c.ItemSourceString;
        }

        if (c.value != undefined)
            c.Value = c.value;

        
        c.Value=undefined;

        DBFX.Serializer.DeSerialProperty("SelectedValue", c, xe);

        DBFX.Serializer.DeSerializeCommand("ValueChanged", xe, c);

    }

}

//模板系列化工具
DBFX.Serializer.TemplateSerializer = function () {
    //反系列化
    this.DeSerialize = function (c, xe, ns) {

        if (xe == undefined)
            return;

        //创建名称空间
        var ns1 = ns.Clone();
        var XNS = xe.querySelector("xns");
        if(XNS!=null)
        {
            NS=XNS.querySelectorAll("ns");
            for (var i = 0; i < NS.length; i++) {
                var xns = NS.item(i);
                var k=xns.getAttribute("k");
                var nv=xns.getAttribute("n");
                ns1[k] = nv;
                if(ns[k]==undefined)
                    ns[k]=nv;
            }
        }

        //初始化图片
        DBFX.Serializer.DeSerialProperty("Padding", c, xe);
        DBFX.Serializer.DeSerialProperty("Margin", c, xe);
        DBFX.Serializer.DeSerialProperty("BorderColor", c, xe);
        DBFX.Serializer.DeSerialProperty("BorderWidth", c, xe);
        DBFX.Serializer.DeSerialProperty("BorderStyle", c, xe);
        DBFX.Serializer.DeSerialProperty("FontFamily", c, xe);
        DBFX.Serializer.DeSerialProperty("FontSize", c, xe);
        DBFX.Serializer.DeSerialProperty("FontWeight", c, xe);
        DBFX.Serializer.DeSerialProperty("BackgroundColor", c, xe);
        DBFX.Serializer.DeSerialProperty("Width", c, xe);
        DBFX.Serializer.DeSerialProperty("Height", c, xe);
        DBFX.Serializer.DeSerialProperty("MinWidth", c, xe);
        DBFX.Serializer.DeSerialProperty("MinHeight", c, xe);
        DBFX.Serializer.DeSerialProperty("Display", c, xe);
        DBFX.Serializer.DeSerialProperty("Color", c, xe);
        DBFX.Serializer.DeSerialProperty("Float", c, xe);
        DBFX.Serializer.DeSerialProperty("Align", c, xe);
        DBFX.Serializer.DeSerialProperty("VAlign", c, xe);
        DBFX.Serializer.DeSerialProperty("BorderRadius", c, xe);
        //初始化图片
        DBFX.Serializer.DeSerialProperty("Opcity", c, xe);
        //处理子控件
        var xctrls = xe.querySelector("controls");
        if (xctrls != undefined && xctrls != null) {
            for (var i = 0; i < xctrls.childNodes.length; i++) {
                var xctrl = xctrls.childNodes[i];
                if (xctrl.localName != "c")
                    continue;

                //创建控件实例
                var ctrl = DBFX.Serializer.CreateInstance(xctrl, ns1, c.DesignTime);

                c.AddControl(ctrl);

                //设计时支持
                if (c.DesignTime != undefined && c.DesignTime == true) {

                    c.DesignView.SetDesignTimeMode(ctrl, c);

                }

                //反系列化对象
                ControlSerializer.DeSerialize(ctrl, xctrl, ns1);

                if (ctrl.Name != undefined && ctrl.Name != null && ctrl.Name != "")
                    c.FormContext.Form.FormControls[ctrl.Name] = ctrl;


            }

        }


    }


    //系列化
    this.Serialize = function (c, xe, ns) {

        var xdoc = xe.ownerDocument;
        var xns = xdoc.createElement("xns");
        xe.appendChild(xns);
        //初始化属性
        DBFX.Serializer.SerialProperty("Margin", c.Margin, xe);
        DBFX.Serializer.SerialProperty("Padding", c.Padding, xe);
        DBFX.Serializer.SerialProperty("BorderColor", c.BorderColor, xe);
        DBFX.Serializer.SerialProperty("BorderWidth", c.BorderWidth, xe);
        DBFX.Serializer.SerialProperty("BorderStyle", c.BorderStyle, xe);
        DBFX.Serializer.SerialProperty("BackgroundColor", c.BackgroundColor, xe);
        DBFX.Serializer.SerialProperty("FontFamily", c.FontFamily, xe);
        DBFX.Serializer.SerialProperty("FontSize", c.FontSize, xe);
        DBFX.Serializer.SerialProperty("FontWeight", c.FontWeight, xe);
        DBFX.Serializer.SerialProperty("Width", c.Width, xe,1);
        DBFX.Serializer.SerialProperty("Height", c.Height, xe,1);
        DBFX.Serializer.SerialProperty("MinWidth", c.MinWidth, xe);
        DBFX.Serializer.SerialProperty("MinHeight", c.MinHeight, xe);
        DBFX.Serializer.SerialProperty("Display", c.Display, xe);
        DBFX.Serializer.SerialProperty("Color", c.Color, xe);
        DBFX.Serializer.SerialProperty("Float", c.Float, xe);
        DBFX.Serializer.SerialProperty("Align", c.Align, xe);
        DBFX.Serializer.SerialProperty("VAlign", c.VAlign, xe);
        DBFX.Serializer.SerialProperty("BorderRadius", c.borderRadius, xe);
        
        //系列化控件集合
        var xcs = xe.querySelector("controls");
        if(xcs!=null)
            xe.removeChild(xcs);

        var xcs = xdoc.createElement("controls");
        xe.appendChild(xcs);

        for (var i = 0; i < c.Controls.length; i++) {

            var cm = c.Controls[i];
            var cxe = xdoc.createElement("c");
            xcs.appendChild(cxe);

            ControlSerializer.Serialize(cm, cxe, ns);
            
            if(ns[cm.NSSN]==undefined)
                ns[cm.NSSN]=cm.Namespace;


        }

        //初始化名称空间
        //ns=c.DesignView.NS;
        for (var k in ns) {

            var xn = xdoc.createElement("ns");
            xn.setAttribute("k", k);
            if(ns[k].Namespace != undefined)
            {

                xn.setAttribute("n", ns[k].Namespace);
                xns.appendChild(xn);

            }
            else
            {
                if(ns[k]!=undefined && typeof(ns[k])=="string" && ns[k].split(".").length>1)
                {
                    xn.setAttribute("n", ns[k]);
                    xns.appendChild(xn);
                }
            }
            

        }

    }



}


//ListView系列化
DBFX.Serializer.ListViewSerializer = function () {
    //反系列化
    this.DeSerialize = function (c, xe, ns) {

        try {

            //初始化图片
            DBFX.Serializer.DeSerialProperty("BackgroundColor", c, xe);
            //初始化图片
            DBFX.Serializer.DeSerialProperty("Opcity", c, xe);
            DBFX.Serializer.DeSerialProperty("ItemTemplate", c, xe);
            DBFX.Serializer.DeSerialProperty("ItemSelectedTemplate", c, xe);
            DBFX.Serializer.DeSerialProperty("ItemSourceMember", c, xe);
            DBFX.Serializer.DeSerialProperty("ItemPadding", c, xe);
            DBFX.Serializer.DeSerialProperty("ItemMargin", c, xe);
            DBFX.Serializer.DeSerialProperty("SingleRow", c, xe);
            DBFX.Serializer.DeSerialProperty("DefaultSelectedIndex", c, xe);


            var ffr = xe.getAttribute("FillFullRow");
            if (ffr == "false")
                c.FillFullRow = false;
            else
                c.FillFullRow = true;

            //初始化模板
            var xtemplates = xe.querySelector("Templates");
            if (xtemplates != undefined && xtemplates != null) {
                for (var i = 0; i < xtemplates.childNodes.length; i++) {

                    var xtemplate = xtemplates.childNodes[i];
                    if (xtemplate.localName != "t")
                        continue;

                    var template = new DBFX.Web.Controls.ControlTemplate(xtemplate);
                    template.Keyword = xtemplate.getAttribute("Key");
                    template.Uri = xtemplate.getAttribute("Uri");
                    template.Namespaces = ns;
                    c.Templates[template.Keyword] = template;

                }


            }


            //初始化数据源
            var xitems = xe.querySelector("ItemSource");
            if (xitems != undefined && xitems != null && xitems.childNodes != undefined && xitems.childNodes != null) {

                var xdes = xitems.childNodes[1];
                if (xdes != undefined && xdes != null && xdes.childNodes != null && xdes.childNodes != undefined) {
                    var des = new Array();
                    for (var j = 0; j < xdes.childNodes.length; j++) {
                        var xde = xdes.childNodes[j];

                        if (xde.localName == null)
                            continue;

                        var de = new Object();

                        DBFX.Serializer.DeSerializeObject(de, xde);

                        des.push(de);

                    }

                    c.ItemSource = des;
                }

            }
        } catch (e) {
            alert("ListView Serialize:" + e);
        }


        DBFX.Serializer.DeSerializeCommand("ItemClick", xe, c);
        DBFX.Serializer.DeSerializeCommand("ItemDataContextChanged", xe, c);
        DBFX.Serializer.DeSerializeCommand("SelectedItemDblClick", xe, c);
        DBFX.Serializer.DeSerializeCommand("ItemTemplateSelector", xe, c);
        DBFX.Serializer.DeSerializeCommand("SelectedItemChanged", xe, c);
        DBFX.Serializer.DeSerializeCommand("Keydown", xe, c);


    }


    //系列化
    this.Serialize = function (c, xe, ns) {

        var xdoc = xe.ownerDocument;
        //系列化模板
        DBFX.Serializer.SerialProperty("FillFullRow", c.FillFullRow, xe);
        DBFX.Serializer.SerialProperty("SingleRow", c.singleRow, xe);
        DBFX.Serializer.SerialProperty("ItemSourceMember", c.ItemSourceMember, xe);
        DBFX.Serializer.SerialProperty("ItemMargin", c.ItemMargin, xe);
        DBFX.Serializer.SerialProperty("ItemPadding", c.ItemPadding, xe);
        DBFX.Serializer.SerialProperty("ItemBorderColor", c.ItemBorderColor, xe);
        DBFX.Serializer.SerialProperty("ItemBorderWidth", c.ItemBorderWidth, xe);
        DBFX.Serializer.SerialProperty("ItemBorderStyle", c.ItemBorderStyle, xe);
        DBFX.Serializer.SerialProperty("ItemTemplate", c.ItemTemplate, xe);
        DBFX.Serializer.SerialProperty("ItemSelectedTemplate", c.ItemSelectedTemplate, xe);
        DBFX.Serializer.SerialProperty("SelectedItemBackColor", c.SelectedItemBackColor, xe);
        DBFX.Serializer.SerialProperty("SelectedItemBorderColor", c.SelectedItemBorderColor, xe);
        DBFX.Serializer.SerialProperty("SelectedItemColor", c.SelectedItemColor, xe);
        DBFX.Serializer.SerialProperty("ObjTypesStr", c.ObjTypesStr, xe);
        DBFX.Serializer.SerialProperty("ObjTypeProperty", c.ObjTypeProperty, xe);
        DBFX.Serializer.SerialProperty("GroupsStr", c.GroupsStr, xe);
        DBFX.Serializer.SerialProperty("DefaultSelectedIndex", c.DefaultSelectedIndex, xe);

        var xtemplates = xdoc.createElement("Templates");
        xe.appendChild(xtemplates);
        for (var kw in c.Templates) {

            var template = c.Templates[kw];
            if (template.ObjType == "ControlTemplate") {
                var xtemplate = template.XTemplate
                if (xtemplate.parentNode != null) {

                }

                var xtstr = (new XMLSerializer()).serializeToString(xtemplate);

                var nxtemplate = (new DOMParser()).parseFromString(xtstr, "text/xml");


                xtemplates.appendChild(nxtemplate.documentElement);
            }

        }

        DBFX.Serializer.SerializeCommand("ItemClick", c.ItemClick, xe);
        DBFX.Serializer.SerializeCommand("ItemDataContextChanged", c.ItemDataContextChanged, xe);
        DBFX.Serializer.SerializeCommand("SelectedItemDblClick", c.SelectedItemDblClick, xe);
        DBFX.Serializer.SerializeCommand("ItemTemplateSelector", c.ItemTemplateSelector, xe);
        DBFX.Serializer.SerializeCommand("SelectedItemChanged", c.SelectedItemChanged, xe);
        DBFX.Serializer.SerializeCommand("Keydown", c.Keydown, xe);

    }



}

//多页面控件系列化
DBFX.Serializer.MultiPageViewSerializer = function () {

    //反系列化
    this.DeSerialize = function (mpvc, xe, ns) {

        mpvc.mode = xe.getAttribute("Mode");
        if (mpvc.mode == undefined || mpvc.mode == null)
            mpvc.Mode = "1";
        else
            mpvc.Mode = mpvc.mode;

        //初始化页面
        var xpvs = xe.querySelector("PageViews");
        if (xpvs != undefined && xpvs != null && xpvs.childNodes != undefined && xpvs.childNodes != null) {

            if (xpvs != undefined && xpvs != null && xpvs.childNodes != null && xpvs.childNodes != undefined) {

                mpvc.IsUpdate = true;

                for (var j = 0; j < xpvs.childNodes.length; j++) {
                    var xpv = xpvs.childNodes[j];

                    if (xpv.localName == null)
                        continue;

                    //创建控件实例
                    var pv = new DBFX.Web.LayoutControls.MultiPageViewItem();

                    //加入视图
                    mpvc.AddPageView(pv);
                    //反系列化对象
                    ControlSerializer.DeSerialize(pv, xpv, ns);

                }

                mpvc.IsUpdate = false;
                mpvc.ReArrayItems();

                mpvc.Load();

            }


        }

    }


    //系列化
    this.Serialize = function (c, xe, ns) {



    }

}

//
DBFX.Serializer.MultiPageViewItemSerializer = function () {

    //反系列化
    this.DeSerialize = function (pvi, xe, ns) {

        pvi.Text = xe.getAttribute("Text");
        pvi.ImageUrl = xe.getAttribute("ImageUrl");

        DBFX.Serializer.DeSerializeCommand("OnLoad", xe,pvi);
        DBFX.Serializer.DeSerializeCommand("OnActived", xe,pvi);

        var uri = xe.getAttribute("Uri");

        if (uri != undefined && uri != null && uri != "") {

            pvi.LoadResource(uri);
        }
        else {

            //处理子控件
            var xctrls = xe.querySelector("controls");
            if (xctrls != undefined && xctrls != null) {
                for (var i = 0; i < xctrls.childNodes.length; i++) {
                    var xctrl = xctrls.childNodes[i];
                    if (xctrl.localName != "c")
                        continue;

                    //创建控件实例
                    var ctrl = DBFX.Serializer.CreateInstance(xctrl, ns, pvi.DesignTime);

                    pvi.AddControl(ctrl);

                    //反系列化对象
                    ControlSerializer.DeSerialize(ctrl, xctrl, ns);

                    ctrl.VisualElement.style.tableLayout = "auto";
                    


                }

            }

        }


    }


    //系列化
    this.Serialize = function (c, xe, ns) {



    }

}

//
DBFX.Serializer.ToolkitBoxSerializer = function () {

    //反系列化
    this.DeSerialize = function (c, xe, ns) {

        var items = eval(xe.querySelector("Items").textContent);

        if (items != null)
            c.ItemSource = items;

    }


    //系列化
    this.Serialize = function (c, xe, ns) {



    }

}

//
DBFX.Serializer.FileUploadBoxSerializer = function () {

    //反系列化
    this.DeSerialize = function (c, xe, ns) {



    }


    //系列化
    this.Serialize = function (c, xe, ns) {



    }

}

//
DBFX.Serializer.ImageUploadBoxSerializer = function () {

    //反系列化
    this.DeSerialize = function (c, xe, ns) {

        DBFX.Serializer.DeSerialProperty("EnableCrope", c, xe);
        DBFX.Serializer.DeSerialProperty("Action", c, xe);
        DBFX.Serializer.DeSerializeCommand("ValueChanged", xe, c);

    }


    //系列化
    this.Serialize = function (c, xe, ns) {

        DBFX.Serializer.SerialProperty("EnableCrope", c.EnableCrope, xe);
        DBFX.Serializer.SerialProperty("PictureSize", c.PictureSize, xe);
        DBFX.Serializer.SerialProperty("Action", c.Action, xe);
        DBFX.Serializer.SerialProperty("CheckRule", c.checkRule, xe);
        DBFX.Serializer.SerializeCommand("ValueChanged", c.ValueChanged, xe);
    }

}

//
DBFX.Serializer.WebPageFormSerializer = function () {

    //反系列化
    this.DeSerialize = function (pc, xe, ns) {

        pc.Action = xe.getAttribute("Action");
        pc.FormName = xe.getAttribute("FormName");

        var xcs = xe.querySelector("controls");
        if (xcs != undefined && xcs != null) {
            for (var i = 0; i < xcs.childNodes.length; i++) {
                var xce = xcs.childNodes[i];
                if (xce.localName != "c")
                    continue;

                //创建对象实例
                var c = DBFX.Serializer.CreateInstance(xce, ns, pc.DesignTime);
                pc.AddControl(c);
                //反系列化对象
                ControlSerializer.DeSerialize(c, xce, ns);

                if (c.Name != undefined && c.Name != null && c.Name != "")
                    pc.FormContext.Form.FormControls[c.Name] = c;

            }
        }

    }


    //系列化
    this.Serialize = function (c, xe, ns) {



    }

}

//
DBFX.Serializer.DesignPanelSerializer = function () {

    //反系列化
    this.DeSerialize = function (c, xe, ns) {

        

    }


    //系列化
    this.Serialize = function (c, xe, ns) {



    }


}

//
DBFX.Serializer.ImageSliderViewSerializer = function () {

    //反系列化
    this.DeSerialize = function (c, xe, ns) {

        c.AutoSwitchPage = xe.getAttribute("AutoSwitchPage");
        c.Interval = xe.getAttribute("Interval");
        //系列化ItemSource设置
        var xitems = xe.querySelectorAll("p");
        var items = new Array();
        if (xitems != undefined && xitems != null) {

            for (var i = 0; i < xitems.length; i++) {

                var item = new Object();
                item["Url"] = xitems[i].getAttribute("Url");
                items.push(item);

            }

            c.ItemSource = items;
        }

        //初始化事件处理程序
        var sic = xe.getAttribute("PageClick");
        //判断是否为全局命令
        if (app.GlobalCommands[sic] != undefined && app.GlobalCommands[sic] != null) {
            c.PageClick = app.GlobalCommands[sic];
        }
            //处理程序为Java处理过程
        else {

            var r = false;
            eval("r=((" + sic + "!=undefined) && (" + sic + "!=null))");

            if (r)
                eval("c.PageClick = " + sic);

        }

    }


    //系列化
    this.Serialize = function (c, xe, ns) {



    }

}

//
DBFX.Serializer.RichTextBoxSerializer = function () {

    //反系列化
    this.DeSerialize = function (c, xe, ns) {

        //系列化ItemSource设置
        DBFX.Serializer.DeSerialProperty("Mode", c, xe);
        DBFX.Serializer.DeSerialProperty("Action", c, xe);
    }


    //系列化
    this.Serialize = function (c, xe, ns) {

        DBFX.Serializer.SerialProperty("Mode", c.Mode, xe);
        DBFX.Serializer.SerialProperty("Action", c.Action, xe);
    }
}

//
DBFX.Serializer.RichTextbaseSerializer = function () {

    //反系列化
    this.DeSerialize = function (c, xe, ns) {

        DBFX.Serializer.DeSerialProperty("Mode", c, xe);
    }


    //系列化
    this.Serialize = function (c, xe, ns) {

        DBFX.Serializer.SerialProperty("Mode", c.Mode, xe);

    }
}

DBFX.Serializer.UIViewControllerSerialer = function () {

    //反系列化
    this.DeSerialize = function (vc, xe, ns) {

        //系列化ItemSource设置
        //c.Mode = xe.getAttribute("Mode");

        var xcs = xe.querySelector("controls");
        if (xcs != undefined && xcs != null) {
            var uipv = vc.CreateUIPageView();

            vc.PushView(uipv);

            uipv.HorizonScrollbar = xe.getAttribute("HorizonScrollbar");
            uipv.VerticalScrollbar = xe.getAttribute("VerticalScrollbar");

            for (var i = 0; i < xcs.childNodes.length; i++) {
                var xce = xcs.childNodes[i];
                if (xce.localName != "c")
                    continue;

                //创建对象实例
                var c = DBFX.Serializer.CreateInstance(xce, ns, vc.DesignTime);
                uipv.AddControl(c);
                //反系列化对象
                ControlSerializer.DeSerialize(c, xce, ns);

                if (c.Name != undefined && c.Name != null && c.Name != "")
                    uipv.FormContext.Form.FormControls[c.Name] = c;

            }

           
        }


    }


    //系列化
    this.Serialize = function (c, xe, ns) {



    }

}

DBFX.Serializer.SearchBarSerializer = function () {

    //反系列化
    this.DeSerialize = function (c, xe, ns) {

        //系列化ItemSource设置
        c.TipText = xe.getAttribute("TipText");
        c.Text = xe.getAttribute("Text");

        //初始化全局命名命令调用
        var gcmd = xe.getAttribute("CommandName");
        if (gcmd != undefined && gcmd != null && gcmd != "") {

            //获取全局命令实例
            c.Command = app.GlobalCommands[gcmd];

        }
        else//初始化按钮嵌入命令
        {
            var xcmd = xe.querySelector("Cmd");
            if (xcmd != null) {
                var cmd = new DBFX.ComponentsModel.BaseCommand();
                cmd.CommandLine = xcmd.getAttribute("CmdLine");
                var xpas = xcmd.querySelectorAll("P");

                for (var i = 0; i < xpas.length; i++) {

                    var k = xpas[i].getAttribute("N");
                    var v = xpas[i].getAttribute("V");
                    cmd.Parameters[k] = v;

                }
                c.Command = cmd;
            }
        }

    }


    //系列化
    this.Serialize = function (c, xe, ns) {



    }
}


DBFX.Serializer.ListBarSerializer = function () {

    //反系列化
    this.DeSerialize = function (c, xe, ns) {

        //系列化设置
        c.DisplayMember = xe.getAttribute("DisplayMember");
        c.ValueMember = xe.getAttribute("ValueMember");
        c.ImageMember = xe.getAttribute("ImageMember");
        var svalue = xe.getAttribute("SelectedValue");
        if (svalue != null && svalue != undefined)
            c.SelectedValue = svalue;

        var sidx=xe.getAttribute("SelectedIndex");
        if (sidx != undefined && sidx != null)
            c.SelectedIndex = sidx;


        //初始化数据源
        var xitems = xe.querySelector("ItemSource");
        if (xitems != undefined && xitems != null && xitems.childNodes != undefined && xitems.childNodes != null) {

            var xdes = xitems.childNodes[1];
            if (xdes != undefined && xdes != null && xdes.childNodes != null && xdes.childNodes != undefined) {
                var des = new Array();
                for (var j = 0; j < xdes.childNodes.length; j++) {
                    var xde = xdes.childNodes[j];

                    if (xde.localName == null)
                        continue;

                    var de = new Object();
                    for (var ai = 0; ai < xde.attributes.length; ai++) {

                        var a = xde.attributes[ai];
                        de[a.name] = a.value;

                    }

                    des.push(de);

                }

                c.ItemSource = des;
            }

        }

    }


    //系列化
    this.Serialize = function (c, xe, ns) {



    }
}



DBFX.Serializer.PagePartSerializer = function () {

    //反系列化
    this.DeSerialize = function (c, xe, ns) {

        var sta = xe.getAttribute("Standalone");
        if (sta != null && sta != undefined && sta.toLowerCase() == "false")
            c.Standalone = false;
        else
            c.Standalone = true;


        c.ResourceKey = xe.getAttribute("ResourceKey");
   
    }


    //系列化
    this.Serialize = function (c, xe, ns) {

        //DBFX.Serializer.SerialProperty("ResourceKey", c.ResourceKey, xe);
        //DBFX.Serializer.SerialProperty("Standalone", c.Standalone, xe);

    }

}

//树形列表系列化
DBFX.Serializer.TreeListViewSerializer = function () {

    //反系列化
    this.DeSerialize = function (c, xe, ns) {

        //初始化模板
        var xtemplates = xe.querySelector("Templates");
        if (xtemplates != undefined && xtemplates != null) {
            for (var i = 0; i < xtemplates.childNodes.length; i++) {

                var xtemplate = xtemplates.childNodes[i];
                if (xtemplate.localName != "t")
                    continue;

                var template = new DBFX.Web.Controls.ControlTemplate(xtemplate);
                template.Keyword = xtemplate.getAttribute("Key");
                template.Uri = xtemplate.getAttribute("Uri");
                template.Namespaces = ns;
                c.Templates[template.Keyword] = template;

            }


        }

        //初始化数据源
        var xitems = xe.querySelector("ItemSource");
        if (xitems != undefined && xitems != null && xitems.childNodes != undefined && xitems.childNodes != null) {

            var xdes = xitems.childNodes[1];
            if (xdes != undefined && xdes != null && xdes.childNodes != null && xdes.childNodes != undefined) {
                var des = new Array();
                for (var j = 0; j < xdes.childNodes.length; j++) {
                    var xde = xdes.childNodes[j];

                    if (xde.localName == null)
                        continue;

                    var de = new Object();

                    DBFX.Serializer.DeSerializeObject(de, xde);

                    des.push(de);

                }

                c.ItemSource = des;
            }

        }

        //初始化OnTreeListNodeClick
        DBFX.Serializer.DeSerializeCommand("TreeListNodeClick", xe,c);

        //初始化 OnTreeListNodeDblClick
        DBFX.Serializer.DeSerializeCommand("TreeListNodeDblClick", xe,c);

        DBFX.Serializer.DeSerializeCommand("TreeListNodeChecked", xe, c);
        DBFX.Serializer.DeSerializeCommand("TreeListViewSelectedNodeChange", xe, c);
        DBFX.Serializer.DeSerializeCommand("TreeNodeDragDrop", xe, c);
    }


    //系列化
    this.Serialize = function (c, xe, ns) {

        
        DBFX.Serializer.SerialProperty("AutoExpandNodes", c.AutoExpandNodes, xe);
        DBFX.Serializer.SerialProperty("ItemSourceMember", c.ItemSourceMember, xe);
        DBFX.Serializer.SerialProperty("DisplayMember", c.DisplayMember, xe);
        DBFX.Serializer.SerialProperty("ValueMember", c.ValueMember, xe);
        DBFX.Serializer.SerialProperty("ImageUrlMember", c.ImageUrlMember, xe);
        DBFX.Serializer.SerialProperty("CheckedMember", c.CheckedMember, xe);
        DBFX.Serializer.SerialProperty("CheckedBox", c.CheckedBox, xe);
        DBFX.Serializer.SerialProperty("AllowNodeDragDrop", c.AllowNodeDragDrop, xe);
        DBFX.Serializer.SerializeCommand("TreeListNodeClick", c.TreeListNodeClick, xe);
        DBFX.Serializer.SerializeCommand("TreeListNodeDblClick", c.TreeListNodeDblClick, xe);
        DBFX.Serializer.SerializeCommand("TreeListNodeChecked", c.TreeListNodeChecked, xe);
        DBFX.Serializer.SerializeCommand("TreeListViewSelectedNodeChange", c.TreeListViewSelectedNodeChange, xe);
        DBFX.Serializer.SerializeCommand("TreeNodeDragDrop", c.TreeNodeDragDrop, xe);
    }

}


//应用程序标题
DBFX.Serializer.AppMenuBarSerializer = function () {

    //反系列化
    this.DeSerialize = function (pc, xe, ns) {

        //系列化子控件
        var bd = xe.getAttribute("Border");
        if (bd != null)
            pc.Border = bd;

        var shd = xe.getAttribute("Shadow");
        if (shd != null)
            pc.Shadow = shd;


        DBFX.Serializer.DeSerializeCommand("MenuItemClick", xe,pc);

        var xcs = xe.querySelector("controls");
        if (xcs != undefined && xcs != null) {
            for (var i = 0; i < xcs.childNodes.length; i++) {
                var xce = xcs.childNodes[i];
                if (xce.localName != "c")
                    continue;

                //创建对象实例
                var c = DBFX.Serializer.CreateInstance(xce, ns);
                pc.AddControl(c);
                //反系列化对象
                ControlSerializer.DeSerialize(c, xce, ns);

                if (c.Name != undefined && c.Name != null && c.Name != "")
                    pc.FormContext.Form.FormControls[c.Name] = c;

            }
        }
    }


    //系列化
    this.Serialize = function (c, xe, ns) {



    }

}

//应用程序标题项目系列化
DBFX.Serializer.AppMenuBarItemSerializer = function () {

    //反系列化
    this.DeSerialize = function (c, xe, ns) {

        DBFX.Serializer.DeSerializeProperties(c, xe,ns);

        //初始化全局命名命令调用
        var gcmd = xe.getAttribute("CommandName");
        if (gcmd == null)
            gcmd = xe.getAttribute("ItemClick");

        if (gcmd != undefined && gcmd != null && gcmd != "") {

            //获取全局命令实例
            c.ItemClick = app.GlobalCommands[gcmd];

        }
        else//初始化按钮嵌入命令
        {
            var xcmd = xe.querySelector("Cmd");
            if (xcmd != null) {
                var cmd = new DBFX.ComponentsModel.BaseCommand();
                cmd.CommandLine = xcmd.getAttribute("CmdLine");
                var xpas = xcmd.querySelectorAll("P");

                for (var i = 0; i < xpas.length; i++) {

                    var k = xpas[i].getAttribute("N");
                    var v = xpas[i].getAttribute("V");
                    cmd.Parameters[k] = v;

                }
                c.ItemClick = cmd;
            }
        }

    }


    //系列化
    this.Serialize = function (c, xe, ns) {



    }


}

//项目容器面板系列化
DBFX.Serializer.ItemsPanelSerializer = function () {

    //反系列化
    this.DeSerialize = function (c, xe, ns) {


        //初始化模板
        var xtemplates = xe.querySelector("Templates");
        if (xtemplates != undefined && xtemplates != null) {
            for (var i = 0; i < xtemplates.childNodes.length; i++) {

                var xtemplate = xtemplates.childNodes[i];
                if (xtemplate.localName != "t")
                    continue;

                var template = new DBFX.Web.Controls.ControlTemplate(xtemplate);
                template.Keyword = xtemplate.getAttribute("Key");
                template.Uri = xtemplate.getAttribute("Uri");
                template.Namespaces = ns;
                c.Templates[template.Keyword] = template;

            }


        }

        DBFX.Serializer.DeSerialProperty("ItemTemplate", c, xe);
        DBFX.Serializer.DeSerialProperty("SelectedItemTemplate", c, xe);
        DBFX.Serializer.DeSerialProperty("ItemSource", c, xe);

        //选定项目改变事件处理器
        DBFX.Serializer.DeSerializeCommand("ItemClick", xe, c);
        DBFX.Serializer.DeSerializeCommand("SelectedItemDblClick", xe, c);
        DBFX.Serializer.DeSerializeCommand("ItemTemplateSelector", xe, c);
        DBFX.Serializer.DeSerializeCommand("SelectedItemChanged", xe, c);
    }


    //系列化
    this.Serialize = function (c, xe, ns) {
        var xdoc = xe.ownerDocument;
        var xtemplates = xdoc.createElement("Templates");
        xe.appendChild(xtemplates);
        for (var kw in c.Templates) {

            var template = c.Templates[kw];
            if (template.ObjType == "ControlTemplate") {
                var xtemplate = template.XTemplate
                if (xtemplate.parentNode != null) {
                    //xtemplate.parentNode.removeChild(xtemplate);
                }

                var xtstr = (new XMLSerializer()).serializeToString(xtemplate);

                var nxtemplate = (new DOMParser()).parseFromString(xtstr, "text/xml");


                xtemplates.appendChild(nxtemplate.documentElement);
            }

        }

        DBFX.Serializer.SerialProperty("AllowReOrder", c.AllowReOrder, xe);
        DBFX.Serializer.SerialProperty("ItemSourceMember", c.ItemSourceMember, xe);
        DBFX.Serializer.SerialProperty("ItemTemplate", c.ItemTemplate, xe);
        DBFX.Serializer.SerialProperty("SelectedItemTemplate", c.SelectedItemTemplate, xe);
        //AllowReOrder
        DBFX.Serializer.SerializeCommand("ItemClick", c.ItemClick, xe);
        DBFX.Serializer.SerializeCommand("SelectedItemDblClick", c.SelectedItemDblClick, xe);
        DBFX.Serializer.SerializeCommand("ItemTemplateSelector", c.ItemTemplateSelector, xe);
        DBFX.Serializer.SerializeCommand("SelectedItemChanged", c.SelectedItemChanged, xe);

    }



}

/*
TabWidget 序列化
*/
DBFX.Serializer.TabWidget = function () {
    //反序列化
    this.DeSerialize = function (pc, xe, ns) {
        //20190805
        // DBFX.Serializer.DeSerialProperty("ActiveIndex", pc, xe);
        DBFX.Serializer.DeSerialProperty("DefaultTabIndex", pc, xe);

        var xcs = xe.querySelector("Items");

        if (xcs != undefined && xcs != null) {
            for (var i = 0; i < xcs.childNodes.length; i++)
            {
                var xce = xcs.childNodes[i];
                if (!(xce.localName == "TabItem" || xce.localName == "TabBigItem"))
                    continue;

                var c = null;
                if (xce.localName == "TabItem") {
                    c = new DBFX.Web.Controls.TabWidgetItem();
                    pc.addTabItem(c);
                } else if (xce.localName == "TabBigItem") {
                    c = new DBFX.Web.Controls.TabWidgetBigItem();
                    pc.addTabBigItem(c);
                }

                //创建对象实例
                if (c) {

                    DBFX.Serializer.DeSerialProperty("Text", c, xce);
                    DBFX.Serializer.DeSerialProperty("ImageUrl", c, xce);
                    DBFX.Serializer.DeSerialProperty("ImageUrlActive", c, xce);
                    DBFX.Serializer.DeSerialProperty("TextColor", c, xce);
                    DBFX.Serializer.DeSerialProperty("TextColorActive", c, xce);
                    DBFX.Serializer.DeSerialProperty("ItemBackgroundColor", c, xce);
                    DBFX.Serializer.DeSerialProperty("ItemBackgroundColorActive", c, xce);
                    DBFX.Serializer.DeSerialProperty("ItemResourceScrp", c, xce);
                    DBFX.Serializer.DeSerialProperty("ClientPanelBackgroundColor", c, xce);

                    DBFX.Serializer.DeSerializeCommand("TabBigItemClick", xe, pc);
                    //反系列化对象
                    ControlSerializer.DeSerialize(c, xce, ns);

                    if (c.Name != undefined && c.Name != null && c.Name != "")
                        pc.FormContext.Form.FormControls[c.Name] = c;

                }
            }

            pc.SelectedTabIndex = pc.DefaultTabIndex;
        }

    }
    //序列化
    this.Serialize = function (c, xe, ns)
    {
        var xdoc = xe.ownerDocument;
        DBFX.Serializer.SerialProperty("DefaultTabIndex", c.DefaultTabIndex, xe);

        //20190805
        // DBFX.Serializer.SerialProperty("ActiveIndex", c.ActiveIndex, xe);


        //系列化控件集合
        var xcs = xdoc.createElement("Items");
        xe.appendChild(xcs);

        for (var i = 0; i < c.TabItems.length; i++) {

            var item = c.TabItems[i];
            var cxe = null;
            if (item.GetType() == "TabWidgetItem") {
                cxe = xdoc.createElement("TabItem");
            } else {
                cxe = xdoc.createElement("TabBigItem");
            }
            xcs.appendChild(cxe);

            DBFX.Serializer.SerialProperty("Text", item.Text, cxe);
            DBFX.Serializer.SerialProperty("ImageUrl", item.ImageUrl, cxe);
            DBFX.Serializer.SerialProperty("ImageUrlActive", item.ImageUrlActive, cxe);
            DBFX.Serializer.SerialProperty("TextColor", item.TextColor, cxe);
            DBFX.Serializer.SerialProperty("TextColorActive", item.TextColorActive, cxe);
            DBFX.Serializer.SerialProperty("ItemBackgroundColor", item.ItemBackgroundColor, cxe);
            DBFX.Serializer.SerialProperty("ItemBackgroundColorActive", item.ItemBackgroundColorActive, cxe);
            DBFX.Serializer.SerialProperty("ItemResourceScrp", item.ItemResourceScrp, cxe);
            DBFX.Serializer.SerialProperty("ClientPanelBackgroundColor", item.ClientPanelBackgroundColor, cxe);
            DBFX.Serializer.SerializeCommand("TabBigItemClick", c.TabBigItemClick, xe);

            ControlSerializer.Serialize(item, cxe, ns);

        }

    }

}



/*
FormBar 序列化
*/
DBFX.Serializer.FormBar = function () {
    //反序列化
    this.DeSerialize = function (pc, xe, ns) {
        DBFX.Serializer.DeSerialProperty("ImageUrl", pc, xe);
        DBFX.Serializer.DeSerialProperty("Title", pc, xe);
        DBFX.Serializer.DeSerialProperty("Description", pc, xe);
    }
    //序列化
    this.Serialize = function (c, xe, ns) {
        DBFX.Serializer.SerialProperty("ImageUrl", c.ImageUrl, xe);
        DBFX.Serializer.SerialProperty("Title", c.Title, xe);
        DBFX.Serializer.SerialProperty("Description", c.Description, xe);
    }
}

/*
  Web文件系统浏览器WebFSExplorerDesigner
 lishuang
 20170427
*/
DBFX.Serializer.WebFSExplorer = function () {


    //反序列化
    this.DeSerialize = function (c, xe, ns) {

        DBFX.Serializer.DeSerialProperty("Model", c, xe);
    }
    //序列化
    this.Serialize = function (c, xe, ns) {

        DBFX.Serializer.SerialProperty("Model", c.Model, xe);


    }


}

var ControlSerializer = new DBFX.Serializer.ControlSerializer();

