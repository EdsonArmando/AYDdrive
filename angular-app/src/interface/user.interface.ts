export interface userInfo{
  id:string;
  nombre:string;
  usuario:string;
  correo:string;
  contra:string;
  fechaNac:string;
  autenticacion:boolean;
  telefono:number;
}

export interface Carpeta{
  id:string;
  nombre:string;
  propietario:string;
  fechaCreacion:string;
}

export interface Archivo{
  FECHA_CREACION: string
  ID_CARPETA: string
  NOMBRE: string
  URL: string
  id: string
}