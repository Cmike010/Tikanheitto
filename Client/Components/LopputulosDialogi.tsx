import React, {  } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { FAB, Text, Portal, Dialog } from "react-native-paper";
import { haeKilpailut, lopputulosDialogi, nollaaTiedot } from "../Redux/tikanheittoSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../Redux/store";

const { width, height } = Dimensions.get('screen');

interface Props {
    tarkasteltavanKilpailunIndeksi : number
    setTarkasteltavanKilpailunIndeksi : React.Dispatch<React.SetStateAction<number>>
}

const LopputulosDialogi : React.FC<Props> = (props : Props) : React.ReactElement => {

    const dispatch : AppDispatch = useDispatch();

    const loppuDialogi : boolean = useSelector((state : RootState) => state.kilpailut.lopputulosDialogi);
    
    const kilpailut : any = useSelector((state : RootState) => state.kilpailut) //Muuten en saanut toimimaan halutusti, kuin asettamalla tyypiksi Any.
    
    let tarkasteltavanKilpailunTyyppi : string = "";
    let lopullinenJarjestys : {kilpailijanNimi : string, tulos : number}[] = []
    
        // Tarkastetaan valitun kilpailun tyyppi ja annetaan tulostettava teksti sen mukaan.
    if ( kilpailut && kilpailut!.kilpailut.length > 0 && props.tarkasteltavanKilpailunIndeksi >= 0){
        if (kilpailut.kilpailut[props.tarkasteltavanKilpailunIndeksi].tyyppi === "mokkitikka"){
            tarkasteltavanKilpailunTyyppi = "Mökkitikka"
            lopullinenJarjestys = [...kilpailut.kilpailut[props.tarkasteltavanKilpailunIndeksi].tulokset].sort((a,b) => b.tulos - a.tulos);
        }
        if (kilpailut.kilpailut[props.tarkasteltavanKilpailunIndeksi].tyyppi === "darts501"){
            tarkasteltavanKilpailunTyyppi = "Darts 501"
            lopullinenJarjestys = [...kilpailut.kilpailut[props.tarkasteltavanKilpailunIndeksi].tulokset].sort((a,b) => a.tulos - b.tulos);
        }
    }

    const lopetaTarkastelu = () => {

        dispatch(haeKilpailut());
        dispatch(lopputulosDialogi(false));
        props.setTarkasteltavanKilpailunIndeksi(NaN);
    }

    const haeVoittajat = () => {
        let teksti : string[] = [];
        let voittajanTulos = lopullinenJarjestys[0].tulos

        lopullinenJarjestys.map((kilpailija : {kilpailijanNimi : string, tulos : number}, idx : number) => {

            if (kilpailija.tulos == voittajanTulos){
                teksti.length > 0 ? teksti = [...teksti, " ja " + kilpailija.kilpailijanNimi]
                : teksti = [...teksti, kilpailija.kilpailijanNimi]
            }
        })
        return teksti;
    }

return (
    (Boolean(loppuDialogi) && props.tarkasteltavanKilpailunIndeksi >= 0)
    ?
    <View>
        <Portal>
            <Dialog style={styles.dialogi} visible={loppuDialogi} onDismiss={() => dispatch(lopputulosDialogi(false))}>
                <Dialog.Title>Lopputulokset</Dialog.Title>
                <Dialog.Content>
                    <Text style={{marginTop : 15}} variant="titleLarge">Kilpailun tyyppi: {tarkasteltavanKilpailunTyyppi} </Text>
                <Text style={{marginTop : 15}} variant="titleLarge">Kilpailun voitti: {haeVoittajat()}</Text>
                {lopullinenJarjestys.length >0 ? lopullinenJarjestys.map((lopullinenJarjestys:{kilpailijanNimi:string, tulos: number}, idx : number) => {
                    return (
                        <Text variant="titleMedium" key={idx}>{lopullinenJarjestys.kilpailijanNimi} {lopullinenJarjestys.tulos} pistettä</Text>
                    )
                } ) : null}
                </Dialog.Content>
                <FAB
                    style={styles.suljeButton}
                    label="Sulje"
                    onPress={lopetaTarkastelu}
                />
            </Dialog>
        </Portal>
    </View>
    : <></>
)
}

const styles = StyleSheet.create(
    {
        suljeButton : {
            position : 'absolute',
                margin : 15,
                bottom : 0,
                right : 0
        },
        dialogi : {
            width : width * 0.8,
            height : height * 0.8
        }
    }
)

export default LopputulosDialogi;