import { useEffect } from "react"

export default function Image_test(props: {base_images: any, settings: {hover: boolean, model_show_case: boolean, detail_show_case: boolean }}){

    useEffect(() => {
        var images = props.base_images

        for(var foto of images){
            var split_foto = foto.image_url.split(".")[0]
            console.log("🚀 ~ useEffect ~ split_foto:", split_foto)
        }
    }, [])


    return(
        <>

        </>
    )
}