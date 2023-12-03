import { JSDOM } from "jsdom";
import fs from "fs";
const http = require("http");
const https = require("https");
const path = require("path");
import { myDataList} from  './waifu-list'
import { mydata } from "./waifu-data";

async function crawlPage(slug) {
  console.log("Crawling...");
  const data = await fetch("https://mywaifulist.moe" + slug, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (data.status !== 200) {
    console.log("Error");
    return;
  }
  const dataJson = await data.text();

  const dom = new JSDOM(dataJson);
  const document = dom.window.document;

  const title = document
    .getElementsByClassName("px-3 md:px-0")
    .item(0)
    .querySelector("h1").textContent;
  const image = document
    .getElementsByClassName("h-full w-full object-cover object-center")
    .item(0);
  const url = image.src;
  const pathname = url.split("/waifus")
  const filename =  "/waifus" + pathname[1];
  // const body = document.getElementById("waifu-core-information").children;
  const body = document.getElementById("waifu-core-information").children;

  const description = document.getElementById("description").textContent;
  const waifu = {
    name: title,
    thumb: filename,
    description: description
  };
  for (let j = 0; j < body.length; j++) {
    const value2 = body.item(j).querySelectorAll("span");
    for (let i = 0; i < value2.length; i++) {
      const value = value2[i];
      if (value) {
        const key = value.previousSibling.textContent;
        waifu[key] = value.textContent;
        //console.log(key + ": " + value?.textContent);
      }
    }

    const anchor = body.item(j).querySelectorAll("a");
    for (let i = 0; i < anchor.length; i++) {
      const value = anchor[i];
      if (value) {
        const key = value.parentNode.children.item(0).textContent;
        waifu[key] = value.textContent;
     //   console.log(key + ": " + value?.textContent);
      }
    }
  }
  console.log(waifu);

 
  writeToList(waifu);
  download( url, filename);
}

async function writeToList(waifu) {
  fs.writeFile(
    "waifu-data.txt",
    JSON.stringify(waifu) + ", ",
    { flag: "a+" },
    (err) => {
      if (err) throw err;
      console.log("added to list.");
    }
  );
}

async function download(url, filename) {
  const new_filename = __dirname + filename;

  const directory = path.dirname(new_filename);

  // Create the directory if it doesn't exist
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  await downloadImageToUrl(url, new_filename);
}

const downloadImageToUrl = async (url, filename) => {
  console.log(filename);

  let client = http; 
  if (url.toString().indexOf("https") === 0) {
    client = https;
  }

  return client.get(url, (res) => {
    res
      .pipe(fs.createWriteStream(filename, { flag: "a+" }))
      .on("error", (err) => console.log(err))
      .once("close", () => console.log("done"));
  });
};

//crawlPage("/waifu/kill-la-kill");


async function crawlPageFromURI(){
    try{
        for (let i = 8085; i < myDataList.length; i++) {
            const line = myDataList[i];
            if(line){
                console.log(line);
                crawlPage(line);
            }
        }

    }catch (e){
        console.log(e)

        fs.writeFile(
            "error.txt",
            JSON.stringify(e) + "  || \n\n ||  \n",
            { flag: "a+" },
            (err) => {
              if (err) throw err;
              console.log("added to error.");
            }
          );

    }
}

// crawlPageFromURI();

function findIndex(){
    console.log(myDataList.length)
    for (let i = 0; i < myDataList.length; i++) {
        const line = myDataList[i];
        if(line.includes("/waifu/langley-azur-lane")){
            console.log(i);
        }
    }
}

 