import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

/* Alla olevaa dataa käytettiin ennen kuin loin palvelimen */

/*const kilpailutData : Kilpailu[] = [
    {
        "nimi" : "Kilpailu1",
        "paiva" : "26.2.2024",
        "kierrokset" : 5,
        "kilpailijat" : ["Jokke","Kuuppa","Kapis"],
        "tulokset" : [
            {"kilpailijanNimi" : "Jokke", "tulos" : 35},
            {"kilpailijanNimi" : "Kuuppa", "tulos" : 38},
            {"kilpailijanNimi" : "Kapis", "tulos" : 37}
        ]
    },
    {
        "nimi" : "Kilpailu2",
        "paiva" : "24.1.2024",
        "kierrokset" : 2,
        "kilpailijat" : ["Rami","Armi","Kopis"],
        "tulokset" : [
            {"kilpailijanNimi" : "Rami", "tulos" : 15},
            {"kilpailijanNimi" : "Armi", "tulos" : 16},
            {"kilpailijanNimi" : "Kopis", "tulos" : 24}
        ]
    },
    {
        "nimi" : "Kilpailu3",
        "paiva" : "2.2.2024",
        "kierrokset" : 3,
        "kilpailijat" : ["Irma","Rope","Kipis"],
        "tulokset" : [
            {"kilpailijanNimi" : "Irma", "tulos" : 6},
            {"kilpailijanNimi" : "Rope", "tulos" : 12},
            {"kilpailijanNimi" : "Kipis", "tulos" : 18}
        ]
    }
]*/

export const haeKilpailut = createAsyncThunk("kilpailut/haeKilpailut", async () => {
    console.log("YHTEYS")
    try {
    const yhteys = await fetch("http://192.168.0.12:3006/api/kilpailut", {
        method : "GET",
        headers : {
            "Content-Type" : "application/json"
        }
    })
    if (yhteys.ok){console.log("Onnistui"); return await yhteys.json(); }
    else {console.log("Jotain häikkää.", yhteys.status); throw new Error('Virhe: ' + yhteys.statusText);}
    } catch (error : any){ console.log('VIRHE ' + error.message ); throw error;}
})

export const tallennaKilpailu = createAsyncThunk("kilpailut/tallennaKilpailu", async (payload, {getState}) => {
    console.log("Tallenna kilpailu kutsu...")
    const yhteys = await fetch("http://192.168.0.12:3006/api/tallennaKilpailu", {
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify(getState())
    });
    return await yhteys.json();
})


const kilpailut : Kilpailu[] = [];

