import Link from "next/link";

interface ToolBarLinkDynamicProps {
  text:string;
  link:string;
  icon:any;
}


export default function ToolBarLinkDynamic(props: ToolBarLinkDynamicProps) {

    const LinkIcon = props.icon;
    return <h6 className="h-6 flex flex-grow uppercase font-bold">        
        <Link href={props.link} className="flex flex-row gap-0.5 justify-center">
            <div className="">
                <LinkIcon className="hidden"/>
            </div>
            <div className="hidden sm:block">{props.text}</div>        
        </Link>
    </h6>
}