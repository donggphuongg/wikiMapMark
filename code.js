const btt_resetabove_click = () => {
    document.getElementById("txt_lv4name").value = '';
    document.getElementById("txt_lv6name").value = '';
    document.getElementById("txt_mapwidth").value = '450';
    document.getElementById("txt_imagewidth").value = '';
    document.getElementById("txt_imagename").value = '';
}
var isubitem = 0;
var ctp_index = 0;
const btt_addsubitem_click = () => {
    var subitem_list = document.getElementById("subitem_list");
    isubitem++;
    // Index
    var lbl_stt = document.createElement("span");
    lbl_stt.style = "width: 100px;";
    lbl_stt.innerText = isubitem.toString().padStart(2,"0") + ". ";
    subitem_list.appendChild(lbl_stt);
    // Combobox type
    var cbb_itype = document.createElement("select");
    cbb_itype.id = "cbb_itype" + isubitem;
    cbb_itype.style = "width: 50px;";
    cbb_itype.addEventListener("change", cbb_itype_onchange);
    for(i=0;i<4;i++) {
        var opt_type = document.createElement("option");
        opt_type.value = i;
        opt_type.innerText = i;
        cbb_itype.appendChild(opt_type);
    }
    cbb_itype.value = ctp_index;
    subitem_list.appendChild(cbb_itype);
    // Textbox name
    var txt_iname = document.createElement("input");
    txt_iname.type = "text";
    txt_iname.id = "txt_iname" + isubitem;
    txt_iname.style = "width: 150px;";
    subitem_list.appendChild(txt_iname);
    // Textbox x-image
    var nmb_iximg = document.createElement("input");
    nmb_iximg.type = "number";
    nmb_iximg.id = "txt_iximg" + isubitem;
    nmb_iximg.style = "width: 80px;";
    nmb_iximg.min = "0";
    subitem_list.appendChild(nmb_iximg);
    // Textbox y-image
    var nmb_iyimg = document.createElement("input");
    nmb_iyimg.type = "number";
    nmb_iyimg.id = "txt_iyimg" + isubitem;
    nmb_iyimg.style = "width: 80px;";
    nmb_iyimg.min = "0";
    subitem_list.appendChild(nmb_iyimg);
    subitem_list.appendChild(document.createElement("br"));
}
const cbb_itype_onchange = () => {
    ctp_index = document.getElementById("cbb_itype" + isubitem).value;
}
var arrWikilink = [];
const btt_generate_click = () => {
    var tWikilink = document.getElementById("txt_wikilink").value;
    var tickOpen = 0, tickClose = 0,  tickSep = 0;
    arrWikilink = [];
    for(var i=0;i<tWikilink.length - 1;i++) {
        if(tWikilink.substr(i,2) == "[[") tickOpen = i;
        if(tWikilink.substr(i,1) == "|") tickSep = i;
        if(tWikilink.substr(i,2) == "]]") {
            tickClose = i;
            if(tickSep != -1) {
                arrWikilink.push(new Array(tWikilink.substr(tickOpen + 2, tickSep - tickOpen -2),
                tWikilink.substr(tickSep + 1, tickClose - tickSep - 1)));
            }
            else {
                arrWikilink.push(new Array(tWikilink.substr(tickOpen + 2, tickClose - tickOpen - 2),
                tWikilink.substr(tickOpen + 2, tickClose - tickOpen - 2)));
            }
            tickSep = -1;
        }
    }
    var tWikicode = "";
    tWikicode += "{|style=\"border:1px #aaa solid;background:#f8f9fa;\"\n|\n<center>\n";
    tWikicode += "{{Location mark+\n";
    tWikicode += "| width=" + document.getElementById("txt_mapwidth").value + "\n";
    tWikicode += "| image=" + document.getElementById("txt_imagename").value + "_admin_map.jpg" + '\n';
    var objlvname;
    if(document.getElementById("txt_lv6name").value == "") {
        objlvname = document.getElementById("sl_lv4type").value + " " +
        document.getElementById("txt_lv4name").value;
    }
    else {
        objlvname = document.getElementById("sl_lv6type").value + " " +
        document.getElementById("txt_lv6name").value + " " + 
        document.getElementById("sl_lv4type").value + " " +
        document.getElementById("txt_lv4name").value;
    }
    tWikicode += "| caption=Bản đồ hành chính " + objlvname + "\n";
    tWikicode += "| type=\n| float=none" + '\n' + "| marks=\n";
    for(var i=1; i<isubitem+1; i++) {
        if(document.getElementById("txt_iname" + i.toString()).value != "") {
            var itype, iname, ilink, iximg, iyimg, ixmap, iymap;
            itype= document.getElementById("cbb_itype" + i.toString()).value;
            iname = document.getElementById("txt_iname" + i.toString()).value;
            iximg = document.getElementById("txt_iximg" + i.toString()).value;
            iximg = (iximg == "") ? 0 : iximg;
            iyimg = document.getElementById("txt_iyimg" + i.toString()).value;
            iyimg = (iyimg == "") ? 0 : iyimg;
            ilink = "";
            var lv6name = document.getElementById("txt_lv6name").value;
            var lv4type = document.getElementById("sl_lv4type").value;
            for(var j=0; j<arrWikilink.length; j++) {
                if(arrWikilink[j][1] == iname) {
                    ilink = arrWikilink[j][0];
                    arrWikilink[j][1]="!!!";
                    break;
                }
            }
            var imgWidth = document.getElementById("txt_imagewidth").value;
            ixmap = Math.round(iximg * 1000 / imgWidth);
            iymap = Math.round(iyimg * 1000 / imgWidth + 30);
            tWikicode += "{{Location mark~\n";
            var iTick = "";
            if(itype == 1) {
                iTick = "'''";
                if(lv6name == "") {
                    if(lv4type == "tỉnh") iname = "TP. " + iname;
                    else iname = "Q. " + iname;
                }
                else iname = "P. " + iname;
            }
            else if(itype == 2) {
                iTick = "'''''";
                if(lv6name == "") iname = "TX. " + iname;
                else iname = "TT. " + iname;
            }
            else if(itype == 3) {
                iTick = "''";
                if(lv6name == "") iname = "H. " + iname;
                else iname = "X. " + iname;
            }
            tWikicode += "| label=" + iTick;
            if(ilink == "") tWikicode += iname;
            else if(ilink == iname) tWikicode += "{{colored link|black|" + iname + "}}";
            else tWikicode += "colored link|black|" + ilink + "|" + iname + "}}";
            tWikicode += iTick + "\n";
            tWikicode += "|position=top\n";
            tWikicode += "|width=" + document.getElementById("txt_mapwidth").value + "\n";
            tWikicode += "| mark=Blanksvg.svg\n";
            tWikicode += "| x=" + ixmap.toString();
            tWikicode += " | y=" + iymap.toString() + " }}\n";
        }
    }
    tWikicode += "}}\n";
    objlvname = "";
    if(document.getElementById("txt_lv6name").value == "") {
        objlvname = document.getElementById("sl_lv4type").value + " " +
        document.getElementById("txt_lv4name").value;
    }
    else {
        objlvname = document.getElementById("sl_lv6type").value + " " +
        document.getElementById("txt_lv6name").value + " " + 
        document.getElementById("sl_lv4type").value + " {{colored link|black|" +
        document.getElementById("txt_lv4name").value + "}}";
    }
    tWikicode += "{{resize|Bản đồ hành chính " + objlvname + "}}\n";
    tWikicode += "</center>\n|}";
    document.getElementById("wiki_code").innerText = tWikicode;
}
const btt_reset_click = () => {
    isubitem = 0;
    document.getElementById("subitem_list").innerText = "";
}