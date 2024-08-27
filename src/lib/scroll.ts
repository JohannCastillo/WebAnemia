export function scrollIntoView(selector : string){
    const el = document.querySelector(selector);
    if(el){
        el.scrollIntoView({ behavior: "smooth" });
    }
}