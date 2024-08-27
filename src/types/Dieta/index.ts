import { Paciente } from "../Paciente";

export interface Dieta {
    id : number,
    paciente : Paciente
    dx_dieta : number,  
    created_at : string,
    updated_at : string,
    frec_verduras : number,
    frec_carnes_rojas : number,
    frec_aves : number,
    frec_huevos : number,
    frec_pescado : number,
    frec_leche : number,
    frec_menestra : number,
    frec_bocados_dulces : number,
    frec_bebidas_azucaradas : number,
    frec_embutidos : number,
    frec_fritura : number,
    frec_azucar : number,
    frec_desayuno : number,
    frec_almuerzo : number,
    frec_cena : number,
    frec_fruta : number,
}