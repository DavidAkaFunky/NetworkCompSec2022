import { Stock } from "@prisma/client";
import prisma from "../prisma/client";

class StockDatabase {

    public static createStock = async (): Promise<boolean> => {
        try {
            await prisma.stock.create({
                data: {
                    name: "",
                    ISIN: "",
                    exchange: "",
                    lastPrice: 0,
                    volume: 0,
                }
            });
            return true;

        } catch (err) {
            return false;
        }
    }

    public static getStockByISIN = async (ISIN: string): Promise<Stock | null> => {
        try {
            const stock = await prisma.stock.findUniqueOrThrow({
                where: {
                    ISIN: ISIN
                }
            });
            return stock;

        } catch (err) {
            return null;
        }
    }

    public static getAllStocks = async (): Promise<Stock[]> => {
        try {
            const stocks = await prisma.stock.findMany();
            return stocks;
        } catch (err) {
            return [];
        }
    }
}

export default StockDatabase;