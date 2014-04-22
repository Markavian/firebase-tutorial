declare class Firebase
{    
    constructor(u:string);    
    set(s:string, callback:any): any;
	on(s:string, callback:any): any;
}