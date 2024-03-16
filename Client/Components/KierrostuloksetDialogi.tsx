import React, { useRef, useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { FAB, Text, Portal, Dialog, TextInput } from "react-native-paper";
import { kierrostuloksetDialogi, kasvataKierroksia, paivitaTulos, kilpailuPaattyi, lopputulosDialogi, tallennaKilpailu, nollaaTiedot } from "../Redux/tikanheittoSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../Redux/store";


const { width, height } = Dimensions.get('screen');

interface Props {
    tarkasteltavanKilpailunIndeksi : number
    setTarkasteltavanKilpailunIndeksi : React.Dispatch<React.SetStateAction<number>>
}

const KierrostuloksetDialogi : React.FC<Props> = (props : Props) : React.ReactElement => {

    const dispatch : AppDispatch = useDispatch();

    const kierrosDialogi : boolean = useSelector((state : RootState) => state.kilpailut.kierrostuloksetDialogi);
    const currentKierros : number = useSelector((state : RootState) => state.kilpailut.lisaaUusiKilpailu.currentKierros);
    const kokonaisKierrokset : number | undefined= useSelector((state : RootState) => state.kilpailut.lisaaUusiKilpailu.kierrokset);
    const tallennettujenKilpailujenPituus : number = useSelector((state : RootState) => state.kilpailut.kilpailut.length)

    const alkupTulokset : {kilpailijanNimi : string, tulos : number}[] | null | undefined = useSelector((state : RootState) => state.kilpailut.lisaaUusiKilpailu.kilpailijat)
    
    const [tulokset, setTulokset] = useState<{ kilpailijanNimi : string, tulos : number }[]>([]);
    
    const tulosInputRef = useRef<Array<any | null>>([])

    const seuraavaKierros = () => {

        if (currentKierros != kokonaisKierrokset){
            paivitaTulokset();
            paivitaKierros();
            tyhjennaInputit();
        }

        else {
            paivitaTulokset();
            tyhjennaInputit();
            dispatch(kilpailuPaattyi())
            dispatch(tallennaKilpailu());
            props.setTarkasteltavanKilpailunIndeksi(tallennettujenKilpailujenPituus)
            dispatch(nollaaTiedot());
            dispatch(kierrostuloksetDialogi(false))
            dispatch(lopputulosDialogi(true));
        }
    }

    const paivitaTulokset = () => {
        let tulosTaulukko = []
        for (const [key, value] of Object.entries(tulokset)) {
            if (Number(value) < 0 || Number(value) > 50){
                alert ("Tarkista tulos, luku voi olla väliltä 0-50");
                return
            }
            else{
            tulosTaulukko.push({kilpailijanNimi : key, tulos : value})
            }
        }

        let paivitettavatTulokset = []
        for (let i = 0; i < tulosTaulukko.length; i++){
            for (let x = 0; x < alkupTulokset!.length; x++){
                if (tulosTaulukko[i].kilpailijanNimi === alkupTulokset![x].kilpailijanNimi){
                    paivitettavatTulokset.push({kilpailijanNimi : tulosTaulukko[i].kilpailijanNimi, tulos : (Number(tulosTaulukko[i].tulos) + alkupTulokset![x].tulos)})
                }
            }
        }
        dispatch(paivitaTulos(paivitettavatTulokset))
    }

    const tyhjennaInputit = () => {
        tulosInputRef.current.forEach((inputRef) => {
            inputRef?.clear()
        })
    }

    const paivitaKierros = () => {
        dispatch(kasvataKierroksia(currentKierros + 1))
    }

    const siirrySeuraavaanKierrokseenTeksti = () : string => {
        let teksti : string = "";
        if (currentKierros != kokonaisKierrokset){
            teksti = "Siirry kierrokseen\n " + (currentKierros+1) + "/" + kokonaisKierrokset;
        }

        else {
            teksti = "Näytä lopputulokset"
        }
        return teksti;
    }
    return (
        <View>
            <Portal>
                <Dialog style={styles.dialogi} visible={kierrosDialogi} onDismiss={() => dispatch(kierrostuloksetDialogi(false))}>
                    <Dialog.Title>Kierros {currentKierros}/{kokonaisKierrokset}</Dialog.Title>
                    <Dialog.Content>
                    <Text style={{marginTop : 15}} variant="titleLarge">Kilpailijat:</Text>
                    {alkupTulokset  
                    ? alkupTulokset!.map((alkupTulokset : {kilpailijanNimi : string, tulos : number}, idx : number) => {
                        return (
                            <View key={idx}>
                                <Text variant="labelLarge" >{alkupTulokset.kilpailijanNimi}</Text>
                                <TextInput
                                    key={idx}
                                    label="Tulos"
                                    //value="0"
                                    ref={(e:any) => tulosInputRef.current[idx] = e}
                                    //placeholder="0"
                                    onChangeText={(uusiTeksti) => {
                                        const uudetTulokset = {
                                            ...tulokset,
                                            [alkupTulokset.kilpailijanNimi]: parseInt(uusiTeksti)
                                        };
                                        setTulokset(uudetTulokset)
                                    }} 
                                />
                            </View>
                        )
                        })
                    : null
                    }
                    </Dialog.Content>
                    <FAB
                        style={styles.peruuta}
                        label="Sulje"
                        onPress={() => dispatch(kierrostuloksetDialogi(false))}
                    />
                                        <FAB
                        style={styles.seuraavaKierrosButton}
                        label={siirrySeuraavaanKierrokseenTeksti()}
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
            width : width * 0.8,
            height : height * 0.8
        }
    }
)

export default KierrostuloksetDialogi;