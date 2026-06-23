import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Digio, Environment, ServiceMode, DigioConfig } from '@digiotech/react-native';
import type { GatewayEvent } from '@digiotech/react-native';

import jwt from 'react-native-jwt-io';


export default function App() {
  const [digioResult, setDigioResult] = useState<any | null>(null);
  const [digioEvent, setDigioEvent] = useState<string | null>(null);
  const digioRef = useRef<any>(null);

  const additionalData: Record<string, string> = {};
  additionalData["dg_preferred_auth_type"] = "debit";

  useEffect(() => {


  const digioConfig: DigioConfig = {
  environment: Environment.PRODUCTION,
  serviceMode: ServiceMode.OTP,
  logo:'https://www.digio.in/images/digio_blue.png',
  theme: {
    primaryColor: '#75514d',
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
        'KIDXXX8252B33B1WZQSQ38S',
        'akash.kumar@digio.in',
        'GWT26062218XXXXOINZSMVH9K5LS',
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
    const txnId = `TXN${Date.now()}${Math.floor(1000 + Math.random() * 9000)}`;
    const token =  generateToken(
      "your client secret key", 
      txnId,
      "your template name",
      "identifier",
      10000 // time to expire in seconds
    );
    console.log(token);
    
  digioRef.current
    ?.startStateless({
      clientId: "Your clinet Id", // clinet_id and client secert provided by digio
      clientSecretKey: "", //(keep empty)
      taskTypes: ["SELFIE"],
      locationRequired: true,
      shouldShowInstructions: false,
      token: token
      
    }) 
    .then((res: any) => {
      console.log(res);
      setDigioResult(res);
    })
    .catch((err: any) => console.error(err));
};



// token generation locally for testing. But token generation should be happen from backend
const generateToken = (
  clientSecret: string,
  transactionId: string,
  templateName: string,
  customerIdentifier: string,
  expirySeconds: number
): string => {
  const payload = {
    transaction_id: transactionId,
    template_name: templateName,
    customer_identifier: customerIdentifier,
    exp: Math.floor(Date.now() / 1000) + expirySeconds,
  };

  return `Bearer ${jwt.encode(payload, clientSecret)}`;
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
