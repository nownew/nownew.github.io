//数据服务
DBFX.RegisterNamespace("DBFX.Data");

DBFX.Data.DataBinding = function (p,m,s) {

    Object.defineProperty(this, "Path", { get: function () { return this.path; }, set: function (v) { this.path = v; } });
    Object.defineProperty(this, "Mode", { get: function () { return this.mode; }, set: function (v) { this.mode = v; } });
    Object.defineProperty(this, "Source", { get: function () { return this.source; }, set: function (v) { this.source = v; } });
    this.Path = p;
    this.Mode = m;
    this.Source = s;
}

//解析JSON绑定
DBFX.Data.ParsingJSonBinding = function (pbv, dc) {

    if (pbv != undefined && pbv != null && pbv.indexOf("{") >= 0) {

        try{
            pbv = pbv.replace("{", "").replace("}", "");
            if (pbv.indexOf(".") < 0)
                pbv = "dc." + pbv;

            var obj = eval(pbv);
            if (obj != undefined)
                pbv = obj;

        }catch(ex){}finally{}
    }

   return pbv;

}

//执行绑定
DBFX.Data.ExecuteDataBinding=function(pk, dc)
{
    var r = undefined;
    try{
        var expr = "dc." + pk;
        r = eval("typeof " + expr);
        if (r != "undefined")
            r = eval(expr);
        else
            r = undefined;
    }
    catch (ex) {

    }
    return r;
}

//分组
DBFX.Data.Grouping = function (items, gps, itemskey) {

    var group = [];
    var gobj = {};
    if (itemskey == undefined)
        itemskey = "Items";

    data.forEach(function (item) {

        var key = "k";
        var tgobj = {};

        gps.forEach(function (dp) {

            key += item[dp];
            tgobj[dp] = item[dp];

        });

        var gitem = gobj[key];
        if (gitem == undefined) {

            gitem = tgobj;

            group.push(gitem);
            gobj[key] = gitem;

            gitem[itemskey] = [];

        }

        

        gitem[itemskey].push(gitem);




    });

    return group;


}

