export interface Product {
    _id?: string;
    title: string;
    images: string[];
    category: string;
    price: number;
    brand: string;
    description: string;
    datePosted?: Date;
    lastUpdated?: Date;

}
