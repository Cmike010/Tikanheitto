import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs/promises'
import path from 'path';

dotenv.config();

const app : express.Application = express();

const portti : number = Number(process.env.PORT) || 3006;

app.use(express.json());

app.get("/api/kilpailut", async (req : express.Request, res : express.Response) : Promise<void>=> {
    let data : any[] = []

    try {
        let jsonStr = await fs.readFile(path.resolve(__dirname, "data", "kilpailut.json"), {encoding : 'utf-8'});

        data = JSON.parse(jsonStr)
    } catch (e : any) {

        res.json({virhe : "Tietojen lukeminen ei onnistunut."})
    }

    res.json(data);
})

app.post("/api/tallennaKilpailu", async (req : express.Request, res : express.Response) : Promise<void> => {
    console.log("Aloitetaan tallennus...")
    try {
        await fs.writeFile(path.resolve(__dirname, "data", "kilpailut.json"), JSON.stringify(req.body.kilpailut.kilpailut, null, 2), {encoding : 'utf-8'});
        
        res.json({});
    } catch (e : any){
        console.log("POST-virhe: " + e)
    }
})

app.listen(portti, () => {
    console.log('Palvelin käynnistyi porttiin: ' + portti);
})