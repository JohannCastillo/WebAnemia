/* eslint-disable tailwindcss/no-custom-classname */
import React from "react";

interface CardData{
    data: {
        title: String,
        description: String,
        image_url: String
    }
}

const CardDescription = (props: CardData) => {

    const style: React.CSSProperties = {
        backgroundImage: `url(/images/${props.data.image_url}.jpg`
    };

    return (
        <div className="relative grid h-[15rem] max-w-full flex-col items-end justify-center overflow-hidden rounded-xl bg-white bg-clip-border text-center text-gray-700">
            <div
                style={style}
                className="absolute inset-0 m-0 h-full w-full overflow-hidden rounded-none bg-transparent bg-cover bg-clip-border bg-center text-gray-700 shadow-none">
                <div className="to-bg-black-10 absolute inset-0 h-full w-full bg-gradient-to-t from-black/80 via-black/50"></div>
            </div>
            <div className="relative p-6 py-14 md:px-12">
                <h1 className="mb-6 block font-sans text-3xl font-medium leading-[1.5] tracking-normal text-white antialiased">
                {props.data.title}
                </h1>
                <p className="font-mono text-sm text-white">{props.data.description}</p>
            </div>
        </div>  
    );
};

export default CardDescription;
