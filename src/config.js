export default {
  API_URL:
    process.env.NODE_ENV === "development"
      ? "https://staging.caravan-barometer.de/api"
      : "https://staging.caravan-barometer.de/api",
  STRAPI_SOCKET:
    process.env.NODE_ENV === "development"
      ? "http://localhost:1338"
      : "https://staging.caravan-barometer.de",
  SERVER_URL:
    process.env.NODE_ENV === "development"
      ? "https://staging.caravan-barometer.de/api2"
      : "https://staging.caravan-barometer.de/api2",
  AZURE_B2C_URL:
    "https://managementb2c.b2clogin.com/managementb2c.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_final2&client_id=f5031a68-8fd6-43e3-9a1a-b708a9b448f3&nonce=defaultNonce&redirect_uri=https%3A%2F%2Fstaging.caravan-barometer.de%2Fadmin&scope=openid&response_type=id_token&prompt=login",
  BAROMETER_API_URL:
    process.env.NODE_ENV === "development"
      ? "http://127.0.0.1:8000/barometer"
      : "https://staging.caravan-barometer.de/barometer",
  CHATROOM_API:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3001"
      : "https://staging.caravan-barometer.de",
};
