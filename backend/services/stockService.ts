import { Stock, StockTransaction, TransactionType } from "@prisma/client";
import { StockDatabase, UserDatabase } from "../database";

class StockService {
    public static getAllStocks = async (): Promise<Stock[]> => {
        const stocks = await StockDatabase.getAllStocks();
        return stocks;
    }

    public static getStockByISIN = async (ISIN: string): Promise<Stock | null> => {
        const stock = await StockDatabase.getStockByISIN(ISIN);
        return stock;
    }

    public static createStock = async (stock: Stock): Promise<Stock | null> => {
        const name = stock.name?.trim();
        const ISIN = stock.ISIN?.trim();
        const exchange = stock.exchange?.trim();
        const lastPrice = stock.lastPrice;
        const volume = stock.volume;
        
        const createdStock = await StockDatabase.createStock(name, ISIN, exchange, lastPrice, volume);
        return createdStock;
    }

    public static buyStock = async (email: string, ISIN: string): Promise<StockTransaction | null> => {
        
        // Verify if user exists
        const user = await UserDatabase.getUserAndTransactions(email);
        if (!user) {
            return null;
        }
        // Verify if stock exists
        const stock = await StockDatabase.getStockByISIN(ISIN);
        if (!stock) {
            return null;
        }
        const stockTransaction = await StockDatabase.createStockTransaction(email, stock.id, stock.lastPrice, TransactionType.BUY);
        return stockTransaction;
    }

    public static sellStock = async (email: string, ISIN: string): Promise<StockTransaction | null> => {
        // Verify if user exists
        const user = await UserDatabase.getUserAndTransactions(email);
        if (!user) {
            return null;
        }
        // Verify if stock exists
        const stock = await StockDatabase.getStockByISIN(ISIN);
        if (!stock) {
            return null;
        }
        const stockTransaction = await StockDatabase.createStockTransaction(email, stock.id, stock.lastPrice, TransactionType.SELL);
        return stockTransaction;
    }

    public static getUserTransactions = async (email: string): Promise<StockTransaction[]> => {
        const user = await UserDatabase.getUserAndTransactions(email);
        if (!user) {
            return [];
        }
        return user.transactions;
    }
}

export default StockService;