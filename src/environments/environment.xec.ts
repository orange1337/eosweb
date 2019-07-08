const chain = '3feda55004306ea093f725febe25d10bd9d8104bbca2ab82804b901d3a23f976';
export const environment = {
    production: true,
    appName: 'XECweb',
    network: {
        blockchain: 'eos',
        host: 'testnet.europechain.io',
        port: 4388,
        protocol: 'https',
        expireInSeconds: 120,
        chainId: chain
    },
    chain: chain,
    Eos: {
        httpEndpoint: 'https://testnet.europechain.io',
        chainId: chain,
        verbose: false
    },
    frontConfig: {
       coin: 'XEC',
       tokenContract: 'eosio.token',
       totalBalance: 'XEC',
       convertToUSD: false,
       customBalance: false,
       logo: '/assets/images/xec.png',
       name: {
          big: 'XEC',
          small: 'web'
       },
       nets: [{ name: 'Europechain', url: 'https://xec.eosweb.net', active: true },
              { name: 'Mainnet', url: 'https://eosweb.net', active: false },
              { name: 'Jungle', url: 'https://jungle.eosweb.net', active: false }],
       disableNets: false,
       voteDonationAcc: 'eoswebnetbp1',
       disableVoteDonation: false,
       version: '1.0.0',
       producers: 100
    }
};