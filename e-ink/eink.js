"use strict";

class eink {



    constructor(filepath) {
        this.screenWriter = "./e-ink/screen_writer.py";
        this.spawn = require('child_process');
        this.fs = require("fs");
        this.menu = {};
        this.lastScreenContent = undefined;
        this.menu.currentItem = undefined;
        this.menu.currentNode = undefined;
        this.menu.start = undefined;
        this.parseMenuFile(filepath);
    }

    alert(message) {
        var screenContent = ["full","Message", "", message, "", "", "-      OK", 0, 0, 0, 0, 0, 0];
        this.writeToScreen(screenContent);
    }

    //Takes array with the 6 Text items and 6 Font Size Ids
    writeToScreen(options) {
        //set full or partial update
        options.unshift(this.fullOrPartial(options));
        //Add name of screen_writer script
        options.unshift(this.screenWriter);
        console.log("Writing to screen");
        this.spawn.spawn('python', options);
        this.lastScreenContent = options;
        //console.log(options);
    }

    fullOrPartial(options){
      //TODO Implement fullOrPartial
      return "full";
    }

    displayNode(node){
      var options = [node.headline];
      for(var i=0; i<4;i++){
        if (node.items[i] != undefined){
          if(node.items[i].isActive){
            options.push(">"+node.items[i].text);
          }
          else{
            options.push(" "+node.items[i].text);
          }

        }
        else{
          options.push("");
        }
      }
      options.push("Next     OK");
      //font Sizes
      options.push(0);
      for(var i=0; i<4;i++){
        if (node.items[i] != undefined){
          options.push(node.items[i].font);
        }
        else{
          options.push(0);
        }
      }
      options.push(0);
      //Set as currentNode
      this.menu.currentNode = node;
      //Send to screen
      this.writeToScreen(options);
    }

    next() {
      console.log("next");
        this.setCurrentItem(this.menu.currentItem.next);
    }

    back() {
      if (this.menu.currentItem.back != undefined){
        this.setCurrentItem(this.menu.currentItem.back);
      }
    }

    select() {
        //Whatever???
    }

    parseMenuFile(filepath) {
        var text = this.fs.readFileSync(filepath);
        this.menu.json = JSON.parse(text);
        //validate menu file recursiv
        this.menu.start = this.validateMenuNode(this.menu.json, undefined);
        this.menu.currentNode = this.menu.start;
        this.menu.start.items[0].isActive = true;
        this.menu.currentItem=this.menu.start.items[0];
        this.displayNode(this.menu.currentNode);
    }

    setCurrentItem(item){
      this.menu.currentItem.isActive = false;
      this.menu.currentItem = item;
      item.isActive = true;
      this.displayNode(this.menu.currentNode);
      console.log("Current Item is now: " + item.text);
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
        console.log("Anzahl Items: "+ node.items.length);
        for (var i in node.items) {
            var ci = node.items[i];
            //Initialise all Items as false
            ci.isActive = false;
            //item.text
            if (ci.text == undefined) {
                console.log("[Menu-parser]: Menu item has no text. Node: " + node.headline + "Item: " + i);
                return false
            }
            //Set font size
            if (ci.text.length <= 10) {
                ci.font = 0;
            } else if (ci.text.length <= 15) {
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
            console.log("Current iTem is: " + ci.text + " Next item is: " + node.items[i+1].text);
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
