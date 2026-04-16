declare module 'react-native-jwt-io' {
  const jwt: {
    encode(payload: object, secret: string): string;
    decode(token: string): object;
  };

  export default jwt;
}