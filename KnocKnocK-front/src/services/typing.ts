
export interface ORDERINFORMATION{
  email:string;
  phone:string;
  first_name:string | undefined;
  address:string;
  detail_address:string | undefined;
  city:string;
  country:string;
  region:string;
  zip:string;
  img_url:string;
  wallet:string;
}
export interface MAKEORDER{
  request_type:string;
  order_information:ORDERINFORMATION;
  img_url:string;
  wallet:string;
}
export interface CONFIRMORDER{
  confirm_information:{
    transaction:string;
    jwt:string;
    id:string;
  }
}