//多层分组
DBFX.Data.MultiGrouping = function (items, grps, aggcols, itemskey) {
    if (itemskey == undefined)
        itemskey = "Items$";

    if (aggcols == undefined)
    {
        aggcols = [];
        if (items.length > 0) {

            var obj = items[0];
            for (var k in obj) {

                if (typeof (obj[k]) == "number") {

                    aggcols.push({ Col: k, T: 0 });

                }
                else
                    if (obj[k].toFullYear != undefined) {

                        aggcols.push({ Col: k, T: 1 });

                    }
                    else
                    if(typeof(obj[k])=="string")
                    {
                        var dv = new Date(obj[k]);
                        if (dv.getFullYear().toString() != "NaN")
                            aggcols.push({ Col: k, T: 1 });

                    }

            }

        }
    }

    var root = { Text: "", "AGG$":{Count:0} };
    root[itemskey] = new NamedArray();
    items.forEach(function (item) {

        //循环分组链
        var pg = root;
        for (var i = 0; i < grps.length; i++) {
            var grp = grps[i];
            var gkey = "G_:" + item[grp.Property];

            if (pg[itemskey] == undefined)
                pg[itemskey] = new NamedArray();

            //计算聚合列
            aggcols.forEach(function (aggcol) {

                var dv = item[aggcol.Col];
                if (aggcol.T == 0) {

                    dv = dv * 1;

                    if (pg.AGG$[aggcol.Col + "_Sum"] == undefined)
                        pg.AGG$[aggcol.Col + "_Sum"] = 0;

                    pg.AGG$[aggcol.Col + "_Sum"] += dv;


                    if (pg.AGG$[aggcol.Col + "_Min"] == undefined)
                        pg.AGG$[aggcol.Col + "_Min"] = dv;

                    if (pg.AGG$[aggcol.Col + "_Min"] > dv)
                        pg.AGG$[aggcol.Col + "_Min"] = dv;


                    if (pg.AGG$[aggcol.Col + "_Max"] == undefined)
                        pg.AGG$[aggcol.Col + "_Max"] = dv;

                    if (pg.AGG$[aggcol.Col + "_Max"] < dv)
                        pg.AGG$[aggcol.Col + "_Max"] = dv;

                    pg.AGG$[aggcol.Col + "_Avg"] = (pg.AGG$[aggcol.Col + "_Sum"] / pg[itemskey].length);
                }

                else {

                    if (typeof (dv) == "string")
                        dv = new Date(dv);

                    if (root.AGG$[aggcol.Col + "_Min"] == undefined)
                        root.AGG$[aggcol.Col + "_Min"] = dv;

                    if (root.AGG$[aggcol.Col + "_Max"] == undefined)
                        root.AGG$[aggcol.Col + "_Max"] = dv;

                    if (pg.AGG$[aggcol.Col + "_Min"] == undefined)
                        pg.AGG$[aggcol.Col + "_Min"] = dv;

                    if (pg.AGG$[aggcol.Col + "_Max"] == undefined)
                        pg.AGG$[aggcol.Col + "_Max"] = dv;

                    if (root.AGG$[aggcol.Col + "_Min"] > dv)
                        root.AGG$[aggcol.Col + "_Min"] = dv;

                    if (root.AGG$[aggcol.Col + "_Max"] < dv)
                        root.AGG$[aggcol.Col + "_Max"] = dv;

                    if (pg.AGG$[aggcol.Col + "_Min"] > dv)
                        pg.AGG$[aggcol.Col + "_Min"] = dv;

                    if (pg.AGG$[aggcol.Col + "_Max"] < dv)
                        pg.AGG$[aggcol.Col + "_Max"] = dv;
                }

            });

            var gitem = pg[itemskey][gkey];

            if (gitem == undefined) {

                gitem = { Text: item[grp.Property], "AGG$": { Count: 0} };
                pg[itemskey].Add(gkey, gitem);
                pg.G = 1;
                gitem.Group = grp;

            }

            pg.AGG$.Count = pg[itemskey].length;
            pg = gitem;
            pg.AE = grp.AE;

        }

        if (pg[itemskey] == undefined)
            pg[itemskey] = [];

        pg[itemskey].Add(item);
        pg.AGG$.Count = pg[itemskey].length;
        pg.G = 0;

        //计算聚合列
        aggcols.forEach(function (aggcol) {

            var dv = item[aggcol.Col];
            if (aggcol.T == 0) {

                dv = dv * 1;

                if (root.AGG$[aggcol.Col + "_Sum"] == undefined)
                    root.AGG$[aggcol.Col + "_Sum"] = 0;

                if (pg.AGG$[aggcol.Col + "_Sum"] == undefined)
                    pg.AGG$[aggcol.Col + "_Sum"] = 0;

                pg.AGG$[aggcol.Col + "_Sum"] += dv;
                root.AGG$[aggcol.Col + "_Sum"] += dv;

                if (root.AGG$[aggcol.Col + "_Min"] == undefined)
                    root.AGG$[aggcol.Col + "_Min"] = dv;

                if (root.AGG$[aggcol.Col + "_Min"] > dv)
                    root.AGG$[aggcol.Col + "_Min"] = dv;

                if (pg.AGG$[aggcol.Col + "_Min"] == undefined)
                    pg.AGG$[aggcol.Col + "_Min"] = dv;

                if (pg.AGG$[aggcol.Col + "_Min"] > dv)
                    pg.AGG$[aggcol.Col + "_Min"] = dv;

                if (root.AGG$[aggcol.Col + "_Max"] == undefined)
                    root.AGG$[aggcol.Col + "_Max"] = dv;

                if (root.AGG$[aggcol.Col + "_Max"] < dv)
                    root.AGG$[aggcol.Col + "_Max"] = dv;

                if (pg.AGG$[aggcol.Col + "_Max"] == undefined)
                    pg.AGG$[aggcol.Col + "_Max"] = dv;

                if (pg.AGG$[aggcol.Col + "_Max"] < dv)
                    pg.AGG$[aggcol.Col + "_Max"] = dv;

                pg.AGG$[aggcol.Col + "_Avg"] = (pg.AGG$[aggcol.Col + "_Sum"] / pg[itemskey].length);
                root.AGG$[aggcol.Col + "_Avg"] = (root.AGG$[aggcol.Col + "_Sum"] / items.length);
            }

            else {

                if (typeof (dv) == "string")
                    dv = new Date(dv);

                if (root.AGG$[aggcol.Col + "_Min"] == undefined)
                    root.AGG$[aggcol.Col + "_Min"] = dv;

                if (root.AGG$[aggcol.Col + "_Max"] == undefined)
                    root.AGG$[aggcol.Col + "_Max"] = dv;

                if (pg.AGG$[aggcol.Col + "_Min"] == undefined)
                    pg.AGG$[aggcol.Col + "_Min"] = dv;

                if (pg.AGG$[aggcol.Col + "_Max"] == undefined)
                    pg.AGG$[aggcol.Col + "_Max"] = dv;

                if (root.AGG$[aggcol.Col + "_Min"] > dv)
                    root.AGG$[aggcol.Col + "_Min"] = dv;

                if (root.AGG$[aggcol.Col + "_Max"] < dv)
                    root.AGG$[aggcol.Col + "_Max"] = dv;

                if (pg.AGG$[aggcol.Col + "_Min"] > dv)
                    pg.AGG$[aggcol.Col + "_Min"] = dv;

                if (pg.AGG$[aggcol.Col + "_Max"] < dv)
                    pg.AGG$[aggcol.Col + "_Max"] = dv;
            }

        });

    });
    root.AGG$.Count = items.length;
    
    return root;
}

