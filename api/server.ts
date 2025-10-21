import app from "./tina";
import { env } from "../env";

const PORT = env.BACKEND_PORT || 4001;

app.listen(PORT, () => {
  console.log(`🦙 TinaCMS Backend rodando em ${env.FRONTEND_TINA_API_URL}`);
  console.log(`   GraphQL: ${env.FRONTEND_TINA_GRAPHQL_URL}`);
  console.log(`   Health: ${env.FRONTEND_TINA_API_URL}/health`);
});
