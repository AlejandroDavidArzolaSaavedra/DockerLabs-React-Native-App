import React, { useState, useCallback } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Inicio from '../components/inicio';
import NavBar from '../components/navBar';
import store from '../redux/store';
import { Provider } from 'react-redux';
const TAB_COMPONENTS = {
  Inicio: Inicio,
  Perfil: null,
  Notas: null,
  Ranking: null,
  Info: null
};

const WebView = () => {
  const [activeTab, setActiveTab] = useState('Inicio');

  const handleTabPress = useCallback((tabName) => {
    if (activeTab !== tabName) {
      setActiveTab(tabName);
    }
  }, [activeTab]);

  const CurrentComponent = TAB_COMPONENTS[activeTab];

  return (
    <>
      <View style={{ flex: 1, backgroundColor: '#10597D' }}>
          <Provider store={store}>
            <Inicio navigation={{ activeTab }} />
          </Provider>	
      </View>
      <NavBar activeTab={activeTab} onTabPress={handleTabPress} />
      <StatusBar style="light" />
    </>
  );
};

export default WebView;
