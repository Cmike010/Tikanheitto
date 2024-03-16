import React, { useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { FAB, Portal, Dialog, RadioButton } from "react-native-paper";
import { kierrostenMaaraDialogi, lisaaKilpailuNimiDialogi, kilpailunTyyppiDialogi, lisaaKilpailunTyyppi } from "../Redux/tikanheittoSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../Redux/store";


const { width, height } = Dimensions.get('screen');

const KilpailunTyyppiDialogi : React.FC = () : React.ReactElement => {

    const kilpailunTyyppiDialog : boolean = useSelector((state : RootState) => state.kilpailut.kilpailunTyyppiDialogi);
    
    const [value, setValue] = useState<string>("mokkitikka");
    
    const dispatch : AppDispatch = useDispatch();

    const aloitaKilpailu = () => {
        dispatch(lisaaKilpailunTyyppi(value));

        value === 'mokkitikka' ? dispatch(kierrostenMaaraDialogi(true)) : dispatch(lisaaKilpailuNimiDialogi(true));
        dispatch(kilpailunTyyppiDialogi(false));
        setValue('mokkitikka');
    }

    return (
        <View>
            <Portal>
                <Dialog style={styles.dialogi} visible={kilpailunTyyppiDialog} onDismiss={() => dispatch(kilpailunTyyppiDialogi(false))}>
                    <Dialog.Title>Kilpailun tyyppi</Dialog.Title>
                    <Dialog.Content>
                        <RadioButton.Group onValueChange={value => setValue(value)} value={value}>
                            <RadioButton.Item
                            value="mokkitikka"
                            status={ value === "mokkitikka" ? 'checked' : 'unchecked'}
                            label='Mökkitikka'
                            />
                            <RadioButton.Item
                            value="darts501"
                            status={ value === "darts501" ? 'checked' : 'unchecked'}
                            label='Darts 501'
                            />
                        </RadioButton.Group>
                    </Dialog.Content>
                    
                    <FAB
                        style={styles.aloitaKilpailuButton}
                        label="Aloita kilpailu"
                        onPress={aloitaKilpailu}
                    />
                    <FAB
                        style={styles.peruuta}
                        label="Sulje"
                        onPress={() => dispatch(kilpailunTyyppiDialogi(false))}
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
        lisaaKilpailunNimiButton : {
            marginTop : 10,
            marginBottom : 10
        }
    }
)


export default KilpailunTyyppiDialogi;
