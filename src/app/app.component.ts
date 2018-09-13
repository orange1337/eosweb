import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
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

  constructor(private http: HttpClient, private router: Router){}

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

  activeMenu(){
    return this.router.url;
  }

  onKey(event: any){
     if (event.keyCode === 13) {
         this.searchGlobal(event.target.value);
     }
  }
}
