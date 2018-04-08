"use strict";

class eink {



    constructor(filepath) {
        this.screenWriter = "./e-ink/screen_writer.py";
        this.spawn = require('child_process');
        this.fs = require("fs");
        this.menu = {};
        this.parseMenuFile(filepath);
    }

    alert(message) {
        var screenContent = ["Message", "", message, "", "", "-      OK", 0, 0, 0, 0, 0, 0];
        this.writeToScreen(screenContent);
    }

    writeToScreen(options) {
        //scriptnamen hinzufügen
        options.unshift(this.screenWriter);
        console.log("Writing to screen");
        this.spawn.spawn('python', options);
    }

    next() {
        this.menu.currentItem = this.menu.currentItem.next;
        //Markiereung anzeigen
    }

    back() {
        this.menu.currentItem = this.menu.currentItem.back;
        //Neues Menu anzeigen
    }

    select() {
        //Whatever???
    }

    parseMenuFile(filepath) {
        var text = this.fs.readFileSync(filepath);
        this.menu.json = JSON.parse(text);
        //validate menu file recursiv
        this.menu.start = this.validateMenuNode(this.menu.json, this.menu.json);
        this.menu.currentItem = this.menu.start.items[0];
    }

    validateMenuNode(node, parentNode) {
        if (node.headline == undefined) {
            console.log("[Menu-parser]: Node headline has no text. Node: " + node.headline);
            return false
        }
        if (node.items.length < 1) {
            console.log("[Menu-parser]: Menu node must contain at least  one item. This node has " + node.items.length + " items. Node headline: " + node.headline);
            return false
        }
        if (node.items.length > 4) {
            console.log("[Menu-parser]: Menu node cannot contain more than 4 items. This node has " + node.items.length + " items. Node headline: " + node.headline);
            return false
        }
        for (var i in node.items) {
            var ci = node.items[i];
            //item.text
            if (ci.text == undefined) {
                console.log("[Menu-parser]: Menu item has no text. Node: " + node.headline + "Item: " + i);
                return false
            }
            //Set font size
            if (ci.text.length <= 11) {
                ci.font = 0;
            } else if (ci.text.length <= 16) {
                ci.font = 1;
            } else {
                console.log("[Menu-parser]: Menu item has too long text: " + ci.text + " Node: " + node.headline + "Item: " + i);
                return false
            }
            //item.type
            if (ci.type == undefined) {
                console.log("[Menu-parser]: Menu item has no type: " + ci.text + " Node: " + node.headline + "Item: " + i);
                return false
            }

            if (ci.type == "action") {
                if (ci.action == undefined) {
                    console.log("[Menu-parser]: Menu item has no action: " + ci.text + " Node: " + node.headline + "Item: " + i);
                    return false
                }
            }

            if (ci.type == "submenu") {
                if (ci.children == undefined) {
                    console.log("[Menu-parser]: Menu item has no submenu: " + ci.text + " Node: " + node.headline + "Item: " + i);
                    return false
                }
                //Test children recursiv
                var currentChild = this.validateMenuNode(ci.children, ci);
                if (currentChild == false) {
                    console.log("[Menu-parser]: Menu items submenu could not be parsed: " + ci.text + " Node: " + node.headline + "Item: " + i);
                    return false
                } else {
                    ci.children = currentChild;
                }
            }
            //Set next and back for every item
            ci.back = parentNode;
            if (node.items[i + 1] == undefined) {
                ci.next = node.items[0];
            } else {
                ci.next = node.items[i + 1];
            }
        } //for all items
        console.log("[Menu-parser]: This node was succesfully parsed: " + node.headline);
        return node;
    }

}

module.exports = eink;