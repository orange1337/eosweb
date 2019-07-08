import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import * as moment from 'moment';
import { environment } from '../environments/environment';

import { ScatterService } from './services/scatter.service';
import { LoginEOSService } from 'eos-ulm';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public options = {
      position: ["top", "right"],
      timeOut: 5000,
      lastOnBottom: true,
      showProgressBar: false,
      pauseOnHover: true,
      clickToClose: false,
      clickIconToClose: true,
      animate: "scale"
  };
  search;
  frontConfig = environment.frontConfig;
  env = environment;
  netName;
  networks = [];
  darkTheme = (localStorage.getItem('darkTheme') === 'true') ? true : false;

  constructor(private http: HttpClient, 
              private router: Router,
              public scatterService: ScatterService,
              public loginEOSService: LoginEOSService){}

  searchGlobal(text){
    if (!text) {
        return console.log('Input is empty!');
    }
    text = text.replace(/ /g, '')
      this.http.post('/api/v1/search', { text: text })
               .subscribe((res :any) =>{
                   if (res.block && !isNaN(+this.search)){
                      this.router.navigate(['/block', res.block.block_num]);
                   } else if (res.transaction){
                      this.router.navigate(['/transaction', res.transaction.id]);
                   } else if (res.account){
                      this.router.navigate(['/account', res.account.account_name]);
                   } else if (res.key){
                      this.router.navigate(['/address', text ]);
                   } else {
                      this.router.navigate(['/notfound']);
                   }
                   this.search = '';
               },
               (err) =>{
                   console.error(err);
               });
  }

  getMainFrontConfig(){
    this.frontConfig.nets.forEach(elem => {
          if (elem.active){
             return this.netName = elem.name;
          }
          this.networks.push(elem);
    });
  }

  activeMenu(){
    return this.router.url;
  }

  darkEnable(mode){
      localStorage.setItem('darkTheme', mode);
      this.darkTheme = mode;
  }

  ngOnInit(){
    this.getMainFrontConfig();
    this.loginEOSService.loggedIn.subscribe(res => {
           this.scatterService.getAccount();
    });
    this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            window.scrollTo(0, 0)
    });
  }

  onKey(event: any){
     if (event.keyCode === 13) {
         this.searchGlobal(event.target.value);
     }
  }
}
