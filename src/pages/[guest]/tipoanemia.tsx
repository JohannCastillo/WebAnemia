
import FormAnemia from "@/components/tipoanemia/FormAnemia";
import CardDescription from "@/components/tipoanemia/CardDescription";
import {dataPagesDescriptions} from "@/constants/data-pages";


function Tipoanemia(){
    return <>
         <CardDescription data={dataPagesDescriptions.prediccion}/>

        <FormAnemia/>
    </>;
}

export default Tipoanemia;