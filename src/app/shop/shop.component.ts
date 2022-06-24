import { RoleService } from 'src/app/_services/role.service';
import { AccountService } from './../_services/account.service';
import { ProductService } from './../_services/product.service';
import { environment } from './../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { BasketService } from '../_services/basket.service';
import { Product } from '../_models/product';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { User } from '../_models/user';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {

  throttle = 0;
  distance = 1;
  page:number = 1;
  showseller = false;
  Activeuser: User;
  noproduct:boolean = false;
  stopscroll  = false;
  baseUrl = environment.apiUrl;
  products=[];
  user= {
    id:-1,
    displayName: '',
    district: '',
    districtId: -1,
    email: '',
    phone: '',
    upazila: '',
    upazilaId: -1,
  };
  currentRoute: string;
  UserId: Number;
  params: any = {};

  

  constructor(private productService: ProductService,private toastr: ToastrService,
              private route: ActivatedRoute,public accountService: AccountService,
              private router: Router, private basketService: BasketService, private roleService: RoleService) { 
              this.products = null;
  }
  
  ngOnInit(): void {
    this.products = [];


    this.route.params.subscribe(params => {
       this.noproduct = false;
       this.stopscroll = false;
       window.scrollTo(0, 0);

       if (Object.keys(params).length === 0) {
         this.products = [];
         this.getProducts();
       }else{
         this.params = params;
         this.products = [];
         this.user = null;
         this.paramsproducts(this.params);
       }
       
     });

    const user: User = JSON.parse(localStorage.getItem('eidhatuser'));
    if(user){
      this.UserId = user.id;
      this.Activeuser = user;
    }
   
  }
  addItemToBasket(item: Product) {
          if(this.Activeuser){
            if (this.Activeuser.roles.includes('Admin') 
          || this.Activeuser.roles.includes('Seller') 
          || this.Activeuser.roles.includes('Moderator')){
            this.toastr.warning('You Can,t Add Product');
          }else{
            this.basketService.addItemToBasket(item);
          }
          }else{
            this.basketService.addItemToBasket(item);
          }
       
    // }
    // else{
    //}
  }
  isinBasket(id: number){
    if(this.basketService.getCurrentBasketValue()){
      if(this.basketService.getCurrentBasketValue().items.find(i => i.id == id)){
        return true;
      }else{
        return false; 
      }
    }
  }

  getProducts(){
    this.page = 1;
    this.products = [];
    this.stopscroll = false;
    this.productService.getProducts(this.page).subscribe( res =>{
      this.products = [];
      this.products = res;
   
      if(this.products.length === 0 || res.length < 10){
        this.noproduct = true;
        this.stopscroll = true;
      }else{
        this.noproduct = false;
        this.stopscroll = false;
      }
    }),
    error => {
    };
  }
  onScroll(): void {
    if(this.stopscroll == false){
    if(this.params.v){
      this.productService.getcateProducts(this.params.v,++this.page).subscribe( res =>{
            this.products.push(...res);
            if(res.length == 0 || res == null || res.length < 10){
             this.noproduct = true;
             this.stopscroll = true;
            }else{
              this.noproduct = false;
              this.stopscroll = false;
            }
      }),
      error => {
      };
    }else if(this.params.vv){
      this.productService.getsubcateProducts(this.params.vv,++this.page).subscribe( res =>{

            this.products.push(...res);
            if(res.length == 0 || res == null || res.length < 10){
             this.noproduct = true;
             this.stopscroll = true;
            }else{
              this.noproduct = false;
              this.stopscroll = false;
            }
      }),
      error => {
      };
    }
    else if(this.params.vvv){
      this.productService.getsubsubcateProducts(this.params.vvv,++this.page).subscribe( res =>{
            this.products.push(...res);
            if(res.length == 0 || res == null || res.length < 10){
             this.noproduct = true;
             this.stopscroll = true;
            }else{
              this.noproduct = false;
              this.stopscroll = false;
            }
      }),
      error => {
      };
    }
    else if(this.params.search){
          
    this.productService.searchProducts(this.params.search,++this.page).subscribe( res =>{

            this.products.push(...res);
            if(res.length == 0 || res == null || res.length < 10){
             this.noproduct = true;
             this.stopscroll = true;
            }else{
              this.noproduct = false;
              this.stopscroll = false;
            }    
    }),
    error => {
 
    };
    }else if(this.params.sellername){
          
    this.productService.getsellerProducts(this.params.id,++this.page).subscribe( res =>{
     
      this.products.push(...res);
      if(res.length == 0 || res == null || res.length < 10){
       this.noproduct = true;
       this.stopscroll = true;
      }else{
        this.noproduct = false;
        this.stopscroll = false;
      }
    }),
    error => {
     
    };
    }else{

    this.productService
      .getProducts(++this.page).subscribe( res => {

       this.products.push(...res);
       if(res.length === 0 || res.length < 10){
        this.noproduct = true;
        this.stopscroll = true;
      }else{
        this.noproduct = false;
        this.stopscroll = false;
      }
  
      });
    }
  }
  }
  paramsproducts(params){
    this.products = [];
    this.page = 1;
    this.noproduct = false;
    this.stopscroll = false;
    this.showseller = false;
  if(params.v){
    this.productService.getcateProducts(params.v,this.page).subscribe( res =>{
      this.products = res;
  
     if(this.products.length === 0 || res.length < 10){
      this.noproduct = true;
      this.stopscroll = true;
    }else{
      this.noproduct = false;
      this.stopscroll = false;
    }
    }),
    error => {
    
    };
  }
  if(params.vv){
    this.productService.getsubcateProducts(params.vv,this.page).subscribe( res =>{
      this.products = res;
  
     if(this.products.length === 0 || res.length < 10){
      this.noproduct = true;
      this.stopscroll = true;
    }else{
      this.noproduct = false;
      this.stopscroll = false;
    }
    }),
    error => {
    
    };
  }
  if(params.vvv){
    this.productService.getsubsubcateProducts(params.vvv,this.page).subscribe( res =>{
      this.products = res;
    
     if(this.products.length === 0 || res.length < 10){
      this.noproduct = true;
      this.stopscroll = true;
    }else{
      this.noproduct = false;
      this.stopscroll = false;
    }
    }),
    error => {
      
    };
  }
  if(params.search){
   
    this.productService.searchProducts(params.search,this.page).subscribe( res =>{
      this.products = res;
 
     if(this.products.length === 0 || res.length < 10){
      this.noproduct = true;
      this.stopscroll = true;
    }else{
      this.noproduct = false;
      this.stopscroll = false;
    }
    }),
    error => {
      
    };
  }
  if(params.id){
    this.user = null;
    this.showseller = true;
    
  
      this.roleService.getuserbyid(params.id).subscribe(res =>{
        this.user = res;
      });


    this.productService.getsellerProducts(params.id,this.page).subscribe( res =>{
      this.products = res;
     if(this.products.length === 0 || res.length < 10){
      this.noproduct = true;
      this.stopscroll = true;
    }else{
      this.noproduct = false;
      this.stopscroll = false;
    }
    }),
    error => {
   
    };
  }
   
  }


}
