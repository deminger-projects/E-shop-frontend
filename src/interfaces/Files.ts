export default interface Files{
    main: File|undefined
    hover?: File|undefined
    other: Array<File>
    model_show_case?: {status: boolean, data: Array<{file: File, url: string}>}   
    detail_show_case?: {status: boolean, data: Array<{file: File, url: string}>}   
}
