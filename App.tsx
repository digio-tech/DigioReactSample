import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Digio, Environment, ServiceMode, DigioConfig } from '@digiotech/react-native';
import type { GatewayEvent } from '@digiotech/react-native';

export default function App() {
  const [digioResult, setDigioResult] = useState<any | null>(null);
  const [digioEvent, setDigioEvent] = useState<string | null>(null);
  const digioRef = useRef<any>(null);

  useEffect(() => {

    const digioConfig: DigioConfig = {
  environment: Environment.PRODUCTION,
  serviceMode: ServiceMode.OTP,
  logo: 'https://www.gstatic.com/mobilesdk/160503_mobilesdk/logo/2x/firebase_28dp.png',
  theme: {
    primaryColor: '#b03a2e',
    secondaryColor: '#b03a2e',
    fontFamily: '',
    fontUrl: '',
    fontFormat: '',
  },
};


    // Initialize Digio only once
     digioRef.current = new Digio(digioConfig);

    const digioGatewayEventSubscription = digioRef.current.addGatewayEventListener(
      (event: GatewayEvent) => {
        console.log('Digio_event ' + event.event);
        if (event.event !== undefined) {
          setDigioEvent(event.event);
        }
      }
    );

    return () => {
      digioGatewayEventSubscription.remove();
    };
  }, []);

  const startDigioFlow = () => {
    digioRef.current
      ?.start(
        'KID260116135930450KHFQJGAE5UPTD5',
        'akash.kumar@digio.in',
        'GWT260116135930469YBFLM9OLJSPUCS'
      )
      .then((res: any) => {
        console.log(res);
        if (res !== undefined) {
          setDigioResult(res);
        }
      })
      .catch((err: any) => console.error(err));
  };

  return (
    <View style={styles.container}>
      <Text>Digio Sample</Text>
      <View style={styles.resultContainer}>
        <Text>Result:</Text>
        <Text>{digioResult ? JSON.stringify(digioResult) : 'Waiting...'}</Text>
      </View>
      <View style={styles.eventContainer}>
        <Text>Event:</Text>
        <Text>{digioEvent ? digioEvent : 'Waiting...'}</Text>
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={startDigioFlow}>
        <Text style={styles.fabText}>►</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  eventContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#6200ee',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  fabText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
});