export const tikanheittoSlice = createSlice({
    name : 'kilpailut',
    initialState : { 
        kilpailut : [...kilpailut],
        lisaaUusiKilpailu : {
            tyyppi : "",
            kilpailunNimi : "",
            kilpailijat : [],
            kierrokset : 1,
            currentKierros : 1,
            kierrosAloitettu : false,
            paiva : null
        }, 
        lisaaKilpailuDialogi : false,
        kilpailunTyyppiDialogi : false,
        kierrostenMaaraDialogi : false,
        lisaaKilpailunNimiDialogi: false,
        kierrostuloksetDialogi : false,
        darts501Dialogi : false,
        lopputulosDialogi : false
    } as State,
    reducers : {
        lisaaKilpailuDialogi : (state : State, action : PayloadAction<boolean>) => {
            state.lisaaKilpailuDialogi =  action.payload;
        },
        lisaaUusiKilpailu : (state : State, action : PayloadAction<{ pelaaja? : string}>) => {
            if (action.payload.pelaaja !== undefined && state.lisaaUusiKilpailu.kilpailijat === null){
                state.lisaaUusiKilpailu.kilpailijat = [{kilpailijanNimi : action.payload.pelaaja, tulos : 0 }]
            }
            else if (action.payload.pelaaja && state.lisaaUusiKilpailu.kierrosAloitettu === false){
                state.lisaaUusiKilpailu.kilpailijat?.push({kilpailijanNimi : action.payload.pelaaja, tulos : 0});
            }
        },
        lisaaKilpailunTyyppi : (state : State, action : PayloadAction<string>) => {
            state.lisaaUusiKilpailu.tyyppi = action.payload;
        },
        paivitaTulos : (state : State, action : PayloadAction<{kilpailijanNimi : string, tulos : number }[]>) => {
            state.lisaaUusiKilpailu.kilpailijat = action.payload
        },
        lisaaKilpailunNimi : (state : State, action : PayloadAction<string>) =>{
            state.lisaaUusiKilpailu.kilpailunNimi = action.payload;
        },
        lisaaKierrokset : (state : State, action : PayloadAction<number>) =>{
            state.lisaaUusiKilpailu.kierrokset = action.payload;
        },
        kasvataKierroksia : (state : State, action : PayloadAction<number>) =>{
            state.lisaaUusiKilpailu.currentKierros = action.payload;
        },
        aloitaKierros : (state : State, action : PayloadAction<boolean>) =>{
            state.lisaaUusiKilpailu.kierrosAloitettu = action.payload
        },
        kilpailuPaattyi : (state : State) => {
            state.kilpailut = [...state.kilpailut,{
                tyyppi : state.lisaaUusiKilpailu.tyyppi,
                nimi : state.lisaaUusiKilpailu.kilpailunNimi || "Ei nimeä",
                paiva : String(new Date()),
                kierrokset : state.lisaaUusiKilpailu.kierrokset,
                kilpailijat : state.lisaaUusiKilpailu.kilpailijat!.map((kilpailija) => {
                    return kilpailija.kilpailijanNimi
                }),
                tulokset : state.lisaaUusiKilpailu.kilpailijat
            } 
            ]
        },
        nollaaTiedot : (state : State) => {
            state.lisaaUusiKilpailu.kilpailunNimi = "";
            state.lisaaUusiKilpailu.tyyppi = "";
            state.lisaaUusiKilpailu.kilpailijat = [],
            state.lisaaUusiKilpailu.kierrokset = 1,
            state.lisaaUusiKilpailu.currentKierros = 1,
            state.lisaaUusiKilpailu.kierrosAloitettu = false,
            state.lisaaUusiKilpailu.paiva = null
        },
        lisaaKilpailuNimiDialogi : (state : State, action : PayloadAction<boolean>) => {
            state.lisaaKilpailunNimiDialogi = action.payload;
        },
        kilpailunTyyppiDialogi : (state : State, action : PayloadAction<boolean>) => {
            state.kilpailunTyyppiDialogi = action.payload;
        },
        kierrostenMaaraDialogi : (state : State, action : PayloadAction<boolean>) => {
            state.kierrostenMaaraDialogi = action.payload;
        },
        kierrostuloksetDialogi : (state : State, action : PayloadAction<boolean>) => {
            state.kierrostuloksetDialogi = action.payload;
        },
        darts501Dialogi : (state : State, action : PayloadAction<boolean>) => {
            state.darts501Dialogi = action.payload
        },
        lopputulosDialogi : (state : State, action : PayloadAction<boolean>) => {
            state.lopputulosDialogi = action.payload;
        }
    },
    extraReducers : (builder : any) => {
        builder.addCase(haeKilpailut.fulfilled, (state : State, action : PayloadAction<Kilpailu[]>) => {
            state.kilpailut = action.payload.sort((a,b) => new Date(b.paiva).getTime() - new Date(a.paiva).getTime())
        }).addCase(tallennaKilpailu.fulfilled, (state : State, action : PayloadAction<any>) => {
            console.log("Tallennettu")
        })
    }
})

export const { lisaaKilpailuDialogi, 
                lisaaUusiKilpailu,
                lisaaKilpailunTyyppi, 
                paivitaTulos, 
                lisaaKilpailunNimi, 
                lisaaKierrokset, 
                kasvataKierroksia, 
                aloitaKierros, 
                lisaaKilpailuNimiDialogi,
                kilpailunTyyppiDialogi, 
                kierrostenMaaraDialogi, 
                kierrostuloksetDialogi,
                darts501Dialogi,
                kilpailuPaattyi,
                lopputulosDialogi,
                nollaaTiedot,
            } 
                = tikanheittoSlice.actions; 
export default tikanheittoSlice.reducer;