import { Component, OnInit,ChangeDetectionStrategy,
  ViewChild,
  TemplateRef, 
  ViewContainerRef} from '@angular/core';

import { ApiService } from 'src/app/api.service';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  public usersList   = [];
  constructor(public api: ApiService,public cookie:CookieService) { }
  public fullName;
  public admin = "admin";
  public pageNo = 1;
  public itemLimit = 4;
  public moreItems : Boolean;

  ngOnInit() {
    this.listusers();
    this.fullName = this.cookie.get('fullName') || localStorage.getItem('fullName')
  }

  public listusers = () =>{
    this.api.listUsers(this.pageNo,this.itemLimit).subscribe((apiResponse: any)=>{
      console.log(apiResponse);
      if(apiResponse.status === 200){
        if(apiResponse.data && apiResponse.data.length > 0){
        this.usersList = this.usersList.concat(apiResponse.data);
        this.pageNo += 1;
        if(apiResponse.data.length == this.itemLimit){
          this.moreItems = true;
        }else this.moreItems = false;
      }else{
        this.moreItems = false;
        Swal.fire({
          toast: true,
          type: 'info',
          title: 'No more Users',
          position: 'top-right'
        })
        
      }
    }else{
      Swal.fire({
          toast: true,
          type: 'error',
          title : 'Unable to fetch users',
          text: apiResponse.message,
          position: 'top-right'
      })
    }
      
    })
  
  }


  public listMoreUsers(){
    this.listusers()
    }

}
