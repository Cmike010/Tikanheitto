import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Provider, useDispatch } from 'react-redux';
import { AppDispatch, store } from './Redux/store';
import { PaperProvider } from 'react-native-paper';
import Index from './Components/Index';
import { useEffect, useRef } from 'react';
import { haeKilpailut } from './Redux/tikanheittoSlice';

const App : React.FC = () : React.ReactElement => {



  return (
    <Provider store={store}>
      <PaperProvider>
        <View style={styles.container}>
          <Index/>
        </View>
      </PaperProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;