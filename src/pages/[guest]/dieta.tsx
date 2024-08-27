import CardDescription from "@/components/dieta/CardDescription";
import {dataPagesDescriptions} from "@/constants/data-pages";
import FormDieta from "@/components/dieta/FormDieta";

function Dieta(){
    return <>
        <CardDescription data={dataPagesDescriptions.dieta}/>
        <FormDieta/>
    </>;
}

export default Dieta;