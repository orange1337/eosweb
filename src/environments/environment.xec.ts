const chain = 'f778f7d2f124b110e0a71245b310c1d0ac1a0edd21f131c5ecb2e2bc03e8fe2e';
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
       disableVoteDonation: true,
       version: '1.0.0',
       producers: 100,
       social: [
         { link: '', icon: 'fa-facebook' },
         { link: '', icon: 'fa-reddit-alien' },
         { link: 'https://github.com/Europechain', icon: 'fa-github' },
         { link: 'https://medium.com/europechain', icon: 'fa-medium' },
         { link: 'https://twitter.com/europechain_', icon: 'fa-twitter' },
         { link: 'https://t.me/europechain', icon: 'fa-telegram-plane' }
       ]
    }
};