export default interface Stock {
    name: string;
    ISIN: string;
    exchange: string;
    lastPrice: number;
    volume: number;
}