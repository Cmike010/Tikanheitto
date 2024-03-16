import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Dimensions, TextInput } from "react-native";
import { FAB, Portal, Dialog, DataTable } from "react-native-paper";
import { paivitaTulos, kilpailuPaattyi, lopputulosDialogi, tallennaKilpailu, darts501Dialogi, nollaaTiedot } from "../Redux/tikanheittoSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../Redux/store";
import { debounce } from 'lodash'

interface Props {
    tarkasteltavanKilpailunIndeksi : number
    setTarkasteltavanKilpailunIndeksi : React.Dispatch<React.SetStateAction<number>>
}

const { width, height } = Dimensions.get('screen');


const Darts501Dialogi : React.FC<Props> = (props : Props) : React.ReactElement => {

    const dispatch : AppDispatch = useDispatch();

    const lisattavaKilpailu = useSelector((state : RootState) => state.kilpailut.lisaaUusiKilpailu);
    const tallennettujenKilpailujenPituus : number = useSelector((state : RootState) => state.kilpailut.kilpailut.length)

    const dartsDialogi = useSelector((state : RootState) => state.kilpailut.darts501Dialogi);
    const [tulokset, setTulokset] = useState<{
                                                kilpailijanNimi : string, 
                                                vanhaTulos : number, 
                                                uusiTulos : number, 
                                                tuloksenPituus : number, 
                                                kierroksenTulos : number}[]>();

    const alusta : React.MutableRefObject<boolean> = useRef(false);
    const tulosInputRef = useRef<Array<any | null>>([])

    const [inputEnabled, setInputEnabled] = useState<boolean>(true);
    const [nappiTeksti, setNappiTeksti] = useState<string>("Seuraava kierros")
    const [onkoKilpailuKaynnissa, setOnkoKilpailuKaynnissa] = useState<boolean>(false)

        // Käynnistetään kilpailu ja alustetaan kilpailijat
    useEffect(() => {
        if (alusta.current != true && dartsDialogi) {

            setOnkoKilpailuKaynnissa(true);
            const alustettavatKilpailijat = (() => {
                if (lisattavaKilpailu.kilpailijat.length > 0){
                    return lisattavaKilpailu.kilpailijat.map((kilpailija : {kilpailijanNimi : string, tulos : number}) => {
                        return {kilpailijanNimi : kilpailija.kilpailijanNimi, vanhaTulos : 501, uusiTulos : 501, tuloksenPituus : 0, kierroksenTulos : 0}
                })
            }
        })();

            setTulokset(alustettavatKilpailijat);
          return () => { alusta.current = true }
        }
        else { alusta.current = false; }
    
        
      }, [dartsDialogi]);


    const paivitaKierroksenTulos = (idx : number, uusiTulos : string) => {

        if (parseInt(uusiTulos) > 180 || parseInt(uusiTulos) < 0){
            alert("Tarkista tulos, tulos voi olla väliltä 0-180");
            tulosInputRef.current![idx].clear();
            return
        }

        const kilpailijanNimi = tulokset![idx].kilpailijanNimi; 
        const muokattavaKilpailija = tulokset!.find(kilpailija => kilpailija.kilpailijanNimi === kilpailijanNimi);
        if (muokattavaKilpailija) {
            const uudetTulokset = tulokset!.map(kilpailija => {
                if (kilpailija.kilpailijanNimi === kilpailijanNimi) {

                    let tulos : number = 0;
                    let pituus : number = 0;
                    if (uusiTulos === ""){
                        tulos = 0
                    }
                    // Tarkastetaan onko käyttäjä antanut tuloksen, mutta käyttänyt sen jälkeen backspacea
                    if (uusiTulos.length > kilpailija.tuloksenPituus){
                        tulos = kilpailija.uusiTulos - parseInt(uusiTulos);
                        if (tulos === 0){
                            setOnkoKilpailuKaynnissa(false);
                            setInputEnabled(false);
                            setNappiTeksti("Näytä tulokset");
                        }
                        if (tulos < 0){
                            tulos = kilpailija.uusiTulos;
                            kilpailija.kierroksenTulos = 0;
                        }
                        else if (tulos > 0) {
                            kilpailija.kierroksenTulos = parseInt(uusiTulos);
                        }
                        pituus = uusiTulos.length;
                    }

                    // Jos käytetty backspacea -> tyhjennetään inputti
                    if (uusiTulos.length < kilpailija.tuloksenPituus){
                        tulos = kilpailija.vanhaTulos;
                        pituus = uusiTulos.length;
                        tulosInputRef.current![idx].clear();
                    }
                    return { ...kilpailija, uusiTulos : tulos, tuloksenPituus : pituus }
                }
                return kilpailija;
            });
            setTulokset(uudetTulokset);
        }
    }

    const lopetaPeli = () => {
        if (!onkoKilpailuKaynnissa){
        
        dispatch(paivitaTulos(tallennettavatTulokset()));
        dispatch(kilpailuPaattyi());
        dispatch(tallennaKilpailu());
        props.setTarkasteltavanKilpailunIndeksi(tallennettujenKilpailujenPituus)
        dispatch(nollaaTiedot());
        dispatch(darts501Dialogi(false));
        dispatch(lopputulosDialogi(true));
        }
    }

    const tallennettavatTulokset = () => {
        const uudetTulokset = tulokset!.map((tulos) => {
            return {kilpailijanNimi : tulos.kilpailijanNimi, tulos : tulos.uusiTulos}
        })
        return uudetTulokset;
    }

    const seuraavaKierros = () => {
        if (onkoKilpailuKaynnissa){
            
            const uudetTulokset = tulokset?.map(kilpailija => {
                return {...kilpailija, vanhaTulos : (kilpailija.vanhaTulos - kilpailija.kierroksenTulos), tuloksenPituus : 0}
            })

            setTulokset(uudetTulokset);
            tyhjennaInputit();
        }

        else { lopetaPeli(); }

    }

    const tyhjennaInputit = () => {
        tulosInputRef.current.forEach((inputRef) => {
            inputRef?.clear()
        })
    }

    const paivitaTulosDebounce = debounce(paivitaKierroksenTulos, 500)
    return (
        <View>
            <Portal>
                <Dialog style={styles.dialogi} visible={dartsDialogi} onDismiss={() => dispatch(darts501Dialogi(false))}>
                    <Dialog.Title>Darts 501</Dialog.Title>
                    <Dialog.Content>
                        <DataTable>
                            <DataTable.Header>
                                <DataTable.Title>Kilpailija</DataTable.Title>
                                <DataTable.Title>{""}</DataTable.Title>
                                <DataTable.Title>Tulokset</DataTable.Title>
                                <DataTable.Title>{""}</DataTable.Title>
                            </DataTable.Header>
                            {tulokset?.length! > 0
                            ?
                            tulokset!.map((kilpailija : {kilpailijanNimi : string, vanhaTulos : number, uusiTulos : number}, idx : number) => {
                                return (
                                    <DataTable.Row key={idx}>
                                        <DataTable.Cell>{kilpailija.kilpailijanNimi}</DataTable.Cell>
                                        <DataTable.Cell>{kilpailija.vanhaTulos || "501"} - </DataTable.Cell>
                                        <DataTable.Cell style={styles.dataCell}>
                                            <TextInput
                                                style={styles.input}
                                                editable={inputEnabled}
                                                ref={(e:any) => tulosInputRef.current[idx] = e}
                                                onChangeText={(uusiTeksti) => paivitaTulosDebounce(idx, uusiTeksti)}
                                            />
                                        </DataTable.Cell>
                                        <DataTable.Cell>{kilpailija.uusiTulos }</DataTable.Cell>
                                    </DataTable.Row>
                                )
                            })
                            : null
                            }
                        </DataTable>
                    </Dialog.Content>
                    <FAB
                        style={styles.peruuta}
                        label="Sulje"
                        onPress={() => dispatch(darts501Dialogi(false))}
                    />
                    <FAB
                        style={styles.seuraavaKierrosButton}
                        label={nappiTeksti}
                        onPress={seuraavaKierros}
                    />

                </Dialog>
            </Portal>
        </View>
    )
}

const styles = StyleSheet.create(
    {
        seuraavaKierrosButton : {
            position : 'absolute',
                margin : 15,
                bottom : 0,
                right : 0
        },
        peruuta : {
            position : 'absolute',
                margin : 15,
                bottom : 0,
                left : 0
        },
        dialogi : {
            width : width * 0.9,
            height : height * 0.8
        },
        dataCell : {
            flex : 2,
            backgroundColor : "#8f8c8c",
            marginRight : 5
        },
        input : {
            flex : 3
        }
    }
)

export default Darts501Dialogi;