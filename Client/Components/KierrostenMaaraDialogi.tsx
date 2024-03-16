import React, { ReactNode } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { FAB, Portal, Dialog, RadioButton } from "react-native-paper";
import { kierrostenMaaraDialogi, lisaaKilpailuNimiDialogi, lisaaKierrokset } from "../Redux/tikanheittoSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../Redux/store";

const { width, height } = Dimensions.get('screen');

const KierrostenMaaraDialogi : React.FC = () : React.ReactElement => {

    const kierroksetDialogi : boolean = useSelector((state : RootState) => state.kilpailut.kierrostenMaaraDialogi);
    const kierrokset : number | undefined = useSelector((state : RootState) => state.kilpailut.lisaaUusiKilpailu.kierrokset);
    const dispatch : AppDispatch = useDispatch();

    const luoRadiot = () => {

        const radiot = []
        for (let i = 1; i <= 10; i++){
            
            radiot.push(
                <RadioButton.Item
                            position="leading"
                            label={String(i)}
                            key={i}
                            value={String(i)}
                            status={ kierrokset === i ? 'checked' : 'unchecked' }
                            onPress={() => dispatch(lisaaKierrokset(i))}
                        />
            )
        }
        return radiot
    }

    const aloitaPeli = () => {

        dispatch(lisaaKilpailuNimiDialogi(true));
        dispatch(kierrostenMaaraDialogi(false));
    };

    return (

        <View>
            <Portal>
                <Dialog style={styles.dialogi} visible={kierroksetDialogi} onDismiss={() => dispatch(kierrostenMaaraDialogi(false))}>
                    <Dialog.Title>Kierrosten määrä</Dialog.Title>
                    <Dialog.Content>
                        {luoRadiot().map((radio : ReactNode, idx : number) => {
                            return (
                                radio
                            )
                        })}
                    </Dialog.Content>
                    
                    <FAB
                        style={styles.aloitaKilpailuButton}
                        label="Aloita kilpailu"
                        onPress={aloitaPeli}
                    />
                    <FAB
                        style={styles.peruuta}
                        label="Sulje"
                        onPress={() => dispatch(kierrostenMaaraDialogi(false))}
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
        }
    }
)

export default KierrostenMaaraDialogi