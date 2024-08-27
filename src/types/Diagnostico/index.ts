export enum AnemiaLevels {
    MODERADA = "Anemia Moderada",
    SEVERA = "Anemia Severa",
    LEVE = "Anemia Leve",
    NORMAL = "Normal",
}
export type DiagnosticResponse = {
    id: number;
    diagnostico: AnemiaLevels
}