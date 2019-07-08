const chain = '26cb0c47ce429d6a489d4aa088abe1c8daaffb352fd048b9cd2b5a9ebff0b965';
export const environment = {
    production: true,
    appName: 'XECweb',
    network: {
        blockchain: 'eos',
        host: 'api.xec.cryptolions.io',
        port: 443,
        protocol: 'https',
        expireInSeconds: 120,
        chainId: chain
    },
    chain: chain,
    Eos: {
        httpEndpoint: 'https://api.xec.cryptolions.io',
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
          big: 'xec',
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