DBFX.Data.Sorting = function (data, key, sort) {

   return data.sort(function (a, b) {

            var r = 0;
        if (typeof a[key] == "string")
            r = a[key].localeCompare(b[key]);
            else {
            if (a[key] == b[key])
                    r = 0;
                else
                if (a[key] > b[key])
                        r = 1;
                    else
                    if (a[key] < b[key])
                            r = -1;

            }

            if (sort == 2) {
                r = r * -1;
            }
            return r;

    });
}

//数据验证规则
DBFX.Data.DataValidateRule = function () {

    var dvr = new Object();



    return dvr;

}


//数据处理流程
DBFX.Data.DataFlow = function ()
{


}




//数据请求回应
DBFX.Data.DACResponse = function (json) {

    var resp = { State: -1, Exception: "" };

    try {
        if (json != "")
            resp.DataObj = eval("resp.DataObj=" + json);

        resp.State = 0;

    } catch (ex) {

        resp.Exception = ex.toString();
    }


    return resp;

}

//执行数据访问请求
DBFX.Data.DACrequest = function (sp, paras,svrcnt,db, cb,svcuri,svcbusuri) {

    if (db == undefined || db == null || db.indexOf(".") >= 0 || db=="") {

        alert(sp + "  ||  " + db + "  || " + JSON.stringify(paras));

        return;
    }
    var req = new DBFX.SvcBus.SvcRequest();
    req.Headers.Action = 6;
    req.Headers.ConnectionString = svrcnt;
    req.Headers.DB_Name = db;
    req.Headers.Method = sp;
    req.Headers.MethodType=1;
    req.Headers.ResultType=2;
    req.Parameters = paras;
    if (svcuri == undefined)
        req.SvcUri = "DB.FX.Storage.MongoDBService";
    else
        req.SvcUri = svcuri;

    req.CallBack = function (resp) {

        var daresp = undefined;

        if (resp.State == 0) {

            daresp = new DBFX.Data.DACResponse(resp.JSonData);
            daresp.State = 0;


        } else {

            daresp = new DBFX.Data.DACResponse("");
            daresp.State = -1;
            daresp.Exception = resp.Exception;

        }

        cb(daresp);


    }
    req.Execute = function () {

        if (svcbusuri != undefined && svcbusuri!="") {
            svcbusuri = app.EnvironVariables.ParsingToString(svcbusuri);
            req.ExecuteRequest(svcbusuri);
        }
        else
            req.ExecuteRequest(app.ServiceUri);

    }

    return req;


}


