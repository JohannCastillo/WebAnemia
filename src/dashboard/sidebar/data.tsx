import { HomeIcon } from "./icons/HomeIcon";

import { ProjectIcon } from "./icons/ProjectIcon";
import { BsGraphUpArrow } from "react-icons/bs";

export const data = [
  {
    title: "Home",
    icon: <HomeIcon />,
    link: "/guest/dashboard",
  },
  {
    title: "Registrar paciente",
    icon: <ProjectIcon />,
    link: "/guest/register",
  },
  {
    title: "Predecir Anemia",
    icon: <ProjectIcon />,
    link: "/guest/tipoanemia",
  },
  {
    title: "Pronóstico de Prevalencia de Anemia",
    icon: <BsGraphUpArrow />,
    link: "/guest/pronostico",
  },
  {
    title: "Probabilidad en base a dieta",
    icon: <ProjectIcon />,
    link: "/guest/dieta",
  },
  {
    title: "Historial",
    icon: <ProjectIcon />,
    link: "/guest/historial",
  },
  {
    title: "Usuarios",
    icon: <ProjectIcon />,
    link: "/admin/reports",
  },
  {
    title: "Cerrar Sesion",
    icon: <ProjectIcon />,
    link: "/admin/settings",
  },
];
