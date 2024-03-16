import React, { useRef, useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Button, FAB, Text, Portal, Dialog, TextInput } from "react-native-paper";
import { lisaaKilpailuDialogi, lisaaUusiKilpailu, kilpailunTyyppiDialogi } from "../Redux/tikanheittoSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../Redux/store";


const { width, height } = Dimensions.get('screen');

const LisaaKilpailuDialog : React.FC = () : React.ReactElement => {

    const kilpailuDialogi : boolean = useSelector((state : RootState) => state.kilpailut.lisaaKilpailuDialogi);

    const pelaajat : {kilpailijanNimi : string, tulos : number}[] | undefined | null = useSelector((state : RootState) => state.kilpailut.lisaaUusiKilpailu.kilpailijat);
    
    const dispatch : AppDispatch = useDispatch();

    const [pelaajanNimi, setPelaajanNimi] = useState<string>("");

    const kilpailijanNimiRef : any = useRef()

    

    const lisaaKilpailija = () => {
        dispatch(lisaaUusiKilpailu({pelaaja : pelaajanNimi}));
        setPelaajanNimi("");
        kilpailijanNimiRef.current.clear();
    }


    const aloitaKilpailu = () => {
        dispatch(kilpailunTyyppiDialogi(true))
        dispatch(lisaaKilpailuDialogi(false))
    }

    return (
        <View>
            <Portal>
                <Dialog style={styles.dialogi} visible={kilpailuDialogi} onDismiss={() => dispatch(lisaaKilpailuDialogi(false))}>
                    <Dialog.Title>Lisää uusi kilpailija</Dialog.Title>
                    <Dialog.Content>
                        <TextInput
                            ref={kilpailijanNimiRef}
                            label='Anna kilpailijan nimi'
                            placeholder="Nimi..."
                            onChangeText={(e :string ) => setPelaajanNimi(e)}
                        />
                    <Text style={{marginTop : 15}} variant="titleLarge">Kilpailijat:</Text>
                    {pelaajat?.length! > 0 
                    ? pelaajat?.map((pelaaja : {kilpailijanNimi : string, tulos : number}, idx : number) => {
                        return (
                            <Text variant="labelLarge" key={idx}>{pelaaja.kilpailijanNimi}</Text>
                        )
                    })
                    : null
                    }
                    <Button 
                        icon='plus'
                        style={styles.lisaaKilpailijaButton}
                        buttonColor="#90EE90"
                        textColor="black"
                        mode="outlined"
                        onPress={lisaaKilpailija}
                        >Lisää kilpailija
                    </Button>
                    </Dialog.Content>
                    
                    {pelaajat?.length! > 1
                    ? <FAB
                        style={styles.aloitaKilpailuButton}
                        label="Aloita kilpailu"
                        onPress={aloitaKilpailu}
                    />

                    :null
                    }
                    <FAB
                        style={styles.peruuta}
                        label="Sulje"
                        onPress={() => dispatch(lisaaKilpailuDialogi(false))}
                    />
                </Dialog>
            </Portal>
        </View>
    )
} 

const styles = StyleSheet.create(
    {
        aloitaKilpailuButton : {
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
        },
        lisaaKilpailijaButton : {
            marginTop : 10,
            marginBottom : 10
        }
    }
)

export default LisaaKilpailuDialog;