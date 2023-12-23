export default interface Collections {
    collections:       Collection[];
    collection_images: CollectionImage[];
}

export interface CollectionImage {
    image_url: string;
}

export interface Collection {
    id:        number;
    name:      string;
    image_url: string;
}
