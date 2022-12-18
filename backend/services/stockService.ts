import { Stock } from "@prisma/client";
import { StockDatabase } from "../database";

class StockService {
    public static getAllStocks = async (): Promise<Stock[]> => {
        const stocks = await StockDatabase.getAllStocks();
        return stocks;
    }

    public static getStockByISIN = async (ISIN: string): Promise<Stock | null> => {
        try {
            const stock = await StockDatabase.getStockByISIN(ISIN);
            return stock;
        } catch (err: any) {
            return null;
        }
    }
}

export default StockService;