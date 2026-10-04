import 'dotenv/config';
import { RodiumAI } from 'rodiumai';
import fs from 'fs';
import readline from 'readline';

const client = new RodiumAI({ apiKey: process.env.RODIUMAI_API_KEY });
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise(res => rl.question(q, res));

async function etape1() {
  while(true){
    console.log("\n Étape 1 : Chat ");
    const question = (await ask("Votre question : ")).trim();
    if(!question) continue;
    const resp = await client.chat.completions.create({
      model: "openai/gpt-4o",
      messages: [{ role: "user", content: question }]
    });
    console.log(`\n${resp.choices[0].message.content}`);
    console.log(`Coût : ${resp.cost_rodi || 'N/A'} RODI`);
    const c = (await ask("\nRester (r) ou suite (s)? ")).toLowerCase();
    if(c==='s') return 'next';
    if(c==='q') return 'quit';
  }
}
async function etape2() {
  while(true){
    console.log("\n Étape 2 : Image ");
    const prompt = (await ask("Décrivez l'image : ")).trim();
    if(!prompt) continue;
    const resp = await client.images.generate({
      model: "openai/gpt-image-1-mini",
      prompt, size: "1024x1024"
    });
    fs.writeFileSync("image.png", Buffer.from(resp.data[0].b64_json, 'base64'));
    console.log("Image enregistrée : image.png");
    const c = (await ask("\nBack (b), rester (r), suite (s)? ")).toLowerCase();
    if(c==='s') return 'next';
    if(c==='b') return 'back';
    if(c==='q') return 'quit';
  }
}
async function etape3() {
  while(true){
    console.log("\n Étape 3 : Vidéo ");
    const prompt = (await ask("Décrivez la vidéo (4s) : ")).trim();
    if(!prompt) continue;
    const resp = await client.video.generations.create({
      model: "openai/sora-2",
      prompt, duration_seconds: 4, size: "720x1280"
    });
    const data = resp.data[0];
    if(data.b64_json){
      fs.writeFileSync("video.mp4", Buffer.from(data.b64_json, 'base64'));
    } else {
      const r = await fetch(data.url);
      fs.writeFileSync("video.mp4", Buffer.from(await r.arrayBuffer()));
    }
    console.log("Vidéo enregistrée : video.mp4");
    const c = (await ask("\nBack (b), rester (r), quitter (q)? ")).toLowerCase();
    if(c==='b') return 'back';
    return 'quit';
  }
}

let etape = 1;
while(true){
  if(etape===1){ if(await etape1()==='next') etape=2; else break; }
  else if(etape===2){ const r=await etape2(); if(r==='next') etape=3; else if(r==='back') etape=1; else break; }
  else if(etape===3){ if(await etape3()==='back') etape=2; else break; }
}
rl.close();