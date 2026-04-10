import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Digio, Environment, ServiceMode, DigioConfig } from '@digiotech/react-native';
import type { GatewayEvent } from '@digiotech/react-native';

export default function App() {
  const [digioResult, setDigioResult] = useState<any | null>(null);
  const [digioEvent, setDigioEvent] = useState<string | null>(null);
  const digioRef = useRef<any>(null);

  const additionalData: Record<string, string> = {};
  additionalData["dg_preferred_auth_type"] = "debit";

  useEffect(() => {


  const digioConfig: DigioConfig = {
  environment: Environment.SANDBOX,
  serviceMode: ServiceMode.OTP,
  logo:'https://www.digio.in/images/digio_blue.png',
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
        'KID2604091301595013JYPOM7FPAHV3N',
        'akash.kumar@digio.in',
        'GWT260409130159518V4LQ8ODNAB6NDS',
        additionalData
      )
      .then((res: any) => {
        console.log(res);
        if (res !== undefined) {
          setDigioResult(res);
        }
      })
      .catch((err: any) => console.error(err));
  };

  // This is for stateless feature
  const startStatelessFlow = () => {
  digioRef.current
    ?.startStateless({
      clientId: "AIMEV4BA6BE2MRYI7VUQ77HIO4PARA27UK",
      clientSecretKey: "",
      taskTypes: ["SELFIE"],
      locationRequired: true,
      shouldShowInstructions: false,
      token: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0cmFuc2FjdGlvbl9pZCI6IlRYTjE3NzU4MDIxNjYyMDIyMjQzIiwidGVtcGxhdGVfbmFtZSI6IkpXVF9TRUxGSUVfVEVTVCIsImN1c3RvbWVyX2lkZW50aWZpZXIiOiJha2FzaC5rdW1hckBkaWdpby5pbiIsImV4cCI6MTc3NjY2NjE2Nn0.OOPDE3M2xiX5RAB4s1fqoM_xEctTn2Zg_b4tllSPYqM"
    })
    .then((res: any) => {
      console.log(res);
      setDigioResult(res);
    })
    .catch((err: any) => console.error(err));
};

  return (
     
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingTop: 20, paddingBottom: 20 }}>
      <Text>Digio Sample</Text>
      <View style={styles.resultContainer}>
        <Text>Result:</Text>
        <Text>{digioResult ? JSON.stringify(digioResult) : 'Waiting...'}</Text>
      </View>
      <View style={styles.eventContainer}>
        <Text>Event:</Text>
        <Text>{digioEvent ? digioEvent : 'Waiting...'}</Text>
      </View>
</ScrollView>
      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={startDigioFlow}>
        <Text style={styles.fabText}>►</Text>
      </TouchableOpacity>

          {/* Floating Action Button 2 */}
    <TouchableOpacity style={styles.fabSecond} onPress={startStatelessFlow}>
      <Text style={styles.fabText}>⚡</Text>
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
    fabSecond: {
  position: 'absolute',
  bottom: 30,
  right: 90, // move left so it doesn't overlap
  width: 60,
  height: 60,
  borderRadius: 30,
  backgroundColor: '#03dac6',
  justifyContent: 'center',
  alignItems: 'center',
  elevation: 5,
},
  fabText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
});
