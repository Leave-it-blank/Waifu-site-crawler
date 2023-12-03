
import { JSDOM }from 'jsdom'
import fs from 'fs'
async function crawl(page){

    console.log("Crawling...");
    const data = await fetch("https://mywaifulist.moe/browse?page=" + page,
    {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }) 
    if(data.status !== 200){
        console.log("Error");
        return;
    }
   const dataJson = await data.text();

    const dom = new JSDOM(dataJson);
    const document = dom.window.document;
    const waifuList = document.getElementsByClassName("w-full grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6")
    console.log(waifuList.item(0).children.item(0).querySelector("a").href);

    const len =  waifuList.item(0).children.length;
 
    for(let i=0; i< len; i++){
        const waifuUrl = waifuList.item(0).children.item(i).querySelector("a").href;
        writeToList(waifuUrl);
    }
   
    
}

async function writeToList(waifu){
    fs.writeFile('waifu-list.txt', JSON.stringify(waifu) + ", ", { flag: "a+" }, (err) => {
        if (err) throw err;
        console.log('added to list.');
      }); 
}

 


async function crawlPages(){
    for(let i=1; i<= 2062; i++){
        crawl(i);
    }
}

// crawlPages();