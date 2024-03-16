import React, { useRef, useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Button, FAB, Portal, Dialog, TextInput } from "react-native-paper";
import { lisaaKilpailunNimi, lisaaKilpailuNimiDialogi, kierrostuloksetDialogi, aloitaKierros, darts501Dialogi } from "../Redux/tikanheittoSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../Redux/store";


const { width, height } = Dimensions.get('screen');

const LisaaKilpailunNimiDialogi : React.FC = () : React.ReactElement => {

    const kilpailunNimiDialog : boolean = useSelector((state : RootState) => state.kilpailut.lisaaKilpailunNimiDialogi);
    const kilpailunTyyppi : string = useSelector((state : RootState) => state.kilpailut.lisaaUusiKilpailu.tyyppi);

    const kilpailunNimiRef : any = useRef()

    const dispatch : AppDispatch = useDispatch();

    const [kilpailunNimi, setKilpailunNimi] = useState<string>("")


    const lisaaKilpailunNimiFunc = () => {
        dispatch(lisaaKilpailunNimi(kilpailunNimi));
        setKilpailunNimi("");
        kilpailunNimiRef.current.clear();
        dispatch(aloitaKierros(true))
        kilpailunTyyppi === 'mokkitikka' ? dispatch(kierrostuloksetDialogi(true)) : dispatch(darts501Dialogi(true));
        dispatch(lisaaKilpailuNimiDialogi(false));
    }

    return (
        <View>
            <Portal>
                <Dialog style={styles.dialogi} visible={kilpailunNimiDialog} onDismiss={() => dispatch(lisaaKilpailuNimiDialogi(false))}>
                    <Dialog.Title>Anna kilpailulle nimi</Dialog.Title>
                    <Dialog.Content>
                        <TextInput
                            ref={kilpailunNimiRef}
                            label='Anna kilpailun nimi'
                            placeholder="Nimi..."
                            onChangeText={(e :string ) => setKilpailunNimi(e)}
                        />
                    <Button 
                        icon='plus'
                        style={styles.lisaaKilpailunNimiButton}
                        buttonColor="#90EE90"
                        textColor="black"
                        mode="outlined"
                        onPress={lisaaKilpailunNimiFunc}
                        >Aloita kierros 1
                    </Button>
                    </Dialog.Content>
                    <FAB
                        style={styles.peruuta}
                        label="Sulje"
                        onPress={() => dispatch(lisaaKilpailuNimiDialogi(false))}
                    />
                </Dialog>
            </Portal>
        </View>
    )
}

const styles = StyleSheet.create(
    {
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
        lisaaKilpailunNimiButton : {
            marginTop : 10,
            marginBottom : 10
        }
    }
)

export default LisaaKilpailunNimiDialogi;
