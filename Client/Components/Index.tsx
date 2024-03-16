import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../Redux/store";
import { Button, FAB } from "react-native-paper";
import { haeKilpailut, lisaaKilpailuDialogi, lopputulosDialogi } from "../Redux/tikanheittoSlice";
import LisaaKilpailuDialog from "./LisaaKilpailuDialog";
import KierrostenMaaraDialogi from "./KierrostenMaaraDialogi";
import LisaaKilpailunNimiDialogi from "./LisaaKilpailunNimiDialogi";
import KierrostuloksetDialogi from "./KierrostuloksetDialogi";
import LopputulosDialogi from "./LopputulosDialogi";
import { format } from "date-fns";
import KilpailunTyyppiDialogi from "./KilpailunTyyppiDialogi";
import Darts501Dialogi from "./Darts501Dialogi";

const Index : React.FC = () : React.ReactElement => {

    const kilpailut : Kilpailu[] = useSelector((state : RootState) => state.kilpailut.kilpailut)
    const dispatch : AppDispatch = useDispatch();
    const haettu : React.MutableRefObject<boolean> = useRef(false);
    const [tarkasteltavanKilpailunIndeksi, setTarkasteltavanKilpailunIndeksi] = useState<number>(NaN)
        

    // Haetaan kilpailut heti aluksi //
    useEffect(() => {

        if (!haettu.current) {
          dispatch(haeKilpailut());
          console.log("Haettu")
        }
    
        return () => { haettu.current = true }
      }, [dispatch]);

      
      const tarkasteleKilpailua = (indeksi : number) => {
        setTarkasteltavanKilpailunIndeksi(indeksi);
      }



      useEffect(() => {
        if (tarkasteltavanKilpailunIndeksi >= 0){
            dispatch(lopputulosDialogi(true));
            }
      }, [tarkasteltavanKilpailunIndeksi])

    return (
        <>
            <View>
                {kilpailut.map((kilpailu : Kilpailu, idx : number) => {
                    return (
                            <Button 
                                style={styles.kilpailuButton} 
                                key={idx} 
                                mode="outlined"
                                buttonColor="#90EE90"
                                onPress={() => tarkasteleKilpailua(idx)}
                                >
                                    {kilpailu.nimi + " " + format(new Date(kilpailu.paiva), "dd.MM.yyyy")}
                            </Button>
                    )})}
            </View>
            <FAB
                style={styles.lisaaUusiButton}
                icon='plus'
                label="Lisää uusi kilpailu"
                onPress={() => dispatch(lisaaKilpailuDialogi(true))}
            />
            <LisaaKilpailuDialog/>
            <KilpailunTyyppiDialogi/>
            <KierrostenMaaraDialogi/>
            <LisaaKilpailunNimiDialogi/>
            <KierrostuloksetDialogi tarkasteltavanKilpailunIndeksi={tarkasteltavanKilpailunIndeksi} setTarkasteltavanKilpailunIndeksi={setTarkasteltavanKilpailunIndeksi}/>
            <Darts501Dialogi tarkasteltavanKilpailunIndeksi={tarkasteltavanKilpailunIndeksi} setTarkasteltavanKilpailunIndeksi={setTarkasteltavanKilpailunIndeksi}/>
            <LopputulosDialogi tarkasteltavanKilpailunIndeksi={tarkasteltavanKilpailunIndeksi} setTarkasteltavanKilpailunIndeksi={setTarkasteltavanKilpailunIndeksi}/>
        </>

    )
}

const styles = StyleSheet.create(
    {
        kilpailuButton : {
            color : "#90EE90", 
            marginBottom : 10,
        },
        lisaaUusiButton : {

                position : 'absolute',
                margin : 15,
                bottom : 0,
                right : 0
        }
    }
)

export default Index;