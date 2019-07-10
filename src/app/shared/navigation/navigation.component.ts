import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import {CookieService} from 'ngx-cookie-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  @Input() fullName: any;
  @Input() dashboard: any;

  constructor(public router:Router,public api:ApiService,public cookie:CookieService) { }

  ngOnInit() {
  }

  public dashBoardView(){
    console.log("clicked");
    console.log(this.dashboard);
    if(this.dashboard === "admin")
    this.router.navigate(['/admin-dashboard'])
    else if(this.dashboard === "user")
    this.router.navigate(['/user-dashboard'])
  }

  public logout = ()=>{
    console.log('in logout')
    this.api.logout().subscribe((apiResponse:any)=>{
      console.log(apiResponse);
      if(apiResponse.status === 200){


        Swal.fire({
          toast:true,
          title: apiResponse.message,
          timer:3000,
          type: 'success',
          position :'top-right'
        })



      }else{
        Swal.fire({
          toast:true,
          title: apiResponse.message,
          text:'Login again!!',
          timer:3000,
          type: 'success',
          position :'top-right'
        })
      }

        this.cookie.deleteAll();
        this.router.navigate(['/login']);
    }),((err)=>{

      Swal.fire({
        toast:true,
        title: 'Some Error Occured',
        text:'Login again!!',
        timer:3000,
        type: 'success',
        position :'top-right'
      })

    })
  }
}
