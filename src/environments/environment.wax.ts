const chain = '1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4';
export const environment = {
    production: true,
    appName: 'WAXweb',
    network: {
        blockchain: 'eos',
        host: 'wax.cryptolions.io',
        port: 443,
        protocol: 'https',
        expireInSeconds: 120,
        chainId: chain
    },
    chain: chain,
    Eos: {
        httpEndpoint: 'https://wax.cryptolions.io',
        chainId: chain,
        verbose: false
    },
    frontConfig: {
       coin: 'WAX',
       bp: 'bp.json',
       tokenContract: 'eosio.token',
       totalBalance: 'WAX',
       convertToUSD: true,
       customBalance: false,
       logo: '/assets/images/wax.png',
       name: {
          big: 'wax',
          small: 'web'
       },
       nets: [{ name: 'Mainnet', url: 'https://eosweb.net', active: false },
              { name: 'Jungle', url: 'https://jungle.eosweb.net', active: false },
              { name: 'Europechain', url: 'https://xec.eosweb.net', active: false },
              { name: 'WAX', url: 'https://wax.eosweb.net', active: true },
              { name: 'LYNX', url: 'https://lynx.eosweb.net', active: false }],
       disableNets: false,
       voteDonationAcc: 'cryptolions1',
       disableVoteDonation: false,
       version: '1.0.0',
       producers: 1000,
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