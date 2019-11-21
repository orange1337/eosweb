const chain = 'b62febe5aadff3d5399090b9565cb420387d3c66f2ccd7c7ac1f532c4f50f573';
export const environment = {
    production: true,
    appName: 'LYNXweb',
    network: {
        blockchain: 'eos',
        host: 'lynx.cryptolions.io',
        port: 443,
        protocol: 'https',
        expireInSeconds: 120,
        chainId: chain
    },
    chain: chain,
    Eos: {
        httpEndpoint: 'https://lynx.cryptolions.io',
        chainId: chain,
        verbose: false
    },
    frontConfig: {
       coin: 'LNX',
       bp: 'lynx.json',
       tokenContract: 'eosio.token',
       totalBalance: 'LNX',
       convertToUSD: false,
       customBalance: false,
       logo: '/assets/images/lynx.png',
       name: {
          big: 'lynx',
          small: 'web'
       },
       nets: [{ name: 'Mainnet', url: 'https://eosweb.net', active: false },
              { name: 'Jungle', url: 'https://jungle.eosweb.net', active: false },
              { name: 'Europechain', url: 'https://xec.eosweb.net', active: false },
              { name: 'WAX', url: 'https://wax.eosweb.net', active: false },
              { name: 'LYNX', url: 'https://lynx.eosweb.net', active: true }],
       disableNets: false,
       voteDonationAcc: 'cryptolions',
       disableVoteDonation: true,
       version: '1.0.0',
       producers: 100,
       social: [
         { link: '', icon: 'fa-facebook' },
         { link: '', icon: 'fa-reddit-alien' },
         { link: '', icon: 'fa-github' },
         { link: 'https://medium.com/lynxwallet', icon: 'fa-medium' },
         { link: 'https://twitter.com/Lynxwallet', icon: 'fa-twitter' },
         { link: 'https://t.me/LynxChain', icon: 'fa-telegram-plane' }
       ],
       liveTXenable: true
    }
};