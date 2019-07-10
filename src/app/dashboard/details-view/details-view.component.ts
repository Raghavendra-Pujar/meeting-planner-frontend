import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { Route, Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2'
import { CookieService } from 'ngx-cookie-service';
import {Location} from '@angular/common'
import { SocketService } from 'src/app/socket.service';


@Component({
  selector: 'app-details-view',
  templateUrl: './details-view.component.html',
  styleUrls: ['./details-view.component.css']
})
export class DetailsViewComponent implements OnInit {
  public start;
  public  end;
  public title;
  public  purpose;
  public location;
  public participantId;
  public dashboard;
  public notAdmin = true;
  public Toast = Swal.mixin({
    position: 'top-right',
    timer: 3000,
    animation:true
  })
  public priority;

  public userId = localStorage.getItem('userId') || this.cookie.get('userId');

  public fullName;
  constructor(public api : ApiService,public route: ActivatedRoute,public router : Router,public cookie:CookieService,public _location:Location,
    public socket: SocketService) { 

  }
  ngOnInit() {
    this.participantId = this.route.snapshot.paramMap.get('userId');
    console.log(this.participantId)
    console.log(this.priority);

    if(this.participantId){
      this.dashboard="admin";
    }else{
      this.dashboard="user";
    }
    this.fullName = this.cookie.get('fullName') || localStorage.getItem('fullName');

    if(this.cookie.get('isAdmin') === 'yes') this.notAdmin = false;
    if(this.notAdmin){
      this.socket.verifyUser();
      this.socket.setUser();
      this.createNotification();
    }
  }
  
  

  public goBack =()=>{
    this._location.back();
  }
  public createMeeting = () =>{
   // console.log(this.start.toISOString())    
    //console.log(this.end.toISOString());

  if(!this.title){
    this.Toast.fire({
      title:'Title is required',
      type:'warning'
    })

  }else if(!this.purpose){
    this.Toast.fire({
      title:'Purpose is required',
      type:'warning'
    })

  }else if(!this.start){
    this.Toast.fire({
      title:'Starting Time is required',
      type:'warning'
    })

  }else if(!this.end){
    this.Toast.fire({
      title:'Ending Time is required',
      type:'warning'
    })

  }else if(!this.location){
    this.Toast.fire({
      title:'Location is required',
      type:'warning'
    })

  }else if(!this.priority){
    this.Toast.fire({
      title:'Priority is required',
      type:'warning'
    })

  }else{
    this.api.createMeeting(this.title,this.participantId,this.start.toISOString(),this.end.toISOString(),this.purpose,this.location,this.priority).subscribe((apiResponse: any) =>{
      console.log(apiResponse);
      if(apiResponse.status === 200){
        this.Toast.fire({
          title : apiResponse.message,
          type : 'success'
        })
        this.router.navigate(['/user',this.participantId])
        console.log(apiResponse)
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
