import { Injectable } from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

//import 'rxjs/add/observable/throw';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public baseUrl = 'http://api.meeting.raghavendra-pujar.site/api/v1';
  constructor(public http : HttpClient,public cookie:CookieService) { 
  }

  public login = (email: any,password: any):Observable<any> =>{
    const params = new HttpParams()
    .set('email',email)
    .set('password',password);
    return this.http.post(`${this.baseUrl}/users/login`,params);
  }

  public signup = (firstName,lastName,userName,email,password,countryCode,mobileNumber):Observable<any>=>{
    const params = new HttpParams()
    .set('firstName',firstName)
    .set('lastName',lastName)
    .set('userName',userName)
    .set('email',email)
    .set('password',password)
    .set('countryCode',countryCode)
    .set('mobileNumber',mobileNumber)

    return this.http.post(`${this.baseUrl}/users/signup`,params);
  }

  public logout = ():Observable<any>=>{
    const params = new HttpParams()
    .set('authToken',this.cookie.get('authToken')|| localStorage.getItem('authToken'));
    return this.http.post(`${this.baseUrl}/users/logout`,params);
  }

  public forgotPassword = (email):Observable<any>=>{
    const params = new HttpParams()
    .set('email',email)

    return this.http.post(`${this.baseUrl}/users/forgotPassword`,params);
  }

  public resetPassword = (authToken,password):Observable<any>=>{
    const params = new HttpParams()
    .set('authToken',authToken)
    .set('password',password)

    return this.http.post(`${this.baseUrl}/users/resetPassword`,params);
  }

  public listUsers = (pageNo,itemLimit):Observable<any> =>{
    const params = new HttpParams()
    .set('authToken',this.cookie.get('authToken'))
    .set('pageNo',pageNo)
    .set('size',itemLimit);
    return this.http.post(`${this.baseUrl}/users/listNormalUsers`,params);
  }


  public createMeeting = (title,participantId,from,to,purpose,location,priority):Observable<any> =>{
    const params = new HttpParams()
    .set('authToken',this.cookie.get('authToken'))
    .set('title',title)
    .set('participantId',participantId)
    .set('from',from)
    .set('to',to)
    .set('purpose',purpose)
    .set('location',location)
    .set('priority',priority);

    return this.http.post(`${this.baseUrl}/meeting/create`,params);

  }

  public getMeetingsByUserId = (userId?):Observable<any>=>{
    const params = new HttpParams()
    .set('authToken',this.cookie.get('authToken'))
    .set('userId',userId);
    console.log(params);
    return this.http.post(`${this.baseUrl}/meeting/getMeetingByUser`,params)
  }

  public getMeetingdByMeetingId = (meetingId):Observable<any>=>{
    console.log(meetingId)
    const params = new HttpParams()
    .set('authToken',this.cookie.get('authToken'))
    .set('meetingId',meetingId)
    console.log(params);
    return this.http.post(`${this.baseUrl}/meeting/getMeetingBymeetingId`,params);
  }

  public editMeeting = (meetingId,title,from,to,purpose,location,priority,userId):Observable<any> =>{
    const params = new HttpParams()
    .set('authToken',this.cookie.get('authToken'))
    .set('meetingId',meetingId)
    .set('title',title)
    .set('from',from)
    .set('to',to)
    .set('purpose',purpose)
    .set('location',location)
    .set('priority',priority)
    .set('participantId',userId)

    return this.http.post(`${this.baseUrl}/meeting/editMeeting`,params);
  }

  public deleteMeeting = (meetingId):Observable<any>=>{
    const params = new HttpParams()
    .set('authToken',this.cookie.get('authToken'))
    .set('meetingId',meetingId);
    console.log(params);
    return this.http.post(`${this.baseUrl}/meeting/deleteMeeting`,params)
  }



  public handleError(err: HttpErrorResponse):Observable<any> {

    let errorMessage = '';

    if (err.error instanceof Error) {

      errorMessage = `An error occurred: ${err.error.message}`;

    } else {

      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;

    } // end condition *if

    console.error(errorMessage);

    return throwError(errorMessage);

  }
}
