import { Component, OnInit } from '@angular/core';
import { Action } from 'rxjs/internal/scheduler/Action';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import Swal from 'sweetalert2';
import { CookieService } from 'ngx-cookie-service';
import { timer } from 'rxjs';
import {Location} from '@angular/common'
import { SocketService } from 'src/app/socket.service';

@Component({
  selector: 'app-edit-meeting',
  templateUrl: './edit-meeting.component.html',
  styleUrls: ['./edit-meeting.component.css']
})
export class EditMeetingComponent implements OnInit {
  public meetingId;
  public meeting:any;
  public start;
  public end;
  public isAdmin;
  public editFlag: Boolean = false;
  public userId;
  public loaderFlag: Boolean = false;
  public fullName ;
  public dashboard = "admin";
  public notAdmin=true;
  public loggedin;

  constructor(public route:ActivatedRoute,public api: ApiService,public cookie:CookieService,
    public router: Router,private _location: Location,public socket:SocketService) { }

  ngOnInit() {
    this.meetingId = this.route.snapshot.paramMap.get('meetingId');
    this.getMeetingDetails();

    this.isAdmin = this.cookie.get('isAdmin')
    if(this.isAdmin === 'yes') this.editFlag = true;
    else this.editFlag = false;

    this.loggedin = this.cookie.get('fullName') || localStorage.getItem('fullName')
    console.log(this.loggedin)

    if(this.cookie.get('isAdmin') === 'yes') this.notAdmin = false;
    if(this.notAdmin){
      this.socket.verifyUser();
      this.socket.setUser();
      this.createNotification();
    }
  }

  public getMeetingDetails = ()=>{
    this.api.getMeetingdByMeetingId(this.meetingId).subscribe((apiResponse:any)=>{
      if(apiResponse.status === 200){
        this.meeting = apiResponse.data;
        console.log(this.meeting)
        this.start = new Date(apiResponse.data.from);
        this.end = new Date(apiResponse.data.to);
        this.userId = this.meeting.participator.userId;
        this.fullName = `${this.meeting.assigner.firstName} ${this.meeting.assigner.lastName}`;
      
      }else if(apiResponse.status === 500){
        Swal.fire({
          position:'top-right',
          title: 'Request Forbidden',
          text: apiResponse.message,
          toast: true
        })

        this.router.navigate(['/500']);
      }else if(apiResponse.status === 404){
        Swal.fire({
          position:'top-right',
          title: 'Request Not Found',
          text: apiResponse.message,
          toast: true
        })

        this.router.navigate(['/404']);
      }
    })
  }

  public editMeeting = () =>{
    this.api.editMeeting(this.meetingId,this.meeting.title,this.start.toISOString(),this.end.toISOString(),this.meeting.purpose,this.meeting.location,this.meeting.priority,this.userId).subscribe((apiResponse:any)=>{
      this.loaderFlag = true;
      console.log(apiResponse)
      if(apiResponse.status === 200){
        Swal.fire({
          title : 'Meeting Updated sucessfully',
          toast: true,
          timer:3000,
          position:'top-right'
        })
        this.loaderFlag = false;
        this.router.navigate(['/user',this.userId])
      }else if(apiResponse.status === 500){
        Swal.fire({
          position:'top-right',
          title: 'Request Forbidden',
          text: apiResponse.message,
          toast: true
        })

        this.router.navigate(['/500']);
      }else if(apiResponse.status === 404){
        Swal.fire({
          position:'top-right',
          title: 'Request Not Found',
          text: apiResponse.message,
          toast: true
        })

        this.router.navigate(['/404']);
      }
    })
  }

  public deleteClick = () =>{

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.deleteMeeting(this.meetingId)
      }
    })


  }

  public deleteMeeting = (meetingId) =>{
    console.log(meetingId);
    this.api.deleteMeeting(meetingId).subscribe((apiResponse:any)=>{
      console.log(apiResponse);
      if(apiResponse.status === 200){
        console.log(apiResponse);
        Swal.fire(
          'Deleted!',
          'Meeting has been cancelled.',
          'success'
        )
        this.router.navigate(['/user',this.userId]);
      }else if(apiResponse.status === 500){
        Swal.fire({
          position:'top-right',
          title: 'Request Forbidden',
          text: apiResponse.message,
          toast: true
        })

        this.router.navigate(['/500']);
      }else if(apiResponse.status === 404){
        Swal.fire({
          position:'top-right',
          title: 'Request Not Found',
          text: apiResponse.message,
          toast: true
        })

        this.router.navigate(['/404']);
      }
    })
  }

  public goBack=()=>{
    this._location.back();
  }


  public createNotification=()=>{
    this.socket.meetingNotification(this.userId).subscribe((socketResponse:any)=>{
      console.log(socketResponse);
      if(socketResponse.meetingType === 'reminder'){
       this.reminderAlert(socketResponse);
      }else{
      Swal.fire({
        toast:true,
        position:'top-right',
        title:socketResponse.title,
        text:socketResponse.message,
        timer:5000
      })
    }
       // this.refresh.next();
    })

  }

  public reminderAlert=(socketResponse)=>{
    Swal.fire({
      toast:true,
      position:'top-right',
      title:socketResponse.title,
      text:socketResponse.message,
      timer:(60*1000),
      confirmButtonText:'Snooze',
      showCloseButton:true,
      closeButtonAriaLabel:'Dismiss',
      type:'warning'

    }).then((result)=>{
      if(result.value){
      setTimeout(()=>{
        this.reminderAlert(socketResponse)
      },5000)
    }else{
      Swal.fire({
       title: 'Dismissed!',
       text:'You will not receive further alerts for this meeting',
       type :'info',
       position:'top-right'
        
      })
    }
    })
  }

}
