interface Kilpailu {
    tyyppi : string
    nimi : string
    paiva : string
    kierrokset : number
    kilpailijat : string[]
    tulokset : {kilpailijanNimi : string, tulos : number}[] | null
}

interface LisattavaKilpailu {
    tyyppi : string
    kilpailunNimi? : string
    kilpailijat : {
        kilpailijanNimi : string,
        tulos : number
    }[]
    kierrokset : number
    currentKierros : number
    kierrosAloitettu? : boolean
    paiva : Date | null
}

interface State {
    kilpailut : Kilpailu[]
    lisaaKilpailuDialogi : boolean
    kierrostenMaaraDialogi : boolean
    kilpailunTyyppiDialogi : boolean
    lisaaKilpailunNimiDialogi : boolean
    kierrostuloksetDialogi : boolean
    lisaaUusiKilpailu : LisattavaKilpailu
    darts501Dialogi : boolean
    lopputulosDialogi : boolean
}

