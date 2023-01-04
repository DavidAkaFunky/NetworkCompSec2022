import {
	Button,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@mui/material";
import Title from "../components/Title";

type StockTableProps = {
    setISIN: React.Dispatch<React.SetStateAction<string>>,
    info: string,
    stocks: any[],
}

const StockTable = ({ setISIN, info, stocks }: StockTableProps) => {

    return (
        <Paper
            sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: 300,
                overflow: "hidden"
            }}
        >
            <Title>{info} Stocks</Title>
            <TableContainer sx={{
                maxHeight: 240,
            }}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>ISIN</TableCell>
                            <TableCell>Exchange</TableCell>
                            <TableCell>Last Price</TableCell>
                            {info === "Buy" && <TableCell>Volume</TableCell>}
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {stocks.map((stock) => (
                            <TableRow key={stock["id"]}>
                                <TableCell>{stock["name"]}</TableCell>
                                <TableCell>{stock["ISIN"]}</TableCell>
                                <TableCell>{stock["exchange"]}</TableCell>
                                <TableCell>{`${stock["lastPrice"]} €`}</TableCell>
                                {info === "Buy" && <TableCell>{stock["volume"]}</TableCell>}
                                <TableCell>
                                    <Button onClick={() => setISIN(stock["ISIN"])}>
                                        {info}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );

};

export default StockTable;