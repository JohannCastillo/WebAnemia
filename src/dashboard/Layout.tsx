
import React from "react";
import { TopBar } from "./TopBar";
import { Sidebar } from "./sidebar/Sidebar";
import { useDashboardContext } from "./Provider";
import Provider from "@/context/Provider";
interface ChildrenProps {
  children: React.ReactNode;
}

const style = {
  open: "lg:w-full",
  close: "lg:pl-4 lg:lg:w-[calc(100%-16rem)]",
  mainContainer: "flex flex-col w-full h-screen pl-0 lg:space-y-4",
  container: "bg-gray-100 h-screen overflow-hidden relative lg:p-4",
  main: "h-screen overflow-auto pb-36 pt-8 px-2 md:pb-8 md:pt-4 lg:pt-0",
};

const Content = (props: ChildrenProps) => {
  const { sidebarOpen } = useDashboardContext();
  return (
    <div className={style.container}>
      <div className="flex items-start">
        {/* <Overlay /> */}
        <Sidebar mobileOrientation="end" />
        <div
          className={`${style.mainContainer} 
             ${sidebarOpen ? style.open : style.close}`}
        >
          <TopBar />
          <main className={style.main}>{props.children}</main>;
        </div>
      </div>
    </div>
  );
};

export function DashboardLayout(props: ChildrenProps) {

  return (
      <Content>{props.children}</Content>
  );
}
