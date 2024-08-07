
import { Client, fetchExchange } from 'urql';

const API_KEY = import.meta.env.VITE_API_KEY;
const httpUrl = 'https://api.memomeister.com/graphql';

const client = new Client({
  url: httpUrl,
  fetchOptions: () => {
    return {
      headers: {
        authorization: API_KEY ? `api-key ${API_KEY}` : '',
        'user-agent': 'API urql demo application',
      },
    };
  },
  exchanges: [fetchExchange],
});

export default client