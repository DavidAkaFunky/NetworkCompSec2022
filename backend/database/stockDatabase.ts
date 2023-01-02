
import { Stock, StockTransaction, TransactionType } from "@prisma/client";
import prisma from "../prisma/client";

class StockDatabase {

    public static createStock = async (name: string, ISIN: string, exchange: string, lastPrice: number, volume: number): Promise<Stock | null> => {
        try {
            const createdStock = await prisma.stock.create({
                data: {
                    name: name,
                    ISIN: ISIN,
                    exchange: exchange,
                    lastPrice: lastPrice,
                    volume: volume,
                }
            });
            return createdStock;

        } catch (err) {
            return null;
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

    public static createStockTransaction = async (userId: number, stockId: number, price: number, type: TransactionType): Promise<StockTransaction | null> => {
        try {
            const stockTransaction = await prisma.stockTransaction.create({
                data: {
                    stockId: stockId,
                    userId: userId,
                    price: price,
                    type: type,
                }
            });
            return stockTransaction;
        } catch (err) {
            return null;
        }
    }

}

export default StockDatabase;