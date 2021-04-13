import * as dotenv from 'dotenv';
import { Env } from '../typings';

dotenv.config();

const env: Env = {
  apiVersion: process.env.API_VERSION,
  httpPort: (process.env.PORT && parseInt(process.env.PORT, 10)) || 3000,
  httpBodyLimit: process.env.BODY_LIMIT || '10kb',
  
  cashbackServiceUrl: process.env.BACKOFFICE_SERVICE_CASHBACK_URL,
  
  accessManagerUrl: process.env.ACCESS_MANAGER_URL,
  
  keycloakRealm: process.env.KEY_CLOAK_REALM || '',
  keycloakUrl: process.env.KEYCLOAK_URL,
  
  realmPhi: process.env.REALM_PHI,
  realmBackoffice: process.env.REALM_BACKOFFICE,
  
  phiClientId: process.env.PHI_CLIENT_ID,
  phiClientSecret: process.env.PHI_CLIENT_SECRET,
  
  backofficeClientId: process.env.BACKOFFICE_CLIENT_ID,
  backofficeClientSecret: process.env.BACKOFFICE_CLIENT_SECRET,
}; 

export default env; 