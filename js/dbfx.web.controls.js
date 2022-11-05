DBFX.RegisterNamespace("DBFX.Web.Controls");
DBFX.RegisterNamespace("DBFX.Serializer");
DBFX.RegisterNamespace("DBFX.Design");
DBFX.RegisterNamespace("DBFX.Design.ControlDesigners");


//控件集合
DBFX.Web.Controls.ControlsCollection = function (pc) {

    var cc = new Array();
    cc.HostConttol = pc;
    cc.NamedControls = new Object();

    cc.RegistNamedControl = function (name, c) {

        if (c == undefined) {
            throw ("被加入的控件必须是 Control 类型！");
        }

        if (name != undefined && name!="") {
            if (cc.NamedControls[name] != undefined) {
                throw ("已经存在名称为 " + name + " 的控件!");
            }
            else {

                cc.NamedControls[name] = c;
            }
        }

    }

    cc.Add = function (c) {

        cc.push(c);
        if (c.Name != null && c.Name != undefined) {
            cc.RegistNamedControl(c.Name, c);
        }

    }

    cc.Remove = function (c) {

        var idx = cc.indexOf(c);
        if (idx >= 0)
            cc.splice(idx, 1);

        if (c.name != undefined &&  c.name!="" && cc.NamedControls[c.name]!=undefined)
            eval("delete cc.NamedControls." + name);

    }

    cc.Clear = function () {

        cc.NamedControls = new Object();
        cc.splice(0, cc.length);

    }

    return cc;

}
//控件公共上下文
DBFX.Web.Controls.Context = new Object();

//创建UI基础对象
function UIObject(t,obj) {

    var uiobj =(obj==undefined?new Object():obj);

    uiobj.Base = new Object();


    Object.defineProperty(uiobj, "ObjType", {
        get: function () {
            if (t == undefined)
                throw ("对象类型错误");

            return t;
        },
        set: function (v) {
            if (t == undefined)
                t = v;
        }
    });

    uiobj.SetObjType = function (objtype) {
        t = objtype;
    }

    //获取对象类型
    uiobj.GetType = function () {
        //uiobj.ObjType = t;
        return t;
    }
    uiobj.Base.GetType = uiobj.GetType;
    //设置类描述器
    uiobj.ClassDescriptor = new DBFX.ComponentsModel.ClassDescriptor();
    uiobj.Base.ClassDescriptor = uiobj.ClassDescriptor;
    //设置数据属性
    Object.defineProperty(uiobj, "DataProperty", {
        get: function () {

            return uiobj.dataProperty;

        },
        set: function (v) {

            var odp = uiobj.dataProperty;
            try{
                uiobj.dataProperty = v;

                if (odp != undefined && odp != "" && uiobj.FormContext!=undefined) {

                    if (uiobj.dataDomain != undefined && uiobj.dataDomain != "") {

                        eval("delete uiobj.FormContext." + uiobj.dataDomain + "." + uiobj.dataProperty + ";");

                    }
                    else {
                        eval("delete uiobj.FormContext." +uiobj.dataProperty + ";");
                    }

                }

                if (uiobj.SetDataProperty != undefined)
                    uiobj.SetDataProperty(v);
            } catch (ex) {
                alert(ex.toString());
            }

        }
    });


    Object.defineProperty(uiobj, "DataDomain", {
        get: function () {

            return uiobj.dataDomain;
        },
        set: function (v) {

            try{
                var odomain=uiobj.dataDomain;

                uiobj.dataDomain = v;

                if (v != undefined && v != null && uiobj.FormContext != undefined) {

                    var ddv = uiobj.FormContext[v];
                    if (ddv == undefined && v != "") {
                        ddv = new DBFX.DataDomain();
                        uiobj.FormContext[v] = ddv;
                    }
                    if (uiobj.dataProperty != undefined && uiobj.dataProperty!="")
                        ddv[uiobj.dataProperty] = "";

                }

                if (uiobj.FormContext != undefined && odomain!=v ) {

                    var oddv = uiobj.FormContext[odomain];
                    if (odomain == "")
                        oddv = uiobj.FormContext;

                    if (oddv != undefined && uiobj.dataProperty!=undefined && uiobj.dataProperty!="") {

                        eval("delete oddv." + uiobj.DataProperty + ";");

                        uiobj.RegisterFormContext();

                    }

                }


                if (uiobj.SetDataDomain != undefined)
                    uiobj.SetDataDomain(v);
            } catch (ex) {

                alert(ex.toString());
            }

        }
    });

    uiobj.bindings = Array();
    //按照名称获取绑定
    uiobj.bindings.GetBinding = function (name) {

        var bd = undefined;
        for (var i = 0; i < uiobj.bindings.length; i++) {

            if (uiobj.bindings[i].PropertyName == name) {
                bd = uiobj.bindings[i];
                break;
            }

        }

        return bd;

    }

    Object.defineProperty(uiobj, "Bindings", {
        get: function () {
            return uiobj.bindings;
        }
    });

    uiobj.ExecuteBinding = function () {

        for (var i = 0; i < uiobj.Bindings.length; i++) {



        }

    }
    uiobj.Base.ExecuteBinding = uiobj.ExecuteBinding;
    uiobj.Dispose = function () {

    }

    return uiobj;

}
DBFX.Web.Controls.OverlayZIndex = 1000;

//控件基类
DBFX.Web.Controls.Control = function (v) {

    var ctrl = null;
    if (v != undefined)
        ctrl = new UIObject(v);
    else
        ctrl = new UIObject("Control");

    ctrl.IsCanSetting = false;
    ctrl.IsCanResize = 1;
    ctrl.ClassDescriptor.DisplayName = "UI基础控件";
    ctrl.ClassDescriptor.Description = "为UI提供基础实现";
    ctrl.ClassDescriptor.Serializer = null;
    ctrl.ClassDescriptor.DesignTimePreparer = "DBFX.Design.GeneralDesignTimePreparer";
    ctrl.ClassDescriptor.Designers = ["DBFX.Design.ControlDesigners.ObjectGeneralDesigner", "DBFX.Design.ControlDesigners.LayoutDesigner", "DBFX.Design.ControlDesigners.BBCDesigner", "DBFX.Design.ControlDesigners.FontDesigner"];
    ctrl.IsContainer = false;
    ctrl.formContext = undefined;
    ctrl.VisualElement = document.createElement("DBC");
    ctrl.ClientDiv = ctrl.VisualElement;
    ctrl.OnCreateHandle = function () {

        ctrl.ClientDiv = ctrl.VisualElement;
        ctrl.VisualElement.onmousedown = ctrl.OnMouseDown;
        ctrl.VisualElement.onmouseup = ctrl.OnMouseUp;
        ctrl.VisualElement.onmousemove = ctrl.OnMouseMove;
        ctrl.VisualElement.onmouseenter = ctrl.OnMouseEnter;
        ctrl.VisualElement.onmouseout = ctrl.OnMouseOut;
        ctrl.VisualElement.onmousewheel = ctrl.OnMouseWheel;
        ctrl.VisualElement.onclick = ctrl.OnClick;
        ctrl.VisualElement.ondblclick = ctrl.OnDblClick;
        ctrl.VisualElement.ondragstart = ctrl.OnDragStart;
        ctrl.VisualElement.ondragover = ctrl.OnDragOver;
        ctrl.VisualElement.ondrop = ctrl.OnDrop;
        ctrl.VisualElement.ondragleave = ctrl.OnDragLeave;
        ctrl.VisualElement.oncontextmenu = ctrl.ShowContextMenu;
        ctrl.VisualElement.onkeydown = ctrl.OnKeyDown;
        ctrl.VisualElement.onkeyup = ctrl.OnKeyUp;
        ctrl.VisualElement.onkeypress = ctrl.OnKeypress;
        ctrl.VisualElement.ontouchstart = ctrl.OnTouchStart;
        ctrl.VisualElement.ontouchmove = ctrl.OnTouchMove;
        ctrl.VisualElement.ontouchend = ctrl.OnTouchEnd;

        ctrl.AllowDrop = false;
        ctrl.VisualElement.ParentObject = ctrl;
        ctrl.ClientDiv = ctrl.VisualElement;

    }
    ctrl.OnTouchStart = function (e) {
        if (ctrl.OnTouchStart != undefined && typeof ctrl.TouchStart == "function")
            ctrl.TouchStart(e);
    }
    ctrl.OnTouchMove = function (e) {
        if (ctrl.TouchMove != undefined && typeof ctrl.TouchStart == "function")
            ctrl.TouchMove(e);
    }
    ctrl.OnTouchEnd = function (e) {
        if (ctrl.TouchEnd != undefined && typeof ctrl.TouchStart == "function")
            ctrl.TouchEnd(e);
    }
    ctrl.Base.OnCreateHandle = ctrl.OnCreateHandle;
    ctrl.designTime = false;
    Object.defineProperty(ctrl, "Width", {
        get: function () {
            return ctrl.VisualElement.style.width;
        },
        set: function (v) {


            ctrl.SetWidth(v);

            ctrl.OnResized();

            if (ctrl.width != v) {
                ctrl.width = v;
                ctrl.OnPropertyChanged("Width", v);
            }
        }
    });
    Object.defineProperty(ctrl, "MinWidth", {
        get: function () { return ctrl.VisualElement.style.minWidth; },
        set: function (v) {

            if (v != undefined && v != null) {

                if (ctrl.ClientDiv != null) {
                    ctrl.ClientDiv.style.minWidth = v;
                }
                else
                    ctrl.VisualElement.style.minWidth = v;

                ctrl.OnResized();

                if (ctrl.minWidth != v) {
                    ctrl.minWidth = v;
                    ctrl.OnPropertyChanged("MinWidth", v);
                }
            }

        }
        , enumerable: false
    });
    Object.defineProperty(ctrl, "MinHeight", {
        get: function () { return ctrl.VisualElement.style.minHeight; },
        set: function (v) {
            if (v != undefined && v != null) {
                if (ctrl.ClientDiv != null) {
                    ctrl.ClientDiv.style.minHeight = v;
                }
                else
                    ctrl.VisualElement.style.minHeight = v;
                ctrl.OnResized();


                if (ctrl.minHeight != v) {
                    ctrl.minHeight = v;
                    ctrl.OnPropertyChanged("MinHeight", v);
                }
            }
        }
    });
    Object.defineProperty(ctrl, "MaxWidth", {
        get: function () {
            return ctrl.VisualElement.style.maxWidth;
        },
        set: function (v) {

            if (v != undefined && v != null) {

                if (ctrl.ClientDiv != null) {
                    ctrl.ClientDiv.style.maxWidth = v;
                }
                else
                    ctrl.VisualElement.style.maxWidth = v;

                ctrl.OnResized();

                if (ctrl.maxWidth != v) {
                    ctrl.maxWidth = v;
                    ctrl.OnPropertyChanged("MaxWidth", v);
                }
            }

        }
    });
    Object.defineProperty(ctrl, "MaxHeight", {
        get: function () { return ctrl.VisualElement.style.maxHeight; },
        set: function (v) {
            if (v != undefined && v != null) {
                if (ctrl.ClientDiv != null) {
                    ctrl.ClientDiv.style.maxHeight = v;
                }
                else
                    ctrl.VisualElement.style.maxHeight = v;

                ctrl.OnResized();


                if (ctrl.maxHeight != v) {
                    ctrl.maxHeight = v;
                    ctrl.OnPropertyChanged("MaxHeight", v);
                }
            }
        }
    });
    Object.defineProperty(ctrl, "Height", {
        get: function ()
        {
            return  ctrl.VisualElement.style.height;
        },
        set: function (v) {

            ctrl.SetHeight(v);
            ctrl.OnResized();

            if (ctrl.height != v) {
                ctrl.height = v;
                ctrl.OnPropertyChanged("Height", v);
            }
        }
    });
    Object.defineProperty(ctrl, "Float", {
        get: function () { return ctrl.float; },

        set: function (v) {

            if (ctrl.SetFloat == undefined) {

                if (v != undefined && v != null)
                    ctrl.VisualElement.style.float = v;

                if (ctrl.float != v) {
                    ctrl.float = v;
                    ctrl.OnPropertyChanged("Float", v);
                }
            }
            else {

                ctrl.float = v;
                ctrl.SetFloat();
            }

        }
    });
    ctrl.bkimgposition = "";
    Object.defineProperty(ctrl, "BackgroundPosition", {
        get: function () {
            return ctrl.bkimgposition;
        },
        set: function (v) {
            ctrl.bkimgposition = v;
            ctrl.SetBackgroundPosition(v);
        }
    });
    ctrl.SetBackgroundPosition = function (v) {

        if (ctrl.ClientDiv != null) {
            ctrl.ClientDiv.style.backgroundPosition = v;
        }
        else
            ctrl.VisualElement.style.backgroundPosition = v;

        ctrl.OnPropertyChanged("BackgroundPosition", v);
    }
    /******************渲染后的控件高度和宽度**************************/
    Object.defineProperty(ctrl, "ComputedHeight", {
        get: function () {
            var cssObj = window.getComputedStyle(ctrl.VisualElement, null);
            return cssObj.height;
        }
    });
    Object.defineProperty(ctrl, "ComputedWidth", {
        get: function () {
            var cssObj = window.getComputedStyle(ctrl.VisualElement, null);
            return cssObj.width;
        }
    });
    Object.defineProperty(ctrl, "Left", {
        get: function () { return ctrl.VisualElement.style.left; },

        set: function (v) {


            if (ctrl.ClientDiv != null) {
                ctrl.ClientDiv.style.left = v;

            }
            else
                ctrl.VisualElement.style.left = v;

            if (ctrl.left != v) {
                ctrl.left = v;
                ctrl.OnPropertyChanged("Left", v);
            }

        }
    });
    Object.defineProperty(ctrl, "Top", {
        get: function () { return ctrl.VisualElement.style.top; },

        set: function (v) {

            if (v == undefined || v == null)
                return;

            if (ctrl.ClientDiv != null) {
                ctrl.ClientDiv.style.top = v;

            }
            else
                ctrl.VisualElement.style.top = v;

            if (ctrl.top != v) {
                ctrl.top = v;
                ctrl.OnPropertyChanged("Top", v);
            }

        }
    });
    Object.defineProperty(ctrl, "ZIndex", {
        get: function () { return ctrl.VisualElement.style.zIndex; },

        set: function (v) {

            if (v == undefined || v == null)
                return;

            if (ctrl.ClientDiv != null) {
                ctrl.ClientDiv.style.zIndex = v;

            }
            else
                ctrl.VisualElement.style.zIndex = v;

            if (ctrl.zIndex != v) {
                ctrl.zIndex = v;
                ctrl.OnPropertyChanged("ZIndex", v);
            }
        }
    });
    Object.defineProperty(ctrl, "BorderStyle", {
        get: function () {
            if (ctrl.ClientDiv != null)
                return ctrl.ClientDiv.style.borderStyle;
            else
                return ctrl.VisualElement.style.borderStyle;
        },
        set: function (v) {


            if (ctrl.ClientDiv != null) {
                ctrl.ClientDiv.style.borderStyle = v;

            }
            else
                ctrl.VisualElement.style.borderStyle = v;

            ctrl.OnPropertyChanged("BorderStyle", v);
        }
    });
    Object.defineProperty(ctrl, "BorderWidth", {
        get: function () {
            if (ctrl.ClientDiv != null)
                return ctrl.ClientDiv.style.borderWidth;
            else
                return ctrl.VisualElement.style.borderWidth;
        },
        set: function (v) {


            if (ctrl.ClientDiv != null) {
                ctrl.ClientDiv.style.borderWidth = v;

            }
            else
                ctrl.VisualElement.style.borderWidth = v;

            ctrl.OnPropertyChanged("BorderWidth", v);
        }
    });
    Object.defineProperty(ctrl, "BorderColor", {
        get: function () {

            //20190712
            if (!ctrl.borderColor) {
                return "";
            }

            return ctrl.borderColor;


        },
        set: function (v) {

            //20190712
            ctrl.borderColor = v;

            //20190712
            ctrl.SetBorderColor(v);

            ctrl.OnPropertyChanged("BorderColor", v);
        }

    });
    ctrl.SetBorderColor = function (v) {
        if (ctrl.ClientDiv != null) {
            ctrl.ClientDiv.style.borderColor = v;
        }
        else
            ctrl.VisualElement.style.borderColor = v;
    }
    Object.defineProperty(ctrl, "BorderRadius", {
        get: function () { return ctrl.VisualElement.style.borderRadius; },

        set: function (v) {

            if (v == undefined || v == null)
                return;

            ctrl.borderRadius = v;

            ctrl.SetBorderRadius(v);

        }
    });
    Object.defineProperty(ctrl, "DataContext", {
        get: function () { return this.dataContext; },

        set: function (v) {

            var e = new Object();
            e.OldValue = this.dataContext;
            e.Value = v;
            ctrl.dataContext = v;
            ctrl.DataContextChanged(e);
            ctrl.OnPropertyChanged("DataContext", v);
        }
    });
    Object.defineProperty(ctrl, "Margin", {
        get: function () {
            return ctrl.margin;
        },
        set: function (v) {

            ctrl.margin = v;
            ctrl.SetMargin(v);

            ctrl.OnPropertyChanged("Margin", v);
        }
    });
    ctrl.SetMargin = function (v) {

        if (this.ClientDiv != null) {
            this.ClientDiv.style.margin = v;
        }
        else
            ctrl.VisualElement.style.margin = v;
    }
    Object.defineProperty(ctrl, "HorizonScrollbar", {
        get: function () {
            return ctrl.horScrollBar;
        },

        set: function (v) {

            ctrl.horScrollBar = v;
            if (this.ClientDiv != null) {
                this.ClientDiv.style.overflowX = v;
            }
            else
                ctrl.VisualElement.style.overflowX = v;

            ctrl.OnPropertyChanged("HorizonScrollbar", v);

        }
    });
    Object.defineProperty(ctrl, "VerticalScrollbar", {
        get: function () {

            return this.verScrollbar;

        },

        set: function (v) {

            this.verScrollbar = v;
            if (this.ClientDiv != null) {
                this.ClientDiv.style.overflowY = v;
            }
            else
                ctrl.VisualElement.style.overflowY = v;

            ctrl.OnPropertyChanged("VerticalScrollbar", v);
        }
    });
    Object.defineProperty(ctrl, "ScrollStyle", {
        get: function () {
            if (this.ClientDiv != null) {
                return this.ClientDiv.style.overflow;
            }
            else
                return ctrl.VisualElement.style.overflow;
        },

        set: function (v) {

            if (v == null || v == undefined)
                return;

            if (this.ClientDiv != null) {
                this.ClientDiv.style.overflow = v;

            }
            else
                ctrl.VisualElement.style.overflow = v;

            ctrl.OnPropertyChanged("ScrollStyle", v);

        }
    });
    Object.defineProperty(ctrl, "Opacity", {
        get: function () { return ctrl.VisualElement.style.opacity; },

        set: function (v) {

            ctrl.SetOpacity(v);
            ctrl.OnPropertyChanged("Opacity", v);
        }
    });
    Object.defineProperty(ctrl, "Bottom", {
        get: function () { return ctrl.VisualElement.style.bottom; },

        set: function (v) {

            if (v == undefined || v == null)
                return;

            this.VisualElement.style.bottom = v;
            if (ctrl.ClientDiv != null) {
                ctrl.ClientDiv.style.bottom = v;
            }

            if (ctrl.bottom != v) {
                ctrl.bottom = v;
                ctrl.OnPropertyChanged("Bottom", v);
            }
        }
    });
    Object.defineProperty(ctrl, "Right", {
        get: function () { return ctrl.VisualElement.style.right; },

        set: function (v) {

            if (v == undefined || v == null)
                return;

            this.VisualElement.style.right = v;
            if (ctrl.ClientDiv != null) {
                ctrl.ClientDiv.style.right = v;
            }

            if (ctrl.right != v) {
                ctrl.right = v;
                ctrl.OnPropertyChanged("Right", v);
            }

        }
    });
    Object.defineProperty(ctrl, "FontSize", {
        get: function () { return ctrl.VisualElement.style.fontSize; },

        set: function (v) {


            if (ctrl.ClientDiv != null) {
                ctrl.ClientDiv.style.fontSize = v;
            }
            else
                this.VisualElement.style.fontSize = v;

            ctrl.SetFontSize(v);

            ctrl.OnPropertyChanged("FontSize", v);
        }
    });
    ctrl.SetFontSize = function (v) {

    }
    Object.defineProperty(ctrl, "FontFamily", {
        get: function () { return ctrl.VisualElement.style.fontFamily; },

        set: function (v) {


            if (ctrl.ClientDiv != null) {
                ctrl.ClientDiv.style.fontFamily = v;
            }
            else
                this.VisualElement.style.fontFamily = v;

            ctrl.SetFontFamily(v);

            ctrl.OnPropertyChanged("FontFamily", v);
        }
    });
    ctrl.SetFontFamily = function (v) {

    }
    Object.defineProperty(ctrl, "FontStyle", {
        get: function () { return ctrl.fontStyle; },

        set: function (v) {


            if (ctrl.ClientDiv != null) {
                ctrl.ClientDiv.style.fontWeight = v;
            }
            else
                this.VisualElement.style.fontWeight = v;

            ctrl.SetFontStyle(v);
            ctrl.fontStyle = v;
            ctrl.OnPropertyChanged("FontStyle", v);
        }
    });
    ctrl.SetFontStyle = function (v) {

    }
    //下划线
    ctrl.fontUnderLine = false;
    Object.defineProperty(ctrl, "FontUnderLine", {
        get: function () { return ctrl.fontUnderLine; },

        set: function (v) {

            v = v==true || v == 'true' ? true : false;
            if (ctrl.ClientDiv != null) {
                ctrl.ClientDiv.style.textDecoration = v ? 'underline':'';
            }
            else
                this.VisualElement.style.textDecoration = v ? 'underline':'';

            ctrl.SetFontUnderLine(v);
            ctrl.fontUnderLine = v;
            ctrl.OnPropertyChanged("FontUnderLine", v);
        }
    });
    ctrl.SetFontUnderLine = function (v) {

    }
    //删除线
    ctrl.fontDeleteLine = false;
    Object.defineProperty(ctrl, "FontDeleteLine", {
        get: function () { return ctrl.fontDeleteLine; },

        set: function (v) {

            v = v==true || v == 'true' ? true : false;
            if (ctrl.ClientDiv != null) {
                ctrl.ClientDiv.style.textDecoration = v ? 'line-through':'';
            }
            else
                this.VisualElement.style.textDecoration = v ? 'line-through':'';

            ctrl.SetFontDeleteLine(v);
            ctrl.fontDeleteLine = v;
            ctrl.OnPropertyChanged("FontDeleteLine", v);
        }
    });
    ctrl.SetFontDeleteLine = function (v) {

    }

    Object.defineProperty(ctrl, "Position", {
        get: function () { return ctrl.VisualElement.style.position; },

        set: function (v) {

            if (ctrl.ClientDiv != null) {
                ctrl.ClientDiv.style.position = v;
            }
            else
                this.VisualElement.style.position = v;

            if (ctrl.position != v) {
                ctrl.position = v;
                ctrl.OnPropertyChanged("Position", v);
            }
        }
    });

    ctrl.padding = "";
    Object.defineProperty(ctrl, "Padding", {
        get: function () {
            return ctrl.padding;

        },

        set: function (v) {

            ctrl.padding = v;
            ctrl.SetPadding(v);
            ctrl.OnPropertyChanged("Padding", v);

        }
    });

    ctrl.SetPadding = function (v) {

        if (this.ClientDiv != null) {
            this.ClientDiv.style.padding = v;
        }
        else
            ctrl.VisualElement.style.padding = v;

    }

    Object.defineProperty(ctrl, "Draggable", {
        get: function () { return ctrl.draggable; },

        set: function (v) {

            if (v == "true")
                v = true;
            ctrl.draggable = v;
            ctrl.VisualElement.draggable = v;
            if (ctrl.SetDragable != undefined)
                ctrl.SetDragable(v);

            ctrl.OnPropertyChanged("Draggable", v);
        }
    });

    Object.defineProperty(ctrl, "AllowDrop", {
        get: function () { return ctrl.VisualElement.allowDrop; },

        set: function (v) {

            ctrl.VisualElement.allowDrop = v;
            ctrl.OnPropertyChanged("AllowDrop", v);
        }
    });

    Object.defineProperty(ctrl, "BackgroundColor", {
        get: function () {
            if (!ctrl.backgroundColor) {
                return "";
            }
            return ctrl.backgroundColor;
        },

        set: function (v) {

            ctrl.backgroundColor = v;
            ctrl.SetBackgroundColor(v);

        }
    });

    ctrl.SetBackgroundColor = function (v) {

        if (ctrl.ClientDiv != null) {
            ctrl.ClientDiv.style.backgroundColor = v;
        }
        else
            ctrl.VisualElement.style.backgroundColor = v;

        ctrl.OnPropertyChanged("BackgroundColor", v);
    }

    ctrl.bkimgurl = "";
    Object.defineProperty(ctrl, "BackgroundImageUrl", {
        get: function () { return ctrl.bkimgurl; },
        set: function (v) {

            ctrl.bkimgurl = v;
            ctrl.SetBackgroundImageUrl(v);

        }
    });
    ctrl.SetBackgroundImageUrl = function (v) {

        if (ctrl.ClientDiv != null) {
            ctrl.ClientDiv.style.backgroundImage = v;
        }
        else
            ctrl.VisualElement.style.backgroundImage = v;

        ctrl.OnPropertyChanged("BackgroundImageUrl", v);
    }

    ctrl.bkrepeat = "no-repeat";
    Object.defineProperty(ctrl, "BackgroundRepeat", {
        get: function () { return ctrl.bkrepeat; },
        set: function (v) {

            ctrl.bkrepeat = v;
            ctrl.setBackgroundRepeat(v);

        }
    });
    ctrl.setBackgroundRepeat = function (v) {

        if (ctrl.ClientDiv != null) {
            ctrl.ClientDiv.style.backgroundRepeat = v;
        }
        else
            ctrl.VisualElement.style.backgroundRepeat = v;

        ctrl.OnPropertyChanged("BackgroundRepeat", v);
    }

    ctrl.flexShrink = "";
    Object.defineProperty(ctrl, "FlexShrink", {
        get: function () {
            return ctrl.flexShrink;
        },
        set: function (v) {
            ctrl.flexShrink = v;
            ctrl.SetFlexShrink(v);
        }
    });
    ctrl.SetFlexShrink = function (v) {

        if (ctrl.ClientDiv != null) {
            ctrl.ClientDiv.style.flexShrink = v;
        }
        else
            ctrl.VisualElement.style.flexShrink = v;

        ctrl.OnPropertyChanged("FlexShrink", v);
    }

    ctrl.bkimgsmode = "";
    Object.defineProperty(ctrl, "BackgroundSizeMode", {
        get: function () {
            return ctrl.bkimgsmode;
        },
        set: function (v) {
            ctrl.bkimgsmode = v;
            ctrl.SetBackgroundSizeMode(v);

        }
    });
    ctrl.SetBackgroundSizeMode = function (v) {

        if (ctrl.ClientDiv != null) {
            ctrl.ClientDiv.style.backgroundSize = v;
        }
        else
            ctrl.VisualElement.style.backgroundSize = v;

        ctrl.OnPropertyChanged("BackgroundSizeMode", v);
    }

    Object.defineProperty(ctrl, "Color", {
        get: function () {
            //20190712
            if (!ctrl.color) {

                return "";
            }

            return ctrl.color;

        },

        set: function (v) {

            //20190712
            ctrl.color = v;

            this.VisualElement.style.color = v;

            if (ctrl.ClientDiv != null) {
                ctrl.ClientDiv.style.color = v;
            }

            ctrl.SetColor(v);
            ctrl.OnPropertyChanged("Color", v);
        }
    });
    ctrl.SetColor = function (v) {

    }
    Object.defineProperty(ctrl, "Display", {
        get: function () {
            if (ctrl.display == undefined)
                ctrl.display = ctrl.VisualElement.style.display;

            return ctrl.display;
        },

        set: function (v) {

            ctrl.display = v;
            ctrl.SetDisplay(v);
            if (ctrl.display != v) {
                ctrl.OnPropertyChanged("Display", v);
            }
        }
    });

    ctrl.enabled = true;
    Object.defineProperty(ctrl, "Enabled", {
        get: function () { return ctrl.enabled; },

        set: function (v) {

            if (v == undefined || v == null || v.toString().toLowerCase() == "true")
                v = true;
            else
                v = false;

            ctrl.enabled = v;
            ctrl.VisualElement && ctrl.VisualElement.setAttribute('Enabled',v?'true':'false');
            ctrl.ClientDiv && ctrl.ClientDiv.setAttribute('Enabled',v?'true':'false');

            ctrl.SetEnabled(v);
            ctrl.OnPropertyChanged("Enabled", v);

        }
    });
    ctrl.SetEnabled = function (v) {

        if (v == false) {
            ctrl.VisualElement.disabled = "disabled";
            ctrl.Opacity = 0.7;
        }
        else {
            ctrl.VisualElement.disabled = "";
            ctrl.Opacity = 1;
        }

    }

    //形变transform
    ctrl.transform = '';
    Object.defineProperty(ctrl, "Transform", {
        get: function () { return ctrl.transform; },
        set: function (v) {
            ctrl.transform = v;
            ctrl.VisualElement && (ctrl.VisualElement.style.transform = v);
            ctrl.ClientDiv && (ctrl.VisualElement.style.transform = v);

            ctrl.SetTransform(v);
            ctrl.OnPropertyChanged("Transform", v);
        }
    });
    ctrl.SetTransform = function (v) {

    }

    //缩放 scale
    // ctrl.scale = 1;
    // Object.defineProperty(ctrl, "Scale", {
    //     get: function () { return ctrl.scale; },
    //     set: function (v) {
    //         ctrl.scale = isNaN(v*1) ? 1 : v*1;
    //         ctrl.VisualElement && (ctrl.VisualElement.style.transform = 'scale('+ctrl.scale+')');
    //         ctrl.ClientDiv && (ctrl.VisualElement.style.transform = 'scale('+ctrl.scale+')');
    //
    //         ctrl.SetScale(ctrl.scale);
    //         ctrl.OnPropertyChanged("Scale",ctrl.scale);
    //     }
    // });
    // ctrl.SetScale = function (v) {
    //
    // }


    //设置可用性表达式
    Object.defineProperty(ctrl, "EnabledExpression", {
        get: function () {
            return ctrl.enabledExpression;
        },
        set: function (v) {

            ctrl.enabledExpression = v;


        }
    });

    ctrl.ComputeEnabledExpression = function () {

        try {
            var expr = ctrl.enabledExpression;
            if (expr != undefined && expr != "") {
                expr = expr.replace("%26%26", "&&").replace("%60", "<");
                var r = eval(expr);
                if (typeof r == "boolean")
                    ctrl.Enabled = r;
            }
        }
        catch (ex) { }

    }

    //设置可用性表达式
    Object.defineProperty(ctrl, "VisibleExpression", {
        get: function () {
            return ctrl.visibleExpression;
        },
        set: function (v) {

            ctrl.visibleExpression = v;


        }
    });

    ctrl.ComputeVisibleExpression = function () {

        try {
            var expr = ctrl.visibleExpression;
            if (expr != undefined && expr != "") {
                expr = expr.replace("%26%26", "&&").replace("%60", "<");
                var r = eval(expr);
                if (typeof r == "boolean")
                    ctrl.Visibled = r;
            }
        }
        catch (ex) { }

    }

    Object.defineProperty(ctrl, "Visible", {
        get: function () {
            return ctrl.visibled;
        },

        set: function (v) {


            ctrl.Visibled = v;
            ctrl.OnPropertyChanged("Visible", v);

        }
    });

    ctrl.visibled = true;
    Object.defineProperty(ctrl, "Visibled", {
        get: function () {
            return ctrl.visibled;
        },

        set: function (v) {

            if (v == undefined || v == null || v.toString().toLowerCase() == "true")
                v = true;
            else
                v = false;

            ctrl.visibled = v;
            ctrl.SetVisibled(v);
            ctrl.OnPropertyChanged("Visibled", v);
        }
    });

    ctrl.SetVisibled = function (v) {

        if (ctrl.DesignTime)
            return;

        if (v == true)
            ctrl.VisualElement.style.display = ctrl.display;
        else
            ctrl.VisualElement.style.display = "none";

    }

    Object.defineProperty(ctrl, "DataBindings", {
        get: function () { return ctrl.dataBindings; },

        set: function (v) {

            ctrl.dataBindings = v;
            ctrl.OnPropertyChanged("DataBindings", v);

        }
    });


    Object.defineProperty(ctrl, "Class", {
        get: function () { return ctrl.ClientDiv.className; },

        set: function (v) {

            if (ctrl.ClientDiv != undefined && ctrl.ClientDiv != null)
                ctrl.ClientDiv.className = v;
            ctrl.OnPropertyChanged("Class", v);
        }
    });

    Object.defineProperty(ctrl, "Dock", {
        get: function () {
            return ctrl.dock;
        },
        set: function (v) {

            ctrl.dock = v;
            ctrl.SetDock(v);
            ctrl.OnPropertyChanged("Dock", v);
        }
    });

    Object.defineProperty(ctrl, "Name", {
        get: function () { return ctrl.GetName(); },

        set: function (v) {

            if (v != undefined && v != null) {

                if (ctrl.FormContext != undefined)
                    if (v != undefined && v != null && v != "")
                        ctrl.FormContext.Form.FormControls[v] = ctrl;
                    else
                        if (ctrl.name != undefined && ctrl.name != null && ctrl.name != "")
                            delete ctrl.FormContext.Form.FormControls[ctrl.name];

                ctrl.SetName(v);
                ctrl.OnPropertyChanged("Name", v);
            }

        }
    });

    Object.defineProperty(ctrl, "DesignTime", {
        get: function () {
            return ctrl.designTime;

        },
        set: function (v) {

            ctrl.designTime = v;

            ctrl.SetDesignTime(v);

            ctrl.OnPropertyChanged("DesignTime", v);
        }
    }
    );

    Object.defineProperty(ctrl, "Align", {
        get: function () {

            return ctrl.align;

        },
        set: function (v) {
            ctrl.align = v;
            if (ctrl.display == "flexbox") {

                ctrl.VisualElement.style.justifyContent = v;
            }
            else
                ctrl.VisualElement.style.textAlign = v;

            ctrl.SetAlign(v);
            ctrl.OnPropertyChanged("Align", v);
        }
    });


    Object.defineProperty(ctrl, "VAlign", {
        get: function () {
            return ctrl.valign;
        },
        set: function (v) {
            ctrl.valign = v;
            if (ctrl.display == "flexbox") {

                ctrl.VisualElement.style.alignItems = v;
            }
            else {
                ctrl.valign = v;

                var v1 = v;
                if (v == "center")
                    v1 = "middle";

                ctrl.VisualElement.style.verticalAlign = v1;
            }

            ctrl.SetVAlign(v);

            ctrl.OnPropertyChanged("VAlign", v);

        }
    });


    Object.defineProperty(ctrl, "TabIndex", {
        get: function () {

            return ctrl.tabIndex;

        },
        set: function (v) {
            ctrl.tabIndex = v;
            ctrl.SetTabIndex(v);
            //ctrl.OnPropertyChanged("TabIndex", v);
        }
    });

    ctrl.SetTabIndex = function (v) {
        ctrl.VisualElement.tabIndex = v;
    }

    Object.defineProperty(ctrl, "AccessKey", {
        get: function () {

            return ctrl.accessKey;

        },
        set: function (v) {
            ctrl.accessKey = v;
            ctrl.SetAccessKey(v);
            //ctrl.OnPropertyChanged("AccessKey", v);
        }
    });


    Object.defineProperty(ctrl, "FormContext", {
        get: function () {
            return ctrl.formContext;
        },
        set: function (v)
        {
            ctrl.formContext = v;
            ctrl.SetFormContext(v);
        }
    });

    ctrl.SetFormContext = function (v) {

    }

    ctrl.SetAccessKey = function (v) {

        ctrl.VisualElement.accessKey = v;
    }

    ctrl.SetDock = function (v) {


    }

    //
    ctrl.SetVAlign = function (v) {
    }

    //
    ctrl.SetAlign = function (v) {


    }

    ctrl.SetDesignTime = function (v) {


    }

    ctrl.SetName = function (v) {


        ctrl.name = v;

    }


    ctrl.GetName = function () {

        return ctrl.name;

    }

    ctrl.SetOpacity = function (v) {


        if (ctrl.ClientDiv != null) {
            ctrl.ClientDiv.style.opacity = v;
        }
        else
            this.VisualElement.style.opacity = v;


    }

    //数据上下文改变
    ctrl.DataContextChanged = function (e) {

        ctrl.DataBind(e);

        if (ctrl.enabledExpression != undefined && ctrl.enabledExpression != "")
            ctrl.ComputeEnabledExpression();

        if (ctrl.VisibleExpression != undefined && ctrl.VisibleExpression != "")
            ctrl.ComputeVisibleExpression();

    }


    //执行数据绑定
    ctrl.DataBind = function (e) {

        if (this.dataBindings != undefined && this.dataBindings != null && this.dataBindings != "") {

            if (this.dataContext != undefined && this.dataContext != null) {
                try {
                    var vdata = null;
                    var cmdline = "vdata=ctrl.dataContext." + this.dataBindings["Path"] + ";";
                    eval(cmdline);
                    this.SetValue(vdata);
                } catch (ex) { }

            }

        }


    }

    ctrl.DragDrop = function (sender, e) {

    }

    ctrl.OnDrag = function (e) {

    }

    ctrl.OnDrop = function (e) {

        if (ctrl.AllowDrop) {
            ctrl.DragDrop(ctrl, e);
        }

    }

    ctrl.OnDragStart = function (e) {

        if (ctrl.DragStart != undefined)
            ctrl.DragStart(ctrl, e);

        else {
            if (ctrl.Draggable == true) {
                e.dataTransfer.effectAllowed = "move";
                DBFX.Web.Controls.Context.DragObject = ctrl;
            }
        }


    }

    ctrl.OnDragEnter = function (e) {

    }

    ctrl.OnDragLeave = function (e) {
        if (ctrl.DragLeave != undefined)
            ctrl.DragLeave(ctrl, e);
    }


    ctrl.OnDragOver = function (e) {


        if (ctrl.DragOver != undefined) {
            ctrl.DragOver(ctrl, e);
        }
        else {
            if (ctrl.AllowDrop == true)
                e.preventDefault();
        }


    }

    ctrl.OnDragEnd = function (e) {

    }


    ctrl.OnClick = function (e) {

        if (ctrl.VisualElement.disabled == "disabled")
            return;
        if (ctrl.Click != null && ctrl.Click != undefined) {

            if (typeof ctrl.Click == "function") {

                ctrl.Click(e, ctrl);
            } else if (ctrl.Click.GetType() == "Command") {

                ctrl.Click.Sender = ctrl;
                ctrl.Click.Execute();

            }
        }

    }


    ctrl.OnDblClick = function (e) {

        if (ctrl.DblClick != null)
            ctrl.DblClick(e, ctrl);
    }

    ctrl.OnMouseDown = function (e) {

        if (ctrl.MouseDown != null && ctrl.MouseDown != undefined) {

            if (typeof ctrl.MouseDown == "function") {

                ctrl.MouseDown(e, ctrl);
            }
            else
                if (ctrl.MouseDown.GetType() == "Command") {

                    ctrl.MouseDown.Sender = ctrl;
                    ctrl.MouseDown.Execute();

                }

        }
    }

    ctrl.OnMouseMove = function (e) {

        if (ctrl.MouseMove != null && ctrl.MouseMove != undefined) {

            if (typeof ctrl.MouseMove == "function") {

                ctrl.MouseMove(e, ctrl);
            }
            else
                if (ctrl.MouseMove.GetType() == "Command") {

                    ctrl.MouseMove.Sender = ctrl;
                    ctrl.MouseMove.Execute();

                }

        }
    }

    ctrl.OnMouseUp = function (e) {


        if (ctrl.MouseUp != null && ctrl.MouseUp != undefined) {

            if (typeof ctrl.MouseUp == "function") {

                ctrl.MouseUp(e, ctrl);
            }
            else
                if (ctrl.MouseUp.GetType() == "Command") {

                    ctrl.MouseUp.Sender = ctrl;
                    ctrl.MouseUp.Execute();

                }

        }

    }


    ctrl.OnMouseOver = function (e) {

        if (ctrl.MouseOver != null && ctrl.MouseOver != undefined) {

            if (typeof ctrl.MouseOver == "function") {

                ctrl.MouseOver(e, ctrl);
            }
            else
                if (ctrl.MouseOver.GetType() == "Command") {

                    ctrl.MouseOver.Sender = ctrl;
                    ctrl.MouseOver.Execute();

                }

        }
    }

    ctrl.OnMouseWheel = function (e) {



        if (ctrl.MouseWheel != null && ctrl.MouseWheel != undefined) {

            if (typeof ctrl.MouseWheel == "function") {

                ctrl.MouseWheel(e, ctrl);
            }
            else
                if (ctrl.MouseWheel.GetType() == "Command") {

                    ctrl.MouseWheel.Sender = ctrl;
                    ctrl.MouseWheel.Execute();

                }

        }
    }

    ctrl.OnMouseEnter = function (e) {

        if (ctrl.MouseEnter != null && ctrl.MouseEnter != undefined) {

            if (typeof ctrl.MouseEnter == "function") {

                ctrl.MouseEnter(e, ctrl);
            }
            else
                if (ctrl.MouseEnter.GetType() == "Command") {

                    ctrl.MouseEnter.Sender = ctrl;
                    ctrl.MouseEnter.Execute();

                }

        }
    }

    ctrl.OnMouseOut = function (e) {

        if (ctrl.MouseOut != null && ctrl.MouseOut != undefined) {

            if (typeof ctrl.MouseOut == "function") {

                ctrl.MouseOut(e, ctrl);
            }
            else
                if (ctrl.MouseOut.GetType() == "Command") {

                    ctrl.MouseOut.Sender = ctrl;
                    ctrl.MouseOut.Execute();

                }

        }

    }

    ctrl.SetValue = function (v) {


    }

    ctrl.GetValue = function () {

    }

    ctrl.SetContent = function (v) {


    }

    ctrl.GetContent = function () {

    }

    ctrl.SetText = function (v) {


    }

    ctrl.GetText = function () {

    }

    ctrl.SetDisplay = function (v) {

        if (v == "flexbox") {

            var ve = ctrl.VisualElement;
            if (ctrl.ClientDiv != null)
                ve = ctrl.ClientDiv;

            ve.style.setProperty("display", "-ms-flexbox");
            ve.style.setProperty("display", "-webkit-flex");

        } else {

            if (ctrl.ClientDiv != null) {
                ctrl.ClientDiv.style.display = v;
            }
            else
                ctrl.VisualElement.style.display = v;
        }
    }

    ctrl.OnContextMenu = function (e) {

        if (ctrl.ContextMenu != undefined && ctrl.ContextMenu.ShowContextMenu != undefined) {
            var pt = new Object();
            pt.x = e.clientX;
            pt.y = e.clientY;
            ctrl.ContextMenu.FormContext = ctrl.FormContext;
            ctrl.ContextMenu.DataContext = ctrl.DataContext;
            ctrl.ContextMenu.ShowAt(pt);
            e.cancelBubble = true;
            e.preventDefault();

        }

    }

    ctrl.OnKeyDown = function (e) {

        if (ctrl.Keydown != undefined) {

            if (ctrl.Keydown != undefined && ctrl.Keydown.GetType != undefined && ctrl.Keydown.GetType() == "Command") {
                ctrl.Keydown.Sender = ctrl;
                ctrl.Keydown.Execute();
            }

            if (typeof ctrl.Keydown == "function")
                ctrl.Keydown(e);
        }

    }

    ctrl.OnKeypress = function (e) {

        if (ctrl.Keypress != undefined) {

            if (ctrl.Keypress != undefined && ctrl.Keypress.GetType != undefined && ctrl.Keypress.GetType() == "Command") {
                ctrl.Keypress.Sender = ctrl;
                ctrl.Keypress.Execute();
            }

            if (typeof ctrl.Keypress == "function")
                ctrl.Keypress(e);
        }

    }


    ctrl.OnKeyUp = function (e) {

        if (ctrl.Keyup != undefined) {

            if (ctrl.Keyup != undefined && ctrl.Keyup.GetType != undefined && ctrl.Keyup.GetType() == "Command") {
                ctrl.Keyup.Sender = ctrl;
                ctrl.Keyup.Execute();
            }

            if (typeof ctrl.Keyup == "function")
                ctrl.Keyup(e);
        }

    }


    ctrl.ShowContextMenu = function (e) {
        var cmtype = typeof ctrl.ContextMenu;
        if (cmtype == "string") {

            ctrl.ContextMenu = DBFX.Web.Controls.ContextMenu.ContextMenus[ctrl.ContextMenu];

        }

        ctrl.OnContextMenu(e);
    }


    Object.defineProperty(ctrl, "Value", {
        get: function () {

            return ctrl.GetValue();
        },
        set: function (v) {

            ctrl.SetValue(v);
            ctrl.OnPropertyChanged("Value", v);

        }

    });

    Object.defineProperty(ctrl, "Text", {
        get: function () {

            return ctrl.GetText();
        },
        set: function (v) {

            ctrl.SetText(v);

            if (ctrl.OnPropertyChanged)
                ctrl.OnPropertyChanged("Text", v);

        }

    });

    Object.defineProperty(ctrl, "Content", {
        get: function () {

            return ctrl.GetContent();
        },
        set: function (v) {
            ctrl.SetContent(v);
            ctrl.OnPropertyChanged("Content", v);
        }

    });
    //hover时显示文字
    ctrl.tips = '';
    Object.defineProperty(ctrl, "Tips", {
        get: function () {
            return ctrl.GetTips();
        },
        set: function (v) {
            ctrl.tips = v;
            ctrl.SetTips(v);
            ctrl.OnPropertyChanged("Tips", v);
        }

    });

    ctrl.GetTips = function(){
        return ctrl.tips;
    }

    ctrl.SetTips = function(v){
        ctrl.VisualElement && ctrl.VisualElement.setAttribute('title',v);
    }

    ctrl.OnLoad = function () {

        if (typeof ctrl.Load == "function")
            ctrl.Load();

        if (ctrl.Load != undefined && ctrl.Load.GetType() == "Command") {
            ctrl.Load.Sender = ctrl;
            ctrl.Load.Execute();
        }

    }

    ctrl.OnResized = function () {



    }

    ctrl.SetDisabled = function (v) {

        if (ctrl.ClientDiv != undefined && ctrl.ClientDiv != null) {
            if (v == true)
                ctrl.ClientDiv.disabled = "disabled";
        }
        else {
            if (v == true)
                ctrl.VisualElement.disabled = "disabled";
        }

    }

    ctrl.Validate = function () {

        return true;
    }

    ctrl.SetDataDomain = function (v) {



    }

    ctrl.SetWidth = function (v) {

        ctrl.VisualElement.style.width = v;

        if (ctrl.ClientDiv != null) {
            ctrl.ClientDiv.style.width = v;
        }

    }
    ctrl.SetHeight = function (v) {


        ctrl.VisualElement.style.height = v;
        if (ctrl.ClientDiv != null) {
            ctrl.ClientDiv.style.height = v;

        }


    }

    ctrl.SetBorderRadius = function (v) {

        this.VisualElement.style.borderRadius = v;
        if (ctrl.ClientDiv != null) {
            ctrl.ClientDiv.style.borderRadius = v;
        }

        if (ctrl.borderRadius != v) {

            ctrl.OnPropertyChanged("BorderRadius", v);

        }
    }

    ctrl.Base.SetWidth = ctrl.SetWidth;
    ctrl.Base.SetHeight = ctrl.SetHeight;

    ctrl.ScrollIntoView = function (mode) {

        ctrl.VisualElement.scrollIntoView(mode);

    }

    ctrl.OnUnLoad = function () {

        if (typeof ctrl.UnLoad == "function")
            ctrl.UnLoad();

        if (ctrl.UnLoad != undefined && ctrl.UnLoad.GetType() == "Command") {
            ctrl.UnLoad.Sender = ctrl;
            ctrl.UnLoad.Execute();
        }

    }


    return ctrl;
}

//容器
DBFX.Web.Controls.Container = function (v) {

    var cnt = new DBFX.Web.Controls.Control(v);
    cnt.ClassDescriptor.Serializer = "DBFX.Serializer.ContainerSerializer";
    cnt.ClassDescriptor.DesignTimePreparer = "DBFX.Design.ContainerDesignTimePreparer";
    cnt.VisualElement = document.createElement("DIV");
    cnt.Controls = new DBFX.Web.Controls.ControlsCollection(cnt);
    cnt.OnCreateHandle();
    cnt.OnCreateHandle = function () {

        cnt.ItemsPanel = cnt.VisualElement;

    }

    //添加控件
    cnt.AddControl = function (c) {


        cnt.Controls.push(c);
        cnt.ItemsPanel.appendChild(c.VisualElement);
        if (c.FormContext == undefined)
            c.FormContext = cnt.FormContext;
        c.DataContext = cnt.DataContext;

    }

    cnt.InsertControl = function (c, tc, pos) {

        var idx = cnt.Controls.indexOf(tc);
        if (idx < 0)
            cnt.AddControl(c);
        else {

            if (pos == undefined || pos == 0) {
                cnt.Controls.splice(idx, 0, c);
                tc.VisualElement.insertAdjacentElement("beforeBegin", c.VisualElement);
            }
            else {

                cnt.Controls.splice(idx + 1, 0, c);
                tc.VisualElement.insertAdjacentElement("afterEnd", c.VisualElement);


            }
            if(c.FormContext==undefined)
                c.FormContext = cnt.FormContext;

            c.DataContext = cnt.DataContext;

        }

    }

    cnt.Remove = function (c) {

        var idx = cnt.Controls.indexOf(c);
        cnt.Controls.splice(idx, 1);
        cnt.ItemsPanel.removeChild(c.VisualElement);
    }

    cnt.AddElement = function (e) {

        cnt.ItemsPanel.appendChild(e);
    }

    cnt.AddHtml = function (s) {

        var e = document.createElement("P");
        e.innerHTML = s;
        cnt.ItemsPanel.appendChild(e);
    }


    cnt.DataBind = function (v) {

        for (var i = 0; i < cnt.Controls.length; i++)
            cnt.Controls[i].DataContext = cnt.dataContext;

    }

    cnt.Clear = function () {
        cnt.Controls = new Array();
        cnt.ItemsPanel.innerHTML = "";
    }


    cnt.Validate = function () {

        var r = true;
        for (var idx = 0; idx < cnt.Controls.length; idx++) {

            if (cnt.Controls[idx].Validate == undefined)
                continue;

            r = cnt.Controls[idx].Validate();
            if (r == false)
                break;

        }

        return r;
    }

    cnt.DesignTime = false;

    cnt.OnUnLoad = function () {

        cnt.Controls.forEach(function (c) {

            c.OnUnLoad();

        });

        if (typeof cnt.UnLoad == "function") {
            cnt.UnLoad();
        }
        else
        if (cnt.UnLoad != undefined && cnt.UnLoad.GetType() == "Command") {
            cnt.UnLoad.Sender = cnt;
            cnt.UnLoad.Execute();
        }
    }

    cnt.OnLoad = function () {

        cnt.Controls.forEach(function (c) {

            c.OnLoad();

        });

        if (cnt.Load != undefined) {

            if (typeof cnt.Load == "function")
                cnt.Load();

            if (cnt.Load.GetType() == "Command") {
                cnt.Load.Sender = cnt;
                cnt.Load.Execute();
            }
        }

    }
    return cnt;


}

//初始化设计时支持
DBFX.Design.ContainerDesignTimePreparer = function (cnt, dp) {

    cnt.ItemsPanel.appendChild(dp.VisualElement);
    dp.VisualElement.style.left = "0px";
    dp.VisualElement.style.top = "0px";
    dp.VisualElement.style.bottom = "0px";
    dp.VisualElement.style.right = "0px";


}

//
DBFX.Serializer.ContainerSerializer = function () {

    //反系列化
    this.DeSerialize = function (pc, xe, ns) {

        //系列化子控件
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

//按钮
DBFX.Web.Controls.Button = function (text, cb) {

    var btn = new DBFX.Web.Controls.Control("Button");
    btn.ClassDescriptor.DisplayName = "UI基础控件";
    btn.ClassDescriptor.Description = "为UI提供基础实现";
    btn.ClassDescriptor.Serializer = "DBFX.Serializer.ButtonSerializer";
    btn.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.ButtonDesigner");
    btn.VisualElement = document.createElement("DIV");
    btn.OnCreateHandle();
    btn.Button = null;
    btn.OnCreateHandle = function () {

        btn.VisualElement.className = "CButtonBox";
        btn.VisualElement.innerHTML = "<BUTTON class=\"CButton\"><IMG class=\"Button_Image\" style=\"display:none\"></IMG><SPAN  class=\"Button_Text\" ></SPAN></BUTTON>";
        btn.Button = btn.VisualElement.querySelector("BUTTON.CButton");
        btn.Image = btn.VisualElement.querySelector("IMG.Button_Image");
        btn.Span = btn.VisualElement.querySelector("SPAN.Button_Text");
        btn.Span.innerText = text||'';
        btn.ClientDiv = btn.VisualElement;

        if (cb != null)
            btn.VisualElement.onclick = cb;
        else
            btn.VisualElement.onclick = btn.OnClick;

    }

    btn.SetTabIndex = function (v) {
        btn.Button.tabIndex = v;
    }

    btn.SetAccessKey = function (v) {
        btn.Button.accessKey = v;
    }

    btn.SetFontFamily = function (v) {
        btn.Button.style.fontFamily = v;
    }

    btn.SetFontSize = function (v) {
        btn.Button.style.fontSize = v;
    }

    btn.SetFontStyle = function (v) {
        btn.Button.style.fontStyle = v;
        btn.Button.style.fontWeight = v;
    }

    btn.SetContent = function (v) {

        btn.Button.innerHTML = v;
    }

    btn.SetValue = function (v) {

        btn.Span.innerText =v||'';
    }

    btn.GetValue = function () {
        return btn.Span.textContent;
    }

    btn.SetText = function (v) {

        if (v.indexOf("%") >= 0)
            v = app.EnvironVariables.ParsingToString(v);

        btn.Span.innerText =  v||'';


    }

    btn.GetText = function () {
        return btn.Span.textContent;
    }

    btn.OnClick = function (e) {

        if (btn.enabled) {
            if (btn.Command != undefined && btn.Command != null) {
                btn.Command.Sender = btn;
                btn.Command.Execute();
            }

            if (btn.Click != undefined && btn.Click.GetType() == "Command") {

                btn.Click.Sender = btn;
                btn.Click.Execute();

            }


            if (btn.Click != undefined && btn.Click.GetType() == "function") {

                btn.Click(e, btn);

            }
        }

    }

    btn.SetDragable = function (v) {

        btn.Button.draggable = v;

    }

    btn.imageUrl = "";
    Object.defineProperty(btn, "ImageUrl", {
        get: function () {

            return btn.imageUrl;

        },
        set: function (v) {

            if (v != undefined && v != null && v != "") {

                v = v.replace("%currenttheme%", app.CurrentTheme).replace("http://wfs.dbazure.cn", "https://wfs.dbazure.cn");

                btn.Image.src = v;
                btn.Image.style.display = "";

            }
            else {

                v = "";
                btn.Image.src = "";
                btn.Image.style.display = "none";

            }

            btn.imageUrl = v;
        }

    });

    Object.defineProperty(btn, "ImageWidth", {
        get: function () {

            return btn.Image.clientWidth;

        },
        set: function (v) {

            if (v != undefined && v != null && v != "") {

                btn.Image.style.width = v;

            }

        }

    });

    Object.defineProperty(btn, "ButtonStyle", {

        get: function () {
            return 0;
        },
        set: function (v) {

            if (v == 1) {
                btn.Span.style.display = "block";
                btn.Image.style.height = "auto";
                btn.Image.style.width = "98%";

            }
        }

    });

    //TODO:20201210-按钮状态，通过设置不同的状态显示不同的样式
    //正常状态、警告、不可用disabled、selected、highlighted、扁平/danger primary default text link

    //默认-normal，主要-primary，警示-danger
    btn.buttonState = 'normal';
    Object.defineProperty(btn, "ButtonState", {

        get: function () {
            return btn.buttonState;
        },
        set: function (v) {
            btn.buttonState = v;
            btn.VisualElement.setAttribute('buttonState', v);
            btn.Button.setAttribute('buttonState', v);
        }

    });

    btn.SetWidth = function (v) {

        btn.ClientDiv.style.width = v;

    }

    btn.SetColor = function (v) {
        btn.Button.style.color = v;
    }
    btn.enabled = true;
    btn.SetEnabled = function (v) {

        btn.enabled = v;

        if (v == false || v == "false") {
            btn.Button.disabled = "disabled";
            btn.VisualElement.disabled = "disabled";
            btn.Class = "CButtonBoxdisabled";
            btn.enabled = false;
        }
        else {
            btn.Button.disabled = "";
            btn.VisualElement.disabled = "";
            btn.Class = "CButtonBox";
            btn.enabled = true;
        }

    }

    btn.SetFocus = function(){
        //获取焦点
        btn.Button.focus();

    }
    btn.SetBlur = function(){
        btn.Button.blur();
    }
    btn.OnCreateHandle();

    return btn;


}

//按钮序列化
DBFX.Serializer.ButtonSerializer = function () {

    //反系列化
    this.DeSerialize = function (c, xe, ns) {

        //初始化全局命名命令调用
        var gcmd = xe.getAttribute("CommandName");
        if (gcmd == null || gcmd == undefined)
            gcmd = xe.getAttribute("OnClick");

        if (gcmd != undefined && gcmd != null && gcmd != "") {

            //获取全局命令实例
            c.Command = app.GlobalCommands[gcmd];

            if (c.Command == undefined) {
                try {

                    var r = eval("typeof " + gcmd);

                    if (r == "function") {

                        c.Command = new DBFX.ComponentsModel.BaseCommand(eval(gcmd));

                    }

                } catch (ex) {
                    console.log(ex);
                }

            }

        }
        DBFX.Serializer.DeSerialProperty("ButtonState", c, xe);
        //Click
        //DBFX.Serializer.DeSerializeCommand("Click", xe, c);

    }


    //系列化
    this.Serialize = function (c, xe, ns) {

        //DBFX.Serializer.SerializeCommand("Click", c.Click, xe);
        DBFX.Serializer.SerialProperty("ImageUrl", c.ImageUrl, xe);
        DBFX.Serializer.SerialProperty("CommandName", c.CommandName, xe);
        DBFX.Serializer.SerialProperty("ButtonState", c.ButtonState, xe);
    }

}

//文本输入控件
DBFX.Web.Controls.TextBox = function (v, b, t, ot) {

    if (ot == undefined)
        ot = "TextBox";
    var tbx = new DBFX.Web.Controls.Control(ot);
    tbx.ClassDescriptor.DisplayName = "TextBox文本输入控件";
    tbx.ClassDescriptor.Description = "为UI提供基础实现";
    tbx.ClassDescriptor.Serializer = "DBFX.Serializer.TextBoxSerializer";
    tbx.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.InputControlDesigner");
    tbx.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.TextBoxDesigner");
    tbx.tipText = "";
    tbx.IsInitialized = false;
    tbx.VisualElement = document.createElement("DIV");
    tbx.OnCreateHandle();
    tbx.VisualElement.className = "TextBox";
    tbx.OnCreateHandle = function () {
        tbx.ClientDiv = tbx.VisualElement;
        tbx.VisualElement.innerHTML = "<DIV class=\"TextBoxDiv\"><IMG  class=\"TextBoxIcon\"></IMG><INPUT type=\"text\" class=\"TextBoxInput\" /><IMG class=\"TextBoxErrImg\" /></DIV><SPAN class=\"TextBoxTip\"></SPAN>";
        tbx.TextBoxTip = tbx.VisualElement.querySelector("SPAN.TextBoxTip");
        tbx.TextBox = tbx.VisualElement.querySelector("INPUT.TextBoxInput");
        tbx.TextBox.setAttribute("spellcheck", "false");
        tbx.IconElement = tbx.VisualElement.querySelector("IMG.TextBoxIcon");
        tbx.ErrImage = tbx.VisualElement.querySelector("IMG.TextBoxErrImg");
        tbx.ErrImage.src = "themes/" + app.CurrentTheme + "/images/error.png";
        if (v != undefined)
            tbx.TextBox.value = v;

        if (t == undefined)
            t = "";

        tbx.TipText = t;

        if (b != undefined)
            tbx.DataBindings = b;

        tbx.TextBox.onchange = tbx.TextChanged;

        tbx.TextBox.onfocus = function (e) {

            tbx.Class = "TextBoxContainerFocus";
            tbx.TextBox.Focusin(e);
            tbx.TextBoxTip.style.visibility = "hidden";
            var u = navigator.userAgent;
            var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
            var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 || u == 'LuckyCloudBrowser' || DBFX.Web.Controls.AutoScrollIntoView; //android终端
            if(isAndroid == false || isAndroid == undefined) return;
            setTimeout(function () {
                typeof tbx.TextBox.scrollIntoView == 'function' && tbx.TextBox.scrollIntoView(true);
            },150);
        }

        tbx.SetName = function (v) {
            tbx.TextBox.name = v;
        }

        tbx.GetName = function () {
            return tbx.TextBox.name;
        }

        tbx.TextBox.onblur = function (e) {
            tbx.Class = "TextBox";
            tbx.TextBox.Focusout(e);
        }

        tbx.ClientDiv.onmouseup = function (e) {
            tbx.TextBox.focus();
        }

        tbx.TextBox.Focusin = function (e) {

            tbx.ErrImage.style.marginRight = "-20px";

            if (tbx.autoSelectText == true) {

                tbx.TextBox.select();
            }
        }

        tbx.TextBox.Focusout = function (e) {

            if (!tbx.Validate()) {

            }
        }

        tbx.ShowError = function (r) {

            tbx.ErrImage.style.marginRight = r ? "-20px" : "2px";
            var ttext = tbx.ErrorTipText || '';
            tbx.TextBoxTip.innerText = ttext;
            tbx.TextBoxTip.style.visibility = (r || ttext == '') ? "hidden" : "visible";
            // tbx.TextBoxTip.style.visibility = (tbx.TextBox.value == "" || tbx.TextBox.value == undefined) ? "visible" : "hidden";

        }


        //鼠标进入
        tbx.ErrImage.onmouseenter = function (e) {

            var ttext = tbx.tipText;
            if (tbx.ErrorTipText != undefined)
                ttext = tbx.ErrorTipText;
            tbx.TextBoxTip.innerText = ttext;
            tbx.TextBoxTip.style.visibility = "visible";
            e.cancelBubble = true;
        }

        //鼠标离开
        tbx.ErrImage.onmouseleave = function (e) {
            tbx.TextBoxTip.style.visibility = "hidden";
            e.cancelBubble = true;
        }


        tbx.TextBox.onkeydown = tbx.OnKeyDown;
        tbx.TextBox.onkeyup = tbx.OnKeyUp;
        // tbx.TextBox.onclick = tbx.OnClick;

    }

    tbx.SetAccessKey = function (v) {
        tbx.TextBox.accessKey = v;
    }

    tbx.SetTabIndex = function (v) {
        tbx.TextBox.tabIndex = v;
    }

    //
    tbx.OnClick = function (e) {
        if (tbx.Click != undefined) {

            if (tbx.Click.GetType() == "Command") {

                tbx.Click.Sender = tbx;
                tbx.Click.Execute();

            }
            else {
                if (typeof tbx.Click == "function")
                    tbx.Click(e);
            }
        }
    }

    tbx.OnKeyDown = function (e) {

        if (tbx.KeyDown != undefined) {

            if (tbx.KeyDown.GetType() == "Command") {

                tbx.KeyDown.Sender = tbx;
                tbx.KeyDown.Execute();

            }
            else {

                if (typeof tbx.KeyDown == "function")
                    tbx.KeyDown(e);
            }

        }

    }

    tbx.OnKeyUp = function (e) {

        tbx.RegisterFormContext(1);

        if (tbx.KeyUp != undefined) {

            if (tbx.KeyUp.GetType() == "Command") {

                tbx.KeyUp.Sender = tbx;
                tbx.KeyUp.Execute();

            }
            else {

                if (typeof tbx.KeyUp == "function")
                    tbx.KeyUp(e);
            }

        }
    }

    tbx.SetFontFamily = function (v) {
        tbx.TextBox.style.fontFamily = v;
    }

    tbx.SetFontSize = function (v) {
        tbx.TextBox.style.fontSize = v;
    }

    tbx.SetFontStyle = function (v) {
        tbx.TextBox.style.fontStyle = v;
        tbx.TextBox.style.fontWeight = v;
    }

    //显示不完全时 显示省略符
    tbx.showEllipsis = false;
    Object.defineProperty(tbx,'ShowEllipsis',{
        get:function () {
            return tbx.showEllipsis;
        },
        set:function (v) {
            v = v == true || v == 'true' ? true : false;
            tbx.showEllipsis = v;
            v ? tbx.TextBox.classList.add('showEllipsis') : tbx.TextBox.classList.remove('showEllipsis');
        }
    })

    tbx.value = "";
    tbx.TextChanged = function (e) {

        if (tbx.dataBindings != undefined && tbx.dataContext != undefined && tbx.dataBindings.Path != "") {

            var cmdline = "tbx.dataContext." + tbx.dataBindings.Path + "=tbx.TextBox.value;";
            eval(cmdline);

        }


        tbx.RegisterFormContext();
        tbx.value = tbx.TextBox.value;


    }

    tbx.RegisterFormContext = function (m) {
        if (tbx.FormContext != null && tbx.dataProperty != "" && tbx.dataProperty != undefined) {
            if (tbx.dataDomain != undefined && tbx.dataDomain != "") {

                var ddv = tbx.FormContext[tbx.dataDomain];
                if (ddv == undefined)
                    tbx.FormContext[tbx.dataDomain] = new DBFX.DataDomain();

                tbx.FormContext[tbx.dataDomain][tbx.dataProperty] = tbx.TextBox.value;

            }
            else {
                tbx.FormContext[tbx.dataProperty] = tbx.TextBox.value;
            }
        }

        if (tbx.ValueChanged != undefined && tbx.value != tbx.TextBox.value && m == undefined) {

            tbx.value = tbx.TextBox.value;
            if (tbx.ValueChanged.GetType != undefined && tbx.ValueChanged.GetType() == "Command") {
                tbx.ValueChanged.Sender = tbx;
                tbx.ValueChanged.Execute();

            }
            else
                tbx.ValueChanged(tbx, tbx.value);
        }

    }

    Object.defineProperty(tbx, "MaxLength", {
        get: function () {
            return tbx.maxLength;
        },
        set: function (v) {
            tbx.maxLength = v;
            tbx.TextBox.maxLength = v;
        }
    });

    Object.defineProperty(tbx, "IconUrl", {
        get: function () {
            return tbx.iconUrl;
        },
        set: function (v) {
            tbx.iconUrl = v;
            tbx.IconElement.src = app.EnvironVariables.ParsingToString(v.replace("%currenttheme%", app.CurrentTheme).replace("http://wfs.dbazure.cn", "https://wfs.dbazure.cn"));
        }
    });

    tbx.SetIconUrl = function (v, w, h) {

        if (v != null && v != undefined) {
            v = v.replace("%currenttheme%", app.CurrentTheme);

            tbx.IconElement.src = v;
            if (w != undefined && h != undefined) {

                tbx.IconElement.style.width = w;
                tbx.IconElement.style.height = h;

            }

            if (v != undefined && v != "") {
                tbx.IconElement.style.display = "block";
                tbx.TextBoxTip.style.left = "22px";
            }
        }
    }

    tbx.SetAlign = function (v) {
        tbx.TextBox.style.textAlign = v;
    }

    tbx.SetValue = function (v) {
        tbx.ShowError(true);
        if (v === tbx.TextBox.value)
            return;

        if (v != undefined && v != null) {

            tbx.TextBox.value = v;


        }
        else {
            tbx.TextBox.value = "";
            v = "";
        }

        tbx.TextChanged(v);

        tbx.value = v;

    }

    tbx.GetValue = function () {
        return tbx.TextBox.value;
    }

    tbx.SetText = function (v) {
        tbx.ShowError(true);

        if (v == tbx.TextBox.value)
            return;

        if (v != undefined && v != null) {

            tbx.TextBox.value = v;

        }
        else
            tbx.TextBox.value = "";


        tbx.TextChanged(v);



    }

    tbx.GetText = function () {
        return tbx.TextBox.value;
    }

    tbx.GetValueText = function () {

        return tbx.TextBox.value;

    }

    tbx.SetTipText = function (v) {

        tbx.TextBox.setAttribute("placeholder", v);
    }

    tbx.BaseSetEnabled = tbx.SetEnabled;
    tbx.SetEnabled = function (v) {
        tbx.BaseSetEnabled(v);
        if (v == false || v == "false") {
            tbx.TextBox.disabled = "disabled";
            tbx.ReadOnly = true;
        }
        else {
            tbx.TextBox.disabled = "";
            tbx.ReadOnly = false;
        }
    }

    Object.defineProperty(tbx, "TipText", {
        get: function () {
            return tbx.tipText;
        },
        set: function (v) {
            tbx.SetTipText(v);
            tbx.tipText = v;
        }
    });

    //定义验证规则属性
    Object.defineProperty(tbx, "CheckRule", {
        get: function () {
            return tbx.checkRule;

        },
        set: function (v) {
            tbx.checkRule = v;
            if (v != null && v != undefined && v != "") {
                //tbx.TextBox.style.color = "rgba(255,0,0,0.3)";
            }
        }
    });

    tbx.readonly = false;
    Object.defineProperty(tbx, "ReadOnly", {
        get: function () {
            return tbx.readonly;

        },
        set: function (v) {

            tbx.readonly = v;
            if (v != null && v != undefined && (v == true || v == "true"))
                tbx.readonly = true;
            else
                tbx.readonly = false;

            tbx.TextBox.readOnly = tbx.readonly;

        }
    });


    tbx.autoSelectText = false;
    Object.defineProperty(tbx, "AutoSelectText", {
        get: function () {
            return tbx.autoSelectText;

        },
        set: function (v) {

            tbx.autoSelectText = v;
            if (v != null && v != undefined && (v == true || v == "true"))
                tbx.autoSelectText = true;
            else
                tbx.autoSelectText = false;
        }
    });

    //键盘类型number/text/email/tel
    tbx.keyboardType = "text";
    Object.defineProperty(tbx, "KeyboardType", {
        get: function () {
            return tbx.keyboardType;
        },
        set: function (v) {
            tbx.keyboardType = v;
            tbx.SetKeyboardType(v);
        }
    });

    //设置键盘类型
    tbx.SetKeyboardType = function (v) {
        switch (v) {
            case "number":
                tbx.TextBox.type = "number";
                tbx.keyboardType = v;
                break;
            case "time":
                tbx.TextBox.type = "time";
                tbx.keyboardType = v;
                break;
            case "date":
                tbx.TextBox.type = "date";
                tbx.keyboardType = v;
                break;
            case "datetime":
                tbx.TextBox.type = "datetime-local";
                tbx.keyboardType = "datetime";
                break;
            case "month":
                tbx.TextBox.type = "month";

                break;
            case "week":
                tbx.TextBox.type = "week";

                break;
            case "email":
                tbx.TextBox.type = "email";
                tbx.keyboardType = v;
                break;
            case "tel":
                tbx.TextBox.type = "tel";
                tbx.keyboardType = v;
                break;
            case "password":
                tbx.TextBox.type = "password";
                tbx.keyboardType = v;
                break;

            case "text":
            default:
                tbx.TextBox.type = "text";
                tbx.keyboardType = "text";
                break;
        }
    }

    //验证数据是否合法
    tbx.Validate = function () {
        var that = tbx;
        if(that.Display == 'none' || that.Visibled == false || that.Enabled == false){
            return true;
        }

        var r = true;
        try {
            if (tbx.checkRule != undefined && tbx.checkRule != "") {

                switch (tbx.checkRule) {
                    case "Length>0": //不能为空
                        r = tbx.Value.length > 0;
                        break;
                    case "123.00": //验证为数值
                        r = (tbx.Value != undefined && tbx.Value.trim() != "" && Math.abs(tbx.Value * 1) >= 0);
                        break;
                    case "123": //验证为整数值20190925
                        r = (tbx.Value != undefined && tbx.Value.trim() != "" && Math.abs(tbx.Value * 1) >= 0 && Math.ceil(tbx.Value) == tbx.Value);
                        break;
                    case "ICD": //验证身份证号
                        var IDCardReg = /(^[1-9]\d{5}(18|19|20|21|22)\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/;
                        r = IDCardReg.test(tbx.Value);
                        break;
                    case "MPhoneID": //验证手机号码
                        var PhoneReg = /^((86)?(13\d|14[5-9]|15[0-35-9]|16[6-7]|17[0-8]|18\d|19[5-9])\d{8})$/;
                        r = PhoneReg.test(tbx.Value);
                        break;
                    case "BankNumber"://验证银行卡号2020.07.09
                        var num = tbx.Value;
                        var t = /^[\d\-\s]+$/.test(num);//只允许输入数字、空格、-
                        r = !t ? false : true;
                        var numArr = num.match(/\d+/g);
                        var numStr = numArr && "" + numArr.join("");
                        var BankNumberReg = /^([1-9]{1})(\d{11}|\d{15}|\d{16}|\d{17}|\d{18})$/;
                        r = BankNumberReg.test(numStr);
                        break;
                    case "EmailAddr"://验证邮箱地址2020.07.09
                        var emailReg = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g;
                        r = emailReg.test(tbx.Value);
                        break;
                    case "PostCode"://验证邮编2020.12.01
                        var codeReg = /^[0-9]{6}$/;
                        r = codeReg.test(tbx.Value);
                        break;
                    case "YMD": //TODO:验证日期
                        var DateTimeReg = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/;
                        var DateReg = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
                        var TimeReg = /^(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/;
                        r = (DateReg.test(tbx.Value) || DateTimeReg.test(tbx.Value) || TimeReg.test(tbx.Value));

                        break;

                    default:

                        if (tbx.checkRule.indexOf("Length") == 0) {
                            var crl = tbx.checkRule.replace("Length", "tbx.Value.length");
                            r = eval(crl);

                        }
                        else {
                            r = eval(tbx.checkRule);
                        }
                        break;
                }
            }
            else {

                if (tbx.Value == "" || tbx.Value == undefined) {
                    tbx.ShowError(true);
                }
            }
        }
        catch (ex) {
            r = false;
        }
        tbx.ShowError(r);

        var control = tbx;
        if(control.FormContext && control.FormContext.Form){
            if(control.FormContext.Form.First_Not_Pass_Validation_Control == undefined && r == false){
                control.FormContext.Form.First_Not_Pass_Validation_Control = control;
            }
            if(r == true && control.FormContext.Form.First_Not_Pass_Validation_Control == control){
                control.FormContext.Form.First_Not_Pass_Validation_Control = undefined;
            }
        }
        return r;

    }

    //设置数据属性
    tbx.SetDataProperty = function (v) {

        tbx.RegisterFormContext();

    }

    tbx.SetColor = function (v) {
        tbx.TextBox.style.color = v;
    }
    //获取焦点
    tbx.SetFocus = function () {
        tbx.TextBox.focus();
        tbx.TextBox.select();
    }
    tbx.SetBlur = function () {
        tbx.TextBox.blur();
    }

    //当类型为时间相关时，设置时间范围和增量值
    tbx.minValue = '';
    Object.defineProperty(tbx,'MinValue',{
        get:function () {
            return tbx.minValue;
        },
        set:function (v) {
            tbx.minValue = v;
            tbx.TextBox.setAttribute('min',v)
        }
    });

    tbx.maxValue = '';
    Object.defineProperty(tbx,'MaxValue',{
        get:function () {
            return tbx.maxValue;
        },
        set:function (v) {
            tbx.maxValue = v;
            tbx.TextBox.setAttribute('max',v)
        }
    });

    tbx.stepValue = '';
    Object.defineProperty(tbx,'StepValue',{
        get:function () {
            return tbx.stepValue;
        },
        set:function (v) {
            tbx.stepValue = v;
            tbx.TextBox.setAttribute('step',v)
        }
    });

    tbx.OnCreateHandle();
    return tbx;

}

DBFX.Design.ControlDesigners.TextBoxDesigner = function () {

    var obdc = new DBFX.Web.Controls.GroupPanel();
    obdc.OnCreateHandle();
    obdc.OnCreateHandle = function () {


        DBFX.Resources.LoadResource("design/DesignerTemplates/FormDesignerTemplates/TextBoxDesigner.scrp", function (od) {

            od.DataContext = obdc.dataContext;

        }, obdc);


    }

    obdc.HorizonScrollbar = "hidden";
    obdc.OnCreateHandle();
    obdc.Class = "VDE_Design_ObjectGeneralDesigner";
    obdc.Text = "输入框设置";
    return obdc;

}

//文本
DBFX.Web.Controls.TextArea = function (v, b, t) {

    var ta = new DBFX.Web.Controls.Control("TextArea");
    ta.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.InputControlDesigner");
    ta.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.TextBoxDesigner");
    ta.ClassDescriptor.Serializer = "DBFX.Serializer.TextBoxSerializer";
    ta.OnCreateHandle();
    ta.VisualElement.className = "TextArea";
    ta.OnCreateHandle = function () {

        ta.VisualElement.innerHTML = "<DIV class=\"TextAreaDIV\" ><span class=\"TextAreaCounter\"></span><IMG  class=\"TextAreaIcon\"></IMG><TEXTAREA class=\"TextAreaInput\" ></TEXTAREA><IMG class=\"TextAreaErrImg\" /></DIV>";
        ta.ClientDiv = ta.VisualElement;//
        ta.TextArea = ta.VisualElement.querySelector("TEXTAREA.TextAreaInput");
        ta.TextArea.setAttribute("spellcheck", "false");
        ta.IconElement = ta.VisualElement.querySelector("IMG.TextAreaIcon");
        ta.ErrImage = ta.VisualElement.querySelector("IMG.TextAreaErrImg");

        //输入文字统计
        ta.Counter = ta.VisualElement.querySelector("span.TextAreaCounter");

        ta.ErrImage.src = "themes/" + app.CurrentTheme + "/images/error.png";

        if (v != undefined)
            ta.TextArea.value = v;

        if (t == undefined)
            t = "";

        ta.TipText = t;

        if (b != undefined)
            ta.DataBindings = b;

        ta.TextArea.onchange = ta.TextChanged;
        ta.TextArea.onfocus = function (e) {

            ta.VisualElement.className = "TextAreaSelected";
            ta.TextArea.Focusin(e);
        }

        ta.TextArea.onblur = function (e) {

            ta.VisualElement.className = "TextArea";
            ta.TextArea.Focusout(e);
        }

        ta.ClientDiv.onmouseup = function (e) {
            ta.TextArea.focus();
        }

        ta.TextArea.Focusin = function (e) {

            ta.ErrImage.style.marginRight = "-20px";

            if (ta.autoSelectText == true) {

                ta.TextArea.select();
            }
        }

        ta.TextArea.Focusout = function (e) {

            if (!ta.Validate()) {

            }
        }

        ta.ErrImage.onmouseenter = function (e) {


            var ttext = ta.tipText;
            if (ta.ErrorTipText != undefined)
                ttext = ta.ErrorTipText;

            e.cancelBubble = true;
        }

        ta.ErrImage.onmouseleave = function (e) {

            ta.TextArea.style.visibility = "visible";
            e.cancelBubble = true;
        }

        ta.TextArea.onkeydown = ta.OnKeyDown;
        ta.TextArea.onkeyup = ta.OnKeyUp;

    }

    ta.ShowError = function (r) {
        if (!ta.VFlag) {
            ta.bc = ta.BorderColor;
            ta.VFlag = true;
        }
        ta.ErrImage.setAttribute("title", ta.ErrorTipText);
        ta.VisualElement.style.borderColor = r ? ta.bc : 'red';
    }

    ta.SetAccessKey = function (v) {
        ta.TextArea.accessKey = v;
    }


    ta.SetTabIndex = function (v) {
        ta.TextArea.tabIndex = v;
    }

    ta.OnKeyDown = function (e) {

        if (ta.KeyDown != undefined) {

            if (ta.KeyDown.GetType() == "Command") {

                ta.KeyDown.Sender = ta;
                ta.KeyDown.Execute();

            }
            else {

                if (typeof ta.KeyDown == "function")
                    ta.KeyDown(e);
            }

        }

    }

    ta.OnKeyUp = function (e) {

        ta.RegisterFormContext(1);

        if (ta.KeyUp != undefined) {

            if (ta.KeyUp.GetType() == "Command") {

                ta.KeyUp.Sender = ta;
                ta.KeyUp.Execute();

            }
            else {

                if (typeof ta.KeyUp == "function")
                    ta.KeyUp(e);
            }

        }
    }

    ta.Input = function (e) {
        ta.Counter.innerText = ta.TextArea.value.length + ta.counterTail;
    }

    ta.readonly = false;
    Object.defineProperty(ta, "ReadOnly", {
        get: function () {

            return ta.readonly;

        },
        set: function (v) {


            if (v != undefined && v != null && v != "" && (v == true || v == "true"))
                v = true;
            else
                v = false;
            ta.readonly = v;
            ta.TextArea.readOnly = v;
        }
    });

    Object.defineProperty(ta, "TipText", {
        get: function () {
            return ta.tipText;
        },
        set: function (v) {
            ta.SetTipText(v);
            ta.tipText = v;
        }
    });

    ta.maxLength = "";
    ta.counterTail = "";
    Object.defineProperty(ta, "MaxLength", {
        get: function () {
            return ta.maxLength;
        },
        set: function (v) {

            if (v > 0) {
                ta.maxLength = v;
                ta.TextArea.maxLength = v;
                ta.counterTail = "/" + v;
                ta.Counter.style.display = "inline-flex";
                ta.TextArea.style.bottom = "14px";
                ta.TextArea.oninput = ta.Input;
            } else {
                ta.maxLength = "";
                ta.TextArea.removeAttribute("maxLength");
                ta.counterTail = "";
                ta.Counter.style.display = "none";
                ta.TextArea.oninput = undefined;
                ta.TextArea.style.bottom = "0";
            }

            ta.Counter.innerText = (ta.Value.length>0?ta.Value.length:0) + ta.counterTail;
        }
    });


    //键盘类型number/text/email/tel
    ta.keyboardType = "text";
    Object.defineProperty(ta, "KeyboardType", {
        get: function () {
            return ta.keyboardType;
        },
        set: function (v) {
            ta.keyboardType = v;
            ta.SetKeyboardType(v);
        }
    });

    ta.SetKeyboardType = function (v) {
        switch (v) {
            case "number":
                ta.TextArea.type = "number";
                ta.keyboardType = v;
                break;
            case "email":
                ta.TextArea.type = "email";
                ta.keyboardType = v;
                break;
            case "tel":
                ta.TextArea.type = "tel";
                ta.keyboardType = v;
                break;
            case "password":
                ta.TextArea.type = "password";
                ta.keyboardType = v;
                break;
            case "text":
            default:
                ta.TextArea.type = "text";
                ta.keyboardType = "text";
                break;
        }
    }

    ta.SetAlign = function (v) {
        ta.TextArea.style.textAlign = v;
    }

    ta.SetTipText = function (v) {

        ta.TextArea.setAttribute("placeholder", v);
    }


    ta.SetColor = function (v) {
        ta.TextArea.style.color = v;
    }

    ta.SetFontFamily = function (v) {
        ta.TextArea.style.fontFamily = v;
    }

    ta.SetFontSize = function (v) {
        ta.TextArea.style.fontSize = v;
    }

    ta.SetFontStyle = function (v) {
        ta.TextArea.style.fontStyle = v;
        ta.TextArea.style.fontWeight = v;
    }

    ta.TextChanged = function (e) {

        if (ta.dataBindings != undefined && ta.dataContext != undefined && ta.dataBindings.Path != "") {

            var cmdline = "ta.dataContext." + ta.dataBindings.Path + "=ta.TextArea.value ;";
            eval(cmdline);
        }

        ta.RegisterFormContext();
        ta.value = ta.TextArea.value;


    }

    ta.RegisterFormContext = function (m) {
        if (ta.FormContext != null && ta.dataProperty != "" && ta.dataProperty != undefined) {
            if (ta.dataDomain != undefined && ta.dataDomain != "") {

                var ddv = ta.FormContext[ta.dataDomain];
                if (ddv == undefined)
                    ta.FormContext[ta.dataDomain] = new DBFX.DataDomain();
                ta.FormContext[ta.dataDomain][ta.dataProperty] = ta.TextArea.value;
            }
            else {
                ta.FormContext[ta.dataProperty] = ta.TextArea.value;
            }
        }

        if (ta.ValueChanged != undefined && ta.value != ta.TextArea.value && m == undefined) {

            ta.value = ta.TextArea.value;
            if (ta.ValueChanged.GetType != undefined && ta.ValueChanged.GetType() == "Command") {
                ta.ValueChanged.Sender = ta;
                ta.ValueChanged.Execute();

            }
            else
                ta.ValueChanged(ta, ta.value);
        }

    }

    ta.SetValue = function (v) {
        if (v == null)
            v = "";
        ta.TextArea.value = v;
        ta.Counter.innerText = (v.length>0?v.length:0) + ta.counterTail;
        ta.TextChanged(v);
    }

    ta.GetValue = function () {
        return ta.TextArea.value;
    }

    ta.GetText = function () {
        return ta.GetValue();
    }

    ta.SetText = function (v) {
        ta.SetValue(v);
    }

    ta.SetDisabled = function (v) {

        if (v)
            ta.TextArea.disabled = "disabled";

    }

    ta.SetFocus = function(){
        //获取焦点
        ta.TextArea.focus();
        ta.TextArea.select();
    }

    ta.SetBlur = function(){
        ta.TextArea.blur();
    }

    ta.BaseSetEnabled = ta.SetEnabled;
    ta.SetEnabled = function (v) {
        ta.BaseSetEnabled();
        if (v == false || v == "false") {
            ta.TextArea.disabled = "disabled";
            ta.ReadOnly = true;
        }
        else {
            ta.TextArea.disabled = "";
            ta.ReadOnly = false;
        }
    }
    //定义验证规则属性
    Object.defineProperty(ta, "CheckRule", {
        get: function () {
            return ta.checkRule;

        },
        set: function (v) {
            ta.checkRule = v;
            if (v != null && v != undefined && v != "") {
                //tbx.TextBox.style.color = "rgba(255,0,0,0.3)";
            }
        }
    });

    //验证数据是否合法
    ta.Validate = function () {
        var that = ta;
        if(that.Display == 'none' || that.Visibled == false || that.Enabled == false){
            return true;
        }
        var r = true;
        try {
            if (ta.checkRule != undefined && ta.checkRule != "") {

                switch (ta.checkRule) {
                    case "Length>0": //不能为空
                        r = ta.Value.length > 0;
                        break;
                    case "123.00": //验证为数值
                        r = (ta.Value != undefined && ta.Value != "" && Math.abs(ta.Value * 1) >= 0);
                        break;
                    case "123": //验证为整数值20190925
                        r = (ta.Value != undefined && ta.Value != "" && Math.abs(ta.Value * 1) >= 0 && Math.ceil(ta.Value) == ta.Value);
                        break;
                    case "ICD": //验证身份证号
                        var IDCardReg = /(^[1-9]\d{5}(18|19|20|21|22)\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/;
                        r = IDCardReg.test(ta.Value);
                        break;
                    case "MPhoneID": //验证手机号码
                        var PhoneReg = /^((86)?(13\d|14[5-9]|15[0-35-9]|166|17[0-8]|18\d|19[8-9])\d{8})$/;
                        r = PhoneReg.test(ta.Value);
                        break;
                    case "BankNumber"://验证银行卡号2020.07.09
                        var num = ta.Value;
                        var t = /^[\d\-\s]+$/.test(num);//只允许输入数字、空格、-
                        r = !t ? false : true;
                        var numArr = num.match(/\d+/g);
                        var numStr = numArr && "" + numArr.join("");
                        var BankNumberReg = /^([1-9]{1})(\d{11}|\d{15}|\d{16}|\d{17}|\d{18})$/;
                        r = BankNumberReg.test(numStr);
                        break;
                    case "EmailAddr"://验证邮箱地址2020.07.09
                        var emailReg = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g;
                        r = emailReg.test(ta.Value);
                        break;
                    case "YMD": //TODO:验证日期
                        var DateTimeReg = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/;
                        var DateReg = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
                        var TimeReg = /^(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/;
                        r = (DateReg.test(ta.Value) || DateTimeReg.test(ta.Value) || TimeReg.test(ta.Value));

                        break;
                    default:

                        if (ta.checkRule.indexOf("Length") == 0) {
                            var crl = ta.checkRule.replace("Length", "ta.Value.length");
                            r = eval(crl);

                        }
                        else {
                            r = eval(ta.checkRule);
                        }
                        break;
                }
            }
            else {

                if (ta.Value == "" || ta.Value == undefined) {
                    ta.ShowError(true);
                }
            }
        }
        catch (ex) {
            r = false;
        }

        ta.ShowError(r);

        var control = ta;
        if(control.FormContext && control.FormContext.Form){
            if(control.FormContext.Form.First_Not_Pass_Validation_Control == undefined && r == false){
                control.FormContext.Form.First_Not_Pass_Validation_Control = control;
            }
            if(r == true && control.FormContext.Form.First_Not_Pass_Validation_Control == control){
                control.FormContext.Form.First_Not_Pass_Validation_Control = undefined;
            }
        }
        return r;

    }

    ta.SetIconUrl = function () {

    }

    ta.OnCreateHandle();

    return ta;

}

DBFX.Web.Controls.PasswordBox = function (v, b, t) {

    var tbx = new DBFX.Web.Controls.TextBox(v, b, t, "PasswordBox");
    tbx.TextBox.type = "password";
    tbx.TextBoxType = tbx.TextBox.type;

    tbx.SetKeyboardType = function (v) {

    }
    return tbx;
}

//标签
DBFX.Web.Controls.BreakLine = function () {

    var bl = new DBFX.Web.Controls.Control("BreakLine");
    bl.ClassDescriptor.DesignTimePreparer = "DBFX.Design.BreakLineDesignTimePreparer";
    bl.VisualElement = document.createElement("DIV");
    bl.ClientDiv = bl.VisualElement;
    bl.VisualElement.className = "BreakLine";
    bl.OnCreateHandle();


    return bl;

}

//标签
DBFX.Web.Controls.Label = function (v, mg, c) {
    var lbl = new DBFX.Web.Controls.Control("Label");
    lbl.ClassDescriptor.Serializer = "DBFX.Serializer.LabelBoxSerializer";
    lbl.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.LabelControlDesigner");
    lbl.VisualElement = document.createElement("DIV");

    lbl.SetText = function (v) {
        if (!lbl.DesignTime) {
            if (typeof v == "string" && v.indexOf("%") >= 0)
                v = app.EnvironVariables.ParsingToString(v);


            if (lbl.FormContext != null && lbl.dataProperty != "" && lbl.dataProperty != undefined)
                lbl.FormContext[lbl.dataProperty] = v;
        }

        var tval = v;
        if (tval != undefined && lbl.dataBindings != undefined && lbl.dataBindings.Format != undefined) {

            tval = tval.ToString(lbl.dataBindings.Format);

        }

        if (v == undefined) {
            lbl.Span.innerText = "--";
        } else {
            lbl.Span.innerText = lbl.ExecuteDesRule(tval);
        }

        lbl.value = v;
    }
    lbl.OnCreateHandle();
    lbl.VisualElement.className = "LabelBorder";

    lbl.OnCreateHandle = function () {
        lbl.VisualElement.innerHTML = "<DIV class=\"Label\"><IMG class=\"LabelImage\"><LABEL class=\"LabelText\"></LABEL></DIV>";
        lbl.Span = lbl.VisualElement.querySelector("LABEL");
        lbl.LabelImage = lbl.VisualElement.querySelector("IMG.LabelImage");
        lbl.LP = lbl.VisualElement.querySelector("DIV.Label");
        lbl.Span.innerHTML = v;
        lbl.ClientDiv = lbl.VisualElement;

        //TODO:20190617
        lbl.LabelText = lbl.VisualElement.querySelector("LABEL.LabelText");

        if (mg != undefined)
            lbl.Margin = mg;

        if (c != undefined)
            lbl.Color = c;
    }
    //文字显示行数 默认为1行
    lbl.textLines = "";

    Object.defineProperty(lbl, "TextLines", {
        get: function () {
            return lbl.textLines;
        },
        set: function (v) {
            lbl.textLines = v;
            lbl.LabelText.style.webkitLineClamp = v;
            if ((!!window.ActiveXObject || "ActiveXObject" in window) && v * 1 > 0) {
                lbl.LabelText.style.whiteSpace = "nowrap";
            }

            if (v * 1 == 1) {
                lbl.LabelText.style.whiteSpace = "nowrap";
                lbl.LabelText.style.display = "";
            }
            if (v * 1 > 1) {
                lbl.LabelText.style.whiteSpace = "normal";
                lbl.LabelText.style.display = "-webkit-box";
            }

        }
    });

    Object.defineProperty(lbl, "ImageUrl", {
        get: function () {
            return lbl.imageUrl;
        },
        set: function (v) {
            lbl.imageUrl = v;
            if (v != undefined && v != null && v != "") {
                lbl.LabelImage.src = app.EnvironVariables.ParsingToString(v.replace("%currenttheme%", app.CurrentTheme).replace("http://wfs.dbazure.cn", "https://wfs.dbazure.cn"));
                lbl.LabelImage.style.display = "block";
                lbl.LP.style.height = "100%";
            }
            else {
                lbl.LabelImage.style.display = "none";
                lbl.LP.style.height = "auto";
            }

        }
    });
    lbl.value = "";

    lbl.SetValue = function (v) {

        if (!lbl.DesignTime) {
            if (typeof v == "string" && v.indexOf("%") >= 0)
                v = app.EnvironVariables.ParsingToString(v);


            if (lbl.FormContext != null && lbl.dataProperty != "" && lbl.dataProperty != undefined)
                lbl.FormContext[lbl.dataProperty] = v;
        }

        var tval = v;
        if (tval != undefined && lbl.dataBindings != undefined && lbl.dataBindings.Format != undefined && lbl.dataBindings.Format != "") {

            tval = tval.ToString(lbl.dataBindings.Format);

        }

        if (v == undefined)
            lbl.Span.innerText = "--";
        else
            lbl.Span.innerText = lbl.ExecuteDesRule(tval);

        lbl.value = v;
    }

    lbl.GetValue = function () {
        return lbl.value;
    }

    lbl.SetContent = function (v) {

        lbl.Span.innerHTML = v;
    }

    lbl.GetContent = function () {
        return lbl.Span.innerHTML;
    }

    lbl.SetVAlign = function (v) {
        if (v == "top")
            lbl.LP.style.alignItems = "flex-start";
        else
            if (v == "bottom")
                lbl.LP.style.alignItems = "flex-end";
            else
                lbl.LP.style.alignItems = "center";
    }

    lbl.SetAlign = function (v) {
        if (v == 'space-around') {
            lbl.VisualElement.style.textAlign = "justify";
            lbl.VisualElement.style.textAlignLast = "justify";
        } else {
            lbl.VisualElement.style.textAlignLast = "";
        }
    }

    lbl.GetText = function () {
        return lbl.value;
    }

    lbl.SetHeight = function (v) {

        lbl.VisualElement.style.height = v;
        lbl.LabelImage.style.height = "calc(100% - 4px)";
    }

    lbl.SetFontStyle = function (v) {
            lbl.Span.style.fontWeight = v;
            lbl.Span.style.fontStyle = v;
    }

    //20210202 添加脱规则属性,处理敏感信息的显示 设计器使用下拉选；
    //规则：处理规则:Name-姓名；PhoneNumber-11位手机号码； IdentityCard-身份证号 18位；
    //           Address-住址信息；BankCard-银行卡号；Email-邮箱;Passport-护照9位，一位字母和八位数字组成；
    //            All-所有信息隐藏；
    //默认不处理；
    lbl.desensitizationRule = 'no';
    Object.defineProperty(lbl, 'DesensitizationRule', {
        get: function () { return lbl.desensitizationRule; },
        set: function (v) {
            lbl.desensitizationRule = v;
        }
    });
    //执行脱敏处理
    lbl.ExecuteDesRule = function (str) {
        //app.DesensitizationFlag  全局脱敏标识，值为1时，不进行信息脱敏处理
        if (app.DesensitizationFlag == 1 || lbl.desensitizationRule == 'no') {
            return str;
        }
        return Converter.Desensitization(str, lbl.desensitizationRule);
    }


    lbl.OnClick = function (e) {

        if (lbl.Enabled == false)
            return;

        if (lbl.Click != undefined) {
            if (lbl.Click.GetType != undefined && lbl.Click.GetType() == "Command") {
                lbl.Click.Sender = lbl;
                lbl.Click.Execute();
            }

            if (typeof (lbl.Click) == "function")
                lbl.Click(e);

        }
    }

    lbl.DblClick = function (e) {


        if (Dbsoft != undefined && Dbsoft.System != undefined && Dbsoft.System.copy != undefined) {
            Dbsoft.System.copy(lbl.Span.innerText);
        }


    }


    lbl.OnCreateHandle();

    return lbl;
}
DBFX.Serializer.LabelBoxSerializer = function () {
    //反系列化
    this.DeSerialize = function (c, xe, ns) {

        DBFX.Serializer.DeSerialProperty("DesensitizationRule", c, xe);
        DBFX.Serializer.DeSerialProperty("Value", c, xe);
        DBFX.Serializer.DeSerialProperty("ImageUrl", c, xe);
        DBFX.Serializer.DeSerialProperty("TextLines", c, xe);

    }


    //系列化
    this.Serialize = function (c, xe, ns) {

        DBFX.Serializer.SerialProperty("DesensitizationRule", c.DesensitizationRule, xe);
        DBFX.Serializer.SerialProperty("ImageUrl", c.ImageUrl, xe);
        DBFX.Serializer.SerialProperty("TextLines", c.TextLines, xe);

    }

}
//文本块
DBFX.Web.Controls.TextBlock = function (v, mg, c) {

    var tb = new DBFX.Web.Controls.Control("TextBlock");

    //20190617
    tb.ClassDescriptor.Serializer = "DBFX.Serializer.TextBlockSerializer";
    tb.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.TextBlockDesigner");
    tb.VisualElement = document.createElement("div");
    tb.VisualElement.style.display = "inline-block";
    tb.VisualElement.style.overflow = "hidden";
    tb.Class = "TextBlock";

    tb.OnCreateHandle();
    tb.OnCreateHandle = function () {

        tb.VisualElement.innerHTML = "<SPAN class=\"TextBlockSpan\"/>";
        tb.Paragraph = tb.VisualElement.querySelector("SPAN.TextBlockSpan");
        tb.Paragraph.innerHTML = v;
        tb.ClientDiv = tb.VisualElement;
        tb.Span = tb.Paragraph;
        if (mg != undefined)
            tb.VisualElement.style.margin = mg;

        if (c != undefined)
            tb.VisualElement.style.color = c;
    }

    //20190617
    //文字显示行数
    tb.textLines = "";
    Object.defineProperty(tb, "TextLines", {
        get: function () {
            return tb.textLines;
        },
        set: function (v) {
            v = v * 1;
            if (v > 0) {
                tb.textLines = v;
                tb.Paragraph.style.webkitLineClamp = v;
                tb.Paragraph.style.textOverflow = "ellipsis";
                tb.Paragraph.style.display = "-webkit-box";
                if ((!!window.ActiveXObject || "ActiveXObject" in window) && v * 1 > 0) {
                    tb.Paragraph.style.whiteSpace = "nowrap";
                }
            } else {
                tb.Paragraph.style.display = "";
            }

        }
    });

    tb.SetValue = function (v) {

        if (v == undefined)
            v = "";

        tb.Span.textContent = v;
        if (tb.FormContext != null && tb.dataProperty != "" && tb.dataProperty != undefined)
            tb.FormContext[tb.dataProperty] = v;
    }

    tb.GetValue = function () {
        return tb.Span.innerText;
    }


    tb.SetText = function (v) {
        if (v == undefined)
            v = "";

        tb.Span.textContent = v;
        if (tb.FormContext != null && tb.dataProperty != "" && tb.dataProperty != undefined)
            tb.FormContext[tb.dataProperty] = v;
    }

    tb.GetText = function () {
        return tb.Span.textContent;
    }

    tb.SetVAlign = function (v) {
        tb.Paragraph.style.alignItems = v;
    }

    tb.OnCreateHandle();

    return tb;

}
DBFX.Design.ControlDesigners.TextBlockDesigner = function () {
    var obdc = new DBFX.Web.Controls.GroupPanel();
    obdc.OnCreateHandle();
    obdc.OnCreateHandle = function () {

        DBFX.Resources.LoadResource("design/DesignerTemplates/FormDesignerTemplates/TextBlockDesigner.scrp", function (od) {

            od.DataContext = obdc.dataContext;
            // od.EventListBox = od.FormContext.Form.FormControls.EventListBox;
            // od.EventListBox.ItemSource = [{ EventName: "Click", EventCode: undefined, Command: od.dataContext.Click, Control: od.dataContext }];

        }, obdc);

    }

    //20191014  实现数据绑定方法
    obdc.BaseDataBind = obdc.DataBind;
    obdc.DataBind = function (v) {
        if (obdc.dataContext.DataBindings == undefined)
            obdc.dataContext.DataBindings = { Path: "", Format: "", Mode: "TwoWay" };

        obdc.BaseDataBind(v);
    }

    obdc.DataContextChanged = function (e) {

        obdc.DataBind(e);

        // if (obdc.EventListBox != undefined)
        // obdc.EventListBox.ItemSource = [{ EventName: "Click", EventCode: undefined, Command: obdc.dataContext.Click, Control: obdc.dataContext }];


    }

    obdc.HorizonScrollbar = "hidden";
    obdc.OnCreateHandle();
    obdc.Class = "VDE_Design_ObjectGeneralDesigner";
    obdc.Text = "文本块设置";
    return obdc;
}
DBFX.Serializer.TextBlockSerializer = function () {
    //反系列化
    this.DeSerialize = function (c, xe, ns) {
        DBFX.Serializer.DeSerialProperty("TextLines", c, xe);
    }


    //系列化
    this.Serialize = function (c, xe, ns) {

        DBFX.Serializer.SerialProperty("TextLines", c.TextLines, xe);

    }

}

//滑块
DBFX.Web.Controls.Silder = function (v,min,max) {

    var sld = new DBFX.Web.Controls.Control("Silder");
    sld.ClassDescriptor.Serializer = "DBFX.Serializer.SilderSerializer";
    sld.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.InputControlDesigner");

    sld.OnCreateHandle();
    sld.OnCreateHandle = function () {
        sld.Class = "Slider";
        sld.VisualElement.innerHTML = "<INPUT type=\"range\" class=\"SliderInput\"/>";
        sld.RangeSilder = sld.VisualElement.querySelector("INPUT");
        sld.RangeSilder.value = v;
        if (min == undefined || min == null)
            min = 0;

        sld.RangeSilder.min = min;

        if (max == undefined || max == null)
            max = 100;

        sld.RangeSilder.max = max;

        sld.RangeSilder.onchange = sld.OnValueChanged;

    }

    Object.defineProperty(sld, "Max", {
        get: function () {
            return sld.RangeSilder.max;
        }, set: function (v) {

            sld.RangeSilder.max = v;
        }
    });

    Object.defineProperty(sld, "Min", {
        get: function () {
            return sld.RangeSilder.min;
        }, set: function (v) {

            sld.RangeSilder.min = v;
        }
    });

    Object.defineProperty(sld, "Step", {
        get: function () {
            return sld.RangeSilder.step;
        }, set: function (v) {

            sld.RangeSilder.step = v;
        }
    });

    sld.OnValueChanged = function () {

        if (sld.dataBindings != undefined && sld.dataContext != undefined) {

            var cmdline = "sld.dataContext." + sld.dataBindings.Path + "=sld.RangeSilder.value ;";
            eval(cmdline);


        }

        if (sld.FormContext != null && sld.dataProperty != "")
            sld.FormContext[sld.dataProperty] = sld.RangeSilder.value;

        if (sld.ValueChanged != undefined && sld.value != sld.RangeSilder.value) {
            if (sld.ValueChanged.GetType != undefined && sld.ValueChanged.GetType() == "Command") {
                sld.ValueChanged.Sender = sld;
                sld.ValueChanged.Execute();

            }
            else
                sld.ValueChanged(sld);
        }


    }

    sld.ValueChanged = function (c, v) { }


    sld.SetValue = function (v) {
        sld.RangeSilder.value = v;
    }

    sld.GetValue = function () {
        return sld.RangeSilder.value;
    }

    sld.OnCreateHandle();
    return sld;
}

//进度条
DBFX.Web.Controls.ProgressBar = function () {
    var pb = new DBFX.Web.Controls.Control("ProgressBar");
    pb.ClassDescriptor.Serializer = "DBFX.Serializer.ProgressBarSerializer";
    pb.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.ProgressBarDesigner");
    pb.VisualElement = document.createElement("div");

    pb.OnCreateHandle();
    pb.VisualElement.className = "ProgressBar";

    pb.OnCreateHandle = function () {
        pb.VisualElement.innerHTML = "<div class='Progress'></div>";
        pb.Progress = pb.VisualElement.querySelector("div.Progress");
        pb.ClientDiv = pb.VisualElement;
        // pb.Progress.onchange = pb.OnValueChanged;
    }

    pb.value = 0;
    pb.SetValue = function (v) {
        pb.value = v;
        pb.Progress.style.width = (pb.value / pb.max * 100 ? pb.value / pb.max * 100 : 0) + "%";
        // pb.Progress.style.width = "120px";
        pb.OnValueChanged();
    }

    pb.GetValue = function () {
        return pb.value;
    }

    pb.SetColor = function (v) {
        pb.Progress.style.backgroundColor = v;
    }

    pb.max = 100;
    Object.defineProperty(pb, "Max", {
        get: function () {
            return pb.max;
        },
        set: function (v) {
            pb.max = v;
            pb.Value = pb.value;
        }
    });

    pb.OnValueChanged = function () {

        if (pb.dataBindings != undefined && pb.dataContext != undefined) {

            var cmdline = "pb.dataContext." + pb.dataBindings.Path + "=pb.value;";
            eval(cmdline);

        }


        if (pb.dataDomain != undefined && pb.dataDomain != "") {

            var ddv = pb.FormContext[pb.dataDomain];
            if (ddv == undefined)
                pb.FormContext[pb.dataDomain] = new DBFX.DataDomain();

            pb.FormContext[pb.dataDomain][pb.dataProperty] = pb.value;

        }
        else {
            pb.FormContext[pb.dataProperty] = pb.value;
        }


        if (pb.ValueChanged != undefined) {
            if (pb.ValueChanged.GetType != undefined && pb.ValueChanged.GetType() == "Command") {
                pb.ValueChanged.Sender = pb;
                pb.ValueChanged.Execute();
            }
            else
                pb.ValueChanged(pb);
        }

    }

    pb.OnCreateHandle();
    return pb;
}
DBFX.Serializer.ProgressBarSerializer = function () {
    //反系列化
    this.DeSerialize = function (c, xe, ns) {

        DBFX.Serializer.DeSerialProperty("Value", c, xe);
        DBFX.Serializer.DeSerialProperty("Max", c, xe);

    }

    //系列化
    this.Serialize = function (c, xe, ns) {
        DBFX.Serializer.SerialProperty("Value", c.Value, xe);
        DBFX.Serializer.SerialProperty("Max", c.Max, xe);

    }

}
DBFX.Design.ControlDesigners.ProgressBarDesigner = function () {
    var obdc = new DBFX.Web.Controls.GroupPanel();
    obdc.OnCreateHandle();
    obdc.OnCreateHandle = function () {

        DBFX.Resources.LoadResource("design/DesignerTemplates/FormDesignerTemplates/ProgressBarDesigner.scrp", function (od) {

            od.DataContext = obdc.dataContext;
            // od.EventListBox = od.FormContext.Form.FormControls.EventListBox;
            // od.EventListBox.ItemSource = [{ EventName: "Click", EventCode: undefined, Command: od.dataContext.Click, Control: od.dataContext }];

        }, obdc);

    }

    //20191014  实现数据绑定方法
    obdc.BaseDataBind = obdc.DataBind;
    obdc.DataBind = function (v) {
        if (obdc.dataContext.DataBindings == undefined)
            obdc.dataContext.DataBindings = { Path: "", Format: "", Mode: "TwoWay" };

        obdc.BaseDataBind(v);
    }

    obdc.DataContextChanged = function (e) {

        obdc.DataBind(e);

        // if (obdc.EventListBox != undefined)
        // obdc.EventListBox.ItemSource = [{ EventName: "Click", EventCode: undefined, Command: obdc.dataContext.Click, Control: obdc.dataContext }];

    }

    obdc.HorizonScrollbar = "hidden";
    obdc.OnCreateHandle();
    obdc.Class = "VDE_Design_ObjectGeneralDesigner";
    obdc.Text = "进度条设置";
    return obdc;
}

//复选项
DBFX.Web.Controls.CheckedBox = function (v, t, mg) {
    var chk = new DBFX.Web.Controls.Control("CheckedBox");
    chk.ClassDescriptor.Serializer = "DBFX.Serializer.CheckedBoxSerializer";
    chk.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.InputControlDesigner");
    chk.VisualElement = document.createElement("DIV");
    chk.OnCreateHandle();
    chk.VisualElement.className = "CheckedBox";
    chk.OnCreateHandle = function () {
        chk.VisualElement.innerHTML = "<div class='CheckBoxContainer'><INPUT type=\"checkbox\" class=\"CheckedBoxInput\" /><SPAN class=\"CheckedBoxLabel\"></SPAN></div>";
        chk.ClientDiv = chk.VisualElement;
        chk.CheckBox = chk.VisualElement.querySelector("INPUT.CheckedBoxInput");
        chk.CheckBox.checked = v;
        chk.Label = chk.VisualElement.querySelector("SPAN.CheckedBoxLabel");
        if (t == undefined)
            t = "";

        chk.Label.textContent = t;
        if (mg != undefined)
            chk.Margin = mg;

        chk.CheckBox.onclick = function (e) {

        }

        //chk.CheckBox.onchange = chk.OnValueChanged;
        chk.Click = function (e) {

            if (chk.enabled != false) {

                if (e.srcElement != chk.CheckBox)
                    chk.CheckBox.checked = !chk.CheckBox.checked;

                chk.OnValueChanged(e);
            }

        }

        chk.CheckBox.onpointerdown = function (e) {

            if (chk.enabled == false) {

                chk.CheckBox.disabled = "disabled";
            }
            else {
                chk.CheckBox.disabled = "";
            }

        }
    }

    chk.SetAccessKey = function (v) {
        chk.CheckBox.accessKey = v;
    }


    chk.SetTabIndex = function (v) {
        chk.CheckBox.tabIndex = v;
    }

    chk.OnValueChanged = function (e) {


        if (chk.dataBindings != undefined && chk.dataContext != undefined) {

            var cmdline = "chk.dataContext." + chk.dataBindings.Path + "=chk.CheckBox.checked;";
            eval(cmdline);
        }

        if (chk.dataDomain != undefined && chk.dataDomain != "") {

            var ddv = chk.FormContext[chk.dataDomain];
            if (ddv == undefined)
                chk.FormContext[chk.dataDomain] = new DBFX.DataDomain();

            chk.FormContext[chk.dataDomain][chk.dataProperty] = chk.CheckBox.checked;

        }
        else {
            chk.FormContext[chk.dataProperty] = chk.CheckBox.checked;
        }


        if (chk.ValueChanged != undefined) {

            if (chk.ValueChanged.GetType != undefined && chk.ValueChanged.GetType() == "Command") {
                chk.ValueChanged.Sender = chk;
                chk.ValueChanged.Execute();

            }
            else
                chk.ValueChanged(chk);
        }

        chk.value = chk.CheckBox.checked;

    }


    chk.OnClick = function (e) {


        if (chk.Command != undefined && chk.Command != null && chk.enabled != false) {
            chk.Command.Sender = chk;
            chk.Command.Execute();
        }
    }

    chk.value = true;

    chk.SetValue = function (v) {
        if (v == "true" || v == true)
            v = true;
        else
            v = false;

        chk.CheckBox.checked = v;
        chk.value = v;

        //Fixme:是否应该赋值时 发生值改变执行事件
        if(chk.value != v) {
            // chk.value = v;
            // chk.OnValueChanged();
        }

        if (chk.FormContext != null && chk.dataProperty != "")
            chk.FormContext[chk.dataProperty] = chk.CheckBox.checked;
    }

    chk.GetValue = function () {
        return chk.CheckBox.checked;
    }

    chk.SetContent = function (v) {
        if (v == undefined)
            v = "";

        chk.Label.textContent = v;
    }

    chk.GetContent = function () {
        return chk.Label.innerText;
    }

    chk.SetText = function (v) {

        if (v == undefined)
            v = "";

        chk.Label.textContent = v;
    }

    chk.GetText = function () {
        return chk.Label.innerText;
    }

    chk.BaseSetEnabled = chk.SetEnabled;
    chk.SetEnabled = function (v) {
        chk.BaseSetEnabled();
        if (v == false || v == "false") {
            chk.CheckBox.disabled = "disabled";
            chk.ReadOnly = true;
        }
        else {
            chk.CheckBox.disabled = "";
            chk.ReadOnly = false;
        }
    }


    chk.OnCreateHandle();

    return chk;

}
DBFX.Serializer.CheckedBoxSerializer = function () {

    //反系列化
    this.DeSerialize = function (c, xe, ns) {


        DBFX.Serializer.DeSerialProperty("ValueChangedCommand", c, xe);
        c.ValueChanged = DBFX.Serializer.CommandNameToCmd(c.ValueChangedCommand);
        DBFX.Serializer.DeSerializeCommand("ValueChanged", xe, c);

    }


    //系列化
    this.Serialize = function (c, xe, ns) {

        var xdoc = xe.ownerDocument;
        DBFX.Serializer.SerializeCommand("ValueChanged", c.ValueChanged, xe);

    }


}

//单选项
DBFX.Web.Controls.RadioButtonList = function (v, list) {
    var rbt = new DBFX.Web.Controls.Control("RadioButtonList");
    rbt.ClassDescriptor.DisplayName = "单选列表控件";
    rbt.ClassDescriptor.Description = "为UIRadioButtonList提供基础实现";
    rbt.ClassDescriptor.Serializer = "DBFX.Serializer.RadioButtonListBoxSerializer";

    //20190806
    rbt.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.RadioButtonListDesigner");
    rbt.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.ListBoxDesigner");
    // rbt.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.InputControlDesigner");

    rbt.VisualElement = document.createElement("DIV");
    rbt.OnCreateHandle();
    rbt.VisualElement.className = "RadioButtonList";
    rbt.Items = Array();
    rbt.OnCreateHandle = function () {

        rbt.ClientDiv = rbt.VisualElement;
        if (list != undefined && list != null) {

            var items = null;
            var li = "items=" + list + ";";
            eval(li);

            for (var item in items) {
                rbt.AddItem(items[item]["k"], items[item]["v"]);
            }

        }

        rbt.groupName = "Group_" + DBFX.GetUniqueNumber();

    }

    //数据源
    Object.defineProperty(rbt, "ItemSource", {
        get: function () {
            return rbt.itemSource;
        },
        set: function (v) {

            rbt.itemSource = v;
            rbt.CreateRadioButtonList();
        }
    });

    rbt.displayMember = "Text";
    //数据源
    Object.defineProperty(rbt, "DisplayMember", {
        get: function () {
            return rbt.displayMember;
        },
        set: function (v) {

            rbt.displayMember = v;

        }
    });


    //数据源
    rbt.valueMember = "Value";
    Object.defineProperty(rbt, "ValueMember", {
        get: function () {
            return rbt.valueMember;
        },
        set: function (v) {

            rbt.valueMember = v;

        }
    });


    Object.defineProperty(rbt, "ItemSourceMember", {
        get: function () {
            return rbt.itemSourceMember;
        },
        set: function (v) {

            rbt.itemSourceMember = v;
        }
    });

    //数据绑定
    rbt.BaseDataBind = rbt.DataBind;
    rbt.DataBind = function (v) {

        if (rbt.dataContext != undefined && rbt.itemSourceMember != undefined && rbt.itemSourceMember != "") {

            try {
                var isource = eval("rbt.dataContext." + rbt.itemSourceMember);
                if (Array.isArray(isource))
                    rbt.ItemSource = isource;
            }
            catch (ex) { }
        }
        //绑定数据
        rbt.BaseDataBind(v);
    }

    //创建单选按钮列表
    rbt.CreateRadioButtonList = function () {

        for (var i = rbt.VisualElement.childNodes.length - 1; i >= 0; i--) {

            var e = rbt.VisualElement.childNodes[i];
            if (e.tagName.toLowerCase() == "rbt")
                rbt.VisualElement.removeChild(e);

        }

        if (Array.isArray(rbt.itemSource)) {

            rbt.itemSource.forEach(function (item) {

                if (typeof item == "string") {

                    var iobj = {};
                    iobj[rbt.displayMember] = item;
                    iobj[rbt.valueMember] = item;
                    item = iobj;
                }

                rbt.AddItem(item[rbt.displayMember], item[rbt.valueMember]);

            });

        }

        if (rbt.intValue != undefined) {

            var ie = rbt.FindItem(rbt.intValue)
            if (ie != undefined) {
                ie.RadioButton.checked = true;
            }
        }

    }

    rbt.AddItem = function (t, v) {

        var ie = document.createElement("RBT");
        ie.Text = t;
        ie.className = "RadioButtonItem";
        ie.innerHTML = "<INPUT type=\"radio\" class=\"RadioButton\" /><SPAN class=\"RadioButtonLabel\">" + t + "</SPAN>";
        ie.children[0].name = rbt.groupName;
        ie.children[0].value = v;
        ie.children[0].ItemElement = ie;
        ie.vaue = v;
        ie.children[0].onchange = function (e)
        {
            rbt.Value = e.srcElement.ItemElement.vaue;

        }
        ie.RadioButton = ie.children[0];
        rbt.VisualElement.appendChild(ie);
        rbt.Items.Add(ie);

    }

    rbt.OnValueChanged = function () {


        if (rbt.dataBindings != undefined && rbt.dataContext != undefined) {

            var cmdline = "rbt.dataContext." + rbt.dataBindings.Path + "= rbt.value;";
            eval(cmdline);

        }

        rbt.RegisterFormContext();

    }


    rbt.RegisterFormContext = function () {

        if (rbt.FormContext != null && rbt.dataProperty != "" && rbt.dataProperty != undefined) {
            if (rbt.dataDomain != undefined && rbt.dataDomain != "") {

                var ddv = rbt.FormContext[rbt.dataDomain];
                if (ddv == undefined)
                    rbt.FormContext[rbt.dataDomain] = new DBFX.DataDomain();

                rbt.FormContext[rbt.dataDomain][rbt.dataProperty] = rbt.value;

            }
            else {
                rbt.FormContext[rbt.dataProperty] = rbt.value;
            }
        }

        if (rbt.ValueChanged != undefined && rbt.value != "") {
            if (rbt.ValueChanged.GetType != undefined && rbt.ValueChanged.GetType() == "Command") {
                rbt.ValueChanged.Sender = rbt;
                rbt.ValueChanged.Execute();

            }
            else
                if (typeof rbt.ValueChanged == "function")
                    rbt.ValueChanged(v, rbt);
        }


    }

    rbt.FindItem = function (v) {

        if (!Array.isArray(rbt.Items))
            return;

        var item = undefined;
        for (var i = 0; i < rbt.Items.length; i++) {
            var ie = rbt.Items[i];

            if (ie.RadioButton.value == v || ie.Text == v) {
                item = ie;
                rbt.text = ie.Text;
                rbt.value = ie.RadioButton.value;
                break;
            }
            else
            {

                //ie.RadioButton.checked = false;
            }
        }

        return item;
    }

    //209190805
    rbt.selectedValue = null;
    Object.defineProperty(rbt, "SelectedValue", {
        get: function () {
            return rbt.selectedValue;
        },
        set: function (v) {
            rbt.selectedValue = v;

            rbt.SetValue(v);
        }
    });


    rbt.intValue = undefined;
    rbt.value = "";
    rbt.SetValue = function (v) {
        var ov = rbt.value;
        if (rbt.intValue != v) {
            rbt.intValue = v;
        }
        var ie = rbt.FindItem(v);
        if (ov == v || ie == undefined) return;
        if (ie != undefined) {
            ie.RadioButton.checked = true;
            rbt.intValue = null;
        }
        if (ov != v) {
            rbt.value = v;
            rbt.OnValueChanged();
        }

    }

    rbt.GetValue = function () {
        return rbt.value;
    }


    rbt.text = undefined;
    //20190809  添加GetText方法
    rbt.GetText = function () {
        return rbt.text;
    }


    rbt.OnCreateHandle();
    return rbt;

}

//设计程序
DBFX.Design.ControlDesigners.RadioButtonListDesigner = function () {

    var obdc = new DBFX.Web.Controls.GroupPanel();
    obdc.OnCreateHandle();
    obdc.OnCreateHandle = function () {

        DBFX.Resources.LoadResource("design/DesignerTemplates/FormDesignerTemplates/RadioButtonListDesigner.scrp", function (od) {

            od.DataDomainBox = od.FormContext.Form.FormControls.cbxDataDomain;
            od.DataDomainBox.LostFocus = function () {
                var ddkey = od.DataDomainBox.SelectedText;
                od.dataContext.DataDomain = ddkey;
                od.DataDomainBox.Value = ddkey;
                od.Initialize();
                od.DataDomainBox.Value = ddkey;
            }


            //设计器中绑定事件处理
            od.EventListBox = od.FormContext.Form.FormControls.EventListBox;
            od.EventListBox.ItemSource = [{ EventName: "ValueChanged", EventCode: undefined, Command: od.dataContext.ValueChanged, Control: od.dataContext }];
            obdc.Initialize();
            od.DataContext = obdc.dataContext;
        }, obdc);
    }

    obdc.BaseDataBind = obdc.DataBind;
    obdc.DataBind = function (v) {
        if (obdc.dataContext.DataBindings == undefined)
            obdc.dataContext.DataBindings = { Path: "", Format: "", Mode: "TwoWay" };
        if (obdc.dataContext != undefined && obdc.DataDomainBox != undefined)
            obdc.Initialize();
        if (obdc.EventListBox != undefined) {
            obdc.EventListBox.ItemSource = [{ EventName: "ValueChanged", EventCode: undefined, Command: obdc.dataContext.ValueChanged, Control: obdc.dataContext }];
        }

        obdc.BaseDataBind(v);
    }

    //事件处理程序
    // obdc.DataContextChanged = function (e) {
    //     obdc.DataBind(e);
    //     if (obdc.EventListBox != undefined) {
    //         obdc.EventListBox.ItemSource = [{ EventName: "ValueChanged", EventCode: undefined, Command: obdc.dataContext.ValueChanged, Control: obdc.dataContext }];
    //     }
    // }

    obdc.Initialize = function () {

        if (obdc.dataContext.DataBindings == undefined)
            obdc.dataContext.DataBindings = { Path: "", Format: "", Mode: "TwoWay" };

        var items = [{ Text: "无", Value: undefined }];
        for (var key in obdc.dataContext.FormContext) {

            if (key.toLowerCase() == "form")
                continue;

            var ddv = obdc.dataContext.FormContext[key];
            if (typeof ddv == "object" && ddv.GetType() == "DataDomain") {

                var idx = 0;
                for (var k in ddv) {
                    if (Object.prototype[k] != undefined || k == "undefined")
                        continue;

                    idx++;

                }

                //判断是否有属性在此数据域下方
                if (idx > 0)
                    items.push({ Text: key, Value: key });
                else {
                    if (key != "")
                        eval("delete obdc.dataContext.FormContext." + key + ";");
                }
            }
        }

        obdc.DataDomainBox.ItemSource = items;

    }
    obdc.HorizonScrollbar = "hidden";
    obdc.OnCreateHandle();
    obdc.Class = "VDE_Design_ObjectGeneralDesigner";
    obdc.Text = "单选列表设置";
    return obdc;
}

//下拉列表控件
DBFX.Web.Controls.ComboBox = function (v, list) {

    var cbx = new DBFX.Web.Controls.Control("ComboBox");
    cbx.ClassDescriptor.DisplayName = "UI基础控件";
    cbx.ClassDescriptor.Description = "为UI提供基础实现";
    cbx.ClassDescriptor.Serializer = "DBFX.Serializer.ComboBoxSerializer";
    cbx.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.ListBoxDesigner");
    cbx.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.InputControlDesigner");
    cbx.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.ComboBoxDesigner");
    cbx.OnCreateHandle();
    cbx.TextBox = null;
    cbx.SearchButton = null;
    cbx.VisualElement.className = "ComboBox";
    cbx.OnCreateHandle = function () {
        cbx.VisualElement.innerHTML = "<div class='ComboBox_Container' style='width: 100%;height: 100%;position: relative'><TABLE class=\"ComboBoxTable\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><TR><TD style=\"width:1px;\"><IMG class=\"ComboBoxIcon\" src=\"\" /></TD><TD ><INPUT class=\"ComboBoxTextBox\" type=\"text\" /></TD><TD style=\"width:1px;\"><BUTTON class=\"ComboBoxSearchBtn\"><IMG src=\"dbfxui/images/Dropdown.png\" class=\"ComboButtonImage\" /></BUTTON></TD></TR></TABLE><DIV class=\"TextBoxTip\"></DIV>" +
          "<img class='ComboBox_ErrorImg'>" +
          "</div>";
        cbx.TextBox = cbx.VisualElement.querySelector("INPUT.ComboBoxTextBox");
        cbx.TextBoxTip = cbx.VisualElement.querySelector("DIV.TextBoxTip");
        cbx.TextBoxTip.style.right = "24px";
        cbx.TextBox.readOnly = "true";
        cbx.mode = 0;
        cbx.SearchButton = cbx.VisualElement.querySelector("BUTTON.ComboBoxSearchBtn");
        cbx.ClientDiv = cbx.VisualElement;
        cbx.IconElement = cbx.VisualElement.querySelector("IMG.ComboBoxIcon");
        cbx.IconElement.src = "Themes/" + app.CurrentTheme + "/Images/empty.png";
        cbx.DropDownImage = cbx.VisualElement.querySelector("IMG.ComboButtonImage");
        cbx.DropDownImage.src = "Themes/" + app.CurrentTheme + "/Images/Dropdown.png";

        //验证失败提示
        cbx.ErrImg = cbx.VisualElement.querySelector("img.ComboBox_ErrorImg");
        cbx.ErrImg.src = "Themes/" + app.CurrentTheme + "/Images/error.png";

        cbx.TextBox.onfocus = function (e) {

            cbx.ClientDiv.className = "ComboBoxActived";
            cbx.ShowError(true);

        }
        cbx.TextBox.onblur = function (e) {

            cbx.ClientDiv.className = "ComboBox";
            cbx.FindItem(cbx.TextBox.value);
            cbx.LostFocus(cbx);
            cbx.Validate();

        }
        cbx.SearchButton.onblur = function (e) {

            cbx.ClientDiv.className = "ComboBox";

        }

        cbx.SearchButton.onfocus = function (e) {

            cbx.ClientDiv.className = "ComboBoxActived";
            cbx.ShowError(true);


        }

        cbx.SearchButton.onclick = function (e) {
            e.cancelBubble = true;
            if (cbx.enabled != false)
                cbx.DropDownList();
        }

        cbx.ListBox.MenuItemClick = function (item) {

            cbx.SelectedItem = item;


        }

        cbx.ListBox.MenuPadClosed = function (menu) {

            cbx.TextBox.focus();

        }

        cbx.TextBox.onchange = cbx.OnValueChanged;
    }

    cbx.SetAccessKey = function (v) {
        cbx.TextBox.accessKey = v;
    }

    cbx.SetTabIndex = function (v) {

        cbx.SearchButton.tabIndex = v;
    }

    cbx.SelectedItemChanged = function (c, item) { }

    cbx.SelectedValueChanged = function (c, v) { }

    cbx.SelectedTextChanged = function (c, v) { }

    cbx.SetColor = function (v) {
        cbx.TextBox.style.color = v;
    }


    cbx.SetFontFamily = function (v) {
        cbx.TextBox.style.fontFamily = v;
        cbx.SearchButton.style.fontFamily = v;
    }

    cbx.SetFontSize = function (v) {
        cbx.TextBox.style.fontSize = v;
        cbx.SearchButton.style.fontSize = v;
    }

    cbx.SetFontStyle = function (v) {
        cbx.TextBox.style.fontStyle = v;
        cbx.TextBox.style.fontWeight = v;
        cbx.SearchButton.style.fontStyle = v;
        cbx.SearchButton.style.fontWeight = v;
    }

    cbx.LostFocus = function () { }

    cbx.SetAlign = function (v) {
        cbx.TextBox.style.textAlign = v;

        var align = 'flex-start';
        switch (v) {
            case "right":
                align = 'flex-end';
                break;
            case 'center':
                align = 'center';
                break;
            case 'left':
            default:
                align = 'flex-start';
                break;
        }
        cbx.TextBoxTip.style.alignItems = align;
    }

    cbx.OnValueChanged = function () {

        if (cbx.dataBindings != undefined && cbx.dataContext != undefined) {

            var cmdline = "cbx.dataContext." + cbx.dataBindings.Path + "=cbx.selectedValue;";
            eval(cmdline);
        }


        cbx.RegisterFormContext();

        cbx.SelectedValueChanged(cbx, cbx.selectedValue);

        if (cbx.ValueChanged != undefined && cbx.ValueChanged.GetType() == "Command") {

            cbx.ValueChanged.Sender = cbx;
            cbx.ValueChanged.Execute();
        }
        else
        if (cbx.ValueChanged != undefined && typeof cbx.ValueChanged == "function") {

            cbx.ValueChanged(cbx.selectedValue, cbx);
        }

    }

    cbx.RegisterFormContext = function () {

        if (cbx.FormContext != null && cbx.dataProperty != "" && cbx.dataProperty != undefined) {
            if (cbx.dataDomain != undefined && cbx.dataDomain != "") {

                var ddv = cbx.FormContext[cbx.dataDomain];
                if (ddv == undefined)
                    cbx.FormContext[cbx.dataDomain] = new DBFX.DataDomain();

                cbx.FormContext[cbx.dataDomain][cbx.dataProperty] = cbx.selectedValue;

                cbx.FormContext[cbx.dataDomain][cbx.dataProperty + "_Text"] = cbx.selectedText;

            }
            else {
                cbx.FormContext[cbx.dataProperty] = cbx.selectedValue;
                cbx.FormContext[cbx.dataProperty + "_Text"] = cbx.selectedText;
            }
        }




    }


    //定义验证规则属性
    Object.defineProperty(cbx, "CheckRule", {
        get: function () {
            return cbx.checkRule;

        },
        set: function (v) {
            cbx.checkRule = v;
            if (v != null && v != undefined) {
                cbx.TextBoxTip.style.color = "red";
            }
        }
    });


    //验证数据是否合法
    cbx.Validate = function () {
        var that = cbx;
        if(that.Display == 'none' || that.Visibled == false || that.Enabled == false){
            return true;
        }
        var r = true;
        try {

            if (cbx.checkRule != undefined) {

                var crule = cbx.checkRule.replace("this.Value", "this.SelectedIndex>=0").replace("ICD", "this.selectedValue && this.selectedValue.length==18").replace("MPhoneID", "this.selectedValue && this.selectedValue.length==11").replace("Length", "this.SelectedText.length");
                var s = "";
                crule = "(" + crule + ")";
                r = eval(crule);
            }

        } catch (ex) {

            r = false;

        }
        cbx.ShowError(r);
        var control = cbx;
        if(control.FormContext && control.FormContext.Form){
            if(control.FormContext.Form.First_Not_Pass_Validation_Control == undefined && r == false){
                control.FormContext.Form.First_Not_Pass_Validation_Control = control;
            }
            if(r == true && control.FormContext.Form.First_Not_Pass_Validation_Control == control){
                control.FormContext.Form.First_Not_Pass_Validation_Control = undefined;
            }
        }
        return r;

    }

    cbx.ShowError = function (flag) {

        if (flag == false) {
            cbx.TextBoxTip.style.color = "red";
            cbx.ErrImg.style.right = '20px';
        } else {
            cbx.TextBoxTip.style.color = "";
            cbx.ErrImg.style.right = '-20px';
            //cbx.TextBoxTip.style.visibility = "visible";
        }
    }

    cbx.AddItem = function (t, v, o) {

        var item = new DBFX.Web.Controls.MenuItem(t, "");
        item.Value = v;
        item.DataContext = o;
        cbx.ListBox.AddItem(item);

    }

    cbx.ClearItems = function () {

        cbx.ListBox.ClearItems();

    }

    cbx.displayMember = "Text";
    Object.defineProperty(cbx, "DisplayMember", {
        get: function () {
            return cbx.displayMember;
        },
        set: function (v) {

            cbx.displayMember = v;
        }
    });

    cbx.valueMember = "Value";
    Object.defineProperty(cbx, "ValueMember", {
        get: function () {
            return cbx.valueMember;
        },
        set: function (v) {

            cbx.valueMember = v;
        }
    });


    Object.defineProperty(cbx, "SelectedValue", {
        get: function () {
            return cbx.selectedValue;
        },
        set: function (v) {
            cbx.selectedValue = v;
            cbx.ReSetValue(v);
        }

    });

    cbx.ReSetValue = function (v) {

        var ti = cbx.FindItem(v);
        if (ti !== undefined && ti != null) {
            cbx.ListBox.MenuItemClick(ti);
        }

    }

    Object.defineProperty(cbx, "SelectedIndex", {
        get: function () {
            return cbx.selectedIndex;
        },
        set: function (v) {
            cbx.selectedIndex = v;
            if (cbx.itemSource != undefined && cbx.itemSource.length > v) {
                var ti = cbx.FindItem(cbx.itemSource[v]);
                if (ti != null)
                    cbx.ListBox.MenuItemClick(ti);
            }
        }

    });

    //下拉选文本框是否可以输入
    Object.defineProperty(cbx, "Mode", {
        get: function () {
            return cbx.mode;
        },
        set: function (v) {
            cbx.mode = v;
            if (v == "0")
                cbx.TextBox.readOnly = "true";
            else
                cbx.TextBox.readOnly = "";

        }
    });


    //2021-10-19 下拉选项 弹出方式 default-默认为控件附近；bottom-底部弹出
    cbx.showMode = 'default';
    Object.defineProperty(cbx, "ShowMode", {
        get: function () {
            return cbx.showMode;
        },
        set: function (v) {
            cbx.showMode = v;
        }
    });

    cbx.FindItem = function (item) {

        var ti = undefined;
        if (!Array.isArray(cbx.ListBox.Items)) {
            cbx.selectedItem = undefined;
            cbx.selectedValue = undefined;
            cbx.selectedText = "";
            cbx.SetText("");
            return null;
        }

        for (var i = 0; i < cbx.ListBox.Items.length; i++) {

            var titem = cbx.ListBox.Items[i];
            if (titem.Text == item || titem.Value == item || titem.dataContext == item) {

                ti = titem;

                break;

            }

        }

        if (ti == undefined) {

            cbx.selectedItem = undefined;
            cbx.selectedValue = undefined;
            cbx.selectedText = item;

        }

        return ti;
    }

    Object.defineProperty(cbx, "SelectedText", {
        get: function () {
            return cbx.selectedText;
        },
        set: function (v) {
            cbx.selectedText = v;
            cbx.ReSetValue(v);
        }

    });


    Object.defineProperty(cbx, "SelectedItem", {
        get: function () {
            return cbx.selectedItem;
        },
        set: function (v) {

            if (v != undefined ) {
                cbx.TextBoxTip.style.visibility = "hidden";
                cbx.TextBox.value = v.Text;
                if(cbx.selectedItem != v){
                    cbx.selectedItem = v;
                    cbx.selectedText = v.Text;
                    cbx.selectedValue = v.Value;
                    cbx.selectedIndex = cbx.itemSource.indexOf(v.dataContext);
                    //值改变
                    cbx.OnValueChanged();
                    //选定项目改变
                    cbx.SelectedItemChanged(cbx, v);
                }

            }
            else {

                cbx.TextBoxTip.style.visibility = "visible";
            }

        }

    });

    Object.defineProperty(cbx, "TipText", {
        get: function () {
            return cbx.tipText;
        },
        set: function (v) {
            cbx.SetTipText(v);
            cbx.tipText = v;
        }
    });
    cbx.SetTipText = function (v) {

        // cbx.TextBox.setAttribute('placeholder',v);
        if (v != null && v != undefined && v != "") {

            cbx.TextBoxTip.innerText = v;
            cbx.TextBoxTip.style.visibility = "visible";

        }
        else {
            cbx.TextBoxTip.innerText = "";
            cbx.TextBoxTip.style.visibility = "hidden";
        }
    }

    cbx.selectedValue = null;
    cbx.selectedItem = null;
    cbx.selectedText = "";

    cbx.Click = function () {
        if (cbx.TextBox.readOnly && cbx.enabled != false)
            cbx.DropDownList();
    }

    cbx.ListBox = new DBFX.Web.Controls.PopupMenu();

    cbx.DropDownList = function () {

        var pt = new Object();
        var rc = cbx.ClientDiv.getBoundingClientRect();
        pt.x = rc.left;
        pt.y = rc.bottom + 1;
        pt.w = rc.width - 6;
        pt.t = rc.top - 2;
        cbx.ListBox.IsComboBoxPopup = 1;
        if(cbx.showMode == 'bottom'){
            cbx.ListBox.ShowMenuWithCSSClass('ComboBox_ShowFromBottom');
        }else {
            cbx.ListBox.ShowMenuAtPoint(pt);

        }
    }

    cbx.SetIconUrl = function (v, w, h) {

        if (v != null && v != undefined) {
            v = v.replace("%currenttheme%", app.CurrentTheme);

            cbx.IconElement.src = v;
        }
        if (w != undefined && h != undefined) {
            cbx.IconElement.style.width = w;
            cbx.IconElement.style.height = h;
            cbx.TextBox.style.top = "-2px";
            var rc = cbx.VisualElement.getBoundingClientRect();

        }

        if (v != undefined && v != "" && v != null) {

            cbx.IconElement.style.display = "";
            cbx.TextBoxTip.style.left = "24px";
        }
        else
            cbx.IconElement.style.display = "none";
    }


    Object.defineProperty(cbx, "ItemSource", {
        get: function () {
            return cbx.itemSource;
        },
        set: function (v) {
            cbx.itemSource = v;
            cbx.ReArray();
        }
    });

    //20200716
    Object.defineProperty(cbx, "ItemSourceMember", {
        get: function () {
            return cbx.itemSourceMember;
        },
        set: function (v) {

            cbx.itemSourceMember = v;
        }
    });

    cbx.BaseDataBind = cbx.DataBind;
    cbx.DataBind = function (v) {

        if (cbx.dataContext != undefined && cbx.itemSourceMember != undefined && cbx.itemSourceMember != "") {

            var isource = eval("cbx.dataContext." + cbx.itemSourceMember);
            if (Array.isArray(isource))
                cbx.ItemSource = isource;

        }

        cbx.BaseDataBind(v);

    }

    //重新排列集合
    cbx.ReArray = function () {

        cbx.ListBox.ClearItems();

        if (cbx.itemSource == undefined || cbx.itemSource == null) {

            return;
        }

        if (Array.isArray(cbx.itemSource)) {

            for (var i = 0; i < cbx.itemSource.length; i++) {

                var o = cbx.itemSource[i];
                cbx.AddItem(o[cbx.displayMember], o[cbx.valueMember], o);

            }
        }
        else {

            for (var p in cbx.itemSource) {

                cbx.AddItem(p, cbx.itemSource[p], cbx.itemSource);

            }

        }

        if (cbx.initValue != undefined) {
            var ti = cbx.FindItem(cbx.initValue);
            cbx.initValue = undefined;
            if (ti !== undefined && ti != null) {
                cbx.ListBox.MenuItemClick(ti);
            }
            else {

                if (cbx.ListBox.Items.length > 0)
                    cbx.ListBox.MenuItemClick(cbx.ListBox.Items[0]);
            }
        }

    }

    cbx.initValue = undefined;
    cbx.SetValue = function (v) {
        cbx.ShowError(true);
        cbx.initValue = v;

        if (v != undefined)
            cbx.TextBox.value = v;

        var ti = cbx.FindItem(v);
        if (ti !== undefined && ti != null) {
            cbx.ListBox.MenuItemClick(ti);
        }

        if (cbx.TextBox.value == "" || cbx.TextBox.value == undefined) {
            cbx.TextBoxTip.style.visibility = "visible";
        }
        else {

            cbx.TextBoxTip.style.visibility = "hidden";
        }

    }

    cbx.GetValue = function () {

        return cbx.selectedValue;
    }

    cbx.SetText = function (v) {
        cbx.ShowError(true);
        cbx.TextBox.value = v;

        if (cbx.TextBox.value == "" || cbx.TextBox.value == undefined) {
            cbx.TextBoxTip.style.visibility = "visible";
        }
        else {

            cbx.TextBoxTip.style.visibility = "hidden";
        }


    }

    cbx.GetText = function () {
        return cbx.TextBox.value;
    }

    cbx.OnCreateHandle();
    return cbx;

}

DBFX.Design.ControlDesigners.ComboBoxDesigner = function () {
    var obdc = new DBFX.Web.Controls.GroupPanel();
    obdc.OnCreateHandle();
    obdc.OnCreateHandle = function () {

        DBFX.Resources.LoadResource("design/DesignerTemplates/FormDesignerTemplates/ComboBoxDesigner.scrp", function (od) {
            od.DataContext = obdc.dataContext;
        }, obdc);
    }

    obdc.DataContextChanged = function (e) {
        obdc.DataBind(e);
    }

    obdc.HorizonScrollbar = "hidden";
    obdc.OnCreateHandle();
    obdc.Class = "VDE_Design_ObjectGeneralDesigner";
    obdc.Text = "下拉列表设置";
    return obdc;
}


///图片
DBFX.Web.Controls.Image = function (v, w, h) {
    var img = new DBFX.Web.Controls.Control("Image");
    img.ClassDescriptor.Serializer = "DBFX.Serializer.ImageSerializer";
    img.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.ImageSelectedDesigner");
    img.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.BaseBindingDesigner");
    img.VisualElement = document.createElement("DIV");
    img.OnCreateHandle();
    img.VisualElement.className = "ImageControl";
    img.OnCreateHandle = function () {

        img.VisualElement.innerHTML = "<IMG src=\"\" class=\"Image\" />";
        img.Image = img.VisualElement.querySelector("IMG");
        img.ClientDiv = this.VisualElement;
        if (v != undefined)
            img.ImageUrl = v;

        if (w != undefined)
            img.Width = w;

        if (h != undefined)
            img.Height = h;

        img.Image.onclick = img.ImgClick;

        img.Image.onmousedown = img.ImgMouseDown;
        //FIXME:
        img.Image.ontouchstart = img.ImgTouchStart;

    }

    //
    img.ImgMouseMove = function (e) {

        e.cancelBubble = true;
        var ox = event.pageX - img.MP2.x;
        var oy = event.pageY - img.MP2.y;
        var left = (img.MP1.x + ox) + "px";
        var top = (img.MP1.y + oy) + "px";

        img.VisualElement.style.left = left;
        img.VisualElement.style.top = top;

    }

    //FIXME:
    img.ImgTouchStart = function (e) {

        if (img.allowMoving == true) {

            img.MP1.x = img.VisualElement.offsetLeft;
            img.MP1.y = img.VisualElement.offsetTop;

            img.MP2.x = e.touches[0].pageX;
            img.MP2.y = e.touches[0].pageY;

            img.MovingImage(1);

        }
    }

    img.ImgTouchMove = function (e) {
        e.cancelBubble = true;
        // console.log(e.touches[0].pageX);
        var ox = e.touches[0].pageX - img.MP2.x;
        var oy = e.touches[0].pageY - img.MP2.y;
        var left = (img.MP1.x + ox) + "px";
        var top = (img.MP1.y + oy) + "px";

        img.VisualElement.style.left = left;
        img.VisualElement.style.top = top;
    }


    img.ImgMouseUp = function (e) {
        img.MovingImage(0);
    }


    img.MP1 = { x: 0, y: 0 };
    img.MP2 = { x: 0, y: 0 };
    img.ImgMouseDown = function (e) {

        if (img.allowMoving == true) {

            img.MP1.x = img.VisualElement.offsetLeft;
            img.MP1.y = img.VisualElement.offsetTop;

            img.MP2.x = event.pageX;
            img.MP2.y = event.pageY;

            img.MovingImage(1);

        }

    }

    //移动图片
    img.MovingImage = function (flag) {

        if (flag == 1) {

            if (DBFX.Web.Controls.MoveCover == undefined)
                DBFX.Web.Controls.MoveCover = document.createElement("MovingCover");


            document.body.appendChild(DBFX.Web.Controls.MoveCover);
            DBFX.Web.Controls.MoveCover.onmouseup = img.ImgMouseUp;
            DBFX.Web.Controls.MoveCover.onmousemove = img.ImgMouseMove;
            //FIXME:
            DBFX.Web.Controls.MoveCover.ontouchmove = img.ImgTouchMove;
            DBFX.Web.Controls.MoveCover.ontouchend = img.ImgMouseUp;
            DBFX.Web.Controls.MoveCover.ontouchcancel = img.ImgMouseUp;

            img.VisualElement.ontouchmove = img.ImgTouchMove;
            img.VisualElement.ontouchend = img.ImgMouseUp;
            img.VisualElement.ontouchcancel = img.ImgMouseUp;


        }
        else {

            document.body.removeChild(DBFX.Web.Controls.MoveCover);

            DBFX.Web.Controls.MoveCover.onmouseup = undefined;
            DBFX.Web.Controls.MoveCover.onmousemove = undefined;
            //FIXME:
            DBFX.Web.Controls.MoveCover.ontouchmove = undefined;
            DBFX.Web.Controls.MoveCover.ontouchend = undefined;
            DBFX.Web.Controls.MoveCover.ontouchcancel = undefined;

            img.VisualElement.ontouchmove = undefined;
            img.VisualElement.ontouchend = undefined;
            img.VisualElement.ontouchcancel = undefined;

        }

    }

    img.ImgClick = function (e) {

        if (img.allowLIMG == "true" || img.allowLIMG == true) {
            DBFX.Web.Controls.Image.ShowByFullScreen(img.ImageUrl);
            e.cancelBubble = true;
        }

    }

    img.SetValue = function (v) {

        img.ImageUrl = v;
    }
    img.GetValue = function () {

        return img.ImageUrl;
    }

    img.SetWidth = function (v) {

        //img.Image.style.width = v;
        img.VisualElement.style.width = v;

    }
    img.SetHeight = function (v) {
        img.VisualElement.style.height = v;
        //img.Image.style.height = v;

    }

    img.SetDisplay = function (v) {

        img.VisualElement.style.display = v;
        //img.Image.style.display = v;

    }

    img.SetDesignTime = function (v) {

        if (v == true) {

            img.Image.style.border = "1px dotted gray";

            img.Image.style.position = "relative";

        }

    }

    img.imageUrl = "";
    Object.defineProperty(img, "ImageUrl", {
        get: function () {
            return img.imageUrl;
        }, set: function (v) {
            try {

                if (typeof v == "string" && v.indexOf("%") >= 0)
                    v = app.EnvironVariables.ParsingToString(v);

                img.imageUrl = v;

                if (v != null && v != undefined && v != "") {

                    if (v.indexOf(".") >= 0) {
                        img.Image.src = app.EnvironVariables.ParsingToString(v.replace("%currenttheme%", app.CurrentTheme).replace("http://wfs.dbazure.cn", "https://wfs.dbazure.cn"));
                    }else {
                        img.Image.src = v;
                    }
                    img.Image.style.visibility = "";

                }
                else {

                    img.Image.style.visibility = "hidden";

                }

            } catch (ex) { }
        }
    });

    img.allowLIMG = false;
    Object.defineProperty(img, "AllowLIMG", {
        get: function () {
            return img.allowLIMG;
        }, set: function (v) {

            if (v == "true" || v == true)
                v = true;
            else
                v = false;

            img.allowLIMG = v;

        }
    });

    img.allowMoving = false;
    Object.defineProperty(img, "AllowMoving", {
        get: function () {
            return img.allowMoving;
        }, set: function (v) {

            if (v == "true" || v == true)
                v = true;

            else
                v = false;

            img.allowMoving = v;

        }
    });

    Object.defineProperty(img, "ImgPosition", {
        get: function () {
            return { x: img.VisualElement.offsetLeft, y: img.VisualElement.offsetTop };
        }, set: function (v) {

            if (v != undefined && v.x != undefined) {

                img.Top = v.x;
                img.Left = v.y;
            }
        }
    });

    img.SetEnabled = function (v) {
        img.Opacity = 1;
    }

    img.OnCreateHandle();

    return img;

}

//超链接
DBFX.Web.Controls.Hyperlink = function () {

    var hl = new DBFX.Web.Controls.Control("Hyperlink");
    hl.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.HyperlinkDesigner");
    hl.ClassDescriptor.Serializer = "DBFX.Serializer.HyperlinkSerializer";
    hl.VisualElement = document.createElement("div");
    hl.OnCreateHandle();
    hl.OnCreateHandle = function () {

        hl.VisualElement.className = "Hyperlink";
        hl.VisualElement.innerHTML = "<a class='Hyperlink_Link' download=\"\" target=\"_blank\"></a>";
        hl.Link = hl.VisualElement.querySelector("a.Hyperlink_Link");
        hl.Link.onclick = function (e) {
            e.cancelBubble = true;
        }
        hl.Link.onmousedown = function (e) {
            e.cancelBubble = true;
        }
        hl.Link.ontouchstart = function (e) {
            e.cancelBubble = true;
        }
    }

    hl.OnClick = function () {
        hl.Link.click();
    }

    Object.defineProperty(hl, "ShowText", {
        set: function (v) {
            hl.Link.innerText = v;
        },
        get: function () {
            return hl.Link.textContent;
        }
    });

    hl.loadURL = '';
    Object.defineProperty(hl, "LoadURL", {
        set: function (v) {
            hl.Link.href = v;
            hl.loadURL = v;
        },
        get: function () {
            return hl.loadURL;
        }
    });

    hl.OnCreateHandle();
    return hl;
}
DBFX.Serializer.HyperlinkSerializer = function () {
    //系列化
    this.Serialize = function (c, xe, ns) {
        DBFX.Serializer.SerialProperty("ShowText", c.ShowText, xe);
        DBFX.Serializer.SerialProperty("LoadURL", c.LoadURL, xe);
    }

    //反系列化
    this.DeSerialize = function (c, xe, ns) {
        DBFX.Serializer.DeSerialProperty("ShowText", c, xe);
        DBFX.Serializer.DeSerialProperty("LoadURL", c, xe);

    }
}
DBFX.Design.ControlDesigners.HyperlinkDesigner = function () {

    var obdc = new DBFX.Web.Controls.GroupPanel();
    obdc.OnCreateHandle();
    obdc.OnCreateHandle = function () {
        DBFX.Resources.LoadResource("design/DesignerTemplates/FormDesignerTemplates/HyperlinkDesigner.scrp", function (od) {
            od.DataContext = obdc.dataContext;
            //设计器中绑定事件处理

        }, obdc);
    }

    //事件处理程序
    obdc.DataContextChanged = function (e) {
        obdc.DataBind(e);

    }

    obdc.HorizonScrollbar = "hidden";
    obdc.OnCreateHandle();
    obdc.Class = "VDE_Design_ObjectGeneralDesigner";
    obdc.Text = "超链接控件";
    return obdc;
}

//开关选择
DBFX.Web.Controls.Switch = function (callback, tag) {

    var swc = new DBFX.Web.Controls.Control("Switch");
    //20190806
    swc.ClassDescriptor.Serializer = "DBFX.Serializer.SwitchSerializer";
    swc.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.SwitchDesigner");

    swc.CallBack = callback;
    swc.Tag = tag;
    swc.IsInitialize = true;

    //20190806
    swc.VisualElement = document.createElement("div");
    swc.VisualElement.className = "SwitchControl";
    swc.OnClick = function (e) {
        if(!swc.enabled){
            return;
        }

        if (swc.Click != undefined && typeof swc.Click == "function"){
            swc.Click(swc);
            return;
        }

        if (swc.Click != undefined && swc.Click.GetType() == "Command") {
            swc.Click.Sender = swc;
            swc.Click.Execute();
            return;
        }

        swc.Value = swc.value == false || swc.value == undefined ? 1 : 0;

        if (swc.CallBack != null)
            swc.CallBack(swc);
        e.cancelBubble = true;
    }

    swc.OnCreateHandle();
    swc.value = 0;
    swc.OnCreateHandle = function () {

        swc.VisualElement.innerHTML = "<DIV class=\"Switch\" ><DIV class=\"SwitchButton\"></DIV></DIV>";
        swc.ButtonDiv = swc.VisualElement.querySelector("DIV.Switch");
        swc.Button = swc.VisualElement.querySelector("DIV.SwitchButton");
        swc.VisualElement.setAttribute('switchStatus','off');
    }

    swc.OnValueChanged = function () {

        if (swc.dataBindings != undefined && swc.dataContext != undefined) {

            swc.dataContext[swc.dataBindings.Path] = swc.value;
            var cmdline = "swc.dataContext." + swc.dataBindings.Path + "= swc.value;";
            eval(cmdline);
        }

        if (swc.dataDomain != undefined && swc.dataDomain != "") {

            var ddv = swc.FormContext[swc.dataDomain];
            if (ddv == undefined)
                swc.FormContext[swc.dataDomain] = new DBFX.DataDomain();

            swc.FormContext[swc.dataDomain][swc.dataProperty] = swc.value;

        }
        else {
            swc.FormContext[swc.dataProperty] = swc.value;
        }

        //触发执行值改变事件
        if (swc.ValueChanged != undefined) {
            if (swc.ValueChanged.GetType != undefined && swc.ValueChanged.GetType() == "Command") {
                swc.ValueChanged.Sender = swc;
                swc.ValueChanged.Execute();

            }
            else
                swc.ValueChanged(swc);
        }
    }

    swc.SetEnabled = function (v) {
        if (swc.enabled == true) {
            swc.VisualElement.disabled = "";
            swc.VisualElement.style.opacity = "1";
        }
        else {
            swc.VisualElement.disabled = "disabled";
            swc.VisualElement.style.opacity = "0.8";
        }
    }
    //20200605
    swc.SetBorderRadius = function (v) {
        swc.VisualElement.style.borderRadius = v;
        swc.Button.style.borderRadius = v;
    }


    swc.SetValue = function (v) {
        swc.VisualElement.setAttribute('switchStatus',v == 1 ? 'on':'off');
        swc.value = v;
        swc.OnValueChanged();
    }

    swc.activeColor = "#2fb70d";

    //设置背景颜色
    swc.SetBackgroundColor = function (v) {
        // swc.VisualElement.style.backgroundColor = v;
        swc.activeColor = v;
    }

    swc.GetValue = function () {
        return swc.value;
    }


    swc.OnCreateHandle();
    return swc;
}

//序列化
DBFX.Serializer.SwitchSerializer = function () {

    this.Serialize = function (c, xe, ns) {

        DBFX.Serializer.SerializeCommand("ValueChanged", c.ValueChanged, xe);
        DBFX.Serializer.SerializeCommand("Click", c.Click, xe);

    }

    this.DeSerialize = function (c, xe, ns) {

        //20190805
        // DBFX.Serializer.DeSerialProperty("SelectedValue", c, xe);

        DBFX.Serializer.DeSerializeCommand("ValueChanged", xe, c);
        DBFX.Serializer.DeSerializeCommand("Click", xe, c);

    }

}

//设计程序
DBFX.Design.ControlDesigners.SwitchDesigner = function () {

    var obdc = new DBFX.Web.Controls.GroupPanel();
    obdc.OnCreateHandle();
    obdc.OnCreateHandle = function () {
        DBFX.Resources.LoadResource("design/DesignerTemplates/FormDesignerTemplates/SwitchDesigner.scrp", function (od) {

            od.DataContext = obdc.dataContext;

            //设计器中绑定事件处理
            od.EventListBox = od.FormContext.Form.FormControls.EventListBox;
            od.EventListBox.ItemSource = [{ EventName: "ValueChanged", EventCode: undefined, Command: od.dataContext.ValueChanged, Control: od.dataContext },
                { EventName: "Click", EventCode: undefined, Command: od.dataContext.Click, Control: od.dataContext }];

        }, obdc);
    }

    obdc.BaseDataBind = obdc.DataBind;
    obdc.DataBind = function (v) {
        if (obdc.dataContext.DataBindings == undefined)
            obdc.dataContext.DataBindings = { Path: "", Format: "", Mode: "TwoWay" };

        obdc.BaseDataBind(v);
    }

    //事件处理程序
    obdc.DataContextChanged = function (e) {
        obdc.DataBind(e);
        if (obdc.EventListBox != undefined) {
            obdc.EventListBox.ItemSource = [{ EventName: "ValueChanged", EventCode: undefined, Command: obdc.dataContext.ValueChanged, Control: obdc.dataContext },
                { EventName: "Click", EventCode: undefined, Command: obdc.dataContext.Click, Control: obdc.dataContext }];
        }
    }

    obdc.HorizonScrollbar = "hidden";
    obdc.OnCreateHandle();
    obdc.Class = "VDE_Design_ObjectGeneralDesigner";
    obdc.Text = "开关控件设置";
    return obdc;
}

//数值选取
DBFX.Web.Controls.NumberDomain = function () {

    var nmd = new DBFX.Web.Controls.Control("NumberDomain");
    nmd.ClassDescriptor.Serializer = "DBFX.Serializer.NumberDomainSerializer";
    nmd.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.NumberDomainDesigner");
    nmd.VisualElement = document.createElement("DIV");
    nmd.OnCreateHandle();
    nmd.VisualElement.className = "NumberDomain";
    nmd.prevValue = 0;
    nmd.OnCreateHandle = function () {

        nmd.VisualElement.innerHTML = "<DIV class=\"NumberDomainDiv\"><DIV class=\"NumberDomain_DecreaseDiv\"><IMG class=\"NumberDomain_Decrease\" /></DIV><INPUT type=\"number\" class=\"NumberDomainInput\" /><DIV class=\"NumberDomain_IncreaseDiv\"><IMG class=\"NumberDomain_Increase\" /></DIV></DIV>";
        nmd.NumberDomain = nmd.VisualElement.querySelector("INPUT.NumberDomainInput");
        //nmd.NumberDomain.onchange = nmd.TextChanged;
        nmd.ClientDiv = nmd.VisualElement;
        nmd.Container = nmd.VisualElement.querySelector("DIV.NumberDomainDiv");
        nmd.TipLabel = nmd.VisualElement.querySelector("LABEL.InputTipLabel");
        nmd.InImageDiv = nmd.VisualElement.querySelector("DIV.NumberDomain_IncreaseDiv");
        nmd.InImage = nmd.VisualElement.querySelector("IMG.NumberDomain_Increase");
        nmd.InImage.src = "themes/" + app.CurrentTheme + "/images/Increase.png";
        nmd.InImageDiv.onclick = function (e) {

            if (nmd.enabled) {
                var cv = (nmd.Value * 1) + nmd.stepValue;
                if (cv > nmd.max)
                    cv = nmd.max;

                nmd.InputMode = 0;
                nmd.OrgValue = nmd.Value;
                nmd.Value = cv;
                nmd.OnDataInput();
                nmd.InputMode = undefined;
            }
            e.cancelBubble = true;

        }

        nmd.DeImageDiv = nmd.VisualElement.querySelector("DIV.NumberDomain_DecreaseDiv");
        nmd.DeImage = nmd.VisualElement.querySelector("IMG.NumberDomain_Decrease");
        nmd.DeImage.src = "themes/" + app.CurrentTheme + "/images/Decrease.png";
        nmd.DeImageDiv.onclick = function (e) {

            if (nmd.enabled) {
                var cv = (nmd.Value * 1) - nmd.stepValue;
                if (cv < nmd.min)
                    cv = nmd.min;
                nmd.OrgValue = nmd.Value;
                nmd.InputMode = 1;
                nmd.Value = cv;
                nmd.OnDataInput();
                nmd.InputMode = undefined;
            }

            e.cancelBubble = true;
        }


        //20190618 监听输入的数字
        nmd.NumberDomain.onkeyup = function () {
            console.log(this.value);
            // nmd.NumberDomain.value = nmd.NumberDomain.value.replace(/[^0-9]/g,'');
            nmd.InputMode = 2;
            nmd.OrgValue = nmd.Value;
            nmd.SetValue(Math.floor(nmd.NumberDomain.value));
            nmd.OnDataInput();
            nmd.InputMode = undefined;
        }

        nmd.NumberDomain.onblur = function (e) {

            nmd.SetValue(Math.floor(nmd.NumberDomain.value))

        }

        //  TODO:测试使用本地图片
        //   nmd.InImage.src = "./Increase.png";
        //   nmd.DeImage.src = "./Decrease.png";
    }

    nmd.SetAccessKey = function (v) {
        nmd.NumberDomain.accessKey = v;
    }

    nmd.SetTabIndex = function (v) {
        nmd.NumberDomain.tabIndex = v;
    }

    nmd.Click = function (e) {
        e.cancelBubble = true;
    }

    //20200410-只读属性
    nmd.readonly = false;
    Object.defineProperty(nmd, "ReadOnly", {
        get: function () {
            return nmd.readonly;

        },
        set: function (v) {

            nmd.readonly = v;
            if (v != null && v != undefined && (v == true || v == "true"))
                nmd.readonly = true;
            else
                nmd.readonly = false;

            nmd.NumberDomain.readOnly = nmd.readonly;

        }
    });

    //加号 图片地址 20190618
    nmd.inImgUrl = "themes/" + app.CurrentTheme + "/images/Increase.png";
    Object.defineProperty(nmd, "InImgUrl", {
        get: function () {
            return nmd.inImgUrl;
        },
        set: function (v) {
            nmd.inImgUrl = v;
            nmd.InImage.src = v;
        }
    });

    //减号 图片地址 20190618
    nmd.deImgUrl = "themes/" + app.CurrentTheme + "/images/Decrease.png";
    Object.defineProperty(nmd, "DeImgUrl", {
        get: function () {
            return nmd.deImgUrl;
        },
        set: function (v) {
            nmd.deImgUrl = v;
            nmd.DeImage.src = v;
        }
    });


    //20190618 模式
    nmd.mode = 1;
    Object.defineProperty(nmd, "Mode", {
        get: function () {
            return nmd.mode;
        },
        set: function (v) {

            nmd.mode = !isNaN(v * 1) ? v * 1 : 0;

        }
    });

    //20190618 数值增减量
    nmd.stepValue = 1;
    Object.defineProperty(nmd, "StepValue", {
        get: function () {
            return nmd.stepValue;
        },
        set: function (v) {

            nmd.stepValue = !isNaN(v * 1) ? v * 1 : 1;
        }
    });

    nmd.max = 1000;
    Object.defineProperty(nmd, "Max", {
        get: function () {
            return nmd.max;
        },
        set: function (v) {
            //20190618
            if (typeof v == "number") {
                nmd.max = v;
                return;
            }

            if (typeof v == "string" && !isNaN(v * 1)) {
                nmd.max = v * 1;
            } else {
                nmd.max = 1000;
            }

        }
    });

    nmd.min = 0;
    Object.defineProperty(nmd, "Min", {
        get: function () {
            return nmd.min;
        },
        set: function (v) {
            //20190618
            if (typeof v == "number") {
                nmd.min = v;
                return;
            }

            if (typeof v == "string" && !isNaN(v * 1)) {
                nmd.min = v * 1;
            } else {
                nmd.min = 0;
            }
        }
    });

    nmd.OnDataInput = function () {

        if (nmd.DataInput != undefined) {
            if (nmd.DataInput.GetType != undefined && nmd.DataInput.GetType() == "Command") {
                nmd.DataInput.Sender = nmd;
                nmd.DataInput.Execute();

            }
            else
                nmd.DataInput(nmd);
        }

    }


    nmd.SetEnabled = function (v) {

        if (nmd.enabled) {
            nmd.VisualElement.style.opacity = "1";
            nmd.NumberDomain.disabled = "";
        }
        else {
            nmd.VisualElement.style.opacity = "0.6";
            nmd.NumberDomain.disabled = "disabled";
        }

    }

    nmd.SetFontSize = function (v) {
        nmd.NumberDomain.style.fontSize = v;
    }

    nmd.SetFontStyle = function (v) {

        nmd.NumberDomain.style.fontWeight = v;
        nmd.NumberDomain.style.fontStyle = v;

    }

    nmd.TextChanged = function () {

        if (nmd.NumberDomain.value == nmd.prevValue)
            return;

        if (nmd.dataBindings != undefined && nmd.dataContext != undefined) {

            nmd.dataContext[nmd.dataBindings.Path] = nmd.NumberDomain.value;

        }
        if (nmd.FormContext != null && nmd.dataProperty != "")
            nmd.FormContext[nmd.dataProperty] = nmd.NumberDomain.value;

        if (nmd.ValueChanged != undefined && (nmd.value * 1.0 != nmd.NumberDomain.value * 1.0)) {
            if (nmd.ValueChanged.GetType != undefined && nmd.ValueChanged.GetType() == "Command") {
                nmd.ValueChanged.Sender = nmd;
                nmd.ValueChanged.Execute();

            }
            else
                nmd.ValueChanged(nmd);
        }

        nmd.value = nmd.NumberDomain.value;
        nmd.prevValue = nmd.value;
    }

    nmd.value = "";

    nmd.SetValue = function (v) {

        var v1 = v * 1;

        if (isNaN(v1))
            v1 = v = 0;

        //20190618 判断输入值的大小 显示最大值和最小值之间的数值
        nmd.NumberDomain.value = (v1 >= nmd.min && v1 <= nmd.max) ? v : (v1 < nmd.min ? nmd.min : nmd.max);

        if (nmd.mode == 1) {
            //达到最小值时  "减"按钮隐藏
            nmd.DeImageDiv.style.visibility = (v1 <= nmd.min) ? "hidden" : "";
            // nmd.NumberDomain.style.visibility = (v1 < nmd.min) ? "hidden" : "";
            //达到最大值时 "加"按钮隐藏
            nmd.InImageDiv.style.visibility = (v1 >= nmd.max) ? "hidden" : "";
            nmd.DeImageDiv.style.opacity = "1";
            nmd.InImageDiv.style.opacity = "1";
            // nmd.NumberDomain.value = v;
        }else {
            nmd.DeImageDiv.style.visibility = '';
            // nmd.NumberDomain.style.visibility = '';
            nmd.InImageDiv.style.visibility = '';
            nmd.DeImageDiv.style.opacity = (v1 <= nmd.min) ? "0.6" : "1";
            nmd.InImageDiv.style.opacity = (v1 >= nmd.max) ? "0.6" : "1";

        }

        nmd.TextChanged();

    }

    nmd.GetValue = function () {

        var v = nmd.NumberDomain.value * 1;

        if (v == NaN)
            nmd.NumberDomain.value = 0;

        return nmd.NumberDomain.value;

    }

    nmd.SetText = function (v) {
        nmd.prevValue = v;

        //20190618  之前设计器中输入文本无效 调用此方法并未更改显示的值
        nmd.SetValue(v);
    }

    nmd.GetText = function () {
        return nmd.Value;
    }
    nmd.OnCreateHandle();
    return nmd;
}
DBFX.Serializer.NumberDomainSerializer = function () {


    //反系列化
    this.DeSerialize = function (c, xe, ns) {

        DBFX.Serializer.DeSerialProperty("ValueChangedCommand", c, xe);
        c.ValueChanged = DBFX.Serializer.CommandNameToCmd(c.ValueChangedCommand);

        DBFX.Serializer.DeSerializeCommand("ValueChanged", xe, c);

        DBFX.Serializer.DeSerializeCommand("DataInput", xe, c);

        //20190618
        DBFX.Serializer.DeSerialProperty("Text", c, xe);
        DBFX.Serializer.DeSerialProperty("Max", c, xe);
        DBFX.Serializer.DeSerialProperty("Mode", c, xe);
        DBFX.Serializer.DeSerialProperty("Min", c, xe);
        DBFX.Serializer.DeSerialProperty("DeImgUrl", c, xe);
        DBFX.Serializer.DeSerialProperty("InImgUrl", c, xe);
        DBFX.Serializer.DeSerialProperty("StepValue", c, xe);
        DBFX.Serializer.DeSerialProperty("ReadOnly", c, xe);

    }


    //系列化
    this.Serialize = function (c, xe, ns) {

        var xdoc = xe.ownerDocument;
        DBFX.Serializer.SerialProperty("ValueChangedCommand", c.ValueChangedCommand, xe);
        DBFX.Serializer.SerializeCommand("ValueChanged", c.ValueChanged, xe);
        DBFX.Serializer.SerializeCommand("DataInput", c.DataInput, xe);

        //20190618
        DBFX.Serializer.SerialProperty("Text", c.Text, xe);
        DBFX.Serializer.SerialProperty("Max", c.Max, xe);
        DBFX.Serializer.SerialProperty("Mode", c.mode, xe);
        DBFX.Serializer.SerialProperty("Min", c.Min, xe);
        DBFX.Serializer.SerialProperty("DeImgUrl", c.DeImgUrl, xe);
        DBFX.Serializer.SerialProperty("InImgUrl", c.InImgUrl, xe);
        DBFX.Serializer.SerialProperty("StepValue", c.StepValue, xe);
        DBFX.Serializer.SerialProperty("ReadOnly", c.ReadOnly, xe);
    }


}
DBFX.Design.ControlDesigners.NumberDomainDesigner = function () {


    var obdc = new DBFX.Web.Controls.GroupPanel();
    obdc.OnCreateHandle();
    obdc.OnCreateHandle = function () {

        DBFX.Resources.LoadResource("design/designertemplates/FormDesignerTemplates/NumberDomainDesigner.scrp", function (od) {
            od.DataContext = obdc.dataContext;
            //设计器中绑定事件处理
            od.EventListBox = od.FormContext.Form.FormControls.EventListBox;
            od.EventListBox.ItemSource = [{ EventName: "ValueChanged", EventCode: undefined, Command: obdc.dataContext.ValueChanged, Control: obdc.dataContext },
            { EventName: "DataInput", EventCode: undefined, Command: obdc.dataContext.DataInput, Control: obdc.dataContext }
            ];

        }, obdc);
    }

    //20191014
    obdc.BaseDataBind = obdc.DataBind;
    obdc.DataBind = function (v) {
        if (obdc.dataContext.DataBindings == undefined)
            obdc.dataContext.DataBindings = { Path: "", Format: "", Mode: "TwoWay" };

        obdc.BaseDataBind(v);
    }

    //当前项设置上下文
    //事件处理程序
    obdc.DataContextChanged = function (e) {
        obdc.DataBind(e);
        if (obdc.EventListBox != undefined) {
            obdc.EventListBox.ItemSource = [{ EventName: "ValueChanged", EventCode: undefined, Command: obdc.dataContext.ValueChanged, Control: obdc.dataContext },
            { EventName: "DataInput", EventCode: undefined, Command: obdc.dataContext.DataInput, Control: obdc.dataContext }
            ];
        }
    }


    obdc.HorizonScrollbar = "hidden";
    obdc.OnCreateHandle();
    obdc.Class = "VDE_Design_ObjectGeneralDesigner";
    obdc.Text = "数值输入域设置";
    return obdc;

}

//时间选取器
DBFX.Web.Controls.TimePicker = function () {

    var tpk = new DBFX.Web.Controls.Control("TimePicker");
    tpk.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.InputControlDesigner");
    tpk.OnCreateHandle();
    tpk.VisualElement.className = "TimePicker";
    tpk.OnCreateHandle = function () {

        tpk.VisualElement.innerHTML = "<LABEL  class=\"InputTipLabel\"></LABEL><INPUT type=\"time\" class=\"TimePickerInput\"/>";
        tpk.TimePicker = tpk.VisualElement.querySelector("INPUT.TimePickerInput");
        tpk.TimePicker.readOnly = true;
        tpk.TimePicker.onchange = tpk.ValueChanged;
        tpk.ClientDiv = tpk.VisualElement;
        tpk.TipLabel = tpk.VisualElement.querySelector("LABEL.InputTipLabel");

    }

    tpk.SetAccessKey = function (v) {
        tpk.TimePicker.accessKey = v;
    }

    tpk.SetTabIndex = function (v) {
        tpk.TimePicker.tabIndex = v;
    }

    tpk.ValueChanged = function () {

        if (tpk.dataBindings != undefined && tpk.dataContext != undefined) {

            tpk.dataContext[tpk.dataBindings.Path] = tpk.TimePicker.value;

        }

        if (tpk.FormContext != null && tpk.dataProperty != "")
            tpk.FormContext[tpk.dataProperty] = tpk.TimePicker.value;
    }

    tpk.SetValue = function (v) {
        tpk.TimePicker.value = v;
    }

    tpk.GetValue = function () {

        return tpk.TimePicker.value;
    }



    tpk.OnCreateHandle();
    return tpk;

}

//日期选取器
DBFX.Web.Controls.DatePicker = function () {

    var dpk = new DBFX.Web.Controls.Control("DatePicker");
    dpk.ClassDescriptor.DisplayName = "UI基础控件";
    dpk.ClassDescriptor.Description = "为UI提供基础实现";
    dpk.ClassDescriptor.Serializer = "DBFX.Serializer.DatePickerSerializer";
    dpk.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.InputControlDesigner");
    dpk.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.DatePickerDesigner");
    dpk.VisualElement.className = "DatePicker";
    dpk.OnCreateHandle();
    dpk.OnCreateHandle = function () {

        dpk.VisualElement.innerHTML = "<DatePickerDiv class=\"DatePickerDiv\"><LABEL class=\"DatePicker_TipText\"></LABEL><INPUT type=\"text\" class=\"DatePickerInput\" /></INPUT><IMG class=\"DatePickerImage\" /></DIV>";
        dpk.ClientDiv = dpk.VisualElement;
        dpk.DatePicker = dpk.VisualElement.querySelector("INPUT.DatePickerInput");
        dpk.DatePicker.onchange = dpk.OnValueChanged;
        dpk.DatePicker.readonly = true;
        dpk.TipLable = dpk.VisualElement.querySelector("LABEL.DatePicker_TipText");
        dpk.Image = dpk.VisualElement.querySelector("IMG.DatePickerImage");
        dpk.Image.src = "themes/" + app.CurrentTheme + "/images/datepicker.png";
        dpk.DatePicker.onfocus = function (e) {

            dpk.ClientDiv.className = "DatePickerFocus";

        }

        dpk.DatePicker.onblur = function (e) {
            //20191008
            var reStr = dpk.DatePicker.value.replace(/,|-|\|/g, "/");
            dpk.SetValue(reStr);

            dpk.ClientDiv.className = "DatePicker";
        }

        dpk.DatePicker.onkeyup = function (e) {

            if (dpk.DatePicker.value != undefined)
                dpk.TipLable.style.display = "none";

        }

        dpk.DatePicker.onclick = function (e) {

            if (dpk.enabled != false)
                dpk.ShowCalendar();

        }

        dpk.Image.onclick = function (e) {

            if (dpk.enabled != false)
                dpk.ShowCalendar();
        }


        dpk.CalendarPad = new DBFX.Web.Controls.PopupPanel();
        dpk.Calendar = new DBFX.Web.Controls.Calendar();
        dpk.CalendarPad.AddControl(dpk.Calendar);
        dpk.CalendarPad.Closed = function (sender) {

            //20191008
            dpk.DatePicker.blur();

            if (dpk.Calendar.IsDirty == true) {

                dpk.SetValue(dpk.Calendar.value);
            }

            dpk.Calendar.IsDirty = false;
        }

        dpk.Calendar.ValueChanged = function (v, calendar) {

            //dpk.SetValue(v);

        }

        dpk.Calendar.DateSelected = function (v, flag) {

            dpk.Calendar.IsDirty = false;
            dpk.SetValue(v);
            if (flag == 1)
                dpk.CalendarPad.Close();

        }

    }

    dpk.SetAccessKey = function (v) {
        dpk.DatePicker.accessKey = v;
    }

    dpk.SetTabIndex = function (v) {
        dpk.DatePicker.tabIndex = v;
    }

    dpk.ShowCalendar = function () {

        dpk.Calendar.Value = dpk.value;
        dpk.CalendarPad.Show(dpk);
        dpk.CalendarPad.Width = "auto";

    }

    dpk.OnValueChanged = function () {

        if (dpk.DatePicker.value != undefined && dpk.DatePicker.value != "")
            dpk.TipLable.style.display = "none";
        else
            dpk.TipLable.style.display = "";

        if (dpk.dataBindings != undefined && dpk.dataContext != undefined) {

            dpk.dataContext[dpk.dataBindings.Path] = dpk.value;

        }
        dpk.RegisterFormContext();


        if (dpk.ValueChanged != undefined) {
            if (dpk.ValueChanged.GetType != undefined && dpk.ValueChanged.GetType() == "Command") {
                dpk.ValueChanged.Sender = dpk;
                dpk.ValueChanged.Execute();

            }
            else
                if (typeof dpk.ValueChanged == "function")
                    dpk.ValueChanged(dpk);
        }



    }

    dpk.RegisterFormContext = function () {
        if (dpk.FormContext != null && dpk.dataProperty != "" && dpk.dataProperty != undefined) {
            if (dpk.dataDomain != undefined && dpk.dataDomain != "") {

                var ddv = dpk.FormContext[dpk.dataDomain];
                if (ddv == undefined)
                    dpk.FormContext[dpk.dataDomain] = new DBFX.DataDomain();

                dpk.FormContext[dpk.dataDomain][dpk.dataProperty] = dpk.value;

            }
            else {
                dpk.FormContext[dpk.dataProperty] = dpk.value;
            }
        }
    }

    dpk.SetEnabled = function (v) {
        if (dpk.enabled == true) {
            dpk.VisualElement.disabled = "";
            dpk.VisualElement.style.opacity = "1";
            dpk.DatePicker.readOnly = false;
        }
        else {
            dpk.VisualElement.disabled = "disabled";
            dpk.VisualElement.style.opacity = "0.8";
            dpk.DatePicker.readOnly = true;
        }
    }

    dpk.value = new Date();
    dpk.GetValue = function () {
        return dpk.value;
    }

    dpk.SetValue = function (ov) {

        try {
            var date = "";
            if (ov && ov.getSeconds) {//如果为日期对象  直接赋值
                date = ov;
            } else {//非日期对象 作为参数创建日期对象
                date = new Date(ov);
                if (isNaN(date)) {
                    if (typeof ov == "string") {
                        var reStr = ov.replace(/,|-/g, "/");
                        date = new Date(reStr);
                        if (isNaN(date)) {
                            date = new Date();
                        }
                    } else {
                        date = new Date();
                    }
                }
            }

            dpk.calDate = date;
            dpk.value = date;
            dpk.SetDateValue(date);
        }
        catch (ex) {
            //alert(ex.toString());
        }


    }

    dpk.SetDateValue = function (v, m) {

        var dstr = "";
        if (dpk.mode == "0") {
            dpk.DatePicker.value = dpk.value.toLongDateString();
        }

        if (dpk.mode == "1") {

            dpk.DatePicker.value = dpk.value.toLongDateString() + " " + dpk.value.toLongTimeString();

        }
        dpk.value = new Date(dpk.DatePicker.value.replace(/-/g, '/'));

        if (m == undefined) {
            dpk.OnValueChanged();
        }

    }

    dpk.SetTipText = function (v) {

        dpk.TipText = v;
        dpk.TipLable.innerText = v;

    }

    dpk.SetFocus = function(){
        dpk.DatePicker.focus();
        dpk.DatePicker.select();
    }

    dpk.SetBlur = function(){
        dpk.DatePicker.blur();
    }


    dpk.mode = "0";
    Object.defineProperty(dpk, "Mode", {
        get: function () {
            return dpk.mode;
        },
        set: function (v) {
            dpk.mode = v;
            dpk.Calendar.Model = v;
            //20200909
            dpk.Value && dpk.SetDateValue(dpk.Value, 1);
        }
    });

    //20210917
    Object.defineProperty(dpk, "ShowText", {
        get: function () {
            return dpk.DatePicker.value;
        },
        set: function (v) {
            dpk.DatePicker.value = v;
        }
    });

    dpk.UnLoad = function () {

        if (dpk.CalendarPad.IsOpen == true)
            dpk.CalendarPad.Close();

    }


    dpk.OnCreateHandle();
    return dpk;

}

//日历面板
DBFX.Web.Controls.Calendar = function () {

    var calendar = new DBFX.Web.Controls.Control("Calendar");
    calendar.VisualElement = document.createElement("DIV");
    calendar.OnCreateHandle();
    calendar.OnCreateHandle = function () {
        calendar.VisualElement.className = "Calendar";
        calendar.VisualElement.innerHTML = "<DIV class=\"Calendar_YearDiv\"></DIV><DIV class=\"Calendar_MDDiv\"></DIV><DIV class=\"Calendar_TimeDiv\" ></DIV>";
        calendar.MDDiv = calendar.VisualElement.querySelector("DIV.Calendar_MDDiv");
        calendar.DSDiv = calendar.VisualElement.querySelector("DIV.Calendar_YearDiv");
        calendar.TSDiv = calendar.VisualElement.querySelector("DIV.Calendar_TimeDiv");

        var wkdays = ["一", "二", "三", "四", "五", "六", "日"];
        calendar.Table = document.createElement("TABLE");
        calendar.Table.className = "Calendar_Table";
        calendar.Table.cellPadding = "0";
        calendar.Table.cellSpacing = "0";
        for (var i = 0; i < 7; i++) {
            var tr = document.createElement("TR");

            tr.className = "Calendar_MDRow";

            calendar.Table.appendChild(tr);
            for (var j = 0; j < 7; j++) {
                var td = document.createElement("TD");
                td.className = "Calendar_MDTD";
                if (i == 0) {
                    td.innerText = wkdays[j];
                    td.className = "Calendar_MDTH";
                }
                tr.appendChild(td);
            }

        }
        calendar.MDDiv.appendChild(calendar.Table);

        calendar.DSTable = document.createElement("TABLE");
        calendar.DSTable.innerHTML = "<TR><TD class=\"Calendar_DSCell\"><<</TD><TD class=\"Calendar_DSCell\"><</TD><TD class=\"Calendar_DSCellInput\">2017-08-19</TD><TD class=\"Calendar_DSCell\">></TD><TD class=\"Calendar_DSCell\">>></TD></TR>";
        calendar.DSTable.className = "Calendar_SwitchTB";
        calendar.DSDiv.appendChild(calendar.DSTable);
        calendar.DateCell = calendar.DSTable.querySelector("TD.Calendar_DSCellInput");
        calendar.TSTable = document.createElement("TABLE");
        calendar.TSTable.innerHTML = "<TR><TD class=\"Calendar_DSCell\"><<</TD><TD class=\"Calendar_DSCell\"><</TD><TD class=\"Calendar_DSCellInput\"><INPUT type=\"text\" value=\"20:43:01\" class=\"Calendar_TimeInput\"/></TD><TD class=\"Calendar_DSCell\">></TD><TD class=\"Calendar_DSCell\">>></TD></TR>";
        calendar.TSTable.className = "Calendar_SwitchTB";
        calendar.TSDiv.appendChild(calendar.TSTable);
        calendar.TimeInput = calendar.TSTable.querySelector("INPUT.Calendar_TimeInput");
        calendar.CreateCalendar(calendar.value);

        calendar.Table.onclick = calendar.DateClick;
        calendar.DSTable.onmousedown = function (e) {

            if (calendar.CDTO != undefined)
                clearTimeout(calendar.CDTO);

            if (e.srcElement.className == "Calendar_DSCell") {

                var cmd = e.srcElement.innerText;
                switch (cmd) {

                    case "<<":
                        calendar.ChangeData = function () {
                            calendar.Value = calendar.value.addYears(-1);
                        }
                        break;

                    case "<":
                        calendar.ChangeData = function () {
                            calendar.Value = calendar.value.addMonth(-1);
                        }
                        break;

                    case ">":
                        calendar.ChangeData = function () {
                            calendar.Value = calendar.value.addMonth(1);
                        }
                        break;

                    case ">>":
                        calendar.ChangeData = function () {
                            calendar.Value = calendar.value.addYears(1);
                        }
                        break;


                }
                calendar.ChangeData();

                calendar.CDTO = setTimeout(function () {
                    calendar.CDTime = setInterval(function () {
                        calendar.ChangeData();
                    }, 100);
                }, 200);
            }

        }

        calendar.DSTable.onmouseup = function (e) {

            calendar.ChangeData = function () { };
            if (calendar.CDTO != undefined)
                clearTimeout(calendar.CDTO);

            if (calendar.CDTime != undefined)
                clearInterval(calendar.CDTime);

        }



        calendar.TSTable.onmousedown = function (e) {

            if (calendar.CDTO != undefined)
                clearTimeout(calendar.CDTO);

            if (e.srcElement.className == "Calendar_DSCell") {

                var cmd = e.srcElement.innerText;
                switch (cmd) {

                    case "<<":
                        calendar.ChangeData = function () {
                            calendar.Value = calendar.value.addHours(-1);
                        }
                        break;

                    case "<":
                        calendar.ChangeData = function () {
                            calendar.Value = calendar.value.addMinutes(-1);
                        }
                        break;

                    case ">":
                        calendar.ChangeData = function () {
                            calendar.Value = calendar.value.addMinutes(1);
                        }
                        break;

                    case ">>":
                        calendar.ChangeData = function () {
                            calendar.Value = calendar.value.addHours(1);
                        }
                        break;


                }

                calendar.ChangeData();
                calendar.CDTO = setTimeout(function () {
                    calendar.CDTime = setInterval(function () {
                        calendar.ChangeData();
                    }, 100);
                }, 200);

            }

        }

        calendar.TSTable.onmouseup = function (e) {

            if (calendar.CDTO != undefined)
                clearTimeout(calendar.CDTO);

            if (calendar.CDTime != undefined)
                clearInterval(calendar.CDTime);

            calendar.ChangeData = function () { };

            calendar.IsDirty = true;

        }

        calendar.DSTable.onmouseleave = calendar.DSTable.onmouseup;
        calendar.DSTable.onmouseout = calendar.DSTable.onmouseup;
        calendar.TSTable.onmouseleave = calendar.TSTable.onmouseup;
        calendar.TSTable.onmouseout = calendar.TSTable.onmouseup;

        calendar.TimeInput.onblur = function (e) {

            calendar.GetNewDate();

        }


        calendar.GetNewDate = function () {


            var a1 = String.fromCharCode(8206);
            var reg = new RegExp(a1, "\g");

            var d = calendar.value;

            var nd = (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear() + " " + calendar.TimeInput.value.replace(reg, "");

            try {
                nd = new Date(nd);
            }
            catch (ex) { }


            if (nd.toString().toLowerCase() != "invalid date")
                calendar.Value = nd;


        }


        calendar.DSTable.ontouchstart = calendar.DSTable.onmousedown;

        calendar.DSTable.ontouchend = calendar.DSTable.onmouseup;

    }

    calendar.DateClick = function (e) {

        if (e.srcElement.tagName.toLowerCase() == "td" && e.srcElement.className.indexOf("Calendar_MDTD") == 0) {
            calendar.IsDirty = true;
            calendar.value = e.srcElement.Date;
            calendar.GetNewDate();
            calendar.DateSelected(calendar.value, 1);
        }

    }

    calendar.DateSelected = function () { }

    calendar.OnValueChanged = function () {

        if (calendar.ValueChanged != undefined)
            calendar.ValueChanged(calendar.value, calendar);

    }


    calendar.CreateCalendar = function (dv) {

        var dv = new Date(dv);
        calendar.Year = dv.getFullYear();
        calendar.Month = dv.getMonth() + 1;
        calendar.Day = dv.getDate();
        calendar.Hour = dv.getHours();
        calendar.Minute = dv.getMinutes();
        calendar.Second = dv.getSeconds();

        calendar.DateCell.innerText = dv.toLocaleDateString();
        calendar.TimeInput.value = dv.toLongTimeString();

        var sd = dv.addDays(calendar.Day * -1 + 1);
        var wd = sd.getDay();
        if (wd == 0)
            wd = 7;

        if (wd > 1)
            sd = sd.addDays(wd * -1 + 1);

        for (var i = 1; i < 7; i++) {
            var rw = calendar.Table.childNodes[i];
            for (var j = 0; j < 7; j++) {

                var m1 = sd.getMonth() + 1;
                var c = rw.childNodes[j];
                c.innerText = sd.getDate();
                c.Date = sd;
                c.className = "Calendar_MDTD";
                if (m1 != calendar.Month) {
                    c.className = "Calendar_MDTD1";
                }

                if (calendar.Day == sd.getDate() && calendar.Month == m1) {

                    c.className = "Calendar_MDTDSelect";
                }

                sd = sd.addDays(1);
            }

        }



    }

    calendar.value = new Date();


    calendar.GetValue = function () {
        return calendar.value;
    }
    calendar.SetValue = function (v) {
        calendar.value = v;
        calendar.CreateCalendar(v);
        calendar.OnValueChanged();

    }

    calendar.mode = "0";
    Object.defineProperty(calendar, "Mode", {
        get: function () {
            return calendar.mode;
        },
        set: function (v) {
            calendar.mode = v;
            calendar.TSDiv.style.display = "block";
            if (calendar.mode == "0") {
                calendar.TSDiv.style.display = "none";
            }

        }
    });

    calendar.IsDity = false;
    calendar.OnCreateHandle();
    return calendar;

}

//评分控件
DBFX.Web.Controls.RateControl = function () {

    var ratecontrol = new DBFX.Web.Controls.Control("RateControl");
    ratecontrol.VisualElement = document.createElement("DIV");
    ratecontrol.OnCreateHandle = function () {




    }

    ratecontrol.OnCreateHandle();
    return ratecontrol;


}

//基本容器
DBFX.Web.Controls.Panel = function (t) {

    if (t == undefined)
        t = "Panel";

    var pnl = new DBFX.Web.Controls.Control(t);
    pnl.ClassDescriptor.Serializer = "DBFX.Serializer.PanelSerializer";
    pnl.ClassDescriptor.DesignTimePreparer = "DBFX.Design.PanelDesignTimePreparer";
    pnl.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.ContainerDesigner");
    pnl.VisualElement = document.createElement("DIV");
    pnl.OnCreateHandle();
    pnl.Controls = new DBFX.Web.Controls.ControlsCollection(pnl);
    pnl.ClientContainer = null;
    pnl.IsContainer = true;
    pnl.OnCreateHandle = function () {

        pnl.ClientDiv = pnl.VisualElement;
        pnl.ClientDiv.className = "Panel";
        pnl.ClientDiv.ondragstart = pnl.OnDragStart;
        pnl.ClientDiv.ondrop = pnl.OnDrop;
        pnl.ClientDiv.ondragend = pnl.OnDragEnd;
        pnl.ClientDiv.ondragover = pnl.OnDragOver;

    }

    Object.defineProperty(pnl, "Border", {
        get: function () {

            return pnl.ClientDiv.style.border;
        },
        set: function (v) {
            pnl.ClientDiv.style.border = v;
        }
    });

    Object.defineProperty(pnl, "Shadow", {
        get: function () {

            return pnl.ClientDiv.style.boxShadow;
        },
        set: function (v) {
            pnl.ClientDiv.style.boxShadow = v;
        }
    });

    /**
     * 20201224-添加属性，控制panel是否支持鼠标拖拽移动
     * 1、panel支持拖拽后，目前设定position为fixed，考虑：设定在指定容器中拖拽；
     * 2、目前的拖拽未考虑边界问题，拖出浏览器外如何解决？
     */
    pnl.canDragMove = false;
    Object.defineProperty(pnl, "CanDragMove", {
        get: function () {

            return pnl.canDragMove;
        },
        set: function (v) {
            if (!pnl.onlyOnce) {
                pnl.defaultPosition = pnl.Position;
                pnl.onlyOnce = true;
            }
            v = (v == true || v == 'true');
            pnl.canDragMove = v;
            //处理鼠标点击
            pnl.md = function (e) {
                if (pnl.canDragMove == false) return;
                //获取x坐标和y坐标
                x = e.clientX;
                y = e.clientY;

                //获取左部和顶部的偏移量
                l = pnl.VisualElement.offsetLeft;
                t = pnl.VisualElement.offsetTop;
                //开关打开
                isDown = true;
                //设置样式
                pnl.VisualElement.style.cursor = 'move';
            }

            //处理鼠标抬起
            pnl.mu = function (e) {
                if (pnl.canDragMove == false) return;
                //开关关闭
                isDown = false;
                pnl.VisualElement.style.cursor = 'default';
            }

            //处理鼠标移动
            pnl.mm = function (e) {
                if (pnl.canDragMove == false) return;
                if (isDown == false) {
                    return;
                }
                //获取x和y
                var nx = e.clientX;
                var ny = e.clientY;
                //计算移动后的左偏移量和顶部的偏移量
                var nl = nx - (x - l);
                var nt = ny - (y - t);

                pnl.VisualElement.style.left = nl + 'px';
                pnl.VisualElement.style.top = nt + 'px';
            }
            if (v) {
                //
                var x = 0;
                var y = 0;
                var l = 0;
                var t = 0;
                var isDown = false;
                pnl.VisualElement.style.position = 'fixed';
                pnl.VisualElement.addEventListener("mousedown", pnl.md);
                pnl.VisualElement.addEventListener("mouseup", pnl.mu);
                pnl.VisualElement.addEventListener("mouseout", pnl.mu);
                window.addEventListener('mousemove', pnl.mm);

            } else {
                pnl.VisualElement.style.position = pnl.defaultPosition;
                pnl.VisualElement.removeEventListener('mousedown', pnl.md);
                pnl.VisualElement.removeEventListener('mouseup', pnl.mu);
                window.removeEventListener('mousemove', pnl.mm);
            }
        }
    });

    pnl.SetBorderRadius = function (v) {

        pnl.ClientDiv.style.borderRadius = v;

    }

    //添加控件
    pnl.AddControl = function (c) {


        pnl.Controls.push(c);
        pnl.ClientDiv.appendChild(c.VisualElement);

        if (c.FormContext == undefined)
            c.FormContext = pnl.FormContext;

        c.DataContext = pnl.DataContext;
        c.Parent = pnl;

        c.Enabled = pnl.Enabled;

    }

    pnl.InsertControl = function (c, tc, pos) {

        var idx = pnl.Controls.indexOf(tc);
        if (idx < 0)
            pnl.AddControl(c);
        else {

            if (pos == undefined || pos == 0) {
                pnl.Controls.splice(idx, 0, c);
                tc.VisualElement.insertAdjacentElement("beforeBegin", c.VisualElement);
            }
            else {

                pnl.Controls.splice(idx + 1, 0, c);
                tc.VisualElement.insertAdjacentElement("afterEnd", c.VisualElement);


            }

            if (c.FormContext == undefined)
                c.FormContext = pnl.FormContext;
            c.DataContext = pnl.DataContext;

        }

        c.Parent = pnl;
        c.Enabled = pnl.Enabled;
    }

    pnl.Remove = function (c) {

        var idx = pnl.Controls.indexOf(c);
        pnl.Controls.splice(idx, 1);
        pnl.ClientDiv.removeChild(c.VisualElement);
        c.Parent = undefined;
        if (c.Unload != undefined)
            c.Unload();

    }

    pnl.AddElement = function (e) {

        pnl.ClientDiv.appendChild(e);
    }

    pnl.AddHtml = function (s) {

        var e = document.createElement("P");
        e.innerHTML = s;
        pnl.ClientDiv.appendChild(e);
    }

    pnl.DataBind = function (v) {

        for (var i = 0; i < pnl.Controls.length; i++)
            pnl.Controls[i].DataContext = pnl.dataContext;

    }

    pnl.Clear = function () {

        pnl.Controls.forEach(function (c) {
            c.Parent = undefined;
            c.OnUnLoad();
        });
        pnl.Controls = new Array();
        pnl.ClientDiv.innerHTML = "";

    }

    pnl.SetEnabled = function (v) {
        pnl.Controls.forEach(function (control) {
            control.Enabled = v;
        });

    }

    pnl.Validate = function () {
        var that = pnl;
        if(that.Display == 'none' || that.Visibled == false || that.Enabled == false){
            return true;
        }
        var r = true;
        for (var idx = 0; idx < pnl.Controls.length; idx++) {

            if (pnl.Controls[idx].Validate == undefined)
                continue;

            var r1 = pnl.Controls[idx].Validate();
            if (r1 == false)
                r = false;

        }

        return r;
    }

    pnl.DesignTime = false;

    pnl.OnUnLoad = function () {

        pnl.Controls.forEach(function (c) {

            c.OnUnLoad();

        });



        if (typeof pnl.UnLoad == "function")
            pnl.UnLoad();

        if (pnl.UnLoad != undefined && pnl.UnLoad.GetType() == "Command") {
            pnl.UnLoad.Sender = pnl;
            pnl.UnLoad.Execute();
        }




    }

    pnl.OnLoad = function () {

        pnl.Controls.forEach(function (c) {

            c.OnLoad();

        });


        if (typeof pnl.Load == "function")
            pnl.Load(pnl);

        if (pnl.Load != undefined && pnl.Load.GetType() == "Command") {
            pnl.Load.Sender = pnl;
            pnl.Load.Execute();
        }
    }

    pnl.OnCreateHandle();
    return pnl;

}

//
DBFX.Web.Controls.PopupPanel = function () {

    var ppnl = new DBFX.Web.Controls.Control("PopupPanel");
    ppnl.OnCreateHandle();
    ppnl.ClassDescriptor.Serializer = "DBFX.Serializer.PopupPanelSerializer";
    ppnl.OnCreateHandle = function () {

        ppnl.PopupPanel = document.createElement("DIV");
        ppnl.Cover = document.createElement("DIV");
        ppnl.Cover.className = "PopMenu_Cover";
        ppnl.AutoClosed = true;
        ppnl.VisualElement.style.display = "none";
        ppnl.ClientDiv = ppnl.PopupPanel;

        ppnl.ClientDiv.onresizeend = function () {


        }

    }

    ppnl.MouseDown = function (e) {

        e.preventDefault();
        e.cancelBubble = true;

    }

    ppnl.MouseUp = function (e) {
        e.preventDefault();
        e.cancelBubble = true;
    }

    ppnl.Click = function (e) {
        e.preventDefault();
        e.cancelBubble = true;
    }

    ppnl.Show = function (c) {

        ppnl.Cover.className = "PopMenu_Cover";
        ppnl.Cover.style.position = "fixed";
        ppnl.PopupPanel.className = "POPUP_Panel";
        ppnl.PopupPanel.style.position = "absolute";
        ppnl.PopupPanel.style.display = "block";
        var rc = null;
        if(c.VisualElement!=undefined)
            rc = c.ClientDiv.getBoundingClientRect();
        else
            rc = c.getBoundingClientRect();

        var x = rc.left;
        var y = rc.top + rc.height;


        document.body.appendChild(ppnl.Cover);
        ppnl.Cover.style.top = "0px";
        ppnl.Cover.style.left = "0px";
        ppnl.Cover.style.right="0px";
        ppnl.Cover.style.bottom = "0px";

        document.body.appendChild(ppnl.PopupPanel);

        if ((y + ppnl.PopupPanel.clientHeight) >= window.innerHeight)
            y = rc.top - ppnl.PopupPanel.clientHeight - 6;


        if (ppnl.PopupPanel.clientWidth < rc.width)
            ppnl.PopupPanel.style.width=rc.width+"px";

        if ((x + ppnl.PopupPanel.clientWidth) >= window.innerWidth)
            x = window.innerWidth - ppnl.PopupPanel.clientWidth-6;


        if (y <= 0) {

            ppnl.PopupPanel.style.height = (ppnl.PopupPanel.clientHeight + y-6) + "px";
            ppnl.PopupPanel.style.overflow = "auto";
            y = 6;
        }

        if ((y+ppnl.PopupPanel.clientHeight) >= window.innerHeight) {

            ppnl.PopupPanel.style.height = (ppnl.PopupPanel.clientHeight - ((y + ppnl.PopupPanel.clientHeight) - window.innerHeight - 6)) + "px";
            ppnl.PopupPanel.style.overflow = "auto";
        }


        ppnl.PopupPanel.style.left = x + "px";
        ppnl.PopupPanel.style.top = y + "px";

        ppnl.Cover.onmousedown = ppnl.PopupPanelMouseDown;

        DBFX.Web.Controls.PopupPanel.ActivedPanel = ppnl;

        ppnl.IsOpen = true;

    }

    //20210824-显示页面资源
    ppnl.ShowPage = function(url,c,cb){
        if(url == undefined || c == undefined) return;
        DBFX.Resources.LoadResource(url, function (view) {
            ppnl.Show(c);
            if(typeof cb == "function") cb(view);
        }, ppnl);
    }

    ppnl.ShowAt = function (x,y,ch) {

        ppnl.Cover.className = "PopMenu_Cover";
        ppnl.Cover.style.position = "fixed";
        ppnl.PopupPanel.className = "POPUP_Panel";
        ppnl.PopupPanel.style.position = "absolute";
        ppnl.PopupPanel.style.display = "block";
        if (x == undefined && y == undefined) {

            x = 0;
            y = 0;

        }

        document.body.appendChild(ppnl.Cover);
        ppnl.Cover.style.top = "0px";
        ppnl.Cover.style.left = "0px";
        ppnl.Cover.style.right = "0px";
        ppnl.Cover.style.bottom = "0px";

        ppnl.PopupPanel.style.left = x + "px";
        ppnl.PopupPanel.style.top = y + "px";

        document.body.appendChild(ppnl.PopupPanel);

        if (ch == undefined)
            ch = 0;

        if ((y + ppnl.PopupPanel.clientHeight) > window.innerHeight)
            y = y - ppnl.PopupPanel.clientHeight+ch;

        if ((x + ppnl.PopupPanel.clientWidth) >= window.innerWidth)
            x = window.innerWidth - ppnl.PopupPanel.clientWidth - 6;


        ppnl.PopupPanel.style.left = x + "px";
        ppnl.PopupPanel.style.top = y + "px";

        ppnl.Cover.onmousedown = ppnl.PopupPanelMouseDown;
        ppnl.Cover.onmouseup = function (e) {
            e.cancelBubble = true;
            e.preventDefault();

        }

        ppnl.Cover.onclick = function (e) {

            e.cancelBubble = true;
            e.preventDefault();
        }


        DBFX.Web.Controls.PopupPanel.ActivedPanel = ppnl;

        ppnl.IsOpen = true;

    }

    ppnl.PopupPanelMouseDown = function (e) {

        e.cancelBubble = true;
        e.preventDefault();
        if (ppnl.AutoClosed) {

            var rc = ppnl.PopupPanel.getBoundingClientRect();
            if (e.x < rc.left || e.x > rc.right || e.y < rc.top || e.y > rc.bottom) {

                ppnl.Close();

            }
        }

    }

    ppnl.Controls = new DBFX.Web.Controls.ControlsCollection(ppnl);
    ppnl.AddControl = function (c) {

        ppnl.PopupPanel.appendChild(c.VisualElement);

        c.DataContext = ppnl.DataContext;

        if (c.FormContext == undefined)
            c.FormContext = ppnl.FormContext;

        ppnl.Controls.push(c);
    }

    ppnl.Clear = function () {

        ppnl.Controls = new Array();
        ppnl.PopupPanel.innerHTML = "";

    }

    ppnl.IsOpen = false;
    ppnl.Close = function () {

        if (ppnl.IsOpen == true) {
            document.body.removeChild(ppnl.PopupPanel);
            document.body.removeChild(ppnl.Cover);
            ppnl.Cover.onmousedown = null;
            DBFX.Web.Controls.PopupPanel.ActivedPanel = null;

            if (ppnl.Closed != undefined)
                ppnl.Closed(ppnl);
        }
        ppnl.IsOpen = false;

    }

    ppnl.Closed = function (sender) {


    }

    ppnl.Validate = function () {
        var that = ppnl;
        if(that.Display == 'none' || that.Visibled == false || that.Enabled == false){
            return true;
        }
        var r = true;
        for (var idx = 0; idx < ppnl.Controls.length; idx++) {

            if (ppnl.Controls[idx].Validate == undefined)
                continue;

            r = ppnl.Controls[idx].Validate();
            if (r == false)
                break;

        }

        return r;
    }

    ppnl.DataBind = function (v) {

        for (var i = 0; i < ppnl.Controls.length; i++)
            ppnl.Controls[i].DataContext = ppnl.dataContext;

    }

    ppnl.OnUnLoad = function () {

        ppnl.Controls.forEach(function (c) {

            if (c.OnUnLoad != undefined) {
                    c.OnUnLoad();

            }
        });


        if (typeof ppnl.UnLoad == "function")
            ppnl.UnLoad();

        if (ppnl.UnLoad != undefined && ppnl.UnLoad.GetType() == "Command") {
            ppnl.UnLoad.Sender = ppnl;
            ppnl.UnLoad.Execute();
        }
    }

    ppnl.OnLoad = function () {

        ppnl.Controls.forEach(function (c) {

            if (c.OnLoad != undefined) {
                 c.OnLoad();
            }

        });

        if (typeof ppnl.Load == "function")
            ppnl.Load();

        if (ppnl.Load != undefined && ppnl.Load.GetType() == "Command") {
            ppnl.Load.Sender = ppnl;
            ppnl.Load.Execute();
        }

    }

    ppnl.OnCreateHandle();
    return ppnl;

}

DBFX.Web.Controls.PopupPanel.ActivedPanel = null;
DBFX.Web.Controls.PopupPanel.ClosePopupPanel = function () {

    if(DBFX.Web.Controls.PopupPanel.ActivedPanel!=null)
        DBFX.Web.Controls.PopupPanel.ActivedPanel.Close();
}
//文件上传框
DBFX.Web.Controls.FileUploadBox = function () {

    var fub = new DBFX.Web.Controls.Control("FileUploadBox");
    fub.ClassDescriptor.Serializer = "DBFX.Serializer.FileUploadBoxSerializer";
    fub.VisualElement = document.createElement("DIV");
    fub.OnCreateHandle();
    fub.OnCreateHandle = function () {
        fub.Class = "FileUploadBox";
        fub.VisualElement.innerHTML = "<DIV class=\"FileUploadBox_IDiv\"></DIV><INPUT type=\"file\" class=\"FileUploadBox_Input\" />";
        fub.ClientDiv = fub.VisualElement;
        fub.FileBox = fub.ClientDiv.querySelector("INPUT.FileUploadBox_Input");
        fub.FIDiv = fub.ClientDiv.querySelector("DIV.FileUploadBox_IDiv");

        fub.btnBrowse = new DBFX.Web.Controls.Button("...", function (e) {

            fub.FileBox.click();
            if (fub.FileBox.files.length > 0) {
                if (fub.FileBox.files[0].size / 1024 > fub.maxSize && fub.maxSize>0) {
                    fub.FNSpan.Text = "图片尺寸过大!";
                }
                else {
                    fub.FNSpan.Text = fub.FileBox.files[0].name;
                    fub.FSSpan.Text = " | " + Math.round(fub.FileBox.files[0].size / 1024) + "KB";
                }
            }

        });

        fub.btnBrowse.Width = "32px";
        fub.btnBrowse.Position = "absolute";
        fub.btnBrowse.Top = "0px";
        fub.btnBrowse.Right = "0px";
        fub.btnBrowse.Height = "auto";
        fub.btnBrowse.Bottom="0px";
        fub.btnBrowse.ZIndex = 1;
        fub.FNSpan = new DBFX.Web.Controls.Label("选择要上传的文件");
        fub.FNSpan.Margin = "3px 2px 2px 2px";

        fub.FSSpan = new DBFX.Web.Controls.Label("");
        fub.FSSpan.Margin = "3px 2px 2px 2px";
        fub.FIDiv.appendChild(fub.btnBrowse.VisualElement);
        fub.FIDiv.appendChild(fub.FNSpan.VisualElement);
        fub.FIDiv.appendChild(fub.FSSpan.VisualElement);


    }

    Object.defineProperty(fub, "File", {
        get: function () {

            if (fub.FileBox.files.length > 0)
                return fub.FileBox.files[0];
            else
                return null;

        }
    });

    fub.maxSize = 0;
    Object.defineProperty(fub, "MaxSize", {
        get: function () {
            return fub.maxSize;
        },
        set: function (v) {

            try{
                fub.maxSize = v*1.0;
            }catch(ex){}

        }
    });


    fub.BrowseFile = function () {

        fub.FileBox.click();

    }

    fub.SetName = function (v) {
        fub.FileBox.name = v;
    }

    fub.GetName = function () {
        return fub.FileBox.name;
    }

    fub.GetValue = function () {
        return fub.FileBox.value;


    }

    fub.OnCreateHandle();
    return fub;

}

//文件资源上传控件
DBFX.Web.Controls.FileUploadListView = function () {

    var fuv = new DBFX.Web.Controls.Control("FileUploadListView");
    fuv.OnCreateHandle();
    fuv.OnCreateHandle = function () {



    }

    fuv.OnCreateHandle();
    return fuv;

}

//图片上传控件
DBFX.Web.Controls.ImageUploadBox = function () {

    var iubox = new DBFX.Web.Controls.Control("ImageUploadBox");
    iubox.ClassDescriptor.Serializer = "DBFX.Serializer.ImageUploadBoxSerializer";
    iubox.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.InputControlDesigner");
    iubox.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.ImageUploadBoxDesigner");
    iubox.VisualElement = document.createElement("DIV");
    iubox.OnCreateHandle();
    iubox.OnCreateHandle = function () {
        iubox.Class = "ImageUploadBox";
        iubox.VisualElement.innerHTML = "<INPUT type=\"file\" accept='image/jpeg,image/ipg,image/png' class=\"ImageUploadBox_File\" /><IMG class=\"ImageUploadBox_Image\" /> <DIV class=\"ImageUploadBox_Tool\"><BUTTON class=\"ImageUploadBox_BrowseFile\">选择图片></BUTTON><BUTTON class=\"ImageUploadBox_Upload\" >上传图片></BUTTON></DIV><DIV class=\"ImageUploadBox_ProgDiv\"><PROGRESS class=\"ImageUploadBox_Progress\"><LABEL class=\"ImageUploadBox_ProgressText\" /></PROGRESS></DIV>";
        iubox.ClientDiv = iubox.VisualElement;
        iubox.File = iubox.VisualElement.querySelector("INPUT.ImageUploadBox_File");
        iubox.Image = iubox.VisualElement.querySelector("IMG.ImageUploadBox_Image");

        iubox.ToolDiv = iubox.VisualElement.querySelector("DIV.ImageUploadBox_Tool");
        iubox.BrowseButton = iubox.VisualElement.querySelector("BUTTON.ImageUploadBox_BrowseFile");
        iubox.UploadButton = iubox.VisualElement.querySelector("BUTTON.ImageUploadBox_Upload");

        iubox.ProgDiv = iubox.VisualElement.querySelector("DIV.ImageUploadBox_ProgDiv");
        iubox.ProgSpan = iubox.VisualElement.querySelector("LABEL.ImageUploadBox_ProgressText");
        iubox.Progress = iubox.VisualElement.querySelector("PROGRESS.ImageUploadBox_Progress");

        iubox.UploadButton.disabled = true;

        iubox.IsClicked = false;
        iubox.OrgPoint = null;
        iubox.Scale = 1;

        iubox.File.onchange = iubox.LoadPicture;


        iubox.BrowseButton.onclick = function (e) {
            e.cancelBubble = true;
            iubox.IsClicked = false;
            iubox.OrgPoint = null;
            if(typeof Dbsoft == 'undefined' || Dbsoft.System==undefined || Dbsoft.System.UploadImages == undefined){
                iubox.File.click();
            }else {
                iubox.BrowseFile();
            }
        }

        iubox.UploadButton.onclick = function (e) {
            e.cancelBubble = true;
            iubox.UploadImage();

        }

        iubox.ClientDiv.onmousedown = function (e) {
            e.cancelBubble = true;
            e.preventDefault();
            if (iubox.IsFillImaged && e.srcElement == iubox.ClientDiv) {
                iubox.IsClicked = true;
                iubox.OrgPoint = new Object();
                iubox.OrgPoint.x = e.x;
                iubox.OrgPoint.y = e.y;
                iubox.OrgBPoint = new Object();

                var iw = iubox.Image.width * iubox.Scale;
                if (iubox.ClientDiv.style.backgroundPositionX == "")
                    iubox.OrgBPoint.x = (iubox.ClientDiv.clientWidth - iw) / 2;
                else
                    iubox.OrgBPoint.x = iubox.ClientDiv.style.backgroundPositionX.replace("px", "") * 1;

                var ih = iubox.Image.height * iubox.Scale;
                if (iubox.ClientDiv.style.backgroundPositionY == "")
                    iubox.OrgBPoint.y = (iubox.ClientDiv.clientHeight - ih) / 2;
                else
                    iubox.OrgBPoint.y = iubox.ClientDiv.style.backgroundPositionY.replace("px", "") * 1;

                iubox.ClientDiv.style.cursor = "move";
                iubox.ClientDiv.setCapture();
            }

        }

        iubox.ClientDiv.onmouseup = function (e) {
            if (iubox.IsFillImaged) {
                iubox.IsClicked = false;
                iubox.OrgPoint = null;
                iubox.ClientDiv.style.cursor = "default";
                iubox.ClientDiv.releaseCapture && iubox.ClientDiv.releaseCapture();
            }
        }

        iubox.ClientDiv.onmousewheel = function (e) {
            e.cancelBubble = true;
            e.preventDefault();
            if (iubox.IsFillImaged) {
                var w = iubox.Image.width;
                var h = iubox.Image.height;

                if (window.event.wheelDelta > 0)
                    iubox.Scale += 0.02;
                else
                    iubox.Scale -= 0.02;

                w = w * iubox.Scale;
                h = h * iubox.Scale;

                iubox.ClientDiv.style.backgroundSize = w + "px " + h + "px";
            }

        }

        iubox.ClientDiv.onmousemove = function (e) {

            if (iubox.IsClicked) {

                e.cancelBubble = true;

                var xc = (iubox.OrgBPoint.x + (e.x - iubox.OrgPoint.x)) + "px";
                var yc = (iubox.OrgBPoint.y + (e.y - iubox.OrgPoint.y)) + "px";

                iubox.ClientDiv.style.backgroundPositionX = xc;
                iubox.ClientDiv.style.backgroundPositionY = yc;


            }

        }

        iubox.ClientDiv.onmouseenter = function (e) {

            iubox.ToolDiv.style.display = "block";
        }

        iubox.ClientDiv.onmouseout = function (e) {

            var rect = iubox.ClientDiv.getBoundingClientRect();




            if (!iubox.IsClicked && (e.pageX < rect.left || e.pageY < rect.top || e.pageX > rect.right || e.pageY > rect.bottom)) {

                iubox.ToolDiv.style.display = "none";

            }

        }

    }

    iubox.UploadImage = function () {

        var xml = document.createElementNS("", "Image");

        var iw = iubox.Image.width * iubox.Scale;
        var offsetx = "0";
        var bp_x = iubox.ClientDiv.style.backgroundPositionX;
        var bp_y = iubox.ClientDiv.style.backgroundPositionY;

        if (bp_x != "")
            offsetx = bp_x.replace("px", "");
        else
            offsetx = (iubox.ClientDiv.clientWidth - iw) / 2;

        if (iubox.ClientDiv.clientWidth > iw || bp_x.indexOf('px')<0)
            offsetx = "0";

        xml.setAttribute("OffsetX", offsetx);

        var ih = iubox.Image.height * iubox.Scale;

        var offsety = "0";
        if (bp_y != "")
            offsety = bp_y.replace("px", "");
        else
            offsety = (iubox.ClientDiv.clientHeight - ih) / 2;

        if (iubox.ClientDiv.clientHeight > ih || bp_y.indexOf('px')<0)
            offsety = "0";

        xml.setAttribute("OffsetY", offsety);

        xml.setAttribute("Scale", iubox.Scale.toString());
        xml.setAttribute("Height", iubox.ClientDiv.clientHeight);
        xml.setAttribute("Width", iubox.ClientDiv.clientWidth);

        if(bp_x.indexOf('px')<0 || bp_y.indexOf('px')<0){
            xml.setAttribute("Height", iubox.Image.height);
            xml.setAttribute("Width", iubox.Image.width);
        }

        if (iubox.pictureSize == "")
            iubox.pictureSize = iubox.ClientDiv.clientWidth + "," + iubox.ClientDiv.clientHeight;

        xml.setAttribute("PictureSize", iubox.pictureSize);

        var xmlserialer = new window.XMLSerializer();
        var xmldata = xmlserialer.serializeToString(xml);

        var formdata = new FormData();
        formdata.append("ImageFile", iubox.File.files[0]);
        formdata.append("ImageCroper", xmldata);

        iubox.ProgDiv.style.display = "block";

        var reg = new RegExp("%", "g"); //创建正则RegExp对象

        iubox.action = iubox.action.replace(reg, "");

        DBFX.Net.WebClient.ExecuteWebRequest(iubox.action, "POST", iubox.OnUploadImageCompleted, iubox, formdata, function (e) {

            iubox.Progress.max = 100;
            iubox.Progress.value = ((e.loaded / e.total) * 100).toFixed(0);
            var pv = 0;
            pv = (e.loaded / e.total) * 100;
            iubox.ProgSpan.innerText = pv.toFixed(2) + "%";

        });



    }

    iubox.OnUploadImageCompleted = function (respjson, ctx) {
        iubox.ProgDiv.style.display = "none";
        var resp = eval(respjson)[0];
        if (resp.State == 0) {
            var jsonStr = resp.JSonData.replace(/ISODate\(/g,'');
            jsonStr = jsonStr.replace(/\)/g,'');
            var updata = JSON.parse(jsonStr);

            iubox.IsFillImaged = false;
            iubox.UploadButton.disabled = true;

            iubox.Image.src = "";
            iubox.ClientDiv.style.backgroundImage = "";

            iubox.Scale = 1;
            // iubox.ClientDiv.style.backgroundSize = "";
            // iubox.ClientDiv.style.backgroundPositionX = "";
            // iubox.ClientDiv.style.backgroundPositionY = "";
            iubox.Image.src = updata.Url;
            iubox.ClientDiv.style.backgroundImage = "url('" + updata.Url + "')";

            iubox.SetValue(updata.Url);

            iubox.OnValueChanged();


        }
        else {



        }


    }

    iubox.OnValueChanged = function (e) {

        if (iubox.ValueChanged != undefined && typeof iubox.ValueChanged == "function")
            iubox.ValueChanged(iubox, event);

        if (iubox.ValueChanged != undefined && iubox.ValueChanged.GetType() == "Command") {

            iubox.ValueChanged.Sender = iubox;
            iubox.ValueChanged.Execute();
        }


    }

    iubox.DblClick = function (e) {

        //iubox.IsClicked = false;
        //iubox.OrgPoint = null;

        //iubox.BrowseFile();

    }

    iubox.IsFillImaged = false;
    iubox.title = "图片上传";
    iubox.BrowseFile = function (e) {


        //浏览文件
        if (typeof Dbsoft != 'undefined') {
            try {
                var reg = new RegExp("%", "g"); //创建正则RegExp对象
                iubox.action = iubox.action.replace(reg, "");
                var req = {};
                req.Title = iubox.title;
                req.Action = iubox.Action;

                if (req.Action.indexOf("http") != 0) {

                    req.Action = window.location.protocol + "//" + window.location.host + "/" + req.Action;
                }

                var w = iubox.VisualElement.clientWidth;
                var h = iubox.VisualElement.clientHeight;

                if (iubox.pictureSize != undefined && iubox.pictureSize != "") {


                    var sz = iubox.pictureSize.split(",");
                    if (sz.length > 1) {
                        w = sz[0] * 1;
                        h = sz[1] * 1;
                    }

                }

                req.ImageTypes = [{ Text: "缩略图", ImageUrl: iubox.imageurl, Width: w, Height: h }];
                var itjson = Dbsoft.System.UploadImages(JSON.stringify(req));
                var imgtypes = JSON.parse(itjson);
                var udata = [{ State: 0, JSonData: "{}" }];
                udata[0].JSonData = JSON.stringify({ Url: imgtypes.ImageTypes[0].ImageUrl });
                iubox.OnUploadImageCompleted(JSON.stringify(udata));
            }
            catch (ex) {

            }

        }
        else {
            iubox.File.click();

        }

    }

    iubox.LoadPicture = function () {

        if (iubox.File.files.length > 0) {
            //document.title = iubox.File.files[0].name;
            var reader = new FileReader();
            reader.onload = function (evt) {

                var ctype = evt.target.result.split(";")[0].split(":")[1].split("/")[1];
                if (iubox.filter == null || iubox.filter.indexOf(ctype) >= 0) {
                    iubox.IsFillImaged = true;
                    iubox.UploadButton.disabled = false;
                    iubox.Scale = 1;
                    // iubox.ClientDiv.style.backgroundSize = "";
                    // iubox.ClientDiv.style.backgroundPositionX = "";
                    // iubox.ClientDiv.style.backgroundPositionY = "";
                    iubox.Image.src = evt.target.result;
                    iubox.ClientDiv.style.backgroundImage = "url('" + evt.target.result + "')";
                    //iubox.SetValue(iubox.Image.src);
                }
                else {

                }
            }


            reader.readAsDataURL(iubox.File.files[0]);

        }

    }

    iubox.SetValue = function (v) {


        iubox.ImageUrl = v;

        if (iubox.dataBindings != undefined && iubox.dataContext != undefined) {

            iubox.dataContext[iubox.dataBindings.Path] = v;

        }

        iubox.RegisterFormContext();

    }

    //注册表单上下文
    iubox.RegisterFormContext = function () {

        if (iubox.FormContext != null && iubox.dataProperty != "" && iubox.dataProperty != undefined) {
            if (iubox.dataDomain != undefined && iubox.dataDomain != "") {

                var ddv = iubox.FormContext[iubox.dataDomain];
                if (ddv == undefined)
                    iubox.FormContext[iubox.dataDomain] = new DBFX.DataDomain();

                iubox.FormContext[iubox.dataDomain][iubox.dataProperty] = iubox.ImageUrl;

            }
            else {
                iubox.FormContext[iubox.dataProperty] = iubox.ImageUrl;
            }
        }

    }


    iubox.GetValue = function () {

        return iubox.imageurl;

    }

    Object.defineProperty(iubox, "Filter", {
        get: function () {
            return iubox.filter;

        },
        set: function (v) {

            iubox.filter = v;
        }
    });

    Object.defineProperty(iubox, "ImageUrl", {
        get: function () {

            return iubox.imageurl;

        },
        set: function (v) {
            if (v != undefined)
                v = v.replace("http://wfs.dbazure.cn", "https://wfs.dbazure.cn")

            iubox.imageurl = v;
            iubox.Image.src = v;
            if (v != undefined && v != "")
                iubox.ClientDiv.style.backgroundImage = "url('" + v + "')";

            if (v != undefined && v != null && v != "")
                iubox.ToolDiv.style.display = "none";
            else
                iubox.ToolDiv.style.display = "";

            iubox.Scale = 1;
            // iubox.ClientDiv.style.backgroundSize = "";
            // iubox.ClientDiv.style.backgroundPositionX = "";
            // iubox.ClientDiv.style.backgroundPositionY = "";
            // iubox.ClientDiv.style.backgroundSize = "contain";

        }
    });

    iubox.pictureSize = "";
    Object.defineProperty(iubox, "PictureSize", {
        get: function () {

            return iubox.pictureSize;

        },
        set: function (v) {

            iubox.pictureSize = v;

        }
    });

    //定义验证规则属性
    Object.defineProperty(iubox, "CheckRule", {
        get: function () {
            return iubox.checkRule;

        },
        set: function (v) {
            iubox.checkRule = v;
            if (v != null && v != undefined && v != "") {
                //tbx.TextBox.style.color = "rgba(255,0,0,0.3)";
            }
        }
    });


    Object.defineProperty(iubox, "Action", {
        get: function () {

            return iubox.action;

        },
        set: function (v) {
            iubox.action = app.EnvironVariables.ParsingToString(v);
        }
    });


    iubox.SetEnabled = function (v) {

        if (v == true) {

            iubox.ToolDiv.style.visibility = "visible";
        }
        else {

            iubox.ToolDiv.style.visibility = "hidden";
        }

        iubox.Opacity = 1;
    }

    iubox.Validate = function () {
        var that = iubox;
        if(that.Display == 'none' || that.Visibled == false || that.Enabled == false){
            return true;
        }
        var r = true;

        if (iubox.checkRule != "" && iubox.checkRule != undefined) {

            if (iubox.NBC == undefined)
                iubox.NBC = iubox.BorderColor;

            if (iubox.imageurl == undefined || iubox.imageurl == "" || iubox.imageurl.length > 1000) {

                r = false;
                iubox.BorderColor = "red";

            }
            else {

                iubox.BorderColor = iubox.NBC;

            }
        }

        return r;

    }

    iubox.OnCreateHandle();
    return iubox;

}


//图片浏览器
DBFX.Web.Controls.ImageViewer = function () {

    var imgv = new DBFX.Web.Controls.Control("ImageViewer");
    imgv.VisualElement = document.createElement("DIV");
    imgv.OnCreateHandle();
    imgv.OnCreateHandle = function ()
    {
        imgv.className="ImageViewer_Div"
        imgv.innerHTML = "";


    }

    //项目源
    Object.defineProperty(imgv, "ItemSource", {
        get: function () {

            return imgv.itemSource;
        },
        set: function (v) {

            imgv.itemSource = v;

        }
    });

    //下载文件
    imgv.DownLoadFiles = function () {




    }

    //关闭
    imgv.Close = function () {



    }

    //显示
    imgv.FullScreen = function () {



    }

    //创建图片列表
    imgv.CreateImageList = function ()
    {

        imgv.itemSource.forEach(function (img) {



        });


    }

    imgv.OnCreateHandle();
    return imgv;

}


//Web文件系统浏览器
/*
 AppId UId OwnerId Filter Path
 wcmd 0 浏览 1 上传 2下载 3创建文件夹 4删除文件夹 5 删除文件 6 返回
*/
DBFX.Web.Controls.WebFSExplorer = function () {

    var wfsv = new DBFX.Web.Controls.Control("WebFSExplorer");
    wfsv.ClassDescriptor.DisplayName = "Web文件系统";
    wfsv.ClassDescriptor.Description = "Web文件系统";
    wfsv.ClassDescriptor.Serializer = "DBFX.Serializer.WebFSExplorer";
    wfsv.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.WebFSExplorerDesigner");
    wfsv.VisualElement = document.createElement("DIV");
    wfsv.OnCreateHandle();

    wfsv.OnCreateHandle = function () {
        wfsv.VisualElement.className = "WebFSExplorer";
        wfsv.VisualElement.innerHTML = "<INPUT type=\"file\" class=\"WebFSExplorer_File\" style=\"width:1px; height:1px\"/>";
        wfsv.File = wfsv.VisualElement.querySelector("INPUT.WebFSExplorer_File");
        wfsv.File.onchange = wfsv.OnUploadImage;
        wfsv.ClientDiv = wfsv.VisualElement;
        wfsv.rvpnl = new DBFX.Web.Controls.Panel();
        wfsv.rvpnl.Shadow = "none";
        wfsv.AddControl(wfsv.rvpnl);
        wfsv.rvpnl.FormContext = new Object();
        wfsv.rvpnl.FormControls = new Object();
        wfsv.rvpnl.FormContext.Form = wfsv.rvpnl;

        wfsv.LoadUIResource();
        wfsv.Action = "https://wfs.dbazure.cn/wfs.ashx?AppId=%appid%&UId=%uid%&OwnerId=%ownerid%&filter=jpg|png|gif";
        wfsv.model = 1;
    }

    //加载资源
    wfsv.LoadUIResource = function () {

        DBFX.Resources.LoadResource("Themes/" + app.CurrentTheme + "/ControlTemplates/WebFSExplorer.scrp", function (rvpnl) {


            wfsv.ListView = rvpnl.FormContext.Form.FormControls["WebFSListView"];
            wfsv.TreeView = rvpnl.FormContext.Form.FormControls["FolderTree"];

            wfsv.ToolStrip = rvpnl.FormContext.Form.FormControls["WebFSToolStrip"];
            wfsv.ToolStrip.ToolStripItemClick = wfsv.ToolStripItemClick;
            wfsv.ResViewPanel = rvpnl;
            wfsv.ListView.ItemTemplateSelector = wfsv.FileTemplateSelector;

            wfsv.LoadWebFSResource();

            wfsv.ListView.SelectedItemDblClick = wfsv.SelectedItemDoubleClick;
            wfsv.ListView.SelectedItemChanged = wfsv.OnResourceItemSelected;

            wfsv.CurrentPath = "";
            if (wfsv.TreeView != undefined) {
                wfsv.TreeView.TreeListNodeClick = function (tnode) {
                    wfsv.TreeNodeLoadChild(tnode);

                }
            }

            wfsv.Model = wfsv.model;
            if (wfsv.DesignTime) {

                wfsv.VisualElement.removeChild(wfsv.DesignPan.VisualElement);
                wfsv.VisualElement.appendChild(wfsv.DesignPan.VisualElement);
            }

        }, wfsv.rvpnl);

    }
    //设置模式
    wfsv.SetModel = function (model) {
        if (wfsv.rvpnl) {
            wfsv.TreeListPanel = wfsv.rvpnl.FormContext.Form.FormControls["FolderTree"];
            wfsv.WebFSSplitter = wfsv.rvpnl.FormContext.Form.FormControls["WebFSSplitter"];

            if (wfsv.TreeListPanel != undefined) {
                wfsv.Tool4 = wfsv.rvpnl.FormContext.Form.FormControls["4"];

                if (model != 1) {
                    wfsv.TreeListPanel.Display = "none";
                    wfsv.Tool4.Display = "none";
                    wfsv.WebFSSplitter.Display = "none";

                } else {
                    wfsv.TreeListPanel.Display = "";
                    wfsv.Tool4.Display = "";
                    wfsv.WebFSSplitter.Display = "";
                }

                wfsv.TreeListPanel.Parent.ReLayoutControls();
            }

        }
    }
    wfsv.TreeNodeLoadChild = function (tnode) {
        wfsv.CurrentFolder = tnode;
        wfsv.CurrentPath = tnode.dataContext.ParentDir + (tnode.dataContext.ParentDir.length > 0 ? "/" : "") + tnode.dataContext.Name;
        wfsv.browserTempAction = wfsv.browserAction + wfsv.CurrentPath;
        wfsv.LoadWebFSResource();
    }

    //选中
    wfsv.OnResourceItemSelected = function (lvw, item) {
        wfsv.SelectedItem = item;
        if (wfsv.ResourceItemSelected != null && wfsv.ResourceItemSelected != undefined) {
            wfsv.ResourceItemSelected(item);
        }


        //20200407 加载更多模板点击
        if (item.DataContext.FileType == "loadmore") {
            //移除加载更多模板
            wfsv.ListView.RemoveItem(item);
            var moreData = wfsv.SliceData(wfsv.CurrentPage, 50);
            //加载新的20条数据
            for (var i = 0; i < moreData.length; i++) {
                wfsv.ListView.AddItem(moreData[i]);
            }

            wfsv.CurrentPage++;
        }
    }
    //加载资源
    wfsv.LoadWebFSResource = function () {


        var formdata = new FormData();
        wfsv.HttpClient(wfsv.browserTempAction ? wfsv.browserTempAction : wfsv.browserAction, "POST", formdata, function (resp) {

            var resp = eval(resp)[0];
            if (resp.State == 0) {
                var jobj = eval("(" + resp.JSonData + ")");
                var files = jobj.Files;
                var dirs = jobj.Dirs;

                if (wfsv.CurrentFolder == undefined) {
                    var tnd = wfsv.TreeView.CreateTreeNode();
                    wfsv.TreeView.AddNode(tnd);
                    tnd.DataContext = { Name: "", Text: "Root", ParentDir: "", ExpandedImageUrl: "/themes/" + app.CurrentTheme + "/Images/WebFSExplorer/folder1.png", ImageUrl: "/themes/" + app.CurrentTheme + "/Images/WebFSExplorer/folder1.png" };
                    wfsv.CurrentFolder = tnd;
                }
                wfsv.CurrentFolder.ClearNodes();
                dirs.forEach(function (dir) {
                    var tnd = wfsv.TreeView.CreateTreeNode();
                    wfsv.CurrentFolder.AddNode(tnd);
                    dir.Text = dir.Name;
                    dir.ExpandedImageUrl = "/themes/" + app.CurrentTheme + "/Images/WebFSExplorer/folder1.png";
                    dir.ImageUrl = "/themes/" + app.CurrentTheme + "/Images/WebFSExplorer/folder1.png"
                    dir.TreeNode = tnd;
                    tnd.DataContext = dir;
                });

                //20200403==分页显示图片资源  每页显示20条
                // wfsv.ListView.ItemSource = dirs.concat(files);

                wfsv.TotalDatas = dirs.concat(files);
                wfsv.ShowData(wfsv.TotalDatas);
                wfsv.CurrentPage = 1;

            }

        }, function (e) {


        });
    }

    //20200403==分页显示图片资源  每页显示20条
    wfsv.CurrentPage = 0;
    wfsv.Pages = 0;
    wfsv.TotalDatas = [];
    wfsv.ShowData = function (data) {
        var len = data.length;
        // 总页数
        wfsv.Pages = Math.ceil(len / 20);

        var loadMoreObj = { FileType: "loadmore" };

        var perDataArray = [];
        if (len <= 100) {
            wfsv.ListView.ItemSource = data;
        } else {
            wfsv.ListView.ItemSource = wfsv.SliceData(0, 50);
        }
    }

    wfsv.SliceData = function (curP, perPageCount) {

        var arr = [];
        //总数据量
        var len = wfsv.TotalDatas.length;

        if (perPageCount * (curP + 1) > len) {
            return wfsv.TotalDatas.slice(curP * perPageCount, len);
        } else {
            return wfsv.TotalDatas.slice(curP * perPageCount, perPageCount * (curP + 1)).concat({ FileType: "loadmore" });
        }

    }


    //文件夹双击
    wfsv.SelectedItemDoubleClick = function (item) {

        if (item.dataContext.FileType.toLowerCase() == "folder") {
            //alert(item.dataContext.Name);
            wfsv.TreeNodeLoadChild(item.dataContext.TreeNode);
        }
    }

    //WebFSToolStrip ItemClick
    //wcmd 0 浏览 1 上传 2下载 3创建文件夹 4删除文件夹 5 删除文件 6 返回
    wfsv.ToolStripItemClick = function (tb, item) {
        if (item.Name == "1") {
            wfsv.File.click();
        } else if (item.Name == "0") {
            wfsv.LoadWebFSResource();
        } else if (item.Name == "2") {
            wfsv.DownLoadFile()
        } else if (item.Name == "3") {
            wfsv.NewPath();
        } else if (item.Name == "4") {
            wfsv.deletePath();
        } else if (item.Name == "6") {
            wfsv.backParentPath();
        } else if (item.Name == "7") {
            try {
                window.clipboardData.setData("Text", wfsv.SelectedItem.dataContext.Url);
            }
            catch (ex) {

                alert(ex.toString());
            }
        }
    }
    //POPUP 创建文件夹
    wfsv.CreatePopPanel = function () {
        wfsv.pop = DBFX.Web.Controls.PopupPanel();
        wfsv.pop.Width = "250px";
        wfsv.newFileTitle = DBFX.Web.Controls.TextBlock();
        wfsv.newFileTitle.Text = "创建文件夹";
        wfsv.newFileTitle.Display = "block";
        wfsv.pop.AddControl(wfsv.newFileTitle);
        wfsv.newFileText = DBFX.Web.Controls.TextBox();
        wfsv.newFileText.Width = "180px";
        wfsv.pop.AddControl(wfsv.newFileText);
        wfsv.newFileButton = DBFX.Web.Controls.Button("确定");
        wfsv.pop.AddControl(wfsv.newFileButton);
        wfsv.newFileButton.Click = function () {
            var formdata = new FormData();
            wfsv.HttpClient(wfsv.createPathAction + wfsv.CurrentPath + "/" + wfsv.newFileText.Value, "POST", formdata, function (respjson) {
                var resp = eval(respjson)[0];
                if (resp.State == 0) {
                    wfsv.pop.Close();
                    wfsv.LoadWebFSResource();
                }
            }, function (e) {


            });
        }
    }
    //创建文件夹
    wfsv.NewPath = function () {
        if (!wfsv.pop) {
            wfsv.CreatePopPanel();
        }
        wfsv.pop.Show(wfsv.newFileButton);
        //wfsv.pop.ShowAt(wfsv.newFileButton.VisualElement.clientLeft, wfsv.newFileButton.VisualElement.clientTop);

    }
    //删除文件 文件夹
    wfsv.deletePath = function () {
        if (wfsv.SelectedItem && wfsv.SelectedItem.dataContext.FileType.toLowerCase() == "folder") {
            var formdata = new FormData();
            wfsv.HttpClient(wfsv.deletePathAction + wfsv.CurrentPath + "/" + wfsv.SelectedItem.dataContext.Name, "POST", formdata, function (respjson) {
                var resp = eval(respjson)[0];
                if (resp.State == 0) {
                    wfsv.LoadWebFSResource();
                } else {
                    alert(resp.Exception);
                }
            }, function (e) {


            });
        } else if (wfsv.SelectedItem) {
            var formdata = new FormData();
            wfsv.HttpClient(wfsv.deleteFileAction + wfsv.CurrentPath + "/" + wfsv.SelectedItem.dataContext.FileName, "GET", formdata, function (respjson) {
                var resp = eval(respjson)[0];
                if (resp.State == 0) {

                    wfsv.LoadWebFSResource();
                }
            }, function (e) {


            });
        }

    }
    //返回上一层文件夹
    wfsv.backParentPath = function () {
        if (wfsv.CurrentFolder && wfsv.CurrentFolder.ParentNode) {
            wfsv.TreeNodeLoadChild(wfsv.CurrentFolder.ParentNode);

        }

    }
    //下载文件
    wfsv.DownLoadFile = function () {
        if (wfsv.SelectedItem && wfsv.SelectedItem.dataContext.FileType.toLowerCase() != "folder") {
            var formdata = new FormData();
            wfsv.HttpClient(wfsv.downloadAction + wfsv.CurrentPath + "/" + wfsv.SelectedItem.dataContext.FileName, "POST", formdata, function (respjson) {
                var resp = eval(respjson)[0];
                if (resp.State == 0) {

                    wfsv.LoadWebFSResource();
                }
            }, function (e) {


            });
        }

    }
    //上传图片
    wfsv.OnUploadImage = function () {
        var formdata = new FormData();
        formdata.append("ImageFile", wfsv.File.files[0]);
        wfsv.HttpClient(wfsv.uploadAction + wfsv.CurrentPath, "POST", formdata, function (respjson) {
            var resp = eval(respjson)[0];
            if (resp.State == 0) {
                wfsv.LoadWebFSResource();
            }
        }, function (e) {


        });
    }
    //网络接口
    wfsv.HttpClient = function (Action, Method, FormData, callback, progress) {
        DBFX.Net.WebClient.ExecuteWebRequest(Action, Method, callback, wfsv, FormData, progress);
    }
    //0正常 1选定 2编辑
    wfsv.FileTemplateSelector = function (file, selected) {

        var ext = file ? file.FileType.toLowerCase() : '';
        var template = "all";
        for (var key in wfsv.ListView.Templates) {

            if (key.indexOf(ext) >= 0) {
                template = key;
                if (selected == 1) {
                    template = template + "selected";
                }
                break;
            }
        }
        return template;

    }

    wfsv.Controls = new Array();
    wfsv.AddControl = function (c) {
        wfsv.Controls.push(c);
        wfsv.ClientDiv.appendChild(c.VisualElement);
        if (c.FormContext == undefined)
            c.FormContext = wfsv.FormContext;
        c.DataContext = wfsv.DataContext;

    }

    //
    wfsv.Clear = function () {

        wfsv.Controls = new Array();
        wfsv.ClientDiv.innerHTML = "";
    }
    Object.defineProperty(wfsv, "Action", {
        get: function () {
            return wfsv.baseAction;

        },
        set: function (v) {
            wfsv.baseAction = app.EnvironVariables.ParsingToString(v);//v != undefined ? v.replace("%appid%", app.EnvironVariables.AppId).replace("%uid%", app.EnvironVariables.UId).replace("%ownerid%", app.EnvironVariables.OwnerId).replace("%developing_appid%", app.EnvironVariables.Developing_AppId) : "";// v.replace("%currenttheme%", app.CurrentTheme);
            wfsv.uploadAction = wfsv.baseAction + "&wcmd=1&Path=";
            wfsv.browserAction = wfsv.baseAction + "&wcmd=0&Path=";
            wfsv.downloadAction = wfsv.baseAction + "&wcmd=2&Path=";
            wfsv.createPathAction = wfsv.baseAction + "&wcmd=3&Path=";
            wfsv.deleteFileAction = wfsv.baseAction + "&wcmd=5&Path=";
            wfsv.deletePathAction = wfsv.baseAction + "&wcmd=4&Path=";
        }
    });

    //1简单模式 上传浏览 新建 2 高级功能 All
    Object.defineProperty(wfsv, "Model", {
        get: function () {
            return wfsv.model;

        },
        set: function (v) {
            wfsv.model = v;
            wfsv.SetModel(v);
        }
    });



    wfsv.OnCreateHandle();
    return wfsv;

}


//网页表单控件用于局部执行httpPost
DBFX.Web.Controls.WebPageForm = function () {

    var wform = new DBFX.Web.Controls.Control("WebForm");
    wform.ClassDescriptor.Serializer = "DBFX.Serializer.WebPageFormSerializer";
    wform.OnCreateHandle();
    wform.OnCreateHandle = function () {

        wform.VisualElement.innerHTML = "<FORM class=\"WebPageForm\" enctype=\"multipart/form-data\"  />";
        wform.PageForm = wform.VisualElement.children[0];
        wform.PageForm.onsubmit = function () {
            return false;
        }
    }

    wform.Controls = new DBFX.Web.Controls.ControlsCollection(wform);

    wform.AddControl = function (c) {

        wform.Controls.push(c);
        wform.PageForm.appendChild(c.VisualElement);

    }

    wform.AddField = function (name, value) {

        var input = document.createElement("INPUT");
        input.name = name;
        input.value = value;
        wform.PageForm.appendChild(input);

    }

    wform.Submit = function () {

        var formdata = new FormData(wform.PageForm);

        DBFX.Net.WebClient.ExecuteWebRequest(wform.Action, "POST", wform.SubmitCompleted,wform,formdata, wform.SubmitProgress);


    }

    wform.SubmitCompleted = function (resp,ctxobj) {

        alert(resp);

    }

    wform.SubmitProgress = function (e) {

        //document.title = "Uploading:" + (e.loaded / e.total) * 100;

    }

    //
    Object.defineProperty(wform, "Action", {
        get: function () {
            return wform.action;

        },
        set: function (v) {

            wform.action = v;

        }

    });

    Object.defineProperty(wform, "FormName", {
        get: function () {

            return wform.PageForm.name;

        },
        set: function (v) {

            wform.PageForm.name = v;

        }

    });

    wform.OnCreateHandle();
    return wform;
}

//加载动画对象
DBFX.Web.Controls.LoadingPanel = new Object();
DBFX.Web.Controls.LoadingPanel.IsClose = true;
DBFX.Web.Controls.LoadingPanel.PanelElement = null;
DBFX.Web.Controls.LoadingPanel.LoadingAni = null;

DBFX.Web.Controls.LoadingPanel.TCount = 0;
DBFX.Web.Controls.LoadingPanel.Show = function (t) {

    if (DBFX.Web.Controls.LoadingPanel.PanelElement == undefined || DBFX.Web.Controls.LoadingPanel.PanelElement == null) {

        DBFX.Web.Controls.LoadingPanel.PanelElement = document.createElement("DIV");
        DBFX.Web.Controls.LoadingPanel.PanelElement.className = "LoadingPanel";
        DBFX.Web.Controls.LoadingPanel.PanelElement.innerHTML = "<DIV class=\"LoadingAni\"><IMG class=\"LoadingAniImage\"  /><SPAN class=\"LoadingAniSpan\">加载中，请稍后...</SPAN></DIV>";
        DBFX.Web.Controls.LoadingPanel.TextSpan = DBFX.Web.Controls.LoadingPanel.PanelElement.querySelector("SPAN.LoadingAniSpan");
        var img = DBFX.Web.Controls.LoadingPanel.PanelElement.querySelector("IMG.LoadingAniImage");
        img.src = "themes/" + app.CurrentTheme + "/images/loading1.gif";

    }

    if (t == undefined) {

        DBFX.Web.Controls.LoadingPanel.TextSpan.innerText = "加载中，请稍后...";
    }
    else
        DBFX.Web.Controls.LoadingPanel.TextSpan.innerText = t;

    //显示加载图标
    if (DBFX.Web.Controls.LoadingPanel.IsClose) {

        document.body.appendChild(DBFX.Web.Controls.LoadingPanel.PanelElement);

    }

    DBFX.Web.Controls.LoadingPanel.TCount++;
    DBFX.Web.Controls.LoadingPanel.IsClose = false;

}

DBFX.Web.Controls.LoadingPanel.Close = function () {

    DBFX.Web.Controls.LoadingPanel.TCount--;
    if (DBFX.Web.Controls.LoadingPanel.TCount < 0)
        DBFX.Web.Controls.LoadingPanel.TCount = 0;

    if (!DBFX.Web.Controls.LoadingPanel.IsClose && DBFX.Web.Controls.LoadingPanel.TCount==0)
    {
        document.body.removeChild(DBFX.Web.Controls.LoadingPanel.PanelElement);
        DBFX.Web.Controls.LoadingPanel.IsClose = true;

    }

}

//搜索栏
DBFX.Web.Controls.SearchBar = function () {

    var sbar = new DBFX.Web.Controls.Control("SearchBar");
    sbar.ClassDescriptor.Serializer = "DBFX.Serializer.SearchBarSerializer";
    sbar.OnCreateHandle();
    sbar.OnCreateHandle = function () {

        sbar.VisualElement.innerHTML = "<DIV class=\"SearchBar\" ><DIV class=\"SearchBar_TipLabel\"></DIV><DIV class=\"SearchBar_TBDiv\"><INPUT class=\"SearchBar_TextBox\" /></DIV><IMG class=\"SearchBar_Button\" /></DIV>";
        sbar.ClientDiv = sbar.VisualElement.querySelector("DIV.SearchBar");
        sbar.TextBox = sbar.VisualElement.querySelector("INPUT.SearchBar_TextBox");
        sbar.SearchButton = sbar.VisualElement.querySelector("IMG.SearchBar_Button");
        sbar.TipLable = sbar.VisualElement.querySelector("DIV.SearchBar_TipLabel");

        sbar.TextBox.onchange = sbar.TextBoxChanged;
        sbar.SearchButton.onclick = sbar.OnSearching;
        sbar.SearchButton.src = "Themes/" + app.CurrentTheme + "/Images/SearchBar/Search.png";
        sbar.TextBox.onkeyup = sbar.TextBoxKeyUp;
    }

    Object.defineProperty(sbar, "TipText", {
        get: function () {
            return sbar.TipLable.innerText;
        },
        set: function (v) {
            if (v == null || v == undefined)
                sbar.TipLable.innerText = "";
            else
                sbar.TipLable.innerText = v;
        }
    });

    sbar.SetText = function (v) {

        sbar.TextBox.value = v;
        if(v!=undefined && v!=null && v!="")
            sbar.TipLable.style.display = "none";

    }

    sbar.SetValue = function (v) {

        sbar.TextBox.value = v;
        if (v != undefined && v != null && v != "")
            sbar.TipLable.style.display = "none";

    }


    sbar.GetText = function () {

        return sbar.TextBox.value;
    }

    sbar.TextBoxChanged = function (e) {


        if (sbar.dataBindings != undefined && sbar.dataContext != undefined) {

            sbar.dataContext[sbar.dataBindings.Path] = sbar.TextBox.value;

        }
        if (sbar.FormContext != null && sbar.dataProperty != "")
            sbar.FormContext[sbar.dataProperty] = sbar.TextBox.value;


    }

    sbar.TextBoxKeyUp = function (e) {

        if (sbar.TextBox.value != "")
            sbar.TipLable.style.display = "none";
        else
            sbar.TipLable.style.display = "";
    }

    sbar.OnSearching = function (e) {

        if (sbar.Searching != undefined)
            sbar.Searching(sbar);

        if (sbar.Command != undefined && sbar.Command != null) {
            sbar.Command.Sender = sbar;
            sbar.Command.Execute();
        }
    }


    sbar.OnCreateHandle();
    return sbar;

}

//控件模板
DBFX.Web.Controls.ControlTemplate = function (xtemplate,key,uri) {

    var template = new UIObject("ControlTemplate");
    if (xtemplate == undefined) {
        var xdoc = (new DOMParser()).parseFromString("<Templates></Templates>", "text/xml");
        xtemplate = xdoc.createElement("t");
        xtemplate.setAttribute("Key",key);
        xtemplate.setAttribute("Uri",uri);
    }
    template.XTemplate = xtemplate;
    //模板关键字
    Object.defineProperty(template, "Keyword", {
        get: function () {
            return key;
        },
        set: function (v) {
            key=v;
        }
    });
    //模板Uri
    Object.defineProperty(template, "Uri", {
        get: function () {
            return uri;
        },
        set: function (v) {
            uri=v;
        }
    });
    //创建列表视图项目
    template.Serializer = new DBFX.Serializer.TemplateSerializer();
    template.CreateUIElement = function (control,cflag) {


        if (control == undefined || control == null) {
            control = new DBFX.Web.Controls.Panel("Template");
        }
        else {

            if(cflag==undefined)
                control.Clear();

        }
        //创建模板
        template.Serializer.DeSerialize(control, template.XTemplate, template.Namespaces);

        return control;

    }

    template.Serialize = function (cp) {

        var xdoc = (new DOMParser()).parseFromString("<Templates></Templates>", "text/xml");
        xtemplate = xdoc.createElement("t");
        xtemplate.setAttribute("Key", template.Keyword);
        xtemplate.setAttribute("Uri", template.Uri);
        template.XTemplate = xtemplate;
        template.Serializer.Serialize(cp, template.XTemplate, template.Namespaces);

    }


    return template;


}

//扫码按钮
DBFX.Web.Controls.AppSearchBar = function () {

    var asb = new DBFX.Web.Controls.Control("AppSearchBar");

    asb.OnCreateHandle = function () {

        asb.VisualElement.innerHTML = "<DIV class=\"AppSearchBarTopMargin\"></DIV><IMG class=\"ScanCodeButtonImage\"  /><DIV class=\"MessengerButton\"><DIV class=\"MessageCounter\"></DIV><IMG class=\"MessageIcon\" /></DIV><DIV class=\"SearchInputBorder\"><IMG class=\"SearchIcon\" ></IMG><DIV class=\"SearchInputDIV\"><INPUT type=\"text\" class=\"SearchTextBox\"></INPUT></DIV></DIV>";
        asb.Class = "AppSearchBar";
        asb.ScanImage = asb.VisualElement.querySelector("IMG.ScanCodeButtonImage");
        asb.ScanImage.src = "themes/" + app.CurrentTheme + "/Images/AppSearchBar/Scancode.png";
        asb.ScanImage.onclick = asb.ScanCode;

        asb.SearchIcon = asb.VisualElement.querySelector("IMG.SearchIcon");
        asb.SearchIcon.src = "themes/" + app.CurrentTheme + "/Images/AppSearchBar/Search.png";

        asb.InputDiv = asb.VisualElement.querySelector("DIV.SearchInputBorder");
        asb.TextBox = asb.VisualElement.querySelector("INPUT.SearchTextBox");
        asb.MessageIcon = asb.VisualElement.querySelector("IMG.MessageIcon");
        asb.MessageIcon.src = "themes/" + app.CurrentTheme + "/Images/AppSearchBar/msg.png";

        asb.MsgCounter = asb.VisualElement.querySelector("DIV.MessageCounter");
        asb.MsgCounter.innerText = "12";
    }

    asb.ScanCode = function (e) {

        try{
            window.QRScan = function (data) {

                asb.TextBox.value = data;

                window.QRScan = undefined;

            }

            Dbsoft.System.Advance.QR.scan("QRScan");

        } catch (ex) {
            alert(ex);
        }

    }



    asb.OnCreateHandle();

    return asb;

}

//条码控件
DBFX.Web.Controls.BarCodeControl = function () {

    var bcc = new DBFX.Web.Controls.Control("BarCodeControl");
    bcc.ClassDescriptor.Serializer = "DBFX.Serializer.BarCodeControlSerializer";
    bcc.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.BarCodeControlDesigner");
    bcc.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.BaseBindingDesigner");
    bcc.VisualElement = document.createElement("DIV");

    bcc.OnCreateHandle();

    //创建句柄
    bcc.OnCreateHandle = function () {

        bcc.Class = "BarCodeControl";
        bcc.VisualElement.innerHTML = "<IMG class=\"BarCodeControl_Image\"></IMG>";
        bcc.barCodeImage = bcc.VisualElement.querySelector("IMG.BarCodeControl_Image");

    }

    //条码类型
    bcc.codeType = "QRCode";
    Object.defineProperty(bcc,"CodeType",{
        get:function()
        {
            return bcc.codeType;
        },
        set:function(v)
        {
            if (bcc.codeType != v) {
                bcc.codeType = v;
                bcc.GetBarCode();
            }
        }
    });

    //条码类型
    bcc.codeWidth = "300px";
    Object.defineProperty(bcc, "CodeWidth", {
        get: function () {
            return bcc.codeWidth;
        },
        set: function (v) {
            bcc.codeWidth = v;

        }
    });

    //条码类型
    bcc.codeHeight = "300px";
    Object.defineProperty(bcc, "CodeHeight", {
        get: function () {
            return bcc.codeHeight;
        },
        set: function (v) {
            bcc.codeHeight = v;

        }
    });

    bcc.codeValue = "";
    bcc.IsLoaded = false;
    //数据绑定
    bcc.SetValue = function (v) {

        if (bcc.codeValue == v)
            return;

        bcc.codeValue = v;
        if (v == undefined)
            v = "";

        if (bcc.IsLoaded==true)
            bcc.GetBarCode();

    }

    bcc.GetValue = function () {
        return bcc.codeValue;
    }

    bcc.GetBarCode = function () {

        bcc.barCodeImage.src = app.BCSvcUri + "?CodeType=" + bcc.codeType + "&Data=" + bcc.codeValue + "&W=" + bcc.codeWidth.replace("px", "") + "&H=" + bcc.codeHeight.replace("px", "");


    }

    bcc.SetText = function (v) {

        if (!bcc.DesignTime) {
            if (typeof v == "string" && v.indexOf("%") >= 0)
                v = app.EnvironVariables.ParsingToString(v);
        }
        bcc.SetValue(v);

    }

    bcc.GetText = function () {

        return bcc.codeValue;

    }


    bcc.OnCreateHandle();

    return bcc;

}
DBFX.Serializer.BarCodeControlSerializer = function () {


    //反系列化
    this.DeSerialize = function (c, xe, ns) {

        c.IsLoaded = true;
        c.GetBarCode();

    }


    //系列化
    this.Serialize = function (c, xe, ns) {

        var xdoc = xe.ownerDocument;
        DBFX.Serializer.SerialProperty("CodeType", c.CodeType, xe);
        DBFX.Serializer.SerialProperty("CodeWidth", c.CodeWidth, xe);
        DBFX.Serializer.SerialProperty("CodeHeight", c.CodeHeight, xe);
        DBFX.Serializer.SerialProperty("Value", c.Value, xe);

    }


}
DBFX.Design.ControlDesigners.BarCodeControlDesigner=function()
{

    var obdc = new DBFX.Web.Controls.GroupPanel();
    obdc.OnCreateHandle();
    obdc.OnCreateHandle = function () {


        DBFX.Resources.LoadResource("design/DesignerTemplates/FormDesignerTemplates/BarCodeControlDesigner.scrp", function (od) {

            od.DataContext = obdc.dataContext;

        }, obdc);


    }

    obdc.HorizonScrollbar = "hidden";
    obdc.OnCreateHandle();
    obdc.Class = "VDE_Design_ObjectGeneralDesigner";
    obdc.Text = "条码设置";
    return obdc;


}

//表单定时器
DBFX.Web.Controls.FormTimer= function () {

    var formtimer = new DBFX.Web.Controls.Control("FormTimer");
    formtimer.ClassDescriptor.DisplayName = "表单定时器";
    formtimer.ClassDescriptor.Description = "表单定时器，提供定时调用功能";
    formtimer.ClassDescriptor.Serializer = "DBFX.Serializer.FormTimerSerializer";
    formtimer.ClassDescriptor.Designers = ["DBFX.Design.ControlDesigners.ObjectGeneralDesigner", "DBFX.Design.ControlDesigners.FormTimerDesigner"];
    formtimer.ClassDescriptor.DesignTimePreparer = "DBFX.Design.FormTimerDesignTimePreparer";
    formtimer.VisualElement = document.createElement("DIV");

    formtimer.OnCreateHandle();

    //创建句柄
    formtimer.OnCreateHandle = function () {

        formtimer.Class = "FormTimer";

        formtimer.Timer = setTimeout(formtimer.Initalize, 100);

    }

    formtimer.Initalize = function () {

        clearTimeout(formtimer.Timer);
        formtimer.Timer = undefined;

        if (formtimer.DesignTime || formtimer.interval == "-1") {

            if(formtimer.DesignTime)
                formtimer.VisualElement.style.display = "inline-block";

            return;
        }


        formtimer.Start();


    }

    formtimer.Start = function () {

        if (formtimer.Timer != undefined || formtimer.interval < 0)
            return;


        if (formtimer.interval == 0)
            formtimer.Execute();
        else {

            formtimer.Timer = setInterval(formtimer.Execute, formtimer.interval);

        }


    }


    formtimer.Stop = function () {

        if (formtimer.Timer == undefined)
            return;



        if (formtimer.Timer != undefined)
            clearInterval(formtimer.Timer);

        formtimer.Timer = undefined;

    }


    //计时器间隔
    formtimer.interval = "-1";
    Object.defineProperty(formtimer, "Interval", {
        get: function () {
            return formtimer.interval;
        },
        set: function (v) {
            formtimer.interval = v;

        }
    });

    //执行命令
    formtimer.commandName = "";
    Object.defineProperty(formtimer, "CommandName", {
        get: function () {
            return formtimer.commandName;
        },
        set: function (v) {
            formtimer.commandName = v;

        }
    });

    //执行方式
    formtimer.executeMode = 0; //0- 单次 1-重复
    Object.defineProperty(formtimer, "ExecuteMode", {
        get: function () {

            return formtimer.executeMode;

        },
        set: function (v) {

            formtimer.executeMode = v;

        }
    });



    formtimer.Execute = function () {

        try{
            if (formtimer.TimerTick != undefined && formtimer.TimerTick.GetType()=="Command") {
                formtimer.TimerTick.Sender = formtimer;
                formtimer.TimerTick.Execute();
            }
        } catch (ex) {
            clearInterval(formtimer.Timer);
        }
        finally { }

    }

    formtimer.OnUnLoad = function () {

        if (formtimer.Timer != undefined)
            clearInterval(formtimer.Timer);

    }

    formtimer.SetDisplay = function (v) {

        if (!formtimer.DesignTime)
            formtimer.VisualElement.style.display = "";

    }

    formtimer.OnCreateHandle();

    return formtimer;

}
DBFX.Serializer.FormTimerSerializer = function () {


    //反系列化
    this.DeSerialize = function (c, xe, ns) {


        c.TimerTick = DBFX.Serializer.CommandNameToCmd(xe.getAttribute("CommandName"));
        DBFX.Serializer.DeSerializeCommand("TimerTick", xe, c);


    }


    //系列化
    this.Serialize = function (c, xe, ns) {

        var xdoc = xe.ownerDocument;
        DBFX.Serializer.SerialProperty("Interval", c.Interval, xe);
        DBFX.Serializer.SerialProperty("CommandName", c.CommandName, xe);
        DBFX.Serializer.SerializeCommand("TimerTick", c.TimerTick, xe);

    }


}
DBFX.Design.ControlDesigners.FormTimerDesigner = function () {

    var obdc = new DBFX.Web.Controls.GroupPanel();
    obdc.OnCreateHandle();
    obdc.OnCreateHandle = function () {


        DBFX.Resources.LoadResource("design/DesignerTemplates/FormDesignerTemplates/FormTimerDesigner.scrp", function (od) {

            od.DataContext = obdc.dataContext;

            od.EventListBox = od.FormContext.Form.FormControls.EventListBox;
            od.EventListBox.ItemSource = [{ EventName: "TimerTick", EventCode: undefined, Command: od.dataContext.TimerTick, Control: od.dataContext }];


        }, obdc);


    }

    obdc.BaseDataBind = obdc.DataBind;
    //
    obdc.DataBind = function (v) {

        if (obdc.EventListBox != undefined)
            obdc.EventListBox.ItemSource = [{ EventName: "TimerTick", EventCode: undefined, Command: obdc.dataContext.TimerTick, Control: obdc.dataContext }];


        obdc.BaseDataBind(v);
    }

    obdc.HorizonScrollbar = "hidden";
    obdc.OnCreateHandle();
    obdc.Class = "VDE_Design_ObjectGeneralDesigner";
    obdc.Text = "定时器设置";
    return obdc;


}
DBFX.Design.FormTimerDesignTimePreparer = function (ftimer, dp) {

    ftimer.VisualElement.appendChild(dp.VisualElement);
    dp.VisualElement.style.left = "0px";
    dp.VisualElement.style.top = "0px";
    dp.VisualElement.style.bottom = "0px";
    dp.VisualElement.style.right = "0px";
    ftimer.DesignTime = true;
    ftimer.VisualElement.style.display = "inline-block";
}

//消息监听器
DBFX.Web.Controls.NotificationWatcher = function () {

    var nwatcher = new DBFX.Web.Controls.Control("NotificationWatcher");
    nwatcher.ClassDescriptor.DisplayName = "消息监听器";
    nwatcher.ClassDescriptor.Description = "监听指定类型的消息信息";
    nwatcher.ClassDescriptor.Serializer = "DBFX.Serializer.NotificationWatcherSerializer";
    nwatcher.ClassDescriptor.Designers = ["DBFX.Design.ControlDesigners.ObjectGeneralDesigner", "DBFX.Design.ControlDesigners.NotificationWatcherDesigner"];
    nwatcher.ClassDescriptor.DesignTimePreparer = "DBFX.Design.NotificationWatcherDesignTimePreparer";
    nwatcher.VisualElement = document.createElement("DIV");

    nwatcher.OnCreateHandle();

    //创建句柄
    nwatcher.OnCreateHandle = function () {

        nwatcher.Class = "NotificationWatcher";

    }

    //加载控件
    nwatcher.OnLoad = function () {


        //注册消息监听器
        if (nwatcher.isCApp == true)
            nwatcher.appId = app.CurrentApp.AppId;

        if (nwatcher.WatchFilter==undefined)
            nwatcher.WatchFilter=app.Notifications.AddFilter(nwatcher.msgTypes, nwatcher.OnMsg, nwatcher.appId);

        //执行初始化程序
        if (nwatcher.WatcherOnLoad != undefined && nwatcher.WatcherOnLoad.GetType() == "Command") {

            nwatcher.WatcherOnLoad.Sender=nwatcher;
            nwatcher.WatcherOnLoad.Execute();
        }

    }


    nwatcher.OnMsg = function (m) {

        //alert("OnMSG:"+JSON.stringify(m));

        //消息回调方法
        if (nwatcher.WatcherOnMsg != undefined && nwatcher.WatcherOnMsg.GetType() == "Command") {
            nwatcher.MsgObject = m;
            nwatcher.WatcherOnMsg.Sender =nwatcher;
            nwatcher.WatcherOnMsg.Execute();

        }

    }

    //卸载控件
    nwatcher.OnUnLoad = function () {

        //注销消息监听器
        console.log("Notification Watcher UnLoad");
        if(nwatcher.WatchFilter!=undefined)
            app.Notifications.RemoveFilter(nwatcher.WatchFilter);

        //执行卸载程序
        if (nwatcher.WatcherUnLoad != undefined && nwatcher.WatcherUnLoad.GetType() == "Command") {


            nwatcher.WatcherUnLoad.Sender = nwatcher;
            nwatcher.WatcherUnLoad.Execute();

        }

    }

    nwatcher.msgTypes = "";
    Object.defineProperty(nwatcher, "MsgTypes", {
        get: function () {

            return nwatcher.msgTypes;

        },
        set: function (v) {

            nwatcher.msgTypes = v;

        }
    });

    nwatcher.isCApp = true;
    Object.defineProperty(nwatcher, "IsCApp", {
        get: function () {

            return nwatcher.isCApp;

        },
        set: function (v) {

            nwatcher.isCApp = v;

        }
    });

    nwatcher.global = false;
    Object.defineProperty(nwatcher, "Global", {
        get: function () {

            return nwatcher.global;

        },
        set: function (v) {

            if (v == true || v == "true")
                v = true;
            else
                v = false;

            nwatcher.global = v;

        }
    });


    //设置显示方式
    nwatcher.SetDisplay = function (v) {

        if (!nwatcher.DesignTime)
            nwatcher.VisualElement.style.display = "";

    }

    nwatcher.OnCreateHandle();

    return nwatcher;

}
DBFX.Serializer.NotificationWatcherSerializer = function () {


    //反系列化
    this.DeSerialize = function (c, xe, ns) {

        DBFX.Serializer.DeSerializeCommand("WatcherOnLoad", xe, c);
        DBFX.Serializer.DeSerializeCommand("WatcherOnMsg", xe, c);
        DBFX.Serializer.DeSerializeCommand("WatcherUnLoad", xe, c);

    }


    //系列化
    this.Serialize = function (c, xe, ns) {

        var xdoc = xe.ownerDocument;
        DBFX.Serializer.SerialProperty("MsgTypes", c.MsgTypes, xe);
        DBFX.Serializer.SerialProperty("AppId", c.AppId, xe);
        DBFX.Serializer.SerialProperty("CommandName", c.CommandName, xe);
        DBFX.Serializer.SerializeCommand("WatcherOnLoad", c.WatcherOnLoad, xe);
        DBFX.Serializer.SerializeCommand("WatcherOnMsg", c.WatcherOnMsg, xe);
        DBFX.Serializer.SerializeCommand("WatcherUnLoad", c.WatcherUnLoad, xe);
    }


}
DBFX.Design.ControlDesigners.NotificationWatcherDesigner = function () {

    var obdc = new DBFX.Web.Controls.GroupPanel();
    obdc.OnCreateHandle();
    obdc.OnCreateHandle = function () {


        DBFX.Resources.LoadResource("design/DesignerTemplates/FormDesignerTemplates/NotificationWatcherDesigner.scrp", function (od) {

            od.DataContext = obdc.dataContext;
            od.EventListBox = od.FormContext.Form.FormControls.EventListBox;
            od.EventListBox.ItemSource = [{ EventName: "WatcherOnLoad", EventCode: undefined, Command: od.dataContext.WatcherOnLoad, Control: od.dataContext }, { EventName: "WatcherOnMsg", EventCode: undefined, Command: od.dataContext.WatcherOnMsg, Control: od.dataContext }, { EventName: "WatcherUnLoad", EventCode: undefined, Command: obdc.dataContext.WatcherUnLoad, Control: obdc.dataContext }];


        }, obdc);


    }

    obdc.BaseDataBind = obdc.DataBind;
    //
    obdc.DataBind = function (v) {

        if (obdc.EventListBox != undefined)
            obdc.EventListBox.ItemSource = [{ EventName: "WatcherOnLoad", EventCode: undefined, Command: obdc.dataContext.WatcherOnLoad, Control: obdc.dataContext }, { EventName: "WatcherOnMsg", EventCode: undefined, Command: obdc.dataContext.WatcherOnMsg, Control: obdc.dataContext }, { EventName: "WatcherUnLoad", EventCode: undefined, Command: obdc.dataContext.WatcherUnLoad, Control: obdc.dataContext }];


        obdc.BaseDataBind(v);
    }

    obdc.HorizonScrollbar = "hidden";
    obdc.OnCreateHandle();
    obdc.Class = "VDE_Design_ObjectGeneralDesigner";
    obdc.Text = "消息监听器设置";
    return obdc;


}
DBFX.Design.NotificationWatcherDesignTimePreparer = function (ftimer, dp) {

    ftimer.VisualElement.appendChild(dp.VisualElement);
    dp.VisualElement.style.left = "0px";
    dp.VisualElement.style.top = "0px";
    dp.VisualElement.style.bottom = "0px";
    dp.VisualElement.style.right = "0px";
    ftimer.DesignTime = true;
    ftimer.VisualElement.style.display = "inline-block";
}


//表单定时器
DBFX.Web.Controls.RichTextBlock = function () {

    var rtbBox = new DBFX.Web.Controls.Control("RichTextBlock");
    rtbBox.ClassDescriptor.DisplayName = "富文本显示框";
    rtbBox.ClassDescriptor.Description = "显示HTML文本内容";
    rtbBox.ClassDescriptor.Serializer = "DBFX.Serializer.LabelBoxSerializer";
    rtbBox.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.LabelControlDesigner");
    rtbBox.VisualElement = document.createElement("DIV");

    rtbBox.OnCreateHandle();

    //创建句柄
    rtbBox.OnCreateHandle = function () {

        rtbBox.Class = "RichTextBlock";
        rtbBox.VisualElement.innerHTML = "<DIV class=\"RichTextBlockDIV\"></DIV>";
        rtbBox.RtbDiv = rtbBox.VisualElement.querySelector("DIV.RichTextBlockDIV");
    }

    rtbBox.SetText = function (v) {

        rtbBox.RtbDiv.innerHTML = v;

    }

    rtbBox.SetValue = function (v) {

        rtbBox.RtbDiv.innerHTML = v;

    }

    rtbBox.OnCreateHandle();

    return rtbBox;

}

//水平滚动条
DBFX.Web.Controls.HorizonScrollBar = function () {

    var hscb = new UIObject("HorizonScrollBar");
    hscb.VisualElement = document.createElement("DIV");
    hscb.OnCreateHandle();
    hscb.VisualElement.className = "HorizonScrollBar";
    hscb.VisualElement.innerHTML = "<DIV class=\"HSCB_LArrowDiv\"></DIV><DIV class=\"HSCB_TrackBar\"></DIV><DIV class=\"HSCB_RArrowDiv\"></DIV>";

    hscb.VisualElement.draggable = false;

    hscb.LArrow = hscb.VisualElement.querySelector("DIV.HSCB_LArrowDiv");
    hscb.LArrow.draggable = false;

    hscb.Tracker = hscb.VisualElement.querySelector("DIV.HSCB_TrackBar");
    hscb.Tracker.draggable = false;

    hscb.RArrow = hscb.VisualElement.querySelector("DIV.HSCB_RArrowDiv");
    hscb.RArrow.draggable = false;

    //处理点击事件
    hscb.VisualElement.onmousedown = function (e) {
        e.preventDefault();
        e.cancelBubble = true;
        //向左的按钮
        if (e.srcElement == hscb.LArrow) {


        }

        //向右的按钮
        if (e.srcElement == hscb.RArrow) {


        }

        //位置滑块
        if (e.srcElement == hscb.Tracker) {

            hscb.CP = { l: hscb.Tracker.offsetLeft, x: e.clientX };
            document.onmousemove = hscb.DocumentMouseMove;
            document.onmouseup = hscb.DocumentOnMouseUp;
        }

    }

    hscb.VisualElement.onmousewheel = function (e) {

        var hinc = e.wheelDelta / 10;
        var nx = (hscb.Tracker.offsetLeft - hinc);

        if (nx < hscb.LArrow.clientWidth)
            nx = hscb.LArrow.clientWidth;

        if (nx > hscb.RArrow.offsetLeft - hscb.Tracker.clientWidth)
            nx = hscb.RArrow.offsetLeft - hscb.Tracker.clientWidth;


        hscb.Tracker.style.left = nx + "px";
    }

    hscb.DocumentOnMouseUp = function (e) {


        e.preventDefault();
        e.cancelBubble = true;

        //取消全局鼠标移动事件跟踪
        if (document.onmousemove == hscb.DocumentMouseMove)
            document.onmousemove = undefined;

    }

    //
    hscb.DocumentMouseMove = function (e) {

        var hinc = e.clientX - hscb.CP.x;
        var nx = hscb.CP.l + hinc;

        if (nx < hscb.LArrow.clientWidth)
            nx = hscb.LArrow.clientWidth;

        if (nx > hscb.RArrow.offsetLeft - hscb.Tracker.clientWidth)
            nx = hscb.RArrow.offsetLeft - hscb.Tracker.clientWidth;

        hscb.Tracker.style.left = nx + "px";

    }



    return hscb;

}


//垂直滚动条
DBFX.Web.Controls.VerticalScrollBar = function () {

    var vscb = UIObject("VerticalScrollBar");
    vscb.VisualElement = document.createElement("DIV");
    vscb.OnCreateHandle();
    vscb.VisualElement.className = "VerticalScrollBar";
    vscb.VisualElement.innerHTML = "<DIV class=\"VSCB_TArrowDiv\"></DIV><DIV class=\"VSCB_TrackBar\"></DIV><DIV class=\"VSCB_BArrowDiv\"></DIV>";

    vscb.VisualElement.draggable = false;

    vscb.TArrow = vscb.VisualElement.querySelector("DIV.VSCB_TArrowDiv");
    vscb.TArrow.draggable = false;

    vscb.Tracker = vscb.VisualElement.querySelector("DIV.VSCB_TrackBar");
    vscb.Tracker.draggable = false;

    vscb.BArrow = vscb.VisualElement.querySelector("DIV.VSCB_BArrowDiv");
    vscb.BArrow.draggable = false;

    //处理点击事件
    vscb.VisualElement.onmousedown = function (e) {
        e.preventDefault();
        e.cancelBubble = true;
        //向左的按钮
        if (e.srcElement == vscb.TArrow) {


        }

        //向右的按钮
        if (e.srcElement == vscb.BArrow) {


        }

        //位置滑块
        if (e.srcElement == vscb.Tracker) {

            vscb.CP = { t: vscb.Tracker.offsetTop, x: e.clientY };
            document.onmousemove = vscb.DocumentMouseMove;
            document.onmouseup = vscb.DocumentOnMouseUp;
        }

    }


    vscb.VisualElement.onmousewheel = function (e) {
        e.preventDefault();
        e.cancelBubble = true;
        var vinc = e.wheelDelta / 10;
        var ny = (vscb.Tracker.offsetTop - vinc);

        if (ny < vscb.TArrow.clientHeight)
            ny = vscb.TArrow.clientHeight;

        if (ny > vscb.BArrow.offsetTop - vscb.Tracker.clientHeight)
            ny = vscb.BArrow.offsetTop - vscb.Tracker.clientHeight;


        vscb.Tracker.style.top = ny + "px";
    }


    vscb.DocumentOnMouseUp = function (e) {


        e.preventDefault();
        e.cancelBubble = true;

        //取消全局鼠标移动事件跟踪
        if (document.onmousemove == vscb.DocumentMouseMove)
            document.onmousemove = undefined;

    }

    //
    vscb.DocumentMouseMove = function (e) {

        var vinc = e.clientY - vscb.CP.y;
        var ny = vscb.CP.l + hinc;

        if (ny < vscb.TArrow.clientHeight)
            ny = vscb.TArrow.clientHeight;

        if (ny > vscb.BArrow.offsetTop - vscb.Tracker.clientHeight)
            ny = vscb.BArrow.offsetTop - vscb.Tracker.clientHeight;

        vscb.Tracker.style.top = ny + "px";

    }



    return vscb;

}

//日期事件选择
DBFX.Web.Controls.DateTimePicker = function (b) {

    var ds = DBFX.Web.Controls.Control("DateTimePicker");
    ds.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.InputControlDesigner");
    ds.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.DateTimePickerDesigner");
    ds.ClassDescriptor.Serializer = "DBFX.Serializer.DateTimePickerSerializer";

    //默认配置
    ds.defaults =  //Plugin Defaults
    {
        mode: "date",
        defaultDate: null,

        dateSeparator: "-",
        timeSeparator: ":",
        timeMeridiemSeparator: " ",
        dateTimeSeparator: " ",
        monthYearSeparator: " ",

        dateTimeFormat: "dd-MM-yyyy HH:mm",
        dateFormat: "dd-MM-yyyy",
        timeFormat: "HH:mm",

        maxDate: null,
        minDate: null,

        maxTime: null,
        minTime: null,

        maxDateTime: null,
        minDateTime: null,


        shortDayNames: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
        fullDayNames: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
        shortMonthNames: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
        fullMonthNames: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
        labels: null, /*{"year": "Year", "month": "Month", "day": "Day", "hour": "Hour", "minutes": "Minutes", "seconds": "Seconds", "meridiem": "Meridiem"}*/

        minuteInterval: 1,
        roundOffMinutes: true,

        secondsInterval: 1,
        roundOffSeconds: true,

        titleContentDate: "设置日期",
        titleContentTime: "设置时间",
        titleContentDateTime: "设置日期 & 时间",

        buttonsToDisplay: ["HeaderCloseButton", "SetButton", "ClearButton"],
        setButtonContent: "确定",
        clearButtonContent: "取消",
        incrementButtonContent: "+",
        decrementButtonContent: "-",
        setValueInTextboxOnEveryClick: false,

        animationDuration: 400,

        isPopup: true,
        parentElement: "body",

        language: "",

        init: null, // init(oDateTimePicker)
        addEventHandlers: null,  // addEventHandlers(oDateTimePicker)
        beforeShow: null,  // beforeShow(oInputElement)
        afterShow: null,  // afterShow(oInputElement)
        beforeHide: null,  // beforeHide(oInputElement)
        afterHide: null,  // afterHide(oInputElement)
        buttonClicked: null,  // buttonClicked(sButtonType, oInputElement) where sButtonType = "SET"|"CLEAR"|"CANCEL"|"TAB"
        settingValueOfElement: null, // settingValueOfElement(sValue, dDateTime, oInputElement)
        formatHumanDate: null,  // formatHumanDate(oDateTime, sMode, sFormat)

        parseDateTimeString: null, // parseDateTimeString(sDateTime, sMode, oInputField)
        formatDateTimeString: null // formatDateTimeString(oDateTime, sMode, oInputField)
    };

    //临时变量 用来计算详细的时间控件实例
    ds.dataObject = // Temporary Variables For Calculation Specific to DateTimePicker Instance
    {
        dCurrentDate: new Date(),
        iCurrentDay: 0,
        iCurrentMonth: 0,
        iCurrentYear: 0,
        iCurrentHour: 0,
        iCurrentMinutes: 0,
        iCurrentSeconds: 0,
        sCurrentMeridiem: "",
        iMaxNumberOfDays: 0,

        sDateFormat: "",
        sTimeFormat: "",
        sDateTimeFormat: "",

        dMinValue: null,
        dMaxValue: null,

        sArrInputDateFormats: [],
        sArrInputTimeFormats: [],
        sArrInputDateTimeFormats: [],

        bArrMatchFormat: [],
        bDateMode: false,
        bTimeMode: false,
        bDateTimeMode: false,

        oInputElement: null,

        iTabIndex: 0,
        bElemFocused: false,
        bIs12Hour: false
    };

    ds.value = new Date();


    //设置选择控件的类型 date/time/dateAndTime
    ds.type = 'dateAndTime';
    Object.defineProperty(ds, "PickerType", {
        get: function () {
            return ds.type;
        },
        set: function (v) {
            ds.type = v;
            // ds.oncreate();
            var nodes = ds.VisualElement.childNodes;
            var count = nodes.length;

            //FIXME:平台判断和这里不是一样的条件 平台是大于2  这里要大于等于2
            // if(count>=2){
            //     //清除掉原来的控件
            //     ds.VisualElement.removeChild(nodes[count - 1]);
            // }

            //根据类型设置日期格式
            ds.setDateWithType(v);

            ds.contentLabel.innerText = ds.getDisplayDateStr(ds.value);
            // ds.loaded();
        }
    });

    //获取时间显示字符串
    ds.getDisplayDateStr = function (date) {

        var y, m, d, h, mi, sec, week;
        if (date instanceof Date) {

            y = date.getFullYear();
            m = date.getMonth() + 1;
            d = date.getDate();
            h = date.getHours();
            mi = date.getMinutes();
            sec = date.getSeconds();
            week = date.getDay();

        } else {//xxxx-xx-xx xx:xx:xx
            var timeArr = date.split(' ');
            var dates = timeArr[0].split('-');
            var times = timeArr[1].split(':');
            y = dates[0];
            m = dates[1];
            d = dates[2];
            h = times[0];
            mi = times[1];
            sec = times[2];
        }


        var showText;
        switch (ds.type) {
            case "date":
                showText = y + ds.defaults.dateSeparator + m + ds.defaults.dateSeparator + d;//+ds.defaults.dateSeparator+ds.defaults.shortDayNames[week];
                break;
            case "time":
                var minutes = '' + mi,
                    seconds = '' + sec;

                mi = minutes.length == 2 ? mi : '0' + mi;
                sec = seconds.length == 2 ? sec : '0' + sec;
                showText = h + ds.defaults.timeSeparator + mi + ds.defaults.timeSeparator + sec;
                break;
            case "dateAndTime":

                var minutes = '' + mi,
                    seconds = '' + sec;

                mi = minutes.length == 2 ? mi : '0' + mi;
                sec = seconds.length == 2 ? sec : '0' + sec;

                //显示周：ds.defaults.dateSeparator+ds.defaults.shortDayNames[week]
                showText = y + ds.defaults.dateSeparator + m + ds.defaults.dateSeparator + d + " "
                    + h + ds.defaults.timeSeparator + mi;
                break;
            default:
                break;
        }

        return showText;
    }

    ds.VisualElement = document.createElement("DIV");
    ds.VisualElement.className = "DateTimePicker";

    ds.OnCreateHandle();
    ds.OnCreateHandle = function () {
        ds.VisualElement.innerHTML = "<div class='DateTimePicker_Container'><span class='DateTimePicker_ContentLabel'></span></div>";
        ds.container = ds.VisualElement.querySelector("div.DateTimePicker_Container");
        ds.contentLabel = ds.VisualElement.querySelector("span.DateTimePicker_ContentLabel");
        ds.contentLabel.innerText = ds.getDisplayDateStr(ds.value);

        if (b != undefined) {
            ds.DataBindings = b;
        }

        ds.oData = {
            sArrInputDateFormats: [],
            sArrInputTimeFormats: [],
            sArrInputDateTimeFormats: [],

        };
        ds.settings = {
            dateSeparator: "-",
            timeSeparator: ":",
            dateTimeSeparator: " ",
            isPopup: true,
            init: null
        };

        //点击显示框
        ds.VisualElement.addEventListener('mousedown', ds.popUpPicker, false);
        ds.VisualElement.addEventListener('touchstart', ds.popUpPicker, false);
    }

    //初始化当前日期
    // ds.currentDate = new Date();
    ds.currentDate = "2018-05-14 00:00:00";
    Object.defineProperty(ds, "CurrentDate", {
        get: function () {
            return ds.currentDate;
        },
        set: function (v) {
            ds.currentDate = v;
        }
    });


    //根据类型设置日期格式
    ds.setDateWithType = function (type) {
        switch (type) {
            case "date":
                ds.value = new Date(ds.value.getFullYear(), ds.value.getMonth(), ds.value.getDate());
                ds.selectDate = new Date(ds.value.getFullYear(), ds.value.getMonth(), ds.value.getDate());
                break;
            case "time":
                ds.value = ds.value;
                ds.selectDate = ds.value;
                break;
            case "dateAndTime":
                ds.value = ds.value;
                ds.selectDate = ds.value;
                break;
            default:
                break;
        }

    }

    ds.textFontStyle = 400;

    ds.btnFontsize = 14;
    Object.defineProperty(ds, "BtnFontsize", {
        get: function () {
            return ds.btnFontsize;
        },
        set: function (v) {
            ds.btnFontsize = v;
        }
    });

    ds.ensureBtnFontColor = '#666666';
    Object.defineProperty(ds, "EnsureBtnFontColor", {
        get: function () {
            return ds.ensureBtnFontColor;
        },
        set: function (v) {
            ds.ensureBtnFontColor = v;
        }
    });

    ds.cancelBtnFontColor = '#666666';
    Object.defineProperty(ds, "CancelBtnFontColor", {
        get: function () {
            return ds.cancelBtnFontColor;
        },
        set: function (v) {
            ds.cancelBtnFontColor = v;
        }
    });


    //调节区域背景颜色
    ds.comBgColor = '#FFFFFF';
    Object.defineProperty(ds, "ComBgColor", {
        get: function () {
            return ds.comBgColor;
        },
        set: function (v) {
            ds.comBgColor = v;
        }
    });
    //头部背景色
    ds.headerBgColor = '#CBCBCB';
    Object.defineProperty(ds, "HeaderBgColor", {
        get: function () {
            return ds.headerBgColor;
        },
        set: function (v) {
            ds.headerBgColor = v;
        }
    });
    //确认按钮背景色
    ds.ensureBtnBgColor = 'transparent';
    Object.defineProperty(ds, "EnsureBtnBgColor", {
        get: function () {
            return ds.ensureBtnBgColor;
        },
        set: function (v) {
            ds.ensureBtnBgColor = v;
        }
    });
    //取消按钮背景色
    ds.cancelBtnBgColor = 'transparent';
    Object.defineProperty(ds, "CancelBtnBgColor", {
        get: function () {
            return ds.cancelBtnBgColor;
        },
        set: function (v) {
            ds.cancelBtnBgColor = v;
        }
    });


    //保存年、月、日、时、分 显示的控件
    //{year: ,month: ,day: ,hour: ,minutes: ,seconds: }
    ds.tempDate = {};

    //选中的日期-Date对象
    ds.selectDate = ds.value;

    /*==================================平台属性配置=======================================================*/
    // ds.SetHeight = function (v) {
    //     if (v.indexOf("%") != -1 || v.indexOf("px") != -1) {
    //         ds.VisualElement.style.height = v;
    //     } else {
    //         ds.VisualElement.style.height = parseInt(v) + 'px';
    //     }
    //     var cssObj = window.getComputedStyle(ds.VisualElement, null);
    //     ds.VisualElement.style.lineHeight = cssObj.height;
    // }


    ds.SetFontStyle = function (v) {
        ds.textFontStyle = v;
    }

    ds.readonly = false;
    Object.defineProperty(ds, "ReadOnly", {
        get: function () {
            return ds.readonly;
        },
        set: function (v) {

            ds.readonly = v;
            if (v != null && v != undefined && (v == true || v == "true"))
                ds.readonly = true;
            else
                ds.readonly = false;
            ds.contentLabel.readOnly = ds.readonly;
        }
    });

    //TODO:定义验证规则属性
    Object.defineProperty(ds, "CheckRule", {
        get: function () {
            return ds.checkRule;
        },
        set: function (v) {
            ds.checkRule = v;
            if (v != null && v != undefined && v != "") {
                //tbx.TextBox.style.color = "rgba(255,0,0,0.3)";
            }
        }
    });


    ds.OnValueChanged = function () {

        if (ds.dataBindings != undefined && ds.dataContext != undefined) {
            ds.dataContext[ds.dataBindings.Path] = ds.value;
        }
        ds.RegisterFormContext();

        if (ds.ValueChanged != undefined) {
            if (ds.ValueChanged.GetType != undefined && ds.ValueChanged.GetType() == "Command") {
                ds.ValueChanged.Sender = ds;
                ds.ValueChanged.Execute();

            }
            else
                if (typeof ds.ValueChanged == "function")
                    ds.ValueChanged(ds);
        }

    }

    //注册绑定路径
    ds.RegisterFormContext = function () {
        if (ds.FormContext != null && ds.dataProperty != "" && ds.dataProperty != undefined) {

            //根据类型设置日期格式
            ds.setDateWithType(ds.type);

            if (ds.dataDomain != undefined && ds.dataDomain != "") {

                var ddv = ds.FormContext[ds.dataDomain];
                if (ddv == undefined)
                    ds.FormContext[ds.dataDomain] = new DBFX.DataDomain();

                ds.FormContext[ds.dataDomain][ds.dataProperty] = ds.value;
            }
            else {

                ds.FormContext[ds.dataProperty] = ds.value;
            }
        }
    }


    ds.GetValue = function () {
        ds.setDateWithType(ds.type);
        return ds.value;
    }

    ds.SetValue = function (v) {

        try {
            if (typeof v == "string")
                v = new Date(v);

            if (isNaN(v))
                v = new Date();

            if (v == undefined || v == "" || isNaN(new Date(v)))
                v = new Date();
            ds.value = v;

            ds.SetDateValue(v);

        }
        catch (ex) {
            //alert(ex.toString());
        }
    }

    ds.SetDateValue = function (v) {

        var dstr = "";


        ds.contentLabel.innerText = ds.getDisplayDateStr(v);

        ds.OnValueChanged();

    }

    //可用设置
    ds.SetEnabled = function (v) {
        if (v == true) {
            ds.VisualElement.addEventListener('mousedown', ds.popUpPicker, false);
            ds.VisualElement.addEventListener('touchstart', ds.popUpPicker, false);
            ds.VisualElement.style.background = "";
            ds.contentLabel.style.color = '';
        } else {
            ds.VisualElement.removeEventListener('mousedown', ds.popUpPicker, false);
            ds.VisualElement.removeEventListener('touchstart', ds.popUpPicker, false);
            ds.VisualElement.style.background = "#eeeeee";
            ds.contentLabel.style.color = '#bbb';
        }
    }

    //可见性设置
    ds.SetVisibled = function (v) {

        if (v == true) {
            ds.VisualElement.style.display = ds.display;
        } else {
            ds.VisualElement.style.display = 'none';
        }
    }


    /*============================================================================================*/
    ds.init = function () {
        var oDTP = ds;

        if (oDTP.settings.isPopup) {
            oDTP.createPicker();
            // $(oDTP.element).addClass("dtpicker-mobile");

            switch (ds.type) {
                case "date":
                    ds.createDateComponent();
                    break;
                case "time":
                    ds.createTimeComponent();
                    break;
                case "dateAndTime":
                    ds.createDateTimeComponent();
                    break;
                default:
                    break;
            }
        }

        if (oDTP.settings.init)
            oDTP.settings.init.call(oDTP);
        //
        // oDTP._addEventHandlersForInput();
    }

    //创建控件的整体
    ds.createPicker = function () {
        //标签显示的时间
        var title;
        var timeLabel;


        switch (ds.type) {
            case "date":
                title = "设置日期";
                break;
            case "time":
                title = "设置时间";
                break;
            case "dateAndTime":
                title = "设置日期和时间";
                break;
            default:
                break;
        }

        timeLabel = ds.getDisplayDateStr(ds.value);


        var sTempStr = "";
        // sTempStr += "<div  id='dtBox' class='dtpicker-overlay dtpicker-mobile'>";
        // sTempStr += "<div  id='dtBox' class='dtpicker-overlay'>";
        sTempStr += "<div class='dtpicker-bg'>";
        sTempStr += "<div class='dtpicker-cont'>";
        sTempStr += "<div class='dtpicker-content'>";
        sTempStr += "<div class='dtpicker-subcontent'>";

        //控件头 标题 显示选中的时间
        sTempStr += "<div class='dtpicker-header'>";
        sTempStr += "<div class='dtpicker-title'>" + title + "</div>";
        sTempStr += "<a class='dtpicker-close'>×</a>";
        sTempStr += "<div class='dtpicker-value'>" + timeLabel + "</div>";
        sTempStr += "</div>";

        //控件主题选择器
        sTempStr += "<div class='dtpicker-components'>";
        sTempStr += "</div>";

        //按钮布局
        sTempStr += "<div class='dtpicker-buttonCont dtpicker-twoButtons'>";
        sTempStr += "<input type='button' class='dtpicker-button dtpicker-buttonSet' value='确定'>";
        sTempStr += "<input type='button' class='dtpicker-button dtpicker-buttonClear' value='取消'>";
        // sTempStr += "<a class='dtpicker-button dtpicker-buttonSet' >"+"确定"+"</a>";
        // sTempStr += "<a class='dtpicker-button dtpicker-buttonClear' >"+"取消"+"</a>";
        sTempStr += "</div>";


        sTempStr += "</div>";
        sTempStr += "</div>";
        sTempStr += "</div>";
        sTempStr += "</div>";
        // sTempStr += "</div>";

        ds.dtBox = document.createElement('div');
        ds.dtBox.setAttribute('id', 'dtBox');
        ds.dtBox.classList.add('dtpicker-overlay');
        ds.dtBox.classList.add('dtpicker-mobile');
        ds.dtBox.innerHTML = sTempStr;
        // ds.VisualElement.innerHTML = sTempStr;
        // ds.VisualElement.appendChild(div);

    }

    //创建日期选择控件Date
    ds.createDateComponent = function () {

        //年
        var yearCom = ds.createComponent();
        yearCom.classList.add('dtpicker-comp3');
        yearCom.querySelector('.dtpicker-comp').classList.add('year');
        // yearCom.querySelector('.dtpicker-compValue').value= ds.handleDateStr(ds.currentDate).getFullYear();
        yearCom.querySelector('.dtpicker-compValue').value = ds.value.getFullYear();
        ds.tempDate.year = yearCom.querySelector('.dtpicker-compValue');
        //月
        var monthCom = ds.createComponent();
        monthCom.classList.add('dtpicker-comp3');
        monthCom.querySelector('.dtpicker-comp').classList.add('month');
        // monthCom.querySelector('.dtpicker-compValue').value= ds.handleDateStr(ds.currentDate).getMonth();
        monthCom.querySelector('.dtpicker-compValue').value = ds.value.getMonth() + 1;
        ds.tempDate.month = monthCom.querySelector('.dtpicker-compValue');
        //日
        var dayCom = ds.createComponent();
        dayCom.classList.add('dtpicker-comp3');
        dayCom.querySelector('.dtpicker-comp').classList.add('day');
        // dayCom.querySelector('.dtpicker-compValue').value= ds.handleDateStr(ds.currentDate).getDate();
        dayCom.querySelector('.dtpicker-compValue').value = ds.value.getDate();
        ds.tempDate.day = dayCom.querySelector('.dtpicker-compValue');


        // ds.VisualElement.querySelector('.dtpicker-components').appendChild(yearCom);
        // ds.VisualElement.querySelector('.dtpicker-components').appendChild(monthCom);
        // ds.VisualElement.querySelector('.dtpicker-components').appendChild(dayCom);


        ds.dtBox.querySelector('.dtpicker-components').appendChild(yearCom);
        ds.dtBox.querySelector('.dtpicker-components').appendChild(monthCom);
        ds.dtBox.querySelector('.dtpicker-components').appendChild(dayCom);

        // console.log(yearCom);
    }

    //创建时间选择控件Time
    ds.createTimeComponent = function () {
        //时
        var hourCom = ds.createComponent();
        hourCom.classList.add('dtpicker-comp3');
        hourCom.querySelector('.dtpicker-comp').classList.add('hour');
        // hourCom.querySelector('.dtpicker-compValue').value= ds.handleDateStr(ds.currentDate).getHours()+"时";

        hourCom.querySelector('.dtpicker-compValue').value = ds.value.getHours() + "时";
        ds.tempDate.hour = hourCom.querySelector('.dtpicker-compValue');
        //分
        var minutesCom = ds.createComponent();
        minutesCom.classList.add('dtpicker-comp3');
        minutesCom.querySelector('.dtpicker-comp').classList.add('minutes');
        // minutesCom.querySelector('.dtpicker-compValue').value= ds.handleDateStr(ds.currentDate).getMinutes()+"分";

        minutesCom.querySelector('.dtpicker-compValue').value = ds.value.getMinutes() + "分";

        ds.tempDate.minutes = minutesCom.querySelector('.dtpicker-compValue');
        //秒
        var secondsCom = ds.createComponent();
        secondsCom.classList.add('dtpicker-comp3');
        secondsCom.querySelector('.dtpicker-comp').classList.add('seconds');
        // secondsCom.querySelector('.dtpicker-compValue').value= ds.handleDateStr(ds.currentDate).getSeconds()+"秒";

        secondsCom.querySelector('.dtpicker-compValue').value = ds.value.getSeconds() + "秒";
        ds.tempDate.seconds = secondsCom.querySelector('.dtpicker-compValue');

        // ds.VisualElement.querySelector('.dtpicker-components').appendChild(hourCom);
        // ds.VisualElement.querySelector('.dtpicker-components').appendChild(minutesCom);
        // ds.VisualElement.querySelector('.dtpicker-components').appendChild(secondsCom);

        ds.dtBox.querySelector('.dtpicker-components').appendChild(hourCom);
        ds.dtBox.querySelector('.dtpicker-components').appendChild(minutesCom);
        ds.dtBox.querySelector('.dtpicker-components').appendChild(secondsCom);



    }


    //创建日期&时间选择控件dateAndTime
    ds.createDateTimeComponent = function () {
        //年
        var yearCom = ds.createComponent();
        yearCom.classList.add('dtpicker-comp5');
        yearCom.querySelector('.dtpicker-comp').classList.add('year');
        // yearCom.querySelector('.dtpicker-compValue').value= ds.handleDateStr(ds.currentDate).getFullYear();
        yearCom.querySelector('.dtpicker-compValue').value = ds.value.getFullYear();


        ds.tempDate.year = yearCom.querySelector('.dtpicker-compValue');
        //月
        var monthCom = ds.createComponent();
        monthCom.classList.add('dtpicker-comp5');
        monthCom.querySelector('.dtpicker-comp').classList.add('month');
        // monthCom.querySelector('.dtpicker-compValue').value= ds.handleDateStr(ds.currentDate).getMonth();
        monthCom.querySelector('.dtpicker-compValue').value = ds.value.getMonth() + 1;

        ds.tempDate.month = monthCom.querySelector('.dtpicker-compValue');
        //日
        var dayCom = ds.createComponent();
        dayCom.classList.add('dtpicker-comp5');
        dayCom.querySelector('.dtpicker-comp').classList.add('day');
        // dayCom.querySelector('.dtpicker-compValue').value= ds.handleDateStr(ds.currentDate).getDate();
        dayCom.querySelector('.dtpicker-compValue').value = ds.value.getDate();

        ds.tempDate.day = dayCom.querySelector('.dtpicker-compValue');
        //时
        var hourCom = ds.createComponent();
        hourCom.classList.add('dtpicker-comp5');
        hourCom.querySelector('.dtpicker-comp').classList.add('hour');
        // hourCom.querySelector('.dtpicker-compValue').value= ds.handleDateStr(ds.currentDate).getHours()+"时";
        hourCom.querySelector('.dtpicker-compValue').value = ds.value.getHours() + "时";

        ds.tempDate.hour = hourCom.querySelector('.dtpicker-compValue');
        //分
        var minutesCom = ds.createComponent();
        minutesCom.classList.add('dtpicker-comp5');
        minutesCom.querySelector('.dtpicker-comp').classList.add('minutes');
        // minutesCom.querySelector('.dtpicker-compValue').value= ds.handleDateStr(ds.currentDate).getMinutes()+"分";
        minutesCom.querySelector('.dtpicker-compValue').value = ds.value.getMinutes() + "分";

        ds.tempDate.minutes = minutesCom.querySelector('.dtpicker-compValue');


        // ds.VisualElement.querySelector('.dtpicker-components').appendChild(yearCom);
        // ds.VisualElement.querySelector('.dtpicker-components').appendChild(monthCom);
        // ds.VisualElement.querySelector('.dtpicker-components').appendChild(dayCom);
        // ds.VisualElement.querySelector('.dtpicker-components').appendChild(hourCom);
        // ds.VisualElement.querySelector('.dtpicker-components').appendChild(minutesCom);

        ds.dtBox.querySelector('.dtpicker-components').appendChild(yearCom);
        ds.dtBox.querySelector('.dtpicker-components').appendChild(monthCom);
        ds.dtBox.querySelector('.dtpicker-components').appendChild(dayCom);
        ds.dtBox.querySelector('.dtpicker-components').appendChild(hourCom);
        ds.dtBox.querySelector('.dtpicker-components').appendChild(minutesCom);

    }


    //创建单个选择组件
    ds.createComponent = function () {
        var innerStr = "";
        var component = document.createElement('div');
        component.classList.add('dtpicker-compOutline');
        innerStr += "<div class='dtpicker-comp'>";
        innerStr += "<a class=\"dtpicker-compButton increment dtpicker-compButtonEnable\">+</a>";
        innerStr += "<input type=\"text\" class=\"dtpicker-compValue\">";
        innerStr += "<a class=\"dtpicker-compButton decrement dtpicker-compButtonEnable\">-</a>";
        innerStr += "</div>";
        component.innerHTML = innerStr;

        var incrementE = component.querySelector('.increment');
        var decrementE = component.querySelector(".decrement");


        //pc鼠标点击"+"号按钮
        component.querySelector(".increment").addEventListener('mousedown', function () {
            // console.log(this.parentNode);
            ds.handleIncrementBtnClick(event, this);
        }, false);
        //APP手指触摸
        component.querySelector(".increment").addEventListener('touchstart', function () {
            // console.log(this.parentNode);
            ds.handleIncrementBtnClick(event, this);
        }, false);
        //PC鼠标抬起
        component.querySelector(".increment").addEventListener('mouseup', function () {
            // console.log(this.parentNode);
            ds.handleIncrementBtnUp();
        }, false);
        //APP手指触摸结束和取消
        component.querySelector(".increment").addEventListener('touchend', function () {
            // console.log(this.parentNode);
            ds.handleIncrementBtnUp();
        }, false);

        component.querySelector(".increment").addEventListener('touchcancel', function () {
            // console.log(this.parentNode);
            ds.handleIncrementBtnUp();
        }, false);



        //"-"号事件处理添加
        component.querySelector(".decrement").addEventListener('mousedown', function () {
            // console.log(this.parentNode);
            ds.handleDecrementBtnClick(event, this);
        }, false);
        component.querySelector(".decrement").addEventListener('touchstart', function () {
            // console.log(this.parentNode);
            ds.handleDecrementBtnClick(event, this);
        }, false);


        component.querySelector(".decrement").addEventListener('mouseup', function () {
            // console.log(this.parentNode);
            ds.handleDecrementBtnUp();
        }, false);
        component.querySelector(".decrement").addEventListener('touchend', function () {
            // console.log(this.parentNode);
            ds.handleDecrementBtnUp();
        }, false);
        component.querySelector(".decrement").addEventListener('touchcancel', function () {
            // console.log(this.parentNode);
            ds.handleDecrementBtnUp();
        }, false);


        // incrementE.style.border = "1px solid red";
        // decrementE.style.border = "1px solid red";
        // incrementE.style.borderRadius = '8px';
        // console.log(incrementE);

        return component;
    }

    //更新所有显示的数值
    ds.updateValues = function () {
        ds.valueLabel.innerText = ds.handleDate(ds.tempDate);

    }

    //处理日期字符串xxxx-xx-xx xx:xx:xx，转成日期对象
    ds.handleDateStr = function (dateStr) {
        var timeArr = dateStr.split(' ');
        var dates = timeArr[0].split('-');
        var times = timeArr[1].split(':');
        var y, m, d, h, mi, sec;
        y = dates[0];
        m = dates[1];
        d = dates[2];
        h = times[0];
        mi = times[1];
        sec = times[2];
        return new Date(y, m, d, h, mi, sec);
    }

    ds.handleDate = function (dateObj) {
        //创建变动的日期
        var tempD;
        switch (ds.type) {
            case "date":
                tempD = new Date(dateObj.year.value, dateObj.month.value - 1, dateObj.day.value);
                break;
            case "time":

                tempD = new Date(ds.value.getFullYear(), ds.value.getMonth() + 1, ds.value.getDate(),
                    parseInt(dateObj.hour.value), parseInt(dateObj.minutes.value), parseInt(dateObj.seconds.value));
                break;
            case "dateAndTime":
                tempD = new Date(dateObj.year.value, dateObj.month.value - 1, dateObj.day.value,
                    parseInt(dateObj.hour.value), parseInt(dateObj.minutes.value));
                break;
            default:
                break;
        }

        // console.log(tempD);
        var y = tempD.getFullYear(),
            m = tempD.getMonth() + 1,
            d = tempD.getDate(),
            h = tempD.getHours(),
            mi = tempD.getMinutes(),
            sec = tempD.getSeconds(),
            week = tempD.getDay();

        // console.log(ds.defaults.shortDayNames[week]);

        var showText;
        switch (ds.type) {
            case "date":
                dateObj.year.value = y;
                dateObj.month.value = m;
                dateObj.day.value = d;
                showText = y + ds.defaults.dateSeparator + m + ds.defaults.dateSeparator + d;//+ds.defaults.dateSeparator+ds.defaults.shortDayNames[week];
                break;
            case "time":
                var minutes = '' + mi,
                    seconds = '' + sec;

                mi = minutes.length == 2 ? mi : '0' + mi;
                sec = seconds.length == 2 ? sec : '0' + sec;

                dateObj.hour.value = h + "时";
                dateObj.minutes.value = mi + "分";
                dateObj.seconds.value = sec + "秒";
                showText = h + ds.defaults.timeSeparator + mi + ds.defaults.timeSeparator + sec;

                break;
            case "dateAndTime":
                dateObj.year.value = y;
                dateObj.month.value = m;
                dateObj.day.value = d;

                var minutes = '' + mi,
                    seconds = '' + sec;

                mi = minutes.length == 2 ? mi : '0' + mi;
                sec = seconds.length == 2 ? sec : '0' + sec;

                dateObj.hour.value = h + "时";
                dateObj.minutes.value = mi + "分";

                //显示周：ds.defaults.dateSeparator+ds.defaults.shortDayNames[week]
                showText = y + ds.defaults.dateSeparator + m + ds.defaults.dateSeparator + d + " "
                    + h + ds.defaults.timeSeparator + mi;

                break;
            default:
                break;
        }

        return showText;
    }



    //处理'+'点击事件
    ds.handleIncrementBtnClick = function (event, element) {
        var ev = event || window.event;
        function update() {
            var parentN = element.parentNode;
            // console.log(parentN.classList.contains('day'));

            var label = parentN.querySelector('.dtpicker-compValue');
            label.value = parseInt(label.value) + 1;
            //更新显示的数值
            ds.updateValues();
        }

        switch (event.type) {
            case "touchstart":
                event.preventDefault();
                update();
                ds.incrementBtnClickOut = setInterval(function () {
                    update();
                }, 150);
                break;
            case "mousedown":
                update();
                ds.incrementBtnClickOut = setInterval(function () {
                    update();
                }, 150);
                break;
        }

    }

    ds.handleIncrementBtnUp = function () {
        clearInterval(ds.incrementBtnClickOut);
    }

    //处理'-'点击事件
    ds.handleDecrementBtnClick = function (event, element) {
        var ev = event || window.event;
        function update() {
            var parentN = element.parentNode;
            var label = parentN.querySelector('.dtpicker-compValue');
            label.value = parseInt(label.value) - 1;
            //更新显示的数值
            ds.updateValues();
        }
        switch (event.type) {
            case "touchstart":
                event.preventDefault();
                update();
                ds.decrementBtnClickOut = setInterval(function () {
                    update();
                }, 150);
                break;
            case "mousedown":
                update();
                ds.decrementBtnClickOut = setInterval(function () {
                    update();
                }, 150);
                break;
        }

    }

    ds.handleDecrementBtnUp = function () {
        clearInterval(ds.decrementBtnClickOut);
    }


    //获取元素的实例对象
    ds.getElementInstance = function () {
        //控件页面整体
        // ds.dtBox = document.getElementById('dtBox');
        // ds.dtBox = ds.VisualElement.querySelector('.dtpicker-overlay');

        //背景
        ds.bg = ds.dtBox.querySelector('.dtpicker-bg');
        //获取选择控件整体
        ds.content = ds.dtBox.querySelector('.dtpicker-content');
        //获取subcontent
        ds.subcontent = ds.dtBox.querySelector('.subcontent');
        //获取控件头部整体
        ds.header = ds.dtBox.querySelector('.dtpicker-header');
        //获取标题显示div
        ds.titleE = ds.dtBox.querySelector('.dtpicker-title');
        //获取右上角关闭按钮
        ds.closeBtn = ds.dtBox.querySelector('.dtpicker-close');
        //获取显示日期标签
        ds.valueLabel = ds.dtBox.querySelector('.dtpicker-value');
        //取消按钮和确定按钮整体
        ds.buttonCont = ds.dtBox.querySelector('.dtpicker-buttonCont');
        //确定按钮
        ds.ensureBtn = ds.dtBox.querySelector('.dtpicker-buttonSet');
        //取消按钮
        ds.cancelBtn = ds.dtBox.querySelector('.dtpicker-buttonClear');

        //调节区域
        ds.components = ds.dtBox.querySelector('.dtpicker-components');

    }


    //设置实例对象的样式
    ds.setElementsStyle = function () {

        //控件整体样式
        ds.content.style.border = ds.BorderColor + ' ' + 'solid' + ' ' + parseInt(ds.BorderWidth) + 'px';
        ds.content.style.borderRadius = parseInt(ds.BorderRadius) + "px";
        //控件头部样式
        ds.header.style.background = ds.headerBgColor;
        ds.header.style.borderTopRightRadius = parseInt(ds.BorderRadius) + "px";
        ds.header.style.borderTopLeftRadius = parseInt(ds.BorderRadius) + "px";
        //标题显示样式
        ds.titleE.style.color = ds.Color;
        ds.titleE.style.fontFamily = ds.FontFamily;
        ds.titleE.style.fontSize = parseInt(ds.FontSize) + 'px';

        //显示日期标签
        ds.valueLabel.style.color = ds.Color;
        ds.valueLabel.style.fontFamily = ds.FontFamily;
        ds.valueLabel.style.fontSize = ds.FontSize;

        //确定、取消按钮样式设置
        ds.ensureBtn.style.fontFamily = ds.FontFamily;
        ds.ensureBtn.style.color = ds.ensureBtnFontColor;
        ds.ensureBtn.style.fontSize = parseInt(ds.btnFontsize) + 'px';
        ds.ensureBtn.style.backgroundColor = ds.ensureBtnBgColor;
        //
        ds.cancelBtn.style.fontFamily = ds.FontFamily;
        ds.cancelBtn.style.color = ds.cancelBtnFontColor;
        ds.cancelBtn.style.fontSize = parseInt(ds.btnFontsize) + 'px';
        ds.cancelBtn.style.backgroundColor = ds.cancelBtnBgColor;


        ds.cancelBtn.style.borderTop = ds.BorderColor + ' ' + 'solid' + ' ' + parseInt(ds.BorderWidth) + 'px';
        ds.cancelBtn.style.borderRight = ds.BorderColor + ' ' + 'solid' + ' ' + parseInt(ds.BorderWidth) + 'px';
        ds.ensureBtn.style.borderTop = ds.BorderColor + ' ' + 'solid' + ' ' + parseInt(ds.BorderWidth) + 'px';


        //调节区域背景颜色
        ds.components.style.background = ds.comBgColor;

    }

    ds.eventHanle = function () {
        //FIXME:
        //点击显示框
        // ds.VisualElement.addEventListener('mousedown',ds.popUpPicker,false);
        // ds.VisualElement.addEventListener('touchstart',ds.popUpPicker,false);

        //点击背景
        ds.bg.addEventListener('mousedown', function () {
            ds.hiddenOverlay();
        }, false);

        ds.content.addEventListener('mousedown', function () {
            ds.contentClick(event);
        }, false);

        //关闭按钮
        ds.closeBtn.addEventListener('mousedown', function () {
            ds.closeBtnClick(event);
        }, false);

        //"确定按钮"
        ds.ensureBtn.addEventListener('mousedown', function () {
            ds.ensureBtnClick(event);
        }, false);

        //取消按钮
        ds.cancelBtn.addEventListener('mousedown', function () {
            ds.cancelBtnClick(event);
        }, false);

    }

    //20210225 添加弹出模式属性  full-默认，全覆盖,bottom-底部弹出
    ds.popUpMode = 'full';
    Object.defineProperty(ds, "PopUpMode", {
        get: function () {
            return ds.popUpMode;
        },
        set: function (v) {
            ds.popUpMode = v;
        }
    });
    ds.popUpPicker = function () {
        // ds.VisualElement.focus();
        ds.loaded();
        switch (event.type) {
            case "touchstart":
                event.preventDefault();
                document.body.appendChild(ds.dtBox);
                break;
            case "mousedown":
                document.body.appendChild(ds.dtBox);
                break;
            default:
                break;
        }

        switch (ds.popUpMode) {
            case 'bottom':
                ds.dtBox.classList.add('fromBottom');
                break;
            case 'full':
            default:
                ds.dtBox.classList.remove('fromBottom');
                break;
        }

        ds.ensureBtn.focus();
        ds.saveState();
    }

    ds.contentClick = function (event) {
        event.preventDefault();
        event.cancelBubble = true;
    }

    //右上角关闭按钮
    ds.closeBtnClick = function (event) {
        ds.hiddenOverlay();
    }

    //确定按钮点击
    ds.ensureBtnClick = function (event) {
        //获取选中的时间
        switch (ds.type) {
            case "date":
                ds.value = new Date(ds.tempDate.year.value, ds.tempDate.month.value - 1, ds.tempDate.day.value);
                ds.selectDate = new Date(ds.tempDate.year.value, ds.tempDate.month.value - 1, ds.tempDate.day.value);
                break;
            case "time":
                ds.value = new Date(ds.value.getFullYear(), ds.value.getMonth(), ds.value.getDate(),
                    parseInt(ds.tempDate.hour.value), parseInt(ds.tempDate.minutes.value), parseInt(ds.tempDate.seconds.value));
                ds.selectDate = new Date(ds.value.getFullYear(), ds.value.getMonth(), ds.value.getDate(),
                    parseInt(ds.tempDate.hour.value), parseInt(ds.tempDate.minutes.value), parseInt(ds.tempDate.seconds.value));
                break;
            case "dateAndTime":
                ds.value = new Date(ds.tempDate.year.value, ds.tempDate.month.value - 1, ds.tempDate.day.value,
                    parseInt(ds.tempDate.hour.value), parseInt(ds.tempDate.minutes.value));
                ds.selectDate = new Date(ds.tempDate.year.value, ds.tempDate.month.value - 1, ds.tempDate.day.value,
                    parseInt(ds.tempDate.hour.value), parseInt(ds.tempDate.minutes.value));
                break;
            default:
                break;
        }


        ds.contentLabel.innerText = ds.handleDate(ds.tempDate);

        console.log(ds.value);
        ds.OnValueChanged();

        //隐藏控件
        ds.hiddenOverlay();
    }

    //取消按钮点击
    ds.cancelBtnClick = function (event) {

        ds.hiddenOverlay();
    }


    ds.saveState = function () {
        app.SaveState("dateTimePicker", ds.closePicker);
    }

    //隐藏选择器页面
    ds.hiddenOverlay = function () {
        // ds.dtBox.style.display = 'none';
        // ds.dtBox.classList.remove('dtpicker-mobile');

        // document.body.removeChild(ds.dtBox);
        app.GoBack();
    }

    ds.closePicker = function () {
        document.body.removeChild(ds.dtBox);
    }

    //TODO:页面加载后需要做的处理
    ds.loaded = function () {

        console.log("ds.loaded");
        //初始化数据 并创建页面
        ds.init();

        //获取标签的实例对象
        ds.getElementInstance();

        //设置实例对象的样式
        ds.setElementsStyle();
        //事件处理
        ds.eventHanle();

        ds.display = ds.VisualElement.style.display;

    }

    ds.OnCreateHandle();
    return ds;
}
DBFX.Serializer.DateTimePickerSerializer = function () {

    //反系列化
    this.DeSerialize = function (c, xe, ns) {
        DBFX.Serializer.DeSerialProperty("PickerType", c, xe);

        DBFX.Serializer.DeSerialProperty("BtnFontsize", c, xe);
        DBFX.Serializer.DeSerialProperty("EnsureBtnFontColor", c, xe);
        DBFX.Serializer.DeSerialProperty("CancelBtnFontColor", c, xe);

        DBFX.Serializer.DeSerialProperty("ComBgColor", c, xe);
        DBFX.Serializer.DeSerialProperty("HeaderBgColor", c, xe);
        DBFX.Serializer.DeSerialProperty("EnsureBtnBgColor", c, xe);
        DBFX.Serializer.DeSerialProperty("CancelBtnBgColor", c, xe);
        DBFX.Serializer.DeSerialProperty("PopUpMode", c, xe);

    }

    //系列化
    this.Serialize = function (c, xe, ns) {
        DBFX.Serializer.SerialProperty("PickerType", c.PickerType, xe);

        DBFX.Serializer.SerialProperty("BtnFontsize", c.BtnFontsize, xe);
        DBFX.Serializer.SerialProperty("EnsureBtnFontColor", c.EnsureBtnFontColor, xe);
        DBFX.Serializer.SerialProperty("CancelBtnFontColor", c.CancelBtnFontColor, xe);

        DBFX.Serializer.SerialProperty("ComBgColor", c.ComBgColor, xe);
        DBFX.Serializer.SerialProperty("HeaderBgColor", c.HeaderBgColor, xe);
        DBFX.Serializer.SerialProperty("EnsureBtnBgColor", c.EnsureBtnBgColor, xe);
        DBFX.Serializer.SerialProperty("CancelBtnBgColor", c.CancelBtnBgColor, xe);
        DBFX.Serializer.SerialProperty("PopUpMode", c.PopUpMode, xe);


    }
}
DBFX.Design.ControlDesigners.DateTimePickerDesigner = function () {

    var obdc = new DBFX.Web.Controls.GroupPanel();
    obdc.OnCreateHandle();
    obdc.OnCreateHandle = function () {

        DBFX.Resources.LoadResource("design/DesignerTemplates/FormDesignerTemplates/DateTimePickerDesigner.scrp", function (od) {
            od.DataContext = obdc.dataContext;
        }, obdc);
    }

    obdc.HorizonScrollbar = "hidden";
    obdc.OnCreateHandle();
    obdc.Class = "VDE_Design_ObjectGeneralDesigner";
    obdc.Text = "时间选择控件";
    return obdc;
}


DBFX.Web.Controls.PickingImageCB = function (resp)
{

    try {

        if (DBFX.Web.Controls.PickingImageCallback != undefined) {
            if (resp.serverResponseMessage == undefined)
            {
                var data = JSON.parse(resp);
                if (Array.isArray(data)) {
                    DBFX.Web.Controls.PickingImageCallback(JSON.stringify(data[0]));
                }
                else {
                    DBFX.Web.Controls.PickingImageCallback(resp);
                }
            }
            else
               DBFX.Web.Controls.PickingImageCallback(JSON.stringify(resp));
        }

        DBFX.Web.Controls.PickingImageCallback = undefined;
    }
    catch (ex) {
        //alert("PickingImageCB:"+ex.toString()+resp.toString());
    }

}
DBFX.Web.Controls.PickingImage = function (uploadurl, cb, mode, w, h, croppermode,aspectratio)
{

    try {
        if (mode == undefined)
            mode = 0;

        mode = mode * 1;

        if (Dbsoft != undefined && Dbsoft.System != undefined && Dbsoft.System.Advance != undefined && Dbsoft.System.Advance.TakeAndPickPhotos != undefined)
            mode = 3;

        if (mode == 0) {

            var frm = new DBFX.Web.Forms.Form();
            frm.Height = "128px";

            var pnl = new DBFX.Web.Controls.Panel();
            pnl.Height = "128px";
            pnl.Align = "center";
            frm.AddControl(pnl);
            //添加选择照片按钮
            var btnPicker = new DBFX.Web.Controls.Button();
            btnPicker.Text = "选择照片";
            btnPicker.Margin = "16px";
            btnPicker.Width = "112px";
            btnPicker.Height = "96px";
            btnPicker.BackgroundColor = "white";
            btnPicker.BorderRadius = "2px";
            btnPicker.BorderWidth = "0px";
            btnPicker.ButtonStyle = 1;
            btnPicker.ImageWidth = "48px";
            btnPicker.ImageUrl = "themes/%currenttheme%/images/gallery64.png";
            pnl.AddControl(btnPicker);
            btnPicker.Click = function () {

                frm.Close();
                DBFX.Dbsoft.System.Advance.PickerImage.start(cb, uploadurl);

            }

            //添加拍摄照片按钮
            var btnCamera = new DBFX.Web.Controls.Button();
            btnCamera.Text = "拍摄照片";
            btnCamera.Margin = "16px";
            btnCamera.Width = "112px";
            btnCamera.Height = "96px";
            btnCamera.Align = "center";
            btnCamera.BackgroundColor = "white";
            btnCamera.BorderRadius = "2px";
            btnCamera.BorderWidth = "0px";
            btnCamera.ButtonStyle = 1;
            btnCamera.ImageWidth = "48px";
            btnCamera.ImageUrl = "themes/%currenttheme%/images/camera64.png";
            pnl.AddControl(btnCamera);
            btnCamera.Click = function () {

                frm.Close();
                DBFX.Dbsoft.System.Advance.CameraAdvance.start(cb, uploadurl);

            }

            frm.HasTitleBar = false;
            frm.Width = "85%";
            frm.AutoClose = true;
            frm.AutoClosing = function () {

                frm.Close();

            }
            frm.ShowModal();
        }

        DBFX.Web.Controls.PickingImageCallback = cb;

        cb = DBFX.Web.Controls.PickingImageCB;
        //设置选择图片
        if (mode == 1) {

            DBFX.Dbsoft.System.Advance.PickerImage.start(cb, uploadurl);

        }

        //设置拍照
        if (mode == 2) {

            DBFX.Dbsoft.System.Advance.CameraAdvance.start(cb, uploadurl);

        }

        if (mode == 3)
        {
            DBFX.Dbsoft.System.Advance.TakeAndPickPhotos.start(cb, uploadurl,w,h,croppermode,aspectratio);
        }
    }
    catch (ex) {
        alert(ex.toString());
    }



}



//自定义输入框类
DBFX.Web.Controls.CustomizeInputBox = function () {
    var io = DBFX.Web.Controls.Control("CustomizeInputBox");

    io.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.CustomizeInputBoxDesigner");
    io.ClassDescriptor.Serializer = "DBFX.Serializer.CustomizeInputBoxSerializer";

    io.VisualElement = document.createElement('div');
    io.OnCreateHandle();

    //提示文字
    io.placeHolderText = "请输入……";
    Object.defineProperty(io, 'PlaceHolderText', {
        get: function () {
            return io.placeHolderText;
        },
        set: function (v) {
            io.placeHolderText = v;
            io.placeHolderE.innerText = v;
        }
    });

    //phoneNum、IDNum、numbers、naviBar
    io.dataType = 'IDNum';
    Object.defineProperty(io, 'DataType', {
        get: function () {
            return io.dataType;
        },
        set: function (v) {
            io.dataType = v;
        }
    });

    //选中后外边框颜色
    io.activateBorderColor = '#2b68dc';
    Object.defineProperty(io, 'ActivateBorderColor', {
        get: function () {
            return io.activateBorderColor;
        },
        set: function (v) {
            io.activateBorderColor = v;
        }
    });

    io.SetFontSize = function (v) {
        io.testSize = v;
        io.inputE.style.fontSize = v;
        io.placeHolderE.style.fontSize = v;
    }
    io.SetFontFamily = function (v) {
        io.inputE.style.fontFamily = v;
        io.placeHolderE.style.fontFamily = v;
    }

    io.SetFontStyle = function (v) {
        io.inputE.style.fontStyle = v;
        io.inputE.style.fontWeight = v;
    }

    io.SetWidth = function (v) {
        io.VisualElement.style.width = v;
    }

    io.SetHeight = function (v) {
        io.VisualElement.style.height = v;
    }

    io.SetBorderRadius = function (v) {
        io.VisualElement.style.borderRadius = v;
    }

    io.testSize = '11px';
    io.characters = [];

    //TODO:添加valueChanged事件  让使用此控件的人在输入框文本改变时做处理
    io.ValueChanged = function (v) {

    }


    io.settleKeyboard = function (keyboard) {
        switch (io.dataType) {
            case 'phoneNum'://手机号码
                keyboard.KbWidth = window.innerWidth;
                var w = keyboard.KbWidth;
                keyboard.RowSpacing = (w - w / 4 * 3) / 4;

                keyboard.HiddenBtnText = '收起键盘';
                // keyboard.TitleImg = '120px.png';
                keyboard.TitleText = '键盘';


                //配置键盘按键
                keyboard.ItemSource = [
                    { 'code': '1', 'text': '1', 'w': w / 4, 'h': w / 8 },
                    { 'code': '2', 'text': '2', 'w': w / 4, 'h': w / 8 },
                    { 'code': '3', 'text': '3', 'w': w / 4, 'h': w / 8 },
                    { 'code': '4', 'text': '4', 'w': w / 4, 'h': w / 8 },
                    { 'code': '5', 'text': '5', 'w': w / 4, 'h': w / 8 },
                    { 'code': '6', 'text': '6', 'w': w / 4, 'h': w / 8 },
                    { 'code': '7', 'text': '7', 'w': w / 4, 'h': w / 8 },
                    { 'code': '8', 'text': '8', 'w': w / 4, 'h': w / 8 },
                    { 'code': '9', 'text': '9', 'w': w / 4, 'h': w / 8 },
                    { 'code': '0', 'text': '0', 'w': w / 4, 'h': w / 8 },
                    { 'code': 'enter', 'text': '确认', 'w': w / 4, 'h': w / 8 },
                    { 'code': 'delete', 'text': '删除', 'w': w / 4, 'h': w / 8 }
                ];
                break;
            case 'IDNum'://身份证号码
                keyboard.KbWidth = window.innerWidth;
                var w = keyboard.KbWidth;
                keyboard.RowSpacing = (w - w / 4 * 3) / 4;

                keyboard.HiddenBtnText = '收起键盘';
                // keyboard.TitleImg = '120px.png';
                keyboard.TitleText = '键盘';

                //配置键盘按键
                keyboard.ItemSource = [
                    { 'code': '1', 'text': '1', 'w': w / 4, 'h': w / 8 },
                    { 'code': '2', 'text': '2', 'w': w / 4, 'h': w / 8 },
                    { 'code': '3', 'text': '3', 'w': w / 4, 'h': w / 8 },
                    { 'code': '4', 'text': '4', 'w': w / 4, 'h': w / 8 },
                    { 'code': '5', 'text': '5', 'w': w / 4, 'h': w / 8 },
                    { 'code': '6', 'text': '6', 'w': w / 4, 'h': w / 8 },
                    { 'code': '7', 'text': '7', 'w': w / 4, 'h': w / 8 },
                    { 'code': '8', 'text': '8', 'w': w / 4, 'h': w / 8 },
                    { 'code': '9', 'text': '9', 'w': w / 4, 'h': w / 8 },
                    { 'code': '0', 'text': '0', 'w': w / 4, 'h': w / 8 },
                    { 'code': '10', 'text': 'X', 'w': w / 4, 'h': w / 8 },
                    { 'code': 'delete', 'text': '删除', 'w': w / 4, 'h': w / 8 }
                ];
                break;
            case 'numbers'://数字键盘
                keyboard.KbWidth = window.innerWidth;
                var w = keyboard.KbWidth;
                keyboard.RowSpacing = (w - w / 4 * 3) / 4;

                keyboard.HiddenBtnText = '收起键盘';
                // keyboard.TitleImg = '120px.png';
                keyboard.TitleText = '键盘';

                //配置键盘按键
                keyboard.ItemSource = [
                    { 'code': '1', 'text': '1', 'w': w / 4, 'h': w / 8 },
                    { 'code': '2', 'text': '2', 'w': w / 4, 'h': w / 8 },
                    { 'code': '3', 'text': '3', 'w': w / 4, 'h': w / 8 },
                    { 'code': '4', 'text': '4', 'w': w / 4, 'h': w / 8 },
                    { 'code': '5', 'text': '5', 'w': w / 4, 'h': w / 8 },
                    { 'code': '6', 'text': '6', 'w': w / 4, 'h': w / 8 },
                    { 'code': '7', 'text': '7', 'w': w / 4, 'h': w / 8 },
                    { 'code': '8', 'text': '8', 'w': w / 4, 'h': w / 8 },
                    { 'code': '9', 'text': '9', 'w': w / 4, 'h': w / 8 },
                    { 'code': '0', 'text': '0', 'w': w / 4, 'h': w / 8 },
                    { 'code': '10', 'text': '.', 'w': w / 4, 'h': w / 8 },
                    { 'code': 'delete', 'text': '删除', 'w': w / 9, 'h': w / 8 }
                ];
                break;
            case 'naviBar'://导航
                keyboard.KbWidth = '40px';
                // keyboard.KbHeight = '500px';

                var w = keyboard.KbWidth;
                // keyboard.RowSpacing = (w-180*3)/4;
                keyboard.RowSpacing = 5;
                //不显示键盘头部
                keyboard.IsShowHead = false;

                //配置键盘按键
                var keys = [];
                for (var i = 0; i < 26; i++) {
                    var key = {};
                    key['code'] = i;
                    key['text'] = String.fromCharCode(65 + i);
                    key['w'] = 16;
                    key['h'] = 16;
                    key['tsize'] = 11;
                    keys.push(key);
                }
                keyboard.ItemSource = keys;
                break;
            default:
                break;
        }

    }

    //键盘是否显示 默认隐藏
    io.keyboardShow = false;



    //文本框被点击
    io.VisualElement.onmousedown = function (ev) {

        var keyboard = DBFX.Web.Controls.Keyboard;

        //判断是否是当前选中的输入框  不是的话 之前的输入框就要做失去焦点的处理
        if (keyboard.inputBinding != io && keyboard.inputBinding != undefined) {

            keyboard.inputBinding.cursorE.style.display = 'none';
            keyboard.unshow();
            keyboard.inputBinding.keyboardShow = false;
            keyboard.inputBinding.VisualElement.style.borderColor = '#bbb';
        }

        io.VisualElement.style.borderColor = io.activateBorderColor;

        if (io.keyboardShow) {
            return;
        }


        io.placeHolderE.innerText = '';
        //鼠标点击输入框时闪动光标显示 进行动画
        io.cursorE.style.display = 'inline-block';

        keyboard.inputBinding = io;

        //这个方法不能在对象输入框创建时就绑定  后创建的输入框会覆盖！！！
        keyboard.KeyPressed = function (key) {


            if (key.KeyCode == 'delete') {//删除键
                io.inputE.innerText = io.inputE.innerText.substring(0, io.inputE.innerText.length - 1);
                if (io.characters.length > 0) {
                    io.characters.pop();
                }
            } else if (key.KeyCode == 'enter') {//确认键
                // io.hiddenKeyboard();
                if (app.GoBack) {
                    app.GoBack();
                } else {
                    io.hiddenKeyboard();
                }


            } else if (key.KeyCode == 'hidden') {
                // io.hiddenKeyboard();
                if (app.GoBack) {
                    app.GoBack();
                } else {
                    io.hiddenKeyboard();
                }
            } else {
                io.characters.push(key.Character);
                io.inputE.innerText += key.Character;
            }

            var w = window.getComputedStyle(io.inputE, null).width;


            if (parseFloat(w) > 140) {
                io.inputE.style.left = 140 - parseFloat(w) + 'px';
            }

            io.cursorE.style.left = parseFloat(w) < 140 ? w : '140px';

            io.ValueChanged(io.inputE.innerText);

        }



        io.settleKeyboard(keyboard);
        //键盘弹出样式
        keyboard.ShowStyle = 'bottomToTop';

        if (!io.keyboardShow) {
            //键盘显示前添加一个透明蒙版
            document.body.appendChild(io.maskE);

            //键盘显示
            keyboard.show();

            io.keyboardShow = true;
        }

    }

    //隐藏键盘需要做的处理
    io.hiddenKeyboard = function () {
        //蒙版移除
        document.body.removeChild(io.maskE);
        //光标隐藏
        io.cursorE.style.display = 'none';
        DBFX.Web.Controls.Keyboard.unshow();
        io.keyboardShow = false;
        io.VisualElement.style.borderColor = '#bbb';
    }


    io.onload = function () {
        var ioE = io.VisualElement;
        ioE.style.width = '150px';
        ioE.style.height = '20px';
        ioE.style.border = '1px solid #bbb';
        ioE.style.borderRadius = '3px';


        //
        io.textBox = document.createElement('div');
        io.textBox.style.width = "100%";
        io.textBox.style.height = "100%";
        io.textBox.style.position = "relative";
        io.textBox.style.overflow = 'hidden';
        io.textBox.style.display = "flex";
        io.textBox.style.flexDirection = "column";
        io.textBox.style.justifyContent = "center";
        ioE.appendChild(io.textBox);


        //显示提示文字的标签
        io.placeHolderE = document.createElement('div');
        io.placeHolderE.innerText = io.placeHolderText;
        io.placeHolderE.style.color = "#888";
        io.placeHolderE.style.fontSize = "11px";
        io.placeHolderE.style.textIndent = '3px';
        io.textBox.appendChild(io.placeHolderE);


        //使用div模拟文本输入框
        io.inputE = document.createElement('div');
        io.inputE.style.display = 'inline-block';
        io.inputE.style.cssFloat = 'left';
        io.inputE.style.position = 'absolute';
        io.inputE.style.left = '3px';
        // io.inputE.style.zIndex = -1;
        io.textBox.appendChild(io.inputE);

        //使用div模拟浮动光标
        io.cursorE = document.createElement('div');
        io.cursorE.style.width = '2px';
        io.cursorE.style.height = '75%';
        //和输入文本框相距3px
        io.cursorE.style.marginLeft = '3px';
        io.cursorE.style.display = 'none';
        io.cursorE.style.position = 'absolute';
        io.cursorE.style.cssFloat = 'left';
        //实现光标的闪动效果
        io.cursorE.classList.add("textcursorAnimation");
        io.textBox.appendChild(io.cursorE);

        //FIXME:创建一个蒙版 用于判断点击不在输入框范围内的处理
        io.maskE = document.createElement('div');

        io.maskE.style.width = window.innerWidth + 'px';
        io.maskE.style.height = window.innerHeight + 'px';
        io.maskE.style.position = 'fixed';
        io.maskE.style.left = "0px";
        io.maskE.style.top = "0px";
        io.maskE.style.backgroundColor = 'rgba(255,255,255,0)';

        io.maskE.onmousedown = function (ev) {
            // io.hiddenKeyboard();
            console.log(app);
            if (app.GoBack) {
                app.GoBack();
            } else {
                io.hiddenKeyboard();
            }
        }

    }
    io.onload();
    return io;
}
DBFX.Serializer.CustomizeInputBoxSerializer = function () {

    //反系列化
    this.DeSerialize = function (c, xe, ns) {
        DBFX.Serializer.DeSerialProperty("DataType", c, xe);
        DBFX.Serializer.DeSerialProperty("PlaceHolderText", c, xe);
        DBFX.Serializer.DeSerialProperty("ActivateBorderColor", c, xe);
    }

    //系列化
    this.Serialize = function (c, xe, ns) {
        DBFX.Serializer.SerialProperty("DataType", c.DataType, xe);
        DBFX.Serializer.SerialProperty("PlaceHolderText", c.PlaceHolderText, xe);
        DBFX.Serializer.SerialProperty("ActivateBorderColor", c.ActivateBorderColor, xe);
    }
}
DBFX.Design.ControlDesigners.CustomizeInputBoxDesigner = function () {

    var obdc = new DBFX.Web.Controls.GroupPanel();
    obdc.OnCreateHandle();
    obdc.OnCreateHandle = function () {

        DBFX.Resources.LoadResource("design/DesignerTemplates/FormDesignerTemplates/CustomizeInputBoxDesigner.scrp", function (od) {
            od.DataContext = obdc.dataContext;
        }, obdc);
    }

    obdc.HorizonScrollbar = "hidden";
    obdc.OnCreateHandle();
    obdc.Class = "VDE_Design_ObjectGeneralDesigner";
    obdc.Text = "自定义输入框控件";
    return obdc;
}

//键盘类
DBFX.Web.Controls.SoftKeyboard = function () {

    var kb = DBFX.Web.Controls.Control("SoftKeyboard");

    kb.VisualElement = document.createElement('div');
    kb.OnCreateHandle();

    //键盘类型 手机号、身份证、数据（有小数点）、侧边定位导航（A-Z 通讯录快速定位）
    /*
    * phoneNum、IDNum、numbers、naviBar
    *
    * */
    kb.type = "phoneNum";
    Object.defineProperty(kb, 'Type', {
        get: function () {
            return kb.type;
        },
        set: function (v) {
            kb.type = v;
            kb.reLayout();
        }
    });

    //键盘展现方式
    /*
    * 从左侧出现-leftToRight; 从右侧出现-rightToLeft
    * 从底部出现-bottomToTop; 从顶部出现-topToBottom
    *从右侧中部出现rightToLeftCenter
    * */
    kb.showStyle = 'bottomToTop';
    Object.defineProperty(kb, 'ShowStyle', {
        get: function () {
            return kb.showStyle;
        },
        set: function (v) {
            kb.showStyle = v;
            kb.setOriginalPos();

        }
    });


    //键盘宽度
    kb.kbWidth = 500;
    Object.defineProperty(kb, 'KbWidth', {
        get: function () {
            return kb.kbWidth;
        },
        set: function (v) {
            kb.kbWidth = v;
            kb.reLayout();
        }
    });
    //键盘高度
    kb.kbHeight = 100;
    Object.defineProperty(kb, 'KbHeight', {
        get: function () {
            return kb.kbHeight;
        },
        set: function (v) {
            kb.kbHeight = v;
            kb.VisualElement.style.height = (v + '').indexOf('%') != -1 ? v : parseFloat(v) + 'px';
            kb.reLayout();
        }
    });

    //两行按键间距 行间距
    kb.lineSpacing = 12;
    Object.defineProperty(kb, 'LineSpacing', {
        get: function () {
            return kb.lineSpacing;
        },
        set: function (v) {
            kb.lineSpacing = v;
            kb.reLayout();
        }
    });
    //同行按键的间距
    kb.rowSpacing = 12;
    Object.defineProperty(kb, 'RowSpacing', {
        get: function () {
            return kb.rowSpacing;
        },
        set: function (v) {
            kb.rowSpacing = v;
            kb.reLayout();
        }
    });

    //隐藏键盘按钮文字
    kb.hiddenBtnText = '收起键盘';
    Object.defineProperty(kb, 'HiddenBtnText', {
        get: function () {
            return kb.hiddenBtnText;
        },
        set: function (v) {
            kb.hiddenBtnText = v;
            kb.reLayout();
        }
    });

    //隐藏键盘按钮图片
    kb.hiddenBtnImg = '';
    Object.defineProperty(kb, 'HiddenBtnImg', {
        get: function () {
            return kb.hiddenBtnImg;
        },
        set: function (v) {
            kb.hiddenBtnImg = v;
            kb.reLayout();
        }
    });

    //是否显示键盘头部
    kb.isShowHead = true;
    Object.defineProperty(kb, 'IsShowHead', {
        get: function () {
            return kb.isShowHead;
        },
        set: function (v) {
            kb.isShowHead = v;
            if (v) {
                kb.headElement.style.display = 'block';
            } else {
                kb.headElement.style.display = 'none';
            }

        }
    });

    //头部标题栏文字
    kb.titleText = '键盘';
    Object.defineProperty(kb, 'TitleText', {
        get: function () {
            return kb.titleText;
        },
        set: function (v) {
            kb.titleText = v;
            kb.titleElement.innerText = v;
        }
    });
    //头部标题栏图片
    kb.titleImg = '';
    Object.defineProperty(kb, 'TitleImg', {
        get: function () {
            return kb.titleImg;
        },
        set: function (v) {
            kb.titleImg = v;
            kb.titleElement.innerHTML = "<IMG class=\"titleImg\" src=\"" + v + "\" />";
            kb.titleElement.querySelector('.titleImg').style.maxHeight = '50px';

        }
    });


    //按键集合
    /**按键配置属性
     * code:按键码 默认0
     * text：显示文字 默认0;     bgc：背景颜色 默认：transparent;      tsize：显示文字大小  默认12 ;
     * tcolor:文字颜色 默认#4B4B4B；   tfamily:文字字体 默认：宋体；
     * w：宽度 默认30 ;  h:高度 默认30 ;   display：css样式中的display 默认inline-block;
     * float：浮动 默认left;     imgURL:显示图片地址 默认空;
     */

    kb.Keys = [];

    //键盘中按键的配置
    Object.defineProperty(kb, "ItemSource", {
        get: function () {

            return kb.Keys;

        },
        set: function (v) {
            kb.Keys = v;
            kb.reLayout();

        }
    });


    //设置弹出前的初始位置
    kb.setOriginalPos = function () {
        //初始设置放在这里可以避免点击输入框时反复弹出键盘

        kb.VisualElement.style.top = '';
        kb.VisualElement.style.left = '0px';

        switch (kb.showStyle) {
            case 'bottomToTop'://从底部出现
                kb.VisualElement.style.top = window.innerHeight * 1.1 + 'px';
                break;
            case 'topToBottom'://从顶部出现
                kb.VisualElement.style.top = -window.innerHeight + 'px';

                // kb.VisualElement.style.top = 0 +'px';
                break;
            case 'leftToRight'://从左侧出现
                kb.VisualElement.style.left = -window.innerWidth + 'px';
                break;
            case 'rightToLeft'://从右侧出现
                kb.VisualElement.style.left = window.innerWidth + 'px';
                break;
            case 'rightToLeftCenter':
                kb.VisualElement.style.left = window.innerWidth + 'px';
                kb.VisualElement.style.top = window.innerHeight * 0.5 + 'px';
                break;
            default:
                break;
        }
    }


    //布局按键
    kb.reLayout = function () {

        if (!Array.isArray(kb.Keys))
            return;

        kb.keysArea.innerHTML = '';
        for (var i = 0; i < kb.Keys.length; i++) {
            var obj = kb.Keys[i];
            var skey = new DBFX.Web.Controls.SoftKey();
            skey.Keyboard = kb;
            kb.keysArea.appendChild(skey.VisualElement);

            skey.KeyCode = obj['code'] || '';
            skey.Character = obj['text'] || '';
            skey.KeyWidth = obj['w'] || 30;
            skey.KeyHeight = obj['h'] || 30;
            skey.BgColor = obj['bgc'] || 'transparent';
            skey.CharacterSize = obj['tsize'] || 25;//100
            skey.CharacterColor = obj['tcolor'] || '#4B4B4B';
            skey.CharacterFamily = obj['tfamily'] || '粗体';

            skey.VisualElement.style.display = obj['display'] || 'inline-block';
            skey.VisualElement.style.cssFloat = obj['float'] || 'left';
            skey.KeyImageUrl = obj['imgURL'] || '';

            skey.BorderW = obj['borderW'] || 2;
            skey.BorderC = obj['borderC'] || 'rgba(255,255,255,1)';
            skey.BorderR = obj['borderR'] || '8px';


            skey.LeftMargin = parseFloat(kb.rowSpacing) + 'px';
            // skey.RightMargin = parseFloat(kb.rowSpacing)+'px';
            skey.TopMargin = parseFloat(kb.lineSpacing) * 0.5 + 'px';
            skey.BottomMargin = parseFloat(kb.lineSpacing) * 0.5 + 'px';



            // Object.keys(obj).forEach(function (value) {
            //    skey[value] = obj[value];
            // });
        }

        kb.hiddenBtn.innerHTML = '';
        var hiddenK = new DBFX.Web.Controls.SoftKey();
        hiddenK.Keyboard = kb;
        kb.hiddenBtn.appendChild(hiddenK.VisualElement);


        hiddenK.KeyImageUrl = kb.hiddenBtnImg;
        hiddenK.KeyCode = "hidden";
        hiddenK.Character = kb.hiddenBtnText;
        hiddenK.CharacterSize = 12;
        hiddenK.BorderW = 0;
        hiddenK.KeyHeight = '40px';
        hiddenK.KeyWidth = '60px';

    }

    //触发按键
    kb.OnKeyPressed = function (key) {

        if (kb.KeyPressed != undefined && kb.KeyPressed.GetType() == "Command") {

            kb.KeyPressed.Sender = key;
            kb.KeyPressed.Execute();
        }


        if (kb.KeyPressed != undefined && typeof kb.KeyPressed == "function") {

            kb.KeyPressed(key);

        }

    }


    //键盘按键显示的字符
    kb.characters = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '确认'];



    //键盘展现方式
    /*
    * 从左侧出现-leftToRight; 从右侧出现-rightToLeft
    * 从底部出现-bottomToTop; 从顶部出现-topToBottom
    *
    * */
    // kb.showStyle = 'leftToRight';

    //键盘展示
    kb.show = function () {


        app.SaveState('hiddenKeyboard', io.hiddenKeyboard);

        kb.VisualElement.style.position = 'fixed';
        //设置动画
        kb.VisualElement.style.transition = "all 200ms linear";

        kb.VisualElement.style.width = (kb.kbWidth + '').indexOf('%') != -1 ? kb.kbWidth : parseFloat(kb.kbWidth) + 'px';

        document.body.appendChild(kb.VisualElement);
        var h = window.getComputedStyle(kb.VisualElement, null).height;
        var w = window.getComputedStyle(kb.VisualElement, null).width;


        switch (kb.showStyle) {
            case 'bottomToTop'://从底部出现
                kb.VisualElement.style.minHeight = '300px';
                kb.VisualElement.style.top = window.innerHeight - parseFloat(h) + 'px';
                break;
            case 'topToBottom'://从顶部出现
                console.log('从顶部出现');
                kb.VisualElement.style.top = window.innerHeight - parseFloat(h) + 'px';
                break;
            case 'leftToRight'://从左侧出现
                kb.VisualElement.style.left = '0px';
                kb.VisualElement.style.top = window.innerHeight - parseFloat(h) + 'px';
                break;
            case 'rightToLeft'://从右侧出现
                kb.VisualElement.style.left = '0px';
                kb.VisualElement.style.top = window.innerHeight - parseFloat(h) + 'px';
                break;
            case 'rightToLeftCenter':
                kb.VisualElement.style.left = '0px';
                kb.VisualElement.style.top = window.innerHeight - parseFloat(h) + 'px';
                break;
            default:
                break;
        }

        //布局按键
        kb.reLayout();

    }

    //隐藏键盘
    kb.unshow = function () {
        switch (kb.showStyle) {
            case 'bottomToTop'://从底部出现
                kb.VisualElement.style.top = window.innerHeight + 'px';
                break;
            case 'topToBottom'://从顶部出现
                kb.VisualElement.style.top = -window.innerHeight + 'px';
                break;
            case 'leftToRight'://从左侧出现
                kb.VisualElement.style.left = -window.innerWidth + 'px';
                break;
            case 'rightToLeft'://从右侧出现
                kb.VisualElement.style.left = window.innerWidth + 'px';
                break;
            default:
                break;
        }

    }


    kb.onload = function () {
        kb.VisualElement.style.width = parseFloat(kb.kbWidth) + 'px';
        // kb.VisualElement.style.height = parseFloat(kb.kbHeight)+'px';
        //#cbcbcb
        kb.VisualElement.style.backgroundColor = 'transparent';
        kb.VisualElement.style.overflow = 'hidden';
        kb.VisualElement.style.margin = '0px';
        kb.VisualElement.style.left = '0px';
        kb.VisualElement.style.background = 'rgba(0,0,0,0.1)';

        // console.log('键盘类加载时屏幕的宽度'+window.innerWidth);
        //初始化时就设置键盘的宽度为窗口的宽度
        // kb.kbWidth = window.innerWidth;

        //键盘头部
        kb.headElement = document.createElement('div');
        kb.headElement.style.width = "100%";
        kb.headElement.style.height = "50px";
        kb.headElement.style.position = "relative";
        kb.headElement.style.lineHeight = "50px";
        kb.headElement.style.borderBottom = '2px solid #ccc';
        kb.VisualElement.appendChild(kb.headElement);

        //头部标题栏
        kb.titleElement = document.createElement('div');
        kb.titleElement.style.display = "inline-block";
        kb.titleElement.style.width = '100%';
        kb.titleElement.innerText = '键盘';
        kb.titleElement.style.textAlign = 'center';
        kb.headElement.appendChild(kb.titleElement);

        //头部右侧隐藏键盘按钮
        kb.hiddenBtn = document.createElement('div');
        kb.hiddenBtn.style.position = 'absolute';
        kb.hiddenBtn.style.right = '50px';
        kb.hiddenBtn.style.bottom = '3px';
        // kb.hiddenBtn.style.height = '40px';
        // kb.hiddenBtn.style.width = '40px';
        kb.hiddenBtn.style.overflow = "hidden";
        kb.headElement.appendChild(kb.hiddenBtn);

        // kb.downArrow = document.createElement('img');
        // kb.downArrow.src = "down.jpg";
        // // kb.downArrow.style.width = "40px";
        // kb.downArrow.style.height = "40px";
        // kb.hiddenBtn.appendChild(kb.downArrow);

        //按键区
        kb.keysArea = document.createElement('div');
        kb.keysArea.style.width = "100%";
        kb.VisualElement.appendChild(kb.keysArea);

        kb.setOriginalPos();
        // kb.createKeyboard();
        kb.reLayout();

    }

    kb.onload();
    return kb;
}

//按键类
DBFX.Web.Controls.SoftKey = function () {

    var k = DBFX.Web.Controls.Control("SoftKey");

    k.VisualElement = document.createElement("DIV");
    k.OnCreateHandle();



    //显示字符
    k.character = "按键";
    Object.defineProperty(k, "Character", {
        get: function () {
            return k.character;
        },
        set: function (v) {
            k.character = v;
            // k.setAppearance();
            k.textE.innerText = v;
        }
    });

    //按键代码
    Object.defineProperty(k, "KeyCode", {
        get: function () {
            return k.keyCode;
        },
        set: function (v) {
            k.keyCode = v;
        }
    });

    //按键图片链接
    Object.defineProperty(k, "KeyImageUrl", {
        get: function () {
            return k.keyImageUrl;
        },
        set: function (v) {
            if (v != undefined && v != '') {
                k.keyImageUrl = v;
                k.keyElement.innerHTML = "<IMG class=\"SoftKey\" src=\"" + v + "\" />";
            }
        }
    });


    //字符颜色
    k.characterColor = '#fff';
    Object.defineProperty(k, "CharacterColor", {
        get: function () {
            return k.characterColor;
        },
        set: function (v) {
            k.characterColor = v;
            k.textE.style.color = v;
        }
    });
    //字符字体
    k.characterFamily = '宋体';
    Object.defineProperty(k, "CharacterFamily", {
        get: function () {
            return k.characterFamily;
        },
        set: function (v) {
            k.characterFamily = v;
            k.textE.style.fontFamily = v;
        }
    });
    //字符大小
    k.characterSize = 12;
    Object.defineProperty(k, "CharacterSize", {
        get: function () {
            return k.characterSize;
        },
        set: function (v) {
            k.characterSize = v;
            k.textE.style.fontSize = parseInt(v) + "px";
        }
    });

    //按键背景色  #9ab3cb   transparent
    k.bgColor = 'transparent';
    Object.defineProperty(k, "BgColor", {
        get: function () {
            return k.bgColor;
        },
        set: function (v) {
            k.bgColor = v;
            k.setAppearance();
            // k.keyElement.style.backgroundColor = v;
            // k.VisualElement.style.backgroundColor = 'transparent';
        }
    });

    //高亮时（按下时）背景颜色
    k.highlightBgColor = '#f9f9f9';
    //高亮时（按下时）字体颜色
    k.highlightCharactorColor = ''

    //宽度
    k.keyWidth = 30;
    Object.defineProperty(k, "KeyWidth", {
        get: function () {
            return k.keyWidth;
        },
        set: function (v) {
            k.keyWidth = v;
            k.setAppearance();
        }
    });

    //height
    k.keyHeight = 30;
    Object.defineProperty(k, "KeyHeight", {
        get: function () {
            return k.keyHeight;
        },
        set: function (v) {
            k.keyHeight = v;
            k.setAppearance();
        }
    });


    //border
    k.borderW = 1;
    Object.defineProperty(k, "BorderW", {
        get: function () {
            return k.borderW;
        },
        set: function (v) {
            k.borderW = v;
            k.setAppearance();
        }
    });
    k.borderC = 'red';
    Object.defineProperty(k, "BorderC", {
        get: function () {
            return k.borderC;
        },
        set: function (v) {
            k.borderC = v;
            k.setAppearance();
        }
    });
    k.borderR = 5;
    Object.defineProperty(k, "BorderR", {
        get: function () {
            return k.borderR;
        },
        set: function (v) {
            k.borderR = v;
            k.setAppearance();
        }
    });

    //margin
    k.leftMargin = 0;
    Object.defineProperty(k, "LeftMargin", {
        get: function () {
            return k.leftMargin;
        },
        set: function (v) {
            k.leftMargin = v;
            k.setAppearance();
        }
    });
    k.rightMargin = 0;
    Object.defineProperty(k, "RightMargin", {
        get: function () {
            return k.rightMargin;
        },
        set: function (v) {
            k.rightMargin = v;
            k.setAppearance();
        }
    });
    k.topMargin = 0;
    Object.defineProperty(k, "TopMargin", {
        get: function () {
            return k.topMargin;
        },
        set: function (v) {
            k.topMargin = v;
            k.setAppearance();
        }
    });
    k.bottomMargin = 0;
    Object.defineProperty(k, "BottomMargin", {
        get: function () {
            return k.bottomMargin;
        },
        set: function (v) {
            k.bottomMargin = v;
            k.setAppearance();
        }
    });




    /*事件处理部分*/
    //mousedown
    k.VisualElement.addEventListener('mousedown', function (event) {
        event.preventDefault();
        // k.onPress(k);

        //TODO:获取点击时按钮的背景颜色 需要调试
        k.defaultBC = window.getComputedStyle(k.VisualElement, null).backgroundColor;
        k.BgColor = k.highlightBgColor;

        k.keyClick(event);

    }, false);

    //mouseup
    k.VisualElement.addEventListener('mouseup', function () {
        k.BgColor = k.defaultBC;
        // k.setOriginal();
    }, false);

    //touchstart
    k.VisualElement.addEventListener('touchstart', function (event) {
        event.preventDefault();

        k.defaultBC = window.getComputedStyle(k.VisualElement, null).backgroundColor;
        k.BgColor = k.highlightBgColor;

        // k.onPress(k);
        k.keyClick(event);
    }, false);

    //touchend
    k.VisualElement.addEventListener('touchend', function (event) {
        event.preventDefault();
        k.BgColor = k.defaultBC;
        // k.setOriginal();
    }, false);

    //touchcancel
    k.VisualElement.addEventListener('touchcancel', function (event) {
        event.preventDefault();
        k.BgColor = k.defaultBC;
        // k.setOriginal();
    }, false);

    //handle event
    k.onPress = function (k) {
        console.log(k.character);
        k.BgColor = "red";
    }




    /*样式设置部分*/
    //设置外表显示
    k.setAppearance = function () {
        var key = k.VisualElement;
        // key.style.width = (parseFloat(k.keyWidth)-parseFloat(k.borderW)*2)+'px';
        // key.style.height = (parseFloat(k.keyHeight)-parseFloat(k.borderW)*2)+'px';

        key.style.width = parseFloat(k.keyWidth) + 'px';
        key.style.height = parseFloat(k.keyHeight) + 'px';

        key.style.backgroundColor = k.bgColor;
        key.style.fontSize = parseFloat(k.characterSize) + "px";
        key.style.borderWidth = parseFloat(k.borderW) + "px";
        key.style.borderStyle = "solid";
        key.style.borderRadius = (k.borderR + '').indexOf('%') != -1 ? k.borderR : parseFloat(k.borderR) + "px";
        key.style.borderColor = k.borderC;

        //设置间距
        key.style.marginLeft = parseFloat(k.leftMargin) + "px";
        key.style.marginRight = parseFloat(k.rightMargin) + "px";
        key.style.marginTop = parseFloat(k.topMargin) + "px";
        key.style.marginBottom = parseFloat(k.bottomMargin) + "px";


        //TODO:垂直居中 如果上下边框宽不同  则要增加上、下边框宽度设置属性  然后更改此处代码为：
        //(parseFloat(k.keyHeight)-parseFloat(k.borderTopW)-parseFloat(k.borderBottomW))+'px'
        key.style.lineHeight = (parseFloat(k.keyHeight) - parseFloat(k.borderW) * 2) + 'px';

        // k.textE.innerText = k.character;
        // k.textE.style.backgroundColor = k.bgColor;
        k.keyElement.style.width = parseFloat(k.keyWidth) + 'px';
        k.keyElement.style.height = parseFloat(k.keyHeight) + 'px';
        // k.textE.style.lineHeight = parseFloat(k.keyHeight)+'px';
    }

    //设置最初样式
    k.setOriginal = function () {
        var key = k.VisualElement;

        key.style.backgroundColor = k.originBgColor;
        key.style.borderRadius = parseFloat(k.originBorderR) + "px";

        key.style.borderWidth = parseFloat(k.originBorderW) + "px";
        key.style.borderStyle = "solid";
        key.style.borderColor = k.originBorderC;

    }

    /**
     * 设置标签元素的样式style
     * @param element 标签元素
     * @param styleObj 样式对象
     */
    k.setElementStyle = function (element, styleObj) {
        if (typeof styleObj != "object") {
            return;
        }

        Object.keys(styleObj).forEach(function (key) {
            element.style.key = styleObj[key];
        });
    }

    //按键被按下
    k.keyClick = function (e) {


        if (k.Keyboard != undefined) {
            k.Keyboard.OnKeyPressed(k);
        }
    }



    //创建时运行
    k.onload = function () {
        var key = k.VisualElement;

        key.style.boxSizing = 'border-box';


        k.keyElement = document.createElement('div');
        key.appendChild(k.keyElement);
        k.keyElement.style.display = "flex";
        k.keyElement.style.flexDirection = "column";
        k.keyElement.style.justifyContent = "center";
        k.keyElement.style.textAlign = 'center';

        k.textE = document.createElement('div');
        k.textE.style.display = "inline-block";
        k.textE.innerText = k.character;

        k.keyElement.appendChild(k.textE);

        //保存最原始的外貌形态
        k.originBgColor = k.bgColor;
        k.originBorderW = k.borderW;
        k.originBorderR = k.borderR;
        k.originBorderC = k.borderC;


        //设置外表显示
        k.setAppearance();

    }

    k.onload();

    return k;
}

//全局键盘
DBFX.Web.Controls.Keyboard = new DBFX.Web.Controls.SoftKeyboard();


DBFX.Web.Controls.MessageScrollBox = function () {

    var msb = DBFX.Web.Controls.Control("MessageScrollBox");
    msb.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.MessageScrollBoxDesigner");
    msb.ClassDescriptor.Serializer = "DBFX.Serializer.MessageScrollBoxSerializer";

    msb.VisualElement = document.createElement('DIV');
    msb.VisualElement.className = "MessageScrollBox";
    msb.OnCreateHandle();
    msb.OnCreateHandle = function () {
        msb.VisualElement.innerHTML = "<DIV class='MessageScrollBox_Container'><marquee class='MessageScrollBox_ScrollArea'></marquee></DIV>";

        msb.marqueeE = msb.VisualElement.querySelector("marquee.MessageScrollBox_ScrollArea");
        msb.marqueeE.scrollDelay = 300;
        msb.marqueeE.onmouseover = function (ev) {
            this.stop();
        }

        msb.marqueeE.onmouseout = function (ev) {
            this.start();
        }
    }

    //滚动方向
    msb.scrollDir = 'left';
    Object.defineProperty(msb, 'ScrollDir', {
        get: function () {
            return msb.scrollDir;
        },
        set: function (v) {
            msb.scrollDir = v;
            msb.marqueeE.direction = v;
            if (msb.scrollDir == 'up' || msb.scrollDir == 'down') {
                msb.marqueeE.style.flexDirection = "column";

            }
            if (msb.scrollDir == 'left' || msb.scrollDir == 'right') {
                msb.marqueeE.style.flexDirection = "row";

            }

        }
    });

    //滚动行为:scroll-环绕滚动（默认）;slide-滚动一次;alternate-来回滚动
    msb.scrollBehavior = 'scroll';
    Object.defineProperty(msb, 'ScrollBehavior', {
        get: function () {
            return msb.scrollBehavior;
        },
        set: function (v) {
            msb.scrollBehavior = v;
            msb.marqueeE.behavior = v;
        }
    });

    //滚动速度
    msb.scrollSpeed = 6;
    Object.defineProperty(msb, 'ScrollSpeed', {
        get: function () {
            return msb.scrollSpeed;
        },
        set: function (v) {
            msb.scrollSpeed = v;
            msb.marqueeE.scrollAmount = parseInt(v);
        }
    });

    //显示成员
    msb.displayMember = "Text";
    Object.defineProperty(msb, "DisplayMember", {
        get: function () {
            return msb.displayMember;
        },
        set: function (v) {
            msb.displayMember = v;
        }
    });


    //滚动次数
    //滚动数据源
    msb.datas = [''];
    Object.defineProperty(msb, 'Datas', {
        get: function () {
            return msb.datas;
        },
        set: function (v) {
            msb.datas = v;
            msb.layoutView(v);
        }
    });

    //背景色
    msb.SetBackgroundColor = function (v) {
        msb.marqueeE.bgColor = v;
    }

    msb.SetFontSize = function (v) {
        msb.marqueeE.style.fontSize = v;
    }
    msb.SetFontFamily = function (v) {
        msb.marqueeE.style.fontFamily = v;
    }

    msb.SetFontStyle = function (v) {
        msb.marqueeE.style.fontStyle = v;
        msb.marqueeE.style.fontWeight = v;
    }

    msb.SetWidth = function (v) {
        msb.VisualElement.style.width = v;
        // msb.marqueeE.width = parseInt(v);
    }
    msb.SetHeight = function (v) {
        msb.VisualElement.style.height = v;
        // msb.marqueeE.height = parseInt(v);
    }

    msb.SetBorderRadius = function (v) {
        msb.VisualElement.style.borderRadius = v;
    }

    //布局滚动元素
    msb.layoutView = function (datas) {

        //判断是否为数组
        if (datas instanceof Array) {

            //清空滚动区域的所有元素
            msb.marqueeE.innerText = '';

            var scrollText = '';

            for (var i = 0; i < datas.length; i++) {
                var messageE = document.createElement('div');
                messageE.style.display = 'inline-block';
                // messageE.style.height = '40px';
                messageE.innerText = datas[i];
                scrollText += datas[i];
                scrollText += "&emsp;&emsp;";

                //FIXME:
                // var msg = new DBFX.Web.Controls.Message();
                // msg.Title = '标题';
                // msg.Subtitle = datas[i];
                // msb.marqueeE.appendChild(msg.VisualElement);


                var brE = document.createElement('br');
                var brE01 = document.createElement('br');

                var spanE = document.createElement('span');
                spanE.className = "MessageScrollBox_MessageOld";
                spanE.innerText = datas[i];

                if (msb.scrollDir == 'up' || msb.scrollDir == 'down') {

                    msb.marqueeE.appendChild(messageE);
                    msb.marqueeE.appendChild(brE);
                    msb.marqueeE.appendChild(brE01);
                }

                if (msb.scrollDir == 'left' || msb.scrollDir == 'right') {
                    msb.marqueeE.appendChild(spanE);

                }

            }

            //TODO:
            // if(msb.scrollDir=='left' || msb.scrollDir == 'right'){
            //     msb.marqueeE.innerHTML = scrollText;
            // }
        }
    }

    //TODO:以下方法9.20
    Object.defineProperty(msb, 'ItemSource', {
        get: function () {
            return msb.itemSource;
        },
        set: function (v) {
            msb.itemSource = v;
            msb.createMsgs(v);
        }
    });

    //处理消息点击
    msb.handleMsgClick = function (e) {
        if (msb.Command != undefined && msb.Command != null) {
            msb.Command.Sender = msb;
            msb.Command.Execute();
        }
        if (msb.MessageClick != undefined && msb.MessageClick.GetType() == "Command") {
            msb.MessageClick.Sender = msb;
            msb.MessageClick.Execute();
        }

        if (msb.MessageClick != undefined && msb.MessageClick.GetType() == "function") {
            msb.MessageClick(e, msb);
        }
    }

    msb.MessageInfo = undefined;

    msb.createMsgs = function (datas) {
        if (!Array.isArray(datas)) return;
        //清空滚动区域的所有元素
        msb.marqueeE.innerText = '';

        for (var i = 0; i < datas.length; i++) {

            if (msb.scrollDir == 'up' || msb.scrollDir == 'down') {
                var messageE = document.createElement('div');
                messageE.className = "MessageScrollBox_MessageUp";
                // messageE.style.height = '40px';
                messageE.innerText = datas[i][msb.displayMember];
                messageE.info = datas[i];
                // msb.MessageInfo = datas[i];
                messageE.onmousedown = function (ev) {
                    msb.MessageInfo = this.info;
                    msb.handleMsgClick(ev);
                }

                var brE = document.createElement('br');
                var brE01 = document.createElement('br');

                msb.marqueeE.appendChild(messageE);
                msb.marqueeE.appendChild(brE);
                msb.marqueeE.appendChild(brE01);
            }


            if (msb.scrollDir == 'left' || msb.scrollDir == 'right') {
                var spanE = document.createElement('span');
                spanE.className = "MessageScrollBox_Message";
                spanE.innerText = datas[i][msb.displayMember];
                spanE.info = datas[i];
                spanE.onmousedown = function (ev) {
                    msb.MessageInfo = this.info;
                    msb.handleMsgClick(ev);
                }

                msb.marqueeE.appendChild(spanE);

            }
        }
    }

    msb.OnCreateHandle();
    return msb;

}
DBFX.Serializer.MessageScrollBoxSerializer = function () {

    //反系列化
    this.DeSerialize = function (c, xe, ns) {
        // DBFX.Serializer.DeSerialProperty("BgColor", c, xe);
        DBFX.Serializer.DeSerialProperty("ScrollDir", c, xe);
        DBFX.Serializer.DeSerialProperty("ScrollBehavior", c, xe);
        DBFX.Serializer.DeSerialProperty("ScrollSpeed", c, xe);
        DBFX.Serializer.DeSerialProperty("DisplayMember", c, xe);

        DBFX.Serializer.DeSerializeCommand("MessageClick", xe, c);
    }

    //系列化
    this.Serialize = function (c, xe, ns) {
        // DBFX.Serializer.SerialProperty("BgColor", c.BgColor, xe);
        DBFX.Serializer.SerialProperty("ScrollDir", c.ScrollDir, xe);
        DBFX.Serializer.SerialProperty("ScrollBehavior", c.ScrollBehavior, xe);
        DBFX.Serializer.SerialProperty("ScrollSpeed", c.ScrollSpeed, xe);
        DBFX.Serializer.SerialProperty("DisplayMember", c.DisplayMember, xe);

        DBFX.Serializer.SerializeCommand("MessageClick", c.MessageClick, xe);

    }
}
DBFX.Design.ControlDesigners.MessageScrollBoxDesigner = function () {

    var obdc = new DBFX.Web.Controls.GroupPanel();
    obdc.OnCreateHandle();
    obdc.OnCreateHandle = function () {

        DBFX.Resources.LoadResource("design/DesignerTemplates/FormDesignerTemplates/MessageScrollBoxDesigner.scrp", function (od) {
            od.DataContext = obdc.dataContext;

            //设计器中绑定事件处理
            od.EventListBox = od.FormContext.Form.FormControls.EventListBox;
            od.EventListBox.ItemSource = [{ EventName: "MessageClick", EventCode: undefined, Command: od.dataContext.MessageClick, Control: od.dataContext }];
        }, obdc);
    }

    //事件处理程序
    obdc.DataContextChanged = function (e) {
        obdc.DataBind(e);
        if (obdc.EventListBox != undefined) {
            obdc.EventListBox.ItemSource = [{ EventName: "MessageClick", EventCode: undefined, Command: obdc.dataContext.MessageClick, Control: obdc.dataContext }];
        }
    }

    obdc.HorizonScrollbar = "hidden";
    obdc.OnCreateHandle();
    obdc.Class = "VDE_Design_ObjectGeneralDesigner";
    obdc.Text = "消息滚动控件";
    return obdc;
}
DBFX.Web.Controls.Message = function () {
    var ms = DBFX.Web.Controls.Control("Message");
    ms.VisualElement = document.createElement('DIV');

    ms.title = '标题';
    Object.defineProperty(ms, 'Title', {
        get: function () {
            return ms.title;
        },
        set: function (v) {
            ms.title = v;
            ms.titleE.innerText = v;

        }
    });

    ms.subtitle = '副标题';
    Object.defineProperty(ms, 'Subtitle', {
        get: function () {
            return ms.subtitle;
        },
        set: function (v) {
            ms.subtitle = v;
            ms.subTitleE.innerText = v;
        }
    });

    ms.imgURL = '';
    Object.defineProperty(ms, 'ImgURL', {
        get: function () {
            return ms.imgURL;
        },
        set: function (v) {
            ms.imgURL = v;
            ms.pictureE.src = v;
        }
    });

    ms.onload = function () {
        var divE = ms.VisualElement;

        //标题
        ms.titleE = document.createElement('span');
        ms.titleE.style.wordBreak = 'keep-all';
        ms.titleE.style.display = 'inline-block';
        ms.titleE.style.width = '30px';
        ms.titleE.style.height = '50px';


        //副标题
        ms.subTitleE = document.createElement('span');
        ms.subTitleE.style.marginLeft = '30px';
        ms.subTitleE.style.width = '100px';
        ms.subTitleE.style.wordBreak = 'keep-all';

        //图片
        ms.pictureE = document.createElement('img');

        divE.appendChild(ms.titleE);
        divE.appendChild(ms.subTitleE);
        divE.appendChild(ms.pictureE);
    }

    ms.onload();
    return ms;
}


//分页导航控件
DBFX.Web.Controls.Pagination = function (b) {
    var pi = DBFX.Web.Controls.Control("Pagination");
    pi.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.PaginationDesigner");
    pi.ClassDescriptor.Serializer = "DBFX.Serializer.PaginationSerializer";

    pi.VisualElement = document.createElement("DIV");
    pi.VisualElement.className = "Pagination";
    pi.OnCreateHandle();
    pi.OnCreateHandle = function () {
        var ve = pi.VisualElement;

        // pi.innerContainer = document.createElement('div');
        // pi.innerContainer.className = "Pagination_InnerContainer";
        // ve.appendChild(pi.innerContainer);
        //
        // //创建分页容器div
        // pi.container = document.createElement("div");
        // pi.container.className = "Pagination_Container";
        // pi.innerContainer.appendChild(pi.container);

        ve.innerHTML = "<div class='Pagination_InnerContainer'><div class='Pagination_Container'></div><div class='Pagination_SkipPage' show='0'><span>跳转到</span><input type='number' class='Pagination_InputPage'><span>页</span><span class='Pagination_ConfirmBtn'>确定</span></div></div>";
        pi.innerContainer = ve.querySelector("div.Pagination_InnerContainer");
        pi.container = ve.querySelector("div.Pagination_Container");
        pi.ConfirmBtn = ve.querySelector("span.Pagination_ConfirmBtn");
        pi.inputBox = ve.querySelector("input.Pagination_InputPage");
        pi.skipPage = ve.querySelector("div.Pagination_SkipPage");
        pi.inputBox.min = "1";
        pi.inputBox.max = 1000;

        pi.ConfirmBtn.onmousedown = function (e) {
            e.cancelBubble = true;

            var page = pi.inputBox.value;
            page = (isNaN(page * 1) || page * 1 <= 0) ? 1 : page * 1;
            pi.SetPage(page);
            pi.inputBox.value = pi.currentPage;
        }

        pi.inputBox.onfocus = function (e) {
            this.value = "";
        }

        pi.inputBox.oninput = function (e) {
            if (this.value > pi.defaults.totalPages) {
                this.value = pi.defaults.totalPages;
            }
            if (this.value < 1) {
                this.value = 1;
            }

        }
        //先刷新数据
        pi.refreshData();
        //布局按钮
        pi.reLayoutViews();
    }

    pi.defaults = {
        perPageDatasCount: 30,//每页展示数据量
        totalDatasCount: 0.1,//总数据量
        currentPage: 1,//当前第几页,默认当前页为第1页
        totalPages: 1,//总页数
        prevCls: 'prev',            //上一页class
        nextCls: 'next',            //下一页class
        prevContent: '<',        //上一页内容
        nextContent: '>',        //下一页内容
        ellipsis: '...',         //省略文本内容
        count: 3,                //当前页前后分页个数
        jump: false,                //跳转到指定页数
        jumpIptCls: 'jump-ipt',    //文本框内容
        jumpBtnCls: 'jump-btn',    //跳转按钮
        jumpBtn: '跳转',            //跳转按钮文本
        callback: function () { }    //回调
    }

    pi.totalDatasCount = 1;

    //接收数据对象
    pi.dataSource = {};
    Object.defineProperty(pi, "DataSource", {
        get: function () {
            return pi.dataSource;
        },
        set: function (v) {
            pi.dataSource = v;
            pi.defaults.currentPage = 1;
            //解析拿到的数据
            pi.analysisSource(v);

            //刷新数据
            pi.refreshData();
            //布局按钮
            pi.reLayoutViews();
        }
    });

    //所有按钮字符串集合
    pi.allBtnTexts = [];

    //解析数据源数据
    pi.analysisSource = function (dataSource) {

        if (Object.prototype.toString.call(pi.dataSource) == "[object Object]") {
            // console.log(dataSource);
            pi.totalDatasCount = dataSource.dataCount || 0;
            pi.defaults.perPageDatasCount = dataSource.perPageCount || 20;
        }
        if (Object.prototype.toString.call(pi.dataSource) == "[object String]") {
            // console.log("json字符串");
            var jsonObj = JSON.parse(dataSource);
            pi.totalDatasCount = jsonObj.dataCount || 0;
            pi.defaults.perPageDatasCount = jsonObj.perPageCount || 20;
        }
    }

    //刷新显示数据方法 获取到显示字符集合
    pi.refreshData = function () {
        //确定需要展示的总页数
        pi.defaults.totalPages = Math.ceil(pi.totalDatasCount / pi.defaults.perPageDatasCount);

        pi.defaults.totalPages = pi.defaults.totalPages == 0 ? 1 : pi.defaults.totalPages;

        pi.defaults.currentPage = pi.defaults.currentPage > pi.defaults.totalPages && pi.defaults.currentPage > 1 ? pi.defaults.totalPages : pi.defaults.currentPage;

        console.log("当前选中页数：" + pi.defaults.currentPage);

        var curPage = pi.defaults.currentPage;
        var totalPages = pi.defaults.totalPages;
        var sideCount = pi.defaults.count % 2 == 0 ? pi.defaults.count - 1 : pi.defaults.count;

        sideCount = sideCount < 3 ? 3 : sideCount;

        //保存所有按钮的显示字符
        pi.allBtnTexts = [];

        //测试
        // sideCount = 5;
        // curPage = 43;
        // totalPages = 2;

        //总页数是否大于两倍的sidecount
        if (totalPages > sideCount * 2) {
            //判断当前点击的页数
            if (curPage - 1 >= sideCount && totalPages - curPage >= sideCount) {//1、当前点击页面处于中间地带时
                for (var i = 0; i < sideCount * 2 + 3; i++) {
                    pi.allBtnTexts[0] = pi.defaults.prevContent;
                    pi.allBtnTexts[Math.floor(sideCount / 2) + 1] = pi.defaults.ellipsis;
                    pi.allBtnTexts[sideCount + 1] = curPage;
                    pi.allBtnTexts[sideCount * 2 + 2 - Math.floor(sideCount / 2) - 1] = pi.defaults.ellipsis;
                    pi.allBtnTexts[sideCount * 2 + 2] = pi.defaults.nextContent;

                    //<和省略号之间显示的数值
                    if (i > 0 && i < Math.floor(sideCount / 2) + 1) {
                        pi.allBtnTexts[i] = i;
                    }
                    //第一个省略号和当前选中页面之间数值
                    if (i > Math.floor(sideCount / 2) + 1 && i < sideCount + 1) {
                        pi.allBtnTexts[i] = curPage - (sideCount + 1 - i);
                    }
                    //当前选中页面和第二个省略号之间数值
                    if (i > sideCount + 1 && i < (sideCount * 2 + 2 - Math.floor(sideCount / 2) - 1)) {
                        pi.allBtnTexts[i] = curPage + (i - (sideCount + 1));
                    }

                    if (i > (sideCount * 2 + 2 - Math.floor(sideCount / 2) - 1) && i < sideCount * 2 + 2) {
                        pi.allBtnTexts[i] = totalPages - (sideCount * 2 + 1 - i);
                    }

                }
            } else if (curPage - 1 < sideCount) {//2、当前点击页处于左侧时
                for (var i = 0; i < (sideCount + 1) * 2; i++) {
                    pi.allBtnTexts[i] = i;
                    if (i > sideCount + 1) {
                        pi.allBtnTexts[i] = totalPages - ((sideCount * 2) - i);
                    }
                    pi.allBtnTexts[sideCount + 2] = "...";
                    pi.allBtnTexts[0] = pi.defaults.prevContent;
                    pi.allBtnTexts[sideCount * 2 + 1] = pi.defaults.nextContent;
                }

            } else {//3、当前点击页处于右侧时
                // console.log('右=============');
                for (var i = 0; i < (sideCount + 1) * 2; i++) {
                    pi.allBtnTexts[i] = totalPages - ((sideCount * 2) - i);
                    if (i < sideCount) {
                        pi.allBtnTexts[i] = i;
                    }
                    pi.allBtnTexts[sideCount - 1] = "...";
                    pi.allBtnTexts[0] = pi.defaults.prevContent;
                    pi.allBtnTexts[sideCount * 2 + 1] = pi.defaults.nextContent;

                }
            }

        } else if (totalPages > 0) {//总页数少于两倍sidecound且大于0时
            for (var i = 0; i < totalPages + 2; i++) {
                pi.allBtnTexts[i] = i;
                pi.allBtnTexts[0] = pi.defaults.prevContent;
                pi.allBtnTexts[totalPages + 1] = pi.defaults.nextContent;
            }
        } else {//总页数为0时
            // pi.allBtnTexts[0] = "暂无数据";
            // pi.container.style.color = "red";
            pi.allBtnTexts[1] = 1;
            pi.allBtnTexts[0] = pi.defaults.prevContent;
            pi.allBtnTexts[2] = pi.defaults.nextContent;
        }
    }


    //重新布局控件
    pi.reLayoutViews = function () {
        //当前页数
        var curPage = pi.defaults.currentPage;

        //按钮少于3个时
        if (pi.allBtnTexts.length < 3) {
            pi.container.innerText = pi.allBtnTexts[0];
            return;
        }
        //清空已经存在的列表
        pi.container.innerHTML = '';

        //根据计算的显示字符集合创建按钮
        for (var j = 0; j < pi.allBtnTexts.length; j++) {


            var liE = document.createElement('div');
            liE.className = "Pagination_Button";
            var span = document.createElement('span');
            span.className = "Pagination_ButtonText";
            span.innerText = pi.allBtnTexts[j];
            liE.addEventListener('mousedown', pi.mouseClick, false);
            liE.appendChild(span);

            //当前显示页面添加激活样式
            if (pi.allBtnTexts[j] == curPage) {

                liE.classList.add("Pagination_ButtonSelected")
            }

            //设置前一页和后一页为不可用状态
            if ((curPage == 1 && j == 0) || (curPage == pi.defaults.totalPages && j == pi.allBtnTexts.length - 1)) {
                //设置"不可用"样式
                // liE.className = "Pagination_ButtonDisabled";
                liE.classList.add("Pagination_ButtonDisabled");

                liE.removeEventListener('mousedown', pi.mouseClick, false);
            }

            //显示"省略号"时样式
            if (span.innerText == pi.defaults.ellipsis) {
                span.className = "Pagination_ButtonEllipsis";
            }
            pi.container.appendChild(liE);
        }
    }

    //TODO:点击时执行的方法  参数包含：当前页码、总页码、每页数据量……
    // pi.PageIndexChanged = function () {
    //
    // }

    pi.SetPage = function (page) {
        var p = parseInt(page);
        var t = Math.ceil(pi.totalDatasCount / pi.defaults.perPageDatasCount);
        p = isNaN(p) ? 1 : p;
        p = p < 1 ? 1 : p;
        p = p > t ? t : p;

        pi.defaults.currentPage = p;
        pi.currentPage = pi.defaults.currentPage;
        pi.perPageCount = pi.defaults.perPageDatasCount;


        if (pi.Command != undefined && pi.Command != null) {
            pi.Command.Sender = pi;
            pi.Command.Execute();
        }

        if (pi.PageIndexChanged != undefined && pi.PageIndexChanged.GetType() == "Command") {
            pi.PageIndexChanged.Sender = pi;
            pi.PageIndexChanged.Execute();
        }

        if (pi.PageIndexChanged != undefined && pi.PageIndexChanged.GetType() == "function") {
            pi.PageIndexChanged(null, pi);
        }

        //先刷新显示数据
        pi.refreshData();
        //创建并布局按钮
        pi.reLayoutViews();

    }

    //处理点击事件
    pi.mouseClick = function (e) {
        e.preventDefault();
        e.cancelBubble = true;
        var target = e.target;

        switch (target.innerText) {
            case pi.defaults.prevContent:
                console.log('上一页按钮');
                pi.defaults.currentPage -= 1;
                break;
            case pi.defaults.nextContent:
                console.log('下一页按钮');
                pi.defaults.currentPage += 1;
                break;
            case pi.defaults.ellipsis:
                console.log('省略号按钮');
                return;
                break;
            default:
                console.log('数字键');
                pi.defaults.currentPage = parseInt(target.innerText);
                break;
        }
        //TODO:执行pi.PageIndexChanged,

        pi.currentPage = pi.defaults.currentPage;
        pi.perPageCount = pi.defaults.perPageDatasCount;


        if (pi.Command != undefined && pi.Command != null) {
            pi.Command.Sender = pi;
            pi.Command.Execute();
        }

        if (pi.PageIndexChanged != undefined && pi.PageIndexChanged.GetType() == "Command") {
            pi.PageIndexChanged.Sender = pi;
            pi.PageIndexChanged.Execute();
        }

        if (pi.PageIndexChanged != undefined && pi.PageIndexChanged.GetType() == "function") {
            pi.PageIndexChanged(e, pi);
        }

        //先刷新显示数据
        pi.refreshData();
        //创建并布局按钮
        pi.reLayoutViews();


    }

    pi.pWidth = "400px";
    pi.pHeight = "25px";

    //按钮样式设置
    //按钮边框宽度
    pi.btnBorderW = "1px";
    Object.defineProperty(pi, "BtnBorderW", {
        get: function () {
            return pi.btnBorderW;
        },
        set: function (v) {
            pi.btnBorderW = v;
        }
    });
    //按钮圆角
    pi.btnBorderR = "5px";
    Object.defineProperty(pi, "BtnBorderR", {
        get: function () {
            return pi.btnBorderR;
        },
        set: function (v) {
            pi.btnBorderR = v;
        }
    });
    //按钮边框颜色
    pi.btnBorderC = "#E5E5E5";
    Object.defineProperty(pi, "BtnBorderC", {
        get: function () {
            return pi.btnBorderC;
        },
        set: function (v) {
            pi.btnBorderC = v;
        }
    });
    //按钮背景色
    pi.btnBgC = "transparent";
    Object.defineProperty(pi, "BtnBgC", {
        get: function () {
            return pi.btnBgC;
        },
        set: function (v) {
            pi.btnBgC = v;
        }
    });

    //按钮高亮（被选中）时背景色
    pi.selectedC = "#13d1be";
    Object.defineProperty(pi, "SelectedC", {
        get: function () {
            return pi.selectedC;
        },
        set: function (v) {
            pi.selectedC = v;
        }
    });
    pi.selectedTextC = "#f9f9f9";
    Object.defineProperty(pi, "SelectedTextC", {
        get: function () {
            return pi.selectedTextC;
        },
        set: function (v) {
            pi.selectedTextC = v;
        }
    });

    pi.showSkipP = false;
    Object.defineProperty(pi, "ShowSkipP", {
        get: function () {
            return pi.showSkipP;
        },
        set: function (v) {

            if (v == 1 || v == true || v == "true") {
                pi.showSkipP = true;
                pi.skipPage.setAttribute("show", "1");
            } else {
                pi.skipPage.setAttribute("show", "0");
                pi.showSkipP = false;
            }

        }
    });



    /*==================================平台属性配置begin=======================================================*/
    pi.SetHeight = function (v) {
        // if (v.indexOf("%") != -1 || v.indexOf("px") != -1) {
        //     pi.VisualElement.style.height = v;
        // } else {
        //     pi.VisualElement.style.height = parseInt(v) + 'px';
        // }
        pi.VisualElement.style.height = v;

        var cssObj = window.getComputedStyle(pi.VisualElement, null);
        // console.log(cssObj.height);
        pi.VisualElement.style.lineHeight = cssObj.height;
        pi.pHeight = cssObj.height;

        pi.reLayoutViews();
    }

    pi.SetWidth = function (v) {

        // if (v.indexOf("%") != -1 || v.indexOf("px") != -1) {
        //     pi.VisualElement.style.width = v;
        // } else {
        //     pi.VisualElement.style.width = parseFloat(v) + 'px';
        // }

        pi.VisualElement.style.width = v;
        var cssObj = window.getComputedStyle(pi.VisualElement, null);
        pi.pWidth = cssObj.width;
        // console.log(cssObj.width);
        pi.reLayoutViews();
    }

    pi.fSize = "12px";
    pi.SetFontSize = function (v) {
        pi.fSize = v;
    }

    pi.fFamily = "宋体";
    pi.SetFontFamily = function (v) {
        pi.fFamily = v;
    }

    pi.fStyle = "normal";
    pi.SetFontStyle = function (v) {
        pi.fStyle = v;
    }

    pi.fColor = "#666";
    pi.SetColor = function (v) {
        pi.fColor = v;
    }
    /**==================================平台属性配置end=======================================================*/



    pi.OnCreateHandle();
    return pi;
}

DBFX.Serializer.PaginationSerializer = function () {
    //系列化
    this.Serialize = function (c, xe, ns) {
        DBFX.Serializer.SerialProperty("ShowSkipP", c.ShowSkipP, xe);

        //序列化方法
        DBFX.Serializer.SerializeCommand("PageIndexChanged", c.PageIndexChanged, xe);

    }

    //反系列化
    this.DeSerialize = function (c, xe, ns) {
        DBFX.Serializer.DeSerialProperty("ShowSkipP", c, xe);

        //对方法反序列化
        DBFX.Serializer.DeSerializeCommand("PageIndexChanged", xe, c);
    }


}
DBFX.Design.ControlDesigners.PaginationDesigner = function () {

    var obdc = new DBFX.Web.Controls.GroupPanel();
    obdc.OnCreateHandle();
    obdc.OnCreateHandle = function () {
        DBFX.Resources.LoadResource("design/DesignerTemplates/FormDesignerTemplates/PaginationDesigner.scrp", function (od) {
            od.DataContext = obdc.dataContext;
            //设计器中绑定事件处理
            od.EventListBox = od.FormContext.Form.FormControls.EventListBox;
            od.EventListBox.ItemSource = [{ EventName: "PageIndexChanged", EventCode: undefined, Command: od.dataContext.PageIndexChanged, Control: od.dataContext }];
        }, obdc);
    }

    //事件处理程序
    obdc.DataContextChanged = function (e) {
        obdc.DataBind(e);
        if (obdc.EventListBox != undefined) {
            obdc.EventListBox.ItemSource = [{ EventName: "PageIndexChanged", EventCode: undefined, Command: obdc.dataContext.PageIndexChanged, Control: obdc.dataContext }];
        }
    }

    obdc.HorizonScrollbar = "hidden";
    obdc.OnCreateHandle();
    obdc.Class = "VDE_Design_ObjectGeneralDesigner";
    obdc.Text = "分页导航控件";
    return obdc;
}

//
DBFX.Web.Controls.ShareSelector = function (title, descr, thumImage, webpageUrl) {


    var frm = new DBFX.Web.Forms.Form();
    frm.Height = "256px";

    var lblTitle = new DBFX.Web.Controls.Label("选择分享方式","8px");
    lblTitle.FontSize = "14pt";
    lblTitle.Display = "block";
    frm.AddControl(lblTitle);


    var pnl = new DBFX.Web.Controls.Panel();
    pnl.Height = "128px";
    pnl.BorderWidth = "0px";
    pnl.Shadow = "none";
    pnl.Align = "center";
    pnl.Margin = "16px";
    frm.AddControl(pnl);

    //分享给朋友
    var btnFriend = new DBFX.Web.Controls.Button();
    btnFriend.Text = "分享给朋友";
    btnFriend.Margin = "8px";
    btnFriend.Width = "72px";
    btnFriend.Height = "96px";
    btnFriend.BackgroundColor = "white";
    btnFriend.BorderRadius = "2px";
    btnFriend.BorderWidth = "0px";
    btnFriend.ButtonStyle = 1;
    btnFriend.ImageWidth = "48px";
    btnFriend.ImageUrl = "themes/%currenttheme%/images/wxfriend.png";
    pnl.AddControl(btnFriend);
    btnFriend.Click = function () {

        frm.Close();
        WXSDK.UShare(title, descr, thumImage, webpageUrl, 1);

    }

    //添加拍摄照片按钮
    var btnTimeline = new DBFX.Web.Controls.Button();
    btnTimeline.Text = "发送到朋友圈";
    btnTimeline.Margin = "8px";
    btnTimeline.Height = "96px";
    btnTimeline.Width = "88px";
    btnTimeline.Align = "center";
    btnTimeline.BackgroundColor = "white";
    btnTimeline.BorderRadius = "2px";
    btnTimeline.BorderWidth = "0px";
    btnTimeline.ImageUrl = "themes/%currenttheme%/images/timeline.png";
    btnTimeline.ButtonStyle = 1;
    btnTimeline.ImageWidth = "48px";
    pnl.AddControl(btnTimeline);
    btnTimeline.Click = function () {

        frm.Close();
        WXSDK.UShare(title, descr, thumImage, webpageUrl, 0);

    }

    //添加拍摄照片按钮
    var btnMore = new DBFX.Web.Controls.Button();
    btnMore.Text = "更多...";
    btnMore.Margin = "8px";
    btnMore.Height = "96px";
    btnMore.Width = "72px";
    btnMore.Align = "center";
    btnMore.BorderWidth = "0px";
    btnMore.BackgroundColor = "white";
    btnMore.BorderRadius = "2px";
    btnMore.ButtonStyle = 1;
    btnMore.ImageWidth = "48px";
    btnMore.ImageUrl = "themes/%currenttheme%/images/share.png";
    pnl.AddControl(btnMore);
    btnMore.Click = function () {

        frm.Close();
        WXSDK.UShare(title, descr, thumImage, webpageUrl, 2);

    }

    pnl.AddControl(new DBFX.Web.Controls.BreakLine());

    var btnCancel = new DBFX.Web.Controls.Button();
    btnCancel.Text = "取消";
    btnCancel.Margin = "16px 24px";
    btnCancel.Align = "center";
    btnCancel.Display = "block";
    btnCancel.Height = "32px";
    btnCancel.BorderRadius = "24px";
    frm.AddControl(btnCancel);
    btnCancel.Click = function () {

        frm.Close();

    }

    frm.HasTitleBar = false;
    frm.Width = "90%";
    frm.AutoClose = true;
    frm.AutoClosing = function () {

        frm.Close();

    }
    frm.ShowModal();

    frm.VisualElement.style.top = "auto";
    frm.VisualElement.style.bottom = "16px";



}

//状态栏
DBFX.Web.Controls.StatusBar = function () {

    var stbar = new DBFX.Web.Controls.Control("StatusBar");
    stbar.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.StatusBarDesigner");
    stbar.ClassDescriptor.Serializer = "DBFX.Serializer.StatusBarSerializer";
    stbar.OnCreateHandle();
    stbar.OnCreateHandle = function () {

        stbar.VisualElement = document.createElement("DIV");
        stbar.VisualElement.className = "StatusBar";
        stbar.Panels = [];

        app.MessageFilter.AddFilter({ MsgId:"",Callback:stbar.OnMessage});

    }

    //消息处理
    stbar.OnMessage = function (m) {

        stbar.Panels.forEach(function (p) {

            if(p.OnMessage!=undefined)
                p.OnMessage(m);

        });

    }

    stbar.AddPanel = function (pnl) {

        stbar.Panel.Add(pnl);
        stbar.VisualElement.appendChild(pnl.VisualElement);

    }

    stbar.RemovePanel = function (panel) {

        stbar.Panels.Remove(pnl);
        stbar.VisualElement.removeChild(pnl.VisualElement);

    }


    stbar.OnCreateHandle();
    return stbar;
}

//状态栏
DBFX.Web.Controls.StatusBar.TimePanel = function () {
    var tpnl = new DBFX.Web.Controls.Control("StatusBarTimePanel");
    tpnl.OnCreateHandle();
    tpnl.OnCreateHandle = function () {
        tpnl.VisualElement = document.createElement("STBTPNL");
        tpnl.TimerHandler = setInterval(function () {

            tpnl.VisualElement.innerText = new Date().toLocaleString();

        }, 1000);

    }

    tpnl.OnCreateHandle();
    tpnl.UnLoad = function () {

        clearInterval(tpnl.TimerHandler);
    }

    return tpnl;
}

//状态栏
DBFX.Web.Controls.StatusBar.LoginUserPanel = function () {
    var lupnl = new DBFX.Web.Controls.Control("StatusBarLoginUserPanel");
    lupnl.OnCreateHandle();
    lupnl.OnCreateHandle = function () {
        lupnl.VisualElement = document.createElement("STBLUPNL");
        lupnl.VisualElement.innerText = app.SecurityContext.LoginUser.DisplayName + "(" + app.SecurityContext.LoginUser.LoginName+") ";
    }

    lupnl.OnCreateHandle();


    return lupnl;

}

DBFX.Web.Controls.StatusBar.MsgPanel = function () {

    var msgpnl = new DBFX.Web.Controls.Control("StatusBarMsgPanel");
    msgpnl.OnCreateHandle();
    msgpnl.OnCreateHandle = function () {
        msgpnl.VisualElement = document.createElement("STBMSGPNL");


    }

    msgpnl.OnMsg = function (m) {



    }
    msgpnl.OnCreateHandle();


    return msgpnl;


}
//视频播放器
DBFX.Web.Controls.VideoPlayer = function () {

    var vp = new DBFX.Web.Controls.Control("VideoPlayer");
    vp.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.VideoPlayerDesigner");
    vp.ClassDescriptor.Serializer = "DBFX.Serializer.VideoPlayerSerializer";
    vp.VisualElement = document.createElement("DIV");
    //通过正则表达式判断是否为手机端运行
    vp.isPhone = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);
    vp.fullScreenEvents = ["fullscreenchange", "webkitfullscreenchange", "mozfullscreenchange", "MSFullscreenChange"];


    //是否自动播放 是/否
    vp.autoPlay = false;
    Object.defineProperty(vp, "AutoPlay", {
        get: function () {
            return vp.autoPlay == true ? "是" : "否";
        },
        set: function (v) {
            vp.autoPlay = (v == "是") ? true : false;
            // vp.video.autoplay = (v=="是") ? true:false;
            // if(v=="是") vp.playVideo();
        }
    });

    //全屏是否旋转
    vp.isRotate = false;
    Object.defineProperty(vp, "IsRotate", {
        get: function () {
            return vp.isRotate == true ? "是" : "否";
        },
        set: function (v) {
            vp.isRotate = (v == "是") ? true : false;
        }
    });

    //TODO:是否隐藏控制面板
    vp.autoHide = true;
    Object.defineProperty(vp, "AutoHide", {
        get: function () {
            return vp.autoHide;
        },
        set: function (v) {
            vp.autoHide = v;
        }
    });

    //控制面板是否在显示
    vp.ctlBarShow = true;

    //视频地址
    vp.videoUrl = "";
    Object.defineProperty(vp, "VideoUrl", {
        get: function () {
            return vp.videoUrl;
        },
        set: function (v) {
            vp.videoUrl = v;
            vp.videoSrc.src = v;
        }
    });

    vp.OnCreateHandle();
    vp.OnCreateHandle = function () {
        vp.VisualElement.className = "VideoPlayer";
        vp.VisualElement.innerHTML = "<div class=\"VideoPlayer_Wrapper\">" +
            "<video class='VideoPlayer_Video' playsinline webkit-playsinline>" +
            "<source class='VideoPlayer_VideoSrc' type=\"video/mp4\">" +
            "</video>" +
            "<div class='VideoPlayer_LoadError'><span>o(╥﹏╥)o:视频加载错误，请刷新页面重试！</span></div>" +
            "<div class='VideoPlayer_ControlBar'>" +
            "<div class='VideoPlayer_VideoPlay float'><img class='VideoPlayer_VideoPlayImg'/></div>" +
            "<div class='VideoPlayer_Slider float'><input class='VideoPlayer_SliderRange' type='range' value='0'></div>" +
            "<div class='VideoPlayer_Time float'><span class='currentTime'>00:00</span><span>/</span><span class='totalTime'>--:--</span></div>" +
            "<div class='VideoPlayer_Mute float'><img class='VideoPlayer_MuteImg'/></div>" +
            "<div class='VideoPlayer_Volume float'><input class='VideoPlayer_VolumeRange' type='range' min='0' max='100' value='50'></div>" +
            "<div class='VideoPlayer_FullScreen float'><img class='VideoPlayer_FullScreenImg'/></div>" +
            "</div>" +
            "<div class='VideoPlayer_CenterPlayBtn'><img class='VideoPlayer_CenterPlayImg'/></div>" +
            "</div>";
        vp.wrapper = vp.VisualElement.querySelector("div.VideoPlayer_Wrapper");
        vp.video = vp.VisualElement.querySelector("video.VideoPlayer_Video");
        vp.videoSrc = vp.VisualElement.querySelector("source.VideoPlayer_VideoSrc");
        vp.videoSrc.src = vp.videoUrl;
        vp.errorTip = vp.VisualElement.querySelector("div.VideoPlayer_LoadError");
        vp.controlBar = vp.VisualElement.querySelector("div.VideoPlayer_ControlBar");

        vp.centerBtnImg = vp.VisualElement.querySelector("img.VideoPlayer_CenterPlayImg");
        vp.playBtnImg = vp.VisualElement.querySelector("img.VideoPlayer_VideoPlayImg");
        vp.muteImg = vp.VisualElement.querySelector("img.VideoPlayer_MuteImg");
        vp.fullScreenImg = vp.VisualElement.querySelector("img.VideoPlayer_FullScreenImg");

        vp.curTimeSpan = vp.VisualElement.querySelector("span.currentTime");
        vp.totalTimeSpan = vp.VisualElement.querySelector("span.totalTime");


        //播放按钮
        vp.playBtn = vp.VisualElement.querySelector("div.VideoPlayer_VideoPlay");
        //中间大的播放按钮
        vp.centerBtn = vp.VisualElement.querySelector("div.VideoPlayer_CenterPlayBtn");
        //播放进度条
        vp.playRange = vp.VisualElement.querySelector("input.VideoPlayer_SliderRange");

        //静音按钮
        vp.muteBtn = vp.VisualElement.querySelector("div.VideoPlayer_Mute");
        //音量调节
        vp.volumeRange = vp.VisualElement.querySelector("input.VideoPlayer_VolumeRange");
        //音量
        vp.volume_ = vp.volumeRange.value;
        vp.video.volume = vp.volume_ / 100;

        //全屏按钮
        vp.fullScreenBtn = vp.VisualElement.querySelector("div.VideoPlayer_FullScreen");


        //TODO:1、根据是否自动播放 设置默认显示图片 2、集成到平台  地址需要更改
        // "Themes/" + app.CurrentTheme + "/Images/XXX.png"

         vp.centerBtnImg.src = "Themes/" + app.CurrentTheme + "/Images/play-big.png";
         vp.playBtnImg.src = "Themes/" + app.CurrentTheme + "/Images/play.png";
         vp.muteImg.src = "Themes/" + app.CurrentTheme + "/Images/volume.png";
         vp.fullScreenImg.src = "Themes/" + app.CurrentTheme + "/Images/fullscreen.png";


        //视频加载成功前 播放按钮不显示
        vp.centerBtn.className = "VideoPlayer_CenterPlayBtnHidden";
        vp.controlBar.className = "VideoPlayer_ControlBarHidden";

        //视频事件
        //loadstart
        vp.video.addEventListener("loadstart", function () {
            console.log("loadstart");
            console.log(vp.video.networkState);

        }, false);

        vp.video.addEventListener("durationchange", function () {
            vp.errorTip.className = "VideoPlayer_LoadErrorHidden";
        }, false);


        // 加载视频数据完成
        vp.video.addEventListener("loadedmetadata", function () {
            console.log("视频数据加载完成");

            //在视频数据加载完成后  添加鼠标移动事件
            vp.VisualElement.addEventListener("mousemove", function (e) {
                if (vp.timerId) {
                    clearTimeout(vp.timerId);
                }
                vp.showControlBar(true);
                vp.timerId = setTimeout(vp.ticker, 10000);
            }, false);

            //视频加载成功 播放按钮显示
            if (!vp.isPhone) {
                vp.centerBtn.className = "VideoPlayer_CenterPlayBtn";
                vp.controlBar.className = "VideoPlayer_ControlBar";
            }

            vp.totalTimeSpan.innerText = vp.getTimeBySecond(vp.video.duration);

            if (vp.autoPlay) {
                vp.playVideo();
            }
        });

        //视频播放时间更新
        vp.video.addEventListener("timeupdate", function () {

            var val = (100 / vp.video.duration) * vp.video.currentTime;
            vp.playRange.value = val;
            //更新当前时间
            vp.curTimeSpan.innerText = vp.getTimeBySecond(vp.video.currentTime);
            vp.playRange.style.background = 'linear-gradient(to right, #059CFA 0%, #059CFA ' + val + '%, white ' + val + '%,white)';
        });

        //视频播放结束
        vp.video.addEventListener("ended", function () {
            vp.video.pause();
            vp.video.currentTime = 0;
            if (!vp.isPhone) {
                vp.centerBtn.className = "VideoPlayer_CenterPlayBtn";
            }

            vp.playRange.style.background = "white";
            //TODO:更换显示图标  集成后更改路径
            vp.playBtnImg.src = "Themes/" + app.CurrentTheme + "/Images/play.png";
        });



        //事件处理
        //播放按钮
        vp.playBtn.onmousedown = vp.playVideo;
        vp.centerBtn.onmousedown = vp.playVideo;

        //拖动进度条结束
        vp.playRange.addEventListener("change", function () {
            var time = vp.video.duration * (this.value / 100);
            vp.video.currentTime = time;
            vp.curTimeSpan.innerText = vp.getTimeBySecond(time);

        });

        //进度条
        vp.playRange.addEventListener("input", function () {

            var time = vp.video.duration * (this.value / 100);
            vp.curTimeSpan.innerText = vp.getTimeBySecond(time);

            vp.playRange.style.background = 'linear-gradient(to right, #059CFA 0%, #059CFA ' + this.value + '%, white ' + this.value + '%,white)';
        });

        //静音按钮
        vp.muteBtn.addEventListener("click", function () {

            if (vp.video.muted) {
                vp.video.muted = false;
                vp.volumeRange.value = vp.volume_;
                vp.muteImg.src = "Themes/" + app.CurrentTheme + "/Images/volume.png";

            } else {
                vp.video.muted = true;
                vp.volumeRange.value = 0;
                vp.muteImg.src = "Themes/" + app.CurrentTheme + "/Images/mute.png";
            }
        });

        //音量调节
        vp.volumeRange.addEventListener("input", function () {
            console.log(this.value);
            vp.volume_ = this.value;
            vp.video.volume = this.value / 100;

            if (this.value == 0) {
                vp.video.muted = true;
                vp.muteImg.src = "Themes/" + app.CurrentTheme + "/Images/mute.png";
            } else {
                vp.video.muted = false;
                vp.muteImg.src = "Themes/" + app.CurrentTheme + "/Images/volume.png";
            }
        });

        //全屏切换按钮点击
        vp.fullScreenBtn.addEventListener("click", function () {

            if (!vp.isFullScreen()) {

                vp.origWidth = vp.VisualElement.offsetWidth;
                vp.origHeight = vp.VisualElement.offsetHeight;
                // go full-screen
                if (vp.VisualElement.requestFullscreen) {
                    vp.VisualElement.requestFullscreen();
                } else if (vp.VisualElement.webkitRequestFullscreen) {
                    vp.VisualElement.webkitRequestFullscreen();
                } else if (vp.VisualElement.mozRequestFullScreen) {
                    vp.VisualElement.mozRequestFullScreen();
                } else if (vp.VisualElement.msRequestFullscreen) {
                    vp.VisualElement.msRequestFullscreen();
                }


            } else {
                // exit full-screen
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }

            }

        }, false);

    }

    vp.showControlBar = function (isShow) {
        if (!vp.isPhone) {
            vp.controlBar.className = isShow ? "VideoPlayer_ControlBar" : "VideoPlayer_ControlBarHidden";
        }

    }

    vp.ticker = function () {
        //autoHide为true并且正在播放视频
        if (vp.autoHide && !vp.video.paused) {
            vp.showControlBar(false);
        }
        if (vp.timerId) {
            clearTimeout(vp.timerId);
        }
    };

    vp.timerId = setTimeout(vp.ticker, 10000);


    //播放/暂停视频
    vp.playVideo = function () {
        console.log("播放视频");
        console.log(vp.video.paused);
        if (vp.video.paused) {
            vp.video.play();
            //TODO:更换显示图标  集成后更改路径
            vp.playBtnImg.src = "Themes/" + app.CurrentTheme + "/Images/pause.png";
            vp.centerBtn.className = "VideoPlayer_CenterPlayBtnHidden";

        } else {
            vp.video.pause();
            //TODO:更换显示图标  集成后更改路径
            vp.playBtnImg.src = "Themes/" + app.CurrentTheme + "/Images/play.png";
            if (!vp.isPhone) {
                vp.centerBtn.className = "VideoPlayer_CenterPlayBtn";
            }

        }
    }

    //判断是否全屏
    vp.isFullScreen = function () {
        return document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement;
    };

    //相应进入全屏事件
    vp.fullScreenEvents.forEach(function (eventType) {
        document.addEventListener(eventType, function (event) {

            if (vp.isFullScreen()) {
                var cltHeight = vp.isRotate && vp.isPhone ? window.screen.width : window.screen.height;
                var cltWidth = vp.isRotate && vp.isPhone ? window.screen.height : window.screen.width;

                if (vp.isRotate && !vp.VisualElement.classList.contains("rotate90") && vp.isPhone) {
                    vp.VisualElement.classList.add("rotate90");
                }

                vp.VisualElement.style.height = cltHeight + "px";
                vp.VisualElement.style.width = cltWidth + "px";

                vp.fullScreenImg.src = "Themes/" + app.CurrentTheme + "/Images/fullscreen_off.png";
            } else {

                if (vp.isRotate && vp.VisualElement.classList.contains("rotate90")) {
                    vp.VisualElement.classList.remove("rotate90");
                }
                vp.VisualElement.style.height = vp.origHeight + "px";
                vp.VisualElement.style.width = vp.origWidth + "px";

                vp.fullScreenImg.src = "Themes/" + app.CurrentTheme + "/Images/fullscreen.png";
            }

        }, false);

    });

    //获取时间秒
    vp.getTimeBySecond = function (second) {
        var hour = parseInt(second / (60 * 60));
        var minute = parseInt((second / 60) % 60);
        var second = parseInt(second % 60);
        return (hour > 0 ? ((hour < 10 ? "0" + hour : hour) + ":") : "") + (minute < 10 ? "0" + minute : minute) + ":" + (second < 10 ? "0" + second : second);
    }

    vp.OnCreateHandle();
    return vp;
}
DBFX.Serializer.VideoPlayerSerializer = function () {
    //系列化
    this.Serialize = function (c, xe, ns) {
        DBFX.Serializer.SerialProperty("AutoPlay", c.AutoPlay, xe);
        DBFX.Serializer.SerialProperty("IsRotate", c.IsRotate, xe);
        DBFX.Serializer.SerialProperty("VideoUrl", c.VideoUrl, xe);

    }

    //反系列化
    this.DeSerialize = function (c, xe, ns) {
        DBFX.Serializer.DeSerialProperty("AutoPlay", c, xe);
        DBFX.Serializer.DeSerialProperty("IsRotate", c, xe);
        DBFX.Serializer.DeSerialProperty("VideoUrl", c, xe);
    }
}
DBFX.Design.ControlDesigners.VideoPlayerDesigner = function () {
    var obdc = new DBFX.Web.Controls.GroupPanel();
    obdc.OnCreateHandle();
    obdc.OnCreateHandle = function () {

        DBFX.Resources.LoadResource("design/DesignerTemplates/FormDesignerTemplates/VideoPlayerDesigner.scrp", function (od) {

            od.DataContext = obdc.dataContext;

        }, obdc);

    }

    obdc.HorizonScrollbar = "hidden";
    obdc.OnCreateHandle();
    obdc.Class = "VDE_Design_ObjectGeneralDesigner";
    obdc.Text = "视频播放器设置";
    return obdc;
}

//查询视图
DBFX.Web.Controls.SearchBarView = function () {
    var sbv = new DBFX.Web.Controls.Control("SearchBarView");
    sbv.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.SearchBarViewDesigner");
    sbv.ClassDescriptor.Serializer = "DBFX.Serializer.SearchBarViewSerializer";
    sbv.VisualElement = document.createElement("DIV");
    sbv.VisualElement.className = "SearchBarView";

    //输入框提示文字
    sbv.placeholder = "";
    Object.defineProperty(sbv, "Placeholder", {
        get: function () {
            return sbv.placeholder;
        },
        set: function (v) {
            sbv.placeholder = v;
            sbv.setTipText();
        }
    });

    //按钮文字
    sbv.btnText = "搜索";
    Object.defineProperty(sbv, "BtnText", {
        get: function () {
            return sbv.btnText;
        },
        set: function (v) {
            sbv.btnText = v;
            sbv.SearchBtnText.innerText = v;
        }
    });

    //图标图片
    sbv.imageUrl = "";
    Object.defineProperty(sbv, "ImageUrl", {
        get: function () {
            return sbv.imageUrl;
        },
        set: function (v) {
            sbv.imageUrl = v;
            //FIXME:
            if (v == "") {
                sbv.SearchIcon.src = "Themes/" + app.CurrentTheme + "/Images/SearchBarView/searchIcon.png";
            } else {
                sbv.SearchIcon.src = v;
            }

            // sbv.SearchBtnImg.src = v;
        }
    });


    sbv.inputText = "";
    sbv.SetText = function (v) {
        sbv.inputText = v;
    }

    sbv.GetText = function () {
        return sbv.inputText;
    }

    //搜索结果展示页面资源
    sbv.resultResourceUri = "";
    Object.defineProperty(sbv, "ResultResourceUri", {
        get: function () {
            return sbv.resultResourceUri;
        },
        set: function (v) {
            sbv.resultResourceUri = v;
        }
    });

    //触发搜索事件  事件处理程序 开发者执行存储过程
    sbv.OnSearchingFor = function () {

        if (sbv.Command != undefined && sbv.Command != null) {
            sbv.Command.Sender = sbv;
            sbv.Command.Execute();
        }

        if (sbv.SearchingFor != undefined && sbv.SearchingFor.GetType() == "Command") {
            sbv.SearchingFor.Sender = sbv;
            sbv.SearchingFor.Execute();
        }

        if (sbv.SearchingFor != undefined && sbv.SearchingFor.GetType() == "function") {
            sbv.SearchingFor(e, sbv);
        }
    }

    //单行选中事件 事件处理程序
    sbv.OnItemSelected = function () {
        if (sbv.Command != undefined && sbv.Command != null) {
            sbv.Command.Sender = sbv;
            sbv.Command.Execute();
        }

        if (sbv.ItemSelected != undefined && sbv.ItemSelected.GetType() == "Command") {
            sbv.ItemSelected.Sender = sbv;
            sbv.ItemSelected.Execute();
        }

        if (sbv.ItemSelected != undefined && sbv.ItemSelected.GetType() == "function") {
            sbv.ItemSelected(e, sbv);
        }

        //TODO:调用点击行事件后 应该关闭popUpPanel
        sbv.ResultPanel.Close();
    }

    //页面资源是否加载
    sbv.hasLoad = false;

    //TODO:展示搜索结果列表的方法  开发者在搜索事件里调用
    //obj对象包含数据列表Items 搜索到的数据集合
    sbv.Show = function (obj) {

        if (sbv.hasLoad == false) {
            //PopUpPanel的属性FormContext赋值
            sbv.ResultPanel.FormContext = { Form: sbv.ResultPanel };
            sbv.ResultPanel.FormControls = {};
            //TODO:加载页面资源
            DBFX.Resources.LoadResource(sbv.resultResourceUri, function (sbvv) {
                sbvv.DataContext = obj;
                sbvv.SearchBar = sbv;
            }, sbv.ResultPanel);

            sbv.hasLoad = true;
        } else {
            sbv.ResultPanel.DataContext = obj;
            sbv.ResultPanel.SearchBar = sbv;
        }

        //展示结果界面
        sbv.ResultPanel.Show(sbv);
    }

    sbv.OnCreateHandle();
    sbv.OnCreateHandle = function () {
        sbv.Class = "SearchBarView";
        sbv.VisualElement.innerHTML =
            "<DIV class=\"SearchBarViewContainer\">" + "<DIV class=\"SearchBarViewSearchIcon\">" +
            "<IMG class=\"SearchBarViewSearchIconImg\">" +
            "</DIV>" +
            "<DIV class=\"SearchBarViewSearchBox\">" +
            "<INPUT class=\"SearchBarViewSearchInputBox\" type='text'>" +
            "</DIV>" +
            "<DIV class=\"SearchBarViewSearchButton\">" +
            "<IMG class=\"SearchBarViewSearchButtonImg\">" +
            "<SPAN class=\"SearchBarViewSearchButtonText\"></SPAN>" +
            "</DIV>" +
            "<DIV class=\"SearchBarViewResultsList\">" +
            "</DIV>" +
            "</DIV>";
        sbv.SearchV = sbv.VisualElement.querySelector("DIV.SearchBarViewContainer");
        sbv.SearchIcon = sbv.VisualElement.querySelector("IMG.SearchBarViewSearchIconImg");
        sbv.SearchBox = sbv.VisualElement.querySelector("DIV.SearchBarViewSearchBox");
        sbv.SearchInput = sbv.VisualElement.querySelector("INPUT.SearchBarViewSearchInputBox");
        sbv.SearchBtn = sbv.VisualElement.querySelector("DIV.SearchBarViewSearchButton");
        sbv.SearchBtnImg = sbv.VisualElement.querySelector("IMG.SearchBarViewSearchButtonImg");
        sbv.SearchBtnText = sbv.VisualElement.querySelector("SPAN.SearchBarViewSearchButtonText");
        sbv.SearchResultDiv = sbv.VisualElement.querySelector("DIV.SearchBarViewResultsList");

        //设置图片
        sbv.SearchIcon.src = "Themes/" + app.CurrentTheme + "/Images/SearchBarView/searchIcon.png";
        // sbv.SearchBtnImg.src = "Themes/" + app.CurrentTheme + "/Images/SearchBarView/searchIcon.png";
        sbv.SearchBtnText.innerText = sbv.btnText;

        //不检查拼写错误
        sbv.SearchInput.spellcheck = false;
        //事件绑定
        sbv.SearchBtn.onmousedown = sbv.searchBtnClick;
        sbv.SearchInput.onfocus = sbv.searchInputFocus;
        sbv.SearchInput.onblur = sbv.searchInputBlur;
        sbv.SearchInput.onkeypress = sbv.searchInputKeypress;
        sbv.SearchInput.oninput = sbv.searchInputInput;


        //创建PopupPanel，用于展示结果列表
        sbv.ClientDiv = sbv.VisualElement;
        //popupPanel
        sbv.ResultPanel = new DBFX.Web.Controls.PopupPanel();
    }

    //搜索框事件处理
    sbv.searchInputFocus = function (e) {
        // console.log("onfocus");
        sbv.btnFlag = 0;
        if (sbv.SearchInput.value == sbv.placeholder) {
            sbv.removeTipText();
        } else {
            //TODO:执行搜索事件


            //显示结果列表
            sbv.ShowResultList();
            sbv.btnFlag = 0;
        }
    }

    sbv.searchInputBlur = function (e) {
        console.log("onblur");
        console.log(sbv.btnFlag);
        if (sbv.SearchInput.value == "") {
            sbv.setTipText();
        } else if (sbv.btnFlag != 1) {
            sbv.HideResultList();
            sbv.btnFlag = 0;
        }

    }

    //回车键按下
    sbv.searchInputKeypress = function (e) {
        console.log("searchInputKeypress");
        //按回车键
        if (e.keyCode == 13) {
            console.log("回车键 调用搜索事件");
            sbv.inputText = sbv.SearchInput.value == sbv.placeholder ? "" : sbv.SearchInput.value;
            console.log(sbv.Text);
            //执行搜索事件
            sbv.OnSearchingFor();
        }
    }

    //搜索按钮点击处理
    sbv.searchBtnClick = function (event) {
        console.log("搜索按钮点击 调用搜索事件");
        sbv.btnFlag = 1;
        sbv.inputText = sbv.SearchInput.value == sbv.placeholder ? "" : sbv.SearchInput.value;
        console.log(sbv.Text);
        //执行搜索事件
        sbv.OnSearchingFor();
    }

    //实时监听输入框内文字
    sbv.searchInputInput = function (e) {
        sbv.inputText = sbv.SearchInput.value;

        // console.log(sbv.Text);
        if (sbv.Text.length > 0 && sbv.Text != "") {
            // console.log("输入字符 调用搜索事件");
            //TODO:执行搜索事件 但是会多次调用 慎用！！
            //显示结果列表
            // sbv.ShowResultList();
        } else {
            // sbv.HideResultList();
        }
    }

    //显示/隐藏 结果列表
    sbv.ShowResultList = function () {
        // sbv.SearchResultDiv.style.display = "block";
    }

    sbv.HideResultList = function () {
        // sbv.SearchResultDiv.style.display = "none";
    }

    //设置与移除提示文字
    sbv.setTipText = function () {
        sbv.SearchInput.value = sbv.placeholder;
        sbv.SearchInput.style.color = "#3c3f41";
    }

    sbv.removeTipText = function () {
        sbv.SearchInput.value = "";
        sbv.SearchInput.style.color = sbv.inputColor;
    }

    sbv.SetColor = function (v) {
        sbv.inputColor = v;
        if (sbv.SearchInput.value == sbv.placeholder) {
            sbv.SearchInput.style.color = "#3c3f41";
        } else {
            sbv.SearchInput.style.color = v;
        }

    }

    sbv.GetColor = function () {
        return sbv.SearchInput.style.color || sbv.inputColor;
    }

    sbv.SetBorderRadius = function (v) {
        sbv.VisualElement.style.borderRadius = v;
        sbv.SearchBtn.style.borderBottomRightRadius = v;
        sbv.SearchBtn.style.borderTopRightRadius = v;
    }

    sbv.OnCreateHandle();
    return sbv;
}
DBFX.Serializer.SearchBarViewSerializer = function () {
    //系列化
    this.Serialize = function (c, xe, ns) {
        DBFX.Serializer.SerialProperty("Placeholder", c.Placeholder, xe);
        DBFX.Serializer.SerialProperty("ResultResourceUri", c.ResultResourceUri, xe);
        DBFX.Serializer.SerialProperty("BtnText", c.BtnText, xe);
        DBFX.Serializer.SerialProperty("ImageUrl", c.ImageUrl, xe);

        //序列化方法
        DBFX.Serializer.SerializeCommand("SearchingFor", c.SearchingFor, xe);
        DBFX.Serializer.SerializeCommand("ItemSelected", c.ItemSelected, xe);
    }

    //反系列化
    this.DeSerialize = function (c, xe, ns) {
        DBFX.Serializer.DeSerialProperty("Placeholder", c, xe);
        DBFX.Serializer.DeSerialProperty("ResultResourceUri", c, xe);
        DBFX.Serializer.DeSerialProperty("BtnText", c, xe);
        DBFX.Serializer.DeSerialProperty("ImageUrl", c, xe);

        //对方法反序列化
        DBFX.Serializer.DeSerializeCommand("SearchingFor", xe, c);
        DBFX.Serializer.DeSerializeCommand("ItemSelected", xe, c);
    }

}
DBFX.Design.ControlDesigners.SearchBarViewDesigner = function () {

    var obdc = new DBFX.Web.Controls.GroupPanel();
    obdc.OnCreateHandle();
    obdc.OnCreateHandle = function () {
        DBFX.Resources.LoadResource("design/DesignerTemplates/FormDesignerTemplates/SearchBarViewDesigner.scrp", function (od) {
            od.DataContext = obdc.dataContext;
            //设计器中绑定事件处理
            od.EventListBox = od.FormContext.Form.FormControls.EventListBox;
            od.EventListBox.ItemSource = [{ EventName: "SearchingFor", EventCode: undefined, Command: od.dataContext.SearchingFor, Control: od.dataContext }, { EventName: "ItemSelected", EventCode: undefined, Command: od.dataContext.ItemSelected, Control: od.dataContext }];
        }, obdc);
    }

    //事件处理程序
    obdc.DataContextChanged = function (e) {
        obdc.DataBind(e);
        if (obdc.EventListBox != undefined) {
            obdc.EventListBox.ItemSource = [{ EventName: "SearchingFor", EventCode: undefined, Command: obdc.dataContext.SearchingFor, Control: obdc.dataContext }, { EventName: "ItemSelected", EventCode: undefined, Command: obdc.dataContext.ItemSelected, Control: obdc.dataContext }];
        }
    }

    obdc.HorizonScrollbar = "hidden";
    obdc.OnCreateHandle();
    obdc.Class = "VDE_Design_ObjectGeneralDesigner";
    obdc.Text = "搜索控件";
    return obdc;
}

//嵌入页面视图
DBFX.Web.Controls.IFrameView = function () {

    var ifv = new DBFX.Web.Controls.Control("IFrameView");
    ifv.ClassDescriptor.Designers = ["DBFX.Design.ControlDesigners.ObjectGeneralDesigner", "DBFX.Design.ControlDesigners.IFrameViewDesigner","DBFX.Design.ControlDesigners.LayoutDesigner"];
    ifv.ClassDescriptor.Serializer = "DBFX.Serializer.IFrameViewSerializer";
    ifv.VisualElement = document.createElement("IFView");
    ifv.OnCreateHandle();
    ifv.VisualElement.innerHTML = "<IFViewPanel><DIV class=\"IFrameView_Title\"></DIV><iframe class=\"IFrameView_FrameView\"></iframe></IFViewPanel>";
    ifv.IFrame = ifv.VisualElement.querySelector("IFRAME");
    ifv.TitleDiv = ifv.VisualElement.querySelector("DIV.IFrameView_Title");

    Object.defineProperty(ifv, "Src", {
        get: function () {

            return ifv.src;
        },
        set: function (v) {
            ifv.src = v;
            if (ifv.DesignTime !=true)
                ifv.IFrame.src = v;
        }
    });

    Object.defineProperty(ifv, "Title", {
        get: function () {

            return ifv.title;
        },
        set: function (v) {
            ifv.title = v;
            ifv.TitleDiv.innerHTML = v;
        }
    });

    Object.defineProperty(ifv, "TitleColor", {
        get: function () {

            return ifv.titleColor;
        },
        set: function (v) {
            ifv.titleColor = v;
            ifv.TitleDiv.style.color = v;
        }
    });


    Object.defineProperty(ifv, "TitleBackColor", {
        get: function () {

            return ifv.titleBackColor;
        },
        set: function (v) {
            ifv.titleBackColor = v;
            ifv.TitleDiv.style.backgroundColor = v;
        }
    });

    ifv.hasTitle = true;
    Object.defineProperty(ifv, "HasTitle", {
        get: function () {

            return ifv.hasTitle;
        },
        set: function (v) {

            if (v==true || v == "true" )
                v = true;
            else
                v = false;

            ifv.hasTitle = v;
            if (v == true) {
                ifv.TitleDiv.style.display = "";
            }
            else {
                ifv.TitleDiv.style.display = "none";
            }
        }
    });

    return ifv;

}
DBFX.Serializer.IFrameViewSerializer = function () {
    //系列化
    this.Serialize = function (c, xe, ns) {
        DBFX.Serializer.SerialProperty("Src", c.src, xe);
        DBFX.Serializer.SerialProperty("Title", c.title, xe);
        DBFX.Serializer.SerialProperty("TitleColor", c.titleColor, xe);
        DBFX.Serializer.SerialProperty("TitleBackColor", c.titleBackColor, xe);
        DBFX.Serializer.SerialProperty("HasTitle", c.hasTitle, xe);
    }

    //反系列化
    this.DeSerialize = function (c, xe, ns) {
        DBFX.Serializer.DeSerializeCommand("Src", xe, c);
        DBFX.Serializer.DeSerializeCommand("Title", xe, c);
        DBFX.Serializer.DeSerializeCommand("HasTitle", xe, c);
        DBFX.Serializer.DeSerializeCommand("TitleColor", xe, c);
        DBFX.Serializer.DeSerializeCommand("TitleBackColor", xe, c);
    }

}
DBFX.Design.ControlDesigners.IFrameViewDesigner = function () {

    var obdc = new DBFX.Web.Controls.GroupPanel();
    obdc.OnCreateHandle();
    obdc.OnCreateHandle = function () {
        DBFX.Resources.LoadResource("design/DesignerTemplates/FormDesignerTemplates/IFrameViewDesigner.scrp", function (od) {
            od.DataContext = obdc.dataContext;
        }, obdc);
    }

    //事件处理程序
    obdc.DataContextChanged = function (e) {
        obdc.DataBind(e);
    }

    obdc.HorizonScrollbar = "hidden";
    obdc.OnCreateHandle();
    obdc.Class = "VDE_Design_ObjectGeneralDesigner";
    obdc.Text = "嵌入页面控件";
    return obdc;
}

//签名板
DBFX.Web.Controls.SignatureBoard = function () {
    var sBoard = new DBFX.Web.Controls.Control("SignatureBoard");
    sBoard.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.SignatureBoardDesigner");
    sBoard.ClassDescriptor.Serializer = "DBFX.Serializer.SignatureBoardSerializer";

    sBoard.OnCreateHandle();
    sBoard.OnCreateHandle = function () {

        sBoard.VisualElement.className = "SignatureBoard";
        sBoard.VisualElement.innerHTML = "<div class='SignatureBoard_Container'><span class='SignatureBoard_Tip'>签名区</span><canvas class='SignatureBoard_Canvas'></canvas><div class='SignatureBoard_ToolBox'><div class='SignatureBoard_ReWriteBtn' title='重写'><img class='ReWriteBtnImage'/><span class='ReWriteBtnSpan'>重写</span></div><div class='SignatureBoard_SaveBtn' title='确认'><img class='SaveBtnImage'/><span class='SaveBtnSpan'>确认</span></div></div></div>";

        sBoard.Board = sBoard.VisualElement.querySelector("canvas.SignatureBoard_Canvas");
        sBoard.CTX = sBoard.Board.getContext("2d");

        //提示文字
        sBoard.TipSpan = sBoard.VisualElement.querySelector("span.SignatureBoard_Tip");

        sBoard.Container = sBoard.VisualElement.querySelector("div.SignatureBoard_Container");
        sBoard.ReWriteBtn = sBoard.VisualElement.querySelector("div.SignatureBoard_ReWriteBtn");
        sBoard.SaveBtn = sBoard.VisualElement.querySelector("div.SignatureBoard_SaveBtn");
        sBoard.ReWriteBtnImg = sBoard.VisualElement.querySelector("img.ReWriteBtnImage");
        sBoard.SaveBtnImg = sBoard.VisualElement.querySelector("img.SaveBtnImage");

        // "Themes/" + app.CurrentTheme + "/Images/play-big.png"
        sBoard.ReWriteBtnImg.src = "Themes/" + app.CurrentTheme + "/Images/ReWriteBtnImage.png";
        sBoard.SaveBtnImg.src = "Themes/" + app.CurrentTheme + "/Images/SaveBtnImage.png";

        sBoard.ReWriteBtn.onclick = function (e) {
            sBoard.ReWrite();
        }
        sBoard.SaveBtn.onclick = function (e) {
            sBoard.ConvertToImage();
        }

        sBoard.ReWriteBtn.ontouchstart = function (e) {
            sBoard.ReWrite();
        }

        sBoard.SaveBtn.ontouchstart = function (e) {
            sBoard.ConvertToImage();
        }

        sBoard.VisualElement.onmousedown = sBoard.HandleMouseDown;
        sBoard.VisualElement.ontouchstart = sBoard.HandleMouseDown;
        document.onmouseup = sBoard.HandleMouseUp;
        document.ontouchend = sBoard.HandleMouseUp;
        document.ontouchcancel = sBoard.HandleMouseUp;


    }

    sBoard.startX = 0;
    sBoard.startY = 0;
    //鼠标或手指点击、触摸
    sBoard.HasSetCanvasWH = false;
    sBoard.HandleMouseDown = function (event) {
        event.cancelBubble = true;
        if (!sBoard.HasSetCanvasWH) {
            sBoard.SetBoardWH();
            sBoard.ContainerLeft = (sBoard.GetEPos(sBoard.VisualElement).x);
            sBoard.ContainerTop = (sBoard.GetEPos(sBoard.VisualElement).y);
            sBoard.HasSetCanvasWH = true;
        }

        switch (event.type) {
            case "touchstart":
                event.preventDefault();
                sBoard.startX = event.touches[0].pageX - sBoard.ContainerLeft;
                sBoard.startY = event.touches[0].pageY - sBoard.ContainerTop;

                break;
            case "mousedown":
                sBoard.startX = event.pageX - sBoard.ContainerLeft;
                sBoard.startY = event.pageY - sBoard.ContainerTop;

                break;
            default:
                break;
        }
        sBoard.VisualElement.onmousemove = sBoard.HandleMouseMove;
        sBoard.VisualElement.ontouchmove = sBoard.HandleMouseMove;
    }

    //移动 绘制
    //是否有笔迹
    sBoard.HasChirography = false;
    sBoard.HandleMouseMove = function (event) {
        event.cancelBubble = true;

        switch (event.type) {
            case "touchmove":
                event.preventDefault();
                var x1 = event.touches[0].pageX - sBoard.ContainerLeft;
                var y1 = event.touches[0].pageY - sBoard.ContainerTop;

                break;
            case "mousemove":

                var x1 = event.pageX - sBoard.ContainerLeft;
                var y1 = event.pageY - sBoard.ContainerTop;

                break;
            default:
                break;
        }

        sBoard.Pen(sBoard.startX, sBoard.startY, x1, y1, sBoard.CTX);
        sBoard.startX = x1;
        sBoard.startY = y1;
        sBoard.HasChirography = true;
    }

    //计算控件的实际位置
    sBoard.GetEPos = function (ele) {

        var p = ele.offsetParent;
        var left = ele.offsetLeft;
        var top = ele.offsetTop;
        while (p) {
            if (window.navigator.userAgent.indexOf("MSIE 8") > -1) {
                left += p.offsetLeft;
                top += p.offsetTop;
            } else {
                left += p.offsetLeft + p.clientLeft;
                top += p.offsetTop + p.clientTop;
            }
            p = p.offsetParent;
        }
        var obj = {};
        obj.x = left;
        obj.y = top;
        return obj;
    }

    //绘制结束
    sBoard.HandleMouseUp = function () {

        sBoard.VisualElement.onmousemove = null;
        sBoard.VisualElement.ontouchmove = null;
    }

    //绘制图形-笔
    sBoard.Pen = function (startX, startY, endX, endY, ctx) {
        ctx.beginPath();
        ctx.globalAlpha = 1;
        ctx.lineWidth = 5;
        ctx.strokeStyle = "#000";
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.closePath();
        ctx.stroke();
    }


    //绘制图形-笔刷
    sBoard.Brush = function (startX, startY, endX, endY, ctx) {
        ctx.beginPath();
        ctx.globalAlpha = 1;
        ctx.lineWidth = 10;
        ctx.strokeStyle = "#000";
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.closePath();
        ctx.stroke();
    }


    //绘制图形-喷枪
    sBoard.Airbrush = function (startX, startY, ctx) {
        for (var i = 0; i < 10; i++) {
            var randomNum = Math.random() * 15;
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.globalAlpha = 0.5;
            ctx.arc(startX + randomNum, startY + randomNum, 1, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    //绘制图形-橡皮
    sBoard.Eraser = function (startX, startY, endX, endY, ctx, size, shape) {
        ctx.beginPath();
        ctx.globalAlpha = 1;
        switch (shape) {
            case 'rect':
                ctx.lineWidth = size;
                ctx.strokeStyle = "#fff";
                ctx.moveTo(startX, startY);
                ctx.lineTo(endX, endY);
                ctx.closePath();
                ctx.stroke();
                break;
            case 'circle':
                ctx.fillStyle = "#fff";
                ctx.arc(startX, startY, size, 0, 2 * Math.PI);
                ctx.fill();
                break;
        }
    }

    sBoard.SetWidth = function (v) {
        sBoard.VisualElement.style.width = v;

        // sBoard.SetBoardWH();
    }

    sBoard.SetHeight = function (v) {
        sBoard.VisualElement.style.height = v;

        // sBoard.SetBoardWH();
    }

    sBoard.SetBoardWH = function () {
        var cssObj = window.getComputedStyle(sBoard.VisualElement, null);
        var w = cssObj.width;
        var h = cssObj.height;
        sBoard.Board.setAttribute("Width", parseFloat(w) + "");
        sBoard.Board.setAttribute("Height", parseFloat(h) + "");
    }

    //重做 清空canvas
    sBoard.ReWrite = function () {
        var w = sBoard.Board.getAttribute("width");
        var h = sBoard.Board.getAttribute("height");

        sBoard.CTX.clearRect(0, 0, parseFloat(w), parseFloat(h));
        sBoard.HasChirography = false;
        sBoard.ResponseObj = { Exception: "未绘制笔迹，不上传图片！", State: 2 ,ButtonType:0};
        sBoard.OnSaveButtonClick();
    }


    //上传地址  https://wfs.dbazure.cn/wfs.ashx?OwnerId=1234
    sBoard.uploadURL = "";
    Object.defineProperty(sBoard, "UploadURL", {
        set: function (v) {
            sBoard.uploadURL = v;
        },
        get: function () {
            return sBoard.uploadURL;
        }
    })

    //提示文字
    sBoard.tipText = '签名区';
    Object.defineProperty(sBoard, "TipText", {
        set: function (v) {
            sBoard.tipText = v;
            sBoard.TipSpan.textContent = v;
        },
        get: function () {
            return sBoard.tipText;
        }
    })

    //转换成图片资源
    sBoard.ConvertToImage = function () {
        if (sBoard.HasChirography == false) {
            sBoard.ResponseObj = { Exception: "未绘制笔迹，不上传图片！", State: 2 ,ButtonType:1};
            sBoard.OnSaveButtonClick();
            return;
        }

        var imgDataUrl = sBoard.Board.toDataURL("image/png");
        var formdata = new FormData();
        formdata.append("Image", imgDataUrl);
        // formdata.append("ImageCroper", xmldata);

        if (sBoard.uploadURL == undefined || sBoard.uploadURL.indexOf("http://") < 0 && sBoard.uploadURL.indexOf("https://") < 0) {

            sBoard.ResponseObj = { Exception: "上传地址" + sBoard.uploadURL + "不合法！", State: 1 ,ButtonType:1};
            sBoard.OnSaveButtonClick();
            return;
        }

        DBFX.Net.WebClient.ExecuteWebRequest(sBoard.uploadURL, "POST", function (respjson, ctx) {
            try {
                sBoard.ResponseObj = JSON.parse(respjson)[0];
                sBoard.ResponseObj.ButtonType = 1;
            } catch (e) {
                sBoard.ResponseObj = { Exception: e.toString(), State: 1 ,ButtonType:1};
            }

            console.log(sBoard.ResponseObj.Url)
            sBoard.OnSaveButtonClick();

        }, sBoard, formdata, function (e) {

            // console.log(e);


        });

        return imgDataUrl;
    }

    //上传签名
    sBoard.UploadSignature = function(){
        sBoard.ConvertToImage();
    }

    sBoard.OnSaveButtonClick = function () {
        if (sBoard.SaveButtonClick != undefined && sBoard.SaveButtonClick.GetType() == "Command") {
            sBoard.SaveButtonClick.Sender = sBoard;
            sBoard.SaveButtonClick.Execute();
        }

        if (sBoard.SaveButtonClick != undefined && sBoard.SaveButtonClick.GetType() == "function") {
            sBoard.SaveButtonClick(sBoard);
        }

    }


    sBoard.OnCreateHandle();

    return sBoard;
}
DBFX.Serializer.SignatureBoardSerializer = function () {
    //系列化
    this.Serialize = function (c, xe, ns) {
        DBFX.Serializer.SerialProperty("UploadURL", c.UploadURL, xe);
        DBFX.Serializer.SerialProperty("TipText", c.TipText, xe);
        DBFX.Serializer.SerializeCommand("SaveButtonClick", c.SaveButtonClick, xe);
    }

    //反系列化
    this.DeSerialize = function (c, xe, ns) {
        DBFX.Serializer.DeSerialProperty("UploadURL", c, xe);
        DBFX.Serializer.DeSerialProperty("TipText", c, xe);
        DBFX.Serializer.DeSerializeCommand("SaveButtonClick", xe, c);
    }
}
DBFX.Design.ControlDesigners.SignatureBoardDesigner = function () {
    var obdc = new DBFX.Web.Controls.GroupPanel();
    obdc.OnCreateHandle();
    obdc.OnCreateHandle = function () {
        DBFX.Resources.LoadResource("design/DesignerTemplates/FormDesignerTemplates/SignatureBoardDesigner.scrp", function (od) {
            od.DataContext = obdc.dataContext;
            //设计器中绑定事件处理
            od.EventListBox = od.FormContext.Form.FormControls.EventListBox;
            od.EventListBox.ItemSource = [{ EventName: "SaveButtonClick", EventCode: undefined, Command: od.dataContext.SaveButtonClick, Control: od.dataContext }];
        }, obdc);
    }

    //事件处理程序
    obdc.DataContextChanged = function (e) {
        obdc.DataBind(e);
        if (obdc.EventListBox != undefined) {
            obdc.EventListBox.ItemSource = [{ EventName: "SaveButtonClick", EventCode: undefined, Command: obdc.dataContext.SaveButtonClick, Control: obdc.dataContext }];
        }
    }

    obdc.HorizonScrollbar = "hidden";
    obdc.OnCreateHandle();
    obdc.Class = "VDE_Design_ObjectGeneralDesigner";
    obdc.Text = "绘图板控件";
    return obdc;
}

//语音合成控件

DBFX.Web.Controls.TextToSpeech = function (msg) {
    var tts = new DBFX.Web.Controls.Control("TextToSpeech");
    tts.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.TextToSpeechDesigner");
    tts.ClassDescriptor.Serializer = "DBFX.Serializer.TextToSpeechSerializer";
    tts.VisualElement = document.createElement("DIV");
    tts.VisualElement.className = "TextToSpeech";

    //语音合成参数对象
    tts.Param = {};
    //语音合成设置选项对象
    tts.Options = {};

    //判断是否为谷歌浏览器
    tts.isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

    //百度语音合成请求地址
    tts.BaiduTTUrl = 'https://tsn.baidu.com/text2audio';


    tts.OnCreateHandle();
    tts.OnCreateHandle = function () {

        // tts.VisualElement.onmousedown = tts.OnClick;
        tts.VisualElement.style.width = "20px";
        tts.VisualElement.style.height = "20px";
        tts.VisualElement.style.border = "1px solid #666";
        tts.VisualElement.innerHTML = "<audio class='TTSAudio' style='width: 100%;height: 100%'></audio>";
        tts.audio = tts.VisualElement.querySelector("audio.TTSAudio");

        if (tts.autoPlay) {
            // tts.Speak(msg);
        }

    }

    tts.OnClick = function (e) {
        console.log("onmousedown");
        tts.play();
    }


    //判断是否为function
    tts.isFunction = function (obj) {

        if (Object.prototype.toString.call(obj) === '[object Function]') {
            return true;
        }
        return false;
    }

    //播放
    tts.play = function () {
        // tts.audio.play();
        //获取麦克风权限？
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            var audio = tts.audio;
            navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
                //video.src = window.URL.createObjectURL(stream);
                // tts.audio.srcObject = stream;
                tts.audio.play();
            });
        }
    }

    //暂停
    tts.pause = function () {
        tts.audio.pause();
    }

    //spd	选填	语速，取值0-15，默认为5中语速
    tts.spd = 5;
    Object.defineProperty(tts, "Spd", {
        get: function () {
            return tts.spd;
        },
        set: function (v) {
            tts.spd = v * 1 ? v * 1 : 5;
        }
    });

    //pit	选填	音调，取值0-15，默认为5中语调
    tts.pit = 5;
    Object.defineProperty(tts, "Pit", {
        get: function () {
            return tts.pit;
        },
        set: function (v) {
            tts.pit = v * 1 ? v * 1 : 5;
        }
    });

    //vol	选填	音量，取值0-15，默认为5中音量
    tts.vol = 5;
    Object.defineProperty(tts, "Vol", {
        get: function () {
            return tts.vol;
        },
        set: function (v) {
            tts.vol = v * 1 ? v * 1 : 5;
        }
    });

    //per	选填	发音人选择, 0为普通女声，1为普通男生，3为情感合成-度逍遥，4为情感合成-度丫丫，默认为普通女声
    tts.per = 0;
    Object.defineProperty(tts, "Per", {
        get: function () {
            return tts.per;
        },
        set: function (v) {
            tts.per = v * 1 ? v * 1 : 0;
        }
    });

    //是否自动播放
    tts.autoPlay = true;
    Object.defineProperty(tts, "AutoPlay", {
        get: function () {
            return tts.autoPlay;
        },
        set: function (v) {
            if (v == "true" || v == true) {
                tts.autoPlay = true;
            } else {
                tts.autoPlay = false;
            }
        }
    });

    //是否隐藏控制栏
    tts.showC = true;
    Object.defineProperty(tts, "ShowC", {
        get: function () {
            return tts.showC;
        },
        set: function (v) {
            if (v == "true" || v == true) {
                tts.showC = true;
                // tts.audio.style.display = "inline-block !important";
                tts.audio.setAttribute('controls', 'controls');

            } else {
                tts.showC = false;
                // tts.audio.style.display = 'none';
                // tts.audio.setAttribute('controls', '');
                tts.audio.removeAttribute("controls");
            }
        }
    });


    //传入参数 生成语音
    tts.Speak = function (t) {
        //必填	合成的文本，使用UTF-8编码。小于2048个中文字或者英文数字。（文本在百度服务器内转换为GBK后，长度必须小于4096字节）
        tts.Param.tex = t;
        //必填	开放平台获取到的开发者access_token
        /*换取token
         *首先在您创建的应用中查找Api Key 和 SecretKey。访问https://openapi.baidu.com/oauth/2.0/token 换取 token
         * Api Key:0sEHYZxBKbjntvpQmf14zM0x
         * SecretKey:zDYIdsZTmUT1TRhgcVGMEscnxwPcTKia
         * https://openapi.baidu.com/oauth/2.0/token?grant_type=client_credentials&client_id=0sEHYZxBKbjntvpQmf14zM0x&client_secret=zDYIdsZTmUT1TRhgcVGMEscnxwPcTKia
         *可以获取如下结果

            {
                "access_token": "1.a6b7dbd428f731035f771b8d********.86400.1292922000-2346678-124328",
                "expires_in": 2592000,
                "refresh_token": "2.385d55f8615fdfd9edb7c4b********.604800.1293440400-2346678-124328",
                "scope": "public audio_tts_post ...",
                "session_key": "ANXxSNjwQDugf8615Onqeik********CdlLxn",
                "session_secret": "248APxvxjCZ0VEC********aK4oZExMB",
            }
         *
         * */

        // 创建XMLHttpRequest对象
        var request = new XMLHttpRequest();
        //发送请求 获取语音合成access_token
        request.open('GET', "https://lc.dbazure.cn/baiduai.ashx", true);
        // request.responseType = 'json';
        request.onreadystatechange = function () {

            var DONE = this.DONE || 4;
            if (this.readyState === DONE) {
                var resStr = request.response;

                try {
                    var resObj = JSON.parse(resStr);

                    tts.Param.tok = resObj["access_token"];
                    //调用百度语音合成请求
                    tts.BaiduTTS(tts.Param, tts.Options);
                } catch (error) {
                    console.log(error);
                }
            }
        };

        request.send();

        // tts.Param.tok = "24.081382fe8ee406695faf6889bd51f875.2592000.1562719179.282335-15558582";


        tts.Param.spd = tts.spd;
        tts.Param.pit = tts.pit;
        tts.Param.vol = tts.vol;
        tts.Param.per = tts.per;

        tts.Options.valume = 0.3;
        tts.Options.autoDestory = true;
        tts.Options.timeout = 10000;
        // tts.Options.hidden = false;
        tts.Options.autoplay = true;

        tts.Options.onInit = function (htmlAudioElement) {

        }

        tts.Options.onSuccess = function (htmlAudioElement) {
            tts.play();
            // tts.OnClick();
        }

        tts.Options.onError = function (text) {

        }

        tts.Options.onTimeout = function () {

        }
    }


    //百度语音合成方法
    tts.BaiduTTS = function (param, options) {
        var opt = options || {};
        // var p = param || {};

        // 如果浏览器支持，可以设置autoplay，但是不能兼容所有浏览器

        if (opt.autoplay) {
            tts.audio.setAttribute('autoplay', 'autoplay');
        }

        // 显示控制栏
        if (tts.showC) {
            tts.audio.setAttribute('controls', 'controls');
        } else {
            // tts.audio.style.display = 'none';
            // tts.audio.setAttribute('controls', '');
            tts.audio.removeAttribute("controls");
        }

        // tts.VisualElement.style.display = 'none';

        // 设置音量
        if (typeof opt.volume !== 'undefined') {
            tts.audio.volume = opt.volume;
        }

        // 调用onInit回调
        tts.isFunction(opt.onInit) && opt.onInit(tts.audio);

        // 默认超时时间60秒
        var DEFAULT_TIMEOUT = 60000;
        var timeout = opt.timeout || DEFAULT_TIMEOUT;

        // 创建XMLHttpRequest对象
        var xhr = new XMLHttpRequest();
        xhr.open('POST', tts.BaiduTTUrl);

        // 创建form参数
        var data = {};
        for (var p in param) {
            data[p] = param[p]
        }

        // 赋值预定义参数
        //cuid	必填	用户唯一标识，用来计算UV值。建议填写能区分用户的机器 MAC 地址或 IMEI 码，长度为60字符以内
        data.cuid = data.cuid || data.tok;
        //ctp	必填	客户端类型选择，web端填写固定值1
        data.ctp = 1;
        //lan	必填	固定值zh。语言选择,目前只有中英文混合模式，填写固定值zh
        data.lan = data.lan || 'zh';

        // 序列化参数列表
        var fd = [];
        for (var k in data) {
            fd.push(k + '=' + encodeURIComponent(data[k]));
        }

        // 用来处理blob数据
        var frd = new FileReader();
        xhr.responseType = 'blob';
        xhr.send(fd.join('&'));

        // 用timeout可以更兼容的处理兼容超时
        var timer = setTimeout(function () {
            xhr.abort();
            isFunction(opt.onTimeout) && opt.onTimeout();
        }, timeout);

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                clearTimeout(timer);
                if (xhr.status == 200) {
                    if (xhr.response.type === 'audio/mp3') {

                        var audioUrl = URL.createObjectURL(xhr.response);
                        tts.audio.setAttribute('src', URL.createObjectURL(xhr.response));

                        tts.play();

                        // if (!tts.isChrome) {
                        //     var n = new Audio(audioUrl);
                        //     n.src = audioUrl;
                        //     // n.play();
                        //
                        //     if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                        //         var audio = tts.audio;
                        //         navigator.mediaDevices.getUserMedia({ audio: true }).then(function(stream) {
                        //             //video.src = window.URL.createObjectURL(stream);
                        //             // tts.audio.srcObject = stream;
                        //             // tts.audio.play();
                        //             n.play();
                        //         });
                        //
                        //         // tts.audio.play();
                        //     }
                        //
                        // } else {
                        //     window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext ||
                        //         window.msAudioContext;
                        //     try {
                        //         var context = new window.AudioContext();
                        //         var source = null;
                        //         var audioBuffer = null;
                        //
                        //         function playSound() {
                        //             source = context.createBufferSource();
                        //             source.buffer = audioBuffer;
                        //             source.loop = false;
                        //             source.connect(context.destination);
                        //             // source.start(0); //立即播放
                        //
                        //             if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                        //                 var audio = tts.audio;
                        //                 navigator.mediaDevices.getUserMedia({ audio: true }).then(function(stream) {
                        //                     //video.src = window.URL.createObjectURL(stream);
                        //                     // tts.audio.srcObject = stream;
                        //                     // tts.audio.play();
                        //                     source.start(0);
                        //                 });
                        //
                        //                 // tts.audio.play();
                        //             }
                        //         }
                        //
                        //         function initSound(arrayBuffer) {
                        //             context.decodeAudioData(arrayBuffer, function (buffer) { //解码成功时的回调函数
                        //                 audioBuffer = buffer;
                        //                 playSound();
                        //             }, function (e) { //解码出错时的回调函数
                        //                 console.log('Error decoding file', e);
                        //             });
                        //         }
                        //
                        //         function loadAudioFile(url) {
                        //             var xhr = new XMLHttpRequest(); //通过XHR下载音频文件
                        //             xhr.open('GET', url, true);
                        //             xhr.responseType = 'arraybuffer';
                        //             xhr.onload = function (e) { //下载完成
                        //                 initSound(this.response);
                        //             };
                        //             xhr.send();
                        //         }
                        //
                        //         var mpsUrl = "http://tsn.baidu.com/text2audio?lan=zh&ctp=1&cuid=abcdxxx&tok=24.081382fe8ee406695faf6889bd51f875.2592000.1562719179.282335-15558582&tex=%e7%99%be%e5%ba%a6%e4%bd%a0%e5%a5%bd&vol=9&per=0&spd=5&pit=5&aue=3"
                        //
                        //         loadAudioFile(mpsUrl);
                        //     } catch (e) {
                        //         console.log('!Your browser does not support AudioContext');
                        //     }
                        // }

                        // autoDestory设置则播放完后移除audio的dom对象
                        if (opt.autoDestory) {
                            tts.audio.onended = function () {
                                // document.body.removeChild(audio);
                                //TODO:
                                // tts.audio.setAttribute('src', null);
                            }
                        }

                        tts.isFunction(opt.onSuccess) && opt.onSuccess(tts.audio);
                    }

                    // 用来处理错误
                    if (xhr.response.type === 'application/json') {
                        frd.onload = function () {
                            var text = frd.result;
                            tts.isFunction(opt.onError) && opt.onError(text);
                        };
                        frd.readAsText(xhr.response);
                    }
                }
            }
        }

    }

    tts.OnCreateHandle();
    return tts;
}

//序列化
DBFX.Serializer.TextToSpeechSerializer = function () {
    //系列化
    this.Serialize = function (c, xe, ns) {

        DBFX.Serializer.SerialProperty("Spd", c.Spd, xe);
        DBFX.Serializer.SerialProperty("Pit", c.Pit, xe);
        DBFX.Serializer.SerialProperty("Vol", c.Vol, xe);
        DBFX.Serializer.SerialProperty("Per", c.Per, xe);
        DBFX.Serializer.SerialProperty("AutoPlay", c.AutoPlay, xe);
        DBFX.Serializer.SerialProperty("ShowC", c.ShowC, xe);
    }


    //反系列化
    this.DeSerialize = function (c, xe, ns) {
        DBFX.Serializer.DeSerialProperty("Spd", c, xe);
        DBFX.Serializer.DeSerialProperty("Pit", c, xe);
        DBFX.Serializer.DeSerialProperty("Vol", c, xe);
        DBFX.Serializer.DeSerialProperty("Per", c, xe);
        DBFX.Serializer.DeSerialProperty("AutoPlay", c, xe);
        DBFX.Serializer.DeSerialProperty("ShowC", c, xe);

    }

}
DBFX.Design.ControlDesigners.TextToSpeechDesigner = function () {

    var obdc = new DBFX.Web.Controls.GroupPanel();
    obdc.OnCreateHandle();
    obdc.OnCreateHandle = function () {
        DBFX.Resources.LoadResource("design/DesignerTemplates/FormDesignerTemplates/TextToSpeechDesigner.scrp", function (od) {
            od.DataContext = obdc.dataContext;

        }, obdc);
    }

    //事件处理程序
    obdc.DataContextChanged = function (e) {
        obdc.DataBind(e);

    }

    obdc.HorizonScrollbar = "hidden";
    obdc.OnCreateHandle();
    obdc.Class = "VDE_Design_ObjectGeneralDesigner";
    obdc.Text = "语音合成";
    return obdc;
}

//显示页面遮罩蒙板
DBFX.Web.Controls.ShowOverlay = function (o, c) {

    if (DBFX.Web.Controls.OverlayDiv == undefined) {

        DBFX.Web.Controls.OverlayDiv = document.createElement("DIV");
        DBFX.Web.Controls.OverlayDiv.className = "Overlay";
        if(o!=undefined)
            DBFX.Web.Controls.OverlayDiv.style.opacity = o;

        if (c != undefined)
            DBFX.Web.Controls.OverlayDiv.style.backgroundColor = c;

        document.body.appendChild(DBFX.Web.Controls.OverlayDiv);
    }


}

//关闭遮罩面板
DBFX.Web.Controls.CloseOverlay = function () {

    if (DBFX.Web.Controls.OverlayDiv != undefined) {

        document.body.removeChild(DBFX.Web.Controls.OverlayDiv);
        DBFX.Web.Controls.OverlayDiv = undefined;

    }

}

//图片全屏显示
DBFX.Web.Controls.Image.ShowByFullScreen = function (imgurl) {

    var imgPnl = document.createElement("ImageViewer");
    imgPnl.innerHTML = "<IVBox><TSDiv><ToolStip><img cmd=\"0\"><img cmd=\"1\" ><img cmd=\"2\"><img cmd=\"4\"></ToolStip></TSDiv><ImageDiv><img /></ImageDiv></IVBox>";
    imgPnl.Image = imgPnl.querySelector("ImageDiv").querySelector("img");
    imgPnl.ImageDiv = imgPnl.querySelector("ImageDiv");
    imgPnl.Image.src = imgurl;
    imgPnl.Image.style.maxHeight = "100%";
    imgPnl.Image.style.maxWidth = "100%";
    imgPnl.ImageDiv.style.overflow = "auto";


    imgPnl.Buttons = imgPnl.querySelector("ToolStip").querySelectorAll("img");
    imgPnl.Closer = imgPnl.Buttons[3];
    imgPnl.Closer.src = "Themes/" + app.CurrentTheme + "/Images/CloserImage.png";
    imgPnl.Buttons[0].src = "Themes/" + app.CurrentTheme + "/Images/ImageViewer/rotatel.png";
    imgPnl.Buttons[1].src = "Themes/" + app.CurrentTheme + "/Images/ImageViewer/rotater.png";
    imgPnl.Buttons[2].src = "Themes/" + app.CurrentTheme + "/Images/ImageViewer/fit2scrn.png";
    // imgPnl.Buttons[3].src = "Themes/" + app.CurrentTheme + "/Images/ImageViewer/fit2img.png";
    imgPnl.Image.draggable = false;
    imgPnl.querySelector("ToolStip").onclick = function (e) {

        var el = e.srcElement;
        var cmd = el.getAttribute("cmd");
        switch (cmd) {

            case "0":
                imgPnl.RotateLeft90();
                break;

            case "1":
                imgPnl.RotateRight90();
                break;

            case "2":
                imgPnl.FitScreen();

                break;

            case "3":
                imgPnl.FitImg();

        }

    }

    imgPnl.Image.onmousewheel = function (e) {

        if (e.ctrlKey == true) {

            imgPnl.ImgScale += e.wheelDelta * 0.001;
            // console.log(imgPnl.ImgScale);
            if (imgPnl.ImgScale < 0.5) {
                imgPnl.ImgScale = 0.5;
            } else if (imgPnl.ImgScale > 5) {
                imgPnl.ImgScale = 5;
            }
            imgPnl.Image.style.transform = "translate3d(-50%,-50%,0)  scale(" + imgPnl.ImgScale + ") rotate(" + imgPnl.rotateDeg + "deg)";
            // imgPnl.Image.style.transformOrigin = "0,0";
        }

    }

    imgPnl.OrgPoint = undefined;
    imgPnl.ImgPt = { x: 0, y: 0 };
    imgPnl.ImgOPt = { x: 0, y: 0 };
    imgPnl.Image.onmousedown = function (e) {

        if (e.buttons == 1) {
            imgPnl.OrgPoint = { x: e.clientX, y: e.clientY };
            imgPnl.ImgPt = { x: imgPnl.ImgOPt.x, y: imgPnl.ImgOPt.y };
        }
        else
            imgPnl.OrgPoint = undefined;

    }

    imgPnl.Image.onmousemove = function (e) {

        if (e.buttons == 1 && imgPnl.OrgPoint != undefined) {
            var ox = e.x - imgPnl.OrgPoint.x;
            var oy = e.y - imgPnl.OrgPoint.y;
            imgPnl.ImgOPt.x = (imgPnl.ImgPt.x + ox);
            imgPnl.ImgOPt.y = (imgPnl.ImgPt.y + oy);
            imgPnl.Image.style.left = imgPnl.ImgOPt.x + "px";
            imgPnl.Image.style.top = imgPnl.ImgOPt.y + "px";

        }

    }


    imgPnl.istouch = false;
    imgPnl.start = [];

    imgPnl.Scale = 1;
    imgPnl.preScale = 1;
    //手指触摸
    imgPnl.Image.ontouchstart = function (e) {

        imgPnl.imgRect = imgPnl.Image.getBoundingClientRect();
        imgPnl.imgDivRect = imgPnl.ImageDiv.getBoundingClientRect();

        // console.log(imgPnl.imgRect);
        // console.log(imgPnl.imgDivRect);

        if (e.touches.length == 1) {
            imgPnl.OrgPoint = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            imgPnl.ImgPt = { x: imgPnl.ImgOPt.x, y: imgPnl.ImgOPt.y };
        }
        else
            imgPnl.OrgPoint = undefined;


        /**双指触摸*/
        if (e.touches.length >= 2) {
            imgPnl.istouch = true;
            imgPnl.start = e.touches;  //得到第一组两个点
        };

    }



    imgPnl.Image.ontouchmove = function (e) {
        if (e.touches.length == 1 && imgPnl.OrgPoint != undefined) {
            //    TODO:
            var max_left = (imgPnl.imgRect.width - imgPnl.imgDivRect.width) * 0.5,
                max_top = (imgPnl.imgRect.height - imgPnl.imgDivRect.height) * 0.5,
                min_left = -max_left,
                min_top = -max_top;



            var ox = e.touches[0].clientX - imgPnl.OrgPoint.x;
            var oy = e.touches[0].clientY - imgPnl.OrgPoint.y;
            imgPnl.ImgOPt.x = (imgPnl.ImgPt.x + ox);
            imgPnl.ImgOPt.y = (imgPnl.ImgPt.y + oy);


            // if(imgPnl.ImgOPt.x<min_left && imgPnl.imgRect.width>imgPnl.imgDivRect.width){
            //     imgPnl.ImgOPt.x = min_left;
            // }else if(imgPnl.ImgOPt.x>max_left && imgPnl.imgRect.width>imgPnl.imgDivRect.width){
            //     imgPnl.ImgOPt.x = max_left;
            // }else {
            //     imgPnl.ImgOPt.x = 0;
            // }
            //
            // if (imgPnl.ImgOPt.y<min_top && imgPnl.imgRect.height>imgPnl.imgDivRect.height){
            //     imgPnl.ImgOPt.y = min_top;
            // }else if (imgPnl.ImgOPt.y>max_top && imgPnl.imgRect.height>imgPnl.imgDivRect.height){
            //     imgPnl.ImgOPt.y = max_top;
            // }else {
            //     imgPnl.ImgOPt.y = 0;
            // }

            imgPnl.Image.style.left = imgPnl.ImgOPt.x + "px";
            imgPnl.Image.style.top = imgPnl.ImgOPt.y + "px";


        }


        /**双指缩放*/
        if (e.touches.length >= 2 && imgPnl.istouch) {
            var now = e.touches;  //得到第二组两个点
            var scale = imgPnl.getDistance(now[0], now[1]) / imgPnl.getDistance(imgPnl.start[0], imgPnl.start[1]); //得到缩放比例，getDistance是勾股定理的一个方法
            var rotation = imgPnl.getAngle(now[0], now[1]) - imgPnl.getAngle(imgPnl.start[0], imgPnl.start[1]);  //得到旋转角度，getAngle是得到夹角的一个方法

            imgPnl.Scale = scale.toFixed(2);
            // e.rotation=rotation.toFixed(2);
            imgPnl.Scale = imgPnl.preScale * imgPnl.Scale;
            imgPnl.Image.style.transform = "translate3d(-50%,-50%,0) scale(" + imgPnl.Scale + ")";//改变目标元素的大小

        };
    }

    imgPnl.Image.ontouchend = function (e) {
        if (imgPnl.istouch) {
            imgPnl.istouch = false;

            if (imgPnl.Scale > 5) {
                imgPnl.Scale = 5;
                imgPnl.Image.style.transform = "translate3d(-50%,-50%,0) scale(" + imgPnl.Scale + ")";//改变目标元素的大小
            }

            if (imgPnl.Scale < 1) {
                imgPnl.Scale = 1;
                imgPnl.Image.style.transform = "translate3d(-50%,-50%,0) scale(" + imgPnl.Scale + ")";//改变目标元素的大小
            }

            imgPnl.preScale = imgPnl.Scale;

        };
    }
    /**计算距离*/
    imgPnl.getDistance = function (p1, p2) {
        var x = p2.pageX - p1.pageX,
            y = p2.pageY - p1.pageY;
        return Math.sqrt((x * x) + (y * y));
    };

    /**计算旋转角度*/
    imgPnl.getAngle = function (p1, p2) {
        var x = p1.pageX - p2.pageX,
            y = p1.pageY - p2.pageY;
        return Math.atan2(y, x) * 180 / Math.PI;
    };


    document.body.appendChild(imgPnl);
    imgPnl.ImgScale = 1;

    if (imgPnl.Image.clientWidth > window.screen.innerWidth || imgPnl.Image.clientHeight > window.screen.innerHeight) {

        var ihw = 0;
        if (imgPnl.Image.clientHeight > imgPnl.Image.clientWidth) {
            imgPnl.ImgScale = window.screen.innerHeight / imgPnl.Image.clientHeight;

        }
        else {
            imgPnl.ImgScale = window.screen.innerWidth / imgPnl.Image.clientWidth;

        }

        imgPnl.Image.style.transform = "translate3d(-50%,-50%,0) scale(" + imgPnl.ImgScale + ") rotate(" + imgPnl.rotateDeg + "deg)";

    }

    imgPnl.FitScreen = function () {

        var w = imgPnl.Image.clientWidth;
        var h = imgPnl.Image.clientHeight;
        var w1 = imgPnl.ImageDiv.clientWidth;
        var h1 = imgPnl.ImageDiv.clientHeight;
        if(w/h <= w1/h1){
            imgPnl.Image.style.height = "100%";
        }else {
            imgPnl.Image.style.width = "100%";
        }
        // if (imgPnl.Image.clientWidth > imgPnl.Image.clientHeight)
        //     imgPnl.Image.style.width = "100%";
        // else
        //     imgPnl.Image.style.height = "100%";


        imgPnl.ImgPt = { x: 0, y: 0 };
        imgPnl.ImgOPt = { x: 0, y: 0 };

        imgPnl.Image.style.top = "";
        imgPnl.Image.style.left = "";

        imgPnl.ImgScale = 1;
        imgPnl.Image.style.transform = "translate3d(-50%,-50%,0) scale(" + imgPnl.ImgScale + ") rotate(" + imgPnl.rotateDeg + "deg)";

    }

    imgPnl.FitImg = function () {

        if (imgPnl.Image.clientWidth < window.screen.innerWidth)
            imgPnl.Image.style.width = "";

        if (mgPnl.Image.height < window.screen.innerHeight)
            imgPnl.Image.style.height = "";


    }

    imgPnl.rotateDeg = 0;
    imgPnl.RotateLeft90 = function () {

        imgPnl.rotateDeg -= 90;
        imgPnl.Image.style.transform = "translate3d(-50%,-50%,0) scale(" + imgPnl.ImgScale + ") rotate(" + imgPnl.rotateDeg + "deg)";
    }

    imgPnl.RotateRight90 = function () {

        imgPnl.rotateDeg += 90;

        imgPnl.Image.style.transform = "translate3d(-50%,-50%,0) scale(" + imgPnl.ImgScale + ") rotate(" + imgPnl.rotateDeg + "deg)";
    }

    //if(imgPnl.requestFullscreen!=undefined)
    //    imgPnl.requestFullscreen();

    //if (imgPnl.msRequestFullscreen != undefined)
    //    imgPnl.msRequestFullscreen();



    imgPnl.Closer.onclick = function (e) {

        //if(imgPnl.exitFullscreen!=undefined)
        //    imgPnl.exitFullscreen();

        //if (imgPnl.msExitFullscreen != undefined)
        //    imgPnl.msExitFullscreen();

        document.body.removeChild(imgPnl);

    }

    imgPnl.FitScreen();

}

//文件上传列表
DBFX.Web.Controls.FileUploader = function () {

    var fu = new DBFX.Web.Controls.Control("FileUploader");
    fu.ClassDescriptor.Serializer = "DBFX.Serializer.FileUploaderSerializer";
    fu.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.FileUploaderDesigner");
    fu.VisualElement = document.createElement('div');
    fu.VisualElement.className = "FileUploader";

    //记录所有选择的文件
    fu.Files = [];
    fu.Files.toJSON = function(){
        var arr = []
        fu.Files.forEach(function (f) {
            var obj = {FileUrl:f.FileUrl,UploadFlag:f.UploadFlag,lastModified:f.lastModified,
                lastModifiedDate:f.lastModifiedDate,name:f.name,size:f.size,type:f.type,webkitRelativePath:f.webkitRelativePath};

            arr.push(obj);
        })

        return arr;
    }
    fu.Rows = [];
    fu.OnCreateHandle();
    fu.OnCreateHandle = function () {
        fu.VisualElement.innerHTML = "<div class='FileUploader_Container'>" +
          "<input class='FileUploader_ChooseFile'  accept='*' type='file' style='display: none;'>" +
          "<div class='FileUploader_TipBox'>请将文件拖拽到此区域</div>" +
          "<div class='FileUploader_Header'><div class='FileUploader_SelectBtn' ><img><span>添加文件</span></div>" +
          "<div class='FileUploader_UploadAll' ><img><span>上传全部</span></div></div>" +
          "<div class='FileUploader_Body'></div>" +
          "</div>";
        //获取元素对象
        fu.Header = fu.VisualElement.querySelector("div.FileUploader_Header");
        fu.Body = fu.VisualElement.querySelector("div.FileUploader_Body");
        fu.Choose = fu.VisualElement.querySelector("input.FileUploader_ChooseFile");
        fu.SelectBtn = fu.VisualElement.querySelector("div.FileUploader_SelectBtn");
        fu.UploadAllBtn = fu.VisualElement.querySelector("div.FileUploader_UploadAll");


        //"themes/" + app.CurrentTheme + "/images/datagridview/group.png"
        fu.AddBtnImg = fu.SelectBtn.querySelector("img");
        fu.UploadBtnImg = fu.UploadAllBtn.querySelector("img");

        fu.AddBtnImg.src = "themes/" + app.CurrentTheme + "/images/fileUploader/add.png";
        fu.UploadBtnImg.src = "themes/" + app.CurrentTheme + "/images/fileUploader/upload.png";
        // fu.AddBtnImg.src = "./add.png";
        //选择文件按钮点击
        fu.SelectBtn.onclick = function () {
            if(fu.Files.length >= fu.FileCount){
                alert('文件选择个数已经超过数量限制！');
                return;
            }
            fu.Choose.click();
        }

        //上传所有文件按钮点击
        fu.UploadAllBtn.onclick = function () {
            fu.UploadAllFiles();
        }

        fu.TipBox = fu.VisualElement.querySelector("div.FileUploader_TipBox");

        //监听拖拽事件 处理文件拖拽处理
        fu.VisualElement.addEventListener("dragenter", function (e) {
            e.preventDefault();
            e.stopPropagation();
            // fu.TipBox.style.visibility = "visible";

        }, false);

        fu.VisualElement.addEventListener("dragover", function (e) {
            e.dataTransfer.dropEffect = 'copy';//兼容第三方应用
            e.preventDefault();
            e.stopPropagation();
        }, false);

        fu.VisualElement.addEventListener("dragleave", function (e) {
            e.preventDefault();
            e.stopPropagation();
            fu.TipBox.style.visibility = "hidden";
        }, false);

        //拖拽文件添加到上传列表
        fu.VisualElement.addEventListener("drop", function (e) {
            e.preventDefault();
            e.stopPropagation();

            var df = e.dataTransfer,
              items = df.items;

            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (item.kind === 'file' && item.webkitGetAsEntry().isFile) {
                    var file = item.getAsFile();
                    console.log(file);
                    var file = fu.AddFile(file);
                    file && fu.AddRow(file);
                }

                // fu.ItemSource = fu.Files;
            }
            // console.log(df.items);

        }, false);

        //文件选择 添加到上传列表
        fu.Choose.onchange = function (e) {
            var files = this.files;
            if (files && files.length) {
                // 原始FileList对象不可更改，所以将其赋予curFiles提供接下来的修改
                // Array.prototype.push.apply(fu.Files, files);

                for (var i = 0; i < files.length; i++) {

                    var file = fu.AddFile(files[i]);
                    file && fu.AddRow(file);
                    fu.OnFileChoose(file);
                }
            }
            // fu.ItemSource = fu.Files;
            if(fu.UploadMode == 0){
                fu.UploadAllFiles();
            }
        }
    }

    //文件选择事件
    fu.OnFileChoose = function(file){
        if (fu.FileChoose != undefined) {
            fu.CurrentChooseFile = file;
            if (fu.FileChoose.GetType() == "Command") {
                fu.FileChoose.Sender = fu;
                fu.FileChoose.Execute();
            }
            else {
                if (typeof fu.FileChoose == "function")
                    fu.FileChoose(file);
            }
        }
    }

    //清空数据
    fu.Reset = function(){
        fu.Choose.value = '';
        fu.Files.length = 0;
        fu.Rows.length = 0;
        fu.Body.innerHTML = '';
    }

    //添加行
    fu.AddRow = function (file) {
        var row = new DBFX.Web.Controls.FileUploaderRow();
        fu.Body.appendChild(row.VisualElement);

        row.FileUploader = fu;
        row.FileMaxSize = fu.fileMaxSize;
        row.File = file;
        file.Row = row;
        row.FileName = file.name;
        row.FileSize = file.size;
        // row.FileType = file.type;
        fu.Rows.push(row);
        return row;
    }

    //添加文件到文件列表 不能重复
    fu.AddFile = function (file) {

        if(file){
            file.allowUpload = true;
            Object.defineProperty(file,'AllowUpload',{
                get:function () { return file.allowUpload; },
                set:function (v) {
                    file.allowUpload = v == true || v=='true'?true:false;
                }
            })

            file.tipText = '';
            Object.defineProperty(file,'TipText',{
                get:function () { return file.tipText; },
                set:function (v) {
                    file.tipText = v == undefined?'':v;
                    file.Row.TipText = file.tipText;
                }
            })

        }

        if (fu.Files.length == 0) {
            fu.Files.push(file);
            return file;
        } else {
            var flag = 0;
            for (var i = 0; i < fu.Files.length; i++) {
                var f = fu.Files[i];
                if (f.name == file.name && f.size == file.size && f.type == file.type && f.lastModified == file.lastModified) {
                    flag = 1;
                    break;
                }
            }
            if (flag == 0) {
                fu.Files.push(file);
                return file;
            } else {
                alert('文件已经存在！');
                return null;
            }
        }
    }

    //上传模式 0-选择文件后自动上传;1-显示全部上传按钮，用户点击上传；
    fu.uploadMode = 0;
    Object.defineProperty(fu, "UploadMode", {
        get: function () { return fu.uploadMode; },
        set: function (v) {
            fu.uploadMode = v;
            fu.VisualElement.setAttribute('uploadMode',''+v);
        }
    })

    //数据源属性 赋值时创建表格
    fu.itemSource = [];
    Object.defineProperty(fu, "ItemSource", {
        get: function () { return fu.itemSource; },
        set: function (v) {
            fu.itemSource = v;
            fu.CreatList();
        }
    })

    //文件类型设置  image/*
    fu.fileFormat = "*";
    Object.defineProperty(fu, "FileFormat", {
        get: function () { return fu.fileFormat; },
        set: function (v) {
            fu.fileFormat = v;
            fu.Choose.setAttribute("accept", v)
        }
    })


    //TODO:文件数量设置
    fu.fileCount = 1;
    Object.defineProperty(fu, "FileCount", {
        get: function () { return fu.fileCount; },
        set: function (v) {
            v = v * 1 ? v * 1 : 1;
            fu.fileCount = v;
        }
    })

    //TODO:文件大小限制  单位：字节
    fu.fileMaxSize = 1024 * 1024 * 3;
    Object.defineProperty(fu, "FileMaxSize", {
        get: function () { return fu.fileMaxSize; },
        set: function (v) {
            v = v * 1 ? v * 1 : 1024 * 1024 * 3;
            fu.fileMaxSize = v;
        }
    })


    //TODO:文件多选设置  multiple
    fu.multipleFile = false;
    Object.defineProperty(fu, "MultipleFile", {
        get: function () { return fu.multipleFile; },
        set: function (v) {
            v = (v == true || v == "true");
            fu.multipleFile = v;
            if (v) {
                fu.Choose.setAttribute("multiple", v)
            } else {
                fu.Choose.removeAttribute("multiple");
            }

        }
    })

    //文件上传地址
    fu.uploadUrl = "";
    Object.defineProperty(fu, "UploadUrl", {
        get: function () { return fu.uploadUrl; },
        set: function (v) {
            fu.uploadUrl = v;
        }
    })


    //创建表格行
    fu.CreatList = function () {

        if (Array.isArray(fu.itemSource) && fu.itemSource.length > 0) {

            fu.Body.innerHTML = "";
            fu.Rows = [];
            fu.Files.length = 0;
            fu.itemSource.forEach(function (file) {
                // var row = new DBFX.Web.Controls.FileUploaderRow();
                // fu.Body.appendChild(row.VisualElement);
                var row = fu.AddRow(file);
                fu.Files.push(file);
                row.UploadState = file.FileUrl && file.FileUrl.length > 5 ? 1 : 2;
                row.UploadFlag = file.FileUrl && file.FileUrl.length > 5 ? 1 : undefined;
            })
        }
    }

    //删除按钮点击事件处理
    fu.OnDeleteClick = function (e, row) {
        console.log('删除文件');
        fu.RemoveRow(row);
    }

    //移除行
    fu.RemoveRow = function (row) {
        //
        var index = fu.Files.indexOf(row.File);
        fu.Files.splice(index, 1);
        fu.Rows.splice(index, 1);
        fu.Body.removeChild(row.VisualElement);
    }

    //移除文件
    fu.RemoveFile = function(file){
        var index = fu.Files.indexOf(file);
        fu.Files.splice(index, 1);
        var row = fu.Rows[index];
        fu.Body.removeChild(row.VisualElement);
        fu.Rows.splice(index, 1);
    }

    //上传按钮点击处理
    fu.OnUploadClick = function (e, row) {
        fu.UploadFile(row);
    }

    //上传全部文件
    fu.UploadAllFiles = function () {
        if (fu.Rows.length <= 0) {
            alert("请先添加文件后再上传！");
            return;
        }
        fu.Rows.forEach(function (row) {
            //判断该行文件是否已经上传 未上传时上传
            if (row.UploadFlag != 1 && row.File.size <= fu.fileMaxSize) {
                fu.UploadFile(row);
            }
        })
    }

    //TODO:文件上传
    //https://wfs.dbazure.cn/wfs.ashx?OwnerId=1234
    fu.UploadFile = function (row) {
        //已经上传成功
        if (row.UploadFlag == 1) {
            alert("文件已经上传成功，无需再次上传！");
            return;
        }
        if(row.File.AllowUpload == false){
            alert(row.TipText);
            return;
        }

        fu.ReadFile(row.File, function (suc) {
            var formdata = new FormData();
            var sBoard = {};
            formdata.append(row.File.name, row.File);

            //调用上传方法
            DBFX.Net.WebClient.ExecuteWebRequest(fu.uploadUrl, "POST", function (respjson, ctx) {

                try {
                    sBoard.ResponseObj = JSON.parse(respjson)[0];
                } catch (e) {
                    sBoard.ResponseObj = { Exception: e.toString(), State: 1 };
                }

                if(sBoard.ResponseObj.State == -1){//上传失败
                    row.FileUrl = '';
                    row.File.FileUrl = '';
                    row.TipText = "上传失败！";
                    row.UploadFlag = 0;
                    row.File.UploadFlag = 0;
                    row.File.Exception = sBoard.ResponseObj.Exception;
                }else {
                    //2、
                    //保存当前行上传后的文件路径
                    row.FileUrl = sBoard.ResponseObj.Url;
                    row.File.FileUrl = sBoard.ResponseObj.Url;
                    row.TipText = "上传成功！";
                }


            }, sBoard, formdata, function (progress) {

                //1、
                var total = progress.total,
                  loaded = progress.loaded,
                  flag = progress.lengthComputable,
                  percent = 0;

                row.MaxValue = total;
                row.CurValue = loaded;

                //文件大小可以计算
                if (flag) {
                    percent = loaded / total * 100;
                    row.TipText = "正在上传" + percent.toFixed(2) + "%";
                    console.log(percent);
                    if (percent == 100) {
                        //标识当前行上传完成
                        row.UploadFlag = 1;
                        row.File.UploadFlag = 1;
                    }
                }

            }, function (err) {
                console.log(err);
                row.TipText = "上传失败！";
            });
        }, function (err) {
            alert(row.File.name + "文件不存在或已被删除！");
            console.log('文件读取失败', err);
        });

    }

    /**
     * 读取文件
     * @param file 文件对象
     * @param sucCb 成功回调
     * @param errCb 失败回调
     * @constructor
     */
    fu.ReadFile = function (file, sucCb, errCb) {

        fu.FileReader = new FileReader();

        fu.FileReader.readAsDataURL(file);
        fu.FileReader.onload = function (ev) {
            (sucCb && typeof sucCb == 'function') && sucCb(fu.FileReader);
        }

        fu.FileReader.onerror = function (ev) {
            (errCb && typeof errCb == 'function') && errCb(fu.FileReader);
        }
    }

    fu.OnCreateHandle();
    return fu;
};
DBFX.Serializer.FileUploaderSerializer = function () {
    this.DeSerialize = function (c, xe, ns) {

        DBFX.Serializer.DeSerialProperty("FileFormat", c, xe);
        DBFX.Serializer.DeSerialProperty("MultipleFile", c, xe);
        DBFX.Serializer.DeSerialProperty("UploadUrl", c, xe);
        DBFX.Serializer.DeSerialProperty("FileCount", c, xe);
        DBFX.Serializer.DeSerialProperty("FileMaxSize", c, xe);


        //反序列化事件
        DBFX.Serializer.DeSerializeCommand("FileChoose", xe, c);
    }

    //系列化 开发平台保存设置时调用
    this.Serialize = function (c, xe, ns) {

        DBFX.Serializer.SerialProperty("FileFormat", c.FileFormat, xe);
        DBFX.Serializer.SerialProperty("MultipleFile", c.MultipleFile, xe);
        DBFX.Serializer.SerialProperty("UploadUrl", c.UploadUrl, xe);
        DBFX.Serializer.SerialProperty("FileCount", c.FileCount, xe);
        DBFX.Serializer.SerialProperty("FileMaxSize", c.FileMaxSize, xe);

        //序列化事件
        DBFX.Serializer.SerializeCommand("FileChoose", c.FileChoose, xe);
    }
}
DBFX.Design.ControlDesigners.FileUploaderDesigner = function () {
    var obdc = new DBFX.Web.Controls.GroupPanel();
    obdc.OnCreateHandle();
    obdc.OnCreateHandle = function () {

        DBFX.Resources.LoadResource("design/DesignerTemplates/FormDesignerTemplates/FileUploaderDesigner.scrp", function (od) {

            od.DataContext = obdc.dataContext;

            //设计器中绑定事件处理
            od.EventListBox = od.FormContext.Form.FormControls.EventListBox;
            od.EventListBox.ItemSource = [{EventName:"FileChoose",EventCode:undefined,Command:od.dataContext.FileChoose,Control:od.dataContext}];

        }, obdc);

    }

    //事件处理程序
    obdc.DataContextChanged = function (e) {
        obdc.DataBind(e);
        if (obdc.EventListBox != undefined) {
            obdc.EventListBox.ItemSource = [{EventName:"FileChoose",EventCode:undefined,Command:obdc.dataContext.FileChoose,Control:obdc.dataContext}];
        }
    }

    obdc.HorizonScrollbar = "hidden";
    obdc.OnCreateHandle();
    obdc.Class = "VDE_Design_ObjectGeneralDesigner";
    obdc.Text = "文件上传设置";
    return obdc;
}

DBFX.Web.Controls.FileUploaderRow = function () {
    var fur = new DBFX.Web.Controls.Control("FileUploaderRow");
    fur.FileUploader = undefined;
    fur.VisualElement = document.createElement('div');

    fur.OnCreateHandle();
    fur.OnCreateHandle = function () {
        fur.VisualElement.className = "FileUploaderRow";
        fur.VisualElement.innerHTML = "<span class='FileUploaderRow_Name'></span><span class='FileUploaderRow_Size'></span><span class='FileUploaderRow_MaxSize'></span>" +
          "<div class='FileUploaderRow_TipBox'><progress class='FileUploaderRow_Progress' max='100' value='0'></progress><span class='FileUploaderRow_TipText'>等待上传</span></div>" +
          "<span class='FileUploaderRow_Type'></span><img class='FileUploaderRow_Del' src='delete.png'></img>" +
          "<img class='FileUploaderRow_Upload' src='upload2.png'></img>";


        fur.Name = fur.VisualElement.querySelector('span.FileUploaderRow_Name');
        fur.Size = fur.VisualElement.querySelector('span.FileUploaderRow_Size');
        fur.Type = fur.VisualElement.querySelector('span.FileUploaderRow_Type');
        fur.DelBtn = fur.VisualElement.querySelector('img.FileUploaderRow_Del');
        fur.UploadBtn = fur.VisualElement.querySelector('img.FileUploaderRow_Upload');
        fur.Progress = fur.VisualElement.querySelector('progress.FileUploaderRow_Progress');

        //提示文字显示
        fur.TipSpan = fur.VisualElement.querySelector('span.FileUploaderRow_TipText');
        //超出最大文件限制提醒
        fur.MaxSizeTip = fur.VisualElement.querySelector('span.FileUploaderRow_MaxSize');

        fur.Name.onclick = function () {

        }

        fur.DelBtn.src = "themes/" + app.CurrentTheme + "/images/fileUploader/delete.png";
        fur.UploadBtn.src = "themes/" + app.CurrentTheme + "/images/fileUploader/upload2.png";
        // fur.UploadBtn.src = "upload2.png";
        // fur.DelBtn.src = "delete.png";

        //删除按钮点击
        fur.DelBtn.onclick = function (e) {
            fur.FileUploader && fur.FileUploader.OnDeleteClick(e, fur);
        }

        //上传按钮点击
        fur.UploadBtn.onclick = function (e) {
            if (fur.fileSize > fur.FileMaxSize) return;
            fur.FileUploader && fur.FileUploader.OnUploadClick(e, fur);
        }
    }

    //最大文件限制 默认3M
    fur.FileMaxSize = 1024 * 1024 * 3;

    //文件名称
    fur.fileName = "";
    Object.defineProperty(fur, "FileName", {
        get: function () { return fur.fileName; },
        set: function (v) {
            fur.fileName = v;
            fur.Name.innerText = v;
        }
    });
    //文件大小
    fur.fileSize = "";
    Object.defineProperty(fur, "FileSize", {
        get: function () { return fur.fileSize; },
        set: function (v) {
            fur.fileSize = v;
            fur.Size.style.color = (v > fur.FileMaxSize) ? "red" : "#333";
            fur.TipText = (v > fur.FileMaxSize) ? "文件大于" + fur.CalculateSize(fur.FileMaxSize) + "，不支持上传！" : "等待上传";
            fur.TipSpan.style.color = (v > fur.FileMaxSize) ? "red" : "";
            fur.Size.innerText = fur.CalculateSize(v);
        }
    });
    //文件类型
    fur.fileType = '';
    Object.defineProperty(fur, "FileType", {
        get: function () { return fur.fileType; },
        set: function (v) {
            fur.fileType = v;
            fur.Type.innerText = v;
        }
    });

    //进度条最大
    fur.maxValue = '';
    Object.defineProperty(fur, "MaxValue", {
        get: function () { return fur.maxValue; },
        set: function (v) {
            fur.maxValue = v;
            fur.Progress.setAttribute('max', v);
        }
    });


    //进度条当前值
    fur.curValue = "";
    Object.defineProperty(fur, "CurValue", {
        get: function () { return fur.curValue; },
        set: function (v) {
            fur.curValue = v;
            fur.Progress.setAttribute('value', v);
        }
    });

    //提示文字
    fur.tipText = "";
    Object.defineProperty(fur, "TipText", {
        get: function () { return fur.tipText; },
        set: function (v) {
            fur.tipText = v;
            fur.TipSpan.textContent = v;
        }
    });

    //提示标签显示控制
    fur.showTipText = true;
    Object.defineProperty(fur, "ShowTipText", {
        get: function () { return fur.showTipText; },
        set: function (v) {
            v = (v == true || v == "true");
            fur.showTipText = v;
            fur.TipSpan.style.display = v ? "inline-block" : "none";
        }
    });

    //文件上传状态 0-等待上传  1-上传成功 2-上传失败  3-文件超过最大限制，不允许上传；
    fur.uploadState = 0;
    Object.defineProperty(fur, "UploadState", {
        get: function () { return fur.uploadState; },
        set: function (v) {
            fur.uploadState = v;
            fur.SetStyle(v);
        }
    });

    //设置相应上传状态的样式
    fur.SetStyle = function(state){
        state = state*1;
        fur.VisualElement.setAttribute('uploadstate',''+state)
        switch (state) {
            case 0:
                fur.TipText = '等待上传';
                break;
            case 1:
                fur.TipText = '上传成功';
                fur.CurValue = 100;
                break;
            case 2:
                fur.TipText = '上传失败';
                break;
            case 3:
                fur.TipText = '文件过大';
                break;
        }

    }

    //TODO:计算文件大小 返回相应的显示
    fur.CalculateSize = function (size) {
        var s = size * 1;
        if (isNaN(s) || s < 0) return size;

        if (s >= 0 && s <= 1000) {
            return s + 'B';
        } else if (s > 1000 && s < Math.pow(1024, 2)) {
            return (s / (1024)).toFixed(2) + "KB";
        } else if (s >= Math.pow(1024, 2) && s < Math.pow(1024, 3)) {
            return (s / Math.pow(1024, 2)).toFixed(2) + "MB";
        } else if (s >= Math.pow(1024, 3) && s < Math.pow(1024, 4)) {
            return (s / Math.pow(1024, 3)).toFixed(2) + "G";
        } else if (s >= Math.pow(1024, 4) && s < Math.pow(1024, 5)) {
            return (s / Math.pow(1024, 4)).toFixed(2) + "T";
        }

    }


    fur.OnCreateHandle();
    return fur;
}

DBFX.Web.Controls.AudioPlayer = function () {

    var vp = new DBFX.Web.Controls.Control("AudioPlayer");
    vp.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.AudioPlayerDesigner");
    vp.ClassDescriptor.Serializer = "DBFX.Serializer.AudioPlayerSerializer";
    vp.VisualElement = document.createElement("DIV");
    //通过正则表达式判断是否为手机端运行
    vp.isPhone = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);
    vp.fullScreenEvents = ["fullscreenchange", "webkitfullscreenchange", "mozfullscreenchange", "MSFullscreenChange"];

    vp.OnCreateHandle();
    vp.OnCreateHandle = function () {
        vp.VisualElement.className = "AudioPlayer";
        vp.VisualElement.innerHTML = "<div class=\"AudioPlayer_Wrapper\">"+
          "<audio class='AudioPlayer_Audio'></audio>"+
          "</div>";
        vp.wrapper = vp.VisualElement.querySelector("div.AudioPlayer_Wrapper");
        vp.Audio = vp.VisualElement.querySelector("audio.AudioPlayer_Audio");

    }

    //是否自动播放 是/否
    vp.autoPlay = false;
    Object.defineProperty(vp, "AutoPlay", {
        get: function () {
            return vp.autoPlay;
        },
        set: function (v) {
            vp.autoPlay = (v==true || v=='true') ? true:false;
            vp.Audio.setAttribute('autoplay',vp.autoPlay);
        }
    });

    //是否显示播放组件（浏览器默认）
    vp.showControl = false;
    Object.defineProperty(vp, "ShowControl", {
        get: function () {
            return vp.showControl;
        },
        set: function (v) {
            vp.showControl = (v==true || v=='true') ? true:false;
            if(vp.showControl){
                vp.Audio.setAttribute('controls','controls');
            }else {
                vp.Audio.removeAttribute('controls');
            }
        }
    });


    //音频地址
    vp.audioUrl = "";
    Object.defineProperty(vp, "AudioUrl", {
        get: function () {
            return vp.audioUrl;
        },
        set: function (v) {
            vp.audioUrl = v;
            // vp.Audio.src = v;
            vp.Audio.setAttribute('src',v);
            vp.AutoPlay==true && vp.Play();
        }
    });

    //播放音频
    vp.PlayAudio = function(audioUrl){
        if(audioUrl){
            vp.AudioUrl = audioUrl;
            vp.Audio.pause();
            vp.Play();
        }
    }

    //播放
    vp.Play = function(){

        //获取麦克风权限
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            var audio = vp.Audio;
            navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
                //video.src = window.URL.createObjectURL(stream);
                // tts.audio.srcObject = stream;
                vp.Audio.play();
            });
        }
    }

    vp.OnCreateHandle();
    return vp;
}

DBFX.Serializer.AudioPlayerSerializer = function () {
    //系列化
    this.Serialize = function (c, xe, ns) {
        DBFX.Serializer.SerialProperty("AutoPlay", c.AutoPlay, xe);
        DBFX.Serializer.SerialProperty("ShowControl", c.ShowControl, xe);
        DBFX.Serializer.SerialProperty("AudioUrl", c.AudioUrl, xe);

    }

    //反系列化
    this.DeSerialize = function (c, xe, ns) {
        DBFX.Serializer.DeSerialProperty("AutoPlay", c, xe);
        DBFX.Serializer.DeSerialProperty("ShowControl", c, xe);
        DBFX.Serializer.DeSerialProperty("AudioUrl", c, xe);
    }
}

DBFX.Design.ControlDesigners.AudioPlayerDesigner = function () {
    var obdc = new DBFX.Web.Controls.GroupPanel();
    obdc.OnCreateHandle();
    obdc.OnCreateHandle = function () {
        DBFX.Resources.LoadResource("design/DesignerTemplates/FormDesignerTemplates/AudioPlayerDesigner.scrp", function (od) {

            od.DataContext = obdc.dataContext;

        }, obdc);
    }

    obdc.HorizonScrollbar = "hidden";
    obdc.OnCreateHandle();
    obdc.Class = "VDE_Design_ObjectGeneralDesigner";
    obdc.Text = "音频播放器设置";
    return obdc;
}

DBFX.Web.Controls.AudioPlayer.PlayAudio = function (audioSrc) {
    if(!(typeof audioSrc == 'string' && audioSrc.length > 0)) return {"message":'音频文件无效!',"State":0};

    if(audioSrc.indexOf('http') < 0){
        audioSrc = "Themes/" + app.CurrentTheme + "/Sounds/"+audioSrc+".aac";
    }
    var player = {};
    var audio = document.getElementById('SystemAudio');
    if(!audio){
        player.audio = document.createElement('audio');
        player.audio.setAttribute('id','SystemAudio');
    }else {
        player.audio = audio;
    }

    player.audio.onended = function (ev) {
        console.log('音频播放结束！');
        // document.body.removeChild(player.audio);
    };

    player.Play = function () {

        player.audio.play().then(function (value) {

        }).catch(function (reason) {
            console.log(reason);
            //获取麦克风权限？
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {

                navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
                    //video.src = window.URL.createObjectURL(stream);
                    // tts.audio.srcObject = stream;
                    player.audio.play();
                });
            }
        });

    }

    document.body.appendChild(player.audio);
    player.audio.setAttribute('src',audioSrc);
    player.Play();

}

//验证控件
DBFX.Web.Controls.VerificationControl = function () {

    var vc = new DBFX.Web.Controls.Control('VerificationControl');
    vc.ClassDescriptor.Serializer = "DBFX.Serializer.VerificationControlSerializer";
    vc.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.VerificationControlDesigner");
    vc.VisualElement = document.createElement("div");
    vc.OnCreateHandle();
    vc.OnCreateHandle = function () {
        vc.VisualElement.className = "VerificationControl";
        vc.VisualElement.innerHTML = '<div class="VC_Container"></div>';
        //容器
        vc.Container = vc.VisualElement.querySelector('div.VC_Container');

        vc.CreateCodeUI();
        //   vc.CreateSlideUI();
    }
    //验证模式：code-验证码（默认，四位验证码）   slide-滑动验证
    vc.mode = 'code';
    Object.defineProperty(vc,'Mode',{
        set:function (v) {
            vc.mode = v;
            switch (v) {
                case 'slide':
                    vc.CreateSlideUI();
                    break;
                case 'code':
                default:
                    vc.CreateCodeUI();
                    break;
            }
        },
        get:function () {
            return vc.mode;
        }
    });

    vc.width = '100px';
    vc.height = '40px';

    vc.Reset = function(){
        if(vc.Mode == 'slide'){
            vc.Success = false;
            vc.__value = false;
            vc.DragButton.style.left = 0;
            vc.DragBG.style.width = 0;
            vc.DragButton.style.transition = "left 1s ease";
            vc.DragBG.style.transition = "width 1s ease";
            vc.DragText.innerHTML = '请拖动滑块验证';
            vc.DragButton.innerHTML = '&gt;&gt;';
            vc.DragBox.removeAttribute('status');
            vc.DragButton.onmousedown = vc.DragButton.ontouchstart = vc.OnButtonClick;
        }
    }

    //创建code验证模式
    vc.CreateCodeUI = function(){
        vc.Container.innerHTML = '';
        vc.Container.className = 'VC_Container';
        vc.Container.innerHTML =
          '  <input type="text" value="" placeholder="请输入验证码（不区分大小写）" class="VC_Input">' +
          '  <canvas class="VC_Canvas" width="80" height="40"></canvas>' +
          '  <button class="VC_Button">提交</button>';


        //输入框
        vc.InputC = vc.VisualElement.querySelector('input.VC_Input');
        //  canvas
        vc.Canvas = vc.VisualElement.querySelector('canvas.VC_Canvas');
        //  提交按钮
        vc.SubBbutton = vc.VisualElement.querySelector('button.VC_Button');
        vc.DrawCode();

        vc.resizeObserver = new ResizeObserver(function (entries) {
            if(vc.DesignTime == true) return;
            var rect = getComputedStyle(vc.Container);
            vc.Canvas.setAttribute('width',parseFloat(rect.width));
            vc.Canvas.setAttribute('height',parseFloat(rect.height));
            vc.DrawCode();

        });

        vc.resizeObserver.observe(vc.Container);

        //canvas点击重新绘制验证码
        vc.Canvas.onclick = function (e) {
            e.cancelBubble = true;
            console.log('click');
            vc.DrawCode();
        }
    }

    //验证码字符串构成样式  default-大小写字母+数字；lowercase-小写字母；uppercase-大写字母；
    //number-数字；custom-自定义
    vc.CodeObj = {
        'default':'a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,1,2,3,4,5,6,7,8,9,0',
        'lowercase':'a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z',
        'uppercase':'A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z',
        'number':'1,2,3,4,5,6,7,8,9,0'
    };
    vc.codeMode = 'default';
    Object.defineProperty(vc,'CodeMode',{
        set:function (v) {
            vc.codeMode = v;
            vc.DrawCode();
        },
        get:function () {
            return vc.codeMode;
        }
    });

    vc.codeArray = undefined;
    Object.defineProperty(vc,'CodeArray',{
        set:function (v) {
            v = Array.isArray(v) && v.length>0 ? v : undefined;
            vc.codeArray = v;
            vc.DrawCode();
        },
        get:function () {
            return vc.codeArray;
        }
    });

    //验证码位数
    vc.codeLength = 4;
    Object.defineProperty(vc,'CodeLength',{
        set:function (v) {
            v = v*1>0 ? v*1 : 4;
            vc.codeLength = v;
            vc.DrawCode();
        },
        get:function () {
            return vc.codeLength;
        }
    });

    //canvas绘制验证码  默认为4位，可以添加属性设置生成的验证码位数；
    vc.DrawCode = function () {
        if(vc.Mode != 'code') return ;
        var canvas = vc.Canvas;
        var show_num = [];
        var canvas_width = canvas.width;
        var canvas_height = canvas.height;
        var context = canvas.getContext("2d");//获取到canvas画图的环境
        //验证码的位数  默认为4
        var codeLen = vc.CodeLength;
        var avg_w = canvas_width/codeLen;
        // canvas.width = canvas_width;
        // canvas.height = canvas_height;

        context.clearRect(0,0,canvas_width,canvas_height);
        var sCode =vc.CodeObj[vc.CodeMode];
        sCode = vc.CodeArray ? vc.CodeArray.toString(): (sCode ? sCode : vc.CodeObj.default);
        var aCode = sCode.split(",");
        var aLength = aCode.length;//获取到数组的长度

        for (var i = 0; i < codeLen; i++) { //这里的for循环可以控制验证码位数（如果想显示6位数，4改成6即可）
            var j = Math.floor(Math.random() * aLength);//获取到随机的索引值
            // var deg = Math.random() * 30 * Math.PI / 180;//产生0~30之间的随机弧度
            var deg = Math.random() - 0.5; //产生一个随机弧度
            var txt = aCode[j];//得到随机的一个内容

            show_num[i] = txt;

            var x = 10 + i * avg_w;//文字在canvas上的x坐标
            var y = canvas_height/2 + Math.random() * 8;//文字在canvas上的y坐标
            context.font = "bold 23px 微软雅黑";
            context.translate(x, y);
            context.rotate(deg);
            context.fillStyle = vc.RandomColor();
            context.fillText(txt, 0, 0);
            context.rotate(-deg);
            context.translate(-x, -y);
        }
        for (var i = 0; i <= 5; i++) { //验证码上显示线条
            context.strokeStyle = vc.RandomColor();
            context.beginPath();
            context.moveTo(Math.random() * canvas_width, Math.random() * canvas_height);
            context.lineTo(Math.random() * canvas_width, Math.random() * canvas_height);
            context.stroke();
        }
        for (var i = 0; i <= 30; i++) { //验证码上显示小点
            context.strokeStyle = vc.RandomColor();
            context.beginPath();
            var x = Math.random() * canvas_width;
            var y = Math.random() * canvas_height;
            context.moveTo(x, y);
            context.lineTo(x + 1, y + 1);
            context.stroke();
        }
        vc.__value = show_num.join('');
        return vc.__value;
    }

    vc.SetValue = function(v){
        // vc.__value = v;
    }

    vc.GetValue = function(){
        return vc.__value;
    }

    //生成随机颜色
    vc.RandomColor = function(){
        var r = Math.floor(Math.random() * 256);
        var g = Math.floor(Math.random() * 256);
        var b = Math.floor(Math.random() * 256);
        return "rgb(" + r + "," + g + "," + b + ")";
    }

    //创建滑动验证模式
    vc.CreateSlideUI = function() {
        if(vc.Mode != 'slide') return ;
        vc.__value = false;
        vc.Container.innerHTML = '';
        vc.Container.className = 'VC_DragContainer';
        vc.Container.innerHTML =
          '  <div class="VC_DragBG"></div>' +
          '  <div class="VC_DragText" onselectstart="return false;">请拖动滑块验证</div>' +
          '  <div class="VC_DragButton">&gt;&gt;</div>' ;
        //容器
        vc.DragBox = vc.VisualElement.querySelector('div.VC_DragContainer');
        //  背景
        vc.DragBG = vc.VisualElement.querySelector('div.VC_DragBG');
        //文本
        vc.DragText = vc.VisualElement.querySelector('div.VC_DragText');
        //  滑块
        vc.DragButton = vc.VisualElement.querySelector('div.VC_DragButton');

        vc.Success = false;
        //  滑块注册鼠标按下事件
        vc.OnButtonClick = function (e) {
            var slideFlag = true;
            console.log('start');
            //滑动成功的距离
            vc.SucDis = vc.DragBox.offsetWidth - vc.DragButton.offsetWidth;
            var btn = vc.DragButton;
            var bg = vc.DragBG;
            var text = vc.DragText;
            var distance = vc.SucDis;

            //1.鼠标按下之前必须清除掉后面设置的过渡属性
            btn.style.transition = "";
            bg.style.transition = "";
            //说明：clientX 事件属性会返回当事件被触发时，鼠标指针向对于浏览器页面(或客户区)的水平坐标。
            //2.当滑块位于初始位置时，得到鼠标按下时的水平位置
            var e = e.type == 'touchstart' ? e.touches[0] : e;
            var downX = e.clientX;

            //三、给文档注册鼠标移动事件
            document.body.onmousemove = document.body.ontouchmove = function (e) {

                if(slideFlag ==false) return;
                // console.log('move')
                var e = e.type == 'touchmove' ? e.touches[0] : e;
                //1.获取鼠标移动后的水平位置
                var moveX = e.clientX;
                //2.得到鼠标水平位置的偏移量（鼠标移动时的位置 - 鼠标按下时的位置）
                var offsetX = moveX - downX;
                //3.在这里判断一下：鼠标水平移动的距离 与 滑动成功的距离 之间的关系
                if (offsetX > distance) {
                    offsetX = distance;//如果滑过了终点，就将它停留在终点位置
                } else if (offsetX < 0) {
                    offsetX = 0;//如果滑到了起点的左侧，就将它重置为起点位置
                }
                //4.根据鼠标移动的距离来动态设置滑块的偏移量和背景颜色的宽度
                btn.style.left = offsetX + "px";
                bg.style.width = offsetX + "px";
                //如果鼠标的水平移动距离 = 滑动成功的宽度
                if (offsetX == distance) {
                    //1.设置滑动成功后的样式
                    vc.DragBox.setAttribute('status','1');
                    text.innerHTML = "验证通过";
                    // btn.innerHTML = "&radic;";
                    btn.innerHTML = "&#10003;";

                    //2.设置滑动成功后的状态
                    vc.Success = true;
                    //成功后，清除掉鼠标按下事件和移动事件（因为移动时并不会涉及到鼠标松开事件）
                    btn.onmousedown = btn.ontouchstart = null;
                    document.body.onmousemove = document.body.ontouchmove = null;
                    //3.成功解锁后的回调函数
                    setTimeout(function () {
                        console.log('验证成功！');
                        vc.__value = true;
                        if (vc.SlideToEnd != undefined) {
                            if (vc.SlideToEnd.GetType() == "Command") {
                                vc.SlideToEnd.Sender = vc;
                                vc.SlideToEnd.Execute();
                            }
                            else {
                                if (typeof vc.SlideToEnd == "function")
                                    vc.SlideToEnd(vc);
                            }
                        }

                    }, 100);
                }
            }
            vc.DragButton.onmouseout = null;
            //四、给文档注册鼠标松开事件
            document.body.onmouseup = document.body.ontouchend = document.body.ontouchcancel = function (e) {
                if(slideFlag == false)  return;
                slideFlag = false;

                //如果鼠标松开时，滑到了终点，则验证通过
                if (vc.Success) {
                    return;
                } else {
                    //反之，则将滑块复位（设置了1s的属性过渡效果）
                    btn.style.left = 0;
                    bg.style.width = 0;
                    btn.style.transition = "left 1s ease";
                    bg.style.transition = "width 1s ease";
                }
                //只要鼠标松开了，说明此时不需要拖动滑块了，那么就清除鼠标移动和松开事件。
                document.body.onmousemove = document.body.ontouchmove = null;
                document.body.onmouseup = document.body.ontouchend = null;
            }
        }
        vc.DragButton.onmousedown = vc.DragButton.ontouchstart = vc.OnButtonClick;
    }

    vc.OnCreateHandle();
    return vc;

}

//文本框系列化
DBFX.Serializer.VerificationControlSerializer = function () {

    //反系列化
    this.DeSerialize = function (c, xe, ns) {

        DBFX.Serializer.DeSerialProperty("Mode", c, xe);
        DBFX.Serializer.DeSerializeCommand("SlideToEnd", xe, c);

    }


    //系列化
    this.Serialize = function (c, xe, ns) {

        DBFX.Serializer.SerialProperty("Mode", c.Mode, xe);
        DBFX.Serializer.SerializeCommand("SlideToEnd", c.SlideToEnd, xe);

    }

}

DBFX.Design.ControlDesigners.VerificationControlDesigner = function () {
    var obdc = new DBFX.Web.Controls.GroupPanel();
    obdc.OnCreateHandle();
    obdc.OnCreateHandle = function () {

        DBFX.Resources.LoadResource("design/DesignerTemplates/FormDesignerTemplates/VerificationControlDesigner.scrp", function (od) {

            od.DataContext = obdc.dataContext;
            obdc.EventListBox = od.FormContext.Form.FormControls.EventListBox;
            obdc.EventListBox.ItemSource = [{ EventName: "SlideToEnd", EventCode: undefined, Command: od.dataContext.SlideToEnd, Control: od.dataContext },
            ];
        }, obdc);

    }

    obdc.DataContextChanged = function (e) {

        obdc.DataBind(e);

        if (obdc.EventListBox != undefined)
            obdc.EventListBox.ItemSource = [{ EventName: "SlideToEnd", EventCode: undefined, Command: obdc.dataContext.SlideToEnd, Control: obdc.dataContext },
            ];
    }

    obdc.HorizonScrollbar = "hidden";
    obdc.OnCreateHandle();
    obdc.Class = "VDE_Design_ObjectGeneralDesigner";
    obdc.Text = "验证控件设置";
    return obdc;
}


//代码查看器
DBFX.Web.Controls.CodeViewer = function () {

    var cv = new DBFX.Web.Controls.Control('CodeViewer');
    cv.ClassDescriptor.DisplayName = "代码查看器";
    cv.ClassDescriptor.Serializer = "DBFX.Serializer.CodeViewerSerializer";
    cv.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.CodeViewerDesigner");

    cv.VisualElement = document.createElement("DIV");
    cv.OnCreateHandle();
    cv.VisualElement.className = "CodeViewer";
    cv.OnCreateHandle = function () {
        cv.ClientDiv = cv.VisualElement;
        cv.VisualElement.innerHTML = "<pre class='LineNumbers'><code class='CodeViewer_Code'></code></pre>";

        cv.LineNumbers = cv.VisualElement.querySelector('pre.LineNumbers');
        cv.CodeElement = cv.VisualElement.querySelector('code.CodeViewer_Code');
    }
    //高亮显示配置
    cv.HighLightConfig = {
        'javascript':{
            contains:[
                //FIXME:注释   不能正确匹配单行注释，例如：https://  也会匹配成单行注释
                {'name':'comment','className':'comment',match:/(\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\/)|([\/\/].*)/g},
                //FIXME:预留关键字  注释里面的关键字也会匹配
                {'name':'keyword','className':'keyword',match:/(\b(break|continue|do|for|in|function|if|else|return|switch|throw|try|catch|finally|var|while|with|case|new|typeof|instance|delete|void|Object|Array|String|Number|Boolean|Function|RegExp|Date|Math|window|document|navigator|location|true|false|null|undefined|NaN)\b)/g},
                {'name':'string','className':'string',match:/(["'])(?:\\.|[^\\\n])*?\1/g},

            ],
        }
    }

    //处理需要显示的代码字符串 正则表达式匹配相应的高亮规则
    cv.MatchString = function(codeString,matchObj){
        //1、匹配注释
        var commentArr = codeString.match(matchObj.match);
        var temStr = codeString;
        var codeStr = '';
        commentArr.forEach(function (com) {
            var len = com.length;
            var index = temStr.indexOf(com);
            codeStr += temStr.substr(0,index) + '<span class='+matchObj.className+'>' + temStr.substr(index,len)+'</span>';
            temStr = temStr.substr(index+len);
        })
        codeStr += temStr;

        return codeStr;
    }

    //高亮代码处理
    cv._HighLight = function(language,codeString){

        var codeObj = {codeString:codeString};
        var matchObj = cv.HighLightConfig[language];
        var matchArr = matchObj['contains'];
        matchArr.forEach(function (match) {
            codeObj.codeString = cv.MatchString(codeObj.codeString,match);
        });
        return codeObj.codeString;
    }

    //创建代码行
    cv.CreateCodeContainer = function(jsCode){
        if(!jsCode) return;
        //获取换行符数量
        // var lineLength = jsCode.match(/\n/g).length;
        jsCode = jsCode.replace(/\r/g,'');
        var codeArr = jsCode.split('\n');
        var lineLength = codeArr.length;
        cv.LineLength = lineLength;
        console.log(lineLength);
        //创建代码行
        var codeContainer = document.createDocumentFragment();
        codeArr.forEach(function (code,index) {
            var codeDiv = document.createElement('div');
            codeDiv.className = 'CodeLine';
            codeDiv.innerHTML = code;
            codeContainer.appendChild(codeDiv);
        })
        // return codeContainer;
        cv.CodeElement.appendChild(codeContainer);
    }

    //创建行号容器
    cv.CreateLineContainer = function(lineLength){
        //行号容器
        var shifter = document.createElement('span');
        //行号容器
        var lineRowsC = '<span aria-hidden="true" class="LineNumbersRows">';
        for (var i = 0; i < lineLength; i++) {
            lineRowsC += '<span></span>';
        }
        lineRowsC  = lineRowsC + '</span>';
        shifter.innerHTML = lineRowsC;
        // return shifter;
        cv.CodeElement.appendChild(shifter);
    }

    //设置值-显示的代码字符串
    cv.SetValue = function(v){
        if(v==undefined || typeof v != "string") return;
        console.time();
        //   //处理代码字符串
        //   v = cv._HighLight('javascript',v);
        //
        //   //创建代码行
        //   var container = cv.CreateCodeContainer(v);
        // //  创建行号容器
        //   var shifter = cv.CreateLineContainer(cv.LineLength);

        v = cv.PrettifyJSCode(v);
        if(!v) return;
        cv.CreateCodeContainer(v);
        cv.CreateLineContainer(cv.LineLength);
        console.timeEnd();
    }


    //绑定数据
    Object.defineProperty(cv,'BindingValue',{
        set:function(v) {
            cv.bindingValue = v;
            if(v != undefined && cv.dataContext != undefined){
                var values = 'cv.Value = cv.dataContext.'+ v;
                eval(values);
            }
        },
        get:function ()
        {
            return cv.bindingValue;
        }

    });

    //重写数据绑定
    cv.DataBind = function(v){
        cv.BindingValue = cv.BindingValue;
    }

    //处理HTML格式字符串
    cv.HTMLEncode = function(str){
        var i, s = {
            //"&amp;": /&/g,
            "&quot;": /"/g,
            "&#039;": /'/g,
            "&lt;": /</g,
            "&gt;": />/g,
            // "<br>": /\n/g,
            // "&nbsp;": / /g,
            // "&nbsp;&nbsp;": /\t/g
        };
        for (i in s) {
            //判断是否为
            s[i].test && typeof str == "string" && (str = str.replace(s[i], i));
        }
        return str;
    }


    //修饰显示Javascript代码
    cv.PrettifyJSCode = function(jsCode){
        if(!jsCode) return;
        var _re_js = new RegExp('(\\/\\/.*|\\/\\*[\\s\\S]*?\\*\\/)|("(?:[^"\\\\]|\\\\[\\s\\S])*"|\'(?:[^\'\\\\]|\\\\[\\s\\S])*\')|\\b(true|false|null|undefined|NaN)\\b|\\b(var|for|if|else|return|this|while|new|function|switch|case|typeof|do|in|throw|try|catch|finally|with|instance|delete|void|break|continue)\\b|\\b(document|Date|Math|window|Object|location|navigator|Array|String|Number|Boolean|Function|RegExp|console|JSON)\\b|(?:[^\\W\\d]|\\$)[\\$\\w]*|(0[xX][0-9a-fA-F]+|\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?|\\.\\d+(?:[eE][+-]?\\d+)?)|(?:^|[^\\)\\]\\}])(\\/(?!\\*)(?:\\\\.|[^\\\\\\/\\n])+?\\/[gim]*)|[\\s\\S]', 'g');
        var code = jsCode.replace(/\r\n|[\r\n]/g, "\n").replace(/^\s+|\s+$/g, "");
        code = code.replace(_re_js, function() {
            var s, a = arguments;
            for (var i = 1; i <= 7; i++) {
                if (s = a[i]) {
                    s = cv.HTMLEncode(s);
                    switch (i) {
                        case 1: //注释 com
                            return '<span class="com">' + s + '</span>';
                        case 2: //字符串 str
                            return '<span class="str">' + s + '</span>';
                        case 3: //true|false|null|undefined|NaN val
                            return '<span class="val">' + s + '</span>';
                        case 4: //关键词 kwd
                            return '<span class="kwd">' + s + '</span>';
                        case 5: //内置对象 obj
                            return '<span class="obj">' + s + '</span>';
                        case 6: //数字 num
                            return '<span class="num">' + s + '</span>';
                        case 7: //正则 reg
                            return cv.HTMLEncode(a[0]).replace(s, '<span class="reg">' + s + '</span>');
                    }
                }
            }


            return cv.HTMLEncode(a[0]);
        });
        code = code.replace(/(?:\s*\*\s*|(?:&nbsp;)*\*(?:&nbsp;)*)(@\w+)\b/g, '&nbsp;*&nbsp;<span class="comkey">$1</span>') // 匹配注释中的标记
          .replace(/(\w+)(\s*\(|(?:&nbsp;)*\()|(\w+)(\s*=\s*function|(?:&nbsp;)*=(?:&nbsp;)*function)/g, '<span class="func">$1</span>$2') // 匹配函数
        return code;
    }


    cv.OnCreateHandle();
    return cv;

}
DBFX.Web.Controls.CodeViewer = function () {

    var cv = new DBFX.Web.Controls.Control('CodeViewer');
    cv.ClassDescriptor.DisplayName = "代码查看器";
    cv.ClassDescriptor.Serializer = "DBFX.Serializer.CodeViewerSerializer";
    cv.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.CodeViewerDesigner");

    cv.VisualElement = document.createElement("DIV");
    cv.OnCreateHandle();
    cv.VisualElement.className = "CodeViewer";
    cv.OnCreateHandle = function () {
        cv.ClientDiv = cv.VisualElement;
        cv.VisualElement.innerHTML = "<pre class='LineNumbers'><code class='CodeViewer_Code'></code></pre>";

        cv.LineNumbers = cv.VisualElement.querySelector('pre.LineNumbers');
        cv.CodeElement = cv.VisualElement.querySelector('code.CodeViewer_Code');
    }
    //高亮显示配置
    cv.HighLightConfig = {
        'javascript':{
            contains:[
                //FIXME:注释   不能正确匹配单行注释，例如：https://  也会匹配成单行注释
                {'name':'comment','className':'comment',match:/(\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\/)|([\/\/].*)/g},
                //FIXME:预留关键字  注释里面的关键字也会匹配
                {'name':'keyword','className':'keyword',match:/(\b(break|continue|do|for|in|function|if|else|return|switch|throw|try|catch|finally|var|while|with|case|new|typeof|instance|delete|void|Object|Array|String|Number|Boolean|Function|RegExp|Date|Math|window|document|navigator|location|true|false|null|undefined|NaN)\b)/g},
                {'name':'string','className':'string',match:/(["'])(?:\\.|[^\\\n])*?\1/g},

            ],
        }
    }

    //处理需要显示的代码字符串 正则表达式匹配相应的高亮规则
    cv.MatchString = function(codeString,matchObj){
        //1、匹配注释
        var commentArr = codeString.match(matchObj.match);
        var temStr = codeString;
        var codeStr = '';
        commentArr.forEach(function (com) {
            var len = com.length;
            var index = temStr.indexOf(com);
            codeStr += temStr.substr(0,index) + '<span class='+matchObj.className+'>' + temStr.substr(index,len)+'</span>';
            temStr = temStr.substr(index+len);
        })
        codeStr += temStr;

        return codeStr;
    }

    //高亮代码处理
    cv._HighLight = function(language,codeString){

        var codeObj = {codeString:codeString};
        var matchObj = cv.HighLightConfig[language];
        var matchArr = matchObj['contains'];
        matchArr.forEach(function (match) {
            codeObj.codeString = cv.MatchString(codeObj.codeString,match);
        });
        return codeObj.codeString;
    }

    //创建代码行
    cv.CreateCodeContainer = function(jsCode){
        if(!jsCode) return;
        //获取换行符数量
        // var lineLength = jsCode.match(/\n/g).length;
        jsCode = jsCode.replace(/\r/g,'');
        var codeArr = jsCode.split('\n');
        var lineLength = codeArr.length;
        cv.LineLength = lineLength;
        console.log(lineLength);
        //创建代码行
        var codeContainer = document.createDocumentFragment();
        codeArr.forEach(function (code,index) {
            var codeDiv = document.createElement('div');
            codeDiv.className = 'CodeLine';
            codeDiv.innerHTML = code;
            codeContainer.appendChild(codeDiv);
        })
        // return codeContainer;
        cv.CodeElement.appendChild(codeContainer);
    }

    //创建行号容器
    cv.CreateLineContainer = function(lineLength){
        //行号容器
        var shifter = document.createElement('span');
        //行号容器
        var lineRowsC = '<span aria-hidden="true" class="LineNumbersRows">';
        for (var i = 0; i < lineLength; i++) {
            lineRowsC += '<span></span>';
        }
        lineRowsC  = lineRowsC + '</span>';
        shifter.innerHTML = lineRowsC;
        // return shifter;
        cv.CodeElement.appendChild(shifter);
    }

    //设置值-显示的代码字符串
    cv.SetValue = function(v){
        if(v==undefined || typeof v != "string") return;
        console.time();
        //   //处理代码字符串
        //   v = cv._HighLight('javascript',v);
        //
        //   //创建代码行
        //   var container = cv.CreateCodeContainer(v);
        // //  创建行号容器
        //   var shifter = cv.CreateLineContainer(cv.LineLength);

        v = cv.PrettifyJSCode(v);
        if(!v) return;
        cv.CreateCodeContainer(v);
        cv.CreateLineContainer(cv.LineLength);
        console.timeEnd();
    }


    //绑定数据
    Object.defineProperty(cv,'BindingValue',{
        set:function(v) {
            cv.bindingValue = v;
            if(v != undefined && cv.dataContext != undefined){
                var values = 'cv.Value = cv.dataContext.'+ v;
                eval(values);
            }
        },
        get:function ()
        {
            return cv.bindingValue;
        }

    });

    //重写数据绑定
    cv.DataBind = function(v){
        cv.BindingValue = cv.BindingValue;
    }

    //处理HTML格式字符串
    cv.HTMLEncode = function(str){
        var i, s = {
            //"&amp;": /&/g,
            "&quot;": /"/g,
            "&#039;": /'/g,
            "&lt;": /</g,
            "&gt;": />/g,
            // "<br>": /\n/g,
            // "&nbsp;": / /g,
            // "&nbsp;&nbsp;": /\t/g
        };
        for (i in s) {
            //判断是否为
            s[i].test && typeof str == "string" && (str = str.replace(s[i], i));
        }
        return str;
    }


    //修饰显示Javascript代码
    cv.PrettifyJSCode = function(jsCode){
        if(!jsCode) return;
        var _re_js = new RegExp('(\\/\\/.*|\\/\\*[\\s\\S]*?\\*\\/)|("(?:[^"\\\\]|\\\\[\\s\\S])*"|\'(?:[^\'\\\\]|\\\\[\\s\\S])*\')|\\b(true|false|null|undefined|NaN)\\b|\\b(var|for|if|else|return|this|while|new|function|switch|case|typeof|do|in|throw|try|catch|finally|with|instance|delete|void|break|continue)\\b|\\b(document|Date|Math|window|Object|location|navigator|Array|String|Number|Boolean|Function|RegExp|console|JSON)\\b|(?:[^\\W\\d]|\\$)[\\$\\w]*|(0[xX][0-9a-fA-F]+|\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?|\\.\\d+(?:[eE][+-]?\\d+)?)|(?:^|[^\\)\\]\\}])(\\/(?!\\*)(?:\\\\.|[^\\\\\\/\\n])+?\\/[gim]*)|[\\s\\S]', 'g');
        var code = jsCode.replace(/\r\n|[\r\n]/g, "\n").replace(/^\s+|\s+$/g, "");
        code = code.replace(_re_js, function() {
            var s, a = arguments;
            for (var i = 1; i <= 7; i++) {
                if (s = a[i]) {
                    s = cv.HTMLEncode(s);
                    switch (i) {
                        case 1: //注释 com
                            return '<span class="com">' + s + '</span>';
                        case 2: //字符串 str
                            return '<span class="str">' + s + '</span>';
                        case 3: //true|false|null|undefined|NaN val
                            return '<span class="val">' + s + '</span>';
                        case 4: //关键词 kwd
                            return '<span class="kwd">' + s + '</span>';
                        case 5: //内置对象 obj
                            return '<span class="obj">' + s + '</span>';
                        case 6: //数字 num
                            return '<span class="num">' + s + '</span>';
                        case 7: //正则 reg
                            return cv.HTMLEncode(a[0]).replace(s, '<span class="reg">' + s + '</span>');
                    }
                }
            }


            return cv.HTMLEncode(a[0]);
        });
        code = code.replace(/(?:\s*\*\s*|(?:&nbsp;)*\*(?:&nbsp;)*)(@\w+)\b/g, '&nbsp;*&nbsp;<span class="comkey">$1</span>') // 匹配注释中的标记
          .replace(/(\w+)(\s*\(|(?:&nbsp;)*\()|(\w+)(\s*=\s*function|(?:&nbsp;)*=(?:&nbsp;)*function)/g, '<span class="func">$1</span>$2') // 匹配函数
        return code;
    }


    cv.OnCreateHandle();
    return cv;

}
DBFX.Serializer.CodeViewerSerializer = function () {
    //反系列化
    this.DeSerialize = function (c, xe, ns) {

        DBFX.Serializer.DeSerialProperty("BindingValue", c, xe);

        // DBFX.Serializer.DeSerializeCommand("ItemChecked", xe, c);

    }

    //系列化
    this.Serialize = function (c, xe, ns) {

        DBFX.Serializer.SerialProperty("BindingValue", c.BindingValue, xe);
        // DBFX.Serializer.SerializeCommand("ItemChecked", c.ItemChecked, xe);

    }

}
DBFX.Design.ControlDesigners.CodeViewerDesigner = function () {

    var obdc = new DBFX.Web.Controls.GroupPanel();
    obdc.OnCreateHandle();
    obdc.OnCreateHandle = function () {

        DBFX.Resources.LoadResource("design/DesignerTemplates/FormDesignerTemplates/CodeViewerDesigner.scrp", function (od) {
            od.DataContext = obdc.dataContext;
            // obdc.EventListBox = od.FormContext.Form.FormControls.EventListBox;
            // obdc.EventListBox.ItemSource = [{ EventName: "ItemChecked", EventCode: undefined, Command: od.dataContext.ItemChecked, Control: od.dataContext }];
            //
        }, obdc);
    }

    obdc.DataContextChanged = function (e) {

        obdc.DataBind(e);

        // if (obdc.EventListBox != undefined)
        // obdc.EventListBox.ItemSource = [{ EventName: "ItemChecked", EventCode: undefined, Command: obdc.dataContext.ItemChecked, Control: obdc.dataContext }];


    }

    obdc.HorizonScrollbar = "hidden";
    obdc.OnCreateHandle();
    obdc.Class = "VDE_Design_ObjectGeneralDesigner";
    obdc.Text = "代码查看器设置";
    return obdc;
}

//滑块输入控件
DBFX.Web.Controls.RangeInput = function () {

    var ri = new DBFX.Web.Controls.Control('RangeInput');
    ri.ClassDescriptor.DisplayName = "Range输入控件";
    ri.ClassDescriptor.Description = "为UI提供基础实现";
    ri.ClassDescriptor.Serializer = "DBFX.Serializer.RangeInputSerializer";
    ri.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.RangeInputDesigner");

    ri.VisualElement = document.createElement("DIV");
    ri.OnCreateHandle();
    ri.VisualElement.className = "RangeInput";
    ri.OnCreateHandle = function () {
        ri.ClientDiv = ri.VisualElement;
        ri.VisualElement.innerHTML = "<DIV class=\"RangeInputDiv\"><span  class=\"RangeInput_MinSpan\"></span><INPUT type=\"range\" class=\"RangeInput_Range\" /><SPAN class=\"RangeInput_MaxSpan\"></SPAN></DIV>";
        ri.RangeInput = ri.VisualElement.querySelector("INPUT.RangeInput_Range");
        ri.MinSpan = ri.VisualElement.querySelector("SPAN.RangeInput_MinSpan");
        ri.MaxSpan = ri.VisualElement.querySelector("SPAN.RangeInput_MaxSpan");

        ri.RangeInput.onchange = ri.OnValueChanged;
        ri.RangeInput.oninput = ri.OnInputChange;
    }
    //设置快捷键
    ri.SetAccessKey = function (v) {
        ri.RangeInput.accessKey = v;
    }

    //设置Tab键序
    ri.SetTabIndex = function (v) {
        ri.RangeInput.tabIndex = v;
    }

    ri.OnInputChange = function(e){

        if (ri.InputChange != undefined && ri.value != ri.RangeInput.value) {

            ri.value = ri.RangeInput.value;
            if (ri.InputChange.GetType != undefined && ri.InputChange.GetType() == "Command") {
                ri.InputChange.Sender = ri;
                ri.InputChange.Execute();
            }
            else
                ri.InputChange(ri, ri.value);
        }
    }

    ri.value = "";
    ri.OnValueChanged = function (e) {
        console.log(ri.RangeInput.value);
        if (ri.dataBindings != undefined && ri.dataContext != undefined && ri.dataBindings.Path != "") {
            var cmdline = "ri.dataContext." + ri.dataBindings.Path + "=ri.RangeInput.value;";
            eval(cmdline);
        }
        ri.RegisterFormContext();
        ri.value = ri.RangeInput.value;
    }

    ri.RegisterFormContext = function (m) {
        if (ri.FormContext != null && ri.dataProperty != "" && ri.dataProperty != undefined) {
            if (ri.dataDomain != undefined && ri.dataDomain != "") {

                var ddv = ri.FormContext[ri.dataDomain];
                if (ddv == undefined)
                    ri.FormContext[ri.dataDomain] = new DBFX.DataDomain();
                ri.FormContext[ri.dataDomain][ri.dataProperty] = ri.RangeInput.value;
            }
            else {
                ri.FormContext[ri.dataProperty] = ri.RangeInput.value;
            }
        }

        if (ri.ValueChanged != undefined && m == undefined) {

            ri.value = ri.RangeInput.value;
            if (ri.ValueChanged.GetType != undefined && ri.ValueChanged.GetType() == "Command") {
                ri.ValueChanged.Sender = ri;
                ri.ValueChanged.Execute();
            }
            else
                ri.ValueChanged(ri, ri.value);
        }

    }

    ri.SetValue = function (v) {

        if (v === ri.RangeInput.value)
            return;

        if (v != undefined && v != null) {
            ri.RangeInput.value = v;
        }
        else {
            ri.RangeInput.value = "";
            v = "";
        }

        ri.OnValueChanged(v);
        ri.value = v;
    }

    ri.GetValue = function () {
        return ri.RangeInput.value;
    }

    ri.BaseSetEnabled = ri.SetEnabled;
    ri.SetEnabled = function (v) {
        ri.BaseSetEnabled(v);
        if (v == false || v == "false") {
            ri.RangeInput.disabled = "disabled";
            ri.ReadOnly = true;
        }
        else {
            ri.RangeInput.disabled = "";
            ri.ReadOnly = false;
        }
    }


    ri.readonly = false;
    Object.defineProperty(ri, "ReadOnly", {
        get: function () {
            return ri.readonly;
        },
        set: function (v) {

            ri.readonly = v;
            if (v != null && v != undefined && (v == true || v == "true"))
                ri.readonly = true;
            else
                ri.readonly = false;

            ri.RangeInput.readOnly = ri.readonly;
        }
    });

    //设置数据属性
    ri.SetDataProperty = function (v) {

        ri.RegisterFormContext();

    }

    //获取焦点
    ri.SetFocus = function () {
        ri.RangeInput.focus();

    }

    ri.SetBlur = function () {
        ri.RangeInput.blur();
    }

    //设置范围和增量值
    ri.minValue = '';
    Object.defineProperty(ri,'MinValue',{
        get:function () {
            return ri.minValue;
        },
        set:function (v) {
            v = v*1 ? v*1 : 0;
            ri.minValue = v;
            ri.RangeInput.setAttribute('min',v);
            ri.MinSpan.innerText = v;
        }
    });

    ri.maxValue = '';
    Object.defineProperty(ri,'MaxValue',{
        get:function () {
            return ri.maxValue;
        },
        set:function (v) {
            v = v*1 ? v*1 : 0;
            ri.maxValue = v;
            ri.RangeInput.setAttribute('max',v);
            ri.MaxSpan.innerText = v;
        }
    });

    ri.stepValue = '';
    Object.defineProperty(ri,'StepValue',{
        get:function () {
            return ri.stepValue;
        },
        set:function (v) {
            // v = v*1 ? v*1 : 1;
            ri.stepValue = v;
            ri.RangeInput.setAttribute('step',v)
        }
    });

    //是否显示最大最小值
    ri.showMinMax = true;
    Object.defineProperty(ri, "ShowMinMax", {
        get: function () {
            return ri.showMinMax;
        },
        set: function (v) {

            ri.showMinMax = v == true || v == "true" ? true : false;

            ri.MinSpan.style.display = v ? '' : 'none';
            ri.MaxSpan.style.display = v ? '' : 'none';
        }
    });

    ri.OnCreateHandle();
    return ri;
}
DBFX.Serializer.RangeInputSerializer = function () {

    //反系列化
    this.DeSerialize = function (c, xe, ns) {

        DBFX.Serializer.DeSerialProperty("MinValue", c, xe);
        DBFX.Serializer.DeSerialProperty("MaxValue", c, xe);
        DBFX.Serializer.DeSerialProperty("ReadOnly", c, xe);
        DBFX.Serializer.DeSerialProperty("StepValue", c, xe);

        DBFX.Serializer.DeSerializeCommand("ValueChanged", xe, c);
        DBFX.Serializer.DeSerializeCommand("InputChange", xe, c);
    }


    //系列化
    this.Serialize = function (c, xe, ns) {

        DBFX.Serializer.SerialProperty("MinValue", c.MinValue, xe);
        DBFX.Serializer.SerialProperty("MaxValue", c.MaxValue, xe);
        DBFX.Serializer.SerialProperty("ReadOnly", c.ReadOnly, xe);
        DBFX.Serializer.SerialProperty("StepValue", c.StepValue, xe);

        DBFX.Serializer.SerializeCommand("ValueChanged", c.ValueChanged, xe);
        DBFX.Serializer.SerializeCommand("InputChange", c.InputChange, xe);
    }

}
DBFX.Design.ControlDesigners.RangeInputDesigner = function () {
    var obdc = new DBFX.Web.Controls.GroupPanel();
    obdc.OnCreateHandle();
    obdc.OnCreateHandle = function () {

        DBFX.Resources.LoadResource("design/DesignerTemplates/FormDesignerTemplates/RangeInputDesigner.scrp", function (od) {

            od.DataContext = obdc.dataContext;
            od.EventListBox = od.FormContext.Form.FormControls.EventListBox;
            od.EventListBox.ItemSource = [{ EventName: "ValueChanged", EventCode: undefined, Command: od.dataContext.ValueChanged, Control: od.dataContext },
                { EventName: "InputChange", EventCode: undefined, Command: od.dataContext.InputChange, Control: od.dataContext },
            ];

        }, obdc);

    }

    //20191014  实现数据绑定方法
    obdc.BaseDataBind = obdc.DataBind;
    obdc.DataBind = function (v) {
        if (obdc.dataContext.DataBindings == undefined)
            obdc.dataContext.DataBindings = { Path: "", Format: "", Mode: "TwoWay" };
        obdc.BaseDataBind(v);
    }

    obdc.DataContextChanged = function (e) {

        obdc.DataBind(e);

        if (obdc.EventListBox != undefined)
            obdc.EventListBox.ItemSource = [{ EventName: "ValueChanged", EventCode: undefined, Command: obdc.dataContext.ValueChanged, Control: obdc.dataContext },
                { EventName: "InputChange", EventCode: undefined, Command: obdc.dataContext.InputChange, Control: obdc.dataContext },
            ];

    }

    obdc.HorizonScrollbar = "hidden";
    obdc.OnCreateHandle();
    obdc.Class = "VDE_Design_ObjectGeneralDesigner";
    obdc.Text = "数值滑块输入设置";
    return obdc;
}
