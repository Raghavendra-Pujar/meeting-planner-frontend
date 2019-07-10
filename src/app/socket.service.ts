import { Injectable } from '@angular/core';
import * as io from 'socket.io-client'
import { Observable } from 'rxjs'
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private url = 'http://api.meeting.raghavendra-pujar.site';
  public socket;
  public authToken;
  constructor(public cookie:CookieService,public http:HttpClient) { 
    this.authToken = this.cookie.get('authToken') || localStorage.getItem('authToken');
    this.socket = io(this.url);
  }



  public verifyUser = ()=>{
    console.log('verify user called')
     return Observable.create((observer)=>{
       this.socket.on('verifyUser',(data)=>{
         console.log('inside socket verifyUser')
         observer.next();
       })
     })
  }
  
  public setUser() {
   this.socket.emit('set-user', this.authToken)
   console.log("setting user")
 }

 public authError() {
   return new Observable((obs) => {
     this.socket.on('authError', () => {
       obs.next()
     })
   })
 }


 public meetingNotification = (userId:String) =>{
   console.log('reaached client')
   console.log(userId);
   return new Observable((obs)=>{
     this.socket.on(userId,(notification)=>{
       console.log('arrived notification');
       obs.next(notification);
     })
   })
 }






}
