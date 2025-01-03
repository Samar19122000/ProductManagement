export interface Product {
    id?:number;
    name?:string;
    description?:string;
    price?:number;
    createdDate?: Date;
}

export interface GetAllProductResponse{
    pageIndex : number;
    pageSize : number;
    count : number;
    data : Product [];
}