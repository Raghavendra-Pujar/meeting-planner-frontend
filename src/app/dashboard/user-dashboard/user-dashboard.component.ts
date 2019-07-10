import {
  Component, OnInit, ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  ViewContainerRef,
  ViewEncapsulation,
  ChangeDetectorRef
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { CalendarCommonModule, CalendarMonthModule, CalendarMonthViewDay } from 'angular-calendar';
import { DayViewHour, CalendarEvent } from 'calendar-utils';
import { ApiService } from 'src/app/api.service';
import * as $ from 'jquery';
import { ActivatedRoute, Router } from '@angular/router';
import { routerNgProbeToken } from '@angular/router/src/router_module';
import { CookieService } from 'ngx-cookie-service';
import { SocketService } from 'src/app/socket.service';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  public usersList = [];
  temp: Date;
  constructor(public api: ApiService, public route: ActivatedRoute, public router: Router, public cookie: CookieService
    , public socket: SocketService, public cd: ChangeDetectorRef) {

  }

  view = 'month';

  viewDate: Date = new Date();

  selectedMonthViewDay: CalendarMonthViewDay;

  selectedDayViewDate: Date;

  dayView: DayViewHour[];

  events: CalendarEvent[] = [];

  refresh: Subject<any>;

  selectedDays: any = [];
  selectedDateTime: Date;


  /////////////////////////////////

  public meetingList: any = {};

  //////////////////////
  public userId;
  public fullName;
  public notAdmin = true;
  public dashboard;
  public currentYear= new Date().getFullYear();
  public previous = false;
  public next = false;
  public currentTime = new Date();
  
  public colors: any = {
    red: {
      primary: '#ad2121',
      secondary: '#FAE3E3'
    },
    blue: {
      primary: '#1e90ff',
      secondary: '#D1E8FF'
    },
    yellow: {
      primary: '#e3bc08',
      secondary: '#FDF1BA'
    }
  };



  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('userId') || this.cookie.get('userId') || localStorage.getItem('userId');
    if (this.userId) {
      this.getAllMeetingsAdmin();

    }
    else {

      this.getAllMeetings();

    }

    if (this.route.snapshot.paramMap.get('userId')) {
      this.dashboard = "admin";
    } else {
      this.dashboard = "user";
    }
    console.log(this.dashboard);
    console.log(this.cookie.get('isAdmin'))
    if (this.cookie.get('isAdmin') === 'yes') this.notAdmin = false; else this.notAdmin = true;
    this.fullName = localStorage.getItem('fullName') || this.cookie.get('fullName')

    if (this.notAdmin) {
      this.socket.verifyUser();
      this.socket.setUser();
      this.createNotification();
    }

  

  }



  dayClicked(day: CalendarMonthViewDay): void {
    this.selectedMonthViewDay = day;
    this.selectedDateTime = this.selectedMonthViewDay.date;
    console.log(this.selectedDateTime)
    //console.log(this.selectedMonthViewDay)
    $('#modal-trigger').trigger('click');
  }

  

  //get all Meetings

  public getAllMeetings = () => {
    this.api.getMeetingsByUserId().subscribe((apiResponse: any) => {
      console.log(apiResponse);
      if (apiResponse.status === 200) {
        this.events = apiResponse.data.map((meeting) => {
          meeting.end = new Date(meeting.to)
          meeting.start = new Date(meeting.from)
          if(meeting.priority == 1) meeting.color = this.colors.blue;
          if(meeting.priority == 2) meeting.color = this.colors.yellow;
          if(meeting.priority == 3) meeting.color = this.colors.red;
          this.meetingList.meta.incrementsBadgeTotal = true;
          return meeting
        })



        console.log(this.events);
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

      //  this.router.navigate(['/404']);
      }

    })
  //  this.refresh.next();


  }

 
  public getAllMeetingsAdmin() {
    this.api.getMeetingsByUserId(this.userId).subscribe((apiResponse: any) => {
      console.log(apiResponse);
      if (apiResponse.status === 200) {
        this.events = apiResponse.data.map((meeting) => {
          console.log(meeting.from);
         
          meeting.end = new Date(meeting.to)
          meeting.start = new Date(meeting.from)
          if(meeting.priority == 1) meeting.color = this.colors.blue;
          if(meeting.priority == 2) meeting.color = this.colors.yellow;
          if(meeting.priority == 3) meeting.color = this.colors.red;
          //this.meetingList.meta.incrementsBadgeTotal = true;
          return meeting
          
        })
        console.log(this.events);
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

       // this.router.navigate(['/404']);
      }

    })

  }



 

  public eventClicked(event): void {
    console.log("Event Clicked");
    console.log(event);
    $('.close').trigger('click');
    this.router.navigate(['/edit', event.event.meetingId])
  }

  public disablePrevious(currentDay):void{
    if(this.currentYear === currentDay.getFullYear() && currentDay.getMonth()===0){
      this.previous = true;
      this.next = false;
    }else{
      this.previous = false;
      this.next = false;
    }
    
  }

  public disableNext(currentDay):void{
    if(this.currentYear === currentDay.getFullYear() && currentDay.getMonth()===11){
      this.next = true;
      this.previous = false;
    }else{
      this.next = false;
      this.previous = false;
    }
  }

  public enableBoth = ()=>{
    this.previous = false;
    this.next = false;
  }

  public createNotification = () => {
    this.socket.meetingNotification(this.userId).subscribe((socketResponse: any) => {
      console.log(socketResponse);
      if (socketResponse.meetingType === 'reminder') {
       // this.refresh.next();
        this.reminderAlert(socketResponse);
      } else {
        Swal.fire({
          toast: true,
          position: 'top-right',
          title: socketResponse.title,
          text: socketResponse.message,
          timer: 5000
        })


      }
   //   this.refresh.next();
    })

  }

  public reminderAlert = (socketResponse) => {
    Swal.fire({
      toast: true,
      position: 'top-right',
      title: socketResponse.title,
      text: socketResponse.message,
      timer: (60 * 1000),
      confirmButtonText: 'Snooze',
      showCloseButton: true,
      closeButtonAriaLabel: 'Dismiss',
      type: 'warning'

    }).then((result) => {
      if (result.value) {
        setTimeout(() => {
          this.reminderAlert(socketResponse)
        }, 5000)
      } else {
        Swal.fire({
          title: 'Dismissed!',
          text: 'You will not receive further alerts for this meeting',
          type: 'info',
          position: 'top-right'

        })
      }
    })
  }


}
