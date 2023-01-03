import { Stock, StockTransaction, TransactionType } from "@prisma/client";
import { StockDatabase, UserDatabase } from "../database";
import StockData from "../models/stock";

class StockService {
    public static getAllStocks = async (): Promise<Stock[]> => {
        const stocks = await StockDatabase.getAllStocks();
        return stocks;
    }

    public static getStockByISIN = async (ISIN: string): Promise<Stock | null> => {
        const stock = await StockDatabase.getStockByISIN(ISIN);
        return stock;
    }

    public static createStock = async (stock: StockData): Promise<Stock | null> => {
        const name = stock.name?.trim();
        const ISIN = stock.ISIN?.trim();
        const exchange = stock.exchange?.trim();
        const lastPrice = parseFloat(stock.lastPrice.replace(',', '.'));
        const volume = parseInt(stock.volume);
        const createdStock = await StockDatabase.createStock(name, ISIN, exchange, lastPrice, volume);
        return createdStock;
    }

    public static buyStock = async (email: string, ISIN: string): Promise<void> => {
        
        // Verify if user exists
        const user = await UserDatabase.getUser(email);
        if (!user) {
            // THROW ERROR
            return;
        }
        // Verify if stock exists
        const stock = await StockDatabase.getStockByISIN(ISIN);
        if (!stock) {
            // THROW ERROR
            return;
        }
        await StockDatabase.createStockTransaction(email, stock.id, stock.lastPrice, TransactionType.BUY);
    }

    public static sellStock = async (email: string, ISIN: string): Promise<void> => {
        // Verify if user exists
        const user = await UserDatabase.getUser(email);
        if (!user) {
            // THROW ERROR
            return;
        }
        // Verify if stock exists
        const stock = await StockDatabase.getStockByISIN(ISIN);
        if (!stock) {
            // THROW ERROR
            return;
        }
        await StockDatabase.createStockTransaction(email, stock.id, stock.lastPrice, TransactionType.SELL);
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