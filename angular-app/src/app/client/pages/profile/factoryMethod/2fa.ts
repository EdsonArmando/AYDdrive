export class twoFactorAutentication {
	private correo: any;
    private autenticacion: any;
    private telefono: any;

    constructor(){
        this.correo = '';
        this.autenticacion = false;
        this.telefono = 0;
    }

    setCorreo(correo: any){
        this.correo = correo;
    }

    getCorreo(){
        return this.correo;
    }

    setTelefono(telefono: any){
        this.telefono = telefono;
    }

    getTelefono(){
        return this.telefono;
    }

    setAutenticacion(autenticacion: any){
        this.autenticacion = autenticacion;
    }

    getAutenticacion(){
        return this.autenticacion;
    }
}

export class twoFAFactory {
    constructor(){}

    getDefaultTelefono(){
        return this.getTwoFactorAutentication('josecarlosalonz@gmail.com',0);
    }

    getDefaultCorreo(){
        return this.getTwoFactorAutentication('',59546172);
    }

    getTwoFactorAutentication(correo: any, telefono: any){
        let defaultTwo = new twoFactorAutentication();
        defaultTwo.setAutenticacion(false);
        defaultTwo.setCorreo(correo);
        defaultTwo.setTelefono(telefono);
        return defaultTwo;
    }
}
