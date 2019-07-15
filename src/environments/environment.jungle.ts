const chain = 'e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473';
export const environment = {
    production: false,
    appName: 'EOSweb Jungle Testnet',
    network: {
        blockchain: 'eos',
        host: 'jungle2.cryptolions.io',
        port: 443,
        protocol: 'https',
        expireInSeconds: 120,
        chainId: chain
    },
    chain: chain,
    Eos: {
        httpEndpoint: 'https://jungle2.cryptolions.io',
        chainId: chain,
        verbose: false
    },
    frontConfig: {
       coin: 'EOS',
       tokenContract: 'eosio.token',
       totalBalance: 'EOS',
       convertToUSD: true,
       customBalance: false,
       logo: '/assets/images/jungle.png',
       name: {
          big: 'eos',
          small: 'web'
       },
       nets: [{ name: 'Mainnet', url: 'https://eosweb.net', active: false },
              { name: 'Jungle', url: 'https://jungle.eosweb.net', active: true }],
       disableNets: false,
       voteDonationAcc: 'lioninjungle',
       disableVoteDonation: false,
       version: '2.2.8',
       producers: 500,
       social: [
         { link: 'https://github.com/orange1337/eosweb', icon: 'fa-github' },
         { link: 'https://www.facebook.com/EOSwebnet-199076424068961', icon: 'fa-facebook' },
         { link: 'https://www.reddit.com/user/eosweb', icon: 'fa-reddit-alien' },
         { link: 'https://medium.com/@EoswebN', icon: 'fa-medium' },
         { link: 'https://twitter.com/EoswebN', icon: 'fa-twitter' },
         { link: 'https://t.me/eoswebdevchat', icon: 'fa-telegram-plane' }
       ],
       liveTXenable: true
    }
};
