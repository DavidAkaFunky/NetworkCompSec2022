import { Stock, StockTransaction, TransactionType } from "@prisma/client";
import { StockDatabase, UserDatabase } from "../database";
import StockData from "../models/stock";
import HttpException from '../models/httpException';

class StockService {

	private static priceRegex = /^[0-9]+[.,][0-9]{2}$/;
	private static volumeRegex = /^[0-9]+$/;

    public static getAllStocks = async (): Promise<Stock[]> => {
        const stocks = await StockDatabase.getAllStocks();
        return stocks;
    }

    public static getStockByISIN = async (ISIN: string): Promise<Stock | null> => {
        if (!ISIN) {
            throw new HttpException(400, "Invalid or missing ISIN. Please try again.");
        };
        const stock = await StockDatabase.getStockByISIN(ISIN);
        return stock;
    }

    public static createStock = async (stock: StockData): Promise<Stock | null> => {
        const name = stock.name?.trim();
        const ISIN = stock.ISIN?.trim();
        const exchange = stock.exchange?.trim();

        if (!name || !ISIN || !exchange || !stock.lastPrice || !stock.volume || !this.priceRegex.test(stock.lastPrice) || !this.volumeRegex.test(stock.volume)) {
            throw new HttpException(400, "Invalid or missing parameters. Please try again.");
        };

        const lastPrice = parseFloat(parseFloat(stock.lastPrice.replace(',', '.')).toFixed(2));
        const volume = parseInt(stock.volume);

        const createdStock = await StockDatabase.createStock(name, ISIN, exchange, lastPrice, volume);
        return createdStock;
    }

    public static buyStock = async (email: string, ISIN: string): Promise<void> => {
        if (!email || !ISIN) {
            throw new HttpException(400, "Invalid or missing parameters. Please try again.");
        };

        // Verify if user exists
        const user = await UserDatabase.getUser(email);
        if (!user) {
            throw new HttpException(500, "No user exists with this email.");
        }

        // Verify if stock exists
        const stock = await StockDatabase.getStockByISIN(ISIN);
        if (!stock) {
            throw new HttpException(500, "No stock exists with this ISIN.");
        }

        await StockDatabase.createStockTransaction(email, stock.id, stock.lastPrice, TransactionType.BUY);
    }

    public static sellStock = async (email: string, ISIN: string): Promise<void> => {
        if (!email || !ISIN) {
            throw new HttpException(400, "Invalid or missing parameters. Please try again.");
        };

        // Verify if user exists
        const user = await UserDatabase.getUser(email);
        if (!user) {
            throw new HttpException(500, "No user exists with this email.");
        }

        // Verify if stock exists
        const stock = await StockDatabase.getStockByISIN(ISIN);
        if (!stock) {
            throw new HttpException(500, "No stock exists with this ISIN.");
        }

        await StockDatabase.createStockTransaction(email, stock.id, stock.lastPrice, TransactionType.SELL);
    }

    public static getUserTransactions = async (email: string): Promise<StockTransaction[]> => {
        if (!email) {
            throw new HttpException(400, "Invalid or missing email. Please try again.");
        };

        // Verify if user exists
        const user = await UserDatabase.getUserAndTransactions(email);
        if (!user) {
            throw new HttpException(500, "No user exists with this email.");
        }
        return user.transactions;
    }
}

export default StockService;